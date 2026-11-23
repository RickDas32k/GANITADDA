'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageSquare, BookOpen, ShieldCheck, Download, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px' }}>
          {/* Brand Info */}
          <div>
            <div className="brand" style={{ color: '#fffdf8', marginBottom: '14px' }}>
              <span>GANIT</span> ADDA
            </div>
            <p style={{ color: '#dfceca', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '20px' }}>
              Maths Made Simple, One Step at a Time. Aligned with CBSE and NCERT curricula for Classes VI through XII.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <a href="tel:9874169625" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#dfb65f" /> +91 98741 69625
              </a>
              <a href="mailto:madeeasyganit@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#dfb65f" /> madeeasyganit@gmail.com
              </a>
              <a href="https://wa.me/919874169625" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#dfb65f" /> WhatsApp Support
              </a>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 style={{ color: '#f3d99f', fontSize: '16px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Curriculum & Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/worksheets">Chapter-wise Worksheets</Link></li>
              <li><Link href="/ncert-solutions">NCERT Step-by-Step Solutions</Link></li>
              <li><Link href="/study-materials">Revision Notes & Formulas</Link></li>
              <li><Link href="/mock-tests">CBSE Model Mock Tests</Link></li>
              <li><Link href="/worksheets?class=X">Class 10 Board Materials</Link></li>
              <li><Link href="/worksheets?class=XII">Class 12 Board & CUET Prep</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 style={{ color: '#f3d99f', fontSize: '16px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Ganit Adda
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/about">About Our Mission</Link></li>
              <li><Link href="/contact">Contact & Support</Link></li>
              <li><Link href="/login">Student Sign In</Link></li>
              <li><Link href="/register">Create Free Account</Link></li>
              <li><Link href="/dashboard">Student Dashboard</Link></li>
              <li><Link href="/admin">Educator / Admin Portal</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 style={{ color: '#f3d99f', fontSize: '16px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
              Trust & Policies
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy">Cancellation & Refund Policy</Link></li>
              <li><Link href="/shipping-and-delivery">Digital Delivery Terms</Link></li>
            </ul>
            <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '12.5px', color: '#ecd7d2' }}>
              <ShieldCheck size={16} color="#dfb65f" style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
              100% Secure Checkout via UPI, Debit/Credit Cards & Net Banking.
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} GANIT ADDA. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Digital Educational Platform</span>
            <span>•</span>
            <span>Instant Electronic Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
