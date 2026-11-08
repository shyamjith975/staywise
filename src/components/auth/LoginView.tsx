'use client';

import React, { useState, useRef } from 'react';
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
  AlertCircle,
  User,
  Phone,
  CheckCircle2,
  X,
  CreditCard,
  Smartphone,
  Loader2
} from 'lucide-react';
import { color } from '../../lib/colors';
import TrialAutopayModal from '../landing/TrialAutopayModal';

interface LoginViewProps {
  onBackToLanding?: () => void;
}

export default function LoginView({ onBackToLanding }: LoginViewProps) {
  const { login, signupUser } = useAppState();

  const [authMode, setAuthMode] = useState<'SIGNIN' | 'SIGNUP' | 'FORGOT_PASSWORD'>('SIGNIN');
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [showMethodDrawer, setShowMethodDrawer] = useState(false);
  const methodDrawerRef = useRef<HTMLDivElement>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  // Sign In State
  const ALLOWED_LOGIN_ROLES: UserRole[] = ['owner', 'tenant', 'estate_manager', 'admin'];
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [email, setEmail] = useState('owner@staywise.com');
  const [password, setPassword] = useState('Owner@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign Up State
  const [signupRole, setSignupRole] = useState<UserRole>('owner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Password Recovery State
  const [resetEmail, setResetEmail] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'REQUEST' | 'CONFIRM'>('REQUEST');
  const [resetStatus, setResetStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const toggleMethodDrawer = () => {
    const nextState = !showMethodDrawer;
    setShowMethodDrawer(nextState);
    if (nextState) {
      setTimeout(() => {
        methodDrawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetStatus(null);
    try {
      const res = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: resetEmail })
      });
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.success) {
        setResetStatus({ message: data?.error || 'Failed to request reset.', isError: true });
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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token: resetTokenInput, newPassword: resetNewPassword })
      });
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.success) {
        setResetStatus({ message: data?.error || 'Failed to reset password.', isError: true });
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
    setAuthMode('SIGNIN');
    setLoginError(null);
    setShowMethodDrawer(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const clean = val.trim().toLowerCase();
    const shortcuts: Record<string, { email: string; pass: string; role: UserRole }> = {
      owner: { email: 'owner@staywise.com', pass: 'Owner@123', role: 'owner' },
      tenant: { email: 'tenant@staywise.com', pass: 'Tenant@123', role: 'tenant' },
      estate: { email: 'estate@staywise.com', pass: 'Estate@123', role: 'estate_manager' },
      estate_manager: { email: 'estate@staywise.com', pass: 'Estate@123', role: 'estate_manager' },
      admin: { email: 'admin@staywise.com', pass: 'admin@123', role: 'admin' },
    };
    if (shortcuts[clean] && !val.includes('@')) {
      setSelectedRole(shortcuts[clean].role);
      if (!password) {
        setPassword(shortcuts[clean].pass);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const cleanEmail = email.trim();
    const cleanLower = cleanEmail.toLowerCase();
    const shortcuts: Record<string, { email: string; pass: string; role: UserRole }> = {
      owner: { email: 'owner@staywise.com', pass: 'Owner@123', role: 'owner' },
      tenant: { email: 'tenant@staywise.com', pass: 'Tenant@123', role: 'tenant' },
      estate: { email: 'estate@staywise.com', pass: 'Estate@123', role: 'estate_manager' },
      estate_manager: { email: 'estate@staywise.com', pass: 'Estate@123', role: 'estate_manager' },
      admin: { email: 'admin@staywise.com', pass: 'admin@123', role: 'admin' },
    };

    const effectiveEmail = (!cleanEmail.includes('@') && shortcuts[cleanLower]) 
      ? shortcuts[cleanLower].email 
      : cleanEmail;
    const effectivePass = (!password && shortcuts[cleanLower]) 
      ? shortcuts[cleanLower].pass 
      : password;
    const effectiveRole = shortcuts[cleanLower] 
      ? shortcuts[cleanLower].role 
      : selectedRole;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: effectiveEmail, password: effectivePass, role: effectiveRole })
      });

      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.warn('[Staywise Auth] Non-JSON login response:', responseText);
      }

      if (!res.ok || !data || !data.success) {
        setLoginError(data?.error || 'Invalid email or password. User is not registered in the database.');
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
      }, data.token);
    } catch {
      setLoginError('Authentication server unreachable. Please check your connection.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setLoginLoading(true);
    setLoginError(null);
    const cred = DEMO_CREDENTIALS[role];
    if (!cred) {
      setLoginError('Invalid demo role selected.');
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: cred.email, password: cred.pass, role })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data?.error || `Account ${cred.email} is not listed in the database. Please seed the database or sign up.`);
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
      }, data.token);
    } catch {
      setLoginError('Authentication server unreachable. Please verify database connectivity.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminTempLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    setSelectedRole('admin');
    setEmail('admin@staywise.com');
    setPassword('admin@123');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: 'admin@staywise.com', password: 'admin@123', role: 'admin' })
      });
      const responseText = await res.text();
      let data: any = null;
      try { data = JSON.parse(responseText); } catch {}

      if (!res.ok || !data || !data.success) {
        setLoginError(data?.error || 'Admin account is not registered in the database.');
        setLoginLoading(false);
        return;
      }

      const u = data.user;
      login('admin', {
        id: u.id,
        email: u.email,
        name: u.name,
        role: 'admin',
        roleLabel: u.roleLabel || 'Super Admin',
        avatar: u.avatar || '🛡️',
        title: u.title || 'Platform Governance & Risk',
        description: u.description || 'Statutory Double-Entry Ledger Surveillance'
      }, data.token);
    } catch {
      setLoginError('Authentication server unreachable. Please verify database connectivity.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'New Member';
    const res = await signupUser({
      name: fullName,
      email: signupEmail,
      password: signupPassword,
      phone: signupPhone || '+91 98450 00000',
      role: signupRole,
      portfolioName: `${fullName}'s Portfolio`,
      city: 'Bangalore',
      subscriptionPlan: 'growth_pro',
      billingCycle: 'annual'
    });

    setSignupLoading(false);
    if (!res.success) {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  // Social Login Simulation Handlers
  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      // Auto-connect with verified demo account according to selected role
      login(selectedRole, {
        name: provider === 'google' ? 'Vikram Singhania (Google)' : 'Vikram Singhania (Apple ID)',
        email: provider === 'google' ? 'vikram.singhania@gmail.com' : 'vikram.singhania@icloud.com',
        role: selectedRole
      });
    }, 800);
  };

  const handleOtpSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone || otpPhone.length < 10) return;
    setOtpLoading(true);
    setOtpError(null);
    setOtpHint(null);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'send', phone: otpPhone })
      });
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.success) {
        setOtpError(data?.error || 'Failed to dispatch verification code.');
      } else {
        setOtpSent(true);
        if (data.devHint) setOtpHint(data.devHint);
      }
    } catch {
      setOtpError('Network error sending OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'verify', phone: otpPhone, code: otpCode })
      });
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.success) {
        setOtpError(data?.error || 'Invalid or expired verification code.');
      } else {
        setIsOtpModalOpen(false);
        login('tenant', data.user);
      }
    } catch {
      setOtpError('Verification connection failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06110c] text-white flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#a31c1b] selection:text-[#06110c]">
      
      {/* Background Layer: Mountain Landscape with Cinematic Vignette & Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none transform scale-105"
        style={{ backgroundImage: `url('/images/hero-mountain-valley.jpg')` }}
      />
      {/* Dark Ambient Vignette / Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06110c] via-[#06110c]/95 to-[#06110c]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06110c] via-transparent to-[#06110c]/80 pointer-events-none" />

      {/* Decorative Organic Curved Dashed Line */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" 
        preserveAspectRatio="none" 
        viewBox="0 0 1000 800"
      >
        <path
          d="M 540,0 C 470,180 620,320 480,500 C 420,580 490,700 460,800"
          fill="none"
          stroke={color('crimson')}
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#06110c] text-[#a31c1b] border border-[#a31c1b]/40 flex items-center justify-center font-black text-xs shadow-md shadow-black/40 group-hover:scale-105 transition">
            ✦
          </div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center">
            Staywise<span className="text-[#a31c1b]">.</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8 text-xs font-bold text-slate-300">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="hover:text-white transition cursor-pointer"
            >
              Home
            </button>
          )}

          {authMode === 'SIGNUP' ? (
            <button
              type="button"
              onClick={() => { setAuthMode('SIGNIN'); setLoginError(null); }}
              className="hover:text-white transition cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
              className="hover:text-white transition cursor-pointer"
            >
              Join
            </button>
          )}
        </div>
      </header>

      {/* MAIN FORM CANVAS */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md">
          
          {/* Eyebrow / Tagline */}
          <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#a31c1b] mb-1.5 flex items-center gap-1.5">
            {authMode === 'SIGNUP' && <span>START FOR FREE</span>}
            {authMode === 'SIGNIN' && <span>WELCOME BACK</span>}
            {authMode === 'FORGOT_PASSWORD' && <span>ACCOUNT RECOVERY</span>}
          </div>

          {/* Heading with accent dot */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white mb-2 leading-tight">
            {authMode === 'SIGNUP' && (
              <>Create new account<span className="text-[#a31c1b]">.</span></>
            )}
            {authMode === 'SIGNIN' && (
              <>Sign in to workspace<span className="text-[#a31c1b]">.</span></>
            )}
            {authMode === 'FORGOT_PASSWORD' && (
              <>Reset your password<span className="text-[#a31c1b]">.</span></>
            )}
          </h1>

          {/* Subtitle / Mode Toggle */}
          <div className="text-xs text-slate-400 mb-6 font-medium">
            {authMode === 'SIGNUP' && (
              <span>
                Already A Member?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('SIGNIN'); setLoginError(null); }}
                  className="text-[#a31c1b] hover:text-[#d8ad69] font-bold transition cursor-pointer underline underline-offset-2"
                >
                  Log In
                </button>
              </span>
            )}
            {authMode === 'SIGNIN' && (
              <span>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
                  className="text-[#a31c1b] hover:text-[#d8ad69] font-bold transition cursor-pointer underline underline-offset-2"
                >
                  Sign Up
                </button>
              </span>
            )}
            {authMode === 'FORGOT_PASSWORD' && (
              <span>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('SIGNIN'); setResetStatus(null); }}
                  className="text-[#a31c1b] hover:text-[#d8ad69] font-bold transition cursor-pointer underline underline-offset-2"
                >
                  Return to Sign In
                </button>
              </span>
            )}
          </div>

          {/* ========================================================================= */}
          {/* MODE 1: CREATE NEW ACCOUNT (SIGN UP)                                      */}
          {/* ========================================================================= */}
          {authMode === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Choose your account role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'owner', label: 'Owner / Landlord' },
                    { id: 'tenant', label: 'Tenant / Resident' },
                    { id: 'estate_manager', label: 'Estate Host' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSignupRole(r.id as UserRole)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition text-center border cursor-pointer ${
                        signupRole === r.id
                          ? 'bg-[#06110c] text-[#a31c1b] border-[#a31c1b]/60 shadow-sm'
                          : 'bg-[#112421]/80 text-slate-400 border-[#1D3D37] hover:border-[#2D5A51]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* First Name & Last Name (Side by Side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Vikram"
                    className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8"
                  />
                  <User className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Singhania"
                    className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8"
                  />
                  <CreditCard className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Email Address */}
              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. vikram@staywise.com"
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8"
                />
                <Mail className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Password with Active Glow */}
              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  Password
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3.5 top-5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Signup Error Alert */}
              {signupError && (
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Bottom Action Buttons Row */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMethodDrawer}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-bold border border-[#1D3D37] transition cursor-pointer shrink-0"
                >
                  Change method
                </button>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="flex-1 py-3 px-6 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black border border-[#23534B] shadow-lg shadow-[#06110c]/50 transition cursor-pointer disabled:opacity-50 text-center"
                >
                  {signupLoading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: SIGN IN TO WORKSPACE                                              */}
          {/* ========================================================================= */}
          {authMode === 'SIGNIN' && (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              
              {/* Role Context Bar */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-[10px] font-semibold text-slate-400">Sign in as</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['owner', 'tenant', 'estate_manager', 'admin'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        const cred = DEMO_CREDENTIALS[r];
                        if (cred) {
                          setEmail(cred.email);
                          setPassword(cred.pass);
                          setLoginError(null);
                        }
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition capitalize cursor-pointer border ${
                        selectedRole === r 
                          ? 'bg-[#06110c] text-[#a31c1b] border-[#a31c1b]/40 shadow-xs' 
                          : 'bg-white/5 text-slate-400 hover:text-white border-transparent'
                      }`}
                    >
                      {r === 'estate_manager' ? 'Estate' : r === 'admin' ? '🛡️ Admin' : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  Email
                </label>
                <input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="e.g. owner@staywise.com (or owner, tenant, estate)"
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8"
                />
                <Mail className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Password Input */}
              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Remember Session & Forgot Password Links */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#1D3D37] bg-white/5 text-[#06110c] focus:ring-[#a31c1b]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('FORGOT_PASSWORD');
                    setResetEmail(email);
                    setResetStatus(null);
                  }}
                  className="font-bold text-[#a31c1b] hover:text-[#d8ad69] transition cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Super Admin Temp Pass Login Card */}
              <div className="p-3 rounded-2xl bg-[#0a1f18]/90 border border-[#23534B] flex items-center justify-between gap-3 text-xs shadow-inner">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-white">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#a31c1b]" />
                    <span>Admin Temp Pass Option</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    <span className="text-white/80 font-mono">admin@staywise.com</span> • pass: <span className="text-white/80 font-mono">admin@123</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAdminTempLogin}
                  disabled={loginLoading}
                  className="px-3.5 py-1.5 rounded-full bg-[#a31c1b] hover:bg-[#851615] text-white text-[11px] font-black transition cursor-pointer shrink-0 shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>1-Click Admin</span>
                </button>
              </div>

              {/* Login Error Alert */}
              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Bottom Action Buttons Row */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMethodDrawer}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-bold border border-[#1D3D37] transition cursor-pointer shrink-0"
                >
                  Change method
                </button>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 py-3 px-6 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black border border-[#23534B] shadow-lg shadow-[#06110c]/50 transition cursor-pointer disabled:opacity-50 text-center"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* MODE 3: FORGOT PASSWORD                                                   */}
          {/* ========================================================================= */}
          {authMode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              {resetStatus && (
                <div
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
                    resetStatus.isError
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{resetStatus.message}</span>
                </div>
              )}

              {resetStep === 'REQUEST' ? (
                <form onSubmit={handleRequestReset} className="space-y-3.5">
                  <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] hover:border-[#2D5A51] focus-within:border-[#a31c1b] focus-within:ring-2 focus-within:ring-[#a31c1b]/30 transition-all p-3 relative">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. your.email@staywise.com"
                      className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none pr-8"
                    />
                    <Mail className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('SIGNIN')}
                      className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-[#1D3D37] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 py-3 px-6 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black border border-[#23534B] shadow-lg shadow-[#06110c]/50 transition cursor-pointer disabled:opacity-50 text-center"
                    >
                      {resetLoading ? 'Sending Token...' : 'Send Recovery Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmReset} className="space-y-3.5">
                  <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      required
                      value={resetTokenInput}
                      onChange={(e) => setResetTokenInput(e.target.value)}
                      placeholder="e.g. STW-RESET-99182"
                      className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none font-mono"
                    />
                  </div>

                  <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      New Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-transparent text-sm font-bold text-white placeholder-white/20 outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep('REQUEST')}
                      className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-[#1D3D37] transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 py-3 px-6 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black border border-[#23534B] shadow-lg shadow-[#06110c]/50 transition cursor-pointer disabled:opacity-50 text-center"
                    >
                      {resetLoading ? 'Updating Password...' : 'Save & Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SOCIAL LOGIN TOOLS & 1-CLICK DEMO DRAWER (TOGGLED VIA CHANGE METHOD)       */}
          {/* ========================================================================= */}
          {showMethodDrawer && (
            <div 
              ref={methodDrawerRef}
              className="mt-5 p-4 rounded-3xl bg-[#0E1F1C]/98 border border-[#1D3D37] space-y-3.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 scroll-mt-6"
            >
              <div className="flex items-center justify-between border-b border-[#1D3D37] pb-2.5">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#a31c1b]" />
                  <span>Alternative Sign In Methods</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMethodDrawer(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Social Login Options */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Social Identity
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#1D3D37] text-white font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#1D3D37] text-white font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.77 1.05-1.84.93-2.91-.91.04-2.02.61-2.67 1.37-.58.67-1.08 1.76-.94 2.8.01 0 .03.01.05.01 1.02 0 2.01-.5 2.63-1.27z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Phone / OTP */}
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(true)}
                  className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#1D3D37] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Smartphone className="h-4 w-4 text-[#a31c1b]" />
                  <span>Login with Mobile Number &amp; OTP</span>
                </button>
              </div>

              {/* 1-Click Fast Demo Personas */}
              <div className="space-y-2 pt-2 border-t border-[#1D3D37]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Workspace
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#06110c] text-[#a31c1b] border border-[#a31c1b]/30 font-bold">
                    1-Click
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {ALLOWED_LOGIN_ROLES.map((role) => {
                    const cred = DEMO_CREDENTIALS[role];
                    return (
                      <div
                        key={role}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#1D3D37] flex flex-col justify-between gap-2 transition"
                      >
                        <div 
                          onClick={() => handleFillDemoCredentials(role)}
                          className="flex items-center gap-2 cursor-pointer select-none"
                          title="Fill credentials into form"
                        >
                          <span className="text-base shrink-0">{cred.avatar}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-[11px] truncate">{cred.roleLabel.split(' ')[0]}</div>
                            <div className="text-[9px] text-slate-400 truncate font-mono">{cred.email.split('@')[0]}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleFillDemoCredentials(role)}
                            className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 font-bold text-center transition cursor-pointer"
                          >
                            Fill Form
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDemoLogin(role)}
                            className="flex-1 py-1 rounded-lg bg-[#a31c1b] hover:bg-[#851615] text-[10px] text-white font-black text-center transition cursor-pointer shadow-xs"
                          >
                            1-Click
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(selectedRole)}
                    className="p-2.5 rounded-xl bg-[#06110c] hover:bg-[#171717] border border-[#a31c1b]/40 text-[#a31c1b] text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer col-span-2 shadow-md"
                  >
                    <span>Instant 1-Click Entry as {activeCred.roleLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER & MONOGRAM */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>&copy; 2026 Staywise OS</span>
          <span>•</span>
          <span>Privacy &amp; Security</span>
        </div>

        {/* Minimalist Monogram Mark */}
        <div className="font-black text-2xl tracking-tighter text-white/80 select-none flex items-center">
          <span className="text-[#a31c1b]">.</span>SW
        </div>
      </footer>

      {/* Mobile OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1F1C] border border-[#1D3D37] rounded-3xl p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#1D3D37]">
              <h3 className="font-extrabold text-sm text-white">Login with WhatsApp / OTP</h3>
              <button 
                type="button"
                onClick={() => { setIsOtpModalOpen(false); setOtpSent(false); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {otpError && (
              <div className="text-rose-400 text-[11px] bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50 flex items-center gap-2">
                <span>⚠️</span>
                <span>{otpError}</span>
              </div>
            )}

            {otpHint && (
              <div className="text-emerald-400 text-[11px] bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/50 flex items-center gap-2">
                <span>🔑</span>
                <span>{otpHint}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleOtpSend} className="space-y-3.5 text-xs">
                <div className="rounded-2xl bg-[#112421] border border-[#1D3D37] p-3">
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-semibold">10-Digit Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 11928"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 rounded-full bg-[#06110c] hover:bg-[#171717] disabled:opacity-50 text-white font-extrabold text-xs border border-[#23534B] shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {otpLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{otpLoading ? 'Dispatching OTP...' : 'Send OTP via WhatsApp / SMS'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-3.5 text-xs">
                <p className="text-[11px] text-slate-400">
                  Enter the 4-digit code sent to <b className="text-white">{otpPhone}</b>
                </p>
                <div className="rounded-2xl bg-[#112421] border border-[#1D3D37] p-3">
                  <label className="block text-[10px] text-slate-400 mb-0.5 font-semibold">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="1 2 3 4"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-transparent text-base font-black text-center tracking-widest text-[#a31c1b] outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 rounded-full bg-[#06110c] hover:bg-[#171717] disabled:opacity-50 text-white font-extrabold text-xs border border-[#23534B] shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {otpLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{otpLoading ? 'Verifying Code...' : 'Verify & Enter Workspace'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Trial Modal Support */}
      <TrialAutopayModal 
        isOpen={isTrialModalOpen} 
        onClose={() => setIsTrialModalOpen(false)} 
        initialPlanId="growth_pro" 
      />

    </div>
  );
}
