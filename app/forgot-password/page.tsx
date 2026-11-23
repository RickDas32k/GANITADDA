'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main style={{ padding: '60px 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wrap wrap-narrow" style={{ maxWidth: '440px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '36px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link href="/" className="brand" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span>GANIT</span> ADDA
            </Link>
            <h1 className="heading-serif" style={{ fontSize: '24px', margin: '6px 0 4px' }}>
              Reset Password
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Enter your registered email to receive password reset instructions
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', background: 'var(--success-bg)', padding: '24px', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: 'var(--success)', margin: '0 0 6px', fontSize: '18px' }}>Reset Link Sent</h3>
              <p style={{ fontSize: '14px', color: 'var(--ink)', margin: 0 }}>
                If an account exists for <strong>{email}</strong>, you will receive an email with reset instructions shortly.
              </p>
              <Link href="/login" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px', padding: '13px' }}
              >
                {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}

          <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '16px', textAlign: 'center' }}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
