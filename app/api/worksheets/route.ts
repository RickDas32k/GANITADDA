import { NextResponse } from 'next/server';
import { getWorksheets } from '@/lib/worksheets';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get('class') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const materialType = searchParams.get('type') || undefined;
    const search = searchParams.get('q') || undefined;
    const sortBy = (searchParams.get('sort') as any) || 'newest';

    const worksheets = await getWorksheets({
      classLevel,
      difficulty,
      materialType,
      search,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: worksheets,
      total: worksheets.length,
    });
  } catch (e: any) {
    console.error('Worksheets API error:', e);
    return NextResponse.json(
      { success: false, error: 'Unable to load worksheets catalog.' },
      { status: 500 }
    );
  }
}

