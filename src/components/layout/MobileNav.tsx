'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  LayoutDashboard, 
  Building, 
  Receipt, 
  Wrench, 
  Menu, 
  Plus, 
  Compass, 
  Sparkles, 
  Trees, 
  BarChart3,
  X,
  CreditCard,
  Users2,
  BedDouble,
  Briefcase,
  Gift,
  Calendar,
  Sliders,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building2,
  Settings
} from 'lucide-react';

export default function MobileNav() {
  const { 
    activeRole, 
    activeView, 
    setActiveView, 
    currentUser,
    logout,
    setIsAddPropertyOpen, 
    setIsExistingTenantWizardOpen,
    setIsPayRentOpen,
    setIsCreateTicketOpen,
    setSelectedInvoiceForPay,
    invoices
  } = useAppState();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Floating Action Button action based on role
  const handleFabClick = () => {
    if (activeRole === 'tenant') {
      const dueInv = invoices.find(i => i.status === 'Due' || i.status === 'Overdue');
      if (dueInv) {
        setSelectedInvoiceForPay(dueInv);
        setIsPayRentOpen(true);
      } else {
        setIsCreateTicketOpen(true);
      }
    } else if (activeRole === 'estate_manager') {
      setActiveView('bookings');
    } else {
      setIsExistingTenantWizardOpen(true);
    }
  };

  const getFabLabel = () => {
    if (activeRole === 'tenant') return 'Pay Rent';
    if (activeRole === 'estate_manager') return 'Bookings';
    return 'Onboard';
  };

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (FAB) for Mobile */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={handleFabClick}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#132A13] text-[#ECF39E] font-bold text-xs shadow-xl shadow-[#132A13]/30 hover:scale-105 active:scale-95 transition border border-[#4F772D]"
        >
          <Plus className="h-4 w-4" />
          <span>{getFabLabel()}</span>
        </button>
      </div>

      {/* Redesigned Premium Mobile Menu Drawer */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-[#132A13]/60 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-t border-[#DCE5D3] rounded-t-[2.5rem] p-5 pb-8 space-y-5 max-h-[88vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-250 font-sans"
          >
            {/* Grabber bar */}
            <div className="w-12 h-1.5 rounded-full bg-[#DCE5D3] mx-auto" />

            {/* Profile & Header Card */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EFE2]">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#F3F6EE] border border-[#31572C]/30 flex items-center justify-center text-lg shadow-sm">
                  {currentUser.avatar}
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#132A13]">{currentUser.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13]">
                      {currentUser.roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="h-9 w-9 rounded-full bg-[#F3F6EE] flex items-center justify-center text-[#657D5C] hover:text-[#132A13] transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Owner / Manager Menu Content */}
            {activeRole !== 'tenant' && activeRole !== 'estate_manager' && (
              <div className="space-y-4">
                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setIsAddPropertyOpen(true); setIsMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-[#132A13] text-[#ECF39E] flex items-center gap-2.5 text-xs font-bold shadow-md shadow-[#132A13]/20 hover:bg-[#31572C] transition border border-[#4F772D]"
                  >
                    <Plus className="h-4 w-4 text-[#ECF39E]" />
                    <span>Add Property</span>
                  </button>
                  <button
                    onClick={() => { setIsExistingTenantWizardOpen(true); setIsMenuOpen(false); }}
                    className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] flex items-center gap-2.5 text-xs font-bold hover:bg-white transition"
                  >
                    <Users2 className="h-4 w-4 text-[#31572C]" />
                    <span>Onboard Tenant</span>
                  </button>
                </div>

                {/* Section 1: Core Operations */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                    Core Operations
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'dashboard' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'dashboard' ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-[#274235]'}`}>
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Universal Dashboard</div>
                          <div className={`text-[10px] ${activeView === 'dashboard' ? 'text-slate-300' : 'text-slate-500'}`}>Real-time revenue, occupancy &amp; alerts</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'dashboard' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('properties')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'properties' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'properties' ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Properties &amp; Assets</div>
                          <div className={`text-[10px] ${activeView === 'properties' ? 'text-slate-300' : 'text-slate-500'}`}>Residential, commercial &amp; units matrix</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'properties' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('tenants')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'tenants' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'tenants' ? 'bg-white/10 text-emerald-400' : 'bg-purple-50 text-purple-700'}`}>
                          <Users2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Tenants &amp; Leases</div>
                          <div className={`text-[10px] ${activeView === 'tenants' ? 'text-slate-300' : 'text-slate-500'}`}>Active agreements &amp; lease renewals</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'tenants' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('rentflow')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'rentflow' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'rentflow' ? 'bg-white/10 text-emerald-400' : 'bg-teal-50 text-teal-700'}`}>
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Payments &amp; Ledger</div>
                          <div className={`text-[10px] ${activeView === 'rentflow' ? 'text-slate-300' : 'text-slate-500'}`}>Double-entry statutory audit ledger</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'rentflow' ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                {/* Section 2: Specialized Asset Engines */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                    Specialized Asset Engines
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick('pg')}
                      className={`p-3 rounded-2xl text-left transition border ${
                        activeView === 'pg' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <BedDouble className={`h-4 w-4 mb-2 ${activeView === 'pg' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                      <div className="text-xs font-bold">PG &amp; Co-Living</div>
                      <div className={`text-[10px] mt-0.5 ${activeView === 'pg' ? 'text-slate-300' : 'text-slate-500'}`}>Bed-level operations</div>
                    </button>

                    <button
                      onClick={() => handleNavClick('commercial')}
                      className={`p-3 rounded-2xl text-left transition border ${
                        activeView === 'commercial' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <Briefcase className={`h-4 w-4 mb-2 ${activeView === 'commercial' ? 'text-teal-300' : 'text-teal-600'}`} />
                      <div className="text-xs font-bold">Commercial &amp; CAM</div>
                      <div className={`text-[10px] mt-0.5 ${activeView === 'commercial' ? 'text-slate-300' : 'text-slate-500'}`}>Sq ft &amp; common area</div>
                    </button>
                  </div>
                </div>

                {/* Section 3: Protection, Analytics & Referrals */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                    Protection &amp; Analytics
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => handleNavClick('moveflow')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'moveflow' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'moveflow' ? 'bg-white/10 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                          <Gift className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Referrals &amp; Disputes</div>
                          <div className={`text-[10px] ${activeView === 'moveflow' ? 'text-slate-300' : 'text-slate-500'}`}>Earn ₹5,000 &amp; settle escrow balances</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'moveflow' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('reports')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'reports' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'reports' ? 'bg-white/10 text-emerald-400' : 'bg-sky-50 text-sky-700'}`}>
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Financial Analytics</div>
                          <div className={`text-[10px] ${activeView === 'reports' ? 'text-slate-300' : 'text-slate-500'}`}>Monthly P&amp;L &amp; yield projections</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'reports' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('maintenance')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'maintenance' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'maintenance' ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-700'}`}>
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Maintenance Work Orders</div>
                          <div className={`text-[10px] ${activeView === 'maintenance' ? 'text-slate-300' : 'text-slate-500'}`}>Contractor jobs &amp; proofs</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'maintenance' ? 'text-white' : 'text-slate-400'}`} />
                    </button>

                    <button
                      onClick={() => handleNavClick('ai')}
                      className={`p-3 rounded-2xl text-left transition flex items-center justify-between border ${
                        activeView === 'ai' 
                          ? 'bg-[#19251f] text-white border-[#19251f]' 
                          : 'bg-[#fbfbfa] text-slate-800 border-slate-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeView === 'ai' ? 'bg-white/10 text-amber-300' : 'bg-amber-50 text-amber-600'}`}>
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">Staywise AI Assistant</div>
                          <div className={`text-[10px] ${activeView === 'ai' ? 'text-slate-300' : 'text-slate-500'}`}>Proactive rent intelligence</div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeView === 'ai' ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Estate Manager Menu */}
            {activeRole === 'estate_manager' && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                  Hospitality &amp; Estate Hub
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <Trees className="h-4 w-4 text-emerald-700 mb-1" />
                    <div className="text-xs font-bold">Host Overview</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('bookings')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <Calendar className="h-4 w-4 text-rose-600 mb-1" />
                    <div className="text-xs font-bold">Airbnb Bookings</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('villas')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <Building className="h-4 w-4 text-teal-700 mb-1" />
                    <div className="text-xs font-bold">Luxury Villas</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('housekeeping')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <BedDouble className="h-4 w-4 text-blue-600 mb-1" />
                    <div className="text-xs font-bold">Turnovers</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('pricing')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <Sliders className="h-4 w-4 text-purple-600 mb-1" />
                    <div className="text-xs font-bold">Dynamic Pricing</div>
                  </button>
                  <button
                    onClick={() => handleNavClick('ai')}
                    className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-left hover:bg-white transition"
                  >
                    <Sparkles className="h-4 w-4 text-amber-600 mb-1" />
                    <div className="text-xs font-bold">AI Concierge</div>
                  </button>
                </div>
              </div>
            )}

            {/* Tenant Menu Content */}
            {activeRole === 'tenant' && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                  Tenant Portal
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="p-3 rounded-2xl bg-[#fbfbfa] border border-slate-200 text-left hover:bg-white transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="h-4 w-4 text-[#274235]" />
                      <div>
                        <div className="text-xs font-bold">My Apartment</div>
                        <div className="text-[10px] text-slate-500">Rent balance &amp; roommate split</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('find_home')}
                    className="p-3 rounded-2xl bg-[#fbfbfa] border border-slate-200 text-left hover:bg-white transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Compass className="h-4 w-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold">Find a Home &amp; Refer</div>
                        <div className="text-[10px] text-slate-500">Zero brokerage &amp; cash rewards</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('rentflow')}
                    className="p-3 rounded-2xl bg-[#fbfbfa] border border-slate-200 text-left hover:bg-white transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className="h-4 w-4 text-teal-600" />
                      <div>
                        <div className="text-xs font-bold">Rent Receipts &amp; Power Bills</div>
                        <div className="text-[10px] text-slate-500">Sub-meter kWh &amp; UPI payments</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('moveflow')}
                    className="p-3 rounded-2xl bg-[#fbfbfa] border border-slate-200 text-left hover:bg-white transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Gift className="h-4 w-4 text-amber-600" />
                      <div>
                        <div className="text-xs font-bold">Deposit Settlement &amp; Referrals</div>
                        <div className="text-[10px] text-slate-500">Escrow security refund &amp; rewards</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('ai')}
                    className="p-3 rounded-2xl bg-[#fbfbfa] border border-slate-200 text-left hover:bg-white transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <div>
                        <div className="text-xs font-bold">Resident AI Assistant</div>
                        <div className="text-[10px] text-slate-500">Quick queries &amp; smart assistance</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions: Settings & Sign Out */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              {activeRole !== 'tenant' && (
                <button
                  onClick={() => handleNavClick('settings')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              )}

              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1.5 ml-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE5D3] px-2 py-2 flex items-center justify-around select-none font-sans">
        {activeRole === 'tenant' ? (
          // Tenant-Specific Bottom Nav
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                activeView === 'dashboard' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[10px] font-bold">Home</span>
            </button>

            <button
              onClick={() => setActiveView('find_home')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                activeView === 'find_home' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Compass className="h-5 w-5 text-[#31572C]" />
              <span className="text-[10px] font-bold">Find Home</span>
            </button>

            <button
              onClick={() => setActiveView('rentflow')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                activeView === 'rentflow' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-[10px] font-bold">Rent</span>
            </button>

            <button
              onClick={() => setActiveView('maintenance')}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                activeView === 'maintenance' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Wrench className="h-5 w-5" />
              <span className="text-[10px] font-bold">Repairs</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[#657D5C] transition"
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-bold">Menu</span>
            </button>
          </>
        ) : activeRole === 'estate_manager' ? (
          // EstateOS & Hospitality Host Bottom Nav
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeView === 'dashboard' || activeView === 'overview' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Trees className="h-5 w-5 text-[#31572C]" />
              <span className="text-[10px] font-bold">Host</span>
            </button>

            <button
              onClick={() => setActiveView('bookings')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeView === 'bookings' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Calendar className="h-5 w-5 text-rose-600" />
              <span className="text-[10px] font-bold">Bookings</span>
            </button>

            <button
              onClick={() => setActiveView('villas')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeView === 'villas' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Building className="h-5 w-5" />
              <span className="text-[10px] font-bold">Villas</span>
            </button>

            <button
              onClick={() => setActiveView('housekeeping')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeView === 'housekeeping' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <BedDouble className="h-5 w-5 text-[#4F772D]" />
              <span className="text-[10px] font-bold">Turnovers</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#657D5C] transition"
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-bold">Menu</span>
            </button>
          </>
        ) : (
          // Owner / Admin Bottom Nav
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeView === 'dashboard' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-[10px] font-bold">Home</span>
            </button>

            <button
              onClick={() => setActiveView('properties')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeView === 'properties' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Building className="h-5 w-5" />
              <span className="text-[10px] font-bold">Properties</span>
            </button>

            <button
              onClick={() => setActiveView('rentflow')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeView === 'rentflow' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-[10px] font-bold">Rent</span>
            </button>

            <button
              onClick={() => setActiveView('maintenance')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeView === 'maintenance' ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Wrench className="h-5 w-5" />
              <span className="text-[10px] font-bold">Repairs</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isMenuOpen ? 'text-[#132A13] font-black' : 'text-[#657D5C]'
              }`}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[10px] font-bold">Menu</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
