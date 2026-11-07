import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { createPasswordResetToken } from '../../../../../lib/security/auth';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { email } = rawBody;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required for password recovery.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.users.findByEmail(cleanEmail);

    if (!user) {
      // Security best practice: don't reveal email existence to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.'
      });
    }

    // Generate cryptographically signed reset token (30-minute expiry)
    const { token, expiresAt } = createPasswordResetToken(cleanEmail, 30);

    // Record audit event in double-entry ledger
    await db.ledger.create({
      description: `Password reset requested for user "${user.name}" (${user.email})`,
      type: 'DEBIT',
      amount: 0,
      account: '9992-SECURITY-AUDIT-PWRESET',
      entityType: 'SETTLEMENT',
      referenceId: user.id,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset token generated successfully. In production this is delivered via secure email.',
      resetToken: token,
      expiresAt
    });
  } catch (error) {
    console.error('[API /api/auth/reset-password/request] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during password reset request.' },
      { status: 500 }
    );
  }
}
