'use client';

import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Send, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      setError('A network error occurred. Please try again or reach us directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '56px 0 96px' }}>
      <div className="wrap">
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
          <div className="eyebrow">Get in Touch</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: '8px 0 14px' }}>
            Contact Ganit Adda
          </h1>
          <p className="subheading">
            Whether you have questions about specific worksheets, need guidance on curriculum selection, or wish to
            inquire about online personalized learning sessions, we are here to assist.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          {/* Left: Contact Channels */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '22px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Phone size={22} />
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Phone Support</small>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--maroon)' }}>
                    <a href="tel:9874169625">+91 98741 69625</a>
                  </div>
                  <small style={{ color: 'var(--muted)' }}>Mon–Sat, 10:00 AM – 7:00 PM IST</small>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '22px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--cream)', color: 'var(--maroon)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Direct Email</small>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--maroon)' }}>
                    <a href="mailto:madeeasyganit@gmail.com">madeeasyganit@gmail.com</a>
                  </div>
                  <small style={{ color: 'var(--muted)' }}>Responses typically within 24 hours</small>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '22px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e8f5e9', color: 'var(--success)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <MessageSquare size={22} />
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Instant WhatsApp</small>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>
                    <a href="https://wa.me/919874169625" target="_blank" rel="noreferrer">
                      Chat on WhatsApp
                    </a>
                  </div>
                  <small style={{ color: 'var(--muted)' }}>Direct message for prompt answers</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact & Enquiry Form */}
          <div className="card" style={{ padding: '36px' }}>
            <h2 className="heading-serif" style={{ fontSize: '24px', margin: '0 0 8px' }}>
              Send an Enquiry
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '24px' }}>
              Fill in your details and our team will get in touch with you shortly.
            </p>

            {success ? (
              <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(46,125,50,0.2)', padding: '24px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: 'var(--success)', margin: '0 0 6px', fontSize: '18px' }}>Enquiry Received!</h3>
                <p style={{ color: 'var(--ink)', fontSize: '14.5px', margin: 0 }}>
                  Thank you for reaching out. We have received your message and will contact you via WhatsApp or phone
                  promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="student_name">
                    Student / Parent Name *
                  </label>
                  <input
                    id="student_name"
                    name="student_name"
                    className="form-input"
                    placeholder="e.g. Ananya Sen"
                    required
                    maxLength={120}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. 9874169625"
                    required
                    maxLength={30}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="class_level">
                    Class / Grade Level *
                  </label>
                  <select id="class_level" name="class_level" className="form-select" defaultValue="X">
                    <option value="VI">Class 6th</option>
                    <option value="VII">Class 7th</option>
                    <option value="VIII">Class 8th</option>
                    <option value="IX">Class 9th</option>
                    <option value="X">Class 10th (CBSE)</option>
                    <option value="XI">Class 11th</option>
                    <option value="XII">Class 12th (CBSE)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    How can we assist you?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell us about the chapters you are working on, doubt clearing needs, or worksheet questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  <Send size={16} /> {loading ? 'Submitting Enquiry...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
