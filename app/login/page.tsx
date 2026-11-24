'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Network connection failed. Please check your internet.');
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '60px 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wrap wrap-narrow" style={{ maxWidth: '440px' }}>
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
              Login to Your Account
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Access your purchased worksheets, study materials & solutions
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: '12.5px', color: 'var(--maroon)', fontWeight: 600 }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '13px', fontSize: '15px', fontWeight: 700 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div
            style={{
              borderTop: '1px solid var(--line)',
              marginTop: '26px',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '12px' }}>
              Don&apos;t have an account yet?
            </p>
            <Link
              href="/register"
              className="btn btn-outline"
              style={{
                width: '100%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'var(--maroon)',
                borderColor: 'var(--maroon)',
                backgroundColor: 'rgba(128, 0, 32, 0.04)',
                gap: '6px',
              }}
            >
              Create an Account <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
