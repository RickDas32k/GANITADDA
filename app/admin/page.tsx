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
  Search,
  Filter,
  Check,
  X,
  CreditCard,
  Phone,
  Mail,
  UserCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'overview' | 'worksheets' | 'users' | 'orders' | 'coupons' | 'enquiries' | 'settings';

interface PurchasedItem {
  worksheet_id: string;
  title: string;
  class_level: string;
  chapter: string;
  price_paise: number;
  order_number: string;
  purchased_at: string;
}

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: string;
  is_active: boolean;
  created_at: string;
  total_spent_paise: number;
  purchased_items: PurchasedItem[];
}

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
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Worksheet Filtering & Search
  const [worksheetSearch, setWorksheetSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  // User Filtering & Search
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'with_purchases' | 'no_purchases'>('all');
  const [selectedUserForPurchases, setSelectedUserForPurchases] = useState<AdminUser | null>(null);

  // Upload/Create Worksheet modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('X');
  const [newChapter, setNewChapter] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newType, setNewType] = useState('worksheet');
  const [newPriceRupees, setNewPriceRupees] = useState(99);
  const [newOriginalPriceRupees, setNewOriginalPriceRupees] = useState(199);
  const [newDesc, setNewDesc] = useState('');
  const [newObjectives, setNewObjectives] = useState('');
  const [newQuestions, setNewQuestions] = useState(30);
  const [newPages, setNewPages] = useState(10);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newIsBestseller, setNewIsBestseller] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Edit Worksheet Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editClass, setEditClass] = useState('X');
  const [editChapter, setEditChapter] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('Medium');
  const [editType, setEditType] = useState('worksheet');
  const [editPriceRupees, setEditPriceRupees] = useState(99);
  const [editOriginalPriceRupees, setEditOriginalPriceRupees] = useState(0);
  const [editDesc, setEditDesc] = useState('');
  const [editObjectives, setEditObjectives] = useState('');
  const [editQuestions, setEditQuestions] = useState(30);
  const [editPages, setEditPages] = useState(10);
  const [editPublished, setEditPublished] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editBestseller, setEditBestseller] = useState(false);
  const [editUploadFile, setEditUploadFile] = useState<File | null>(null);
  const [editExistingFileUrl, setEditExistingFileUrl] = useState('');

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
      const [wsRes, ordRes, cpnRes, enqRes, anaRes, usrRes] = await Promise.all([
        fetch('/api/admin/worksheets'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/coupons'),
        fetch('/api/admin/enquiries'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/users'),
      ]);

      if (wsRes.ok) {
        const d = await wsRes.json();
        setWorksheets(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      }
      if (ordRes.ok) {
        const d = await ordRes.json();
        setOrders(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      }
      if (cpnRes.ok) {
        const d = await cpnRes.json();
        setCoupons(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      }
      if (enqRes.ok) {
        const d = await enqRes.json();
        setEnquiries(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      }
      if (anaRes.ok) {
        setAnalytics(await anaRes.json());
      }
      if (usrRes.ok) {
        const d = await usrRes.json();
        setUsers(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
      }
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

  // CREATE WORKSHEET
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
    form.append('original_price_rupees', String(newOriginalPriceRupees));
    form.append('description', newDesc);
    form.append('learning_objectives', newObjectives);
    form.append('number_of_questions', String(newQuestions));
    form.append('number_of_pages', String(newPages));
    form.append('is_featured', String(newIsFeatured));
    form.append('is_bestseller', String(newIsBestseller));
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
        setNewTopic('');
        setNewDesc('');
        setNewObjectives('');
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

  // OPEN EDIT WORKSHEET MODAL
  function handleOpenEdit(w: any) {
    setEditingId(w.id);
    setEditTitle(w.title || '');
    setEditClass(w.class_level || 'X');
    setEditChapter(w.chapter || '');
    setEditTopic(w.topic || '');
    setEditDifficulty(w.difficulty || 'Medium');
    setEditType(w.material_type || 'worksheet');
    setEditPriceRupees(w.price_paise !== undefined ? Math.round(w.price_paise / 100) : 0);
    setEditOriginalPriceRupees(w.original_price_paise ? Math.round(w.original_price_paise / 100) : 0);
    setEditDesc(w.description || '');
    setEditObjectives(w.learning_objectives || '');
    setEditQuestions(w.number_of_questions || 30);
    setEditPages(w.number_of_pages || 10);
    setEditPublished(w.is_published !== false);
    setEditFeatured(Boolean(w.is_featured));
    setEditBestseller(Boolean(w.is_bestseller));
    setEditExistingFileUrl(w.blob_url || '');
    setEditUploadFile(null);
    setShowEditModal(true);
  }

  // SAVE EDITED WORKSHEET
  async function handleUpdateWorksheet(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const form = new FormData();
    form.append('id', editingId);
    form.append('title', editTitle);
    form.append('class_level', editClass);
    form.append('chapter', editChapter);
    form.append('topic', editTopic);
    form.append('difficulty', editDifficulty);
    form.append('material_type', editType);
    form.append('price_rupees', String(editPriceRupees));
    form.append('original_price_rupees', String(editOriginalPriceRupees));
    form.append('description', editDesc);
    form.append('learning_objectives', editObjectives);
    form.append('number_of_questions', String(editQuestions));
    form.append('number_of_pages', String(editPages));
    form.append('is_published', String(editPublished));
    form.append('is_featured', String(editFeatured));
    form.append('is_bestseller', String(editBestseller));
    if (editUploadFile) {
      form.append('file', editUploadFile);
    }

    try {
      const res = await fetch('/api/admin/worksheets', {
        method: 'PATCH',
        body: form,
      });

      if (res.ok) {
        setShowEditModal(false);
        await loadAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update worksheet');
      }
    } catch {
      alert('Update failed due to network error');
    } finally {
      setBusy(false);
    }
  }

  // DELETE WORKSHEET
  async function handleDeleteWorksheet(id: string) {
    if (!confirm('Are you sure you want to delete this worksheet? This action cannot be undone.')) return;
    const res = await fetch('/api/admin/worksheets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setWorksheets(worksheets.filter((w) => w.id !== id));
    }
  }

  // CREATE COUPON
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

  // UPDATE ENQUIRY STATUS
  async function handleUpdateEnquiryStatus(id: string, status: string) {
    await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setEnquiries(enquiries.map((enq) => (enq.id === id ? { ...enq, status } : enq)));
  }

  // FILTERED WORKSHEETS
  const filteredWorksheets = worksheets.filter((w) => {
    const matchesSearch =
      !worksheetSearch ||
      w.title?.toLowerCase().includes(worksheetSearch.toLowerCase()) ||
      w.chapter?.toLowerCase().includes(worksheetSearch.toLowerCase()) ||
      w.topic?.toLowerCase().includes(worksheetSearch.toLowerCase());
    const matchesClass = classFilter === 'ALL' || w.class_level === classFilter;
    return matchesSearch && matchesClass;
  });

  // FILTERED USERS
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userSearch ||
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobile?.includes(userSearch);
    if (!matchesSearch) return false;

    if (userFilter === 'with_purchases') return (u.purchased_items?.length || 0) > 0;
    if (userFilter === 'no_purchases') return (u.purchased_items?.length || 0) === 0;
    return true;
  });

  // Derived user statistics
  const totalPayingUsers = users.filter((u) => (u.purchased_items?.length || 0) > 0).length;
  const totalUserSpendPaise = users.reduce((acc, u) => acc + (u.total_spent_paise || 0), 0);
  const avgSpendRupees = totalPayingUsers > 0 ? Math.round(totalUserSpendPaise / totalPayingUsers / 100) : 0;

  if (checkingAuth) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ display: 'inline-block', marginBottom: '12px' }}>
          <ShieldCheck size={36} color="var(--gold-dark)" />
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600 }}>Verifying administrative access...</p>
      </div>
    );
  }

  // Secure Admin Sign-in Card (Accessed solely by typing /admin)
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
              Admin Portal
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
              Direct administrator authentication. Enter your admin credentials to access.
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13.5px',
                marginBottom: '18px',
                fontWeight: 600,
              }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="adminEmail">
                Admin Email
              </label>
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
              <label className="form-label" htmlFor="adminPass">
                Password
              </label>
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

            <button type="submit" disabled={busy} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontWeight: 700 }}>
              {busy ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--maroon)', fontWeight: 600 }}>
              &larr; Return to Home Page
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // Authenticated Complete Admin Portal
  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
          <div className="brand" style={{ color: '#fffdf8', fontSize: '22px' }}>
            <span>GANIT</span> ADDA
          </div>
          <small style={{ color: '#dfb65f', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
            Administrator Portal
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
            onClick={() => setActiveTab('users')}
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <Users size={18} /> Users & Purchases ({users.length})
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
              width: '100%',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="admin-main">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="heading-serif" style={{ fontSize: '28px', margin: '0 0 4px' }}>
              {activeTab === 'overview' && 'Dashboard Overview & Metrics'}
              {activeTab === 'worksheets' && 'Manage Worksheets & Materials'}
              {activeTab === 'users' && 'Registered Users & Purchased Content'}
              {activeTab === 'orders' && 'Customer Orders & Transactions'}
              {activeTab === 'coupons' && 'Coupons & Promotional Offers'}
              {activeTab === 'enquiries' && 'Student Leads & Inquiries'}
              {activeTab === 'settings' && 'Platform & Payment Settings'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              {activeTab === 'overview' && 'Key platform indicators, revenue performance, and quick navigation.'}
              {activeTab === 'worksheets' && 'Add, edit worksheet details, pricing, chapters, or replace PDF downloads.'}
              {activeTab === 'users' && 'Every student account created, their purchased worksheets, and total money paid.'}
              {activeTab === 'orders' && 'Real-time order statuses, Razorpay/UPI payments, and timestamps.'}
              {activeTab === 'coupons' && 'Create and track promo coupon redemptions for sales campaigns.'}
              {activeTab === 'enquiries' && 'Direct WhatsApp and demo inquiries submitted by students.'}
              {activeTab === 'settings' && 'Core gateway settings, security status, and system parameters.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {activeTab === 'worksheets' && (
              <button onClick={() => setShowAddModal(true)} className="btn btn-gold btn-sm">
                <Plus size={16} /> Upload New Worksheet
              </button>
            )}
            {activeTab === 'users' && (
              <button onClick={loadAllData} className="btn btn-outline btn-sm">
                <UserCheck size={16} /> Refresh Users
              </button>
            )}
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              <Eye size={15} /> View Public Website
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Platform Revenue <DollarSign size={18} color="var(--maroon)" />
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  ₹{(analytics.totalRevenuePaise / 100).toLocaleString('en-IN')}
                </div>
                <small style={{ color: 'var(--success)', fontWeight: 600 }}>Total verified collected payments</small>
              </div>

              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Registered Users <Users size={18} color="var(--gold-dark)" />
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {users.length}
                </div>
                <small style={{ color: 'var(--muted)' }}>
                  <strong>{totalPayingUsers}</strong> active paying customers
                </small>
              </div>

              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Published Worksheets <FileText size={18} color="var(--success)" />
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {worksheets.length}
                </div>
                <small style={{ color: 'var(--muted)' }}>Classes VI to XII</small>
              </div>

              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Orders <ShoppingBag size={18} color="var(--maroon)" />
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {analytics.totalOrders}
                </div>
                <small style={{ color: 'var(--success)' }}>{analytics.successfulPayments} successful</small>
              </div>

              <div className="card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Student Enquiries <MessageSquare size={18} color="var(--info)" />
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--maroon)', margin: '8px 0 4px' }}>
                  {enquiries.length}
                </div>
                <small style={{ color: 'var(--info)', fontWeight: 600 }}>
                  {enquiries.filter((e) => e.status === 'new').length} require follow-up
                </small>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="card" style={{ padding: '20px', marginBottom: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--maroon)', marginRight: '8px' }}>
                Quick Admin Actions:
              </span>
              <button onClick={() => setShowAddModal(true)} className="btn btn-gold btn-sm">
                <Plus size={15} /> Upload Worksheet
              </button>
              <button onClick={() => setActiveTab('users')} className="btn btn-outline btn-sm">
                <Users size={15} /> View Users & Purchases
              </button>
              <button onClick={() => setActiveTab('worksheets')} className="btn btn-outline btn-sm">
                <Edit3 size={15} /> Edit Worksheets
              </button>
              <button onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm">
                <ShoppingBag size={15} /> View All Orders
              </button>
            </div>

            {/* Grid with Recent Orders & Recent Users */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {/* Recent Orders Overview */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="heading-serif" style={{ fontSize: '18px', margin: 0 }}>
                    Recent Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="btn btn-ghost btn-sm">
                    View All &rarr;
                  </button>
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td><strong>#{o.order_number}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{o.customer_phone || o.customer_email}</div>
                          </td>
                          <td><strong>₹{(o.total_paise / 100).toFixed(0)}</strong></td>
                          <td><span className="badge badge-green">{o.status}</span></td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Registered Users */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="heading-serif" style={{ fontSize: '18px', margin: 0 }}>
                    Registered Users & Purchases
                  </h3>
                  <button onClick={() => setActiveTab('users')} className="btn btn-ghost btn-sm">
                    View All ({users.length}) &rarr;
                  </button>
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Purchases</th>
                        <th>Money Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((u) => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{u.full_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{u.email}</div>
                          </td>
                          <td>
                            <span className={`badge ${u.purchased_items?.length ? 'badge-maroon' : 'badge-gold'}`}>
                              {u.purchased_items?.length || 0} items
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: u.total_spent_paise > 0 ? 'var(--success)' : 'var(--muted)' }}>
                              ₹{(u.total_spent_paise / 100).toFixed(0)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)' }}>No registered users yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MANAGE WORKSHEETS (WITH FULL EDIT OPTION) */}
        {/* ============================================================== */}
        {activeTab === 'worksheets' && (
          <div>
            {/* Filter and Search Bar */}
            <div className="card" style={{ padding: '18px 24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '360px' }}>
                  <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search worksheets by title, chapter or topic..."
                    value={worksheetSearch}
                    onChange={(e) => setWorksheetSearch(e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Filter Class:</span>
                  {['ALL', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setClassFilter(lvl)}
                      className={`btn btn-sm ${classFilter === lvl ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      {lvl === 'ALL' ? 'All Classes' : `Class ${lvl}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Worksheets Table */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title & Material</th>
                      <th>Class</th>
                      <th>Chapter & Topic</th>
                      <th>Difficulty</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Downloads</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorksheets.map((w) => (
                      <tr key={w.id}>
                        <td style={{ maxWidth: '280px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--foreground)' }}>{w.title}</div>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <span className="badge badge-gold" style={{ fontSize: '10.5px' }}>
                              {w.material_type || 'worksheet'}
                            </span>
                            {w.is_featured && (
                              <span className="badge badge-maroon" style={{ fontSize: '10.5px' }}>Featured</span>
                            )}
                            {w.is_bestseller && (
                              <span className="badge badge-green" style={{ fontSize: '10.5px' }}>Bestseller</span>
                            )}
                          </div>
                        </td>
                        <td><span className="badge badge-maroon">Class {w.class_level}</span></td>
                        <td>
                          <div><strong>{w.chapter}</strong></div>
                          {w.topic && <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{w.topic}</div>}
                        </td>
                        <td><span className="badge badge-gold">{w.difficulty || 'Medium'}</span></td>
                        <td>
                          {w.price_paise === 0 ? (
                            <span className="badge badge-green">FREE</span>
                          ) : (
                            <div>
                              <strong>₹{(w.price_paise / 100).toFixed(0)}</strong>
                              {w.original_price_paise && (
                                <div style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--muted)' }}>
                                  ₹{(w.original_price_paise / 100).toFixed(0)}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${w.is_published !== false ? 'badge-green' : 'badge-gold'}`}>
                            {w.is_published !== false ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{w.download_count || 0}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {/* WORKSHEET EDIT OPTION */}
                            <button
                              onClick={() => handleOpenEdit(w)}
                              className="btn btn-outline btn-sm"
                              title="Edit Worksheet Details"
                              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'var(--maroon)' }}
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <Link
                              href={`/worksheets/${w.slug || w.id}`}
                              target="_blank"
                              className="btn btn-ghost btn-sm"
                              title="Preview on Public Website"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteWorksheet(w.id)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--danger)' }}
                              title="Delete Worksheet"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredWorksheets.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                          No worksheets found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: USERS & PURCHASES (SHOW EVERY USER, PURCHASES & AMOUNT) */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div>
            {/* KPI Summary for Users & Spend */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Registered Accounts
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--maroon)', margin: '6px 0 2px' }}>
                  {users.length}
                </div>
                <small style={{ color: 'var(--muted)' }}>All accounts created</small>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Paying Customers
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--maroon)', margin: '6px 0 2px' }}>
                  {totalPayingUsers}
                </div>
                <small style={{ color: 'var(--success)', fontWeight: 600 }}>Users who purchased content</small>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Customer Spend
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--maroon)', margin: '6px 0 2px' }}>
                  ₹{(totalUserSpendPaise / 100).toLocaleString('en-IN')}
                </div>
                <small style={{ color: 'var(--success)' }}>Cumulative revenue from user purchases</small>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ color: 'var(--muted)', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Avg. Spend / Paying Customer
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--maroon)', margin: '6px 0 2px' }}>
                  ₹{avgSpendRupees}
                </div>
                <small style={{ color: 'var(--muted)' }}>Average order value</small>
              </div>
            </div>

            {/* User Search & Filter Controls */}
            <div className="card" style={{ padding: '18px 24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '380px' }}>
                  <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search users by name, email, or mobile..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`btn btn-sm ${userFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    All Users ({users.length})
                  </button>
                  <button
                    onClick={() => setUserFilter('with_purchases')}
                    className={`btn btn-sm ${userFilter === 'with_purchases' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    With Purchases ({totalPayingUsers})
                  </button>
                  <button
                    onClick={() => setUserFilter('no_purchases')}
                    className={`btn btn-sm ${userFilter === 'no_purchases' ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    No Purchases ({users.length - totalPayingUsers})
                  </button>
                </div>
              </div>
            </div>

            {/* Users & Purchases Table */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User Account</th>
                      <th>Contact Mobile</th>
                      <th>Registration Date</th>
                      <th>Role</th>
                      <th>Total Money Paid</th>
                      <th>Purchased Content</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const purchaseCount = u.purchased_items?.length || 0;
                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--maroon)' }}>{u.full_name}</div>
                            <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} /> {u.email}
                            </div>
                          </td>
                          <td>
                            {u.mobile ? (
                              <a
                                href={`https://wa.me/91${u.mobile.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--foreground)', fontWeight: 600 }}
                              >
                                <Phone size={13} color="var(--gold-dark)" /> {u.mobile}
                              </a>
                            ) : (
                              <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Not provided</span>
                            )}
                          </td>
                          <td>
                            <div style={{ fontSize: '13px' }}>
                              {new Date(u.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-maroon' : 'badge-gold'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: u.total_spent_paise > 0 ? 'var(--success)' : 'var(--muted)' }}>
                              ₹{(u.total_spent_paise / 100).toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            {purchaseCount > 0 ? (
                              <div>
                                <span className="badge badge-green" style={{ marginBottom: '6px' }}>
                                  {purchaseCount} {purchaseCount === 1 ? 'Worksheet' : 'Worksheets'} Purchased
                                </span>
                                <div style={{ fontSize: '12px', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {u.purchased_items.map((it) => it.title).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>No purchases yet</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => setSelectedUserForPurchases(u)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
                              >
                                View Details &rarr;
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ORDERS & PAYMENTS */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="card" style={{ padding: '24px' }}>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Customer Name</th>
                    <th>Contact Phone / Email</th>
                    <th>Date & Time</th>
                    <th>Amount Paid</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>#{o.order_number}</strong></td>
                      <td><strong>{o.customer_name}</strong></td>
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

        {/* ============================================================== */}
        {/* TAB 5: COUPONS */}
        {/* ============================================================== */}
        {activeTab === 'coupons' && (
          <div>
            <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>
                Create New Promotional Coupon
              </h3>
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
                <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontWeight: 700 }}>
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

        {/* ============================================================== */}
        {/* TAB 6: STUDENT ENQUIRIES */}
        {/* ============================================================== */}
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

        {/* ============================================================== */}
        {/* TAB 7: PLATFORM SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>
                Payment Gateway & Security Configuration
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div>
                  <strong>Payment Provider:</strong> <span className="badge badge-green">Razorpay / PayU Multi-provider</span>
                </div>
                <div>
                  <strong>Supported Payment Modes:</strong> UPI (GPay, PhonePe, Paytm), RuPay, Visa, MasterCard, Net Banking
                </div>
                <div>
                  <strong>Webhook Signature Verification:</strong> <span className="badge badge-green">Active (HMAC-SHA256)</span>
                </div>
                <div>
                  <strong>Tamper-proof Server Verification:</strong> <span className="badge badge-green">Enforced Server-side</span>
                </div>
                <div>
                  <strong>Admin Route Protection:</strong> <span className="badge badge-green">Direct /admin only</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <h3 className="heading-serif" style={{ fontSize: '20px', margin: '0 0 16px' }}>
                Brand & Support Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div><strong>Brand Name:</strong> GANIT ADDA</div>
                <div><strong>Support Hotline:</strong> +91 98741 69625</div>
                <div><strong>Support Email:</strong> madeeasyganit@gmail.com</div>
                <div><strong>WhatsApp Line:</strong> +91 98741 69625</div>
                <div><strong>Curriculum:</strong> CBSE & NCERT (Classes VI – XII)</div>
                <div><strong>Admin Access:</strong> Confidential - URL /admin</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: EDIT WORKSHEET MODAL */}
        {/* ============================================================== */}
        {showEditModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="heading-serif" style={{ fontSize: '22px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={20} color="var(--maroon)" /> Edit Worksheet Details
                  </h2>
                  <small style={{ color: 'var(--muted)' }}>Update title, class, chapter, price or replace PDF</small>
                </div>
                <button onClick={() => setShowEditModal(false)} className="btn btn-ghost btn-sm" style={{ fontSize: '20px' }}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateWorksheet}>
                <div className="form-group">
                  <label className="form-label">Worksheet Title *</label>
                  <input
                    className="form-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    placeholder="e.g. Real Numbers Mastery Problem Set"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Class Level *</label>
                    <select className="form-select" value={editClass} onChange={(e) => setEditClass(e.target.value)}>
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
                    <select className="form-select" value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value)}>
                      <option value="Easy">Easy (Foundations)</option>
                      <option value="Medium">Medium (Standard)</option>
                      <option value="Hard">Hard (Exemplar / Board)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Chapter Name *</label>
                    <input
                      className="form-input"
                      value={editChapter}
                      onChange={(e) => setEditChapter(e.target.value)}
                      required
                      placeholder="e.g. Real Numbers"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topic / Unit</label>
                    <input
                      className="form-input"
                      value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      placeholder="e.g. Fundamental Theorem of Arithmetic"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Material Category *</label>
                    <select className="form-select" value={editType} onChange={(e) => setEditType(e.target.value)}>
                      <option value="worksheet">Practice Worksheet</option>
                      <option value="ncert_solution">NCERT Solution</option>
                      <option value="study_material">Revision Notes & Formulas</option>
                      <option value="mock_test">Model Mock Test Paper</option>
                      <option value="formula_sheet">Formula Cheat Sheet</option>
                      <option value="question_bank">Question Bank</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹; enter 0 for Free) *</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={editPriceRupees}
                      onChange={(e) => setEditPriceRupees(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹ strikethrough)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={editOriginalPriceRupees}
                      onChange={(e) => setEditOriginalPriceRupees(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Questions / Pages</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="Questions"
                        value={editQuestions}
                        onChange={(e) => setEditQuestions(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="Pages"
                        value={editPages}
                        onChange={(e) => setEditPages(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Learning Scope</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Overview of questions, proof formats and concepts included..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Learning Objectives</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editObjectives}
                    onChange={(e) => setEditObjectives(e.target.value)}
                    placeholder="Key concepts mastered by studying this worksheet..."
                  />
                </div>

                {/* Toggles for Publishing, Featured, Bestseller */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '14px 0', padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius-sm)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                    <input
                      type="checkbox"
                      checked={editPublished}
                      onChange={(e) => setEditPublished(e.target.checked)}
                    />
                    <strong>Published (Visible to students)</strong>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                    <input
                      type="checkbox"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                    <input
                      type="checkbox"
                      checked={editBestseller}
                      onChange={(e) => setEditBestseller(e.target.checked)}
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                </div>

                {/* Replacement PDF File */}
                <div className="form-group">
                  <label className="form-label">Replace PDF File (Optional)</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="form-input"
                    onChange={(e) => setEditUploadFile(e.target.files?.[0] || null)}
                  />
                  <small style={{ color: 'var(--muted)', marginTop: '4px', display: 'block' }}>
                    {editExistingFileUrl ? 'Leave empty to keep the currently attached PDF file.' : 'Upload a new PDF file for this worksheet.'}
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" disabled={busy} className="btn btn-primary" style={{ flex: 1, padding: '12px', fontWeight: 700 }}>
                    {busy ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: USER PURCHASES BREAKDOWN MODAL */}
        {/* ============================================================== */}
        {selectedUserForPurchases && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '20px',
            }}
          >
            <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 className="heading-serif" style={{ fontSize: '22px', margin: 0, color: 'var(--maroon)' }}>
                    {selectedUserForPurchases.full_name}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                    {selectedUserForPurchases.email} • Mobile: {selectedUserForPurchases.mobile || 'Not set'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Account Created: {new Date(selectedUserForPurchases.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
                <button onClick={() => setSelectedUserForPurchases(null)} className="btn btn-ghost btn-sm" style={{ fontSize: '20px' }}>
                  &times;
                </button>
              </div>

              {/* Summary Highlight Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '24px',
                  border: '1px solid var(--line)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Money Paid
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--maroon)', marginTop: '2px' }}>
                    ₹{(selectedUserForPurchases.total_spent_paise / 100).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Purchased Materials
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--maroon)', marginTop: '2px' }}>
                    {selectedUserForPurchases.purchased_items?.length || 0}
                  </div>
                </div>
              </div>

              {/* List of Content Purchased */}
              <h3 className="heading-serif" style={{ fontSize: '18px', marginBottom: '14px' }}>
                Purchased Content Breakdown
              </h3>

              {selectedUserForPurchases.purchased_items && selectedUserForPurchases.purchased_items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedUserForPurchases.purchased_items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px 16px',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge badge-maroon" style={{ fontSize: '11px' }}>
                            Class {item.class_level}
                          </span>
                          <strong style={{ fontSize: '14px' }}>{item.title}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          Chapter: {item.chapter} • Order: <strong>#{item.order_number}</strong>
                          {item.purchased_at && ` • ${new Date(item.purchased_at).toLocaleDateString('en-IN')}`}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>
                          ₹{(item.price_paise / 100).toFixed(0)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Paid</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', background: '#fdfbf7', borderRadius: '8px' }}>
                  <ShoppingBag size={32} color="var(--gold-dark)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>This student has not purchased any worksheets yet.</p>
                  <small style={{ color: 'var(--muted)' }}>Account is active and verified.</small>
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedUserForPurchases(null)} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: UPLOAD NEW WORKSHEET MODAL */}
        {/* ============================================================== */}
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
            <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="heading-serif" style={{ fontSize: '22px', margin: 0 }}>
                  Upload New Mathematics Worksheet
                </h2>
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm" style={{ fontSize: '20px' }}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateWorksheet}>
                <div className="form-group">
                  <label className="form-label">Worksheet Title *</label>
                  <input
                    className="form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Real Numbers Mastery Problem Set"
                  />
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
                    <input
                      className="form-input"
                      value={newChapter}
                      onChange={(e) => setNewChapter(e.target.value)}
                      required
                      placeholder="e.g. Real Numbers"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topic / Unit</label>
                    <input
                      className="form-input"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="e.g. Fundamental Theorem of Arithmetic"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Material Category *</label>
                    <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                      <option value="worksheet">Practice Worksheet</option>
                      <option value="ncert_solution">NCERT Solution</option>
                      <option value="study_material">Revision Notes & Formulas</option>
                      <option value="mock_test">Model Mock Test Paper</option>
                      <option value="formula_sheet">Formula Cheat Sheet</option>
                      <option value="question_bank">Question Bank</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹; enter 0 for Free) *</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={newPriceRupees}
                      onChange={(e) => setNewPriceRupees(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹ strikethrough)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={newOriginalPriceRupees}
                      onChange={(e) => setNewOriginalPriceRupees(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Questions / Pages</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="Questions"
                        value={newQuestions}
                        onChange={(e) => setNewQuestions(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        placeholder="Pages"
                        value={newPages}
                        onChange={(e) => setNewPages(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Learning Scope</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Overview of questions, proof formats and concepts included..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PDF Worksheet File *</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="form-input"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                  <small style={{ color: 'var(--muted)', marginTop: '4px', display: 'block' }}>
                    Max file size: 20 MB. Stored securely.
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" disabled={busy} className="btn btn-primary" style={{ flex: 1, padding: '12px', fontWeight: 700 }}>
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
