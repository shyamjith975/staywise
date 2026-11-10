import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getAuthenticatedUser } from '../../../lib/security/authorization';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const userId = req.nextUrl.searchParams.get('userId') || auth?.user.id || 'user-tenant-shyam';

    const account = await db.rewards.getAccount(userId);
    const ledger = await db.rewards.getLedger(userId);
    const rules = await db.rewards.getRules();
    const offers = await db.rewards.getOffers();

    return NextResponse.json({
      success: true,
      data: {
        account,
        ledger,
        rules,
        offers
      }
    });
  } catch (err: any) {
    console.error('[API /api/rewards GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const userId = body.userId || auth?.user.id || 'user-tenant-shyam';
    const { actionType, points, referenceId, referenceType, description, financialCost } = body;

    if (!actionType || points === undefined) {
      return NextResponse.json({ success: false, error: 'actionType and points are required' }, { status: 400 });
    }

    const result = await db.rewards.awardPoints({
      userId,
      actionType,
      points: Number(points),
      referenceId,
      referenceType,
      description: description || `WisePoints awarded for ${actionType}`,
      financialCost
    });

    return NextResponse.json({
      success: true,
      message: `Successfully awarded ${points} WisePoints!`,
      data: result
    });
  } catch (err: any) {
    console.error('[API /api/rewards POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
