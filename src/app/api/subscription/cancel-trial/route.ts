import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const userId = rawBody.userId || 'user-owner-vikram';

    const cancelledSub = await db.subscriptions.cancelTrial(userId);

    if (!cancelledSub) {
      return NextResponse.json({
        success: false,
        error: 'No active trial subscription found to cancel.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Your 7-day trial and autopay mandate have been successfully cancelled. Exactly ₹0.00 was charged.',
      data: cancelledSub
    });
  } catch (error: any) {
    console.error('[API /api/subscription/cancel-trial] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to cancel trial'
    }, { status: 500 });
  }
}
