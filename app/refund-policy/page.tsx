export const metadata = {
  title: 'Cancellation & Refund Policy | GANIT ADDA',
  description: 'Cancellation and Refund Policy for digital educational products on Ganit Adda.',
};

export default function RefundPolicyPage() {
  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow">Customer Care</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 24px' }}>
          Cancellation & Refund Policy
        </h1>
        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '32px' }}>
          Last Updated: November 2026
        </small>

        <div className="card" style={{ padding: '36px', lineHeight: 1.8, fontSize: '15px', color: 'var(--ink)' }}>
          <h2 style={{ color: 'var(--maroon)', fontSize: '20px', marginTop: 0 }}>1. Nature of Digital Products</h2>
          <p>
            Due to the immediate digital nature of educational PDF worksheets and worked solutions, all sales are
            generally considered final once a file has been downloaded or unlocked in your dashboard.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>2. Eligibility for Refunds</h2>
          <p>We are committed to fair customer treatment. Refunds will gladly be issued under the following conditions:</p>
          <ul>
            <li><strong>Duplicate Charges:</strong> In the event that your payment gateway account was debited multiple times for a single order due to a network glitch.</li>
            <li><strong>Technical Inaccessibility:</strong> If you were unable to download the purchased PDF file due to a verified server error that our technical team cannot resolve within 48 hours of reporting.</li>
            <li><strong>Accidental Duplicate Purchase:</strong> If you accidentally purchase the exact same worksheet twice on the same student account.</li>
          </ul>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>3. How to Request a Refund</h2>
          <p>
            To request a refund, please contact our support desk within <strong>7 days</strong> of the transaction date with:
          </p>
          <ul>
            <li>Your Order ID (e.g. GA-202611-XXXX)</li>
            <li>Registered Email Address</li>
            <li>Payment Reference ID from UPI/Card statement</li>
            <li>Description of the technical issue encountered</li>
          </ul>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>4. Refund Processing Time</h2>
          <p>
            Approved refunds are initiated via the original payment provider within 2 business days. The funds typically
            reflect in your bank account or UPI source within 5–7 business days as per banking processing cycles.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>5. Contact Support</h2>
          <p>
            <strong>Phone:</strong> 9874169625
            <br />
            <strong>Email:</strong> madeeasyganit@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}
