import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const tickets = await db.tickets.findMany();
    return NextResponse.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    console.error('[API /api/tickets] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTicket = await db.tickets.create({
      ...body,
      id: body.id || `tkt-${Date.now()}`,
      ticketNumber: body.ticketNumber || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: body.createdAt || new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: newTicket }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tickets] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create maintenance ticket' }, { status: 500 });
  }
}
