'use client';

/**
 * ============================================================================
 * STAYWISE PLATFORM — DEDICATED SUPER ADMIN GOVERNANCE PORTAL (/admin)
 * ============================================================================
 * This page is hosted on its own dedicated URL route (/admin) and provides the
 * full institutional governance center with complete code, layout, data, and sections:
 * 
 * 1. Left FloatingNavRail with Super Admin active indicator and navigation
 * 2. TopHeader with "Hello, Chief!", Explore activity, Search, Notifications,
 *    and "Super Admin" role badge
 * 3. Core Super Admin & Governance Center:
 *    - 5 Ecosystem KPI metrics (Total Clients, Portfolios, Assets, Gross Payments, Disputes)
 *    - Properties & Approvals: Document audit modal, Approve & Verify Property, Delete
 *    - Platform Data Surveillance: Full read-only surveillance of Tenants, Properties, Invoices, Disputes
 *    - Influencer Offers & Referral Codes: Campaign management, Create Promo Code modal, Link copy
 *    - Ledger & Controls: Double-entry accounting surveillance and compliance toggles
 * 4. LiveActivityTicker with real-time rent collection toasts
 * 5. Global search and action modals
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { AppStateProvider, useAppState } from '../../context/AppStateContext';
import TopHeader from '../../components/layout/TopHeader';
import FloatingNavRail from '../../components/layout/FloatingNavRail';
import MobileNav from '../../components/layout/MobileNav';
import GlobalSearchModal from '../../components/layout/GlobalSearchModal';
import LiveActivityTicker from '../../components/layout/LiveActivityTicker';

// Dashboards & Modules
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import PropertyList from '../../components/modules/properties/PropertyList';
import AddPropertyModal from '../../components/modules/properties/AddPropertyModal';
import EditPropertyModal from '../../components/modules/properties/EditPropertyModal';
import ExistingTenantWizardModal from '../../components/modules/onboarding/ExistingTenantWizardModal';
import RentFlowOverview from '../../components/modules/rentflow/RentFlowOverview';
import PayRentModal from '../../components/modules/rentflow/PayRentModal';
import RentReceiptModal from '../../components/modules/rentflow/RentReceiptModal';
import VacancyEngine from '../../components/modules/vacancy/VacancyEngine';
import MaintenanceList from '../../components/modules/maintenance/MaintenanceList';
import CreateTicketModal from '../../components/modules/maintenance/CreateTicketModal';
import LeadsCRM from '../../components/modules/leasing/LeadsCRM';
import StaywiseAIPanel from '../../components/modules/ai/StaywiseAIPanel';
import MarketplaceNRI from '../../components/modules/services/MarketplaceNRI';
import TenantsDirectory from '../../components/modules/tenants/TenantsDirectory';
import FinancialAnalyticsView from '../../components/modules/analytics/FinancialAnalyticsView';
import SettingsView from '../../components/modules/settings/SettingsView';
import UploadElectricityBillModal from '../../components/modules/rentflow/UploadElectricityBillModal';
import PGBedManagementView from '../../components/modules/pg/PGBedManagementView';
import CommercialCAMView from '../../components/modules/commercial/CommercialCAMView';
import MoveFlowRetentionView from '../../components/modules/moveflow/MoveFlowRetentionView';
import FindHomeView from '../../components/modules/discovery/FindHomeView';

function AdminShell() {
  const { 
    activeRole, 
    isAuthenticated,
    currentUser,
    login, 
    activeView, 
    isUploadBillModalOpen, 
    setIsUploadBillModalOpen, 
    preselectedUnitForUpload 
  } = useAppState();

  const [adminEmail, setAdminEmail] = React.useState('admin@staywise.com');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [adminLoading, setAdminLoading] = React.useState(false);
  const [adminError, setAdminError] = React.useState<string | null>(null);

  // Secure Password Reset Mode
  const [isResetMode, setIsResetMode] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('admin@staywise.com');
  const [resetSecurityKey, setResetSecurityKey] = React.useState('');
  const [resetNewPassword, setResetNewPassword] = React.useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = React.useState('');
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = React.useState<string | null>(null);
  const [isPortalResetModalOpen, setIsPortalResetModalOpen] = React.useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAdminError(data.error || 'Invalid administrator credentials.');
        setAdminLoading(false);
        return;
      }
      if (data.user.role !== 'admin') {
        setAdminError('Access Denied: This account does not possess Super Admin privileges.');
        setAdminLoading(false);
        return;
      }
      login('admin', data.user);
    } catch (err: any) {
      setAdminError(err.message || 'Connection failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    setResetSuccess(null);

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('New passwords do not match. Please verify and re-enter.');
      setResetLoading(false);
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      setResetLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          securityRecoveryKey: resetSecurityKey,
          newPassword: resetNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.error || 'Security verification failed. Invalid recovery key or email.');
        setResetLoading(false);
        return;
      }

      setResetSuccess('Super Admin Master Password successfully reset & encrypted with SHA-256! You can now authenticate.');
      setAdminPassword(resetNewPassword);
      setAdminEmail(resetEmail);
      setResetSecurityKey('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setTimeout(() => {
        setIsResetMode(false);
        setIsPortalResetModalOpen(false);
      }, 2500);
    } catch (err: any) {
      setResetError(err.message || 'Password reset request failed.');
    } finally {
      setResetLoading(false);
    }
  };

  // Institutional Super Admin Authentication Gate (P0.2)
  if (!isAuthenticated || activeRole !== 'admin' || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#181d24] text-white flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#222933] border border-gray-700/60 rounded-3xl p-7 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#e10600]/15 text-[#e10600] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black border border-[#e10600]/30">
              🛡️
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              {isResetMode ? 'Reset Admin Master Password' : 'Chief Admin Governance Portal'}
            </h1>
            <p className="text-xs text-gray-400">
              {isResetMode 
                ? 'Statutory Security Verification. Authorized Master Recovery Key or 2FA PIN required.'
                : 'Statutory Platform Surveillance & Ledger Control. Administrative credentials required.'}
            </p>
          </div>

          {!isResetMode ? (
            /* Standard Admin Login Form */
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              {adminError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-semibold">
                  {adminError}
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold">
                  {resetSuccess}
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Administrator Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="admin@staywise.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-300 font-semibold">Master Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setResetError(null);
                      setResetSuccess(null);
                    }}
                    className="text-[11px] text-[#e10600] hover:underline font-semibold"
                  >
                    Reset with Security Key?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="Enter admin password (e.g. admin@123)"
                />
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 rounded-xl bg-[#e10600] hover:bg-[#c50500] disabled:opacity-60 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2"
              >
                {adminLoading ? (
                  <span>Authenticating with SHA-256...</span>
                ) : (
                  <span>Authenticate & Access Governance Portal</span>
                )}
              </button>
            </form>
          ) : (
            /* Secure Admin Password Reset Form */
            <form onSubmit={handleAdminResetPassword} className="space-y-3.5 text-xs">
              {resetError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-semibold">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold">
                  {resetSuccess}
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Super Admin Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="admin@staywise.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Master Security Recovery Key or 2FA PIN
                </label>
                <input
                  type="password"
                  required
                  value={resetSecurityKey}
                  onChange={(e) => setResetSecurityKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600] font-mono text-xs"
                  placeholder="Master Recovery Key or 2FA PIN (e.g. 849201)"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Recovery Keys: <code className="text-[#e10600]">STAYWISE-ADMIN-MASTER-RECOVERY-KEY-2026</code> or PIN <code className="text-[#e10600]">849201</code>
                </span>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">New Master Password</label>
                <input
                  type="password"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="Re-type new master password"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 rounded-xl bg-[#e10600] hover:bg-[#c50500] disabled:opacity-60 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2"
              >
                {resetLoading ? (
                  <span>Verifying &amp; Re-encrypting in SHA-256...</span>
                ) : (
                  <span>Verify Security Key &amp; Update Password</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetError(null);
                }}
                className="w-full py-2 text-center text-xs text-gray-400 hover:text-white transition"
              >
                ← Back to Admin Login
              </button>
            </form>
          )}

          <div className="pt-2 text-center border-t border-gray-700/50">
            <a href="/" className="text-xs text-gray-400 hover:text-white transition">
              ← Return to Client Workspace
            </a>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'properties':
        return <PropertyList />;
      case 'pg':
        return <PGBedManagementView />;
      case 'commercial':
        return <CommercialCAMView />;
      case 'moveflow':
      case 'referrals':
        return <MoveFlowRetentionView />;
      case 'rentflow':
      case 'rewards':
        return <RentFlowOverview />;
      case 'maintenance':
        return <MaintenanceList />;
      case 'leads':
        return <LeadsCRM />;
      case 'vacancy':
        return <VacancyEngine />;
      case 'marketplace':
        return <MarketplaceNRI />;
      case 'ai':
        return <StaywiseAIPanel />;
      case 'tenants':
        return <TenantsDirectory />;
      case 'reports':
        return <FinancialAnalyticsView />;
      case 'find_home':
        return <FindHomeView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#c0c0c0] text-[#2a2a2a] flex font-sans selection:bg-[#e10600] selection:text-white overflow-x-hidden">
      {/* Floating Vertical Navigation Rail from reference image */}
      <FloatingNavRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Universal Sticky Header (Hello, Chief! + Super Admin Pill) */}
        <TopHeader />

        {/* Admin Governance Quick Security Banner */}
        <div className="bg-[#181d24] text-white px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-gray-200">Super Admin Governance Mode</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">SHA-256 Storage Enforced</span>
          </div>
          <button
            onClick={() => {
              setIsPortalResetModalOpen(true);
              setResetSuccess(null);
              setResetError(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/40 text-[11px] font-bold transition shadow-xs"
          >
            <span>🔐 Reset Master Admin Password</span>
          </button>
        </div>

        {/* Content Canvas */}
        <main className="flex-1 p-3.5 sm:p-6 pb-28 lg:pb-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Navigation and Dynamic FAB */}
      <MobileNav />

      {/* Proactive Live Activity Ticker (Just collected rent toast) */}
      <LiveActivityTicker />

      {/* Global Modals */}
      <GlobalSearchModal />
      <AddPropertyModal />
      <EditPropertyModal />
      <ExistingTenantWizardModal />
      <PayRentModal />
      <RentReceiptModal />
      <CreateTicketModal />
      <UploadElectricityBillModal 
        isOpen={isUploadBillModalOpen} 
        onClose={() => setIsUploadBillModalOpen(false)} 
        preselectedUnit={preselectedUnitForUpload} 
      />

      {/* Portal Admin Password Reset Modal */}
      {isPortalResetModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPortalResetModalOpen(false); }}
        >
          <div className="w-full max-w-md bg-[#222933] text-white rounded-3xl p-6 border border-gray-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔐</span>
                <h3 className="font-black text-sm text-white">Reset Super Admin Master Password</h3>
              </div>
              <button onClick={() => setIsPortalResetModalOpen(false)} className="text-gray-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Update the master administrator credentials. Authorized statutory recovery verification key required.
            </p>

            <form onSubmit={handleAdminResetPassword} className="space-y-3 text-xs">
              {resetError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-semibold">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold">
                  {resetSuccess}
                </div>
              )}

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Super Admin Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Master Security Recovery Key or 2FA PIN
                </label>
                <input
                  type="password"
                  required
                  value={resetSecurityKey}
                  onChange={(e) => setResetSecurityKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600] font-mono text-xs"
                  placeholder="Enter Key or PIN (e.g. 849201)"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Keys: <code className="text-[#e10600]">STAYWISE-ADMIN-MASTER-RECOVERY-KEY-2026</code> or PIN <code className="text-[#e10600]">849201</code>
                </span>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">New Master Password</label>
                <input
                  type="password"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                  placeholder="Re-type new master password"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPortalResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-4 py-2 rounded-xl bg-[#e10600] hover:bg-[#c50500] disabled:opacity-60 text-white font-bold text-xs transition shadow-md"
                >
                  {resetLoading ? 'Re-encrypting...' : 'Reset & Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AppStateProvider>
      <AdminShell />
    </AppStateProvider>
  );
}
