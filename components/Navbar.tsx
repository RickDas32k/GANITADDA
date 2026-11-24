'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileText,
  Sparkles,
  Phone,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springSmooth, springSnappy, easeOutUI, CouponCopyButton } from './animations/MotionWrappers';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; role: string } | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      {/* Top Promotional Announcement Strip */}
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-desktop-text">
            🎉 <strong>FLAT 20% OFF</strong> on all CBSE & NCERT Worksheets! Use Code:
          </span>
          <span className="topbar-mobile-text">
            🎉 <strong>20% OFF:</strong>
          </span>
          <CouponCopyButton code="WELCOME20" />
          <span className="topbar-desktop-note">
            • Classes VI–XII • Instant Printable PDF Downloads
          </span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="navbar">
        <div className="wrap nav-container">
          {/* Brand Logo */}
          <Link href="/" className="brand" aria-label="Ganit Adda Home">
            <span>GANIT</span> ADDA
            <span className="brand-badge">CBSE/NCERT</span>
          </Link>

          {/* Desktop Navigation Links (Hidden on mobile via CSS) */}
          <nav className="nav-links desktop-only" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId={shouldReduceMotion ? undefined : 'activeNavIndicator'}
                      className="nav-active-pill"
                      transition={springSnappy}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart & Auth & Mobile Toggle */}
          <div className="nav-actions">
            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="btn btn-ghost cart-btn"
              aria-label={`Shopping Cart with ${itemCount} items`}
            >
              <ShoppingBag size={21} color="var(--maroon)" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={springSnappy}
                    className="cart-badge"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User Account / Login Button (Desktop) */}
            <div className="desktop-only">
              {user ? (
                <Link
                  href="/dashboard"
                  className="btn btn-outline btn-sm"
                >
                  <UserIcon size={16} /> My Account
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <UserIcon size={15} /> Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button (Visible on mobile, hidden on desktop) */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="mobile-hamburger-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={26} color="var(--maroon)" /> : <Menu size={26} color="var(--maroon)" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer / Sheet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mobile-menu-backdrop"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Drawer Container */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.26, ease: easeOutUI }}
                className="mobile-menu-drawer"
              >
                {/* Promo Code Box in Drawer */}
                <div className="mobile-drawer-promo">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} color="var(--gold-dark)" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--maroon)' }}>
                      FLAT 20% OFF: Use code <strong>WELCOME20</strong>
                    </span>
                  </div>
                  <CouponCopyButton code="WELCOME20" />
                </div>

                {/* Primary Content Links */}
                <div className="mobile-drawer-nav-group">
                  <div className="mobile-drawer-label">Curriculum & Resources</div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-drawer-link ${pathname === link.href ? 'active' : ''}`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={16} color="var(--muted-light)" />
                    </Link>
                  ))}
                </div>

                {/* Account & Cart Quick Actions */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'space-between', padding: '12px 18px' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShoppingBag size={18} /> View Cart
                    </span>
                    <span className="badge badge-gold">{itemCount} items</span>
                  </Link>

                  {user ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <UserIcon size={16} /> My Account
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <UserIcon size={16} /> Login
                    </Link>
                  )}

                  {/* Direct WhatsApp Callout */}
                  <a
                    href="https://wa.me/919874169625"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}
                  >
                    <Phone size={14} color="var(--gold-dark)" /> Need WhatsApp support? +91 98741 69625
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
