import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/security/authorization';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const userId = body.userId || auth?.user.id || 'user-tenant-shyam';
    const { actionType, points, referenceId, referenceType, description } = body;

    if (!actionType || !points) {
      return NextResponse.json({ success: false, error: 'actionType and points are required' }, { status: 400 });
    }

    const result = await db.rewards.redeemPoints({
      userId,
      actionType,
      points: Number(points),
      referenceId,
      referenceType,
      description: description || `Redemption of ${points} WisePoints`
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 422 });
    }

    // Generate coupon or confirmation code
    const voucherCode = `WISE-REDEEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${points} WisePoints!`,
      data: {
        newBalance: result.newBalance,
        ledgerEntry: result.entry,
        voucherCode
      }
    });
  } catch (err: any) {
    console.error('[API /api/rewards/redeem POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
