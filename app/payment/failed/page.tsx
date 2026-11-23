'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <main style={{ padding: '80px 0 120px' }}>
      <div className="wrap wrap-narrow" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px 36px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertTriangle size={36} />
          </div>

          <div className="eyebrow" style={{ color: 'var(--danger)' }}>Transaction Incomplete</div>
          <h1 className="heading-serif" style={{ fontSize: '28px', margin: '8px 0 12px' }}>
            Payment Could Not Be Verified
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
            The transaction was either cancelled or declined by your bank/UPI application. No funds were captured for
            this attempt. Your items remain saved in your cart.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/checkout" className="btn btn-primary btn-lg">
              <RotateCcw size={18} /> Retry Payment
            </Link>
            <Link href="/cart" className="btn btn-outline btn-sm">
              <ArrowLeft size={16} /> Return to Cart
            </Link>
          </div>

          <div style={{ marginTop: '32px', borderTop: '1px solid var(--line)', paddingTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            Need help? Call us at <strong>9874169625</strong> or WhatsApp support for assistance.
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="wrap wrap-narrow" style={{ padding: '80px 0', textAlign: 'center' }}>Loading payment status...</div>}>
      <FailedContent />
    </Suspense>
  );
}

