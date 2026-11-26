import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="state-page">
      <div className="wrap-narrow">
        <div className="state-glyph">4<em>0</em>4</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: '8px 0 10px' }}>
          This page didn&apos;t add up
        </h1>
        <p className="subheading">The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to the worksheets.</p>
        <div className="state-actions">
          <Link href="/worksheets" className="btn btn-primary">Browse worksheets</Link>
          <Link href="/" className="btn btn-outline">Go home</Link>
        </div>
      </div>
    </main>
  );
}
