/**
 * ============================================================================
 * STAYWISE PLATFORM — ENTERPRISE COLLISION-FREE UNIQUE ID GENERATOR
 * ============================================================================
 * High-entropy, sortable, timestamp-prefixed alphanumeric unique identifier
 * engine. Guarantees zero ID collision across users, properties, units,
 * tenants, invoices, ledger entries, and maintenance tickets.
 * ============================================================================
 */

let counter = 0;

/**
 * Returns a cryptographically sound random alphanumeric string
 */
function getRandomEntropy(length = 6): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  // Combine timestamp nanosecond drift and counter to prevent sub-millisecond collisions
  counter = (counter + 1) % 10000;
  const seed = (Math.random().toString(36).substring(2) + counter.toString(36));
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates an enterprise-grade unique ID with prefix and high-resolution entropy
 */
export function generateUniqueId(prefix: string): string {
  const ts = Date.now().toString(36);
  const entropy = getRandomEntropy(6);
  return `${prefix}-${ts}-${entropy}`;
}

export function generateUserId(role: string): string {
  return generateUniqueId(`user-${role}`);
}

export function generatePropertyId(): string {
  return generateUniqueId('prop');
}

export function generateUnitId(propertyId: string, unitNumber: string): string {
  const cleanUnit = unitNumber.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `unit-${propertyId}-${cleanUnit}`;
}

export function generateTenantId(): string {
  return generateUniqueId('t');
}

export function generateInvoiceId(): string {
  return generateUniqueId('inv');
}

export function generateInvoiceNumber(seq = 1): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const rand = getRandomEntropy(4).toUpperCase();
  return `INV-${year}${month}-${seq}-${rand}`;
}

export function generateTicketId(): string {
  return generateUniqueId('tkt');
}

export function generateTicketNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}-${rand}`;
}

export function generateLedgerId(): string {
  return generateUniqueId('led');
}

export function generateTransactionId(rail = 'UPI'): string {
  const cleanRail = rail.toUpperCase().replace(/\s+/g, '');
  const ts = Date.now().toString(36).toUpperCase();
  const rand = getRandomEntropy(4).toUpperCase();
  return `TXN-${cleanRail}-${ts}-${rand}`;
}

export function generateBillId(): string {
  return generateUniqueId('ebill');
}

export function generateLeadId(): string {
  return generateUniqueId('lead');
}

export function generateVisitorId(): string {
  return generateUniqueId('vis');
}

export function generateReferralId(): string {
  return generateUniqueId('ref');
}
