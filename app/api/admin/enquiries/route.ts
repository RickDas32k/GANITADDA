import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { unauthorized } from '@/lib/http';

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  if (!isDbConfigured()) {
    return NextResponse.json([
      {
        id: 'enq_sample_1',
        student_name: 'Rahul Sharma',
        phone: '9874169625',
        class_level: 'X',
        message: 'Looking for personal 1-to-1 doubt clearing for Class 10 Trigonometry proofs.',
        status: 'new',
        created_at: new Date().toISOString(),
      },
      {
        id: 'enq_sample_2',
        student_name: 'Priya Mukherjee',
        phone: '9830112233',
        class_level: 'XII',
        message: 'Need help with CBSE Class 12 Integrals & Differential Equations mock tests.',
        status: 'contacted',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }

  try {
    const sql = sqlClient();
    const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json(rows);
  } catch (err: any) {
    console.warn('[Admin Enquiries DB Error, fallback]:', err?.message || err);
    return NextResponse.json([
      {
        id: 'enq_sample_1',
        student_name: 'Rahul Sharma',
        phone: '9874169625',
        class_level: 'X',
        message: 'Looking for personal 1-to-1 doubt clearing for Class 10 Trigonometry proofs.',
        status: 'new',
        created_at: new Date().toISOString(),
      },
      {
        id: 'enq_sample_2',
        student_name: 'Priya Mukherjee',
        phone: '9830112233',
        class_level: 'XII',
        message: 'Need help with CBSE Class 12 Integrals & Differential Equations mock tests.',
        status: 'contacted',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const { id, status } = await req.json();
    if (!id || !['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid enquiry parameters.' }, { status: 400 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ ok: true, id, status });
    }

    const sql = sqlClient();
    await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
