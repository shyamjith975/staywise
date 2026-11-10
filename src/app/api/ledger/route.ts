import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(250, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;
    const type = (searchParams.get('type') as 'DEBIT' | 'CREDIT') || undefined;
    const referenceId = searchParams.get('referenceId') || undefined;

    const entries = await db.ledger.findMany({ limit, offset, type, referenceId });
    return NextResponse.json({ 
      success: true, 
      count: entries.length, 
      page,
      limit,
      data: entries 
    }, {
      headers: {
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=30'
      }
    });
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
