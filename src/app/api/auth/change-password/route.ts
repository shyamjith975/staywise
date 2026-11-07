import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validatePassword } from '../../../../lib/validation';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { email, currentPassword, newPassword } = rawBody;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User email is required.' },
        { status: 400 }
      );
    }

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Current password is required.' },
        { status: 400 }
      );
    }

    const passValidation = validatePassword(newPassword);
    if (!passValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passValidation.message || 'Invalid new password.' },
        { status: 400 }
      );
    }

    // 1. Authenticate user credentials against persistent database (verifying current password)
    const user = await db.users.authenticate(email, currentPassword);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Current password does not match our records. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // 2. Encrypt new password using SHA-256 and update database
    const updated = await db.users.updatePassword(user.id, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update security credentials in database.' },
        { status: 500 }
      );
    }

    // 3. Record statutory audit trail in double-entry ledger
    await db.ledger.create({
      description: `Security credentials updated for user "${user.name}" (${user.email}) [SHA-256 Encrypted]`,
      type: 'DEBIT',
      amount: 0,
      account: '9991-SECURITY-AUDIT-AUTH',
      entityType: 'SETTLEMENT',
      referenceId: user.id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated and securely encrypted in SHA-256 format.'
    });
  } catch (error) {
    console.error('[API /api/auth/change-password] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while updating password.' },
      { status: 500 }
    );
  }
}
