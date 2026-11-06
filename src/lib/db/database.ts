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
  PropertyUnit,
  TenantConnectionRequest,
  TenancyType,
  RewardsAccount,
  RewardsLedgerEntry,
  RewardRule,
  MerchantOffer,
  RewardActionType,
  DepositProtectionApplication,
  ProtectionApplicationStatus,
  ProtectionContract,
  PropertyConditionReport,
  ProtectionClaim,
  ClaimStatus
} from '../../types';
import { SUBSCRIPTION_PLANS, calculateSubscriptionHash } from '../security/subscriptionCatalog';
import { hashPassword, verifyPassword, isSha256 } from '../security/auth';
import { invalidateBootstrapCache } from '../cache/apiCache';
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
  generateReferralId,
  generateRewardEntryId,
  generateProtectionAppId,
  generateProtectionContractId,
  generatePolicyNumber,
  generateConditionReportId,
  generateClaimId
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
  rewardsAccounts: RewardsAccount[];
  rewardsLedger: RewardsLedgerEntry[];
  rewardRules: RewardRule[];
  merchantOffers: MerchantOffer[];
  depositApplications: DepositProtectionApplication[];
  protectionContracts: ProtectionContract[];
  conditionReports: PropertyConditionReport[];
  protectionClaims: ProtectionClaim[];
}


const DB_FILE = path.join(process.cwd(), 'database.db');

// Safe binding helper (converts undefined to null for sqlite)
const sb = (val: unknown, fallback: unknown = null) => (val === undefined ? fallback : val);

class DatabaseEngine {
  private sqlite: DatabaseSync;
  private static hasMigratedPasswords = false;
  private static userCache = new Map<string, { user: UserAccount; cachedAt: number }>();
  private static userEmailCache = new Map<string, { user: UserAccount; cachedAt: number }>();
  private static readonly USER_CACHE_TTL_MS = 60 * 1000;

  public static invalidateUserCache(userId?: string, email?: string) {
    if (userId) {
      DatabaseEngine.userCache.delete(userId);
    }
    if (email) {
      DatabaseEngine.userEmailCache.delete(email.toLowerCase().trim());
    }
    if (!userId && !email) {
      DatabaseEngine.userCache.clear();
      DatabaseEngine.userEmailCache.clear();
    }
  }

  constructor() {
    // Connect directly to root SQLite Database with busy_timeout and performance pragmas
    this.sqlite = new DatabaseSync(DB_FILE);
    this.sqlite.exec('PRAGMA busy_timeout = 5000;');
    this.sqlite.exec('PRAGMA foreign_keys = ON;');
    this.sqlite.exec('PRAGMA cache_size = -64000;'); // 64MB memory cache for SQLite
    this.sqlite.exec('PRAGMA temp_store = MEMORY;');  // In-memory temp tables & sorting
    try {
      this.sqlite.exec('PRAGMA journal_mode = WAL;');
      this.sqlite.exec('PRAGMA synchronous = NORMAL;');
    } catch (e) {
      try {
        this.sqlite.exec('PRAGMA journal_mode = DELETE;');
        this.sqlite.exec('PRAGMA synchronous = NORMAL;');
      } catch (e2) {}
    }
    this.ensureSchema();
  }

  private syncRootDb(): void {
    // Automatically invalidate in-memory bootstrap cache on any database mutation
    invalidateBootstrapCache();
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
        tenancy_type TEXT DEFAULT 'RESIDENTIAL',
        has_food INTEGER DEFAULT 0,
        room_sharing TEXT DEFAULT 'Single',
        co_tenant_id TEXT,
        co_tenant_name TEXT,
        co_tenant_phone TEXT,
        co_tenant_email TEXT,
        rent_share_percentage INTEGER DEFAULT 100,
        aadhaar_number TEXT,
        pan_number TEXT,
        documents_json TEXT DEFAULT '[]',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tenant_connection_requests (
        id TEXT PRIMARY KEY,
        tenant_user_id TEXT NOT NULL,
        tenant_name TEXT NOT NULL,
        tenant_email TEXT NOT NULL,
        tenant_phone TEXT NOT NULL,
        owner_id TEXT,
        owner_code TEXT,
        owner_email TEXT,
        owner_phone TEXT,
        property_id TEXT,
        property_name TEXT,
        unit_number TEXT NOT NULL,
        monthly_rent REAL NOT NULL,
        deposit_amount REAL NOT NULL,
        lease_start_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
        tenancy_type TEXT DEFAULT 'PG',
        include_food_plan INTEGER DEFAULT 1,
        aadhaar_number TEXT,
        pan_number TEXT,
        ekyc_verified INTEGER DEFAULT 1,
        documents_json TEXT DEFAULT '[]',
        agreement_url TEXT,
        co_tenant_name TEXT,
        co_tenant_phone TEXT,
        co_tenant_email TEXT,
        move_out_date TEXT,
        move_out_reason TEXT,
        inspection_notes TEXT,
        deposit_settled_amount REAL,
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

      CREATE TABLE IF NOT EXISTS platform_settings (
        user_id TEXT PRIMARY KEY,
        entity_name TEXT,
        owner_name TEXT,
        pan_number TEXT,
        gstin TEXT,
        bank_account TEXT,
        ifsc TEXT,
        bank_name TEXT,
        upi_id TEXT,
        auto_sweep_cadence TEXT,
        rent_due_day INTEGER DEFAULT 5,
        grace_period_days INTEGER DEFAULT 3,
        late_fee_fixed REAL DEFAULT 500,
        late_fee_daily_rate REAL DEFAULT 50,
        auto_whatsapp_reminder INTEGER DEFAULT 1,
        allow_partial_payments INTEGER DEFAULT 0,
        kseb_tariff_per_unit REAL DEFAULT 9.5,
        dg_backup_rate_per_unit REAL DEFAULT 24.0,
        meter_reading_cycle TEXT DEFAULT '1st to 5th of every month',
        common_area_power_ratio REAL DEFAULT 10,
        preferences_json TEXT DEFAULT '{}',
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rewards_accounts (
        user_id TEXT PRIMARY KEY,
        user_name TEXT,
        user_role TEXT,
        total_earned INTEGER NOT NULL DEFAULT 0,
        total_redeemed INTEGER NOT NULL DEFAULT 0,
        current_balance INTEGER NOT NULL DEFAULT 0,
        pending_points INTEGER NOT NULL DEFAULT 0,
        current_streak INTEGER NOT NULL DEFAULT 0,
        tier TEXT NOT NULL DEFAULT 'SILVER',
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rewards_ledger (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        points INTEGER NOT NULL,
        points_type TEXT NOT NULL,
        reference_id TEXT,
        reference_type TEXT,
        description TEXT NOT NULL,
        financial_cost REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reward_rules (
        id TEXT PRIMARY KEY,
        rule_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        points_awarded INTEGER NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        category TEXT NOT NULL,
        monthly_cap INTEGER NOT NULL DEFAULT 1000,
        partner_funded INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS merchant_offers (
        id TEXT PRIMARY KEY,
        partner_name TEXT NOT NULL,
        category TEXT NOT NULL,
        offer_title TEXT NOT NULL,
        discount_description TEXT NOT NULL,
        points_required INTEGER NOT NULL,
        voucher_code TEXT NOT NULL,
        image_url TEXT,
        terms TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        expiry_date TEXT
      );

      CREATE TABLE IF NOT EXISTS deposit_protection_applications (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        tenant_name TEXT NOT NULL,
        tenant_email TEXT,
        tenant_phone TEXT,
        owner_id TEXT NOT NULL,
        owner_name TEXT,
        property_id TEXT NOT NULL,
        property_name TEXT NOT NULL,
        unit_number TEXT NOT NULL,
        monthly_rent REAL NOT NULL,
        traditional_deposit_amount REAL NOT NULL,
        monthly_fee REAL NOT NULL,
        coverage_limit REAL NOT NULL,
        risk_score INTEGER NOT NULL DEFAULT 85,
        eligibility_status TEXT NOT NULL DEFAULT 'ELIGIBLE',
        status TEXT NOT NULL DEFAULT 'PENDING_ASSESSMENT',
        disclosures_accepted INTEGER NOT NULL DEFAULT 1,
        partner_provider TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS protection_contracts (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL,
        policy_number TEXT UNIQUE NOT NULL,
        tenant_id TEXT NOT NULL,
        tenant_name TEXT NOT NULL,
        owner_id TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        property_id TEXT NOT NULL,
        property_name TEXT NOT NULL,
        unit_number TEXT NOT NULL,
        coverage_limit REAL NOT NULL,
        monthly_fee REAL NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        partner_name TEXT NOT NULL,
        certificate_url TEXT,
        covered_risks_json TEXT NOT NULL DEFAULT '[]',
        exclusions_json TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS property_condition_reports (
        id TEXT PRIMARY KEY,
        contract_id TEXT,
        property_id TEXT NOT NULL,
        property_name TEXT NOT NULL,
        unit_number TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        tenant_name TEXT NOT NULL,
        report_type TEXT NOT NULL,
        inspection_date TEXT NOT NULL,
        overall_condition TEXT NOT NULL,
        items_json TEXT NOT NULL DEFAULT '[]',
        photos_json TEXT NOT NULL DEFAULT '[]',
        notes TEXT NOT NULL,
        verified_by TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'VERIFIED',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS protection_claims (
        id TEXT PRIMARY KEY,
        contract_id TEXT NOT NULL,
        policy_number TEXT NOT NULL,
        property_id TEXT NOT NULL,
        property_name TEXT NOT NULL,
        unit_number TEXT NOT NULL,
        owner_id TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        tenant_name TEXT NOT NULL,
        claim_type TEXT NOT NULL,
        claimed_amount REAL NOT NULL,
        approved_amount REAL,
        deductible REAL NOT NULL DEFAULT 0,
        description TEXT NOT NULL,
        evidence_urls_json TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'FILED',
        dispute_reason TEXT,
        settlement_date TEXT,
        settlement_txn_id TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // Automatic non-destructive schema migrations
    try { this.sqlite.exec('ALTER TABLE properties ADD COLUMN owner_id TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN user_id TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN tenancy_type TEXT DEFAULT "RESIDENTIAL";'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN has_food INTEGER DEFAULT 0;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN room_sharing TEXT DEFAULT "Single";'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN co_tenant_id TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN co_tenant_name TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN co_tenant_phone TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN co_tenant_email TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN rent_share_percentage INTEGER DEFAULT 100;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN aadhaar_number TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN pan_number TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenants ADD COLUMN documents_json TEXT DEFAULT "[]";'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN tenancy_type TEXT DEFAULT "PG";'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN include_food_plan INTEGER DEFAULT 1;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN aadhaar_number TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN pan_number TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN ekyc_verified INTEGER DEFAULT 1;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN documents_json TEXT DEFAULT "[]";'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN agreement_url TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN co_tenant_name TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN co_tenant_phone TEXT;'); } catch (e) {}
    try { this.sqlite.exec('ALTER TABLE tenant_connection_requests ADD COLUMN co_tenant_email TEXT;'); } catch (e) {}

    // High-performance secondary indexes for sub-millisecond query execution
    const indexStatements = [
      'CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);',
      'CREATE INDEX IF NOT EXISTS idx_properties_portfolio ON properties(portfolio);',
      'CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);',
      'CREATE INDEX IF NOT EXISTS idx_property_units_property_id ON property_units(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants(phone);',
      'CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_property_id ON invoices(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);',
      'CREATE INDEX IF NOT EXISTS idx_ledger_reference_id ON ledger(reference_id);',
      'CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger(account);',
      'CREATE INDEX IF NOT EXISTS idx_ledger_type ON ledger(type);',
      'CREATE INDEX IF NOT EXISTS idx_tickets_property_id ON tickets(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);',
      'CREATE INDEX IF NOT EXISTS idx_leads_property_interest ON leads(property_interest);',
      'CREATE INDEX IF NOT EXISTS idx_bills_property_id ON electricity_bills(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_tenant_connections_owner_id ON tenant_connection_requests(owner_id);',
      'CREATE INDEX IF NOT EXISTS idx_tenant_connections_tenant_id ON tenant_connection_requests(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_pg_beds_room_id ON pg_beds(room_id);',
      'CREATE INDEX IF NOT EXISTS idx_pg_beds_tenant_id ON pg_beds(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_commercial_units_property_id ON commercial_units(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_estate_assets_estate_name ON estate_assets(estate_name);',
      'CREATE INDEX IF NOT EXISTS idx_deposit_disputes_property_id ON deposit_disputes(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_rewards_ledger_user ON rewards_ledger(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_dp_apps_tenant ON deposit_protection_applications(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_dp_apps_owner ON deposit_protection_applications(owner_id);',
      'CREATE INDEX IF NOT EXISTS idx_dp_contracts_tenant ON protection_contracts(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_dp_contracts_owner ON protection_contracts(owner_id);',
      'CREATE INDEX IF NOT EXISTS idx_cond_reports_prop ON property_condition_reports(property_id);',
      'CREATE INDEX IF NOT EXISTS idx_cond_reports_tenant ON property_condition_reports(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_claims_contract ON protection_claims(contract_id);',
      'CREATE INDEX IF NOT EXISTS idx_claims_owner ON protection_claims(owner_id);',
      'CREATE INDEX IF NOT EXISTS idx_claims_tenant ON protection_claims(tenant_id);',
      'CREATE INDEX IF NOT EXISTS idx_properties_owner_status ON properties(owner_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status ON invoices(tenant_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_invoices_prop_due ON invoices(property_id, due_date);',
      'CREATE INDEX IF NOT EXISTS idx_tickets_prop_status ON tickets(property_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_ledger_ref_type ON ledger(reference_id, type);',
      'CREATE INDEX IF NOT EXISTS idx_tenants_user_prop ON tenants(user_id, property_id);',
      'CREATE INDEX IF NOT EXISTS idx_contracts_tenant_status ON protection_contracts(tenant_id, status);',
      'CREATE INDEX IF NOT EXISTS idx_rewards_ledger_user_created ON rewards_ledger(user_id, created_at);'
    ];

    for (const sql of indexStatements) {
      try {
        this.sqlite.exec(sql);
      } catch (e) {}
    }

    // Seed default Reward Rules and Merchant Offers if table is fresh
    try {
      const ruleCount = (this.sqlite.prepare('SELECT COUNT(*) as c FROM reward_rules').get() as any)?.c || 0;
      if (ruleCount === 0) {
        const insertRule = this.sqlite.prepare(`
          INSERT INTO reward_rules (id, rule_code, name, description, points_awarded, is_active, category, monthly_cap, partner_funded)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertRule.run('rule-rent-ontime', 'RULE_RENT_ONTIME', 'Verified On-Time Rent Payment', 'Points awarded for rent settled on or before due date via UPI or Bank Transfer', 100, 1, 'RENT', 100, 0);
        insertRule.run('rule-lease-renewal', 'RULE_LEASE_RENEWAL', 'Lease Renewal Completed', 'Bonus points when renewing lease agreement through Staywise', 200, 1, 'TENANCY', 200, 0);
        insertRule.run('rule-condition-report', 'RULE_MOVEIN_INSPECTION', 'Verified Move-In Condition Report', 'Audit condition photos submitted with room checklist', 100, 1, 'TENANCY', 100, 0);
        insertRule.run('rule-referral-lease', 'RULE_REFERRAL_LEASE', 'Eligible Referral Lease Completion', 'When a referred tenant or landlord executes a verified lease', 300, 1, 'COMMUNITY', 900, 0);
        insertRule.run('rule-annual-streak', 'RULE_ANNUAL_STREAK', '12-Month On-Time Rent Streak', 'Annual loyalty bonus for consistent on-time tenancy records', 500, 1, 'LOYALTY', 500, 0);
        insertRule.run('rule-merchant-partner', 'RULE_MERCHANT_PURCHASE', 'Participating Merchant Spend', 'Bonus points sponsored by neighborhood brand partners', 150, 1, 'MERCHANT', 1500, 1);
      }

      const offerCount = (this.sqlite.prepare('SELECT COUNT(*) as c FROM merchant_offers').get() as any)?.c || 0;
      if (offerCount === 0) {
        const insertOffer = this.sqlite.prepare(`
          INSERT INTO merchant_offers (id, partner_name, category, offer_title, discount_description, points_required, voucher_code, image_url, terms, is_active, expiry_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertOffer.run('mo-cult', 'Cult.fit', 'Fitness', '1-Month All-Access Gym Pass', '₹1,500 off Annual Cultpass or 1 Free Month of group classes', 500, 'CULT-STAYWISE-FIT', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 'Valid across 300+ Cult centers nationwide', 1, '2027-12-31');
        insertOffer.run('mo-uc', 'Urban Company', 'Home Services', 'Deep Home & AC Cleaning', 'Flat ₹600 Instant Voucher on deep cleaning or AC service', 250, 'UC-STAYWISE-CLEAN', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400', 'Valid on services above ₹1,499. One redemption per month.', 1, '2027-12-31');
        insertOffer.run('mo-bt', 'Blue Tokai', 'Dining', 'BOGO Coffee & Café Voucher', 'Buy 1 Get 1 on all artisan pour-overs and whole bean packs', 150, 'BT-WISECOFFEE', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', 'Valid in-store and online at Blue Tokai roasteries', 1, '2027-12-31');
        insertOffer.run('mo-nb', "Nature's Basket", 'Groceries', '₹500 Gourmet Grocery Credit', 'Flat ₹500 off on fresh organic groceries and dairy', 200, 'NB-WISEGROCERY', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 'Valid on minimum order value of ₹2,000', 1, '2027-12-31');
        insertOffer.run('mo-pepper', 'Pepperfry', 'Furnishing', '₹2,000 Home Furnishing Voucher', '₹2,000 off on furniture, study tables, and home decor', 400, 'PEPPER-STAYWISE-DECOR', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'Applicable on orders above ₹8,000 at Pepperfry online/studios', 1, '2027-12-31');
        insertOffer.run('mo-apollo', 'Apollo 24|7', 'Lifestyle', 'Health Check + ₹300 Meds Credit', 'Complimentary annual health screening + ₹300 medicine credit', 180, 'APOLLO-HEALTH-WISE', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'Valid pan-India on Apollo 24|7 app bookings', 1, '2027-12-31');
      }

      // Seed initial rewards account & ledger for demo tenant (Shyam Sundar)
      const tenantRow = this.sqlite.prepare('SELECT id, name FROM users WHERE email = ? LIMIT 1').get('tenant@staywise.com') as any;
      if (tenantRow) {
        const existingAcc = this.sqlite.prepare('SELECT user_id FROM rewards_accounts WHERE user_id = ?').get(tenantRow.id);
        if (!existingAcc) {
          this.sqlite.prepare(`
            INSERT INTO rewards_accounts (user_id, user_name, user_role, total_earned, total_redeemed, current_balance, pending_points, current_streak, tier, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(tenantRow.id, tenantRow.name, 'tenant', 950, 300, 650, 100, 5, 'GOLD', new Date().toISOString());

          const insertLedger = this.sqlite.prepare(`
            INSERT INTO rewards_ledger (id, user_id, action_type, points, points_type, reference_id, reference_type, description, financial_cost, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          insertLedger.run('rew-101', tenantRow.id, 'RENT_PAID_ON_TIME', 100, 'EARNED', 'inv-oct-2026', 'INVOICE', 'Verified On-Time Rent Payment (Oct 2026)', 10.0, '2026-10-04T10:30:00Z');
          insertLedger.run('rew-102', tenantRow.id, 'MOVE_IN_INSPECTION_COMPLETED', 100, 'EARNED', 'cr-304-baseline', 'INSPECTION', 'Move-in Condition Report & Photo Audit Completed', 10.0, '2026-09-01T14:15:00Z');
          insertLedger.run('rew-103', tenantRow.id, 'REFERRAL_COMPLETED', 300, 'EARNED', 'ref-rohan-2026', 'REFERRAL', 'Referred Rohan Verma — Verified Tenancy Signed', 30.0, '2026-09-12T16:00:00Z');
          insertLedger.run('rew-104', tenantRow.id, 'DEPOSIT_PROTECT_BONUS', 350, 'EARNED', 'dp-ct-beachroad', 'LEASE', 'Zero-Deposit Protection Program Enrollment Bonus', 35.0, '2026-09-02T11:00:00Z');
          insertLedger.run('rew-105', tenantRow.id, 'REDEMPTION_MERCHANT_VOUCHER', -150, 'REDEEMED', 'mo-bt', 'VOUCHER', 'Redeemed Blue Tokai BOGO Coffee Voucher', 15.0, '2026-09-20T18:45:00Z');
          insertLedger.run('rew-106', tenantRow.id, 'REDEMPTION_RENT_CREDIT', -150, 'REDEEMED', 'inv-sep-2026', 'INVOICE', 'Applied ₹75 Rent Credit to September Invoice', 15.0, '2026-09-30T09:00:00Z');
          insertLedger.run('rew-107', tenantRow.id, 'RENT_PAID_ON_TIME', 100, 'EARNED', 'inv-sep-2026', 'INVOICE', 'Verified On-Time Rent Payment (Sep 2026)', 10.0, '2026-09-03T12:00:00Z');
        }
      }

      // Seed sample Deposit Protection Application and Active Contract
      const contractCount = (this.sqlite.prepare('SELECT COUNT(*) as c FROM protection_contracts').get() as any)?.c || 0;
      if (contractCount === 0 && tenantRow) {
        const ownerRow = this.sqlite.prepare('SELECT id, name FROM users WHERE email = ? LIMIT 1').get('owner@staywise.com') as any;
        const ownerId = ownerRow?.id || 'user-owner-vikram';
        const ownerName = ownerRow?.name || 'Vikram Menon';

        const appId = 'dp-app-beachroad-304';
        const contractId = 'dp-ct-beachroad-304';
        const policyNum = 'SW-DP-2026-KL902';
        const nowIso = new Date().toISOString();

        this.sqlite.prepare(`
          INSERT INTO deposit_protection_applications (
            id, tenant_id, tenant_name, tenant_email, tenant_phone,
            owner_id, owner_name, property_id, property_name, unit_number,
            monthly_rent, traditional_deposit_amount, monthly_fee, coverage_limit,
            risk_score, eligibility_status, status, disclosures_accepted, partner_provider,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          appId, tenantRow.id, tenantRow.name, 'tenant@staywise.com', '+91 98460 21980',
          ownerId, ownerName, 'prop-beach-road', 'Beach Road Apartments', '304',
          28700, 60000, 750, 100000,
          92, 'ELIGIBLE', 'ACTIVE', 1, 'ICICI Lombard / Staywise Institutional Guarantee Facility',
          '2026-09-01T10:00:00Z', nowIso
        );

        const coveredRisks = JSON.stringify([
          'Unpaid rent arrears up to 3 months (Max ₹86,100)',
          'Tenant-caused physical damages exceeding normal wear and tear',
          'Painting, deep cleaning, and wall restoration expenses',
          'Utility arrears capped up to ₹10,000'
        ]);

        const exclusions = JSON.stringify([
          'Pre-existing damages documented during verified Move-In inspection',
          'Normal wear and tear (e.g. minor scuffs, standard carpet fading)',
          'Unapproved utility surcharges without official sub-meter proof',
          'Deliberate or fraudulent owner modifications'
        ]);

        this.sqlite.prepare(`
          INSERT INTO protection_contracts (
            id, application_id, policy_number, tenant_id, tenant_name, owner_id, owner_name,
            property_id, property_name, unit_number, coverage_limit, monthly_fee,
            start_date, end_date, status, partner_name, certificate_url,
            covered_risks_json, exclusions_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          contractId, appId, policyNum, tenantRow.id, tenantRow.name, ownerId, ownerName,
          'prop-beach-road', 'Beach Road Apartments', '304', 100000, 750,
          '2026-09-01', '2027-08-31', 'ACTIVE', 'ICICI Lombard Institutional Risk Pool',
          '/certificates/SW-DP-2026-KL902.pdf', coveredRisks, exclusions, '2026-09-01T10:15:00Z'
        );

        // Seed Baseline Move-In Condition Report
        const conditionItems = JSON.stringify([
          { id: 'ci-1', area: 'Living Room', item: 'Walls & Acrylic Paint', condition: 'EXCELLENT', notes: 'Fresh Asian Paints Royale finish. Zero nail holes or chips.' },
          { id: 'ci-2', area: 'Living Room', item: 'Daikin 1.5T Inverter AC', condition: 'GOOD', notes: 'Serviced on Aug 28, 2026. Remote working smoothly.' },
          { id: 'ci-3', area: 'Kitchen', item: 'Modular Cabinets & Chimney', condition: 'EXCELLENT', notes: 'Faber chimney suction tested. Soft-close hinges intact.' },
          { id: 'ci-4', area: 'Master Bedroom', item: 'Vitrified Tiles & Skirting', condition: 'EXCELLENT', notes: 'Zero cracks, stains or hollow spots.' },
          { id: 'ci-5', area: 'Master Bathroom', item: 'Kohler Ceramic & Geyser', condition: 'GOOD', notes: 'AO Smith 15L geyser working. Minimal limescale on tap.' }
        ]);

        const conditionPhotos = JSON.stringify([
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500'
        ]);

        this.sqlite.prepare(`
          INSERT INTO property_condition_reports (
            id, contract_id, property_id, property_name, unit_number,
            tenant_id, tenant_name, report_type, inspection_date, overall_condition,
            items_json, photos_json, notes, verified_by, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'cr-304-baseline', contractId, 'prop-beach-road', 'Beach Road Apartments', '304',
          tenantRow.id, tenantRow.name, 'MOVE_IN', '2026-09-01', 'Pristine',
          conditionItems, conditionPhotos, 'Move-in audit completed with tenant & building superintendent. Baseline approved.',
          'Staywise Inspection Audit #991', 'VERIFIED', '2026-09-01T14:00:00Z'
        );

        // Seed Sample Resolved Protection Claim
        const claimPhotos = JSON.stringify([
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'
        ]);

        this.sqlite.prepare(`
          INSERT INTO protection_claims (
            id, contract_id, policy_number, property_id, property_name, unit_number,
            owner_id, owner_name, tenant_id, tenant_name, claim_type,
            claimed_amount, approved_amount, deductible, description, evidence_urls_json,
            status, dispute_reason, settlement_date, settlement_txn_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'clm-sample-01', contractId, policyNum, 'prop-beach-road', 'Beach Road Apartments', '304',
          ownerId, ownerName, tenantRow.id, tenantRow.name, 'TENANT_DAMAGE',
          3500, 3500, 0, 'Kitchen sink mixer tap mechanical breakage caused by excessive force; invoice attached from authorized plumber.',
          claimPhotos, 'SETTLED', 'Tenant agreed to repair estimate without dispute.',
          '2026-09-25T15:00:00Z', 'TXN-DP-SETTLE-8819', '2026-09-22T09:30:00Z'
        );
      }
    } catch (e) {
      console.warn('[Database] Rewards & Deposit Protect seed notice:', e);
    }


    // Automatic SHA-256 password migration: ensure all stored passwords are encrypted in SHA-256 format
    if (!DatabaseEngine.hasMigratedPasswords) {
      DatabaseEngine.hasMigratedPasswords = true;
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
      const cleanEmail = email.toLowerCase().trim();
      const now = Date.now();
      const cached = DatabaseEngine.userEmailCache.get(cleanEmail);
      if (cached && now - cached.cachedAt < DatabaseEngine.USER_CACHE_TTL_MS) {
        return cached.user;
      }
      const row = this.sqlite.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1').get(cleanEmail) as any;
      if (!row) return null;
      const user: UserAccount = {
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
      DatabaseEngine.userEmailCache.set(cleanEmail, { user, cachedAt: now });
      DatabaseEngine.userCache.set(row.id, { user, cachedAt: now });
      return user;
    },
    findById: async (id: string): Promise<UserAccount | null> => {
      const now = Date.now();
      const cached = DatabaseEngine.userCache.get(id);
      if (cached && now - cached.cachedAt < DatabaseEngine.USER_CACHE_TTL_MS) {
        return cached.user;
      }
      const row = this.sqlite.prepare('SELECT * FROM users WHERE id = ? LIMIT 1').get(id) as any;
      if (!row) return null;
      const user: UserAccount = {
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
      DatabaseEngine.userCache.set(id, { user, cachedAt: now });
      DatabaseEngine.userEmailCache.set(row.email.toLowerCase().trim(), { user, cachedAt: now });
      return user;
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
          DatabaseEngine.invalidateUserCache(row.id, cleanEmail);
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
      DatabaseEngine.invalidateUserCache(id, payload.email);
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
      DatabaseEngine.invalidateUserCache(userId);
      return (res as any).changes > 0;
    },
    updateProfile: async (userId: string, data: Partial<{ name: string; email: string; phone: string; title: string; description: string }>): Promise<boolean> => {
      const existing = await this.users.findById(userId);
      if (!existing) return false;
      const res = this.sqlite.prepare(`
        UPDATE users SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          title = COALESCE(?, title),
          description = COALESCE(?, description)
        WHERE id = ?
      `).run(
        sb(data.name, null),
        sb(data.email, null),
        sb(data.phone, null),
        sb(data.title, null),
        sb(data.description, null),
        userId
      );
      this.syncRootDb();
      DatabaseEngine.invalidateUserCache(userId, data.email);
      return (res as any).changes > 0;
    }
  };

  // ==========================================
  // PROPERTIES REPOSITORY
  // ==========================================
  public properties = {
    findMany: async (filter?: { portfolio?: string; verificationStatus?: string; ownerId?: string; limit?: number; offset?: number }): Promise<Property[]> => {
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

      if (filter?.limit && filter.limit > 0) {
        const safeLimit = Math.min(100, filter.limit);
        query += ` LIMIT ${safeLimit}`;
        if (filter.offset && filter.offset > 0) {
          query += ` OFFSET ${filter.offset}`;
        }
      }

      const rows = this.sqlite.prepare(query).all(...params) as any[];
      if (rows.length === 0) return [];

      // Batch load units for all returned properties in a single query (eliminates N+1 query bottleneck)
      const propIds = rows.map(r => r.id);
      const placeholders = propIds.map(() => '?').join(',');
      const allUnits = this.sqlite.prepare(`SELECT * FROM property_units WHERE property_id IN (${placeholders})`).all(...propIds) as any[];

      const unitsByProp = new Map<string, PropertyUnit[]>();
      for (const u of allUnits) {
        const list = unitsByProp.get(u.property_id) || [];
        list.push({
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
        });
        unitsByProp.set(u.property_id, list);
      }

      return rows.map(r => {
        const units = unitsByProp.get(r.id) || [];
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
    findMany: async (filter?: { propertyId?: string; userId?: string; limit?: number; offset?: number }): Promise<Tenant[]> => {
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

      if (filter?.limit && filter.limit > 0) {
        const safeLimit = Math.min(100, filter.limit);
        query += ` LIMIT ${safeLimit}`;
        if (filter.offset && filter.offset > 0) {
          query += ` OFFSET ${filter.offset}`;
        }
      }

      const rows = this.sqlite.prepare(query).all(...params) as any[];
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
        emergencyContact: r.emergency_contact,
        tenancyType: (r.tenancy_type as any) || 'Residential',
        hasFood: Boolean(r.has_food),
        roomSharing: (r.room_sharing as any) || 'Single',
        coTenantId: r.co_tenant_id || undefined,
        coTenantName: r.co_tenant_name || undefined,
        coTenantPhone: r.co_tenant_phone || undefined,
        coTenantEmail: r.co_tenant_email || undefined,
        rentSharePercentage: r.rent_share_percentage ?? 100,
        aadhaarNumber: r.aadhaar_number || undefined,
        panNumber: r.pan_number || undefined,
        documents: r.documents_json ? (typeof r.documents_json === 'string' ? JSON.parse(r.documents_json) : r.documents_json) : []
      }));
    },

    findById: async (id: string): Promise<Tenant | null> => {
      const row = this.sqlite.prepare('SELECT * FROM tenants WHERE id = ? LIMIT 1').get(id) as any;
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
        emergencyContact: row.emergency_contact,
        tenancyType: (row.tenancy_type as any) || 'Residential',
        hasFood: Boolean(row.has_food),
        roomSharing: (row.room_sharing as any) || 'Single',
        coTenantId: row.co_tenant_id || undefined,
        coTenantName: row.co_tenant_name || undefined,
        coTenantPhone: row.co_tenant_phone || undefined,
        coTenantEmail: row.co_tenant_email || undefined,
        rentSharePercentage: row.rent_share_percentage ?? 100,
        aadhaarNumber: row.aadhaar_number || undefined,
        panNumber: row.pan_number || undefined,
        documents: row.documents_json ? (typeof row.documents_json === 'string' ? JSON.parse(row.documents_json) : row.documents_json) : []
      };
    },

    create: async (tenant: Tenant): Promise<Tenant> => {
      const id = tenant.id || generateTenantId();
      const insert = this.sqlite.prepare(`
        INSERT OR REPLACE INTO tenants (
          id, user_id, name, email, phone, property_id, property_name, unit_number,
          monthly_rent, deposit_paid, lease_start, lease_end, rent_due_date, salary_date,
          autopay_active, reliability_score, kyc_verified, rewards_balance, emergency_contact,
          tenancy_type, has_food, room_sharing, co_tenant_id, co_tenant_name, co_tenant_phone,
          co_tenant_email, rent_share_percentage, aadhaar_number, pan_number, documents_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        tenant.tenancyType || 'Residential',
        tenant.hasFood ? 1 : 0,
        tenant.roomSharing || 'Single',
        sb(tenant.coTenantId, null),
        sb(tenant.coTenantName, null),
        sb(tenant.coTenantPhone, null),
        sb(tenant.coTenantEmail, null),
        tenant.rentSharePercentage ?? 100,
        sb(tenant.aadhaarNumber, null),
        sb(tenant.panNumber, null),
        tenant.documents ? JSON.stringify(tenant.documents) : '[]',
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
      tenancyType?: TenancyType;
      hasFood?: boolean;
      roomSharing?: 'Single' | '2_Sharing' | '3_Sharing';
      coTenant?: {
        name: string;
        phone: string;
        email: string;
        rentSharePercentage?: number;
      };
      aadhaarNumber?: string;
      panNumber?: string;
      documents?: any[];
    }): Promise<{ 
      tenant: Tenant; 
      coTenant?: Tenant;
      property: Property | null; 
      invoice: RentInvoice; 
      coInvoice?: RentInvoice;
      ledgerEntry: LedgerEntry; 
      user: UserAccount 
    }> => {
      const tenantId = generateTenantId();
      const prop = await this.properties.findById(data.propertyId);
      const propName = prop ? prop.name : 'Staywise Residency';

      const isSharing = data.roomSharing === '2_Sharing' && Boolean(data.coTenant?.name);
      const coRentSharePct = isSharing ? (data.coTenant?.rentSharePercentage || 50) : 0;
      const primaryRentSharePct = isSharing ? (100 - coRentSharePct) : 100;

      const primaryMonthlyRent = isSharing 
        ? Math.round((data.monthlyRent * primaryRentSharePct) / 100) 
        : data.monthlyRent;
      const coMonthlyRent = isSharing 
        ? (data.monthlyRent - primaryMonthlyRent) 
        : 0;

      const primaryDeposit = isSharing 
        ? Math.round((data.deposit * primaryRentSharePct) / 100) 
        : data.deposit;
      const coDeposit = isSharing 
        ? (data.deposit - primaryDeposit) 
        : 0;

      // 1. Ensure Primary Tenant User Account
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

      const coTenantId = isSharing ? generateTenantId() : undefined;
      let coUser: UserAccount | null | undefined = undefined;

      // 1b. If Co-Tenant Sharing, Ensure Co-Tenant User Account
      if (isSharing && data.coTenant) {
        coUser = (await this.users.findByEmail(data.coTenant.email)) || undefined;
        if (!coUser) {
          coUser = await this.users.create({
            id: generateUserId('tenant'),
            email: data.coTenant.email,
            password: 'Tenant@123',
            name: data.coTenant.name,
            role: 'tenant',
            roleLabel: 'Tenant / Resident',
            avatar: '👩‍🎓',
            title: `Co-Resident • Apt ${data.unitNumber}`,
            description: `${propName} • Shared Room Lease Connected`,
            phone: data.coTenant.phone
          });
        }
      }

      // 2. Create Primary Tenant Record
      const newTenant: Tenant = {
        id: tenantId,
        userId: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        propertyId: data.propertyId,
        propertyName: propName,
        unitNumber: data.unitNumber,
        monthlyRent: primaryMonthlyRent,
        depositPaid: primaryDeposit,
        leaseStart: data.leaseStart,
        leaseEnd: data.leaseEnd,
        rentDueDate: data.rentDueDate || 5,
        autopayActive: true,
        reliabilityScore: 100,
        kycVerified: true,
        rewardsBalance: 500, // Onboarding welcome bonus
        emergencyContact: 'Family Primary Contact',
        tenancyType: data.tenancyType || 'Residential',
        hasFood: data.hasFood ?? false,
        roomSharing: data.roomSharing || 'Single',
        coTenantId: coTenantId,
        coTenantName: data.coTenant?.name,
        coTenantPhone: data.coTenant?.phone,
        coTenantEmail: data.coTenant?.email,
        rentSharePercentage: primaryRentSharePct,
        aadhaarNumber: data.aadhaarNumber,
        panNumber: data.panNumber,
        documents: data.documents || []
      };
      await this.tenants.create(newTenant);

      // 2b. Create Co-Tenant Record if Sharing
      let newCoTenant: Tenant | undefined = undefined;
      if (isSharing && data.coTenant && coTenantId && coUser) {
        newCoTenant = {
          id: coTenantId,
          userId: coUser.id,
          name: data.coTenant.name,
          email: data.coTenant.email,
          phone: data.coTenant.phone,
          propertyId: data.propertyId,
          propertyName: propName,
          unitNumber: data.unitNumber,
          monthlyRent: coMonthlyRent,
          depositPaid: coDeposit,
          leaseStart: data.leaseStart,
          leaseEnd: data.leaseEnd,
          rentDueDate: data.rentDueDate || 5,
          autopayActive: true,
          reliabilityScore: 100,
          kycVerified: true,
          rewardsBalance: 500,
          emergencyContact: `${data.name} (Roommate)`,
          tenancyType: data.tenancyType || 'Residential',
          hasFood: data.hasFood ?? false,
          roomSharing: '2_Sharing',
          coTenantId: tenantId,
          coTenantName: data.name,
          coTenantPhone: data.phone,
          coTenantEmail: data.email,
          rentSharePercentage: coRentSharePct,
          documents: []
        };
        await this.tenants.create(newCoTenant);
      }

      // 3. Update Property Unit & Metrics
      if (prop) {
        const occupantNames = isSharing && data.coTenant 
          ? `${data.name} & ${data.coTenant.name} (Sharing)` 
          : data.name;

        // Upsert or update unit
        const existingUnit = this.sqlite.prepare('SELECT id FROM property_units WHERE property_id = ? AND unit_number = ?').get(data.propertyId, data.unitNumber) as any;
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
          `).run(tenantId, occupantNames, data.monthlyRent, data.deposit, data.leaseEnd, existingUnit.id);
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
            isSharing ? 'Shared Residential Suite' : 'Standard Residential',
            data.monthlyRent,
            data.deposit,
            'OCCUPIED',
            tenantId,
            occupantNames,
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

      // 4. Generate Initial Rent Invoice for Primary Tenant
      const newInvoice: RentInvoice = {
        id: generateInvoiceId(),
        invoiceNumber: generateInvoiceNumber(),
        tenantId: tenantId,
        tenantName: data.name,
        propertyId: data.propertyId,
        propertyName: propName,
        unitNumber: data.unitNumber,
        period: 'October 2026',
        baseRent: primaryMonthlyRent,
        totalAmount: primaryMonthlyRent,
        paidAmount: 0,
        dueDate: `2026-10-${data.rentDueDate.toString().padStart(2, '0')}`,
        status: 'Due'
      };
      await this.invoices.create(newInvoice);

      // 4b. Generate Initial Rent Invoice for Co-Tenant if sharing
      let coInvoice: RentInvoice | undefined = undefined;
      if (isSharing && newCoTenant) {
        coInvoice = {
          id: generateInvoiceId(),
          invoiceNumber: generateInvoiceNumber(),
          tenantId: newCoTenant.id,
          tenantName: newCoTenant.name,
          propertyId: data.propertyId,
          propertyName: propName,
          unitNumber: data.unitNumber,
          period: 'October 2026',
          baseRent: coMonthlyRent,
          totalAmount: coMonthlyRent,
          paidAmount: 0,
          dueDate: `2026-10-${data.rentDueDate.toString().padStart(2, '0')}`,
          status: 'Due'
        };
        await this.invoices.create(coInvoice);
      }

      // 5. Statutory Deposit Entry in Ledger
      const ledgerEntry = await this.ledger.create({
        description: isSharing && data.coTenant
          ? `Security Deposit Onboarded (Dual Sharing) - Unit ${data.unitNumber} (${data.name} & ${data.coTenant.name})`
          : `Security Deposit Onboarded - Unit ${data.unitNumber} (${data.name})`,
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
        coTenant: newCoTenant,
        property: updatedProp,
        invoice: newInvoice,
        coInvoice,
        ledgerEntry,
        user
      };
    },

    update: async (id: string, updates: Partial<Tenant>): Promise<Tenant | null> => {
      const existing = await this.tenants.findById(id);
      if (!existing) return null;
      const merged = { ...existing, ...updates };
      this.sqlite.prepare(`
        UPDATE tenants SET
          name = ?, email = ?, phone = ?,
          monthly_rent = ?, deposit_paid = ?,
          lease_start = ?, lease_end = ?,
          rent_due_date = ?, salary_date = ?,
          autopay_active = ?, emergency_contact = ?
        WHERE id = ?
      `).run(
        merged.name,
        merged.email,
        merged.phone,
        merged.monthlyRent,
        merged.depositPaid,
        merged.leaseStart,
        merged.leaseEnd,
        merged.rentDueDate,
        sb(merged.salaryDate, null),
        merged.autopayActive ? 1 : 0,
        merged.emergencyContact,
        id
      );
      this.syncRootDb();
      return this.tenants.findById(id);
    }
  };

  // ==========================================
  // INVOICES & RENT PAYMENTS REPOSITORY
  // ==========================================
  public invoices = {
    findMany: async (filter?: { tenantId?: string; propertyId?: string; status?: string; limit?: number; offset?: number }): Promise<RentInvoice[]> => {
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
      if (filter?.status && filter.status !== 'ALL') {
        conditions.push('status = ?');
        params.push(filter.status);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      if (filter?.limit && filter.limit > 0) {
        const safeLimit = Math.min(100, filter.limit);
        query += ` LIMIT ${safeLimit}`;
        if (filter.offset && filter.offset > 0) {
          query += ` OFFSET ${filter.offset}`;
        }
      }

      const rows = this.sqlite.prepare(query).all(...params) as any[];
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
    findMany: async (filter?: { limit?: number; offset?: number; type?: 'DEBIT' | 'CREDIT'; referenceId?: string }): Promise<LedgerEntry[]> => {
      let query = 'SELECT * FROM ledger';
      const conditions: string[] = [];
      const params: any[] = [];

      if (filter?.type) {
        conditions.push('type = ?');
        params.push(filter.type);
      }
      if (filter?.referenceId) {
        conditions.push('reference_id = ?');
        params.push(filter.referenceId);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      if (filter?.limit && filter.limit > 0) {
        const safeLimit = Math.min(250, filter.limit);
        query += ` LIMIT ${safeLimit}`;
        if (filter.offset && filter.offset > 0) {
          query += ` OFFSET ${filter.offset}`;
        }
      }

      const rows = this.sqlite.prepare(query).all(...params) as any[];
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
    findMany: async (filter?: { propertyId?: string; status?: string; limit?: number; offset?: number }): Promise<MaintenanceTicket[]> => {
      let query = 'SELECT * FROM tickets';
      const conditions: string[] = [];
      const params: any[] = [];

      if (filter?.propertyId) {
        conditions.push('property_id = ?');
        params.push(filter.propertyId);
      }
      if (filter?.status && filter.status !== 'ALL') {
        conditions.push('status = ?');
        params.push(filter.status);
      }
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      query += ' ORDER BY created_at DESC';

      if (filter?.limit && filter.limit > 0) {
        const safeLimit = Math.min(100, filter.limit);
        query += ` LIMIT ${safeLimit}`;
        if (filter.offset && filter.offset > 0) {
          query += ` OFFSET ${filter.offset}`;
        }
      }

      const rows = this.sqlite.prepare(query).all(...params) as any[];
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
      const status = ticket.status || 'Reported';
      const priority = ticket.priority || 'Medium';
      const category = ticket.category || 'General';
      const title = ticket.title || 'Maintenance Request';
      const description = ticket.description || '';
      const propertyId = ticket.propertyId || '';
      const propertyName = ticket.propertyName || '';
      const unitNumber = ticket.unitNumber || '';
      const tenantName = ticket.tenantName || 'Resident';

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
        propertyId,
        propertyName,
        unitNumber,
        tenantName,
        category,
        title,
        description,
        priority,
        status,
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

      if (userId) {
        const found = all.find(s => s.userId === userId);
        if (found) return found;
      }
      return all.find(s => s.userId === 'user-owner-vikram') || all[0] || null;
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

  // ==========================================
  // PLATFORM & USER SETTINGS REPOSITORY
  // ==========================================
  public settings = {
    getForUser: async (userId: string) => {
      const row = this.sqlite.prepare('SELECT * FROM platform_settings WHERE user_id = ? LIMIT 1').get(userId) as any;
      if (!row) return null;
      return {
        userId: row.user_id,
        entityName: row.entity_name || '',
        ownerName: row.owner_name || '',
        panNumber: row.pan_number || '',
        gstin: row.gstin || '',
        bankAccount: row.bank_account || '',
        ifsc: row.ifsc || '',
        bankName: row.bank_name || '',
        upiId: row.upi_id || '',
        autoSweepCadence: row.auto_sweep_cadence || 'Daily at 18:00 IST',
        rentDueDay: row.rent_due_day ?? 5,
        gracePeriodDays: row.grace_period_days ?? 3,
        lateFeeFixed: row.late_fee_fixed ?? 500,
        lateFeeDailyRate: row.late_fee_daily_rate ?? 50,
        autoWhatsAppReminder: Boolean(row.auto_whatsapp_reminder),
        allowPartialPayments: Boolean(row.allow_partial_payments),
        ksebTariffPerUnit: row.kseb_tariff_per_unit ?? 9.5,
        dgBackupRatePerUnit: row.dg_backup_rate_per_unit ?? 24.0,
        meterReadingCycle: row.meter_reading_cycle || '1st to 5th of every month',
        commonAreaPowerRatio: row.common_area_power_ratio ?? 10,
        preferences: JSON.parse(row.preferences_json || '{}'),
        updatedAt: row.updated_at
      };
    },
    save: async (data: {
      userId: string;
      entityName?: string;
      ownerName?: string;
      panNumber?: string;
      gstin?: string;
      bankAccount?: string;
      ifsc?: string;
      bankName?: string;
      upiId?: string;
      autoSweepCadence?: string;
      rentDueDay?: number;
      gracePeriodDays?: number;
      lateFeeFixed?: number;
      lateFeeDailyRate?: number;
      autoWhatsAppReminder?: boolean;
      allowPartialPayments?: boolean;
      ksebTariffPerUnit?: number;
      dgBackupRatePerUnit?: number;
      meterReadingCycle?: string;
      commonAreaPowerRatio?: number;
      preferences?: Record<string, any>;
    }) => {
      const now = new Date().toISOString();
      const existing = await this.settings.getForUser(data.userId);
      const merged = {
        entityName: data.entityName ?? existing?.entityName ?? '',
        ownerName: data.ownerName ?? existing?.ownerName ?? '',
        panNumber: data.panNumber ?? existing?.panNumber ?? '',
        gstin: data.gstin ?? existing?.gstin ?? '',
        bankAccount: data.bankAccount ?? existing?.bankAccount ?? '',
        ifsc: data.ifsc ?? existing?.ifsc ?? '',
        bankName: data.bankName ?? existing?.bankName ?? '',
        upiId: data.upiId ?? existing?.upiId ?? '',
        autoSweepCadence: data.autoSweepCadence ?? existing?.autoSweepCadence ?? 'Daily at 18:00 IST',
        rentDueDay: data.rentDueDay ?? existing?.rentDueDay ?? 5,
        gracePeriodDays: data.gracePeriodDays ?? existing?.gracePeriodDays ?? 3,
        lateFeeFixed: data.lateFeeFixed ?? existing?.lateFeeFixed ?? 500,
        lateFeeDailyRate: data.lateFeeDailyRate ?? existing?.lateFeeDailyRate ?? 50,
        autoWhatsAppReminder: data.autoWhatsAppReminder ?? existing?.autoWhatsAppReminder ?? true,
        allowPartialPayments: data.allowPartialPayments ?? existing?.allowPartialPayments ?? false,
        ksebTariffPerUnit: data.ksebTariffPerUnit ?? existing?.ksebTariffPerUnit ?? 9.5,
        dgBackupRatePerUnit: data.dgBackupRatePerUnit ?? existing?.dgBackupRatePerUnit ?? 24.0,
        meterReadingCycle: data.meterReadingCycle ?? existing?.meterReadingCycle ?? '1st to 5th of every month',
        commonAreaPowerRatio: data.commonAreaPowerRatio ?? existing?.commonAreaPowerRatio ?? 10,
        preferences: data.preferences ?? existing?.preferences ?? {}
      };

      this.sqlite.prepare(`
        INSERT OR REPLACE INTO platform_settings (
          user_id, entity_name, owner_name, pan_number, gstin,
          bank_account, ifsc, bank_name, upi_id, auto_sweep_cadence,
          rent_due_day, grace_period_days, late_fee_fixed, late_fee_daily_rate,
          auto_whatsapp_reminder, allow_partial_payments,
          kseb_tariff_per_unit, dg_backup_rate_per_unit, meter_reading_cycle,
          common_area_power_ratio, preferences_json, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.userId,
        merged.entityName,
        merged.ownerName,
        merged.panNumber,
        merged.gstin,
        merged.bankAccount,
        merged.ifsc,
        merged.bankName,
        merged.upiId,
        merged.autoSweepCadence,
        merged.rentDueDay,
        merged.gracePeriodDays,
        merged.lateFeeFixed,
        merged.lateFeeDailyRate,
        merged.autoWhatsAppReminder ? 1 : 0,
        merged.allowPartialPayments ? 1 : 0,
        merged.ksebTariffPerUnit,
        merged.dgBackupRatePerUnit,
        merged.meterReadingCycle,
        merged.commonAreaPowerRatio,
        JSON.stringify(merged.preferences),
        now
      );
      this.syncRootDb();
      return this.settings.getForUser(data.userId);
    }
  };

  // ==========================================
  // TENANT CONNECTION REQUESTS & LIFECYCLE
  // ==========================================
  public tenantConnections = {
    findMany: async (): Promise<TenantConnectionRequest[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM tenant_connection_requests ORDER BY created_at DESC').all() as any[];
      return rows.map(r => ({
        id: r.id,
        tenantUserId: r.tenant_user_id,
        tenantName: r.tenant_name,
        tenantEmail: r.tenant_email,
        tenantPhone: r.tenant_phone,
        ownerId: r.owner_id || undefined,
        ownerCode: r.owner_code || undefined,
        ownerEmail: r.owner_email || undefined,
        ownerPhone: r.owner_phone || undefined,
        propertyId: r.property_id || undefined,
        propertyName: r.property_name || undefined,
        unitNumber: r.unit_number,
        monthlyRent: r.monthly_rent,
        depositAmount: r.deposit_amount,
        leaseStartDate: r.lease_start_date,
        status: r.status as any,
        createdAt: r.created_at,
        moveOutDate: r.move_out_date || undefined,
        moveOutReason: r.move_out_reason || undefined,
        inspectionNotes: r.inspection_notes || undefined,
        depositSettledAmount: r.deposit_settled_amount || undefined,
        tenancyType: (r.tenancy_type as any) || 'PG',
        includeFoodPlan: Boolean(r.include_food_plan),
        aadhaarNumber: r.aadhaar_number || undefined,
        panNumber: r.pan_number || undefined,
        ekycVerified: Boolean(r.ekyc_verified),
        documents: r.documents_json ? (typeof r.documents_json === 'string' ? JSON.parse(r.documents_json) : r.documents_json) : [],
        agreementUrl: r.agreement_url || undefined,
        coTenantName: r.co_tenant_name || undefined,
        coTenantPhone: r.co_tenant_phone || undefined,
        coTenantEmail: r.co_tenant_email || undefined
      }));
    },

    create: async (req: TenantConnectionRequest): Promise<TenantConnectionRequest> => {
      this.sqlite.prepare(`
        INSERT OR REPLACE INTO tenant_connection_requests (
          id, tenant_user_id, tenant_name, tenant_email, tenant_phone,
          owner_id, owner_code, owner_email, owner_phone, property_id, property_name,
          unit_number, monthly_rent, deposit_amount, lease_start_date, status,
          tenancy_type, include_food_plan, aadhaar_number, pan_number, ekyc_verified,
          documents_json, agreement_url, co_tenant_name, co_tenant_phone, co_tenant_email,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.id,
        req.tenantUserId,
        req.tenantName,
        req.tenantEmail,
        req.tenantPhone,
        sb(req.ownerId, null),
        sb(req.ownerCode, null),
        sb(req.ownerEmail, null),
        sb(req.ownerPhone, null),
        sb(req.propertyId, null),
        sb(req.propertyName, null),
        req.unitNumber,
        req.monthlyRent,
        req.depositAmount,
        req.leaseStartDate,
        req.status || 'PENDING_APPROVAL',
        req.tenancyType || 'PG',
        req.includeFoodPlan !== false ? 1 : 0,
        sb(req.aadhaarNumber, null),
        sb(req.panNumber, null),
        req.ekycVerified !== false ? 1 : 0,
        req.documents ? JSON.stringify(req.documents) : '[]',
        sb(req.agreementUrl, null),
        sb(req.coTenantName, null),
        sb(req.coTenantPhone, null),
        sb(req.coTenantEmail, null),
        req.createdAt || new Date().toISOString()
      );
      this.syncRootDb();
      return req;
    },

    updateStatus: async (id: string, status: string, extra?: any): Promise<boolean> => {
      if (extra?.moveOutDate) {
        this.sqlite.prepare(`
          UPDATE tenant_connection_requests SET
            status = ?, move_out_date = ?, move_out_reason = ?
          WHERE id = ?
        `).run(status, extra.moveOutDate, extra.moveOutReason || '', id);
      } else if (extra?.depositSettledAmount !== undefined) {
        this.sqlite.prepare(`
          UPDATE tenant_connection_requests SET
            status = ?, inspection_notes = ?, deposit_settled_amount = ?
          WHERE id = ?
        `).run(status, extra.inspectionNotes || '', extra.depositSettledAmount, id);
      } else {
        this.sqlite.prepare(`UPDATE tenant_connection_requests SET status = ? WHERE id = ?`).run(status, id);
      }
      this.syncRootDb();
      return true;
    }
  };

  // ==========================================
  // STAYWISE REWARDS (WISEPOINTS) REPOSITORY
  // ==========================================
  public rewards = {
    getAccount: async (userId: string): Promise<RewardsAccount> => {
      const row = this.sqlite.prepare('SELECT * FROM rewards_accounts WHERE user_id = ?').get(userId) as any;
      if (row) {
        return {
          userId: row.user_id,
          userName: row.user_name || undefined,
          userRole: row.user_role as UserRole,
          totalEarned: Number(row.total_earned || 0),
          totalRedeemed: Number(row.total_redeemed || 0),
          currentBalance: Number(row.current_balance || 0),
          pendingPoints: Number(row.pending_points || 0),
          currentStreak: Number(row.current_streak || 0),
          tier: (row.tier || 'SILVER') as any,
          updatedAt: row.updated_at
        };
      }

      // Automatically initialize account if user exists
      const user = await this.users.findById(userId);
      const now = new Date().toISOString();
      const initialTier = 'SILVER';
      this.sqlite.prepare(`
        INSERT INTO rewards_accounts (user_id, user_name, user_role, total_earned, total_redeemed, current_balance, pending_points, current_streak, tier, updated_at)
        VALUES (?, ?, ?, 0, 0, 0, 0, 0, ?, ?)
      `).run(userId, user?.name || 'Resident', user?.role || 'tenant', initialTier, now);
      this.syncRootDb();

      return {
        userId,
        userName: user?.name,
        userRole: user?.role,
        totalEarned: 0,
        totalRedeemed: 0,
        currentBalance: 0,
        pendingPoints: 0,
        currentStreak: 0,
        tier: 'SILVER',
        updatedAt: now
      };
    },

    getLedger: async (userId?: string): Promise<RewardsLedgerEntry[]> => {
      const query = userId
        ? 'SELECT * FROM rewards_ledger WHERE user_id = ? ORDER BY created_at DESC'
        : 'SELECT * FROM rewards_ledger ORDER BY created_at DESC';
      const rows = (userId ? this.sqlite.prepare(query).all(userId) : this.sqlite.prepare(query).all()) as any[];
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        actionType: r.action_type,
        points: Number(r.points),
        pointsType: r.points_type,
        referenceId: r.reference_id || undefined,
        referenceType: r.reference_type || undefined,
        description: r.description,
        financialCost: Number(r.financial_cost || 0),
        createdAt: r.created_at
      }));
    },

    getRules: async (): Promise<RewardRule[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM reward_rules WHERE is_active = 1').all() as any[];
      return rows.map(r => ({
        id: r.id,
        ruleCode: r.rule_code,
        name: r.name,
        description: r.description,
        pointsAwarded: Number(r.points_awarded),
        isActive: Boolean(r.is_active),
        category: r.category,
        monthlyCap: Number(r.monthly_cap || 1000),
        partnerFunded: Boolean(r.partner_funded)
      }));
    },

    getOffers: async (): Promise<MerchantOffer[]> => {
      const rows = this.sqlite.prepare('SELECT * FROM merchant_offers WHERE is_active = 1').all() as any[];
      return rows.map(r => ({
        id: r.id,
        partnerName: r.partner_name,
        category: r.category,
        offerTitle: r.offer_title,
        discountDescription: r.discount_description,
        pointsRequired: Number(r.points_required),
        voucherCode: r.voucher_code,
        imageUrl: r.image_url || undefined,
        terms: r.terms,
        isActive: Boolean(r.is_active),
        expiryDate: r.expiry_date || undefined
      }));
    },

    awardPoints: async (params: {
      userId: string;
      actionType: RewardActionType;
      points: number;
      referenceId?: string;
      referenceType?: 'INVOICE' | 'INSPECTION' | 'LEASE' | 'REFERRAL' | 'VOUCHER' | 'CLAIM';
      description: string;
      financialCost?: number;
    }): Promise<{ success: boolean; newBalance: number; entry: RewardsLedgerEntry }> => {
      const account = await this.rewards.getAccount(params.userId);
      const points = Math.max(0, Math.floor(params.points));
      const newTotal = account.totalEarned + points;
      const newBalance = account.currentBalance + points;
      const isRentPayment = params.actionType === 'RENT_PAID_ON_TIME';
      const newStreak = isRentPayment ? account.currentStreak + 1 : account.currentStreak;
      
      let newTier = account.tier;
      if (newBalance >= 1500) newTier = 'PLATINUM';
      else if (newBalance >= 500) newTier = 'GOLD';

      const now = new Date().toISOString();
      const entryId = generateRewardEntryId();
      const financialCost = params.financialCost ?? (points * 0.1); // Default ₹0.10 per point cost

      this.sqlite.prepare(`
        UPDATE rewards_accounts SET
          total_earned = ?, current_balance = ?, current_streak = ?, tier = ?, updated_at = ?
        WHERE user_id = ?
      `).run(newTotal, newBalance, newStreak, newTier, now, params.userId);

      this.sqlite.prepare(`
        INSERT INTO rewards_ledger (id, user_id, action_type, points, points_type, reference_id, reference_type, description, financial_cost, created_at)
        VALUES (?, ?, ?, ?, 'EARNED', ?, ?, ?, ?, ?)
      `).run(
        entryId, params.userId, params.actionType, points,
        sb(params.referenceId), sb(params.referenceType), params.description, financialCost, now
      );

      this.syncRootDb();

      return {
        success: true,
        newBalance,
        entry: {
          id: entryId,
          userId: params.userId,
          actionType: params.actionType,
          points,
          pointsType: 'EARNED',
          referenceId: params.referenceId,
          referenceType: params.referenceType,
          description: params.description,
          financialCost,
          createdAt: now
        }
      };
    },

    redeemPoints: async (params: {
      userId: string;
      actionType: RewardActionType;
      points: number;
      referenceId?: string;
      referenceType?: 'INVOICE' | 'INSPECTION' | 'LEASE' | 'REFERRAL' | 'VOUCHER' | 'CLAIM';
      description: string;
      financialCost?: number;
    }): Promise<{ success: boolean; newBalance: number; entry: RewardsLedgerEntry; error?: string }> => {
      const account = await this.rewards.getAccount(params.userId);
      const points = Math.max(0, Math.floor(params.points));

      if (account.currentBalance < points) {
        return {
          success: false,
          newBalance: account.currentBalance,
          entry: null as any,
          error: `Insufficient WisePoints balance. Required: ${points}, Available: ${account.currentBalance}`
        };
      }

      const newRedeemed = account.totalRedeemed + points;
      const newBalance = account.currentBalance - points;
      const now = new Date().toISOString();
      const entryId = generateRewardEntryId();
      const financialCost = params.financialCost ?? (points * 0.1);

      this.sqlite.prepare(`
        UPDATE rewards_accounts SET
          total_redeemed = ?, current_balance = ?, updated_at = ?
        WHERE user_id = ?
      `).run(newRedeemed, newBalance, now, params.userId);

      this.sqlite.prepare(`
        INSERT INTO rewards_ledger (id, user_id, action_type, points, points_type, reference_id, reference_type, description, financial_cost, created_at)
        VALUES (?, ?, ?, ?, 'REDEEMED', ?, ?, ?, ?, ?)
      `).run(
        entryId, params.userId, params.actionType, -points,
        sb(params.referenceId), sb(params.referenceType), params.description, financialCost, now
      );

      this.syncRootDb();

      return {
        success: true,
        newBalance,
        entry: {
          id: entryId,
          userId: params.userId,
          actionType: params.actionType,
          points: -points,
          pointsType: 'REDEEMED',
          referenceId: params.referenceId,
          referenceType: params.referenceType,
          description: params.description,
          financialCost,
          createdAt: now
        }
      };
    }
  };

  // ==========================================
  // STAYWISE DEPOSIT PROTECT REPOSITORY
  // ==========================================
  public depositProtect = {
    getApplications: async (filter?: { tenantId?: string; ownerId?: string }): Promise<DepositProtectionApplication[]> => {
      let query = 'SELECT * FROM deposit_protection_applications';
      const params: any[] = [];
      if (filter?.tenantId && filter?.ownerId) {
        query += ' WHERE tenant_id = ? OR owner_id = ?';
        params.push(filter.tenantId, filter.ownerId);
      } else if (filter?.tenantId) {
        query += ' WHERE tenant_id = ?';
        params.push(filter.tenantId);
      } else if (filter?.ownerId) {
        query += ' WHERE owner_id = ?';
        params.push(filter.ownerId);
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params) as any[];
      return rows.map(r => ({
        id: r.id,
        tenantId: r.tenant_id,
        tenantName: r.tenant_name,
        tenantEmail: r.tenant_email || undefined,
        tenantPhone: r.tenant_phone || undefined,
        ownerId: r.owner_id,
        ownerName: r.owner_name || undefined,
        propertyId: r.property_id,
        propertyName: r.property_name,
        unitNumber: r.unit_number,
        monthlyRent: Number(r.monthly_rent),
        traditionalDepositAmount: Number(r.traditional_deposit_amount),
        monthlyFee: Number(r.monthly_fee),
        coverageLimit: Number(r.coverage_limit),
        riskScore: Number(r.risk_score || 85),
        eligibilityStatus: r.eligibility_status,
        status: r.status,
        disclosuresAccepted: Boolean(r.disclosures_accepted),
        partnerProvider: r.partner_provider,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));
    },

    createApplication: async (app: DepositProtectionApplication): Promise<DepositProtectionApplication> => {
      this.sqlite.prepare(`
        INSERT INTO deposit_protection_applications (
          id, tenant_id, tenant_name, tenant_email, tenant_phone,
          owner_id, owner_name, property_id, property_name, unit_number,
          monthly_rent, traditional_deposit_amount, monthly_fee, coverage_limit,
          risk_score, eligibility_status, status, disclosures_accepted, partner_provider,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        app.id, app.tenantId, app.tenantName, sb(app.tenantEmail), sb(app.tenantPhone),
        app.ownerId, sb(app.ownerName), app.propertyId, app.propertyName, app.unitNumber,
        app.monthlyRent, app.traditionalDepositAmount, app.monthlyFee, app.coverageLimit,
        app.riskScore, app.eligibilityStatus, app.status, app.disclosuresAccepted ? 1 : 0, app.partnerProvider,
        app.createdAt, app.updatedAt
      );
      this.syncRootDb();
      return app;
    },

    updateApplicationStatus: async (id: string, status: ProtectionApplicationStatus): Promise<boolean> => {
      const now = new Date().toISOString();
      this.sqlite.prepare(`
        UPDATE deposit_protection_applications SET status = ?, updated_at = ? WHERE id = ?
      `).run(status, now, id);
      this.syncRootDb();
      return true;
    },

    getContracts: async (filter?: { tenantId?: string; ownerId?: string }): Promise<ProtectionContract[]> => {
      let query = 'SELECT * FROM protection_contracts';
      const params: any[] = [];
      if (filter?.tenantId && filter?.ownerId) {
        query += ' WHERE tenant_id = ? OR owner_id = ?';
        params.push(filter.tenantId, filter.ownerId);
      } else if (filter?.tenantId) {
        query += ' WHERE tenant_id = ?';
        params.push(filter.tenantId);
      } else if (filter?.ownerId) {
        query += ' WHERE owner_id = ?';
        params.push(filter.ownerId);
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params) as any[];
      return rows.map(r => {
        let coveredRisks: string[] = [];
        let exclusions: string[] = [];
        try { coveredRisks = JSON.parse(r.covered_risks_json || '[]'); } catch (e) {}
        try { exclusions = JSON.parse(r.exclusions_json || '[]'); } catch (e) {}
        return {
          id: r.id,
          applicationId: r.application_id,
          policyNumber: r.policy_number,
          tenantId: r.tenant_id,
          tenantName: r.tenant_name,
          ownerId: r.owner_id,
          ownerName: r.owner_name,
          propertyId: r.property_id,
          propertyName: r.property_name,
          unitNumber: r.unit_number,
          coverageLimit: Number(r.coverage_limit),
          monthlyFee: Number(r.monthly_fee),
          startDate: r.start_date,
          endDate: r.end_date,
          status: r.status,
          partnerName: r.partner_name,
          certificateUrl: r.certificate_url || undefined,
          coveredRisks,
          exclusions,
          createdAt: r.created_at
        };
      });
    },

    createContract: async (contract: ProtectionContract): Promise<ProtectionContract> => {
      this.sqlite.prepare(`
        INSERT INTO protection_contracts (
          id, application_id, policy_number, tenant_id, tenant_name,
          owner_id, owner_name, property_id, property_name, unit_number,
          coverage_limit, monthly_fee, start_date, end_date, status,
          partner_name, certificate_url, covered_risks_json, exclusions_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        contract.id, contract.applicationId, contract.policyNumber, contract.tenantId, contract.tenantName,
        contract.ownerId, contract.ownerName, contract.propertyId, contract.propertyName, contract.unitNumber,
        contract.coverageLimit, contract.monthlyFee, contract.startDate, contract.endDate, contract.status,
        contract.partnerName, sb(contract.certificateUrl), JSON.stringify(contract.coveredRisks), JSON.stringify(contract.exclusions), contract.createdAt
      );
      this.syncRootDb();
      return contract;
    },

    getConditionReports: async (filter?: { propertyId?: string; tenantId?: string }): Promise<PropertyConditionReport[]> => {
      let query = 'SELECT * FROM property_condition_reports';
      const params: any[] = [];
      if (filter?.propertyId && filter?.tenantId) {
        query += ' WHERE property_id = ? OR tenant_id = ?';
        params.push(filter.propertyId, filter.tenantId);
      } else if (filter?.propertyId) {
        query += ' WHERE property_id = ?';
        params.push(filter.propertyId);
      } else if (filter?.tenantId) {
        query += ' WHERE tenant_id = ?';
        params.push(filter.tenantId);
      }
      query += ' ORDER BY inspection_date DESC';

      const rows = this.sqlite.prepare(query).all(...params) as any[];
      return rows.map(r => {
        let items: any[] = [];
        let photos: string[] = [];
        try { items = JSON.parse(r.items_json || '[]'); } catch (e) {}
        try { photos = JSON.parse(r.photos_json || '[]'); } catch (e) {}
        return {
          id: r.id,
          contractId: r.contract_id || undefined,
          propertyId: r.property_id,
          propertyName: r.property_name,
          unitNumber: r.unit_number,
          tenantId: r.tenant_id,
          tenantName: r.tenant_name,
          reportType: r.report_type,
          inspectionDate: r.inspection_date,
          overallCondition: r.overall_condition,
          items,
          photos,
          notes: r.notes,
          verifiedBy: r.verified_by,
          status: r.status,
          createdAt: r.created_at
        };
      });
    },

    createConditionReport: async (report: PropertyConditionReport): Promise<PropertyConditionReport> => {
      this.sqlite.prepare(`
        INSERT INTO property_condition_reports (
          id, contract_id, property_id, property_name, unit_number,
          tenant_id, tenant_name, report_type, inspection_date, overall_condition,
          items_json, photos_json, notes, verified_by, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        report.id, sb(report.contractId), report.propertyId, report.propertyName, report.unitNumber,
        report.tenantId, report.tenantName, report.reportType, report.inspectionDate, report.overallCondition,
        JSON.stringify(report.items), JSON.stringify(report.photos), report.notes, report.verifiedBy, report.status, report.createdAt
      );
      this.syncRootDb();
      return report;
    },

    getClaims: async (filter?: { ownerId?: string; tenantId?: string }): Promise<ProtectionClaim[]> => {
      let query = 'SELECT * FROM protection_claims';
      const params: any[] = [];
      if (filter?.ownerId && filter?.tenantId) {
        query += ' WHERE owner_id = ? OR tenant_id = ?';
        params.push(filter.ownerId, filter.tenantId);
      } else if (filter?.ownerId) {
        query += ' WHERE owner_id = ?';
        params.push(filter.ownerId);
      } else if (filter?.tenantId) {
        query += ' WHERE tenant_id = ?';
        params.push(filter.tenantId);
      }
      query += ' ORDER BY created_at DESC';

      const rows = this.sqlite.prepare(query).all(...params) as any[];
      return rows.map(r => {
        let evidenceUrls: string[] = [];
        try { evidenceUrls = JSON.parse(r.evidence_urls_json || '[]'); } catch (e) {}
        return {
          id: r.id,
          contractId: r.contract_id,
          policyNumber: r.policy_number,
          propertyId: r.property_id,
          propertyName: r.property_name,
          unitNumber: r.unit_number,
          ownerId: r.owner_id,
          ownerName: r.owner_name,
          tenantId: r.tenant_id,
          tenantName: r.tenant_name,
          claimType: r.claim_type,
          claimedAmount: Number(r.claimed_amount),
          approvedAmount: r.approved_amount !== null ? Number(r.approved_amount) : undefined,
          deductible: Number(r.deductible || 0),
          description: r.description,
          evidenceUrls,
          status: r.status,
          disputeReason: r.dispute_reason || undefined,
          settlementDate: r.settlement_date || undefined,
          settlementTxnId: r.settlement_txn_id || undefined,
          createdAt: r.created_at
        };
      });
    },

    createClaim: async (claim: ProtectionClaim): Promise<ProtectionClaim> => {
      this.sqlite.prepare(`
        INSERT INTO protection_claims (
          id, contract_id, policy_number, property_id, property_name, unit_number,
          owner_id, owner_name, tenant_id, tenant_name, claim_type,
          claimed_amount, approved_amount, deductible, description, evidence_urls_json,
          status, dispute_reason, settlement_date, settlement_txn_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        claim.id, claim.contractId, claim.policyNumber, claim.propertyId, claim.propertyName, claim.unitNumber,
        claim.ownerId, claim.ownerName, claim.tenantId, claim.tenantName, claim.claimType,
        claim.claimedAmount, sb(claim.approvedAmount), claim.deductible || 0, claim.description,
        JSON.stringify(claim.evidenceUrls), claim.status, sb(claim.disputeReason), sb(claim.settlementDate), sb(claim.settlementTxnId), claim.createdAt
      );
      this.syncRootDb();
      return claim;
    },

    updateClaimStatus: async (
      id: string,
      status: ClaimStatus,
      extra?: { approvedAmount?: number; disputeReason?: string; settlementDate?: string; settlementTxnId?: string }
    ): Promise<boolean> => {
      const existing = this.sqlite.prepare('SELECT * FROM protection_claims WHERE id = ?').get(id) as any;
      if (!existing) return false;

      const approvedAmount = extra?.approvedAmount !== undefined ? extra.approvedAmount : existing.approved_amount;
      const disputeReason = extra?.disputeReason !== undefined ? extra.disputeReason : existing.dispute_reason;
      const settlementDate = extra?.settlementDate !== undefined ? extra.settlementDate : existing.settlement_date;
      const settlementTxnId = extra?.settlementTxnId !== undefined ? extra.settlementTxnId : existing.settlement_txn_id;

      this.sqlite.prepare(`
        UPDATE protection_claims SET
          status = ?, approved_amount = ?, dispute_reason = ?, settlement_date = ?, settlement_txn_id = ?
        WHERE id = ?
      `).run(status, approvedAmount, disputeReason, settlementDate, settlementTxnId, id);

      this.syncRootDb();
      return true;
    }
  };
}


// Global Singleton Instance across Next.js API Routes & Server Actions
const globalForDb = global as unknown as { staywiseDbInstance?: DatabaseEngine };

export const db = new DatabaseEngine();
globalForDb.staywiseDbInstance = db;

export default db;
