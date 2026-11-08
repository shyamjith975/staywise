/**
 * ============================================================================
 * STAYWISE PLATFORM — PRISTINE DATABASE RESET & CANONICAL SEED SCRIPT
 * ============================================================================
 * Resets SQLite database.db to a clean, production-grade state with:
 * EXACTLY 4 canonical logins:
 *   1. Owner:    owner@staywise.com   / Owner@123   (user-owner-vikram)
 *   2. Tenant:   tenant@staywise.com  / Tenant@123  (user-tenant-shyam)
 *   3. EstateOS: estate@staywise.com  / Estate@123  (user-estate-manoj)
 *   4. Admin:    admin@staywise.com   / admin@123   (user-admin-chief)
 *
 * Plus fully interconnected relational viewing data:
 * - 3 properties owned by Owner Vikram (Beach Road, Infovision, Urban PG)
 * - 1 property managed by EstateOS Manoj (Serene Mist Estate Villa)
 * - Beach Road Unit 304 occupied by Tenant Shyam with live rent & deposit protection
 * - Commercial CAM expenses and units in Infovision
 * - PG beds, rooms, and meals in Urban PG
 * - Serene Mist Estate assets, utilities, and hospitality staff
 * - WisePoints rewards ledger and Deposit Protect guarantee
 * ============================================================================
 */

import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.db');
console.log('Connecting to database:', DB_PATH);
const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA foreign_keys = OFF;');
db.exec('PRAGMA journal_mode = WAL;');

const hashPassword = (p) => crypto.createHash('sha256').update(p.trim()).digest('hex');

console.log('Purging legacy simulation tables...');
const tablesToClean = [
  'users', 'properties', 'property_units', 'tenants', 'invoices', 'ledger',
  'tickets', 'leads', 'estate_assets', 'staff', 'utilities', 'electricity_bills',
  'ai_insights', 'pg_beds', 'pg_rooms', 'pg_meals', 'commercial_units',
  'cam_expenses', 'commercial_visitors', 'moveflow_checklist', 'deposit_disputes',
  'referrals', 'influencer_offers', 'subscriptions', 'tenant_connection_requests',
  'rewards_accounts', 'rewards_ledger', 'reward_rules', 'merchant_offers',
  'deposit_protection_applications', 'protection_contracts', 'property_condition_reports',
  'protection_claims', 'sessions'
];

for (const t of tablesToClean) {
  try {
    db.exec(`DELETE FROM "${t}";`);
  } catch (e) {
    console.warn(`Notice on clearing ${t}:`, e.message);
  }
}

console.log('Seeding EXACTLY 4 Canonical Logins...');
const insertUser = db.prepare(`
  INSERT INTO users (id, email, password, name, role, role_label, avatar, title, description, phone, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertUser.run(
  'user-owner-vikram',
  'owner@staywise.com',
  hashPassword('Owner@123'),
  'Vikram Singhania',
  'owner',
  'Property Owner',
  '👨‍💼',
  'Asset Portfolio Owner',
  '3 Portfolios • 21 Units • Escrow Account Active',
  '+91 98450 11223',
  new Date().toISOString()
);

insertUser.run(
  'user-tenant-shyam',
  'tenant@staywise.com',
  hashPassword('Tenant@123'),
  'Shyam Sundar',
  'tenant',
  'Verified Resident',
  '🧑‍💻',
  'Senior Software Architect',
  'Beach Road #304 • Rent Autopay Active • 1,250 WisePoints',
  '+91 98450 99887',
  new Date().toISOString()
);

insertUser.run(
  'user-estate-manoj',
  'estate@staywise.com',
  hashPassword('Estate@123'),
  'Manoj Kumar',
  'estate_manager',
  'EstateOS & Hospitality',
  '🏡',
  'Estate Director & Hospitality Host',
  'Serene Mist Villa • Wayanad Retreats • Smart Check-in',
  '+91 94470 55443',
  new Date().toISOString()
);

insertUser.run(
  'user-admin-chief',
  'admin@staywise.com',
  hashPassword('admin@123'),
  'Chief Admin',
  'admin',
  'Super Admin',
  '🛡️',
  'Platform Governance & Risk',
  'Statutory Double-Entry Ledger Surveillance',
  '+91 98450 00001',
  new Date().toISOString()
);

console.log('Seeding Properties & Units...');
const insertProp = db.prepare(`
  INSERT INTO properties (
    id, owner_id, name, type, portfolio, address, city, state, pincode,
    total_units, occupied_units, expected_monthly_rent, collected_rent, pending_rent,
    image_url, status, health_score, verification_status, submitted_docs, amenities, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1. Beach Road Apartments (Owner Vikram)
insertProp.run(
  'prop-beach-road',
  'user-owner-vikram',
  'Beach Road Apartments',
  'Apartment',
  'Kozhikode Coastal',
  'Beach Road, Near Old Light House',
  'Kozhikode',
  'Kerala',
  '673032',
  12,
  11,
  480000,
  454000,
  26000,
  '/images/properties/beach-road.jpg',
  'ACTIVE',
  94,
  'APPROVED',
  JSON.stringify(['Title_Deed_Kozhikode_Reg.pdf', 'Fire_Safety_NOC_2026.pdf', 'Bescom_Tariff_Card.pdf']),
  JSON.stringify(['Sea View', 'Covered Parking', 'Elevator', '24/7 Security', 'Generator Backup', 'Rooftop Infinity Deck']),
  new Date().toISOString()
);

// 2. Infovision Commercial Hub (Owner Vikram)
insertProp.run(
  'prop-infovision',
  'user-owner-vikram',
  'Infovision Commercial Hub',
  'Commercial',
  'Kochi Commercial',
  'Cyber Park Road, Kakkanad',
  'Kochi',
  'Kerala',
  '682030',
  8,
  7,
  820000,
  820000,
  0,
  '/images/properties/beach-road.jpg',
  'ACTIVE',
  96,
  'APPROVED',
  JSON.stringify(['Commercial_Zoning_Kakkanad.pdf', 'Lift_License_Otis_2026.pdf']),
  JSON.stringify(['Fiber Internet', 'Visitor Parking', 'BMS Automation', 'Cafeteria', '100% DG Backup']),
  new Date().toISOString()
);

// 3. Staywise Urban PG (Owner Vikram)
insertProp.run(
  'prop-urban-pg',
  'user-owner-vikram',
  'Staywise Urban PG & Co-living',
  'PG',
  'Bangalore Tech Belt',
  '14th Main, HSR Layout Sector 4',
  'Bangalore',
  'Karnataka',
  '560102',
  120,
  112,
  1250000,
  1210000,
  40000,
  '/images/properties/beach-road.jpg',
  'ACTIVE',
  91,
  'APPROVED',
  JSON.stringify(['Trade_License_BBMP.pdf', 'Food_Safety_FSSAI.pdf']),
  JSON.stringify(['3 Meals/Day', 'High-Speed Wi-Fi', 'Biometric Entry', 'Laundry Service', 'Gym']),
  new Date().toISOString()
);

// 4. Serene Mist Estate Villa (Estate Manager Manoj)
insertProp.run(
  'prop-wayanad-villa',
  'user-estate-manoj',
  'Serene Mist Estate Villa',
  'Estate',
  'Wayanad Hill Retreats',
  'Vythiri Estate Road, Tea Valley',
  'Wayanad',
  'Kerala',
  '673576',
  1,
  1,
  180000,
  180000,
  0,
  '/images/properties/estate-villa.jpg',
  'ACTIVE',
  98,
  'APPROVED',
  JSON.stringify(['Heritage_Homestay_License.pdf', 'Pollution_Control_Board_NOC.pdf']),
  JSON.stringify(['Private Infinity Pool', 'Solar Microgrid', 'Organic Tea Plantation', 'Servant Quarters', 'Starlink Satellite Internet']),
  new Date().toISOString()
);

console.log('Seeding Property Units for Beach Road...');
const insertUnit = db.prepare(`
  INSERT INTO property_units (
    id, property_id, unit_number, floor, type, rent_amount, deposit_amount,
    status, current_tenant_id, current_tenant_name, lease_end, area_sq_ft, bedrooms, bathrooms
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertUnit.run('unit-101', 'prop-beach-road', '101', 1, '2 BHK', 24000, 72000, 'OCCUPIED', 'tenant-101', 'Rahul Menon', '2027-03-31', 1250, 2, 2);
insertUnit.run('unit-102', 'prop-beach-road', '102', 1, '2 BHK', 24000, 72000, 'OCCUPIED', 'tenant-102', 'Ananya Pillai', '2027-06-30', 1250, 2, 2);
insertUnit.run('unit-201', 'prop-beach-road', '201', 2, '3 BHK Sea View', 38000, 114000, 'OCCUPIED', 'tenant-201', 'Dr. Faisal Ahmed', '2026-12-31', 1800, 3, 3);
insertUnit.run('unit-302', 'prop-beach-road', '302', 3, '2 BHK Luxury', 25000, 75000, 'OCCUPIED', 'tenant-302', 'Kavita Nair', '2027-01-31', 1350, 2, 2);
insertUnit.run('unit-304', 'prop-beach-road', '304', 3, '2 BHK Sea View', 26000, 78000, 'OCCUPIED', 'tenant-shyam', 'Shyam Sundar', '2026-12-31', 1300, 2, 2);

console.log('Seeding Tenants...');
const insertTenant = db.prepare(`
  INSERT INTO tenants (
    id, user_id, name, email, phone, property_id, property_name, unit_number,
    monthly_rent, deposit_paid, lease_start, lease_end, rent_due_date, salary_date,
    autopay_active, reliability_score, kyc_verified, rewards_balance, emergency_contact,
    tenancy_type, aadhaar_number, pan_number, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTenant.run(
  'tenant-shyam',
  'user-tenant-shyam',
  'Shyam Sundar',
  'tenant@staywise.com',
  '+91 98450 99887',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  26000,
  78000,
  '2026-01-01',
  '2026-12-31',
  5,
  1,
  1,
  100,
  1,
  1250,
  'Suresh Sundar (+91 98450 99880)',
  'RESIDENTIAL',
  '•••• •••• 9812',
  '•••••4419K',
  new Date().toISOString()
);

insertTenant.run(
  'tenant-101',
  null,
  'Rahul Menon',
  'rahul.menon@gmail.com',
  '+91 98450 11992',
  'prop-beach-road',
  'Beach Road Apartments',
  '101',
  24000,
  72000,
  '2025-04-01',
  '2027-03-31',
  5,
  1,
  1,
  98,
  1,
  600,
  'Gopal Menon (+91 98450 11990)',
  'RESIDENTIAL',
  '•••• •••• 3341',
  '•••••8821M',
  new Date().toISOString()
);

insertTenant.run(
  'tenant-201',
  null,
  'Dr. Faisal Ahmed',
  'faisal.ahmed@medcenter.org',
  '+91 94470 33221',
  'prop-beach-road',
  'Beach Road Apartments',
  '201',
  38000,
  114000,
  '2025-01-01',
  '2026-12-31',
  5,
  5,
  1,
  100,
  1,
  1800,
  'Dr. Zoya Faisal (+91 94470 33220)',
  'RESIDENTIAL',
  '•••• •••• 7712',
  '•••••5512P',
  new Date().toISOString()
);

console.log('Seeding Invoices...');
const insertInvoice = db.prepare(`
  INSERT INTO invoices (
    id, invoice_number, tenant_id, tenant_name, property_id, property_name,
    unit_number, period, base_rent, cam_charges, utility_charges, late_fee,
    total_amount, paid_amount, due_date, status, payment_method, paid_date, transaction_id, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Shyam's Current Active Invoice (Due May 2026)
insertInvoice.run(
  'inv-shyam-may-2026',
  'INV-BR-2026-05-304',
  'tenant-shyam',
  'Shyam Sundar',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  'May 2026',
  26000,
  1500,
  0,
  0,
  27500,
  0,
  '2026-05-05',
  'Due',
  'UPI Autopay',
  null,
  null,
  new Date().toISOString()
);

// Shyam's Previous Invoices (Paid)
insertInvoice.run(
  'inv-shyam-apr-2026',
  'INV-BR-2026-04-304',
  'tenant-shyam',
  'Shyam Sundar',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  'April 2026',
  26000,
  1500,
  0,
  0,
  27500,
  27500,
  '2026-04-05',
  'Paid',
  'UPI Autopay',
  '2026-04-03',
  'TXN-UPI-9948210381',
  new Date().toISOString()
);

insertInvoice.run(
  'inv-shyam-mar-2026',
  'INV-BR-2026-03-304',
  'tenant-shyam',
  'Shyam Sundar',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  'March 2026',
  26000,
  1500,
  0,
  0,
  27500,
  27500,
  '2026-03-05',
  'Paid',
  'UPI Autopay',
  '2026-03-02',
  'TXN-UPI-8812930192',
  new Date().toISOString()
);

// Unit 101 & 201 Recent Invoices
insertInvoice.run(
  'inv-101-may-2026',
  'INV-BR-2026-05-101',
  'tenant-101',
  'Rahul Menon',
  'prop-beach-road',
  'Beach Road Apartments',
  '101',
  'May 2026',
  24000,
  1200,
  0,
  0,
  25200,
  25200,
  '2026-05-05',
  'Paid',
  'Net Banking',
  '2026-05-01',
  'TXN-NB-771239102',
  new Date().toISOString()
);

insertInvoice.run(
  'inv-201-may-2026',
  'INV-BR-2026-05-201',
  'tenant-201',
  'Dr. Faisal Ahmed',
  'prop-beach-road',
  'Beach Road Apartments',
  '201',
  'May 2026',
  38000,
  2000,
  0,
  0,
  40000,
  40000,
  '2026-05-05',
  'Paid',
  'UPI Autopay',
  '2026-05-02',
  'TXN-UPI-551029384',
  new Date().toISOString()
);

console.log('Seeding Double-Entry Statutory Ledger...');
const insertLedger = db.prepare(`
  INSERT INTO ledger (
    id, timestamp, description, type, amount, account, entity_type, reference_id, settlement_status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertLedger.run('led-1', '2026-05-01T10:00:00Z', 'Rent Inflow - Beach Road #101 (Rahul Menon)', 'INCOME', 25200, 'ICICI Escrow Main', 'RENT', 'prop-beach-road', 'CLEARED', new Date().toISOString());
insertLedger.run('led-2', '2026-05-02T11:30:00Z', 'Rent Inflow - Beach Road #201 (Dr. Faisal)', 'INCOME', 40000, 'ICICI Escrow Main', 'RENT', 'prop-beach-road', 'CLEARED', new Date().toISOString());
insertLedger.run('led-3', '2026-04-03T09:15:00Z', 'Rent Inflow - Beach Road #304 (Shyam Sundar)', 'INCOME', 27500, 'ICICI Escrow Main', 'RENT', 'prop-beach-road', 'CLEARED', new Date().toISOString());
insertLedger.run('led-4', '2026-05-02T14:00:00Z', 'Commercial CAM Inflow - Infovision Tech Wing', 'INCOME', 185000, 'ICICI Commercial Escrow', 'CAM', 'prop-infovision', 'CLEARED', new Date().toISOString());
insertLedger.run('led-5', '2026-05-03T16:00:00Z', 'PG Monthly Subscriptions Inflow - Urban PG HSR', 'INCOME', 480000, 'HDFC Co-Living Escrow', 'PG', 'prop-urban-pg', 'CLEARED', new Date().toISOString());
insertLedger.run('led-6', '2026-05-04T12:00:00Z', 'Security Guard & Facility AMC - Beach Road', 'EXPENSE', 18000, 'ICICI Escrow Main', 'FACILITY', 'prop-beach-road', 'CLEARED', new Date().toISOString());

console.log('Seeding Maintenance Tickets...');
const insertTicket = db.prepare(`
  INSERT INTO tickets (
    id, ticket_number, property_id, property_name, unit_number, tenant_name,
    category, title, description, priority, status, estimated_cost, actual_cost,
    requires_owner_approval, owner_approved, vendor_id, vendor_name, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertTicket.run(
  'tick-1',
  'TICK-BR-304-01',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  'Shyam Sundar',
  'HVAC & Cooling',
  'Master Bedroom AC Copper Pipe Inspection',
  'Daikin inverter AC outdoor unit making mild vibration noise during peak cooling.',
  'Medium',
  'IN_PROGRESS',
  1200,
  null,
  0,
  1,
  'v-hvac',
  'RapidCool HVAC Services',
  new Date().toISOString()
);

insertTicket.run(
  'tick-2',
  'TICK-INFO-ELEV-02',
  'prop-infovision',
  'Infovision Commercial Hub',
  'Tower A - Lift 2',
  'Facility Admin',
  'Elevator & Safety',
  'Otis Elevator Bi-Monthly Statutory AMC Service',
  'Periodic certification and speed governor sensor test per municipal elevator rules.',
  'High',
  'OPEN',
  4500,
  null,
  1,
  0,
  'v-otis',
  'Otis Elevator India',
  new Date().toISOString()
);

insertTicket.run(
  'tick-3',
  'TICK-PG-WIFI-03',
  'prop-urban-pg',
  'Staywise Urban PG & Co-living',
  'Floor 2 Hub',
  'PG Warden',
  'Networking & Wi-Fi',
  'Fiber Router Mesh Node Replacement',
  'Ubiquiti UniFi access point mesh restart on 2nd floor common study lounge.',
  'Low',
  'RESOLVED',
  850,
  850,
  0,
  1,
  'v-net',
  'Airtel Enterprise Fiber',
  new Date().toISOString()
);

console.log('Seeding Electricity Bills...');
const insertBill = db.prepare(`
  INSERT INTO electricity_bills (
    id, property_id, property_name, unit_number, tenant_name, meter_number,
    billing_month, previous_reading, current_reading, units_consumed, rate_per_unit,
    sub_total, fixed_charges, tax_amount, total_amount, due_date, status, discom, uploaded_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertBill.run(
  'bill-304-may-2026',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  'Shyam Sundar',
  'KSEB-BR-99182',
  'April 2026',
  4820,
  5110,
  290,
  7.85,
  2276.5,
  140,
  217.5,
  2634,
  '2026-05-15',
  'PAID',
  'KSEB (Kerala State Electricity Board)',
  new Date().toISOString()
);

console.log('Seeding Commercial Units & CAM Expenses...');
const insertCommUnit = db.prepare(`
  INSERT INTO commercial_units (
    id, property_id, unit_number, floor, business_name, business_type, area_sq_ft,
    base_rent, cam_rate_per_sqft, cam_amount, parking_slots, lock_in_period_months,
    notice_period_months, escalation_percent, fit_out_status, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertCommUnit.run('comm-1', 'prop-infovision', 'Tech Suite 101', 1, 'HexaLogix Software Pvt Ltd', 'IT / Software', 4200, 210000, 18, 75600, 6, 24, 3, 7.5, 'Warm Shell Completed', 'OCCUPIED');
insertCommUnit.run('comm-2', 'prop-infovision', 'FinSuite 201', 2, 'FinEdge Advisory Partners', 'Financial Services', 3100, 155000, 18, 55800, 4, 36, 6, 5.0, 'Fully Furnished', 'OCCUPIED');
insertCommUnit.run('comm-3', 'prop-infovision', 'Cloud 301', 3, 'CloudScale Networks Inc', 'Telecom & Cloud', 5000, 250000, 18, 90000, 8, 36, 3, 5.0, 'Bare Shell', 'OCCUPIED');

const insertCam = db.prepare(`
  INSERT INTO cam_expenses (id, category, monthly_cost, allocation_method, vendor_name)
  VALUES (?, ?, ?, ?, ?)
`);
insertCam.run('cam-1', 'Common Area HVAC & Chillers', 42000, 'Pro-rata Area (Sq.Ft)', 'Voltas Commercial Service');
insertCam.run('cam-2', '24/7 Manned Security & CCTV', 36000, 'Equal Split', 'SIS Security Systems');
insertCam.run('cam-3', 'Housekeeping & Sanitization', 28000, 'Pro-rata Area (Sq.Ft)', 'CleanCorp Facility Solutions');

console.log('Seeding PG Beds, Rooms & Meals...');
const insertPgRoom = db.prepare(`
  INSERT INTO pg_rooms (id, property_id, room_number, floor, sharing_type, room_rent_total)
  VALUES (?, ?, ?, ?, ?, ?)
`);
insertPgRoom.run('pg-r-101', 'prop-urban-pg', '101', 1, 'Double Sharing', 26000);
insertPgRoom.run('pg-r-102', 'prop-urban-pg', '102', 1, 'Triple Sharing', 33000);
insertPgRoom.run('pg-r-201', 'prop-urban-pg', '201', 2, 'Single Luxury', 21000);

const insertPgBed = db.prepare(`
  INSERT INTO pg_beds (id, bed_code, room_id, room_number, floor, sharing_type, status, monthly_rent, deposit, tenant_name, food_included, wifi_included)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertPgBed.run('bed-101-a', '101-A', 'pg-r-101', '101', 1, 'Double Sharing', 'OCCUPIED', 13000, 26000, 'Akash Verma', 1, 1);
insertPgBed.run('bed-101-b', '101-B', 'pg-r-101', '101', 1, 'Double Sharing', 'OCCUPIED', 13000, 26000, 'Rohan Sharma', 1, 1);
insertPgBed.run('bed-201-a', '201-A', 'pg-r-201', '201', 2, 'Single Luxury', 'OCCUPIED', 21000, 42000, 'Nitin Gadgil', 1, 1);

const insertPgMeal = db.prepare(`
  INSERT INTO pg_meals (id, date, meal_type, menu, vendor, opted_in_count, cost_per_meal)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertPgMeal.run('meal-1', new Date().toISOString().split('T')[0], 'Breakfast', 'Idli, Medu Vada, Coconut Chutney, Sambar, Filter Coffee', 'Annapurna Catering', 98, 65);
insertPgMeal.run('meal-2', new Date().toISOString().split('T')[0], 'Lunch', 'Kerala Matta Rice, Sambar, Avial, Thoran, Curd, Pappadam', 'Annapurna Catering', 85, 95);
insertPgMeal.run('meal-3', new Date().toISOString().split('T')[0], 'Dinner', 'Phulka Rotis, Paneer Butter Masala, Dal Tadka, Jeera Rice', 'Annapurna Catering', 104, 95);

console.log('Seeding EstateOS Assets & Staff...');
const insertEstateAsset = db.prepare(`
  INSERT INTO estate_assets (id, name, tag, category, estate_name, purchase_date, warranty_until, amc_provider, last_service, next_service, condition)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertEstateAsset.run('ast-1', 'Heated Infinity Pool Filtration System', 'AST-WY-POOL-01', 'Pool & Spa', 'Serene Mist Estate Villa', '2023-08-10', '2028-08-10', 'Pentair India', '2026-04-15', '2026-07-15', 'EXCELLENT');
insertEstateAsset.run('ast-2', '25 kVA Hybrid Solar Microgrid System', 'AST-WY-SOLAR-02', 'Power & Energy', 'Serene Mist Estate Villa', '2024-01-20', '2034-01-20', 'Tata Power Solar', '2026-03-10', '2026-09-10', 'OPTIMAL');
insertEstateAsset.run('ast-3', 'High-Speed Starlink Satellite Terminal', 'AST-WY-NET-03', 'Telecom', 'Serene Mist Estate Villa', '2025-05-11', '2027-05-11', 'SpaceX Starlink', '2026-01-05', '2027-01-05', 'EXCELLENT');

const insertStaff = db.prepare(`
  INSERT INTO staff (id, name, role, estate_name, phone, shift, attendance_status, monthly_salary)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
insertStaff.run('stf-1', 'Balan Nair', 'Estate Superintendent', 'Serene Mist Estate Villa', '+91 94470 12831', 'Day Shift (8 AM - 5 PM)', 'PRESENT', 32000);
insertStaff.run('stf-2', 'Saritha K.', 'Executive Hospitality Chef', 'Serene Mist Estate Villa', '+91 94470 82910', 'Split Shift (Meal Windows)', 'PRESENT', 28000);
insertStaff.run('stf-3', 'Murugan P.', 'Landscape & Organic Plantation', 'Serene Mist Estate Villa', '+91 94470 77123', 'Morning Shift (7 AM - 3 PM)', 'PRESENT', 22000);

console.log('Seeding Rewards (WisePoints) & Deposit Protect...');
const insertRewardsAccount = db.prepare(`
  INSERT INTO rewards_accounts (user_id, user_name, user_role, total_earned, total_redeemed, current_balance, pending_points, current_streak, tier, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertRewardsAccount.run('user-tenant-shyam', 'Shyam Sundar', 'tenant', 1450, 200, 1250, 0, 5, 'GOLD', new Date().toISOString());

const insertRewardsLedger = db.prepare(`
  INSERT INTO rewards_ledger (id, user_id, action_type, points, points_type, reference_id, reference_type, description, financial_cost, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertRewardsLedger.run('rw-1', 'user-tenant-shyam', 'ON_TIME_RENT', 500, 'CREDIT', 'inv-shyam-apr-2026', 'INVOICE', 'On-time rent payment rewarded for Unit 304', 0, new Date().toISOString());
insertRewardsLedger.run('rw-2', 'user-tenant-shyam', 'ON_TIME_RENT', 500, 'CREDIT', 'inv-shyam-mar-2026', 'INVOICE', 'On-time rent payment rewarded for Unit 304', 0, new Date().toISOString());
insertRewardsLedger.run('rw-3', 'user-tenant-shyam', 'CONDITION_REPORT', 250, 'CREDIT', 'cr-304-01', 'REPORT', 'Submitted move-in digital photo condition verification', 0, new Date().toISOString());

const insertRewardRule = db.prepare(`
  INSERT INTO reward_rules (id, rule_code, name, description, points_awarded, is_active, category, monthly_cap, partner_funded)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertRewardRule.run('rule-1', 'ON_TIME_RENT', 'On-Time Rent Autopay', 'Earn 500 WisePoints each month rent clears before due date', 500, 1, 'RENT', 1000, 0);
insertRewardRule.run('rule-2', 'LEASE_RENEWAL', 'Annual Lease Renewal', 'Earn 2,000 WisePoints when signing 12-month extension', 2000, 1, 'LEASE', 2000, 0);
insertRewardRule.run('rule-3', 'ZERO_CLAIM_YEAR', 'Zero Maintenance Claim Year', 'Bonus points for maintaining unit in spotless condition', 1500, 1, 'LIFESTYLE', 1500, 0);

const insertDepositApp = db.prepare(`
  INSERT INTO deposit_protection_applications (
    id, tenant_id, tenant_name, tenant_email, tenant_phone,
    owner_id, owner_name, property_id, property_name, unit_number,
    monthly_rent, traditional_deposit_amount, monthly_fee, coverage_limit,
    risk_score, eligibility_status, status, disclosures_accepted, partner_provider,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertDepositApp.run(
  'dpa-shyam-304',
  'user-tenant-shyam',
  'Shyam Sundar',
  'tenant@staywise.com',
  '+91 98450 99887',
  'user-owner-vikram',
  'Vikram Singhania',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  26000,
  78000,
  350,
  100000,
  98,
  'ELIGIBLE',
  'ACTIVE_PROTECTION',
  1,
  'Staywise Institutional Protection Trust',
  new Date().toISOString(),
  new Date().toISOString()
);

const insertProtectionContract = db.prepare(`
  INSERT INTO protection_contracts (
    id, application_id, policy_number, tenant_id, tenant_name,
    owner_id, owner_name, property_id, property_name, unit_number,
    coverage_limit, monthly_fee, start_date, end_date, status,
    partner_name, certificate_url, covered_risks_json, exclusions_json, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertProtectionContract.run(
  'prot-pol-shyam-304',
  'dpa-shyam-304',
  'STW-DEP-2026-KL-304',
  'user-tenant-shyam',
  'Shyam Sundar',
  'user-owner-vikram',
  'Vikram Singhania',
  'prop-beach-road',
  'Beach Road Apartments',
  '304',
  100000,
  350,
  '2026-01-01',
  '2026-12-31',
  'ACTIVE',
  'Staywise Institutional Underwriters (Escrow Trust)',
  '/certificates/STW-DEP-304.pdf',
  JSON.stringify(['Unpaid Rent Arrears (up to ₹1,00,000)', 'Physical Fixture Damage', 'Unpaid Utility Arrears']),
  JSON.stringify(['Normal Wear & Tear', 'Structural Defects']),
  new Date().toISOString()
);

console.log('Seeding Subscriptions...');
const insertSub = db.prepare(`
  INSERT INTO subscriptions (
    id, user_id, owner_name, entity_name, plan_id, plan_name, status,
    billing_cycle, start_date, end_date, days_remaining, amount, currency,
    max_units, current_units, payment_method, last_payment_txn_id, last_payment_date,
    auto_renew, gstin, tamper_proof_hash, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertSub.run(
  'sub-owner-vikram',
  'user-owner-vikram',
  'Vikram Singhania',
  'Singhania Asset Holdings LLP',
  'growth_pro',
  'Staywise Growth Pro',
  'ACTIVE',
  'annual',
  '2026-01-01',
  '2027-01-01',
  237,
  24999,
  'INR',
  50,
  21,
  'UPI Autopay (ICICI)',
  'TXN-SUB-994821',
  '2026-01-01',
  1,
  '32AABCS1429B1Z4',
  'sha256-78e8b1c411b02b98218903cde89104fae891238910d8ab',
  new Date().toISOString()
);

console.log('Checkpointing SQLite WAL...');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA wal_checkpoint(TRUNCATE);');

console.log('\n✅ PRISTINE DATABASE SEEDING COMPLETED SUCCESSFULLY!');
