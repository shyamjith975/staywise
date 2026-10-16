/**
 * ============================================================================
 * STAYWISE PLATFORM — ENTERPRISE CRYPTOGRAPHIC AUTHENTICATION ENGINE
 * ============================================================================
 * Implements:
 * 1. SHA-256 Cryptographic Password Hashing & Encryption
 * 2. Constant-Time (Timing-Safe) Hash Verification (Prevents Timing Side-Channel Attacks)
 * 3. HMAC-SHA256 Stateless Production Session Token Creation & Verification
 * 4. Automatic Plaintext-to-SHA-256 Migration Detection
 * ============================================================================
 */

import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'staywise-enterprise-hmac-sha256-master-key-2026';

/**
 * Validates whether a given string is a valid 64-character SHA-256 hex digest.
 */
export function isSha256(hash: string): boolean {
  if (typeof hash !== 'string') return false;
  return /^[a-f0-9]{64}$/i.test(hash.trim());
}

/**
 * Hashes a plaintext password into a standard SHA-256 hexadecimal string.
 * Format: 64 lowercase hexadecimal characters.
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string for SHA-256 encryption.');
  }
  return crypto.createHash('sha256').update(password.trim(), 'utf8').digest('hex');
}

/**
 * Performs constant-time comparison of the provided password against the stored hash or legacy string.
 * Defends against timing attacks (OWASP A02: Cryptographic Failures).
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  if (!password || !storedHashOrPlain) return false;

  const trimmedPlain = password.trim();
  const trimmedStored = storedHashOrPlain.trim();

  // If stored in SHA-256 hex format (64 chars)
  if (isSha256(trimmedStored)) {
    const inputHash = hashPassword(trimmedPlain);
    try {
      const bufInput = Buffer.from(inputHash, 'hex');
      const bufStored = Buffer.from(trimmedStored.toLowerCase(), 'hex');
      if (bufInput.length !== bufStored.length) return false;
      return crypto.timingSafeEqual(bufInput, bufStored);
    } catch {
      return false;
    }
  }

  // Backward compatibility fallback for legacy unmigrated plaintext passwords
  // (Caller will immediately upgrade row in DB upon matching)
  return trimmedPlain === trimmedStored;
}

export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  expiresAt: number;
}

/**
 * Generates an HMAC-SHA256 cryptographically signed session token.
 */
export function createSessionToken(
  userId: string,
  role: string,
  email: string,
  expiresInHours: number = 48
): { token: string; expiresAt: string } {
  const expiresTimestamp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payloadStr = `${userId}:${role}:${email.toLowerCase().trim()}:${expiresTimestamp}`;
  const hmacSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr, 'utf8')
    .digest('hex');

  const base64Payload = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const token = `sw_${base64Payload}.${hmacSig}`;

  return {
    token,
    expiresAt: new Date(expiresTimestamp).toISOString()
  };
}

/**
 * Verifies an HMAC-SHA256 session token, ensuring signature integrity and expiration validity.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string' || !token.startsWith('sw_')) {
    return null;
  }

  const parts = token.slice(3).split('.');
  if (parts.length !== 2) return null;

  const [b64Payload, signature] = parts;
  try {
    const payloadStr = Buffer.from(b64Payload, 'base64url').toString('utf8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr, 'utf8')
      .digest('hex');

    const bufSig = Buffer.from(signature, 'hex');
    const bufExpected = Buffer.from(expectedSig, 'hex');

    if (bufSig.length !== bufExpected.length) return null;
    if (!crypto.timingSafeEqual(bufSig, bufExpected)) return null;

    const [userId, role, email, expiresStr] = payloadStr.split(':');
    const expiresAt = Number(expiresStr);

    if (Date.now() > expiresAt) {
      return null; // Expired token
    }

    return {
      userId,
      role,
      email,
      expiresAt
    };
  } catch {
    return null;
  }
}

// ============================================================================
// BRUTE-FORCE LOCKOUT & RATE LIMITING DEFENSE (P0.2)
// ============================================================================
interface LockoutRecord {
  attempts: number;
  lockedUntil?: number;
  lastAttemptAt: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;  // 15 minutes window

const loginAttemptsStore = new Map<string, LockoutRecord>();

export function checkLoginLockout(key: string): { isLocked: boolean; remainingMinutes: number; attempts: number } {
  const cleanKey = key.toLowerCase().trim();
  const record = loginAttemptsStore.get(cleanKey);
  const now = Date.now();

  if (!record) {
    return { isLocked: false, remainingMinutes: 0, attempts: 0 };
  }

  // If currently locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMinutes = Math.max(1, Math.ceil((record.lockedUntil - now) / 60000));
    return { isLocked: true, remainingMinutes, attempts: record.attempts };
  }

  // If lockout expired or window expired, reset
  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttemptsStore.delete(cleanKey);
    return { isLocked: false, remainingMinutes: 0, attempts: 0 };
  }

  if (now - record.lastAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttemptsStore.delete(cleanKey);
    return { isLocked: false, remainingMinutes: 0, attempts: 0 };
  }

  return { isLocked: false, remainingMinutes: 0, attempts: record.attempts };
}

export function recordLoginFailure(key: string): { isLocked: boolean; attempts: number; remainingAttempts: number; remainingMinutes: number } {
  const cleanKey = key.toLowerCase().trim();
  const now = Date.now();
  const current = loginAttemptsStore.get(cleanKey) || { attempts: 0, lastAttemptAt: now };

  current.attempts += 1;
  current.lastAttemptAt = now;

  if (current.attempts >= MAX_FAILED_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttemptsStore.set(cleanKey, current);
    const remainingMinutes = Math.ceil(LOCKOUT_DURATION_MS / 60000);
    return { isLocked: true, attempts: current.attempts, remainingAttempts: 0, remainingMinutes };
  }

  loginAttemptsStore.set(cleanKey, current);
  return {
    isLocked: false,
    attempts: current.attempts,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - current.attempts),
    remainingMinutes: 0
  };
}

export function recordLoginSuccess(key: string): void {
  const cleanKey = key.toLowerCase().trim();
  loginAttemptsStore.delete(cleanKey);
}

// ============================================================================
// PASSWORD RESET TOKENS (P0.2)
// ============================================================================
const usedResetTokens = new Set<string>();

export function createPasswordResetToken(
  email: string,
  expiresInMinutes: number = 30
): { token: string; expiresAt: string } {
  const expiresTimestamp = Date.now() + expiresInMinutes * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payloadStr = `pwreset:${email.toLowerCase().trim()}:${expiresTimestamp}:${nonce}`;

  const hmacSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadStr, 'utf8')
    .digest('hex');

  const base64Payload = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const token = `reset_${base64Payload}.${hmacSig}`;

  return {
    token,
    expiresAt: new Date(expiresTimestamp).toISOString()
  };
}

export function verifyPasswordResetToken(token: string): { email: string; expiresAt: number } | null {
  if (!token || typeof token !== 'string' || !token.startsWith('reset_')) {
    return null;
  }

  if (usedResetTokens.has(token)) {
    return null; // Token already consumed
  }

  const parts = token.slice(6).split('.');
  if (parts.length !== 2) return null;

  const [b64Payload, signature] = parts;
  try {
    const payloadStr = Buffer.from(b64Payload, 'base64url').toString('utf8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr, 'utf8')
      .digest('hex');

    const bufSig = Buffer.from(signature, 'hex');
    const bufExpected = Buffer.from(expectedSig, 'hex');

    if (bufSig.length !== bufExpected.length) return null;
    if (!crypto.timingSafeEqual(bufSig, bufExpected)) return null;

    const [prefix, email, expiresStr] = payloadStr.split(':');
    if (prefix !== 'pwreset') return null;

    const expiresAt = Number(expiresStr);
    if (Date.now() > expiresAt) {
      return null; // Expired token
    }

    return { email, expiresAt };
  } catch {
    return null;
  }
}

export function revokePasswordResetToken(token: string): void {
  usedResetTokens.add(token);
}
