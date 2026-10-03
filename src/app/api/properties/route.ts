import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { validatePropertyPayload } from '../../../lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolio = searchParams.get('portfolio') || undefined;
    const verificationStatus = searchParams.get('verificationStatus') || undefined;

    const properties = await db.properties.findMany({ portfolio, verificationStatus });
    return NextResponse.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('[API /api/properties] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Rigorous input validation & sanitization
    const validation = validatePropertyPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors[0]?.message || 'Invalid property registration payload.',
          validationErrors: validation.errors
        },
        { status: 400 }
      );
    }

    const payload = validation.sanitizedData!;

    // 2. Owner created property defaults to PENDING verification for admin audit
    const newProperty = await db.properties.create({
      ...payload,
      verificationStatus: 'PENDING',
      submittedDocs: rawBody.submittedDocs || [
        'Title_Deed_Registry.pdf',
        'Municipal_Building_Permit_2026.pdf',
        'Fire_Safety_NOC.pdf',
        'Property_Tax_Receipt_FY2526.pdf'
      ]
    });

    // 3. Record audit event in ledger
    await db.ledger.create({
      description: `New property registered: "${newProperty.name}" submitted by owner [Pending Legal Audit]`,
      type: 'DEBIT',
      amount: 0,
      account: '9990-AUDIT-REGISTRATION',
      entityType: 'SETTLEMENT',
      referenceId: newProperty.id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    console.error('[API /api/properties] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 });
  }
}
