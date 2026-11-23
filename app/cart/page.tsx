'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    clearCart,
    subtotalPaise,
    totalPaise,
    coupon,
    couponDiscountPaise,
    couponMessage,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  if (items.length === 0) {
    return (
      <main style={{ padding: '80px 0 120px' }}>
        <div className="wrap wrap-narrow" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--cream)',
              color: 'var(--maroon)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <h1 className="heading-serif" style={{ fontSize: '32px', margin: '0 0 12px' }}>
            Your Cart is Empty
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '480px', margin: '0 auto 28px' }}>
            Explore our curated collection of CBSE & NCERT mathematics worksheets, question banks, and worked solutions.
          </p>
          <Link href="/worksheets" className="btn btn-primary btn-lg">
            Browse Worksheets <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '48px 0 96px' }}>
      <div className="wrap">
        <div style={{ marginBottom: '32px' }}>
          <div className="eyebrow">Shopping Cart</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '6px 0 0' }}>
            Review Your Learning Materials ({items.length})
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.85fr)', gap: '40px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="card"
                    style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px' }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-maroon">Class {item.class_level}</span>
                        <span className="badge badge-gold">{item.difficulty}</span>
                      </div>
                      <h3 style={{ fontSize: '17px', color: 'var(--maroon)', margin: '0 0 4px', fontWeight: 700 }}>
                        <Link href={`/worksheets/${item.slug || item.id}`} style={{ color: 'inherit' }}>
                          {item.title}
                        </Link>
                      </h3>
                      <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                        {item.chapter} • {item.number_of_pages} Pages (Printable PDF)
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--maroon)' }}>
                        {item.price_paise === 0 ? 'FREE' : `₹${(item.price_paise / 100).toFixed(0)}`}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)', padding: '4px 8px', fontSize: '12.5px' }}
                        title="Remove item"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/worksheets" className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
                <ArrowLeft size={15} /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ color: 'var(--muted)' }}>
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Cart Summary & Coupon Box */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="heading-serif" style={{ fontSize: '22px', margin: '0 0 20px', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
                Order Summary
              </h2>

              {/* Coupon Code Section */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={15} color="var(--gold-dark)" /> Have a Discount Coupon?
                </label>

                {coupon ? (
                  <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(46,125,50,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--success)' }}>{coupon.code}</strong> Applied
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        You saved ₹{(couponDiscountPaise / 100).toFixed(0)}
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '4px' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Try WELCOME20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ margin: 0, textTransform: 'uppercase' }}
                    />
                    <button type="submit" disabled={applying || !couponInput.trim()} className="btn btn-primary btn-sm">
                      {applying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && (
                  <div style={{ color: 'var(--danger)', fontSize: '12.5px', marginTop: '6px' }}>
                    {couponError}
                  </div>
                )}
                {couponMessage && (
                  <div style={{ color: 'var(--success)', fontSize: '12.5px', marginTop: '6px' }}>
                    {couponMessage}
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-secondary)' }}>
                  <span>Subtotal ({items.length} items)</span>
                  <strong>₹{(subtotalPaise / 100).toFixed(0)}</strong>
                </div>

                {couponDiscountPaise > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Coupon Discount</span>
                    <strong>- ₹{(couponDiscountPaise / 100).toFixed(0)}</strong>
                  </div>
                )}

                <div style={{ borderTop: '2px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--maroon)' }}>
                    Final Total
                  </span>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--maroon)' }}>
                    ₹{(totalPaise / 100).toFixed(0)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="btn btn-gold btn-lg"
                style={{ width: '100%' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="var(--gold-dark)" />
                Secure checkout with instant digital delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
