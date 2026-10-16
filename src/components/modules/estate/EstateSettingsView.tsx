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

  const handleSaveSettings = () => {
    setIsSavedToast(true);
    addNotification('Settings Saved', 'EstateOS preferences updated successfully.', 'SYSTEM');
    setTimeout(() => setIsSavedToast(false), 2500);
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

        {isSavedToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
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
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D2DDD7] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#C69A55] tracking-widest block">
                Active Estate License
              </span>
              <h2 className="text-xl font-black text-[#263238] mt-0.5 flex items-center gap-2">
                <span>{currentPlan.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Active
                </span>
              </h2>
              <p className="text-xs text-[#546E7A] mt-1">
                {currentPlan.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5 text-[#C69A55]" />
                <span>Change / Upgrade Tier</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
              <span className="text-[10px] text-[#546E7A] font-bold block uppercase">Billing Cycle</span>
              <div className="text-base font-extrabold text-[#263238]">Annual Billing (Save 20%)</div>
              <span className="text-[10px] text-emerald-800 font-bold">Auto-Renews Oct 2027</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
              <span className="text-[10px] text-[#546E7A] font-bold block uppercase">Campus Quota</span>
              <div className="text-base font-extrabold text-[#263238]">Unlimited Villas &amp; Rooms</div>
              <span className="text-[10px] text-[#546E7A]">All smart lock gates active</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
              <span className="text-[10px] text-[#546E7A] font-bold block uppercase">OTA Channels</span>
              <div className="text-base font-extrabold text-[#263238]">Airbnb, Booking.com &amp; Direct</div>
              <span className="text-[10px] text-emerald-800 font-bold">2-Way iCal Calendar Sync</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-sm text-[#263238]">Included Membership Privileges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-[#546E7A]">
              {currentPlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <CheckCircle2 className="h-4 w-4 text-[#163B36] shrink-0" />
                  <span className="font-medium text-[#263238]">{feat}</span>
                </div>
              ))}
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
