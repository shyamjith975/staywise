'use client';

import React from 'react';
import { AppStateProvider, useAppState } from '../context/AppStateContext';
import LoginView from '../components/auth/LoginView';
import TopHeader from '../components/layout/TopHeader';
import FloatingNavRail from '../components/layout/FloatingNavRail';
import MobileNav from '../components/layout/MobileNav';
import GlobalSearchModal from '../components/layout/GlobalSearchModal';
import LiveActivityTicker from '../components/layout/LiveActivityTicker';

// Dashboards
import OwnerDashboard from '../components/dashboards/OwnerDashboard';
import TenantDashboard from '../components/dashboards/TenantDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

// Modules
import PropertyList from '../components/modules/properties/PropertyList';
import AddPropertyModal from '../components/modules/properties/AddPropertyModal';
import EditPropertyModal from '../components/modules/properties/EditPropertyModal';
import ExistingTenantWizardModal from '../components/modules/onboarding/ExistingTenantWizardModal';
import RentFlowOverview from '../components/modules/rentflow/RentFlowOverview';
import PayRentModal from '../components/modules/rentflow/PayRentModal';
import RentReceiptModal from '../components/modules/rentflow/RentReceiptModal';
import VacancyEngine from '../components/modules/vacancy/VacancyEngine';
import MaintenanceList from '../components/modules/maintenance/MaintenanceList';
import CreateTicketModal from '../components/modules/maintenance/CreateTicketModal';
import LeadsCRM from '../components/modules/leasing/LeadsCRM';
import EstateHospitalityDashboard from '../components/dashboards/EstateHospitalityDashboard';
import StaywiseAIPanel from '../components/modules/ai/StaywiseAIPanel';
import MarketplaceNRI from '../components/modules/services/MarketplaceNRI';

import TenantsDirectory from '../components/modules/tenants/TenantsDirectory';
import FinancialAnalyticsView from '../components/modules/analytics/FinancialAnalyticsView';
import SettingsView from '../components/modules/settings/SettingsView';
import UploadElectricityBillModal from '../components/modules/rentflow/UploadElectricityBillModal';

// Master Universe Architectural Modules
import PGBedManagementView from '../components/modules/pg/PGBedManagementView';
import CommercialCAMView from '../components/modules/commercial/CommercialCAMView';
import MoveFlowRetentionView from '../components/modules/moveflow/MoveFlowRetentionView';
import FindHomeView from '../components/modules/discovery/FindHomeView';

function MainAppShell() {
  const { 
    isAuthenticated, 
    activeRole, 
    activeView, 
    isUploadBillModalOpen, 
    setIsUploadBillModalOpen, 
    preselectedUnitForUpload 
  } = useAppState();

  // If not logged in, render the dedicated multi-role login screen with temporary credentials
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    // Strict Tenant Boundary - Only allow self views
    if (activeRole === 'tenant') {
      switch (activeView) {
        case 'find_home':
          return <FindHomeView />;
        case 'rentflow':
        case 'rewards':
        case 'reports':
          return <RentFlowOverview />;
        case 'maintenance':
          return <MaintenanceList />;
        case 'ai':
          return <StaywiseAIPanel />;
        case 'moveflow':
        case 'referrals':
          return <MoveFlowRetentionView />;
        case 'dashboard':
        default:
          return <TenantDashboard />;
      }
    }

    // Dedicated EstateOS & Hospitality Operating System (Villas, Campuses, Airbnb & Hotels)
    if (activeRole === 'estate_manager') {
      switch (activeView) {
        case 'maintenance':
          return <MaintenanceList />;
        case 'ai':
          return <StaywiseAIPanel />;
        case 'bookings':
          return <EstateHospitalityDashboard initialTab="BOOKINGS" />;
        case 'villas':
          return <EstateHospitalityDashboard initialTab="VILLAS" />;
        case 'housekeeping':
          return <EstateHospitalityDashboard initialTab="HOUSEKEEPING" />;
        case 'assets':
          return <EstateHospitalityDashboard initialTab="ASSETS" />;
        case 'staff':
          return <EstateHospitalityDashboard initialTab="STAFF" />;
        case 'pricing':
          return <EstateHospitalityDashboard initialTab="PRICING" />;
        case 'overview':
        case 'estate':
        case 'dashboard':
        default:
          return <EstateHospitalityDashboard initialTab="OVERVIEW" />;
      }
    }

    if (activeView === 'dashboard') {
      switch (activeRole) {
        case 'owner':
          return <OwnerDashboard />;
        case 'admin':
          return <AdminDashboard />;
        default:
          return <OwnerDashboard />;
      }
    }

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
      default:
        return activeRole === 'admin' ? <AdminDashboard /> : <OwnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#edece6] text-[#19251f] flex font-sans selection:bg-[#274235]/20 selection:text-[#274235] overflow-x-hidden">
      {/* Floating Vertical Navigation Rail from reference image */}
      <FloatingNavRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pr-0 sm:pr-4 overflow-x-hidden">
        {/* Top Header matching reference image with floral logo, greeting & search */}
        <TopHeader />

        {/* Content Canvas with ample bottom padding on mobile/tablet for bottom nav bar */}
        <main className="flex-1 p-3.5 sm:p-6 pb-28 lg:pb-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Navigation and Dynamic FAB */}
      <MobileNav />

      {/* Proactive Live Activity Tickers (matching competitor's top AI notification and bottom-right live money collection toast) */}
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

export default function Home() {
  return (
    <AppStateProvider>
      <MainAppShell />
    </AppStateProvider>
  );
}
