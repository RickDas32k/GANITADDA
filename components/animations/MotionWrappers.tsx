'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Check,
  Copy,
  ChevronDown,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';

// Emil Kowalski & Apple fluid motion tokens
export const springSmooth = {
  type: 'spring' as const,
  damping: 26,
  stiffness: 260,
  mass: 0.9,
};

export const springSnappy = {
  type: 'spring' as const,
  damping: 22,
  stiffness: 340,
};

export const springBouncy = {
  type: 'spring' as const,
  damping: 15,
  stiffness: 300,
};

export const easeOutUI = [0.23, 1, 0.32, 1] as const;

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = 18;
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ ...springSmooth, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerChildren = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: 0.04,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: springSmooth,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingMathSymbols() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  const symbols = [
    { char: 'π', top: '12%', left: '8%', size: 48, duration: 22, delay: 0 },
    { char: '√x', top: '24%', right: '10%', size: 52, duration: 24, delay: 2 },
    { char: '∑', top: '72%', left: '12%', size: 58, duration: 26, delay: 1 },
    { char: '∫', top: '65%', right: '14%', size: 66, duration: 22, delay: 3 },
    { char: 'x²', top: '42%', right: '4%', size: 40, duration: 18, delay: 0.5 },
    { char: 'Δ', top: '82%', right: '32%', size: 42, duration: 21, delay: 2.5 },
    { char: '∞', top: '38%', left: '4%', size: 46, duration: 25, delay: 1.5 },
  ];

  return (
    <div className="hero-symbols" aria-hidden="true">
      {symbols.map((s, i) => (
        <motion.div
          key={i}
          className="floating-symbol"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: `${s.size}px`,
          }}
          animate={{
            y: [-10, 12, -10],
            rotate: [-3, 4, -3],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        >
          {s.char}
        </motion.div>
      ))}
    </div>
  );
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1.2,
  suffix = '',
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(from);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(to);
      return;
    }

    let start = from;
    const end = to;
    const stepTime = Math.max(10, Math.floor((duration * 1000) / (end - start || 1)));
    const timer = setInterval(() => {
      start += Math.ceil((end - from) / 30) || 1;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [from, to, duration, shouldReduceMotion]);

  return (
    <span>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

// 1-Click Promotional Coupon Copy with Feedback
export function CouponCopyButton({ code = 'WELCOME20' }: { code?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={handleCopy}
      className="promo-copy-btn"
      aria-label={`Copy coupon code ${code}`}
      title="Click to copy coupon code"
    >
      <span className="promo-code-text">{code}</span>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={springSnappy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#a5d6a7', fontWeight: 800 }}
          >
            <Check size={12} strokeWidth={3} /> COPIED
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={springSnappy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          >
            <Copy size={11} /> COPY
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Interactive Mathematical Concept Explorer
export function InteractiveFormulaShowcase() {
  const [activeTab, setActiveTab] = useState<'algebra' | 'trig' | 'calculus' | 'quad'>('algebra');
  const shouldReduceMotion = useReducedMotion();

  const concepts = {
    algebra: {
      title: 'Algebraic Identity & Sign Traps',
      grade: 'Class IX & X',
      formula: '(a - b)³ = a³ - 3a²b + 3ab² - b³',
      explanation: 'Never confuse alternating signs again. Expand with visual geometry models.',
      keyTakeaway: 'Eliminates - vs + calculation traps in CBSE 4-mark questions',
      sampleTag: 'Foundation Mastery',
    },
    trig: {
      title: 'Pythagorean Trigonometric Identities',
      grade: 'Class X & XI',
      formula: 'sin²θ + cos²θ = 1 ⟹ sec²θ - tan²θ = 1',
      explanation: 'Derived from the unit circle so you never have to memorize them blindly.',
      keyTakeaway: 'Tested in 100% of CBSE Class 10 Board proof sections',
      sampleTag: 'High-Yield Proof',
    },
    calculus: {
      title: 'Integration by Parts (ILATE Rule)',
      grade: 'Class XII',
      formula: '∫ u·v dx = u ∫ v dx - ∫ [u\' ∫ v dx] dx',
      explanation: 'Structured prioritization order: Inverse, Log, Algebraic, Trig, Exponential.',
      keyTakeaway: 'Guaranteed 5-mark section question in CBSE 12th Board',
      sampleTag: 'Board Priority',
    },
    quad: {
      title: 'Discriminant Nature of Roots',
      grade: 'Class X',
      formula: 'D = b² - 4ac ⟹ Real, Equal or Non-Real',
      explanation: 'Direct test that determines nature of roots without factoring complex equations.',
      keyTakeaway: 'Instant validation for speed-distance and age word problems',
      sampleTag: 'Zero-Error Formula',
    },
  };

  const current = concepts[activeTab];

  return (
    <div className="math-glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div className="eyebrow" style={{ color: 'var(--gold-light)' }}>
          {current.grade} • {current.sampleTag}
        </div>
        <span className="badge badge-gold" style={{ background: 'rgba(223, 182, 95, 0.18)', color: '#fff' }}>
          Interactive Formula
        </span>
      </div>

      {/* Concept Selector Pill Tabs */}
      <div className="formula-tabs-bar" role="tablist">
        {(
          [
            { id: 'algebra', label: 'Algebra' },
            { id: 'trig', label: 'Trigonometry' },
            { id: 'calculus', label: 'Calculus' },
            { id: 'quad', label: 'Quadratics' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`formula-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : 'activeFormulaTab'}
                className="formula-tab-indicator"
                transition={springSnappy}
              />
            )}
          </button>
        ))}
      </div>

      {/* Animated Formula Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: easeOutUI }}
        >
          <div className="math-formula-display">{current.formula}</div>
          <h4 style={{ color: '#fff8ee', margin: '4px 0 8px', fontSize: '18px', fontWeight: 700 }}>
            {current.title}
          </h4>
          <p style={{ color: '#ebdcd6', fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 16px' }}>
            {current.explanation}
          </p>
          <div style={{ background: 'rgba(0,0,0,0.22)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gold-light)', fontSize: '13px', color: '#ffecbf', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--gold-light)" style={{ flexShrink: 0 }} />
            <span>{current.keyTakeaway}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Interactive Grade Selector for Promotional Showcase
export function InteractiveClassExplorer() {
  const [selectedClass, setSelectedClass] = useState<string>('X');
  const shouldReduceMotion = useReducedMotion();

  const classData: Record<
    string,
    {
      name: string;
      grade: string;
      focus: string;
      worksheetsCount: number;
      curriculum: string[];
      highlight: string;
      accentColor: string;
    }
  > = {
    VI: {
      name: 'Class 6th Mathematics',
      grade: 'VI',
      focus: 'Transition from primary arithmetic to logical mathematical reasoning.',
      worksheetsCount: 45,
      curriculum: ['Knowing Our Numbers', 'Fractions & Decimals', 'Integers Foundation', 'Basic Geometrical Ideas', 'Mensuration Intro'],
      highlight: 'Eliminate sign confusion and build rock-solid foundation for middle school.',
      accentColor: 'var(--gold-dark)',
    },
    VII: {
      name: 'Class 7th Mathematics',
      grade: 'VII',
      focus: 'Algebraic expressions, rational numbers and geometric proofs.',
      worksheetsCount: 55,
      curriculum: ['Integers & BODMAS', 'Lines & Angles', 'The Triangle & Its Properties', 'Rational Numbers', 'Algebraic Expressions'],
      highlight: 'Visual step-by-step models that eliminate negative sign arithmetic traps.',
      accentColor: 'var(--maroon)',
    },
    VIII: {
      name: 'Class 8th Mathematics',
      grade: 'VIII',
      focus: 'Bridging middle school to high school board exam foundations.',
      worksheetsCount: 60,
      curriculum: ['Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Squares & Square Roots', 'Algebraic Identities', 'Mensuration'],
      highlight: 'Master word-to-algebra translation for perimeter, age, and coin problems.',
      accentColor: 'var(--maroon-light)',
    },
    IX: {
      name: 'Class 9th Mathematics',
      grade: 'IX',
      focus: 'Crucial stepping stone for Class 10 CBSE Board syllabus.',
      worksheetsCount: 75,
      curriculum: ['Number Systems', 'Polynomials & Factor Theorem', 'Coordinate Geometry', 'Linear Equations', 'Triangles & Congruence'],
      highlight: 'Rigorous theorem proofs and algebraic factorization required for Board marks.',
      accentColor: 'var(--maroon-dark)',
    },
    X: {
      name: 'Class 10th CBSE Board Special',
      grade: 'X',
      focus: 'Full CBSE Board Exam question banks with 100% worked solutions.',
      worksheetsCount: 90,
      curriculum: ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Trigonometry & Heights', 'Statistics & Probability'],
      highlight: 'Includes 10-year previous questions, case studies, and 2-mark reasoning.',
      accentColor: 'var(--maroon)',
    },
    XI: {
      name: 'Class 11th Senior Secondary',
      grade: 'XI',
      focus: 'Advanced concepts bridging school mathematics with engineering & CUET prep.',
      worksheetsCount: 80,
      curriculum: ['Sets & Relations', 'Trigonometric Functions', 'Complex Numbers', 'Permutations & Combinations', 'Limits & Derivatives'],
      highlight: 'Conceptual derivation of epsilon-delta intuition and first principles.',
      accentColor: 'var(--gold-dark)',
    },
    XII: {
      name: 'Class 12th CBSE Board & CUET Prep',
      grade: 'XII',
      focus: 'Calculus, vectors, 3D geometry and matrix algebra mastery.',
      worksheetsCount: 95,
      curriculum: ['Relations & Functions', 'Matrices & Determinants', 'Continuity & Differentiability', 'Indefinite & Definite Integrals', 'Differential Equations'],
      highlight: 'Categorizes all 15 integral forms with immediate 10-second classification tips.',
      accentColor: 'var(--maroon-dark)',
    },
  };

  const current = classData[selectedClass] || classData['X'];

  return (
    <div className="class-explorer-card">
      {/* Class Selector Bar */}
      <div className="class-selector-tabs" role="tablist">
        {(['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const).map((cls) => (
          <button
            key={cls}
            role="tab"
            aria-selected={selectedClass === cls}
            onClick={() => setSelectedClass(cls)}
            className={`class-selector-tab ${selectedClass === cls ? 'active' : ''}`}
          >
            Class {cls}
            {selectedClass === cls && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : 'activeClassPill'}
                className="class-tab-highlight"
                transition={springSnappy}
              />
            )}
          </button>
        ))}
      </div>

      {/* Details Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedClass}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: easeOutUI }}
          className="class-details-body"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-maroon">Class {current.grade}</span>
                <span className="badge badge-gold">{current.worksheetsCount}+ Worksheets Available</span>
                <span className="badge badge-green">CBSE 2026 Aligned</span>
              </div>
              <h3 style={{ margin: '4px 0 6px', fontSize: '24px', color: 'var(--maroon)', fontFamily: 'var(--font-serif)' }}>
                {current.name}
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px', maxWidth: '640px' }}>
                {current.focus}
              </p>
            </div>

            <Link
              href={`/worksheets?class=${current.grade}`}
              className="btn btn-primary btn-sm"
              style={{ padding: '10px 20px' }}
            >
              Browse Class {current.grade} Materials <ArrowRight size={15} />
            </Link>
          </div>

          {/* Curriculum Checklist */}
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '12px' }}>
              Covered Syllabus & Question Banks
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {current.curriculum.map((topic, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
                  <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--cream-soft)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--maroon)' }}>
            <Zap size={18} color="var(--gold-dark)" style={{ flexShrink: 0 }} />
            <span><strong>Exam Secret:</strong> {current.highlight}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Accessible Animated Accordion for FAQ per animate skill
export function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faq-accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : springSnappy}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={20} color="var(--maroon)" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: easeOutUI }
            }
            style={{ overflow: 'hidden' }}
          >
            <div className="faq-accordion-content">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FAQ Accordion Group
export function PromotionalFaqGroup({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          question={item.question}
          answer={<p style={{ margin: 0, lineHeight: 1.65 }}>{item.answer}</p>}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
        />
      ))}
    </div>
  );
}
