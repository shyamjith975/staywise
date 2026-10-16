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
  TrialSignupPayload
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

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Rent Overdue', message: 'Rahul Menon (Unit 101) is 6 days overdue.', time: '10m ago', read: false, type: 'RENT' },
  { id: 'notif-2', title: 'Emergency Ticket #8842', message: 'Concealed plumbing leak requires owner approval (₹4,500).', time: '1h ago', read: false, type: 'MAINTENANCE' },
  { id: 'notif-3', title: 'New Hot Lead', message: 'Kavita Nambiar booked showing for Unit 304 today at 5 PM.', time: '2h ago', read: false, type: 'LEAD' },
  { id: 'notif-4', title: 'PG Bed Notice Given', message: 'Sanjay Krishnan (Room 103 Bed A) gave notice for 20 Oct 2026.', time: '3h ago', read: false, type: 'SYSTEM' },
  { id: 'notif-5', title: 'CAM Adjustment Due', message: 'Infovision Tech Wing actual common power exceeded billing by 12%.', time: '5h ago', read: false, type: 'RENT' }
];

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
    description: '3 Portfolios • 21 Units • Escrow Account Active'
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
    pass: 'admin@123',
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
  login: (role: UserRole, customUser?: Partial<DemoCredential>) => void;
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
  }) => Promise<{ success: boolean; error?: string }>;
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

  const login = (role: UserRole, customUser?: Partial<DemoCredential>) => {
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
      description: customUser.description || DEMO_CREDENTIALS[role]?.description || 'Active Member'
    } : (DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.owner);

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    setActiveView('dashboard');

    if (typeof window !== 'undefined') {
      try {
        // Tab-isolated storage
        sessionStorage.setItem('staywise_is_authenticated', 'true');
        sessionStorage.setItem('staywise_active_role', role);
        sessionStorage.setItem('staywise_active_view', 'dashboard');
        sessionStorage.setItem('staywise_current_user', JSON.stringify(userToSet));

        // Only persist normal user logins (owner, tenant, manager) to localStorage.
        // Admin logins remain in tab's sessionStorage to prevent hijacking client tabs.
        if (role !== 'admin') {
          localStorage.setItem('staywise_is_authenticated', 'true');
          localStorage.setItem('staywise_active_role', role);
          localStorage.setItem('staywise_active_view', 'dashboard');
          localStorage.setItem('staywise_current_user', JSON.stringify(userToSet));
        }
      } catch (e) {}
    }

    // Immediately reload scoped database data for this user
    const isDemo = userToSet.email === 'owner@staywise.com' || userToSet.id === 'user-owner-vikram' || role === 'admin';
    setNotifications(isDemo ? DEMO_NOTIFICATIONS : []);
    loadDatabaseData(userToSet);
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
        description: data.user.description
      };
      login(userData.role, newCred);

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

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('[Staywise Auth] Server logout call notice:', e);
    }
    setIsAuthenticated(false);
    setActiveView('login');
    try {
      // Purge tab-isolated session storage
      sessionStorage.removeItem('staywise_active_view');
      sessionStorage.removeItem('staywise_active_role');
      sessionStorage.removeItem('staywise_active_portfolio');
      sessionStorage.removeItem('staywise_current_user');
      sessionStorage.setItem('staywise_is_authenticated', 'false');

      // Purge cross-tab local storage
      localStorage.removeItem('staywise_active_view');
      localStorage.removeItem('staywise_active_role');
      localStorage.removeItem('staywise_active_portfolio');
      localStorage.removeItem('staywise_current_user');
      localStorage.setItem('staywise_is_authenticated', 'false');

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

  // Authoritative data loading function directly from persistent SQLite via /api/bootstrap
  const loadDatabaseData = async (userParam?: DemoCredential) => {
    try {
      const activeUser = userParam || currentUser;
      const url = activeUser?.id ? `/api/bootstrap?userId=${encodeURIComponent(activeUser.id)}` : '/api/bootstrap';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (Array.isArray(d.properties)) setProperties(d.properties);
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
        if (d.subscription) setSubscription(d.subscription);
        const isDemo = activeUser?.email === 'owner@staywise.com' || activeUser?.id === 'user-owner-vikram' || activeUser?.role === 'admin';
        setNotifications(isDemo ? DEMO_NOTIFICATIONS : []);
      }
    } catch (err) {
      console.warn('[Staywise Database] Hydrated using local store fallback:', err);
    }
  };

  // Multi-tab real-time sync engine
  useEffect(() => {
    loadDatabaseData();

    // 1. BroadcastChannel: instant (<50ms) reaction across open tabs
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('staywise_db_sync');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'DATA_UPDATED') {
            loadDatabaseData();
          }
        };
      }
    } catch (e) {}

    // 2. Window focus listener: immediately pulls latest data when user clicks between tabs
    const handleFocus = () => {
      loadDatabaseData();
    };
    window.addEventListener('focus', handleFocus);

    // 3. Fallback polling every 4 seconds to guarantee consistency across roles
    const interval = setInterval(() => {
      loadDatabaseData();
    }, 4000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

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
      name: newPropData.name || 'New Property',
      type: newPropData.type || 'Apartment',
      portfolio: newPropData.portfolio || (currentUser.name && currentUser.name !== 'Member' ? `${currentUser.name}'s Portfolio` : 'Kozhikode Coastal'),
      address: newPropData.address || 'Address',
      city: newPropData.city || 'Kozhikode',
      state: newPropData.state || 'Kerala',
      pincode: newPropData.pincode || '673001',
      totalUnits: newPropData.totalUnits || 1,
      occupiedUnits: newPropData.occupiedUnits || 0,
      expectedMonthlyRent: newPropData.expectedMonthlyRent || 25000,
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
    setProperties(prev => [newProp, ...prev]);
    // CRITICAL: Reset activePortfolio to 'all' so new property is immediately visible in owner view
    setActivePortfolio('all');
    addNotification('Property Submitted for Verification', `${newProp.name} has been added. Pending Admin document audit and approval.`, 'SYSTEM');
    broadcastSync('PROPERTY_ADDED', newProp);

    // Persist to database via API
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      broadcastSync('PROPERTY_ADDED', newProp);
    } catch (err) {
      console.error('[API /api/properties] Persist failed:', err);
    }
  };

  const approveProperty = async (propertyId: string) => {
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, verificationStatus: 'APPROVED', status: 'ACTIVE' } : p));
    addNotification('Property Verified & Approved', `Property documents approved. Active across Staywise platform.`, 'SYSTEM');
    broadcastSync('PROPERTY_APPROVED', { propertyId });

    // Persist to database via API
    try {
      await fetch(`/api/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
      broadcastSync('PROPERTY_APPROVED', { propertyId });
    } catch (err) {
      console.error('[API /api/properties/[id]/verify] Verification failed:', err);
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
    addNotification('Property Updated', `Property details updated successfully.`, 'SYSTEM');
    broadcastSync('PROPERTY_UPDATED', { propertyId, updates });

    // Persist to database via API
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      broadcastSync('PROPERTY_UPDATED', { propertyId, updates });
    } catch (err) {
      console.error('[API /api/properties/[id]] Update failed:', err);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    // Optimistic UI update
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    addNotification('Property Removed', `Property was removed from portfolio.`, 'SYSTEM');
    broadcastSync('PROPERTY_DELETED', { propertyId });

    // Persist to database via API
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      });
      broadcastSync('PROPERTY_DELETED', { propertyId });
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
  }) => {
    const tenantId = generateTenantId();
    const targetProp = properties.find(p => p.id === data.propertyId);
    const propName = targetProp ? targetProp.name : 'Staywise Property';

    const newTenant: Tenant = {
      id: tenantId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      propertyId: data.propertyId,
      propertyName: propName,
      unitNumber: data.unitNumber,
      monthlyRent: data.monthlyRent,
      depositPaid: data.deposit,
      leaseStart: data.leaseStart,
      leaseEnd: data.leaseEnd,
      rentDueDate: data.rentDueDate,
      autopayActive: true,
      reliabilityScore: 100,
      kycVerified: true,
      rewardsBalance: 500, // Onboarding welcome bonus
      emergencyContact: 'Family Primary Contact'
    };

    setTenants(prev => [...prev, newTenant]);

    // Update Property Unit status to OCCUPIED
    setProperties(prev => prev.map(p => {
      if (p.id === data.propertyId) {
        const updatedUnits = p.units.map(u => {
          if (u.unitNumber === data.unitNumber) {
            return {
              ...u,
              status: 'OCCUPIED' as const,
              currentTenantId: tenantId,
              currentTenantName: data.name,
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
      baseRent: data.monthlyRent,
      totalAmount: data.monthlyRent,
      paidAmount: 0,
      dueDate: `2026-10-${data.rentDueDate.toString().padStart(2, '0')}`,
      status: 'Due'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // Record Security Deposit in double-entry ledger with collision-free ID
    const ledgerEntry: LedgerEntry = {
      id: generateLedgerId(),
      timestamp: 'Just now',
      description: `Security Deposit Onboarded - Unit ${data.unitNumber} (${data.name})`,
      type: 'CREDIT',
      amount: data.deposit,
      account: 'Statutory Tenant Deposit Trust',
      entityType: 'SECURITY_DEPOSIT',
      referenceId: newInvoice.invoiceNumber,
      settlementStatus: 'CLEARED'
    };
    setLedger(prev => [ledgerEntry, ...prev]);
    addNotification('Tenant Connected', `${data.name} has accepted the digital onboarding invite for Unit ${data.unitNumber}.`, 'RENT');
    broadcastSync('TENANT_ONBOARDED', { tenantId });

    // Authoritative API call to persist to SQLite database
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        const d = resJson.data;
        if (d.tenant) {
          setTenants(prev => prev.map(t => t.id === tenantId ? d.tenant : t));
        }
        if (d.property) {
          setProperties(prev => prev.map(p => p.id === d.property.id ? d.property : p));
        }
        if (d.invoice) {
          setInvoices(prev => [d.invoice, ...prev.filter(i => i.id !== newInvoice.id)]);
        }
        if (d.ledgerEntry) {
          setLedger(prev => [d.ledgerEntry, ...prev.filter(l => l.id !== ledgerEntry.id)]);
        }
      }
      broadcastSync('TENANT_ONBOARDED', { tenantId });
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
      broadcastSync('INVOICE_PAID', { invoiceId, method });
    }

    // Persist payment to database via API
    try {
      await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: method })
      });
      broadcastSync('INVOICE_PAID', { invoiceId, method });
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
    broadcastSync('TICKET_APPROVED', { ticketId });
    
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
    broadcastSync('TICKET_CREATED', newTkt);

    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTkt)
      });
      broadcastSync('TICKET_CREATED', newTkt);
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

  const refreshSubscription = async () => {
    try {
      const res = await fetch('/api/subscription');
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
          userId: currentUser.email || 'user-owner-vikram' 
        })
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.success) {
        return { success: false, error: checkoutData.error || 'Failed to initialize secure checkout session' };
      }

      const { sessionToken } = checkoutData.data;

      // Step 2: Verify signed session and execute upgrade (HMAC verified, replay protected)
      const verifyRes = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          paymentMethod,
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

  return (
    <AppStateContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      signupUser,
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
      toggleInfluencerOfferStatus
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
