import Link from 'next/link';
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  FloatingMathSymbols,
  AnimatedCounter,
  InteractiveFormulaShowcase,
  InteractiveClassExplorer,
  PromotionalFaqGroup,
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
  FileText,
  Clock,
  Star,
  Check,
  X,
  Printer,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export const revalidate = 300; // 5 minutes ISR for promotional landing

export default function HomePage() {
  const faqItems = [
    {
      question: 'How do I access and download my worksheets after checkout?',
      answer:
        'Immediately after your payment is verified via UPI, Cards, or Net Banking, access is activated in your student dashboard. You can download the high-resolution printable PDFs instantly with a single click. A confirmation receipt and direct download link are also sent to your email.',
    },
    {
      question: 'Are all materials aligned with the latest 2026 CBSE syllabus?',
      answer:
        'Yes, 100%. Our senior educators update all question sets, formulas, and NCERT solutions annually. Deleted topics are excluded, and latest CBSE board formats (including 2-mark reasoning, assertion-reasoning, and case-based applications) are fully incorporated.',
    },
    {
      question: 'Can I print these worksheets on home or office printers?',
      answer:
        'Yes! Every worksheet is authored in standard A4 printable PDF format with generous margins, crisp vector math typography, and dedicated student working areas for neat offline pencil practice.',
    },
    {
      question: 'Do the worksheets include answers and complete step-by-step solutions?',
      answer:
        'Yes. Unlike ordinary textbooks that only show the final numerical answer, every Ganit Adda worksheet contains detailed step-by-step worked solutions demonstrating exactly how each step and theorem must be written to earn full marks from board examiners.',
    },
    {
      question: 'What if I need help choosing the right package or have questions?',
      answer:
        'Our mathematics education team is always reachable directly via WhatsApp at +91 98741 69625 or email at madeeasyganit@gmail.com. We are happy to review your current syllabus needs and recommend the exact chapters to focus on.',
    },
  ];

  const testimonials = [
    {
      name: 'Aarav Sengupta',
      classLevel: 'Class 10 (CBSE)',
      school: 'Delhi Public School',
      score: 'Scored 96/100 in Pre-Boards',
      comment:
        'The Quadratic Equations and Trigonometry worksheets helped me eliminate silly sign mistakes. The step-by-step proofs showed me exactly how to format answers for full marks.',
    },
    {
      name: 'Mrs. Radhika Joshi',
      classLevel: 'Parent of Class 9 Student',
      school: 'Kendriya Vidyalaya',
      score: 'Marks improved from 64% to 88%',
      comment:
        'As a working parent, having chapter-wise printable worksheets with worked solutions at home made revision so peaceful. My daughter now enjoys solving geometry proofs on her own.',
    },
    {
      name: 'Devanshu Patel',
      classLevel: 'Class 12 (Board & CUET)',
      school: 'Senior Secondary Model School',
      score: 'Scored 98/100 in Term Exams',
      comment:
        'The Class 12 Integrals workbook is pure gold. It categorized all 15 integral forms with immediate classification tips. I finished my calculus section 25 minutes early!',
    },
  ];

  return (
    <main>
      {/* Hero Promotional Section */}
      <section className="hero-wrapper">
        <FloatingMathSymbols />
        <div className="wrap hero-content">
          <div>
            <div className="eyebrow hero-badge">
              <span>★</span> CBSE & NCERT Mathematics • Classes VI–XII
            </div>

            <h1 className="hero-title">
              Maths Made <em>Simple,</em>
              <br />
              One Step at a Time.
            </h1>

            <p className="hero-description">
              Stop memorizing formulas and eliminate calculation traps. Master CBSE mathematics with structured chapter-wise worksheets, formula handbooks, and 100% worked step-by-step solutions.
            </p>

            {/* Call to Actions: Desktop and Mobile Optimized */}
            <div className="hero-actions">
              <Link href="/worksheets" className="btn btn-gold btn-lg hero-cta-btn">
                Explore Worksheets Catalog <ArrowRight size={18} />
              </Link>
              <Link href="/ncert-solutions" className="btn btn-outline-gold btn-lg hero-cta-btn">
                NCERT Step-by-Step Solutions
              </Link>
            </div>

            {/* Trust Micro-Badges */}
            <div className="hero-trust-bar">
              <div className="hero-trust-item">
                <CheckCircle2 size={14} color="var(--gold-light)" />
                <span className="trust-desktop-text">Instant PDF Download</span>
                <span className="trust-mobile-text">Instant PDF</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle2 size={14} color="var(--gold-light)" />
                <span className="trust-desktop-text">Printable A4 Format</span>
                <span className="trust-mobile-text">Printable A4</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle2 size={14} color="var(--gold-light)" />
                <span className="trust-desktop-text">100% CBSE 2026 Aligned</span>
                <span className="trust-mobile-text">CBSE 2026 Aligned</span>
              </div>
            </div>
          </div>

          {/* Interactive Formula Concept Showcase (Right Column) */}
          <div>
            <InteractiveFormulaShowcase />
          </div>
        </div>
      </section>

      {/* Animated Key Statistics Strip */}
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
              <AnimatedCounter to={94} suffix="%" />
            </div>
            <div className="stat-label">Students Reported Higher Scores</div>
          </div>
        </div>
      </div>

      {/* Curriculum Gateways (4 Dedicated Content Pillars - Directs to Content Pages) */}
      <section className="section" style={{ paddingTop: '72px' }}>
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Explore Our Complete Ecosystem</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '8px 0 12px' }}>
              Everything You Need for 95+ in Mathematics
            </h2>
            <p className="subheading" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Structured, verified resources tailored for independent practice, classroom learning, and stress-free board exam preparation.
            </p>
          </div>

          <div className="pillar-grid">
            {/* Pillar 1: Worksheets */}
            <div className="card pillar-card">
              <div className="pillar-icon-box" style={{ background: '#fdf2f4', color: 'var(--maroon)' }}>
                <BookOpen size={28} />
              </div>
              <div className="badge badge-maroon" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                Primary Practice
              </div>
              <h3 className="pillar-title">Chapter-wise Worksheets</h3>
              <p className="pillar-desc">
                Graded questions from Level 1 concept builders to Level 3 Board Exemplar & Olympiad challenges.
                All with verified step-by-step solutions.
              </p>
              <div className="pillar-features">
                <div>✓ 30–75 questions per chapter pack</div>
                <div>✓ Printable A4 with workspace margins</div>
                <div>✓ Zero calculation trap warnings</div>
              </div>
              <Link href="/worksheets" className="btn btn-primary btn-sm pillar-btn">
                Browse Worksheets Catalog <ArrowRight size={15} />
              </Link>
            </div>

            {/* Pillar 2: NCERT Solutions */}
            <div className="card pillar-card">
              <div className="pillar-icon-box" style={{ background: '#fbf3df', color: 'var(--gold-dark)' }}>
                <GraduationCap size={28} />
              </div>
              <div className="badge badge-gold" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                Exercise Mastery
              </div>
              <h3 className="pillar-title">NCERT Step-by-Step Solutions</h3>
              <p className="pillar-desc">
                Clear, textbook-aligned exercise-by-exercise solutions. Understand the complete logic and alternative
                methods behind every proof.
              </p>
              <div className="pillar-features">
                <div>✓ Exercise-by-exercise complete proofs</div>
                <div>✓ Solves common board exam pitfalls</div>
                <div>✓ Classes 6, 7, 8, 9, 10, 11 & 12</div>
              </div>
              <Link href="/ncert-solutions" className="btn btn-outline btn-sm pillar-btn">
                View NCERT Solutions <ArrowRight size={15} />
              </Link>
            </div>

            {/* Pillar 3: Study Materials & Formulas */}
            <div className="card pillar-card">
              <div className="pillar-icon-box" style={{ background: '#f0f7f3', color: 'var(--success)' }}>
                <FileText size={28} />
              </div>
              <div className="badge badge-green" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                Quick Revision
              </div>
              <h3 className="pillar-title">Formula Handbooks & Notes</h3>
              <p className="pillar-desc">
                One-page cheat sheets, identity tables, and theorem reference charts for rapid morning-of-exam memory recall.
              </p>
              <div className="pillar-features">
                <div>✓ All 14 chapters formulas in one handbook</div>
                <div>✓ Printable wallet & pocket guides</div>
                <div>✓ Free revision notes included</div>
              </div>
              <Link href="/study-materials" className="btn btn-outline btn-sm pillar-btn">
                Explore Study Materials <ArrowRight size={15} />
              </Link>
            </div>

            {/* Pillar 4: Mock Tests */}
            <div className="card pillar-card">
              <div className="pillar-icon-box" style={{ background: '#eef6fc', color: 'var(--info)' }}>
                <Clock size={28} />
              </div>
              <div className="badge badge-blue" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                Exam Simulation
              </div>
              <h3 className="pillar-title">CBSE Model Mock Tests</h3>
              <p className="pillar-desc">
                Timed 80-mark and 50-mark full-length exam simulations with official marking schemes to build speed and accuracy.
              </p>
              <div className="pillar-features">
                <div>✓ Authentic 3-hour exam format</div>
                <div>✓ Official marking rubrics & model keys</div>
                <div>✓ Case-study & reasoning sections</div>
              </div>
              <Link href="/mock-tests" className="btn btn-outline btn-sm pillar-btn">
                Attempt Mock Tests <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Grade & Syllabus Explorer */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Grade-by-Grade Curriculum</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '8px 0 12px' }}>
              Select Your Class to Explore Available Materials
            </h2>
            <p className="subheading" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Click any grade from VI to XII to inspect the syllabus coverage, question types, and exam secrets.
            </p>
          </div>

          <InteractiveClassExplorer />
        </div>
      </section>

      {/* Comparison: The Ganit Adda Difference */}
      <section className="section">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Why Ganit Adda Works</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '8px 0 12px' }}>
              Traditional Guides vs The Ganit Adda Way
            </h2>
            <p className="subheading" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Why thousands of CBSE students switch from bulky reference books to deliberate, worksheet-based practice.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Learning Aspect</th>
                  <th style={{ width: '31%', background: '#fcedec', color: 'var(--danger)' }}>
                    Traditional 600-Page Books
                  </th>
                  <th style={{ width: '31%', background: 'var(--cream-soft)', color: 'var(--maroon)' }}>
                    ★ Ganit Adda Worksheets
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Practice Progression</strong></td>
                  <td className="text-danger">Overwhelming, random order of 400 questions with no clear starting point</td>
                  <td className="text-success"><strong>Graded 3-tier sequence:</strong> Concept Builder ➔ Board Level ➔ Exemplar</td>
                </tr>
                <tr>
                  <td><strong>Answer Solutions</strong></td>
                  <td className="text-danger">Only final numeric answer or skipped middle steps ("By inspection...")</td>
                  <td className="text-success"><strong>100% worked steps:</strong> Every bracket expansion & theorem cited for full marks</td>
                </tr>
                <tr>
                  <td><strong>CBSE Syllabus Accuracy</strong></td>
                  <td className="text-danger">Outdated editions still including deleted chapters and old formats</td>
                  <td className="text-success"><strong>Strictly 2026 aligned:</strong> Updated annually with deleted syllabus removed</td>
                </tr>
                <tr>
                  <td><strong>Physical Practicality</strong></td>
                  <td className="text-danger">Heavy 2kg reference book that sits unread on study desks</td>
                  <td className="text-success"><strong>Instant Printable A4 PDFs:</strong> Print 10-20 crisp pages for focused daily practice</td>
                </tr>
                <tr>
                  <td><strong>Doubt Resolution</strong></td>
                  <td className="text-danger">Zero support when stuck on a tricky step</td>
                  <td className="text-success"><strong>WhatsApp Educator Support:</strong> Direct academic assistance when needed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verified Student & Parent Testimonials */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-header text-center">
            <div className="eyebrow">Proven Academic Results</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '8px 0 12px' }}>
              Trusted by 10,000+ Students & Parents
            </h2>
            <p className="subheading" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Hear how structured step-by-step mathematics worksheets helped learners turn exam anxiety into confidence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '3px', color: '#ffb300', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#ffb300" stroke="#ffb300" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--ink)', fontSize: '15px', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '20px' }}>
                    "{t.comment}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--maroon)', fontWeight: 800 }}>{t.name}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      {t.classLevel} • {t.school}
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '11.5px', padding: '4px 8px' }}>
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Demo / Educator Consultation Lead Capture */}
      <section className="section" id="book-demo">
        <div className="wrap">
          <div className="promo-lead-banner">
            <div>
              <div className="eyebrow" style={{ color: '#dfb65f' }}>Personalized Educator Support</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 42px)', margin: '12px 0 16px', lineHeight: 1.15, color: '#fffdf8' }}>
                Book a Free Mathematics Guidance Call
              </h2>
              <p style={{ color: '#f1dedb', fontSize: '16px', lineHeight: 1.65, marginBottom: '28px', maxWidth: '540px' }}>
                Unsure which worksheets or chapters your child needs most? Share your details and our senior educators
                will call to discuss custom study strategies for upcoming school tests and board examinations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="#dfb65f" /> Direct Teacher Helpline: <strong>9874169625</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} color="#dfb65f" /> Official Support: <strong>madeeasyganit@gmail.com</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} color="#dfb65f" /> Free 15-minute diagnostic call with zero obligation
                </div>
              </div>
            </div>

            <div style={{ background: '#fffdf8', padding: '32px', borderRadius: 'var(--radius-md)', color: 'var(--ink)', boxShadow: 'var(--shadow-lg)' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--maroon)', margin: '0 0 16px', fontWeight: 800 }}>
                Request Free Call & Sample PDF
              </h3>
              <form action="/api/leads" method="POST">
                <div className="form-group">
                  <label className="form-label" htmlFor="student_name">
                    Student Full Name *
                  </label>
                  <input
                    id="student_name"
                    name="student_name"
                    className="form-input"
                    placeholder="e.g. Ananya Sen"
                    required
                    maxLength={120}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Parent / Student WhatsApp Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. 9874169625"
                    required
                    maxLength={30}
                  />
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
                    What topic or exam needs help? (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    rows={2}
                    placeholder="e.g. Need help with Class 10 Trigonometry proofs or Class 12 Integrals..."
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                  Request Free Call & Sample PDF
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
            <div className="eyebrow">Everything You Need to Know</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(28px, 4vw, 38px)', margin: '8px 0 12px' }}>
              Frequently Asked Questions
            </h2>
            <p className="subheading" style={{ maxWidth: '580px', margin: '0 auto' }}>
              Clear answers about purchasing worksheets, downloading printable PDFs, and digital entitlements.
            </p>
          </div>

          <PromotionalFaqGroup items={faqItems} />
        </div>
      </section>

      {/* Final High-Converting Promotional Banner */}
      <section className="section" style={{ paddingBottom: '96px' }}>
        <div className="wrap">
          <div className="final-promo-card">
            <div className="eyebrow" style={{ color: '#dfb65f' }}>
              Ready to Transform Your Mathematics Scores?
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4.5vw, 44px)', margin: '12px 0 16px', color: '#fffdf8' }}>
              Download Your Class Worksheets Today.
            </h2>
            <p style={{ color: '#ebdcd6', fontSize: '16.5px', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Join thousands of CBSE students across India who study with clarity, eliminate calculation errors, and walk
              into board exams with absolute confidence.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/worksheets" className="btn btn-gold btn-lg">
                Explore All Worksheets <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/919874169625?text=Hello%20Ganit%20Adda,%20I%20am%20interested%20in%20worksheets"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-gold btn-lg"
              >
                Chat on WhatsApp (+91 98741 69625)
              </a>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '13px', color: '#ecd7d2', flexWrap: 'wrap' }}>
              <span>✓ Instant PDF Downloads</span>
              <span>•</span>
              <span>✓ Lifetime Personal Dashboard Access</span>
              <span>•</span>
              <span>✓ 256-Bit Secure UPI & Card Payments</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
