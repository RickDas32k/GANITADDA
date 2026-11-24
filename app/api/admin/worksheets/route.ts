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
    const contentType = req.headers.get('content-type') || '';
    let id: string = '';
    let title: string | undefined;
    let classLevel: string | undefined;
    let chapter: string | undefined;
    let topic: string | undefined;
    let difficulty: string | undefined;
    let materialType: string | undefined;
    let description: string | undefined;
    let learningObjectives: string | undefined;
    let questionsCount: number | undefined;
    let pagesCount: number | undefined;
    let priceRupees: number | undefined;
    let originalPriceRupees: number | undefined;
    let isPublished: boolean | undefined;
    let isFeatured: boolean | undefined;
    let isBestseller: boolean | undefined;
    let blobUrl: string | undefined;
    let blobPathname: string | undefined;
    let fileSize: number | undefined;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      id = String(form.get('id') || '');
      if (form.has('title')) title = String(form.get('title') || '').trim();
      if (form.has('class_level')) classLevel = String(form.get('class_level') || '');
      if (form.has('chapter')) chapter = String(form.get('chapter') || '').trim();
      if (form.has('topic')) topic = String(form.get('topic') || '').trim();
      if (form.has('difficulty')) difficulty = String(form.get('difficulty') || '');
      if (form.has('material_type')) materialType = String(form.get('material_type') || '');
      if (form.has('description')) description = String(form.get('description') || '').trim();
      if (form.has('learning_objectives')) learningObjectives = String(form.get('learning_objectives') || '').trim();
      if (form.has('number_of_questions')) questionsCount = Number(form.get('number_of_questions'));
      if (form.has('number_of_pages')) pagesCount = Number(form.get('number_of_pages'));
      if (form.has('price_rupees')) priceRupees = Number(form.get('price_rupees'));
      if (form.has('original_price_rupees')) originalPriceRupees = Number(form.get('original_price_rupees'));
      if (form.has('is_published')) isPublished = form.get('is_published') === 'true' || form.get('is_published') === '1';
      if (form.has('is_featured')) isFeatured = form.get('is_featured') === 'true' || form.get('is_featured') === '1';
      if (form.has('is_bestseller')) isBestseller = form.get('is_bestseller') === 'true' || form.get('is_bestseller') === '1';

      const file = form.get('file');
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
        } else {
          blobUrl = `/assets/samples/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        }
      }
    } else {
      const body = await req.json();
      id = String(body.id || '');
      title = body.title;
      classLevel = body.class_level;
      chapter = body.chapter;
      topic = body.topic;
      difficulty = body.difficulty;
      materialType = body.material_type;
      description = body.description;
      learningObjectives = body.learning_objectives;
      questionsCount = body.number_of_questions !== undefined ? Number(body.number_of_questions) : undefined;
      pagesCount = body.number_of_pages !== undefined ? Number(body.number_of_pages) : undefined;
      priceRupees = body.price_rupees !== undefined ? Number(body.price_rupees) : undefined;
      originalPriceRupees = body.original_price_rupees !== undefined ? Number(body.original_price_rupees) : undefined;
      isPublished = body.is_published;
      isFeatured = body.is_featured;
      isBestseller = body.is_bestseller;
    }

    if (!id) return NextResponse.json({ error: 'Worksheet ID is required.' }, { status: 400 });

    const pricePaise = priceRupees !== undefined ? Math.round(priceRupees * 100) : undefined;
    const isFree = pricePaise !== undefined ? pricePaise === 0 : undefined;
    const originalPricePaise = originalPriceRupees !== undefined
      ? (originalPriceRupees > 0 ? Math.round(originalPriceRupees * 100) : null)
      : undefined;

    if (!isDbConfigured()) {
      return NextResponse.json({
        ok: true,
        id,
        title,
        class_level: classLevel,
        chapter,
        topic,
        difficulty,
        material_type: materialType,
        description,
        learning_objectives: learningObjectives,
        number_of_questions: questionsCount,
        number_of_pages: pagesCount,
        price_paise: pricePaise,
        original_price_paise: originalPricePaise,
        is_free: isFree,
        is_published: isPublished,
        is_featured: isFeatured,
        is_bestseller: isBestseller,
        blob_url: blobUrl,
        updated_at: new Date().toISOString(),
      });
    }

    const sql = sqlClient();
    const rows = await sql`
      UPDATE worksheets SET
        title = COALESCE(${title ?? null}, title),
        class_level = COALESCE(${classLevel ?? null}, class_level),
        chapter = COALESCE(${chapter ?? null}, chapter),
        topic = COALESCE(${topic ?? null}, topic),
        difficulty = COALESCE(${difficulty ?? null}, difficulty),
        material_type = COALESCE(${materialType ?? null}, material_type),
        description = COALESCE(${description ?? null}, description),
        learning_objectives = COALESCE(${learningObjectives ?? null}, learning_objectives),
        number_of_questions = COALESCE(${questionsCount ?? null}, number_of_questions),
        number_of_pages = COALESCE(${pagesCount ?? null}, number_of_pages),
        price_paise = COALESCE(${pricePaise ?? null}, price_paise),
        original_price_paise = CASE WHEN ${originalPricePaise !== undefined} THEN ${originalPricePaise} ELSE original_price_paise END,
        is_free = COALESCE(${isFree ?? null}, is_free),
        is_published = COALESCE(${isPublished ?? null}, is_published),
        is_featured = COALESCE(${isFeatured ?? null}, is_featured),
        is_bestseller = COALESCE(${isBestseller ?? null}, is_bestseller),
        blob_url = COALESCE(${blobUrl ?? null}, blob_url),
        blob_pathname = COALESCE(${blobPathname ?? null}, blob_pathname),
        file_size_bytes = COALESCE(${fileSize ?? null}, file_size_bytes),
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
