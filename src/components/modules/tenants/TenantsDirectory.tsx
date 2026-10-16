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
  UserPlus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function TenantsDirectory() {
  const { 
    tenants, 
    properties,
    currentUser,
    setIsExistingTenantWizardOpen, 
    addNotification, 
    setSelectedReceiptInvoice, 
    invoices,
    activeRole
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'NOTICE'>('ALL');

  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';

  // Role-scoped tenants: Owners only see residents in their properties, tenants only see themselves
  const scopedTenants = isDemoAccount
    ? tenants
    : (activeRole === 'owner')
    ? tenants.filter(t => {
        const ownerProps = properties.filter(p => p.ownerId === currentUser?.id);
        const ownerPropIds = ownerProps.map(p => p.id);
        const ownerPropNames = ownerProps.map(p => p.name.toLowerCase());
        return ownerPropIds.includes(t.propertyId) || (t.propertyName && ownerPropNames.includes(t.propertyName.toLowerCase()));
      })
    : (activeRole === 'tenant')
    ? tenants.filter(t => t.userId === currentUser?.id || (currentUser?.email && t.email?.toLowerCase() === currentUser.email.toLowerCase()))
    : tenants;

  const filteredTenants = scopedTenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch;
  });

  const totalDeposits = scopedTenants.reduce((acc, t) => acc + (t.depositPaid || 0), 0);
  const avgScore = scopedTenants.length > 0
    ? Math.round(scopedTenants.reduce((acc, t) => acc + (t.reliabilityScore || 90), 0) / scopedTenants.length)
    : 0;
  const autopayTenantsCount = scopedTenants.filter(t => t.autopayActive || t.id.includes('autopay')).length;
  const autopayRate = scopedTenants.length > 0 ? ((autopayTenantsCount / scopedTenants.length) * 100).toFixed(1) : '0.0';

  const handleWhatsAppReminder = (name: string, phone: string) => {
    addNotification('WhatsApp Reminder Sent', `Direct WhatsApp rent ping with UPI payment link dispatched to ${name} (${phone}).`, 'RENT');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Tenants & Digital Leases
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#263238] font-bold border border-[#263238]/20">
              {scopedTenants.length} Active Leases
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Verified resident and multi-tenant directory with escrow security deposits and Aadhaar KYC
          </p>
        </div>

        {activeRole !== 'admin' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsExistingTenantWizardOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold shadow-md shadow-[#263238]/20 transition flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Onboard Existing Tenant</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Total Verified Tenants</span>
          <div className="text-2xl font-black text-[#263238] font-tabular mt-1">{scopedTenants.length}</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            {scopedTenants.length > 0 ? '100% KYC Verified' : 'Zero Active Leases'}
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Escrow Deposits Held</span>
          <div className="text-2xl font-black text-[#263238] font-tabular mt-1">
            ₹{(totalDeposits / 1000).toFixed(0)}K
          </div>
          <span className="text-[11px] font-bold text-[#263238] bg-[#E8F0EC] px-2 py-0.5 rounded-full mt-2 inline-block">
            Axis Bank Escrow Trust
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Autopay Penetration</span>
          <div className="text-2xl font-black text-[#263238] font-tabular mt-1">{autopayRate}%</div>
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant name, unit, or phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#D2DDD7] text-xs font-medium text-[#263238] placeholder-[#888888] focus:outline-none focus:border-[#263238]"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[#888888]" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#D2DDD7] self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterStatus === 'ALL' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
            }`}
          >
            All Tenants
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterStatus === 'ACTIVE' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
            }`}
          >
            Active Leases
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
                        <div className="h-9 w-9 rounded-full bg-[#E8F0EC] text-[#263238] font-black text-xs flex items-center justify-center border border-[#263238]/20 shrink-0">
                          {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#263238] flex items-center gap-1.5">
                            <span>{t.name}</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <div className="text-[11px] text-[#666666]">{t.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#263238]">{t.propertyName}</div>
                      <div className="text-[11px] text-[#666666]">Unit {t.unitNumber}</div>
                    </td>

                    <td className="py-3.5 px-4 font-tabular">
                      <div className="font-black text-[#263238]">₹{t.monthlyRent.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        Autopay 5th
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-tabular font-medium text-[#263238]">
                      ₹{(t.depositPaid || 0).toLocaleString('en-IN')}
                      <div className="text-[10px] text-[#666666]">Escrow locked</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#666666]">
                      <div className="font-semibold text-[#263238]">{t.leaseStart}</div>
                      <div className="text-[10px]">until {t.leaseEnd}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-emerald-700 font-tabular">{t.reliabilityScore || 87}</span>
                        <span className="text-[10px] text-[#666666]">/ 100</span>
                      </div>
                      <div className="w-16 bg-[#D2DDD7] h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-[#263238] h-full rounded-full" 
                          style={{ width: `${t.reliabilityScore || 87}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleWhatsAppReminder(t.name, t.phone)}
                          className="p-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] transition"
                          title="Dispatch WhatsApp Payment Reminder"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => alert(`Digital Lease Agreement PDF generated for ${t.name}. Verified with Aadhaar eSign.`)}
                          className="p-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] transition"
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
    </div>
  );
}
