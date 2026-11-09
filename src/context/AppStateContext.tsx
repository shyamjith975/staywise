'use client';

/**
 * ============================================================================
 * STAYWISE PLATFORM — CENTRALIZED STATE MANAGEMENT & BUSINESS LOGIC ENGINE
 * ============================================================================
 * This React Context acts as the unified state container for the application.
 * It simulates a full-stack real-time backend with:
 * 
 * 1. Role-Based Auth & Session Switching (Owner, Tenant, Manager, Admin, etc.)
 * 2. Property Lifecycle: Adding properties sets them to 'PENDING' verification,
 *    which must be audited and approved by the Super Admin.
 * 3. RentFlow Financial Settlement: Handles payments, sub-meter split calculations,
 *    and immutable double-entry ledger bookkeeping.
 * 4. Influencer Engine: Code generation, affiliate commission rates, and conversion tracking.
 * 
 * BACKEND INTEGRATION NOTE:
 * To migrate to a real API/database (e.g. Supabase, PostgreSQL, REST/GraphQL):
 * - Replace the useState calls with React Query, SWR, or direct fetch calls.
 * - Replace array mutations (e.g. setProperties) with API POST/PATCH endpoints.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../lib/db/database';
import { 
  generatePropertyId, 
  generateTenantId, 
  generateInvoiceId, 
  generateInvoiceNumber, 
  generateLedgerId, 
  generateTicketId, 
  generateTicketNumber 
} from '../lib/utils/uniqueId';
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
  PGBedStatus,
  PGRoom,
  PGMealPlan,
  CommercialUnit,
  CAMExpenseItem,
  CommercialVisitor,
  MoveFlowChecklistItem,
  DepositSettlementDispute,
  TenantReferralItem,
  MoneyLeakAlert,
  VacancyCostReport,
  PropertyPassportData,
  TenantPassportData,
  InfluencerOffer,
  OwnerSubscription,
  SubscriptionTierId,
  TrialSignupPayload,
  TenantConnectionRequest,
  AuthorizedDelegate,
  FoodMenuItem,
  TenancyType,
  RewardsAccount,
  RewardsLedgerEntry,
  RewardRule,
  MerchantOffer,
  RewardActionType,
  DepositProtectionApplication,
  ProtectionContract,
  PropertyConditionReport,
  ProtectionClaim
} from '../types';
// Standalone typed defaults (Zero mockData dependency)
const DEFAULT_PROPERTY_PASSPORT: PropertyPassportData = {
  passportId: 'PASSPORT-PROP-BR-8921',
  propertyId: 'prop-beach-road',
  propertyName: 'Beach Road Apartments',
  digitalIdentityNumber: 'IN-KL-KZK-2024-REG-00918',
  establishedYear: 2021,
  ownershipType: 'Clear Freehold Title (Verified)',
  complianceCertificates: ['Fire NOC 2026', 'Structural Safety Audit', 'Lift License (Otis)', 'Pollution Control Consent'],
  maintenanceLogCount: 47,
  lifetimeOccupancyRate: 94.6,
  historicalRoi: 8.8
};

const DEFAULT_TENANT_PASSPORT: TenantPassportData = {
  passportId: 'PASSPORT-TEN-SS-9901',
  tenantName: 'Shyam Sundar',
  verifiedKyc: true,
  trustScore: 98,
  onTimePaymentPercent: 100,
  stayHistoryCount: 3,
  referenceRating: 4.9,
  reusableIdentityCard: 'VERIFIED-RESIDENT-GOLD'
};

const DEFAULT_MONEY_LEAKS: MoneyLeakAlert[] = [
  {
    id: 'leak-1',
    title: 'High Vacancy Duration on Unit 304',
    assetName: 'Beach Road Apartments #304',
    leakCategory: 'High Vacancy',
    estimatedLoss: 18200,
    recommendation: 'Unit vacant for 21 days. Market demand in Kozhikode Beach Road is high; consider reducing asking price by ₹1,500.',
    severity: 'High'
  },
  {
    id: 'leak-2',
    title: 'Under-Recovered CAM Charges in Tech Wing',
    assetName: 'Infovision Commercial Hub',
    leakCategory: 'Under-recovered CAM',
    estimatedLoss: 14200,
    recommendation: 'Actual common electricity & DG fuel exceeded CAM billed by 12%. Apply revised ₹20/sq.ft CAM adjustment clause.',
    severity: 'Medium'
  }
];

const DEFAULT_VACANCY_COSTS: VacancyCostReport[] = [
  { id: 'vac-1', unitOrBed: 'Unit 304 (2 BHK Sea View)', assetName: 'Beach Road Apartments', assetCategory: 'residential', daysVacant: 21, monthlyRent: 26000, estimatedLostRent: 18200, actionStatus: 'Lead Matched' },
  { id: 'vac-2', unitOrBed: 'Bed R201-C (Quad Dorm)', assetName: 'Staywise Urban PG', assetCategory: 'shared_living', daysVacant: 12, monthlyRent: 8000, estimatedLostRent: 3200, actionStatus: 'Marketed' }
];

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'RENT' | 'MAINTENANCE' | 'LEAD' | 'SYSTEM';
}

export const DEMO_NOTIFICATIONS: NotificationItem[] = [];

export interface DemoCredential {
  id?: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  pass: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  twoFactorEnabled?: boolean;
}

export const DEMO_CREDENTIALS: Record<UserRole, DemoCredential> = {
  owner: {
    id: 'user-owner-vikram',
    role: 'owner',
    roleLabel: 'Property Owner',
    email: 'owner@staywise.com',
    pass: 'Owner@123',
    name: 'Vikram Singhania',
    avatar: '👨‍💼',
    title: 'Asset Portfolio Owner',
    description: '3 Portfolios • 21 Units • Escrow Account Active',
    twoFactorEnabled: false
  },
  tenant: {
    id: 'user-tenant-shyam',
    role: 'tenant',
    roleLabel: 'Tenant / Resident',
    email: 'tenant@staywise.com',
    pass: 'Tenant@123',
    name: 'Shyam Sundar',
    avatar: '👨‍🎓',
    title: 'Resident • Apt 302',
    description: 'Beach Road Apartments • Lease Active'
  },
  manager: {
    id: 'user-manager-arjun',
    role: 'manager',
    roleLabel: 'Property Manager',
    email: 'manager@staywise.com',
    pass: 'Manager@123',
    name: 'Arjun Das',
    avatar: '🧑‍💻',
    title: 'Operations & Field Manager',
    description: 'Triage Queue • 12 Visits • 4 Portfolios'
  },
  vendor: {
    id: 'user-vendor-hvac',
    role: 'vendor',
    roleLabel: 'Service Vendor',
    email: 'vendor@staywise.com',
    pass: 'Vendor@123',
    name: 'RapidCool HVAC',
    avatar: '🔧',
    title: 'Certified HVAC Contractor',
    description: '5 Jobs Today • Escrow Payouts Pending'
  },
  admin: {
    id: 'user-admin-chief',
    role: 'admin',
    roleLabel: 'Super Admin',
    email: 'admin@staywise.com',
    pass: 'Admin@123',
    name: 'Chief Admin',
    avatar: '🛡️',
    title: 'Platform Governance & Risk',
    description: 'Statutory Double-Entry Ledger Surveillance'
  },
  estate_manager: {
    id: 'user-estate-manoj',
    role: 'estate_manager',
    roleLabel: 'EstateOS & Hospitality',
    email: 'estate@staywise.com',
    pass: 'Estate@123',
    name: 'Manoj Kumar',
    avatar: '🏡',
    title: 'Estate Director & Hospitality Host',
    description: '4 Luxury Villas • 18 Airbnb & Boutique Hotel Keys • Smart Check-in'
  }
};

interface AppStateContextType {
  isAuthenticated: boolean;
  currentUser: DemoCredential;
  sessionToken: string | null;
  login: (role: UserRole, customUser?: Partial<DemoCredential>, token?: string) => void;
  signupUser: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    portfolioName?: string;
    city?: string;
    propertyId?: string;
    unitNumber?: string;
    subscriptionPlan?: 'trial' | 'starter' | 'growth_pro' | 'enterprise';
    billingCycle?: 'monthly' | 'annual';
    entityName?: string;
    ownerName?: string;
    panNumber?: string;
    gstin?: string;
    registeredAddress?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  toggleTwoFactor: (enabled: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activePortfolio: string;
  setActivePortfolio: (portfolio: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Data
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
  notifications: NotificationItem[];
  users: UserAccount[];
  refreshData: () => Promise<void>;
  
  // Asset Universe Engines
  pgBeds: PGBed[];
  pgRooms: PGRoom[];
  pgMeals: PGMealPlan[];
  addPgMeal: (meal: Omit<PGMealPlan, 'id'>) => void;
  updatePgMeal: (id: string, meal: Partial<PGMealPlan>) => void;
  deletePgMeal: (id: string) => void;
  commercialUnits: CommercialUnit[];
  camExpenses: CAMExpenseItem[];
  commercialVisitors: CommercialVisitor[];
  moveFlowChecklist: MoveFlowChecklistItem[];
  depositDisputes: DepositSettlementDispute[];
  referrals: TenantReferralItem[];
  moneyLeaks: MoneyLeakAlert[];
  vacancyCosts: VacancyCostReport[];
  propertyPassport: PropertyPassportData;
  tenantPassport: TenantPassportData;
  
  // Subscription & Platform Licensing
  subscription: OwnerSubscription | null;
  refreshSubscription: () => Promise<void>;
  upgradeSubscription: (planId: SubscriptionTierId, billingCycle: 'monthly' | 'annual', paymentMethod?: string) => Promise<{ success: boolean; error?: string; subscription?: OwnerSubscription }>;
  startTrialSignup: (payload: TrialSignupPayload) => Promise<{ success: boolean; error?: string }>;
  cancelTrial: () => Promise<{ success: boolean; error?: string }>;
  
  // Global search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Modals & Action Triggers
  isAddPropertyOpen: boolean;
  setIsAddPropertyOpen: (open: boolean) => void;
  isExistingTenantWizardOpen: boolean;
  setIsExistingTenantWizardOpen: (open: boolean) => void;
  isPayRentOpen: boolean;
  setIsPayRentOpen: (open: boolean) => void;
  selectedInvoiceForPay: RentInvoice | null;
  setSelectedInvoiceForPay: (inv: RentInvoice | null) => void;
  selectedReceiptInvoice: RentInvoice | null;
  setSelectedReceiptInvoice: (inv: RentInvoice | null) => void;
  isCreateTicketOpen: boolean;
  setIsCreateTicketOpen: (open: boolean) => void;
  isScheduleVisitOpen: boolean;
  setIsScheduleVisitOpen: (open: boolean) => void;
  isUploadBillModalOpen: boolean;
  setIsUploadBillModalOpen: (open: boolean) => void;
  preselectedUnitForUpload: string | null;
  setPreselectedUnitForUpload: (unit: string | null) => void;
  isEditPropertyModalOpen: boolean;
  setIsEditPropertyModalOpen: (open: boolean) => void;
  propertyToEdit: Property | null;
  setPropertyToEdit: (property: Property | null) => void;
  
  // Actions
  addProperty: (property: Partial<Property>) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;
  addExistingTenant: (tenantData: {
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
  }) => Promise<void>;
  payInvoice: (invoiceId: string, method: 'UPI' | 'Bank Transfer' | 'Card' | 'Autopay' | 'FlexPay') => void;
  approveTicket: (ticketId: string) => void;
  createMaintenanceTicket: (ticket: Partial<MaintenanceTicket>) => void;
  advanceLeadStage: (leadId: string, nextStage: Lead['stage']) => void;
  executeInsightAction: (insight: AIInsight) => void;
  addElectricityBill: (bill: ElectricityBill) => void;
  updateElectricityBill: (id: string, updates: Partial<ElectricityBill>) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  updatePGBedStatus: (bedId: string, newStatus: PGBedStatus) => void;
  addCommercialVisitor: (visitor: Omit<CommercialVisitor, 'id' | 'passCode' | 'status'>) => void;
  toggleMoveFlowTask: (taskId: string) => void;
  resolveDepositDispute: (disputeId: string, status: DepositSettlementDispute['status']) => void;
  addReferral: (referral: Omit<TenantReferralItem, 'id' | 'date'>) => void;
  approveProperty: (propertyId: string) => void;
  influencerOffers: InfluencerOffer[];
  addInfluencerOffer: (offer: Omit<InfluencerOffer, 'id' | 'signupsCount' | 'totalCommissionPaid' | 'createdAt'>) => void;
  toggleInfluencerOfferStatus: (offerId: string) => void;

  // Tenant Connections & Move-Out Lifecycle
  tenantConnectionRequests: TenantConnectionRequest[];
  createTenantConnectionRequest: (req: Omit<TenantConnectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveTenantConnectionRequest: (id: string) => void;
  rejectTenantConnectionRequest: (id: string) => void;
  requestTenantMoveOut: (requestId: string, details: { moveOutDate: string; moveOutReason: string }) => void;
  verifyAndSettleMoveOut: (requestId: string, details: { inspectionNotes?: string; depositSettledAmount?: number }) => void;
  disconnectTenant: (tenantId: string, reason?: string) => Promise<void>;

  // Authorized Delegates (Manager & CA with strict withdrawal restrictions)
  delegates: AuthorizedDelegate[];
  addDelegate: (delegate: Omit<AuthorizedDelegate, 'id' | 'invitedAt' | 'status'> & { status?: AuthorizedDelegate['status'] }) => void;
  updateDelegatePermissions: (id: string, permissions: string[]) => void;
  revokeDelegate: (id: string) => void;

  // Custom Food Menu (Zero stock data fallback)
  foodMenuItems: FoodMenuItem[];
  addFoodMenuItem: (item: Omit<FoodMenuItem, 'id'>) => void;
  deleteFoodMenuItem: (id: string) => void;

  // Campus Physical Assets & Staff CRUD
  addEstateAsset: (asset: Omit<EstateAsset, 'id'>) => void;
  deleteEstateAsset: (id: string) => void;
  addStaffMember: (member: Omit<StaffMember, 'id'>) => void;
  deleteStaffMember: (id: string) => void;

  // Staywise Rewards (WisePoints) & Deposit Protect
  rewardsAccount: RewardsAccount | null;
  rewardsLedger: RewardsLedgerEntry[];
  rewardRules: RewardRule[];
  merchantOffers: MerchantOffer[];
  depositApplications: DepositProtectionApplication[];
  protectionContracts: ProtectionContract[];
  conditionReports: PropertyConditionReport[];
  protectionClaims: ProtectionClaim[];
  earnWisePoints: (actionType: RewardActionType, points: number, referenceId?: string, description?: string) => Promise<boolean>;
  redeemWisePoints: (actionType: RewardActionType, points: number, referenceId?: string, description?: string) => Promise<{ success: boolean; voucherCode?: string; error?: string }>;
  applyForDepositProtect: (appData: Partial<DepositProtectionApplication>) => Promise<boolean>;
  submitConditionReport: (reportData: Partial<PropertyConditionReport>) => Promise<boolean>;
  submitProtectionClaim: (claimData: Partial<ProtectionClaim>) => Promise<boolean>;
  settleProtectionClaim: (claimId: string, approvedAmount?: number) => Promise<boolean>;
  disputeProtectionClaim: (claimId: string, reason?: string) => Promise<boolean>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);



// Tab-scoped Session Storage Helpers
// sessionStorage provides strict tab isolation (Tab 1 cannot overwrite Tab 2)
function getTabSessionItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal !== null) return sessionVal;
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const sessionAuth = sessionStorage.getItem('staywise_is_authenticated');
      if (sessionAuth !== null) return sessionAuth === 'true';
      return localStorage.getItem('staywise_is_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>('owner');
  const [currentUser, setCurrentUser] = useState<DemoCredential>(DEMO_CREDENTIALS.owner);
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') || null;
    } catch {
      return null;
    }
  });
  const [activePortfolio, setActivePortfolio] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [subscription, setSubscription] = useState<OwnerSubscription | null>(null);

  // 1. Initial Tab-Scoped Client-Side Hydration: Preserve active view and persona per tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlView = urlParams.get('view');
      const urlRole = urlParams.get('role') as UserRole | null;
      const urlPortfolio = urlParams.get('portfolio');

      const savedAuth = getTabSessionItem('staywise_is_authenticated');
      const savedView = urlView || getTabSessionItem('staywise_active_view');
      const savedRole = (urlRole && DEMO_CREDENTIALS[urlRole] ? urlRole : (getTabSessionItem('staywise_active_role') as UserRole | null));
      const savedUser = getTabSessionItem('staywise_current_user');
      const savedPortfolio = urlPortfolio || getTabSessionItem('staywise_active_portfolio');

      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
      if (savedView) {
        setActiveView(savedView);
      }
      if (savedRole && DEMO_CREDENTIALS[savedRole]) {
        setActiveRole(savedRole);
      }
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) setCurrentUser(parsed);
        } catch (e) {}
      }
      if (savedPortfolio) {
        setActivePortfolio(savedPortfolio);
      }
      const savedConns = getTabSessionItem('staywise_tenant_connections') || (typeof window !== 'undefined' ? localStorage.getItem('staywise_tenant_connections') : null);
      if (savedConns) {
        try {
          const parsedConns = JSON.parse(savedConns);
          if (Array.isArray(parsedConns) && parsedConns.length > 0) {
            setTenantConnectionRequests(parsedConns);
          }
        } catch {}
      }
    } catch (e) {
      console.warn('[Staywise State] Failed to hydrate tab session:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Synchronize active state changes to sessionStorage (tab-isolated) & URL query params
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;
    try {
      sessionStorage.setItem('staywise_is_authenticated', String(isAuthenticated));
      
      if (!isAuthenticated) {
        // Clean URL parameters when on the unauthenticated landing page
        const url = new URL(window.location.href);
        if (url.searchParams.has('role') || (url.searchParams.has('view') && url.searchParams.get('view') !== 'login')) {
          url.searchParams.delete('view');
          url.searchParams.delete('role');
          url.searchParams.delete('portfolio');
          window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
        }
        return;
      }

      sessionStorage.setItem('staywise_active_view', activeView);
      sessionStorage.setItem('staywise_active_role', activeRole);
      sessionStorage.setItem('staywise_active_portfolio', activePortfolio);
      sessionStorage.setItem('staywise_current_user', JSON.stringify(currentUser));

      // CRITICAL: NEVER overwrite client sessions in localStorage when in Admin role or /admin portal.
      // This guarantees Tab 1 (Client/Owner/Tenant) and Tab 2 (Chief Admin) are strictly isolated!
      if (activeRole !== 'admin') {
        localStorage.setItem('staywise_active_view', activeView);
        localStorage.setItem('staywise_active_role', activeRole);
        localStorage.setItem('staywise_active_portfolio', activePortfolio);
        localStorage.setItem('staywise_current_user', JSON.stringify(currentUser));
        localStorage.setItem('staywise_is_authenticated', String(isAuthenticated));
      }

      // Keep address bar query params in sync without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('view', activeView);
      url.searchParams.set('role', activeRole);
      if (activePortfolio && activePortfolio !== 'all') {
        url.searchParams.set('portfolio', activePortfolio);
      } else {
        url.searchParams.delete('portfolio');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }, [activeView, activeRole, activePortfolio, currentUser, isAuthenticated, isHydrated]);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    // If switching back to the role that matches the logged-in user, restore their real account
    const savedUserStr = getTabSessionItem('staywise_current_user');
    if (savedUserStr) {
      try {
        const saved = JSON.parse(savedUserStr);
        if (saved && saved.role === role) {
          setCurrentUser(saved);
          return;
        }
      } catch (e) {}
    }
    setCurrentUser(DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.owner);
  };

  const login = (role: UserRole, customUser?: Partial<DemoCredential>, token?: string) => {
    setActiveRole(role);
    const userToSet: DemoCredential = customUser ? {
      id: customUser.id || DEMO_CREDENTIALS[role]?.id || `user-${role}`,
      role,
      email: customUser.email || DEMO_CREDENTIALS[role]?.email || 'user@staywise.com',
      pass: customUser.pass || '******',
      name: customUser.name || 'Member',
      roleLabel: customUser.roleLabel || DEMO_CREDENTIALS[role]?.roleLabel || 'Member',
      avatar: customUser.avatar || DEMO_CREDENTIALS[role]?.avatar || '👤',
      title: customUser.title || DEMO_CREDENTIALS[role]?.title || 'Portal Member',
      description: customUser.description || DEMO_CREDENTIALS[role]?.description || 'Active Member',
      twoFactorEnabled: customUser.twoFactorEnabled ?? (DEMO_CREDENTIALS[role]?.twoFactorEnabled ?? false)
    } : (DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.owner);

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    setActiveView('dashboard');

    if (token) {
      setSessionToken(token);
    }

    if (typeof window !== 'undefined') {
      try {
        // Tab-isolated storage
        sessionStorage.setItem('staywise_is_authenticated', 'true');
        sessionStorage.setItem('staywise_active_role', role);
        sessionStorage.setItem('staywise_active_view', 'dashboard');
        sessionStorage.setItem('staywise_current_user', JSON.stringify(userToSet));
        if (token) {
          sessionStorage.setItem('staywise_token', token);
        }

        // Only persist normal user logins (owner, tenant, manager) to localStorage.
        // Admin logins remain in tab's sessionStorage to prevent hijacking client tabs.
        if (role !== 'admin') {
          localStorage.setItem('staywise_is_authenticated', 'true');
          localStorage.setItem('staywise_active_role', role);
          localStorage.setItem('staywise_active_view', 'dashboard');
          localStorage.setItem('staywise_current_user', JSON.stringify(userToSet));
          if (token) {
            localStorage.setItem('staywise_token', token);
          }
        }
      } catch (e) {}
    }

    // Immediately reload scoped database data for this user with forced refresh
    loadDatabaseData(userToSet, true);
  };

  const signupUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    portfolioName?: string;
    city?: string;
    propertyId?: string;
    unitNumber?: string;
    subscriptionPlan?: 'trial' | 'starter' | 'growth_pro' | 'enterprise';
    billingCycle?: 'monthly' | 'annual';
    entityName?: string;
    ownerName?: string;
    panNumber?: string;
    gstin?: string;
    registeredAddress?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      const newCred: DemoCredential = {
        id: data.user.id,
        role: userData.role,
        email: data.user.email,
        pass: userData.password,
        name: data.user.name,
        roleLabel: data.user.roleLabel,
        avatar: data.user.avatar,
        title: data.user.title,
        description: data.user.description,
        twoFactorEnabled: false
      };
      login(userData.role, newCred, data.token);

      addNotification(
        'Clean Workspace Initialized!',
        `Welcome ${data.user.name}! Your workspace is active with 0 properties. Click "+ Add Property" to onboard your first asset.`,
        'SYSTEM'
      );

      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, error: err.message || 'Connection failed' };
    }
  };

  const toggleTwoFactor = async (enabled: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      const userId = currentUser?.id;
      if (!userId) return { success: false, error: 'User session not found.' };

      const res = await fetch('/api/auth/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, enabled })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update 2FA.' };
      }

      setCurrentUser(prev => {
        const updated = { ...prev, twoFactorEnabled: enabled };
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('staywise_current_user', JSON.stringify(updated));
          if (activeRole !== 'admin') {
            localStorage.setItem('staywise_current_user', JSON.stringify(updated));
          }
        }
        return updated;
      });

      addNotification(
        enabled ? 'Two-Factor Authentication Active' : '2FA Protection Disabled',
        enabled 
          ? 'Two-Factor Authentication (2FA) is now enabled on your account. Payouts and lease records are verified.' 
          : 'Two-Factor Authentication has been disabled on your account.',
        'SYSTEM'
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error while updating 2FA.' };
    }
  };

  const logout = async () => {
    const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        }
      });
    } catch (e) {
      console.warn('[Staywise Auth] Server logout call notice:', e);
    }
    setSessionToken(null);
    setIsAuthenticated(false);
    setActiveView('login');
    try {
      // Purge tab-isolated session storage
      sessionStorage.removeItem('staywise_token');
      sessionStorage.removeItem('staywise_active_view');
      sessionStorage.removeItem('staywise_active_role');
      sessionStorage.removeItem('staywise_active_portfolio');
      sessionStorage.removeItem('staywise_current_user');
      sessionStorage.setItem('staywise_is_authenticated', 'false');
      sessionStorage.setItem('staywise_unauth_screen', 'login');

      // Purge cross-tab local storage
      localStorage.removeItem('staywise_token');
      localStorage.removeItem('staywise_active_view');
      localStorage.removeItem('staywise_active_role');
      localStorage.removeItem('staywise_active_portfolio');
      localStorage.removeItem('staywise_current_user');
      localStorage.removeItem('staywise_tenant_connections');
      sessionStorage.removeItem('staywise_tenant_connections');
      localStorage.setItem('staywise_is_authenticated', 'false');
      localStorage.setItem('staywise_unauth_screen', 'login');

      // Clear client-side cookie references as secondary defense
      document.cookie = 'staywise_token=; Max-Age=0; path=/;';
      document.cookie = 'staywise_user=; Max-Age=0; path=/;';
    } catch (e) {}

    // Clean all module state
    setProperties([]);
    setTenants([]);
    setInvoices([]);
    setLedger([]);
    setTickets([]);
    setPgBeds([]);
    setPgRooms([]);
    setCommercialUnits([]);
    setLeads([]);
    setEstateAssets([]);
    setTenantConnectionRequests([]);

    // Directly show login page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [estateAssets, setEstateAssets] = useState<EstateAsset[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [utilities, setUtilities] = useState<UtilityReading[]>([]);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isUploadBillModalOpen, setIsUploadBillModalOpen] = useState(false);
  const [preselectedUnitForUpload, setPreselectedUnitForUpload] = useState<string | null>(null);

  // Asset Universe Engines
  const [pgBeds, setPgBeds] = useState<PGBed[]>([]);
  const [pgRooms, setPgRooms] = useState<PGRoom[]>([]);
  const [pgMeals, setPgMeals] = useState<PGMealPlan[]>([]);
  const [commercialUnits, setCommercialUnits] = useState<CommercialUnit[]>([]);
  const [camExpenses, setCamExpenses] = useState<CAMExpenseItem[]>([]);
  const [commercialVisitors, setCommercialVisitors] = useState<CommercialVisitor[]>([]);
  const [moveFlowChecklist, setMoveFlowChecklist] = useState<MoveFlowChecklistItem[]>([]);
  const [depositDisputes, setDepositDisputes] = useState<DepositSettlementDispute[]>([]);
  const [referrals, setReferrals] = useState<TenantReferralItem[]>([]);
  const [moneyLeaks] = useState<MoneyLeakAlert[]>(DEFAULT_MONEY_LEAKS);
  const [vacancyCosts] = useState<VacancyCostReport[]>(DEFAULT_VACANCY_COSTS);
  const [propertyPassport] = useState<PropertyPassportData>(DEFAULT_PROPERTY_PASSPORT);
  const [tenantPassport] = useState<TenantPassportData>(DEFAULT_TENANT_PASSPORT);

  // Tenant Connections & Lifecycle (Starts clean; authoritatively hydrated from SQLite database)
  const [tenantConnectionRequests, setTenantConnectionRequests] = useState<TenantConnectionRequest[]>([]);

  // Authorized Delegates (CAs & Managers)
  const [delegates, setDelegates] = useState<AuthorizedDelegate[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('staywise_delegates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Food Menu Items (Zero stock data fallback)
  const [foodMenuItems, setFoodMenuItems] = useState<FoodMenuItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('staywise_food_menu');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [influencerOffers, setInfluencerOffers] = useState<InfluencerOffer[]>([
    {
      id: 'inf-1',
      code: 'KERALALUXURY',
      influencerName: 'Anand Kumar (Real Estate Vlog)',
      influencerHandle: '@anand_realty',
      commissionType: 'FLAT',
      commissionValue: 3000,
      audienceOffer: '₹1,500 Off First Month Rent',
      targetAudience: 'Both',
      signupsCount: 14,
      totalCommissionPaid: 42000,
      status: 'ACTIVE',
      createdAt: '15 Sep 2026'
    },
    {
      id: 'inf-2',
      code: 'TECHPARKLIVING',
      influencerName: 'Sneha Roy (Bangalore Tech Guide)',
      influencerHandle: '@sneharoy_tech',
      commissionType: 'PERCENTAGE',
      commissionValue: 10,
      audienceOffer: '50% Off Platform Onboarding + Zero Brokerage',
      targetAudience: 'Tenants',
      signupsCount: 28,
      totalCommissionPaid: 68500,
      status: 'ACTIVE',
      createdAt: '01 Sep 2026'
    },
    {
      id: 'inf-3',
      code: 'LANDLORDELITE',
      influencerName: 'CA Rajesh V. (Wealth & Assets)',
      influencerHandle: '@rajesh_finassets',
      commissionType: 'FLAT',
      commissionValue: 5000,
      audienceOffer: 'Free 3-Month Double-Entry Audit Software',
      targetAudience: 'Landlords',
      signupsCount: 8,
      totalCommissionPaid: 40000,
      status: 'ACTIVE',
      createdAt: '20 Aug 2026'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isExistingTenantWizardOpen, setIsExistingTenantWizardOpen] = useState(false);
  const [isPayRentOpen, setIsPayRentOpen] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<RentInvoice | null>(null);
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<RentInvoice | null>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  // Keyboard shortcut '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [users, setUsers] = useState<UserAccount[]>([]);

  // Staywise Rewards (WisePoints) & Deposit Protect State
  const [rewardsAccount, setRewardsAccount] = useState<RewardsAccount | null>(null);
  const [rewardsLedger, setRewardsLedger] = useState<RewardsLedgerEntry[]>([]);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);
  const [merchantOffers, setMerchantOffers] = useState<MerchantOffer[]>([]);
  const [depositApplications, setDepositApplications] = useState<DepositProtectionApplication[]>([]);
  const [protectionContracts, setProtectionContracts] = useState<ProtectionContract[]>([]);
  const [conditionReports, setConditionReports] = useState<PropertyConditionReport[]>([]);
  const [protectionClaims, setProtectionClaims] = useState<ProtectionClaim[]>([]);

  // Cross-tab real-time event broadcasting helper
  const broadcastSync = (action: string, payload?: any) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('staywise_db_sync');
        channel.postMessage({ type: 'DATA_UPDATED', action, payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  // Module-scoped deduplication & ETag cache
  const inFlightPromiseRef = React.useRef<Promise<void> | null>(null);
  const lastEtagRef = React.useRef<string>('');
  const lastLoadTimeRef = React.useRef<number>(0);

  // Authoritative data loading function directly from persistent SQLite via /api/bootstrap
  const loadDatabaseData = async (userParam?: DemoCredential, force = false): Promise<void> => {
    // 0. Optimization: Do NOT fire unauthenticated bootstrap queries on landing page
    if (!isAuthenticated && !userParam && !force) {
      return;
    }

    // 1. Bypass debounce & deduplication if explicitly forced or switching user persona
    if (force || userParam) {
      lastLoadTimeRef.current = 0;
      lastEtagRef.current = '';
    } else {
      if (inFlightPromiseRef.current) {
        return inFlightPromiseRef.current;
      }
      if (Date.now() - lastLoadTimeRef.current < 1500) {
        return;
      }
    }

    inFlightPromiseRef.current = (async () => {
      try {
        let activeUser = userParam;
        if (!activeUser && typeof window !== 'undefined') {
          const savedUserStr = sessionStorage.getItem('staywise_current_user') || localStorage.getItem('staywise_current_user');
          if (savedUserStr) {
            try { activeUser = JSON.parse(savedUserStr); } catch {}
          }
        }
        if (!activeUser) activeUser = currentUser;

        const url = activeUser?.id ? `/api/bootstrap?userId=${encodeURIComponent(activeUser.id)}` : '/api/bootstrap';
        const headers: HeadersInit = {};
        if (lastEtagRef.current && !force) {
          headers['If-None-Match'] = lastEtagRef.current;
        }

        const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
        if (effectiveToken) {
          headers['Authorization'] = `Bearer ${effectiveToken}`;
        }

        const res = await fetch(url, { headers });
        lastLoadTimeRef.current = Date.now();

        // HTTP 304 Not Modified: Data is identical, retain existing state with ZERO re-render overhead!
        if (res.status === 304) {
          return;
        }

        const etag = res.headers.get('ETag');
        if (etag) lastEtagRef.current = etag;

        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (Array.isArray(d.properties)) {
            setProperties(prev => {
              const serverMap = new Map(d.properties.map((p: any) => [p.id, p]));
              const merged = [...d.properties];
              for (const p of prev) {
                if (!serverMap.has(p.id)) {
                  merged.push(p);
                }
              }
              return merged;
            });
          }
          if (Array.isArray(d.tenants)) setTenants(d.tenants);
          if (Array.isArray(d.invoices)) setInvoices(d.invoices);
          if (Array.isArray(d.ledger)) setLedger(d.ledger);
          if (Array.isArray(d.depositDisputes)) setDepositDisputes(d.depositDisputes);
          if (Array.isArray(d.influencerOffers)) setInfluencerOffers(d.influencerOffers);
          if (Array.isArray(d.tickets)) setTickets(d.tickets);
          if (Array.isArray(d.electricityBills)) setElectricityBills(d.electricityBills);
          if (Array.isArray(d.leads)) setLeads(d.leads);
          if (Array.isArray(d.estateAssets)) setEstateAssets(d.estateAssets);
          if (Array.isArray(d.staff)) setStaff(d.staff);
          if (Array.isArray(d.utilities)) setUtilities(d.utilities);
          if (Array.isArray(d.aiInsights)) setAiInsights(d.aiInsights);
          if (Array.isArray(d.pgBeds)) setPgBeds(d.pgBeds);
          if (Array.isArray(d.pgRooms)) setPgRooms(d.pgRooms);
          if (Array.isArray(d.pgMeals)) setPgMeals(d.pgMeals);
          if (Array.isArray(d.commercialUnits)) setCommercialUnits(d.commercialUnits);
          if (Array.isArray(d.camExpenses)) setCamExpenses(d.camExpenses);
          if (Array.isArray(d.commercialVisitors)) setCommercialVisitors(d.commercialVisitors);
          if (Array.isArray(d.moveFlowChecklist)) setMoveFlowChecklist(d.moveFlowChecklist);
          if (Array.isArray(d.referrals)) setReferrals(d.referrals);
          if (Array.isArray(d.users)) setUsers(d.users);
          if (Array.isArray(d.tenantConnectionRequests)) {
            setTenantConnectionRequests(prev => {
              const serverMap = new Map(d.tenantConnectionRequests.map((r: any) => [r.id, r]));
              const merged = [...d.tenantConnectionRequests];
              for (const r of prev) {
                if (!serverMap.has(r.id)) {
                  merged.push(r);
                }
              }
              try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (d.subscription) setSubscription(d.subscription);
          if (d.rewardsAccount) setRewardsAccount(d.rewardsAccount);
          if (Array.isArray(d.rewardsLedger)) setRewardsLedger(d.rewardsLedger);
          if (Array.isArray(d.rewardRules)) setRewardRules(d.rewardRules);
          if (Array.isArray(d.merchantOffers)) setMerchantOffers(d.merchantOffers);
          if (Array.isArray(d.depositApplications)) setDepositApplications(d.depositApplications);
          if (Array.isArray(d.protectionContracts)) setProtectionContracts(d.protectionContracts);
          if (Array.isArray(d.conditionReports)) setConditionReports(d.conditionReports);
          if (Array.isArray(d.protectionClaims)) setProtectionClaims(d.protectionClaims);
          setNotifications([]);
        }
      } catch (err) {
        console.warn('[Staywise Database] Hydrated using local store fallback:', err);
      } finally {
        inFlightPromiseRef.current = null;
      }
    })();

    return inFlightPromiseRef.current;
  };

  // Multi-tab real-time sync engine with adaptive background throttling
  useEffect(() => {
    // Only load database data when authenticated
    if (isAuthenticated) {
      loadDatabaseData();
    }

    // 1. BroadcastChannel: instant (<50ms) reaction across open tabs without network roundtrips
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('staywise_db_sync');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'DATA_UPDATED' && isAuthenticated) {
            loadDatabaseData(undefined, true);
          }
        };
      }
    } catch (e) {}

    // 2. Window focus & visibility listener: pulls latest data when user returns to tab
    const handleFocusOrVisible = () => {
      if (typeof document !== 'undefined' && !document.hidden && isAuthenticated) {
        loadDatabaseData(undefined, true);
      }
    };
    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    // 3. Adaptive real-time polling (4s): Immediate live sync when tab is active
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return; // Tab in background: 0 requests
      if (!isAuthenticated) return; // Unauthenticated visitors: 0 requests
      loadDatabaseData(undefined, false);
    }, 4000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addProperty = async (newPropData: Partial<Property>) => {
    const assignedOwnerId = newPropData.ownerId || currentUser.id || 'user-owner-vikram';
    const newPropId = newPropData.id || generatePropertyId();
    const newProp: Property = {
      id: newPropId,
      ownerId: assignedOwnerId,
      name: (newPropData.name || '').trim() || 'New Property',
      type: newPropData.type || 'Apartment',
      portfolio: newPropData.portfolio || (currentUser.name && currentUser.name !== 'Member' ? `${currentUser.name}'s Portfolio` : 'Kozhikode Coastal'),
      address: (newPropData.address || '').trim() || 'Central City Area',
      city: (newPropData.city || '').trim() || 'Kozhikode',
      state: (newPropData.state || '').trim() || 'Kerala',
      pincode: (newPropData.pincode || '').trim() || '673001',
      totalUnits: Math.max(1, Number(newPropData.totalUnits) || 1),
      occupiedUnits: Math.max(0, Number(newPropData.occupiedUnits) || 0),
      expectedMonthlyRent: Math.max(1000, Number(newPropData.expectedMonthlyRent) || 25000),
      collectedRent: 0,
      pendingRent: 0,
      imageUrl: newPropData.imageUrl || '/images/properties/beach-road.jpg',
      status: 'VACANT',
      healthScore: 90,
      verificationStatus: 'PENDING',
      submittedDocs: ['Title_Deed_Ownership_2026.pdf', 'Building_Permit_NOC.pdf', 'Fire_Safety_Certificate.pdf'],
      amenities: newPropData.amenities || ['Parking', 'Security'],
      units: []
    };
    
    // Optimistic UI update
    setProperties(prev => [newProp, ...prev.filter(p => p.id !== newProp.id)]);
    // CRITICAL: Reset activePortfolio to 'all' so new property is immediately visible in owner view
    setActivePortfolio('all');
    addNotification('Property Submitted for Verification', `${newProp.name} has been added. Pending Admin document audit and approval.`, 'SYSTEM');

    // Persist to database via API
    try {
      const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        },
        body: JSON.stringify(newProp)
      });
      const data = await res.json();
      if (data?.success && data?.data) {
        setProperties(prev => [data.data, ...prev.filter(p => p.id !== newProp.id && p.id !== data.data.id)]);
      }
      broadcastSync('PROPERTY_ADDED', newProp);
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/properties] Persist failed:', err);
    }
  };

  const approveProperty = async (propertyId: string) => {
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, verificationStatus: 'APPROVED', status: 'ACTIVE' } : p));
    addNotification('Property Verified & Approved', `Property documents approved. Active across Staywise platform.`, 'SYSTEM');

    // Persist to database via API
    try {
      const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
      await fetch(`/api/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        },
        body: JSON.stringify({ status: 'APPROVED' })
      });
      broadcastSync('PROPERTY_APPROVED', { propertyId });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/properties/[id]/verify] Verification failed:', err);
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));

    // Synchronize linked tenant rent & dues if expectedMonthlyRent changes
    if (updates.expectedMonthlyRent && updates.expectedMonthlyRent > 0) {
      setTenants(prev => prev.map(t => t.propertyId === propertyId ? { ...t, monthlyRent: updates.expectedMonthlyRent! } : t));
      setInvoices(prev => prev.map(inv => (inv.propertyId === propertyId && inv.status !== 'Paid') ? { 
        ...inv, 
        baseRent: updates.expectedMonthlyRent!, 
        totalAmount: updates.expectedMonthlyRent! + (inv.camCharges || 0) + (inv.utilityCharges || 0) 
      } : inv));
    }
    if (updates.name) {
      setTenants(prev => prev.map(t => t.propertyId === propertyId ? { ...t, propertyName: updates.name! } : t));
      setInvoices(prev => prev.map(inv => inv.propertyId === propertyId ? { ...inv, propertyName: updates.name! } : inv));
    }

    addNotification('Property Updated', `Property details updated and linked tenant dues synchronized.`, 'SYSTEM');

    // Persist to database via API
    try {
      const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        },
        body: JSON.stringify(updates)
      });
      broadcastSync('PROPERTY_UPDATED', { propertyId, updates });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/properties/[id]] Update failed:', err);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    // Optimistic UI update
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    addNotification('Property Removed', `Property was removed from portfolio.`, 'SYSTEM');

    // Persist to database via API
    try {
      const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
      await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        }
      });
      broadcastSync('PROPERTY_DELETED', { propertyId });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/properties/[id]] Delete failed:', err);
    }
  };

  const addInfluencerOffer = async (data: Omit<InfluencerOffer, 'id' | 'signupsCount' | 'totalCommissionPaid' | 'createdAt'>) => {
    const newOffer: InfluencerOffer = {
      ...data,
      id: `inf-${Date.now()}`,
      signupsCount: 0,
      totalCommissionPaid: 0,
      createdAt: 'Just now'
    };
    
    // Optimistic UI update
    setInfluencerOffers(prev => [newOffer, ...prev]);
    addNotification('Influencer Offer Created', `Code "${newOffer.code}" has been generated for ${newOffer.influencerName}.`, 'SYSTEM');

    // Persist to database via API
    try {
      await fetch('/api/influencer-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('[API /api/influencer-offers] Create failed:', err);
    }
  };

  const toggleInfluencerOfferStatus = async (offerId: string) => {
    // Optimistic UI update
    setInfluencerOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: o.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : o));
    addNotification('Campaign Status Updated', 'Influencer code status was modified.', 'SYSTEM');

    // Persist to database via API
    try {
      await fetch('/api/influencer-offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offerId })
      });
    } catch (err) {
      console.error('[API /api/influencer-offers] Toggle failed:', err);
    }
  };

  // Feature #15: Add Existing Tenant Flow
  const addExistingTenant = async (data: {
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
  }) => {
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

    const tenantId = generateTenantId();
    const coTenantId = isSharing ? generateTenantId() : undefined;
    const targetProp = properties.find(p => p.id === data.propertyId);
    if (!targetProp) {
      addNotification('Property Required', 'You must add at least one property before onboarding a tenant.', 'SYSTEM');
      setIsAddPropertyOpen(true);
      return;
    }
    const propName = targetProp.name;

    const newTenant: Tenant = {
      id: tenantId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      propertyId: data.propertyId,
      propertyName: propName,
      unitNumber: data.unitNumber,
      monthlyRent: primaryMonthlyRent,
      depositPaid: primaryDeposit,
      leaseStart: data.leaseStart,
      leaseEnd: data.leaseEnd,
      rentDueDate: data.rentDueDate,
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

    const newTenantsList = [newTenant];
    let newCoTenant: Tenant | undefined = undefined;

    if (isSharing && data.coTenant && coTenantId) {
      newCoTenant = {
        id: coTenantId,
        name: data.coTenant.name,
        phone: data.coTenant.phone,
        email: data.coTenant.email,
        propertyId: data.propertyId,
        propertyName: propName,
        unitNumber: data.unitNumber,
        monthlyRent: coMonthlyRent,
        depositPaid: coDeposit,
        leaseStart: data.leaseStart,
        leaseEnd: data.leaseEnd,
        rentDueDate: data.rentDueDate,
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
      newTenantsList.push(newCoTenant);
    }

    setTenants(prev => [...prev, ...newTenantsList]);

    // Update Property Unit status to OCCUPIED
    setProperties(prev => prev.map(p => {
      if (p.id === data.propertyId) {
        const occupantNames = isSharing && data.coTenant 
          ? `${data.name} & ${data.coTenant.name} (Sharing)` 
          : data.name;

        const updatedUnits = p.units.map(u => {
          if (u.unitNumber === data.unitNumber) {
            return {
              ...u,
              status: 'OCCUPIED' as const,
              currentTenantId: tenantId,
              currentTenantName: occupantNames,
              leaseEnd: data.leaseEnd,
              rentAmount: data.monthlyRent
            };
          }
          return u;
        });
        return {
          ...p,
          occupiedUnits: p.occupiedUnits + 1,
          expectedMonthlyRent: p.expectedMonthlyRent + data.monthlyRent,
          units: updatedUnits
        };
      }
      return p;
    }));

    // Auto-generate First Rent Invoice with collision-free IDs
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
    const invoicesToAdd = [newInvoice];

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
      invoicesToAdd.push(coInvoice);
    }

    setInvoices(prev => [...invoicesToAdd, ...prev]);

    // Record Security Deposit in double-entry ledger with collision-free ID
    const ledgerEntry: LedgerEntry = {
      id: generateLedgerId(),
      timestamp: 'Just now',
      description: isSharing && data.coTenant
        ? `Security Deposit Onboarded (Dual Sharing) - Unit ${data.unitNumber} (${data.name} & ${data.coTenant.name})`
        : `Security Deposit Onboarded - Unit ${data.unitNumber} (${data.name})`,
      type: 'CREDIT',
      amount: data.deposit,
      account: 'Statutory Tenant Deposit Trust',
      entityType: 'SECURITY_DEPOSIT',
      referenceId: newInvoice.invoiceNumber,
      settlementStatus: 'CLEARED'
    };
    setLedger(prev => [ledgerEntry, ...prev]);

    const notifyMsg = isSharing && data.coTenant
      ? `${data.name} and ${data.coTenant.name} have been onboarded as shared roommates in Unit ${data.unitNumber}.`
      : `${data.name} has accepted the digital onboarding invite for Unit ${data.unitNumber}.`;
    addNotification('Tenant Connected', notifyMsg, 'RENT');

    // Authoritative API call to persist to SQLite database
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'staywise_live_key_sec_99482',
          'X-Staywise-Client-Key': 'staywise-client-v1'
        },
        body: JSON.stringify(data)
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        const d = resJson.data;
        if (d.tenant) {
          setTenants(prev => {
            const base = prev.filter(t => t.id !== tenantId && (!coTenantId || t.id !== coTenantId));
            const list = [d.tenant, ...base];
            if (d.coTenant) list.push(d.coTenant);
            return list;
          });
        }
        if (d.property) {
          setProperties(prev => prev.map(p => p.id === d.property.id ? d.property : p));
        }
        if (d.invoice) {
          setInvoices(prev => {
            const base = prev.filter(i => i.id !== newInvoice.id && (!coInvoice || i.id !== coInvoice.id));
            const list = [d.invoice, ...base];
            if (d.coInvoice) list.push(d.coInvoice);
            return list;
          });
        }
        if (d.ledgerEntry) {
          setLedger(prev => [d.ledgerEntry, ...prev.filter(l => l.id !== ledgerEntry.id)]);
        }
      }
      broadcastSync('TENANT_ONBOARDED', { tenantId });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/tenants] Onboarding persist failed:', err);
    }
  };

  const payInvoice = async (invoiceId: string, method: 'UPI' | 'Bank Transfer' | 'Card' | 'Autopay' | 'FlexPay') => {
    const txId = `${method.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-8)}`;
    
    // Optimistic UI updates
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'Paid',
          paidAmount: inv.totalAmount,
          paymentMethod: method,
          paidDate: '2026-10-01',
          transactionId: txId
        };
      }
      return inv;
    }));

    const targetInv = invoices.find(i => i.id === invoiceId);
    if (targetInv) {
      // Create immutable Double Ledger record in UI with collision-free ID
      const ledgerRecord: LedgerEntry = {
        id: generateLedgerId(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        description: `Rent Settlement (${method}) - ${targetInv.propertyName} #${targetInv.unitNumber} (${targetInv.tenantName})`,
        type: 'CREDIT',
        amount: targetInv.totalAmount,
        account: method === 'FlexPay' ? 'Partner Regulated Credit Clearing' : 'Axis PropOS Rent Escrow',
        entityType: 'RENT',
        referenceId: txId,
        settlementStatus: 'CLEARED'
      };
      setLedger(prev => [ledgerRecord, ...prev]);

      // Update property collections
      setProperties(prev => prev.map(p => {
        if (p.id === targetInv.propertyId) {
          return {
            ...p,
            collectedRent: p.collectedRent + targetInv.totalAmount,
            pendingRent: Math.max(0, p.pendingRent - targetInv.totalAmount)
          };
        }
        return p;
      }));

      addNotification('Payment Cleared', `₹${targetInv.totalAmount.toLocaleString('en-IN')} received via ${method} for Unit ${targetInv.unitNumber}. Receipt generated.`, 'RENT');
    }

    // Persist payment to database via API
    try {
      await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method })
      });
      broadcastSync('INVOICE_PAID', { invoiceId, method });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/invoices/[id]/pay] Payment persist failed:', err);
    }
  };

  const approveTicket = async (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Approved',
          ownerApproved: true,
          scheduledDate: 'Tomorrow at 10:00 AM',
          vendorName: 'Apex Precision Plumbing'
        };
      }
      return t;
    }));
    addNotification('Ticket Approved', `Maintenance Quote for ticket #${ticketId} was approved. Vendor dispatched.`, 'MAINTENANCE');
    
    // Also remove or resolve the corresponding AI insight
    setAiInsights(prev => prev.filter(ins => !ins.actionPayload?.includes(ticketId)));

    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          ownerApproved: true,
          scheduledDate: 'Tomorrow at 10:00 AM',
          vendorName: 'Apex Precision Plumbing'
        })
      });
      broadcastSync('TICKET_APPROVED', { ticketId });
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/tickets/[id]] Approve failed:', err);
    }
  };

  const createMaintenanceTicket = async (ticketData: Partial<MaintenanceTicket>) => {
    const newTkt: MaintenanceTicket = {
      id: ticketData.id || generateTicketId(),
      ticketNumber: ticketData.ticketNumber || generateTicketNumber(),
      propertyId: ticketData.propertyId || 'prop-beach-road',
      propertyName: ticketData.propertyName || 'Beach Road Apartments',
      unitNumber: ticketData.unitNumber || '302',
      tenantName: ticketData.tenantName || 'Shyam Sundar',
      category: ticketData.category || 'AC',
      title: ticketData.title || 'Service Request',
      description: ticketData.description || 'Details',
      priority: ticketData.priority || 'Medium',
      status: 'Triaged',
      estimatedCost: ticketData.estimatedCost || 1500,
      requiresOwnerApproval: (ticketData.estimatedCost || 1500) > 2000,
      ownerApproved: (ticketData.estimatedCost || 1500) <= 2000,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTickets(prev => [newTkt, ...prev]);
    addNotification('Ticket Raised', `${newTkt.category} ticket #${newTkt.ticketNumber} logged for Unit ${newTkt.unitNumber}.`, 'MAINTENANCE');

    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTkt)
      });
      broadcastSync('TICKET_CREATED', newTkt);
      await loadDatabaseData(undefined, true);
    } catch (err) {
      console.error('[API /api/tickets] Create failed:', err);
    }
  };

  const advanceLeadStage = async (leadId: string, nextStage: Lead['stage']) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, stage: nextStage };
      }
      return l;
    }));
    addNotification('Lead Advanced', `Lead status updated to ${nextStage}.`, 'LEAD');

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage })
      });
    } catch (err) {
      console.error('[API /api/leads/[id]] Update failed:', err);
    }
  };

  const executeInsightAction = (insight: AIInsight) => {
    if (insight.actionPayload === 'REMIND_OVERDUE') {
      addNotification('WhatsApp Sent', 'Automated polite WhatsApp reminder dispatched to Rahul Menon (+91 98950 33411) with UPI quick-pay link.', 'RENT');
      setAiInsights(prev => prev.filter(i => i.id !== insight.id));
    } else if (insight.actionPayload === 'APPROVE_TICKET_8842') {
      approveTicket('tkt-002');
    } else if (insight.actionPayload === 'NAV_LEADS') {
      setActiveView('leads');
    } else {
      addNotification('Action Executed', `Processed: ${insight.actionText}`, 'SYSTEM');
    }
  };

  const addElectricityBill = async (bill: ElectricityBill) => {
    setElectricityBills(prev => [bill, ...prev]);
    addNotification('Electricity Bill Uploaded', `Uploaded bill of ₹${bill.totalAmount.toLocaleString('en-IN')} for ${bill.tenantName} (Unit ${bill.unitNumber}). Attached: ${bill.attachmentName || 'Bill Document'}`, 'RENT');

    try {
      await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill)
      });
    } catch (err) {
      console.error('[API /api/bills] Create failed:', err);
    }
  };

  const updateElectricityBill = (id: string, updates: Partial<ElectricityBill>) => {
    setElectricityBills(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updatePGBedStatus = async (bedId: string, newStatus: PGBedStatus) => {
    setPgBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
    addNotification('Bed Status Updated', `Bed ${bedId} updated to ${newStatus}`, 'SYSTEM');

    try {
      await fetch('/api/pg/beds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, status: newStatus })
      });
    } catch (err) {
      console.error('[API /api/pg/beds] Update failed:', err);
    }
  };

  const addCommercialVisitor = async (visitor: Omit<CommercialVisitor, 'id' | 'passCode' | 'status'>) => {
    const newVis: CommercialVisitor = {
      ...visitor,
      id: `vis-${Date.now()}`,
      passCode: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Checked In',
      checkInTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setCommercialVisitors(prev => [newVis, ...prev]);
    addNotification('Visitor Pass Generated', `QR Gate pass issued for ${visitor.visitorName} (${visitor.hostCompany})`, 'SYSTEM');

    try {
      await fetch('/api/commercial/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitor)
      });
    } catch (err) {
      console.error('[API /api/commercial/visitors] Create failed:', err);
    }
  };

  const toggleMoveFlowTask = async (taskId: string) => {
    setMoveFlowChecklist(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));

    try {
      await fetch('/api/moveflow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId })
      });
    } catch (err) {
      console.error('[API /api/moveflow] Toggle failed:', err);
    }
  };

  const resolveDepositDispute = async (disputeId: string, status: DepositSettlementDispute['status']) => {
    setDepositDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status } : d));
    addNotification('Deposit Settlement Updated', `Dispute ${disputeId} status transitioned to: ${status}`, 'RENT');

    try {
      await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: disputeId, updates: { status } })
      });
    } catch (err) {
      console.error('[API /api/disputes] Update failed:', err);
    }
  };

  const addReferral = async (referral: Omit<TenantReferralItem, 'id' | 'date'>) => {
    const newRef: TenantReferralItem = {
      ...referral,
      id: `ref-${Date.now()}`,
      date: 'Today'
    };
    setReferrals(prev => [newRef, ...prev]);
    addNotification('Referral Logged', `Referral registered for ${referral.referredName}. Reward balance credited!`, 'SYSTEM');

    try {
      await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referral)
      });
    } catch (err) {
      console.error('[API /api/referrals] Create failed:', err);
    }
  };

  const addPgMeal = (mealData: Omit<PGMealPlan, 'id'>) => {
    const newMeal: PGMealPlan = {
      ...mealData,
      id: `meal-${Date.now()}`
    };
    setPgMeals(prev => [newMeal, ...prev]);
    addNotification('Meal Plan Created', `${newMeal.mealType} meal plan (${newMeal.vendor}) added successfully.`, 'SYSTEM');
  };

  const updatePgMeal = (id: string, mealData: Partial<PGMealPlan>) => {
    setPgMeals(prev => prev.map(m => m.id === id ? { ...m, ...mealData } : m));
    addNotification('Meal Plan Updated', `Meal plan details updated.`, 'SYSTEM');
  };

  const deletePgMeal = (id: string) => {
    setPgMeals(prev => prev.filter(m => m.id !== id));
    addNotification('Meal Plan Deleted', `Meal plan removed from mess operations.`, 'SYSTEM');
  };

  const createTenantConnectionRequest = async (reqData: Omit<TenantConnectionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: TenantConnectionRequest = {
      ...reqData,
      id: `conn-${Date.now()}`,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    };
    setTenantConnectionRequests(prev => {
      const updated = [newReq, ...prev];
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Connection Request Sent', `Your connection request for Unit ${reqData.unitNumber} with mandatory eKYC & verified docs was submitted. Awaiting owner approval.`, 'SYSTEM');

    try {
      const res = await fetch('/api/tenant-connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      const data = await res.json();
      if (data?.success && data?.data) {
        setTenantConnectionRequests(prev => {
          const updated = [data.data, ...prev.filter(r => r.id !== newReq.id && r.id !== data.data.id)];
          try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
          return updated;
        });
      }
      broadcastSync('CONNECTION_REQUEST_CREATED', newReq);
      await loadDatabaseData(undefined, true);
    } catch (e) {
      console.warn('[TenantConnection] SQLite sync error:', e);
    }
  };

  const approveTenantConnectionRequest = async (id: string) => {
    const req = tenantConnectionRequests.find(r => r.id === id);
    if (!req) return;

    const isDemo = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';
    const ownerProps = isDemo 
      ? properties 
      : properties.filter(p => p.ownerId === currentUser.id);

    let targetProp = ownerProps.find(p => p.id === req.propertyId) || 
                     ownerProps.find(p => p.name?.toLowerCase() === req.propertyName?.toLowerCase()) || 
                     ownerProps[0];

    // An owner must have at least one property before approving or onboarding a tenant
    if (!targetProp) {
      addNotification('Property Required', 'You must add at least one property to your portfolio before approving a tenant connection.', 'SYSTEM');
      setIsAddPropertyOpen(true);
      return;
    }

    // Property must be verified by Platform Admin
    if (targetProp.verificationStatus !== 'APPROVED') {
      addNotification('Admin Verification Required', `"${targetProp.name}" is pending Platform Admin verification. You can only connect tenants to admin-approved properties.`, 'SYSTEM');
      return;
    }

    // Mandatory eKYC verification
    if (!req.aadhaarNumber || !req.panNumber) {
      addNotification('eKYC Required', `${req.tenantName} has not completed digital eKYC (Aadhaar & PAN). Verification is required before lease execution.`, 'SYSTEM');
      return;
    }

    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      userId: req.tenantUserId,
      name: req.tenantName,
      email: req.tenantEmail,
      phone: req.tenantPhone,
      propertyId: targetProp.id,
      propertyName: targetProp.name,
      unitNumber: req.unitNumber,
      monthlyRent: req.monthlyRent,
      depositPaid: req.depositScheme === 'ZERO_DEPOSIT_PROTECT' ? 0 : (req.depositAmount || 0),
      depositScheme: req.depositScheme || 'ZERO_DEPOSIT_PROTECT',
      leaseStart: req.leaseStartDate || '01 Oct 2026',
      leaseEnd: '30 Sep 2027',
      rentDueDate: 5,
      autopayActive: true,
      reliabilityScore: 98,
      kycVerified: true,
      rewardsBalance: 500,
      emergencyContact: '+91 98450 11928',
      tenancyType: req.tenancyType || 'Residential',
      hasFood: req.tenancyType === 'PG' && Boolean(req.includeFoodPlan),
      aadhaarNumber: req.aadhaarNumber,
      panNumber: req.panNumber,
      documents: req.documents || [],
      status: 'Active'
    };

    setTenants(prev => [newTenant, ...prev.filter(t => t.email?.toLowerCase() !== req.tenantEmail.toLowerCase())]);

    const newInvoice: RentInvoice = {
      id: generateInvoiceId(),
      invoiceNumber: generateInvoiceNumber(),
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      propertyId: newTenant.propertyId,
      propertyName: newTenant.propertyName,
      unitNumber: newTenant.unitNumber,
      period: 'October 2026',
      baseRent: newTenant.monthlyRent,
      camCharges: 1500,
      utilityCharges: 0,
      totalAmount: newTenant.monthlyRent + 1500,
      paidAmount: 0,
      dueDate: '05 Nov 2026',
      status: 'Due'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    setTenantConnectionRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r);
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addNotification('Tenant Connected', `${req.tenantName} is now officially connected with verified eKYC & Agreement to Unit ${req.unitNumber}.`, 'SYSTEM');

    try {
      await fetch('/api/tenant-connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'APPROVED' })
      });
      await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: req.tenantUserId,
          name: newTenant.name,
          phone: newTenant.phone,
          email: newTenant.email,
          propertyId: newTenant.propertyId,
          propertyName: newTenant.propertyName,
          unitNumber: newTenant.unitNumber,
          monthlyRent: newTenant.monthlyRent,
          deposit: newTenant.depositPaid,
          leaseStart: newTenant.leaseStart,
          leaseEnd: newTenant.leaseEnd,
          rentDueDate: newTenant.rentDueDate,
          tenancyType: newTenant.tenancyType,
          hasFood: newTenant.hasFood,
          aadhaarNumber: newTenant.aadhaarNumber,
          panNumber: newTenant.panNumber,
          documents: newTenant.documents
        })
      });
      broadcastSync('TENANT_APPROVED', { tenantId: newTenant.id, propertyId: targetProp.id });
      await loadDatabaseData(currentUser, true);
    } catch (e) {
      console.warn('[TenantConnection] Approval sync error:', e);
    }
  };

  const rejectTenantConnectionRequest = async (id: string) => {
    setTenantConnectionRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'REJECTED' as const } : r);
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Request Declined', 'The tenant connection request has been declined.', 'SYSTEM');
    try {
      await fetch('/api/tenant-connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'REJECTED' })
      });
    } catch (e) {}
  };

  const requestTenantMoveOut = async (requestId: string, details: { moveOutDate: string; moveOutReason: string }) => {
    setTenantConnectionRequests(prev => {
      const updated = prev.map(r => r.id === requestId ? {
        ...r,
        status: 'MOVE_OUT_PENDING' as const,
        moveOutDate: details.moveOutDate,
        moveOutReason: details.moveOutReason
      } : r);
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Move-Out Requested', 'Move-out inspection & deposit settlement requested. Awaiting owner verification.', 'RENT');
    try {
      await fetch('/api/tenant-connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: 'MOVE_OUT_PENDING',
          moveOutDate: details.moveOutDate,
          moveOutReason: details.moveOutReason
        })
      });
    } catch (e) {}
  };

  const verifyAndSettleMoveOut = async (requestId: string, details: { inspectionNotes?: string; depositSettledAmount?: number }) => {
    const req = tenantConnectionRequests.find(r => r.id === requestId);
    if (!req) return;

    const today = new Date().toISOString().split('T')[0];

    // Mark as past tenant instead of deleting
    setTenants(prev => prev.map(t => {
      if (t.userId === req.tenantUserId || (t.email && req.tenantEmail && t.email.toLowerCase() === req.tenantEmail.toLowerCase())) {
        return {
          ...t,
          status: 'Moved Out' as const,
          vacatedAt: today
        };
      }
      return t;
    }));

    setTenantConnectionRequests(prev => {
      const updated = prev.map(r => r.id === requestId ? {
        ...r,
        status: 'MOVED_OUT' as const,
        inspectionNotes: details.inspectionNotes || 'MoveFlow inspection completed. Deposit balance settled.',
        depositSettledAmount: details.depositSettledAmount ?? req.depositAmount,
        moveOutDate: today
      } : r);
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addNotification('Move-Out Verified', `Move-out verified for ${req.tenantName}. Tenant moved to Past Residents archive.`, 'RENT');
    try {
      await fetch('/api/tenant-connections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: 'MOVED_OUT',
          inspectionNotes: details.inspectionNotes,
          depositSettledAmount: details.depositSettledAmount ?? req.depositAmount
        })
      });
    } catch (e) {}
  };

  const disconnectTenant = async (tenantId: string, reason: string = 'Moved Out / Lease Completed') => {
    const today = new Date().toISOString().split('T')[0];
    const target = tenants.find(t => t.id === tenantId);
    const tenantName = target?.name || 'Resident';

    // Update in-memory tenants state
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return {
          ...t,
          status: 'Moved Out' as const,
          vacatedAt: today
        };
      }
      return t;
    }));

    // Update any matching connection request
    setTenantConnectionRequests(prev => {
      const updated = prev.map(r => {
        if ((target?.email && r.tenantEmail?.toLowerCase() === target.email.toLowerCase()) || (target?.userId && r.tenantUserId === target.userId)) {
          return {
            ...r,
            status: 'MOVED_OUT' as const,
            moveOutDate: today,
            moveOutReason: reason
          };
        }
        return r;
      });
      try { localStorage.setItem('staywise_tenant_connections', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addNotification(
      'Tenant Disconnected / Moved Out',
      `${tenantName} has been disconnected and archived under Past Tenants.`,
      'SYSTEM'
    );

    try {
      const effectiveToken = sessionToken || (typeof window !== 'undefined' ? sessionStorage.getItem('staywise_token') || localStorage.getItem('staywise_token') : null);
      await fetch('/api/tenants', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(effectiveToken ? { 'Authorization': `Bearer ${effectiveToken}` } : {})
        },
        body: JSON.stringify({
          id: tenantId,
          status: 'Moved Out',
          vacatedAt: today,
          moveOutReason: reason
        })
      });
    } catch (e) {}
  };

  const addDelegate = (delegateData: Omit<AuthorizedDelegate, 'id' | 'invitedAt' | 'status'> & { status?: AuthorizedDelegate['status'] }) => {
    const newDelegate: AuthorizedDelegate = {
      ...delegateData,
      id: `del-${Date.now()}`,
      status: delegateData.status || 'Active',
      invitedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      addedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      permissions: delegateData.permissions || [],
      canWithdrawFunds: false // STRICT SECURITY: Delegates CANNOT withdraw funds! Only owner can withdraw!
    };
    setDelegates(prev => {
      const updated = [newDelegate, ...prev];
      try { localStorage.setItem('staywise_delegates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Delegate Invited', `${newDelegate.name} (${newDelegate.role}) granted access. Fund withdrawals restricted to owner only.`, 'SYSTEM');
  };

  const updateDelegatePermissions = (id: string, permissions: string[]) => {
    setDelegates(prev => {
      const updated = prev.map(d => d.id === id ? {
        ...d,
        permissions,
        canWithdrawFunds: false // ALWAYS enforce false
      } : d);
      try { localStorage.setItem('staywise_delegates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Permissions Updated', 'Delegate access scope updated. Fund withdrawals restricted.', 'SYSTEM');
  };

  const revokeDelegate = (id: string) => {
    setDelegates(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, status: 'Suspended' as const } : d);
      try { localStorage.setItem('staywise_delegates', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Access Revoked', 'Delegate permissions have been revoked.', 'SYSTEM');
  };

  const addFoodMenuItem = (itemData: Omit<FoodMenuItem, 'id'>) => {
    const newItem: FoodMenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`
    };
    setFoodMenuItems(prev => {
      const updated = [newItem, ...prev];
      try { localStorage.setItem('staywise_food_menu', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Menu Item Added', `${newItem.mealType} (${newItem.dietaryType}) menu item added.`, 'RENT');
  };

  const deleteFoodMenuItem = (id: string) => {
    setFoodMenuItems(prev => {
      const updated = prev.filter(m => m.id !== id);
      try { localStorage.setItem('staywise_food_menu', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Menu Item Removed', 'Menu item removed.', 'SYSTEM');
  };

  const addEstateAsset = (assetData: Omit<EstateAsset, 'id'>) => {
    const newAsset: EstateAsset = {
      ...assetData,
      id: `ea-${Date.now()}`
    };
    setEstateAssets(prev => [newAsset, ...prev]);
    addNotification('Campus Asset Registered', `${newAsset.name} (${newAsset.tag}) added to estate registry.`, 'SYSTEM');
  };

  const deleteEstateAsset = (id: string) => {
    setEstateAssets(prev => prev.filter(a => a.id !== id));
    addNotification('Asset Removed', 'Campus physical asset removed from registry.', 'SYSTEM');
  };

  const addStaffMember = (memberData: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      ...memberData,
      id: `staff-${Date.now()}`
    };
    setStaff(prev => [newStaff, ...prev]);
    addNotification('Staff Member Added', `${newStaff.name} assigned as ${newStaff.role}.`, 'SYSTEM');
  };

  const deleteStaffMember = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    addNotification('Staff Removed', 'Staff member unassigned.', 'SYSTEM');
  };

  const refreshSubscription = async () => {
    try {
      const url = currentUser?.id ? `/api/subscription?userId=${encodeURIComponent(currentUser.id)}` : '/api/subscription';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setSubscription(json.data);
      }
    } catch (err) {
      console.error('[Staywise Subscription] Refresh failed:', err);
    }
  };

  const upgradeSubscription = async (
    planId: SubscriptionTierId,
    billingCycle: 'monthly' | 'annual',
    paymentMethod: string = 'Axis Bank Escrow Auto-Debit'
  ): Promise<{ success: boolean; error?: string; subscription?: OwnerSubscription }> => {
    try {
      // Step 1: Request cryptographically signed checkout session (server-authoritative pricing)
      const checkoutRes = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId, 
          billingCycle, 
          userId: currentUser?.id || currentUser?.email || 'user-owner-vikram' 
        })
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.success) {
        return { success: false, error: checkoutData.error || 'Failed to initialize secure checkout session' };
      }

      const { sessionToken } = checkoutData.data;

      // Step 2: Cross-check with payment aggregator & verify signed session (HMAC verified, replay protected)
      const verifyRes = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          paymentMethod,
          gatewayProvider: 'Razorpay & Cashfree Aggregator Escrow Gateway',
          gatewayOrderId: `ORD-AGGR-${Date.now()}`,
          gatewayPaymentId: `PAY-AGGR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          transactionRef: `TXN-STAY-SUB-${Date.now()}`
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        return { success: false, error: verifyData.error || 'Cryptographic verification failed' };
      }

      setSubscription(verifyData.data);
      addNotification(
        'Subscription Activated',
        `Your workspace has been successfully upgraded to ${verifyData.data.planName}. Statutory double-entry ledger entry created.`,
        'SYSTEM'
      );
      return { success: true, subscription: verifyData.data };
    } catch (err: any) {
      console.error('[Staywise Subscription] Upgrade failed:', err);
      return { success: false, error: err.message || 'Connection error during upgrade' };
    }
  };

  const startTrialSignup = async (payload: TrialSignupPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/trial-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to start 7-day trial.' };
      }

      if (data.property) {
        setProperties(prev => [data.property, ...prev]);
        setActivePortfolio(data.property.portfolio || 'all');
      }

      if (data.subscription) {
        setSubscription(data.subscription);
      }

      const newCred: DemoCredential = {
        role: payload.role,
        email: data.user.email,
        pass: payload.password,
        name: data.user.name,
        roleLabel: data.user.roleLabel,
        avatar: data.user.avatar,
        title: data.user.title,
        description: data.user.description
      };
      login(payload.role, newCred);

      addNotification(
        '7-Day Free Trial Activated!',
        `Welcome ${data.user.name}! Your 7-day risk-free trial is active (₹0 charged today). Autopay connected.`,
        'SYSTEM'
      );

      return { success: true };
    } catch (err: any) {
      console.error('[Staywise Trial] Signup error:', err);
      return { success: false, error: err.message || 'Connection failed' };
    }
  };

  const cancelTrial = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/subscription/cancel-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.email || 'user-owner-vikram' })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to cancel trial' };
      }

      if (data.data) {
        setSubscription(data.data);
      }
      addNotification(
        '7-Day Trial Cancelled',
        'Your trial has been cancelled and autopay revoked. Zero charges applied.',
        'SYSTEM'
      );
      return { success: true };
    } catch (err: any) {
      console.error('[Staywise Trial] Cancellation error:', err);
      return { success: false, error: err.message || 'Network error during cancellation' };
    }
  };

  // ==========================================
  // STAYWISE REWARDS & DEPOSIT PROTECT ACTIONS
  // ==========================================
  const earnWisePoints = async (
    actionType: RewardActionType,
    points: number,
    referenceId?: string,
    description?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          actionType,
          points,
          referenceId,
          description
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRewardsAccount(prev => prev ? {
          ...prev,
          currentBalance: json.data.newBalance,
          totalEarned: prev.totalEarned + points,
          currentStreak: actionType === 'RENT_PAID_ON_TIME' ? prev.currentStreak + 1 : prev.currentStreak
        } : null);
        setRewardsLedger(prev => [json.data.entry, ...prev]);
        addNotification('WisePoints Earned! ✦', `+${points} WisePoints credited: ${description || actionType.replace(/_/g, ' ')}`, 'RENT');
        broadcastSync('WISEPOINTS_EARNED', { points, actionType });
        return true;
      }
      return false;
    } catch (err) {
      console.error('[earnWisePoints] Error:', err);
      return false;
    }
  };

  const redeemWisePoints = async (
    actionType: RewardActionType,
    points: number,
    referenceId?: string,
    description?: string
  ): Promise<{ success: boolean; voucherCode?: string; error?: string }> => {
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          actionType,
          points,
          referenceId,
          description
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRewardsAccount(prev => prev ? {
          ...prev,
          currentBalance: json.data.newBalance,
          totalRedeemed: prev.totalRedeemed + points
        } : null);
        if (json.data.ledgerEntry) {
          setRewardsLedger(prev => [json.data.ledgerEntry, ...prev]);
        }
        addNotification('WisePoints Redeemed! ✦', `Redeemed ${points} WisePoints. Voucher: ${json.data.voucherCode}`, 'RENT');
        broadcastSync('WISEPOINTS_REDEEMED', { points, actionType });
        return { success: true, voucherCode: json.data.voucherCode };
      }
      return { success: false, error: json.error || 'Redemption failed' };
    } catch (err: any) {
      console.error('[redeemWisePoints] Error:', err);
      return { success: false, error: err.message };
    }
  };

  const applyForDepositProtect = async (appData: Partial<DepositProtectionApplication>): Promise<boolean> => {
    try {
      const res = await fetch('/api/deposit-protect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentUser?.id,
          tenantName: currentUser?.name,
          tenantEmail: currentUser?.email,
          ...appData
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.application) {
          setDepositApplications(prev => [json.data.application, ...prev]);
        }
        if (json.data.contract) {
          setProtectionContracts(prev => [json.data.contract, ...prev]);
        }
        addNotification('Deposit Protect Active! 🛡️', `Zero-Deposit Guarantee Policy #${json.data.contract?.policyNumber || 'ACTIVE'} generated!`, 'SYSTEM');
        loadDatabaseData(undefined, true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[applyForDepositProtect] Error:', err);
      return false;
    }
  };

  const submitConditionReport = async (reportData: Partial<PropertyConditionReport>): Promise<boolean> => {
    try {
      const res = await fetch('/api/deposit-protect/condition-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentUser?.id,
          tenantName: currentUser?.name,
          ...reportData
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setConditionReports(prev => [json.data, ...prev]);
        addNotification('Condition Report Verified! 📸', `Inspection report saved. +100 WisePoints rewarded!`, 'RENT');
        loadDatabaseData(undefined, true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[submitConditionReport] Error:', err);
      return false;
    }
  };

  const submitProtectionClaim = async (claimData: Partial<ProtectionClaim>): Promise<boolean> => {
    try {
      const res = await fetch('/api/deposit-protect/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUser?.id,
          ownerName: currentUser?.name,
          ...claimData
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProtectionClaims(prev => [json.data, ...prev]);
        addNotification('Protection Claim Filed! ⚖️', `Claim for ₹${claimData.claimedAmount?.toLocaleString('en-IN')} submitted to underwriter risk pool.`, 'MAINTENANCE');
        loadDatabaseData(undefined, true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[submitProtectionClaim] Error:', err);
      return false;
    }
  };

  const settleProtectionClaim = async (claimId: string, approvedAmount?: number): Promise<boolean> => {
    try {
      const res = await fetch('/api/deposit-protect/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SETTLE_CLAIM',
          claimId,
          approvedAmount
        })
      });
      const json = await res.json();
      if (json.success) {
        setProtectionClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'SETTLED', approvedAmount, settlementDate: new Date().toISOString() } : c));
        addNotification('Claim Settled! 💰', `Payout cleared via Institutional Underwriter Guarantee!`, 'RENT');
        loadDatabaseData(undefined, true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[settleProtectionClaim] Error:', err);
      return false;
    }
  };

  const disputeProtectionClaim = async (claimId: string, reason?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/deposit-protect/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DISPUTE_CLAIM',
          claimId,
          disputeReason: reason
        })
      });
      const json = await res.json();
      if (json.success) {
        setProtectionClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'DISPUTED', disputeReason: reason } : c));
        addNotification('Claim Disputed! 🛡️', `Referred to Staywise Arbitration & Review desk.`, 'SYSTEM');
        loadDatabaseData(undefined, true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[disputeProtectionClaim] Error:', err);
      return false;
    }
  };

  return (
    <AppStateContext.Provider value={{
      isAuthenticated,
      currentUser,
      sessionToken,
      login,
      signupUser,
      toggleTwoFactor,
      logout,
      activeRole,
      setActiveRole: handleRoleChange,
      activePortfolio,
      setActivePortfolio,
      activeView,
      setActiveView,
      subscription,
      refreshSubscription,
      upgradeSubscription,
      startTrialSignup,
      cancelTrial,
      properties,
      tenants,
      invoices,
      ledger,
      tickets,
      leads,
      estateAssets,
      staff,
      utilities,
      electricityBills,
      aiInsights,
      notifications,
      users,
      refreshData: loadDatabaseData,
      pgBeds,
      pgRooms,
      pgMeals,
      addPgMeal,
      updatePgMeal,
      deletePgMeal,
      commercialUnits,
      camExpenses,
      commercialVisitors,
      moveFlowChecklist,
      depositDisputes,
      referrals,
      moneyLeaks,
      vacancyCosts,
      propertyPassport,
      tenantPassport,
      isSearchOpen,
      setIsSearchOpen,
      isAddPropertyOpen,
      setIsAddPropertyOpen,
      isExistingTenantWizardOpen,
      setIsExistingTenantWizardOpen,
      isPayRentOpen,
      setIsPayRentOpen,
      selectedInvoiceForPay,
      setSelectedInvoiceForPay,
      selectedReceiptInvoice,
      setSelectedReceiptInvoice,
      isCreateTicketOpen,
      setIsCreateTicketOpen,
      isScheduleVisitOpen,
      setIsScheduleVisitOpen,
      isUploadBillModalOpen,
      setIsUploadBillModalOpen,
      preselectedUnitForUpload,
      setPreselectedUnitForUpload,
      isEditPropertyModalOpen,
      setIsEditPropertyModalOpen,
      propertyToEdit,
      setPropertyToEdit,
      addProperty,
      updateProperty,
      deleteProperty,
      addExistingTenant,
      payInvoice,
      approveTicket,
      createMaintenanceTicket,
      advanceLeadStage,
      executeInsightAction,
      addElectricityBill,
      updateElectricityBill,
      markAllNotificationsRead,
      addNotification,
      updatePGBedStatus,
      addCommercialVisitor,
      toggleMoveFlowTask,
      resolveDepositDispute,
      addReferral,
      approveProperty,
      influencerOffers,
      addInfluencerOffer,
      toggleInfluencerOfferStatus,
      tenantConnectionRequests,
      createTenantConnectionRequest,
      approveTenantConnectionRequest,
      rejectTenantConnectionRequest,
      requestTenantMoveOut,
      verifyAndSettleMoveOut,
      disconnectTenant,
      delegates,
      addDelegate,
      updateDelegatePermissions,
      revokeDelegate,
      foodMenuItems,
      addFoodMenuItem,
      deleteFoodMenuItem,
      addEstateAsset,
      deleteEstateAsset,
      addStaffMember,
      deleteStaffMember,
      rewardsAccount,
      rewardsLedger,
      rewardRules,
      merchantOffers,
      depositApplications,
      protectionContracts,
      conditionReports,
      protectionClaims,
      earnWisePoints,
      redeemWisePoints,
      applyForDepositProtect,
      submitConditionReport,
      submitProtectionClaim,
      settleProtectionClaim,
      disputeProtectionClaim
    }}>
      {children}
    </AppStateContext.Provider>
  );
}


export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
