'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#651b32', '#c69a45', '#466b57', '#e7c47c'],
      });
    } catch {}

    if (orderId) {
      fetch(`/api/payments/status/${orderId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setOrder(data);
        })
        .catch(() => {});
    }
  }, [orderId]);

  return (
    <main style={{ padding: '80px 0 120px' }}>
      <div className="wrap wrap-narrow" style={{ maxWidth: '580px', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          className="card"
          style={{ padding: '48px 36px' }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: '#e8f5e9',
              color: 'var(--success)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <div className="eyebrow" style={{ color: 'var(--success)' }}>Payment Confirmed</div>
          <h1 className="heading-serif" style={{ fontSize: '30px', margin: '8px 0 12px' }}>
            Worksheets Successfully Unlocked!
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
            Thank you for purchasing with Ganit Adda. Your digital access has been granted and your files are ready for
            immediate download. An order confirmation receipt has also been sent to your email.
          </p>

          <div
            style={{
              background: 'var(--cream-soft)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '32px',
              textAlign: 'left',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Order Reference:</span>
              <strong>{order?.order_number || orderId || 'GA-202611-SUCCESS'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--muted)' }}>Fulfillment Status:</span>
              <strong style={{ color: 'var(--success)' }}>ACTIVE & DOWNLOAD READY</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Delivery Method:</span>
              <span>Direct Electronic PDF</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/dashboard/downloads" className="btn btn-gold btn-lg">
              <Download size={18} /> Access My Downloads Now
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-sm">
              Go to Student Dashboard
            </Link>
          </div>

          <div style={{ marginTop: '28px', borderTop: '1px solid var(--line)', paddingTop: '18px', fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--gold-dark)" />
            Lifetime access guaranteed with your registered account.
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="wrap wrap-narrow" style={{ padding: '80px 0', textAlign: 'center' }}>Loading payment details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

