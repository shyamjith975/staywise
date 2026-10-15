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

  // Institutional Super Admin Authentication Gate (P0.2)
  if (!isAuthenticated || activeRole !== 'admin' || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#181d24] text-white flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#222933] border border-gray-700/60 rounded-3xl p-7 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#e10600]/15 text-[#e10600] rounded-2xl flex items-center justify-center mx-auto text-2xl font-black border border-[#e10600]/30">
              🛡️
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">Chief Admin Governance Portal</h1>
            <p className="text-xs text-gray-400">
              Statutory Platform Surveillance & Ledger Control. Administrative credentials required.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            {adminError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 font-semibold">
                {adminError}
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
              <label className="block text-gray-300 font-semibold mb-1">Master Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d24] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#e10600]"
                placeholder="Enter admin password (e.g. Admin@123)"
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
