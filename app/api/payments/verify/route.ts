import { NextResponse } from 'next/server';
import { verifySignature, fulfillOrder, getPaymentConfig } from '@/lib/payment';
import { sqlClient, isDbConfigured } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature, provider, amountPaise } = body;

    if (!orderId || !gatewayPaymentId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters.' }, { status: 400 });
    }

    // PayU is confirmed only by PayU itself (payu-callback / payu-webhook), never by the browser.
    if (provider === 'PAYU') {
      return NextResponse.json({ error: 'PayU payments are confirmed by PayU directly.' }, { status: 400 });
    }

    // Sandbox / free path: only when no live gateway is configured, or the order is genuinely ₹0.
    if (provider === 'MANUAL_TEST' && !getPaymentConfig().isTestMode) {
      let total: number | null = null;
      if (isDbConfigured()) {
        const sql = sqlClient();
        const rows = await sql`SELECT total_paise FROM orders WHERE id = ${orderId} LIMIT 1`;
        total = rows[0] ? Number(rows[0].total_paise) : null;
      }
      if (total !== 0) {
        console.error('[Payment Verification Failed] MANUAL_TEST rejected on live gateway', orderId);
        return NextResponse.json({ error: 'Payment could not be verified.' }, { status: 400 });
      }
    }

    // 1. Verify official gateway signature
    const isValidSignature = verifySignature({
      provider: provider || 'RAZORPAY',
      gatewayOrderId,
      gatewayPaymentId,
      signature: gatewaySignature,
    });

    const isFreeOrder = provider === 'MANUAL_TEST' && Number(amountPaise) === 0;
    if (!isValidSignature && !isFreeOrder) {
      console.error('[Payment Verification Failed] Signature mismatch');
      return NextResponse.json({ error: 'Tampered payment signature detected.' }, { status: 400 });
    }

    // 2. Fulfill order idempotently in database
    const fulfillment = await fulfillOrder({
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      provider: provider || 'RAZORPAY',
      amountPaise: Number(amountPaise || 0),
      rawPayload: body,
    });

    if (!fulfillment.success) {
      return NextResponse.json(
        { error: fulfillment.error || 'Payment fulfillment error' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId,
      status: 'SUCCESS',
      message: 'Payment verified and worksheets unlocked!',
    });
  } catch (err: any) {
    console.error('[Payment Verify Exception]', err);
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 });
  }
}
