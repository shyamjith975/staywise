'use client';

import React, { useState } from 'react';
import { useAppState, DEMO_CREDENTIALS, DemoCredential } from '../../context/AppStateContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  KeyRound,
  UserCheck,
  Building,
  MapPin,
  Phone,
  User,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import TrialAutopayModal from '../landing/TrialAutopayModal';

interface LoginViewProps {
  onBackToLanding?: () => void;
}

export default function LoginView({ onBackToLanding }: LoginViewProps) {
  const { login, signupUser } = useAppState();

  const [authMode, setAuthMode] = useState<'SIGNIN' | 'SIGNUP'>('SIGNIN');
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  // Sign In State
  const ALLOWED_LOGIN_ROLES: UserRole[] = ['owner', 'tenant', 'estate_manager'];
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.owner.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.owner.pass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State (Strictly Owner and EstateOS)
  const [signupRole, setSignupRole] = useState<'owner' | 'estate_manager'>('owner');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPortfolio, setSignupPortfolio] = useState('');
  const [signupCity, setSignupCity] = useState('Bangalore');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupLoading(true);

    const res = await signupUser({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      phone: signupPhone,
      role: signupRole,
      portfolioName: signupPortfolio,
      city: signupCity
    });

    setSignupLoading(false);
    if (!res.success) {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#edece6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Navigation bar to return to Landing Page */}
      {onBackToLanding && (
        <div className="mb-4 w-full max-w-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#e3e1d8] text-[#19251f] text-xs font-bold shadow-sm hover:bg-[#f4f3ef] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#274235]" />
            <span>← Back to Website &amp; Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-sm hover:bg-emerald-100 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Start 7-Day Trial (₹0 Today)</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="mb-5 text-center space-y-2">
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

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(25,37,31,0.06)] border border-[#e3e1d8] space-y-6">
        
        {/* Sign In vs Sign Up Segmented Controller */}
        <div className="flex items-center p-1 rounded-2xl bg-[#f4f3ef] border border-[#e3e1d8]">
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNIN'); setSignupError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition text-center ${
              authMode === 'SIGNIN'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            Sign In to Existing Workspace
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition text-center flex items-center justify-center gap-1.5 ${
              authMode === 'SIGNUP'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Register Owner / EstateOS</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MODE 1: SIGN IN                                     */}
        {/* ---------------------------------------------------- */}
        {authMode === 'SIGNIN' ? (
          <div className="space-y-6">
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
                  <span>Temporary Demo ID &amp; Password ({activeCred.roleLabel})</span>
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
        ) : (
          /* ---------------------------------------------------- */
          /* MODE 2: SIGN UP FOR OWNER & ESTATEOS                 */
          /* ---------------------------------------------------- */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#19251f]">
                  Create Asset Operator Account
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200">
                  Instant Setup
                </span>
              </div>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Register as a Property Owner or EstateOS Hospitality Host to manage rentals, escrow deposits, and smart key check-ins.
              </p>
            </div>

            {/* Error Message Box */}
            {signupError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{signupError}</span>
              </div>
            )}

            {/* Role Selection: Owner vs EstateOS */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6e7972] mb-2">
                Select Your Operator Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSignupRole('owner')}
                  className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between ${
                    signupRole === 'owner'
                      ? 'border-[#274235] bg-[#eef3f0] ring-2 ring-[#274235]/20'
                      : 'border-[#e3e1d8] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">👨‍💼</span>
                    {signupRole === 'owner' && (
                      <CheckCircle2 className="h-4 w-4 text-[#274235]" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="font-extrabold text-sm text-[#19251f]">Property Owner / Landlord</div>
                    <div className="text-[11px] text-[#6e7972] mt-0.5 leading-tight">
                      Residential apartments, PG co-living homes &amp; commercial hubs.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupRole('estate_manager')}
                  className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between ${
                    signupRole === 'estate_manager'
                      ? 'border-[#274235] bg-[#eef3f0] ring-2 ring-[#274235]/20'
                      : 'border-[#e3e1d8] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏡</span>
                    {signupRole === 'estate_manager' && (
                      <CheckCircle2 className="h-4 w-4 text-[#274235]" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="font-extrabold text-sm text-[#19251f]">EstateOS Hospitality Host</div>
                    <div className="text-[11px] text-[#6e7972] mt-0.5 leading-tight">
                      Luxury villas, boutique resort collections &amp; Airbnb stay keys.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Work Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="vikram@realty.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Portfolio / Brand Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupPortfolio}
                      onChange={(e) => setSignupPortfolio(e.target.value)}
                      placeholder={signupRole === 'owner' ? "e.g. Royal Heights Realty" : "e.g. Malabar Heritage Villas"}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Primary Operational City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupCity}
                      onChange={(e) => setSignupCity(e.target.value)}
                      placeholder="e.g. Bangalore, Thiruvananthapuram"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-semibold focus:outline-none focus:border-[#274235] focus:bg-white transition"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>
              </div>

              {/* Trust & Escrow Guarantee Pill */}
              <div className="p-3 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center gap-2 text-[11px] text-[#6e7972]">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  By signing up, your workspace is connected to Staywise RBI-compliant escrow rails and double-entry accounting.
                </span>
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-extrabold text-sm shadow-xl shadow-[#274235]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {signupLoading ? (
                  <span>Initializing Your Asset Portal...</span>
                ) : (
                  <>
                    <span>Create {signupRole === 'owner' ? 'Owner' : 'EstateOS'} Account &amp; Launch</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#e3e1d8]">
              <button
                type="button"
                onClick={() => setAuthMode('SIGNIN')}
                className="text-xs font-bold text-[#274235] hover:underline"
              >
                Already have an account? Sign In here
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 7-Day Trial Modal */}
      <TrialAutopayModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
      />
    </div>
  );
}

