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

  // Navigation Filter Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bank_accounts' | 'documents' | 'delegates' | 'utilities'>('overview');

  // Chart Tooltip Hover State
  const [hoveredDay, setHoveredDay] = useState<'01' | '02' | '03' | '04' | '05' | '06' | '07'>('03');
  const [selectedChartRange, setSelectedChartRange] = useState('01-07 May');

  // Chat input state
  const [chatMessage, setChatMessage] = useState('');
  const [activityFeed, setActivityFeed] = useState([
    {
      id: 'act-1',
      name: 'Floyd Miles',
      time: '10:15 AM',
      action: 'Commented on Palm Grove Villa',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      type: 'message',
      text: "Hi! Rent for Unit 402 has been settled via UPI autopay. All meter readings verified.",
      reaction: '👍'
    },
    {
      id: 'act-2',
      name: 'Guy Hawkins',
      time: '10:15 AM',
      action: 'Uploaded BESCOM Power Bill',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      type: 'file',
      fileName: 'BESCOM_Unit302_Oct.pdf',
      fileSize: '420 Kb'
    },
    {
      id: 'act-3',
      name: 'Kristin Watson',
      time: '10:15 AM',
      action: 'Scheduled AC Inspection for Unit 108',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      type: 'text_only'
    }
  ]);

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
  const [tasksList, setTasksList] = useState([
    {
      id: 'tsk-1',
      title: 'Monthly Rent Verification & Autopay Sync',
      status: 'In progress',
      statusColor: 'bg-[#4F772D]',
      hours: '4h',
      icon: 'sparkles'
    },
    {
      id: 'tsk-2',
      title: 'BESCOM Electricity Meter OCR Scan (Unit 302)',
      status: 'On hold',
      statusColor: 'bg-[#31572C]',
      hours: '8h',
      icon: 'search'
    },
    {
      id: 'tsk-3',
      title: 'Digital Tenancy Agreement (Aadhaar eSign)',
      status: 'Done',
      statusColor: 'bg-[#ECF39E]',
      hours: '32h',
      icon: 'code'
    }
  ]);

  // Heatmap & Property Filter
  const [heatmapFilter, setHeatmapFilter] = useState<'ALL' | 'HIGH_YIELD' | 'STABLE' | 'NEEDS_ATTENTION' | 'VACANT'>('ALL');

  // Bank Accounts State
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
      holderName: 'Staywise Nodal / Escrow',
      isPrimary: false,
      status: 'Verified'
    }
  ]);

  // Document Vault State
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

  // Delegates State
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

  const totalUnitsCount = properties.reduce((acc, p) => acc + p.totalUnits, 0) || 78;
  const occupiedUnitsCount = properties.reduce((acc, p) => acc + p.occupiedUnits, 0) || 56;
  const totalRentExpected = properties.reduce((acc, p) => acc + p.expectedMonthlyRent, 0) || 1640000;
  const totalPendingRent = properties.reduce((acc, p) => acc + p.pendingRent, 0);

  const filteredProperties = properties.filter((prop) => {
    const occRatio = prop.totalUnits > 0 ? prop.occupiedUnits / prop.totalUnits : 0;
    if (heatmapFilter === 'ALL') return true;
    if (heatmapFilter === 'HIGH_YIELD') return prop.expectedMonthlyRent >= 200000 || prop.healthScore >= 92;
    if (heatmapFilter === 'STABLE') return occRatio >= 0.95;
    if (heatmapFilter === 'NEEDS_ATTENTION') return prop.healthScore < 90 || occRatio < 0.9 || prop.pendingRent > 0;
    if (heatmapFilter === 'VACANT') return prop.occupiedUnits < prop.totalUnits;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-[#132A13]">
      
      {/* ========================================================================= */}
      {/* 1. SUB-NAVIGATION TABS (Overview, Properties, Banks, Vault, Team, Power)  */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E8EFE2] pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Universal Overview
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'properties'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Properties &amp; Units ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('bank_accounts')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'bank_accounts'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Direct Banks ({bankAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'documents'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Deeds &amp; Vault ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('delegates')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'delegates'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Team Delegates ({delegates.length})
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === 'utilities'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                : 'text-[#31572C] hover:text-[#132A13] hover:bg-[#F3F6EE]'
            }`}
          >
            Utility OCR Bills ({electricityBills.length})
          </button>
        </div>

        <button
          onClick={() => setIsAddPropertyOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold transition shrink-0 shadow-xs"
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#132A13] tracking-tight">
                  Hello, {currentUser.name.split(' ')[0] || 'Vikram'}
                </h1>
                <p className="text-xs text-[#657D5C] mt-1 font-medium">
                  Track property performance, collections, and team tasks. You almost reach your revenue goal!
                </p>
              </div>

              {/* Date Pill & Quick Action */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button 
                  onClick={() => setActiveView('reports')}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#31572C] transition shadow-2xs flex items-center gap-1"
                >
                  <span>P&amp;L Statement</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#31572C] shadow-2xs">
                  <span>16 May, 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-[#4F772D]" />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TOTAL PORTFOLIO GLANCE (EXACT CLEAN 4-CARD DESIGN FROM REFERENCE IMAGE)   */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Revenue & Inflow */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE5D3] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#657D5C]">Hospitality &amp; Rent Inflow</span>
                  <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2.5 py-0.5 rounded-full border border-[#31572C]/10">
                    +24% YoY
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#132A13] font-tabular mt-2 tracking-tight">
                  ₹15,90,000
                </div>
                <span className="text-[11px] text-[#657D5C] mt-1 block">
                  ₹16.4L Expected • 97% Collection Rate
                </span>
              </div>

              {/* Card 2: Unit & Bed Occupancy */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE5D3] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#657D5C]">Portfolio Unit Occupancy</span>
                  <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2.5 py-0.5 rounded-full border border-[#31572C]/10">
                    High Season
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#31572C] font-tabular mt-2 tracking-tight">
                  94.2%
                </div>
                <span className="text-[11px] text-[#657D5C] mt-1 block">
                  {occupiedUnitsCount}/{totalUnitsCount} Units • 21 PG Beds Active
                </span>
              </div>

              {/* Card 3: Active Stays & Leases */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE5D3] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#657D5C]">Active Stays &amp; Leases</span>
                  <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2.5 py-0.5 rounded-full border border-[#31572C]/10">
                    52 Leases
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#132A13] font-tabular mt-2 tracking-tight">
                  56 Stays Live
                </div>
                <span className="text-[11px] text-[#657D5C] mt-1 block">
                  4 Renewals this Month • 5 Buildings
                </span>
              </div>

              {/* Card 4: Net Operating Cashflow (NOI) */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE5D3] shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#657D5C]">Net Operating Cashflow</span>
                  <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2.5 py-0.5 rounded-full border border-[#31572C]/10">
                    Net Surplus
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#31572C] font-tabular mt-2 tracking-tight">
                  +₹13,41,500
                </div>
                <span className="text-[11px] text-[#657D5C] mt-1 block">
                  +84.4% Margin • ₹48.5L in Escrow
                </span>
              </div>

            </div>

            {/* Performance Chart Card (Human-Readable, Responsive with Clear Y-Axis & Tooltips) */}
            <div className="rounded-3xl bg-white border border-[#DCE5D3] p-4 sm:p-5 md:p-6 shadow-xs space-y-4">
              
              {/* Header & Range Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8EFE2]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-[#132A13] tracking-tight">Collection &amp; Yield Performance</h3>
                    <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] border border-[#31572C]/20 shrink-0">
                      +12% vs Last Month
                    </span>
                  </div>
                  <p className="text-xs text-[#657D5C] mt-1 font-medium">
                    Real-time rent collection pace compared against prior month with live yield trajectory
                  </p>
                </div>
                
                {/* Legend & Cycle Toggle */}
                <div className="flex items-center gap-2 flex-wrap text-xs self-start sm:self-auto">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#F3F6EE] border border-[#DCE5D3]">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#132A13]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#31572C] shrink-0" />
                      <span>May 2026 (Active)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#657D5C]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4F772D]/40 border border-[#4F772D] shrink-0" />
                      <span>Apr 2026</span>
                    </span>
                  </div>

                  <div className="flex items-center rounded-full bg-[#F3F6EE] p-0.5 border border-[#DCE5D3]">
                    {['01-07 May', 'Monthly', 'Quarterly'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedChartRange(range)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                          selectedChartRange === range
                            ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs'
                            : 'text-[#657D5C] hover:text-[#132A13]'
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
                <div className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] transition hover:border-[#31572C]">
                  <div className="text-[10px] sm:text-[11px] text-[#657D5C] font-semibold">Selected Day Collection</div>
                  <div className="text-sm sm:text-base font-black text-[#132A13] font-tabular mt-0.5">
                    {hoveredDay === '01' ? '₹4.20 Lakhs' :
                     hoveredDay === '02' ? '₹9.50 Lakhs' :
                     hoveredDay === '03' ? '₹15.90 Lakhs' :
                     hoveredDay === '04' ? '₹16.10 Lakhs' :
                     hoveredDay === '05' ? '₹16.25 Lakhs' :
                     hoveredDay === '06' ? '₹16.35 Lakhs' : '₹16.40 Lakhs'}
                  </div>
                  <span className="text-[10px] text-[#31572C] font-bold mt-0.5 block">
                    {hoveredDay === '03' ? '🔥 Peak Inflow (97% Met)' :
                     hoveredDay === '01' ? 'Cycle start • 25.6% Met' :
                     hoveredDay === '02' ? 'UPI Autopay • 57.9% Met' :
                     hoveredDay === '07' ? '100% Target Achieved' : 'Reconciliation on track'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] transition hover:border-[#31572C]">
                  <div className="text-[10px] sm:text-[11px] text-[#657D5C] font-semibold">Monthly Peak Day</div>
                  <div className="text-sm sm:text-base font-black text-[#31572C] font-tabular mt-0.5">
                    03 May (₹15.9L)
                  </div>
                  <span className="text-[10px] text-[#657D5C] font-medium mt-0.5 block">
                    +₹1.70L vs Apr Peak Day
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] transition hover:border-[#31572C]">
                  <div className="text-[10px] sm:text-[11px] text-[#657D5C] font-semibold">On-Time Collection Rate</div>
                  <div className="text-sm sm:text-base font-black text-[#31572C] font-tabular mt-0.5">
                    97.0% On-Time
                  </div>
                  <span className="text-[10px] text-[#4F772D] font-bold mt-0.5 block">
                    ₹50,000 pending reconciliation
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] transition hover:border-[#31572C]">
                  <div className="text-[10px] sm:text-[11px] text-[#657D5C] font-semibold">Realized Portfolio APY</div>
                  <div className="text-sm sm:text-base font-black text-[#132A13] font-tabular mt-0.5">
                    8.4% Net Yield
                  </div>
                  <span className="text-[10px] text-[#657D5C] font-medium mt-0.5 block">
                    +0.6% vs market benchmark
                  </span>
                </div>
              </div>

              {/* Human-Readable Chart Container (Y-Axis + SVG + X-Axis) */}
              <div className="relative pt-1 sm:pt-2">
                
                {/* 2-Column Grid: Y-Axis labels (left) + SVG Chart Area (right) */}
                <div className="flex items-stretch gap-2 sm:gap-3">
                  
                  {/* Y-Axis Currency Scale Labels */}
                  <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-bold text-[#657D5C] font-tabular py-1 text-right select-none shrink-0 w-8 sm:w-10">
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
                      className="absolute top-1 z-30 bg-[#132A13] text-white rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-1 text-xs w-40 sm:w-48 transition-all duration-200 border border-[#4F772D] pointer-events-none"
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
                        <span className="text-[11px] sm:text-xs font-black text-[#ECF39E]">
                          {hoveredDay} May 2026 ({
                            hoveredDay === '01' ? 'Fri' :
                            hoveredDay === '02' ? 'Sat' :
                            hoveredDay === '03' ? 'Sun' :
                            hoveredDay === '04' ? 'Mon' :
                            hoveredDay === '05' ? 'Tue' :
                            hoveredDay === '06' ? 'Wed' : 'Thu'
                          })
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#31572C] text-[#ECF39E] font-bold shrink-0">
                          {hoveredDay === '03' ? '🔥 Peak' : 'Recorded'}
                        </span>
                      </div>
                      
                      <div className="pt-1 border-t border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-[#EBF0E6]">
                            <span className="w-1.5 h-3 rounded-full bg-[#ECF39E]" />
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
                          <span className="flex items-center gap-1 text-[#EBF0E6]/70">
                            <span className="w-1.5 h-3 rounded-full bg-[#4F772D]" />
                            Apr Inflow:
                          </span>
                          <span className="font-semibold text-[#EBF0E6] font-tabular">
                            {hoveredDay === '01' ? '₹3.80L' :
                             hoveredDay === '02' ? '₹8.10L' :
                             hoveredDay === '03' ? '₹14.20L' :
                             hoveredDay === '04' ? '₹14.80L' :
                             hoveredDay === '05' ? '₹15.10L' :
                             hoveredDay === '06' ? '₹15.30L' : '₹15.50L'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#ECF39E] pt-0.5 border-t border-white/5">
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
                          <stop offset="0%" stopColor="#31572C" stopOpacity="0.32" />
                          <stop offset="50%" stopColor="#31572C" stopOpacity="0.10" />
                          <stop offset="100%" stopColor="#31572C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Gridlines matching Y-Axis Scale */}
                      <line x1="0" y1="10" x2="700" y2="10" stroke="#E8EFE2" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="50" x2="700" y2="50" stroke="#E8EFE2" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#E8EFE2" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="130" x2="700" y2="130" stroke="#E8EFE2" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="170" x2="700" y2="170" stroke="#DCE5D3" strokeWidth="1.5" />

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
                        stroke="#31572C" 
                        strokeWidth="1.5" 
                        strokeDasharray="3 3" 
                      />

                      {/* Secondary Curve (April 2026 - Dashed Olive) */}
                      <path
                        d="M 50,140 C 100,120 150,95 250,52 C 350,45 450,42 550,40 C 600,39 650,38 650,38"
                        fill="none"
                        stroke="#657D5C"
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
                        stroke="#31572C"
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
                              stroke="#657D5C" 
                              strokeWidth="1.5" 
                            />

                            {/* May dot with animated focus aura */}
                            {isHovered && (
                              <circle 
                                cx={dot.cx} 
                                cy={dot.cyThis} 
                                r={10} 
                                fill="#ECF39E" 
                                opacity={0.4}
                              />
                            )}

                            <circle 
                              cx={dot.cx} 
                              cy={dot.cyThis} 
                              r={isHovered ? 6.5 : 4} 
                              fill={isHovered ? "#ECF39E" : "#31572C"} 
                              stroke="#132A13" 
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
                            ? 'bg-[#132A13] text-[#ECF39E] shadow-sm ring-1 ring-[#31572C]'
                            : 'text-[#657D5C] hover:text-[#132A13] hover:bg-[#F3F6EE] bg-transparent'
                        }`}
                      >
                        <span className="font-extrabold">{id} May</span>
                        <span className={`text-[9px] font-medium transition ${isSelected ? 'text-[#ECF39E]/80' : 'text-[#657D5C]/70'}`}>
                          {dayOfWeek}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Current Operations Tasks List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#132A13]">Current Operational Tasks</h3>
                  <span className="text-xs text-[#31572C] font-extrabold bg-[#ECF39E] px-2 py-0.5 rounded-full">Done 88%</span>
                </div>

                <button className="flex items-center gap-1 text-xs font-bold text-[#31572C] hover:text-[#132A13] transition">
                  <span>This Week</span>
                  <ChevronDown className="h-3 w-3 text-[#4F772D]" />
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-2">
                {tasksList.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DCE5D3] hover:border-[#31572C] flex items-center justify-between gap-3 text-xs shadow-2xs transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-[#F3F6EE] border border-[#DCE5D3] flex items-center justify-center text-[#132A13] shrink-0">
                        {task.icon === 'sparkles' && <Zap className="h-4 w-4 text-[#31572C]" />}
                        {task.icon === 'search' && <Search className="h-4 w-4 text-[#4F772D]" />}
                        {task.icon === 'code' && <Laptop className="h-4 w-4 text-[#31572C]" />}
                      </div>
                      <span className="font-bold text-[#132A13] truncate">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${task.statusColor}`} />
                        <span className="text-xs font-bold text-[#31572C] hidden sm:inline">{task.status}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#657D5C] font-bold font-tabular">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{task.hours}</span>
                      </div>

                      <button className="text-[#657D5C] hover:text-[#132A13] p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT 4-COL: PROFILE CARD, ACTIVITY CHAT FEED, MESSAGE INPUT        */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Top Profile Card */}
            <div className="rounded-3xl bg-[#F3F6EE] border border-[#DCE5D3] p-5 text-center space-y-4">
              <div className="relative inline-block mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs mx-auto"
                />
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-[#ECF39E] ring-2 ring-[#132A13]" />
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#132A13]">
                  {currentUser.name || 'Vikram Singhania'}
                </h3>
                <p className="text-xs text-[#657D5C] font-bold mt-0.5">
                  {currentUser.roleLabel || 'Property & Asset Host'}
                </p>
              </div>

              {/* 3 Circular Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button 
                  onClick={() => alert('Call connected with tenant WhatsApp gateway')}
                  className="h-10 w-10 rounded-full bg-white border border-[#DCE5D3] flex items-center justify-center text-[#132A13] hover:bg-[#ECF39E] transition shadow-2xs"
                  title="Phone Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => alert('Live video inspection room generated.')}
                  className="h-10 w-10 rounded-full bg-white border border-[#DCE5D3] flex items-center justify-center text-[#132A13] hover:bg-[#ECF39E] transition shadow-2xs"
                  title="Video Inspection"
                >
                  <Video className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setActiveView('settings')}
                  className="h-10 w-10 rounded-full bg-white border border-[#DCE5D3] flex items-center justify-center text-[#132A13] hover:bg-[#ECF39E] transition shadow-2xs"
                  title="Settings"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Activity & Chat Feed */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#132A13] px-1">Live Tenant &amp; Team Activity</h3>

              <div className="space-y-3.5">
                {activityFeed.map((item) => (
                  <div key={item.id} className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          className="h-7 w-7 rounded-full object-cover shrink-0 border border-[#DCE5D3]" 
                        />
                        <div className="truncate">
                          <span className="font-extrabold text-[#132A13] mr-1">{item.name}</span>
                          <span className="text-[11px] text-[#657D5C]">{item.action}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#657D5C] font-tabular shrink-0">{item.time}</span>
                    </div>

                    {item.type === 'message' && item.text && (
                      <div className="relative ml-9 p-3 rounded-2xl bg-[#F3F6EE] text-[#132A13] text-xs font-medium leading-relaxed border border-[#DCE5D3]">
                        <p>{item.text}</p>
                        {item.reaction && (
                          <div className="absolute -bottom-2 right-2 h-5 w-5 rounded-full bg-[#ECF39E] border border-[#132A13]/20 flex items-center justify-center text-[10px] shadow-2xs">
                            {item.reaction}
                          </div>
                        )}
                      </div>
                    )}

                    {item.type === 'file' && (
                      <div className="ml-9 p-2.5 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-xl bg-[#132A13] text-[#ECF39E] flex items-center justify-center font-bold text-[10px] shrink-0">
                            PDF
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-[#132A13] truncate">{item.fileName}</div>
                            <div className="text-[10px] text-[#657D5C]">{item.fileSize}</div>
                          </div>
                        </div>

                        <button 
                          onClick={() => alert(`Downloading ${item.fileName}...`)}
                          className="h-7 w-7 rounded-full bg-white border border-[#DCE5D3] flex items-center justify-center text-[#31572C] hover:bg-[#ECF39E] transition shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>

              {/* Chat Message Input Bar */}
              <form onSubmit={handleSendMessage} className="pt-2">
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs shadow-2xs">
                  <button type="button" className="text-[#4F772D] hover:text-[#132A13] transition">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    placeholder="Message tenant or team..."
                    className="flex-1 bg-transparent border-none outline-none text-[#132A13] placeholder-[#657D5C] text-xs font-medium"
                  />
                  <button type="button" className="text-[#4F772D] hover:text-[#132A13] transition">
                    <Smile className="h-4 w-4" />
                  </button>
                  <button type="button" className="text-[#4F772D] hover:text-[#132A13] transition">
                    <Mic className="h-4 w-4" />
                  </button>
                  {chatMessage && (
                    <button type="submit" className="text-[#132A13] hover:text-[#31572C]">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F3F6EE] p-4 rounded-2xl border border-[#DCE5D3]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#657D5C]">Filter Heatmap:</span>
              {(['ALL', 'HIGH_YIELD', 'STABLE', 'NEEDS_ATTENTION', 'VACANT'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setHeatmapFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    heatmapFilter === filter 
                      ? 'bg-[#132A13] text-[#ECF39E]' 
                      : 'bg-white text-[#31572C] hover:text-[#132A13] border border-[#DCE5D3]'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold shadow-xs transition"
            >
              + Add New Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map(prop => (
              <div 
                key={prop.id}
                className="rounded-2xl bg-white border border-[#DCE5D3] p-5 shadow-xs hover:border-[#31572C] transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] border border-[#132A13]/20">
                      {prop.type}
                    </span>
                    <h3 className="font-extrabold text-base text-[#132A13] mt-1.5">{prop.name}</h3>
                    <p className="text-xs text-[#657D5C]">{prop.address}</p>
                  </div>
                  <div className="h-8 w-8 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] flex items-center justify-center text-xs font-black text-[#132A13]">
                    {prop.healthScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8EFE2] text-xs">
                  <div>
                    <span className="text-[10px] text-[#657D5C]">Units Occupancy</span>
                    <div className="font-bold text-[#132A13]">{prop.occupiedUnits} / {prop.totalUnits} Units</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657D5C]">Monthly Rent</span>
                    <div className="font-bold text-[#132A13]">₹{prop.expectedMonthlyRent.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8EFE2]">
                  <span className="text-xs text-[#657D5C]">
                    Pending: <strong className="text-rose-600">₹{prop.pendingRent.toLocaleString('en-IN')}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setPropertyToEdit(prop);
                        setIsEditPropertyModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#ECF39E] text-xs font-bold text-[#132A13] border border-[#DCE5D3] transition"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: BANK ACCOUNTS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'bank_accounts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#F3F6EE] p-4 rounded-2xl border border-[#DCE5D3]">
            <div>
              <h3 className="text-sm font-extrabold text-[#132A13]">Direct Bank Payout Accounts</h3>
              <p className="text-xs text-[#657D5C]">Automated payouts routed directly to verified nodal accounts</p>
            </div>
            <button
              onClick={() => setIsAddBankModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold shadow-xs transition"
            >
              + Add Bank Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(bank => (
              <div key={bank.id} className="p-5 rounded-2xl bg-white border border-[#DCE5D3] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-[#F3F6EE] text-[#31572C] flex items-center justify-center font-bold">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#132A13]">{bank.bankName}</h4>
                      <p className="text-xs text-[#657D5C] font-mono">{bank.accountNumber}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] text-[10px] font-black border border-[#132A13]/20">
                    {bank.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E8EFE2]">
                  <div>
                    <span className="text-[10px] text-[#657D5C]">IFSC Code:</span>
                    <div className="font-bold text-[#132A13]">{bank.ifsc}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657D5C]">Holder:</span>
                    <div className="font-bold text-[#132A13] truncate">{bank.holderName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: DIGITAL DOCUMENT VAULT                                         */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#F3F6EE] p-4 rounded-2xl border border-[#DCE5D3]">
            <div>
              <h3 className="text-sm font-extrabold text-[#132A13]">Legal Deeds &amp; Document Vault</h3>
              <p className="text-xs text-[#657D5C]">DigiLocker &amp; Municipal statutory registry verified documents</p>
            </div>
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold shadow-xs transition"
            >
              + Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="p-4 rounded-2xl bg-white border border-[#DCE5D3] shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F3F6EE] text-[#31572C] flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#132A13]">{doc.title}</h4>
                    <p className="text-[10px] text-[#657D5C]">{doc.category} • {doc.size}</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="p-2 rounded-full hover:bg-[#ECF39E] text-[#31572C] hover:text-[#132A13] transition"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: TEAM DELEGATES                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'delegates' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#F3F6EE] p-4 rounded-2xl border border-[#DCE5D3]">
            <div>
              <h3 className="text-sm font-extrabold text-[#132A13]">Team &amp; Authorized Delegates</h3>
              <p className="text-xs text-[#657D5C]">Access management for Accountants, Managers, and Auditors</p>
            </div>
            <button
              onClick={() => setIsAddDelegateModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold shadow-xs transition"
            >
              + Invite Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {delegates.map(del => (
              <div key={del.id} className="p-5 rounded-2xl bg-white border border-[#DCE5D3] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#132A13]">{del.name}</h4>
                    <p className="text-xs text-[#657D5C]">{del.email} • {del.phone}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] text-[10px] font-black border border-[#132A13]/20">
                    {del.role}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E8EFE2]">
                  {del.permissions.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#F3F6EE] border border-[#DCE5D3] text-[10px] text-[#31572C] font-semibold">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB VIEW: UTILITIES & POWER BILLS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'utilities' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-[#F3F6EE] p-4 rounded-2xl border border-[#DCE5D3]">
            <div>
              <h3 className="text-sm font-extrabold text-[#132A13]">Electricity &amp; Utility Sub-Meters</h3>
              <p className="text-xs text-[#657D5C]">AI OCR extraction and automated WhatsApp bill sharing with tenants</p>
            </div>
            <button
              onClick={() => {
                setPreselectedUnitForUpload('101');
                setIsUploadBillModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold shadow-xs transition"
            >
              + Upload Power Bill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {electricityBills.map(bill => (
              <div key={bill.id} className="p-5 rounded-2xl bg-white border border-[#DCE5D3] shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-[#132A13]">Unit {bill.unitNumber}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] font-black border border-[#132A13]/20">
                        {bill.propertyName}
                      </span>
                    </div>
                    <p className="text-xs text-[#657D5C] mt-0.5">{bill.tenantName || 'Occupied'}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    bill.status === 'Paid' ? 'bg-[#ECF39E] text-[#132A13]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#657D5C]">Provider:</span>
                    <span className="font-bold text-[#132A13]">{bill.discom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#657D5C]">Consumption:</span>
                    <span className="font-bold text-[#132A13]">{bill.unitsConsumed} Units</span>
                  </div>
                  <div className="flex justify-between border-t border-[#DCE5D3] pt-1">
                    <span className="text-[#657D5C]">Bill Amount:</span>
                    <span className="font-black text-sm text-[#132A13]">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BANK ACCOUNT                                                   */}
      {/* ========================================================================= */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCE5D3] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#132A13]">Add Bank Account</h3>
              <button onClick={() => setIsAddBankModalOpen(false)} className="text-[#657D5C] hover:text-[#132A13]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setIsAddBankModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#31572C]">Bank Name</label>
                <input 
                  type="text" 
                  value={newBank.bankName}
                  onChange={e => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#132A13]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#31572C]">Account Number</label>
                <input 
                  type="password" 
                  value={newBank.accountNumber}
                  onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#132A13]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#31572C]">IFSC Code</label>
                <input 
                  type="text" 
                  value={newBank.ifsc}
                  onChange={e => setNewBank({ ...newBank, ifsc: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#132A13]"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-full bg-[#132A13] text-[#ECF39E] text-xs font-black hover:bg-[#31572C] transition">
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
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCE5D3] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#132A13]">Upload Document</h3>
              <button onClick={() => setIsUploadDocModalOpen(false)} className="text-[#657D5C] hover:text-[#132A13]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setIsUploadDocModalOpen(false); }} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#31572C]">Title</label>
                <input 
                  type="text" 
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#132A13]"
                  required
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-full bg-[#132A13] text-[#ECF39E] text-xs font-black hover:bg-[#31572C] transition">
                Upload to Vault
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
