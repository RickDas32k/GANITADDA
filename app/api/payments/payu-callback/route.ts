import { NextResponse } from 'next/server';
import { handlePayuResponse, getSiteUrl } from '@/lib/payment';

// PayU redirects the customer's browser here (surl and furl) with a form POST.
export const dynamic = 'force-dynamic';

function go(path: string) {
  // 303 turns PayU's POST into a normal GET on our result page
  return NextResponse.redirect(new URL(path, getSiteUrl()), 303);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fields: Record<string, string> = {};
    form.forEach((v, k) => {
      if (typeof v === 'string') fields[k] = v;
    });

    const r = await handlePayuResponse(fields, 'CALLBACK');
    if (r.fulfilled) return go(`/payment/success?orderId=${encodeURIComponent(r.orderId)}`);

    const reason = r.ok ? 'declined' : 'verification';
    return go(`/payment/failed?orderId=${encodeURIComponent(r.orderId || '')}&reason=${reason}`);
  } catch (err) {
    console.error('[PayU callback error]', err);
    return go('/payment/failed?reason=error');
  }
}

// Someone opening the URL directly
export async function GET() {
  return go('/cart');
}
