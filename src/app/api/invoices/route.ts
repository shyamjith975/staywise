import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || undefined;
    const propertyId = searchParams.get('propertyId') || undefined;

    const invoices = await db.invoices.findMany({ tenantId, propertyId });
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
