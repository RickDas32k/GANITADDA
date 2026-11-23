import Link from 'next/link';
import { Target, Compass, Sparkles, BookOpen, Heart, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | Our Mission & Educational Philosophy | GANIT ADDA',
  description:
    'Learn about Ganit Adda: our dedication to simplifying mathematics, building conceptual foundations, and guiding CBSE students from Classes VI to XII toward academic mastery.',
};

export default function AboutPage() {
  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap wrap-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="eyebrow">Our Story & Mission</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', margin: '12px 0 16px' }}>
            Mathematics with Meaning
          </h1>
          <p className="subheading" style={{ fontSize: '18px' }}>
            We believe that every student has the capacity to understand and excel in mathematics when guided with
            patience, structured progression, and conceptual clarity.
          </p>
        </div>

        {/* Chalkboard Manifesto Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
            color: '#fffdf8',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(32px, 5vw, 56px)',
            marginBottom: '56px',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              lineHeight: 1.3,
              color: 'var(--gold-light)',
              marginBottom: '20px',
            }}
          >
            "Understand the concept.<br />Master the method.<br />Build confidence."
          </div>
          <p style={{ color: '#ecd7d2', fontSize: '16.5px', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto' }}>
            Too often, students learn to fear mathematics because they are forced into rote memorization without
            understanding the 'why'. At Ganit Adda, we disassemble complex mathematical ideas into intuitive,
            digestible steps.
          </p>
        </div>

        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '56px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <Target size={32} color="var(--maroon)" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--maroon)', fontSize: '22px', margin: '0 0 12px' }}>Our Mission</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              To provide affordable, premium-quality mathematical worksheets, chapter-wise question banks, and
              unambiguous worked solutions that bridge learning gaps for CBSE students across Classes VI through XII.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <Compass size={32} color="var(--gold-dark)" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--maroon)', fontSize: '22px', margin: '0 0 12px' }}>Our Core Pillars</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              Deliberate practice, progressive difficulty, rigorous proof structuring, and zero ambiguous shortcuts. We
              prepare students not just for examinations, but for analytical thinking.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', background: 'var(--cream-soft)', padding: '48px 32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
          <h2 className="heading-serif" style={{ fontSize: '28px', marginBottom: '12px' }}>
            Ready to Transform Your Mathematics Learning?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15.5px', maxWidth: '520px', margin: '0 auto 28px' }}>
            Explore our curated worksheet catalog or contact our educators for personalized guidance.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/worksheets" className="btn btn-primary">
              Explore Worksheets <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
