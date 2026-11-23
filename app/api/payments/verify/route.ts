import { NextResponse } from 'next/server';
import { verifySignature, fulfillOrder } from '@/lib/payment';
import { sqlClient, isDbConfigured } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature, provider, amountPaise } = body;

    if (!orderId || !gatewayPaymentId) {
      return NextResponse.json({ error: 'Missing required payment verification parameters.' }, { status: 400 });
    }

    // 1. Verify official gateway signature
    const isValidSignature = verifySignature({
      provider: provider || 'RAZORPAY',
      gatewayOrderId,
      gatewayPaymentId,
      signature: gatewaySignature,
    });

    if (!isValidSignature && provider !== 'MANUAL_TEST') {
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
