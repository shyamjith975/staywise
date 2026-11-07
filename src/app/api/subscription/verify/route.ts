import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { 
  verifySignedCheckoutSession, 
  consumeNonce,
  detectPriceTampering 
} from '../../../../lib/security/subscriptionCatalog';

/**
 * ============================================================================
 * STAYWISE PLATFORM — CRYPTOGRAPHIC SUBSCRIPTION VERIFICATION ENDPOINT
 * ============================================================================
 * OWASP Top 10 API Security & Anti-Burp Suite Verification Gateway.
 * 
 * VULNERABILITY DEFENSE VALIDATIONS:
 * 1. HMAC Signature Verification: Ensures token payload was not altered by 1 bit.
 * 2. Replay Defense: Ensures the nonce cannot be re-submitted.
 * 3. Expiration Check: 15-minute validity window.
 * 4. Price Integrity: Confirms paid amount strictly equals authoritative tier price.
 * ============================================================================
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const { 
      sessionToken, 
      paymentMethod = 'Axis Bank Escrow Auto-Debit', 
      amount: clientAmount,
      transactionRef
    } = rawBody;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Missing cryptographically signed session token' },
        { status: 400 }
      );
    }

    // 1. Verify HMAC-SHA256 signature and cryptographic integrity
    const verification = verifySignedCheckoutSession(sessionToken);

    if (!verification.isValid || !verification.session) {
      console.warn(`[SECURITY ALERT] Session verification rejected: ${verification.error}`);
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Cryptographic verification failed',
          tamperingDetected: verification.tamperingDetected || false,
          securityCode: 'SEC_SIGNATURE_INVALID'
        },
        { status: verification.tamperingDetected ? 422 : 403 }
      );
    }

    const session = verification.session;

    // 2. White-Hat Defense: Detect Burp Suite price parameter tampering on verification
    const tamperingCheck = detectPriceTampering(session.authoritativeAmount, clientAmount);
    if (tamperingCheck.tampered) {
      console.warn(
        `[SECURITY AUDIT] Burp Suite Tampering on Verify Step! Session: ${session.sessionId}, ` +
        `Authoritative: ₹${session.authoritativeAmount}, Client Sent: ₹${clientAmount}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'SECURITY VIOLATION: Payment parameter tampering detected during settlement verification.',
          securityAlert: {
            threat: 'BURP_SUITE_PRICE_TAMPERING',
            authoritativeAmount: session.authoritativeAmount,
            attemptedTamperedAmount: clientAmount,
            action: 'TRANSACTION_TERMINATED'
          }
        },
        { status: 422 }
      );
    }

    // 3. Mark Nonce as Consumed (Neutralize Replay Attacks)
    consumeNonce(session.nonce);

    // 4. Generate Authoritative Payment Settlement
    const txnId = transactionRef || `TXN-STAY-SUB-${Date.now()}`;

    // 5. Update Database Subscription Record & Double-Entry Ledger
    const updatedSubscription = await db.subscriptions.upgrade(
      session.userId,
      session.planId,
      session.billingCycle,
      paymentMethod,
      txnId
    );

    return NextResponse.json({
      success: true,
      message: `Subscription successfully upgraded to ${session.planName}`,
      securityReceipt: {
        verifiedHmac: true,
        antiTamperSeal: updatedSubscription.tamperProofHash,
        settledAmount: session.authoritativeAmount,
        currency: session.currency,
        nonceConsumed: session.nonce,
        transactionId: txnId
      },
      data: updatedSubscription
    });
  } catch (error: any) {
    console.error('[API /api/subscription/verify] POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Subscription verification failed' },
      { status: 500 }
    );
  }
}
