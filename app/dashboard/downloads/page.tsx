'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadsPage() {
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customer/entitlements')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setEntitlements(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
        setLoading(false);
      })
      .catch(() => {
        setEntitlements([]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="heading-serif" style={{ fontSize: '26px', margin: '0 0 6px' }}>
          My Downloadable Worksheets
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14.5px', margin: 0 }}>
          Your purchased and unlocked learning resources. Click download to obtain the crisp, high-resolution printable PDF.
        </p>
      </div>

      {loading && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
          Loading your library...
        </div>
      )}

      {!loading && entitlements.length === 0 && (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <FileText size={40} color="var(--muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: 'var(--maroon)', fontSize: '20px', margin: '0 0 8px' }}>
            No worksheets purchased yet
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '14.5px', maxWidth: '420px', margin: '0 auto 20px' }}>
            Explore our curriculum worksheets and boost your mathematics marks with structured step-by-step solutions.
          </p>
          <Link href="/worksheets" className="btn btn-primary btn-sm">
            Browse Worksheets Catalog
          </Link>
        </div>
      )}

      {!loading && entitlements.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {entitlements.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-maroon">Class {item.class_level || 'X'}</span>
                  <span className="badge badge-gold">{item.difficulty || 'Standard'}</span>
                  <span className="badge badge-green">Purchased & Verified</span>
                </div>
                <h3 style={{ fontSize: '17.5px', color: 'var(--maroon)', margin: '0 0 6px', fontWeight: 700 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', gap: '12px' }}>
                  <span>Chapter: {item.chapter}</span>
                  <span>•</span>
                  <span>{item.number_of_pages || 16} Printable A4 Pages</span>
                  <span>•</span>
                  <span>Downloaded {item.download_count || 0} times</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`/api/downloads/${item.id}`}
                  className="btn btn-gold btn-sm"
                  style={{ minWidth: '140px' }}
                >
                  <Download size={15} /> Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
