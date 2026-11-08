import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { invalidateBootstrapCache } from '../../../lib/cache/apiCache';

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
    if ((!body.tenantUserId && !body.tenantEmail) || !body.tenantName || !body.unitNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required connection request fields (tenantUserId/tenantEmail, tenantName, unitNumber)' },
        { status: 400 }
      );
    }

    let ownerId = body.ownerId;
    let ownerEmail = body.ownerEmail;
    let ownerPhone = body.ownerPhone;
    let propertyId = body.propertyId;
    let propertyName = body.propertyName;

    // 1. If propertyId provided, lookup property to resolve ownerId & name
    if (propertyId) {
      const prop = await db.properties.findById(propertyId);
      if (prop) {
        if (!ownerId && prop.ownerId) ownerId = prop.ownerId;
        if (!propertyName) propertyName = prop.name;
      }
    }

    // 2. If propertyName provided but no propertyId, lookup by name
    if (!propertyId && propertyName) {
      const allProps = await db.properties.findMany();
      const matchedProp = allProps.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
      if (matchedProp) {
        propertyId = matchedProp.id;
        if (!ownerId && matchedProp.ownerId) ownerId = matchedProp.ownerId;
      }
    }

    // 3. If ownerIdentifier / ownerCode / ownerEmail is provided, lookup owner user
    const ownerLookupVal = body.ownerCode || ownerEmail || body.ownerIdentifier;
    if (!ownerId && ownerLookupVal) {
      const cleanVal = String(ownerLookupVal).trim();
      const ownerUser = (await db.users.findByEmail(cleanVal)) || (await db.users.findById(cleanVal));
      if (ownerUser) {
        ownerId = ownerUser.id;
        if (!ownerEmail) ownerEmail = ownerUser.email;
        if (!ownerPhone && ownerUser.phone) ownerPhone = ownerUser.phone;
      }
    }

    // 4. If tenantUserId is missing, lookup tenant by email
    let tenantUserId = body.tenantUserId;
    if (!tenantUserId && body.tenantEmail) {
      const tUser = await db.users.findByEmail(body.tenantEmail);
      if (tUser) tenantUserId = tUser.id;
    }

    const newReq = await db.tenantConnections.create({
      id: body.id || `conn-${Date.now()}`,
      tenantUserId: tenantUserId || 'usr-tenant',
      tenantName: body.tenantName,
      tenantEmail: body.tenantEmail || '',
      tenantPhone: body.tenantPhone || '',
      ownerId: ownerId || undefined,
      ownerCode: body.ownerCode || undefined,
      ownerEmail: ownerEmail || undefined,
      ownerPhone: ownerPhone || undefined,
      propertyId: propertyId || undefined,
      propertyName: propertyName || undefined,
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

    invalidateBootstrapCache();

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

    invalidateBootstrapCache();

    return NextResponse.json({ success: true, message: `Connection request ${body.id} updated to ${body.status}` });
  } catch (error) {
    console.error('[API /api/tenant-connections] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tenant connection request' }, { status: 500 });
  }
}
