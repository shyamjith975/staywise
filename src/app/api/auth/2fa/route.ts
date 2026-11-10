import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

/**
 * ============================================================================
 * STAYWISE PLATFORM — TWO-FACTOR AUTHENTICATION (2FA) API
 * ============================================================================
 * Allows an owner or account holder to enable or disable 2FA for their account.
 * Persists status directly to SQLite database.
 * ============================================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, enabled } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required.' },
        { status: 400 }
      );
    }

    const updated = await db.users.setTwoFactor(userId, Boolean(enabled));

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found or unable to update 2FA status.' },
        { status: 404 }
      );
    }

    // Record statutory audit entry
    await db.ledger.create({
      description: `Two-Factor Authentication (2FA) ${enabled ? 'ENABLED' : 'DISABLED'} for user ${userId}`,
      type: 'DEBIT',
      amount: 0,
      account: '9998-SECURITY-2FA-AUDIT',
      entityType: 'SETTLEMENT',
      referenceId: userId,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: `Two-Factor Authentication (2FA) has been ${enabled ? 'enabled' : 'disabled'} successfully.`,
      twoFactorEnabled: Boolean(enabled)
    });
  } catch (error) {
    console.error('[API /api/auth/2fa] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update 2FA status.' },
      { status: 500 }
    );
  }
}

