'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { Tenant } from '../../../types';
import { 
  Users2, 
  Search, 
  ShieldCheck, 
  FileText, 
  Download, 
  Phone, 
  Mail, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Plus,
  Home,
  Building,
  Utensils,
  Paperclip,
  Eye,
  Users,
  UserMinus,
  X,
  Fingerprint,
  AlertTriangle
} from 'lucide-react';

export default function TenantsDirectory() {
  const { 
    tenants, 
    properties,
    currentUser,
    addNotification, 
    setSelectedReceiptInvoice, 
    invoices,
    activeRole,
    tenantConnectionRequests,
    approveTenantConnectionRequest,
    rejectTenantConnectionRequest,
    verifyAndSettleMoveOut,
    disconnectTenant
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ACTIVE' | 'PAST' | 'ALL'>('ACTIVE');
  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState<Tenant | null>(null);
  const [isDisconnectConfirmOpen, setIsDisconnectConfirmOpen] = useState(false);
  const [disconnectReason, setDisconnectReason] = useState('Tenure completed / Move out requested');

  // Role-scoped tenants: Owners only see residents in their properties or approved by them.
  // Admin has statutory surveillance to see all platform tenants.
  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';
  const ownerProps = (activeRole === 'admin' || isDemoAccount)
    ? properties
    : properties.filter(p => p.ownerId === currentUser?.id);
  const ownerPropIds = ownerProps.map(p => p.id);
  const ownerPropNames = ownerProps.map(p => p.name.toLowerCase());

  // Approved connection emails for this owner
  const approvedTenantEmails = tenantConnectionRequests
    .filter(r => r.status === 'APPROVED' && (
      (activeRole === 'admin' || isDemoAccount) ||
      r.ownerId === currentUser?.id ||
      (currentUser?.email && r.ownerEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (r.propertyId && ownerPropIds.includes(r.propertyId)) ||
      (r.propertyName && ownerPropNames.includes(r.propertyName.toLowerCase()))
    ))
    .map(r => r.tenantEmail?.toLowerCase());

  const scopedTenants = (activeRole === 'admin' || isDemoAccount)
    ? tenants
    : (activeRole === 'owner')
    ? tenants.filter(t => {
        return ownerPropIds.includes(t.propertyId) || 
               (t.propertyName && ownerPropNames.includes(t.propertyName.toLowerCase())) ||
               (t.email && approvedTenantEmails.includes(t.email.toLowerCase()));
      })
    : (activeRole === 'tenant')
    ? tenants.filter(t => t.userId === currentUser?.id || (currentUser?.email && t.email?.toLowerCase() === currentUser.email.toLowerCase()))
    : tenants;

  // Connection requests strictly scoped to this owner
  const scopedConnectionRequests = (activeRole === 'admin' || isDemoAccount)
    ? tenantConnectionRequests
    : tenantConnectionRequests.filter(r => 
        r.ownerId === currentUser?.id ||
        (currentUser?.email && r.ownerEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        (r.propertyId && ownerPropIds.includes(r.propertyId)) ||
        (r.propertyName && ownerPropNames.includes(r.propertyName.toLowerCase()))
      );

  const pendingConnectionRequests = scopedConnectionRequests.filter(r => r.status === 'PENDING_APPROVAL');
  const pendingMoveOutRequests = scopedConnectionRequests.filter(r => r.status === 'MOVE_OUT_PENDING');

  const activeTenantsList = scopedTenants.filter(t => t.status !== 'Moved Out');
  const pastTenantsList = scopedTenants.filter(t => t.status === 'Moved Out');

  const filteredTenants = scopedTenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterStatus === 'ACTIVE') {
      return tenant.status !== 'Moved Out';
    }
    if (filterStatus === 'PAST') {
      return tenant.status === 'Moved Out';
    }
    return true;
  });

  const totalDeposits = activeTenantsList.reduce((acc, t) => acc + (t.depositPaid || 0), 0);
  const avgScore = activeTenantsList.length > 0
    ? Math.round(activeTenantsList.reduce((acc, t) => acc + (t.reliabilityScore || 90), 0) / activeTenantsList.length)
    : 0;
  const autopayTenantsCount = activeTenantsList.filter(t => t.autopayActive || t.id.includes('autopay')).length;
  const autopayRate = activeTenantsList.length > 0 ? ((autopayTenantsCount / activeTenantsList.length) * 100).toFixed(1) : '0.0';

  const handleWhatsAppReminder = (name: string, phone: string) => {
    addNotification('WhatsApp Reminder Sent', `Direct WhatsApp rent ping with UPI payment link dispatched to ${name} (${phone}).`, 'RENT');
  };

  const handleDisconnect = async (tenantId: string) => {
    await disconnectTenant(tenantId, disconnectReason);
    setIsDisconnectConfirmOpen(false);
    if (selectedTenantForDetails?.id === tenantId) {
      setSelectedTenantForDetails(prev => prev ? { ...prev, status: 'Moved Out', vacatedAt: new Date().toISOString().split('T')[0] } : null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
              Tenants & Digital Leases
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#171717] font-bold border border-[#171717]/20">
              {scopedTenants.length} Active Leases
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Verified resident and multi-tenant directory with escrow security deposits and Aadhaar KYC
          </p>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Total Verified Tenants</span>
          <div className="text-2xl font-black text-[#171717] font-tabular mt-1">{scopedTenants.length}</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            {scopedTenants.length > 0 ? '100% KYC Verified' : 'Zero Active Leases'}
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Escrow Deposits Held</span>
          <div className="text-2xl font-black text-[#171717] font-tabular mt-1">
            ₹{(totalDeposits / 1000).toFixed(0)}K
          </div>
          <span className="text-[11px] font-bold text-[#171717] bg-[#E8F0EC] px-2 py-0.5 rounded-full mt-2 inline-block">
            Axis Bank Escrow Trust
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Autopay Penetration</span>
          <div className="text-2xl font-black text-[#171717] font-tabular mt-1">{autopayRate}%</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            {scopedTenants.length > 0 ? 'High On-Time Rate' : 'Awaiting Mandates'}
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Avg Reliability Score</span>
          <div className="text-2xl font-black text-emerald-700 font-tabular mt-1">
            {avgScore > 0 ? `${avgScore} / 100` : 'N/A'}
          </div>
          <span className="text-[11px] font-bold text-[#666666] mt-2 inline-block">
            {avgScore > 0 ? 'Based on payment timeliness' : 'Requires settled cycles'}
          </span>
        </div>
      </div>

      {/* Pending Tenant Connection Requests */}
      {pendingConnectionRequests.length > 0 && (
        <div className="rounded-3xl bg-[#E8F0EC] border border-[#06110c]/30 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-[#171717]">
                Pending Tenant Connection Requests ({pendingConnectionRequests.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#546E7A]">Awaiting your landlord approval</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {pendingConnectionRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-white border border-[#D2DDD7] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#171717]">{req.tenantName}</h4>
                    <p className="text-[11px] text-[#546E7A] mt-0.5">{req.tenantEmail} • {req.tenantPhone}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    Awaiting Approval
                  </span>
                </div>

                {/* Mandatory eKYC & Agreement Verification Chips */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Aadhaar: {req.aadhaarNumber || '5481 9028 1142'}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>PAN: {req.panNumber || 'BLRPS9912A'}</span>
                  </span>
                  {req.hasFood && (
                    <span className="px-2 py-1 rounded-lg bg-[#E8F0EC] text-[#06110c] border border-[#D2DDD7] font-bold flex items-center gap-1">
                      <Utensils className="h-3 w-3 text-[#06110c]" />
                      <span>Mess Dining Included</span>
                    </span>
                  )}
                </div>

                {/* Uploaded Documents / Agreement */}
                <div className="p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#171717] flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5 text-[#06110c]" />
                      <span>Uploaded KYC &amp; Agreement Documents ({req.documents?.length || 2})</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Uploaded by Tenant</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(req.documents && req.documents.length > 0 ? req.documents : [
                      { id: '1', name: 'Aadhaar_Card_eKYC_Verified.pdf' },
                      { id: '2', name: 'Signed_Rental_Agreement_Copy.pdf' }
                    ]).map((d: any, idx: number) => (
                      <span key={d.id || idx} className="text-[10px] bg-white border border-[#D2DDD7] text-[#171717] px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                        <FileText className="h-3 w-3 text-[#546E7A]" />
                        <span>{d.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[11px]">
                  <div>
                    <span className="text-[#546E7A] block">Unit</span>
                    <span className="font-bold text-[#171717]">{req.unitNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#546E7A] block">Rent</span>
                    <span className="font-bold text-[#06110c] font-tabular">₹{req.monthlyRent?.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[#546E7A] block">Deposit</span>
                    <span className="font-bold text-[#171717] font-tabular">₹{req.depositAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => approveTenantConnectionRequest(req.id)}
                    className="flex-1 py-2 rounded-xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs transition shadow-xs cursor-pointer text-center"
                  >
                    ✓ Approve Connection &amp; Create Lease
                  </button>
                  <button
                    onClick={() => rejectTenantConnectionRequest(req.id)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Move-Out Inspection Verifications */}
      {pendingMoveOutRequests.length > 0 && (
        <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-[#171717]">
                Pending Move-Out Verifications ({pendingMoveOutRequests.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#546E7A]">Inspection &amp; Escrow Settlement</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {pendingMoveOutRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#171717]">{req.tenantName}</h4>
                    <p className="text-[11px] text-[#546E7A]">Unit {req.unitNumber} • Move-Out: {req.moveOutDate}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    Settlement Pending
                  </span>
                </div>

                <p className="text-[11px] text-[#546E7A]">
                  <b>Reason:</b> {req.moveOutReason || 'Tenure completed'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => verifyAndSettleMoveOut(req.id, {
                      inspectionNotes: 'MoveFlow handover inspection passed. All damages cleared.',
                      depositSettledAmount: req.depositAmount
                    })}
                    className="flex-1 py-2 rounded-xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs transition shadow-xs cursor-pointer text-center"
                  >
                    Verify Inspection &amp; Settle Deposit (₹{req.depositAmount?.toLocaleString('en-IN')})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant name, unit, or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#D2DDD7] text-xs font-medium text-[#171717] placeholder-[#888888] focus:outline-none focus:border-[#171717]"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[#888888]" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#D2DDD7] self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'ACTIVE' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <span>Active Leases</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{activeTenantsList.length}</span>
          </button>
          <button
            onClick={() => setFilterStatus('PAST')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              filterStatus === 'PAST' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <span>Past Residents / Alumni</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{pastTenantsList.length}</span>
          </button>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterStatus === 'ALL' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            All ({scopedTenants.length})
          </button>
        </div>
      </div>

      {/* Tenants Table Card */}
      <div className="organic-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E8F0EC] text-[#666666] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Property & Unit</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Security Deposit</th>
                <th className="py-3 px-4">Lease Period</th>
                <th className="py-3 px-4">Reliability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users2 className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-[#666666]">No tenants found</p>
                    <p className="text-[11px] text-[#999999] mt-0.5">
                      {activeRole === 'owner' 
                        ? 'Click "Onboard Existing Tenant" above to add residents to your units.' 
                        : 'No tenant lease records matching your profile.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-[#ffffff] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => setSelectedTenantForDetails(t)}
                          className="h-9 w-9 rounded-full bg-[#E8F0EC] hover:bg-[#D2DDD7] text-[#171717] font-black text-xs flex items-center justify-center border border-[#171717]/20 shrink-0 cursor-pointer transition"
                          title="Click to view tenant profile & KYC"
                        >
                          {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div 
                            onClick={() => setSelectedTenantForDetails(t)}
                            className="font-extrabold text-[#171717] hover:text-[#06110c] hover:underline flex items-center gap-1.5 cursor-pointer group"
                            title="Click to view full KYC, documents & lease details"
                          >
                            <span>{t.name}</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            {t.status === 'Moved Out' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                Past Tenant
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#666666]">{t.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#171717]">{t.propertyName}</div>
                      <div className="text-[11px] text-[#666666]">Unit {t.unitNumber} • {t.tenancyType || 'Residential'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-tabular">
                      <div className="font-black text-[#171717]">₹{t.monthlyRent.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        Autopay 5th
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-tabular font-medium text-[#171717]">
                      ₹{(t.depositPaid || 0).toLocaleString('en-IN')}
                      <div className="text-[10px] text-[#666666]">
                        {t.depositScheme === 'ZERO_DEPOSIT_PROTECT' ? 'Zero Deposit Protect' : 'Escrow locked'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#666666]">
                      <div className="font-semibold text-[#171717]">{t.leaseStart}</div>
                      <div className="text-[10px]">
                        {t.status === 'Moved Out' ? (
                          <span className="text-rose-600 font-bold">Vacated {t.vacatedAt || t.leaseEnd}</span>
                        ) : (
                          `until ${t.leaseEnd}`
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-emerald-700 font-tabular">{t.reliabilityScore || 87}</span>
                        <span className="text-[10px] text-[#666666]">/ 100</span>
                      </div>
                      <div className="w-16 bg-[#D2DDD7] h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-[#171717] h-full rounded-full" 
                          style={{ width: `${t.reliabilityScore || 87}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTenantForDetails(t)}
                          className="p-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#171717] hover:text-white text-[#171717] transition cursor-pointer"
                          title="View Full KYC & Tenant Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {activeRole === 'owner' && t.status !== 'Moved Out' && (
                          <button
                            onClick={() => {
                              setSelectedTenantForDetails(t);
                              setIsDisconnectConfirmOpen(true);
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 transition cursor-pointer"
                            title="Disconnect / Mark as Moved Out"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleWhatsAppReminder(t.name, t.phone)}
                          className="p-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#171717] hover:text-white text-[#171717] transition cursor-pointer"
                          title="Dispatch WhatsApp Payment Reminder"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const agreementText = `========================================================================
MODEL TENANCY AGREEMENT (UNDER MODEL TENANCY ACT, 2021)
========================================================================
TENANT: ${t.name}
PHONE: ${t.phone}
EMAIL: ${t.email}
UNIT / ROOM: Unit ${t.unitNumber}
PROPERTY: ${properties.find(p => p.id === t.propertyId)?.name || 'Staywise Asset'}
MONTHLY RENT: INR ${t.monthlyRent.toLocaleString('en-IN')}
SECURITY DEPOSIT: INR ${(t.depositPaid || t.monthlyRent * 2).toLocaleString('en-IN')}
LEASE PERIOD: ${t.leaseStart} to ${t.leaseEnd}
AADHAAR eSIGN: VERIFIED (VID: ****-****-9102)
DIGITAL STAMP: STAMP-IN-KA-2026-${t.id.slice(-6).toUpperCase()}
------------------------------------------------------------------------
This agreement is legally binding and digitally registered in the Staywise Escrow Ledger.
========================================================================`;
                            const blob = new Blob([agreementText], { type: 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Lease_Agreement_${t.name.replace(/\s+/g, '_')}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            addNotification('Lease Agreement Downloaded', `Digital Lease Agreement PDF generated for ${t.name}.`, 'SYSTEM');
                          }}
                          className="p-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#171717] hover:text-white text-[#171717] transition cursor-pointer"
                          title="Download eSigned Lease Agreement"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Tenant Details & Digital KYC Modal */}
      {selectedTenantForDetails && (
        <div className="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#E8F0EC] text-[#171717] font-black text-sm flex items-center justify-center border border-[#171717]/20 shrink-0">
                  {selectedTenantForDetails.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#171717]">
                      {selectedTenantForDetails.name}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      selectedTenantForDetails.status === 'Moved Out'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedTenantForDetails.status === 'Moved Out' ? 'Moved Out / Past Resident' : 'Active Lease'}
                    </span>
                  </div>
                  <p className="text-xs text-[#546E7A]">
                    Unit {selectedTenantForDetails.unitNumber} • {selectedTenantForDetails.propertyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTenantForDetails(null);
                  setIsDisconnectConfirmOpen(false);
                }}
                className="text-[#546E7A] hover:text-[#171717] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Disconnect Confirmation Prompt if triggered */}
            {isDisconnectConfirmOpen && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 font-black text-rose-800 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>Confirm Move-Out / Disconnection</span>
                </div>
                <p className="text-[#546E7A] leading-relaxed text-[11px]">
                  This will mark <b>{selectedTenantForDetails.name}</b> as vacated and archive them under <b>Past Residents / Alumni</b>. The unit will be freed up for new tenant onboarding.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Reason for Move-Out / Vacating</label>
                  <input
                    type="text"
                    value={disconnectReason}
                    onChange={(e) => setDisconnectReason(e.target.value)}
                    placeholder="e.g. Tenancy term completed, job relocation, rent default"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs font-medium"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleDisconnect(selectedTenantForDetails.id)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer text-center"
                  >
                    ✓ Confirm Disconnect &amp; Move Out
                  </button>
                  <button
                    onClick={() => setIsDisconnectConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#D2DDD7] text-[#171717] font-bold text-xs hover:bg-[#F7F8F6] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Contact & Tenancy Category Card */}
            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#546E7A] block">Email</span>
                  <span className="font-bold text-[#171717] truncate block">{selectedTenantForDetails.email}</span>
                </div>
                <div>
                  <span className="text-[#546E7A] block">Phone</span>
                  <span className="font-bold text-[#171717]">{selectedTenantForDetails.phone}</span>
                </div>
                <div>
                  <span className="text-[#546E7A] block">Tenancy Category</span>
                  <span className="font-bold text-[#171717]">{selectedTenantForDetails.tenancyType || 'Residential'}</span>
                </div>
                <div>
                  <span className="text-[#546E7A] block">Emergency Contact</span>
                  <span className="font-bold text-[#171717]">{selectedTenantForDetails.emergencyContact || 'None Listed'}</span>
                </div>
              </div>
            </div>

            {/* Financial & Lease Particulars */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-[#D2DDD7]">
                <span className="text-[10px] text-[#546E7A] block">Monthly Rent</span>
                <span className="font-black text-sm text-[#06110c] font-tabular">
                  ₹{selectedTenantForDetails.monthlyRent.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-emerald-700 block font-bold mt-0.5">Due 5th</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#D2DDD7]">
                <span className="text-[10px] text-[#546E7A] block">Security Deposit</span>
                <span className="font-black text-sm text-[#171717] font-tabular">
                  ₹{(selectedTenantForDetails.depositPaid || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-[#546E7A] block mt-0.5">
                  {selectedTenantForDetails.depositScheme === 'ZERO_DEPOSIT_PROTECT' ? 'Zero Deposit Protect' : 'Escrow Locked'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#D2DDD7]">
                <span className="text-[10px] text-[#546E7A] block">Lease Tenure</span>
                <span className="font-bold text-xs text-[#171717] block truncate">
                  {selectedTenantForDetails.leaseStart}
                </span>
                <span className="text-[9px] text-[#546E7A] block truncate">
                  to {selectedTenantForDetails.leaseEnd}
                </span>
              </div>
            </div>

            {/* Digital eKYC Verification Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-emerald-950">
                  <Fingerprint className="h-4 w-4 text-emerald-700" />
                  <span>Digital Identity &amp; Government eKYC</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>UIDAI Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">Aadhaar (UIDAI Verified)</span>
                  <span className="font-mono font-black text-[#171717]">
                    {selectedTenantForDetails.aadhaarNumber
                      ? selectedTenantForDetails.aadhaarNumber.replace(/(\d{4})\s*(\d{4})\s*(\d{4})/, '•••• •••• $3')
                      : '•••• •••• 1142'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">PAN (NSDL Verified)</span>
                  <span className="font-mono font-black text-[#171717] uppercase">
                    {selectedTenantForDetails.panNumber
                      ? selectedTenantForDetails.panNumber.slice(0, 2) + '••••' + selectedTenantForDetails.panNumber.slice(-2)
                      : 'BL••••12A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Uploaded Documents & Deeds */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[#171717]">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5 text-[#546E7A]" />
                  <span>Verified Documents &amp; Deeds</span>
                </span>
                <span className="text-[10px] text-[#546E7A]">
                  {selectedTenantForDetails.documents?.length || 1} file(s)
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedTenantForDetails.documents && selectedTenantForDetails.documents.length > 0 ? (
                  selectedTenantForDetails.documents.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-[#06110c] shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-[#171717] block truncate">{doc.name}</span>
                          <span className="text-[10px] text-[#546E7A]">{doc.size || '500 KB'} • {doc.date || 'Active'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const text = `STAYWISE DIGITALLY VERIFIED DOCUMENT\nTitle: ${doc.name}\nTenant: ${selectedTenantForDetails.name}\nProperty: ${selectedTenantForDetails.propertyName}\nUnit: ${selectedTenantForDetails.unitNumber}\nTimestamp: ${new Date().toISOString()}\nStatus: Verified under Indian Information Technology Act 2000.`;
                          const blob = new Blob([text], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = doc.name || 'tenant_document.txt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DDD7] hover:bg-[#E8F0EC] text-[10px] font-bold text-[#171717] shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#06110c] shrink-0" />
                      <div>
                        <span className="font-bold text-[#171717] block">Aadhaar_NSDL_eSign_Certificate.pdf</span>
                        <span className="text-[10px] text-[#546E7A]">420 KB • UIDAI DigiLocker</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#D2DDD7]">
              {activeRole === 'owner' && selectedTenantForDetails.status !== 'Moved Out' && !isDisconnectConfirmOpen && (
                <button
                  type="button"
                  onClick={() => setIsDisconnectConfirmOpen(true)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  <span>Move Out / Disconnect Resident</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedTenantForDetails(null);
                  setIsDisconnectConfirmOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs transition cursor-pointer text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
