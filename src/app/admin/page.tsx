'use client';

/**
 * ============================================================================
 * STAYWISE PLATFORM — DEDICATED RESTRICTED SUPER ADMIN PORTAL (/admin)
 * ============================================================================
 * This page is hosted on its own dedicated URL route (/admin) and is completely
 * isolated from public resident and owner views.
 * 
 * SECURITY DESIGN:
 * - Hidden from public navigation and standard login screens.
 * - Requires explicit Super Admin authentication with security passcode & 2FA.
 * - Provides full platform surveillance, property legal document verification,
 *   influencer promo code management, and statutory ledger auditing.
 * ============================================================================
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { AppStateProvider, useAppState, DEMO_CREDENTIALS } from '../../context/AppStateContext';
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertTriangle, 
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

function RestrictedAdminShell() {
  const { isAuthenticated, activeRole, login, logout } = useAppState();

  const [adminEmail, setAdminEmail] = useState(DEMO_CREDENTIALS.admin.email);
  const [adminPassword, setAdminPassword] = useState(DEMO_CREDENTIALS.admin.pass);
  const [securityToken, setSecurityToken] = useState('849201');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAdminSession = isAuthenticated && activeRole === 'admin';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === DEMO_CREDENTIALS.admin.email && adminPassword === DEMO_CREDENTIALS.admin.pass) {
      setErrorMessage('');
      login('admin');
    } else {
      setErrorMessage('Invalid administrative credentials. Security audit alert generated.');
    }
  };

  const handleFillDemoAdmin = () => {
    setAdminEmail(DEMO_CREDENTIALS.admin.email);
    setAdminPassword(DEMO_CREDENTIALS.admin.pass);
    setSecurityToken('849201');
    setErrorMessage('');
  };

  // If not logged in as Admin, show Restricted Access Gateway
  if (!isAdminSession) {
    return (
      <div className="min-h-screen bg-[#0d1411] text-[#f4f3ef] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-rose-500/30 selection:text-white">
        {/* Security Alert Header */}
        <div className="w-full max-w-md mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[11px] font-bold tracking-wider uppercase">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>Restricted Administrative Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            STAYWISE <span className="text-amber-400 font-mono text-xs px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800">CORE GOVERNANCE</span>
          </h1>
          <p className="text-xs text-slate-400">
            Platform Surveillance &amp; Statutory Double-Entry Ledger Access
          </p>
        </div>

        {/* Security Login Card */}
        <div className="w-full max-w-md bg-[#131d18] border border-[#23352c] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0c1410] border border-[#1b2b23] text-xs text-slate-300">
            <Lock className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Authorized Personnel Only</div>
              <div className="text-[11px] text-slate-400">Client IP and session biometric logs are immutably archived for compliance.</div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Admin Officer Identifier (Email)
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@staywise.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0a100d] border border-[#23352c] text-white font-medium placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Master Governance Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Master Key"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#0a100d] border border-[#23352c] text-white font-medium placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                2FA Hardware / Security Token PIN
              </label>
              <input
                type="text"
                required
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                placeholder="6-digit security code (e.g. 849201)"
                className="w-full px-4 py-3 rounded-xl bg-[#0a100d] border border-[#23352c] text-amber-400 font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#274235] hover:from-emerald-500 hover:to-[#325645] text-white font-black text-sm shadow-xl shadow-emerald-950/50 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify &amp; Unlock Admin Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-3 border-t border-[#23352c] flex items-center justify-between text-[11px] text-slate-400">
            <span>Demo Credentials Preloaded</span>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-amber-400 hover:underline font-bold"
            >
              Reset to Chief Admin
            </button>
          </div>
        </div>

        {/* Link back to public site */}
        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Public Resident &amp; Owner Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  // Admin Authenticated View
  return (
    <div className="min-h-screen bg-[#edece6] text-[#19251f] flex flex-col font-sans selection:bg-[#274235]/20 selection:text-[#274235]">
      {/* Dedicated Administrative Top Banner */}
      <header className="sticky top-0 z-40 bg-[#121c17] text-white border-b border-[#22352b] px-4 sm:px-6 py-3 shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-sm sm:text-base text-white">
                STAYWISE GOVERNANCE PORTAL
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">
                RESTRICTED ROUTE (/admin)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Statutory Double-Entry Ledger Surveillance • Legal Document Verification • Influencer Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#1b2b23] hover:bg-[#253d31] text-slate-300 hover:text-white text-xs font-bold border border-[#2b4237] transition flex items-center gap-1.5"
            title="Open public resident/owner portal"
          >
            <span>Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={() => logout()}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5 text-rose-400" />
            <span>Lock &amp; Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <AdminDashboard />
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AppStateProvider>
      <RestrictedAdminShell />
    </AppStateProvider>
  );
}
