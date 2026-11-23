import { NextResponse } from 'next/server';
import { sqlClient, isDbConfigured } from '@/lib/db';

const allowed = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const name = String(data.get('student_name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const level = String(data.get('class_level') || '');
    const message = String(data.get('message') || '').trim();

    if (name.length < 2 || name.length > 120 || phone.length < 7 || phone.length > 30 || !allowed.includes(level)) {
      return NextResponse.json({ error: 'Please enter valid details.' }, { status: 400 });
    }

    if (isDbConfigured()) {
      try {
        const sql = sqlClient();
        await sql`INSERT INTO enquiries(student_name,phone,class_level,message) VALUES(${name},${phone},${level},${message.slice(0, 1000)})`;
      } catch (dbErr) {
        console.warn('[Lead Submission] Neon DB not accessible, enquiry recorded in server logs:', { name, phone, level, message });
      }
    } else {
      console.log('[Lead Submission - Sandbox Mode]:', { name, phone, level, message });
    }

    return NextResponse.redirect(new URL('/?enquiry=received#classes', req.url), 303);
  } catch (e) {
    console.error('Leads submission error:', e);
    return NextResponse.json({ error: 'Could not submit enquiry. Please try again.' }, { status: 500 });
  }
}

