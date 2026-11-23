'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, User as UserIcon, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; role: string } | null>(null);

  useEffect(() => {
    // Check auth status
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Worksheets', href: '/worksheets' },
    { label: 'NCERT Solutions', href: '/ncert-solutions' },
    { label: 'Study Materials', href: '/study-materials' },
    { label: 'Mock Tests', href: '/mock-tests' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>CBSE & NCERT Mathematics • Classes VI–XII • Expert Worksheets & Step-by-Step Solutions</span>
        </div>
      </div>

      <header className="navbar">
        <div className="wrap nav-container">
          {/* Logo */}
          <Link href="/" className="brand">
            <span>GANIT</span> ADDA
            <span className="brand-badge">CBSE/NCERT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Cart & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="btn btn-ghost"
              style={{ position: 'relative', padding: '10px 14px' }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} color="#651b32" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '4px',
                      background: '#c69a45',
                      color: '#281b1f',
                      fontSize: '11px',
                      fontWeight: 800,
                      borderRadius: '999px',
                      minWidth: '19px',
                      height: '19px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User Account / Login Button */}
            {user ? (
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="btn btn-outline btn-sm"
              >
                {user.role === 'ADMIN' ? (
                  <>
                    <ShieldCheck size={16} /> Admin Portal
                  </>
                ) : (
                  <>
                    <UserIcon size={16} /> My Account
                  </>
                )}
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="btn btn-ghost"
              style={{ padding: '8px', display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#fffdf8',
                borderBottom: '1px solid var(--line)',
                overflow: 'hidden',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 0',
                      fontWeight: 600,
                      color: pathname === link.href ? 'var(--maroon)' : 'var(--ink)',
                      borderBottom: '1px solid #f4ede4',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    Cart ({itemCount})
                  </Link>
                  <Link
                    href={user ? '/dashboard' : '/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    {user ? 'My Dashboard' : 'Sign In'}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
