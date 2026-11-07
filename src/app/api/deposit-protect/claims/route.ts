import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/security/authorization';
import { generateClaimId, generateTransactionId } from '../../../../lib/utils/uniqueId';
import { ProtectionClaim, ClaimStatus } from '../../../../types';

export async function GET(req: NextRequest) {
  try {
    const ownerId = req.nextUrl.searchParams.get('ownerId') || undefined;
    const tenantId = req.nextUrl.searchParams.get('tenantId') || undefined;

    const claims = await db.depositProtect.getClaims({ ownerId, tenantId });
    return NextResponse.json({ success: true, data: claims });
  } catch (err: any) {
    console.error('[API /api/deposit-protect/claims GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      action, // 'FILE_CLAIM' | 'DISPUTE_CLAIM' | 'SETTLE_CLAIM'
      claimId,
      contractId,
      policyNumber,
      propertyId,
      propertyName,
      unitNumber,
      ownerId,
      ownerName,
      tenantId,
      tenantName,
      claimType,
      claimedAmount,
      description,
      evidenceUrls,
      disputeReason,
      approvedAmount
    } = body;

    // 1. Handling Dispute of an existing claim
    if (action === 'DISPUTE_CLAIM' && claimId) {
      const updated = await db.depositProtect.updateClaimStatus(claimId, 'DISPUTED', {
        disputeReason: disputeReason || 'Tenant disputed the deductions and requested inspection audit review.'
      });
      return NextResponse.json({
        success: updated,
        message: 'Claim disputed. Sent to Staywise Arbitration & Review Desk.'
      });
    }

    // 2. Handling Settlement of an existing claim
    if (action === 'SETTLE_CLAIM' && claimId) {
      const txnId = generateTransactionId('UPI_SETTLE');
      const now = new Date().toISOString();
      const updated = await db.depositProtect.updateClaimStatus(claimId, 'SETTLED', {
        approvedAmount: Number(approvedAmount || claimedAmount || 0),
        settlementDate: now,
        settlementTxnId: txnId
      });
      return NextResponse.json({
        success: updated,
        message: 'Claim approved and settled via institutional underwriter payout!',
        settlementTxnId: txnId
      });
    }

    // 3. Filing a new protection claim
    if (!contractId || !claimedAmount || !claimType) {
      return NextResponse.json({ success: false, error: 'contractId, claimType, and claimedAmount are required.' }, { status: 400 });
    }

    const newClaimId = generateClaimId();
    const now = new Date().toISOString();

    const newClaim: ProtectionClaim = {
      id: newClaimId,
      contractId,
      policyNumber: policyNumber || 'SW-DP-2026-KL902',
      propertyId: propertyId || 'prop-beach-road',
      propertyName: propertyName || 'Beach Road Apartments',
      unitNumber: unitNumber || '304',
      ownerId: ownerId || auth?.user.id || 'user-owner-vikram',
      ownerName: ownerName || auth?.user.name || 'Vikram Menon',
      tenantId: tenantId || 'user-tenant-shyam',
      tenantName: tenantName || 'Shyam Sundar',
      claimType: claimType || 'TENANT_DAMAGE',
      claimedAmount: Number(claimedAmount),
      approvedAmount: Number(claimedAmount),
      deductible: 0,
      description: description || 'Damage claim filed with contractor quotation and photos.',
      evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : [],
      status: 'UNDER_REVIEW',
      createdAt: now
    };

    const saved = await db.depositProtect.createClaim(newClaim);

    return NextResponse.json({
      success: true,
      message: 'Protection claim filed successfully! Transmitted to Underwriter Risk Desk for review.',
      data: saved
    });
  } catch (err: any) {
    console.error('[API /api/deposit-protect/claims POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
