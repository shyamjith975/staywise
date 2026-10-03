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
    login, 
    activeView, 
    isUploadBillModalOpen, 
    setIsUploadBillModalOpen, 
    preselectedUnitForUpload 
  } = useAppState();

  // Initialize session as Super Admin (Chief Admin) when visiting /admin
  useEffect(() => {
    if (activeRole !== 'admin') {
      login('admin');
    }
  }, [activeRole, login]);

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
    <div className="min-h-screen bg-[#edece6] text-[#19251f] flex font-sans selection:bg-[#274235]/20 selection:text-[#274235] overflow-x-hidden">
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
