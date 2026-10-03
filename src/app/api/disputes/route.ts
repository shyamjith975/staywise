import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const disputes = await db.disputes.findMany();
    return NextResponse.json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    console.error('[API /api/disputes] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch disputes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;
    const updated = await db.disputes.update(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API /api/disputes] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update dispute' }, { status: 500 });
  }
}
