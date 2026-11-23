import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { unauthorized } from '@/lib/http';
import { INITIAL_COUPONS } from '@/lib/coupons';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  if (!isDbConfigured()) {
    return NextResponse.json(INITIAL_COUPONS);
  }

  try {
    const sql = sqlClient();
    const rows = await sql`SELECT * FROM coupons ORDER BY created_at DESC`;
    return NextResponse.json(rows.length > 0 ? rows : INITIAL_COUPONS);
  } catch (err: any) {
    return NextResponse.json(INITIAL_COUPONS);
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await req.json();
    const code = String(body.code || '').trim().toUpperCase();
    const description = String(body.description || '').trim();
    const discountType = body.discount_type === 'fixed' ? 'fixed' : 'percentage';
    const discountValue = Number(body.discount_value || 0);
    const minOrderPaise = Math.round(Number(body.min_order_rupees || 0) * 100);

    if (!code || code.length < 3) {
      return NextResponse.json({ error: 'Valid coupon code is required (min. 3 characters).' }, { status: 400 });
    }
    if (discountValue <= 0) {
      return NextResponse.json({ error: 'Discount value must be greater than zero.' }, { status: 400 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({
        id: `coupon_${Date.now()}`,
        code,
        description,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_paise: minOrderPaise,
        usage_count: 0,
        usage_limit: 1000,
        is_active: true,
      }, { status: 201 });
    }

    const sql = sqlClient();
    const rows = await sql`
      INSERT INTO coupons (
        code, description, discount_type, discount_value, min_order_paise, usage_limit, usage_count, is_active
      ) VALUES (
        ${code}, ${description}, ${discountType}, ${discountValue}, ${minOrderPaise}, 1000, 0, true
      ) RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create coupon' }, { status: 500 });
  }
}
