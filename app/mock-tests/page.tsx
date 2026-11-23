import Link from 'next/link';
import { Clock, Award, CheckCircle2, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'CBSE Mathematics Mock Tests & Sample Papers | GANIT ADDA',
  description:
    'Full-length timed CBSE Mathematics mock tests, chapter-wise assessment series, and marking scheme rubrics for Classes 6 to 12.',
};

export default function MockTestsPage() {
  const tests = [
    {
      id: 'mock-cbse-10-full',
      title: 'Class 10 CBSE Mathematics Pre-Board Model Exam (Standard & Basic)',
      classLevel: 'X',
      durationMinutes: 180,
      totalMarks: 80,
      sections: 5,
      questions: 38,
      difficulty: 'Hard',
      price: '₹149',
      isFree: false,
      description:
        'Full 80-mark mock paper simulating the exact CBSE board examination environment. Includes case-based questions, 2-mark reasoning, and detailed official marking rubrics.',
    },
    {
      id: 'mock-cbse-12-calculus',
      title: 'Class 12 Calculus Mega Test (Continuity, Differentiability & Integrals)',
      classLevel: 'XII',
      durationMinutes: 120,
      totalMarks: 50,
      sections: 4,
      questions: 24,
      difficulty: 'Hard',
      price: '₹199',
      isFree: false,
      description:
        'Focused high-yield test strictly evaluating integration by parts, partial fractions, max-min word problems, and differential equations.',
    },
    {
      id: 'mock-cbse-9-term',
      title: 'Class 9 Annual Mathematics Foundation Assessment Paper',
      classLevel: 'IX',
      durationMinutes: 120,
      totalMarks: 50,
      sections: 4,
      questions: 25,
      difficulty: 'Medium',
      price: 'Free',
      isFree: true,
      description:
        'Comprehensive diagnostic assessment for Class 9 mathematics covering Real Numbers, Polynomials, Linear Equations, and Geometry proofs.',
    },
    {
      id: 'mock-cbse-10-trig',
      title: 'Class 10 Trigonometry & Applications Speed Test',
      classLevel: 'X',
      durationMinutes: 60,
      totalMarks: 30,
      sections: 3,
      questions: 15,
      difficulty: 'Medium',
      price: '₹79',
      isFree: false,
      description:
        'Timed speed test designed to eliminate calculation hesitation in height-and-distance word problems and trigonometric proofs.',
    },
  ];

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="wrap">
        <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
          <div className="eyebrow">Exam-Condition Simulation</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 14px' }}>
            CBSE Mathematics Mock Tests
          </h1>
          <p className="subheading">
            Timed test series with official CBSE marking rubrics. Practise exam time allocation, question selection,
            and presentation discipline to maximize your board score.
          </p>
        </div>

        {/* Test Listing Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {tests.map((test) => (
            <div key={test.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-maroon">Class {test.classLevel}</span>
                  <span className="badge badge-gold">{test.difficulty}</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: test.isFree ? 'var(--success)' : 'var(--maroon)' }}>
                  {test.price}
                </span>
              </div>

              <h3 style={{ fontSize: '18.5px', color: 'var(--maroon)', margin: '0 0 10px', lineHeight: 1.35 }}>
                {test.title}
              </h3>

              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 20px', flexGrow: 1 }}>
                {test.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--cream-soft)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>
                <div>
                  <Clock size={16} color="var(--gold-dark)" style={{ margin: '0 auto 4px' }} />
                  <div><strong>{test.durationMinutes}</strong> mins</div>
                </div>
                <div>
                  <Award size={16} color="var(--maroon)" style={{ margin: '0 auto 4px' }} />
                  <div><strong>{test.totalMarks}</strong> Marks</div>
                </div>
                <div>
                  <FileCheck size={16} color="var(--success)" style={{ margin: '0 auto 4px' }} />
                  <div><strong>{test.questions}</strong> Qs</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/worksheets" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Get Mock Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
