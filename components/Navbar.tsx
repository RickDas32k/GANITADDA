'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ArrowRight,
  Phone,
  Tag,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion';
import { springSnappy, CouponCopyButton } from './animations/MotionWrappers';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Worksheets', href: '/worksheets' },
  { label: 'NCERT Solutions', href: '/ncert-solutions' },
  { label: 'Study Materials', href: '/study-materials' },
  { label: 'Mock Tests', href: '/mock-tests' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Apple "project" function: where a flick would come to rest (decelerationRate 0.998)
const project = (velocity: number, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
}

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ full_name: string; role: string } | null>(null);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Sheet drag value: 0 = fully open, sheet width = closed. Backdrop follows it 1:1.
  const x = useMotionValue(0);
  const backdropOpacity = useTransform(x, [0, 360], [1, 0]);

  const close = useCallback(() => setOpen(false), []);

  // Route change closes the sheet
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll-edge effect: hairline + shadow only once content is under the bar
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Auth state
  useEffect(() => {
    let alive = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (alive) setUser(data && data.user ? data.user : null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);

  // Body scroll lock, Escape to close, focus trap, focus return
  useEffect(() => {
    if (!open) return;
    x.set(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const returnTo = hamburgerRef.current;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    // Close if the viewport grows into the desktop layout
    const mq = window.matchMedia('(min-width: 1101px)');
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onMq);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      returnTo?.focus({ preventScroll: true });
    };
  }, [open, x]);

  const onDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const width = sheetRef.current?.offsetWidth ?? 360;
    // Decide from where the flick is *going*, not where the finger let go
    const projected = x.get() + project(info.velocity.x);
    if (projected > width * 0.5) {
      close();
    } else {
      animate(x, 0, { type: 'spring', duration: 0.35, bounce: 0.15, velocity: info.velocity.x });
    }
  };

  const sheetMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 } }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring' as const, duration: 0.42, bounce: 0 },
      };

  return (
    <>
      {/* Promo strip */}
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span className="topbar-desktop-text">
            🎉 <strong>FLAT 20% OFF</strong> on all CBSE &amp; NCERT Worksheets! Use Code:
          </span>
          <span className="topbar-mobile-text">
            🎉 <strong>20% OFF:</strong>
          </span>
          <CouponCopyButton code="WELCOME20" />
          <span className="topbar-desktop-note">• Classes VI–XII • Instant Printable PDF Downloads</span>
        </div>
      </div>

      {/* Sticky translucent header */}
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav-container">
          <Link href="/" className="brand" aria-label="Ganit Adda — Home">
            <span className="brand-word">
              <span className="brand-gold">GANIT</span> ADDA
            </span>
            <span className="brand-badge">CBSE/NCERT</span>
          </Link>

          <nav className="nav-links desktop-only" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : 'activeNavIndicator'}
                      className="nav-active-pill"
                      transition={springSnappy}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
            <Link
              href="/cart"
              className="cart-btn"
              aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag size={21} />
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

            <div className="desktop-only">
              {user ? (
                <Link href="/dashboard" className="btn btn-outline btn-sm">
                  <UserIcon size={16} /> My Account
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary btn-sm">
                  <UserIcon size={15} /> Login
                </Link>
              )}
            </div>

            <button
              ref={hamburgerRef}
              type="button"
              className="mobile-hamburger-btn mobile-only"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav-sheet"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet — a sibling of <header>, never a child: header's backdrop-filter
          would otherwise become the containing block for these fixed layers. */}
      <AnimatePresence>
        {open && (
          <>
            {/* Outer layer owns the enter/exit fade; inner layer is tied 1:1 to the drag */}
            <motion.div
              key="scrim"
              className="mnav-scrim-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              aria-hidden="true"
            >
              <motion.div className="mnav-scrim" style={{ opacity: reduce ? 1 : backdropOpacity }} />
            </motion.div>
            <motion.aside
              key="sheet"
              id="mobile-nav-sheet"
              ref={sheetRef}
              className="mnav-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              style={{ x: reduce ? 0 : x }}
              drag={reduce ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.04, right: 0.9 }}
              dragDirectionLock
              onDragEnd={onDragEnd}
              {...sheetMotion}
            >
              <div className="mnav-head">
                <span className="mnav-title">Menu</span>
                <button ref={closeRef} type="button" className="mobile-hamburger-btn" onClick={close} aria-label="Close navigation menu">
                  <X size={24} />
                </button>
              </div>

              <div className="mnav-body">
                <div className="mobile-drawer-promo">
                  <span className="mnav-promo-text">
                    <Tag size={15} /> 20% OFF with
                  </span>
                  <CouponCopyButton code="WELCOME20" />
                </div>

                <div className="mobile-drawer-label">Curriculum &amp; resources</div>
                <nav className="mobile-drawer-nav-group" aria-label="Mobile navigation">
                  {NAV_LINKS.map((link) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`mobile-drawer-link ${active ? 'active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span>{link.label}</span>
                        <ArrowRight size={16} />
                      </Link>
                    );
                  })}
                </nav>

                <div className="mnav-actions">
                  <Link href="/cart" className="btn btn-outline mnav-btn-split">
                    <span className="mnav-inline">
                      <ShoppingBag size={18} /> View cart
                    </span>
                    <span className="badge badge-gold">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </Link>

                  <Link href={user ? '/dashboard' : '/login'} className="btn btn-primary mnav-btn-full">
                    <UserIcon size={16} /> {user ? 'My account' : 'Login / Register'}
                  </Link>

                  <a href="https://wa.me/919874169625" target="_blank" rel="noreferrer" className="mnav-whatsapp">
                    <Phone size={14} /> WhatsApp support · +91 98741 69625
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
