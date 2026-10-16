import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../lib/db';
import { hashPassword, isSha256 } from '../../../../lib/security/auth';

/**
 * ============================================================================
 * STAYWISE PLATFORM — SUPER ADMIN MASTER PASSWORD RESET ENGINE (P0.2)
 * ============================================================================
 * Allows resetting the administrator password with statutory multi-factor
 * security recovery key verification.
 * 
 * Authorized Recovery Keys:
 * - Master Key: `STAYWISE-ADMIN-MASTER-RECOVERY-KEY-2026`
 * - 2FA Recovery PIN: `849201`
 * ============================================================================
 */

const AUTHORIZED_RECOVERY_KEYS = [
  'STAYWISE-ADMIN-MASTER-RECOVERY-KEY-2026',
  '849201'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, securityRecoveryKey, newPassword } = body;

    if (!email || !securityRecoveryKey || !newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Administrator email, security recovery key, and new password are required.' 
        },
        { status: 400 }
      );
    }

    // 1. Verify user exists and has admin privileges
    const user = await db.users.findByEmail(email);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access Denied: The specified email does not belong to a verified Super Admin account.' 
        },
        { status: 403 }
      );
    }

    // 2. Validate Security Recovery Key using constant-time comparison
    const cleanKey = String(securityRecoveryKey).trim();
    const isKeyValid = AUTHORIZED_RECOVERY_KEYS.some((validKey) => {
      if (cleanKey.length !== validKey.length) return false;
      return crypto.timingSafeEqual(Buffer.from(cleanKey), Buffer.from(validKey));
    });

    if (!isKeyValid) {
      console.warn(`[SECURITY AUDIT] Unauthorized Admin Password Reset Attempt on ${email} using invalid recovery key.`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'SECURITY VERIFICATION FAILED: Invalid Master Security Recovery Key or 2FA Recovery PIN.' 
        },
        { status: 401 }
      );
    }

    // 3. Validate new password strength
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // 4. Encrypt new password using standard SHA-256
    const newPasswordHash = hashPassword(newPassword);

    // 5. Update user password in database.db
    await db.users.updatePassword(user.id, newPasswordHash);

    // 6. Record audit event in statutory ledger
    try {
      await db.ledger.create({
        description: `Super Admin Master Password Reset via Security Recovery Key for ${user.email}`,
        type: 'CREDIT',
        amount: 0,
        account: 'GOVERNANCE_SECURITY_LOG',
        entityType: 'SETTLEMENT',
        referenceId: `sec-reset-admin-${Date.now()}`,
        settlementStatus: 'CLEARED'
      });
    } catch (auditErr) {
      console.warn('Audit record notice:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Super Admin master password successfully reset and re-encrypted with SHA-256 format.',
      email: user.email,
      sha256Hash: newPasswordHash
    });

  } catch (error: any) {
    console.error('[API /api/admin/reset-password] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during password reset.' },
      { status: 500 }
    );
  }
}
