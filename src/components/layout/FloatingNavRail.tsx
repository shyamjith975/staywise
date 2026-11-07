'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  LayoutGrid, 
  Building2, 
  BedDouble, 
  Briefcase, 
  CreditCard, 
  Users2, 
  BarChart2, 
  Gift, 
  Wrench, 
  Sparkles, 
  Settings, 
  LogOut, 
  Plus, 
  Trees,
  Calendar,
  Sliders,
  Compass,
  HelpCircle,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { color } from '../../lib/colors';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasPlus?: boolean;
}

export default function FloatingNavRail() {
  const { activeView, setActiveView, currentUser, logout, activeRole, setIsAddPropertyOpen } = useAppState();

  const ownerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Universal Dashboard', icon: <LayoutGrid className="h-4 w-4" /> },
    { id: 'deposit_protect', label: 'Zero-Deposit Protect', icon: <ShieldCheck className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'properties', label: 'Properties & Units', icon: <Building2 className="h-4 w-4" />, hasPlus: true },
    { id: 'pg', label: 'PG & Co-Living Beds', icon: <BedDouble className="h-4 w-4 text-[#a31c1b]" />, hasPlus: true },
    { id: 'commercial', label: 'Commercial & CAM Hub', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'rentflow', label: 'RentFlow & Ledger', icon: <CreditCard className="h-4 w-4" />, hasPlus: true },
    { id: 'tenants', label: 'Tenants & Leases', icon: <Users2 className="h-4 w-4" /> },
    { id: 'reports', label: 'Financial Analytics', icon: <BarChart2 className="h-4 w-4" /> },
    { id: 'moveflow', label: 'MoveFlow & Referrals', icon: <Gift className="h-4 w-4" /> },
    { id: 'maintenance', label: 'Maintenance & AMC', icon: <Wrench className="h-4 w-4" /> },
    { id: 'ai', label: 'Staywise AI Hub', icon: <Sparkles className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'settings', label: 'Settings & Billing', icon: <Settings className="h-4 w-4" /> },
  ];

  const estateNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Host Overview', icon: <Trees className="h-4 w-4" /> },
    { id: 'bookings', label: 'Airbnb & Bookings', icon: <Calendar className="h-4 w-4" /> },
    { id: 'villas', label: 'Luxury Villas & Campuses', icon: <Building2 className="h-4 w-4" />, hasPlus: true },
    { id: 'housekeeping', label: 'Housekeeping Turnovers', icon: <BedDouble className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'assets', label: 'Campus Physical Assets', icon: <Wrench className="h-4 w-4" /> },
    { id: 'staff', label: 'Campus Staff & Shifts', icon: <Users2 className="h-4 w-4" /> },
    { id: 'pricing', label: 'Dynamic Pricing & OTAs', icon: <Sliders className="h-4 w-4" /> },
    { id: 'ai', label: 'Hospitality AI Concierge', icon: <Sparkles className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'settings', label: 'Settings & Billing', icon: <Settings className="h-4 w-4" /> },
  ];

  const tenantNavItems: NavItem[] = [
    { id: 'dashboard', label: 'My Space', icon: <LayoutGrid className="h-4 w-4" /> },
    { id: 'rewards', label: 'WisePoints Rewards', icon: <Gift className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'deposit_protect', label: 'Zero-Deposit Protect', icon: <ShieldCheck className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'rentflow', label: 'Rent & Receipts', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'maintenance', label: 'Maintenance Requests', icon: <Wrench className="h-4 w-4" /> },
    { id: 'moveflow', label: 'MoveFlow & Referrals', icon: <Gift className="h-4 w-4 text-[#546E7A]" /> },
    { id: 'find_home', label: 'Find a Home', icon: <Compass className="h-4 w-4" /> },
    { id: 'ai', label: 'Resident AI Assistant', icon: <Sparkles className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'settings', label: 'Resident Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Governance Centre', icon: <ShieldCheck className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'deposit_protect', label: 'Zero-Deposit Risk', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'properties', label: 'Properties Surveillance', icon: <Building2 className="h-4 w-4" /> },
    { id: 'tenants', label: 'Tenants Directory', icon: <Users2 className="h-4 w-4" /> },
    { id: 'rentflow', label: 'Ledger Surveillance', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'reports', label: 'Financial Analytics', icon: <BarChart2 className="h-4 w-4" /> },
    { id: 'maintenance', label: 'Maintenance System', icon: <Wrench className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Governance Hub', icon: <Sparkles className="h-4 w-4 text-[#a31c1b]" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const navItems = activeRole === 'tenant' 
    ? tenantNavItems 
    : activeRole === 'estate_manager' 
    ? estateNavItems 
    : activeRole === 'admin'
    ? adminNavItems
    : ownerNavItems;

  return (
    <aside className="hidden lg:flex flex-col justify-between w-60 xl:w-64 bg-white border-r border-[#D2DDD7] p-4 h-screen sticky top-0 z-30 select-none shrink-0 font-sans">
      
      {/* Top Section: Brand Logo & Specific Detailed Menu Items */}
      <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
        
        {/* Brand Logo with exact palette insignia */}
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-xl bg-[#06110c] text-[#a31c1b] flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#171717]">
              STAYWISE
            </span>
            <span className="text-[9px] text-[#546E7A] font-bold uppercase tracking-wider">
              {currentUser.roleLabel || 'Property OS'}
            </span>
          </div>
        </div>

        {/* Detailed Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-white font-extrabold bg-[#06110c] shadow-sm'
                    : 'text-[#171717] hover:text-[#06110c] hover:bg-[#E8F0EC]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-[#a31c1b]' : 'text-[#06110c]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.hasPlus && (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.id === 'properties' || item.id === 'villas') setIsAddPropertyOpen(true);
                      else setActiveView(item.id);
                    }}
                    className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold transition shrink-0 ${
                      isActive ? 'bg-[#171717] text-white' : 'bg-[#E8F0EC] text-[#06110c] hover:bg-[#D2DDD7]'
                    }`}
                  >
                    +
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle/Bottom: Upgrade to Pro Promo Card & Utility Links */}
      <div className="space-y-3 pt-3 border-t border-[#D2DDD7] shrink-0">
        
        {/* Upgrade to Pro Card */}
        {activeRole !== 'tenant' && activeRole !== 'admin' && (
          <div className="rounded-2xl bg-[#E8F0EC] p-3.5 text-center space-y-2 border border-[#D2DDD7]">
            <div className="flex items-center justify-center gap-1.5 text-[#171717]">
              <Crown className="h-4 w-4 text-[#a31c1b]" />
              <h4 className="font-black text-xs">Upgrade to Pro</h4>
            </div>
            <p className="text-[10px] text-[#546E7A] leading-snug">
              Unlock automated WhatsApp rent collection &amp; sub-meters
            </p>
            <button
              onClick={() => setActiveView('settings')}
              className="w-full py-1.5 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black transition shadow-2xs cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>
        )}

        {/* Bottom Utility Links */}
        <div className="space-y-0.5 text-xs">
          <button
            onClick={() => alert('Support concierge available 24/7 at support@staywise.in or +91 80000 12345')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#546E7A] hover:text-[#171717] hover:bg-[#E8F0EC] transition cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help &amp; Support</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#546E7A] hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </aside>
  );
}
