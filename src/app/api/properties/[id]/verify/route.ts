import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const status = body.status === 'REJECTED' ? 'REJECTED' : 'APPROVED';

    const verifiedProperty = await db.properties.verify(id, status);
    if (!verifiedProperty) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Record statutory audit trail in double-entry ledger
    await db.ledger.create({
      description: `Chief Admin verified & approved legal compliance documents for: "${verifiedProperty.name}" [Status: ACTIVE]`,
      type: 'CREDIT',
      amount: 0,
      account: '9990-LEGAL-COMPLIANCE',
      entityType: 'SETTLEMENT',
      referenceId: verifiedProperty.id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: `Property successfully ${status.toLowerCase()}`,
      data: verifiedProperty
    });
  } catch (error) {
    console.error('[API /api/properties/[id]/verify] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify property' }, { status: 500 });
  }
}
