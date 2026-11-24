'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Download,
  ShoppingBag,
  User,
  LogOut,
  HelpCircle,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          // In development or if not logged in, prompt or redirect
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Downloads', href: '/dashboard/downloads', icon: Download },
    { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'My Profile', href: '/dashboard/profile', icon: User },
    { label: 'Help & Support', href: '/contact', icon: HelpCircle },
  ];

  return (
    <div style={{ background: 'var(--cream)', minHeight: 'calc(100vh - 160px)', padding: '40px 0 80px' }}>
      <div className="wrap">
        <div className="dashboard-layout-grid">
          {/* Sidebar */}
          <aside className="card" style={{ padding: '24px 16px', position: 'sticky', top: '100px' }}>
            <div style={{ padding: '0 12px 18px', borderBottom: '1px solid var(--line)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--maroon)', fontWeight: 800, fontSize: '15px' }}>
                <GraduationCap size={20} color="var(--gold-dark)" /> Student Portal
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginTop: '4px' }}>
                {user?.full_name || 'Student Account'}
              </div>
              <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{user?.email || 'Active Member'}</small>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((it) => {
                const Icon = it.icon;
                const active = pathname === it.href;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 16px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: active ? 'var(--maroon)' : 'var(--ink-secondary)',
                      background: active ? 'var(--cream)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={17} color={active ? 'var(--maroon)' : 'var(--muted)'} />
                    <span>{it.label}</span>
                  </Link>
                );
              })}

              <div style={{ borderTop: '1px solid var(--line)', margin: '14px 0 8px' }} />

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'var(--danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={17} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
