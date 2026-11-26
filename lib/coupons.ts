import { sqlClient, isDbConfigured } from './db';
import { Coupon } from './types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coupon-welcome20',
    code: 'WELCOME20',
    description: 'Special 20% discount on mathematics worksheets',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_paise: 9900, // ₹99
    max_discount_paise: 10000, // ₹100 max
    usage_limit: 1000,
    usage_count: 45,
    per_user_limit: 1,
    valid_from: new Date('2026-01-01').toISOString(),
    valid_until: new Date('2027-12-31').toISOString(),
    is_active: true,
  },
  {
    id: 'coupon-ganit50',
    code: 'GANIT50',
    description: 'Flat ₹50 off on orders above ₹199',
    discount_type: 'fixed',
    discount_value: 5000, // ₹50
    min_order_paise: 19900,
    usage_limit: 500,
    usage_count: 28,
    per_user_limit: 1,
    valid_from: new Date('2026-01-01').toISOString(),
    valid_until: new Date('2027-12-31').toISOString(),
    is_active: true,
  },
  {
    id: 'coupon-board10',
    code: 'BOARD10',
    description: '10% off all board-exam materials',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_paise: 0,
    usage_limit: 1000,
    usage_count: 0,
    per_user_limit: 1,
    valid_from: new Date('2026-01-01').toISOString(),
    valid_until: new Date('2027-12-31').toISOString(),
    is_active: true,
  },
  {
    id: 'coupon-topper',
    code: 'TOPPER',
    description: 'Flat ₹30 off',
    discount_type: 'fixed',
    discount_value: 3000, // ₹30
    min_order_paise: 0,
    usage_limit: 1000,
    usage_count: 0,
    per_user_limit: 1,
    valid_from: new Date('2026-01-01').toISOString(),
    valid_until: new Date('2027-12-31').toISOString(),
    is_active: true,
  },
];

export async function validateCoupon(
  code: string,
  subtotalPaise: number,
  userId?: string
): Promise<{ valid: boolean; discountPaise: number; message: string; coupon?: Coupon }> {
  const cleanCode = code.trim().toUpperCase();

  let coupon: Coupon | undefined;

  if (isDbConfigured()) {
    try {
      const sql = sqlClient();
      const rows = (await sql`
        SELECT * FROM coupons 
        WHERE UPPER(code) = ${cleanCode} AND is_active = true 
        LIMIT 1
      `) as Coupon[];
      coupon = rows[0];
    } catch {
      coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.is_active);
    }
  } else {
    coupon = INITIAL_COUPONS.find((c) => c.code === cleanCode && c.is_active);
  }

  if (!coupon) {
    return { valid: false, discountPaise: 0, message: 'Invalid or expired coupon code.' };
  }

  // Check validity dates
  if (new Date() < new Date(coupon.valid_from) || new Date() > new Date(coupon.valid_until)) {
    return { valid: false, discountPaise: 0, message: 'This coupon has expired.' };
  }

  // Check usage limit
  if (coupon.usage_count >= coupon.usage_limit) {
    return { valid: false, discountPaise: 0, message: 'Coupon usage limit has been reached.' };
  }

  // Check minimum order value
  if (subtotalPaise < coupon.min_order_paise) {
    const minRs = (coupon.min_order_paise / 100).toFixed(0);
    return {
      valid: false,
      discountPaise: 0,
      message: `Minimum order amount of ₹${minRs} is required for this coupon.`,
    };
  }

  // Calculate discount
  let discountPaise = 0;
  if (coupon.discount_type === 'percentage') {
    discountPaise = Math.round((subtotalPaise * Number(coupon.discount_value)) / 100);
    if (coupon.max_discount_paise && discountPaise > coupon.max_discount_paise) {
      discountPaise = coupon.max_discount_paise;
    }
  } else {
    discountPaise = Math.round(Number(coupon.discount_value));
  }

  discountPaise = Math.min(discountPaise, subtotalPaise);

  return {
    valid: true,
    discountPaise,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${(discountPaise / 100).toFixed(0)}.`,
    coupon,
  };
}
