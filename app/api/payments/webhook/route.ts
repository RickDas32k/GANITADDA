import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillOrder } from '@/lib/payment';
import { sqlClient, isDbConfigured } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        console.error('[Webhook Error] Invalid signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // Record webhook event in DB
    if (isDbConfigured()) {
      const sql = sqlClient();
      await sql`
        INSERT INTO payment_webhook_events (
          provider, event_id, event_type, payload, signature, is_processed
        ) VALUES (
          'RAZORPAY', ${event.id || `evt_${Date.now()}`}, ${event.event || 'payment.captured'}, 
          ${JSON.stringify(event)}, ${signature || null}, false
        )
      `;
    }

    // Process event
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      if (paymentEntity && orderEntity) {
        const orderId = orderEntity.notes?.order_id;
        if (orderId) {
          await fulfillOrder({
            orderId,
            gatewayOrderId: orderEntity.id,
            gatewayPaymentId: paymentEntity.id,
            provider: 'RAZORPAY',
            amountPaise: paymentEntity.amount,
            rawPayload: event,
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('[Webhook Processing Error]', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
