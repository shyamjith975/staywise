'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Search, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Users, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

const ROLES: { id: UserRole; label: string; icon: string; badgeColor: string }[] = [
  { id: 'owner', label: 'Owner', icon: '👑', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'tenant', label: 'Tenant', icon: '🏠', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { id: 'manager', label: 'Manager', icon: '💼', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'vendor', label: 'Vendor', icon: '🔧', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { id: 'admin', label: 'Super Admin', icon: '🛡️', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40' }
];

export default function Header() {
  const { 
    activeRole, 
    setActiveRole, 
    activePortfolio, 
    setActivePortfolio,
    setIsSearchOpen,
    notifications,
    markAllNotificationsRead
  } = useAppState();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Portfolio Selector */}
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Building2 className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                STAYWISE
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                PropOS
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">Rental & Asset Operating System</p>
          </div>
        </div>

        {/* Portfolio Dropdown */}
        <div className="hidden md:flex items-center relative">
          <div className="flex items-center gap-1.5 bg-slate-900/90 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 hover:border-teal-500/50 transition cursor-pointer">
            <span className="text-slate-400">Portfolio:</span>
            <select
              value={activePortfolio}
              onChange={(e) => setActivePortfolio(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900">All Portfolios (Kerala)</option>
              <option value="kozhikode" className="bg-slate-900">Kozhikode Coastal</option>
              <option value="kochi" className="bg-slate-900">Kochi Commercial</option>
              <option value="wayanad" className="bg-slate-900">Wayanad Estates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Global Search Bar Trigger */}
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-300 transition group shadow-inner"
      >
        <span className="flex items-center gap-2.5">
          <Search className="h-4 w-4 text-slate-400 group-hover:text-teal-400 transition" />
          <span>Search properties, tenants, invoices, tickets...</span>
        </span>
        <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
          /
        </kbd>
      </button>

      {/* Live Role Switcher & Controls */}
      <div className="flex items-center gap-2.5">
        {/* Role Switcher Pill Bar */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {ROLES.map((r) => {
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-teal-500/20 text-teal-300 shadow-sm border border-teal-500/50' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch view to ${r.label}`}
              >
                <span>{r.icon}</span>
                <span className="hidden xl:inline">{r.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {unreadCount} unread
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition ${
                      n.read 
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' 
                        : 'bg-slate-800/60 border-teal-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-white flex items-center gap-1.5">
                        {n.type === 'RENT' && <span className="text-amber-400">₹</span>}
                        {n.type === 'MAINTENANCE' && <Wrench className="h-3 w-3 text-cyan-400" />}
                        {n.type === 'LEAD' && <Users className="h-3 w-3 text-emerald-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar with Role pill */}
        <div className="flex items-center gap-2 pl-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-300 shadow-sm">
            {activeRole === 'owner' ? 'OW' : activeRole === 'tenant' ? 'SS' : activeRole === 'manager' ? 'PM' : activeRole === 'vendor' ? 'RC' : 'AD'}
          </div>
        </div>
      </div>
    </header>
  );
}
