import fs from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_JSON_PATH = path.join(DATA_DIR, 'staywise_db.json');
const SQLITE_FILE = path.join(DATA_DIR, 'database.db');
const ROOT_SQLITE_FILE = path.join(process.cwd(), 'database.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('--- Initializing Real SQLite Database ---');
console.log('Target file:', SQLITE_FILE);

// Remove old db if exists
if (fs.existsSync(SQLITE_FILE)) {
  try { fs.unlinkSync(SQLITE_FILE); } catch(e) {}
}

const db = new DatabaseSync(SQLITE_FILE);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Helper for safe sqlite binding (no undefined values)
const b = (val, defaultVal = null) => {
  if (val === undefined) return defaultVal;
  return val;
};

// Create Tables matching exact domain models
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  role_label TEXT NOT NULL,
  avatar TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  portfolio TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_units INTEGER NOT NULL,
  occupied_units INTEGER NOT NULL,
  expected_monthly_rent REAL NOT NULL,
  collected_rent REAL NOT NULL DEFAULT 0,
  pending_rent REAL NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL,
  health_score INTEGER NOT NULL DEFAULT 90,
  verification_status TEXT NOT NULL DEFAULT 'PENDING',
  submitted_docs TEXT NOT NULL DEFAULT '[]',
  amenities TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_units (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL,
  rent_amount REAL NOT NULL,
  deposit_amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'VACANT',
  current_tenant_id TEXT,
  current_tenant_name TEXT,
  lease_end TEXT,
  area_sq_ft REAL NOT NULL DEFAULT 0,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  monthly_rent REAL NOT NULL,
  deposit_paid REAL NOT NULL,
  lease_start TEXT NOT NULL,
  lease_end TEXT NOT NULL,
  rent_due_date INTEGER NOT NULL DEFAULT 5,
  salary_date INTEGER,
  autopay_active INTEGER NOT NULL DEFAULT 1,
  reliability_score INTEGER NOT NULL DEFAULT 100,
  kyc_verified INTEGER NOT NULL DEFAULT 1,
  rewards_balance REAL NOT NULL DEFAULT 0,
  emergency_contact TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  period TEXT NOT NULL,
  base_rent REAL NOT NULL,
  cam_charges REAL DEFAULT 0,
  utility_charges REAL DEFAULT 0,
  late_fee REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  paid_amount REAL NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  paid_date TEXT,
  transaction_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ledger (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  account TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  settlement_status TEXT NOT NULL DEFAULT 'CLEARED',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  estimated_cost REAL NOT NULL DEFAULT 0,
  actual_cost REAL,
  requires_owner_approval INTEGER NOT NULL DEFAULT 0,
  owner_approved INTEGER,
  vendor_id TEXT,
  vendor_name TEXT,
  created_at TEXT NOT NULL,
  scheduled_date TEXT,
  completed_at TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_area TEXT NOT NULL,
  budget_min REAL NOT NULL,
  budget_max REAL NOT NULL,
  move_in_urgency TEXT NOT NULL,
  score_category TEXT NOT NULL,
  score_explanation TEXT NOT NULL,
  stage TEXT NOT NULL,
  property_interest TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  assigned_agent TEXT NOT NULL,
  visit_date TEXT
);

CREATE TABLE IF NOT EXISTS estate_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  category TEXT NOT NULL,
  estate_name TEXT NOT NULL,
  purchase_date TEXT NOT NULL,
  warranty_until TEXT NOT NULL,
  amc_provider TEXT NOT NULL,
  last_service TEXT NOT NULL,
  next_service TEXT NOT NULL,
  condition TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  estate_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  shift TEXT NOT NULL,
  attendance_status TEXT NOT NULL,
  monthly_salary REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS utilities (
  id TEXT PRIMARY KEY,
  utility_type TEXT NOT NULL,
  estate_name TEXT NOT NULL,
  meter_number TEXT NOT NULL,
  previous_reading REAL NOT NULL,
  current_reading REAL NOT NULL,
  consumption_unit TEXT NOT NULL,
  bill_amount REAL NOT NULL,
  reading_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS electricity_bills (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  meter_number TEXT NOT NULL,
  billing_month TEXT NOT NULL,
  previous_reading REAL NOT NULL,
  current_reading REAL NOT NULL,
  units_consumed REAL NOT NULL,
  rate_per_unit REAL NOT NULL,
  sub_total REAL NOT NULL,
  fixed_charges REAL NOT NULL,
  tax_amount REAL NOT NULL,
  total_amount REAL NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL,
  discom TEXT NOT NULL,
  attachment_name TEXT,
  file_size TEXT,
  bill_document_url TEXT,
  uploaded_at TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_amount REAL,
  action_text TEXT,
  action_payload TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pg_beds (
  id TEXT PRIMARY KEY,
  bed_code TEXT,
  room_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  sharing_type TEXT NOT NULL,
  status TEXT NOT NULL,
  monthly_rent REAL NOT NULL,
  deposit REAL NOT NULL,
  tenant_id TEXT,
  tenant_name TEXT,
  tenant_phone TEXT,
  ac INTEGER NOT NULL DEFAULT 1,
  attached_bath INTEGER NOT NULL DEFAULT 1,
  food_included INTEGER NOT NULL DEFAULT 1,
  wifi_included INTEGER NOT NULL DEFAULT 1,
  laundry_included INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pg_rooms (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  sharing_type TEXT NOT NULL,
  electricity_split_method TEXT,
  submeter_reading REAL,
  room_rent_total REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS pg_meals (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  menu TEXT NOT NULL,
  vendor TEXT NOT NULL,
  opted_in_count INTEGER NOT NULL DEFAULT 0,
  cost_per_meal REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS commercial_units (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  unit_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  business_name TEXT,
  business_type TEXT,
  area_sq_ft REAL NOT NULL,
  base_rent REAL NOT NULL,
  cam_rate_per_sqft REAL NOT NULL,
  cam_amount REAL NOT NULL,
  parking_slots INTEGER NOT NULL DEFAULT 0,
  lock_in_period_months INTEGER NOT NULL DEFAULT 12,
  notice_period_months INTEGER NOT NULL DEFAULT 3,
  escalation_percent REAL NOT NULL DEFAULT 5,
  fit_out_status TEXT NOT NULL DEFAULT 'Ready',
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cam_expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  monthly_cost REAL NOT NULL,
  allocation_method TEXT NOT NULL,
  vendor_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commercial_visitors (
  id TEXT PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  host_company TEXT NOT NULL,
  purpose TEXT NOT NULL,
  vehicle_number TEXT,
  check_in_time TEXT NOT NULL,
  status TEXT NOT NULL,
  pass_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS moveflow_checklist (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  due_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deposit_disputes (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  property_name TEXT,
  unit_or_bed TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  deposit_paid REAL NOT NULL,
  deductions_json TEXT NOT NULL DEFAULT '[]',
  proposed_refund REAL NOT NULL,
  disputed_amount REAL NOT NULL,
  tenant_notes TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referral_code TEXT NOT NULL,
  referred_name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  reward_amount REAL NOT NULL,
  status TEXT NOT NULL,
  date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS influencer_offers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  influencer_name TEXT NOT NULL,
  influencer_handle TEXT NOT NULL,
  commission_type TEXT NOT NULL,
  commission_value REAL NOT NULL,
  audience_offer TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  signups_count INTEGER NOT NULL DEFAULT 0,
  total_commission_paid REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  days_remaining INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  max_units INTEGER NOT NULL,
  current_units INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  last_payment_txn_id TEXT NOT NULL,
  last_payment_date TEXT NOT NULL,
  auto_renew INTEGER NOT NULL DEFAULT 1,
  gstin TEXT NOT NULL,
  tamper_proof_hash TEXT NOT NULL,
  history_json TEXT NOT NULL DEFAULT '[]',
  is_trial INTEGER NOT NULL DEFAULT 0,
  trial_days_remaining INTEGER,
  trial_ends_at TEXT,
  can_cancel_before TEXT,
  autopay_connected INTEGER NOT NULL DEFAULT 0,
  autopay_method TEXT,
  autopay_masked_details TEXT,
  first_charge_amount REAL,
  first_charge_date TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

console.log('Tables created successfully.');

// Read JSON mock data
let jsonData = {};
if (fs.existsSync(DB_JSON_PATH)) {
  console.log('Reading seed data from staywise_db.json...');
  jsonData = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf-8'));
}

// 1. Seed Users
if (jsonData.users && jsonData.users.length) {
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password, name, role, role_label, avatar, title, description, phone, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const u of jsonData.users) {
    insertUser.run(
      b(u.id),
      b(u.email),
      b(/^[a-f0-9]{64}$/i.test(u.password) ? u.password : crypto.createHash('sha256').update(u.password).digest('hex')),
      b(u.name),
      b(u.role),
      b(u.roleLabel, u.role),
      b(u.avatar, '👤'),
      b(u.title, 'Member'),
      b(u.description, ''),
      b(u.phone, null),
      b(u.createdAt, new Date().toISOString())
    );
  }
  console.log(`Seeded ${jsonData.users.length} users.`);
}

// 2. Seed Properties & Units
if (jsonData.properties && jsonData.properties.length) {
  const insertProp = db.prepare(`
    INSERT OR REPLACE INTO properties (
      id, name, type, portfolio, address, city, state, pincode,
      total_units, occupied_units, expected_monthly_rent, collected_rent, pending_rent,
      image_url, status, health_score, verification_status, submitted_docs, amenities, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertUnit = db.prepare(`
    INSERT OR REPLACE INTO property_units (
      id, property_id, unit_number, floor, type, rent_amount, deposit_amount,
      status, current_tenant_id, current_tenant_name, lease_end, area_sq_ft, bedrooms, bathrooms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let unitCount = 0;
  for (const p of jsonData.properties) {
    insertProp.run(
      b(p.id),
      b(p.name),
      b(p.type),
      b(p.portfolio),
      b(p.address),
      b(p.city),
      b(p.state),
      b(p.pincode),
      b(p.totalUnits, 0),
      b(p.occupiedUnits, 0),
      b(p.expectedMonthlyRent, 0),
      b(p.collectedRent, 0),
      b(p.pendingRent, 0),
      b(p.imageUrl, '/images/properties/beach-road.jpg'),
      b(p.status, 'ACTIVE'),
      b(p.healthScore, 90),
      b(p.verificationStatus, 'APPROVED'),
      JSON.stringify(p.submittedDocs || []),
      JSON.stringify(p.amenities || []),
      new Date().toISOString()
    );

    if (Array.isArray(p.units)) {
      for (const u of p.units) {
        insertUnit.run(
          b(u.id),
          b(p.id),
          b(u.unitNumber),
          b(u.floor, 1),
          b(u.type, 'Standard'),
          b(u.rentAmount, 0),
          b(u.depositAmount, 0),
          b(u.status, 'VACANT'),
          b(u.currentTenantId, null),
          b(u.currentTenantName, null),
          b(u.leaseEnd, null),
          b(u.areaSqFt, 0),
          b(u.bedrooms, 1),
          b(u.bathrooms, 1)
        );
        unitCount++;
      }
    }
  }
  console.log(`Seeded ${jsonData.properties.length} properties and ${unitCount} units.`);
}

// 3. Seed Tenants
if (jsonData.tenants && jsonData.tenants.length) {
  const insertTenant = db.prepare(`
    INSERT OR REPLACE INTO tenants (
      id, name, email, phone, property_id, property_name, unit_number,
      monthly_rent, deposit_paid, lease_start, lease_end, rent_due_date, salary_date,
      autopay_active, reliability_score, kyc_verified, rewards_balance, emergency_contact, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const t of jsonData.tenants) {
    insertTenant.run(
      b(t.id),
      b(t.name),
      b(t.email),
      b(t.phone),
      b(t.propertyId),
      b(t.propertyName),
      b(t.unitNumber),
      b(t.monthlyRent, 0),
      b(t.depositPaid, 0),
      b(t.leaseStart),
      b(t.leaseEnd),
      b(t.rentDueDate, 5),
      b(t.salaryDate, null),
      t.autopayActive ? 1 : 0,
      b(t.reliabilityScore, 100),
      t.kycVerified ? 1 : 0,
      b(t.rewardsBalance, 0),
      b(t.emergencyContact, 'Primary Contact'),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.tenants.length} tenants.`);
}

// 4. Seed Invoices
if (jsonData.invoices && jsonData.invoices.length) {
  const insertInvoice = db.prepare(`
    INSERT OR REPLACE INTO invoices (
      id, invoice_number, tenant_id, tenant_name, property_id, property_name, unit_number,
      period, base_rent, cam_charges, utility_charges, late_fee, total_amount, paid_amount,
      due_date, status, payment_method, paid_date, transaction_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inv of jsonData.invoices) {
    insertInvoice.run(
      b(inv.id),
      b(inv.invoiceNumber),
      b(inv.tenantId),
      b(inv.tenantName),
      b(inv.propertyId),
      b(inv.propertyName),
      b(inv.unitNumber),
      b(inv.period),
      b(inv.baseRent, 0),
      b(inv.camCharges, 0),
      b(inv.utilityCharges, 0),
      b(inv.lateFee, 0),
      b(inv.totalAmount, 0),
      b(inv.paidAmount, 0),
      b(inv.dueDate),
      b(inv.status),
      b(inv.paymentMethod, null),
      b(inv.paidDate, null),
      b(inv.transactionId, null),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.invoices.length} invoices.`);
}

// 5. Seed Ledger
if (jsonData.ledger && jsonData.ledger.length) {
  const insertLedger = db.prepare(`
    INSERT OR REPLACE INTO ledger (
      id, timestamp, description, type, amount, account, entity_type, reference_id, settlement_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of jsonData.ledger) {
    insertLedger.run(
      b(l.id),
      b(l.timestamp),
      b(l.description),
      b(l.type),
      b(l.amount),
      b(l.account),
      b(l.entityType),
      b(l.referenceId),
      b(l.settlementStatus, 'CLEARED'),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.ledger.length} ledger entries.`);
}

// 6. Seed Tickets
if (jsonData.tickets && jsonData.tickets.length) {
  const insertTicket = db.prepare(`
    INSERT OR REPLACE INTO tickets (
      id, ticket_number, property_id, property_name, unit_number, tenant_name,
      category, title, description, priority, status, estimated_cost, actual_cost,
      requires_owner_approval, owner_approved, vendor_id, vendor_name,
      created_at, scheduled_date, completed_at, before_photo_url, after_photo_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const tk of jsonData.tickets) {
    insertTicket.run(
      b(tk.id),
      b(tk.ticketNumber),
      b(tk.propertyId),
      b(tk.propertyName),
      b(tk.unitNumber),
      b(tk.tenantName),
      b(tk.category),
      b(tk.title),
      b(tk.description),
      b(tk.priority),
      b(tk.status),
      b(tk.estimatedCost, 0),
      b(tk.actualCost, null),
      tk.requiresOwnerApproval ? 1 : 0,
      tk.ownerApproved ? 1 : 0,
      b(tk.vendorId, null),
      b(tk.vendorName, null),
      b(tk.createdAt, new Date().toISOString()),
      b(tk.scheduledDate, null),
      b(tk.completedAt, null),
      b(tk.beforePhotoUrl, null),
      b(tk.afterPhotoUrl, null)
    );
  }
  console.log(`Seeded ${jsonData.tickets.length} tickets.`);
}

// 7. Seed Leads
if (jsonData.leads && jsonData.leads.length) {
  const insertLead = db.prepare(`
    INSERT OR REPLACE INTO leads (
      id, name, phone, email, preferred_area, budget_min, budget_max,
      move_in_urgency, score_category, score_explanation, stage,
      property_interest, source, created_at, assigned_agent, visit_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const ld of jsonData.leads) {
    insertLead.run(
      b(ld.id),
      b(ld.name),
      b(ld.phone),
      b(ld.email),
      b(ld.preferredArea),
      b(ld.budgetMin, 0),
      b(ld.budgetMax, 0),
      b(ld.moveInUrgency),
      b(ld.scoreCategory),
      b(ld.scoreExplanation),
      b(ld.stage),
      b(ld.propertyInterest),
      b(ld.source),
      b(ld.createdAt),
      b(ld.assignedAgent),
      b(ld.visitDate, null)
    );
  }
  console.log(`Seeded ${jsonData.leads.length} leads.`);
}

// 8. Seed Estate Assets
if (jsonData.estateAssets && jsonData.estateAssets.length) {
  const insertAsset = db.prepare(`
    INSERT OR REPLACE INTO estate_assets (
      id, name, tag, category, estate_name, purchase_date, warranty_until,
      amc_provider, last_service, next_service, condition
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of jsonData.estateAssets) {
    insertAsset.run(
      b(a.id),
      b(a.name),
      b(a.tag),
      b(a.category),
      b(a.estateName),
      b(a.purchaseDate),
      b(a.warrantyUntil),
      b(a.amcProvider),
      b(a.lastService),
      b(a.nextService),
      b(a.condition)
    );
  }
  console.log(`Seeded ${jsonData.estateAssets.length} estate assets.`);
}

// 9. Seed Staff
if (jsonData.staff && jsonData.staff.length) {
  const insertStaff = db.prepare(`
    INSERT OR REPLACE INTO staff (id, name, role, estate_name, phone, shift, attendance_status, monthly_salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of jsonData.staff) {
    insertStaff.run(
      b(s.id),
      b(s.name),
      b(s.role),
      b(s.estateName),
      b(s.phone),
      b(s.shift),
      b(s.attendanceStatus),
      b(s.monthlySalary, 0)
    );
  }
  console.log(`Seeded ${jsonData.staff.length} staff members.`);
}

// 10. Seed Utilities
if (jsonData.utilities && jsonData.utilities.length) {
  const insertUtil = db.prepare(`
    INSERT OR REPLACE INTO utilities (
      id, utility_type, estate_name, meter_number, previous_reading,
      current_reading, consumption_unit, bill_amount, reading_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of jsonData.utilities) {
    insertUtil.run(
      b(u.id),
      b(u.utilityType),
      b(u.estateName),
      b(u.meterNumber),
      b(u.previousReading, 0),
      b(u.currentReading, 0),
      b(u.consumptionUnit),
      b(u.billAmount, 0),
      b(u.readingDate)
    );
  }
  console.log(`Seeded ${jsonData.utilities.length} utilities.`);
}

// 11. Seed AI Insights
if (jsonData.aiInsights && jsonData.aiInsights.length) {
  const insertInsight = db.prepare(`
    INSERT OR REPLACE INTO ai_insights (
      id, category, title, description, impact_amount, action_text, action_payload, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const ins of jsonData.aiInsights) {
    insertInsight.run(
      b(ins.id),
      b(ins.category),
      b(ins.title),
      b(ins.description),
      b(ins.impactAmount, null),
      b(ins.actionText, null),
      b(ins.actionPayload, null),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.aiInsights.length} AI insights.`);
}

// 12. Seed PG Beds & Rooms & Meals
if (jsonData.pgBeds && jsonData.pgBeds.length) {
  const insertBed = db.prepare(`
    INSERT OR REPLACE INTO pg_beds (
      id, bed_code, room_id, room_number, floor, sharing_type, status,
      monthly_rent, deposit, tenant_id, tenant_name, tenant_phone,
      ac, attached_bath, food_included, wifi_included, laundry_included
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const bed of jsonData.pgBeds) {
    insertBed.run(
      b(bed.id),
      b(bed.bedCode, null),
      b(bed.roomId),
      b(bed.roomNumber),
      b(bed.floor, 1),
      b(bed.sharingType, 'Standard'),
      b(bed.status, 'Available'),
      b(bed.monthlyRent, 0),
      b(bed.deposit, 0),
      b(bed.tenantId, null),
      b(bed.tenantName, null),
      b(bed.tenantPhone, null),
      bed.ac ? 1 : 0,
      bed.attachedBath ? 1 : 0,
      bed.foodIncluded ? 1 : 0,
      bed.wifiIncluded ? 1 : 0,
      bed.laundryIncluded ? 1 : 0
    );
  }
  console.log(`Seeded ${jsonData.pgBeds.length} PG beds.`);
}

if (jsonData.pgRooms && jsonData.pgRooms.length) {
  const insertRoom = db.prepare(`
    INSERT OR REPLACE INTO pg_rooms (id, property_id, room_number, floor, sharing_type, electricity_split_method, submeter_reading, room_rent_total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of jsonData.pgRooms) {
    insertRoom.run(
      b(r.id),
      b(r.propertyId, 'prop-urban-pg'),
      b(r.roomNumber),
      b(r.floor, 1),
      b(r.sharingType, '2-Sharing'),
      b(r.electricitySplitMethod, 'Submeter'),
      b(r.submeterReading, 0),
      b(r.roomRentTotal, 0)
    );
  }
  console.log(`Seeded ${jsonData.pgRooms.length} PG rooms.`);
}

if (jsonData.pgMeals && jsonData.pgMeals.length) {
  const insertMeal = db.prepare(`
    INSERT OR REPLACE INTO pg_meals (id, date, meal_type, menu, vendor, opted_in_count, cost_per_meal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const m of jsonData.pgMeals) {
    insertMeal.run(
      b(m.id),
      b(m.date, 'Today'),
      b(m.mealType, 'Breakfast'),
      b(m.menu, ''),
      b(m.vendor, ''),
      b(m.optedInCount, 0),
      b(m.costPerMeal, 0)
    );
  }
  console.log(`Seeded ${jsonData.pgMeals.length} PG meals.`);
}

// 13. Seed Commercial Units, CAM, Visitors
if (jsonData.commercialUnits && jsonData.commercialUnits.length) {
  const insertCU = db.prepare(`
    INSERT OR REPLACE INTO commercial_units (
      id, property_id, unit_number, floor, business_name, business_type,
      area_sq_ft, base_rent, cam_rate_per_sqft, cam_amount, parking_slots,
      lock_in_period_months, notice_period_months, escalation_percent, fit_out_status, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of jsonData.commercialUnits) {
    insertCU.run(
      b(c.id),
      b(c.propertyId, null),
      b(c.unitNumber),
      b(c.floor, 1),
      b(c.businessName, null),
      b(c.businessType, null),
      b(c.areaSqFt, 0),
      b(c.baseRent, 0),
      b(c.camRatePerSqFt, 0),
      b(c.camAmount, 0),
      b(c.parkingSlots, 0),
      b(c.lockInPeriodMonths, 12),
      b(c.noticePeriodMonths, 3),
      b(c.escalationPercent, 5),
      b(c.fitOutStatus, 'Ready'),
      b(c.status, 'Occupied')
    );
  }
  console.log(`Seeded ${jsonData.commercialUnits.length} commercial units.`);
}

if (jsonData.camExpenses && jsonData.camExpenses.length) {
  const insertCAM = db.prepare(`
    INSERT OR REPLACE INTO cam_expenses (id, category, monthly_cost, allocation_method, vendor_name)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const e of jsonData.camExpenses) {
    insertCAM.run(
      b(e.id),
      b(e.category),
      b(e.monthlyCost, 0),
      b(e.allocationMethod, 'Area-based'),
      b(e.vendorName, '')
    );
  }
  console.log(`Seeded ${jsonData.camExpenses.length} CAM expenses.`);
}

if (jsonData.commercialVisitors && jsonData.commercialVisitors.length) {
  const insertCV = db.prepare(`
    INSERT OR REPLACE INTO commercial_visitors (id, visitor_name, host_company, purpose, vehicle_number, check_in_time, status, pass_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const v of jsonData.commercialVisitors) {
    insertCV.run(
      b(v.id),
      b(v.visitorName),
      b(v.hostCompany),
      b(v.purpose),
      b(v.vehicleNumber, null),
      b(v.checkInTime),
      b(v.status),
      b(v.passCode)
    );
  }
  console.log(`Seeded ${jsonData.commercialVisitors.length} commercial visitors.`);
}

// 14. Seed MoveFlow, Disputes, Referrals, Offers, Subscriptions
if (jsonData.moveFlowChecklist && jsonData.moveFlowChecklist.length) {
  const insertMF = db.prepare(`
    INSERT OR REPLACE INTO moveflow_checklist (id, title, category, completed, due_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const mf of jsonData.moveFlowChecklist) {
    insertMF.run(
      b(mf.id),
      b(mf.title),
      b(mf.category),
      mf.completed ? 1 : 0,
      b(mf.dueDate)
    );
  }
  console.log(`Seeded ${jsonData.moveFlowChecklist.length} MoveFlow checklist items.`);
}

if (jsonData.depositDisputes && jsonData.depositDisputes.length) {
  const insertDD = db.prepare(`
    INSERT OR REPLACE INTO deposit_disputes (
      id, property_id, property_name, unit_or_bed, tenant_name,
      deposit_paid, deductions_json, proposed_refund, disputed_amount,
      tenant_notes, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const d of jsonData.depositDisputes) {
    insertDD.run(
      b(d.id),
      b(d.propertyId, null),
      b(d.propertyName, null),
      b(d.unitOrBed),
      b(d.tenantName),
      b(d.depositPaid, 0),
      JSON.stringify(d.deductions || []),
      b(d.proposedRefund, 0),
      b(d.disputedAmount, 0),
      b(d.tenantNotes, null),
      b(d.status),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.depositDisputes.length} deposit disputes.`);
}

if (jsonData.referrals && jsonData.referrals.length) {
  const insertRef = db.prepare(`
    INSERT OR REPLACE INTO referrals (id, referral_code, referred_name, property_type, reward_amount, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of jsonData.referrals) {
    insertRef.run(
      b(r.id),
      b(r.referralCode, ''),
      b(r.referredName),
      b(r.propertyType),
      b(r.rewardAmount, 0),
      b(r.status),
      b(r.date)
    );
  }
  console.log(`Seeded ${jsonData.referrals.length} referrals.`);
}

if (jsonData.influencerOffers && jsonData.influencerOffers.length) {
  const insertIO = db.prepare(`
    INSERT OR REPLACE INTO influencer_offers (
      id, code, influencer_name, influencer_handle, commission_type, commission_value,
      audience_offer, target_audience, signups_count, total_commission_paid, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const o of jsonData.influencerOffers) {
    insertIO.run(
      b(o.id),
      b(o.code),
      b(o.influencerName),
      b(o.influencerHandle),
      b(o.commissionType),
      b(o.commissionValue, 0),
      b(o.audienceOffer),
      b(o.targetAudience, 'Both'),
      b(o.signupsCount, 0),
      b(o.totalCommissionPaid, 0),
      b(o.status, 'ACTIVE'),
      b(o.createdAt, new Date().toISOString())
    );
  }
  console.log(`Seeded ${jsonData.influencerOffers.length} influencer offers.`);
}

if (jsonData.subscriptions && jsonData.subscriptions.length) {
  const insertSub = db.prepare(`
    INSERT OR REPLACE INTO subscriptions (
      id, user_id, owner_name, entity_name, plan_id, plan_name, status,
      billing_cycle, start_date, end_date, days_remaining, amount, currency,
      max_units, current_units, payment_method, last_payment_txn_id, last_payment_date,
      auto_renew, gstin, tamper_proof_hash, history_json, is_trial, trial_days_remaining,
      trial_ends_at, can_cancel_before, autopay_connected, autopay_method, autopay_masked_details,
      first_charge_amount, first_charge_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of jsonData.subscriptions) {
    insertSub.run(
      b(s.id),
      b(s.userId),
      b(s.ownerName),
      b(s.entityName),
      b(s.planId),
      b(s.planName),
      b(s.status),
      b(s.billingCycle),
      b(s.startDate),
      b(s.endDate),
      b(s.daysRemaining, 0),
      b(s.amount, 0),
      b(s.currency, 'INR'),
      b(s.maxUnits, 50),
      b(s.currentUnits, 1),
      b(s.paymentMethod, 'Auto-Debit'),
      b(s.lastPaymentTxnId, 'TXN-INITIAL'),
      b(s.lastPaymentDate, s.startDate),
      s.autoRenew ? 1 : 0,
      b(s.gstin, '29AAACS1928K1Z5'),
      b(s.tamperProofHash, ''),
      JSON.stringify(s.history || []),
      s.isTrial ? 1 : 0,
      b(s.trialDaysRemaining, null),
      b(s.trialEndsAt, null),
      b(s.canCancelBefore, null),
      s.autopayConnected ? 1 : 0,
      b(s.autopayMethod, null),
      b(s.autopayMaskedDetails, null),
      b(s.firstChargeAmount, null),
      b(s.firstChargeDate, null),
      new Date().toISOString()
    );
  }
  console.log(`Seeded ${jsonData.subscriptions.length} subscriptions.`);
}

// Meta table
db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('schema_version', '1');
db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('last_migrated', new Date().toISOString());

db.close();

// Copy to workspace root database.db
fs.copyFileSync(SQLITE_FILE, ROOT_SQLITE_FILE);
console.log('✅ SQLite database created successfully:');
console.log('  1. data/database.db (' + fs.statSync(SQLITE_FILE).size + ' bytes)');
console.log('  2. database.db (' + fs.statSync(ROOT_SQLITE_FILE).size + ' bytes)');
console.log('--- Migration Completed Successfully ---');
