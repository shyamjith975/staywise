import { NextRequest, NextResponse } from 'next/server';
import { 
  SUBSCRIPTION_PLANS, 
  createSignedCheckoutSession, 
  detectPriceTampering 
} from '../../../../lib/security/subscriptionCatalog';
import { SubscriptionTierId } from '../../../../types';

/**
 * ============================================================================
 * STAYWISE PLATFORM — CRYPTOGRAPHIC SUBSCRIPTION CHECKOUT SESSION
 * ============================================================================
 * Generates an HMAC-SHA256 signed checkout session token with authoritative pricing.
 * 
 * BURP SUITE ATTACK SCENARIO:
 * An attacker intercepts this request in Burp Suite and sends:
 * `{ "planId": "enterprise", "amount": 1, "billingCycle": "annual" }`
 * 
 * SERVER RESPONSE:
 * 1. If client attempted to pass an altered `amount`, the server immediately
 *    detects the price tampering and rejects the request with HTTP 422.
 * 2. Otherwise, the server calculates the authoritative amount strictly from 
 *    `SUBSCRIPTION_PLANS` and cryptographically signs it into a 15-minute token.
 * ============================================================================
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planId, billingCycle = 'annual', userId = 'user-owner-vikram', amount: clientAmount } = body;

    // 1. Validate Tier ID
    const validPlanIds: SubscriptionTierId[] = ['starter', 'growth_pro', 'enterprise'];
    if (!planId || !validPlanIds.includes(planId as SubscriptionTierId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid planId. Must be one of: ${validPlanIds.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // 2. Validate Billing Cycle
    if (billingCycle !== 'monthly' && billingCycle !== 'annual') {
      return NextResponse.json(
        { success: false, error: 'Invalid billingCycle. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    const plan = SUBSCRIPTION_PLANS[planId as SubscriptionTierId];
    const authoritativeAmount = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

    // 3. White-Hat Defense: Detect Burp Suite price parameter modification attempt
    const tamperingCheck = detectPriceTampering(authoritativeAmount, clientAmount);
    if (tamperingCheck.tampered) {
      console.warn(
        `[SECURITY AUDIT] Burp Suite Price Tampering Detected at Checkout! ` +
        `Plan: ${planId}, Expected: ₹${authoritativeAmount}, Attempted: ₹${clientAmount}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'SECURITY VIOLATION: Payment parameter tampering detected. Client-supplied price is forbidden.',
          securityAlert: {
            threat: 'BURP_SUITE_PRICE_TAMPERING',
            authoritativeAmount,
            attemptedTamperedAmount: clientAmount,
            status: 'BLOCKED'
          }
        },
        { status: 422 }
      );
    }

    // 4. Issue cryptographically signed HMAC-SHA256 session token
    const session = createSignedCheckoutSession(userId, planId as SubscriptionTierId, billingCycle);

    return NextResponse.json({
      success: true,
      message: 'Cryptographically signed checkout session initialized',
      data: {
        sessionId: session.sessionId,
        sessionToken: session.sessionToken,
        planId: session.planId,
        planName: session.planName,
        billingCycle: session.billingCycle,
        authoritativeAmount: session.authoritativeAmount,
        currency: session.currency,
        expiresAt: session.expiresAt,
        antiTamperProtected: true
      }
    });
  } catch (error: any) {
    console.error('[API /api/subscription/checkout] POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout initialization failed' },
      { status: 500 }
    );
  }
}
