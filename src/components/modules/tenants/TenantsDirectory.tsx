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
    setIsExistingTenantWizardOpen, 
    addNotification, 
    setSelectedReceiptInvoice, 
    invoices,
    activeRole
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'NOTICE'>('ALL');

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch;
  });

  const totalDeposits = tenants.reduce((acc, t) => acc + (t.depositPaid || 0), 0);
  const avgScore = Math.round(tenants.reduce((acc, t) => acc + (t.reliabilityScore || 85), 0) / (tenants.length || 1));

  const handleWhatsAppReminder = (name: string, phone: string) => {
    addNotification('WhatsApp Reminder Sent', `Direct WhatsApp rent ping with UPI payment link dispatched to ${name} (${phone}).`, 'RENT');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Tenants & Digital Leases
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              {tenants.length} Active Leases
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Verified resident and multi-tenant directory with escrow security deposits and Aadhaar KYC
          </p>
        </div>

        {activeRole !== 'admin' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsExistingTenantWizardOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition flex items-center gap-1.5"
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
          <span className="text-xs font-semibold text-[#6e7972]">Total Verified Tenants</span>
          <div className="text-2xl font-black text-[#19251f] font-tabular mt-1">{tenants.length}</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            100% KYC Verified
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Escrow Deposits Held</span>
          <div className="text-2xl font-black text-[#19251f] font-tabular mt-1">
            ₹{(totalDeposits / 1000).toFixed(0)}K
          </div>
          <span className="text-[11px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full mt-2 inline-block">
            Axis Bank Escrow Trust
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Autopay Penetration</span>
          <div className="text-2xl font-black text-[#19251f] font-tabular mt-1">87.5%</div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            High On-Time Rate
          </span>
        </div>

        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Avg Reliability Score</span>
          <div className="text-2xl font-black text-emerald-700 font-tabular mt-1">{avgScore} / 100</div>
          <span className="text-[11px] font-bold text-[#6e7972] mt-2 inline-block">
            Based on payment timeliness
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
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#e3e1d8] text-xs font-medium text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235]"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#e3e1d8] self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterStatus === 'ALL' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            All Tenants
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterStatus === 'ACTIVE' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
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
            <thead className="bg-[#f7f6f2] text-[#6e7972] border-b border-[#e3e1d8] text-[11px] font-bold uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#eeece5]">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-[#fbfbfa] transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#eef3f0] text-[#274235] font-black text-xs flex items-center justify-center border border-[#274235]/20 shrink-0">
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-extrabold text-[#19251f] flex items-center gap-1.5">
                          <span>{t.name}</span>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-[#6e7972]">{t.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#19251f]">{t.propertyName}</div>
                    <div className="text-[11px] text-[#6e7972]">Unit {t.unitNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 font-tabular">
                    <div className="font-black text-[#19251f]">₹{t.monthlyRent.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      Autopay 5th
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-tabular font-medium text-[#19251f]">
                    ₹{(t.depositPaid || 0).toLocaleString('en-IN')}
                    <div className="text-[10px] text-[#6e7972]">Escrow locked</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#6e7972]">
                    <div className="font-semibold text-[#19251f]">{t.leaseStart}</div>
                    <div className="text-[10px]">until {t.leaseEnd}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-emerald-700 font-tabular">{t.reliabilityScore || 87}</span>
                      <span className="text-[10px] text-[#6e7972]">/ 100</span>
                    </div>
                    <div className="w-16 bg-[#e3e1d8] h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-[#274235] h-full rounded-full" 
                        style={{ width: `${t.reliabilityScore || 87}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleWhatsAppReminder(t.name, t.phone)}
                        className="p-1.5 rounded-xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] transition"
                        title="Dispatch WhatsApp Payment Reminder"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Digital Lease Agreement PDF generated for ${t.name}. Verified with Aadhaar eSign.`)}
                        className="p-1.5 rounded-xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] transition"
                        title="Download eSigned Lease Agreement"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
