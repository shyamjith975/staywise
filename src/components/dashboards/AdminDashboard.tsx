'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { InfluencerOffer, DepositSettlementDispute, MaintenanceTicket, TenantReferralItem } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  Database, 
  Receipt, 
  Building2, 
  Users2, 
  CheckCircle2, 
  AlertTriangle, 
  Gift, 
  Share2, 
  Copy, 
  Plus, 
  X, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Eye, 
  Check, 
  Building,
  TrendingUp,
  Percent,
  Search,
  Tag,
  Wrench,
  Scale,
  Clock,
  ArrowUpRight,
  DollarSign,
  Wallet,
  Landmark,
  UserCheck,
  Megaphone,
  CreditCard,
  BarChart3,
  PieChart,
  Shield,
  Layers,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Server,
  Cpu,
  Activity,
  HardDrive,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    ledger, 
    properties, 
    tenants, 
    invoices, 
    tickets,
    depositDisputes, 
    resolveDepositDispute,
    referrals,
    approveProperty, 
    deleteProperty, 
    influencerOffers, 
    addInfluencerOffer, 
    toggleInfluencerOfferStatus,
    addNotification 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'OWNERS' | 'ANALYTICS' | 'MAINTENANCE_DISPUTES' | 'REFERRALS' | 'PROPERTIES' | 'LEDGER'>('OWNERS');
  const [propertyFilter, setPropertyFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [ticketFilter, setTicketFilter] = useState<'ALL' | 'DISPUTED' | 'EMERGENCY' | 'RESOLVED'>('ALL');
  const [selectedAuditDocs, setSelectedAuditDocs] = useState<{ name: string; docs: string[] } | null>(null);

  // Load Balancer & Health Probe State
  const [healthData, setHealthData] = useState<any | null>(null);
  const [probingHealth, setProbingHealth] = useState(false);

  const handleProbeHealth = async () => {
    setProbingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
      addNotification('Health Check 200 OK', `Load balancer cluster healthy. Latency: ${data.latencyMs}ms across ${data.loadBalancer.healthyReplicas} replicas.`, 'SYSTEM');
    } catch (err: any) {
      addNotification('Health Probe Alert', 'Failed to reach health check endpoint', 'SYSTEM');
    } finally {
      setProbingHealth(false);
    }
  };

  // New Influencer / Marketing Referral Campaign Modal State
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState<{
    code: string;
    influencerName: string;
    influencerHandle: string;
    channel: string;
    commissionType: 'PERCENTAGE' | 'FLAT';
    commissionValue: number;
    audienceOffer: string;
    targetAudience: 'Tenants' | 'Landlords' | 'Both';
    status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  }>({
    code: '',
    influencerName: '',
    influencerHandle: '',
    channel: 'Instagram Reels',
    commissionType: 'FLAT',
    commissionValue: 3000,
    audienceOffer: '₹1,500 Off 1st Month Rent + Zero Brokerage',
    targetAudience: 'Both',
    status: 'ACTIVE'
  });

  const [features, setFeatures] = useState({
    whatsapp_ai: true,
    ai_calling: false,
    flexpay: true,
    estate_os: true,
    double_ledger_enforcement: true,
    auto_escrow_settlement: true
  });

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculations for Owners Directory
  const totalRooms = properties.reduce((acc, p) => acc + (p.totalUnits || 0), 0);
  const totalOccupiedRooms = properties.reduce((acc, p) => acc + (p.occupiedUnits || 0), 0);
  const totalMonthlyExpectedRent = properties.reduce((acc, p) => acc + (p.expectedMonthlyRent || 0), 0);
  
  // Total Gross Processed Payments
  const grossPayments = ledger.filter(l => l.type === 'CREDIT').reduce((acc, l) => acc + l.amount, 0) || 2845000;
  const platformTakeRateEarnings = Math.round(grossPayments * 0.025); // 2.5% platform commission
  const totalOwnerPayoutsReconciled = grossPayments - platformTakeRateEarnings;

  const pendingProperties = properties.filter(p => p.verificationStatus === 'PENDING');
  const approvedProperties = properties.filter(p => p.verificationStatus !== 'PENDING');

  const filteredProperties = properties.filter(p => {
    if (propertyFilter === 'PENDING') return p.verificationStatus === 'PENDING';
    if (propertyFilter === 'APPROVED') return p.verificationStatus !== 'PENDING';
    return true;
  });

  // Filtered maintenance tickets
  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === 'DISPUTED') return t.priority === 'Emergency' || t.status === 'Vendor Assigned';
    if (ticketFilter === 'EMERGENCY') return t.priority === 'Emergency';
    if (ticketFilter === 'RESOLVED') return t.status === 'Completed' || t.status === 'Closed';
    return true;
  });

  // Owner accounts aggregated
  const ownersList = [
    {
      id: 'owner-vikram',
      name: 'Vikram Singhania',
      email: 'owner@staywise.com',
      phone: '+91 98470 12891',
      avatar: '👨‍💼',
      category: 'Residential & Commercial Landlord',
      portfolio: 'Trivandrum Heights & Bangalore Luxury',
      propertiesCount: properties.filter(p => p.type === 'Apartment' || p.type === 'Commercial').length || 3,
      roomsCount: properties.filter(p => p.type === 'Apartment' || p.type === 'Commercial').reduce((acc, p) => acc + p.totalUnits, 0) || 26,
      occupiedRooms: properties.filter(p => p.type === 'Apartment' || p.type === 'Commercial').reduce((acc, p) => acc + p.occupiedUnits, 0) || 24,
      monthlyExpectedRent: properties.filter(p => p.type === 'Apartment' || p.type === 'Commercial').reduce((acc, p) => acc + p.expectedMonthlyRent, 0) || 380000,
      totalPayoutDisbursed: 1425000,
      escrowStatus: 'Escrow Reconciled',
      bankDetails: 'Axis Escrow Trust •••• 8821',
      activeTenantsCount: 24,
      kycVerified: true
    },
    {
      id: 'owner-estate-manoj',
      name: 'Manoj Kumar',
      email: 'estate@staywise.com',
      phone: '+91 94471 88302',
      avatar: '🏡',
      category: 'EstateOS & Hospitality Host',
      portfolio: 'Malabar Heritage Villa Collection',
      propertiesCount: properties.filter(p => p.type === 'Villa').length || 2,
      roomsCount: 18,
      occupiedRooms: 15,
      monthlyExpectedRent: 280000,
      totalPayoutDisbursed: 760000,
      escrowStatus: 'Escrow Reconciled',
      bankDetails: 'HDFC Bank •••• 4912',
      activeTenantsCount: 15,
      kycVerified: true
    },
    {
      id: 'owner-prestige-group',
      name: 'Prestige Realty Holdings',
      email: 'holdings@prestigegroup.in',
      phone: '+91 80 4123 9900',
      avatar: '🏢',
      category: 'Institutional Real Estate Consortium',
      portfolio: 'Prestige Tech Hub & Silicon Park',
      propertiesCount: 2,
      roomsCount: 28,
      occupiedRooms: 26,
      monthlyExpectedRent: 540000,
      totalPayoutDisbursed: 660000,
      escrowStatus: 'Escrow Reconciled',
      bankDetails: 'ICICI Virtual A/C •••• 3109',
      activeTenantsCount: 26,
      kycVerified: true
    }
  ];

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code.trim() || !newOffer.influencerName.trim()) return;

    addInfluencerOffer({
      code: newOffer.code.toUpperCase().replace(/\s+/g, ''),
      influencerName: newOffer.influencerName,
      influencerHandle: newOffer.influencerHandle || `@${newOffer.influencerName.toLowerCase().replace(/\s+/g, '')}`,
      commissionType: newOffer.commissionType,
      commissionValue: Number(newOffer.commissionValue) || 3000,
      audienceOffer: newOffer.audienceOffer,
      targetAudience: newOffer.targetAudience,
      status: 'ACTIVE'
    });

    setIsCreateOfferModalOpen(false);
    setNewOffer({
      code: '',
      influencerName: '',
      influencerHandle: '',
      channel: 'Instagram Reels',
      commissionType: 'FLAT',
      commissionValue: 3000,
      audienceOffer: '₹1,500 Off 1st Month Rent + Zero Brokerage',
      targetAudience: 'Both',
      status: 'ACTIVE'
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(`https://staywise.in/join?ref=${code}`);
    addNotification('Referral Link Copied', `Sharable referral URL for "${code}" copied to clipboard!`, 'SYSTEM');
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Super Admin Root Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Super Admin &amp; Governance Center
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-extrabold border border-rose-200">
              Platform Surveillance
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Read-only institutional surveillance: owners &amp; rooms, total payments &amp; platform growth analytics, maintenance disputes, and marketing referral engine.
          </p>
        </div>

        {/* Root Security Status Indicator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-[#e3e1d8] text-xs shadow-sm self-start sm:self-auto">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700">Root Governance Active</span>
        </div>
      </div>

      {/* Global Platform Surveillance Aggregations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Owners &amp; Hosts</span>
          <div className="text-2xl font-black text-[#19251f] mt-1">{ownersList.length} Owners</div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% KYC &amp; RERA Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Rooms &amp; Units</span>
          <div className="text-2xl font-black text-[#19251f] mt-1">{totalRooms} Rooms</div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{totalOccupiedRooms} Occupied ({Math.round((totalOccupiedRooms / (totalRooms || 1)) * 100)}%)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Owner Payouts</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">
            ₹{(totalOwnerPayoutsReconciled / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% Escrow Reconciled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Gross Total Payments</span>
          <div className="text-2xl font-black text-[#19251f] mt-1 font-tabular">
            ₹{(grossPayments / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">₹{(platformTakeRateEarnings / 1000).toFixed(1)}k Platform Take-Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Active Disputes &amp; Delays</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{depositDisputes.length} Disputes</div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">RBI Trust Protected</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] overflow-x-auto max-w-full text-xs font-bold">
        <button
          onClick={() => setActiveTab('OWNERS')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'OWNERS' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Owners &amp; Rooms Payouts</span>
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'ANALYTICS' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Total Payments &amp; Growth Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('MAINTENANCE_DISPUTES')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'MAINTENANCE_DISPUTES' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Maintenance &amp; Disputes</span>
          {depositDisputes.length > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
              {depositDisputes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('REFERRALS')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'REFERRALS' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Megaphone className="h-4 w-4 text-amber-500" />
          <span>Referrals &amp; Marketing Engine</span>
          <span className="h-5 px-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
            {influencerOffers.length + referrals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PROPERTIES')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'PROPERTIES' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Property Approvals</span>
          {pendingProperties.length > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {pendingProperties.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'LEDGER' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Statutory Ledger</span>
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: OWNERS, ROOMS & TOTAL PAYOUT DIRECTORY                        */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'OWNERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e3e1d8]">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-[#274235]" />
                <span>All Property Owners, Portfolios &amp; Total Disbursed Payouts</span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited ledger of all registered asset owners, room allocations, occupancy, and reconciled escrow payouts.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-[#f7f6f2] px-3 py-1.5 rounded-xl border border-[#e3e1d8]">
              Read-Only Governance Mode
            </span>
          </div>

          {/* Owners Table */}
          <div className="bg-white rounded-2xl border border-[#e3e1d8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Owner Profile</th>
                    <th className="py-3 px-3">Role / Category</th>
                    <th className="py-3 px-3">Properties Managed</th>
                    <th className="py-3 px-3">Total Rooms / Units</th>
                    <th className="py-3 px-3">Occupancy</th>
                    <th className="py-3 px-3">Monthly Expected Rent</th>
                    <th className="py-3 px-3">Total Payout Disbursed</th>
                    <th className="py-3 px-3">Escrow Status</th>
                    <th className="py-3 px-4 text-right">Bank Settlement A/C</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {ownersList.map((owner) => (
                    <tr key={owner.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{owner.avatar}</span>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{owner.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{owner.email}</span>
                              <span>•</span>
                              <span>{owner.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-700 block">{owner.category}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{owner.portfolio}</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-800">
                        {owner.propertiesCount} Assets
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-black text-slate-900 text-sm">{owner.roomsCount} Rooms</span>
                        <span className="text-[10px] text-slate-500 block">{owner.occupiedRooms} Active Units</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-700">
                            {Math.round((owner.occupiedRooms / owner.roomsCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.round((owner.occupiedRooms / owner.roomsCount) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 font-tabular">
                        ₹{(owner.monthlyExpectedRent / 1000).toFixed(0)}k/mo
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-black text-emerald-700 text-sm font-tabular">
                          ₹{(owner.totalPayoutDisbursed / 100000).toFixed(2)}L
                        </div>
                        <span className="text-[10px] text-slate-400 block">Net After 2.5% Fee</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{owner.escrowStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-600 font-semibold">
                        {owner.bankDetails}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: TOTAL PAYMENTS & PLATFORM GROWTH ANALYTICS                    */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Data Surveillance &amp; Performance
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#19251f] mt-1.5">
                  Platform Growth, Total Payments &amp; Revenue Analytics
                </h2>
                <p className="text-xs text-slate-500">
                  Total payments gross processed volume, platform take-rate, collection health, and ecosystem trajectory.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">Total GMV Volume</span>
                <span className="text-2xl font-black text-emerald-700 font-tabular">₹{(grossPayments / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">Platform Take-Rate Revenue (2.5%)</span>
              <div className="text-2xl font-black text-purple-700 font-tabular">
                ₹{platformTakeRateEarnings.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+22.4% MoM Growth</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">On-Time Rent Collection Rate</span>
              <div className="text-2xl font-black text-emerald-700 font-tabular">
                96.8%
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Industry Benchmark: 88.2%
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">Active Tenant Lease Retention</span>
              <div className="text-2xl font-black text-slate-900 font-tabular">
                94.2%
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">
                Average Lease Duration: 14.2 Mos
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">Escrow Dispute Ratio</span>
              <div className="text-2xl font-black text-slate-900 font-tabular">
                0.9%
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Zero Arbitration Escalations
              </span>
            </div>
          </div>

          {/* Growth Charts & Payment Rail Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Monthly Growth Trajectory */}
            <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#19251f]">Month-on-Month GMV Rent Trajectory</h3>
                  <p className="text-[11px] text-slate-500">Total rent and deposits collected through platform escrow</p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  Q3-Q4 2026
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">August 2026</span>
                    <span className="text-slate-900">₹18.20 Lakhs</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">September 2026</span>
                    <span className="text-slate-900">₹23.80 Lakhs (+30.7%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-900 font-extrabold">October 2026 (Current)</span>
                    <span className="text-emerald-700 font-black">₹28.45 Lakhs (+19.5%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Rail Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#19251f]">Payment Rail Distribution (Settlement Mix)</h3>
                  <p className="text-[11px] text-slate-500">Real-time payment rails utilized by active tenants &amp; clients</p>
                </div>
                <span className="text-xs font-bold text-slate-500">RBI Regulated</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">UPI / QR Auto-Routing</span>
                  <div className="text-xl font-black text-slate-900 mt-1">58%</div>
                  <span className="text-[11px] text-slate-500 font-medium">₹16.50 Lakhs Volume</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">NACH e-Mandate</span>
                  <div className="text-xl font-black text-slate-900 mt-1">24%</div>
                  <span className="text-[11px] text-slate-500 font-medium">₹6.82 Lakhs Volume</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">RTGS Virtual Accounts</span>
                  <div className="text-xl font-black text-slate-900 mt-1">12%</div>
                  <span className="text-[11px] text-slate-500 font-medium">₹3.41 Lakhs Volume</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">FlexPay Deposit BNPL</span>
                  <div className="text-xl font-black text-slate-900 mt-1">6%</div>
                  <span className="text-[11px] text-slate-500 font-medium">₹1.72 Lakhs Volume</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: MAINTENANCE & DISPUTES ONLY                                  */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'MAINTENANCE_DISPUTES' && (
        <div className="space-y-6">
          {/* Header & Sub-Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e3e1d8]">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#274235]" />
                <span>Maintenance Tickets &amp; Escrow Disputes Arbitration</span>
              </h2>
              <p className="text-xs text-slate-500">
                Surveillance of operational repair work orders, contractor SLA delays, and tenant deposit dispute settlements.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f7f6f2] border border-[#e8e6de] text-[11px] font-bold">
              <button
                onClick={() => setTicketFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  ticketFilter === 'ALL' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tickets ({tickets.length})
              </button>
              <button
                onClick={() => setTicketFilter('EMERGENCY')}
                className={`px-3 py-1 rounded-lg transition ${
                  ticketFilter === 'EMERGENCY' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Emergency ({tickets.filter(t => t.priority === 'Emergency').length})
              </button>
              <button
                onClick={() => setTicketFilter('RESOLVED')}
                className={`px-3 py-1 rounded-lg transition ${
                  ticketFilter === 'RESOLVED' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Resolved ({tickets.filter(t => t.status === 'Completed' || t.status === 'Closed').length})
              </button>
            </div>
          </div>

          {/* Section 1: Security Deposit & Escrow Disputes */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-rose-900 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-rose-600" />
                  <span>Escrow Security Deposit Disputes Awaiting Arbitration ({depositDisputes.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Super Admin mediates between tenant and landlord prior to releasing funds from RBI escrow trust.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {depositDisputes.map((dispute) => (
                <div 
                  key={dispute.id}
                  className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{dispute.propertyName} • {dispute.unitOrBed}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        dispute.status === 'Refund Processed' ? 'bg-emerald-100 text-emerald-800' :
                        dispute.status === 'Agreed' ? 'bg-teal-100 text-teal-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {dispute.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Resident: <span className="font-bold text-slate-900">{dispute.tenantName}</span> • Escrow Held: <span className="font-bold text-slate-900">₹{dispute.depositPaid.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-rose-100 mt-1">
                      <span className="font-bold text-rose-900">Dispute Claim:</span> ₹{dispute.disputedAmount.toLocaleString('en-IN')} deducted by landlord for repairs. Tenant claim: &quot;{dispute.tenantNotes}&quot;
                    </div>
                  </div>

                  {/* Arbitration Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => resolveDepositDispute(dispute.id, 'Refund Processed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-sm"
                    >
                      Release to Tenant
                    </button>
                    <button
                      type="button"
                      onClick={() => resolveDepositDispute(dispute.id, 'Agreed')}
                      className="px-3.5 py-2 rounded-xl bg-[#19251f] hover:bg-black text-white font-black text-xs transition shadow-sm"
                    >
                      Split 50/50
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Maintenance Tickets Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-3 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
              <Wrench className="h-4 w-4 text-[#274235]" />
              <span>All Maintenance Tickets &amp; Contractor Work Orders ({filteredTickets.length})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Ticket #</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Property &amp; Unit</th>
                    <th className="py-2.5 px-3">Tenant</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Estimated Cost</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{t.ticketNumber}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{t.category}</td>
                      <td className="py-3 px-3 text-slate-700">{t.propertyName} ({t.unitNumber})</td>
                      <td className="py-3 px-3 font-medium text-slate-900">{t.tenantName}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{t.description}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' :
                          t.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-slate-900">
                        ₹{t.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: REFERRALS (SHOW ALL) & INFLUENCER MARKETING ENGINE           */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'REFERRALS' && (
        <div className="space-y-6">
          {/* Generator Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Affiliate &amp; Marketing Engine
                </span>
                <span className="text-xs text-slate-500 font-medium">Influencer Campaigns • Resident Referrals</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#19251f]">
                Influencer Marketing Engine &amp; Platform Referral Tracking
              </h2>
              <p className="text-xs text-slate-500">
                Generate custom promo codes for real estate influencers, YouTubers &amp; marketing channels. Review all organic resident referrals and commission payouts.
              </p>
            </div>

            <button
              onClick={() => setIsCreateOfferModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#19251f] text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-[#274235]/20 shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Influencer Code</span>
            </button>
          </div>

          {/* Section A: Influencer & Marketing Campaigns Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-purple-700" />
                  <span>Active Influencer &amp; Marketing Promo Codes ({influencerOffers.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Direct affiliate links with trackable click-throughs and auto-credited commissions.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Promo Code</th>
                    <th className="py-3 px-3">Influencer / Partner</th>
                    <th className="py-3 px-3">Audience Offer</th>
                    <th className="py-3 px-3">Commission Rate</th>
                    <th className="py-3 px-3">Joins / Conversions</th>
                    <th className="py-3 px-3">Total Commission</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {influencerOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-purple-900 text-sm px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200">
                          {offer.code}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{offer.influencerName}</div>
                        <span className="text-[10px] text-purple-700 font-semibold">{offer.influencerHandle}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {offer.audienceOffer}
                      </td>
                      <td className="py-3 px-3 font-black text-slate-900">
                        {offer.commissionType === 'FLAT' ? `₹${offer.commissionValue.toLocaleString('en-IN')}` : `${offer.commissionValue}%`} / Onboard
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {offer.signupsCount} Joins
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-700 font-tabular">
                        ₹{offer.totalCommissionPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleInfluencerOfferStatus(offer.id)}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition ${
                            offer.status === 'ACTIVE' 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {offer.status}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.code)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#274235] text-slate-700 font-bold text-[11px] transition inline-flex items-center gap-1 shadow-sm"
                          title="Copy sharable referral link"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy Link</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: All Organic Referrals (Residents & Landlords) */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                  <Gift className="h-4 w-4 text-emerald-700" />
                  <span>All Organic Platform Referrals ({referrals.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Peer-to-peer resident invites and owner referral bonuses.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Referral Code</th>
                    <th className="py-2.5 px-3">Referred Person</th>
                    <th className="py-2.5 px-3">Property Universe</th>
                    <th className="py-2.5 px-3">Reward Amount</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{ref.referralCode}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{ref.referredName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{ref.propertyType}</td>
                      <td className="py-2.5 px-3 font-black text-emerald-700 font-tabular">₹{ref.rewardAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-500">{ref.date}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ref.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                          ref.status === 'Redeemed' ? 'bg-teal-100 text-teal-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 5: PROPERTY APPROVALS & STATUTORY DOCUMENT AUDITS                */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'PROPERTIES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e3e1d8]">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Property Verification &amp; Document Audit Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Review owner-submitted title deeds, building permits &amp; fire safety NOCs before approving active listing.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f7f6f2] border border-[#e8e6de] text-[11px] font-bold">
              <button
                onClick={() => setPropertyFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  propertyFilter === 'ALL' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({properties.length})
              </button>
              <button
                onClick={() => setPropertyFilter('PENDING')}
                className={`px-3 py-1 rounded-lg transition ${
                  propertyFilter === 'PENDING' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Verification ({pendingProperties.length})
              </button>
              <button
                onClick={() => setPropertyFilter('APPROVED')}
                className={`px-3 py-1 rounded-lg transition ${
                  propertyFilter === 'APPROVED' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved ({approvedProperties.length})
              </button>
            </div>
          </div>

          {/* Properties List */}
          <div className="space-y-3">
            {filteredProperties.map((prop) => {
              const isPending = prop.verificationStatus === 'PENDING';
              const submittedDocs = prop.submittedDocs || ['Title_Deed_Ownership.pdf', 'Fire_Safety_NOC.pdf', 'Building_Permit.pdf'];

              return (
                <div
                  key={prop.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition ${
                    isPending 
                      ? 'border-amber-300 shadow-md ring-1 ring-amber-200' 
                      : 'border-[#e3e1d8] hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative h-16 w-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={prop.imageUrl} alt={prop.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {prop.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {prop.portfolio}
                          </span>
                          {isPending ? (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Pending Admin Verification</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified &amp; Approved</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-black text-slate-900 mt-1 truncate">{prop.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{prop.address}, {prop.city}, {prop.state} - {prop.pincode}</p>

                        <div className="flex items-center gap-3 pt-2 text-xs">
                          <span className="font-bold text-slate-700">
                            {prop.occupiedUnits} / {prop.totalUnits} Units Occupied
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-black text-slate-900 font-tabular">
                            ₹{(prop.expectedMonthlyRent / 1000).toFixed(0)}k/mo Expected
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedAuditDocs({ name: prop.name, docs: submittedDocs })}
                        className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Audit {submittedDocs.length} Submitted Documents</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => approveProperty(prop.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <Check className="h-4 w-4" />
                            <span>Approve &amp; Verify Property</span>
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Active in Portfolio</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${prop.name}" as Admin?`)) {
                              deleteProperty(prop.id);
                            }
                          }}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 6: IMMUTABLE LEDGER & FEATURE CONTROLS                          */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'LEDGER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-[#e3e1d8] space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#274235] shrink-0" />
                  <span>Immutable Financial Ledger (Double-Entry Trace)</span>
                </h3>
                <p className="text-[11px] text-[#6e7972]">Every adjustment and payment has an immutable statutory audit trace.</p>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0 self-start sm:self-auto">
                Live Feed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-[#6e7972] border-b border-[#e3e1d8] text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Debit Account</th>
                    <th className="py-2.5 px-3">Credit Account</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeece5]">
                  {ledger.slice(0, 10).map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#fbfbfa]">
                      <td className="py-2.5 px-3 text-[#6e7972] font-mono text-[11px]">{entry.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#19251f]">{entry.description}</td>
                      <td className="py-2.5 px-3 text-rose-700 font-mono text-[11px]">{entry.type === 'DEBIT' ? entry.account : 'Escrow Clearing'}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-mono text-[11px]">{entry.type === 'CREDIT' ? entry.account : 'Axis Operating A/C'}</td>
                      <td className="py-2.5 px-3 text-right font-black text-[#19251f] font-tabular">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e3e1d8] space-y-4 shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#274235]" />
                <span>Feature Flags &amp; Governance</span>
              </h3>
              <p className="text-[11px] text-[#6e7972]">Enable or disable enterprise modules platform-wide.</p>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(features).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => toggleFeature(key as keyof typeof features)}
                  className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between cursor-pointer hover:bg-white transition"
                >
                  <div>
                    <div className="font-bold text-[#19251f] capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-[#6e7972]">
                      {val ? 'Active platform-wide' : 'Disabled'}
                    </div>
                  </div>

                  <div>
                    {val ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load Balancer & High-Availability Cluster Infrastructure Card */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 sm:p-6 border border-[#e3e1d8] space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                    High Availability &amp; Resilience
                  </span>
                  <span className="text-xs text-slate-500 font-medium">NGINX L7 Reverse Proxy • Multi-Node Cluster</span>
                </div>
                <h3 className="text-base font-black text-[#19251f] mt-1 flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#274235]" />
                  <span>Load Balancer, Cluster Health &amp; WAF Security</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Traffic is distributed across multi-worker instances via weighted least-connections with zero-downtime failover and token-bucket rate limiting.
                </p>
              </div>

              <button
                type="button"
                onClick={handleProbeHealth}
                disabled={probingHealth}
                className="px-4 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#19251f] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md shadow-[#274235]/20 shrink-0 self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${probingHealth ? 'animate-spin' : ''}`} />
                <span>{probingHealth ? 'Probing Cluster...' : 'Probe Live Health (/api/health)'}</span>
              </button>
            </div>

            {/* Architecture Diagnostics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              {/* Card 1: Load Balancer Pool */}
              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    <span>Upstream Cluster Pool</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    least_conn
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="font-mono text-slate-700">staywise-node-1 :3005</span>
                    <span className="font-bold text-emerald-700">Primary (Active)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="font-mono text-slate-700">staywise-node-2 :3006</span>
                    <span className="font-bold text-emerald-700">Replica (Healthy)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="font-mono text-slate-700">staywise-node-3 :3007</span>
                    <span className="font-bold text-emerald-700">Replica (Healthy)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Security & Rate Limiting */}
              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-purple-700" />
                    <span>Security &amp; Rate Limits</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    OWASP Shield
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">Auth Endpoints</span>
                    <span className="font-mono font-bold text-slate-900">15 req/min per IP</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">General API</span>
                    <span className="font-mono font-bold text-slate-900">120 req/min per IP</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">Security Headers</span>
                    <span className="font-bold text-emerald-700">CSP • HSTS • SAMEORIGIN</span>
                  </div>
                </div>
              </div>

              {/* Card 3: System Diagnostics */}
              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-teal-700" />
                    <span>Node Telemetry</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Live Diagnostics
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">Active Database</span>
                    <span className="font-bold text-emerald-700">AtomicJson (ACID Safe)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">Internal Latency</span>
                    <span className="font-mono font-bold text-slate-900">{healthData ? `${healthData.latencyMs} ms` : '< 4 ms'}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#e3e1d8]">
                    <span className="text-slate-600">Serving Worker</span>
                    <span className="font-mono font-bold text-slate-900 truncate max-w-[130px]">
                      {healthData?.clusterNode || 'staywise-worker-node'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Health Probe JSON Result */}
            {healthData && (
              <div className="p-4 rounded-2xl bg-[#19251f] text-emerald-300 font-mono text-[11px] space-y-2 border border-emerald-900/50">
                <div className="flex items-center justify-between text-white border-b border-emerald-900/50 pb-2">
                  <span className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Live Health Check Diagnostic Output (/api/health)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">
                    HTTP 200 OK
                  </span>
                </div>
                <pre className="overflow-x-auto text-[10px] leading-relaxed">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: GENERATE INFLUENCER CODE & OFFER */}
      {isCreateOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-[#e3e1d8] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-gradient-to-r from-[#19251f] to-[#274235] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Affiliate &amp; Marketing Engine
                </span>
                <h3 className="text-base font-black text-white mt-1">Generate Influencer Promo Code</h3>
              </div>
              <button
                onClick={() => setIsCreateOfferModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-5 space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Custom Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BANGALOREHOMES, REALTYCREATOR20"
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Influencer / Creator Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newOffer.influencerName}
                    onChange={(e) => setNewOffer({ ...newOffer, influencerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#274235]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Social Handle / Channel</label>
                  <input
                    type="text"
                    placeholder="e.g. @rahul_vlogs"
                    value={newOffer.influencerHandle}
                    onChange={(e) => setNewOffer({ ...newOffer, influencerHandle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Commission Type</label>
                  <select
                    value={newOffer.commissionType}
                    onChange={(e) => setNewOffer({ ...newOffer, commissionType: e.target.value as 'FLAT' | 'PERCENTAGE' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#274235] bg-white font-bold"
                  >
                    <option value="FLAT">Flat Cash (₹ per join)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {newOffer.commissionType === 'FLAT' ? 'Commission Amount (₹)' : 'Commission Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newOffer.commissionValue}
                    onChange={(e) => setNewOffer({ ...newOffer, commissionValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Audience Offer / Discount *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹1,500 Off 1st Month Rent + Zero Brokerage"
                  value={newOffer.audienceOffer}
                  onChange={(e) => setNewOffer({ ...newOffer, audienceOffer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
                <select
                  value={newOffer.targetAudience}
                  onChange={(e) => setNewOffer({ ...newOffer, targetAudience: e.target.value as 'Tenants' | 'Landlords' | 'Both' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#274235] bg-white"
                >
                  <option value="Both">Both (Tenants &amp; Landlords)</option>
                  <option value="Tenants">Tenants Only</option>
                  <option value="Landlords">Landlords &amp; Property Owners Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#274235] hover:bg-[#19251f] text-white font-black text-xs transition shadow-md shadow-[#274235]/20"
                >
                  Generate &amp; Activate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMITTED DOCUMENTS AUDIT VIEWER */}
      {selectedAuditDocs && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-[#e3e1d8] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-gradient-to-r from-[#19251f] to-[#274235] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Document Audit Vault
                </span>
                <h3 className="text-base font-black text-white mt-1">{selectedAuditDocs.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAuditDocs(null)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 font-sans text-xs">
              <span className="text-slate-500 block">
                The property owner uploaded the following statutory compliance certificates for platform verification:
              </span>

              <div className="space-y-2">
                {selectedAuditDocs.docs.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#fbfbfa] border border-[#e3e1d8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-emerald-700" />
                      <span className="font-bold text-slate-800">{doc}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Valid Seal
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAuditDocs(null)}
                  className="px-4 py-2 rounded-xl bg-[#19251f] text-white font-bold text-xs hover:bg-black transition"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
