import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const entries = await db.ledger.findMany();
    return NextResponse.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    console.error('[API /api/ledger] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ledger entries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newEntry = await db.ledger.create(body);
    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error) {
    console.error('[API /api/ledger] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record ledger entry' }, { status: 500 });
  }
}
