/**
 * ============================================================================
 * STAYWISE PLATFORM — CENTRALIZED HIGH-SPEED API & PERMISSION CACHE
 * ============================================================================
 * Zero-dependency in-memory cache with sub-millisecond retrieval, ETag hashing,
 * and strict scope isolation to prevent cross-tenant/cross-owner financial leaks.
 * 
 * TTL SCHEDULE:
 * - Dashboard Summary: 3 minutes (180,000ms)
 * - Property Details & Stats: 10 minutes (600,000ms)
 * - Static Configuration & Plans: 12 hours (43,200,000ms)
 * - User Permissions & Roles: 1 minute (60,000ms)
 * - Search Results: 3 minutes (180,000ms)
 * ============================================================================
 */

export interface CacheEntry<T = any> {
  data: T;
  etag: string;
  cachedAt: number;
  expiresAt: number;
  scope: string; // e.g. "owner:user-123" or "tenant:user-456" or "admin:global"
}

export interface CacheTelemetry {
  hits: number;
  misses: number;
  hitRatioPct: number;
  activeEntriesCount: number;
}

// Global process-level cache store (survives across Next.js route chunks & dev reloads)
const globalCache = globalThis as unknown as {
  __staywise_scoped_cache?: Map<string, CacheEntry>;
  __staywise_cache_metrics?: { hits: number; misses: number };
};

if (!globalCache.__staywise_scoped_cache) {
  globalCache.__staywise_scoped_cache = new Map<string, CacheEntry>();
}
if (!globalCache.__staywise_cache_metrics) {
  globalCache.__staywise_cache_metrics = { hits: 0, misses: 0 };
}

const cacheStore = globalCache.__staywise_scoped_cache;
const metrics = globalCache.__staywise_cache_metrics;

export const TTL = {
  DASHBOARD: 3 * 60 * 1000,
  PROPERTY: 10 * 60 * 1000,
  STATIC_CONFIG: 12 * 60 * 60 * 1000,
  PERMISSIONS: 60 * 1000,
  SEARCH: 3 * 60 * 1000,
  BOOTSTRAP: 30 * 1000,
  SETTINGS: 60 * 1000
};

export const BOOTSTRAP_CACHE_TTL = TTL.BOOTSTRAP;
export const SETTINGS_CACHE_TTL = TTL.SETTINGS;

/**
 * Generates an isolated, collision-free scope key
 */
export function buildScopeKey(scope: 'owner' | 'tenant' | 'admin' | 'public', userId: string, resource: string): string {
  return `${scope}:${userId || 'anonymous'}:${resource}`;
}

export function getScopedCache<T = any>(key: string): CacheEntry<T> | undefined {
  const entry = cacheStore.get(key);
  if (!entry) {
    metrics.misses += 1;
    return undefined;
  }
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    metrics.misses += 1;
    return undefined;
  }
  metrics.hits += 1;
  return entry as CacheEntry<T>;
}

export function setScopedCache<T = any>(key: string, data: T, etag: string, ttlMs: number, scope: string): void {
  const now = Date.now();
  cacheStore.set(key, {
    data,
    etag,
    cachedAt: now,
    expiresAt: now + ttlMs,
    scope
  });
}

// Legacy compatibility helpers for existing route imports
export function getBootstrapCache(key: string): CacheEntry | undefined {
  return getScopedCache(key);
}

export function setBootstrapCache(key: string, data: any, etag: string): void {
  setScopedCache(key, data, etag, TTL.BOOTSTRAP, 'bootstrap');
}

export function invalidateBootstrapCache(): void {
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.scope === 'bootstrap' || key.includes('bootstrap') || key.includes('user-')) {
      cacheStore.delete(key);
    }
  }
}

export function getSettingsCache(userId: string): CacheEntry | undefined {
  return getScopedCache(`settings:${userId}`);
}

export function setSettingsCache(userId: string, data: any, etag: string): void {
  setScopedCache(`settings:${userId}`, data, etag, TTL.SETTINGS, `user:${userId}`);
}

export function invalidateSettingsCache(userId?: string): void {
  if (userId) {
    cacheStore.delete(`settings:${userId}`);
  } else {
    for (const [key] of cacheStore.entries()) {
      if (key.startsWith('settings:')) cacheStore.delete(key);
    }
  }
}

export function invalidateScope(scopePrefix: string): void {
  for (const [key, entry] of cacheStore.entries()) {
    if (key.startsWith(scopePrefix) || entry.scope.startsWith(scopePrefix)) {
      cacheStore.delete(key);
    }
  }
}

export function invalidateAllCaches(): void {
  cacheStore.clear();
}

/**
 * Returns cache telemetry for Cost Control Centre
 */
export function getCacheTelemetry(): CacheTelemetry {
  const total = metrics.hits + metrics.misses;
  const ratio = total > 0 ? Math.round((metrics.hits / total) * 100) : 100;
  return {
    hits: metrics.hits,
    misses: metrics.misses,
    hitRatioPct: ratio,
    activeEntriesCount: cacheStore.size
  };
}
