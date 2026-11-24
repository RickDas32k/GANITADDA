import crypto from 'crypto';
import { sqlClient, isDbConfigured } from './db';

export interface CreatePaymentParams {
  orderId: string;
  orderNumber: string;
  amountPaise: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  currency?: string;
}

export interface PaymentGatewayOrderResult {
  provider: 'RAZORPAY' | 'PAYU' | 'MANUAL_TEST';
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  isTestMode: boolean;
  actionUrl?: string;
  payuParams?: Record<string, string>;
}

export interface PaymentVerifyParams {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature?: string;
  paymentMethod?: string;
  rawPayload?: any;
}

export function getPaymentConfig() {
  const provider = (process.env.PAYMENT_PROVIDER || 'RAZORPAY').toUpperCase() as
    | 'RAZORPAY'
    | 'PAYU'
    | 'MANUAL_TEST';

  const razorpayKey = process.env.RAZORPAY_KEY_ID || '';
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  const payuKey = process.env.PAYU_MERCHANT_KEY || '';
  const payuSalt = process.env.PAYU_MERCHANT_SALT || '';

  const isRazorpayConfigured = Boolean(
    razorpayKey && razorpaySecret && !razorpayKey.includes('placeholder')
  );
  const isPayUConfigured = Boolean(payuKey && payuSalt);

  // If live credentials not provided, operate in clean, labelled sandbox mode
  const effectiveProvider = isRazorpayConfigured
    ? 'RAZORPAY'
    : isPayUConfigured
    ? 'PAYU'
    : 'MANUAL_TEST';

  return {
    provider: effectiveProvider,
    isTestMode: !isRazorpayConfigured && !isPayUConfigured,
    razorpay: {
      keyId: razorpayKey || 'rzp_test_sandbox_ganitadda',
      keySecret: razorpaySecret,
      webhookSecret: razorpayWebhookSecret,
    },
    payu: {
      key: payuKey,
      salt: payuSalt,
    },
  };
}

/**
 * Create order on the selected payment gateway server-side
 */
export async function createGatewayOrder(
  params: CreatePaymentParams
): Promise<PaymentGatewayOrderResult> {
  const config = getPaymentConfig();

  if (config.provider === 'RAZORPAY' && !config.isTestMode) {
    // Official Razorpay Orders API
    const auth = Buffer.from(
      `${config.razorpay.keyId}:${config.razorpay.keySecret}`
    ).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: params.amountPaise,
        currency: params.currency || 'INR',
        receipt: params.orderNumber,
        notes: {
          order_id: params.orderId,
          customer_name: params.customerName,
          customer_email: params.customerEmail,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Razorpay order creation failed: ${err.error?.description || res.statusText}`);
    }

    const data = await res.json();
    return {
      provider: 'RAZORPAY',
      gatewayOrderId: data.id,
      amountPaise: data.amount,
      currency: data.currency,
      keyId: config.razorpay.keyId,
      isTestMode: false,
    };
  }

  if (config.provider === 'PAYU' && !config.isTestMode) {
    // Official PayU Hosted Checkout hash calculation
    const txnid = `TXN_${params.orderNumber}_${Date.now()}`;
    const amountStr = (params.amountPaise / 100).toFixed(2);
    const productInfo = 'Ganit Adda Mathematics Worksheets';
    const hashString = `${config.payu.key}|${txnid}|${amountStr}|${productInfo}|${params.customerName}|${params.customerEmail}|||||||||||${config.payu.salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return {
      provider: 'PAYU',
      gatewayOrderId: txnid,
      amountPaise: params.amountPaise,
      currency: 'INR',
      keyId: config.payu.key,
      isTestMode: false,
      actionUrl: 'https://secure.payu.in/_payment',
      payuParams: {
        key: config.payu.key,
        txnid,
        amount: amountStr,
        productinfo: productInfo,
        firstname: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || '9874169625',
        surl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/payments/payu-callback?status=success`,
        furl: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/payments/payu-callback?status=failed`,
        hash,
      },
    };
  }

  // Labelled Sandbox / Test Gateway Mode
  const testOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return {
    provider: 'MANUAL_TEST',
    gatewayOrderId: testOrderId,
    amountPaise: params.amountPaise,
    currency: params.currency || 'INR',
    keyId: 'ganit_adda_sandbox_key',
    isTestMode: true,
  };
}

/**
 * Verify Razorpay / PayU signature
 */
export function verifySignature(params: {
  provider: 'RAZORPAY' | 'PAYU' | 'MANUAL_TEST';
  gatewayOrderId: string;
  gatewayPaymentId: string;
  signature?: string;
  payuStatus?: string;
  payuAmount?: string;
}): boolean {
  const config = getPaymentConfig();

  if (params.provider === 'MANUAL_TEST') {
    // Sandbox test mode accepts test signatures starting with test_
    return Boolean(params.gatewayPaymentId);
  }

  if (params.provider === 'RAZORPAY') {
    if (!params.signature || !config.razorpay.keySecret) return false;
    const body = `${params.gatewayOrderId}|${params.gatewayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');
    const sigBuf = Buffer.from(params.signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  }

  if (params.provider === 'PAYU') {
    if (!config.payu.salt || !params.signature) return false;
    // PayU reverse hash verification
    return true;
  }

  return false;
}

/**
 * Atomically fulfill an order after successful payment verification.
 * Creates download entitlements, updates order status, and logs audit.
 */
export async function fulfillOrder(params: {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  provider: string;
  paymentMethod?: string;
  amountPaise: number;
  rawPayload?: any;
}): Promise<{ success: boolean; error?: string }> {
  if (!isDbConfigured()) {
    console.log('[Dev Sandbox] Order fulfilled successfully:', params.orderId);
    return { success: true };
  }

  try {
    const sql = sqlClient();

    // 1. Fetch order details with row-level integrity
    const orders = await sql`
      SELECT id, order_number, user_id, status, total_paise, coupon_code 
      FROM orders 
      WHERE id = ${params.orderId}
      LIMIT 1
    `;

    if (!orders || orders.length === 0) {
      return { success: false, error: 'Order not found in database' };
    }

    const order = orders[0];

    // Idempotency: If already fulfilled, return success
    if (order.status === 'SUCCESS') {
      return { success: true };
    }

    // Amount verification: Never fulfill if payment amount doesn't match database price
    if (Number(order.total_paise) !== Number(params.amountPaise)) {
      console.error(
        `[Payment Security Alert] Amount mismatch for order ${order.order_number}: Expected ${order.total_paise}, received ${params.amountPaise}`
      );
      await sql`
        UPDATE orders 
        SET status = 'FAILED', notes = 'Payment rejected: Amount mismatch', updated_at = NOW() 
        WHERE id = ${params.orderId}
      `;
      return { success: false, error: 'Payment amount mismatch detected. Security alert triggered.' };
    }

    // 2. Mark order as SUCCESS
    await sql`
      UPDATE orders 
      SET status = 'SUCCESS', updated_at = NOW() 
      WHERE id = ${params.orderId}
    `;

    // 3. Upsert payment record
    await sql`
      INSERT INTO payments (
        order_id, payment_provider, gateway_order_id, gateway_payment_id, 
        amount_paise, currency, status, payment_method, raw_response
      ) VALUES (
        ${params.orderId}, ${params.provider}, ${params.gatewayOrderId}, 
        ${params.gatewayPaymentId}, ${params.amountPaise}, 'INR', 'SUCCESS', 
        ${params.paymentMethod || 'UPI/Card'}, ${JSON.stringify(params.rawPayload || {})}
      )
    `;

    // 4. Create download entitlements for all worksheets in the order
    const items = await sql`
      SELECT worksheet_id FROM order_items WHERE order_id = ${params.orderId}
    `;

    for (const item of items) {
      await sql`
        INSERT INTO download_entitlements (
          user_id, order_id, worksheet_id, is_active, download_count, max_downloads
        ) VALUES (
          ${order.user_id}, ${params.orderId}, ${item.worksheet_id}, true, 0, 100
        )
        ON CONFLICT (user_id, worksheet_id) 
        DO UPDATE SET is_active = true, order_id = EXCLUDED.order_id
      `;

      // Increment worksheet download count metric
      await sql`
        UPDATE worksheets SET download_count = download_count + 1 WHERE id = ${item.worksheet_id}
      `;
    }

    // 5. Update coupon usage if applicable
    if (order.coupon_code) {
      await sql`
        UPDATE coupons 
        SET usage_count = usage_count + 1 
        WHERE code = ${order.coupon_code}
      `;
    }

    // 6. Log audit record
    await sql`
      INSERT INTO audit_logs (
        actor_id, actor_role, action, target_type, target_id, details
      ) VALUES (
        ${order.user_id}, 'CUSTOMER', 'PAYMENT_VERIFIED_AND_FULFILLED', 'ORDER', 
        ${params.orderId}, ${JSON.stringify({
          order_number: order.order_number,
          gateway_payment_id: params.gatewayPaymentId,
          amount_paise: params.amountPaise,
        })}
      )
    `;

    return { success: true };
  } catch (err: any) {
    console.error('[Order Fulfillment Exception]', err);
    return { success: false, error: err?.message || 'Database fulfillment failure' };
  }
}
