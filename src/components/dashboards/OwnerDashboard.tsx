'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Fingerprint, 
  ChevronDown, 
  Plus, 
  CreditCard, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Landmark,
  FileText,
  Upload,
  Download,
  X,
  ExternalLink,
  Shield,
  UserPlus,
  UserCheck,
  Zap,
  Share2,
  UploadCloud,
  Paperclip,
  Sparkles,
  BedDouble,
  Briefcase,
  Trees,
  ArrowRight,
  Clock,
  AlertTriangle,
  Percent,
  Check,
  Pencil,
  Trash2
} from 'lucide-react';
import { AuthorizedDelegate } from '../../types';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  holderName: string;
  isPrimary: boolean;
  status: 'Verified' | 'Pending';
}

interface StoredDocument {
  id: string;
  title: string;
  category: string;
  size: string;
  date: string;
  status: 'Verified' | 'Valid' | 'Active';
}

export default function OwnerDashboard() {
  const { 
    properties, 
    invoices, 
    tickets, 
    leads, 
    currentUser, 
    setIsAddPropertyOpen, 
    setActiveView,
    electricityBills,
    setIsUploadBillModalOpen,
    setPreselectedUnitForUpload,
    pgBeds,
    commercialUnits,
    moneyLeaks,
    vacancyCosts,
    addNotification,
    setIsEditPropertyModalOpen,
    setPropertyToEdit,
    deleteProperty
  } = useAppState();

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [heatmapFilter, setHeatmapFilter] = useState<'ALL' | 'HIGH_YIELD' | 'STABLE' | 'NEEDS_ATTENTION' | 'VACANT'>('ALL');

  const heatmapCounts = React.useMemo(() => ({
    all: properties.length,
    highYield: properties.filter(p => p.expectedMonthlyRent >= 200000 || p.healthScore >= 92).length,
    stable: properties.filter(p => p.totalUnits > 0 && (p.occupiedUnits / p.totalUnits) >= 0.95).length,
    attention: properties.filter(p => p.healthScore < 90 || (p.totalUnits > 0 && (p.occupiedUnits / p.totalUnits) < 0.9) || p.pendingRent > 0).length,
    vacant: properties.filter(p => p.occupiedUnits < p.totalUnits).length
  }), [properties]);

  const filteredProperties = React.useMemo(() => {
    return properties.filter((prop) => {
      const occRatio = prop.totalUnits > 0 ? prop.occupiedUnits / prop.totalUnits : 0;
      if (heatmapFilter === 'ALL') return true;
      if (heatmapFilter === 'HIGH_YIELD') return prop.expectedMonthlyRent >= 200000 || prop.healthScore >= 92;
      if (heatmapFilter === 'STABLE') return occRatio >= 0.95;
      if (heatmapFilter === 'NEEDS_ATTENTION') return prop.healthScore < 90 || occRatio < 0.9 || prop.pendingRent > 0;
      if (heatmapFilter === 'VACANT') return prop.occupiedUnits < prop.totalUnits;
      return true;
    });
  }, [properties, heatmapFilter]);

  // Bank Accounts State (User requested: remove card, add bank account for payments)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'bnk-1',
      bankName: 'HDFC Bank',
      accountNumber: '•••• •••• •••• 4910',
      ifsc: 'HDFC0001842',
      holderName: 'Vikram Singhania',
      isPrimary: true,
      status: 'Verified'
    },
    {
      id: 'bnk-2',
      bankName: 'Axis Bank Escrow Trust',
      accountNumber: '•••• •••• •••• 9104',
      ifsc: 'UTIB0000042',
      holderName: 'Staywise Nodal / Vikram S.',
      isPrimary: false,
      status: 'Verified'
    }
  ]);

  // Digital Document Wallet State (User requested: make a digital wallet for saving documents)
  const [documents, setDocuments] = useState<StoredDocument[]>([
    {
      id: 'doc-1',
      title: 'Title Deed (Beach Road Property)',
      category: 'Ownership & Sale Deed',
      size: '2.4 MB',
      date: 'Verified Oct 2024',
      status: 'Verified'
    },
    {
      id: 'doc-2',
      title: 'Municipal Property Tax 2025-26',
      category: 'Tax & Assessment',
      size: '480 KB',
      date: 'Paid Aug 2026',
      status: 'Valid'
    },
    {
      id: 'doc-3',
      title: 'Nil Encumbrance Certificate (EC)',
      category: 'Statutory Registry',
      size: '1.2 MB',
      date: 'Valid till 2030',
      status: 'Verified'
    },
    {
      id: 'doc-4',
      title: 'Comprehensive Building Insurance',
      category: 'ICICI Lombard Policy',
      size: '890 KB',
      date: 'Active till Jun 2027',
      status: 'Active'
    }
  ]);

  // Modals for adding bank account & uploading document
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);

  // New Bank Form State
  const [newBank, setNewBank] = useState({
    bankName: 'ICICI Bank',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    holderName: currentUser.name
  });

  // New Document Form State
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Title Deed'
  });

  // Authorized Delegates State (Accountants, Property Managers)
  const [delegates, setDelegates] = useState<AuthorizedDelegate[]>([
    {
      id: 'del-1',
      name: 'CA Rajesh K. (Kulkarni & Associates)',
      email: 'rajesh.ca@auditfirm.in',
      phone: '+91 98450 11928',
      role: 'Accountant',
      permissions: ['Financial Ledger', 'Bank Statements', 'Rent Invoices', 'Tax Reports (P&L)'],
      addedDate: '15 Aug 2026',
      status: 'Active'
    },
    {
      id: 'del-2',
      name: 'Arjun Das',
      email: 'arjun.ops@staywise.com',
      phone: '+91 94470 82910',
      role: 'Property Manager',
      permissions: ['Maintenance Work Orders', 'CRM Leads', 'Physical Visits', 'Tenant Handover'],
      addedDate: '01 Sep 2026',
      status: 'Active'
    }
  ]);

  const [isAddDelegateModalOpen, setIsAddDelegateModalOpen] = useState(false);
  const [newDelegate, setNewDelegate] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Accountant' as 'Accountant' | 'Property Manager' | 'Tax Auditor',
    allowLedger: true,
    allowInvoices: true,
    allowMaintenance: false,
    allowBankPayouts: false
  });

  const handleAddDelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegate.name) return;

    const perms: string[] = [];
    if (newDelegate.allowLedger) perms.push('Financial Ledger');
    if (newDelegate.allowInvoices) perms.push('Rent Invoices');
    if (newDelegate.allowMaintenance) perms.push('Maintenance Work Orders');
    if (newDelegate.allowBankPayouts) perms.push('Bank Payouts (Requires 2FA)');

    const added: AuthorizedDelegate = {
      id: `del-${Date.now()}`,
      name: newDelegate.name,
      email: newDelegate.email,
      phone: newDelegate.phone,
      role: newDelegate.role,
      permissions: perms,
      addedDate: 'Today',
      status: 'Active'
    };

    setDelegates(prev => [added, ...prev]);
    setIsAddDelegateModalOpen(false);
    setNewDelegate({
      name: '',
      email: '',
      phone: '',
      role: 'Accountant',
      allowLedger: true,
      allowInvoices: true,
      allowMaintenance: false,
      allowBankPayouts: false
    });
    alert(`Access granted to ${added.name} as ${added.role}! Invitation dispatched to ${added.email}.`);
  };

  const handleShareOwnerElectricityBill = (unit: string, amount: number, discom: string) => {
    const text = `*Staywise Power Bill - Unit ${unit}*\nAmount: ₹${amount.toLocaleString('en-IN')}\nDiscom: ${discom}\nDue Date: 15 Oct 2026\n\nPay online to Staywise Escrow: staywise.escrow@axisbank`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.accountNumber) return;
    const last4 = newBank.accountNumber.slice(-4);
    const createdBank: BankAccount = {
      id: `bnk-${Date.now()}`,
      bankName: newBank.bankName,
      accountNumber: `•••• •••• •••• ${last4}`,
      ifsc: newBank.ifsc.toUpperCase(),
      holderName: newBank.holderName,
      isPrimary: false,
      status: 'Verified'
    };
    setBankAccounts([...bankAccounts, createdBank]);
    setIsAddBankModalOpen(false);
    setNewBank({
      bankName: 'ICICI Bank',
      accountNumber: '',
      confirmAccountNumber: '',
      ifsc: '',
      holderName: currentUser.name
    });
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    const createdDoc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: newDoc.title,
      category: newDoc.category,
      size: '1.5 MB',
      date: 'Just uploaded',
      status: 'Verified'
    };
    setDocuments([...documents, createdDoc]);
    setIsUploadDocModalOpen(false);
    setNewDoc({ title: '', category: 'Title Deed' });
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 font-sans">
      
      {/* SECTION 53: OWNER DAILY AI BRIEF */}
      <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#19251f] via-[#203429] to-[#274235] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
              Good morning, Vikram. ₹16.4L Monthly Expected Revenue • 91.2% Total Occupancy.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-sm min-w-0">
                <span className="text-[10px] text-teal-300 block font-medium truncate">Rent Collected</span>
                <span className="text-xs sm:text-sm font-black text-white truncate block mt-0.5">₹15.9L / 16.4L</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-sm min-w-0">
                <span className="text-[10px] text-amber-300 block font-medium truncate">Vacant Inventory</span>
                <span className="text-xs sm:text-sm font-black text-white truncate block mt-0.5">3 Units • 2 Beds</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-sm min-w-0">
                <span className="text-[10px] text-rose-300 block font-medium truncate">Active Overdue</span>
                <span className="text-xs sm:text-sm font-black text-white truncate block mt-0.5">₹50k (4 Tenants)</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-sm min-w-0">
                <span className="text-[10px] text-indigo-300 block font-medium truncate">Lease Expiry</span>
                <span className="text-xs sm:text-sm font-black text-white truncate block mt-0.5">1 Office in 90d</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 pt-1 lg:pt-0">
            <button
              onClick={() => setActiveView('rentflow')}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-[#19251f] text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>Review Collections</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveView('pg')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>PG Bed Operations</span>
            </button>
          </div>
        </div>
      </div>

      {/* ROW 1: 4 Mini Stat Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Spent this month with mini vertical bar chart */}
        <div className="organic-card p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-semibold text-[#6e7972] block truncate">Spent this month</span>
            <div className="text-xl sm:text-2xl font-black text-[#19251f] font-tabular">
              ₹28,450
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-10 px-2 py-1 shrink-0">
            <div className="w-1.5 h-4 bg-[#759382] rounded-full"></div>
            <div className="w-1.5 h-8 bg-[#274235] rounded-full"></div>
            <div className="w-1.5 h-6 bg-[#759382] rounded-full"></div>
            <div className="w-1.5 h-10 bg-[#274235] rounded-full"></div>
            <div className="w-1.5 h-5 bg-[#759382] rounded-full"></div>
          </div>
        </div>

        {/* Card 2: New clients / Leads with smooth sparkline curve */}
        <div className="organic-card p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#eef3f0] flex items-center justify-center text-[#274235] shrink-0">
                <Users className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#6e7972] truncate">New clients</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#19251f] font-tabular">
              321
            </div>
          </div>
          <svg className="w-16 h-8 shrink-0" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 24 C16 24, 20 8, 34 8 C46 8, 50 18, 62 14"
              stroke="#6e7972"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 3: Earnings with coin icon */}
        <div className="organic-card p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#fcf5e5] flex items-center justify-center text-[#c2811d] shrink-0">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#6e7972] truncate">Earnings</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#19251f] font-tabular truncate">
              ₹11,70,000
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0 border border-emerald-200">
            +8.4%
          </span>
        </div>

        {/* Card 4 (Solid Sage Green Card from reference image): Activity */}
        <div className="organic-card-dark p-4 sm:p-5 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="space-y-1 z-10 min-w-0">
            <span className="text-xs font-medium text-emerald-200/80 block truncate">Activity</span>
            <div className="text-xl sm:text-2xl font-black text-white font-tabular truncate">
              ₹12,40,000
            </div>
          </div>
          <svg className="w-20 h-10 z-10 shrink-0" viewBox="0 0 80 40" fill="none">
            <path
              d="M4 28 C20 28, 25 10, 42 10 C58 10, 64 22, 76 18"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* SECTION 40 & 41: OWNER PORTFOLIO COMMAND CENTER & PORTFOLIO HEATMAP */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4 sm:space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#19251f] text-white shrink-0">
                Portfolio Matrix
              </span>
              <span className="text-xs text-slate-500 font-semibold">Total Assets: 8 Across 4 Pillars</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">Universal Portfolio Command Center</h2>
            <p className="text-xs text-slate-500 mt-0.5">One unified operating dashboard aggregating Residential, PG Co-living, Commercial Hubs & Industrial Warehousing.</p>
          </div>

          {/* Heatmap Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] self-stretch sm:self-auto overflow-x-auto no-scrollbar text-[11px] font-bold max-w-full">
            {(['ALL', 'HIGH_YIELD', 'STABLE', 'NEEDS_ATTENTION', 'VACANT'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setHeatmapFilter(filter)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  heatmapFilter === filter 
                    ? 'bg-[#19251f] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>
                  {filter === 'ALL' && `All ${heatmapCounts.all} Assets`}
                  {filter === 'HIGH_YIELD' && `High Yield (9%+) (${heatmapCounts.highYield})`}
                  {filter === 'STABLE' && `Stable (95%+ Occ) (${heatmapCounts.stable})`}
                  {filter === 'NEEDS_ATTENTION' && `Attention Needed (${heatmapCounts.attention})`}
                  {filter === 'VACANT' && `Vacancy Loss (${heatmapCounts.vacant})`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4 Asset Pillar Summary Matrix (Section 40) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 bg-[#f7f6f2] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#e8e6de]">
          <div className="space-y-1 min-w-0 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-[#e8e6de]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">Residential (5 Units)</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">₹4.8L <span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-emerald-700 font-semibold truncate">91.6% Occupancy • 1 Vacant</div>
          </div>

          <div className="space-y-1 min-w-0 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-[#e8e6de]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-700">
              <BedDouble className="h-4 w-4 shrink-0" />
              <span className="truncate">PG & Co-Living (120 Beds)</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">₹8.4L <span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-indigo-700 font-semibold truncate">80.8% Occupancy • 97 Beds</div>
          </div>

          <div className="space-y-1 min-w-0 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-[#e8e6de]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="truncate">Commercial & CAM</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">₹6.1L <span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-amber-700 font-semibold truncate">88.6% Occ • ₹18 CAM</div>
          </div>

          <div className="space-y-1 min-w-0 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-[#e8e6de]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-800">
              <Trees className="h-4 w-4 shrink-0" />
              <span className="truncate">Estates & Logistics</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900">₹5.7L <span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-teal-700 font-semibold truncate">100% Leased • Solar Active</div>
          </div>
        </div>

        {/* Portfolio Heatmap Cards (Section 41) */}
        {filteredProperties.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
            No properties found matching the selected filter ({heatmapFilter}).
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProperties.map((prop) => (
              <div 
                key={prop.id}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#274235] hover:shadow-md transition space-y-3 cursor-pointer group"
                onClick={() => {
                  if (prop.type === 'PG') setActiveView('pg');
                  else if (prop.type === 'Commercial') setActiveView('commercial');
                  else setActiveView('properties');
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {prop.type}
                      </span>
                      {prop.verificationStatus === 'PENDING' ? (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          ⏳ Admin Doc Audit
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-900 mt-1 truncate">{prop.name}</h4>
                    <span className="text-[10px] text-slate-500 block truncate">{prop.city}, {prop.state}</span>
                  </div>
                  <div className={`h-3 w-3 rounded-full shrink-0 mt-1 ${
                    prop.healthScore >= 92 ? 'bg-emerald-500' :
                    prop.healthScore >= 88 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} title={`Health Score: ${prop.healthScore}/100`} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[9px] text-slate-400">Monthly Revenue</div>
                    <div className="font-extrabold text-slate-900">₹{(prop.expectedMonthlyRent / 1000).toFixed(0)}k</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400">Occupancy</div>
                    <div className="font-black text-emerald-700">
                      {prop.totalUnits > 0 ? Math.round((prop.occupiedUnits / prop.totalUnits) * 100) : 0}%
                    </div>
                  </div>
                </div>

                {/* Edit & Remove Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPropertyToEdit(prop);
                      setIsEditPropertyModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#274235] hover:text-white text-slate-700 font-bold transition flex items-center gap-1"
                    title="Edit property details"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to remove "${prop.name}" from your portfolio?`)) {
                        deleteProperty(prop.id);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold transition flex items-center gap-1"
                    title="Remove property"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PORTFOLIO VACANCY COST & "MONEY LEAK" DETECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Span 6: Vacancy Cost Analysis */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-md">
                Opportunity Cost
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">Universal Vacancy Cost Engine</h3>
            </div>
            <span className="text-xs font-black text-rose-600 font-mono shrink-0 self-start sm:self-auto">
              -₹2,08,900 Est. Lost Rent
            </span>
          </div>
          <p className="text-xs text-slate-500">Daily opportunity cost of unleased inventory across residential flats, PG beds, commercial suites, and logistics bays.</p>

          <div className="space-y-2.5">
            {vacancyCosts.map((vac) => (
              <div key={vac.id} className="p-3 sm:p-3.5 rounded-2xl bg-[#fbfbfa] border border-slate-200 flex items-center justify-between gap-2.5 text-xs">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="font-bold text-slate-900 truncate">{vac.unitOrBed}</div>
                  <div className="text-[10px] text-slate-500 truncate">{vac.assetName} • Vacant for <span className="font-bold text-rose-700">{vac.daysVacant} days</span></div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[9px] text-slate-400">Lost Rent</div>
                  <div className="font-black text-rose-600 font-mono">₹{vac.estimatedLostRent.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Span 6: Money Leak Detector */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-amber-200 bg-amber-50/20 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md">
                  AI Revenue Optimization
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">"Money Leak" Detector</h3>
              </div>
            </div>
            <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl shrink-0 self-start sm:self-auto">
              4 Active Leaks
            </span>
          </div>

          <div className="space-y-2.5">
            {moneyLeaks.map((leak) => (
              <div key={leak.id} className="p-3 sm:p-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900">{leak.title}</span>
                  <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md shrink-0 self-start sm:self-auto">
                    -₹{leak.estimatedLoss.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{leak.recommendation}</p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => addNotification('Mitigation Dispatched', `Applied AI optimization for: ${leak.title}`, 'SYSTEM')}
                    className="text-[10px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition"
                  >
                    1-Click Mitigate Leak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Big Balance Card + Earnings Radial Gauge + User Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Span 6: Big Balance Card with Inset Subcards and Continuous Wave Chart */}
        <div className="md:col-span-2 lg:col-span-6 organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#19251f]">Balance</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-[#eef3f0] px-2.5 py-0.5 rounded-full shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                On track
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#6e7972] bg-[#f4f3ef] px-3 py-1.5 rounded-xl cursor-pointer shrink-0">
              <span>Monthly</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Two Inset Subcards from reference image - responsive grid & wrapping to prevent badge overlay */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-[#6e7972] block truncate">Saves</span>
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                <span className="text-lg sm:text-xl font-black text-[#19251f] font-tabular">43.50%</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded shrink-0">
                  +2.45%
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-[#6e7972] block truncate">Balance</span>
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                <span className="text-lg sm:text-xl font-black text-[#19251f] font-tabular truncate">₹52,422</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded shrink-0">
                  -4.75%
                </span>
              </div>
            </div>
          </div>

          {/* Continuous Sage Green Wavy Graph - fully viewable on all screen sizes */}
          <div className="pt-2 w-full">
            <div className="w-full overflow-hidden rounded-xl">
              <svg className="w-full h-24 sm:h-28 overflow-visible" viewBox="0 0 500 100" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sageWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#274235" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#274235" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 60 C50 60, 80 85, 120 85 C160 85, 180 35, 230 35 C280 35, 300 75, 350 75 C400 75, 430 45, 500 50"
                  stroke="#274235"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M0 60 C50 60, 80 85, 120 85 C160 85, 180 35, 230 35 C280 35, 300 75, 350 75 C400 75, 430 45, 500 50 L500 100 L0 100 Z"
                  fill="url(#sageWaveGrad)"
                />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-medium text-[#6e7972] pt-2 px-1 border-t border-[#eeece5]/60 mt-1">
              <span>01 Oct</span>
              <span>08 Oct</span>
              <span>15 Oct</span>
              <span>22 Oct</span>
              <span className="font-bold text-[#274235]">Live (₹52.4k)</span>
            </div>
          </div>
        </div>

        {/* Middle Span 3: Earnings Semi-Circle Radial Gauge Card from reference image */}
        <div className="md:col-span-1 lg:col-span-3 organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#19251f]">Earnings</h3>
            <span className="text-xs text-[#6e7972] font-medium">Total Expense</span>
            <div className="text-2xl font-black text-[#19251f] font-tabular mt-1">
              ₹60,787
            </div>
            <p className="text-xs text-[#6e7972] mt-1 leading-relaxed">
              Profit is 34% More than last Month
            </p>
          </div>

          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-40 sm:w-44 h-22 sm:h-24 overflow-hidden flex items-end justify-center">
              <svg className="w-40 h-40 sm:w-44 sm:h-44 -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e8eee9"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="125 125"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#274235"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="100 125"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-1 text-center">
                <span className="text-xl sm:text-2xl font-black text-[#19251f] font-tabular">80%</span>
                <span className="block text-[9px] uppercase tracking-wider text-[#6e7972] font-bold">Target Met</span>
              </div>
            </div>
            <div className="w-full flex justify-between text-[10px] text-[#6e7972] font-semibold px-4 pt-1">
              <span>₹0</span>
              <span>Target ₹75k</span>
            </div>
          </div>
        </div>

        {/* Right Span 3: User Profile Card from reference image */}
        <div className="md:col-span-1 lg:col-span-3 organic-card p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#fdecd5] border-2 border-[#e3e1d8] flex items-center justify-center text-3xl sm:text-4xl shadow-sm">
            😎
          </div>

          <div className="min-w-0 w-full px-2">
            <h3 className="font-extrabold text-base text-[#19251f] truncate">
              {currentUser.name}
            </h3>
            <p className="text-xs text-[#6e7972] truncate">{currentUser.email}</p>
          </div>

          <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full pt-3 border-t border-[#eeece5] text-center">
            <div className="min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-[#6e7972] truncate">Projects</span>
              <span className="text-sm sm:text-base font-black text-[#19251f] font-tabular">26</span>
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-[#6e7972] truncate">Followers</span>
              <span className="text-sm sm:text-base font-black text-[#19251f] font-tabular">356</span>
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-[#6e7972] truncate">Following</span>
              <span className="text-sm sm:text-base font-black text-[#19251f] font-tabular">68</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Connected Bank Account for Payments + Digital Document Wallet + Your Transfers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Span 5: Connected Bank Accounts (Replaces credit cards per user instruction) */}
        <div className="md:col-span-2 lg:col-span-5 organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-2.5 pb-1 sm:pb-0">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[#274235] shrink-0" />
                <span>Bank Accounts for Payouts</span>
              </h3>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Primary linked accounts for automated rent collection & T+0 escrow deposits
              </p>
            </div>
            <button
              onClick={() => setIsAddBankModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Bank</span>
            </button>
          </div>

          {/* List of Connected Bank Accounts */}
          <div className="space-y-2.5">
            {bankAccounts.map((b) => (
              <div
                key={b.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white border border-[#e3e1d8] flex items-center justify-center text-[#274235] font-black text-sm shadow-sm shrink-0">
                    🏛️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-[#19251f] flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="truncate">{b.bankName}</span>
                      {b.isPrimary && (
                        <span className="text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-[#6e7972] mt-0.5 truncate">
                      {b.accountNumber} • IFSC: {b.ifsc}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#6e7972]">
            <span>Escrow Trustee: Axis Bank Nodal</span>
            <span className="font-bold text-[#274235]">100% RBI Escrow Insured</span>
          </div>
        </div>

        {/* Middle Span 4: Digital Document Wallet (User requested: digital wallet for saving documents) */}
        <div className="md:col-span-1 lg:col-span-4 organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-2 pb-1 sm:pb-0">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#274235] shrink-0" />
                <span>Digital Document Wallet</span>
              </h3>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Encrypted storage for property deeds, taxes & NOCs
              </p>
            </div>
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs shadow-sm transition flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <Upload className="h-3.5 w-3.5 text-[#274235]" />
              <span>Upload</span>
            </button>
          </div>

          {/* List of Stored Documents */}
          <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-2.5 sm:p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between gap-2 text-xs hover:bg-white transition"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div className="truncate min-w-0 flex-1">
                    <div className="font-extrabold text-[#19251f] truncate">{doc.title}</div>
                    <div className="text-[10px] text-[#6e7972] truncate">{doc.category} • {doc.size}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => alert(`Opening secure preview for: ${doc.title}`)}
                    className="p-1.5 rounded-lg bg-white border border-[#e3e1d8] text-[#19251f] hover:bg-[#274235] hover:text-white transition"
                    title="View Document"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#6e7972]">
            <span>AES-256 Vault Encryption</span>
            <span className="font-bold text-[#274235]">Legal Proof Ready</span>
          </div>
        </div>

        {/* Right Span 3: Your Transfers Card matching reference image */}
        <div className="md:col-span-1 lg:col-span-3 organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <h3 className="text-base font-extrabold text-[#19251f]">Your Transfers</h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#eeece5]">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#19251f] block truncate">From Anna Jones</span>
                <span className="text-[10px] text-[#6e7972]">Today, 14:34</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                +2.45%
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#eeece5]">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#19251f] block truncate">To RapidCool HVAC</span>
                <span className="text-[10px] text-[#6e7972]">Today, 15:23</span>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                -₹1,150
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#19251f] block truncate">From Joel Cannan</span>
                <span className="text-[10px] text-[#6e7972]">Today, 17:54</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                +2.45%
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('rentflow')}
            className="text-xs font-bold text-[#274235] hover:underline flex items-center justify-center gap-1 pt-1"
          >
            <span>View All Ledger Entries</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ROW 4: Authorized Delegate Access (Managers & Accountants) + Property Electricity & Sub-Meter Billing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Left: Authorized Delegate Access (Managers & Accountants) */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#eeece5]">
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#274235] shrink-0" />
                <h3 className="font-extrabold text-base text-[#19251f]">
                  Authorized Delegate Access
                </h3>
              </div>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Share financial ledger, statements, or field work orders with your Accountant or Property Manager
              </p>
            </div>

            <button
              onClick={() => setIsAddDelegateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Manager / Accountant</span>
            </button>
          </div>

          {/* List of Authorized Delegates */}
          <div className="space-y-2.5">
            {delegates.map((del) => (
              <div
                key={del.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] hover:bg-white transition flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-extrabold text-[#19251f] text-sm break-words">{del.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      del.role === 'Accountant' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {del.role}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      {del.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#6e7972] break-words">
                    {del.email} • {del.phone}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {del.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-center pt-1 sm:pt-0">
                  <button
                    onClick={() => {
                      const text = `Hi ${del.name.split(' ')[0]}, here is your Staywise Owner Portal delegated access credentials for Vikram Singhania's portfolio.\nRole: ${del.role}\nPortal URL: https://staywise.app/delegate-login`;
                      window.open(`https://api.whatsapp.com/send?phone=${del.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-[#274235] hover:text-white border border-[#e3e1d8] text-[#19251f] transition"
                    title="Send WhatsApp Access Link"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`Access permissions updated for ${del.name}`)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
                  >
                    Edit Access
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#6e7972]">
            <span>Role-Based Granular Access Control</span>
            <span className="font-bold text-[#274235]">{delegates.length} Active Delegates</span>
          </div>
        </div>

        {/* Right: Property Electricity & Sub-Meter Billing */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#eeece5]">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500 shrink-0" />
                <h3 className="font-extrabold text-base text-[#19251f]">
                  Electricity & Sub-Meter Billing
                </h3>
              </div>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Monthly sub-meter readings & direct WhatsApp bill sharing
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setPreselectedUnitForUpload(null);
                  setIsUploadBillModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Bill</span>
              </button>

              <button
                onClick={() => setActiveView('rentflow')}
                className="text-xs font-bold text-[#274235] hover:underline flex items-center gap-1"
              >
                <span>Full Billing</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Unit Power Bills Summary */}
          <div className="space-y-2.5 text-xs">
            {electricityBills.slice(0, 4).map((bill) => (
              <div key={bill.id} className="p-3 sm:p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-[#19251f] flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="break-words">Unit {bill.unitNumber} ({bill.tenantName})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bill.status === 'Paid' ? 'Paid' : `Due ${bill.dueDate.split(' ')[0]} ${bill.dueDate.split(' ')[1]}`}
                    </span>
                    {bill.attachmentName && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                        <Paperclip className="h-2.5 w-2.5" />
                        <span>PDF</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#6e7972] mt-0.5 truncate">
                    {bill.unitsConsumed} kWh @ ₹{bill.ratePerUnit} + ₹{bill.fixedCharges} fixed • {bill.meterNumber}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-[#eeece5]/80">
                  <span className="font-black text-[#19251f] font-tabular text-sm">
                    ₹{bill.totalAmount.toLocaleString('en-IN')}
                  </span>
                  {bill.status === 'Paid' ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl shrink-0">
                      ✓ Settled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleShareOwnerElectricityBill(bill.unitNumber, bill.totalAmount, bill.discom)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition shrink-0"
                      title="Share WhatsApp bill to tenant"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPreselectedUnitForUpload(bill.unitNumber);
                      setIsUploadBillModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] transition shrink-0"
                    title={`Upload new bill for Unit ${bill.unitNumber}`}
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-[#274235]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#6e7972]">
            <span>Automatic Sub-Meter Computation</span>
            <span className="font-bold text-[#274235]">BESCOM Regulated Rate</span>
          </div>
        </div>
      </div>

      {/* Add Bank Account Modal */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-[calc(100vw-2rem)] max-w-md bg-white border border-[#e3e1d8] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Add Bank Account for Payouts</h3>
              </div>
              <button onClick={() => setIsAddBankModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBank} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Bank Name</label>
                <select
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={newBank.holderName}
                  onChange={(e) => setNewBank({ ...newBank, holderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Bank Account Number</label>
                <input
                  type="password"
                  required
                  placeholder="Enter full account number"
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Confirm Account Number</label>
                <input
                  type="text"
                  required
                  placeholder="Re-enter account number"
                  value={newBank.confirmAccountNumber}
                  onChange={(e) => setNewBank({ ...newBank, confirmAccountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ICIC0001234"
                  value={newBank.ifsc}
                  onChange={(e) => setNewBank({ ...newBank, ifsc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235] uppercase font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold shadow-md shadow-[#274235]/20 transition"
                >
                  Verify & Link Bank Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-[calc(100vw-2rem)] max-w-md bg-white border border-[#e3e1d8] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Upload Document to Wallet</h3>
              </div>
              <button onClick={() => setIsUploadDocModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wayanad Villa Title Deed"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Category</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                >
                  <option value="Title Deed">Title Deed & Sale Deed</option>
                  <option value="Property Tax">Property Tax Receipt</option>
                  <option value="Encumbrance Certificate">Encumbrance Certificate (EC)</option>
                  <option value="Building Insurance">Building Insurance Policy</option>
                  <option value="Fire & Safety NOC">Fire & Safety NOC</option>
                  <option value="Electricity & Water NOC">Electricity & Water Connection</option>
                </select>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-[#e3e1d8] text-center space-y-2 bg-[#fbfbfa]">
                <FileText className="h-8 w-8 text-[#274235] mx-auto" />
                <div className="text-xs font-bold text-[#19251f]">Drop PDF or click to browse</div>
                <div className="text-[10px] text-[#6e7972]">Supports PDF, PNG, JPG up to 25 MB</div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold shadow-md shadow-[#274235]/20 transition"
                >
                  Save into Encrypted Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manager or Accountant Modal */}
      {isAddDelegateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-[calc(100vw-2rem)] max-w-md bg-white border border-[#e3e1d8] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Add Manager or Accountant</h3>
              </div>
              <button onClick={() => setIsAddDelegateModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDelegateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CA Suresh Narayanan"
                  value={newDelegate.name}
                  onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Role & Responsibility</label>
                <select
                  value={newDelegate.role}
                  onChange={(e) => {
                    const r = e.target.value as any;
                    setNewDelegate({
                      ...newDelegate,
                      role: r,
                      allowLedger: r === 'Accountant' || r === 'Tax Auditor',
                      allowInvoices: true,
                      allowMaintenance: r === 'Property Manager'
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                >
                  <option value="Accountant">Accountant / Chartered Accountant (CA)</option>
                  <option value="Property Manager">Property Manager / Field Operations</option>
                  <option value="Tax Auditor">Tax Auditor / Compliance Advisor</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="suresh@auditfirm.in"
                    value={newDelegate.email}
                    onChange={(e) => setNewDelegate({ ...newDelegate, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">WhatsApp Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={newDelegate.phone}
                    onChange={(e) => setNewDelegate({ ...newDelegate, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] space-y-2">
                <span className="font-extrabold text-[#19251f] block text-[11px]">Granular Permission Scopes:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowLedger}
                    onChange={(e) => setNewDelegate({ ...newDelegate, allowLedger: e.target.checked })}
                    className="rounded text-[#274235] focus:ring-[#274235]"
                  />
                  <span>View Double-Entry Ledger & P&L Statements</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowInvoices}
                    onChange={(e) => setNewDelegate({ ...newDelegate, allowInvoices: e.target.checked })}
                    className="rounded text-[#274235] focus:ring-[#274235]"
                  />
                  <span>View Tenant Invoices, Receipts & Bank Deposits</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowMaintenance}
                    onChange={(e) => setNewDelegate({ ...newDelegate, allowMaintenance: e.target.checked })}
                    className="rounded text-[#274235] focus:ring-[#274235]"
                  />
                  <span>Manage Work Orders, Quotes & Vendor Triage</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Grant Secure Access & Send Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
