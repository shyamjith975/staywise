import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const { bedId, status } = await req.json();
    await db.pg.updateBedStatus(bedId, status);
    return NextResponse.json({ success: true, message: 'Bed status updated in database' });
  } catch (error) {
    console.error('[API /api/pg/beds] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update bed status' }, { status: 500 });
  }
}
