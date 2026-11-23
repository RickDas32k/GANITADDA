import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

export async function POST(req: Request) {
  try {
    const { code, subtotalPaise } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please provide a coupon code.' }, { status: 400 });
    }

    const result = await validateCoupon(String(code), Number(subtotalPaise || 0));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: 'Unable to validate coupon.' }, { status: 500 });
  }
}
