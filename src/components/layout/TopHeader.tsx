'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function TopHeader() {
  const { 
    currentUser, 
    setIsSearchOpen, 
    notifications, 
    markAllNotificationsRead,
    setActiveRole,
    activeRole,
    logout 
  } = useAppState();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="w-full px-4 sm:px-6 pt-4 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Geometric Floral Logo + Personal Greeting from reference image */}
      <div className="flex items-center gap-3.5">
        <div className="h-11 w-11 rounded-2xl bg-white border border-[#e3e1d8] flex items-center justify-center text-[#274235] shadow-sm shrink-0">
          {/* Exact geometric sunburst icon from reference image */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="12" cy="12" r="2.8" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
            Hello, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-xs font-medium text-[#6e7972]">
            Explore information and activity about your property
          </p>
        </div>
      </div>

      {/* Right: Pill Search Bar + Circular Message & Notification Icons */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Pill Search Input with dark circular search button */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between flex-1 md:flex-initial w-auto sm:w-64 md:w-80 pl-3.5 sm:pl-4 pr-1.5 py-1.5 bg-white rounded-full border border-[#e3e1d8] shadow-sm hover:border-[#274235]/40 transition cursor-pointer text-xs text-[#6e7972]"
        >
          <span>Search...</span>
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#19251f] text-white flex items-center justify-center shadow-sm shrink-0">
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* Circular Message Button with Notification Dot */}
        <div className="relative">
          <button
            onClick={() => alert('Message inbox synced with Staywise WhatsApp API & tenant chat channels.')}
            className="h-10 w-10 rounded-full bg-white border border-[#e3e1d8] flex items-center justify-center text-[#19251f] hover:bg-[#f4f3ef] transition shadow-sm"
            title="Messages"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500"></span>
          </button>
        </div>

        {/* Circular Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="h-10 w-10 rounded-full bg-white border border-[#e3e1d8] flex items-center justify-center text-[#19251f] hover:bg-[#f4f3ef] transition shadow-sm"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#274235] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-3xl bg-white border border-[#e3e1d8] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eeece5]">
                <span className="text-xs font-bold text-[#19251f]">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-[11px] text-[#274235] font-semibold hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-xs space-y-1">
                    <div className="font-bold text-[#19251f] flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#95a099] font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#6e7972]">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Role Indicator Pill */}
        <div 
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e3e1d8] text-xs font-bold text-[#19251f] shadow-sm cursor-pointer hover:border-[#274235] transition"
          title="Click to sign out or switch persona"
        >
          <span>{currentUser.avatar}</span>
          <span className="hidden sm:inline">{currentUser.roleLabel}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </header>
  );
}
