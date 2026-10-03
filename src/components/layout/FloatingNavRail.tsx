'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  LayoutGrid, 
  CreditCard, 
  BarChart2, 
  Building2, 
  Users2, 
  Calendar, 
  Wrench, 
  Trees, 
  Sparkles, 
  Settings, 
  LogOut,
  BedDouble,
  Briefcase,
  Truck,
  Gift,
  Compass,
  Sliders
} from 'lucide-react';

export default function FloatingNavRail() {
  const { activeView, setActiveView, currentUser, logout, activeRole } = useAppState();

  const ownerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="h-5 w-5" /> },
    { id: 'properties', label: 'Properties & Assets', icon: <Building2 className="h-5 w-5" /> },
    { id: 'pg', label: 'PG & Co-Living Operations', icon: <BedDouble className="h-5 w-5 text-indigo-400" /> },
    { id: 'commercial', label: 'Commercial & CAM Hub', icon: <Briefcase className="h-5 w-5 text-teal-400" /> },
    { id: 'rentflow', label: 'Payments & Ledger', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'tenants', label: 'Tenants & Leases', icon: <Users2 className="h-5 w-5" /> },
    { id: 'reports', label: 'Financial Analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { id: 'moveflow', label: 'Referrals & Disputes', icon: <Gift className="h-5 w-5 text-amber-500" /> },
    { id: 'maintenance', label: 'Maintenance Work Orders', icon: <Wrench className="h-5 w-5" /> },
    { id: 'ai', label: 'Staywise AI Assistant', icon: <Sparkles className="h-5 w-5 text-amber-400" /> },
  ];

  const estateNavItems = [
    { id: 'dashboard', label: 'Host Overview', icon: <Trees className="h-5 w-5 text-emerald-700" /> },
    { id: 'bookings', label: 'Airbnb & Bookings', icon: <Calendar className="h-5 w-5 text-rose-600" /> },
    { id: 'villas', label: 'Luxury Villas & Campuses', icon: <Building2 className="h-5 w-5" /> },
    { id: 'housekeeping', label: 'Housekeeping Turnovers', icon: <BedDouble className="h-5 w-5 text-blue-600" /> },
    { id: 'assets', label: 'Campus Physical Assets', icon: <Wrench className="h-5 w-5 text-amber-600" /> },
    { id: 'staff', label: 'Campus Staff & Shifts', icon: <Users2 className="h-5 w-5" /> },
    { id: 'pricing', label: 'Dynamic Pricing & OTAs', icon: <Sliders className="h-5 w-5 text-purple-600" /> },
    { id: 'maintenance', label: 'Campus AMC & Repairs', icon: <Wrench className="h-5 w-5" /> },
    { id: 'ai', label: 'Hospitality AI Concierge', icon: <Sparkles className="h-5 w-5 text-amber-600" /> },
  ];

  const tenantNavItems = [
    { id: 'dashboard', label: 'My Apartment', icon: <LayoutGrid className="h-5 w-5" /> },
    { id: 'find_home', label: 'Find a Home & Refer', icon: <Compass className="h-5 w-5 text-emerald-600" /> },
    { id: 'rentflow', label: 'My Rent & Receipts', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'maintenance', label: 'My Maintenance Requests', icon: <Wrench className="h-5 w-5" /> },
    { id: 'moveflow', label: 'Deposit & Referrals', icon: <Gift className="h-5 w-5 text-amber-500" /> },
    { id: 'ai', label: 'Resident AI Assistant', icon: <Sparkles className="h-5 w-5 text-amber-600" /> },
  ];

  const navItems = activeRole === 'tenant' 
    ? tenantNavItems 
    : activeRole === 'estate_manager'
    ? estateNavItems
    : ownerNavItems;

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-16 my-4 ml-4 py-4 bg-white rounded-[2rem] border border-[#e3e1d8] shadow-[0_8px_30px_rgb(25,37,31,0.04)] sticky top-4 h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] z-30 select-none overflow-hidden">
      {/* Top Section / Main Navigation */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2 px-1 py-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={item.label}
              className={`relative h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#19251f] text-white shadow-lg shadow-[#19251f]/20 scale-105'
                  : 'text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef]'
              }`}
            >
              {item.icon}
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-[#274235]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Settings, Logout, Avatar */}
      <div className="flex flex-col items-center gap-2 pt-3 mt-2 border-t border-[#eeece5] w-full shrink-0">
        {activeRole !== 'tenant' && (
          <button
            onClick={() => setActiveView('settings')}
            title="Settings & Feature Flags"
            className={`h-9 w-9 rounded-2xl flex items-center justify-center transition ${
              activeView === 'settings'
                ? 'bg-[#19251f] text-white'
                : 'text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef]'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={logout}
          title="Sign Out / Switch Account"
          className="h-9 w-9 rounded-2xl flex items-center justify-center text-[#6e7972] hover:text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="h-4 w-4" />
        </button>

        {/* User Avatar Circle */}
        <div 
          onClick={logout}
          title={`Signed in as ${currentUser.name} (${currentUser.roleLabel}). Click to switch.`}
          className="relative h-9 w-9 rounded-full bg-[#f4f3ef] border-2 border-[#274235]/40 flex items-center justify-center text-xs shadow-sm cursor-pointer hover:scale-105 transition"
        >
          <span>{currentUser.avatar}</span>
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
      </div>
    </aside>
  );
}
