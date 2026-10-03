import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const tenants = await db.tenants.findMany();
    return NextResponse.json({ success: true, count: tenants.length, data: tenants });
  } catch (error) {
    console.error('[API /api/tenants] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.propertyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required tenant fields (name, email, propertyId)' },
        { status: 400 }
      );
    }

    const newTenant = await db.tenants.create({
      ...body,
      id: body.id || `t-${Date.now()}`
    });

    return NextResponse.json({ success: true, data: newTenant }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tenants] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create tenant' }, { status: 500 });
  }
}
