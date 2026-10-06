'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { SubscriptionTierId } from '../../types';
import { SUBSCRIPTION_PLANS } from '../../lib/security/subscriptionCatalog';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  Check, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Zap,
  Landmark,
  ShieldAlert
} from 'lucide-react';

interface TrialAutopayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: SubscriptionTierId;
  initialBillingCycle?: 'monthly' | 'annual';
}

export default function TrialAutopayModal({
  isOpen,
  onClose,
  initialPlanId = 'growth_pro',
  initialBillingCycle = 'annual'
}: TrialAutopayModalProps) {
  const { startTrialSignup } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: User & Asset Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'owner' | 'estate_manager'>('owner');
  const [portfolioName, setPortfolioName] = useState('');
  const [city, setCity] = useState('Bangalore');

  // Step 2: Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionTierId>(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBillingCycle);

  // Step 3: Autopay Connection
  const [autopayMethod, setAutopayMethod] = useState<'CARD' | 'BANK_MANDATE'>('CARD');
  
  // Card Details
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Bank Mandate Details
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [mandateType, setMandateType] = useState<'E_NACH' | 'UPI_MANDATE'>('E_NACH');

  const [consentChecked, setConsentChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.growth_pro;
  const planPrice = billingCycle === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;

  // Calculate 7-day trial dates
  const today = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(today.getDate() + 7);
  const formattedTrialEndDate = trialEndDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setCardExpiry(val);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required identity fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setErrorMsg(null);
    if (!cardHolder && name) {
      setCardHolder(name);
      setBankAccountHolder(name);
    }
    setStep(3);
  };

  const handleCompleteTrialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!consentChecked) {
      setErrorMsg('Please confirm the autopay authorization checkbox to continue.');
      return;
    }

    if (autopayMethod === 'CARD') {
      if (!cardHolder.trim() || cardNumber.replace(/\s+/g, '').length < 15 || cardExpiry.length < 5 || cardCvv.length < 3) {
        setErrorMsg('Please enter valid credit/debit card details for autopay authorization.');
        return;
      }
    } else {
      if (mandateType === 'E_NACH') {
        if (!bankAccountHolder.trim() || bankAccountNumber.length < 9 || !bankIfsc.trim()) {
          setErrorMsg('Please provide valid bank account number and IFSC code for e-NACH mandate.');
          return;
        }
      } else {
        if (!upiId.trim() || !upiId.includes('@')) {
          setErrorMsg('Please enter a valid UPI ID (e.g. yourname@okhdfcbank) for recurring mandate.');
          return;
        }
      }
    }

    setIsLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim() || '+91 98450 12345',
      role,
      portfolioName: portfolioName.trim() || (role === 'owner' ? `${name}'s Realty` : `${name}'s Villas`),
      city: city.trim() || 'Bangalore',
      planId: selectedPlanId,
      billingCycle,
      autopayMethod,
      cardDetails: autopayMethod === 'CARD' ? {
        holderName: cardHolder,
        cardNumberMasked: `•••• •••• •••• ${cardNumber.replace(/\s+/g, '').slice(-4)}`,
        expiry: cardExpiry,
        cardBrand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
      } : undefined,
      bankDetails: autopayMethod === 'BANK_MANDATE' ? {
        accountHolder: bankAccountHolder,
        bankName,
        accountNumberMasked: mandateType === 'E_NACH' ? `••••••••${bankAccountNumber.slice(-4)}` : upiId,
        ifsc: bankIfsc.toUpperCase(),
        mandateType
      } : undefined
    };

    const res = await startTrialSignup(payload);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Trial setup failed. Please try again.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto font-sans animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e3e1d8] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#19251f] via-[#21352a] to-[#121c17] text-white flex items-center justify-between border-b border-[#274235]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Start Your 7-Day Free Trial
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-[#19251f]">
                  ₹0 Today
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Cancel anytime before 7 days to pay nothing. Zero risk.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-3 bg-[#f8f7f4] border-b border-[#e3e1d8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition ${
              step >= 1 ? 'bg-[#274235] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              1
            </div>
            <span className={`font-bold ${step === 1 ? 'text-[#19251f]' : 'text-slate-400'}`}>
              Account Info
            </span>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition ${
              step >= 2 ? 'bg-[#274235] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              2
            </div>
            <span className={`font-bold ${step === 2 ? 'text-[#19251f]' : 'text-slate-400'}`}>
              Review Plan
            </span>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black transition ${
              step >= 3 ? 'bg-[#274235] text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              3
            </div>
            <span className={`font-bold ${step === 3 ? 'text-[#19251f]' : 'text-slate-400'}`}>
              Connect Autopay
            </span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 1: ACCOUNT & ASSET INFORMATION                  */}
        {/* ---------------------------------------------------- */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-[#19251f] font-bold uppercase tracking-wider text-[11px] mb-2">
                Select Your Operator Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    role === 'owner'
                      ? 'border-[#274235] bg-[#eef3f0] ring-2 ring-[#274235]/20'
                      : 'border-[#e3e1d8] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">👨‍💼</span>
                    {role === 'owner' && <CheckCircle2 className="h-4 w-4 text-[#274235]" />}
                  </div>
                  <div className="mt-1.5">
                    <div className="font-extrabold text-sm text-[#19251f]">Property Landlord</div>
                    <div className="text-[11px] text-[#6e7972]">Flats, PG Co-living &amp; Commercial Units</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('estate_manager')}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    role === 'estate_manager'
                      ? 'border-[#274235] bg-[#eef3f0] ring-2 ring-[#274235]/20'
                      : 'border-[#e3e1d8] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🏡</span>
                    {role === 'estate_manager' && <CheckCircle2 className="h-4 w-4 text-[#274235]" />}
                  </div>
                  <div className="mt-1.5">
                    <div className="font-extrabold text-sm text-[#19251f]">EstateOS Host</div>
                    <div className="text-[11px] text-[#6e7972]">Villas, Boutique Resorts &amp; Airbnb Keys</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <User className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  Work Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@realty.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  Mobile Phone *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  Account Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#95a099] hover:text-[#19251f]"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  Portfolio / Business Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    placeholder={role === 'owner' ? "e.g. Prestige Heights" : "e.g. Nilgiri Estate Villas"}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <Building className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-bold mb-1">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bangalore, Mumbai, etc."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                  <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-extrabold text-sm shadow-xl shadow-[#274235]/20 flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Plan Selection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 2: PLAN CONFIRMATION & ₹0 TRIAL GUARANTEE       */}
        {/* ---------------------------------------------------- */}
        {step === 2 && (
          <div className="p-6 space-y-5 text-xs">
            {/* Billing Cycle Switcher */}
            <div className="flex items-center justify-center">
              <div className="flex items-center p-1 rounded-2xl bg-[#f4f3ef] border border-[#e3e1d8]">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    billingCycle === 'monthly' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972]'
                  }`}
                >
                  Monthly Flexible
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'bg-[#19251f] text-white shadow-sm' : 'text-[#6e7972]'
                  }`}
                >
                  <span>Annual Commitment</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionTierId[]).map((planKey) => {
                const plan = SUBSCRIPTION_PLANS[planKey];
                const isSelected = selectedPlanId === planKey;
                const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                const perMonthEquivalent = billingCycle === 'annual' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;

                return (
                  <button
                    key={planKey}
                    type="button"
                    onClick={() => setSelectedPlanId(planKey)}
                    className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#274235] bg-[#eef3f0] ring-2 ring-[#274235]/20 shadow-md'
                        : 'border-[#e3e1d8] bg-white hover:border-slate-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#274235] text-white text-[9px] font-black uppercase">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="font-extrabold text-sm text-[#19251f]">{plan.name}</div>
                      <div className="text-[10px] text-[#6e7972] mt-0.5">Up to {plan.maxUnits} Units/Beds</div>
                      <div className="mt-3">
                        <div className="text-lg font-black text-[#19251f]">
                          ₹{perMonthEquivalent.toLocaleString('en-IN')}
                          <span className="text-[10px] font-normal text-[#6e7972]"> /mo</span>
                        </div>
                        <div className="text-[10px] text-[#6e7972]">
                          {billingCycle === 'annual' ? `₹${price.toLocaleString('en-IN')} billed annually` : 'Billed monthly'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#e3e1d8] flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#274235]">7-Day Free Trial</span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-[#274235]" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Trial Breakdown Box */}
            <div className="p-4 rounded-2xl bg-[#f7faf8] border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#19251f]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-700" />
                  <span>Due Today (Day 1 to 7)</span>
                </span>
                <span className="text-sm font-black text-emerald-700">₹0.00 FREE</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6e7972]">
                <span>Trial Expiry / First Billing Date:</span>
                <span className="font-bold text-[#19251f]">{formattedTrialEndDate} (7 Days)</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6e7972]">
                <span>Autopay Amount (After Day 7):</span>
                <span className="font-bold text-[#19251f]">
                  ₹{planPrice.toLocaleString('en-IN')} ({billingCycle === 'annual' ? 'Annual Plan' : 'Monthly'})
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-start gap-2 text-[11px] text-emerald-900">
                <Check className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <b>100% Risk-Free Guarantee:</b> You can cancel anytime before <b>{formattedTrialEndDate}</b> directly from Settings &gt; Subscription in 1 click. You will not be charged if cancelled.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-2xl bg-white border border-[#e3e1d8] text-[#19251f] font-bold text-xs hover:bg-[#f4f3ef] transition"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep2}
                className="flex-1 py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-extrabold text-sm shadow-xl shadow-[#274235]/20 flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Autopay Connection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* STEP 3: CONNECT CARD OR BANK AUTOPAY MANDATE         */}
        {/* ---------------------------------------------------- */}
        {step === 3 && (
          <form onSubmit={handleCompleteTrialSignup} className="p-6 space-y-4 text-xs">
            {/* Method Tabs: Card vs Bank Account Mandate */}
            <div>
              <label className="block text-[#19251f] font-bold uppercase tracking-wider text-[11px] mb-2">
                Select Autopay Connection Method (₹0 Charged Today)
              </label>

              <div className="grid grid-cols-2 gap-2 p-1 bg-[#f4f3ef] rounded-2xl border border-[#e3e1d8]">
                <button
                  type="button"
                  onClick={() => setAutopayMethod('CARD')}
                  className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    autopayMethod === 'CARD'
                      ? 'bg-white text-[#19251f] shadow-sm border border-[#e3e1d8]'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-[#274235]" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAutopayMethod('BANK_MANDATE')}
                  className={`py-2.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    autopayMethod === 'BANK_MANDATE'
                      ? 'bg-white text-[#19251f] shadow-sm border border-[#e3e1d8]'
                      : 'text-[#6e7972] hover:text-[#19251f]'
                  }`}
                >
                  <Landmark className="h-4 w-4 text-[#274235]" />
                  <span>Bank Account / e-NACH</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT A: CARD */}
            {autopayMethod === 'CARD' ? (
              <div className="space-y-3 p-4 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8]">
                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Name as on card"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-bold mb-1">
                    Card Number (Visa / Mastercard / RuPay) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 •••• •••• 8912"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono tracking-wider focus:outline-none focus:border-[#274235]"
                    />
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-[#95a099]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#19251f] font-bold mb-1">
                      Expiry Date (MM/YY) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono focus:outline-none focus:border-[#274235]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#19251f] font-bold mb-1">
                      CVV Security Code *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono focus:outline-none focus:border-[#274235]"
                      />
                      <Lock className="absolute right-3 top-3 h-3.5 w-3.5 text-[#95a099]" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB CONTENT B: BANK ACCOUNT MANDATE */
              <div className="space-y-3 p-4 rounded-2xl bg-[#faf9f6] border border-[#e3e1d8]">
                {/* Mandate Sub-type Switcher */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMandateType('E_NACH')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                      mandateType === 'E_NACH'
                        ? 'bg-[#274235] text-white border-[#274235]'
                        : 'bg-white text-[#6e7972] border-[#e3e1d8]'
                    }`}
                  >
                    e-NACH NetBanking Mandate
                  </button>
                  <button
                    type="button"
                    onClick={() => setMandateType('UPI_MANDATE')}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                      mandateType === 'UPI_MANDATE'
                        ? 'bg-[#274235] text-white border-[#274235]'
                        : 'bg-white text-[#6e7972] border-[#e3e1d8]'
                    }`}
                  >
                    UPI Recurring AutoPay
                  </button>
                </div>

                {mandateType === 'E_NACH' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#19251f] font-bold mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankAccountHolder}
                          onChange={(e) => setBankAccountHolder(e.target.value)}
                          placeholder="Name as per Bank"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#19251f] font-bold mb-1">
                          Bank Name *
                        </label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-medium focus:outline-none focus:border-[#274235]"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Federal Bank">Federal Bank</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#19251f] font-bold mb-1">
                          Account Number *
                        </label>
                        <input
                          type="password"
                          required
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="Enter account number"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono focus:outline-none focus:border-[#274235]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#19251f] font-bold mb-1">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankIfsc}
                          onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. HDFC0000123"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono uppercase focus:outline-none focus:border-[#274235]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[#19251f] font-bold mb-1">
                      UPI VPA for Recurring Mandate *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e3e1d8] text-[#19251f] font-mono focus:outline-none focus:border-[#274235]"
                    />
                    <p className="text-[10px] text-[#6e7972] mt-1">
                      An authorization request of ₹0 will be initiated on your UPI app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Authorization Consent Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#e3e1d8] text-[#274235] focus:ring-[#274235]"
              />
              <span className="text-[11px] text-[#19251f] leading-relaxed">
                I authorize Staywise to connect this payment method for recurring autopay of <b>₹{planPrice.toLocaleString('en-IN')}</b> starting after the 7-day trial on <b>{formattedTrialEndDate}</b>. <b>₹0.00 is charged today</b> and I can cancel anytime before 7 days from my dashboard with zero charges.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="px-5 py-3.5 rounded-2xl bg-white border border-[#e3e1d8] text-[#19251f] font-bold text-xs hover:bg-[#f4f3ef] transition disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-extrabold text-sm shadow-xl shadow-[#274235]/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Securing Autopay &amp; Initializing Portal...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize Autopay &amp; Start 7-Day Trial (₹0 Today)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Trust Shield */}
        <div className="p-4 bg-[#f8f7f4] border-t border-[#e3e1d8] flex items-center justify-center gap-2 text-[11px] text-[#6e7972]">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span>256-Bit Bank-Grade Encryption • RBI Escrow &amp; e-Mandate Compliant • OWASP Sealed</span>
        </div>
      </div>
    </div>
  );
}
