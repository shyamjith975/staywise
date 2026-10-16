import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const items = await db.moveFlow.findMany();
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('[API /api/moveflow] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch moveflow items' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const updated = await db.moveFlow.toggle(id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API /api/moveflow] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle moveflow task' }, { status: 500 });
  }
}
