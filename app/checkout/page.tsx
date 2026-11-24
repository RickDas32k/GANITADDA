'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPaise, totalPaise, coupon, couponDiscountPaise, clearCart } = useCart();

  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
          setName(data.user.full_name || '');
          setEmail(data.user.email || '');
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <main style={{ padding: '80px 0 120px' }}>
        <div className="wrap wrap-narrow" style={{ textAlign: 'center' }}>
          <h2 className="heading-serif" style={{ fontSize: '28px', margin: '0 0 12px' }}>
            No items in checkout
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            Please select worksheets from our catalog before checking out.
          </p>
          <Link href="/worksheets" className="btn btn-primary">
            Explore Worksheets
          </Link>
        </div>
      </main>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Please accept the digital delivery terms to complete checkout.');
      return;
    }
    if (!name || !email || !phone) {
      setError('Please provide student name, email, and mobile number for invoice delivery.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ id: it.id })),
          couponCode: coupon?.code,
          guestInfo: { name, email, phone },
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        setError(orderData.error || 'Failed to initiate order.');
        setProcessing(false);
        return;
      }

      // 2. Handle Payment Verification
      // If Sandbox/Test Mode or free order:
      if (orderData.isTestMode || orderData.amountPaise === 0) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            gatewayOrderId: orderData.gatewayOrderId,
            gatewayPaymentId: `pay_test_${Date.now()}`,
            gatewaySignature: 'test_signature_valid',
            provider: orderData.provider,
            amountPaise: orderData.amountPaise,
            paymentMethod,
          }),
        });

        if (verifyRes.ok) {
          clearCart();
          router.push(`/payment/success?orderId=${orderData.orderId}`);
          return;
        }
      }

      // If live Razorpay checkout:
      if (orderData.provider === 'RAZORPAY' && typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: 'INR',
          name: 'GANIT ADDA',
          description: `Order #${orderData.orderNumber}`,
          order_id: orderData.gatewayOrderId,
          prefill: { name, email, contact: phone },
          handler: async function (response: any) {
            const vRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                gatewayOrderId: response.razorpay_order_id,
                gatewayPaymentId: response.razorpay_payment_id,
                gatewaySignature: response.razorpay_signature,
                provider: 'RAZORPAY',
                amountPaise: orderData.amountPaise,
              }),
            });
            if (vRes.ok) {
              clearCart();
              router.push(`/payment/success?orderId=${orderData.orderId}`);
            } else {
              router.push(`/payment/failed?orderId=${orderData.orderId}`);
            }
          },
        });
        rzp.open();
        return;
      }

      // Fallback redirect to success in simulated environment
      clearCart();
      router.push(`/payment/success?orderId=${orderData.orderId}`);
    } catch (err: any) {
      console.error('Checkout error', err);
      setError('Payment gateway error. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <main style={{ padding: '48px 0 96px' }}>
      <div className="wrap">
        <div style={{ marginBottom: '32px' }}>
          <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600, marginBottom: '12px' }}>
            <ArrowLeft size={16} /> Return to Cart
          </Link>
          <div className="eyebrow">Secure Checkout</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '4px 0 0' }}>
            Complete Your Purchase
          </h1>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '16px 20px', borderRadius: 'var(--radius-sm)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCheckout}>
          <div className="checkout-grid">
            {/* Left: Customer Info & Payment Modes */}
            <div>
              {/* Customer Information Card */}
              <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className="heading-serif" style={{ fontSize: '20px', margin: 0 }}>
                    1. Student & Contact Information
                  </h2>
                  {!user && (
                    <Link href="/login" style={{ fontSize: '13px', color: 'var(--maroon)', fontWeight: 700 }}>
                      Already have an account? Sign In
                    </Link>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Student Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="name"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email for Invoice & PDFs *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        style={{ paddingLeft: '40px' }}
                        placeholder="student@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      WhatsApp Mobile Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="phone"
                        type="tel"
                        className="form-input"
                        style={{ paddingLeft: '40px' }}
                        placeholder="9874169625"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="card" style={{ padding: '32px' }}>
                <h2 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>
                  2. Select Payment Method
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'upi' ? '2px solid var(--maroon)' : '1px solid var(--line)',
                      background: paymentMethod === 'upi' ? 'var(--cream)' : 'var(--paper)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <Smartphone size={22} color="var(--maroon)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>UPI (Instant Zero-Fee)</strong>
                      <small style={{ color: 'var(--muted)' }}>Google Pay, PhonePe, Paytm, BHIM, QR Scan</small>
                    </div>
                    <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Recommended</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'card' ? '2px solid var(--maroon)' : '1px solid var(--line)',
                      background: paymentMethod === 'card' ? 'var(--cream)' : 'var(--paper)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <CreditCard size={22} color="var(--maroon)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>Debit & Credit Cards</strong>
                      <small style={{ color: 'var(--muted)' }}>Visa, MasterCard, RuPay (All Indian Banks)</small>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'netbanking' ? '2px solid var(--maroon)' : '1px solid var(--line)',
                      background: paymentMethod === 'netbanking' ? 'var(--cream)' : 'var(--paper)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                    />
                    <Building size={22} color="var(--maroon)" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '15px' }}>Net Banking</strong>
                      <small style={{ color: 'var(--muted)' }}>SBI, HDFC, ICICI, Axis, PNB and 50+ Banks</small>
                    </div>
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    style={{ marginTop: '4px' }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                    I agree to the <Link href="/terms-and-conditions" target="_blank" style={{ color: 'var(--maroon)', textDecoration: 'underline' }}>Terms & Conditions</Link> and understand that worksheets are delivered instantly in digital PDF format.
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sticky Card */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-md)' }}>
                <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                  Items in Order ({items.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                  {items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', gap: '8px' }}>
                      <span style={{ color: 'var(--ink)' }}>
                        {it.title} <small style={{ color: 'var(--muted)' }}>(Cl. {it.class_level})</small>
                      </span>
                      <strong>₹{((it.price_paise || 0) / 100).toFixed(0)}</strong>
                    </div>
                  ))}
                </div>

                {coupon && (
                  <div style={{ background: 'var(--success-bg)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                      <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} /> Coupon: {coupon.code}
                    </span>
                    <strong style={{ color: 'var(--success)' }}>- ₹{(couponDiscountPaise / 100).toFixed(0)}</strong>
                  </div>
                )}

                <div style={{ borderTop: '2px solid var(--line)', paddingTop: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--maroon)' }}>
                      Total Payable
                    </span>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--maroon)' }}>
                      ₹{(totalPaise / 100).toFixed(0)}
                    </span>
                  </div>
                  <small style={{ color: 'var(--muted)', display: 'block', marginTop: '4px' }}>
                    All inclusive of curriculum access & lifetime downloads
                  </small>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="btn btn-gold btn-lg"
                  style={{ width: '100%', padding: '16px' }}
                >
                  <Lock size={18} /> {processing ? 'Connecting Gateway...' : `Pay ₹${(totalPaise / 100).toFixed(0)} & Unlock`}
                </motion.button>

                <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '12.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--gold-dark)" />
                  RBI-Compliant 256-Bit Encrypted Payment
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
