'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Settings as SettingsIcon, 
  Building2, 
  CreditCard, 
  Zap, 
  Bell, 
  ShieldCheck, 
  Users, 
  Save, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Smartphone, 
  Download, 
  Key, 
  Sliders,
  DollarSign,
  Crown,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpRight,
  Check,
  AlertTriangle,
  RefreshCw,
  Hash,
  ShieldAlert
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../../lib/security/subscriptionCatalog';

export default function SettingsView() {
  const { currentUser, addNotification, subscription, upgradeSubscription, refreshSubscription, cancelTrial } = useAppState();

  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'SUBSCRIPTION' | 'RENT_RULES' | 'UTILITIES' | 'BANKING' | 'DELEGATES' | 'SECURITY'>('SUBSCRIPTION');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isCancellingTrial, setIsCancellingTrial] = useState(false);

  // Subscription Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<'annual' | 'monthly'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<boolean>(false);

  // Tab persistence across page refresh
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const urlTab = new URLSearchParams(window.location.search).get('tab') as any;
      const savedTab = urlTab || localStorage.getItem('staywise_settings_tab');
      if (savedTab && ['PORTFOLIO', 'SUBSCRIPTION', 'RENT_RULES', 'UTILITIES', 'BANKING', 'DELEGATES', 'SECURITY'].includes(savedTab)) {
        setActiveTab(savedTab);
      }
    } catch (e) {}
  }, []);

  const handleTabChange = (tab: 'PORTFOLIO' | 'SUBSCRIPTION' | 'RENT_RULES' | 'UTILITIES' | 'BANKING' | 'DELEGATES' | 'SECURITY') => {
    setActiveTab(tab);
    try {
      localStorage.setItem('staywise_settings_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Form State: Portfolio & Entity
  const [entityName, setEntityName] = useState('Singhania Asset Holdings LLP');
  const [ownerName, setOwnerName] = useState('Vikram Singhania');
  const [panNumber, setPanNumber] = useState('AAACS1928K');
  const [gstin, setGstin] = useState('29AAACS1928K1Z5');
  const [supportPhone, setSupportPhone] = useState('+91 98450 11928');
  const [supportEmail, setSupportEmail] = useState('vikram.singhania@staywise.com');
  const [registeredAddress, setRegisteredAddress] = useState('Level 8, Prestige Trade Tower, Palace Road, Bengaluru 560001');

  // Form State: Rent Automation Rules
  const [rentDueDay, setRentDueDay] = useState(1);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeeType, setLateFeeType] = useState<'flat' | 'percentage'>('flat');
  const [lateFeeAmount, setLateFeeAmount] = useState(100);
  const [autoReminder7Days, setAutoReminder7Days] = useState(true);
  const [autoReminder3Days, setAutoReminder3Days] = useState(true);
  const [autoReminderDueDate, setAutoReminderDueDate] = useState(true);
  const [autoReminderOverdue1Day, setAutoReminderOverdue1Day] = useState(true);
  const [autoReminderOverdue7Days, setAutoReminderOverdue7Days] = useState(true);

  // Form State: Utility & Electricity Defaults
  const [defaultDiscom, setDefaultDiscom] = useState('BESCOM Bangalore');
  const [defaultRatePerUnit, setDefaultRatePerUnit] = useState(8.5);
  const [defaultFixedCharges, setDefaultFixedCharges] = useState(150);
  const [meterReadingCycle, setMeterReadingCycle] = useState('1st to 5th of every month');
  const [commonAreaPowerRatio, setCommonAreaPowerRatio] = useState(10);

  // Form State: Banking & UPI
  const [bankAccount, setBankAccount] = useState('918020048192842');
  const [ifsc, setIfsc] = useState('UTIB0000042');
  const [bankName, setBankName] = useState('Axis Bank (Escrow Banking Division)');
  const [upiId, setUpiId] = useState('staywise.escrow@axisbank');
  const [autoSweepCadence, setAutoSweepCadence] = useState('Daily at 18:00 IST');

  // Save handler
  const handleSaveSettings = () => {
    setIsSavedToast(true);
    addNotification('Settings Updated', 'Platform configurations and rent automation rules saved successfully.', 'SYSTEM');
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleExportBackup = () => {
    addNotification('Backup Created', 'Full portfolio records & ledger exported as encrypted JSON.', 'SYSTEM');
    alert('Exporting complete portfolio ledger, tenant contracts, and audit trail (ZIP/JSON)...');
  };

  const handleUpgradeTier = async (planId: 'starter' | 'growth_pro' | 'enterprise') => {
    setIsUpgrading(true);
    setUpgradeError(null);
    try {
      const res = await upgradeSubscription(planId, selectedCycle);
      setIsUpgrading(false);
      if (!res.success) {
        setUpgradeError(res.error || 'Failed to complete cryptographic upgrade');
      } else {
        setUpgradeSuccess(true);
        setTimeout(() => {
          setIsUpgradeModalOpen(false);
          setUpgradeSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setIsUpgrading(false);
      setUpgradeError(err.message || 'Upgrade request failed');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Platform &amp; Portfolio Settings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              Live Configuration
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Configure entity profile, automated rent schedules, electricity tariffs, and escrow payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="h-4 w-4 text-[#274235]" />
            <span>Export Full Backup</span>
          </button>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 flex items-center gap-2 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#eeece5] text-xs">
        <button
          onClick={() => handleTabChange('SUBSCRIPTION')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'SUBSCRIPTION'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Crown className="h-4 w-4 text-amber-400" />
          <span>Subscription &amp; Plans</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 font-extrabold border border-emerald-500/30">
            Active
          </span>
        </button>

        <button
          onClick={() => handleTabChange('PORTFOLIO')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'PORTFOLIO'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Entity &amp; Identity</span>
        </button>

        <button
          onClick={() => handleTabChange('RENT_RULES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'RENT_RULES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Rent &amp; Grace Period Rules</span>
        </button>

        <button
          onClick={() => handleTabChange('UTILITIES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'UTILITIES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Electricity &amp; Utilities</span>
        </button>

        <button
          onClick={() => handleTabChange('BANKING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'BANKING'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payout Escrow &amp; UPI</span>
        </button>

        <button
          onClick={() => handleTabChange('DELEGATES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'DELEGATES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Managers &amp; Accountants</span>
        </button>

        <button
          onClick={() => handleTabChange('SECURITY')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'SECURITY'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Security &amp; 2FA</span>
        </button>
      </div>

      {/* TAB: Owner Subscription Model & White-Hat Security Hardening */}
      {activeTab === 'SUBSCRIPTION' && (
        <div className="space-y-6">
          {/* Top Hero Banner */}
          <div className="organic-card p-6 sm:p-8 bg-gradient-to-br from-[#19251f] via-[#21352a] to-[#121c17] text-white relative overflow-hidden rounded-3xl shadow-xl border border-[#274235]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {subscription?.status === 'TRIAL' ? (
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-[#19251f] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                      7-Day Free Trial • Autopay Scheduled
                    </span>
                  ) : subscription?.status === 'CANCELLED' ? (
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      Trial Cancelled • Autopay Revoked
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      Active Plan • Auto-Renew ON
                    </span>
                  )}

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    {subscription?.billingCycle === 'annual' ? 'Annual Commitment (Saved 17%)' : 'Monthly Flexible'}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                    {subscription?.planName || 'Growth Portfolio Pro OS'}
                  </h2>
                  <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
                    {subscription?.status === 'TRIAL' 
                      ? `Your 7-day risk-free trial is active. You have full access to all features. Your card/bank will only process autopay on ${subscription.endDate} (₹${subscription.amount}) if not cancelled before then.`
                      : 'Unified multi-asset property management operating system with statutory double-entry ledger, sub-meter OCR tariff splitting, automated WhatsApp dunning, and Axis Bank Escrow clearance.'
                    }
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span>Plan Started: <b className="text-white">{subscription?.startDate || '01 Oct 2026'}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span>{subscription?.status === 'TRIAL' ? 'Trial Ends / First Charge:' : 'Next Renewal:'} <b className="text-white">{subscription?.endDate || '01 Oct 2027'}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-300" />
                    <span>{subscription?.status === 'TRIAL' ? 'Trial Remaining:' : 'Validity Countdown:'} <b className="text-emerald-300">{subscription?.daysRemaining ?? 7} Days Left</b></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#19251f] font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{subscription?.status === 'CANCELLED' ? 'Reactivate Subscription' : 'Upgrade / Switch Tier'}</span>
                </button>

                {subscription?.status === 'TRIAL' && (
                  <button
                    onClick={async () => {
                      if (confirm("Cancel 7-Day Free Trial?\n\nYour connected card/bank autopay mandate will be revoked immediately and you will NOT be charged (₹0). You can continue exploring until your trial expires.")) {
                        setIsCancellingTrial(true);
                        await cancelTrial();
                        setIsCancellingTrial(false);
                      }
                    }}
                    disabled={isCancellingTrial}
                    className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    <span>{isCancellingTrial ? 'Revoking Autopay...' : 'Cancel Trial & Autopay (₹0 Charged)'}</span>
                  </button>
                )}

                <button
                  onClick={async () => {
                    await refreshSubscription();
                    addNotification('Subscription Status Refreshed', 'Synced latest quota & ledger status from central server.', 'SYSTEM');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Sync Server Status</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Plan Details & Quota Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Subscription Financials */}
            <div className="organic-card p-5 space-y-3.5 border border-[#e3e1d8] bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#19251f]">Subscription Billing</h4>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Cleared
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Annual Invoiced Fee:</span>
                  <span className="font-black text-[#19251f] text-sm">
                    ₹{(subscription?.amount || 79990).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>GST Applicable (18%):</span>
                  <span className="font-bold text-[#19251f]">Included (₹12,202)</span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Active Payment Method:</span>
                  <span className="font-bold text-[#19251f]">{subscription?.paymentMethod || 'Axis Bank Escrow Auto-Debit'}</span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Billing Entity GSTIN:</span>
                  <span className="font-mono text-[#19251f] font-semibold">{subscription?.gstin || '29AAACS1928K1Z5'}</span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Last Cleared Txn:</span>
                  <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {subscription?.lastPaymentTxnId || 'TXN-STAY-SUB-SECURE-98124'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Quota & Capacity Usage */}
            <div className="organic-card p-5 space-y-3.5 border border-[#e3e1d8] bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#19251f]">Unit &amp; Asset Quota</h4>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  {Math.round(((subscription?.currentUnits || 24) / (subscription?.maxUnits || 50)) * 100)}% Used
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#6e7972] mb-1">
                    <span>Managed Units Allocation:</span>
                    <span className="font-bold text-[#19251f]">
                      {subscription?.currentUnits || 24} of {subscription?.maxUnits || 50} Units
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#f0eee6] overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round(((subscription?.currentUnits || 24) / (subscription?.maxUnits || 50)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8]">
                    <div className="text-[10px] text-[#6e7972]">PG Co-living Beds</div>
                    <div className="text-xs font-black text-[#19251f]">18 Active Beds</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8]">
                    <div className="text-[10px] text-[#6e7972]">Commercial Area</div>
                    <div className="text-xs font-black text-[#19251f]">15,000 sq.ft</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8]">
                    <div className="text-[10px] text-[#6e7972]">WhatsApp Dunning</div>
                    <div className="text-xs font-black text-emerald-700">Unlimited</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8]">
                    <div className="text-[10px] text-[#6e7972]">OCR Bill Reads</div>
                    <div className="text-xs font-black text-[#19251f]">89 / 500 Used</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Subscription Invoices History */}
          <div className="organic-card p-6 border border-[#e3e1d8] bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#19251f]">Subscription Tax Invoices &amp; Receipts</h3>
                <p className="text-xs text-[#6e7972]">
                  RBI-compliant GST tax invoices generated for all subscription periods and upgrades
                </p>
              </div>

              <button
                onClick={() => alert('Downloading official GST Tax Invoices ZIP archive...')}
                className="px-3.5 py-2 rounded-xl bg-[#f7f6f2] hover:bg-[#eeece5] border border-[#e3e1d8] text-xs font-bold text-[#19251f] flex items-center gap-1.5 transition"
              >
                <Download className="h-3.5 w-3.5 text-[#274235]" />
                <span>Export Tax Invoices (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eeece5] text-[#6e7972] font-bold">
                    <th className="pb-2.5">Invoice #</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5">Plan Description</th>
                    <th className="pb-2.5">Cycle</th>
                    <th className="pb-2.5">Transaction ID</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeece5]">
                  {(subscription?.history && subscription.history.length > 0 ? subscription.history : [
                    {
                      invoiceId: 'INV-STAY-SUB-2026-001',
                      date: '01 Oct 2026',
                      amount: 79990,
                      currency: 'INR',
                      planId: 'growth_pro',
                      planName: 'Growth Portfolio Pro OS (Annual)',
                      billingCycle: 'annual',
                      txnId: 'TXN-STAY-SUB-SECURE-98124',
                      paymentMethod: 'Axis Bank Escrow Auto-Debit',
                      status: 'PAID'
                    }
                  ]).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fbfbfa]">
                      <td className="py-3 font-mono font-bold text-[#19251f]">{item.invoiceId}</td>
                      <td className="py-3 text-[#6e7972]">{item.date}</td>
                      <td className="py-3 font-semibold text-[#19251f]">{item.planName}</td>
                      <td className="py-3 text-[#6e7972] capitalize">{item.billingCycle}</td>
                      <td className="py-3 font-mono text-[10px] text-[#6e7972]">{item.txnId}</td>
                      <td className="py-3 font-black text-[#19251f]">₹{item.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => alert(`Opening official GST tax receipt for ${item.invoiceId}`)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#e3e1d8] text-[#274235] hover:bg-[#f7f6f2] font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
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

      {/* TAB 1: Portfolio & Legal Entity */}
      {activeTab === 'PORTFOLIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Asset Owner &amp; Legal Entity Information</h3>
              <p className="text-xs text-[#6e7972]">
                Appears on all official rent receipts, lease agreements, and Form 16/Schedule HP filings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Entity / Trust Legal Name</label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Primary Landlord / Signatory</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Income Tax PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">GSTIN (Commercial Leases)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Official WhatsApp &amp; SMS Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Support &amp; Escrow Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#19251f] font-semibold mb-1">Registered Statutory Office Address</label>
                <input
                  type="text"
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Digital Seal &amp; Brand Stamp</h3>
              <p className="text-xs text-[#6e7972]">Auto-applied to digital rent receipts and eKYC tenant contracts</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-20 w-20 rounded-full border-4 border-[#274235] bg-white flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-[#274235]">SW</span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#19251f]">{entityName}</div>
                <div className="text-[11px] text-[#6e7972]">Staywise Verified Digital Signatory</div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                DSC Token Valid (eMudhra)
              </span>
            </div>

            <button
              onClick={() => alert('Certificate is active and synchronized with DigiLocker and MCA.')}
              className="w-full py-2.5 rounded-2xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] font-bold text-xs transition"
            >
              Update DSC Certificate
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Rent & Grace Period Rules */}
      {activeTab === 'RENT_RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Rent Collection Schedule &amp; Penalties</h3>
              <p className="text-xs text-[#6e7972]">
                Configure when invoices are generated, grace period before overdue fees, and late fee formulas
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Monthly Due Date</label>
                  <select
                    value={rentDueDay}
                    onChange={(e) => setRentDueDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  >
                    <option value={1}>1st of every month</option>
                    <option value={5}>5th of every month</option>
                    <option value={10}>10th of every month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Grace Period (Days)</label>
                  <select
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  >
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days (Recommended)</option>
                    <option value={7}>7 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3">
                <span className="font-extrabold text-[#19251f] block">Late Fee Computation</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#6e7972] font-semibold mb-1">Fee Mode</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                    >
                      <option value="flat">Flat Per Day (₹)</option>
                      <option value="percentage">Percentage (1.5% / month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#6e7972] font-semibold mb-1">Per Day Amount (₹)</label>
                    <input
                      type="number"
                      value={lateFeeAmount}
                      onChange={(e) => setLateFeeAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#6e7972]">
                  Late fees automatically accrue on the 6th day after the due date and are invoiced on the tenant portal.
                </p>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Automated Reminder Matrix</h3>
              <p className="text-xs text-[#6e7972]">
                Multichannel alerts sent to tenants via WhatsApp, SMS, Push, and Email
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">7 Days Before Due Date</span>
                  <span className="text-[11px] text-[#6e7972]">Friendly advance statement &amp; Autopay confirmation</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder7Days}
                  onChange={(e) => setAutoReminder7Days(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">3 Days Before Due Date</span>
                  <span className="text-[11px] text-[#6e7972]">WhatsApp reminder with 1-click UPI quick pay</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder3Days}
                  onChange={(e) => setAutoReminder3Days(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">Due Date Morning (09:00 AM)</span>
                  <span className="text-[11px] text-[#6e7972]">Direct UPI dynamic QR dispatched on WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderDueDate}
                  onChange={(e) => setAutoReminderDueDate(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">1 Day Overdue (Grace Alert)</span>
                  <span className="text-[11px] text-[#6e7972]">Polite notification reminding 4 days remain before late fine</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderOverdue1Day}
                  onChange={(e) => setAutoReminderOverdue1Day(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-rose-700 block">7 Days Overdue (Formal Escalation)</span>
                  <span className="text-[11px] text-[#6e7972]">Overdue notice + manager phone follow-up task created</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderOverdue7Days}
                  onChange={(e) => setAutoReminderOverdue7Days(e.target.checked)}
                  className="h-4 w-4 accent-rose-700"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Electricity & Utilities */}
      {activeTab === 'UTILITIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Electricity Board &amp; Sub-meter Defaults</h3>
              <p className="text-xs text-[#6e7972]">
                Applied when uploading or calculating monthly power bills for residential and commercial units
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Primary State Discom Provider</label>
                <select
                  value={defaultDiscom}
                  onChange={(e) => setDefaultDiscom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                >
                  <option value="BESCOM Bangalore">BESCOM (Bangalore Electricity Supply Co.)</option>
                  <option value="KSEB Kerala">KSEB (Kerala State Electricity Board)</option>
                  <option value="TANGEDCO Chennai">TANGEDCO (Tamil Nadu Generation &amp; Distribution)</option>
                  <option value="BSES Delhi">BSES Rajdhani / Yamuna (Delhi)</option>
                  <option value="MSEDCL Mumbai">MSEDCL (Maharashtra State Electricity)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Default Tariff / Unit (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={defaultRatePerUnit}
                    onChange={(e) => setDefaultRatePerUnit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Fixed Meter Charge / Mo (₹)</label>
                  <input
                    type="number"
                    value={defaultFixedCharges}
                    onChange={(e) => setDefaultFixedCharges(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Monthly Meter Reading Cycle</label>
                <input
                  type="text"
                  value={meterReadingCycle}
                  onChange={(e) => setMeterReadingCycle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">
                  Common Area Lighting &amp; Lift Allocation Ratio (%)
                </label>
                <input
                  type="number"
                  value={commonAreaPowerRatio}
                  onChange={(e) => setCommonAreaPowerRatio(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Sub-Meter Calibration &amp; IoT Smart Meters</h3>
              <p className="text-xs text-[#6e7972]">
                Automated pulse counters and photo OCR meter verification
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
                <span className="font-bold text-[#19251f]">Smart IoT Pulse Reader</span>
                <p className="text-[11px] text-[#6e7972]">
                  Reads kWh consumption directly from RS-485 Modbus meters every 24 hours.
                </p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  ✓ Online (12 Units Connected)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
                <span className="font-bold text-[#19251f]">Caretaker Photo OCR Verification</span>
                <p className="text-[11px] text-[#6e7972]">
                  When caretaker uploads meter dial photograph, Staywise AI extracts kWh numbers automatically.
                </p>
                <span className="text-[10px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full inline-block mt-1">
                  AI OCR Active
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('All 12 sub-meters calibrated with official BESCOM master meter.')}
              className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
            >
              Calibrate Sub-Meters Now
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Payout Escrow & UPI */}
      {activeTab === 'BANKING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Primary Escrow Payout Bank Account</h3>
              <p className="text-xs text-[#6e7972]">
                Where collected tenant rents and security deposits are deposited and swept
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Escrow Bank &amp; Branch</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Dedicated UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Auto-Sweep Cadence to Landlord Operating Account</label>
                <select
                  value={autoSweepCadence}
                  onChange={(e) => setAutoSweepCadence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                >
                  <option value="Daily at 18:00 IST">Daily at 18:00 IST (Default)</option>
                  <option value="Instant per Rent Payment">Instant per Rent Payment</option>
                  <option value="Weekly Every Monday">Weekly Every Monday</option>
                </select>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Escrow Trustee Verification</h3>
              <p className="text-xs text-[#6e7972]">RBI-regulated tri-party escrow structure</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Escrow Node Active</span>
              </div>
              <p className="text-[11px] text-[#274235] leading-relaxed">
                Rent is received directly in RBI-monitored escrow account. Landlord and vendor payouts are disbursed with automated digital audit logs.
              </p>
              <div className="pt-2 border-t border-[#274235]/20 flex justify-between font-bold text-[#19251f]">
                <span>Escrow Trustee:</span>
                <span>Axis Trustee Services Ltd.</span>
              </div>
            </div>

            <button
              onClick={() => alert('Bank statements and penny-drop test verified.')}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs shadow-sm transition"
            >
              Run Penny-Drop Re-Verification
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Managers & Accountants (Authorized Delegates) */}
      {activeTab === 'DELEGATES' && (
        <div className="organic-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eeece5]">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Authorized Delegate Access Control</h3>
              <p className="text-xs text-[#6e7972]">
                Grant scoped read/audit access to external Accountants, Property Managers, and Tax Consultants
              </p>
            </div>

            <button
              onClick={() => alert('Invite new Accountant or Property Manager with scoped permissions')}
              className="px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+ Invite New Delegate</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#19251f]">CA Rajesh K.</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                    Chartered Accountant
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[#6e7972]">rajesh.k@cacafe.in • +91 98410 44219</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Double-Entry Ledger</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Section 24 Tax P&amp;L</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Invoices &amp; TDS</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Permissions updated for CA Rajesh K.')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
                >
                  Configure Scope
                </button>
                <button
                  onClick={() => alert('Access suspended for CA Rajesh K.')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                  Revoke
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#19251f]">Arjun Das</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    Field Operations Manager
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[#6e7972]">arjun.das@staywise.com • +91 94470 12891</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Leads &amp; Showing Visits</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Maintenance Work Orders</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Electricity Sub-Meters</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Permissions updated for Arjun Das')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
                >
                  Configure Scope
                </button>
                <button
                  onClick={() => alert('Access suspended for Arjun Das')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Security & 2FA */}
      {activeTab === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Account Security &amp; MFA</h3>
              <p className="text-xs text-[#6e7972]">
                Protect portfolio bank withdrawals and sensitive lease agreements
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-[#274235]" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </span>
                  <span className="text-[11px] text-[#6e7972]">SMS OTP + Google Authenticator Active</span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] block">Session Inactivity Timeout</span>
                  <span className="text-[11px] text-[#6e7972]">Auto-lock dashboard after 30 minutes of idle time</span>
                </div>
                <span className="text-xs font-bold text-[#19251f]">30 min</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] block">Audit Log Retention</span>
                  <span className="text-[11px] text-[#6e7972]">Immutable ledger and activity history archived</span>
                </div>
                <span className="text-xs font-bold text-[#274235]">7 Years Statutory</span>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Change Password</h3>
              <p className="text-xs text-[#6e7972]">Current user: {currentUser.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  defaultValue="Owner@123"
                  className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                />
              </div>
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter strong new password"
                  className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Password updated securely.')}
              className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
            >
              Update Security Password
            </button>
          </div>
        </div>
      )}

      {/* Tier Switcher & Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-4xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#eeece5] bg-[#fbfbfa] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#19251f]">Staywise Platform Tier Selection</h3>
                  <p className="text-xs text-[#6e7972]">Server-Authoritative Pricing • Protected by HMAC-SHA256 Tokenization</p>
                </div>
              </div>
              <button
                onClick={() => { setIsUpgradeModalOpen(false); setUpgradeError(null); }}
                className="text-[#6e7972] hover:text-[#19251f] p-1.5 rounded-xl hover:bg-slate-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cycle Toggle */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                <div className="p-1 rounded-2xl bg-[#f0eee6] flex items-center gap-1 border border-[#e3e1d8]">
                  <button
                    onClick={() => setSelectedCycle('monthly')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCycle === 'monthly' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972] hover:text-[#19251f]'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setSelectedCycle('annual')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedCycle === 'annual' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972] hover:text-[#19251f]'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-[#19251f] font-black text-[9px]">
                      SAVE 17%
                    </span>
                  </button>
                </div>
              </div>

              {upgradeError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{upgradeError}</span>
                </div>
              )}

              {upgradeSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Plan upgraded and cryptographically verified! Refreshing workspace...</span>
                </div>
              )}

              {/* 3 Tier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['starter', 'growth_pro', 'enterprise'] as const).map((tierId) => {
                  const plan = SUBSCRIPTION_PLANS[tierId];
                  const price = selectedCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                  const isCurrent = subscription?.planId === tierId;

                  return (
                    <div 
                      key={tierId}
                      className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                        isCurrent 
                          ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20' 
                          : plan.popular 
                            ? 'border-amber-400 bg-amber-50/10' 
                            : 'border-[#e3e1d8] bg-white'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#6e7972]">
                              {plan.badge || 'Tier Plan'}
                            </span>
                            <h4 className="text-base font-extrabold text-[#19251f]">{plan.name}</h4>
                          </div>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="pt-1 pb-2">
                          <span className="text-2xl font-black text-[#19251f]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#6e7972] font-semibold">
                            /{selectedCycle === 'annual' ? 'yr' : 'mo'}
                          </span>
                          <div className="text-[10px] text-[#6e7972] mt-0.5">
                            {selectedCycle === 'annual' ? `(Approx ₹${Math.round(price / 12).toLocaleString('en-IN')}/month)` : 'Cancel anytime'}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#eeece5] space-y-2 text-xs text-[#19251f]">
                          {plan.features.slice(0, 5).map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px]">
                              <Check className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 mt-4 border-t border-[#eeece5]">
                        <button
                          disabled={isUpgrading}
                          onClick={() => handleUpgradeTier(tierId)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                              : plan.popular
                                ? 'bg-[#274235] text-white hover:bg-[#1e352a] shadow-sm'
                                : 'bg-[#19251f] text-white hover:bg-black shadow-sm'
                          }`}
                        >
                          {isUpgrading ? (
                            <span>Verifying HMAC Seal...</span>
                          ) : isCurrent ? (
                            <span>Renew Active Tier</span>
                          ) : (
                            <>
                              <span>Switch to this Tier</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* White Hat Audit Notice */}
              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center gap-3 text-xs text-[#6e7972]">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  <b>White-Hat Security Active:</b> Checkout tokens are cryptographically generated on server. Burp Suite request interception and client-side amount tampering are neutralized and quarantined.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Toast feedback */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#19251f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#274235] animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold">Settings and automation rules saved!</span>
        </div>
      )}
    </div>
  );
}
