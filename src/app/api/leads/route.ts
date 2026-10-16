import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const leads = await db.leads.findMany();
    return NextResponse.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error('[API /api/leads] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLead = await db.leads.create({
      ...body,
      id: body.id || `lead-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    console.error('[API /api/leads] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 });
  }
}
