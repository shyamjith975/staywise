/**
 * ============================================================================
 * STAYWISE PLATFORM — DATABASE INTEGRITY MIGRATION & VALIDATION SCRIPT
 * ============================================================================
 * 1. Migrates SQLite database to add owner_id to properties and user_id to tenants.
 * 2. Purges test dummy accounts (Rohan Mehra, Rohit Sharma).
 * 3. Links Angith ('angithnk@gmail.com') to his properties:
 *    - 'prop-1791977203156' ("Angith's Portfolio Residency")
 *    - 'prop-1791980640691' ("easthil appartments")
 * 4. Links Vikram Singhania ('owner@staywise.com') to platform demo properties.
 * 5. Links all tenants to their corresponding user account and property.
 * 6. Validates uniqueness of all primary keys and verifies zero foreign key drift.
 * ============================================================================
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import crypto from 'node:crypto';

function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass.trim()).digest('hex');
}

const dbPath = path.join(process.cwd(), 'database.db');
console.log('[Migration] Opening database at:', dbPath);

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA busy_timeout = 5000;');
db.exec('PRAGMA foreign_keys = OFF;'); // Temporarily off during batch reconciliation

try {
  // 1. Schema Migrations: add columns if not present
  console.log('[Migration 1/5] Ensuring owner_id on properties and user_id on tenants...');
  try {
    db.exec('ALTER TABLE properties ADD COLUMN owner_id TEXT;');
    console.log(' -> Added owner_id to properties');
  } catch (e) {
    console.log(' -> owner_id already exists on properties');
  }

  try {
    db.exec('ALTER TABLE tenants ADD COLUMN user_id TEXT;');
    console.log(' -> Added user_id to tenants');
  } catch (e) {
    console.log(' -> user_id already exists on tenants');
  }

  // 2. Remove test users that cause confusion (Rohan Mehra, Rohit Sharma, etc.)
  console.log('[Migration 2/5] Cleaning test accounts...');
  db.prepare("DELETE FROM users WHERE name = 'Rohan Mehra' OR email LIKE '%live_owner%' OR email LIKE '%testowner%'").run();
  db.prepare("DELETE FROM properties WHERE name LIKE '%Mehra Coastal%'").run();
  db.prepare("DELETE FROM property_units WHERE property_id LIKE '%1791978781594%'").run();
  db.prepare("DELETE FROM tenants WHERE email LIKE '%live_tenant%' OR email LIKE '%deepak_1791977494657%'").run();

  // 3. Confirm Angith's User Account
  console.log('[Migration 3/5] Verifying Angith user account...');
  let angithUser = db.prepare("SELECT * FROM users WHERE LOWER(email) = 'angithnk@gmail.com'").get();
  if (!angithUser) {
    const angithId = 'user-owner-1791977203142';
    db.prepare(`
      INSERT INTO users (id, email, password, name, role, role_label, avatar, title, description, phone, created_at)
      VALUES (?, 'angithnk@gmail.com', ?, 'Angith', 'owner', 'Property Owner', '👨‍💼', 'Angith Portfolio Owner', 'Bangalore • Registered Asset Workspace', '+91 9876543210', datetime('now'))
    `).run(angithId, hashPassword('12345678@abc'));
    angithUser = db.prepare("SELECT * FROM users WHERE id = ?").get(angithId);
    console.log(' -> Created Angith user account with id:', angithId);
  } else {
    // Ensure name and role are strictly clean
    db.prepare("UPDATE users SET name = 'Angith', role = 'owner', role_label = 'Property Owner' WHERE id = ?").run(angithUser.id);
    console.log(' -> Angith user account verified with id:', angithUser.id, 'name:', angithUser.name);
  }

  // 4. Link Angith's Properties
  console.log('[Migration 4/5] Linking properties to owner_id...');
  const angithPropIds = ['prop-1791977203156', 'prop-1791980640691'];
  for (const pId of angithPropIds) {
    const res = db.prepare("UPDATE properties SET owner_id = ? WHERE id = ?").run(angithUser.id, pId);
    console.log(` -> Linked property ${pId} to Angith (${angithUser.id}), changes: ${res.changes}`);
  }

  // Also assign any properties matching "Angith" in name or portfolio to Angith
  db.prepare("UPDATE properties SET owner_id = ? WHERE (name LIKE '%Angith%' OR portfolio LIKE '%Angith%') AND (owner_id IS NULL OR owner_id != ?)").run(angithUser.id, angithUser.id);

  // Link Platform Demo Properties to Vikram Singhania ('user-owner-vikram')
  db.prepare("UPDATE properties SET owner_id = 'user-owner-vikram' WHERE owner_id IS NULL OR owner_id = ''").run();

  // Link Tenants to User Accounts
  console.log('[Migration 5/5] Linking tenants to user accounts...');
  const tenants = db.prepare("SELECT id, name, email, property_id, unit_number FROM tenants").all();
  for (const t of tenants) {
    let u = db.prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)").get(t.email);
    if (!u) {
      const uId = `user-tenant-${t.id}`;
      db.prepare(`
        INSERT OR REPLACE INTO users (id, email, password, name, role, role_label, avatar, title, description, created_at)
        VALUES (?, ?, ?, ?, 'tenant', 'Tenant / Resident', '👨‍🎓', ?, 'Resident Tenant', datetime('now'))
      `).run(uId, t.email, hashPassword('Tenant@123'), t.name, `Resident • Apt ${t.unit_number}`);
      u = { id: uId };
    }
    db.prepare("UPDATE tenants SET user_id = ? WHERE id = ?").run(u.id, t.id);
  }

  // Double Check: Ensure t-shyam links to user-tenant-shyam
  db.prepare("UPDATE tenants SET user_id = 'user-tenant-shyam' WHERE id = 't-shyam'").run();

  // ============================================================================
  // COMPREHENSIVE DATA INTEGRITY VALIDATION SUITE
  // ============================================================================
  console.log('\n================ DATA VALIDATION AUDIT ================');
  
  const allUsers = db.prepare("SELECT id, email, name, role FROM users").all();
  const allProps = db.prepare("SELECT id, name, owner_id, portfolio, expected_monthly_rent FROM properties").all();
  const allUnits = db.prepare("SELECT id, property_id, unit_number FROM property_units").all();
  const allTenants = db.prepare("SELECT id, user_id, name, email, property_id, unit_number FROM tenants").all();
  const allInvoices = db.prepare("SELECT id, invoice_number, tenant_id, property_id, total_amount FROM invoices").all();
  const allTickets = db.prepare("SELECT id, ticket_number, property_id, unit_number FROM tickets").all();

  console.log(`- Total Users: ${allUsers.length}`);
  console.log(`- Total Properties: ${allProps.length}`);
  console.log(`- Total Units: ${allUnits.length}`);
  console.log(`- Total Tenants: ${allTenants.length}`);
  console.log(`- Total Invoices: ${allInvoices.length}`);
  console.log(`- Total Tickets: ${allTickets.length}`);

  // 1. Verify Uniqueness of IDs
  function checkUniqueness(items, key, label) {
    const seen = new Set();
    const dupes = [];
    for (const item of items) {
      const val = item[key];
      if (seen.has(val)) dupes.push(val);
      seen.add(val);
    }
    if (dupes.length > 0) {
      console.error(`[FAIL] Duplicate ${label} found:`, dupes);
      return false;
    }
    console.log(`[PASS] All ${label} are unique (${items.length} items verified)`);
    return true;
  }

  checkUniqueness(allUsers, 'id', 'User IDs');
  checkUniqueness(allUsers, 'email', 'User Emails');
  checkUniqueness(allProps, 'id', 'Property IDs');
  checkUniqueness(allTenants, 'id', 'Tenant IDs');
  checkUniqueness(allInvoices, 'id', 'Invoice IDs');
  checkUniqueness(allTickets, 'id', 'Ticket IDs');

  // 2. Validate Relationships
  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const propMap = new Map(allProps.map(p => [p.id, p]));
  const tenantMap = new Map(allTenants.map(t => [t.id, t]));

  let relationshipErrors = 0;

  // Property -> Owner
  for (const p of allProps) {
    if (!p.owner_id || !userMap.has(p.owner_id)) {
      console.error(`[FAIL] Property "${p.name}" (${p.id}) has invalid owner_id: ${p.owner_id}`);
      relationshipErrors++;
    }
  }

  // Tenant -> Property & User
  for (const t of allTenants) {
    if (!propMap.has(t.property_id)) {
      console.error(`[FAIL] Tenant "${t.name}" (${t.id}) references nonexistent property_id: ${t.property_id}`);
      relationshipErrors++;
    }
    if (!t.user_id || !userMap.has(t.user_id)) {
      console.error(`[FAIL] Tenant "${t.name}" (${t.id}) references nonexistent user_id: ${t.user_id}`);
      relationshipErrors++;
    }
  }

  // Invoice -> Tenant & Property
  for (const i of allInvoices) {
    if (!tenantMap.has(i.tenant_id)) {
      console.error(`[FAIL] Invoice ${i.invoice_number} references nonexistent tenant_id: ${i.tenant_id}`);
      relationshipErrors++;
    }
    if (!propMap.has(i.property_id)) {
      console.error(`[FAIL] Invoice ${i.invoice_number} references nonexistent property_id: ${i.property_id}`);
      relationshipErrors++;
    }
  }

  // Ticket -> Property
  for (const t of allTickets) {
    if (!propMap.has(t.property_id)) {
      console.error(`[FAIL] Ticket ${t.ticket_number} references nonexistent property_id: ${t.property_id}`);
      relationshipErrors++;
    }
  }

  if (relationshipErrors === 0) {
    console.log('[PASS] All cross-table relational links (users <-> properties <-> tenants <-> invoices <-> tickets) validated 100% OK!');
  } else {
    console.error(`[FAIL] Found ${relationshipErrors} relationship integrity errors.`);
  }

  // 3. Verify Angith's Specific Assets
  const angithProps = allProps.filter(p => p.owner_id === angithUser.id);
  console.log(`\n[Angith Portfolio Verification] Owner: ${angithUser.name} (${angithUser.email})`);
  console.log(`Properties owned by Angith (${angithProps.length}):`);
  for (const p of angithProps) {
    console.log(` - [${p.id}] ${p.name} (Portfolio: ${p.portfolio}, Rent: ₹${p.expected_monthly_rent.toLocaleString('en-IN')})`);
  }

  console.log('\n================ INTEGRITY AUDIT COMPLETE ================');

} finally {
  db.exec('PRAGMA foreign_keys = ON;');
  db.close();
  console.log('[Migration] Database connection cleanly closed.');
}
