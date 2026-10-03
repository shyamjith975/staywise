'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  ShieldCheck, 
  Gift, 
  Users, 
  CheckCircle2, 
  Copy, 
  Share2, 
  AlertTriangle, 
  IndianRupee, 
  Home, 
  ExternalLink,
  MessageSquare,
  Camera
} from 'lucide-react';

export default function MoveFlowRetentionView() {
  const { 
    depositDisputes, 
    resolveDepositDispute, 
    referrals, 
    addReferral,
    properties,
    addNotification,
    activeRole,
    setActiveView 
  } = useAppState();

  const isOwner = activeRole !== 'tenant';

  const [activeTab, setActiveTab] = useState<'REFERRALS' | 'DISPUTES'>(isOwner ? 'REFERRALS' : 'DISPUTES');

  // Referral Code state (Owner-Only)
  const referralCode = isOwner ? 'OWNER-RAVI-5000' : 'TENANT-SHYAM-2500';
  const totalEarned = isOwner ? 15000 : 3500;
  const totalPending = isOwner ? 5000 : 1000;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    addNotification('Referral Code Copied', `Code "${referralCode}" copied to clipboard!`, 'SYSTEM');
  };

  const handleShareWhatsApp = () => {
    const text = isOwner
      ? `Hey! I manage my rental properties and PGs with Staywise Core. Direct automated UPI collections, sub-meter power billing, and zero broker hassles. Sign up with my link to get ₹2,500 onboarding credit: https://staywise.in/owner/signup?ref=${referralCode}`
      : `Hey! Check out verified homes and PGs on Staywise with zero brokerage and digital escrow deposit protection: https://staywise.in/rent?ref=${referralCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {isOwner ? 'Staywise Owner Operations' : 'Resident Escrow Protection'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {isOwner ? 'Landlord Referral Network • Escrow Deposit Settlements' : 'Deposit Disputes & Referrals'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#19251f]">
            {isOwner ? 'Owner Referral Network & Deposit Settlements' : 'Escrow Deposit Settlements & Referrals'}
          </h1>
          <p className="text-xs text-[#6e7972]">
            {isOwner 
              ? 'Refer fellow property owners to earn ₹5,000 cash credit, and resolve escrow deposit settlements with digital proof.' 
              : 'Review itemized deposit deductions, inspect audit photos, and settle escrow balances with zero broker mediation.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('REFERRALS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'REFERRALS' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            <span>{isOwner ? 'Refer Landlords & Earn' : 'Refer & Earn'}</span>
          </button>

          <button
            onClick={() => setActiveTab('DISPUTES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'DISPUTES' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Deposit Settlements</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OWNER / TENANT REFERRAL ENGINE */}
      {activeTab === 'REFERRALS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-5">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full">
                {isOwner ? 'Owner Landlord Referral Network' : 'Tenant Referral Hub'}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                {isOwner ? 'Refer Fellow Landlords & Earn ₹5,000 Cash' : 'Refer Vacant Homes & Earn Cash Rewards'}
              </h2>
              <p className="text-xs text-slate-500">
                {isOwner 
                  ? 'Refer other property owners, apartment landlords, or PG operators. Earn ₹5,000 cash reward + 20% lifetime management fee discount for each building onboarded.'
                  : 'Share your referral code when friends rent through Staywise. Earn cash rewards deposited straight to your UPI account.'}
              </p>
            </div>

            {/* Referral Code Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#19251f] to-[#274235] text-white space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                    {isOwner ? 'YOUR LANDLORD REFERRAL CODE' : 'YOUR TENANT REFERRAL CODE'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider mt-1 text-white">
                    {referralCode}
                  </div>
                  <div className="text-[11px] text-emerald-300 mt-1">
                    {isOwner ? 'Reward: ₹5,000 / Landlord • Referee gets ₹2,500 onboarding credit' : 'Reward: Up to ₹5,000 / Tenant • Referee gets ₹1,000 OFF'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2.5 rounded-2xl bg-white text-[#19251f] hover:bg-slate-100 font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-teal-300 block">Total Referrals</span>
                  <span className="text-lg font-black text-white">{referrals.length} Owners</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Cash Earned</span>
                  <span className="text-lg font-black text-white">₹{totalEarned.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-300 block">Pending Payout</span>
                  <span className="text-lg font-black text-white">₹{totalPending.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-300 block">Payout Mode</span>
                  <span className="text-xs font-bold text-white block mt-1">UPI: vikram@okhdfc</span>
                </div>
              </div>
            </div>

            {/* Recent Referral Pipeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Your Referral History
              </h3>
              <div className="space-y-2">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{ref.referredName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {ref.propertyType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Code: {ref.referralCode} • {ref.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        ref.status === 'Converted' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : ref.status === 'Redeemed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ref.status}
                      </span>
                      <span className="font-black text-slate-900">₹{ref.rewardAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESCROW DEPOSIT DISPUTES */}
      {activeTab === 'DISPUTES' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Statutory Security Deposit Protection
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">
                Active Escrow Security Deposit Settlements
              </h2>
              <p className="text-xs text-slate-500">
                All tenant security deposits are held in RBI-licensed Escrow Trust accounts. Deductions must be itemized with geo-tagged photographic evidence.
              </p>
            </div>

            {depositDisputes.map(dispute => (
              <div 
                key={dispute.id}
                className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        {dispute.status}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{dispute.id}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                      {dispute.propertyName} • {dispute.unitOrBed} ({dispute.tenantName})
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Total Escrow Deposit</span>
                    <span className="text-base font-black text-slate-900">₹{dispute.depositPaid.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Deductions Breakdown */}
                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-amber-200 text-xs">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center justify-between">
                    <span>Proposed Move-Out Deductions</span>
                    <span className="text-rose-600">Disputed: ₹{dispute.disputedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {dispute.deductions.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Camera className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.item}</span>
                        {item.evidenceUrl && (
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            Photo Proof Attached
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-800">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Tenant Objection */}
                {dispute.tenantNotes && (
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-800">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Resident Objection Notes</span>
                    </div>
                    <p className="text-[11px] text-rose-900">
                      &ldquo;{dispute.tenantNotes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Dispute Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-xs text-slate-500">
                    Proposed Refund: <span className="font-bold text-emerald-700">₹{dispute.proposedRefund.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      resolveDepositDispute(dispute.id, 'Agreed');
                      addNotification('Dispute Resolved', `Escrow deposit settlement approved for ${dispute.tenantName}.`, 'RENT');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#274235] hover:bg-[#19251f] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Escrow Refund Settlement</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
