import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const tenants = await db.tenants.findMany();
    return NextResponse.json({ success: true, count: tenants.length, data: tenants });
  } catch (error) {
    console.error('[API /api/tenants] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tenants from SQLite database' }, { status: 500 });
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

    // If unitNumber & monthlyRent provided, run full authoritative onboarding pipeline
    if (body.unitNumber && (body.monthlyRent !== undefined || body.deposit !== undefined)) {
      const onboardResult = await db.tenants.onboard({
        name: body.name,
        phone: body.phone || '+91 98000 00000',
        email: body.email,
        propertyId: body.propertyId,
        unitNumber: body.unitNumber,
        monthlyRent: Number(body.monthlyRent) || 25000,
        deposit: Number(body.deposit) || 50000,
        leaseStart: body.leaseStart || new Date().toISOString().split('T')[0],
        leaseEnd: body.leaseEnd || '2027-09-30',
        rentDueDate: Number(body.rentDueDate) || 5,
        password: body.password || 'Tenant@123'
      });

      return NextResponse.json({
        success: true,
        message: `Tenant ${body.name} successfully onboarded into Unit ${body.unitNumber} and saved to SQLite database.`,
        data: onboardResult
      }, { status: 201 });
    }

    // Direct tenant create fallback
    const newTenant = await db.tenants.create({
      ...body,
      id: body.id || `t-${Date.now()}`
    });

    return NextResponse.json({ success: true, data: newTenant }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tenants] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to onboard tenant' }, { status: 500 });
  }
}
