import crypto from 'crypto';
import { SubscriptionPlan, SubscriptionTierId, SignedCheckoutSession, OwnerSubscription } from '../../types';

/**
 * ============================================================================
 * STAYWISE PLATFORM — AUTHORITATIVE SUBSCRIPTION CATALOG & CRYPTOGRAPHIC ENGINE
 * ============================================================================
 * OWASP Top 10 API Security & Anti-Burp Suite Parameter Tampering Engine.
 * 
 * VULNERABILITY DEFENSE MATRIX:
 * 1. Price Tampering (Burp Suite HTTP Interception):
 *    - The client NEVER defines the price. Pricing is strictly authoritative.
 *    - All checkout sessions are signed using HMAC-SHA256 with a server secret.
 *    - If an attacker intercepts the POST request and modifies amount, planId,
 *      or billingCycle, the signature verification fails immediately.
 * 2. Replay Attacks:
 *    - Every checkout token contains a cryptographically random UUID nonce and 
 *      an expiry timestamp (15-minute TTL).
 *    - Consumed nonces are cached and rejected upon subsequent replay attempts.
 * 3. Timing Attacks:
 *    - Signatures are compared using constant-time `crypto.timingSafeEqual`.
 * 4. Offline Database Tampering:
 *    - Each subscription record stores a SHA-256 integrity hash seal.
 * ============================================================================
 */

export const SUBSCRIPTION_PLANS: Record<SubscriptionTierId, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter (1 Property)',
    tagline: '1 Property • Annual Plan for single-building landlords & independent assets',
    monthlyPrice: 59,
    annualPrice: 599, // ₹599/year (Approx ₹50/month)
    maxUnits: 1,
    badge: '1 Property • ₹599/yr',
    features: [
      '1 Property (PG, Flat, House or Commercial)',
      'Automated Rent Invoices & PDF Receipts',
      'WhatsApp Payment Reminder Automations',
      'Standard UPI Dynamic QR Code Collection',
      'Basic Maintenance Ticket Resolution Flow',
      'Single-User Access with Landlord Dashboard'
    ]
  },
  growth_pro: {
    id: 'growth_pro',
    name: 'Growth Pro (10 Properties)',
    tagline: 'Up to 10 Properties • Annual Plan for growing multi-asset portfolios',
    monthlyPrice: 149,
    annualPrice: 1499, // ₹1,499/year (Approx ₹125/month)
    maxUnits: 10,
    badge: '10 Properties • ₹1,499/yr',
    popular: true,
    features: [
      'Up to 10 Properties & PG Co-living Buildings',
      'Sub-Meter Electricity OCR Bill Splitting & Tariffs',
      'Automated Multi-Day WhatsApp & SMS Dunning (T-3, Due, T+3)',
      'MoveFlow Digital Check-in / Check-out Inspections',
      'Statutory Double-Entry Ledger Surveillance',
      '3 Delegated Role Logins (Accountant, Caretaker)'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise (Unlimited Properties)',
    tagline: 'Unlimited Properties • Annual Plan for portfolios, LLPs & campuses',
    monthlyPrice: 299,
    annualPrice: 2999, // ₹2,999/year (Approx ₹250/month)
    maxUnits: 99999,
    badge: 'Unlimited Properties • ₹2,999/yr',
    features: [
      'Unlimited Properties, Multi-Entity LLPs & Campuses',
      'Axis Bank Escrow Direct Instant T+0 Auto-Sweeps',
      'SuperAdmin Multi-Role Governance & Triage Queue',
      'RBI Regulated Double-Entry Immutable Ledger',
      'Commercial CAM Common Area Utility Allocation Engine',
      'Priority 24/7 Dedicated Account Concierge with 1-hr SLA'
    ]
  }
};

const HMAC_SECRET = process.env.STAYWISE_SECURITY_SECRET || 'STAYWISE_HMAC_SECRET_PROD_2026_RBI_ESCROW_MASTER_KEY_#99281';

// In-memory cache of consumed nonces to prevent replay attacks (15-min sliding window)
const consumedNonces = new Set<string>();

/**
 * Calculates SHA256 integrity hash for an owner subscription record.
 */
export function calculateSubscriptionHash(sub: {
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  amount: number;
}): string {
  const content = `${sub.userId}:${sub.planId}:${sub.startDate}:${sub.endDate}:${sub.amount}:${HMAC_SECRET}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Generates an HMAC-SHA256 signature for payload verification.
 */
export function generateHmacSignature(payload: string): string {
  return crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
}

/**
 * Creates a cryptographically signed checkout session with server-authoritative pricing.
 */
export function createSignedCheckoutSession(
  userId: string,
  planId: SubscriptionTierId,
  billingCycle: 'monthly' | 'annual'
): SignedCheckoutSession {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) {
    throw new Error(`Invalid plan identifier: ${planId}`);
  }

  // Server-authoritative amount: never trust client price input!
  const authoritativeAmount = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const sessionId = `cs_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const nonce = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + (15 * 60 * 1000); // 15-minute validity window

  // Construct canonical signing string
  const signString = `${sessionId}:${userId}:${planId}:${billingCycle}:${authoritativeAmount}:${nonce}:${expiresAt}`;
  const signature = generateHmacSignature(signString);

  // Encode session token as URL-safe base64 payload
  const sessionTokenPayload = {
    sessionId,
    userId,
    planId,
    billingCycle,
    authoritativeAmount,
    currency: 'INR',
    nonce,
    createdAt,
    expiresAt,
    signature
  };

  const sessionToken = Buffer.from(JSON.stringify(sessionTokenPayload)).toString('base64url');

  return {
    ...sessionTokenPayload,
    planName: plan.name,
    sessionToken
  };
}

/**
 * Verifies a checkout session token, enforcing HMAC signature, expiry, and replay defenses.
 */
export function verifySignedCheckoutSession(sessionToken: string): {
  isValid: boolean;
  session?: SignedCheckoutSession;
  error?: string;
  tamperingDetected?: boolean;
} {
  try {
    if (!sessionToken || typeof sessionToken !== 'string') {
      return { isValid: false, error: 'Missing or malformed session token' };
    }

    const jsonStr = Buffer.from(sessionToken, 'base64url').toString('utf8');
    const session: SignedCheckoutSession = JSON.parse(jsonStr);

    if (!session || !session.sessionId || !session.signature) {
      return { isValid: false, error: 'Invalid session structure' };
    }

    // 1. Recompute HMAC signature over canonical payload
    const signString = `${session.sessionId}:${session.userId}:${session.planId}:${session.billingCycle}:${session.authoritativeAmount}:${session.nonce}:${session.expiresAt}`;
    const expectedSignature = generateHmacSignature(signString);

    // Constant-time comparison to prevent timing side-channel attacks
    const sigBuf = Buffer.from(session.signature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      console.warn(`[SECURITY ALERT] HMAC Signature Mismatch on Session ${session.sessionId}! Burp Suite tampering detected.`);
      return {
        isValid: false,
        tamperingDetected: true,
        error: 'CRYPTOGRAPHIC TAMPERING DETECTED: Invalid HMAC signature. Request rejected.'
      };
    }

    // 2. Enforce Expiration (15-minute TTL)
    if (Date.now() > session.expiresAt) {
      return {
        isValid: false,
        error: 'Checkout session expired. Please initiate a new subscription session.'
      };
    }

    // 3. Replay Attack Defense (Check if nonce was already consumed)
    if (consumedNonces.has(session.nonce)) {
      console.warn(`[SECURITY ALERT] Replay attack detected! Nonce ${session.nonce} was already used.`);
      return {
        isValid: false,
        tamperingDetected: true,
        error: 'REPLAY ATTACK DETECTED: Session nonce has already been consumed.'
      };
    }

    // 4. Verify Plan Integrity against Catalog
    const plan = SUBSCRIPTION_PLANS[session.planId];
    if (!plan) {
      return { isValid: false, error: 'Unknown plan referenced in signed session' };
    }

    const expectedAuthoritativeAmount = session.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    if (session.authoritativeAmount !== expectedAuthoritativeAmount) {
      return {
        isValid: false,
        tamperingDetected: true,
        error: 'CATALOG MISMATCH: Authoritative plan price was tampered with.'
      };
    }

    return {
      isValid: true,
      session: {
        ...session,
        planName: plan.name
      }
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: `Token verification error: ${err.message || 'Corrupted session token'}`
    };
  }
}

/**
 * Marks a nonce as consumed to neutralize replay attempts.
 */
export function consumeNonce(nonce: string) {
  consumedNonces.add(nonce);
  // Auto clean up after 30 minutes to manage memory
  setTimeout(() => {
    consumedNonces.delete(nonce);
  }, 30 * 60 * 1000);
}

/**
 * Authoritative check comparing client-submitted amount with server expected amount.
 * Useful for detecting Burp Suite parameter modification in both subscriptions and rent payments.
 */
export function detectPriceTampering(
  expectedAmount: number,
  clientAmount?: number | null
): { tampered: boolean; message?: string } {
  if (clientAmount === undefined || clientAmount === null) {
    return { tampered: false }; // Client did not override, server uses authoritative price
  }

  // Exact float comparison with tiny epsilon for floating precision
  if (Math.abs(clientAmount - expectedAmount) > 0.01) {
    return {
      tampered: true,
      message: `Price tampering detected: client submitted ₹${clientAmount} but authoritative price is ₹${expectedAmount}.`
    };
  }

  return { tampered: false };
}
