'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Download,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    totalOrders: 1,
    entitledWorksheets: 2,
    totalSpentPaise: 17800,
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
          color: '#fffdf8',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="eyebrow" style={{ color: '#dfb65f' }}>Personal Learning Hub</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '8px 0 10px' }}>
          Welcome back to Ganit Adda
        </h1>
        <p style={{ color: '#ecd7d2', fontSize: '15px', maxWidth: '600px', margin: '0 0 20px', lineHeight: 1.6 }}>
          All your purchased CBSE mathematics materials, answer keys, and worked solutions are safely stored here for
          instant download anytime.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/dashboard/downloads" className="btn btn-gold btn-sm">
            <Download size={15} /> Access My Downloads
          </Link>
          <Link href="/worksheets" className="btn btn-outline-gold btn-sm">
            Browse New Worksheets
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Unlocked Materials
            </span>
            <Download size={18} color="var(--maroon)" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)' }}>
            {stats.entitledWorksheets}
          </div>
          <small style={{ color: 'var(--success)', fontWeight: 600 }}>Lifetime Download Access</small>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Completed Orders
            </span>
            <ShoppingBag size={18} color="var(--gold-dark)" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)' }}>
            {stats.totalOrders}
          </div>
          <small style={{ color: 'var(--muted)' }}>Verified Payments</small>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Total Learning Investment
            </span>
            <Sparkles size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)' }}>
            ₹{(stats.totalSpentPaise / 100).toFixed(0)}
          </div>
          <small style={{ color: 'var(--muted)' }}>Saved ₹120 with Coupons</small>
        </div>
      </div>

      {/* Quick Downloads Preview */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="heading-serif" style={{ fontSize: '20px', margin: 0 }}>
            Recent Materials Ready for Download
          </h2>
          <Link href="/dashboard/downloads" style={{ fontSize: '13.5px', color: 'var(--maroon)', fontWeight: 700 }}>
            View All ({stats.entitledWorksheets}) &rarr;
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--cream-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-maroon" style={{ fontSize: '11px' }}>Class X</span>
                <span className="badge badge-gold" style={{ fontSize: '11px' }}>Medium</span>
              </div>
              <h4 style={{ margin: '0 0 2px', fontSize: '15.5px', color: 'var(--maroon)' }}>
                Quadratic Equations Mastery Question Bank & Step-by-Step Solutions
              </h4>
              <small style={{ color: 'var(--muted)' }}>45 Questions • 18 Printable Pages • Full Worked Answers</small>
            </div>
            <a
              href="/api/downloads/ws-cbse-10-quad"
              className="btn btn-primary btn-sm"
              style={{ minWidth: '120px' }}
            >
              <Download size={14} /> Download PDF
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--cream-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-maroon" style={{ fontSize: '11px' }}>Class X</span>
                <span className="badge badge-green" style={{ fontSize: '11px' }}>Free Resource</span>
              </div>
              <h4 style={{ margin: '0 0 2px', fontSize: '15.5px', color: 'var(--maroon)' }}>
                Class 10 CBSE Maths Complete Formula Handbook (All 14 Chapters)
              </h4>
              <small style={{ color: 'var(--muted)' }}>8 Pages • Quick Morning Exam Revision Cheat Sheet</small>
            </div>
            <a
              href="/api/downloads/ws-cbse-10-free-formulas"
              className="btn btn-primary btn-sm"
              style={{ minWidth: '120px' }}
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
