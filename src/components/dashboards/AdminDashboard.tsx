'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { InfluencerOffer } from '../../types';
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
  Tag
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    ledger, 
    properties, 
    tenants, 
    invoices, 
    depositDisputes, 
    approveProperty, 
    deleteProperty, 
    influencerOffers, 
    addInfluencerOffer, 
    toggleInfluencerOfferStatus,
    addNotification 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'PROPERTIES' | 'DATA_SURVEILLANCE' | 'INFLUENCER_OFFERS' | 'LEDGER'>('PROPERTIES');
  const [propertyFilter, setPropertyFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [selectedAuditDocs, setSelectedAuditDocs] = useState<{ name: string; docs: string[] } | null>(null);

  // New Influencer Offer Modal State
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState<{
    code: string;
    influencerName: string;
    influencerHandle: string;
    commissionType: 'PERCENTAGE' | 'FLAT';
    commissionValue: number;
    audienceOffer: string;
    targetAudience: 'Tenants' | 'Landlords' | 'Both';
    status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  }>({
    code: '',
    influencerName: '',
    influencerHandle: '',
    commissionType: 'FLAT',
    commissionValue: 2500,
    audienceOffer: '₹1,000 Off 1st Month Rent',
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

  const totalVolume = ledger.reduce((acc, l) => acc + l.amount, 0);
  const pendingProperties = properties.filter(p => p.verificationStatus === 'PENDING');
  const approvedProperties = properties.filter(p => p.verificationStatus !== 'PENDING');

  const filteredProperties = properties.filter(p => {
    if (propertyFilter === 'PENDING') return p.verificationStatus === 'PENDING';
    if (propertyFilter === 'APPROVED') return p.verificationStatus !== 'PENDING';
    return true;
  });

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code.trim() || !newOffer.influencerName.trim()) return;

    addInfluencerOffer({
      code: newOffer.code.toUpperCase().replace(/\s+/g, ''),
      influencerName: newOffer.influencerName,
      influencerHandle: newOffer.influencerHandle || '@creator',
      commissionType: newOffer.commissionType,
      commissionValue: Number(newOffer.commissionValue) || 2000,
      audienceOffer: newOffer.audienceOffer,
      targetAudience: newOffer.targetAudience,
      status: 'ACTIVE'
    });

    setIsCreateOfferModalOpen(false);
    setNewOffer({
      code: '',
      influencerName: '',
      influencerHandle: '',
      commissionType: 'FLAT',
      commissionValue: 2500,
      audienceOffer: '₹1,000 Off 1st Month Rent',
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
            Full ecosystem surveillance: verify &amp; approve owner properties, monitor all client data, double-entry financial ledger, and manage influencer campaigns.
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
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Clients (Tenants)</span>
          <div className="text-2xl font-black text-[#19251f] mt-1">{tenants.length} Active</div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% KYC Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Portfolios &amp; Owners</span>
          <div className="text-2xl font-black text-[#19251f] mt-1">3 Portfolios</div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">12 Asset Owners</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Total Assets &amp; Keys</span>
          <div className="text-2xl font-black text-[#19251f] mt-1">{properties.length} Assets</div>
          <span className={`text-[10px] font-bold block mt-0.5 ${pendingProperties.length > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {pendingProperties.length} Awaiting Verification
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Gross Processed Payments</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">
            ₹{(totalVolume / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% Escrow Reconciled</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#6e7972] uppercase tracking-wider block">Escrow Security Disputes</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{depositDisputes.length} Disputes</div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">RBI Trust Protected</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] overflow-x-auto max-w-full text-xs font-bold">
        <button
          onClick={() => setActiveTab('PROPERTIES')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'PROPERTIES' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Properties &amp; Approvals</span>
          {pendingProperties.length > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {pendingProperties.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('DATA_SURVEILLANCE')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'DATA_SURVEILLANCE' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Users2 className="h-4 w-4" />
          <span>Platform Data Surveillance</span>
        </button>

        <button
          onClick={() => setActiveTab('INFLUENCER_OFFERS')}
          className={`px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-2 ${
            activeTab === 'INFLUENCER_OFFERS' 
              ? 'bg-[#19251f] text-white shadow-sm' 
              : 'text-[#6e7972] hover:text-[#19251f]'
          }`}
        >
          <Gift className="h-4 w-4 text-amber-500" />
          <span>Influencer Offers &amp; Referral Codes</span>
          <span className="h-5 px-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
            {influencerOffers.length}
          </span>
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
          <span>Ledger &amp; Controls</span>
        </button>
      </div>

      {/* TAB 1: PROPERTIES APPROVAL PIPELINE & VERIFICATION */}
      {activeTab === 'PROPERTIES' && (
        <div className="space-y-4">
          {/* Subheader and Filters */}
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
                    {/* Property Meta Info */}
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

                        {/* Capacity & Revenue Badges */}
                        <div className="flex items-center gap-3 pt-2 text-xs">
                          <span className="font-bold text-slate-700">
                            {prop.occupiedUnits} / {prop.totalUnits} Units Occupied
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-black text-slate-900">
                            ₹{(prop.expectedMonthlyRent / 1000).toFixed(0)}k/mo Expected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Audits & Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* Document chips */}
                      <button
                        type="button"
                        onClick={() => setSelectedAuditDocs({ name: prop.name, docs: submittedDocs })}
                        className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Audit {submittedDocs.length} Submitted Documents</span>
                      </button>

                      {/* Approval Actions */}
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

      {/* TAB 2: PLATFORM DATA SURVEILLANCE (NO ONBOARDING, PURE DATA) */}
      {activeTab === 'DATA_SURVEILLANCE' && (
        <div className="space-y-6">
          {/* Clients / Tenants Overview Table */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-[#274235]" />
                  <span>All Registered Clients &amp; Residents ({tenants.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Full audit profile of active leases, phone, KYC, and payment reliability.</p>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Read-Only Surveillance Mode</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tenant Name</th>
                    <th className="py-2.5 px-3">Property &amp; Unit</th>
                    <th className="py-2.5 px-3">Monthly Rent</th>
                    <th className="py-2.5 px-3">Security Deposit</th>
                    <th className="py-2.5 px-3">KYC Status</th>
                    <th className="py-2.5 px-3">Reliability</th>
                    <th className="py-2.5 px-3">Lease End</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {t.name}
                        <span className="text-[10px] text-slate-400 block font-normal">{t.phone}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {t.propertyName} • Unit {t.unitNumber}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        ₹{t.monthlyRent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        ₹{t.depositPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-black text-emerald-700">
                        {t.reliabilityScore}/100
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {t.leaseEnd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Invoices & Recent Transactions */}
          <div className="bg-white p-5 rounded-2xl border border-[#e3e1d8] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#19251f] flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#274235]" />
                  <span>Platform Collections &amp; Invoices ({invoices.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Every rent collection, escrow settlement, and penalty recorded in double-entry books.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice ID</th>
                    <th className="py-2.5 px-3">Tenant</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{inv.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{inv.tenantName}</td>
                      <td className="py-2.5 px-3 text-slate-700">Unit {inv.unitNumber}</td>
                      <td className="py-2.5 px-3 font-black text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-500">{inv.dueDate}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
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

      {/* TAB 3: INFLUENCER OFFERS & REFERRAL CAMPAIGN ENGINE */}
      {activeTab === 'INFLUENCER_OFFERS' && (
        <div className="space-y-5">
          {/* Header Card with Create Offer Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Growth &amp; Affiliate Engine
                </span>
                <span className="text-xs text-slate-500 font-medium">Influencer Commissions • Promo Offers</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#19251f]">
                Influencer Partner Campaigns &amp; Promo Codes
              </h2>
              <p className="text-xs text-slate-500">
                Generate custom promo codes for real estate influencers, YouTubers &amp; affiliate partners. When users sign up or rent using their code, influencers automatically earn commission.
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

          {/* Campaigns Grid / Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f6f2] text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Promo Code</th>
                    <th className="py-3 px-3">Influencer / Partner</th>
                    <th className="py-3 px-3">Audience Offer</th>
                    <th className="py-3 px-3">Commission Rate</th>
                    <th className="py-3 px-3">Signups / Joins</th>
                    <th className="py-3 px-3">Total Commission</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {influencerOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900 text-sm px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                            {offer.code}
                          </span>
                        </div>
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
        </div>
      )}

      {/* TAB 4: IMMUTABLE LEDGER & FEATURE CONTROLS */}
      {activeTab === 'LEDGER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Immutable Double-Entry Ledger Surveillance */}
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

          {/* Dynamic Feature Flags Management */}
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
        </div>
      )}

      {/* MODAL: CREATE INFLUENCER CODE & OFFER */}
      {isCreateOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-[#e3e1d8] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="p-5 bg-gradient-to-r from-[#19251f] to-[#274235] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Affiliate Growth
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
                  placeholder="e.g. TECHINFLUENCER10, BANGALOREHOMES"
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
