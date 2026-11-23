import { NextResponse } from 'next/server';
import { sqlClient, isDbConfigured } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!isDbConfigured()) {
      return NextResponse.json({
        orderId,
        status: 'SUCCESS',
        isTest: true,
      });
    }

    const sql = sqlClient();
    const rows = await sql`
      SELECT id, order_number, status, total_paise, created_at 
      FROM orders 
      WHERE id = ${orderId} OR order_number = ${orderId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: 'Unable to check status' }, { status: 500 });
  }
}
