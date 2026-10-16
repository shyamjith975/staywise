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

  const [authMode, setAuthMode] = useState<'SIGNIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('SIGNIN');
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  // Sign In State - Start empty so newly registered accounts (e.g. test) can sign in cleanly
  const ALLOWED_LOGIN_ROLES: UserRole[] = ['owner', 'tenant', 'estate_manager'];
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const [signupPlan, setSignupPlan] = useState<'starter' | 'growth_pro' | 'enterprise'>('growth_pro');
  const [signupCycle, setSignupCycle] = useState<'monthly' | 'annual'>('annual');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Password Recovery State (P0.2)
  const [resetEmail, setResetEmail] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'REQUEST' | 'CONFIRM'>('REQUEST');
  const [resetStatus, setResetStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetStatus(null);
    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetStatus({ message: data.error || 'Failed to request reset.', isError: true });
      } else {
        setResetStatus({ message: data.message, isError: false });
        if (data.resetToken) {
          setResetTokenInput(data.resetToken);
          setResetStep('CONFIRM');
        }
      }
    } catch (e: any) {
      setResetStatus({ message: e.message || 'Network error.', isError: true });
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetStatus(null);
    try {
      const res = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetTokenInput, newPassword: resetNewPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetStatus({ message: data.error || 'Failed to reset password.', isError: true });
      } else {
        setResetStatus({ message: data.message, isError: false });
        setTimeout(() => {
          setAuthMode('SIGNIN');
          setResetStep('REQUEST');
          setPassword(resetNewPassword);
          setEmail(resetEmail);
          setResetStatus(null);
        }, 1500);
      }
    } catch (e: any) {
      setResetStatus({ message: e.message || 'Network error.', isError: true });
    } finally {
      setResetLoading(false);
    }
  };

  const activeCred = DEMO_CREDENTIALS[selectedRole] || DEMO_CREDENTIALS.owner;

  const handleFillDemoCredentials = (role: UserRole) => {
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
      city: 'Bangalore',
      subscriptionPlan: signupPlan,
      billingCycle: signupCycle
    });

    setSignupLoading(false);
    if (!res.success) {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#163B36] selection:text-white">
      
      {/* Navigation bar to return to Landing Page */}
      {onBackToLanding && (
        <div className="mb-4 w-full max-w-xl flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D2DDD7] text-[#263238] text-xs font-bold shadow-2xs hover:bg-[#E8F0EC] transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#163B36]" />
            <span>← Back to Website</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#163B36] border border-[#163B36] text-white text-xs font-black shadow-2xs hover:bg-[#102B27] transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C69A55]" />
            <span>Start Free Trial</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="mb-5 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#163B36] text-[#C69A55] flex items-center justify-center font-black text-sm shadow-xs">
            ✦
          </div>
          <span className="text-2xl font-black tracking-tight text-[#263238]">
            STAYWISE
          </span>
        </div>
        <p className="text-xs font-semibold text-[#546E7A]">
          Unified Property Operating System • Landlords, Estates &amp; Residents
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D2DDD7] space-y-6">
        
        {/* Sign In vs Sign Up Segmented Controller */}
        <div className="flex items-center p-1 rounded-full bg-[#E8F0EC] border border-[#D2DDD7]">
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNIN'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center cursor-pointer ${
              authMode === 'SIGNIN'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'SIGNUP'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C69A55]" />
            <span>Create Account</span>
          </button>
        </div>

        {/* MODE 1: SIGN IN */}
        {authMode === 'SIGNIN' ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-[#263238]">
                Sign In to Your Workspace
              </h2>
              <p className="text-xs text-[#546E7A] mt-0.5">
                Enter your registered email and password to access your dashboard
              </p>
            </div>

            {/* Login Error Alert */}
            {loginError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Primary Sign In Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. test@tenent.com or your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36] transition"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-[#546E7A]" />
                </div>
              </div>

              <div>
                <label className="block text-[#263238] font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36] transition"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#546E7A]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#546E7A] hover:text-[#263238]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <label className="flex items-center gap-1.5 text-[#546E7A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D2DDD7] text-[#163B36] focus:ring-[#163B36]"
                  />
                  <span>Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('FORGOT_PASSWORD');
                    setResetEmail(email);
                    setResetStatus(null);
                  }}
                  className="font-bold text-[#163B36] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-black text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating with SHA-256...' : 'Sign In'}
              </button>
            </form>

            {/* Collapsible / Distinct Demo Persona Quick Access */}
            <div className="pt-2 border-t border-[#D2DDD7]">
              <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#263238] flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-[#C69A55]" />
                    <span>Quick Demo Personas (1-Click Switcher)</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#163B36] text-white">
                    Demo
                  </span>
                </div>

                <p className="text-[11px] text-[#546E7A]">
                  Exploring Staywise? Click any persona below to load demo portfolios or instant sign in:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {ALLOWED_LOGIN_ROLES.map((role) => {
                    const cred = DEMO_CREDENTIALS[role];
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleFillDemoCredentials(role)}
                        className={`p-2 rounded-xl text-xs font-bold transition flex flex-col items-center text-center gap-1 border cursor-pointer ${
                          selectedRole === role && email === cred.email
                            ? 'bg-[#163B36] text-white border-[#163B36]'
                            : 'bg-white border-[#D2DDD7] text-[#263238] hover:bg-[#DCE8E1]'
                        }`}
                        title={`Fill ${cred.roleLabel} credentials`}
                      >
                        <span className="text-lg">{cred.avatar}</span>
                        <span className="font-bold text-[10px] leading-tight line-clamp-1">{cred.roleLabel.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-[#DCE8E1] text-[#163B36] border border-[#D2DDD7] text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Instant 1-Click Login as {activeCred.roleLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#C69A55]" />
                </button>
              </div>
            </div>

          </div>
        ) : authMode === 'FORGOT_PASSWORD' ? (
          /* MODE 3: FORGOT / RESET PASSWORD */
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#263238]">
                  Reset Your Password
                </h2>
                <p className="text-xs text-[#546E7A] mt-0.5">
                  Verify your account and create a new secure password
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGNIN');
                  setResetStatus(null);
                  setResetStep('REQUEST');
                }}
                className="text-xs font-bold text-[#546E7A] hover:text-[#163B36] cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>

            {resetStatus && (
              <div
                className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
                  resetStatus.isError
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{resetStatus.message}</span>
              </div>
            )}

            {resetStep === 'REQUEST' ? (
              <form onSubmit={handleRequestReset} className="space-y-3">
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. rajesh@staywise.app"
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                  <p className="text-[10px] text-[#546E7A] mt-1">
                    We will generate a time-limited HMAC-SHA256 reset token for this account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-black text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? 'Generating HMAC Token...' : 'Send Password Reset Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3">
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">
                    Security Reset Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetTokenInput}
                    onChange={(e) => setResetTokenInput(e.target.value)}
                    placeholder="Paste your 64-char HMAC token"
                    className="w-full p-2.5 font-mono text-[11px] rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>

                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">
                    New Secure Password (SHA-256 Encrypted)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setResetStep('REQUEST')}
                    className="w-1/3 py-2.5 rounded-full border border-[#D2DDD7] text-[#263238] font-bold text-xs hover:bg-[#E8F0EC] transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-black text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? 'Updating Hash...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* MODE 2: SIGN UP */
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-black text-[#263238]">
              Create Your Staywise Account
            </h2>

            {signupError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('owner')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold cursor-pointer ${
                      signupRole === 'owner'
                        ? 'border-[#163B36] bg-[#E8F0EC] text-[#163B36]'
                        : 'border-[#D2DDD7] bg-white text-[#263238] hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <div className="text-sm">👨‍💼 Property Owner</div>
                    <div className="text-[10px] text-[#546E7A] font-normal">Landlord / Portfolio</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('tenant')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold cursor-pointer ${
                      signupRole === 'tenant'
                        ? 'border-[#163B36] bg-[#E8F0EC] text-[#163B36]'
                        : 'border-[#D2DDD7] bg-white text-[#263238] hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <div className="text-sm">👨‍🎓 Tenant / Resident</div>
                    <div className="text-[10px] text-[#546E7A] font-normal">Renter / Resident</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('estate_manager')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold cursor-pointer ${
                      signupRole === 'estate_manager'
                        ? 'border-[#163B36] bg-[#E8F0EC] text-[#163B36]'
                        : 'border-[#D2DDD7] bg-white text-[#263238] hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <div className="text-sm">🏡 EstateOS Host</div>
                    <div className="text-[10px] text-[#546E7A] font-normal">Villas &amp; Keys</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('manager')}
                    className={`p-2.5 rounded-xl border text-left transition font-bold cursor-pointer ${
                      signupRole === 'manager'
                        ? 'border-[#163B36] bg-[#E8F0EC] text-[#163B36]'
                        : 'border-[#D2DDD7] bg-white text-[#263238] hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <div className="text-sm">🧑‍💻 Property Manager</div>
                    <div className="text-[10px] text-[#546E7A] font-normal">Operations &amp; Field</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="e.g. test or Anand Kumar"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="test@tenent.com"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                />
              </div>

              {/* Subscription Plan Picker for Owners & Property Managers */}
              {(signupRole === 'owner' || signupRole === 'estate_manager' || signupRole === 'manager') && (
                <div className="pt-2 border-t border-[#D2DDD7] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#263238] font-bold text-xs">
                      Choose Subscription Plan
                    </label>
                    <div className="flex items-center p-0.5 rounded-full bg-[#E8F0EC] border border-[#D2DDD7] text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSignupCycle('monthly')}
                        className={`px-2 py-0.5 rounded-full font-bold transition ${
                          signupCycle === 'monthly' ? 'bg-[#163B36] text-white' : 'text-[#546E7A]'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupCycle('annual')}
                        className={`px-2 py-0.5 rounded-full font-bold transition flex items-center gap-1 ${
                          signupCycle === 'annual' ? 'bg-[#163B36] text-white' : 'text-[#546E7A]'
                        }`}
                      >
                        <span>Annual</span>
                        <span className="text-[8px] bg-[#C69A55] text-white px-1 rounded-full font-black">
                          -17%
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'starter' as const,
                        name: 'Starter',
                        price: signupCycle === 'annual' ? '₹0' : '₹0',
                        period: 'forever',
                        units: 'Up to 5 units',
                        desc: 'Free tier for small landlords'
                      },
                      {
                        id: 'growth_pro' as const,
                        name: 'Growth Pro',
                        price: signupCycle === 'annual' ? '₹28,990' : '₹2,999',
                        period: signupCycle === 'annual' ? '/yr' : '/mo',
                        units: 'Up to 50 units',
                        popular: true,
                        desc: 'Full WhatsApp AI & OCR'
                      },
                      {
                        id: 'enterprise' as const,
                        name: 'Enterprise',
                        price: signupCycle === 'annual' ? '₹99,990' : '₹9,999',
                        period: signupCycle === 'annual' ? '/yr' : '/mo',
                        units: 'Unlimited units',
                        desc: 'Escrow, SLA & EstateOS'
                      }
                    ].map(plan => {
                      const isSelected = signupPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSignupPlan(plan.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#163B36] bg-[#E8F0EC] ring-1 ring-[#163B36]'
                              : 'border-[#D2DDD7] bg-white hover:border-[#163B36]/50'
                          }`}
                        >
                          {plan.popular && (
                            <span className="absolute -top-2 right-2 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-[#C69A55] text-white rounded-full">
                              Popular
                            </span>
                          )}
                          <div>
                            <div className="font-extrabold text-[11px] text-[#263238] flex items-center justify-between">
                              <span>{plan.name}</span>
                              <span className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#163B36] bg-[#163B36]' : 'border-[#D2DDD7]'
                              }`}>
                                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <div className="text-[12px] font-black text-[#163B36] mt-0.5">
                              {plan.price}<span className="text-[9px] font-normal text-[#546E7A]">{plan.period}</span>
                            </div>
                          </div>
                          <div className="text-[9px] text-[#546E7A] mt-1 pt-1 border-t border-[#D2DDD7]">
                            {plan.units}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-black text-xs transition cursor-pointer disabled:opacity-50"
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
