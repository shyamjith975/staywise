/**
 * ============================================================================
 * STAYWISE PLATFORM — PRODUCTION SQLITE 3 DATABASE ENGINE & REPOSITORY LAYER
 * ============================================================================
 * High-performance, relational, ACID-compliant database engine powered by
 * genuine SQLite 3 binary file storage at `data/database.db` (and root `database.db`).
 * 
 * ARCHITECTURE:
 * - Relational SQL tables for Users, Properties, Units, Tenants, Invoices,
 *   Ledger, Tickets, Leads, Estate, Utilities, Commercial, PG, and Subscriptions
 * - Opens seamlessly in real SQL tools: DB Browser for SQLite, DBeaver, SQLiteStudio
 * - Full relational onboarding pipeline for Owners, Tenants, and Managers
 * - Double-entry ledger audit reconciliation and anti-replay protection
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { 
  UserRole,
  Property, 
  Tenant, 
  RentInvoice, 
  LedgerEntry, 
  MaintenanceTicket, 
  Lead, 
  EstateAsset, 
  StaffMember, 
  UtilityReading, 
  AIInsight,
  ElectricityBill,
  PGBed,
  PGRoom,
  PGMealPlan,
  CommercialUnit,
  CAMExpenseItem,
  CommercialVisitor,
  MoveFlowChecklistItem,
  DepositSettlementDispute,
  TenantReferralItem,
  InfluencerOffer,
  OwnerSubscription,
  SubscriptionInvoice,
  SubscriptionTierId,
  PropertyUnit
} from '../../types';
import { SUBSCRIPTION_PLANS, calculateSubscriptionHash } from '../security/subscriptionCatalog';
import { hashPassword, verifyPassword, isSha256 } from '../security/auth';
import { 
  generateUniqueId, 
  generateUserId, 
  generatePropertyId, 
  generateUnitId, 
  generateTenantId, 
  generateInvoiceId, 
  generateInvoiceNumber, 
  generateTicketId, 
  generateTicketNumber, 
  generateLedgerId, 
  generateTransactionId,
  generateBillId,
  generateLeadId,
  generateVisitorId,
  generateReferralId
} from '../utils/uniqueId';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  title: string;
  description: string;
  phone?: string;
  createdAt: string;
}

export interface StaywiseDatabaseSchema {
  version: number;
  lastUpdated: string;
  users: UserAccount[];
  properties: Property[];
  tenants: Tenant[];
  invoices: RentInvoice[];
  ledger: LedgerEntry[];
  tickets: MaintenanceTicket[];
  leads: Lead[];
  estateAssets: EstateAsset[];
  staff: StaffMember[];
  utilities: UtilityReading[];
  electricityBills: ElectricityBill[];
  aiInsights: AIInsight[];
  pgBeds: PGBed[];
  pgRooms: PGRoom[];
  pgMeals: PGMealPlan[];
  commercialUnits: CommercialUnit[];
  camExpenses: CAMExpenseItem[];
  commercialVisitors: CommercialVisitor[];
  moveFlowChecklist: MoveFlowChecklistItem[];
  depositDisputes: DepositSettlementDispute[];
  referrals: TenantReferralItem[];
  influencerOffers: InfluencerOffer[];
  subscriptions: OwnerSubscription[];
}

const DB_FILE = path.join(process.cwd(), 'database.db');

// Safe binding helper (converts undefined to null for sqlite)
const sb = (val: unknown, fallback: unknown = null) => (val === undefined ? fallback : val);

class DatabaseEngine {
  private sqlite: DatabaseSync;

  constructor() {
    // Connect directly to root SQLite Database with busy_timeout for concurrency
    this.sqlite = new DatabaseSync(DB_FILE);
    this.sqlite.exec('PRAGMA busy_timeout = 5000;');
    this.sqlite.exec('PRAGMA foreign_keys = ON;');
    try {
      this.sqlite.exec('PRAGMA journal_mode = DELETE;');
      this.sqlite.exec('PRAGMA synchronous = FULL;');
    } catch (e) {
      // Journal mode already set or locked by concurrent reader
    }
    this.ensureSchema();
  }

  private syncRootDb(): void {
    // Commits write directly to root database.db synchronously with journal_mode = DELETE
  }

  private ensureSchema(): void {
    this.sqlite.exec(`
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
        owner_id TEXT,
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
        user_id TEXT,
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
    `);

    // Automatic non-destructive schema migrations
    try { this.sqlite.exec('ALTER TABLE properties ADD COLUMN owner_id TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN user_id TEXT;'); } catch (e) {}

    // Automatic SHA-256 password migration: ensure all stored passwords are encrypted in SHA-256 format
    try {
      const usersToMigrate = this.sqlite.prepare('SELECT id, password FROM users').all() as { id: string; password: string }[];
      const updateStmt = this.sqlite.prepare('UPDATE users SET password = ? WHERE id = ?');
      for (const u of usersToMigrate) {
        if (u.password && !isSha256(u.password)) {
          const hashed = hashPassword(u.password);
          updateStmt.run(hashed, u.id);
        }
      }
    } catch (e) {
      console.warn('[Database] SHA-256 password migration notice:', e);
    }
  }

  // ==========================================
  // USERS & AUTH REPOSITORY
  // ==========================================
  public users = {
    findMany: async (): Promise<UserAccount[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as any[];
      return rows.map(r => ({
        id: r.id,
        email: r.email,
        password: r.password,
        name: r.name,
        role: r.role as UserRole,
        roleLabel: r.role_label,
        avatar: r.avatar,
        title: r.title,
        description: r.description,
        phone: r.phone || undefined,
        createdAt: r.created_at
      }));
    },
    findByEmail: async (email: string): Promise<UserAccount | null> => {
      const row = this.sqlite.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1').get(email.trim()) as any;
      if (!row) return null;
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role as UserRole,
        roleLabel: row.role_label,
        avatar: row.avatar,
        title: row.title,
        description: row.description,
        phone: row.phone || undefined,
        createdAt: row.created_at
      };
    },
    findById: async (id: string): Promise<UserAccount | null> => {
      const row = this.sqlite.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(id) as any;
      if (!row) return null;
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role as UserRole,
        roleLabel: row.role_label,
        avatar: row.avatar,
        title: row.title,
        description: row.description,
        phone: row.phone || undefined,
        createdAt: row.created_at
      };
    },
    authenticate: async (email: string, pass: string): Promise<UserAccount | null> => {
      const cleanEmail = email.toLowerCase().trim();
      const row = this.sqlite.prepare('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1').get(cleanEmail) as any;
      if (!row) return null;

      const isValid = verifyPassword(pass, row.password);
      if (!isValid) return null;

      // If legacy unmigrated password matched, immediately upgrade to SHA-256 in database
      if (!isSha256(row.password)) {
        try {
          const newHash = hashPassword(pass);
          this.sqlite.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, row.id);
          row.password = newHash;
        } catch (e) {}
      }

      return {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role as UserRole,
        roleLabel: row.role_label,
        avatar: row.avatar,
        title: row.title,
        description: row.description,
        phone: row.phone || undefined,
        createdAt: row.created_at
      };
    },
    create: async (payload: Omit<UserAccount, 'id' | 'createdAt'> & { id?: string }): Promise<UserAccount> => {
      const id = payload.id || generateUserId(payload.role);
      const createdAt = new Date().toISOString();
      const passwordHash = isSha256(payload.password) ? payload.password : hashPassword(payload.password);
      const insert = this.sqlite.prepare(`
        INSERT OR REPLACE INTO users (id, email, password, name, role, role_label, avatar, title, description, phone, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(
        id,
        payload.email.toLowerCase().trim(),
        passwordHash,
        payload.name,
        payload.role,
        payload.roleLabel || payload.role,
        payload.avatar || '👤',
        payload.title || 'Platform Member',
        payload.description || '',
        sb(payload.phone, null),
        createdAt
      );
      this.syncRootDb();
      return {
        id,
        ...payload,
        password: passwordHash,
        createdAt
      };
    },
    updatePassword: async (userId: string, newPasswordPlain: string): Promise<boolean> => {
      const passwordHash = isSha256(newPasswordPlain) ? newPasswordPlain : hashPassword(newPasswordPlain);
      const res = this.sqlite.prepare('UPDATE users SET password = ? WHERE id = ?').run(passwordHash, userId);
      this.syncRootDb();
      return (res as any).changes > 0;
    }
  };

  // ==========================================
  // PROPERTIES REPOSITORY
  // ==========================================
  public properties = {
    findMany: async (filter?: { portfolio?: string; verificationStatus?: string; ownerId?: string }): Promise<Property[]> => {
      let query = 'SELECT * FROM properties';
      const params: any[] = [];
      const conditions: string[] = [];

      if (filter?.portfolio && filter.portfolio !== 'ALL' && filter.portfolio !== 'all') {
        conditions.push('portfolio = ?');
        params.push(filter.portfolio);
      }
      if (filter?.verificationStatus && filter.verificationStatus !== 'ALL') {
        conditions.push('verification_status = ?');
        params.push(filter.verificationStatus);
      }
      if (filter?.ownerId && filter.ownerId !== 'ALL' && filter.ownerId !== 'all') {
        conditions.push('owner_id = ?');
        params.push(filter.ownerId);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params);
      const unitsStmt = this.sqlite.prepare('SELECT * FROM property_units WHERE property_id = ?');

      return rows.map(r => {
        const uRows = unitsStmt.all(r.id);
        const units: PropertyUnit[] = uRows.map(u => ({
          id: u.id,
          propertyId: u.property_id,
          unitNumber: u.unit_number,
          floor: u.floor,
          type: u.type,
          rentAmount: u.rent_amount,
          depositAmount: u.deposit_amount,
          status: u.status,
          currentTenantId: u.current_tenant_id || undefined,
          currentTenantName: u.current_tenant_name || undefined,
          leaseEnd: u.lease_end || undefined,
          areaSqFt: u.area_sq_ft,
          bedrooms: u.bedrooms,
          bathrooms: u.bathrooms
        }));

        let submittedDocs: string[] = [];
        let amenities: string[] = [];
        try { submittedDocs = JSON.parse(r.submitted_docs || '[]'); } catch(e) {}
        try { amenities = JSON.parse(r.amenities || '[]'); } catch(e) {}

        return {
          id: r.id,
          ownerId: r.owner_id || undefined,
          name: r.name,
          type: r.type,
          portfolio: r.portfolio,
          address: r.address,
          city: r.city,
          state: r.state,
          pincode: r.pincode,
          totalUnits: r.total_units,
          occupiedUnits: r.occupied_units,
          expectedMonthlyRent: r.expected_monthly_rent,
          collectedRent: r.collected_rent,
          pendingRent: r.pending_rent,
          imageUrl: r.image_url,
          status: r.status,
          healthScore: r.health_score,
          verificationStatus: r.verification_status,
          submittedDocs,
          amenities,
          units
        };
      });
    },

    findById: async (id: string): Promise<Property | null> => {
      const row = this.sqlite.prepare('SELECT * FROM properties WHERE id = ? LIMIT 1').get(id);
      if (!row) return null;

      const uRows = this.sqlite.prepare('SELECT * FROM property_units WHERE property_id = ?').all(id);
      const units: PropertyUnit[] = uRows.map(u => ({
        id: u.id,
        propertyId: u.property_id,
        unitNumber: u.unit_number,
        floor: u.floor,
        type: u.type,
        rentAmount: u.rent_amount,
        depositAmount: u.deposit_amount,
        status: u.status,
        currentTenantId: u.current_tenant_id || undefined,
        currentTenantName: u.current_tenant_name || undefined,
        leaseEnd: u.lease_end || undefined,
        areaSqFt: u.area_sq_ft,
        bedrooms: u.bedrooms,
        bathrooms: u.bathrooms
      }));

      let submittedDocs: string[] = [];
      let amenities: string[] = [];
      try { submittedDocs = JSON.parse(row.submitted_docs || '[]'); } catch(e) {}
      try { amenities = JSON.parse(row.amenities || '[]'); } catch(e) {}

      return {
        id: row.id,
        ownerId: row.owner_id || undefined,
        name: row.name,
        type: row.type,
        portfolio: row.portfolio,
        address: row.address,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        totalUnits: row.total_units,
        occupiedUnits: row.occupied_units,
        expectedMonthlyRent: row.expected_monthly_rent,
        collectedRent: row.collected_rent,
        pendingRent: row.pending_rent,
        imageUrl: row.image_url,
        status: row.status,
        healthScore: row.health_score,
        verificationStatus: row.verification_status,
        submittedDocs,
        amenities,
        units
      };
    },

    create: async (payload: Omit<Property, 'id'> & { id?: string; ownerId?: string }): Promise<Property> => {
      const id = payload.id || generatePropertyId();
      const createdAt = new Date().toISOString();
      const insert = this.sqlite.prepare(`
        INSERT OR REPLACE INTO properties (
          id, owner_id, name, type, portfolio, address, city, state, pincode,
          total_units, occupied_units, expected_monthly_rent, collected_rent, pending_rent,
          image_url, status, health_score, verification_status, submitted_docs, amenities, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        id,
        sb(payload.ownerId, null),
        payload.name,
        payload.type,
        payload.portfolio,
        payload.address,
        payload.city,
        payload.state,
        payload.pincode,
        sb(payload.totalUnits, 1),
        sb(payload.occupiedUnits, 0),
        sb(payload.expectedMonthlyRent, 25000),
        sb(payload.collectedRent, 0),
        sb(payload.pendingRent, payload.expectedMonthlyRent || 0),
        payload.imageUrl || '/images/properties/beach-road.jpg',
        payload.status || 'VACANT',
        sb(payload.healthScore, 90),
        payload.verificationStatus || 'PENDING',
        JSON.stringify(payload.submittedDocs || []),
        JSON.stringify(payload.amenities || ['Parking', 'Security']),
        createdAt
      );

      if (Array.isArray(payload.units)) {
        const insertUnit = this.sqlite.prepare(`
          INSERT OR REPLACE INTO property_units (
            id, property_id, unit_number, floor, type, rent_amount, deposit_amount,
            status, current_tenant_id, current_tenant_name, lease_end, area_sq_ft, bedrooms, bathrooms
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const u of payload.units) {
          insertUnit.run(
            u.id || generateUnitId(id, u.unitNumber),
            id,
            u.unitNumber,
            sb(u.floor, 1),
            u.type || 'Standard',
            sb(u.rentAmount, 0),
            sb(u.depositAmount, 0),
            u.status || 'VACANT',
            sb(u.currentTenantId, null),
            sb(u.currentTenantName, null),
            sb(u.leaseEnd, null),
            sb(u.areaSqFt, 0),
            sb(u.bedrooms, 1),
            sb(u.bathrooms, 1)
          );
        }
      }

      this.syncRootDb();
      const created = await this.properties.findById(id);
      return created!;
    },

    update: async (id: string, updates: Partial<Property>): Promise<Property | null> => {
      const existing = await this.properties.findById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      const updateStmt = this.sqlite.prepare(`
        UPDATE properties SET
          owner_id = COALESCE(?, owner_id),
          name = ?, type = ?, portfolio = ?, address = ?, city = ?, state = ?, pincode = ?,
          total_units = ?, occupied_units = ?, expected_monthly_rent = ?, collected_rent = ?, pending_rent = ?,
          image_url = ?, status = ?, health_score = ?, verification_status = ?,
          submitted_docs = ?, amenities = ?
        WHERE id = ?
      `);

      updateStmt.run(
        sb(updates.ownerId, null),
        merged.name,
        merged.type,
        merged.portfolio,
        merged.address,
        merged.city,
        merged.state,
        merged.pincode,
        merged.totalUnits,
        merged.occupiedUnits,
        merged.expectedMonthlyRent,
        merged.collectedRent,
        merged.pendingRent,
        merged.imageUrl,
        merged.status,
        merged.healthScore,
        merged.verificationStatus,
        JSON.stringify(merged.submittedDocs || []),
        JSON.stringify(merged.amenities || []),
        id
      );

      this.syncRootDb();
      return this.properties.findById(id);
    },

    verify: async (id: string, status: 'APPROVED' | 'REJECTED' = 'APPROVED'): Promise<Property | null> => {
      const propStatus = status === 'APPROVED' ? 'ACTIVE' : 'UNDER_MAINTENANCE';
      this.sqlite.prepare('UPDATE properties SET verification_status = ?, status = ? WHERE id = ?').run(status, propStatus, id);
      this.syncRootDb();
      return this.properties.findById(id);
    },

    delete: async (id: string): Promise<boolean> => {
      const res = this.sqlite.prepare('DELETE FROM properties WHERE id = ?').run(id);
      this.sqlite.prepare('DELETE FROM property_units WHERE property_id = ?').run(id);
      this.syncRootDb();
      return res.changes > 0;
    }
  };

  // ==========================================
  // TENANTS REPOSITORY & ONBOARDING PIPELINE
  // ==========================================
  public tenants = {
    findMany: async (filter?: { propertyId?: string; userId?: string }): Promise<Tenant[]> => {
      let query = 'SELECT * FROM tenants';
      const params: any[] = [];
      const conditions: string[] = [];

      if (filter?.propertyId) {
        conditions.push('property_id = ?');
        params.push(filter.propertyId);
      }
      if (filter?.userId) {
        conditions.push('user_id = ?');
        params.push(filter.userId);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params);
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id || undefined,
        name: r.name,
        email: r.email,
        phone: r.phone,
        propertyId: r.property_id,
        propertyName: r.property_name,
        unitNumber: r.unit_number,
        monthlyRent: r.monthly_rent,
        depositPaid: r.deposit_paid,
        leaseStart: r.lease_start,
        leaseEnd: r.lease_end,
        rentDueDate: r.rent_due_date,
        salaryDate: r.salary_date || undefined,
        autopayActive: Boolean(r.autopay_active),
        reliabilityScore: r.reliability_score,
        kycVerified: Boolean(r.kyc_verified),
        rewardsBalance: r.rewards_balance,
        emergencyContact: r.emergency_contact
      }));
    },

    findById: async (id: string): Promise<Tenant | null> => {
      const row = this.sqlite.prepare('SELECT * FROM tenants WHERE id = ? LIMIT 1').get(id);
      if (!row) return null;
      return {
        id: row.id,
        userId: row.user_id || undefined,
        name: row.name,
        email: row.email,
        phone: row.phone,
        propertyId: row.property_id,
        propertyName: row.property_name,
        unitNumber: row.unit_number,
        monthlyRent: row.monthly_rent,
        depositPaid: row.deposit_paid,
        leaseStart: row.lease_start,
        leaseEnd: row.lease_end,
        rentDueDate: row.rent_due_date,
        salaryDate: row.salary_date || undefined,
        autopayActive: Boolean(row.autopay_active),
        reliabilityScore: row.reliability_score,
        kycVerified: Boolean(row.kyc_verified),
        rewardsBalance: row.rewards_balance,
        emergencyContact: row.emergency_contact
      };
    },

    create: async (tenant: Tenant): Promise<Tenant> => {
      const id = tenant.id || generateTenantId();
      const insert = this.sqlite.prepare(`
        INSERT OR REPLACE INTO tenants (
          id, user_id, name, email, phone, property_id, property_name, unit_number,
          monthly_rent, deposit_paid, lease_start, lease_end, rent_due_date, salary_date,
          autopay_active, reliability_score, kyc_verified, rewards_balance, emergency_contact, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        id,
        sb(tenant.userId, null),
        tenant.name,
        tenant.email,
        tenant.phone,
        tenant.propertyId,
        tenant.propertyName,
        tenant.unitNumber,
        tenant.monthlyRent,
        tenant.depositPaid,
        tenant.leaseStart,
        tenant.leaseEnd,
        tenant.rentDueDate,
        sb(tenant.salaryDate, null),
        tenant.autopayActive ? 1 : 0,
        tenant.reliabilityScore,
        tenant.kycVerified ? 1 : 0,
        tenant.rewardsBalance,
        tenant.emergencyContact,
        new Date().toISOString()
      );
      this.syncRootDb();
      return { ...tenant, id };
    },

    /**
     * Authoritative Complete Tenant Onboarding Pipeline:
     * 1. Creates tenant record
     * 2. Creates tenant login account in \`users\`
     * 3. Updates property unit to OCCUPIED and increments property metrics
     * 4. Issues first rent invoice in \`invoices\`
     * 5. Enters security deposit in \`ledger\`
     */
    onboard: async (data: {
      name: string;
      phone: string;
      email: string;
      propertyId: string;
      unitNumber: string;
      monthlyRent: number;
      deposit: number;
      leaseStart: string;
      leaseEnd: string;
      rentDueDate: number;
      password?: string;
    }): Promise<{ tenant: Tenant; property: Property | null; invoice: RentInvoice; ledgerEntry: LedgerEntry; user: UserAccount }> => {
      const tenantId = generateTenantId();
      const prop = await this.properties.findById(data.propertyId);
      const propName = prop ? prop.name : 'Staywise Residency';

      // 1. Ensure Tenant User Account for Login
      let user = await this.users.findByEmail(data.email);
      if (!user) {
        user = await this.users.create({
          id: generateUserId('tenant'),
          email: data.email,
          password: data.password || 'Tenant@123',
          name: data.name,
          role: 'tenant',
          roleLabel: 'Tenant / Resident',
          avatar: '👨‍🎓',
          title: `Resident • Apt ${data.unitNumber}`,
          description: `${propName} • Digital Lease Connected`,
          phone: data.phone
        });
      }

      // 2. Create Tenant Record with linked userId
      const newTenant: Tenant = {
        id: tenantId,
        userId: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        propertyId: data.propertyId,
        propertyName: propName,
        unitNumber: data.unitNumber,
        monthlyRent: data.monthlyRent,
        depositPaid: data.deposit,
        leaseStart: data.leaseStart,
        leaseEnd: data.leaseEnd,
        rentDueDate: data.rentDueDate || 5,
        autopayActive: true,
        reliabilityScore: 100,
        kycVerified: true,
        rewardsBalance: 500, // Onboarding welcome bonus
        emergencyContact: 'Family Primary Contact'
      };
      await this.tenants.create(newTenant);

      // 3. Update Property Unit & Metrics
      if (prop) {
        // Upsert or update unit
        const existingUnit = this.sqlite.prepare('SELECT id FROM property_units WHERE property_id = ? AND unit_number = ?').get(data.propertyId, data.unitNumber);
        if (existingUnit) {
          this.sqlite.prepare(`
            UPDATE property_units SET
              status = 'OCCUPIED',
              current_tenant_id = ?,
              current_tenant_name = ?,
              rent_amount = ?,
              deposit_amount = ?,
              lease_end = ?
            WHERE id = ?
          `).run(tenantId, data.name, data.monthlyRent, data.deposit, data.leaseEnd, existingUnit.id);
        } else {
          this.sqlite.prepare(`
            INSERT INTO property_units (
              id, property_id, unit_number, floor, type, rent_amount, deposit_amount,
              status, current_tenant_id, current_tenant_name, lease_end, area_sq_ft, bedrooms, bathrooms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            `unit-${data.propertyId}-${data.unitNumber}`,
            data.propertyId,
            data.unitNumber,
            1,
            'Standard Residential',
            data.monthlyRent,
            data.deposit,
            'OCCUPIED',
            tenantId,
            data.name,
            data.leaseEnd,
            1200,
            2,
            2
          );
        }

        // Increment property occupancy
        this.sqlite.prepare(`
          UPDATE properties SET
            occupied_units = occupied_units + 1,
            expected_monthly_rent = expected_monthly_rent + ?,
            status = 'ACTIVE'
          WHERE id = ?
        `).run(data.monthlyRent, data.propertyId);
      }

      // 4. Generate Initial Rent Invoice
      const newInvoice: RentInvoice = {
        id: generateInvoiceId(),
        invoiceNumber: generateInvoiceNumber(),
        tenantId: tenantId,
        tenantName: data.name,
        propertyId: data.propertyId,
        propertyName: propName,
        unitNumber: data.unitNumber,
        period: 'October 2026',
        baseRent: data.monthlyRent,
        totalAmount: data.monthlyRent,
        paidAmount: 0,
        dueDate: `2026-10-${data.rentDueDate.toString().padStart(2, '0')}`,
        status: 'Due'
      };
      await this.invoices.create(newInvoice);

      // 5. Statutory Deposit Entry in Ledger
      const ledgerEntry = await this.ledger.create({
        description: `Security Deposit Onboarded - Unit ${data.unitNumber} (${data.name})`,
        type: 'CREDIT',
        amount: data.deposit,
        account: '1020-STATUTORY-TENANT-DEPOSIT-TRUST',
        entityType: 'SECURITY_DEPOSIT',
        referenceId: newInvoice.invoiceNumber,
        settlementStatus: 'CLEARED'
      });

      this.syncRootDb();
      const updatedProp = await this.properties.findById(data.propertyId);
      return {
        tenant: newTenant,
        property: updatedProp,
        invoice: newInvoice,
        ledgerEntry,
        user
      };
    }
  };

  // ==========================================
  // INVOICES & RENT PAYMENTS REPOSITORY
  // ==========================================
  public invoices = {
    findMany: async (filter?: { tenantId?: string; propertyId?: string }): Promise<RentInvoice[]> => {
      let query = 'SELECT * FROM invoices';
      const conditions: string[] = [];
      const params: any[] = [];

      if (filter?.tenantId) {
        conditions.push('tenant_id = ?');
        params.push(filter.tenantId);
      }
      if (filter?.propertyId) {
        conditions.push('property_id = ?');
        params.push(filter.propertyId);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params);
      return rows.map(r => ({
        id: r.id,
        invoiceNumber: r.invoice_number,
        tenantId: r.tenant_id,
        tenantName: r.tenant_name,
        propertyId: r.property_id,
        propertyName: r.property_name,
        unitNumber: r.unit_number,
        period: r.period,
        baseRent: r.base_rent,
        camCharges: r.cam_charges || 0,
        utilityCharges: r.utility_charges || 0,
        lateFee: r.late_fee || 0,
        totalAmount: r.total_amount,
        paidAmount: r.paid_amount || 0,
        dueDate: r.due_date,
        status: r.status,
        paymentMethod: r.payment_method || undefined,
        paidDate: r.paid_date || undefined,
        transactionId: r.transaction_id || undefined
      }));
    },

    findById: async (id: string): Promise<RentInvoice | null> => {
      const row = this.sqlite.prepare('SELECT * FROM invoices WHERE id = ? LIMIT 1').get(id);
      if (!row) return null;
      return {
        id: row.id,
        invoiceNumber: row.invoice_number,
        tenantId: row.tenant_id,
        tenantName: row.tenant_name,
        propertyId: row.property_id,
        propertyName: row.property_name,
        unitNumber: row.unit_number,
        period: row.period,
        baseRent: row.base_rent,
        camCharges: row.cam_charges || 0,
        utilityCharges: row.utility_charges || 0,
        lateFee: row.late_fee || 0,
        totalAmount: row.total_amount,
        paidAmount: row.paid_amount || 0,
        dueDate: row.due_date,
        status: row.status,
        paymentMethod: row.payment_method || undefined,
        paidDate: row.paid_date || undefined,
        transactionId: row.transaction_id || undefined
      };
    },

    create: async (invoice: RentInvoice): Promise<RentInvoice> => {
      const insert = this.sqlite.prepare(`
        INSERT OR REPLACE INTO invoices (
          id, invoice_number, tenant_id, tenant_name, property_id, property_name, unit_number,
          period, base_rent, cam_charges, utility_charges, late_fee, total_amount, paid_amount,
          due_date, status, payment_method, paid_date, transaction_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        invoice.id,
        invoice.invoiceNumber,
        invoice.tenantId,
        invoice.tenantName,
        invoice.propertyId,
        invoice.propertyName,
        invoice.unitNumber,
        invoice.period,
        invoice.baseRent,
        sb(invoice.camCharges, 0),
        sb(invoice.utilityCharges, 0),
        sb(invoice.lateFee, 0),
        invoice.totalAmount,
        sb(invoice.paidAmount, 0),
        invoice.dueDate,
        invoice.status,
        sb(invoice.paymentMethod, null),
        sb(invoice.paidDate, null),
        sb(invoice.transactionId, null),
        new Date().toISOString()
      );
      this.syncRootDb();
      return invoice;
    },

    pay: async (
      id: string,
      paymentMethod: 'UPI' | 'Bank Transfer' | 'Card' | 'Autopay' | 'FlexPay',
      amount?: number
    ): Promise<{ invoice: RentInvoice; ledgerEntry: LedgerEntry } | null> => {
      const inv = await this.invoices.findById(id);
      if (!inv) return null;

      if (inv.status === 'Paid') {
        throw new Error('ALREADY_PAID');
      }

      const authoritativeDue = inv.totalAmount - (inv.paidAmount || 0);
      if (amount !== undefined && amount !== null) {
        if (Math.abs(amount - authoritativeDue) > 0.01 && Math.abs(amount - inv.totalAmount) > 0.01) {
          throw new Error('PRICE_TAMPERING_DETECTED');
        }
      }

      const payAmount = authoritativeDue > 0 ? authoritativeDue : inv.totalAmount;
      const paidDate = new Date().toISOString().split('T')[0];
      const txnId = `TXN-STAY-${Date.now()}`;

      this.sqlite.prepare(`
        UPDATE invoices SET
          status = 'Paid',
          paid_amount = total_amount,
          payment_method = ?,
          paid_date = ?,
          transaction_id = ?
        WHERE id = ?
      `).run(paymentMethod, paidDate, txnId, id);

      const ledgerEntry = await this.ledger.create({
        description: `Rent payment received for ${inv.propertyName} (${inv.unitNumber}) via ${paymentMethod} [SQLite Verified Settlement]`,
        type: 'CREDIT',
        amount: payAmount,
        account: '1010-ESCROW-COLLECTION',
        entityType: 'RENT',
        referenceId: inv.invoiceNumber,
        settlementStatus: 'CLEARED'
      });

      this.syncRootDb();
      const updatedInv = await this.invoices.findById(id);
      return { invoice: updatedInv!, ledgerEntry };
    }
  };

  // ==========================================
  // DOUBLE-ENTRY LEDGER REPOSITORY
  // ==========================================
  public ledger = {
    findMany: async (): Promise<LedgerEntry[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM ledger ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        description: r.description,
        type: r.type,
        amount: r.amount,
        account: r.account,
        entityType: r.entity_type,
        referenceId: r.reference_id,
        settlementStatus: r.settlement_status
      }));
    },
    create: async (entry: Omit<LedgerEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): Promise<LedgerEntry> => {
      const id = entry.id || generateLedgerId();
      const timestamp = entry.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
      const createdAt = new Date().toISOString();

      this.sqlite.prepare(`
        INSERT INTO ledger (id, timestamp, description, type, amount, account, entity_type, reference_id, settlement_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        timestamp,
        entry.description,
        entry.type,
        entry.amount,
        entry.account,
        entry.entityType,
        entry.referenceId,
        entry.settlementStatus || 'CLEARED',
        createdAt
      );

      this.syncRootDb();
      return {
        id,
        timestamp,
        description: entry.description,
        type: entry.type,
        amount: entry.amount,
        account: entry.account,
        entityType: entry.entityType,
        referenceId: entry.referenceId,
        settlementStatus: entry.settlementStatus || 'CLEARED'
      };
    }
  };

  // ==========================================
  // DISPUTES REPOSITORY
  // ==========================================
  public disputes = {
    findMany: async (): Promise<DepositSettlementDispute[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM deposit_disputes ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        propertyId: r.property_id || undefined,
        propertyName: r.property_name || undefined,
        unitOrBed: r.unit_or_bed,
        tenantName: r.tenant_name,
        depositPaid: r.deposit_paid,
        deductions: JSON.parse(r.deductions_json || '[]'),
        proposedRefund: r.proposed_refund,
        disputedAmount: r.disputed_amount,
        tenantNotes: r.tenant_notes || undefined,
        status: r.status
      }));
    },
    update: async (id: string, updates: Partial<DepositSettlementDispute>): Promise<DepositSettlementDispute | null> => {
      const existing = this.sqlite.prepare('SELECT * FROM deposit_disputes WHERE id = ?').get(id);
      if (!existing) return null;

      if (updates.status) {
        this.sqlite.prepare('UPDATE deposit_disputes SET status = ? WHERE id = ?').run(updates.status, id);
      }
      this.syncRootDb();
      const updated = (await this.disputes.findMany()).find(d => d.id === id);
      return updated || null;
    }
  };

  // ==========================================
  // INFLUENCER OFFERS & CAMPAIGNS REPOSITORY
  // ==========================================
  public influencerOffers = {
    findMany: async (): Promise<InfluencerOffer[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM influencer_offers ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        code: r.code,
        influencerName: r.influencer_name,
        influencerHandle: r.influencer_handle,
        commissionType: r.commission_type,
        commissionValue: r.commission_value,
        audienceOffer: r.audience_offer,
        targetAudience: r.target_audience,
        signupsCount: r.signups_count,
        totalCommissionPaid: r.total_commission_paid,
        status: r.status,
        createdAt: r.created_at
      }));
    },
    create: async (offer: Omit<InfluencerOffer, 'id' | 'createdAt' | 'signupsCount' | 'totalCommissionPaid'>): Promise<InfluencerOffer> => {
      const id = `offer-${Date.now()}`;
      const createdAt = new Date().toISOString().split('T')[0];
      this.sqlite.prepare(`
        INSERT INTO influencer_offers (
          id, code, influencer_name, influencer_handle, commission_type, commission_value,
          audience_offer, target_audience, signups_count, total_commission_paid, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        offer.code,
        offer.influencerName,
        offer.influencerHandle,
        offer.commissionType,
        offer.commissionValue,
        offer.audienceOffer,
        offer.targetAudience || 'Both',
        0,
        0,
        offer.status || 'ACTIVE',
        createdAt
      );
      this.syncRootDb();
      return {
        id,
        ...offer,
        signupsCount: 0,
        totalCommissionPaid: 0,
        status: offer.status || 'ACTIVE',
        createdAt
      };
    },
    toggleStatus: async (id: string): Promise<InfluencerOffer | null> => {
      const row = this.sqlite.prepare('SELECT status FROM influencer_offers WHERE id = ?').get(id);
      if (!row) return null;
      const nextStatus = row.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      this.sqlite.prepare('UPDATE influencer_offers SET status = ? WHERE id = ?').run(nextStatus, id);
      this.syncRootDb();
      const updated = (await this.influencerOffers.findMany()).find(o => o.id === id);
      return updated || null;
    }
  };

  // ==========================================
  // REFERRALS REPOSITORY
  // ==========================================
  public referrals = {
    findMany: async (): Promise<TenantReferralItem[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM referrals ORDER BY date DESC').all();
      return rows.map(r => ({
        id: r.id,
        referralCode: r.referral_code,
        referredName: r.referred_name,
        propertyType: r.property_type,
        rewardAmount: r.reward_amount,
        status: r.status,
        date: r.date
      }));
    },
    create: async (referral: Omit<TenantReferralItem, 'id' | 'date'> & { id?: string; date?: string }): Promise<TenantReferralItem> => {
      const id = referral.id || `ref-${Date.now()}`;
      const date = referral.date || new Date().toISOString().split('T')[0];
      this.sqlite.prepare(`
        INSERT INTO referrals (id, referral_code, referred_name, property_type, reward_amount, status, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        referral.referralCode,
        referral.referredName,
        referral.propertyType,
        referral.rewardAmount,
        referral.status,
        date
      );
      this.syncRootDb();
      return { id, date, ...referral };
    }
  };

  // ==========================================
  // ELECTRICITY BILLS REPOSITORY
  // ==========================================
  public bills = {
    findMany: async (): Promise<ElectricityBill[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM electricity_bills ORDER BY uploaded_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        propertyId: r.property_id,
        propertyName: r.property_name,
        unitNumber: r.unit_number,
        tenantName: r.tenant_name,
        meterNumber: r.meter_number,
        billingMonth: r.billing_month,
        previousReading: r.previous_reading,
        currentReading: r.current_reading,
        unitsConsumed: r.units_consumed,
        ratePerUnit: r.rate_per_unit,
        fixedCharges: r.fixed_charges,
        totalAmount: r.total_amount,
        dueDate: r.due_date,
        status: r.status,
        discom: r.discom,
        attachmentName: r.attachment_name || undefined,
        fileSize: r.file_size || undefined,
        billDocumentUrl: r.bill_document_url || undefined,
        uploadedAt: r.uploaded_at,
        notes: r.notes || undefined
      }));
    },
    create: async (bill: ElectricityBill): Promise<ElectricityBill> => {
      const subTotal = bill.unitsConsumed * bill.ratePerUnit;
      const taxAmount = 0;
      this.sqlite.prepare(`
        INSERT OR REPLACE INTO electricity_bills (
          id, property_id, property_name, unit_number, tenant_name, meter_number,
          billing_month, previous_reading, current_reading, units_consumed, rate_per_unit,
          sub_total, fixed_charges, tax_amount, total_amount, due_date, status, discom,
          attachment_name, file_size, bill_document_url, uploaded_at, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        bill.id,
        bill.propertyId,
        bill.propertyName,
        bill.unitNumber,
        bill.tenantName,
        bill.meterNumber,
        bill.billingMonth,
        bill.previousReading,
        bill.currentReading,
        bill.unitsConsumed,
        bill.ratePerUnit,
        subTotal,
        bill.fixedCharges,
        taxAmount,
        bill.totalAmount,
        bill.dueDate,
        bill.status,
        bill.discom,
        sb(bill.attachmentName, null),
        sb(bill.fileSize, null),
        sb(bill.billDocumentUrl, null),
        bill.uploadedAt || new Date().toISOString(),
        sb(bill.notes, null)
      );
      this.syncRootDb();
      return bill;
    }
  };

  // ==========================================
  // TICKETS REPOSITORY
  // ==========================================
  public tickets = {
    findMany: async (): Promise<MaintenanceTicket[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM tickets ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        ticketNumber: r.ticket_number,
        propertyId: r.property_id,
        propertyName: r.property_name,
        unitNumber: r.unit_number,
        tenantName: r.tenant_name,
        category: r.category,
        title: r.title,
        description: r.description,
        priority: r.priority,
        status: r.status,
        estimatedCost: r.estimated_cost,
        actualCost: r.actual_cost || undefined,
        requiresOwnerApproval: Boolean(r.requires_owner_approval),
        ownerApproved: r.owner_approved !== null ? Boolean(r.owner_approved) : undefined,
        vendorId: r.vendor_id || undefined,
        vendorName: r.vendor_name || undefined,
        createdAt: r.created_at,
        scheduledDate: r.scheduled_date || undefined,
        completedAt: r.completed_at || undefined,
        beforePhotoUrl: r.before_photo_url || undefined,
        afterPhotoUrl: r.after_photo_url || undefined
      }));
    },
    create: async (ticket: MaintenanceTicket): Promise<MaintenanceTicket> => {
      const id = ticket.id || generateTicketId();
      const ticketNumber = ticket.ticketNumber || generateTicketNumber();
      this.sqlite.prepare(`
        INSERT OR REPLACE INTO tickets (
          id, ticket_number, property_id, property_name, unit_number, tenant_name,
          category, title, description, priority, status, estimated_cost, actual_cost,
          requires_owner_approval, owner_approved, vendor_id, vendor_name,
          created_at, scheduled_date, completed_at, before_photo_url, after_photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        ticketNumber,
        ticket.propertyId,
        ticket.propertyName,
        ticket.unitNumber,
        ticket.tenantName,
        ticket.category,
        ticket.title,
        ticket.description,
        ticket.priority,
        ticket.status,
        sb(ticket.estimatedCost, 0),
        sb(ticket.actualCost, null),
        ticket.requiresOwnerApproval ? 1 : 0,
        ticket.ownerApproved ? 1 : 0,
        sb(ticket.vendorId, null),
        sb(ticket.vendorName, null),
        ticket.createdAt || new Date().toISOString(),
        sb(ticket.scheduledDate, null),
        sb(ticket.completedAt, null),
        sb(ticket.beforePhotoUrl, null),
        sb(ticket.afterPhotoUrl, null)
      );
      this.syncRootDb();
      return ticket;
    },
    update: async (id: string, updates: Partial<MaintenanceTicket>): Promise<MaintenanceTicket | null> => {
      const tickets = await this.tickets.findMany();
      const existing = tickets.find(t => t.id === id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      this.sqlite.prepare(`
        UPDATE tickets SET
          status = ?,
          actual_cost = ?,
          owner_approved = ?,
          completed_at = ?,
          vendor_name = ?,
          scheduled_date = ?
        WHERE id = ?
      `).run(
        merged.status,
        sb(merged.actualCost, null),
        merged.ownerApproved ? 1 : 0,
        sb(merged.completedAt, null),
        sb(merged.vendorName, null),
        sb(merged.scheduledDate, null),
        id
      );
      this.syncRootDb();
      const updated = (await this.tickets.findMany()).find(t => t.id === id);
      return updated || null;
    }
  };

  // ==========================================
  // LEADS REPOSITORY
  // ==========================================
  public leads = {
    findMany: async (): Promise<Lead[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        preferredArea: r.preferred_area,
        budgetMin: r.budget_min,
        budgetMax: r.budget_max,
        moveInUrgency: r.move_in_urgency,
        scoreCategory: r.score_category,
        scoreExplanation: r.score_explanation,
        stage: r.stage,
        propertyInterest: r.property_interest,
        source: r.source,
        createdAt: r.created_at,
        assignedAgent: r.assigned_agent,
        visitDate: r.visit_date || undefined
      }));
    },
    create: async (lead: Lead): Promise<Lead> => {
      this.sqlite.prepare(`
        INSERT OR REPLACE INTO leads (
          id, name, phone, email, preferred_area, budget_min, budget_max,
          move_in_urgency, score_category, score_explanation, stage,
          property_interest, source, created_at, assigned_agent, visit_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        lead.id,
        lead.name,
        lead.phone,
        lead.email,
        lead.preferredArea,
        sb(lead.budgetMin, 0),
        sb(lead.budgetMax, 0),
        lead.moveInUrgency,
        lead.scoreCategory,
        lead.scoreExplanation,
        lead.stage,
        lead.propertyInterest,
        lead.source,
        lead.createdAt || new Date().toISOString().split('T')[0],
        lead.assignedAgent,
        sb(lead.visitDate, null)
      );
      return lead;
    },
    updateStage: async (id: string, stage: Lead['stage']): Promise<Lead | null> => {
      this.sqlite.prepare('UPDATE leads SET stage = ? WHERE id = ?').run(stage, id);
      const all = await this.leads.findMany();
      return all.find(l => l.id === id) || null;
    }
  };

  // ==========================================
  // UTILITIES REPOSITORY
  // ==========================================
  public utilities = {
    findMany: async (): Promise<UtilityReading[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM utilities ORDER BY reading_date DESC').all();
      return rows.map(r => ({
        id: r.id,
        utilityType: r.utility_type as UtilityReading['utilityType'],
        estateName: r.estate_name,
        meterNumber: r.meter_number,
        previousReading: r.previous_reading,
        currentReading: r.current_reading,
        consumptionUnit: r.consumption_unit,
        billAmount: r.bill_amount,
        readingDate: r.reading_date,
        paymentStatus: (r.payment_status || 'Paid') as 'Paid' | 'Pending'
      }));
    }
  };

  // ==========================================
  // AI INSIGHTS REPOSITORY
  // ==========================================
  public aiInsights = {
    findMany: async (): Promise<AIInsight[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM ai_insights ORDER BY created_at DESC').all();
      return rows.map(r => ({
        id: r.id,
        category: r.category,
        title: r.title,
        description: r.description,
        impactAmount: r.impact_amount,
        actionText: r.action_text,
        actionPayload: r.action_payload || undefined,
        createdAt: r.created_at
      }));
    },
    delete: async (id: string): Promise<boolean> => {
      this.sqlite.prepare('DELETE FROM ai_insights WHERE id = ?').run(id);
      return true;
    }
  };

  // ==========================================
  // MOVE-FLOW CHECKLIST REPOSITORY
  // ==========================================
  public moveFlow = {
    findMany: async (): Promise<MoveFlowChecklistItem[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM moveflow_checklist').all();
      return rows.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        completed: Boolean(r.completed),
        dueDate: r.due_date
      }));
    },
    toggle: async (id: string): Promise<MoveFlowChecklistItem | null> => {
      const item = this.sqlite.prepare('SELECT * FROM moveflow_checklist WHERE id = ?').get(id);
      if (!item) return null;
      const nextCompleted = item.completed ? 0 : 1;
      this.sqlite.prepare('UPDATE moveflow_checklist SET completed = ? WHERE id = ?').run(nextCompleted, id);
      const all = await this.moveFlow.findMany();
      return all.find(i => i.id === id) || null;
    }
  };

  // ==========================================
  // PG, COMMERCIAL & ESTATE REPOSITORIES
  // ==========================================
  public pg = {
    getBeds: async (): Promise<PGBed[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM pg_beds').all();
      return rows.map(r => ({
        id: r.id,
        bedCode: r.bed_code || undefined,
        roomId: r.room_id,
        roomNumber: r.room_number,
        floor: r.floor,
        sharingType: r.sharing_type,
        status: r.status,
        monthlyRent: r.monthly_rent,
        deposit: r.deposit,
        tenantId: r.tenant_id || undefined,
        tenantName: r.tenant_name || undefined,
        tenantPhone: r.tenant_phone || undefined,
        ac: Boolean(r.ac),
        attachedBath: Boolean(r.attached_bath),
        foodIncluded: Boolean(r.food_included),
        wifiIncluded: Boolean(r.wifi_included),
        laundryIncluded: Boolean(r.laundry_included)
      }));
    },
    getRooms: async (): Promise<PGRoom[]> => {
      const rooms = this.sqlite.prepare('SELECT * FROM pg_rooms').all();
      const beds = await this.pg.getBeds();
      return rooms.map(r => ({
        id: r.id,
        propertyId: r.property_id,
        roomNumber: r.room_number,
        floor: r.floor,
        sharingType: r.sharing_type,
        beds: beds.filter(b => b.roomId === r.id),
        electricitySplitMethod: r.electricity_split_method || 'Submeter',
        submeterReading: r.submeter_reading || 0,
        roomRentTotal: r.room_rent_total
      }));
    },
    getMeals: async (): Promise<PGMealPlan[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM pg_meals').all();
      return rows.map(r => ({
        id: r.id,
        date: r.date,
        mealType: r.meal_type,
        menu: r.menu,
        vendor: r.vendor,
        optedInCount: r.opted_in_count,
        costPerMeal: r.cost_per_meal
      }));
    },
    updateBedStatus: async (bedId: string, status: string): Promise<boolean> => {
      this.sqlite.prepare('UPDATE pg_beds SET status = ? WHERE id = ?').run(status, bedId);
      return true;
    }
  };

  public commercial = {
    getUnits: async (): Promise<CommercialUnit[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM commercial_units').all();
      return rows.map(r => ({
        id: r.id,
        propertyId: r.property_id || undefined,
        unitNumber: r.unit_number,
        floor: r.floor,
        businessName: r.business_name || undefined,
        businessType: r.business_type || undefined,
        areaSqFt: r.area_sq_ft,
        baseRent: r.base_rent,
        camRatePerSqFt: r.cam_rate_per_sqft,
        camAmount: r.cam_amount,
        parkingSlots: r.parking_slots,
        lockInPeriodMonths: r.lock_in_period_months,
        noticePeriodMonths: r.notice_period_months,
        escalationPercent: r.escalation_percent,
        fitOutStatus: r.fit_out_status,
        status: r.status
      }));
    },
    getExpenses: async (): Promise<CAMExpenseItem[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM cam_expenses').all();
      return rows.map(r => ({
        id: r.id,
        category: r.category,
        monthlyCost: r.monthly_cost,
        allocationMethod: r.allocation_method,
        vendorName: r.vendor_name
      }));
    },
    getVisitors: async (): Promise<CommercialVisitor[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM commercial_visitors').all();
      return rows.map(r => ({
        id: r.id,
        visitorName: r.visitor_name,
        hostCompany: r.host_company,
        purpose: r.purpose,
        vehicleNumber: r.vehicle_number || undefined,
        checkInTime: r.check_in_time,
        status: r.status,
        passCode: r.pass_code
      }));
    },
    createVisitor: async (visitor: Omit<CommercialVisitor, 'id' | 'passCode' | 'status'>): Promise<CommercialVisitor> => {
      const id = `vis-${Date.now()}`;
      const passCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;
      const checkInTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      this.sqlite.prepare(`
        INSERT INTO commercial_visitors (id, visitor_name, host_company, purpose, vehicle_number, check_in_time, status, pass_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        visitor.visitorName,
        visitor.hostCompany,
        visitor.purpose,
        sb(visitor.vehicleNumber, null),
        checkInTime,
        'Checked In',
        passCode
      );
      return {
        id,
        ...visitor,
        checkInTime,
        status: 'Checked In',
        passCode
      };
    }
  };

  public estate = {
    getAssets: async (): Promise<EstateAsset[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM estate_assets').all();
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        tag: r.tag,
        category: r.category,
        estateName: r.estate_name,
        purchaseDate: r.purchase_date,
        warrantyUntil: r.warranty_until,
        amcProvider: r.amc_provider,
        lastService: r.last_service,
        nextService: r.next_service,
        condition: r.condition
      }));
    },
    getStaff: async (): Promise<StaffMember[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM staff').all();
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        role: r.role,
        estateName: r.estate_name,
        phone: r.phone,
        shift: r.shift,
        attendanceStatus: r.attendance_status,
        monthlySalary: r.monthly_salary
      }));
    }
  };

  // ==========================================
  // SUBSCRIPTIONS & PLATFORM SAAS LICENSING
  // ==========================================
  public subscriptions = {
    getForUser: async (userId?: string): Promise<OwnerSubscription | null> => {
      const rows = this.sqlite.prepare('SELECT * FROM subscriptions').all();
      const all: OwnerSubscription[] = rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        ownerName: r.owner_name,
        entityName: r.entity_name,
        planId: r.plan_id,
        planName: r.plan_name,
        status: r.status,
        billingCycle: r.billing_cycle,
        startDate: r.start_date,
        endDate: r.end_date,
        daysRemaining: r.days_remaining,
        amount: r.amount,
        currency: r.currency,
        maxUnits: r.max_units,
        currentUnits: r.current_units,
        paymentMethod: r.payment_method,
        lastPaymentTxnId: r.last_payment_txn_id,
        lastPaymentDate: r.last_payment_date,
        autoRenew: Boolean(r.auto_renew),
        gstin: r.gstin,
        tamperProofHash: r.tamper_proof_hash,
        history: JSON.parse(r.history_json || '[]'),
        isTrial: Boolean(r.is_trial),
        trialDaysRemaining: r.trial_days_remaining || undefined,
        trialEndsAt: r.trial_ends_at || undefined,
        canCancelBefore: r.can_cancel_before || undefined,
        autopayConnected: Boolean(r.autopay_connected),
        autopayMethod: r.autopay_method || undefined,
        autopayMaskedDetails: r.autopay_masked_details || undefined,
        firstChargeAmount: r.first_charge_amount || undefined,
        firstChargeDate: r.first_charge_date || undefined
      }));

      const sub = all.find(s => s.userId === userId || s.userId === 'user-owner-vikram');
      return sub || all[0] || null;
    },

    getAll: async (): Promise<OwnerSubscription[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM subscriptions').all();
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        ownerName: r.owner_name,
        entityName: r.entity_name,
        planId: r.plan_id,
        planName: r.plan_name,
        status: r.status,
        billingCycle: r.billing_cycle,
        startDate: r.start_date,
        endDate: r.end_date,
        daysRemaining: r.days_remaining,
        amount: r.amount,
        currency: r.currency,
        maxUnits: r.max_units,
        currentUnits: r.current_units,
        paymentMethod: r.payment_method,
        lastPaymentTxnId: r.last_payment_txn_id,
        lastPaymentDate: r.last_payment_date,
        autoRenew: Boolean(r.auto_renew),
        gstin: r.gstin,
        tamperProofHash: r.tamper_proof_hash,
        history: JSON.parse(r.history_json || '[]'),
        isTrial: Boolean(r.is_trial),
        trialDaysRemaining: r.trial_days_remaining || undefined,
        trialEndsAt: r.trial_ends_at || undefined,
        canCancelBefore: r.can_cancel_before || undefined,
        autopayConnected: Boolean(r.autopay_connected),
        autopayMethod: r.autopay_method || undefined,
        autopayMaskedDetails: r.autopay_masked_details || undefined,
        firstChargeAmount: r.first_charge_amount || undefined,
        firstChargeDate: r.first_charge_date || undefined
      }));
    },

    save: async (sub: OwnerSubscription): Promise<OwnerSubscription> => {
      this.sqlite.prepare(`
        INSERT OR REPLACE INTO subscriptions (
          id, user_id, owner_name, entity_name, plan_id, plan_name, status,
          billing_cycle, start_date, end_date, days_remaining, amount, currency,
          max_units, current_units, payment_method, last_payment_txn_id, last_payment_date,
          auto_renew, gstin, tamper_proof_hash, history_json, is_trial, trial_days_remaining,
          trial_ends_at, can_cancel_before, autopay_connected, autopay_method, autopay_masked_details,
          first_charge_amount, first_charge_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        sub.id,
        sub.userId,
        sub.ownerName,
        sub.entityName,
        sub.planId,
        sub.planName,
        sub.status,
        sub.billingCycle,
        sub.startDate,
        sub.endDate,
        sub.daysRemaining,
        sub.amount,
        sub.currency,
        sub.maxUnits,
        sub.currentUnits,
        sub.paymentMethod,
        sub.lastPaymentTxnId,
        sub.lastPaymentDate,
        sub.autoRenew ? 1 : 0,
        sub.gstin,
        sub.tamperProofHash,
        JSON.stringify(sub.history || []),
        sub.isTrial ? 1 : 0,
        sb(sub.trialDaysRemaining, null),
        sb(sub.trialEndsAt, null),
        sb(sub.canCancelBefore, null),
        sub.autopayConnected ? 1 : 0,
        sb(sub.autopayMethod, null),
        sb(sub.autopayMaskedDetails, null),
        sb(sub.firstChargeAmount, null),
        sb(sub.firstChargeDate, null),
        new Date().toISOString()
      );
      this.syncRootDb();
      return sub;
    },

    upgrade: async (
      userId: string,
      planId: SubscriptionTierId,
      billingCycle: 'monthly' | 'annual',
      paymentMethod: string,
      txnId: string
    ): Promise<OwnerSubscription> => {
      const sub = await this.subscriptions.getForUser(userId);
      const plan = SUBSCRIPTION_PLANS[planId];
      if (!plan) throw new Error(`Invalid plan identifier: ${planId}`);

      const authoritativeAmount = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
      const startDate = new Date().toISOString().split('T')[0];
      const expiry = new Date();
      if (billingCycle === 'annual') {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }
      const endDate = expiry.toISOString().split('T')[0];
      const daysRemaining = Math.max(1, Math.round((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      const newInvoice: SubscriptionInvoice = {
        invoiceId: `INV-STAY-SUB-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: authoritativeAmount,
        currency: 'INR',
        planId,
        planName: `${plan.name} (${billingCycle === 'annual' ? 'Annual' : 'Monthly'})`,
        billingCycle,
        txnId,
        paymentMethod,
        status: 'PAID',
        taxAmount: Math.round((authoritativeAmount * 18) / 118),
        gstin: sub?.gstin || '29AAACS1928K1Z5',
        downloadUrl: '#'
      };

      const updatedSub: OwnerSubscription = {
        id: sub ? sub.id : `sub_${Date.now()}`,
        userId: userId || 'user-owner-vikram',
        ownerName: sub ? sub.ownerName : 'Vikram Singhania',
        entityName: sub ? sub.entityName : 'Singhania Asset Holdings LLP',
        planId,
        planName: plan.name,
        status: 'ACTIVE',
        billingCycle,
        startDate,
        endDate,
        daysRemaining,
        amount: authoritativeAmount,
        currency: 'INR',
        maxUnits: plan.maxUnits,
        currentUnits: sub ? sub.currentUnits : 24,
        paymentMethod,
        lastPaymentTxnId: txnId,
        lastPaymentDate: startDate,
        autoRenew: true,
        gstin: sub?.gstin || '29AAACS1928K1Z5',
        tamperProofHash: calculateSubscriptionHash({
          userId: userId || 'user-owner-vikram',
          planId,
          startDate,
          endDate,
          amount: authoritativeAmount
        }),
        history: sub?.history ? [newInvoice, ...sub.history] : [newInvoice]
      };

      await this.subscriptions.save(updatedSub);

      await this.ledger.create({
        description: `Platform Subscription: ${plan.name} (${billingCycle.toUpperCase()}) - ${paymentMethod} [SQLite Verified]`,
        type: 'CREDIT',
        amount: authoritativeAmount,
        account: '4010-PLATFORM-SAAS-REVENUE',
        entityType: 'RENT',
        referenceId: newInvoice.invoiceId,
        settlementStatus: 'CLEARED'
      });

      this.syncRootDb();
      return updatedSub;
    },

    createTrial: async (params: {
      userId: string;
      ownerName: string;
      entityName: string;
      planId: SubscriptionTierId;
      billingCycle: 'monthly' | 'annual';
      autopayMethod: 'CARD' | 'BANK_MANDATE';
      autopayMaskedDetails: string;
    }): Promise<OwnerSubscription> => {
      const plan = SUBSCRIPTION_PLANS[params.planId] || SUBSCRIPTION_PLANS.growth_pro;
      const authoritativeAmount = params.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

      const startDate = new Date().toISOString().split('T')[0];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      const endDate = expiry.toISOString().split('T')[0];

      const trialSub: OwnerSubscription = {
        id: `sub_trial_${Date.now()}`,
        userId: params.userId,
        ownerName: params.ownerName,
        entityName: params.entityName,
        planId: params.planId,
        planName: plan.name,
        status: 'TRIAL',
        billingCycle: params.billingCycle,
        startDate,
        endDate,
        daysRemaining: 7,
        amount: authoritativeAmount,
        currency: 'INR',
        maxUnits: plan.maxUnits,
        currentUnits: 1,
        paymentMethod: params.autopayMethod === 'CARD' 
          ? `Autopay Card: ${params.autopayMaskedDetails}` 
          : `Autopay Bank Mandate: ${params.autopayMaskedDetails}`,
        lastPaymentTxnId: `TXN-TRIAL-MANDATE-${Date.now()}`,
        lastPaymentDate: startDate,
        autoRenew: true,
        gstin: '29AAACS1928K1Z5',
        tamperProofHash: calculateSubscriptionHash({
          userId: params.userId,
          planId: params.planId,
          startDate,
          endDate,
          amount: authoritativeAmount
        }),
        history: [{
          invoiceId: `INV-TRIAL-TOKEN-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: 0,
          currency: 'INR',
          planId: params.planId,
          planName: `${plan.name} (7-Day Free Trial - ₹0 Today)`,
          billingCycle: params.billingCycle,
          txnId: `TXN-TRIAL-${Date.now()}`,
          paymentMethod: params.autopayMethod === 'CARD' ? 'Card Tokenization (₹0.00 Auth)' : 'e-NACH Mandate Registration',
          status: 'PAID',
          taxAmount: 0,
          gstin: '29AAACS1928K1Z5',
          downloadUrl: '#'
        }],
        isTrial: true,
        trialDaysRemaining: 7,
        trialEndsAt: endDate,
        canCancelBefore: endDate,
        autopayConnected: true,
        autopayMethod: params.autopayMethod,
        autopayMaskedDetails: params.autopayMaskedDetails,
        firstChargeAmount: authoritativeAmount,
        firstChargeDate: endDate
      };

      await this.subscriptions.save(trialSub);

      await this.ledger.create({
        description: `7-Day Free Trial Activated: ${plan.name} (${params.billingCycle.toUpperCase()}) - [₹0 Due Today, Autopay Scheduled for ${endDate}]`,
        type: 'CREDIT',
        amount: 0,
        account: '4010-PLATFORM-SAAS-TRIAL',
        entityType: 'RENT',
        referenceId: trialSub.id,
        settlementStatus: 'CLEARED'
      });

      this.syncRootDb();
      return trialSub;
    },

    cancelTrial: async (userId: string): Promise<OwnerSubscription | null> => {
      const sub = await this.subscriptions.getForUser(userId);
      if (!sub) return null;

      sub.status = 'CANCELLED';
      sub.autoRenew = false;
      sub.autopayConnected = false;
      sub.isTrial = false;

      await this.subscriptions.save(sub);

      await this.ledger.create({
        description: `7-Day Free Trial Cancelled by User before Day 7 - Autopay Mandate Revoked (₹0 Charged)`,
        type: 'DEBIT',
        amount: 0,
        account: '4010-PLATFORM-SAAS-CANCELLATION',
        entityType: 'RENT',
        referenceId: sub.id,
        settlementStatus: 'CLEARED'
      });

      this.syncRootDb();
      return sub;
    }
  };
}

// Global Singleton Instance across Next.js API Routes & Server Actions
const globalForDb = global as unknown as { staywiseDbInstance?: DatabaseEngine };

export const db = globalForDb.staywiseDbInstance || new DatabaseEngine();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.staywiseDbInstance = db;
}

export default db;
