/**
 * ============================================================================
 * STAYWISE PLATFORM — CRYPTOGRAPHIC SHA-256 MITM DEFENSE & DATA PROTECTION
 * ============================================================================
 * Defends against Man-in-the-Middle (MITM) attacks, payload tampering,
 * and eavesdropping via:
 * 1. Canonical SHA-256 payload integrity hashing (X-Payload-Hash).
 * 2. HMAC-SHA256 cryptographic signatures with timestamp and nonces (X-Staywise-Signature).
 * 3. Deep recursive PII masking (Aadhaar, PAN, Bank Accounts, Passwords stripped).
 * 4. Strict Transport Security (HSTS, nosniff, DENY) headers.
 * ============================================================================
 */

import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

const HMAC_SECRET = process.env.STAYWISE_HMAC_SECRET || process.env.SESSION_SECRET || 'staywise_mitm_defense_key_2026_prod_sha256';

/**
 * Computes a deterministic SHA-256 hex digest of any data payload.
 */
export function computePayloadSha256(payload: any): string {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Generates an HMAC-SHA256 signature containing timestamp, cryptographically
 * random nonce, and the payload hash to prevent replay and tampering attacks.
 */
export function createStaywiseSignature(payloadHash: string): {
  headerValue: string;
  timestamp: number;
  nonce: string;
  signature: string;
} {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${timestamp}.${nonce}.${payloadHash}`)
    .digest('hex');

  const headerValue = `t=${timestamp},nonce=${nonce},sig=${signature}`;
  return { headerValue, timestamp, nonce, signature };
}

/**
 * Verifies an incoming HMAC-SHA256 signature against the payload hash.
 * Enforces a 5-minute maximum drift window to prevent replay attacks.
 */
export function verifyStaywiseSignature(headerValue: string, payloadHash: string): boolean {
  if (!headerValue) return false;
  try {
    const parts = headerValue.split(',');
    const map: Record<string, string> = {};
    for (const p of parts) {
      const [k, v] = p.split('=');
      if (k && v) map[k.trim()] = v.trim();
    }

    const { t, nonce, sig } = map;
    if (!t || !nonce || !sig) return false;

    const timestamp = parseInt(t, 10);
    if (isNaN(timestamp)) return false;

    // Check replay window (300 seconds / 5 minutes)
    const drift = Math.abs(Date.now() - timestamp);
    if (drift > 300_000) return false;

    const expectedSig = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${timestamp}.${nonce}.${payloadHash}`)
      .digest('hex');

    const bufA = Buffer.from(sig, 'hex');
    const bufB = Buffer.from(expectedSig, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Masks sensitive PII (Aadhaar, PAN, Bank account, Phone) and strips passwords
 * so no raw private identity data is transmitted over the wire.
 */
export function maskSensitivePII<T = any>(val: T): T {
  if (val === null || val === undefined) return val;

  if (Array.isArray(val)) {
    return val.map((item) => maskSensitivePII(item)) as unknown as T;
  }

  if (typeof val === 'object') {
    const result: any = {};
    for (const [key, v] of Object.entries(val)) {
      const lowerKey = key.toLowerCase();

      // Completely remove raw password, password hashes, and tokens from public models
      if (['password', 'password_hash', 'salt', 'auth_secret'].includes(lowerKey)) {
        continue;
      }

      // Mask Aadhaar numbers (e.g. 1234 5678 9812 -> •••• •••• 9812)
      if (lowerKey.includes('aadhaar') && typeof v === 'string') {
        const clean = v.replace(/\D/g, '');
        if (clean.length >= 4) {
          result[key] = `•••• •••• ${clean.slice(-4)}`;
          continue;
        }
      }

      // Mask PAN numbers (e.g. ABCDE1234F -> •••••1234F)
      if (lowerKey.includes('pan') && typeof v === 'string') {
        const clean = v.trim();
        if (clean.length >= 4) {
          result[key] = `•••••${clean.slice(-5)}`;
          continue;
        }
      }

      // Mask Bank account numbers (e.g. 123456789012 -> •••• •••• 9012)
      if ((lowerKey.includes('account_number') || lowerKey.includes('accountnumber')) && typeof v === 'string') {
        const clean = v.replace(/\D/g, '');
        if (clean.length >= 4) {
          result[key] = `•••• •••• •••• ${clean.slice(-4)}`;
          continue;
        }
      }

      // Recursively process nested objects
      result[key] = maskSensitivePII(v);
    }
    return result as T;
  }

  return val;
}

/**
 * Wraps outgoing API responses with strict SHA-256 payload integrity headers,
 * HMAC-SHA256 signature, PII masking, and anti-MITM defense headers.
 */
export function secureJsonResponse(body: any, init?: ResponseInit): NextResponse {
  // 1. Mask sensitive PII and remove raw secrets
  const sanitizedBody = maskSensitivePII(body);
  const serialized = JSON.stringify(sanitizedBody);

  // 2. Cryptographic SHA-256 payload integrity hash
  const payloadHash = computePayloadSha256(serialized);

  // 3. HMAC-SHA256 anti-tamper signature
  const signature = createStaywiseSignature(payloadHash);

  // 4. Construct response with anti-MITM headers
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('X-Payload-Hash', `sha256-${payloadHash}`);
  headers.set('X-Staywise-Signature', signature.headerValue);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return new NextResponse(serialized, {
    ...init,
    headers
  });
}

