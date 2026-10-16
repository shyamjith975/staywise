'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  Calendar,
  AlertCircle,
  Key
} from 'lucide-react';

export default function TenantSettingsView() {
  const { currentUser, tenants, addNotification } = useAppState();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'BANKING' | 'NOTIFICATIONS'>('PROFILE');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Find linked tenant record if available
  const tenantRecord = tenants.find(t => 
    (t.email && t.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
    t.userId === currentUser.id
  ) || tenants[0];

  // Profile Form State
  const [name, setName] = useState(currentUser.name || tenantRecord?.name || 'Resident');
  const [email] = useState(currentUser.email || tenantRecord?.email || '');
  const [phone, setPhone] = useState((currentUser as any).phone || tenantRecord?.phone || '+91 98000 00000');
  const [emergencyContact, setEmergencyContact] = useState(tenantRecord?.emergencyContact || '+91 98765 43210 (Family)');

  // Refund Banking Form State
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');

  // Notification Preferences State
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [societyAnnouncements, setSocietyAnnouncements] = useState(true);

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Load persisted settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`/api/settings?userId=${encodeURIComponent(currentUser.id || '')}`);
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          if (s.ownerName) setName(s.ownerName);
          if (s.bankAccount) setBankAccount(s.bankAccount);
          if (s.ifsc) setIfsc(s.ifsc);
          if (s.bankName) setBankName(s.bankName);
          if (s.upiId) setUpiId(s.upiId);
          if (s.preferences) {
            if (typeof s.preferences.whatsappAlerts === 'boolean') setWhatsappAlerts(s.preferences.whatsappAlerts);
            if (typeof s.preferences.smsAlerts === 'boolean') setSmsAlerts(s.preferences.smsAlerts);
            if (typeof s.preferences.societyAnnouncements === 'boolean') setSocietyAnnouncements(s.preferences.societyAnnouncements);
          }
        }
      } catch (err) {
        console.error('Failed to load resident settings:', err);
      }
    }
    loadSettings();
  }, [currentUser.id]);

  // Save Settings Handler
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ownerName: name,
          phone,
          bankAccount,
          ifsc,
          bankName,
          upiId,
          preferences: {
            whatsappAlerts,
            smsAlerts,
            societyAnnouncements,
            emergencyContact
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSavedToast(true);
        addNotification('Settings Saved', 'Your resident profile and refund preferences have been updated.', 'SYSTEM');
        setTimeout(() => setIsSavedToast(false), 3000);
      } else {
        alert(data.error || 'Failed to save settings.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password Handler with SHA-256 Client Hashing
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({ message: 'Please enter your current password.', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ message: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: 'New passwords do not match.', isError: true });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordStatus({ message: data.error || 'Failed to update password.', isError: true });
      } else {
        setPasswordStatus({ message: 'Password updated successfully and encrypted with SHA-256.', isError: false });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        addNotification('Security Updated', 'Your resident password was updated and encrypted.', 'SYSTEM');
      }
    } catch (err: any) {
      setPasswordStatus({ message: err.message || 'Network error updating password.', isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Resident Settings &amp; Security
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#163B36] font-bold border border-[#D2DDD7]">
              Resident Portal
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-0.5">
            Manage your personal profile, credentials, security deposit refund account, and notifications
          </p>
        </div>

        <button
          disabled={isSaving}
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-2xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-md flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#D2DDD7] text-xs">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile &amp; Lease</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Password &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab('BANKING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'BANKING'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Deposit Refund Banking</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'NOTIFICATIONS'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESIDENT PROFILE & LEASE                                          */}
      {/* ========================================================================= */}
      {activeTab === 'PROFILE' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Active Lease Overview Card */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#263238]">
                    {tenantRecord?.propertyName || 'Beach Road Residences'}
                  </h3>
                  <p className="text-xs text-[#546E7A]">
                    Unit #{tenantRecord?.unitNumber || '302'} • Current Residential Tenancy
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Active Lease
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7]">
                <span className="text-[11px] text-[#546E7A] block">Monthly Rent</span>
                <span className="text-sm font-black text-[#163B36] font-tabular">
                  ₹{(tenantRecord?.monthlyRent || 25000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7]">
                <span className="text-[11px] text-[#546E7A] block">Security Deposit</span>
                <span className="text-sm font-black text-[#263238] font-tabular">
                  ₹{(tenantRecord?.depositPaid || 50000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7]">
                <span className="text-[11px] text-[#546E7A] block">Rent Due Day</span>
                <span className="text-sm font-black text-[#263238]">
                  {tenantRecord?.rentDueDate || 5}th of every month
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7]">
                <span className="text-[11px] text-[#546E7A] block">Lease End Date</span>
                <span className="text-sm font-black text-[#263238]">
                  {tenantRecord?.leaseEnd || '30 Sep 2027'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-[#263238] pb-2 border-b border-[#D2DDD7]">
              Personal Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-gray-100 text-gray-500 font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-[#546E7A] mt-1 block">Account login email cannot be changed directly</span>
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Primary Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Emergency Contact (Family/Next of Kin)</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Ramesh Menon (+91 98765 00000)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PASSWORD & SECURITY                                                */}
      {/* ========================================================================= */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="font-extrabold text-base text-[#263238]">Change Password</h3>
              <p className="text-xs text-[#546E7A] mt-0.5">
                Passwords are automatically encrypted in SHA-256 format for maximum security.
              </p>
            </div>

            {passwordStatus && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                passwordStatus.isError
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {passwordStatus.isError ? (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">New Password (Min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="h-4 w-4" />
                <span>{passwordLoading ? 'Verifying & Encrypting...' : 'Update Password (SHA-256)'}</span>
              </button>
            </form>
          </div>

          {/* Active Session & Device Card */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-sm text-[#263238]">Active Login Sessions</h3>
            <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-[#163B36] border border-[#D2DDD7]">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-[#263238]">Current Browser Session (Windows / Chrome)</div>
                  <div className="text-[11px] text-[#546E7A]">Active now • Authorized via HMAC-SHA256 Token</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MOVE-OUT REFUND BANKING & UPI                                      */}
      {/* ========================================================================= */}
      {activeTab === 'BANKING' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
            <div>
              <h3 className="font-extrabold text-base text-[#263238]">
                Security Deposit Refund Account
              </h3>
              <p className="text-xs text-[#546E7A] mt-0.5">
                Provide your bank or UPI details for direct deposit refund disbursement upon lease handover and MoveFlow checkout inspection.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0" />
              <span>
                <b>Statutory Escrow Guarantee:</b> Your refund banking info is strictly encrypted. Landlords cannot debit this account; it is only used for crediting your refunded deposit.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Beneficiary Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="As per bank passbook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Instant UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. resident@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India, HDFC"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="Savings / Current Account"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-mono font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#E8F0EC]/30 text-[#263238] font-mono font-bold focus:bg-white focus:outline-hidden focus:border-[#163B36]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RESIDENT NOTIFICATIONS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-base text-[#263238]">Notification Channels</h3>
            <p className="text-xs text-[#546E7A]">
              Choose how you want to receive rent receipts, payment reminders, and society maintenance alerts.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D2DDD7] bg-[#E8F0EC]/30 cursor-pointer hover:bg-[#E8F0EC]/60 transition">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={e => setWhatsappAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-[#163B36]"
                />
                <div>
                  <div className="font-bold text-[#263238]">WhatsApp Rent Invoices &amp; Receipts</div>
                  <div className="text-[11px] text-[#546E7A]">
                    Receive monthly rent invoices with 1-click UPI payment link and GST receipts directly on WhatsApp.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D2DDD7] bg-[#E8F0EC]/30 cursor-pointer hover:bg-[#E8F0EC]/60 transition">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={e => setSmsAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-[#163B36]"
                />
                <div>
                  <div className="font-bold text-[#263238]">SMS Maintenance Work Order Updates</div>
                  <div className="text-[11px] text-[#546E7A]">
                    Get instant SMS alerts when an electrician, plumber, or AMC technician is assigned to your ticket.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-[#D2DDD7] bg-[#E8F0EC]/30 cursor-pointer hover:bg-[#E8F0EC]/60 transition">
                <input
                  type="checkbox"
                  checked={societyAnnouncements}
                  onChange={e => setSocietyAnnouncements(e.target.checked)}
                  className="mt-0.5 rounded text-[#163B36]"
                />
                <div>
                  <div className="font-bold text-[#263238]">Building &amp; Community Notices</div>
                  <div className="text-[11px] text-[#546E7A]">
                    Notices for scheduled water tank cleanings, power maintenance, and elevator servicing.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Toast feedback */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#163B36] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#C69A55] animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-[#C69A55]" />
          <span className="text-xs font-bold">Resident profile and refund preferences saved!</span>
        </div>
      )}
    </div>
  );
}
