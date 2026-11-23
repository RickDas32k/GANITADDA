'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Eye,
  LogOut,
  Upload,
} from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'overview' | 'worksheets' | 'orders' | 'coupons' | 'enquiries' | 'settings';

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [logged, setLogged] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Data states
  const [analytics, setAnalytics] = useState<any>({
    totalRevenuePaise: 2489000,
    monthlyRevenuePaise: 845000,
    totalCustomers: 142,
    totalWorksheets: 10,
    totalOrders: 68,
    successfulPayments: 65,
    pendingPayments: 2,
    failedPayments: 1,
  });

  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  // Worksheet form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('X');
  const [newChapter, setNewChapter] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newType, setNewType] = useState('worksheet');
  const [newPriceRupees, setNewPriceRupees] = useState(99);
  const [newDesc, setNewDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // New Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponType, setNewCouponType] = useState('percentage');

  // Verify auth on mount
  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      const res = await fetch('/api/admin/worksheets');
      if (res.ok) {
        setLogged(true);
        loadAllData();
      } else {
        setLogged(false);
      }
    } catch {
      setLogged(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function loadAllData() {
    try {
      const [wsRes, ordRes, cpnRes, enqRes, anaRes] = await Promise.all([
        fetch('/api/admin/worksheets'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/coupons'),
        fetch('/api/admin/enquiries'),
        fetch('/api/admin/analytics'),
      ]);

      if (wsRes.ok) setWorksheets(await wsRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (cpnRes.ok) setCoupons(await cpnRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (anaRes.ok) setAnalytics(await anaRes.json());
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      setBusy(false);

      if (!res.ok) {
        setLoginError(data.error || 'Invalid administrator credentials');
        return;
      }

      setLogged(true);
      await loadAllData();
    } catch {
      setBusy(false);
      setLoginError('Authentication network failure');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setLogged(false);
    router.push('/login');
  }

  async function handleCreateWorksheet(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const form = new FormData();
    form.append('title', newTitle);
    form.append('class_level', newClass);
    form.append('chapter', newChapter);
    form.append('topic', newTopic);
    form.append('difficulty', newDifficulty);
    form.append('material_type', newType);
    form.append('price_rupees', String(newPriceRupees));
    form.append('description', newDesc);
    if (uploadFile) {
      form.append('file', uploadFile);
    }

    try {
      const res = await fetch('/api/admin/worksheets', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle('');
        setNewChapter('');
        setNewDesc('');
        setUploadFile(null);
        await loadAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed due to network error');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteWorksheet(id: string) {
    if (!confirm('Are you sure you want to delete this worksheet?')) return;
    const res = await fetch('/api/admin/worksheets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setWorksheets(worksheets.filter((w) => w.id !== id));
    }
  }

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCouponCode.trim().toUpperCase(),
        discount_type: newCouponType,
        discount_value: newCouponDiscount,
        min_order_rupees: 99,
      }),
    });

    if (res.ok) {
      setNewCouponCode('');
      await loadAllData();
    }
  }

  async function handleUpdateEnquiryStatus(id: string, status: string) {
    await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setEnquiries(enquiries.map((enq) => (enq.id === id ? { ...enq, status } : enq)));
  }

  if (checkingAuth) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--muted)' }}>
        Verifying administrative authorization...
      </div>
    );
  }

  // If not logged in, render the secure Admin Sign-in card
  if (!logged) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ maxWidth: '440px', width: '100%', padding: '36px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="brand" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span>GANIT</span> ADDA
            </div>
            <h1 className="heading-serif" style={{ fontSize: '22px', margin: '4px 0' }}>
              Administrator Portal
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
              Authorized personnel only. All access attempts are logged.
            </p>
          </div>

          {loginError && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13.5px', marginBottom: '18px' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="adminEmail">Admin Email</label>
              <input
                id="adminEmail"
                type="email"
                className="form-input"
                placeholder="admin@ganitadda.in"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="adminPass">Password</label>
              <input
                id="adminPass"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={busy} className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
              {busy ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--maroon)' }}>&larr; Return to Public Website</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Logged-in Complete Admin Portal
  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
          <div className="brand" style={{ color: '#fffdf8', fontSize: '22px' }}>
            <span>GANIT</span> ADDA
          </div>
          <small style={{ color: '#dfb65f', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>
            Enterprise Admin Console
          </small>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <LayoutDashboard size={18} /> Overview & Analytics
          </button>

          <button
            onClick={() => setActiveTab('worksheets')}
            className={`admin-nav-item ${activeTab === 'worksheets' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <FileText size={18} /> Manage Worksheets ({worksheets.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <ShoppingBag size={18} /> Orders & Payments ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Tag size={18} /> Coupons & Discounts
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <MessageSquare size={18} /> Student Enquiries ({enquiries.filter((e) => e.status === 'new').length} New)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Settings size={18} /> Platform Settings
          </button>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ffcdd2',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              padding: '8px',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="admin-main">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="heading-serif" style={{ fontSize: '28px', margin: 0 }}>
              {activeTab === 'overview' && 'Dashboard Overview & Revenue'}
              {activeTab === 'worksheets' && 'Worksheets & Digital Curriculum'}
              {activeTab === 'orders' && 'Customer Orders & Transactions'}
              {activeTab === 'coupons' && 'Coupons & Promotional Offers'}
              {activeTab === 'enquiries' && 'Student Leads & Inquiries'}
              {activeTab === 'settings' && 'Platform & Payment Settings'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {activeTab === 'worksheets' && (
              <button onClick={() => setShowAddModal(true)} className="btn btn-gold btn-sm">
                <Plus size={16} /> Upload New Worksheet
              </button>
            )}
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              <Eye size={15} /> View Public Website
            </Link>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Platform Revenue <DollarSign size={18} color="var(--maroon)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  ₹{(analytics.totalRevenuePaise / 100).toLocaleString('en-IN')}
                </div>
                <small style={{ color: 'var(--success)', fontWeight: 600 }}>Verified captured revenue</small>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Orders <ShoppingBag size={18} color="var(--gold-dark)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {analytics.totalOrders}
                </div>
                <small style={{ color: 'var(--muted)' }}>{analytics.successfulPayments} successful</small>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Published Worksheets <FileText size={18} color="var(--success)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {worksheets.length}
                </div>
                <small style={{ color: 'var(--muted)' }}>Classes VI to XII</small>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Enquiries Received <MessageSquare size={18} color="var(--info)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {enquiries.length}
                </div>
                <small style={{ color: 'var(--info)', fontWeight: 600 }}>{enquiries.filter((e) => e.status === 'new').length} require follow-up</small>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="heading-serif" style={{ fontSize: '20px', margin: 0 }}>Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="btn btn-ghost btn-sm">
                  View All Orders &rarr;
                </button>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td><strong>#{o.order_number}</strong></td>
                        <td>{o.customer_name} ({o.customer_phone || o.customer_email})</td>
                        <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                        <td><strong>₹{(o.total_paise / 100).toFixed(0)}</strong></td>
                        <td>{o.payment_method || 'UPI'}</td>
                        <td><span className="badge badge-green">{o.status}</span></td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>No orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE WORKSHEETS */}
        {activeTab === 'worksheets' && (
          <div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Class</th>
                      <th>Chapter</th>
                      <th>Difficulty</th>
                      <th>Price</th>
                      <th>Downloads</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worksheets.map((w) => (
                      <tr key={w.id}>
                        <td>
                          <strong>{w.title}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{w.material_type || 'worksheet'}</div>
                        </td>
                        <td><span className="badge badge-maroon">Class {w.class_level}</span></td>
                        <td>{w.chapter}</td>
                        <td><span className="badge badge-gold">{w.difficulty || 'Medium'}</span></td>
                        <td><strong>{w.price_paise === 0 ? 'FREE' : `₹${(w.price_paise / 100).toFixed(0)}`}</strong></td>
                        <td>{w.download_count || 0}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Link href={`/worksheets/${w.slug || w.id}`} target="_blank" className="btn btn-ghost btn-sm" title="Preview">
                              <Eye size={15} />
                            </Link>
                            <button onClick={() => handleDeleteWorksheet(w.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & PAYMENTS */}
        {activeTab === 'orders' && (
          <div className="card" style={{ padding: '24px' }}>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Customer Name</th>
                    <th>Contact Phone</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>#{o.order_number}</strong></td>
                      <td>{o.customer_name}</td>
                      <td>{o.customer_phone || o.customer_email}</td>
                      <td>{new Date(o.created_at).toLocaleString('en-IN')}</td>
                      <td><strong>₹{(o.total_paise / 100).toFixed(0)}</strong></td>
                      <td>{o.payment_method || 'UPI/Card'}</td>
                      <td><span className="badge badge-green">{o.status}</span></td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)' }}>No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div>
            <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>Create New Coupon</h3>
              <form onSubmit={handleCreateCoupon} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label">Coupon Code</label>
                  <input
                    className="form-input"
                    placeholder="e.g. EXAM30"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Discount Type</label>
                  <select className="form-select" value={newCouponType} onChange={(e) => setNewCouponType(e.target.value)}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Rupees (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Discount Value</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Discount</th>
                      <th>Min Order</th>
                      <th>Times Used</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.code}</strong></td>
                        <td>{c.description || 'Promotional coupon'}</td>
                        <td>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${(c.discount_value / 100).toFixed(0)}`}</td>
                        <td>₹{(c.min_order_paise / 100).toFixed(0)}</td>
                        <td>{c.usage_count || 0}</td>
                        <td><span className="badge badge-green">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STUDENT ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="card" style={{ padding: '24px' }}>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>WhatsApp Phone</th>
                    <th>Class</th>
                    <th>Message / Need</th>
                    <th>Received At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td><strong>{enq.student_name}</strong></td>
                      <td>
                        <a href={`https://wa.me/91${enq.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--maroon)', fontWeight: 700 }}>
                          {enq.phone}
                        </a>
                      </td>
                      <td><span className="badge badge-maroon">Class {enq.class_level}</span></td>
                      <td style={{ maxWidth: '300px' }}>{enq.message || 'Free demo session requested'}</td>
                      <td>{new Date(enq.created_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <span className={`badge ${enq.status === 'new' ? 'badge-gold' : enq.status === 'contacted' ? 'badge-blue' : 'badge-green'}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)' }}>No enquiries submitted yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>Payment Gateway Configuration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div>
                  <strong>Selected Provider:</strong> <span className="badge badge-green">Razorpay / PayU Multi-provider</span>
                </div>
                <div>
                  <strong>Supported Payment Modes:</strong> UPI (GPay, PhonePe, Paytm), RuPay, Visa, MasterCard, Net Banking
                </div>
                <div>
                  <strong>Webhook Signature Verification:</strong> <span className="badge badge-green">Active (HMAC-SHA256)</span>
                </div>
                <div>
                  <strong>Tamper-proof Amount Verification:</strong> <span className="badge badge-green">Enforced Server-side</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>Brand & Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div><strong>Brand Name:</strong> GANIT ADDA</div>
                <div><strong>Support Hotline:</strong> +91 98741 69625</div>
                <div><strong>Support Email:</strong> madeeasyganit@gmail.com</div>
                <div><strong>WhatsApp Line:</strong> +91 98741 69625</div>
                <div><strong>Curriculum:</strong> CBSE & NCERT (Classes VI – XII)</div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Worksheet Modal */}
        {showAddModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="heading-serif" style={{ fontSize: '22px', margin: 0 }}>Upload New Mathematics Worksheet</h2>
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm">&times;</button>
              </div>

              <form onSubmit={handleCreateWorksheet}>
                <div className="form-group">
                  <label className="form-label">Worksheet Title *</label>
                  <input className="form-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="e.g. Real Numbers Mastery Problem Set" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Class *</label>
                    <select className="form-select" value={newClass} onChange={(e) => setNewClass(e.target.value)}>
                      <option value="VI">Class 6th</option>
                      <option value="VII">Class 7th</option>
                      <option value="VIII">Class 8th</option>
                      <option value="IX">Class 9th</option>
                      <option value="X">Class 10th</option>
                      <option value="XI">Class 11th</option>
                      <option value="XII">Class 12th</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty *</label>
                    <select className="form-select" value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)}>
                      <option value="Easy">Easy (Foundations)</option>
                      <option value="Medium">Medium (Standard)</option>
                      <option value="Hard">Hard (Exemplar / Board)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Chapter Name *</label>
                    <input className="form-input" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} required placeholder="e.g. Real Numbers" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹; enter 0 for Free) *</label>
                    <input type="number" min="0" className="form-input" value={newPriceRupees} onChange={(e) => setNewPriceRupees(Number(e.target.value))} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Learning Scope</label>
                  <textarea className="form-textarea" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Overview of questions, proof formats and concepts included..." />
                </div>

                <div className="form-group">
                  <label className="form-label">PDF Worksheet File *</label>
                  <input type="file" accept="application/pdf,.pdf" className="form-input" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                  <small style={{ color: 'var(--muted)', marginTop: '4px' }}>Max file size: 20 MB. Stored securely.</small>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" disabled={busy} className="btn btn-primary" style={{ flex: 1 }}>
                    {busy ? 'Uploading File...' : 'Publish Worksheet'}
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
