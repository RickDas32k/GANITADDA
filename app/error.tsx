'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="state-page">
      <div className="wrap-narrow">
        <div className="state-glyph">!</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(24px, 4vw, 34px)', margin: '8px 0 10px' }}>
          Something went wrong
        </h1>
        <p className="subheading">An unexpected error occurred. Please try again — your cart is safe.</p>
        <div className="state-actions">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <a href="/" className="btn btn-outline">Go home</a>
        </div>
      </div>
    </main>
  );
}
