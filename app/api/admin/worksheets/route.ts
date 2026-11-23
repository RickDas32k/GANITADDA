import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { unauthorized, serverError } from '@/lib/http';
import { INITIAL_MOCK_WORKSHEETS } from '@/lib/mock-data';

const levels = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  if (!isDbConfigured()) {
    return NextResponse.json(INITIAL_MOCK_WORKSHEETS);
  }

  try {
    const sql = sqlClient();
    const rows = await sql`SELECT * FROM worksheets ORDER BY created_at DESC`;
    return NextResponse.json(rows.length > 0 ? rows : INITIAL_MOCK_WORKSHEETS);
  } catch (e) {
    console.warn('[Admin Worksheets DB Error, fallback to mock data]:', e);
    return NextResponse.json(INITIAL_MOCK_WORKSHEETS);
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get('file');
    const title = String(form.get('title') || '').trim();
    const level = String(form.get('class_level') || '');
    const chapter = String(form.get('chapter') || '').trim();
    const topic = String(form.get('topic') || '').trim();
    const difficulty = String(form.get('difficulty') || 'Medium');
    const materialType = String(form.get('material_type') || 'worksheet');
    const description = String(form.get('description') || '').trim();
    const learningObjectives = String(form.get('learning_objectives') || '').trim();
    const questionsCount = Number(form.get('number_of_questions') || 30);
    const pagesCount = Number(form.get('number_of_pages') || 10);
    const priceRupees = Number(form.get('price_rupees') || 0);
    const originalPriceRupees = Number(form.get('original_price_rupees') || 0);
    const isFree = form.get('is_free') === 'true' || priceRupees === 0;
    const isFeatured = form.get('is_featured') === 'true';
    const isBestseller = form.get('is_bestseller') === 'true';

    if (title.length < 2 || !levels.includes(level) || chapter.length < 2) {
      return NextResponse.json({ error: 'Please check worksheet details.' }, { status: 400 });
    }

    const pricePaise = Math.round(priceRupees * 100);
    const originalPricePaise = originalPriceRupees > 0 ? Math.round(originalPriceRupees * 100) : null;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    let blobUrl = '/assets/samples/sample_worksheet.pdf';
    let blobPathname = 'worksheets/sample.pdf';
    let fileSize = 1500000;

    // Handle File Upload if provided
    if (file instanceof File && file.size > 0) {
      fileSize = file.size;
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(
          `worksheets/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          file,
          { access: 'public', addRandomSuffix: true, contentType: 'application/pdf' }
        );
        blobUrl = blob.url;
        blobPathname = blob.pathname;
      }
    }

    if (!isDbConfigured()) {
      const mockWs = {
        id: `ws_new_${Date.now()}`,
        title,
        slug,
        class_level: level,
        subject: 'Mathematics',
        chapter,
        topic,
        difficulty,
        material_type: materialType,
        description,
        learning_objectives: learningObjectives,
        number_of_questions: questionsCount,
        number_of_pages: pagesCount,
        file_format: 'PDF',
        price_paise: pricePaise,
        original_price_paise: originalPricePaise,
        is_free: isFree,
        is_featured: isFeatured,
        is_bestseller: isBestseller,
        blob_url: blobUrl,
        blob_pathname: blobPathname,
        file_size_bytes: fileSize,
        is_published: true,
        download_count: 0,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json(mockWs, { status: 201 });
    }

    const sql = sqlClient();
    const rows = await sql`
      INSERT INTO worksheets (
        title, slug, class_level, subject, chapter, topic, difficulty, material_type,
        description, learning_objectives, number_of_questions, number_of_pages, file_format,
        price_paise, original_price_paise, is_free, is_featured, is_bestseller,
        blob_url, blob_pathname, file_size_bytes, is_published
      ) VALUES (
        ${title}, ${slug}, ${level}, 'Mathematics', ${chapter}, ${topic}, ${difficulty}, ${materialType},
        ${description}, ${learningObjectives}, ${questionsCount}, ${pagesCount}, 'PDF',
        ${pricePaise}, ${originalPricePaise}, ${isFree}, ${isFeatured}, ${isBestseller},
        ${blobUrl}, ${blobPathname}, ${fileSize}, true
      ) RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const body = await req.json();
    const { id, title, chapter, description, price_rupees, is_published, is_featured } = body;

    if (!id) return NextResponse.json({ error: 'Worksheet ID required.' }, { status: 400 });

    if (!isDbConfigured()) {
      return NextResponse.json({ ok: true, id, ...body });
    }

    const sql = sqlClient();
    const rows = await sql`
      UPDATE worksheets SET
        title = COALESCE(${title ?? null}, title),
        chapter = COALESCE(${chapter ?? null}, chapter),
        description = COALESCE(${description ?? null}, description),
        price_paise = COALESCE(${price_rupees === undefined ? null : Math.round(Number(price_rupees) * 100)}, price_paise),
        is_published = COALESCE(${is_published ?? null}, is_published),
        is_featured = COALESCE(${is_featured ?? null}, is_featured),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows.length) return NextResponse.json({ error: 'Worksheet not found.' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (!isDbConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const sql = sqlClient();
    const rows = await sql`DELETE FROM worksheets WHERE id = ${id} RETURNING blob_url`;

    if (rows.length > 0 && rows[0].blob_url && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(rows[0].blob_url);
      } catch (err) {
        console.warn('Blob deletion cleanup ignored', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
