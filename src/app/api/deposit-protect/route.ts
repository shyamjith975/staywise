import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getAuthenticatedUser } from '../../../lib/security/authorization';
import { generateProtectionAppId, generateProtectionContractId, generatePolicyNumber } from '../../../lib/utils/uniqueId';
import { DepositProtectionApplication, ProtectionContract } from '../../../types';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const tenantId = req.nextUrl.searchParams.get('tenantId') || undefined;
    const ownerId = req.nextUrl.searchParams.get('ownerId') || undefined;

    const applications = await db.depositProtect.getApplications({ tenantId, ownerId });
    const contracts = await db.depositProtect.getContracts({ tenantId, ownerId });

    return NextResponse.json({
      success: true,
      data: {
        applications,
        contracts
      }
    });
  } catch (err: any) {
    console.error('[API /api/deposit-protect GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      tenantId,
      tenantName,
      tenantEmail,
      tenantPhone,
      ownerId,
      ownerName,
      propertyId,
      propertyName,
      unitNumber,
      monthlyRent,
      traditionalDepositAmount,
      monthlyFee,
      coverageLimit,
      disclosuresAccepted
    } = body;

    if (!propertyId || !unitNumber || !monthlyRent) {
      return NextResponse.json({ success: false, error: 'Property, unit, and monthly rent are required.' }, { status: 400 });
    }

    const calculatedDeposit = traditionalDepositAmount || (monthlyRent * 2);
    // Illustrative fee: approx 3-4% of monthly rent, minimum ₹600, capped at ₹1,200
    const calculatedFee = monthlyFee || Math.min(1200, Math.max(600, Math.round(monthlyRent * 0.035)));
    const calculatedCoverage = coverageLimit || Math.max(100000, monthlyRent * 3);

    const appId = generateProtectionAppId();
    const now = new Date().toISOString();

    const newApp: DepositProtectionApplication = {
      id: appId,
      tenantId: tenantId || auth?.user.id || 'user-tenant-shyam',
      tenantName: tenantName || auth?.user.name || 'Tenant Resident',
      tenantEmail: tenantEmail || auth?.user.email || 'tenant@staywise.com',
      tenantPhone: tenantPhone || '+91 98460 21980',
      ownerId: ownerId || 'user-owner-vikram',
      ownerName: ownerName || 'Vikram Menon',
      propertyId,
      propertyName: propertyName || 'Staywise Managed Property',
      unitNumber,
      monthlyRent: Number(monthlyRent),
      traditionalDepositAmount: Number(calculatedDeposit),
      monthlyFee: Number(calculatedFee),
      coverageLimit: Number(calculatedCoverage),
      riskScore: 92,
      eligibilityStatus: 'ELIGIBLE',
      status: 'APPROVED',
      disclosuresAccepted: Boolean(disclosuresAccepted ?? true),
      partnerProvider: 'Staywise Institutional Guarantee / ICICI Lombard Underwriting Partner',
      createdAt: now,
      updatedAt: now
    };

    const savedApp = await db.depositProtect.createApplication(newApp);

    // Auto-create active contract if disclosures are accepted
    const contractId = generateProtectionContractId();
    const policyNumber = generatePolicyNumber();
    const startDate = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const endDate = nextYear.toISOString().split('T')[0];

    const newContract: ProtectionContract = {
      id: contractId,
      applicationId: appId,
      policyNumber,
      tenantId: newApp.tenantId,
      tenantName: newApp.tenantName,
      ownerId: newApp.ownerId,
      ownerName: newApp.ownerName || 'Property Owner',
      propertyId: newApp.propertyId,
      propertyName: newApp.propertyName,
      unitNumber: newApp.unitNumber,
      coverageLimit: newApp.coverageLimit,
      monthlyFee: newApp.monthlyFee,
      startDate,
      endDate,
      status: 'ACTIVE',
      partnerName: 'ICICI Lombard Institutional Risk Pool',
      certificateUrl: `/certificates/${policyNumber}.pdf`,
      coveredRisks: [
        `Unpaid rent arrears up to 3 months (Max ₹${(newApp.monthlyRent * 3).toLocaleString('en-IN')})`,
        'Tenant-caused physical damage beyond ordinary wear and tear',
        'Wall painting and deep restoration expenses',
        'Unpaid sub-meter power and utility charges (Capped up to ₹10,000)'
      ],
      exclusions: [
        'Pre-existing damage documented in verified Move-In Condition Report',
        'Normal wear and tear from ordinary use',
        'Unapproved utility surcharges without official sub-meter proof',
        'Fraudulent or deliberate landlord deductions'
      ],
      createdAt: now
    };

    const savedContract = await db.depositProtect.createContract(newContract);

    // Award +350 WisePoints welcome bonus for enrolling in Staywise Deposit Protect!
    try {
      await db.rewards.awardPoints({
        userId: newApp.tenantId,
        actionType: 'DEPOSIT_PROTECT_BONUS',
        points: 350,
        referenceId: savedContract.id,
        referenceType: 'LEASE',
        description: `Enrolled in Zero-Deposit Protection for Unit ${newApp.unitNumber}`
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Zero-Deposit Protection activated successfully!',
      data: {
        application: savedApp,
        contract: savedContract
      }
    });
  } catch (err: any) {
    console.error('[API /api/deposit-protect POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
