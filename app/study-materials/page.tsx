import Link from 'next/link';
import { getWorksheets } from '@/lib/worksheets';
import WorksheetCard from '@/components/WorksheetCard';
import { FileText, Sparkles, BookMarked, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Mathematics Study Materials, Revision Notes & Formulas | GANIT ADDA',
  description:
    'Download revision notes, formula handbooks, chapter summaries, and high-yield examination preparation materials for CBSE Classes 6 to 12.',
};

export default async function StudyMaterialsPage() {
  const materials = await getWorksheets();

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="wrap">
        <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
          <div className="eyebrow">High-Yield Revision</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 14px' }}>
            Study Materials & Formula Sheets
          </h1>
          <p className="subheading">
            Concise formula sheets, theorem reference tables, and chapter-wise revision summaries designed for quick
            memory consolidation before unit tests and board exams.
          </p>
        </div>

        {/* Categories Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <BookMarked size={28} color="var(--maroon)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--maroon)', margin: '0 0 8px', fontSize: '18px' }}>Formula Handbooks</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 14px' }}>
              One-page printable cheat sheets with every theorem and algebraic identity.
            </p>
            <Link href="/worksheets?type=formula_sheet" className="btn btn-outline btn-sm">
              View Formulas
            </Link>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <FileText size={28} color="var(--gold-dark)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--maroon)', margin: '0 0 8px', fontSize: '18px' }}>Chapter Summaries</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 14px' }}>
              Quick conceptual review maps identifying typical board examination pitfalls.
            </p>
            <Link href="/worksheets?type=study_material" className="btn btn-outline btn-sm">
              View Notes
            </Link>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <Sparkles size={28} color="var(--success)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--maroon)', margin: '0 0 8px', fontSize: '18px' }}>Question Banks</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 14px' }}>
              Graded questions from Level 1 foundations to Level 3 Olympiad/Exemplar standards.
            </p>
            <Link href="/worksheets" className="btn btn-outline btn-sm">
              Explore Banks
            </Link>
          </div>
        </div>

        <div className="worksheet-grid">
          {materials.map((item) => (
            <WorksheetCard key={item.id} worksheet={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
