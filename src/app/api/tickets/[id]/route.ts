import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const updated = await db.tickets.update(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API /api/tickets/[id]] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update ticket' }, { status: 500 });
  }
}
