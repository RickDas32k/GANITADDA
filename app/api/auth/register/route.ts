import { NextResponse } from 'next/server';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { hashPassword, createCustomerSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const mobile = String(body.mobile || '').trim();
    const password = String(body.password || '');
    const confirmPassword = String(body.confirm_password || '');

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid full name.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    if (!isDbConfigured()) {
      // In-memory / development fallback
      const mockUserId = `cust_${Date.now()}`;
      await createCustomerSession({ id: mockUserId, email, full_name: fullName });
      return NextResponse.json({ ok: true, user: { id: mockUserId, email, full_name: fullName, role: 'CUSTOMER' } });
    }

    const sql = sqlClient();

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    // Insert user
    const userRows = await sql`
      INSERT INTO users (email, password_hash, full_name, mobile, role, is_verified, is_active)
      VALUES (${email}, ${hashedPassword}, ${fullName}, ${mobile || null}, 'CUSTOMER', true, true)
      RETURNING id, email, full_name, role
    `;

    const newUser = userRows[0];

    // Create profile
    await sql`
      INSERT INTO user_profiles (user_id, class_level)
      VALUES (${newUser.id}, 'X')
      ON CONFLICT (user_id) DO NOTHING
    `;

    // Create session cookie
    await createCustomerSession({
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error('[Registration Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Unable to complete registration. Please try again.' },
      { status: 500 }
    );
  }
}
