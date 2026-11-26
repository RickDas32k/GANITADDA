'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, BookOpen, GraduationCap, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springSnappy } from './animations/MotionWrappers';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const reduce = useReducedMotion();

  // Consumer-only chrome; the admin console has its own layout
  if (pathname.startsWith('/admin')) return null;

  const items = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Worksheets', href: '/worksheets', icon: BookOpen },
    { label: 'NCERT', href: '/ncert-solutions', icon: GraduationCap },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: itemCount, match: ['/cart', '/checkout'] },
    { label: 'Account', href: '/dashboard', icon: User, match: ['/dashboard', '/login', '/register'] },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
      <div className="mobile-bottom-nav-inner">
        {items.map((it) => {
          const active = it.exact
            ? pathname === it.href
            : (it.match ?? [it.href]).some((p) => pathname === p || pathname.startsWith(p + '/'));
          const Icon = it.icon;

          return (
            <Link
              key={it.label}
              href={it.href}
              className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.span
                  layoutId={reduce ? undefined : 'bottomNavActiveIndicator'}
                  className="mobile-bottom-active-indicator"
                  transition={springSnappy}
                />
              )}
              <span className="mobile-bottom-icon-wrap">
                <Icon size={21} strokeWidth={active ? 2.3 : 1.8} />
                <AnimatePresence>
                  {it.badge && it.badge > 0 ? (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={springSnappy}
                      className="mobile-bottom-badge"
                    >
                      {it.badge}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
              <span className="mobile-bottom-label">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
