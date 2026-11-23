'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, School, Target, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Dhritiman Mitra',
    email: 'madeeasyganit@gmail.com',
    phone: '9874169625',
    school: 'CBSE Model Senior Secondary School',
    classLevel: 'X',
    targetExam: 'CBSE Class 10 Board 2026',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="card" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
        <h1 className="heading-serif" style={{ fontSize: '24px', margin: '0 0 4px' }}>
          My Student Profile
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
          Manage your personal learning profile, school details, and target examination goals.
        </p>
      </div>

      {saved && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Registered Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={profile.email}
              readOnly
              style={{ background: 'var(--cream-soft)', color: 'var(--muted)' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">WhatsApp Mobile Number</label>
            <input
              id="phone"
              className="form-input"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="classLevel">Current Class</label>
            <select
              id="classLevel"
              className="form-select"
              value={profile.classLevel}
              onChange={(e) => setProfile({ ...profile, classLevel: e.target.value })}
            >
              <option value="VI">Class 6th</option>
              <option value="VII">Class 7th</option>
              <option value="VIII">Class 8th</option>
              <option value="IX">Class 9th</option>
              <option value="X">Class 10th</option>
              <option value="XI">Class 11th</option>
              <option value="XII">Class 12th</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="school">School Name</label>
            <input
              id="school"
              className="form-input"
              value={profile.school}
              onChange={(e) => setProfile({ ...profile, school: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" htmlFor="targetExam">Target Exam / Goal</label>
            <input
              id="targetExam"
              className="form-input"
              value={profile.targetExam}
              onChange={(e) => setProfile({ ...profile, targetExam: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
