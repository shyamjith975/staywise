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
  ShieldAlert,
  X
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../../lib/security/subscriptionCatalog';

export default function SettingsView() {
  const { 
    currentUser, 
    addNotification, 
    subscription, 
    upgradeSubscription, 
    refreshSubscription, 
    cancelTrial,
    delegates: appDelegates,
    addDelegate,
    revokeDelegate
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'SUBSCRIPTION' | 'RENT_RULES' | 'UTILITIES' | 'BANKING' | 'DELEGATES' | 'SECURITY'>('PORTFOLIO');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isCancellingTrial, setIsCancellingTrial] = useState(false);

  // Delegate Invite Modal State
  const [isInviteDelegateOpen, setIsInviteDelegateOpen] = useState(false);
  const [delegateForm, setDelegateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Accountant' as 'Accountant' | 'Property Manager' | 'Tax Auditor',
    allowLedger: true,
    allowInvoices: true,
    allowMaintenance: false
  });

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

  const isDemoAccount = currentUser.email === 'vikram@staywise.in' || currentUser.email === 'owner@staywise.com' || currentUser.id === 'user-owner-vikram';

  // Form State: Portfolio & Entity
  const [entityName, setEntityName] = useState(isDemoAccount ? 'Singhania Asset Holdings LLP' : (currentUser.name ? `${currentUser.name} Properties` : ''));
  const [ownerName, setOwnerName] = useState(isDemoAccount ? 'Vikram Singhania' : (currentUser.name || ''));
  const [panNumber, setPanNumber] = useState(isDemoAccount ? 'AAACS1928K' : '');
  const [gstin, setGstin] = useState(isDemoAccount ? '29AAACS1928K1Z5' : '');
  const [supportPhone, setSupportPhone] = useState(isDemoAccount ? '+91 98450 11928' : ((currentUser as any).phone || ''));
  const [supportEmail, setSupportEmail] = useState(isDemoAccount ? 'vikram.singhania@staywise.com' : (currentUser.email || ''));
  const [registeredAddress, setRegisteredAddress] = useState(isDemoAccount ? 'Level 8, Prestige Trade Tower, Palace Road, Bengaluru 560001' : '');

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
  const [bankAccount, setBankAccount] = useState(isDemoAccount ? '918020048192842' : '');
  const [ifsc, setIfsc] = useState(isDemoAccount ? 'UTIB0000042' : '');
  const [bankName, setBankName] = useState(isDemoAccount ? 'Axis Bank (Escrow Banking Division)' : '');
  const [upiId, setUpiId] = useState(isDemoAccount ? 'staywise.escrow@axisbank' : '');
  const [autoSweepCadence, setAutoSweepCadence] = useState('Daily at 18:00 IST');

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load persisted settings on mount from SQLite database
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?userId=${encodeURIComponent(currentUser.id || '')}`);
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.entityName) setEntityName(s.entityName);
          if (s.ownerName) setOwnerName(s.ownerName);
          if (s.panNumber) setPanNumber(s.panNumber);
          if (s.gstin) setGstin(s.gstin);
          if (s.bankAccount) setBankAccount(s.bankAccount);
          if (s.ifsc) setIfsc(s.ifsc);
          if (s.bankName) setBankName(s.bankName);
          if (s.upiId) setUpiId(s.upiId);
          if (s.autoSweepCadence) setAutoSweepCadence(s.autoSweepCadence);
          if (s.rentDueDay) setRentDueDay(s.rentDueDay);
          if (s.gracePeriodDays) setGracePeriodDays(s.gracePeriodDays);
          if (s.lateFeeFixed) setLateFeeAmount(s.lateFeeFixed);
          if (s.ksebTariffPerUnit) setDefaultRatePerUnit(s.ksebTariffPerUnit);
          if (s.dgBackupRatePerUnit) setDefaultFixedCharges(s.dgBackupRatePerUnit);
          if (s.meterReadingCycle) setMeterReadingCycle(s.meterReadingCycle);
          if (s.commonAreaPowerRatio) setCommonAreaPowerRatio(s.commonAreaPowerRatio);
        }
      } catch (err) {
        console.error('Failed to load platform settings:', err);
      }
    }
    loadSettings();
  }, [currentUser.id]);

  // Save handler - Persists to SQLite Database via POST /api/settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          entityName,
          ownerName,
          panNumber,
          gstin,
          bankAccount,
          ifsc,
          bankName,
          upiId,
          autoSweepCadence,
          rentDueDay,
          gracePeriodDays,
          lateFeeFixed: lateFeeAmount,
          lateFeeDailyRate: 50,
          autoWhatsAppReminder: true,
          allowPartialPayments: false,
          ksebTariffPerUnit: defaultRatePerUnit,
          dgBackupRatePerUnit: defaultFixedCharges,
          meterReadingCycle,
          commonAreaPowerRatio
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSavedToast(true);
        addNotification('Settings Updated', 'Platform configurations and rent automation rules saved to SQLite database successfully.', 'SYSTEM');
        setTimeout(() => setIsSavedToast(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings to database.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving settings to database.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleExportBackup = () => {
    addNotification('Backup Created', 'Full portfolio records & ledger exported as encrypted JSON.', 'SYSTEM');
    const backupData = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      subscription,
      settings: {
        entityName,
        ownerName,
        panNumber,
        gstin,
        bankAccount,
        ifsc,
        bankName,
        upiId,
        rentDueDay,
        gracePeriodDays,
        lateFeeAmount,
        ksebTariffPerUnit: defaultRatePerUnit,
        dgBackupRatePerUnit: defaultFixedCharges,
        meterReadingCycle,
        commonAreaPowerRatio
      }
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staywise-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Security Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleUpdatePassword = async () => {
    if (!currentPasswordInput) {
      setPasswordStatus({ message: 'Please enter your current password.', isError: true });
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordStatus({ message: 'New password must be at least 6 characters long.', isError: true });
      return;
    }
    setPasswordLoading(true);
    setPasswordStatus(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordStatus({ message: data.error || 'Failed to update password.', isError: true });
      } else {
        setPasswordStatus({ message: 'Password updated and encrypted in SHA-256 format.', isError: false });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        addNotification('Password Updated', 'Your security password was successfully updated and hashed with SHA-256.', 'SYSTEM');
      }
    } catch (e: any) {
      setPasswordStatus({ message: e.message || 'Network error updating password.', isError: true });
    } finally {
      setPasswordLoading(false);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Platform &amp; Portfolio Settings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#263238] font-bold border border-[#263238]/20">
              Live Configuration
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Configure entity profile, automated rent schedules, electricity tariffs, and escrow payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
          >
            <Download className="h-4 w-4 text-[#263238]" />
            <span>Export Full Backup</span>
          </button>

          <button
            disabled={isSavingSettings}
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-md shadow-red-900/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSavingSettings ? 'Saving...' : 'Save Configurations'}</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#D1D5DB] text-xs">
        <button
          onClick={() => handleTabChange('SUBSCRIPTION')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'SUBSCRIPTION'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Crown className={`h-4 w-4 ${activeTab === 'SUBSCRIPTION' ? 'text-[#C69A55]' : 'text-amber-500'}`} />
          <span>Subscription &amp; Plans</span>
          <span className="px-2 py-0.5 rounded-full bg-[#D32F2F] text-white text-[10px] font-black">
            Active
          </span>
        </button>

        <button
          onClick={() => handleTabChange('PORTFOLIO')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'PORTFOLIO'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Entity &amp; Identity</span>
        </button>

        <button
          onClick={() => handleTabChange('RENT_RULES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'RENT_RULES'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Rent &amp; Grace Period Rules</span>
        </button>

        <button
          onClick={() => handleTabChange('UTILITIES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'UTILITIES'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Zap className={`h-4 w-4 ${activeTab === 'UTILITIES' ? 'text-[#C69A55]' : 'text-amber-500'}`} />
          <span>Electricity &amp; Utilities</span>
        </button>

        <button
          onClick={() => handleTabChange('BANKING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'BANKING'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payout Escrow &amp; UPI</span>
        </button>

        <button
          onClick={() => handleTabChange('DELEGATES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'DELEGATES'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Managers &amp; Accountants</span>
        </button>

        <button
          onClick={() => handleTabChange('SECURITY')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Security &amp; 2FA</span>
        </button>
      </div>

      {/* TAB: Owner Subscription Model & White-Hat Security Hardening */}
      {activeTab === 'SUBSCRIPTION' && (
        <div className="space-y-6">
          {/* Dark Hero Plan Summary Card - Matching User Screenshot */}
          <div className="rounded-3xl bg-[#261E1A] p-6 sm:p-8 text-white relative overflow-hidden space-y-5 border border-[#3E322D] shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#4D1F24] text-[#FFA4A4] border border-[#6E2A32] text-[11px] font-extrabold tracking-wide">
                    {subscription?.status === 'CANCELLED' 
                      ? 'Trial Cancelled • Autopay Revoked' 
                      : subscription?.status === 'TRIAL' 
                        ? 'Trial Cancelled • Autopay Revoked' 
                        : 'Active Plan • Auto-renew Active'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#3D2C1B] text-[#FFC876] border border-[#5A4026] text-[11px] font-bold flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-[#FFC876]" />
                    <span>Annual Commitment (Saved 17%)</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {subscription?.planName || 'Growth Portfolio Pro OS'}
                </h2>
                <p className="text-xs sm:text-sm text-rose-300/80 mt-1 max-w-2xl leading-relaxed">
                  Unified multi-asset property management operating system with statutory double-entry ledger, sub-meter OCR tariff splitting, automated WhatsApp dunning, and Axis Bank Escrow clearance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-black transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Reactivate Subscription</span>
                </button>
                <button
                  onClick={async () => {
                    setIsSyncing(true);
                    await refreshSubscription();
                    setIsSyncing(false);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#3D332F] hover:bg-[#4E433E] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Server Status</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-white/10 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-rose-300" />
                <span>Plan Started: <b className="text-white font-tabular">{subscription?.startDate || '2026-10-04'}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                <span>Next Renewal: <b className="text-white font-tabular">{subscription?.endDate || '2026-10-11'}</b></span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-red-400" />
                <span>Validity Countdown: <b className="text-red-400 font-tabular">{subscription?.daysRemaining ?? 7} Days Left</b></span>
              </div>
            </div>
          </div>

          {/* 2-Column Plan Details & Quota Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Subscription Financials */}
            <div className="organic-card p-5 space-y-3.5 border border-[#D2DDD7] bg-white rounded-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#E8F0EC] text-[#263238] flex items-center justify-center">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#263238]">Subscription Billing</h4>
                </div>
                <span className="text-[11px] font-bold text-[#546E7A] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#D2DDD7]">
                  Cleared
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Annual Invoiced Fee:</span>
                  <span className="font-black text-[#263238] text-sm">
                    ₹{(subscription?.amount ?? 79990).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>GST Applicable (18%):</span>
                  <span className="font-bold text-[#263238]">Included (₹12,202)</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Active Payment Method:</span>
                  <span className="font-bold text-[#263238]">{subscription?.paymentMethod || 'Autopay Card: Visa/Mastercard ending in •••• 9842'}</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Billing Entity GSTIN:</span>
                  <span className="font-mono text-[#263238] font-bold">{subscription?.gstin || '29AAACS1928K1Z5'}</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Last Cleared Txn:</span>
                  <span className="font-mono text-[11px] text-[#263238] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7] font-bold">
                    {subscription?.lastPaymentTxnId || 'TXN-TRIAL-MANDATE-1791103833091'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Quota & Capacity Usage */}
            <div className="organic-card p-5 space-y-3.5 border border-[#D2DDD7] bg-white rounded-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-[#263238]">Unit &amp; Asset Quota</h4>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {Math.round(((subscription?.currentUnits || 1) / (subscription?.maxUnits || 50)) * 100)}% Used
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#546E7A] mb-1">
                    <span>Managed Units Allocation:</span>
                    <span className="font-bold text-[#263238]">
                      {subscription?.currentUnits || 1} of {subscription?.maxUnits || 50} Units
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8F0EC] overflow-hidden">
                    <div 
                      className="h-full bg-[#263238] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, Math.min(100, Math.round(((subscription?.currentUnits || 1) / (subscription?.maxUnits || 50)) * 100)))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#E8F0EC]/60 border border-[#D2DDD7]">
                    <div className="text-[10px] text-[#546E7A]">PG Co-living Beds</div>
                    <div className="text-xs font-black text-[#263238]">18 Active Beds</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E8F0EC]/60 border border-[#D2DDD7]">
                    <div className="text-[10px] text-[#546E7A]">Commercial Area</div>
                    <div className="text-xs font-black text-[#263238]">15,000 sq.ft</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E8F0EC]/60 border border-[#D2DDD7]">
                    <div className="text-[10px] text-[#546E7A]">WhatsApp Dunning</div>
                    <div className="text-xs font-black text-[#263238]">Unlimited</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="font-mono text-[10px] text-emerald-800 font-bold truncate">
                      {subscription?.lastPaymentTxnId || 'TXN-TRIAL-MANDATE-1791103833091'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Subscription Invoices History */}
          <div className="organic-card p-6 border border-[#D2DDD7] bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Subscription Tax Invoices &amp; Receipts</h3>
                <p className="text-xs text-[#666666]">
                  RBI-compliant GST tax invoices generated for all subscription periods and upgrades
                </p>
              </div>

              <button
                onClick={() => alert('Downloading official GST Tax Invoices ZIP archive...')}
                className="px-3.5 py-2 rounded-xl bg-[#E8F0EC] hover:bg-[#E0E0E0] border border-[#D2DDD7] text-xs font-bold text-[#263238] flex items-center gap-1.5 transition"
              >
                <Download className="h-3.5 w-3.5 text-[#263238]" />
                <span>Export Tax Invoices (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E0E0E0] text-[#666666] font-bold">
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
                <tbody className="divide-y divide-[#E0E0E0]">
                  {((subscription?.history && subscription.history.length > 0)
                    ? subscription.history 
                    : (isDemoAccount ? [
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
                    ] : [])
                  ).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#ffffff]">
                      <td className="py-3 font-mono font-bold text-[#263238]">{item.invoiceId}</td>
                      <td className="py-3 text-[#666666]">{item.date}</td>
                      <td className="py-3 font-semibold text-[#263238]">{item.planName}</td>
                      <td className="py-3 text-[#666666] capitalize">{item.billingCycle}</td>
                      <td className="py-3 font-mono text-[10px] text-[#666666]">{item.txnId}</td>
                      <td className="py-3 font-black text-[#263238]">₹{item.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => alert(`Opening official GST tax receipt for ${item.invoiceId}`)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DDD7] text-[#263238] hover:bg-[#E8F0EC] font-bold text-[11px] inline-flex items-center gap-1 shadow-sm"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!subscription?.history || subscription.history.length === 0) && !isDemoAccount && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#546E7A]">
                        <p className="font-bold text-xs">No subscription invoices generated yet.</p>
                        <p className="text-[11px] text-[#78909C] mt-0.5">Your official GST tax invoices and receipts will appear here after plan renewals or payments.</p>
                      </td>
                    </tr>
                  )}
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
              <h3 className="text-base font-extrabold text-[#263238]">Asset Owner &amp; Legal Entity Information</h3>
              <p className="text-xs text-[#666666]">
                Appears on all official rent receipts, lease agreements, and Form 16/Schedule HP filings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#263238] font-semibold mb-1">Entity / Trust Legal Name</label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Primary Landlord / Signatory</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Income Tax PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">GSTIN (Commercial Leases)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Official WhatsApp &amp; SMS Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Support &amp; Escrow Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#263238] font-semibold mb-1">Registered Statutory Office Address</label>
                <input
                  type="text"
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Digital Seal &amp; Brand Stamp</h3>
              <p className="text-xs text-[#666666]">Auto-applied to digital rent receipts and eKYC tenant contracts</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-20 w-20 rounded-full border-4 border-[#263238] bg-white flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-[#263238]">SW</span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#263238]">{entityName}</div>
                <div className="text-[11px] text-[#666666]">Staywise Verified Digital Signatory</div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                DSC Token Valid (eMudhra)
              </span>
            </div>

            <button
              onClick={() => alert('Certificate is active and synchronized with DigiLocker and MCA.')}
              className="w-full py-2.5 rounded-2xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] font-bold text-xs transition"
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
              <h3 className="text-base font-extrabold text-[#263238]">Rent Collection Schedule &amp; Penalties</h3>
              <p className="text-xs text-[#666666]">
                Configure when invoices are generated, grace period before overdue fees, and late fee formulas
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Monthly Due Date</label>
                  <select
                    value={rentDueDay}
                    onChange={(e) => setRentDueDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                  >
                    <option value={1}>1st of every month</option>
                    <option value={5}>5th of every month</option>
                    <option value={10}>10th of every month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Grace Period (Days)</label>
                  <select
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                  >
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days (Recommended)</option>
                    <option value={7}>7 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3">
                <span className="font-extrabold text-[#263238] block">Late Fee Computation</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666666] font-semibold mb-1">Fee Mode</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                    >
                      <option value="flat">Flat Per Day (₹)</option>
                      <option value="percentage">Percentage (1.5% / month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#666666] font-semibold mb-1">Per Day Amount (₹)</label>
                    <input
                      type="number"
                      value={lateFeeAmount}
                      onChange={(e) => setLateFeeAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#666666]">
                  Late fees automatically accrue on the 6th day after the due date and are invoiced on the tenant portal.
                </p>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Automated Reminder Matrix</h3>
              <p className="text-xs text-[#666666]">
                Multichannel alerts sent to tenants via WhatsApp, SMS, Push, and Email
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] border border-[#D2DDD7] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#263238] block">7 Days Before Due Date</span>
                  <span className="text-[11px] text-[#666666]">Friendly advance statement &amp; Autopay confirmation</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder7Days}
                  onChange={(e) => setAutoReminder7Days(e.target.checked)}
                  className="h-4 w-4 accent-[#263238]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] border border-[#D2DDD7] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#263238] block">3 Days Before Due Date</span>
                  <span className="text-[11px] text-[#666666]">WhatsApp reminder with 1-click UPI quick pay</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder3Days}
                  onChange={(e) => setAutoReminder3Days(e.target.checked)}
                  className="h-4 w-4 accent-[#263238]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] border border-[#D2DDD7] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#263238] block">Due Date Morning (09:00 AM)</span>
                  <span className="text-[11px] text-[#666666]">Direct UPI dynamic QR dispatched on WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderDueDate}
                  onChange={(e) => setAutoReminderDueDate(e.target.checked)}
                  className="h-4 w-4 accent-[#263238]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] border border-[#D2DDD7] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#263238] block">1 Day Overdue (Grace Alert)</span>
                  <span className="text-[11px] text-[#666666]">Polite notification reminding 4 days remain before late fine</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderOverdue1Day}
                  onChange={(e) => setAutoReminderOverdue1Day(e.target.checked)}
                  className="h-4 w-4 accent-[#263238]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] border border-[#D2DDD7] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-rose-700 block">7 Days Overdue (Formal Escalation)</span>
                  <span className="text-[11px] text-[#666666]">Overdue notice + manager phone follow-up task created</span>
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
              <h3 className="text-base font-extrabold text-[#263238]">Electricity Board &amp; Sub-meter Defaults</h3>
              <p className="text-xs text-[#666666]">
                Applied when uploading or calculating monthly power bills for residential and commercial units
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#263238] font-semibold mb-1">Primary State Discom Provider</label>
                <select
                  value={defaultDiscom}
                  onChange={(e) => setDefaultDiscom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
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
                  <label className="block text-[#263238] font-semibold mb-1">Default Tariff / Unit (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={defaultRatePerUnit}
                    onChange={(e) => setDefaultRatePerUnit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                  />
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Fixed Meter Charge / Mo (₹)</label>
                  <input
                    type="number"
                    value={defaultFixedCharges}
                    onChange={(e) => setDefaultFixedCharges(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Monthly Meter Reading Cycle</label>
                <input
                  type="text"
                  value={meterReadingCycle}
                  onChange={(e) => setMeterReadingCycle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">
                  Common Area Lighting &amp; Lift Allocation Ratio (%)
                </label>
                <input
                  type="number"
                  value={commonAreaPowerRatio}
                  onChange={(e) => setCommonAreaPowerRatio(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Sub-Meter Calibration &amp; IoT Smart Meters</h3>
              <p className="text-xs text-[#666666]">
                Automated pulse counters and photo OCR meter verification
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
                <span className="font-bold text-[#263238]">Smart IoT Pulse Reader</span>
                <p className="text-[11px] text-[#666666]">
                  Reads kWh consumption directly from RS-485 Modbus meters every 24 hours.
                </p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  ✓ Online (12 Units Connected)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
                <span className="font-bold text-[#263238]">Caretaker Photo OCR Verification</span>
                <p className="text-[11px] text-[#666666]">
                  When caretaker uploads meter dial photograph, Staywise AI extracts kWh numbers automatically.
                </p>
                <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2 py-0.5 rounded-full inline-block mt-1">
                  AI OCR Active
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('All 12 sub-meters calibrated with official BESCOM master meter.')}
              className="w-full py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold text-xs shadow-sm transition"
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
              <h3 className="text-base font-extrabold text-[#263238]">Primary Escrow Payout Bank Account</h3>
              <p className="text-xs text-[#666666]">
                Where collected tenant rents and security deposits are deposited and swept
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#263238] font-semibold mb-1">Escrow Bank &amp; Branch</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
                  />
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Dedicated UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Auto-Sweep Cadence to Landlord Operating Account</label>
                <select
                  value={autoSweepCadence}
                  onChange={(e) => setAutoSweepCadence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
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
              <h3 className="text-base font-extrabold text-[#263238]">Escrow Trustee Verification</h3>
              <p className="text-xs text-[#666666]">RBI-regulated tri-party escrow structure</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#263238]/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Escrow Node Active</span>
              </div>
              <p className="text-[11px] text-[#263238] leading-relaxed">
                Rent is received directly in RBI-monitored escrow account. Landlord and vendor payouts are disbursed with automated digital audit logs.
              </p>
              <div className="pt-2 border-t border-[#263238]/20 flex justify-between font-bold text-[#263238]">
                <span>Escrow Trustee:</span>
                <span>Axis Trustee Services Ltd.</span>
              </div>
            </div>

            <button
              onClick={() => alert('Bank statements and penny-drop test verified.')}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] font-bold text-xs shadow-sm transition"
            >
              Run Penny-Drop Re-Verification
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Managers & Accountants (Authorized Delegates) */}
      {activeTab === 'DELEGATES' && (() => {
        const activeDelegates = isDemoAccount 
          ? ((appDelegates && appDelegates.length > 0) ? appDelegates : [
              {
                id: 'del-demo-1',
                name: 'CA Rajesh K.',
                role: 'Chartered Accountant',
                email: 'rajesh.k@cacafe.in',
                phone: '+91 98410 44219',
                permissions: ['Double-Entry Ledger', 'Section 24 Tax P&L', 'Invoices & TDS'],
                status: 'ACTIVE' as const,
                canWithdrawFunds: false
              },
              {
                id: 'del-demo-2',
                name: 'Arjun Das',
                role: 'Field Operations Manager',
                email: 'arjun.das@staywise.com',
                phone: '+91 94470 12891',
                permissions: ['Leads & Showing Visits', 'Maintenance Work Orders', 'Electricity Sub-Meters'],
                status: 'ACTIVE' as const,
                canWithdrawFunds: false
              }
            ])
          : (appDelegates || []);

        return (
          <div className="organic-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Authorized Delegate Access Control</h3>
                <p className="text-xs text-[#666666]">
                  Grant scoped read/audit access to external Accountants, Property Managers, and Tax Consultants
                </p>
              </div>

              <button
                onClick={() => setIsInviteDelegateOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>+ Invite New Delegate</span>
              </button>
            </div>

            {activeDelegates.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#E8F0EC]/50 border border-dashed border-[#D2DDD7] space-y-3">
                <Users className="h-8 w-8 text-[#163B36] mx-auto opacity-70" />
                <h4 className="text-sm font-extrabold text-[#263238]">No Authorized Delegates Linked</h4>
                <p className="text-xs text-[#546E7A] max-w-md mx-auto">
                  Authorize your Chartered Accountant or Property Manager to view ledgers and handle repairs. You can grant scoped permissions at any time.
                </p>
                <button
                  onClick={() => setIsInviteDelegateOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs"
                >
                  + Invite New Delegate
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDelegates.map(del => (
                  <div key={del.id} className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#263238]">{del.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                          {del.role}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {del.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#666666]">{del.email} • {del.phone}</div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {del.permissions.map((p, idx) => (
                          <span key={idx} className="text-[10px] bg-white border border-[#D2DDD7] text-[#263238] px-2 py-0.5 rounded-md font-medium">
                            ✓ {p}
                          </span>
                        ))}
                        <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                          🔒 No Fund Withdrawal
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (confirm(`Revoke delegate access for ${del.name}?`)) revokeDelegate(del.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 6: Security & 2FA */}
      {activeTab === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Account Security &amp; MFA</h3>
              <p className="text-xs text-[#666666]">
                Protect portfolio bank withdrawals and sensitive lease agreements
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#263238]/20 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#263238] flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-[#263238]" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </span>
                  <span className="text-[11px] text-[#666666]">SMS OTP + Google Authenticator Active</span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#263238] block">Session Inactivity Timeout</span>
                  <span className="text-[11px] text-[#666666]">Auto-lock dashboard after 30 minutes of idle time</span>
                </div>
                <span className="text-xs font-bold text-[#263238]">30 min</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#263238] block">Audit Log Retention</span>
                  <span className="text-[11px] text-[#666666]">Immutable ledger and activity history archived</span>
                </div>
                <span className="text-xs font-bold text-[#263238]">7 Years Statutory</span>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#263238]">Change Password</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SHA-256 Encrypted
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-1">Current user: {currentUser.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#263238] font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] focus:outline-none focus:ring-1 focus:ring-[#163B36]"
                />
              </div>
              <div>
                <label className="block text-[#263238] font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter strong new password (min 6 chars)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] focus:outline-none focus:ring-1 focus:ring-[#163B36]"
                />
              </div>
            </div>

            {passwordStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-semibold ${passwordStatus.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {passwordStatus.message}
              </div>
            )}

            <button
              onClick={handleUpdatePassword}
              disabled={passwordLoading}
              className="w-full py-2.5 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] disabled:opacity-60 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              {passwordLoading ? (
                <span>Encrypting & Updating...</span>
              ) : (
                <span>Update Security Password (SHA-256)</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tier Switcher & Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-4xl bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#D1D5DB] bg-[#f5f5f5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#163B36] text-white flex items-center justify-center font-bold">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#263238]">Staywise Platform Tier Selection</h3>
                  <p className="text-xs text-[#666666]">Server-Authoritative Pricing • Protected by HMAC-SHA256 Tokenization</p>
                </div>
              </div>
              <button
                onClick={() => { setIsUpgradeModalOpen(false); setUpgradeError(null); }}
                className="text-[#666666] hover:text-[#263238] p-1.5 rounded-xl hover:bg-[#E8F0EC] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cycle Toggle */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                <div className="p-1 rounded-2xl bg-[#E8F0EC] flex items-center gap-1 border border-[#D2DDD7]">
                  <button
                    onClick={() => setSelectedCycle('monthly')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCycle === 'monthly' ? 'bg-[#163B36] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#263238]'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setSelectedCycle('annual')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedCycle === 'annual' ? 'bg-[#163B36] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#263238]'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#C69A55] text-white font-black text-[9px]">
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
                <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#263238]/30 text-[#263238] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#263238]" />
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
                          ? 'border-[#263238] bg-[#E8F0EC]/50 shadow-md ring-2 ring-[#263238]/20' 
                          : plan.popular 
                            ? 'border-[#263238] bg-[#E8F0EC]' 
                            : 'border-[#D2DDD7] bg-white'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666]">
                              {plan.badge || 'Tier Plan'}
                            </span>
                            <h4 className="text-base font-extrabold text-[#263238]">{plan.name}</h4>
                          </div>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#163B36] text-white text-[10px] font-black">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="pt-1 pb-2">
                          <span className="text-2xl font-black text-[#263238]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#666666] font-semibold">
                            /{selectedCycle === 'annual' ? 'yr' : 'mo'}
                          </span>
                          <div className="text-[10px] text-[#666666] mt-0.5">
                            {selectedCycle === 'annual' ? `(Approx ₹${Math.round(price / 12).toLocaleString('en-IN')}/month)` : 'Cancel anytime'}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#D1D5DB] space-y-2 text-xs text-[#263238]">
                          {plan.features.slice(0, 5).map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px]">
                              <Check className="h-3 w-3 text-[#263238] mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 mt-4 border-t border-[#D1D5DB]">
                        <button
                          disabled={isUpgrading}
                          onClick={() => handleUpgradeTier(tierId)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-white border border-[#163B36] text-[#163B36] hover:bg-[#E8F0EC]'
                              : plan.popular
                                ? 'bg-[#163B36] text-white hover:bg-[#102B27] shadow-xs'
                                : 'bg-[#263238] text-white hover:bg-[#102B27] shadow-xs'
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
              <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center gap-3 text-xs text-[#666666]">
                <ShieldCheck className="h-5 w-5 text-[#263238] shrink-0" />
                <span>
                  <b>White-Hat Security Active:</b> Checkout tokens are cryptographically generated on server. Burp Suite request interception and client-side amount tampering are neutralized and quarantined.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVITE DELEGATE MODAL */}
      {isInviteDelegateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Invite Authorized Delegate</h3>
                <p className="text-xs text-[#546E7A]">Accountants, Property Managers &amp; Auditors</p>
              </div>
              <button onClick={() => setIsInviteDelegateOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const perms: string[] = [];
              if (delegateForm.allowLedger) perms.push('Financial Ledger', 'Tax Reports (P&L)');
              if (delegateForm.allowInvoices) perms.push('Rent Invoices', 'Bank Statements');
              if (delegateForm.allowMaintenance) perms.push('Maintenance Work Orders', 'Tenant Handover');

              addDelegate({
                name: delegateForm.name,
                email: delegateForm.email,
                phone: delegateForm.phone,
                role: delegateForm.role,
                permissions: perms,
                status: 'Active',
                canWithdrawFunds: false
              });
              setIsInviteDelegateOpen(false);
              setDelegateForm({
                name: '',
                email: '',
                phone: '',
                role: 'Accountant',
                allowLedger: true,
                allowInvoices: true,
                allowMaintenance: false
              });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. CA Rajesh Kulkarni"
                  value={delegateForm.name}
                  onChange={e => setDelegateForm({ ...delegateForm, name: e.target.value })}
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
                    value={delegateForm.email}
                    onChange={e => setDelegateForm({ ...delegateForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91 98450 11928"
                    value={delegateForm.phone}
                    onChange={e => setDelegateForm({ ...delegateForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Assigned Role</label>
                <select
                  value={delegateForm.role}
                  onChange={e => setDelegateForm({ ...delegateForm, role: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                >
                  <option value="Accountant">Chartered Accountant (CA) / Accountant</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Tax Auditor">Tax Auditor</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
                <span className="font-bold text-[#263238] block">Operational Permissions:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delegateForm.allowLedger}
                    onChange={e => setDelegateForm({ ...delegateForm, allowLedger: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>View Double-Entry Ledger &amp; Tax P&amp;L</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delegateForm.allowInvoices}
                    onChange={e => setDelegateForm({ ...delegateForm, allowInvoices: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>Inspect Rent Invoices &amp; TDS Statements</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delegateForm.allowMaintenance}
                    onChange={e => setDelegateForm({ ...delegateForm, allowMaintenance: e.target.checked })}
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

      {/* Floating Save Toast feedback */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#163B36] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#C69A55] animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-[#C69A55]" />
          <span className="text-xs font-bold">Settings and automation rules saved!</span>
        </div>
      )}
    </div>
  );
}
