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
  Plus
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
    setIsAddPropertyOpen
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
    <header className="w-full px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-3 border-b border-[#E8EFE2] lg:border-none">
      
      {/* Mobile Brand & Hamburger */}
      <div className="lg:hidden flex items-center gap-2.5">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1.5 rounded-xl hover:bg-[#F3F6EE] text-[#132A13] transition"
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[#132A13] text-[#ECF39E] flex items-center justify-center font-black text-[10px]">
            ✦
          </div>
          <span className="font-extrabold text-sm text-[#132A13]">STAYWISE</span>
        </div>
      </div>

      {/* Search Input (Pill search) */}
      <div 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F6EE] border border-[#DCE5D3] text-xs text-[#657D5C] hover:text-[#132A13] hover:border-[#4F772D] transition cursor-pointer w-64 xl:w-80 shadow-2xs"
      >
        <Search className="h-3.5 w-3.5 text-[#4F772D]" />
        <span>Search properties, tenants, bills... (Ctrl + K)</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto">
        
        {/* Quick Add Button */}
        {activeRole !== 'tenant' && (
          <button
            onClick={() => setIsAddPropertyOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-extrabold transition shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Property</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="h-8 w-8 rounded-full bg-[#F3F6EE] hover:bg-[#EBF0E6] border border-[#DCE5D3] flex items-center justify-center text-[#31572C] transition relative shadow-2xs"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-white border border-[#DCE5D3] shadow-xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8EFE2]">
                <span className="text-xs font-bold text-[#132A13]">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-[11px] text-[#4F772D] font-semibold hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#F3F6EE] border border-[#E8EFE2] text-xs space-y-0.5">
                    <div className="font-bold text-[#132A13] flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#657D5C] font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#31572C]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div 
          onClick={logout}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#F3F6EE] border border-[#DCE5D3] text-xs font-bold text-[#132A13] cursor-pointer hover:bg-[#EBF0E6] transition shadow-2xs"
          title="Click to sign out or switch user"
        >
          <div className="relative h-6 w-6 rounded-full bg-[#132A13] text-[#ECF39E] flex items-center justify-center text-[11px] font-black">
            {currentUser.avatar || 'S'}
            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#4F772D] ring-1 ring-white" />
          </div>
          <span className="hidden sm:inline font-bold">{currentUser.name.split(' ')[0]}</span>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-x-0 top-[52px] bg-white border-b border-[#DCE5D3] shadow-xl p-4 z-40 space-y-2 animate-in slide-in-from-top duration-150">
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
                    ? 'bg-[#132A13] text-[#ECF39E]' 
                    : 'bg-[#F3F6EE] text-[#31572C] hover:bg-[#EBF0E6]'
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
