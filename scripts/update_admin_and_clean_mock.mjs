import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'node:path';

const DB_FILE = path.join(process.cwd(), 'database.db');
const db = new DatabaseSync(DB_FILE);

console.log('🔄 Updating admin password to admin@123 and cleaning auto-starter properties for new users...');

// 1. Update admin password to admin@123 (lowercase)
const newAdminPass = 'admin@123';
const newAdminHash = crypto.createHash('sha256').update(newAdminPass).digest('hex');

const adminUpdateResult = db.prepare(`
  UPDATE users 
  SET password = ? 
  WHERE role = 'admin' OR LOWER(email) = 'admin@staywise.com'
`).run(newAdminHash);

console.log(`✔ Admin password updated to SHA-256 hash of "admin@123": ${newAdminHash} (affected rows: ${adminUpdateResult.changes})`);

// 2. Remove automatic starter properties (like "*'s Portfolio Residency") created for non-demo users
const deletedProps = db.prepare(`
  DELETE FROM properties 
  WHERE owner_id NOT IN ('user-owner-vikram') 
  AND name LIKE ?
`).run("%'s Portfolio Residency");

console.log(`✔ Cleaned auto-starter properties for newly onboarded users (removed: ${deletedProps.changes} properties).`);

// 3. Verify admin account
const adminAccount = db.prepare(`
  SELECT id, email, role, password 
  FROM users 
  WHERE role = 'admin' OR LOWER(email) = 'admin@staywise.com'
`).get();

console.log('✔ Verified Admin account:', adminAccount);
console.log('🎉 Done!');
