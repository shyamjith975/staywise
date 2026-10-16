import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { validatePropertyPayload } from '../../../lib/validation';
import { getAuthenticatedUser } from '../../../lib/security/authorization';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolio = searchParams.get('portfolio') || undefined;
    const verificationStatus = searchParams.get('verificationStatus') || undefined;
    const requestedOwnerId = searchParams.get('ownerId') || undefined;

    // Multi-tenant boundary check (P0.3)
    const auth = await getAuthenticatedUser(req);
    let effectiveOwnerId = requestedOwnerId;

    if (auth && auth.user.role === 'owner') {
      // If caller explicitly asked for another owner's portfolio, block cross-tenant access
      if (requestedOwnerId && requestedOwnerId !== auth.user.id) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'FORBIDDEN: Cross-organization breach attempt blocked. You cannot view properties outside your authorized workspace.',
            code: 'CROSS_TENANT_ACCESS_DENIED'
          },
          { status: 403 }
        );
      }
      effectiveOwnerId = auth.user.id;
    }

    const properties = await db.properties.findMany({ portfolio, verificationStatus, ownerId: effectiveOwnerId });
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
    const auth = await getAuthenticatedUser(req);
    const effectiveOwnerId = (auth && auth.user.role === 'owner')
      ? auth.user.id
      : (rawBody.ownerId || payload.ownerId || undefined);

    // 2. Owner created property defaults to PENDING verification for admin audit
    const newProperty = await db.properties.create({
      ...payload,
      ownerId: effectiveOwnerId,
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
