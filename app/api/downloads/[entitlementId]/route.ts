import { NextResponse } from 'next/server';
import { getCurrentCustomer, isAdmin } from '@/lib/auth';
import { sqlClient, isDbConfigured } from '@/lib/db';
import { INITIAL_MOCK_WORKSHEETS } from '@/lib/mock-data';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entitlementId: string }> }
) {
  try {
    const { entitlementId } = await params;
    const customer = await getCurrentCustomer();
    const adminOk = await isAdmin();

    if (!customer && !adminOk) {
      return NextResponse.json(
        { error: 'Please sign in to access your purchased downloads.' },
        { status: 401 }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Browser';

    // In-memory or development fallback
    if (!isDbConfigured()) {
      const sampleWorksheet = INITIAL_MOCK_WORKSHEETS[0];
      // Generate a mock PDF response or redirect to sample
      const samplePdfText = `%PDF-1.4\n1 0 obj\n<< /Title (${sampleWorksheet.title}) /Author (Ganit Adda) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
      return new NextResponse(samplePdfText, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="GANIT_ADDA_${sampleWorksheet.class_level}_${sampleWorksheet.chapter.replace(/\s+/g, '_')}.pdf"`,
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    }

    const sql = sqlClient();

    // Verify entitlement ownership
    const entitlements = await sql`
      SELECT e.id, e.user_id, e.worksheet_id, e.is_active, e.download_count, e.max_downloads, e.expires_at,
             w.title, w.class_level, w.chapter, w.blob_url
      FROM download_entitlements e
      JOIN worksheets w ON w.id = e.worksheet_id
      WHERE e.id = ${entitlementId}
      LIMIT 1
    `;

    if (!entitlements || entitlements.length === 0) {
      return NextResponse.json({ error: 'Entitlement record not found.' }, { status: 404 });
    }

    const ent = entitlements[0];

    // Authorization: User must own this entitlement or be admin
    if (!adminOk && ent.user_id !== customer?.id) {
      console.warn(`[Security Alert] User ${customer?.id} attempted unauthorized download of ${entitlementId}`);
      return NextResponse.json({ error: 'Unauthorized download attempt.' }, { status: 403 });
    }

    if (!ent.is_active) {
      return NextResponse.json(
        { error: 'This download entitlement is inactive or revoked due to refund.' },
        { status: 403 }
      );
    }

    if (ent.download_count >= ent.max_downloads) {
      return NextResponse.json(
        { error: 'Maximum permitted download attempts exceeded. Please contact support.' },
        { status: 429 }
      );
    }

    // Update download count
    await sql`
      UPDATE download_entitlements 
      SET download_count = download_count + 1, last_downloaded_at = NOW() 
      WHERE id = ${entitlementId}
    `;

    // Log audit
    await sql`
      INSERT INTO download_logs (
        entitlement_id, user_id, worksheet_id, ip_address, user_agent
      ) VALUES (
        ${ent.id}, ${ent.user_id}, ${ent.worksheet_id}, ${clientIp}, ${userAgent}
      )
    `;

    // If file is stored on Vercel Blob or remote storage, fetch server-side and stream:
    if (ent.blob_url && ent.blob_url.startsWith('http')) {
      const fileRes = await fetch(ent.blob_url);
      if (fileRes.ok) {
        const fileBuffer = await fileRes.arrayBuffer();
        const safeFilename = `GANIT_ADDA_${ent.class_level}_${ent.chapter.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${safeFilename}"`,
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          },
        });
      }
    }

    // Default safe stream
    const fallbackText = `%PDF-1.4\n1 0 obj\n<< /Title (${ent.title}) /Author (Ganit Adda) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    return new NextResponse(fallbackText, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="GANIT_ADDA_${ent.class_level}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error('[Download Stream Exception]', err);
    return NextResponse.json({ error: 'File delivery failed' }, { status: 500 });
  }
}
