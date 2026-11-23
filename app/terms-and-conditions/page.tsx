export const metadata = {
  title: 'Terms & Conditions | GANIT ADDA',
  description: 'Terms and Conditions governing the use of Ganit Adda educational worksheet platform.',
};

export default function TermsPage() {
  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow">Legal Agreement</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 24px' }}>
          Terms & Conditions
        </h1>
        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '32px' }}>
          Last Updated: November 2026
        </small>

        <div className="card" style={{ padding: '36px', lineHeight: 1.8, fontSize: '15px', color: 'var(--ink)' }}>
          <h2 style={{ color: 'var(--maroon)', fontSize: '20px', marginTop: 0 }}>1. Agreement to Terms</h2>
          <p>
            By accessing or using the Ganit Adda platform, purchasing digital worksheets, or submitting inquiries, you
            agree to be legally bound by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>2. Digital Products & Licensing</h2>
          <p>
            All worksheets, NCERT solutions, mock test papers, and formula guides provided on Ganit Adda are digital
            educational downloads. Upon verified payment, you are granted a non-exclusive, non-transferable, personal
            learning license to download and print materials for personal educational use.
          </p>
          <p>
            <strong>Prohibited Activities:</strong> Re-selling, mass distribution, public uploading, or commercial
            redistribution of Ganit Adda materials without written permission is strictly prohibited.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>3. Pricing & Payments</h2>
          <p>
            All prices are stated in Indian Rupees (INR) and are subject to change without prior notice. Payments are
            processed via authorized payment gateways supporting UPI, debit cards, credit cards, and net banking.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>4. Intellectual Property</h2>
          <p>
            All content, including question curations, solution methodologies, logos, graphics, and instructional texts,
            remains the intellectual property of Ganit Adda.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>5. Contact Information</h2>
          <p>
            Questions regarding these Terms can be directed to:
            <br />
            <strong>Phone:</strong> 9874169625
            <br />
            <strong>Email:</strong> madeeasyganit@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}
