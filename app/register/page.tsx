'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '60px 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wrap wrap-narrow" style={{ maxWidth: '480px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{ padding: '36px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" className="brand" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span>GANIT</span> ADDA
            </Link>
            <h1 className="heading-serif" style={{ fontSize: '24px', margin: '6px 0 4px' }}>
              Create Student Account
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Join thousands of students mastering mathematics with confidence
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="full_name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Dhritiman Mitra"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
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
              <label className="form-label" htmlFor="mobile">
                WhatsApp Mobile Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="mobile"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="9874169625"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Create Password (Min. 8 characters) *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm_password">
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="confirm_password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: '100%', marginTop: '8px', padding: '13px' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '18px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            Already registered?{' '}
            <Link href="/login" style={{ color: 'var(--maroon)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
