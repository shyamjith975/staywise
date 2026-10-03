import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const bills = await db.bills.findMany();
    return NextResponse.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    console.error('[API /api/bills] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBill = await db.bills.create({
      ...body,
      id: body.id || `ebill-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: newBill }, { status: 201 });
  } catch (error) {
    console.error('[API /api/bills] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record electricity bill' }, { status: 500 });
  }
}
