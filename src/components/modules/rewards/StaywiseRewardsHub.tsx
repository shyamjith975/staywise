'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Gift, 
  Sparkles, 
  CreditCard, 
  TrendingUp, 
  Flame, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  ChevronRight, 
  Store, 
  ShoppingBag, 
  Percent, 
  HelpCircle,
  FileText,
  DollarSign,
  AlertCircle,
  Layers,
  BarChart3,
  X
} from 'lucide-react';
import { RewardActionType, MerchantOffer } from '../../../types';

export default function StaywiseRewardsHub() {
  const { 
    currentUser, 
    activeRole, 
    rewardsAccount, 
    rewardsLedger, 
    rewardRules, 
    merchantOffers,
    earnWisePoints,
    redeemWisePoints,
    setIsPayRentOpen,
    invoices,
    setSelectedInvoiceForPay,
    setActiveView,
    addNotification
  } = useAppState();

  const isTenant = activeRole === 'tenant';
  const [activeTab, setActiveTab] = useState<'REDEEM' | 'EARN' | 'LEDGER' | 'ECONOMICS'>('REDEEM');
  
  // Redemption Modal State
  const [selectedOfferForRedeem, setSelectedOfferForRedeem] = useState<MerchantOffer | null>(null);
  const [redeemSuccessCode, setRedeemSuccessCode] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Rent Credit Modal State
  const [isRentCreditModalOpen, setIsRentCreditModalOpen] = useState(false);
  const [rentCreditPoints, setRentCreditPoints] = useState<number>(200);

  // Fallback demo values if rewardsAccount is still hydrating
  const balance = rewardsAccount?.currentBalance ?? 650;
  const totalEarned = rewardsAccount?.totalEarned ?? 950;
  const totalRedeemed = rewardsAccount?.totalRedeemed ?? 300;
  const streak = rewardsAccount?.currentStreak ?? 5;
  const tier = rewardsAccount?.tier ?? 'GOLD';
  const inrValue = (balance * 0.1).toFixed(2); // 10 WisePoints = ₹1.00 (or 100 pts = ₹10)

  // Handle Redeeming Merchant Offer
  const handleConfirmRedeem = async (offer: MerchantOffer) => {
    setIsRedeeming(true);
    const res = await redeemWisePoints(
      'REDEMPTION_MERCHANT_VOUCHER',
      offer.pointsRequired,
      offer.id,
      `Redeemed ${offer.offerTitle} (${offer.partnerName})`
    );
    setIsRedeeming(false);
    if (res.success && res.voucherCode) {
      setRedeemSuccessCode(res.voucherCode);
    }
  };

  // Handle Rent Credit Redemption
  const handleConfirmRentCredit = async () => {
    setIsRedeeming(true);
    const inrDiscount = (rentCreditPoints * 0.5); // 200 pts = ₹100 rent credit
    const res = await redeemWisePoints(
      'REDEMPTION_RENT_CREDIT',
      rentCreditPoints,
      'RENT-CREDIT-COUPON',
      `Applied ₹${inrDiscount} Rent Credit discount voucher`
    );
    setIsRedeeming(false);
    if (res.success && res.voucherCode) {
      setRedeemSuccessCode(res.voucherCode);
      setIsRentCreditModalOpen(false);
    }
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    addNotification('Voucher Code Copied! 📋', `Code "${code}" copied to clipboard.`, 'RENT');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (!isTenant) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white border border-[#D2DDD7] text-center space-y-4 shadow-sm font-sans">
        <div className="h-16 w-16 rounded-full bg-[#fbebeb] text-[#7a1413] border border-[#f5c2c2] flex items-center justify-center mx-auto">
          <Gift className="h-8 w-8 text-[#a31c1b]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-[#171717]">WisePoints is Exclusively for Tenants</h2>
          <p className="text-xs text-[#546E7A] max-w-md mx-auto leading-relaxed">
            WisePoints is Staywise&apos;s resident loyalty program designed to reward tenants for on-time rent payments, verified move-in condition reports, and lease renewals.
          </p>
          <p className="text-xs text-[#546E7A] max-w-md mx-auto leading-relaxed">
            As a property owner or manager, your rental income and asset condition are safeguarded through <b className="text-[#171717]">Zero-Deposit Protect</b>.
          </p>
        </div>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveView('deposit_protect')}
            className="px-5 py-2.5 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#a31c1b]" />
            <span>Open Zero-Deposit Protect</span>
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-5 py-2.5 rounded-full bg-[#E8F0EC] hover:bg-[#D2DDD7] text-[#171717] text-xs font-bold transition border border-[#D2DDD7] cursor-pointer"
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans bg-[#F7F8F6] text-[#171717]">
      
      {/* Hero Wallet Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#06110c] via-[#12241b] to-[#171717] text-white p-6 sm:p-8 shadow-xl border border-[#D2DDD7]">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a31c1b]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#E8F0EC]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#a31c1b] text-white shadow-xs">
                <Sparkles className="h-3 w-3" />
                Staywise Rewards
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-[#E8F0EC] border border-white/15">
                {tier} Member Tier
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4]">
                <Flame className="h-3 w-3 text-[#a31c1b]" />
                {streak}-Month On-Time Streak
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                WisePoints Rewards Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#E8F0EC]/80 mt-1">
                India&apos;s first housing rewards program. Turn rent payments into dining perks, fitness passes, home maintenance, and rent credits.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const unpaidInv = invoices.find(i => i.status !== 'Paid');
                  if (unpaidInv) {
                    setSelectedInvoiceForPay(unpaidInv);
                    setIsPayRentOpen(true);
                  } else {
                    setActiveView('rentflow');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-white text-[#06110c] hover:bg-[#E8F0EC] text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <CreditCard className="h-3.5 w-3.5 text-[#a31c1b]" />
                <span>Pay Rent (+100 pts)</span>
              </button>

              <button
                onClick={() => setIsRentCreditModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
              >
                <Zap className="h-3.5 w-3.5 text-[#C69A55]" />
                <span>Redeem for Rent Credit</span>
              </button>

              <button
                onClick={() => setActiveView('deposit_protect')}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#E8F0EC]" />
                <span>Zero-Deposit Protect</span>
              </button>
            </div>
          </div>

          {/* Current Balance Scoreboard */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shrink-0 flex flex-col justify-between min-w-[240px]">
            <div>
              <div className="flex items-center justify-between text-xs text-[#E8F0EC]/70">
                <span>Available Balance</span>
                <span className="text-[10px] font-bold text-[#E8F0EC] uppercase">Instant Liquid</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {balance.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black text-[#a31c1b] uppercase">WisePoints</span>
              </div>
              <div className="text-[11px] text-[#E8F0EC]/90 font-medium mt-0.5">
                ≈ ₹{inrValue} in direct rent reduction credits
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#E8F0EC]/60 block">Lifetime Earned</span>
                <span className="font-extrabold text-white text-sm">+{totalEarned.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#E8F0EC]/60 block">Total Redeemed</span>
                <span className="font-extrabold text-[#E8F0EC] text-sm">-{totalRedeemed.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Rail */}
        <div className="mt-8 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('REDEEM')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'REDEEM'
                ? 'bg-white text-[#06110c] shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#a31c1b]" />
            <span>Redeem Store & Perks</span>
          </button>

          <button
            onClick={() => setActiveTab('EARN')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'EARN'
                ? 'bg-white text-[#06110c] shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Percent className="h-3.5 w-3.5 text-[#a31c1b]" />
            <span>Ways to Earn (+100-500 pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'LEDGER'
                ? 'bg-white text-[#06110c] shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#a31c1b]" />
            <span>Points Ledger & Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('ECONOMICS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
              activeTab === 'ECONOMICS'
                ? 'bg-white text-[#06110c] shadow-md'
                : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#a31c1b]" />
            <span>Sustainable Economics</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: REDEEM STORE & LOCAL MERCHANT PERKS */}
      {/* ============================================================== */}
      {activeTab === 'REDEEM' && (
        <div className="space-y-6">
          
          {/* Featured Rent Credit Banner */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c] border border-[#D2DDD7]">
                  Core Tenant Benefit
                </span>
                <span className="text-xs text-[#546E7A] font-semibold">100 WisePoints = ₹50 Direct Credit</span>
              </div>
              <h3 className="text-lg font-black text-[#171717]">
                Redeem WisePoints for Next Month&apos;s Rent
              </h3>
              <p className="text-xs text-[#546E7A]">
                Unlike arbitrary points programs, WisePoints can be applied directly toward your official Staywise rent invoice to reduce your actual living expenses.
              </p>
            </div>

            <button
              onClick={() => setIsRentCreditModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#06110c] text-white hover:bg-[#171717] font-black text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0 active:scale-95"
            >
              <Zap className="h-4 w-4 text-[#C69A55]" />
              <span>Apply Rent Credit</span>
            </button>
          </div>

          {/* Merchant Deals Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#171717]">Neighborhood & National Partner Offers</h3>
                <p className="text-xs text-[#546E7A]">Merchant-funded discounts and vouchers across food, fitness, cleaning, and furniture</p>
              </div>
              <span className="text-xs font-bold text-[#06110c] bg-[#E8F0EC] px-3 py-1 rounded-xl border border-[#D2DDD7]">
                {merchantOffers.length} Partner Deals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchantOffers.map((offer) => {
                const canAfford = balance >= offer.pointsRequired;
                return (
                  <div 
                    key={offer.id}
                    className="bg-white rounded-3xl border border-[#D2DDD7] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c]">
                          {offer.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-black text-[#06110c]">
                          <Sparkles className="h-3 w-3 text-[#a31c1b]" />
                          <span>{offer.pointsRequired} pts</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#a31c1b] uppercase tracking-wide">
                          {offer.partnerName}
                        </div>
                        <h4 className="text-base font-extrabold text-[#171717] mt-0.5">
                          {offer.offerTitle}
                        </h4>
                        <p className="text-xs text-[#546E7A] mt-1 line-clamp-2">
                          {offer.discountDescription}
                        </p>
                      </div>

                      <div className="text-[10px] text-[#546E7A] bg-[#F7F8F6] p-2.5 rounded-xl border border-[#D2DDD7]/50">
                        {offer.terms}
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#D2DDD7] flex items-center justify-between">
                      <span className="text-[10px] text-[#546E7A]">
                        {canAfford ? 'Balance Eligible' : `Need ${offer.pointsRequired - balance} more pts`}
                      </span>

                      <button
                        onClick={() => setSelectedOfferForRedeem(offer)}
                        disabled={!canAfford}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                          canAfford
                            ? 'bg-[#06110c] text-white hover:bg-[#171717] active:scale-95 shadow-xs'
                            : 'bg-[#E8F0EC] text-[#546E7A] cursor-not-allowed opacity-60'
                        }`}
                      >
                        <span>Redeem Voucher</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deposit Protect Offset Promo */}
          <div className="bg-linear-to-r from-[#E8F0EC] to-white p-6 rounded-3xl border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#06110c]" />
                <span className="text-xs font-bold text-[#06110c] uppercase tracking-wider">Staywise Deposit Protect</span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#171717]">
                Use WisePoints to waive your monthly Deposit Protect fee
              </h4>
              <p className="text-xs text-[#546E7A]">
                Redeem 300 WisePoints to waive your monthly protection premium completely, keeping your security guarantee active at zero cost.
              </p>
            </div>
            <button
              onClick={() => setActiveView('deposit_protect')}
              className="px-4 py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition shrink-0 shadow-xs"
            >
              Explore Zero-Deposit
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: WAYS TO EARN */}
      {/* ============================================================== */}
      {activeTab === 'EARN' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] shadow-xs">
            <h3 className="text-base sm:text-lg font-black text-[#171717]">Staywise Launch Earning Rules</h3>
            <p className="text-xs text-[#546E7A] mt-1">
              Fixed, sustainable bonuses for positive rental behaviors that benefit tenants, property owners, and the ecosystem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {rewardRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#E8F0EC] text-[#06110c]">
                        {rule.category}
                      </span>
                      <span className="text-xs font-black text-[#a31c1b] bg-white px-2 py-0.5 rounded-md border border-[#D2DDD7]">
                        +{rule.pointsAwarded} WisePoints
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#171717]">{rule.name}</h4>
                    <p className="text-xs text-[#546E7A] leading-relaxed">{rule.description}</p>
                  </div>

                  <div className="text-[10px] text-[#546E7A] pt-2 border-t border-[#D2DDD7]/50 flex justify-between items-center">
                    <span>Monthly Cap: {rule.monthlyCap} pts</span>
                    <span className="font-semibold">{rule.partnerFunded ? 'Merchant Sponsored' : 'Platform Funded'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Cards for Immediate Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#06110c] flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[#a31c1b]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#171717]">1. Pay Rent On-Time</h4>
                <p className="text-xs text-[#546E7A] mt-1">
                  Pay your rent invoice before or on the due date via UPI or Bank Transfer to earn an instant 100 WisePoints.
                </p>
              </div>
              <button 
                onClick={() => setActiveView('rentflow')}
                className="w-full py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>View Rent Invoices</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#06110c] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-[#a31c1b]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#171717]">2. Complete Condition Report</h4>
                <p className="text-xs text-[#546E7A] mt-1">
                  Submit your Move-In photos and room condition audit to lock in your baseline and get rewarded 100 WisePoints.
                </p>
              </div>
              <button 
                onClick={() => setActiveView('deposit_protect')}
                className="w-full py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Submit Inspection</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#06110c] flex items-center justify-center">
                <Gift className="h-5 w-5 text-[#a31c1b]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#171717]">3. Refer Fellow Tenants</h4>
                <p className="text-xs text-[#546E7A] mt-1">
                  When a referred friend signs a verified lease through Staywise, you earn 300 WisePoints credited directly.
                </p>
              </div>
              <button 
                onClick={() => setActiveView('moveflow')}
                className="w-full py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Share Referral Link</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: IMMUTABLE POINTS LEDGER & AUDIT TRAIL */}
      {/* ============================================================== */}
      {activeTab === 'LEDGER' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#171717]">WisePoints Immutable Ledger</h3>
              <p className="text-xs text-[#546E7A]">Every point earned, redeemed, or reversed is permanently recorded in statutory double-entry sequence.</p>
            </div>
            <div className="text-xs text-[#546E7A] bg-[#E8F0EC] px-3 py-1.5 rounded-xl font-bold border border-[#D2DDD7]">
              {rewardsLedger.length} Total Ledger Events
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#D2DDD7] text-[11px] font-extrabold text-[#546E7A] uppercase tracking-wider bg-[#F7F8F6]">
                  <th className="py-3 px-4 rounded-l-xl">Date & Time</th>
                  <th className="py-3 px-4">Action / Event</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Ref Type</th>
                  <th className="py-3 px-4 text-right">Points</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2DDD7]/50">
                {rewardsLedger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#546E7A]">
                      No rewards activity yet. Complete your on-time rent payment to earn your first 100 WisePoints!
                    </td>
                  </tr>
                ) : (
                  rewardsLedger.map((entry) => {
                    const isCredit = entry.points > 0;
                    return (
                      <tr key={entry.id} className="hover:bg-[#F7F8F6]/80 transition">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#546E7A]">
                          {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#171717]">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            isCredit ? 'bg-[#E8F0EC] text-[#06110c]' : 'bg-[#fbebeb] text-[#a31c1b]'
                          }`}>
                            {entry.actionType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#171717] font-medium max-w-xs truncate">
                          {entry.description}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#546E7A] uppercase font-mono">
                          {entry.referenceType || 'SYSTEM'}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-black text-sm ${
                          isCredit ? 'text-[#06110c]' : 'text-[#a31c1b]'
                        }`}>
                          {isCredit ? `+${entry.points}` : entry.points}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#546E7A]">
                          ₹{entry.financialCost.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SUSTAINABLE REWARDS ECONOMICS */}
      {/* ============================================================== */}
      {activeTab === 'ECONOMICS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c]">
                Staywise Financial Sustainability Framework
              </span>
              <h3 className="text-lg font-black text-[#171717] mt-1">
                How Staywise Maintains Profitable Reward Unit Economics in India
              </h3>
              <p className="text-xs text-[#546E7A] mt-1">
                Unlike US credit card models that rely on high 2.5% interchange swipe fees, Staywise operates on low-margin Indian UPI rails by capping liability, co-funding with merchants, and driving retention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1">
                <span className="text-[10px] font-bold text-[#546E7A] uppercase">Max Cost / Tenant / Mo</span>
                <div className="text-2xl font-black text-[#171717]">₹10.00</div>
                <p className="text-[10px] text-[#546E7A]">100 WisePoints earned per rent payment capped at ₹10 face value liability.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1">
                <span className="text-[10px] font-bold text-[#546E7A] uppercase">Merchant Co-Funding</span>
                <div className="text-2xl font-black text-[#06110c]">54%</div>
                <p className="text-[10px] text-[#546E7A]">Cult.fit, Urban Company & Blue Tokai sponsor vouchers to acquire high-income residents.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1">
                <span className="text-[10px] font-bold text-[#546E7A] uppercase">Natural Breakage</span>
                <div className="text-2xl font-black text-[#a31c1b]">18.4%</div>
                <p className="text-[10px] text-[#546E7A]">Unredeemed expired points reduce outstanding liability over 12-month rolling windows.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1">
                <span className="text-[10px] font-bold text-[#546E7A] uppercase">Net Platform Cost</span>
                <div className="text-2xl font-black text-[#06110c]">₹4.60 / mo</div>
                <p className="text-[10px] text-[#546E7A]">Produces 3.2x higher on-time rent payment adherence and reduces vacancy turnover.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-[#171717] space-y-2">
              <div className="font-extrabold flex items-center gap-1.5 text-[#06110c]">
                <ShieldCheck className="h-4 w-4 text-[#a31c1b]" />
                <span>Anti-Abuse & Anti-Fraud Safeguards</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[#546E7A] text-[11px]">
                <li><strong>Verified Payment Execution:</strong> Points are only minted after webhook verification from payment partner (Razorpay / Cashfree / Bank API).</li>
                <li><strong>Reversal Policy:</strong> If a payment is charged back, bounced, or refunded, the corresponding WisePoints are automatically reversed via the immutable ledger.</li>
                <li><strong>Fixed Rent Bonuses:</strong> A tenant paying ₹50,000 does not automatically get 5x more rewards than a tenant paying ₹10,000, ensuring positive margin on all asset classes.</li>
                <li><strong>Auditable Ledger:</strong> All point movements are stored in <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#D2DDD7]">rewards_ledger</code> with complete financial cost tracking.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* REDEEM VOUCHER CONFIRMATION MODAL */}
      {/* ============================================================== */}
      {selectedOfferForRedeem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#a31c1b]" />
                <h3 className="font-black text-base text-[#171717]">Redeem Partner Voucher</h3>
              </div>
              <button 
                onClick={() => { setSelectedOfferForRedeem(null); setRedeemSuccessCode(null); }}
                className="text-[#546E7A] hover:text-[#171717]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!redeemSuccessCode ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#a31c1b] tracking-wide">
                    {selectedOfferForRedeem.partnerName}
                  </span>
                  <div className="text-base font-extrabold text-[#171717]">
                    {selectedOfferForRedeem.offerTitle}
                  </div>
                  <div className="text-xs text-[#546E7A]">
                    {selectedOfferForRedeem.discountDescription}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#ECCFA4] text-[#8C6B2E] space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Points to Deduct:</span>
                    <span className="font-black text-[#a31c1b]">-{selectedOfferForRedeem.pointsRequired} WisePoints</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Remaining Balance:</span>
                    <span className="font-bold text-[#171717]">{balance - selectedOfferForRedeem.pointsRequired} WisePoints</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedOfferForRedeem(null)}
                    className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A] hover:bg-[#F7F8F6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmRedeem(selectedOfferForRedeem)}
                    disabled={isRedeeming}
                    className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    {isRedeeming ? 'Generating...' : 'Confirm Redemption'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#06110c] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6 text-[#06110c]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#171717]">Voucher Generated Successfully!</h4>
                  <p className="text-xs text-[#546E7A] mt-1">Use this promotional code during checkout at {selectedOfferForRedeem.partnerName}.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#06110c] text-white flex items-center justify-between font-mono font-black text-sm tracking-widest">
                  <span>{redeemSuccessCode}</span>
                  <button
                    onClick={() => handleCopyVoucher(redeemSuccessCode)}
                    className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-sans font-bold flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={() => { setSelectedOfferForRedeem(null); setRedeemSuccessCode(null); }}
                  className="w-full py-2.5 rounded-xl bg-[#E8F0EC] text-[#06110c] text-xs font-bold hover:bg-[#DCE8E1]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* RENT CREDIT REDEMPTION MODAL */}
      {/* ============================================================== */}
      {isRentCreditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#C69A55]" />
                <h3 className="font-black text-base text-[#171717]">Convert Points to Rent Credit</h3>
              </div>
              <button 
                onClick={() => setIsRentCreditModalOpen(false)}
                className="text-[#546E7A] hover:text-[#171717]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-[#546E7A]">
                Select how many WisePoints you want to convert into a direct deduction discount on your next monthly rent invoice:
              </p>

              {/* Point presets */}
              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setRentCreditPoints(pts)}
                    disabled={balance < pts}
                    className={`p-3 rounded-2xl border text-center transition ${
                      rentCreditPoints === pts
                        ? 'bg-[#06110c] text-white border-[#06110c] shadow-xs'
                        : balance < pts
                        ? 'opacity-40 cursor-not-allowed bg-[#F7F8F6] border-[#D2DDD7]'
                        : 'bg-white hover:bg-[#F7F8F6] border-[#D2DDD7] text-[#171717]'
                    }`}
                  >
                    <div className="font-black text-sm">{pts} pts</div>
                    <div className="text-[10px] mt-0.5 opacity-80">= ₹{(pts * 0.5)} off</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1.5">
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Points to deduct:</span>
                  <span className="font-black text-[#a31c1b]">-{rentCreditPoints} WisePoints</span>
                </div>
                <div className="flex justify-between items-center text-[#171717] font-bold text-sm">
                  <span>Rent invoice deduction:</span>
                  <span className="font-black text-[#06110c]">₹{(rentCreditPoints * 0.5)} Discount</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A] text-[11px] pt-1 border-t border-[#D2DDD7]">
                  <span>New points balance:</span>
                  <span className="font-bold">{Math.max(0, balance - rentCreditPoints)} WisePoints</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsRentCreditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A] hover:bg-[#F7F8F6]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRentCredit}
                  disabled={isRedeeming || balance < rentCreditPoints}
                  className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isRedeeming ? 'Applying...' : `Apply ₹${rentCreditPoints * 0.5} Credit`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
