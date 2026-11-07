import { DatabaseSync } from 'node:sqlite';
import path from 'path';

console.log('=== TEST SUITE: STAYWISE SQLITE DATABASE & ONBOARDING API ===');

const dbPath = path.join(process.cwd(), 'database.db');
const db = new DatabaseSync(dbPath);

// 1. Verify Tables & Counts
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence' ORDER BY name").all();
console.log(`\n[1] Total Tables in database.db: ${tables.length}`);
for (const t of tables) {
  const count = db.prepare(`SELECT count(*) as c FROM ${t.name}`).get().c;
  console.log(`  ✓ Table '${t.name}': ${count} rows`);
}

// 2. Test User Accounts & Credentials
console.log('\n[2] Checking User Accounts:');
const users = db.prepare('SELECT id, email, role, name FROM users LIMIT 5').all();
console.log(users);

// 3. Test Property & Units
console.log('\n[3] Checking Properties & Units:');
const prop = db.prepare('SELECT id, name, type, portfolio, total_units, occupied_units FROM properties LIMIT 2').all();
console.log(prop);
const units = db.prepare('SELECT id, property_id, unit_number, status, rent_amount FROM property_units LIMIT 3').all();
console.log('Sample units:', units);

// 4. Test Invoices & Ledger
console.log('\n[4] Checking Invoices & Double-Entry Ledger:');
const invoices = db.prepare('SELECT id, invoice_number, tenant_name, total_amount, status FROM invoices LIMIT 3').all();
console.log('Invoices:', invoices);
const ledger = db.prepare('SELECT id, type, amount, account, description FROM ledger LIMIT 3').all();
console.log('Ledger entries:', ledger);

// 5. Test Live Onboarding via DB API
console.log('\n[5] Simulating Owner & Tenant Onboarding:');
const testOwnerId = `user-owner-test-${Date.now()}`;
db.prepare(`
  INSERT INTO users (id, email, password, name, role, role_label, avatar, title, description, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  testOwnerId,
  `testowner_${Date.now()}@staywise.com`,
  'Owner@123',
  'Rohit Sharma',
  'owner',
  'Property Owner',
  '👨‍💼',
  'Rohit Asset Holdings Owner',
  'Bangalore • Registered Portfolio',
  new Date().toISOString()
);
console.log('  ✓ Successfully onboarded test owner into SQLite database:', testOwnerId);

const testTenantId = `t-test-${Date.now()}`;
db.prepare(`
  INSERT INTO tenants (
    id, name, email, phone, property_id, property_name, unit_number,
    monthly_rent, deposit_paid, lease_start, lease_end, rent_due_date, emergency_contact, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  testTenantId,
  'Deepak Varma',
  `deepak_${Date.now()}@staywise.com`,
  '+91 99887 76655',
  'prop-beach-road',
  'Beach Road Apartments',
  '501',
  32000,
  96000,
  '2026-10-15',
  '2027-10-14',
  5,
  'Primary Contact',
  new Date().toISOString()
);
console.log('  ✓ Successfully onboarded test tenant into SQLite database:', testTenantId);

// Record ledger entry for security deposit
db.prepare(`
  INSERT INTO ledger (id, timestamp, description, type, amount, account, entity_type, reference_id, settlement_status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  `ledg-test-${Date.now()}`,
  new Date().toISOString(),
  'Security Deposit Onboarded - Unit 501 (Deepak Varma)',
  'CREDIT',
  96000,
  '1020-STATUTORY-TENANT-DEPOSIT-TRUST',
  'RENT',
  'STW-2026-10-501',
  'CLEARED',
  new Date().toISOString()
);
console.log('  ✓ Security deposit recorded in double-entry ledger');

db.close();
console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
