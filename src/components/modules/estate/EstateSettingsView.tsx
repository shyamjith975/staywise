'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Building2, 
  CreditCard, 
  Lock, 
  Bell, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  Trees, 
  Calendar, 
  Clock,
  Zap,
  RefreshCw,
  DollarSign,
  ArrowUpRight, 
  Key,
  X
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../../lib/security/subscriptionCatalog';

export default function EstateSettingsView() {
  const { 
    currentUser, 
    addNotification, 
    subscription, 
    upgradeSubscription, 
    refreshSubscription 
  } = useAppState();

  const isDemoEstate = currentUser?.email === 'estate@staywise.com' || currentUser?.id === 'user-estate-manoj';

  // 5 Focused Settings Tabs for EstateOS
  const [activeTab, setActiveTab] = useState<'MEMBERSHIP' | 'SECURITY' | 'PROFILE' | 'BANKING' | 'NOTIFICATIONS'>('MEMBERSHIP');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State: Profile & Campus
  const [hostName, setHostName] = useState(currentUser.name || 'Manoj Varma');
  const [campusName, setCampusName] = useState(isDemoEstate ? 'Vythiri Tea Valley Estates' : (currentUser.name ? `${currentUser.name}'s Estate Collection` : 'My Luxury Campus'));
  const [email, setEmail] = useState(currentUser.email || 'estate@staywise.com');
  const [phone, setPhone] = useState(isDemoEstate ? '+91 94470 12891' : ((currentUser as any).phone || '+91 98450 11928'));
  const [address, setAddress] = useState(isDemoEstate ? 'Vythiri Tea Valley, Wayanad, Kerala 673576' : 'Bangalore, Karnataka');

  // Form State: Payout Bank Account
  const [bankName, setBankName] = useState(isDemoEstate ? 'HDFC Bank (Hospitality Payouts)' : 'HDFC Bank');
  const [accountNumber, setAccountNumber] = useState(isDemoEstate ? '50200081920194' : '');
  const [ifsc, setIfsc] = useState(isDemoEstate ? 'HDFC0000120' : '');
  const [upiId, setUpiId] = useState(isDemoEstate ? 'staywise.estates@hdfcbank' : '');

  // Form State: Security & Password
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Form State: Notifications
  const [notifyWhatsAppKeys, setNotifyWhatsAppKeys] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyHousekeeping, setNotifyHousekeeping] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(true);

  // Membership Upgrade Modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<'annual' | 'monthly'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  // Load persisted settings on mount from SQLite database
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?userId=${encodeURIComponent(currentUser.id || '')}`);
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.ownerName) setHostName(s.ownerName);
          if (s.entityName) setCampusName(s.entityName);
          if (s.bankAccount) setAccountNumber(s.bankAccount);
          if (s.ifsc) setIfsc(s.ifsc);
          if (s.bankName) setBankName(s.bankName);
          if (s.upiId) setUpiId(s.upiId);
        }
      } catch (err) {
        console.error('Failed to load estate settings:', err);
      }
    }
    loadSettings();
  }, [currentUser.id]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ownerName: hostName,
          entityName: campusName,
          phone,
          bankAccount: accountNumber,
          ifsc,
          bankName,
          upiId,
          preferences: {
            notifyWhatsAppKeys,
            notifyBookings,
            notifyHousekeeping,
            notifyPayouts,
            address
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSavedToast(true);
        addNotification('Settings Saved', 'EstateOS preferences saved to database successfully.', 'SYSTEM');
        setTimeout(() => setIsSavedToast(false), 2500);
      } else {
        alert(data.error || 'Failed to save settings.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput) {
      setPasswordStatus({ message: 'Please enter your current password.', isError: true });
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordStatus({ message: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatus({ message: 'New passwords do not match.', isError: true });
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
        setPasswordStatus({ message: 'Password updated and encrypted in SHA-256.', isError: false });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        addNotification('Password Updated', 'Your security password was encrypted with SHA-256.', 'SYSTEM');
      }
    } catch (err: any) {
      setPasswordStatus({ message: err.message || 'Network error updating password.', isError: true });
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
        setUpgradeError(res.error || 'Failed to update membership');
      } else {
        setIsUpgradeModalOpen(false);
        addNotification('Membership Upgraded', `Your EstateOS tier was updated to ${SUBSCRIPTION_PLANS[planId].name}.`, 'SYSTEM');
      }
    } catch (err: any) {
      setIsUpgrading(false);
      setUpgradeError(err.message || 'Membership update failed');
    }
  };

  const currentPlan = subscription?.planId ? SUBSCRIPTION_PLANS[subscription.planId] : SUBSCRIPTION_PLANS.growth_pro;

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238] flex items-center gap-2">
              <Trees className="h-6 w-6 text-[#163B36]" />
              <span>EstateOS Settings &amp; Membership</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#163B36] font-bold border border-[#D2DDD7]">
              Host Portal
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-0.5">
            Manage your membership tier, security credentials, direct payout banking, and guest alerts
          </p>
        </div>

        <button
          disabled={isSavingSettings}
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-2xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-md shadow-red-900/20 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>{isSavingSettings ? 'Saving...' : 'Save Configurations'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#D2DDD7] text-xs">
        <button
          onClick={() => setActiveTab('MEMBERSHIP')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'MEMBERSHIP'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Crown className="h-4 w-4 text-[#C69A55]" />
          <span>Membership &amp; Plan</span>
          <span className="px-2 py-0.5 rounded-full bg-[#D32F2F] text-white text-[10px] font-black">
            Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Password &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Host &amp; Campus Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('BANKING')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'BANKING'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payout Banking</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'NOTIFICATIONS'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Guest Alerts</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MEMBERSHIP & SUBSCRIPTION                                          */}
      {/* ========================================================================= */}
      {activeTab === 'MEMBERSHIP' && (
        <div className="space-y-6 animate-in fade-in duration-150">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PASSWORD & SECURITY                                                */}
      {/* ========================================================================= */}
      {activeTab === 'SECURITY' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Password &amp; Security Credentials</h2>
            <p className="text-xs text-[#546E7A]">Update host security password protected by SHA-256 cryptographic hashing</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="max-w-md space-y-3.5 text-xs">
            {passwordStatus && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                passwordStatus.isError 
                  ? 'bg-rose-50 text-rose-800 border-rose-300' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                {passwordStatus.isError ? <ShieldAlert className="h-4 w-4 shrink-0" /> : <ShieldCheck className="h-4 w-4 shrink-0" />}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#263238] mb-1">Current Password</label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={e => setCurrentPasswordInput(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">New Password (min 6 characters)</label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={e => setNewPasswordInput(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={e => setConfirmPasswordInput(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>{passwordLoading ? 'Encrypting & Updating...' : 'Update Password'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#D2DDD7] text-xs space-y-2">
            <h3 className="font-extrabold text-[#263238]">Active Host Session</h3>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#263238] block">Current Authenticated Host Terminal</span>
                <span className="text-[11px] text-[#546E7A]">Signed with HMAC-SHA256 • Secure HTTP-only cookie active</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Encrypted &amp; Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOST & CAMPUS PROFILE                                              */}
      {/* ========================================================================= */}
      {activeTab === 'PROFILE' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Host &amp; Campus Profile</h2>
            <p className="text-xs text-[#546E7A]">Details shared with guests on WhatsApp smart lock check-in passes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#263238] mb-1">Host / Estate Director Name</label>
              <input
                type="text"
                value={hostName}
                onChange={e => setHostName(e.target.value)}
                placeholder="e.g. Manoj Varma"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Estate Collection / Campus Name</label>
              <input
                type="text"
                value={campusName}
                onChange={e => setCampusName(e.target.value)}
                placeholder="e.g. Vythiri Tea Valley Estates"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Official Host Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. reservations@staywise.com"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Host WhatsApp Concierge Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +91 94470 12891"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#263238] mb-1">Campus Physical Address &amp; GPS Directions</label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. Vythiri Tea Valley, Wayanad, Kerala 673576"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>Save Host Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PAYOUT BANKING                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'BANKING' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Hospitality Payout Banking</h2>
            <p className="text-xs text-[#546E7A]">Bank account for receiving Airbnb, Booking.com, and direct guest advances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#263238] mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank, ICICI Bank"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="e.g. 50200081920194"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0000120"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Business UPI ID (Direct Booking Advances)</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. staywise.estates@hdfcbank"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>Update Payout Account</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GUEST ALERTS & NOTIFICATIONS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Guest &amp; Operation Alerts</h2>
            <p className="text-xs text-[#546E7A]">Automated messaging for guest arrivals and housekeeping turnovers</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">WhatsApp Smart Lock Key Delivery</span>
                <span className="text-[11px] text-[#546E7A]">Automatically send welcome guide and door PIN to guest phone on booking confirmation</span>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsAppKeys}
                onChange={e => setNotifyWhatsAppKeys(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">Instant Booking Alerts</span>
                <span className="text-[11px] text-[#546E7A]">Immediate notification when an Airbnb or direct reservation is confirmed</span>
              </div>
              <input
                type="checkbox"
                checked={notifyBookings}
                onChange={e => setNotifyBookings(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">Housekeeping Sanitization Ready</span>
                <span className="text-[11px] text-[#546E7A]">Ping host when villa turnover is completed and inspected</span>
              </div>
              <input
                type="checkbox"
                checked={notifyHousekeeping}
                onChange={e => setNotifyHousekeeping(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">Settlement Payout Confirmations</span>
                <span className="text-[11px] text-[#546E7A]">Bank credit confirmation for guest payout settlements</span>
              </div>
              <input
                type="checkbox"
                checked={notifyPayouts}
                onChange={e => setNotifyPayouts(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>Save Alert Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">EstateOS Membership Tiers</h3>
                <p className="text-xs text-[#546E7A]">Choose the right capacity tier for your luxury campuses</p>
              </div>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center p-1 bg-[#E8F0EC] rounded-full max-w-xs mx-auto text-xs font-bold">
              <button
                onClick={() => setSelectedCycle('monthly')}
                className={`flex-1 py-1.5 rounded-full transition ${selectedCycle === 'monthly' ? 'bg-[#163B36] text-white' : 'text-[#546E7A]'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedCycle('annual')}
                className={`flex-1 py-1.5 rounded-full transition flex items-center justify-center gap-1 ${selectedCycle === 'annual' ? 'bg-[#163B36] text-white' : 'text-[#546E7A]'}`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">Save 20%</span>
              </button>
            </div>

            {upgradeError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {upgradeError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              {(['starter', 'growth_pro', 'enterprise'] as const).map(tierId => {
                const plan = SUBSCRIPTION_PLANS[tierId];
                const isCurrent = subscription?.planId === tierId;
                const price = selectedCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div key={tierId} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                    isCurrent ? 'bg-[#E8F0EC]/60 border-[#163B36] ring-2 ring-[#163B36]' : 'bg-white border-[#D2DDD7]'
                  }`}>
                    <div>
                      <div className="font-extrabold text-[#263238] text-sm">{plan.name}</div>
                      <div className="text-lg font-black text-[#163B36] mt-1 font-tabular">
                        ₹{price.toLocaleString('en-IN')}
                        <span className="text-[10px] text-[#546E7A] font-normal"> /mo</span>
                      </div>
                      <p className="text-[11px] text-[#546E7A] mt-1">{plan.tagline}</p>
                    </div>

                    <button
                      disabled={isCurrent || isUpgrading}
                      onClick={() => handleUpgradeTier(tierId)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                        isCurrent 
                          ? 'bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7] cursor-default' 
                          : 'bg-[#163B36] hover:bg-[#102B27] text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : isUpgrading ? 'Upgrading...' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
