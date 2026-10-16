'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet, 
  CheckCircle2, 
  ThumbsUp,
  Clock, 
  Activity as ActivityIcon,
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
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Search,
  Check,
  Zap,
  Trash2,
  ExternalLink,
  Laptop,
  AlertTriangle,
  Crown
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

const DEMO_BANK_ACCOUNTS: BankAccount[] = [
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
    holderName: 'Staywise Nodal / Escrow',
    isPrimary: false,
    status: 'Verified'
  }
];

const DEMO_DOCUMENTS: StoredDocument[] = [
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
];

const DEMO_DELEGATES: AuthorizedDelegate[] = [
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
];

const DEMO_TASKS_LIST = [
  {
    id: 'tsk-1',
    title: 'Monthly Rent Verification & Autopay Sync',
    status: 'In progress',
    statusColor: 'bg-[#163B36]',
    hours: '4h',
    icon: 'sparkles'
  },
  {
    id: 'tsk-2',
    title: 'BESCOM Electricity Meter OCR Scan (Unit 302)',
    status: 'On hold',
    statusColor: 'bg-[#263238]',
    hours: '8h',
    icon: 'search'
  },
  {
    id: 'tsk-3',
    title: 'Digital Tenancy Agreement (Aadhaar eSign)',
    status: 'Done',
    statusColor: 'bg-[#163B36]',
    hours: '32h',
    icon: 'code'
  }
];

const DEMO_ACTIVITY_FEED = [
  {
    id: 'act-1',
    name: 'Floyd Miles',
    time: '10:15 AM',
    action: 'Commented on Palm Grove Villa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    type: 'message' as const,
    text: "Hi! Rent for Unit 402 has been settled via UPI autopay. All meter readings verified.",
    reaction: '👍'
  },
  {
    id: 'act-2',
    name: 'Guy Hawkins',
    time: '10:15 AM',
    action: 'Uploaded BESCOM Power Bill',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    type: 'file' as const,
    fileName: 'BESCOM_Unit302_Oct.pdf',
    fileSize: '420 Kb'
  },
  {
    id: 'act-3',
    name: 'Kristin Watson',
    time: '10:15 AM',
    action: 'Scheduled AC Inspection for Unit 108',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    type: 'text_only' as const
  }
];

export default function OwnerDashboard() {
  const { 
    properties, 
    invoices, 
    tickets, 
    leads, 
    currentUser, 
    activeRole,
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
    deleteProperty,
    delegates: appDelegates,
    tenantConnectionRequests,
    approveTenantConnectionRequest,
    rejectTenantConnectionRequest,
    addDelegate,
    revokeDelegate
  } = useAppState();

  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';

  // Navigation Filter Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bank_accounts' | 'documents' | 'delegates' | 'utilities'>('overview');

  // Chart Tooltip Hover State
  const [hoveredDay, setHoveredDay] = useState<'01' | '02' | '03' | '04' | '05' | '06' | '07'>('03');
  const [selectedChartRange, setSelectedChartRange] = useState('01-07 May');

  // Chat input state
  const [chatMessage, setChatMessage] = useState('');
  const [activityFeed, setActivityFeed] = useState(() => isDemoAccount ? DEMO_ACTIVITY_FEED : []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newEntry = {
      id: `act-${Date.now()}`,
      name: currentUser.name || 'Owner',
      time: 'Just now',
      action: 'Sent a note to property team',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      type: 'message' as const,
      text: chatMessage,
      reaction: ''
    };
    setActivityFeed([newEntry, ...activityFeed]);
    setChatMessage('');
  };

  // Current Operations Tasks List
  const [tasksList, setTasksList] = useState(() => isDemoAccount ? DEMO_TASKS_LIST : []);

  // Heatmap & Property Filter
  const [heatmapFilter, setHeatmapFilter] = useState<'ALL' | 'HIGH_YIELD' | 'STABLE' | 'NEEDS_ATTENTION' | 'VACANT'>('ALL');

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => isDemoAccount ? DEMO_BANK_ACCOUNTS : []);

  // Document Vault State
  const [documents, setDocuments] = useState<StoredDocument[]>(() => isDemoAccount ? DEMO_DOCUMENTS : []);

  // Synchronize on user changes
  useEffect(() => {
    if (!isDemoAccount) {
      setBankAccounts([]);
      setDocuments([]);
      setTasksList([]);
      setActivityFeed([]);
    } else {
      setBankAccounts(DEMO_BANK_ACCOUNTS);
      setDocuments(DEMO_DOCUMENTS);
      setTasksList(DEMO_TASKS_LIST);
      setActivityFeed(DEMO_ACTIVITY_FEED);
    }
  }, [currentUser?.id, currentUser?.email, isDemoAccount]);

  // Modal States
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isAddDelegateModalOpen, setIsAddDelegateModalOpen] = useState(false);

  const [newBank, setNewBank] = useState({
    bankName: 'ICICI Bank',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    holderName: currentUser.name
  });

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Title Deed'
  });

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

  // Connect owner's user_id with properties
  // Demo accounts see full catalog, real owners see their owned properties, and managers only see authorized portfolios
  const activeDelegates: AuthorizedDelegate[] = isDemoAccount 
    ? ((appDelegates && appDelegates.length > 0) ? appDelegates : DEMO_DELEGATES) 
    : (appDelegates || []);

  const isManagerRole = activeRole === 'manager';
  const managerDelegate = (appDelegates || []).find(d => 
    (currentUser?.email && d.email.toLowerCase() === currentUser.email.toLowerCase()) && 
    d.status === 'Active'
  );
  const isManagerAuthorized = isDemoAccount || Boolean(managerDelegate);

  const ownerProperties = isDemoAccount
    ? properties
    : (activeRole === 'owner')
    ? properties.filter(p => p.ownerId === currentUser.id)
    : (isManagerRole && managerDelegate)
    ? properties.filter(p => p.ownerId === managerDelegate.ownerId)
    : [];
  const activeProperties = ownerProperties;
  const activeElectricityBills = isDemoAccount
    ? electricityBills
    : electricityBills.filter(b => activeProperties.some(p => p.id === b.propertyId));

  const pendingConnectionRequests = tenantConnectionRequests.filter(r => r.status === 'PENDING_APPROVAL');

  // If logged in as Manager without owner authorization, show dedicated waiting screen (zero mock data bleed)
  if (isManagerRole && !isManagerAuthorized) {
    return (
      <div className="space-y-6 pb-12 font-sans text-[#263238]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Property Manager Portal
            </h1>
            <p className="text-xs text-[#546E7A] mt-0.5">
              Operations &amp; Field Oversight • Connected Landlord Portfolios
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300">
            Awaiting Owner Permission
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-8 shadow-sm max-w-2xl space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#263238]">No Connected Property Owner Yet</h2>
            <p className="text-xs text-[#546E7A] mt-1.5 leading-relaxed">
              You are signed in as a Property Manager (<b>{currentUser.email}</b>). To access property units, maintenance tickets, and rent ledgers, a Property Owner must grant you delegate access in their Settings → Delegates section.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
            <div className="font-extrabold text-[#263238]">Important Security &amp; Compliance Rule:</div>
            <p className="text-[#546E7A] leading-relaxed text-[11px]">
              Property Managers receive scoped operational access to tenant communications and repair work orders. <b>Money withdrawal and escrow disbursements are strictly restricted to property owners only.</b>
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                addNotification('Authorization Checked', 'Checked with platform registry for newly granted owner permissions.', 'SYSTEM');
                alert('Checked for owner authorization. When a landlord adds your email in Settings, their portfolio will appear here.');
              }}
              className="px-5 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Check for Pending Authorizations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalUnitsCount = activeProperties.reduce((acc, p) => acc + p.totalUnits, 0);
  const occupiedUnitsCount = activeProperties.reduce((acc, p) => acc + p.occupiedUnits, 0);
  const totalRentExpected = activeProperties.reduce((acc, p) => acc + p.expectedMonthlyRent, 0);
  const totalPendingRent = activeProperties.reduce((acc, p) => acc + p.pendingRent, 0);
  const totalCollectedRent = Math.max(0, totalRentExpected - totalPendingRent);
  const occupancyPercentage = totalUnitsCount > 0 ? ((occupiedUnitsCount / totalUnitsCount) * 100).toFixed(1) : '0.0';

  const filteredProperties = activeProperties.filter((prop) => {
    const occRatio = prop.totalUnits > 0 ? prop.occupiedUnits / prop.totalUnits : 0;
    if (heatmapFilter === 'ALL') return true;
    if (heatmapFilter === 'HIGH_YIELD') return prop.expectedMonthlyRent >= 200000 || prop.healthScore >= 92;
    if (heatmapFilter === 'STABLE') return occRatio >= 0.95;
    if (heatmapFilter === 'NEEDS_ATTENTION') return prop.healthScore < 90 || occRatio < 0.9 || prop.pendingRent > 0;
    if (heatmapFilter === 'VACANT') return prop.occupiedUnits < prop.totalUnits;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238]">
      {/* Top Banner: Pending Tenant Connections */}
      {pendingConnectionRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#163B36]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <div>
              <span className="font-extrabold text-xs text-[#263238]">
                {pendingConnectionRequests.length} Tenant Connection Request(s) Pending Approval
              </span>
              <p className="text-[11px] text-[#546E7A]">
                New residents have requested to connect to your properties.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('tenants')}
            className="px-4 py-1.5 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            Review &amp; Approve in Tenants Directory →
          </button>
        </div>
      )}
      
      {/* ========================================================================= */}
      {/* 1. SUB-NAVIGATION TABS (Overview, Properties, Banks, Vault, Team, Power)  */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 border-b border-[#D1D5DB] pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Universal Overview
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'properties'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Properties &amp; Units ({activeProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('bank_accounts')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'bank_accounts'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Direct Banks ({bankAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'documents'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Deeds &amp; Vault ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('delegates')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'delegates'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Team Delegates ({activeDelegates.length})
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'utilities'
                ? 'bg-[#163B36] text-white shadow-2xs'
                : 'text-[#263238] hover:text-[#263238] hover:bg-[#E8F0EC]'
            }`}
          >
            Utility OCR Bills ({activeElectricityBills.length})
          </button>
        </div>

        <button
          onClick={() => setIsAddPropertyOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold transition shrink-0 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. OVERVIEW VIEW (EXACT GREEN PALETTE + ALL LIVE PORTFOLIO DATA)          */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          
          {/* ------------------------------------------------------------------- */}
          {/* LEFT/CENTER 8-COL: GREETING, METRIC CARDS, CHART, TASKS             */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header: Greeting + Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263238] tracking-tight">
                  Hello, {currentUser.name.split(' ')[0] || 'Vikram'}
                </h1>
                <p className="text-xs text-[#666666] mt-1 font-medium">
                  Track property performance, collections, and team tasks. You almost reach your revenue goal!
                </p>
              </div>

              {/* Date Pill & Quick Action */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button 
                  onClick={() => setActiveView('reports')}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238] transition shadow-2xs flex items-center gap-1"
                >
                  <span>P&amp;L Statement</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238] shadow-2xs">
                  <span>16 May, 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-[#163B36]" />
                </div>
              </div>
            </div>

            {/* Clean Slate Onboarding State for New Users */}
            {activeProperties.length === 0 && (
              <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#D2DDD7] text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-[#E8F0EC] flex items-center justify-center mx-auto text-[#163B36]">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#263238]">Welcome to Staywise! No properties added yet.</h3>
                <p className="text-xs text-[#666666] max-w-md mx-auto">
                  Your workspace starts with a clean slate. Click below to add your first property, residential apartment, or PG hostel.
                </p>
                <button
                  onClick={() => setIsAddPropertyOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Property</span>
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TOTAL PORTFOLIO GLANCE (DYNAMIC BASED ON ACTIVE PROPERTIES)              */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Revenue & Inflow */}
              <div className="bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#666666]">Hospitality &amp; Rent Inflow</span>
                  <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#263238]/10">
                    {activeProperties.length > 0 ? '+24% YoY' : '0%'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2 tracking-tight">
                  ₹{totalCollectedRent.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#666666] mt-1 block">
                  {activeProperties.length > 0 
                    ? `₹${(totalRentExpected / 100000).toFixed(1)}L Expected • ${totalRentExpected > 0 ? Math.round((totalCollectedRent / totalRentExpected) * 100) : 0}% Collection Rate`
                    : '₹0 Expected • 0% Collection Rate'
                  }
                </span>
              </div>

              {/* Card 2: Unit & Bed Occupancy */}
              <div className="bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#666666]">Portfolio Unit Occupancy</span>
                  <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#263238]/10">
                    {activeProperties.length > 0 ? 'Active' : 'No Units'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2 tracking-tight">
                  {occupancyPercentage}%
                </div>
                <span className="text-[11px] text-[#666666] mt-1 block">
                  {occupiedUnitsCount}/{totalUnitsCount} Units • {activeProperties.filter(p => p.type === 'PG' || p.type === 'Hostel').reduce((acc, p) => acc + p.totalUnits, 0)} PG Beds Active
                </span>
              </div>

              {/* Card 3: Active Stays & Leases */}
              <div className="bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#666666]">Active Stays &amp; Leases</span>
                  <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#263238]/10">
                    {occupiedUnitsCount} Leases
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2 tracking-tight">
                  {occupiedUnitsCount} Stays Live
                </div>
                <span className="text-[11px] text-[#666666] mt-1 block">
                  {activeProperties.length} Properties Configured
                </span>
              </div>

              {/* Card 4: Net Operating Cashflow (NOI) */}
              <div className="bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#666666]">Net Operating Cashflow</span>
                  <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#263238]/10">
                    {activeProperties.length > 0 ? 'Net Surplus' : 'No Inflow'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2 tracking-tight">
                  +₹{Math.round(totalCollectedRent * 0.844).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#666666] mt-1 block">
                  {activeProperties.length > 0 ? '+84.4% Margin • In Flow' : '0% Margin • Clean Workspace'}
                </span>
              </div>

            </div>

            {/* Performance Chart Card (Human-Readable, Responsive with Clear Y-Axis & Tooltips) */}
            {activeProperties.length > 0 && (
            <div className="rounded-3xl bg-white border border-[#D2DDD7] p-4 sm:p-5 md:p-6 shadow-xs space-y-4">
              
              {/* Header & Range Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D1D5DB]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-[#263238] tracking-tight">Collection &amp; Yield Performance</h3>
                    <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#163B36] text-white border border-[#263238]/20 shrink-0">
                      +12% vs Last Month
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1 font-medium">
                    Real-time rent collection pace compared against prior month with live yield trajectory
                  </p>
                </div>
                
                {/* Legend & Cycle Toggle */}
                <div className="flex items-center gap-2 flex-wrap text-xs self-start sm:self-auto">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#E8F0EC] border border-[#D2DDD7]">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#263238]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#263238] shrink-0" />
                      <span>May 2026 (Active)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#666666]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#163B36]/40 border border-[#163B36] shrink-0" />
                      <span>Apr 2026</span>
                    </span>
                  </div>

                  <div className="flex items-center rounded-full bg-[#E8F0EC] p-0.5 border border-[#D2DDD7]">
                    {['01-07 May', 'Monthly', 'Quarterly'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedChartRange(range)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          selectedChartRange === range
                            ? 'bg-[#163B36] text-white shadow-2xs'
                            : 'text-[#263238]/70 hover:text-[#263238]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] transition hover:border-[#263238]">
                  <div className="text-[10px] sm:text-[11px] text-[#666666] font-semibold">Selected Day Collection</div>
                  <div className="text-sm sm:text-base font-black text-[#263238] font-tabular mt-0.5">
                    {hoveredDay === '01' ? '₹4.20 Lakhs' :
                     hoveredDay === '02' ? '₹9.50 Lakhs' :
                     hoveredDay === '03' ? '₹15.90 Lakhs' :
                     hoveredDay === '04' ? '₹16.10 Lakhs' :
                     hoveredDay === '05' ? '₹16.25 Lakhs' :
                     hoveredDay === '06' ? '₹16.35 Lakhs' : '₹16.40 Lakhs'}
                  </div>
                  <span className="text-[10px] text-[#263238] font-bold mt-0.5 block">
                    {hoveredDay === '03' ? '🔥 Peak Inflow (97% Met)' :
                     hoveredDay === '01' ? 'Cycle start • 25.6% Met' :
                     hoveredDay === '02' ? 'UPI Autopay • 57.9% Met' :
                     hoveredDay === '07' ? '100% Target Achieved' : 'Reconciliation on track'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] transition hover:border-[#263238]">
                  <div className="text-[10px] sm:text-[11px] text-[#666666] font-semibold">Monthly Peak Day</div>
                  <div className="text-sm sm:text-base font-black text-[#263238] font-tabular mt-0.5">
                    03 May (₹15.9L)
                  </div>
                  <span className="text-[10px] text-[#666666] font-medium mt-0.5 block">
                    +₹1.70L vs Apr Peak Day
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] transition hover:border-[#263238]">
                  <div className="text-[10px] sm:text-[11px] text-[#666666] font-semibold">On-Time Collection Rate</div>
                  <div className="text-sm sm:text-base font-black text-[#263238] font-tabular mt-0.5">
                    97.0% On-Time
                  </div>
                  <span className="text-[10px] text-[#163B36] font-bold mt-0.5 block">
                    ₹50,000 pending reconciliation
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] transition hover:border-[#263238]">
                  <div className="text-[10px] sm:text-[11px] text-[#666666] font-semibold">Realized Portfolio APY</div>
                  <div className="text-sm sm:text-base font-black text-[#263238] font-tabular mt-0.5">
                    8.4% Net Yield
                  </div>
                  <span className="text-[10px] text-[#666666] font-medium mt-0.5 block">
                    +0.6% vs market benchmark
                  </span>
                </div>
              </div>

              {/* Human-Readable Chart Container (Y-Axis + SVG + X-Axis) */}
              <div className="relative pt-1 sm:pt-2">
                
                {/* 2-Column Grid: Y-Axis labels (left) + SVG Chart Area (right) */}
                <div className="flex items-stretch gap-2 sm:gap-3">
                  
                  {/* Y-Axis Currency Scale Labels */}
                  <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-bold text-[#666666] font-tabular py-1 text-right select-none shrink-0 w-8 sm:w-10">
                    <span>₹20L</span>
                    <span>₹15L</span>
                    <span>₹10L</span>
                    <span>₹5L</span>
                    <span>₹0L</span>
                  </div>

                  {/* SVG Canvas Area */}
                  <div className="relative flex-1 h-48 sm:h-56 md:h-64 w-full">
                    
                    {/* Interactive Floating Popover Tooltip with Clamped Bounds */}
                    <div 
                      className="absolute top-1 z-30 bg-[#263238] text-white rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-1 text-xs w-40 sm:w-48 transition-all duration-200 border border-[#163B36] pointer-events-none"
                      style={{
                        left: hoveredDay === '01' ? '12%' :
                              hoveredDay === '02' ? '24%' :
                              hoveredDay === '03' ? '37%' :
                              hoveredDay === '04' ? '50%' :
                              hoveredDay === '05' ? '63%' :
                              hoveredDay === '06' ? '76%' : '88%',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-black text-[#C69A55]">
                          {hoveredDay} May 2026 ({
                            hoveredDay === '01' ? 'Fri' :
                            hoveredDay === '02' ? 'Sat' :
                            hoveredDay === '03' ? 'Sun' :
                            hoveredDay === '04' ? 'Mon' :
                            hoveredDay === '05' ? 'Tue' :
                            hoveredDay === '06' ? 'Wed' : 'Thu'
                          })
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#163B36] text-white font-bold shrink-0">
                          {hoveredDay === '03' ? '🔥 Peak' : 'Recorded'}
                        </span>
                      </div>
                      
                      <div className="pt-1 border-t border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-[#E8F0EC]">
                            <span className="w-1.5 h-3 rounded-full bg-[#163B36]" />
                            May Inflow:
                          </span>
                          <span className="font-black text-white font-tabular">
                            {hoveredDay === '01' ? '₹4.20L' :
                             hoveredDay === '02' ? '₹9.50L' :
                             hoveredDay === '03' ? '₹15.90L' :
                             hoveredDay === '04' ? '₹16.10L' :
                             hoveredDay === '05' ? '₹16.25L' :
                             hoveredDay === '06' ? '₹16.35L' : '₹16.40L'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-[#E8F0EC]/70">
                            <span className="w-1.5 h-3 rounded-full bg-[#163B36]" />
                            Apr Inflow:
                          </span>
                          <span className="font-semibold text-[#E8F0EC] font-tabular">
                            {hoveredDay === '01' ? '₹3.80L' :
                             hoveredDay === '02' ? '₹8.10L' :
                             hoveredDay === '03' ? '₹14.20L' :
                             hoveredDay === '04' ? '₹14.80L' :
                             hoveredDay === '05' ? '₹15.10L' :
                             hoveredDay === '06' ? '₹15.30L' : '₹15.50L'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#163B36] pt-0.5 border-t border-white/5">
                          <span>Growth vs Apr:</span>
                          <span className="font-bold">
                            {hoveredDay === '01' ? '+₹40,000' :
                             hoveredDay === '02' ? '+₹1,40,000' :
                             hoveredDay === '03' ? '+₹1,70,000' :
                             hoveredDay === '04' ? '+₹1,30,000' :
                             hoveredDay === '05' ? '+₹1,15,000' :
                             hoveredDay === '06' ? '+₹1,05,000' : '+₹90,000'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Chart Graphic */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="forestAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#263238" stopOpacity="0.32" />
                          <stop offset="50%" stopColor="#263238" stopOpacity="0.10" />
                          <stop offset="100%" stopColor="#263238" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Gridlines matching Y-Axis Scale */}
                      <line x1="0" y1="10" x2="700" y2="10" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="50" x2="700" y2="50" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="130" x2="700" y2="130" stroke="#D1D5DB" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="170" x2="700" y2="170" stroke="#D2DDD7" strokeWidth="1.5" />

                      {/* Active Day Vertical Needle Line */}
                      <line 
                        x1={hoveredDay === '01' ? '50' :
                            hoveredDay === '02' ? '150' :
                            hoveredDay === '03' ? '250' :
                            hoveredDay === '04' ? '350' :
                            hoveredDay === '05' ? '450' :
                            hoveredDay === '06' ? '550' : '650'}
                        y1="10" 
                        x2={hoveredDay === '01' ? '50' :
                            hoveredDay === '02' ? '150' :
                            hoveredDay === '03' ? '250' :
                            hoveredDay === '04' ? '350' :
                            hoveredDay === '05' ? '450' :
                            hoveredDay === '06' ? '550' : '650'}
                        y2="170" 
                        stroke="#263238" 
                        strokeWidth="1.5" 
                        strokeDasharray="3 3" 
                      />

                      {/* Secondary Curve (April 2026 - Dashed Olive) */}
                      <path
                        d="M 50,140 C 100,120 150,95 250,52 C 350,45 450,42 550,40 C 600,39 650,38 650,38"
                        fill="none"
                        stroke="#666666"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />

                      {/* Primary Area Fill (May 2026) */}
                      <path
                        d="M 50,135 C 100,105 150,85 250,38 C 350,34 450,31 550,29 C 600,28 650,26 650,26 L 650,170 L 50,170 Z"
                        fill="url(#forestAreaGradient)"
                      />

                      {/* Primary Curve (May 2026 - Solid Forest Green) */}
                      <path
                        d="M 50,135 C 100,105 150,85 250,38 C 350,34 450,31 550,29 C 600,28 650,26 650,26"
                        fill="none"
                        stroke="#263238"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Interactive Circles / Data Dots */}
                      {[
                        { day: '01', cx: 50, cyThis: 135, cyLast: 140 },
                        { day: '02', cx: 150, cyThis: 85, cyLast: 95 },
                        { day: '03', cx: 250, cyThis: 38, cyLast: 52 },
                        { day: '04', cx: 350, cyThis: 34, cyLast: 45 },
                        { day: '05', cx: 450, cyThis: 31, cyLast: 42 },
                        { day: '06', cx: 550, cyThis: 29, cyLast: 40 },
                        { day: '07', cx: 650, cyThis: 26, cyLast: 38 },
                      ].map((dot) => {
                        const isHovered = hoveredDay === dot.day;
                        return (
                          <g key={dot.day} className="cursor-pointer" onClick={() => setHoveredDay(dot.day as any)}>
                            {/* Broad touch & hover target */}
                            <rect 
                              x={dot.cx - 35} 
                              y="0" 
                              width="70" 
                              height="170" 
                              fill="transparent" 
                              onMouseEnter={() => setHoveredDay(dot.day as any)}
                            />
                            
                            {/* Apr dot */}
                            <circle 
                              cx={dot.cx} 
                              cy={dot.cyLast} 
                              r={isHovered ? 4 : 2.5} 
                              fill="#FFFFFF" 
                              stroke="#666666" 
                              strokeWidth="1.5" 
                            />

                            {/* May dot with animated focus aura */}
                            {isHovered && (
                              <circle 
                                cx={dot.cx} 
                                cy={dot.cyThis} 
                                r={10} 
                                fill="#163B36" 
                                opacity={0.4}
                              />
                            )}

                            <circle 
                              cx={dot.cx} 
                              cy={dot.cyThis} 
                              r={isHovered ? 6.5 : 4} 
                              fill={isHovered ? "#163B36" : "#263238"} 
                              stroke="#263238" 
                              strokeWidth={isHovered ? 2.5 : 1.5} 
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* X-Axis Date Selectors (Fully Responsive Pill Buttons with Day of Week) */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2.5 sm:pt-3.5 ml-8 sm:ml-10 text-center font-tabular">
                  {([
                    { id: '01', dayOfWeek: 'Fri' },
                    { id: '02', dayOfWeek: 'Sat' },
                    { id: '03', dayOfWeek: 'Sun' },
                    { id: '04', dayOfWeek: 'Mon' },
                    { id: '05', dayOfWeek: 'Tue' },
                    { id: '06', dayOfWeek: 'Wed' },
                    { id: '07', dayOfWeek: 'Thu' }
                  ] as const).map(({ id, dayOfWeek }) => {
                    const isSelected = hoveredDay === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setHoveredDay(id)}
                        className={`py-2 px-1 sm:px-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center min-h-[44px] ${
                          isSelected
                            ? 'bg-[#163B36] text-white shadow-sm ring-1 ring-[#163B36]'
                            : 'text-[#263238]/70 hover:text-[#263238] hover:bg-[#E8F0EC] bg-transparent'
                        }`}
                      >
                        <span className="font-extrabold">{id} May</span>
                        <span className={`text-[9px] font-medium transition ${isSelected ? 'text-white/80' : 'text-[#263238]/60'}`}>
                          {dayOfWeek}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
            )}

            {/* Current Operations Tasks List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#263238]">Current Operational Tasks</h3>
                  <span className="text-xs text-white font-extrabold bg-[#163B36] px-2.5 py-0.5 rounded-full">Done 88%</span>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-[#263238] hover:text-[#163B36] transition">
                  <span>This Week</span>
                  <ChevronDown className="h-3 w-3 text-[#163B36]" />
                </button>
              </div>

              {/* Task Items */}
              {tasksList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-[#D2DDD7] text-center space-y-1">
                  <p className="text-xs font-bold text-[#263238]">No operational tasks pending</p>
                  <p className="text-[11px] text-[#666666]">Tasks will automatically generate as tenants request repairs, meters are scanned, or rent is due.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasksList.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#D2DDD7] hover:border-[#263238] flex items-center justify-between gap-3 text-xs shadow-2xs transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-center text-[#263238] shrink-0">
                          {task.icon === 'sparkles' && <Zap className="h-4 w-4 text-[#263238]" />}
                          {task.icon === 'search' && <Search className="h-4 w-4 text-[#163B36]" />}
                          {task.icon === 'code' && <Laptop className="h-4 w-4 text-[#263238]" />}
                        </div>
                        <span className="font-bold text-[#263238] truncate">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${task.statusColor}`} />
                          <span className="text-xs font-bold text-[#263238] hidden sm:inline">{task.status}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[#666666] font-bold font-tabular">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{task.hours}</span>
                        </div>

                        <button className="text-[#666666] hover:text-[#263238] p-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT 4-COL: PROFILE CARD, ACTIVITY CHAT FEED, MESSAGE INPUT        */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Top Profile Card */}
            <div className="rounded-3xl bg-[#E8F0EC] border border-[#D2DDD7] p-5 text-center space-y-4">
              <div className="relative inline-block mx-auto">
                {currentUser.avatar && currentUser.avatar.startsWith('http') ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#163B36] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-xs mx-auto">
                    {(currentUser.name || 'Owner').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-[#C69A55] ring-2 ring-white" />
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#263238]">
                  {currentUser.name || (isDemoAccount ? 'Vikram Singhania' : 'Property Owner')}
                </h3>
                <p className="text-xs text-[#263238]/70 font-bold mt-0.5">
                  {currentUser.roleLabel || 'Property & Asset Host'}
                </p>
              </div>

              {/* 3 Circular Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button 
                  onClick={() => alert('Call connected with tenant WhatsApp gateway')}
                  className="h-10 w-10 rounded-full bg-white border border-[#D2DDD7] flex items-center justify-center text-[#163B36] hover:bg-[#163B36] hover:text-white transition shadow-2xs"
                  title="Phone Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => alert('Live video inspection room generated.')}
                  className="h-10 w-10 rounded-full bg-white border border-[#D2DDD7] flex items-center justify-center text-[#163B36] hover:bg-[#163B36] hover:text-white transition shadow-2xs"
                  title="Video Inspection"
                >
                  <Video className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setActiveView('settings')}
                  className="h-10 w-10 rounded-full bg-white border border-[#D2DDD7] flex items-center justify-center text-[#163B36] hover:bg-[#163B36] hover:text-white transition shadow-2xs"
                  title="Settings"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Activity & Chat Feed */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#263238] px-1">Live Tenant &amp; Team Activity</h3>

              {activityFeed.length === 0 ? (
                <div className="p-5 rounded-2xl bg-white border border-dashed border-[#D2DDD7] text-center space-y-1">
                  <p className="text-xs font-bold text-[#263238]">No recent team activity</p>
                  <p className="text-[11px] text-[#666666]">Team notes, tenant comments, and system updates will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="h-7 w-7 rounded-full object-cover shrink-0 border border-[#D2DDD7]" 
                          />
                          <div className="truncate">
                            <span className="font-extrabold text-[#263238] mr-1">{item.name}</span>
                            <span className="text-[11px] text-[#666666]">{item.action}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#666666] font-tabular shrink-0">{item.time}</span>
                      </div>

                      {item.type === 'message' && item.text && (
                        <div className="relative ml-9 p-3 rounded-2xl bg-[#E8F0EC] text-[#263238] text-xs font-medium leading-relaxed border border-[#D2DDD7]">
                          <p>{item.text}</p>
                          {item.reaction && (
                            <div className="absolute -bottom-2 right-2 h-5 w-5 rounded-full bg-[#163B36] border border-[#263238]/20 flex items-center justify-center text-[10px] shadow-2xs">
                              {item.reaction}
                            </div>
                          )}
                        </div>
                      )}

                      {item.type === 'file' && (
                        <div className="ml-9 p-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-xl bg-[#163B36] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                              PDF
                            </div>
                            <div className="truncate">
                              <div className="font-bold text-[#263238] truncate">{item.fileName}</div>
                              <div className="text-[10px] text-[#666666]">{item.fileSize}</div>
                            </div>
                          </div>

                          <button 
                            onClick={() => alert(`Downloading ${item.fileName}...`)}
                            className="h-7 w-7 rounded-full bg-white border border-[#D2DDD7] flex items-center justify-center text-[#263238] hover:bg-[#163B36] transition shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

              {/* Chat Message Input Bar */}
              <form onSubmit={handleSendMessage} className="pt-2">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs shadow-2xs">
                  <button type="button" className="text-[#163B36] hover:text-[#263238] transition">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    placeholder="Message tenant or team..."
                    className="flex-1 bg-transparent border-none outline-none text-[#263238] placeholder-[#666666] text-xs font-medium"
                  />
                  <button type="button" className="text-[#163B36] hover:text-[#263238] transition">
                    <Smile className="h-4 w-4" />
                  </button>
                  <button type="button" className="text-[#163B36] hover:text-[#263238] transition">
                    <Mic className="h-4 w-4" />
                  </button>
                  {chatMessage && (
                    <button type="submit" className="text-[#263238] hover:text-[#263238]">
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: PROPERTIES & ASSETS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'properties' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#E8F0EC] p-4 rounded-2xl border border-[#D2DDD7]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#666666]">Filter Heatmap:</span>
              {(['ALL', 'HIGH_YIELD', 'STABLE', 'NEEDS_ATTENTION', 'VACANT'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setHeatmapFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    heatmapFilter === filter 
                      ? 'bg-[#163B36] text-white shadow-xs' 
                      : 'bg-white text-[#263238] hover:bg-[#E8F0EC] border border-[#D2DDD7]'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold shadow-xs transition"
            >
              + Add New Property
            </button>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <p className="text-sm font-bold text-[#263238]">No properties found in this view</p>
              <p className="text-xs text-[#666666]">Add your first property to begin tracking units, leases, and tenant rent.</p>
              <button
                onClick={() => setIsAddPropertyOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                + Add New Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map(prop => (
                <div 
                  key={prop.id}
                  className="rounded-2xl bg-white border border-[#D2DDD7] p-5 shadow-xs hover:border-[#263238] transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#163B36] text-white border border-[#263238]/20">
                        {prop.type}
                      </span>
                      <h3 className="font-extrabold text-base text-[#263238] mt-1.5">{prop.name}</h3>
                      <p className="text-xs text-[#666666]">{prop.address}</p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-center text-xs font-black text-[#263238]">
                      {prop.healthScore}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D1D5DB] text-xs">
                    <div>
                      <span className="text-[10px] text-[#666666]">Units Occupancy</span>
                      <div className="font-bold text-[#263238]">{prop.occupiedUnits} / {prop.totalUnits} Units</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666]">Monthly Rent</span>
                      <div className="font-bold text-[#263238]">₹{prop.expectedMonthlyRent.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D1D5DB]">
                    <span className="text-xs text-[#666666]">
                      Pending: <strong className="text-rose-600">₹{prop.pendingRent.toLocaleString('en-IN')}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setPropertyToEdit(prop);
                          setIsEditPropertyModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-full bg-[#E8F0EC] hover:bg-[#163B36] text-xs font-bold text-white border border-[#D2DDD7] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete property ${prop.name}?`)) deleteProperty(prop.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: BANK ACCOUNTS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'bank_accounts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#E8F0EC] p-4 rounded-2xl border border-[#D2DDD7]">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Direct Bank Payout Accounts</h3>
              <p className="text-xs text-[#666666]">Automated payouts routed directly to verified nodal accounts</p>
            </div>
            {activeRole === 'manager' ? (
              <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold border border-rose-200">
                🔒 Payout &amp; Withdrawal Restricted: Owner Only
              </span>
            ) : (
              <button
                onClick={() => setIsAddBankModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold shadow-xs transition cursor-pointer"
              >
                + Add Bank Account
              </button>
            )}
          </div>

          {bankAccounts.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#263238] flex items-center justify-center mx-auto">
                <Landmark className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#263238]">No bank accounts linked yet</p>
              <p className="text-xs text-[#666666]">Add your primary bank account or nodal escrow trust to receive direct tenant rent payouts.</p>
              <button
                onClick={() => setIsAddBankModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                + Add Bank Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map(bank => (
                <div key={bank.id} className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-[#E8F0EC] text-[#263238] flex items-center justify-center font-bold">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#263238]">{bank.bankName}</h4>
                        <p className="text-xs text-[#666666] font-mono">{bank.accountNumber}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#163B36] text-white text-[10px] font-black border border-[#263238]/20">
                      {bank.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#D1D5DB]">
                    <div>
                      <span className="text-[10px] text-[#666666]">IFSC Code:</span>
                      <div className="font-bold text-[#263238]">{bank.ifsc}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666666]">Holder:</span>
                      <div className="font-bold text-[#263238] truncate">{bank.holderName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: DIGITAL DOCUMENT VAULT                                         */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#E8F0EC] p-4 rounded-2xl border border-[#D2DDD7]">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Legal Deeds &amp; Document Vault</h3>
              <p className="text-xs text-[#666666]">DigiLocker &amp; Municipal statutory registry verified documents</p>
            </div>
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold shadow-xs transition"
            >
              + Upload Document
            </button>
          </div>

          {documents.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#263238] flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#263238]">Document vault is empty</p>
              <p className="text-xs text-[#666666]">Upload title deeds, tax receipts, encumbrance certificates, and building insurance policies.</p>
              <button
                onClick={() => setIsUploadDocModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                + Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="p-4 rounded-2xl bg-white border border-[#D2DDD7] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#E8F0EC] text-[#263238] flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#263238]">{doc.title}</h4>
                      <p className="text-[10px] text-[#666666]">{doc.category} • {doc.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading ${doc.title}...`)}
                    className="p-2 rounded-full hover:bg-[#163B36] text-[#263238] hover:text-white transition"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: TEAM DELEGATES                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'delegates' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#E8F0EC] p-4 rounded-2xl border border-[#D2DDD7]">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Team &amp; Authorized Delegates</h3>
              <p className="text-xs text-[#666666]">Access management for Accountants, Managers, and Auditors</p>
            </div>
            <button
              onClick={() => setIsAddDelegateModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold shadow-xs transition"
            >
              + Invite Member
            </button>
          </div>

          {activeDelegates.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#263238] flex items-center justify-center mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-[#263238]">No authorized delegates added</p>
              <p className="text-xs text-[#666666]">Invite your chartered accountant, tax auditor, or property manager with role-based access controls.</p>
              <button
                onClick={() => setIsAddDelegateModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                + Invite Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDelegates.map(del => (
                <div key={del.id} className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#263238]">{del.name}</h4>
                      <p className="text-xs text-[#666666]">{del.email} • {del.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#163B36] text-white text-[10px] font-black border border-[#263238]/20">
                        {del.role}
                      </span>
                      {!isDemoAccount && (
                        <button
                          onClick={() => {
                            if (confirm(`Revoke delegate access for ${del.name}?`)) revokeDelegate(del.id);
                          }}
                          className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#D1D5DB]">
                    {del.permissions.map((p, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-[#E8F0EC] border border-[#D2DDD7] text-[10px] text-[#263238] font-semibold">
                        ✓ {p}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-bold">
                      🔒 No Fund Withdrawal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: UTILITIES & POWER BILLS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'utilities' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#E8F0EC] p-4 rounded-2xl border border-[#D2DDD7]">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Electricity &amp; Utility Sub-Meters</h3>
              <p className="text-xs text-[#666666]">AI OCR extraction and automated WhatsApp bill sharing with tenants</p>
            </div>
            <button
              onClick={() => {
                setPreselectedUnitForUpload('101');
                setIsUploadBillModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-extrabold shadow-xs transition"
            >
              + Upload Power Bill
            </button>
          </div>

          {activeElectricityBills.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#263238] flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-[#163B36]" />
              </div>
              <p className="text-sm font-bold text-[#263238]">No utility bills uploaded yet</p>
              <p className="text-xs text-[#666666]">Upload discom electricity bills or log sub-meter readings to automatically invoice tenants.</p>
              <button
                onClick={() => {
                  setPreselectedUnitForUpload(null);
                  setIsUploadBillModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                + Upload Power Bill
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeElectricityBills.map(bill => (
                <div key={bill.id} className="p-5 rounded-2xl bg-white border border-[#D2DDD7] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-[#263238]">Unit {bill.unitNumber}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#163B36] text-white font-black border border-[#263238]/20">
                          {bill.propertyName}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] mt-0.5">{bill.tenantName || 'Occupied'}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      bill.status === 'Paid' ? 'bg-[#163B36] text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bill.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Provider:</span>
                      <span className="font-bold text-[#263238]">{bill.discom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666666]">Consumption:</span>
                      <span className="font-bold text-[#263238]">{bill.unitsConsumed} Units</span>
                    </div>
                    <div className="flex justify-between border-t border-[#D2DDD7] pt-1">
                      <span className="text-[#666666]">Bill Amount:</span>
                      <span className="font-black text-sm text-[#263238]">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BANK ACCOUNT                                                   */}
      {/* ========================================================================= */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#263238]">Add Bank Account</h3>
              <button onClick={() => setIsAddBankModalOpen(false)} className="text-[#666666] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setIsAddBankModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#263238]">Bank Name</label>
                <input 
                  type="text" 
                  value={newBank.bankName}
                  onChange={e => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#263238]">Account Number</label>
                <input 
                  type="password" 
                  value={newBank.accountNumber}
                  onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#263238]">IFSC Code</label>
                <input 
                  type="text" 
                  value={newBank.ifsc}
                  onChange={e => setNewBank({ ...newBank, ifsc: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs">
                Save &amp; Verify Bank Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD DOCUMENT                                                    */}
      {/* ========================================================================= */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#263238]">Upload Document</h3>
              <button onClick={() => setIsUploadDocModalOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setIsUploadDocModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#263238]">Title</label>
                <input 
                  type="text" 
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs">
                Upload to Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE DELEGATE                                                    */}
      {/* ========================================================================= */}
      {isAddDelegateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Invite Authorized Delegate</h3>
                <p className="text-xs text-[#546E7A]">Accountants, Property Managers &amp; Auditors</p>
              </div>
              <button onClick={() => setIsAddDelegateModalOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const perms: string[] = [];
              if (newDelegate.allowLedger) perms.push('Financial Ledger', 'Tax Reports (P&L)');
              if (newDelegate.allowInvoices) perms.push('Rent Invoices', 'Bank Statements');
              if (newDelegate.allowMaintenance) perms.push('Maintenance Work Orders', 'Tenant Handover');

              addDelegate({
                name: newDelegate.name,
                email: newDelegate.email,
                phone: newDelegate.phone,
                role: newDelegate.role,
                permissions: perms,
                status: 'Active',
                canWithdrawFunds: false
              });
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
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. CA Rajesh Kulkarni"
                  value={newDelegate.name}
                  onChange={e => setNewDelegate({ ...newDelegate, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="rajesh@cacafe.in"
                    value={newDelegate.email}
                    onChange={e => setNewDelegate({ ...newDelegate, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91 98450 11928"
                    value={newDelegate.phone}
                    onChange={e => setNewDelegate({ ...newDelegate, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Assigned Role</label>
                <select
                  value={newDelegate.role}
                  onChange={e => setNewDelegate({ ...newDelegate, role: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                >
                  <option value="Accountant">Chartered Accountant (CA)</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Tax Auditor">Tax Auditor</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
                <span className="font-bold text-[#263238] block">Operational Permissions:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowLedger}
                    onChange={e => setNewDelegate({ ...newDelegate, allowLedger: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>View Double-Entry Ledger &amp; Tax P&amp;L</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowInvoices}
                    onChange={e => setNewDelegate({ ...newDelegate, allowInvoices: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>Inspect Rent Invoices &amp; TDS Statements</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDelegate.allowMaintenance}
                    onChange={e => setNewDelegate({ ...newDelegate, allowMaintenance: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>Manage Work Orders &amp; Field Repairs</span>
                </label>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                🔒 <b>Strict Compliance Rule:</b> Money withdrawal and escrow account alterations are strictly prohibited for delegates. Only the verified Property Owner can withdraw rental funds.
              </div>

              <button type="submit" className="w-full py-2.5 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs cursor-pointer">
                Authorize Delegate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
