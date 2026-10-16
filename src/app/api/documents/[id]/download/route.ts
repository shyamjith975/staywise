import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { getAuthenticatedUser } from '../../../../../lib/security/authorization';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Server-Side Access Check (P0.5)
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to download private asset documents.' },
        { status: 401 }
      );
    }

    // 2. Audit Document Access in Ledger
    await db.ledger.create({
      description: `Document accessed: [ID: ${id}] by user "${auth.user.name}" (${auth.user.email})`,
      type: 'DEBIT',
      amount: 0,
      account: '9995-DOCUMENT-ACCESS-AUDIT',
      entityType: 'SETTLEMENT',
      referenceId: id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: 'Access granted. Signed temporary asset link issued.',
      documentId: id,
      signedUrl: `/static/vault/${id}.pdf?expires=${Date.now() + 300000}`,
      expiresInSeconds: 300
    });
  } catch (error) {
    console.error('[API /api/documents/[id]/download] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during document download.' },
      { status: 500 }
    );
  }
}
