export const metadata = {
  title: 'Privacy Policy | GANIT ADDA',
  description: 'Privacy Policy and data protection terms for Ganit Adda educational platform users.',
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow">Data Privacy & Security</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 24px' }}>
          Privacy Policy
        </h1>
        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '32px' }}>
          Last Updated: November 2026
        </small>

        <div className="card" style={{ padding: '36px', lineHeight: 1.8, fontSize: '15px', color: 'var(--ink)' }}>
          <h2 style={{ color: 'var(--maroon)', fontSize: '20px', marginTop: 0 }}>1. Introduction</h2>
          <p>
            Welcome to Ganit Adda ("we", "our", or "us"). We are committed to safeguarding the personal privacy of our
            students, parents, and visitors. This Privacy Policy describes how we collect, store, utilize, and protect
            your information when you visit our website (ganit-adda.vercel.app) or purchase educational worksheets and
            digital materials.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>2. Information We Collect</h2>
          <ul>
            <li><strong>Account Details:</strong> Full name, email address, mobile number, and encrypted password hash.</li>
            <li><strong>Order & Transaction Records:</strong> Transaction identifiers, purchased worksheets, and order timestamps (we never store debit/credit card numbers or UPI PINs; payments are processed securely by RBI-authorized payment gateways).</li>
            <li><strong>Enquiry Data:</strong> Information submitted via our demo booking or contact forms.</li>
            <li><strong>Technical Logs:</strong> IP address, browser type, and download audit logs to ensure security and prevent account abuse.</li>
          </ul>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>3. How We Use Your Information</h2>
          <p>
            We process your personal information strictly for legitimate educational and e-commerce purposes, including:
          </p>
          <ul>
            <li>Providing immediate access to purchased downloadable worksheets and solutions.</li>
            <li>Sending transactional order confirmations and password reset instructions.</li>
            <li>Addressing customer support inquiries submitted by parents or students.</li>
            <li>Maintaining account security and auditing digital download entitlements.</li>
          </ul>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>4. Data Protection & Security</h2>
          <p>
            We implement industry-standard encryption protocols (HTTPS/TLS) across all website transactions. Customer
            passwords are encrypted using bcrypt hashing. Download links for purchased PDFs are protected with
            short-lived cryptographically signed tokens.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>5. Contact Information</h2>
          <p>
            For any questions or privacy inquiries, please contact our Data Protection Officer at:
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
