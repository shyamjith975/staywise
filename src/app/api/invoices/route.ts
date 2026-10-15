import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getAuthenticatedUser } from '../../../lib/security/authorization';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    const propertyId = searchParams.get('propertyId') || undefined;

    let invoices = await db.invoices.findMany({ tenantId, propertyId });

    // Multi-tenant isolation (P0.3): Owners only see invoices for their properties
    const auth = await getAuthenticatedUser(req);
    if (auth && auth.user.role === 'owner') {
      const myProperties = await db.properties.findMany({ ownerId: auth.user.id });
      const myPropIds = new Set(myProperties.map(p => p.id));
      invoices = invoices.filter(inv => myPropIds.has(inv.propertyId));
    }

    return NextResponse.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    console.error('[API /api/invoices] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newInvoice = await db.invoices.create({
      ...body,
      id: body.id || `inv-${Date.now()}`,
      invoiceNumber: body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    });

    return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
  } catch (error) {
    console.error('[API /api/invoices] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
  }
}
