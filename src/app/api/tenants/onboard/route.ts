import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.propertyId || !body.unitNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required onboarding fields: name, email, propertyId, unitNumber' 
        },
        { status: 400 }
      );
    }

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
      message: `Tenant ${body.name} successfully onboarded into SQLite database.`,
      data: onboardResult
    }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tenants/onboard] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to onboard tenant into SQLite database' },
      { status: 500 }
    );
  }
}
