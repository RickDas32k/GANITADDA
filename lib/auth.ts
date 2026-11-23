import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const ADMIN_COOKIE = 'ga_admin_session';
const CUSTOMER_COOKIE = 'ga_customer_session';

function getSessionSecret() {
  const value = process.env.SESSION_SECRET || 'ganit-adda-default-super-secret-key-32-chars-long';
  return new TextEncoder().encode(value);
}

// Password hashing
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 12);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

// -------------------------------------------------------------
// Admin Session Management
// -------------------------------------------------------------
export async function createAdminSession(email?: string) {
  const secret = getSessionSecret();
  const token = await new SignJWT({
    role: 'ADMIN',
    email: email || process.env.ADMIN_EMAIL || 'admin@ganitadda.in',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, getSessionSecret());
    return payload.role === 'ADMIN' || payload.role === 'admin';
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Customer Session Management
// -------------------------------------------------------------
export interface CustomerTokenPayload {
  id: string;
  email: string;
  full_name: string;
  role: 'CUSTOMER';
}

export async function createCustomerSession(customer: { id: string; email: string; full_name: string }) {
  const secret = getSessionSecret();
  const token = await new SignJWT({
    id: customer.id,
    email: customer.email,
    full_name: customer.full_name,
    role: 'CUSTOMER',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);

  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function clearCustomerSession() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
}

export async function getCurrentCustomer(): Promise<CustomerTokenPayload | null> {
  try {
    const jar = await cookies();
    const token = jar.get(CUSTOMER_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (payload && payload.id && payload.email) {
      return {
        id: String(payload.id),
        email: String(payload.email),
        full_name: String(payload.full_name || ''),
        role: 'CUSTOMER',
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Universal Auth State
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'CUSTOMER';
} | null> {
  const adminOk = await isAdmin();
  if (adminOk) {
    return {
      id: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@ganitadda.in',
      full_name: 'Administrator',
      role: 'ADMIN',
    };
  }

  const customer = await getCurrentCustomer();
  if (customer) {
    return customer;
  }

  return null;
}
