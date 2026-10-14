'use client';

import React, { useState } from 'react';
import { useAppState, DEMO_CREDENTIALS } from '../../context/AppStateContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  KeyRound,
  AlertCircle
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
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up State
  const [signupRole, setSignupRole] = useState<UserRole>('owner');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const activeCred = DEMO_CREDENTIALS[selectedRole] || DEMO_CREDENTIALS.owner;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].pass);
    setLoginError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Invalid credentials. Please verify your email and password.');
        setLoginLoading(false);
        return;
      }

      const u = data.user;
      login(u.role, {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        roleLabel: u.roleLabel,
        avatar: u.avatar,
        title: u.title,
        description: u.description
      });
    } catch (err: any) {
      setLoginError(err.message || 'Network connection failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
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
      portfolioName: `${signupName}'s Portfolio`,
      city: 'Bangalore'
    });

    setSignupLoading(false);
    if (!res.success) {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#c0c0c0] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#e10600] selection:text-white">
      
      {/* Navigation bar to return to Landing Page */}
      {onBackToLanding && (
        <div className="mb-4 w-full max-w-xl flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#B5B5B5] text-[#2a2a2a] text-xs font-bold shadow-2xs hover:bg-[#f0f0f0] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#e10600]" />
            <span>← Back to Website</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e10600] border border-[#e10600] text-white text-xs font-black shadow-2xs hover:bg-[#c50500] transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>Start Free Trial</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="mb-5 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#2a2a2a] text-[#e10600] flex items-center justify-center font-black text-sm shadow-xs">
            ✦
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2a2a2a]">
            STAYWISE
          </span>
        </div>
        <p className="text-xs font-semibold text-[#666666]">
          Unified Property Operating System • Landlords, Estates &amp; Residents
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#B5B5B5] space-y-6">
        
        {/* Sign In vs Sign Up Segmented Controller */}
        <div className="flex items-center p-1 rounded-full bg-[#f0f0f0] border border-[#B5B5B5]">
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNIN'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center ${
              authMode === 'SIGNIN'
                ? 'bg-[#2a2a2a] text-[#e10600] shadow-xs'
                : 'text-[#666666] hover:text-[#2a2a2a]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
              authMode === 'SIGNUP'
                ? 'bg-[#2a2a2a] text-[#e10600] shadow-xs'
                : 'text-[#666666] hover:text-[#2a2a2a]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#e10600]" />
            <span>Create Account</span>
          </button>
        </div>

        {/* MODE 1: SIGN IN */}
        {authMode === 'SIGNIN' ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-[#2a2a2a]">
                Sign In to Workspace
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Select your persona to access customized dashboards
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#f0f0f0] rounded-2xl border border-[#B5B5B5]">
              {ALLOWED_LOGIN_ROLES.map((role) => {
                const cred = DEMO_CREDENTIALS[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center text-center gap-1 ${
                      isSelected
                        ? 'bg-[#2a2a2a] text-[#e10600] shadow-2xs border border-[#e10600]'
                        : 'text-[#2a2a2a] hover:text-[#e10600] hover:bg-white'
                    }`}
                  >
                    <span className="text-xl">{cred.avatar}</span>
                    <span className="font-extrabold text-[11px] leading-tight line-clamp-1">{cred.roleLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Demo ID & Password Quick Login Banner */}
            <div className="p-3.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2a2a2a] flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-[#e10600]" />
                  <span>Demo ID &amp; Password ({activeCred.roleLabel})</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#e10600] text-white">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-white border border-[#B5B5B5] truncate">
                  <span className="text-[#666666] mr-1">ID:</span>
                  <span className="font-bold text-[#2a2a2a]">{activeCred.email}</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#B5B5B5] truncate">
                  <span className="text-[#666666] mr-1">Pass:</span>
                  <span className="font-bold text-[#2a2a2a]">{activeCred.pass}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className="w-full py-2 rounded-xl bg-[#e10600] hover:bg-[#c50500] text-white text-xs font-black shadow-xs transition flex items-center justify-center gap-1"
              >
                <span>Instant Login as {activeCred.roleLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Login Error Alert */}
            {loginError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#2a2a2a] font-bold mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600] transition"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-[#666666]" />
                </div>
              </div>

              <div>
                <label className="block text-[#2a2a2a] font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600] transition"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#666666]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#666666] hover:text-[#2a2a2a]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white font-black text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating with SQLite...' : 'Sign In'}
              </button>
            </form>
          </div>
        ) : (
          /* MODE 2: SIGN UP */
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-black text-[#2a2a2a]">
              Create Your Account
            </h2>

            {signupError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('owner')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold ${
                      signupRole === 'owner'
                        ? 'border-[#e10600] bg-red-50/50 text-[#e10600]'
                        : 'border-[#B5B5B5] bg-[#f0f0f0] text-[#2a2a2a]'
                    }`}
                  >
                    <div className="text-sm">👨‍💼 Property Owner</div>
                    <div className="text-[10px] text-[#666666] font-normal">Landlord / Portfolio</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('tenant')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold ${
                      signupRole === 'tenant'
                        ? 'border-[#e10600] bg-red-50/50 text-[#e10600]'
                        : 'border-[#B5B5B5] bg-[#f0f0f0] text-[#2a2a2a]'
                    }`}
                  >
                    <div className="text-sm">👨‍🎓 Tenant / Resident</div>
                    <div className="text-[10px] text-[#666666] font-normal">Renter / Resident</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('estate_manager')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold ${
                      signupRole === 'estate_manager'
                        ? 'border-[#e10600] bg-red-50/50 text-[#e10600]'
                        : 'border-[#B5B5B5] bg-[#f0f0f0] text-[#2a2a2a]'
                    }`}
                  >
                    <div className="text-sm">🏡 EstateOS Host</div>
                    <div className="text-[10px] text-[#666666] font-normal">Villas &amp; Keys</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('manager')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold ${
                      signupRole === 'manager'
                        ? 'border-[#e10600] bg-red-50/50 text-[#e10600]'
                        : 'border-[#B5B5B5] bg-[#f0f0f0] text-[#2a2a2a]'
                    }`}
                  >
                    <div className="text-sm">🧑‍💻 Property Manager</div>
                    <div className="text-[10px] text-[#666666] font-normal">Operations &amp; Field</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#666666] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600]"
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="anand@staywise.app"
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600]"
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600]"
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e10600]"
                />
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white font-black text-xs transition cursor-pointer disabled:opacity-50"
              >
                {signupLoading ? 'Onboarding & Initializing SQLite...' : `Complete ${signupRole === 'tenant' ? 'Tenant' : signupRole === 'owner' ? 'Owner' : 'User'} Onboarding`}
              </button>
            </form>
          </div>
        )}

      </div>

      {isTrialModalOpen && (
        <TrialAutopayModal 
          isOpen={isTrialModalOpen} 
          onClose={() => setIsTrialModalOpen(false)} 
        />
      )}
    </div>
  );
}
