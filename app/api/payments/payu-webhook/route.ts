import { NextResponse } from 'next/server';
import { handlePayuResponse } from '@/lib/payment';

// PayU server-to-server webhook (configure in PayU Dashboard → Settings → Webhooks).
// This is the safety net for customers who pay but close the tab before the redirect.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const type = req.headers.get('content-type') || '';
    const fields: Record<string, string> = {};

    if (type.includes('application/json')) {
      const body = await req.json();
      Object.entries(body || {}).forEach(([k, v]) => {
        if (v !== null && typeof v !== 'object') fields[k] = String(v);
      });
    } else {
      const form = await req.formData();
      form.forEach((v, k) => {
        if (typeof v === 'string') fields[k] = v;
      });
    }

    const r = await handlePayuResponse(fields, 'WEBHOOK');
    // Bad hash → 400 so forged calls are rejected; everything else → 200 so PayU stops retrying
    if (!r.ok && r.reason && /hash|configured|key/i.test(r.reason)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PayU webhook error]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
