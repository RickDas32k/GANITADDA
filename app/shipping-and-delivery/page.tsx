export const metadata = {
  title: 'Digital Delivery & Shipping Terms | GANIT ADDA',
  description: 'Instant Electronic Delivery Policy for downloadable mathematics worksheets.',
};

export default function ShippingAndDeliveryPage() {
  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap wrap-narrow">
        <div className="eyebrow">Fulfillment Policy</div>
        <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 24px' }}>
          Shipping & Delivery Policy
        </h1>
        <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '32px' }}>
          Last Updated: November 2026
        </small>

        <div className="card" style={{ padding: '36px', lineHeight: 1.8, fontSize: '15px', color: 'var(--ink)' }}>
          <h2 style={{ color: 'var(--maroon)', fontSize: '20px', marginTop: 0 }}>1. Electronic Digital Delivery</h2>
          <p>
            Ganit Adda exclusively provides <strong>digital downloadable educational goods</strong> (PDF mathematics
            worksheets, step-by-step solutions, revision guides, and mock tests).
          </p>
          <p>
            <strong>No Physical Shipping:</strong> We do not dispatch physical books, printed paper copies, or postal
            parcels. Consequently, there are zero physical shipping fees or courier delays.
          </p>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>2. Instant Access Timeline</h2>
          <p>
            Delivery is instant and automated:
          </p>
          <ul>
            <li><strong>Immediate Dashboard Access:</strong> Upon successful verification of your payment through our payment gateway, your account is immediately entitled to the purchased resources.</li>
            <li><strong>Email Confirmation:</strong> An order confirmation containing your invoice receipt and download link is simultaneously sent to your registered email address within 2 minutes of payment.</li>
          </ul>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>3. How to Access Your Downloads</h2>
          <ol>
            <li>Log in to your Ganit Adda account at <a href="/login" style={{ color: 'var(--maroon)', fontWeight: 'bold' }}>ganitadda.in/login</a>.</li>
            <li>Navigate to your <strong>Student Dashboard &gt; My Downloads</strong>.</li>
            <li>Click the "Download PDF" button next to any entitled worksheet to save or print the file immediately.</li>
          </ol>

          <h2 style={{ color: 'var(--maroon)', fontSize: '20px' }}>4. Assistance with Downloads</h2>
          <p>
            If you encounter any network interruption during checkout or do not see your files in your dashboard within
            5 minutes, please contact us immediately:
            <br />
            <strong>Phone:</strong> 9874169625
            <br />
            <strong>WhatsApp:</strong> +91 98741 69625
            <br />
            <strong>Email:</strong> madeeasyganit@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}
