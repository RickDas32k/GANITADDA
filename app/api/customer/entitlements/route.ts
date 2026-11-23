import { NextResponse } from 'next/server';
import { getCurrentCustomer, isAdmin } from '@/lib/auth';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { INITIAL_MOCK_WORKSHEETS } from '@/lib/mock-data';

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    const adminOk = await isAdmin();

    if (!customer && !adminOk) {
      return NextResponse.json([], { status: 401 });
    }

    if (!isDbConfigured()) {
      // In sandbox development mode, show the first 2 worksheets as sample entitlements
      const sample = INITIAL_MOCK_WORKSHEETS.slice(0, 2).map((w, i) => ({
        id: `ent_mock_${i + 1}`,
        worksheet_id: w.id,
        title: w.title,
        class_level: w.class_level,
        chapter: w.chapter,
        difficulty: w.difficulty,
        number_of_pages: w.number_of_pages,
        download_count: 1,
        max_downloads: 100,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
      return NextResponse.json(sample);
    }

    const sql = sqlClient();
    const rows = await sql`
      SELECT e.id, e.worksheet_id, e.download_count, e.max_downloads, e.is_active, e.created_at,
             w.title, w.class_level, w.chapter, w.difficulty, w.number_of_pages
      FROM download_entitlements e
      JOIN worksheets w ON w.id = e.worksheet_id
      WHERE e.user_id = ${customer?.id} AND e.is_active = true
      ORDER BY e.created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (err: any) {
    console.error('[Customer Entitlements Error]', err);
    return NextResponse.json([]);
  }
}
