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

  // Sign Up State
  const [signupRole, setSignupRole] = useState<'owner' | 'estate_manager'>('owner');
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
      portfolioName: `${signupName}'s Portfolio`,
      city: 'Bangalore'
    });

    setSignupLoading(false);
    if (!res.success) {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF0E6] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#ECF39E] selection:text-[#132A13]">
      
      {/* Navigation bar to return to Landing Page */}
      {onBackToLanding && (
        <div className="mb-4 w-full max-w-xl flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#DCE5D3] text-[#132A13] text-xs font-bold shadow-2xs hover:bg-[#F3F6EE] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#31572C]" />
            <span>← Back to Website</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTrialModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ECF39E] border border-[#132A13]/20 text-[#132A13] text-xs font-black shadow-2xs hover:bg-[#dfe68b] transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#132A13]" />
            <span>Start Free Trial</span>
          </button>
        </div>
      )}

      {/* Brand Header */}
      <div className="mb-5 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#132A13] text-[#ECF39E] flex items-center justify-center font-black text-sm shadow-xs">
            ✦
          </div>
          <span className="text-2xl font-black tracking-tight text-[#132A13]">
            STAYWISE
          </span>
        </div>
        <p className="text-xs font-semibold text-[#657D5C]">
          Unified Property Operating System • Landlords, Estates &amp; Residents
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE5D3] space-y-6">
        
        {/* Sign In vs Sign Up Segmented Controller */}
        <div className="flex items-center p-1 rounded-full bg-[#F3F6EE] border border-[#DCE5D3]">
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNIN'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center ${
              authMode === 'SIGNIN'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-[#657D5C] hover:text-[#132A13]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
              authMode === 'SIGNUP'
                ? 'bg-[#132A13] text-[#ECF39E] shadow-xs'
                : 'text-[#657D5C] hover:text-[#132A13]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#31572C]" />
            <span>Create Account</span>
          </button>
        </div>

        {/* MODE 1: SIGN IN */}
        {authMode === 'SIGNIN' ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-[#132A13]">
                Sign In to Workspace
              </h2>
              <p className="text-xs text-[#657D5C] mt-0.5">
                Select your persona to access customized dashboards
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F3F6EE] rounded-2xl border border-[#DCE5D3]">
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
                        ? 'bg-[#132A13] text-[#ECF39E] shadow-2xs border border-[#4F772D]'
                        : 'text-[#31572C] hover:text-[#132A13] hover:bg-white'
                    }`}
                  >
                    <span className="text-xl">{cred.avatar}</span>
                    <span className="font-extrabold text-[11px] leading-tight line-clamp-1">{cred.roleLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Demo ID & Password Quick Login Banner */}
            <div className="p-3.5 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#132A13] flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-[#31572C]" />
                  <span>Demo ID &amp; Password ({activeCred.roleLabel})</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13]">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-white border border-[#DCE5D3] truncate">
                  <span className="text-[#657D5C] mr-1">ID:</span>
                  <span className="font-bold text-[#132A13]">{activeCred.email}</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#DCE5D3] truncate">
                  <span className="text-[#657D5C] mr-1">Pass:</span>
                  <span className="font-bold text-[#132A13]">{activeCred.pass}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className="w-full py-2 rounded-xl bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-black shadow-xs transition flex items-center justify-center gap-1"
              >
                <span>Instant Login as {activeCred.roleLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#132A13] font-bold mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#31572C] transition"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-[#657D5C]" />
                </div>
              </div>

              <div>
                <label className="block text-[#132A13] font-bold mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#31572C] transition"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#657D5C]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#657D5C] hover:text-[#132A13]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] font-black text-xs shadow-xs transition"
              >
                Sign In
              </button>
            </form>
          </div>
        ) : (
          /* MODE 2: SIGN UP */
          <div className="space-y-4 text-xs">
            <h2 className="text-lg font-black text-[#132A13]">
              Create Your Account
            </h2>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-[#657D5C] font-semibold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="Margaret Miller"
                  className="w-full p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#31572C]"
                />
              </div>
              <div>
                <label className="block text-[#657D5C] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="margaret@staywise.app"
                  className="w-full p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#31572C]"
                />
              </div>
              <div>
                <label className="block text-[#657D5C] font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#31572C]"
                />
              </div>

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] font-black text-xs transition"
              >
                {signupLoading ? 'Creating Account...' : 'Get Started'}
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
