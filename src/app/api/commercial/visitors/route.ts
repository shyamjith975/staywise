import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const visitor = await db.commercial.createVisitor(body);
    return NextResponse.json({ success: true, data: visitor }, { status: 201 });
  } catch (error) {
    console.error('[API /api/commercial/visitors] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record visitor' }, { status: 500 });
  }
}
