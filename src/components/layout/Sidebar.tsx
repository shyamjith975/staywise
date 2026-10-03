'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Receipt, 
  Wrench, 
  Compass, 
  Sparkles, 
  Trees, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  CalendarCheck,
  BookmarkCheck,
  ChevronDown,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';

export default function Sidebar() {
  const { 
    activeRole, 
    activeView, 
    setActiveView, 
    activePortfolio, 
    setActivePortfolio,
    tickets, 
    invoices, 
    leads, 
    properties 
  } = useAppState();

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Closed').length;
  const hotLeadsCount = leads.length; // 12 leads style
  const scheduledVisitsCount = leads.filter(l => l.visitDate).length || 3;

  // Navigation items for Owner/Manager/Admin
  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'properties', label: 'Properties', icon: <Building className="h-4 w-4" /> },
    { id: 'vacancy', label: 'Bookings & Relist', icon: <BookmarkCheck className="h-4 w-4" /> },
    { id: 'tenants', label: 'Tenants', icon: <Users className="h-4 w-4" /> },
    { 
      id: 'rentflow', 
      label: 'Payments', 
      icon: <Receipt className="h-4 w-4" />,
      badge: overdueCount > 0 ? `${overdueCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold'
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      icon: <Wrench className="h-4 w-4" />,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="h-4 w-4" /> },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="h-4 w-4" />, 
      badge: 2,
      badgeColor: 'bg-slate-700 text-slate-300' 
    },
  ];

  // Navigation items for Tenant
  const tenantNav = [
    { id: 'dashboard', label: 'My Home', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'rentflow', label: 'Payments & Receipts', icon: <Receipt className="h-4 w-4" />, badge: 'Due', badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'maintenance', label: 'Maintenance Requests', icon: <Wrench className="h-4 w-4" />, badge: '2 Open', badgeColor: 'bg-teal-500/20 text-teal-400' },
    { id: 'rewards', label: 'Rewards & FlexPay', icon: <Sparkles className="h-4 w-4 text-purple-400" />, badge: '1,250 SWP', badgeColor: 'bg-purple-500/20 text-purple-300' }
  ];

  // Navigation items for Vendor
  const vendorNav = [
    { id: 'dashboard', label: 'Work Orders', icon: <LayoutDashboard className="h-4 w-4" />, badge: '5 Today', badgeColor: 'bg-teal-500/20 text-teal-400' },
    { id: 'maintenance', label: 'Assigned Jobs', icon: <Wrench className="h-4 w-4" /> },
    { id: 'rentflow', label: 'Invoices & Payouts', icon: <Receipt className="h-4 w-4" />, badge: '₹18,400', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
  ];

  const currentNav = activeRole === 'tenant' ? tenantNav : activeRole === 'vendor' ? vendorNav : adminNav;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#0a1420] p-4 justify-between h-[calc(100vh-53px)] sticky top-[53px]">
      <div className="space-y-4">
        {/* Workspace Card (matching competitor's "WORKSPACE: Sai Krishna PG") */}
        <div className="p-3 rounded-2xl bg-[#0f2231] border border-slate-700/60 shadow-md">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">
            WORKSPACE
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-amber-500 text-white font-extrabold flex items-center justify-center shadow-md">
              {activePortfolio === 'wayanad' ? 'W' : activePortfolio === 'kochi' ? 'K' : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-xs truncate">
                {activePortfolio === 'wayanad' ? 'Serene Mist Estate' : activePortfolio === 'kochi' ? 'Infovision Commercial' : 'Sai Krishna / Beach Rd'}
              </div>
              <div className="text-[11px] text-slate-400">
                {properties.length} Portfolios • 21 Units
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation List with Competitor-Style Badges */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
          {currentNav.map((item) => {
            const isActive = activeView === item.id || (item.id === 'visits' && activeView === 'leads');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'visits') setActiveView('leads');
                  else setActiveView(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive 
                    ? 'bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/25' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Prominent Dedicated AI Assistant Button at bottom (Exact competitor highlight!) */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => setActiveView('ai')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs shadow-xl transition ${
            activeView === 'ai'
              ? 'bg-[#FF5A36] text-white ring-2 ring-orange-400/50 shadow-orange-500/30'
              : 'bg-gradient-to-r from-[#FF5A36]/90 to-rose-600 hover:from-[#FF5A36] hover:to-rose-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span>AI Assistant Copilot</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white font-extrabold uppercase">
            LIVE
          </span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            <span>Escrow Rails</span>
          </span>
          <span className="text-emerald-400 font-semibold">• Live</span>
        </div>
      </div>
    </aside>
  );
}
