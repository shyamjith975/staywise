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
  InfluencerOffer
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_TENANTS, 
  INITIAL_INVOICES, 
  INITIAL_LEDGER, 
  INITIAL_TICKETS, 
  INITIAL_LEADS, 
  INITIAL_ESTATE_ASSETS, 
  INITIAL_STAFF, 
  INITIAL_UTILITIES, 
  INITIAL_AI_INSIGHTS,
  INITIAL_PG_BEDS,
  INITIAL_PG_ROOMS,
  INITIAL_PG_MEALS,
  INITIAL_COMMERCIAL_UNITS,
  INITIAL_CAM_EXPENSES,
  INITIAL_COMMERCIAL_VISITORS,
  INITIAL_MOVEFLOW_CHECKLIST,
  INITIAL_DEPOSIT_DISPUTES,
  INITIAL_REFERRALS,
  SAMPLE_PROPERTY_PASSPORT,
  SAMPLE_TENANT_PASSPORT,
  INITIAL_MONEY_LEAKS,
  INITIAL_VACANCY_COSTS
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'RENT' | 'MAINTENANCE' | 'LEAD' | 'SYSTEM';
}

export interface DemoCredential {
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
    role: 'owner' | 'estate_manager';
    portfolioName?: string;
    city?: string;
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
  }) => void;
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

const INITIAL_ELECTRICITY_BILLS: ElectricityBill[] = [
  {
    id: 'eb-302',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Luxury Apartments',
    unitNumber: '302',
    tenantName: 'Shyam Sundar',
    meterNumber: 'MTR-BLR-8921-A',
    billingMonth: 'October 2026',
    previousReading: 1420,
    currentReading: 1630,
    unitsConsumed: 210,
    ratePerUnit: 8.5,
    fixedCharges: 150,
    totalAmount: 1935,
    dueDate: '15 Oct 2026',
    status: 'Due',
    discom: 'BESCOM Bangalore',
    attachmentName: 'BESCOM_Oct2026_Bill_Unit302.pdf',
    fileSize: '420 KB',
    billDocumentUrl: '#',
    uploadedAt: '01 Oct 2026',
    notes: 'Sub-meter kWh + 10% common area lift/lobby power split'
  },
  {
    id: 'eb-201',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Luxury Apartments',
    unitNumber: '201',
    tenantName: 'Dr. Faisal Ahmed',
    meterNumber: 'MTR-BLR-8921-B',
    billingMonth: 'October 2026',
    previousReading: 2100,
    currentReading: 2440,
    unitsConsumed: 340,
    ratePerUnit: 8.5,
    fixedCharges: 150,
    totalAmount: 3040,
    dueDate: '15 Oct 2026',
    status: 'Paid',
    discom: 'BESCOM Bangalore',
    paidDate: '01 Oct 2026',
    attachmentName: 'BESCOM_Oct2026_Bill_Unit201.pdf',
    fileSize: '390 KB',
    billDocumentUrl: '#',
    uploadedAt: '01 Oct 2026',
    notes: 'Direct sub-meter reading verified by caretaker'
  },
  {
    id: 'eb-101',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Luxury Apartments',
    unitNumber: '101',
    tenantName: 'Rahul Menon',
    meterNumber: 'MTR-BLR-8921-C',
    billingMonth: 'October 2026',
    previousReading: 950,
    currentReading: 1110,
    unitsConsumed: 160,
    ratePerUnit: 8.5,
    fixedCharges: 150,
    totalAmount: 1510,
    dueDate: '15 Oct 2026',
    status: 'Due',
    discom: 'BESCOM Bangalore',
    attachmentName: 'BESCOM_Oct2026_Bill_Unit101.pdf',
    fileSize: '445 KB',
    billDocumentUrl: '#',
    uploadedAt: '01 Oct 2026',
    notes: 'Ground floor unit sub-meter'
  }
];

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('owner');
  const [currentUser, setCurrentUser] = useState<DemoCredential>(DEMO_CREDENTIALS.owner);
  const [activePortfolio, setActivePortfolio] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('dashboard');

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setCurrentUser(DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.owner);
  };

  const login = (role: UserRole, customUser?: Partial<DemoCredential>) => {
    setActiveRole(role);
    if (customUser) {
      setCurrentUser({
        role,
        email: customUser.email || DEMO_CREDENTIALS[role]?.email || 'user@staywise.com',
        pass: customUser.pass || '******',
        name: customUser.name || 'Member',
        roleLabel: customUser.roleLabel || DEMO_CREDENTIALS[role]?.roleLabel || 'Member',
        avatar: customUser.avatar || DEMO_CREDENTIALS[role]?.avatar || '👤',
        title: customUser.title || DEMO_CREDENTIALS[role]?.title || 'Portal Member',
        description: customUser.description || DEMO_CREDENTIALS[role]?.description || 'Active Member'
      });
    } else {
      setCurrentUser(DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.owner);
    }
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const signupUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'owner' | 'estate_manager';
    portfolioName?: string;
    city?: string;
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

      if (data.property) {
        setProperties(prev => [data.property, ...prev]);
        setActivePortfolio(data.property.portfolio || 'all');
      }

      const newCred: DemoCredential = {
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
        'Workspace Initialized!',
        `Welcome ${data.user.name}! Your ${data.user.roleLabel} portal and starter asset have been created.`,
        'SYSTEM'
      );

      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, error: err.message || 'Connection failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };
  
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [invoices, setInvoices] = useState<RentInvoice[]>(INITIAL_INVOICES);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [estateAssets] = useState<EstateAsset[]>(INITIAL_ESTATE_ASSETS);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [utilities] = useState<UtilityReading[]>(INITIAL_UTILITIES);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>(INITIAL_ELECTRICITY_BILLS);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [isUploadBillModalOpen, setIsUploadBillModalOpen] = useState(false);
  const [preselectedUnitForUpload, setPreselectedUnitForUpload] = useState<string | null>(null);

  // Asset Universe Engines
  const [pgBeds, setPgBeds] = useState<PGBed[]>(INITIAL_PG_BEDS);
  const [pgRooms] = useState<PGRoom[]>(INITIAL_PG_ROOMS);
  const [pgMeals] = useState<PGMealPlan[]>(INITIAL_PG_MEALS);
  const [commercialUnits] = useState<CommercialUnit[]>(INITIAL_COMMERCIAL_UNITS);
  const [camExpenses] = useState<CAMExpenseItem[]>(INITIAL_CAM_EXPENSES);
  const [commercialVisitors, setCommercialVisitors] = useState<CommercialVisitor[]>(INITIAL_COMMERCIAL_VISITORS);
  const [moveFlowChecklist, setMoveFlowChecklist] = useState<MoveFlowChecklistItem[]>(INITIAL_MOVEFLOW_CHECKLIST);
  const [depositDisputes, setDepositDisputes] = useState<DepositSettlementDispute[]>(INITIAL_DEPOSIT_DISPUTES);
  const [referrals, setReferrals] = useState<TenantReferralItem[]>(INITIAL_REFERRALS);
  const [moneyLeaks] = useState<MoneyLeakAlert[]>(INITIAL_MONEY_LEAKS);
  const [vacancyCosts] = useState<VacancyCostReport[]>(INITIAL_VACANCY_COSTS);
  const [propertyPassport] = useState<PropertyPassportData>(SAMPLE_PROPERTY_PASSPORT);
  const [tenantPassport] = useState<TenantPassportData>(SAMPLE_TENANT_PASSPORT);
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

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', title: 'Rent Overdue', message: 'Rahul Menon (Unit 101) is 6 days overdue.', time: '10m ago', read: false, type: 'RENT' },
    { id: 'notif-2', title: 'Emergency Ticket #8842', message: 'Concealed plumbing leak requires owner approval (₹4,500).', time: '1h ago', read: false, type: 'MAINTENANCE' },
    { id: 'notif-3', title: 'New Hot Lead', message: 'Kavita Nambiar booked showing for Unit 304 today at 5 PM.', time: '2h ago', read: false, type: 'LEAD' },
    { id: 'notif-4', title: 'PG Bed Notice Given', message: 'Sanjay Krishnan (Room 103 Bed A) gave notice for 20 Oct 2026.', time: '3h ago', read: false, type: 'SYSTEM' },
    { id: 'notif-5', title: 'CAM Adjustment Due', message: 'Infovision Tech Wing actual common power exceeded billing by 12%.', time: '5h ago', read: false, type: 'RENT' }
  ]);

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

  // Hydrate application state directly from persistent database via /api/bootstrap
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        const res = await fetch('/api/bootstrap');
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (Array.isArray(d.properties) && d.properties.length > 0) setProperties(d.properties);
          if (Array.isArray(d.tenants) && d.tenants.length > 0) setTenants(d.tenants);
          if (Array.isArray(d.invoices) && d.invoices.length > 0) setInvoices(d.invoices);
          if (Array.isArray(d.ledger) && d.ledger.length > 0) setLedger(d.ledger);
          if (Array.isArray(d.depositDisputes) && d.depositDisputes.length > 0) setDepositDisputes(d.depositDisputes);
          if (Array.isArray(d.influencerOffers) && d.influencerOffers.length > 0) setInfluencerOffers(d.influencerOffers);
          if (Array.isArray(d.tickets) && d.tickets.length > 0) setTickets(d.tickets);
          if (Array.isArray(d.electricityBills) && d.electricityBills.length > 0) setElectricityBills(d.electricityBills);
        }
      } catch (err) {
        console.warn('[Staywise Database] Hydrated using local store fallback:', err);
      }
    }
    loadDatabaseData();
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
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      name: newPropData.name || 'New Property',
      type: newPropData.type || 'Apartment',
      portfolio: newPropData.portfolio || 'Kozhikode Coastal',
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
    addNotification('Property Submitted for Verification', `${newProp.name} has been added. Pending Admin document audit and approval.`, 'SYSTEM');

    // Persist to database via API
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
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
      await fetch(`/api/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      });
    } catch (err) {
      console.error('[API /api/properties/[id]/verify] Verification failed:', err);
    }
  };

  const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
    // Optimistic UI update
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
    addNotification('Property Updated', `Property details updated successfully.`, 'SYSTEM');

    // Persist to database via API
    try {
      await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
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
      await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      });
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
  const addExistingTenant = (data: {
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
    const tenantId = `t-${Date.now()}`;
    const targetProp = properties.find(p => p.id === data.propertyId);
    const propName = targetProp ? targetProp.name : 'Beach Road Apartments';

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

    // Auto-generate First Rent Invoice
    const newInvoice: RentInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `STW-2026-10-${data.unitNumber}`,
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

    // Record Security Deposit in double-entry ledger
    const ledgerEntry: LedgerEntry = {
      id: `ledg-${Date.now()}`,
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
      // Create immutable Double Ledger record in UI
      const ledgerRecord: LedgerEntry = {
        id: `ledg-pay-${Date.now()}`,
        timestamp: '2026-10-01 12:00 PM',
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
    } catch (err) {
      console.error('[API /api/invoices/[id]/pay] Payment persist failed:', err);
    }
  };

  const approveTicket = (ticketId: string) => {
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
  };

  const createMaintenanceTicket = (ticketData: Partial<MaintenanceTicket>) => {
    const newTkt: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
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
      createdAt: '2026-10-01'
    };
    setTickets(prev => [newTkt, ...prev]);
    addNotification('Ticket Raised', `${newTkt.category} ticket #${newTkt.ticketNumber} logged for Unit ${newTkt.unitNumber}.`, 'MAINTENANCE');
  };

  const advanceLeadStage = (leadId: string, nextStage: Lead['stage']) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, stage: nextStage };
      }
      return l;
    }));
    addNotification('Lead Advanced', `Lead status updated to ${nextStage}.`, 'LEAD');
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

  const addElectricityBill = (bill: ElectricityBill) => {
    setElectricityBills(prev => [bill, ...prev]);
    addNotification('Electricity Bill Uploaded', `Uploaded bill of ₹${bill.totalAmount.toLocaleString('en-IN')} for ${bill.tenantName} (Unit ${bill.unitNumber}). Attached: ${bill.attachmentName || 'Bill Document'}`, 'RENT');
  };

  const updateElectricityBill = (id: string, updates: Partial<ElectricityBill>) => {
    setElectricityBills(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const updatePGBedStatus = (bedId: string, newStatus: PGBedStatus) => {
    setPgBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
    addNotification('Bed Status Updated', `Bed ${bedId} updated to ${newStatus}`, 'SYSTEM');
  };

  const addCommercialVisitor = (visitor: Omit<CommercialVisitor, 'id' | 'passCode' | 'status'>) => {
    const newVis: CommercialVisitor = {
      ...visitor,
      id: `vis-${Date.now()}`,
      passCode: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Checked In'
    };
    setCommercialVisitors(prev => [newVis, ...prev]);
    addNotification('Visitor Pass Generated', `QR Gate pass issued for ${visitor.visitorName} (${visitor.hostCompany})`, 'SYSTEM');
  };

  const toggleMoveFlowTask = (taskId: string) => {
    setMoveFlowChecklist(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const resolveDepositDispute = (disputeId: string, status: DepositSettlementDispute['status']) => {
    setDepositDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status } : d));
    addNotification('Deposit Settlement Updated', `Dispute ${disputeId} status transitioned to: ${status}`, 'RENT');
  };

  const addReferral = (referral: Omit<TenantReferralItem, 'id' | 'date'>) => {
    const newRef: TenantReferralItem = {
      ...referral,
      id: `ref-${Date.now()}`,
      date: 'Today'
    };
    setReferrals(prev => [newRef, ...prev]);
    addNotification('Referral Logged', `Referral registered for ${referral.referredName}. Reward balance credited!`, 'SYSTEM');
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
