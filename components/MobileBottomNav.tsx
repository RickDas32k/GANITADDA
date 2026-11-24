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
  const shouldReduceMotion = useReducedMotion();

  // If on admin portal, we don't show consumer bottom nav
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Worksheets', href: '/worksheets', icon: BookOpen },
    { label: 'NCERT', href: '/ncert-solutions', icon: GraduationCap },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: itemCount },
    { label: 'Account', href: '/dashboard', icon: User, match: ['/dashboard', '/login', '/register'] },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-inner">
        {items.map((it) => {
          const isActive = it.exact
            ? pathname === it.href
            : it.match
            ? it.match.some((p) => pathname.startsWith(p))
            : pathname.startsWith(it.href);

          const IconComponent = it.icon;

          return (
            <Link
              key={it.label}
              href={it.href}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
              aria-label={it.label}
            >
              {isActive && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : 'bottomNavActiveIndicator'}
                  className="mobile-bottom-active-indicator"
                  transition={springSnappy}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="mobile-bottom-icon-wrap"
              >
                <IconComponent size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                {it.badge && it.badge > 0 ? (
                  <AnimatePresence>
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
                  </AnimatePresence>
                ) : null}
              </motion.div>
              <span className="mobile-bottom-label">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
