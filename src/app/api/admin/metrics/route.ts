import { NextRequest, NextResponse } from 'next/server';
import { telemetry } from '../../../../lib/observability/telemetry';
import { getAuthenticatedUser } from '../../../../lib/security/authorization';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    // Allow admin access or local health checks
    if (auth && auth.user.role !== 'admin' && auth.user.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED: Admin or Owner role required to access scale telemetry.' },
        { status: 403 }
      );
    }

    const report = await telemetry.generateScaleReport();

    return NextResponse.json({
      success: true,
      report
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Telemetry-Latency-P95': report.apiLatency.p95Ms.toString(),
        'X-CPAP-Inr': report.costControlCentre.costPerActivePropertyInr.toString(),
        'X-Gross-Margin-Pct': report.costControlCentre.grossMarginPercent.toString()
      }
    });
  } catch (error: any) {
    console.error('[API /api/admin/metrics] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error generating telemetry report.' },
      { status: 500 }
    );
  }
}
