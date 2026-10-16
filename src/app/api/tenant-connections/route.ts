import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const requests = await db.tenantConnections.findMany();
    return NextResponse.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('[API /api/tenant-connections] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tenant connection requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.tenantUserId || !body.tenantName || !body.unitNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required connection request fields (tenantUserId, tenantName, unitNumber)' },
        { status: 400 }
      );
    }

    const newReq = await db.tenantConnections.create({
      id: body.id || `conn-${Date.now()}`,
      tenantUserId: body.tenantUserId,
      tenantName: body.tenantName,
      tenantEmail: body.tenantEmail || '',
      tenantPhone: body.tenantPhone || '',
      ownerId: body.ownerId,
      ownerCode: body.ownerCode,
      ownerEmail: body.ownerEmail,
      ownerPhone: body.ownerPhone,
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      unitNumber: body.unitNumber,
      monthlyRent: Number(body.monthlyRent) || 20000,
      depositAmount: Number(body.depositAmount) || 40000,
      leaseStartDate: body.leaseStartDate || new Date().toISOString().split('T')[0],
      status: body.status || 'PENDING_APPROVAL',
      createdAt: body.createdAt || new Date().toISOString(),
      tenancyType: body.tenancyType || 'PG',
      includeFoodPlan: body.includeFoodPlan !== false,
      aadhaarNumber: body.aadhaarNumber,
      panNumber: body.panNumber,
      ekycVerified: body.ekycVerified !== false,
      documents: body.documents || [],
      agreementUrl: body.agreementUrl,
      coTenantName: body.coTenantName,
      coTenantPhone: body.coTenantPhone,
      coTenantEmail: body.coTenantEmail
    });

    return NextResponse.json({ success: true, data: newReq }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tenant-connections] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create tenant connection request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (id, status)' },
        { status: 400 }
      );
    }

    await db.tenantConnections.updateStatus(body.id, body.status, {
      moveOutDate: body.moveOutDate,
      moveOutReason: body.moveOutReason,
      inspectionNotes: body.inspectionNotes,
      depositSettledAmount: body.depositSettledAmount
    });

    return NextResponse.json({ success: true, message: `Connection request ${body.id} updated to ${body.status}` });
  } catch (error) {
    console.error('[API /api/tenant-connections] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tenant connection request' }, { status: 500 });
  }
}
