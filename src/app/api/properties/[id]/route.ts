import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { getAuthenticatedUser, enforceTenantIsolation } from '../../../../lib/security/authorization';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await db.properties.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Multi-tenant isolation check: if caller is authenticated as an owner, ensure they own it (P0.3)
    const auth = await getAuthenticatedUser(req);
    if (auth && auth.user.role === 'owner') {
      const isolation = enforceTenantIsolation(auth, property.ownerId, 'Property');
      if (!isolation.allowed) {
        return isolation.errorResponse!;
      }
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('[API /api/properties/[id]] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.properties.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Multi-tenant isolation check: verify owner authorization (P0.3)
    const auth = await getAuthenticatedUser(req);
    if (auth) {
      const isolation = enforceTenantIsolation(auth, existing.ownerId, 'Property');
      if (!isolation.allowed) {
        return isolation.errorResponse!;
      }
    }

    const body = await req.json();
    const updated = await db.properties.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API /api/properties/[id]] PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.properties.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Multi-tenant isolation check: verify owner authorization (P0.3)
    const auth = await getAuthenticatedUser(req);
    if (auth) {
      const isolation = enforceTenantIsolation(auth, existing.ownerId, 'Property');
      if (!isolation.allowed) {
        return isolation.errorResponse!;
      }
    }

    const deleted = await db.properties.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('[API /api/properties/[id]] DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
