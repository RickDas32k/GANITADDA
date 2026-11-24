import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorksheetBySlug, getRelatedWorksheets } from '@/lib/worksheets';
import WorksheetCard from '@/components/WorksheetCard';
import ProductActionButtons from './ProductActionButtons';
import {
  FileText,
  CheckCircle2,
  BookOpen,
  Eye,
  ShieldCheck,
  Star,
  Download,
  Share2,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const worksheet = await getWorksheetBySlug(resolved.slug);
  if (!worksheet) return { title: 'Worksheet Not Found | GANIT ADDA' };

  return {
    title: `${worksheet.title} (Class ${worksheet.class_level}) | GANIT ADDA`,
    description: worksheet.description.slice(0, 160),
    openGraph: {
      title: `${worksheet.title} | CBSE Class ${worksheet.class_level} Maths`,
      description: worksheet.description.slice(0, 160),
    },
  };
}

export default async function WorksheetDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const worksheet = await getWorksheetBySlug(resolved.slug);

  if (!worksheet) {
    notFound();
  }

  const related = await getRelatedWorksheets(worksheet.class_level, worksheet.id);

  return (
    <main style={{ padding: '40px 0 80px' }}>
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/worksheets"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to all worksheets
          </Link>
        </div>

        {/* Product Details Grid */}
        <div className="product-details-grid">
          {/* Left Column: Product Information & Syllabus */}
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span className="badge badge-maroon">Class {worksheet.class_level}</span>
              <span className="badge badge-gold">{worksheet.difficulty} Difficulty</span>
              <span className="badge badge-blue">CBSE / NCERT</span>
              {worksheet.is_bestseller && <span className="badge badge-gold">★ Bestseller</span>}
            </div>

            <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              {worksheet.chapter}
            </div>

            <h1 className="heading-serif" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', margin: '0 0 16px', lineHeight: 1.2 }}>
              {worksheet.title}
            </h1>

            <p style={{ fontSize: '16.5px', color: 'var(--ink-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
              {worksheet.description}
            </p>

            {/* Quick Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--maroon)' }}>
                  {worksheet.number_of_questions || 35}+
                </div>
                <small style={{ color: 'var(--muted)', fontWeight: 600 }}>Questions with Solutions</small>
              </div>

              <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--maroon)' }}>
                  {worksheet.number_of_pages}
                </div>
                <small style={{ color: 'var(--muted)', fontWeight: 600 }}>Printable A4 Pages</small>
              </div>

              <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--maroon)' }}>
                  {worksheet.file_format || 'PDF'}
                </div>
                <small style={{ color: 'var(--muted)', fontWeight: 600 }}>Clean Digital Format</small>
              </div>
            </div>

            {/* Learning Objectives Box */}
            {worksheet.learning_objectives && (
              <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={20} color="var(--gold-dark)" /> Key Learning Objectives
                </h3>
                <p style={{ color: 'var(--ink-secondary)', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
                  {worksheet.learning_objectives}
                </p>
              </div>
            )}

            {/* Topics Covered */}
            {typeof worksheet.topic === 'string' && worksheet.topic.trim() && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--maroon)', fontSize: '18px', marginBottom: '10px' }}>
                  Specific Topics Covered
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {worksheet.topic.split(',').map((t, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--paper)',
                        border: '1px solid var(--line)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13.5px',
                        color: 'var(--ink)',
                      }}
                    >
                      ✓ {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Safe Public Sample Preview (Important: Never exposes paid full PDF) */}
            <div style={{ background: 'var(--cream-soft)', border: '1px dashed var(--line-strong)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ color: 'var(--maroon)', fontSize: '18px', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} /> Sample Watermarked Preview
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                Browse sample questions and verification format. Complete step-by-step worked solutions and full PDF
                are unlocked immediately upon purchase.
              </p>
              <div style={{ background: 'var(--paper)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--maroon)' }}>
                    Sample Preview Pages (Watermarked)
                  </div>
                  <small style={{ color: 'var(--muted)' }}>Sample questions 1 to 5</small>
                </div>
                {worksheet.preview_pdf_url ? (
                  <a
                    href={worksheet.preview_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={15} /> Preview Sample Pages
                  </a>
                ) : (
                  <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} /> Sample Preview
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Purchase Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  {worksheet.is_free || (worksheet.price_paise || 0) === 0 ? (
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)' }}>
                      FREE
                    </span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--maroon)' }}>
                        ₹{((worksheet.price_paise || 0) / 100).toFixed(0)}
                      </span>
                      {worksheet.original_price_paise && worksheet.original_price_paise > (worksheet.price_paise || 0) && (
                        <span style={{ fontSize: '18px', color: 'var(--muted-light)', textDecoration: 'line-through' }}>
                          ₹{((worksheet.original_price_paise || 0) / 100).toFixed(0)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className="badge badge-green">Instant Access</span>
              </div>

              {/* Client Action Buttons (Add to Cart, Buy Now) */}
              <ProductActionButtons worksheet={worksheet} />

              <div style={{ borderTop: '1px solid var(--line)', margin: '24px 0', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: '14px' }}>
                  What's Included:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--ink)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Complete Chapter-wise Question Bank
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Step-by-Step Worked Solutions
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Printable High-Resolution PDF
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Lifetime Access in Personal Dashboard
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> 100% CBSE & NCERT Aligned
                  </li>
                </ul>
              </div>

              <div style={{ background: 'var(--cream)', padding: '14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                <ShieldCheck size={20} color="var(--gold-dark)" style={{ flexShrink: 0 }} />
                <span>Protected payment verification with safe electronic digital delivery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Worksheets Section */}
        {related.length > 0 && (
          <div style={{ marginTop: '72px', borderTop: '1px solid var(--line)', paddingTop: '48px' }}>
            <h2 className="heading-serif" style={{ fontSize: '28px', marginBottom: '24px' }}>
              More Class {worksheet.class_level} Mathematics Materials
            </h2>
            <div className="worksheet-grid">
              {related.map((item) => (
                <WorksheetCard key={item.id} worksheet={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
