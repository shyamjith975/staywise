'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CreditCard,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { color } from '../../lib/colors';

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const propertyId = searchParams.get('propertyId') || 'prop-beach-road';
  const propertyName = searchParams.get('propertyName') || 'Beach Road Luxury Apartments';
  const unitNumber = searchParams.get('unitNumber') || '304';
  const monthlyRent = Number(searchParams.get('rent')) || 25000;
  const deposit = Number(searchParams.get('deposit')) || 50000;
  const initialName = searchParams.get('name') || '';
  const initialEmail = searchParams.get('email') || '';
  const initialPhone = searchParams.get('phone') || '';
  const ownerEmail = searchParams.get('ownerEmail') || 'owner@staywise.com';
  const tenancyType = searchParams.get('type') || 'PG';
  const isCoTenant = searchParams.get('isCoTenant') === 'true';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState('Tenant@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Authoritatively onboard / connect tenant into database
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Resident',
          email: email.trim(),
          phone: phone.trim() || '+91 98450 11928',
          propertyId,
          propertyName,
          unitNumber,
          monthlyRent,
          deposit,
          password,
          tenancyType,
          leaseStart: new Date().toISOString().split('T')[0],
          leaseEnd: '2027-09-30',
          rentDueDate: 5,
          hasFood: tenancyType === 'PG',
          roomSharing: isCoTenant ? '2_Sharing' : 'Single'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to accept invitation.');
      }

      // 2. Perform direct login to establish active tenant session
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role: 'tenant' })
      });
      const loginData = await loginRes.json();

      if (typeof window !== 'undefined') {
        const tenantUser = loginData.user || {
          id: data.data?.tenant?.userId || `user-tenant-${Date.now().toString().slice(-4)}`,
          email: email.trim(),
          name: name.trim(),
          role: 'tenant',
          roleLabel: 'Tenant / Resident',
          avatar: '👨‍🎓',
          title: `Resident • Apt ${unitNumber}`,
          description: `${propertyName} • Lease Active`
        };

        sessionStorage.setItem('staywise_is_authenticated', 'true');
        sessionStorage.setItem('staywise_active_role', 'tenant');
        sessionStorage.setItem('staywise_active_view', 'dashboard');
        sessionStorage.setItem('staywise_current_user', JSON.stringify(tenantUser));
        localStorage.setItem('staywise_active_role', 'tenant');
        localStorage.setItem('staywise_current_user', JSON.stringify(tenantUser));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Unable to connect lease. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06110c] text-white flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#a31c1b] selection:text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial from-[#112421]/60 via-[#06110c] to-[#06110c] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#1D3D37]">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-[#06110c] text-[#a31c1b] border border-[#a31c1b]/40 flex items-center justify-center font-black text-sm shadow-md">
            ✦
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Staywise<span className="text-[#a31c1b]">.</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Official Verified Lease Invitation</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-lg mx-auto w-full py-8 space-y-6">
        
        {/* Eyebrow */}
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#a31c1b]">
            DIGITAL TENANCY ONBOARDING
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            You&apos;re Invited to Connect<span className="text-[#a31c1b]">.</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your landlord <b className="text-white">{ownerEmail}</b> has authorized your tenancy for Unit <b className="text-white">{unitNumber}</b>.
          </p>
        </div>

        {/* Lease Summary Card */}
        <div className="p-5 rounded-3xl bg-[#112421]/90 border border-[#1D3D37] space-y-3.5 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Property &amp; Unit</span>
              <h2 className="text-base font-extrabold text-white">{propertyName}</h2>
              <p className="text-xs text-emerald-400 font-bold">
                Unit {unitNumber} • {tenancyType} {isCoTenant ? '(Shared Roommate)' : ''}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white/5 border border-[#1D3D37] flex items-center justify-center text-white">
              <Building2 className="h-5 w-5 text-[#a31c1b]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1D3D37]">
            <div className="p-3 rounded-2xl bg-[#06110c]/60 border border-[#1D3D37]">
              <span className="text-[10px] text-slate-400 block font-semibold">Agreed Monthly Rent</span>
              <span className="text-base font-black text-white">₹{monthlyRent.toLocaleString('en-IN')}</span>
              <span className="text-[9px] text-slate-400 block">Due 5th of every month</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#06110c]/60 border border-[#1D3D37]">
              <span className="text-[10px] text-slate-400 block font-semibold">Security Deposit</span>
              <span className="text-base font-black text-emerald-400">
                {deposit > 0 ? `₹${deposit.toLocaleString('en-IN')}` : 'Zero-Deposit'}
              </span>
              <span className="text-[9px] text-slate-400 block">
                {deposit > 0 ? 'Held in Escrow' : 'Protected by Staywise'}
              </span>
            </div>
          </div>
        </div>

        {/* Acceptance Form */}
        {success ? (
          <div className="p-6 rounded-3xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-black text-white">Tenancy Successfully Connected!</h3>
            <p className="text-xs text-slate-300">
              Entering your personal Resident Portal... Unit <b>{unitNumber}</b> has been linked to your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shyam Sundar"
                  className="w-full bg-transparent text-sm font-bold text-white outline-none pr-8"
                />
                <User className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3 relative">
                <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tenant@staywise.com"
                  className="w-full bg-transparent text-sm font-bold text-white outline-none pr-8"
                />
                <Mail className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3 relative">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 11928"
                    className="w-full bg-transparent text-sm font-bold text-white outline-none pr-8"
                  />
                  <Phone className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="rounded-2xl bg-[#112421]/90 border border-[#1D3D37] p-3 relative">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Account Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-sm font-bold text-white outline-none pr-8 font-mono"
                  />
                  <Lock className="absolute right-3.5 top-5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-black border border-[#23534B] shadow-xl shadow-[#06110c]/80 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#a31c1b]" />
                  <span>Connecting Tenancy &amp; Digital Lease...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#a31c1b]" />
                  <span>Accept Invitation &amp; Enter Resident Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-6 border-t border-[#1D3D37] flex items-center justify-between text-xs text-slate-500">
        <div>&copy; 2026 Staywise OS • Verified Tenant Onboarding</div>
        <div className="font-mono text-slate-400">Unit: {unitNumber}</div>
      </footer>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#06110c] text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#a31c1b]" />
      </div>
    }>
      <InviteContent />
    </Suspense>
  );
}

