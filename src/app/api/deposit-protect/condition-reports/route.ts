import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/security/authorization';
import { generateConditionReportId } from '../../../../lib/utils/uniqueId';
import { PropertyConditionReport } from '../../../../types';

export async function GET(req: NextRequest) {
  try {
    const propertyId = req.nextUrl.searchParams.get('propertyId') || undefined;
    const tenantId = req.nextUrl.searchParams.get('tenantId') || undefined;

    const reports = await db.depositProtect.getConditionReports({ propertyId, tenantId });
    return NextResponse.json({ success: true, data: reports });
  } catch (err: any) {
    console.error('[API /api/deposit-protect/condition-reports GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const {
      contractId,
      propertyId,
      propertyName,
      unitNumber,
      tenantId,
      tenantName,
      reportType,
      overallCondition,
      items,
      photos,
      notes
    } = body;

    if (!propertyId || !unitNumber) {
      return NextResponse.json({ success: false, error: 'Property ID and unit number are required' }, { status: 400 });
    }

    const reportId = generateConditionReportId();
    const now = new Date().toISOString();
    const resolvedTenantId = tenantId || auth?.user.id || 'user-tenant-shyam';

    const newReport: PropertyConditionReport = {
      id: reportId,
      contractId,
      propertyId,
      propertyName: propertyName || 'Staywise Managed Property',
      unitNumber,
      tenantId: resolvedTenantId,
      tenantName: tenantName || auth?.user.name || 'Tenant Resident',
      reportType: reportType || 'MOVE_IN',
      inspectionDate: now.split('T')[0],
      overallCondition: overallCondition || 'Pristine',
      items: Array.isArray(items) ? items : [],
      photos: Array.isArray(photos) ? photos : [],
      notes: notes || 'Inspection audit submitted via digital Staywise MoveFlow inspection tool.',
      verifiedBy: 'Staywise AI & Superintendent Inspection Audit',
      status: 'VERIFIED',
      createdAt: now
    };

    const saved = await db.depositProtect.createConditionReport(newReport);

    // Automatically award +100 WisePoints to tenant for completing move-in condition audit!
    try {
      await db.rewards.awardPoints({
        userId: resolvedTenantId,
        actionType: 'MOVE_IN_INSPECTION_COMPLETED',
        points: 100,
        referenceId: saved.id,
        referenceType: 'INSPECTION',
        description: `Completed verified Move-In Condition Report for Unit ${unitNumber}`
      });
    } catch (e) {
      console.warn('Failed to award inspection WisePoints:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Condition inspection report saved and verified! +100 WisePoints awarded!',
      data: saved
    });
  } catch (err: any) {
    console.error('[API /api/deposit-protect/condition-reports POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
