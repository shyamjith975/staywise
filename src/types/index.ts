/**
 * ============================================================================
 * STAYWISE PLATFORM — CORE DOMAIN TYPE SYSTEM & DATA SCHEMAS
 * ============================================================================
 * This file contains canonical TypeScript definitions for the entire Staywise
 * multi-asset property management platform.
 * 
 * CORE SECTIONS:
 * 1. User Roles & Access Control (Owner, Tenant, Manager, Admin, Vendor, Estate)
 * 2. Property & Asset Models (Residential, PG/Co-Living, Commercial, Luxury Villas)
 * 3. Leases, Tenants & MoveFlow Inspection Data
 * 4. RentFlow Invoices, Sub-meter Electricity & Double-Entry Ledger Entries
 * 5. Maintenance Tickets & Vendor Escrow Payouts
 * 6. Influencer Campaigns, Promo Codes & Referral Commission Models
 * 
 * BACKEND DEVELOPERS:
 * When connecting to a database (PostgreSQL, Supabase, Prisma, etc.), each
 * interface here directly maps to a database table or relational model.
 * ============================================================================
 */

export type UserRole = 
  | 'owner' 
  | 'tenant' 
  | 'manager' 
  | 'vendor' 
  | 'admin'
  | 'estate_manager';

export type PropertyStatus = 
  | 'ACTIVE' 
  | 'VACANT' 
  | 'LISTED' 
  | 'UNDER_MAINTENANCE' 
  | 'OCCUPIED' 
  | 'PARTIALLY_OCCUPIED' 
  | 'RESERVED' 
  | 'ARCHIVED';

export type AssetUniverseCategory = 
  | 'residential' 
  | 'shared_living' 
  | 'commercial' 
  | 'estate';

export type PropertyType = 
  // Residential
  | 'Apartment' 
  | 'Flat' 
  | 'Independent House' 
  | 'Villa' 
  | 'Duplex' 
  | 'Studio' 
  | 'Room' 
  | 'Shared Room' 
  | 'Serviced Apartment' 
  | 'Holiday Home' 
  | 'Vacation Rental' 
  | 'Senior Living' 
  | 'Student Accommodation'
  // Shared / Managed Living
  | 'PG' 
  | 'Hostel' 
  | 'Co-living' 
  | 'Dormitory' 
  | 'Student Housing' 
  | 'Working-Professional Housing' 
  | 'Women\'s PG' 
  | 'Men\'s PG' 
  | 'Family PG'
  // Commercial
  | 'Commercial'
  | 'Commercial Building'
  | 'Office' 
  | 'Office Building' 
  | 'Shop' 
  | 'Retail Space' 
  | 'Showroom' 
  | 'Restaurant Space' 
  | 'Mall Unit' 
  | 'Business Centre' 
  | 'Coworking Space' 
  | 'Clinic' 
  | 'School/Training Centre' 
  | 'Warehouse' 
  | 'Godown' 
  | 'Industrial Unit' 
  | 'Industrial Property'
  | 'Factory' 
  | 'Workshop' 
  | 'Commercial Complex'
  // Large Assets / Estates
  | 'Estate'
  | 'Villa Estate' 
  | 'Farmhouse' 
  | 'Plantation' 
  | 'Agricultural Estate' 
  | 'Holiday Estate' 
  | 'Gated Community' 
  | 'Private Estate' 
  | 'Resort Property' 
  | 'Corporate Campus' 
  | 'Industrial Estate' 
  | 'Business Park' 
  | 'Logistics Park';

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  type: string;
  rentAmount: number;
  depositAmount: number;
  status: 'OCCUPIED' | 'VACANT' | 'UNDER_MAINTENANCE' | 'RESERVED' | 'PARTIALLY_OCCUPIED';
  currentTenantId?: string;
  currentTenantName?: string;
  leaseEnd?: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  portfolio: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalUnits: number;
  occupiedUnits: number;
  expectedMonthlyRent: number;
  collectedRent: number;
  pendingRent: number;
  imageUrl: string;
  status: PropertyStatus;
  healthScore: number;
  units: PropertyUnit[];
  amenities: string[];
  verificationStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';
  submittedDocs?: string[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  monthlyRent: number;
  depositPaid: number;
  leaseStart: string;
  leaseEnd: string;
  rentDueDate: number; // day of month, e.g. 5
  salaryDate?: number;
  autopayActive: boolean;
  reliabilityScore: number;
  kycVerified: boolean;
  rewardsBalance: number;
  emergencyContact: string;
}

export type RentStatus = 
  | 'Upcoming' 
  | 'Due' 
  | 'Partially Paid' 
  | 'Paid' 
  | 'Overdue' 
  | 'Failed';

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  period: string; // e.g. "October 2026"
  baseRent: number;
  camCharges?: number;
  utilityCharges?: number;
  lateFee?: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: RentStatus;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Card' | 'Autopay' | 'FlexPay';
  paidDate?: string;
  transactionId?: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  description: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  account: string;
  entityType: 'RENT' | 'MAINTENANCE' | 'SECURITY_DEPOSIT' | 'SETTLEMENT';
  referenceId: string;
  settlementStatus: 'PENDING' | 'CLEARED' | 'RECONCILED';
}

export type MaintenancePriority = 'Emergency' | 'High' | 'Medium' | 'Low';
export type MaintenanceStatus = 
  | 'Created' 
  | 'Triaged' 
  | 'Approved' 
  | 'Vendor Assigned' 
  | 'Scheduled'
  | 'In Progress' 
  | 'Completed' 
  | 'Tenant Confirmed' 
  | 'Closed';

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  category: 'Electrical' | 'Plumbing' | 'AC' | 'Appliance' | 'Cleaning' | 'Structural' | 'Other';
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimatedCost: number;
  actualCost?: number;
  requiresOwnerApproval: boolean;
  ownerApproved?: boolean;
  vendorId?: string;
  vendorName?: string;
  createdAt: string;
  scheduledDate?: string;
  completedAt?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredArea: string;
  budgetMin: number;
  budgetMax: number;
  moveInUrgency: 'Immediate' | 'Within 15 Days' | 'Next Month';
  scoreCategory: 'Hot' | 'Warm' | 'Cold';
  scoreExplanation: string;
  stage: 'New' | 'Contacted' | 'Qualified' | 'Visit Scheduled' | 'Visited' | 'Interested' | 'Converted';
  propertyInterest: string;
  source: string;
  createdAt: string;
  assignedAgent: string;
  visitDate?: string;
}

export interface EstateAsset {
  id: string;
  name: string;
  tag: string;
  category: 'AC Unit' | 'Generator' | 'Solar System' | 'Water Pump' | 'Smart Locks' | 'CCTV';
  estateName: string;
  purchaseDate: string;
  warrantyUntil: string;
  amcProvider: string;
  lastService: string;
  nextService: string;
  condition: 'Excellent' | 'Good' | 'Needs Service' | 'Critical';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Security' | 'Caretaker' | 'Gardener' | 'Housekeeping' | 'Electrician' | 'Manager';
  estateName: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Full-time';
  attendanceStatus: 'Present' | 'On Leave' | 'Off Duty';
  monthlySalary: number;
}

export interface UtilityReading {
  id: string;
  utilityType: 'Electricity' | 'Water' | 'Generator Fuel' | 'Solar Grid';
  estateName: string;
  meterNumber: string;
  previousReading: number;
  currentReading: number;
  consumptionUnit: string;
  billAmount: number;
  readingDate: string;
  paymentStatus: 'Paid' | 'Pending';
}

export interface AIInsight {
  id: string;
  category: 'URGENT' | 'FINANCIAL' | 'VACANCY' | 'MAINTENANCE';
  title: string;
  description: string;
  impactAmount?: number;
  actionText: string;
  actionPayload?: string;
}

export interface ElectricityBill {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  meterNumber: string;
  billingMonth: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  fixedCharges: number;
  totalAmount: number;
  dueDate: string;
  status: 'Paid' | 'Due' | 'Overdue';
  discom: string;
  paidDate?: string;
  attachmentName?: string;
  fileSize?: string;
  billDocumentUrl?: string;
  uploadedAt?: string;
  notes?: string;
}

export interface Roommate {
  id: string;
  name: string;
  phone: string;
  email: string;
  splitPercentage: number;
  rentShare: number;
  utilityShare: number;
  totalPayable: number;
  status: 'Paid' | 'Pending';
  isPrimary: boolean;
}

export interface AuthorizedDelegate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Accountant' | 'Property Manager' | 'Tax Auditor';
  permissions: string[];
  addedDate: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

// ----------------------------------------------------
// PG / SHARED LIVING ENGINE (Sections 4-11)
// ----------------------------------------------------
export type PGBedStatus = 
  | 'Available' 
  | 'Occupied' 
  | 'Reserved' 
  | 'Maintenance' 
  | 'Blocked' 
  | 'Notice Given' 
  | 'Cleaning';

export interface PGBed {
  id: string;
  bedCode: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  sharingType: 'Single' | '2-Sharing' | '3-Sharing' | '4-Sharing';
  status: PGBedStatus;
  monthlyRent: number;
  deposit: number;
  tenantId?: string;
  tenantName?: string;
  tenantPhone?: string;
  expectedVacantDate?: string;
  noticeGivenDate?: string;
  ac: boolean;
  attachedBath: boolean;
  foodIncluded: boolean;
  wifiIncluded: boolean;
  laundryIncluded: boolean;
}

export interface PGRoom {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  sharingType: 'Single' | '2-Sharing' | '3-Sharing' | '4-Sharing';
  beds: PGBed[];
  electricitySplitMethod: 'Equal' | 'Submeter' | 'Room-level';
  submeterReading?: number;
  roomRentTotal: number;
}

export interface PGMealPlan {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  menu: string;
  vendor: string;
  optedInCount: number;
  costPerMeal: number;
}

// ----------------------------------------------------
// COMMERCIAL & CAM ENGINE (Sections 12-21)
// ----------------------------------------------------
export interface CommercialUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  businessName: string;
  businessType: string;
  areaSqFt: number;
  baseRent: number;
  camRatePerSqFt: number;
  camAmount: number;
  parkingSlots: number;
  lockInPeriodMonths: number;
  noticePeriodMonths: number;
  escalationPercent: number;
  fitOutStatus: 'Not Applicable' | 'In Progress' | 'Electrical & Interiors' | 'Ready for Opening';
  status: 'Occupied' | 'Vacant' | 'Fit-out' | 'Reserved';
}

export interface CAMExpenseItem {
  id: string;
  category: 'Security' | 'Housekeeping' | 'Lift AMC' | 'Generator Diesel' | 'Common Electricity' | 'Water Tanker' | 'Landscaping' | 'Fire Safety';
  monthlyCost: number;
  allocationMethod: 'Area-based' | 'Fixed' | 'Percentage' | 'Custom';
  vendorName: string;
}

export interface CommercialVisitor {
  id: string;
  visitorName: string;
  hostCompany: string;
  purpose: string;
  vehicleNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  passCode: string;
  status: 'Checked In' | 'Checked Out';
}

// ----------------------------------------------------
// MOVEFLOW, RETENTION & PASSPORTS (Sections 27-35)
// ----------------------------------------------------
export interface MoveFlowChecklistItem {
  id: string;
  title: string;
  category: 'Moving' | 'Cleaning' | 'Utilities' | 'Deposit' | 'Next Home';
  completed: boolean;
  dueDate: string;
  servicePartner?: string;
  cost?: number;
}

export interface DepositSettlementDispute {
  id: string;
  propertyId: string;
  propertyName: string;
  unitOrBed: string;
  tenantName: string;
  depositPaid: number;
  deductions: { id: string; item: string; amount: number; evidenceUrl?: string; timestamp: string }[];
  proposedRefund: number;
  disputedAmount: number;
  tenantNotes: string;
  status: 'Pending Review' | 'Disputed' | 'Agreed' | 'Refund Processed';
}

export interface TenantReferralItem {
  id: string;
  referralCode: string;
  referredName: string;
  propertyType: string;
  rewardAmount: number;
  status: 'Pending' | 'Converted' | 'Redeemed';
  date: string;
}

export interface PropertyPassportData {
  passportId: string;
  propertyId: string;
  propertyName: string;
  digitalIdentityNumber: string;
  establishedYear: number;
  ownershipType: string;
  complianceCertificates: string[];
  maintenanceLogCount: number;
  lifetimeOccupancyRate: number;
  historicalRoi: number;
}

export interface TenantPassportData {
  passportId: string;
  tenantName: string;
  verifiedKyc: boolean;
  trustScore: number;
  onTimePaymentPercent: number;
  stayHistoryCount: number;
  referenceRating: number;
  reusableIdentityCard: string;
}

// ----------------------------------------------------
// INTELLIGENCE, VACANCY & LEAKS (Sections 38-46)
// ----------------------------------------------------
export interface MoneyLeakAlert {
  id: string;
  title: string;
  assetName: string;
  leakCategory: 'High Vacancy' | 'Maintenance Spike' | 'Under-recovered CAM' | 'Unused Parking' | 'Utility Spike' | 'Vendor Overcharge';
  estimatedLoss: number;
  recommendation: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface VacancyCostReport {
  id: string;
  unitOrBed: string;
  assetName: string;
  assetCategory: AssetUniverseCategory;
  daysVacant: number;
  monthlyRent: number;
  estimatedLostRent: number;
  actionStatus: 'Priced' | 'Cleaning' | 'Marketed' | 'Lead Matched';
}

export interface InfluencerOffer {
  id: string;
  code: string;
  influencerName: string;
  influencerHandle?: string;
  commissionType: 'PERCENTAGE' | 'FLAT';
  commissionValue: number;
  audienceOffer: string;
  targetAudience: 'Tenants' | 'Landlords' | 'Both';
  signupsCount: number;
  totalCommissionPaid: number;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  createdAt: string;
}

// ----------------------------------------------------
// OWNER SUBSCRIPTION & ANTI-TAMPER SECURITY (Sections 47-50)
// ----------------------------------------------------
export type SubscriptionTierId = 'starter' | 'growth_pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUnits: number;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface SubscriptionInvoice {
  invoiceId: string;
  date: string;
  amount: number;
  currency: string;
  planId: SubscriptionTierId;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  txnId: string;
  paymentMethod: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  gstin?: string;
  taxAmount: number;
  downloadUrl?: string;
}

export interface OwnerSubscription {
  id: string;
  userId: string;
  ownerName: string;
  entityName: string;
  planId: SubscriptionTierId;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED';
  billingCycle: 'monthly' | 'annual';
  startDate: string;        // e.g. "2026-10-01"
  endDate: string;          // e.g. "2027-10-01"
  daysRemaining: number;
  amount: number;
  currency: string;
  maxUnits: number;
  currentUnits: number;
  paymentMethod: string;
  lastPaymentTxnId: string;
  lastPaymentDate: string;
  autoRenew: boolean;
  gstin?: string;
  tamperProofHash: string;  // SHA256 of immutable subscription parameters to prevent DB manipulation
  history: SubscriptionInvoice[];
  // 7-Day Free Trial & Autopay Fields
  isTrial?: boolean;
  trialDaysRemaining?: number;
  trialEndsAt?: string;
  canCancelBefore?: string;
  autopayConnected?: boolean;
  autopayMethod?: 'CARD' | 'BANK_MANDATE';
  autopayMaskedDetails?: string;
  firstChargeAmount?: number;
  firstChargeDate?: string;
}

export interface SignedCheckoutSession {
  sessionId: string;
  sessionToken: string;
  userId: string;
  planId: SubscriptionTierId;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  authoritativeAmount: number;
  currency: string;
  nonce: string;
  createdAt: number;
  expiresAt: number;
  signature: string;
}

export interface TrialSignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'owner' | 'estate_manager';
  portfolioName: string;
  city: string;
  planId: SubscriptionTierId;
  billingCycle: 'monthly' | 'annual';
  autopayMethod: 'CARD' | 'BANK_MANDATE';
  cardDetails?: {
    holderName: string;
    cardNumberMasked: string;
    expiry: string;
    cardBrand?: string;
  };
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
    mandateType?: 'E_NACH' | 'UPI_MANDATE';
  };
}



