import { NextResponse } from 'next/server';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { getCurrentCustomer, getCurrentUser } from '@/lib/auth';
import { getWorksheets } from '@/lib/worksheets';
import { validateCoupon } from '@/lib/coupons';
import { createGatewayOrder } from '@/lib/payment';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { items, couponCode, guestInfo } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty. Please add worksheets.' }, { status: 400 });
    }

    // Determine customer info: User must be signed in or provide checkout info
    let customerId = user?.id;
    let customerName = user?.full_name || guestInfo?.name;
    let customerEmail = user?.email || guestInfo?.email;
    let customerPhone = guestInfo?.phone || '';

    if (!customerId) {
      if (!customerName || !customerEmail || !customerPhone) {
        return NextResponse.json(
          { error: 'Please sign in or provide your student details to proceed.' },
          { status: 401 }
        );
      }
      customerId = `guest_${Date.now()}`;
    }

    // Server-side price calculation (Never trust client-side prices)
    const catalog = await getWorksheets();
    const verifiedItems: Array<{ id: string; title: string; class_level: string; chapter: string; price_paise: number }> = [];
    let subtotalPaise = 0;

    for (const item of items) {
      const found = catalog.find((w) => w.id === item.id || w.slug === item.id);
      if (!found) continue;
      verifiedItems.push({
        id: found.id,
        title: found.title,
        class_level: found.class_level,
        chapter: found.chapter,
        price_paise: found.is_free ? 0 : found.price_paise,
      });
      subtotalPaise += found.is_free ? 0 : found.price_paise;
    }

    if (verifiedItems.length === 0) {
      return NextResponse.json({ error: 'None of the requested worksheets could be verified.' }, { status: 400 });
    }

    // Verify coupon server-side
    let discountPaise = 0;
    if (couponCode) {
      const couponCheck = await validateCoupon(couponCode, subtotalPaise, customerId);
      if (couponCheck.valid) {
        discountPaise = couponCheck.discountPaise;
      }
    }

    const totalPaise = Math.max(0, subtotalPaise - discountPaise);
    const orderNumber = `GA-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    let orderId = `ord_${Date.now()}`;

    // If database configured, persist order in database
    if (isDbConfigured()) {
      const sql = sqlClient();

      // Ensure customer exists in users table (or create if guest)
      if (customerId.startsWith('guest_')) {
        const existingUsers = await sql`SELECT id FROM users WHERE email = ${customerEmail} LIMIT 1`;
        if (existingUsers.length > 0) {
          customerId = existingUsers[0].id;
        } else {
          const newGuest = await sql`
            INSERT INTO users (email, password_hash, full_name, mobile, role, is_verified, is_active)
            VALUES (${customerEmail}, '$2b$12$placeholder_guest_hash', ${customerName}, ${customerPhone}, 'CUSTOMER', true, true)
            RETURNING id
          `;
          customerId = newGuest[0].id;
        }
      }

      const orderRows = await sql`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          status, subtotal_paise, discount_paise, total_paise, coupon_code
        ) VALUES (
          ${orderNumber}, ${customerId}, ${customerName}, ${customerEmail}, ${customerPhone},
          'PENDING', ${subtotalPaise}, ${discountPaise}, ${totalPaise}, ${couponCode || null}
        ) RETURNING id
      `;

      orderId = orderRows[0].id;

      // Insert order items
      for (const it of verifiedItems) {
        await sql`
          INSERT INTO order_items (
            order_id, worksheet_id, worksheet_title, worksheet_class, chapter, price_paise
          ) VALUES (
            ${orderId}, ${it.id}, ${it.title}, ${it.class_level}, ${it.chapter}, ${it.price_paise}
          )
        `;
      }
    }

    // Call payment gateway abstraction
    const gatewayResult = await createGatewayOrder({
      orderId,
      orderNumber,
      amountPaise: totalPaise,
      customerName,
      customerEmail,
      customerPhone,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      orderNumber,
      ...gatewayResult,
    });
  } catch (err: any) {
    console.error('[Create Order Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Could not initiate checkout order.' },
      { status: 500 }
    );
  }
}
