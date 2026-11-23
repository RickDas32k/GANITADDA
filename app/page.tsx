import Link from 'next/link';
import { getWorksheets } from '@/lib/worksheets';
import WorksheetCard from '@/components/WorksheetCard';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingMathSymbols,
  AnimatedCounter,
} from '@/components/animations/MotionWrappers';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail,
  Zap,
} from 'lucide-react';

export const revalidate = 60; // 1 minute ISR

export default async function HomePage() {
  const allWorksheets = await getWorksheets({ limit: 6 });
  const classesList = [
    { code: 'VI', name: 'Class 6th', count: '45+ Worksheets', topics: 'Fractions, Decimals, Algebra basics' },
    { code: 'VII', name: 'Class 7th', count: '55+ Worksheets', topics: 'Integers, Lines & Angles, Rational Numbers' },
    { code: 'VIII', name: 'Class 8th', count: '60+ Worksheets', topics: 'Linear Equations, Quadrilaterals, Mensuration' },
    { code: 'IX', name: 'Class 9th', count: '75+ Worksheets', topics: 'Number Systems, Polynomials, Triangles' },
    { code: 'X', name: 'Class 10th', count: '90+ Worksheets', topics: 'Quadratic Equations, Trigonometry, Statistics' },
    { code: 'XI', name: 'Class 11th', count: '80+ Worksheets', topics: 'Sets, Relations, Limits & Derivatives' },
    { code: 'XII', name: 'Class 12th', count: '95+ Worksheets', topics: 'Integrals, Differential Equations, Vectors' },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <FloatingMathSymbols />
        <div className="wrap hero-content">
          <div>
            <div className="eyebrow" style={{ color: '#dfb65f' }}>
              A Better Way to Understand Mathematics
            </div>
            <h1 className="hero-title">
              Maths Made <em>Simple,</em>
              <br />
              One Step at a Time.
            </h1>
            <p className="hero-description">
              Explore expertly designed mathematics worksheets, chapter-wise practice materials and step-by-step
              solutions aligned with NCERT and CBSE learning requirements.
            </p>
            <div className="hero-actions">
              <Link href="/worksheets" className="btn btn-gold btn-lg">
                Explore Worksheets <ArrowRight size={18} />
              </Link>
              <Link href="/study-materials" className="btn btn-outline-gold btn-lg">
                Browse Study Materials
              </Link>
            </div>
          </div>

          {/* Mathematics Formula Glass Showcase Card */}
          <div className="math-glass-card">
            <div className="eyebrow" style={{ color: '#dfb65f' }}>
              Concept • Method • Mastery
            </div>
            <div className="math-formula-display">(a + b)² = a² + 2ab + b²</div>
            <p style={{ color: '#ebdcd6', fontSize: '15px', lineHeight: 1.6, margin: '8px 0 18px' }}>
              Master foundational formulas, eliminate algebraic sign traps, and develop mathematical confidence through
              step-by-step deliberate practice.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '16px' }}>
              <div>
                <div style={{ color: '#dfb65f', fontWeight: 800, fontSize: '18px' }}>∫ f(x) dx</div>
                <small style={{ color: '#ebdcd6' }}>CBSE Board Formats</small>
              </div>
              <div>
                <div style={{ color: '#dfb65f', fontWeight: 800, fontSize: '18px' }}>D = b² - 4ac</div>
                <small style={{ color: '#ebdcd6' }}>Zero Calculation Traps</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <div className="wrap">
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter to={10000} suffix="+" />
            </div>
            <div className="stat-label">Students Guided Across India</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter to={500} suffix="+" />
            </div>
            <div className="stat-label">Verified Mathematics Worksheets</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">VI – XII</div>
            <div className="stat-label">Complete CBSE & NCERT Coverage</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <AnimatedCounter to={100} suffix="%" />
            </div>
            <div className="stat-label">Step-by-Step Worked Solutions</div>
          </div>
        </div>
      </div>

      {/* Featured Worksheets Section */}
      <section className="section" style={{ paddingTop: '80px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="eyebrow">Handpicked Materials</div>
              <h2 className="heading-serif" style={{ fontSize: '34px', margin: '6px 0 0' }}>
                Featured Mathematics Worksheets
              </h2>
            </div>
            <Link href="/worksheets" className="btn btn-outline btn-sm">
              View All Worksheets <ArrowRight size={15} />
            </Link>
          </div>

          <StaggerContainer className="worksheet-grid">
            {allWorksheets.map((ws) => (
              <StaggerItem key={ws.id}>
                <WorksheetCard worksheet={ws} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Popular Classes Strip */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Grade-wise Syllabus</div>
            <h2 className="heading-serif" style={{ fontSize: '34px', margin: '6px 0 10px' }}>
              Select Your Class
            </h2>
            <p className="subheading">
              Targeted worksheets crafted specifically for your grade level curriculum and board examination patterns.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {classesList.map((c) => (
              <Link
                key={c.code}
                href={`/worksheets?class=${c.code}`}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-maroon">Class {c.code}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>{c.count}</span>
                </div>
                <h4 style={{ margin: '8px 0 2px', fontSize: '18px', color: 'var(--maroon)', fontWeight: 800 }}>
                  {c.name}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {c.topics}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold-dark)', fontWeight: 700, fontSize: '13px', marginTop: '6px' }}>
                  Browse Class {c.code} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Ganit Adda */}
      <section className="section">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Our Teaching Philosophy</div>
            <h2 className="heading-serif" style={{ fontSize: '34px', margin: '6px 0 10px' }}>
              Why Choose Ganit Adda?
            </h2>
            <p className="subheading">
              Mathematics is not about memorizing formulas; it is about recognizing patterns, mastering methods, and
              building unshakeable confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', marginBottom: '18px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', margin: '0 0 10px' }}>
                Conceptual Clarity First
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Every worksheet starts from fundamental axioms before escalating into complex exam questions, ensuring no
                learning gaps remain.
              </p>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', marginBottom: '18px' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', margin: '0 0 10px' }}>
                Step-by-Step Worked Solutions
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Never get stuck. Detailed step-by-step proofs and explanations show students exactly how to structure
                their answers for full marks.
              </p>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', marginBottom: '18px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', margin: '0 0 10px' }}>
                CBSE Board Exam Ready
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Includes previous 10-year question patterns, assertion-reasoning items, and case-study problems reflecting
                the latest CBSE guidelines.
              </p>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', marginBottom: '18px' }}>
                <Download size={24} />
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', margin: '0 0 10px' }}>
                Instant Digital Downloads
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Purchase once and gain lifetime access in your dashboard. Download high-resolution printable PDFs on any
                device immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Simple 3-Step Process</div>
            <h2 className="heading-serif" style={{ fontSize: '34px', margin: '6px 0 10px' }}>
              How Ganit Adda Works
            </h2>
            <p className="subheading">
              Empowering learners to practise with intention in three effortless steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', position: 'relative' }}>
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--maroon)', color: '#fff8ee', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 800, margin: '0 auto 18px', fontFamily: 'var(--font-serif)' }}>
                1
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', marginBottom: '10px' }}>
                Select Class & Chapter
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Browse chapter-wise worksheets and NCERT solutions tailored for Classes VI to XII.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gold)', color: '#281b1f', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 800, margin: '0 auto 18px', fontFamily: 'var(--font-serif)' }}>
                2
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', marginBottom: '10px' }}>
                Secure Instant Checkout
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Add to your cart and pay safely via UPI (Google Pay, PhonePe, Paytm), Cards, or Net Banking.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--maroon-dark)', color: '#fff8ee', display: 'grid', placeItems: 'center', fontSize: '22px', fontWeight: 800, margin: '0 auto 18px', fontFamily: 'var(--font-serif)' }}>
                3
              </div>
              <h3 style={{ color: 'var(--maroon)', fontSize: '20px', marginBottom: '10px' }}>
                Download & Master
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Instantly access printable PDFs and step-by-step worked solutions from your personal student dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Demo / Consultation Booking Form (Saves to DB via /api/leads) */}
      <section className="section" id="book-demo">
        <div className="wrap">
          <div style={{ background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))', color: '#fff8ee', borderRadius: 'var(--radius-lg)', padding: 'clamp(32px, 5vw, 64px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ color: '#dfb65f' }}>Personalised Mathematics Support</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', margin: '12px 0 16px', lineHeight: 1.15 }}>
                Book a Free Introductory Session
              </h2>
              <p style={{ color: '#f1dedb', fontSize: '16.5px', lineHeight: 1.6, marginBottom: '24px' }}>
                Have specific doubts or need personalized guidance? Share your details and our senior mathematics educators
                will get in touch to discuss your academic goals.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="#dfb65f" /> Direct Call: <strong>9874169625</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} color="#dfb65f" /> Email: <strong>madeeasyganit@gmail.com</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#fffdf8', padding: '32px', borderRadius: 'var(--radius-md)', color: 'var(--ink)' }}>
              <form action="/api/leads" method="POST">
                <div className="form-group">
                  <label className="form-label" htmlFor="student_name">
                    Student Full Name *
                  </label>
                  <input id="student_name" name="student_name" className="form-input" placeholder="e.g. Rahul Sharma" required maxLength={120} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Parent / Student WhatsApp Number *
                  </label>
                  <input id="phone" name="phone" className="form-input" placeholder="e.g. 9874169625" required maxLength={30} />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="class_level">
                    Class / Grade *
                  </label>
                  <select id="class_level" name="class_level" className="form-select" defaultValue="X">
                    <option value="VI">Class 6th</option>
                    <option value="VII">Class 7th</option>
                    <option value="VIII">Class 8th</option>
                    <option value="IX">Class 9th</option>
                    <option value="X">Class 10th (CBSE Board)</option>
                    <option value="XI">Class 11th</option>
                    <option value="XII">Class 12th (CBSE Board)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    What topics or chapters need help? (optional)
                  </label>
                  <textarea id="message" name="message" className="form-textarea" rows={3} placeholder="e.g. Quadratic equations word problems, Trigonometry proofs..." />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px' }}>
                  Submit Enquiry & Book Free Demo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section section-alt">
        <div className="wrap wrap-narrow">
          <div className="section-header text-center">
            <div className="eyebrow">Got Questions?</div>
            <h2 className="heading-serif" style={{ fontSize: '34px', margin: '6px 0 10px' }}>
              Frequently Asked Questions
            </h2>
            <p className="subheading">
              Everything you need to know about purchasing worksheets, downloading materials, and digital delivery.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h4 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 8px', fontWeight: 700 }}>
                How do I receive the worksheets after payment?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Immediately after your payment is verified via UPI or cards, your digital entitlement is created. You can
                instantly download the high-resolution PDF worksheets directly from your <strong>My Downloads</strong>{' '}
                dashboard. You will also receive an order confirmation receipt by email.
              </p>
            </div>

            <div className="card">
              <h4 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 8px', fontWeight: 700 }}>
                Are the worksheets aligned with the latest CBSE syllabus?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Yes, 100%. All question sets, sample test papers, and NCERT solutions strictly conform to the latest
                CBSE examination pattern, marking schemes, and deleted topics guidelines.
              </p>
            </div>

            <div className="card">
              <h4 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 8px', fontWeight: 700 }}>
                Can I print the worksheets for home practice?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Absolutely. All files are standard printable A4 PDFs formatted with generous margins and clear
                mathematical typography, optimized for crisp home or classroom printing.
              </p>
            </div>

            <div className="card">
              <h4 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 8px', fontWeight: 700 }}>
                Which payment methods are accepted?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                We support all major Indian digital payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), Debit
                Cards, Credit Cards, and Net Banking through RBI-authorized payment gateways.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
