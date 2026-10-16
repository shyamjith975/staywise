'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Search, 
  Bell, 
  Settings, 
  Sparkles, 
  Menu,
  X,
  Plus,
  UserPlus
} from 'lucide-react';

export default function TopHeader() {
  const { 
    currentUser, 
    setIsSearchOpen, 
    notifications, 
    markAllNotificationsRead,
    activeRole,
    activeView,
    setActiveView,
    logout,
    setIsAddPropertyOpen,
    setIsExistingTenantWizardOpen
  } = useAppState();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const ownerNavItems = [
    { id: 'dashboard', label: 'Universal Dashboard' },
    { id: 'properties', label: 'Properties & Units' },
    { id: 'pg', label: 'PG & Co-Living' },
    { id: 'commercial', label: 'Commercial CAM' },
    { id: 'rentflow', label: 'RentFlow & Ledger' },
    { id: 'tenants', label: 'Tenants & Leases' },
    { id: 'reports', label: 'Financial Analytics' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'ai', label: 'Staywise AI' },
    { id: 'settings', label: 'Settings & Billing' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md border-b border-[#D2DDD7] shadow-2xs">
      
      {/* Mobile Brand & Hamburger */}
      <div className="lg:hidden flex items-center gap-2.5">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1.5 rounded-xl hover:bg-[#E8F0EC] text-[#263238] transition"
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[#163B36] text-[#C69A55] flex items-center justify-center font-black text-[10px]">
            ✦
          </div>
          <span className="font-extrabold text-sm text-[#263238]">STAYWISE</span>
        </div>
      </div>

      {/* Search Input (Pill search) */}
      <div 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-[#546E7A] hover:text-[#263238] hover:border-[#163B36] transition cursor-pointer w-64 xl:w-80 shadow-2xs"
      >
        <Search className="h-3.5 w-3.5 text-[#163B36]" />
        <span>Search properties, tenants, bills... (Ctrl + K)</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto">
        
        {/* Fixed Quick Add Buttons */}
        {activeRole !== 'tenant' && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsExistingTenantWizardOpen(true)}
              className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3.5 sm:py-1.5 rounded-full bg-[#E8F0EC] hover:bg-[#DCE8E1] text-[#163B36] text-xs font-extrabold border border-[#D2DDD7] transition shadow-xs cursor-pointer shrink-0"
              title="Onboard Tenant"
              aria-label="Onboard Tenant"
            >
              <UserPlus className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-[#163B36] shrink-0" />
              <span className="hidden sm:inline">+ Onboard Tenant</span>
            </button>
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3.5 sm:py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-extrabold transition shadow-xs cursor-pointer shrink-0"
              title="Add Property"
              aria-label="Add Property"
            >
              <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-white shrink-0" />
              <span className="hidden sm:inline">+ Add Property</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="h-8 w-8 rounded-full bg-[#E8F0EC] hover:bg-[#DCE8E1] border border-[#D2DDD7] flex items-center justify-center text-[#263238] transition relative shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#C69A55] ring-2 ring-white" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-white border border-[#D2DDD7] shadow-xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D2DDD7]">
                <span className="text-xs font-bold text-[#263238]">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-[11px] text-[#163B36] font-semibold hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs space-y-0.5">
                    <div className="font-bold text-[#263238] flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#546E7A] font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#37474F]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div 
          onClick={logout}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-bold text-[#263238] cursor-pointer hover:bg-[#DCE8E1] transition shadow-2xs"
          title="Click to sign out or switch user"
        >
          <div className="relative h-6 w-6 rounded-full bg-[#163B36] text-[#C69A55] flex items-center justify-center text-[11px] font-black">
            {currentUser.avatar || currentUser.name.charAt(0).toUpperCase()}
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#C69A55] ring-1 ring-white" />
          </div>
          <span className="hidden sm:inline font-bold">{currentUser.name.split(' ')[0]}</span>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-x-0 top-[52px] bg-white border-b border-[#D2DDD7] shadow-xl p-4 z-40 space-y-2 animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-2 gap-2">
            {ownerNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition ${
                  activeView === item.id 
                    ? 'bg-[#163B36] text-white' 
                    : 'bg-[#E8F0EC] text-[#263238] hover:bg-[#DCE8E1]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}
