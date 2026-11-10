import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { validatePassword } from '../../../../../lib/validation';
import { 
  verifyPasswordResetToken, 
  revokePasswordResetToken 
} from '../../../../../lib/security/auth';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { token, newPassword } = rawBody;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password reset token is required.' },
        { status: 400 }
      );
    }

    // 1. Verify cryptographic reset token and check expiration/usage
    const tokenData = verifyPasswordResetToken(token);
    if (!tokenData) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_OR_EXPIRED_TOKEN: The password reset link is invalid, expired, or has already been used. Please request a new link.',
          code: 'TOKEN_INVALID'
        },
        { status: 400 }
      );
    }

    // 2. Validate password strength
    const passValidation = validatePassword(newPassword);
    if (!passValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passValidation.message || 'Invalid password.' },
        { status: 400 }
      );
    }

    // 3. Retrieve user
    const user = await db.users.findByEmail(tokenData.email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account associated with this token was not found.' },
        { status: 404 }
      );
    }

    // 4. Update password in database (hashes with SHA-256)
    const updated = await db.users.updatePassword(user.id, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update credentials in database.' },
        { status: 500 }
      );
    }

    // 5. Revoke token to prevent replay
    revokePasswordResetToken(token);

    // 6. Record statutory audit trail in ledger
    await db.ledger.create({
      description: `Password reset confirmed for user "${user.name}" (${user.email}) [SHA-256 Re-encrypted]`,
      type: 'DEBIT',
      amount: 0,
      account: '9993-SECURITY-AUDIT-PWRESET-CONFIRMED',
      entityType: 'SETTLEMENT',
      referenceId: user.id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset and encrypted with SHA-256. You may now sign in with your new credentials.'
    });
  } catch (error) {
    console.error('[API /api/auth/reset-password/confirm] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during password reset confirmation.' },
      { status: 500 }
    );
  }
}
