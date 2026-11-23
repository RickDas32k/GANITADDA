'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'ord_sample_1',
      order_number: 'GA-202611-4821',
      created_at: new Date('2026-02-14').toISOString(),
      items: [
        { title: 'Quadratic Equations Mastery Question Bank', class_level: 'X', price_paise: 9900 },
        { title: 'Class 10 CBSE Maths Complete Formula Handbook', class_level: 'X', price_paise: 0 },
      ],
      total_paise: 9900,
      payment_method: 'UPI (PhonePe)',
      status: 'SUCCESS',
    },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="heading-serif" style={{ fontSize: '26px', margin: '0 0 6px' }}>
          My Purchase History
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14.5px', margin: 0 }}>
          View all verified transactions and download official receipts for your records.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((order) => (
          <div key={order.id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Order Number
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--maroon)' }}>
                  #{order.order_number}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Date
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Paid
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--maroon)' }}>
                  ₹{(order.total_paise / 100).toFixed(0)}
                </div>
              </div>

              <span className="badge badge-green">
                <CheckCircle2 size={13} style={{ marginRight: '4px' }} /> {order.status}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px' }}>
                Purchased Worksheets:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                {order.items.map((it: any, i: number) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>• {it.title} (Class {it.class_level})</span>
                    <strong>{it.price_paise === 0 ? 'FREE' : `₹${(it.price_paise / 100).toFixed(0)}`}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '14px', fontSize: '13px', color: 'var(--muted)' }}>
              <span>Method: {order.payment_method}</span>
              <Link href="/dashboard/downloads" className="btn btn-primary btn-sm">
                View Downloads &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
