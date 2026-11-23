import Link from 'next/link';
import { getWorksheets } from '@/lib/worksheets';
import WorksheetCard from '@/components/WorksheetCard';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'NCERT Mathematics Step-by-Step Solutions | GANIT ADDA',
  description:
    'Comprehensive exercise-by-exercise NCERT mathematics solutions with conceptual breakdowns and step-by-step proofs for Classes 6 to 12.',
};

export default async function NcertSolutionsPage() {
  const solutions = await getWorksheets({ materialType: 'ncert_solution' });
  const allMaterials = solutions.length > 0 ? solutions : await getWorksheets({ limit: 6 });

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="wrap">
        <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
          <div className="eyebrow">Exercise-by-Exercise Breakdown</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 14px' }}>
            NCERT Mathematics Solutions
          </h1>
          <p className="subheading">
            Understand the complete method behind every solution. Step-by-step explanations, alternative approaches,
            and common pitfalls explained clearly by expert mathematics teachers.
          </p>
        </div>

        {/* Grade Navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'].map((lvl) => (
            <Link
              key={lvl}
              href={`/worksheets?class=${lvl}&type=ncert_solution`}
              className="card"
              style={{ textAlign: 'center', padding: '16px 12px' }}
            >
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--maroon)' }}>Class {lvl}</div>
              <small style={{ color: 'var(--muted)' }}>NCERT Exercises</small>
            </Link>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="worksheet-grid">
          {allMaterials.map((item) => (
            <WorksheetCard key={item.id} worksheet={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
