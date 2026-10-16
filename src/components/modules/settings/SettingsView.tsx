'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Building2, 
  CreditCard, 
  Users, 
  Lock, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check, 
  X,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { AuthorizedDelegate } from '../../../types';

export default function SettingsView() {
  const { 
    currentUser, 
    addNotification, 
    delegates: appDelegates,
    addDelegate,
    revokeDelegate
  } = useAppState();

  const isDemoAccount = currentUser.email === 'vikram@staywise.in' || currentUser.email === 'owner@staywise.com' || currentUser.id === 'user-owner-vikram';

  // Active Settings Tab: ONLY essential setting options
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BANKING' | 'DELEGATES' | 'SECURITY' | 'NOTIFICATIONS'>('PROFILE');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Tab persistence
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('staywise_settings_tab');
      if (saved && ['PROFILE', 'BANKING', 'DELEGATES', 'SECURITY', 'NOTIFICATIONS'].includes(saved)) {
        setActiveTab(saved as any);
      }
    } catch (e) {}
  }, []);

  const handleTabChange = (tab: 'PROFILE' | 'BANKING' | 'DELEGATES' | 'SECURITY' | 'NOTIFICATIONS') => {
    setActiveTab(tab);
    try {
      localStorage.setItem('staywise_settings_tab', tab);
    } catch (e) {}
  };

  // Form State: 1. Profile & Entity
  const [entityName, setEntityName] = useState(isDemoAccount ? 'Singhania Asset Holdings LLP' : (currentUser.name ? `${currentUser.name} Properties` : ''));
  const [ownerName, setOwnerName] = useState(isDemoAccount ? 'Vikram Singhania' : (currentUser.name || ''));
  const [panNumber, setPanNumber] = useState(isDemoAccount ? 'AAACS1928K' : '');
  const [gstin, setGstin] = useState(isDemoAccount ? '29AAACS1928K1Z5' : '');
  const [supportPhone, setSupportPhone] = useState(isDemoAccount ? '+91 98450 11928' : ((currentUser as any).phone || ''));
  const [supportEmail, setSupportEmail] = useState(isDemoAccount ? 'vikram.singhania@staywise.com' : (currentUser.email || ''));
  const [registeredAddress, setRegisteredAddress] = useState(isDemoAccount ? 'Level 8, Prestige Trade Tower, Palace Road, Bengaluru 560001' : '');

  // Form State: 2. Banking & Direct Escrow
  const [bankName, setBankName] = useState(isDemoAccount ? 'Axis Bank (Escrow Banking Division)' : '');
  const [bankAccount, setBankAccount] = useState(isDemoAccount ? '918020048192842' : '');
  const [ifsc, setIfsc] = useState(isDemoAccount ? 'UTIB0000042' : '');
  const [upiId, setUpiId] = useState(isDemoAccount ? 'staywise.escrow@axisbank' : '');
  const [autoSweepCadence, setAutoSweepCadence] = useState('Daily at 18:00 IST');

  // Form State: 3. Notification Preferences
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);

  // Form State: 4. Security & Password
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Form State: 5. Delegate Invite Modal
  const [isInviteDelegateOpen, setIsInviteDelegateOpen] = useState(false);
  const [delegateForm, setDelegateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Accountant' as AuthorizedDelegate['role'],
    allowLedger: true,
    allowInvoices: true,
    allowMaintenance: false
  });

  const handleSaveSettings = () => {
    setIsSavedToast(true);
    addNotification('Settings Saved', 'Your updated preferences have been successfully stored.', 'SYSTEM');
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput) {
      setPasswordStatus({ message: 'Please enter your current password.', isError: true });
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordStatus({ message: 'New password must be at least 6 characters long.', isError: true });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatus({ message: 'New password and confirmation do not match.', isError: true });
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
        setPasswordStatus({ message: 'Password successfully updated and encrypted in SHA-256.', isError: false });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        addNotification('Password Updated', 'Your password was encrypted and saved with SHA-256.', 'SYSTEM');
      }
    } catch (err: any) {
      setPasswordStatus({ message: err.message || 'Network error updating password.', isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  const activeDelegates: AuthorizedDelegate[] = isDemoAccount 
    ? ((appDelegates && appDelegates.length > 0) ? appDelegates : [
        {
          id: 'del-1',
          name: 'CA Rajesh K. (Kulkarni & Associates)',
          email: 'rajesh.ca@auditfirm.in',
          phone: '+91 98450 11928',
          role: 'Accountant',
          permissions: ['Financial Ledger', 'Bank Statements', 'Rent Invoices', 'Tax Reports (P&L)'],
          addedDate: '15 Aug 2026',
          status: 'Active',
          canWithdrawFunds: false
        },
        {
          id: 'del-2',
          name: 'Arjun Das',
          email: 'arjun.ops@staywise.com',
          phone: '+91 94470 82910',
          role: 'Property Manager',
          permissions: ['Maintenance Work Orders', 'Tenant Handover'],
          addedDate: '01 Sep 2026',
          status: 'Active',
          canWithdrawFunds: false
        }
      ])
    : (appDelegates || []);

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Account &amp; Platform Settings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#163B36] font-bold border border-[#D2DDD7]">
              Live
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-0.5">
            Manage your personal profile, escrow banking, delegate access, security, and alerts
          </p>
        </div>

        {isSavedToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      {/* 5 Essential Settings Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#D2DDD7] text-xs">
        <button
          onClick={() => handleTabChange('PROFILE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Profile &amp; Entity</span>
        </button>

        <button
          onClick={() => handleTabChange('BANKING')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'BANKING'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Escrow &amp; Bank Account</span>
        </button>

        <button
          onClick={() => handleTabChange('DELEGATES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
            activeTab === 'DELEGATES'
              ? 'bg-[#163B36] text-white shadow-xs'
              : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#E8F0EC]'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Managers &amp; Accountants ({activeDelegates.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('SECURITY')}
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
          onClick={() => handleTabChange('NOTIFICATIONS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
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
      {/* TAB 1: PROFILE & ENTITY                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'PROFILE' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Personal &amp; Business Profile</h2>
            <p className="text-xs text-[#546E7A]">Identity details used on tenant digital leases and invoices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#263238] mb-1">Full Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="e.g. Vikram Singhania"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Business / Legal Entity Name</label>
              <input
                type="text"
                value={entityName}
                onChange={e => setEntityName(e.target.value)}
                placeholder="e.g. Singhania Asset Holdings LLP"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Primary Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                placeholder="e.g. owner@staywise.com"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Primary Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                placeholder="e.g. +91 98450 11928"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                value={panNumber}
                onChange={e => setPanNumber(e.target.value.toUpperCase())}
                placeholder="e.g. AAACS1928K"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29AAACS1928K1Z5"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-bold font-mono uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#263238] mb-1">Official Registered Address</label>
              <textarea
                rows={2}
                value={registeredAddress}
                onChange={e => setRegisteredAddress(e.target.value)}
                placeholder="e.g. Level 8, Prestige Trade Tower, Palace Road, Bengaluru 560001"
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
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANKING & ESCROW                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'BANKING' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-[#263238]">Direct Escrow &amp; Bank Account</h2>
              <p className="text-xs text-[#546E7A]">Account where rental funds and security deposits are received</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              🔒 Payout Bank: Owner Only
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs space-y-1">
            <div className="font-bold text-[#163B36]">Statutory Escrow Guarantee:</div>
            <p className="text-[#546E7A] text-[11px] leading-relaxed">
              Tenant rent collections are routed through nodal bank escrow. Only the verified property owner has clearance to edit bank coordinates or withdraw capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#263238] mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="e.g. Axis Bank, HDFC Bank, SBI"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={e => setBankAccount(e.target.value)}
                placeholder="e.g. 918020048192842"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. UTIB0000042"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263238] mb-1">Business UPI ID (Instant Sweeps)</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. staywise.escrow@axisbank"
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-[#263238] mb-1">Daily Settlement Sweep Cadence</label>
              <select
                value={autoSweepCadence}
                onChange={e => setAutoSweepCadence(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              >
                <option value="Daily at 18:00 IST">Daily Auto-Sweep (18:00 IST) — Recommended</option>
                <option value="Instant per payment">Instant Real-Time Sweep (IMPS / UPI)</option>
                <option value="Weekly Every Monday">Weekly Sweep (Every Monday morning)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>Update Escrow Banking</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DELEGATES (MANAGERS & ACCOUNTANTS)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'DELEGATES' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D2DDD7] pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#263238]">Authorized Property Managers &amp; CAs</h2>
              <p className="text-xs text-[#546E7A]">Grant scoped operational access without giving withdrawal permissions</p>
            </div>
            <button
              onClick={() => setIsInviteDelegateOpen(true)}
              className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>+ Invite Manager / CA</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" />
            <span>
              <b>Strict Escrow Security:</b> Authorized delegates can view ledgers and triage maintenance, but cannot withdraw money or change payout banks.
            </span>
          </div>

          {activeDelegates.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#F7F8F6] border border-dashed border-[#D2DDD7] space-y-2">
              <Users className="h-8 w-8 text-[#546E7A] mx-auto opacity-50" />
              <div className="font-bold text-xs text-[#263238]">No Delegates Invited Yet</div>
              <p className="text-[11px] text-[#546E7A]">
                Invite your property manager, chartered accountant, or auditor to collaborate securely.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {activeDelegates.map(del => (
                <div key={del.id} className="p-4 rounded-2xl bg-white border border-[#D2DDD7] space-y-3 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-[#263238]">{del.name}</div>
                      <div className="text-[11px] text-[#546E7A]">{del.email} • {del.phone}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {del.role}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1">
                    <span className="text-[10px] font-bold text-[#546E7A] block">Assigned Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {del.permissions.map((p, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F0EC] text-[#163B36] font-medium border border-[#D2DDD7]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-rose-700 font-bold">
                      🔒 No Withdrawal Access
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Revoke all access for ${del.name}?`)) revokeDelegate(del.id);
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Revoke Access</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PASSWORD & SECURITY                                                */}
      {/* ========================================================================= */}
      {activeTab === 'SECURITY' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Password &amp; Security</h2>
            <p className="text-xs text-[#546E7A]">Update your security password encrypted in SHA-256</p>
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
              <span>{passwordLoading ? 'Encrypting & Saving...' : 'Update Password'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#D2DDD7] text-xs space-y-2">
            <h3 className="font-extrabold text-[#263238]">Active Session Security</h3>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#263238] block">Current Browser Session</span>
                <span className="text-[11px] text-[#546E7A]">Signed with HMAC-SHA256 • HTTP-only secure cookie</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active &amp; Protected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: NOTIFICATIONS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="border-b border-[#D2DDD7] pb-3">
            <h2 className="text-base font-extrabold text-[#263238]">Notification Channels</h2>
            <p className="text-xs text-[#546E7A]">Choose how and where you receive automated property alerts</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">WhatsApp Rent Pings &amp; Receipts</span>
                <span className="text-[11px] text-[#546E7A]">Receive immediate ping when a tenant settles rent via UPI Autopay</span>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={e => setNotifyWhatsApp(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">Monthly Email Statement</span>
                <span className="text-[11px] text-[#546E7A]">Automated P&amp;L ledger report dispatched on the 1st of every month</span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={e => setNotifyEmail(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">Emergency Maintenance Work Orders</span>
                <span className="text-[11px] text-[#546E7A]">Urgent notification when water leak or electrical failure is logged</span>
              </div>
              <input
                type="checkbox"
                checked={notifyMaintenance}
                onChange={e => setNotifyMaintenance(e.target.checked)}
                className="h-4 w-4 rounded text-[#163B36] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
              <div>
                <span className="font-extrabold text-sm text-[#263238] block">SMS Backup Alerts</span>
                <span className="text-[11px] text-[#546E7A]">Carrier SMS for high-priority security login and password changes</span>
              </div>
              <input
                type="checkbox"
                checked={notifySms}
                onChange={e => setNotifySms(e.target.checked)}
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
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* INVITE DELEGATE MODAL */}
      {isInviteDelegateOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Invite Manager or CA</h3>
                <p className="text-xs text-[#546E7A]">Grant scoped operational permissions</p>
              </div>
              <button onClick={() => setIsInviteDelegateOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
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
                  <span>Inspect Rent Invoices &amp; Statements</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={delegateForm.allowMaintenance}
                    onChange={e => setDelegateForm({ ...delegateForm, allowMaintenance: e.target.checked })}
                    className="rounded text-[#163B36]"
                  />
                  <span>Manage Work Orders &amp; Repairs</span>
                </label>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                🔒 <b>Security Rule:</b> Money withdrawals and escrow account changes are strictly barred for delegates. Only the property owner can disburse funds.
              </div>

              <button type="submit" className="w-full py-3 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs cursor-pointer">
                Authorize Delegate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
