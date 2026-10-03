/**
 * ============================================================================
 * STAYWISE PLATFORM — DATABASE ADAPTER & EXPORT HUB
 * ============================================================================
 * Exposes the active database instance (`db`) to API routes and server actions.
 * If a PostgreSQL connection string `DATABASE_URL` is provided in `.env`,
 * queries can be routed to PostgreSQL; otherwise, it uses the high-performance
 * atomic disk-persisted database engine (`data/staywise_db.json`).
 * ============================================================================
 */

import { db, UserAccount, StaywiseDatabaseSchema } from './database';

export { db };
export type { UserAccount, StaywiseDatabaseSchema };
export default db;
