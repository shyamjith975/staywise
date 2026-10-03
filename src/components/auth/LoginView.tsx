'use client';

import React, { useState } from 'react';
import { useAppState, DEMO_CREDENTIALS, DemoCredential } from '../../context/AppStateContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function LoginView() {
  const { login } = useAppState();

  const ALLOWED_LOGIN_ROLES: UserRole[] = ['owner', 'tenant', 'estate_manager'];

  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.owner.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.owner.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const activeCred = DEMO_CREDENTIALS[selectedRole] || DEMO_CREDENTIALS.owner;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].pass);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-[#edece6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#274235] text-white flex items-center justify-center shadow-lg shadow-[#274235]/25">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
            </svg>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-[#19251f]">
            STAYWISE
          </span>
        </div>
        <p className="text-sm font-medium text-[#6e7972]">
          The Operating System for Rental &amp; Real Estate Assets
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(25,37,31,0.06)] border border-[#e3e1d8] space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-[#19251f]">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Select your account type to access role-specific permissions and dashboards
          </p>
        </div>

        {/* Role Selector Tabs (Owner, Tenant, EstateOS) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6e7972] mb-2">
            Select Account Type
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#f4f3ef] rounded-2xl border border-[#e3e1d8]/80">
            {ALLOWED_LOGIN_ROLES.map((role) => {
              const cred = DEMO_CREDENTIALS[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center text-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#19251f] shadow-md border border-[#e3e1d8]'
                      : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white/50'
                  }`}
                >
                  <span className="text-xl">{cred.avatar}</span>
                  <span className="font-extrabold text-[11px] leading-tight line-clamp-2">{cred.roleLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Temporary Credentials Banner */}
        <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#274235] flex items-center gap-1.5">
              <KeyRound className="h-4 w-4" />
              <span>Temporary Demo ID & Password ({activeCred.roleLabel})</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#274235] text-white">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-white border border-[#e3e1d8] flex justify-between items-center">
              <span className="text-[#6e7972] text-[11px]">ID:</span>
              <span className="font-bold text-[#19251f] select-all">{activeCred.email}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e3e1d8] flex justify-between items-center">
              <span className="text-[#6e7972] text-[11px]">Pass:</span>
              <span className="font-bold text-[#19251f] select-all">{activeCred.pass}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#6e7972]">{activeCred.description}</span>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="px-3.5 py-1.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-sm transition flex items-center gap-1 shrink-0"
            >
              <span>Instant Login</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#19251f] font-semibold mb-1">
              Email / Mobile ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@staywise.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white transition"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#95a099]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#19251f] font-semibold">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert(`Your temp password is: ${activeCred.pass}`); }} className="text-[#274235] hover:underline font-semibold text-[11px]">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white transition"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#95a099]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#95a099] hover:text-[#19251f]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-[#6e7972]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#e3e1d8] text-[#274235] focus:ring-[#274235]"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-sm shadow-xl shadow-[#274235]/20 transition flex items-center justify-center gap-2"
          >
            <span>Sign In as {activeCred.roleLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo Access Bar at Bottom */}
        <div className="pt-2 border-t border-[#e3e1d8] text-center">
          <div className="text-[11px] font-bold text-[#6e7972] mb-2 uppercase tracking-wider">
            Quick Persona Switch
          </div>
          <div className="flex justify-center gap-2">
            {ALLOWED_LOGIN_ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickDemoLogin(role)}
                className="px-3.5 py-1.5 rounded-xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] text-xs font-semibold border border-[#e3e1d8] transition flex items-center gap-1.5"
              >
                <span>{DEMO_CREDENTIALS[role].avatar}</span>
                <span>{DEMO_CREDENTIALS[role].roleLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
