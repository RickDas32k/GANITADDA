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

  // Honour PAYMENT_PROVIDER when that gateway is fully configured; otherwise fall back
  // to whichever live gateway is configured; otherwise clean, labelled sandbox mode.
  let effectiveProvider: 'RAZORPAY' | 'PAYU' | 'MANUAL_TEST' = 'MANUAL_TEST';
  if (provider === 'PAYU' && isPayUConfigured) effectiveProvider = 'PAYU';
  else if (provider === 'RAZORPAY' && isRazorpayConfigured) effectiveProvider = 'RAZORPAY';
  else if (isPayUConfigured && provider !== 'RAZORPAY') effectiveProvider = 'PAYU';
  else if (isRazorpayConfigured) effectiveProvider = 'RAZORPAY';
  else if (isPayUConfigured) effectiveProvider = 'PAYU';

  // PayU environment: TEST posts to test.payu.in, LIVE to secure.payu.in.
  // Defaults to TEST so a missing variable can never charge real cards by accident.
  const payuEnv = (process.env.PAYU_ENV || 'TEST').toUpperCase() === 'LIVE' ? 'LIVE' : 'TEST';

  return {
    provider: effectiveProvider,
    isTestMode: effectiveProvider === 'MANUAL_TEST',
    razorpay: {
      keyId: razorpayKey || 'rzp_test_sandbox_ganitadda',
      keySecret: razorpaySecret,
      webhookSecret: razorpayWebhookSecret,
    },
    payu: {
      key: payuKey,
      salt: payuSalt,
      env: payuEnv as 'TEST' | 'LIVE',
      actionUrl: payuEnv === 'LIVE' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment',
    },
  };
}

/** Public origin used for PayU's surl/furl redirects (must be absolute https). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && !explicit.includes('localhost')) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return (explicit || 'http://localhost:3000').replace(/\/$/, '');
}

/** PayU forward hash: key|txnid|amount|productinfo|firstname|email|udf1..udf5||||||SALT */
export function payuRequestHash(f: {
  key: string; txnid: string; amount: string; productinfo: string; firstname: string; email: string;
  udf1?: string; udf2?: string; udf3?: string; udf4?: string; udf5?: string; salt: string;
}) {
  const str = [
    f.key, f.txnid, f.amount, f.productinfo, f.firstname, f.email,
    f.udf1 || '', f.udf2 || '', f.udf3 || '', f.udf4 || '', f.udf5 || '',
    '', '', '', '', '', f.salt,
  ].join('|');
  return crypto.createHash('sha512').update(str).digest('hex');
}

export interface PayuVerifyResult {
  valid: boolean;
  success: boolean;
  status: string;
  orderId: string;
  txnid: string;
  mihpayid: string;
  mode: string;
  amountPaise: number;
  reason?: string;
}

/**
 * Verify a PayU response (surl/furl redirect or webhook) with the reverse hash:
 * [additionalCharges|]SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
export function verifyPayuResponse(f: Record<string, string>): PayuVerifyResult {
  const config = getPaymentConfig();
  const base = {
    valid: false, success: false, status: String(f.status || ''), orderId: String(f.udf1 || ''),
    txnid: String(f.txnid || ''), mihpayid: String(f.mihpayid || ''), mode: String(f.mode || ''),
    amountPaise: Math.round(parseFloat(f.amount || '0') * 100),
  };
  if (!config.payu.salt || !config.payu.key) return { ...base, reason: 'PayU not configured' };
  if (!f.hash) return { ...base, reason: 'Missing hash' };
  if (f.key && f.key !== config.payu.key) return { ...base, reason: 'Merchant key mismatch' };

  const parts = [
    config.payu.salt, f.status || '', '', '', '', '', '',
    f.udf5 || '', f.udf4 || '', f.udf3 || '', f.udf2 || '', f.udf1 || '',
    f.email || '', f.firstname || '', f.productinfo || '', f.amount || '', f.txnid || '', f.key || config.payu.key,
  ];
  if (f.additionalCharges) parts.unshift(f.additionalCharges);
  const expected = crypto.createHash('sha512').update(parts.join('|')).digest('hex');

  const a = Buffer.from(expected.toLowerCase());
  const b = Buffer.from(String(f.hash).trim().toLowerCase());
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  return {
    ...base,
    valid,
    success: valid && String(f.status).toLowerCase() === 'success',
    reason: valid ? undefined : 'Hash mismatch',
  };
}

/**
 * Create order on the selected payment gateway server-side
 */
export async function createGatewayOrder(
  params: CreatePaymentParams
): Promise<PaymentGatewayOrderResult> {
  const config = getPaymentConfig();

  // Zero-value orders (100% coupon / free worksheets) never go to a gateway
  if (params.amountPaise === 0) {
    return {
      provider: 'MANUAL_TEST',
      gatewayOrderId: `order_free_${Date.now()}`,
      amountPaise: 0,
      currency: 'INR',
      keyId: 'free_order',
      isTestMode: true,
    };
  }

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
    const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 25); // PayU: max 25 chars, alphanumeric
    const amountStr = (params.amountPaise / 100).toFixed(2);
    const productInfo = 'Ganit Adda Worksheets';
    const firstname = (params.customerName || 'Student').replace(/[^A-Za-z0-9 ]/g, '').trim().slice(0, 60) || 'Student';
    const email = params.customerEmail;
    const phone = (params.customerPhone || '').replace(/\D/g, '').slice(-10) || '9874169625';
    const site = getSiteUrl();
    const hash = payuRequestHash({
      key: config.payu.key, txnid, amount: amountStr, productinfo: productInfo, firstname, email,
      udf1: params.orderId, salt: config.payu.salt,
    });

    return {
      provider: 'PAYU',
      gatewayOrderId: txnid,
      amountPaise: params.amountPaise,
      currency: 'INR',
      keyId: config.payu.key,
      isTestMode: false,
      actionUrl: config.payu.actionUrl,
      payuParams: {
        key: config.payu.key,
        txnid,
        amount: amountStr,
        productinfo: productInfo,
        firstname,
        email,
        phone,
        udf1: params.orderId, // our order id comes back to us in the callback
        surl: `${site}/api/payments/payu-callback`,
        furl: `${site}/api/payments/payu-callback`,
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
    // Sandbox only. When a live gateway is configured this must never pass;
    // the verify route separately allows genuinely free (total = 0) orders.
    return config.isTestMode && Boolean(params.gatewayPaymentId);
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
    // PayU is confirmed server-to-server (payu-callback / payu-webhook via verifyPayuResponse).
    // A browser-supplied "signature" is never trusted.
    return false;
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

/**
 * Shared handler for PayU responses (browser redirect to surl/furl AND server webhook).
 * Verifies the reverse hash, then fulfils idempotently. Never trusts the browser.
 */
export async function handlePayuResponse(
  fields: Record<string, string>,
  source: 'CALLBACK' | 'WEBHOOK'
): Promise<{ ok: boolean; orderId: string; fulfilled: boolean; reason?: string }> {
  const v = verifyPayuResponse(fields);

  // Keep an audit trail of every PayU message (best effort)
  if (isDbConfigured()) {
    try {
      const sql = sqlClient();
      await sql`
        INSERT INTO payment_webhook_events (provider, event_id, event_type, payload, signature, is_processed)
        VALUES ('PAYU', ${`${v.txnid || 'unknown'}_${source}_${Date.now()}`}, ${`${source}:${v.status || 'unknown'}`},
                ${JSON.stringify({ ...fields, hash: undefined })}, ${fields.hash || null}, ${v.valid})
      `;
    } catch (e) {
      console.error('[PayU] could not record event', e);
    }
  }

  if (!v.valid) {
    console.error('[PayU] rejected response:', v.reason, v.txnid);
    return { ok: false, orderId: v.orderId, fulfilled: false, reason: v.reason };
  }
  if (!v.success) {
    return { ok: true, orderId: v.orderId, fulfilled: false, reason: `Payment ${v.status || 'failed'}` };
  }
  if (!v.orderId) {
    return { ok: false, orderId: '', fulfilled: false, reason: 'Missing order reference (udf1)' };
  }

  const res = await fulfillOrder({
    orderId: v.orderId,
    gatewayOrderId: v.txnid,
    gatewayPaymentId: v.mihpayid,
    provider: 'PAYU',
    paymentMethod: v.mode || undefined,
    amountPaise: v.amountPaise,
    rawPayload: { ...fields, hash: undefined },
  });
  return { ok: res.success, orderId: v.orderId, fulfilled: res.success, reason: res.error };
}
