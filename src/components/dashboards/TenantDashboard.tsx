'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  Gift, 
  FileText, 
  Download, 
  Zap, 
  Calendar,
  Fingerprint,
  X,
  Users,
  Share2,
  Send,
  UserPlus,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ArrowUpRight,
  Sparkles,
  Building,
  Home,
  AlertCircle,
  Utensils
} from 'lucide-react';
import { Roommate } from '../../types';
import ViewElectricityBillDocumentModal from '../modules/rentflow/ViewElectricityBillDocumentModal';

const DEMO_ROOMMATES: Roommate[] = [
  {
    id: 'rm-1',
    name: 'Shyam Sundar (You)',
    phone: '+91 98460 21980',
    email: 'shyam.sundar@techpark.in',
    splitPercentage: 50,
    rentShare: 14350,
    utilityShare: 968,
    totalPayable: 15318,
    status: 'Paid',
    isPrimary: true
  },
  {
    id: 'rm-2',
    name: 'Rohan Verma',
    phone: '+91 98112 40912',
    email: 'rohan.verma@fintech.co',
    splitPercentage: 50,
    rentShare: 14350,
    utilityShare: 968,
    totalPayable: 15318,
    status: 'Pending',
    isPrimary: false
  }
];

const DEMO_RESIDENT_DOCS = [
  { id: 'rd-1', name: 'Digital Tenancy Agreement (Aadhaar eSigned)', size: '2.1 MB', date: 'Signed Oct 2026' },
  { id: 'rd-2', name: 'Security Deposit Escrow Certificate (₹60,000)', size: '420 KB', date: 'Verified' },
  { id: 'rd-3', name: 'Move-in Condition & Inventory Report', size: '1.8 MB', date: 'Attached 18 Photos' }
];

export default function TenantDashboard() {
  const { 
    tenants, 
    invoices, 
    tickets, 
    currentUser,
    setIsPayRentOpen, 
    setSelectedInvoiceForPay, 
    setSelectedReceiptInvoice, 
    setIsCreateTicketOpen, 
    setActiveView,
    electricityBills,
    updateElectricityBill,
    pgMeals,
    addNotification
  } = useAppState();

  const isDemoTenant = currentUser?.email === 'tenant@staywise.com' || currentUser?.id === 'user-tenant-shyam';

  // Strict tenant scoping: demo account maps to Shyam Sundar, new accounts ONLY match their own records
  const currentTenant = isDemoTenant
    ? (tenants.find(t => t.id === 't-shyam') || tenants[0])
    : tenants.find(t => 
        (currentUser?.email && t.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser?.id && (t.userId === currentUser.id || t.id === currentUser.id))
      );

  const pendingInvoice = currentTenant 
    ? invoices.find(i => (i.tenantId === currentTenant.id || (currentTenant.name && i.tenantName?.toLowerCase().includes(currentTenant.name.toLowerCase()))) && (i.status === 'Due' || i.status === 'Overdue'))
    : null;
  
  const lastPaidInvoice = currentTenant 
    ? invoices.find(i => (i.tenantId === currentTenant.id || (currentTenant.name && i.tenantName?.toLowerCase().includes(currentTenant.name.toLowerCase()))) && i.status === 'Paid')
    : null;

  const tenantTickets = currentTenant 
    ? tickets.filter(t => t.propertyId === currentTenant.propertyId && t.unitNumber === currentTenant.unitNumber) 
    : [];

  const [roommates, setRoommates] = useState<Roommate[]>(isDemoTenant ? DEMO_ROOMMATES : []);
  const [residentDocs, setResidentDocs] = useState(isDemoTenant ? DEMO_RESIDENT_DOCS : []);
  const [isAddRoommateModalOpen, setIsAddRoommateModalOpen] = useState(false);
  const [newRoommate, setNewRoommate] = useState({
    name: '',
    phone: '',
    email: '',
    splitPercentage: 50
  });

  const [ekycStatus, setEkycStatus] = useState<'Verified' | 'Pending'>(isDemoTenant ? 'Verified' : 'Pending');
  const [isEKYCModalOpen, setIsEKYCModalOpen] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState(isDemoTenant ? '5481 9028 1142' : '');
  const [panNumber, setPanNumber] = useState(isDemoTenant ? 'BLRPS9912A' : '');

  // Reset demo states when switching accounts
  useEffect(() => {
    if (isDemoTenant) {
      setRoommates(DEMO_ROOMMATES);
      setResidentDocs(DEMO_RESIDENT_DOCS);
      setEkycStatus('Verified');
      setAadhaarNumber('5481 9028 1142');
      setPanNumber('BLRPS9912A');
    } else {
      setRoommates([]);
      setResidentDocs([]);
      setEkycStatus('Pending');
      setAadhaarNumber('');
      setPanNumber('');
    }
  }, [isDemoTenant]);

  // Tenant Mess & Food Plan State
  const [isMealCustomizerOpen, setIsMealCustomizerOpen] = useState(false);
  const [isViewMenuModalOpen, setIsViewMenuModalOpen] = useState(false);
  const [foodOptedOut, setFoodOptedOut] = useState(false);
  const [subscribedMeals, setSubscribedMeals] = useState<{ breakfast: boolean; lunch: boolean; dinner: boolean }>({
    breakfast: true,
    lunch: true,
    dinner: true
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && currentTenant?.id) {
      const optOutSaved = localStorage.getItem(`staywise_food_optout_${currentTenant.id}`);
      if (optOutSaved !== null) setFoodOptedOut(optOutSaved === 'true');
      const mealsSaved = localStorage.getItem(`staywise_meals_${currentTenant.id}`);
      if (mealsSaved) {
        try { setSubscribedMeals(JSON.parse(mealsSaved)); } catch (e) {}
      }
    }
  }, [currentTenant?.id]);

  const toggleMealOption = (mealKey: 'breakfast' | 'lunch' | 'dinner') => {
    const next = { ...subscribedMeals, [mealKey]: !subscribedMeals[mealKey] };
    setSubscribedMeals(next);
    if (typeof window !== 'undefined' && currentTenant?.id) {
      localStorage.setItem(`staywise_meals_${currentTenant.id}`, JSON.stringify(next));
    }
  };

  const toggleFoodPlanStatus = () => {
    const nextOptOut = !foodOptedOut;
    setFoodOptedOut(nextOptOut);
    if (typeof window !== 'undefined' && currentTenant?.id) {
      localStorage.setItem(`staywise_food_optout_${currentTenant.id}`, String(nextOptOut));
    }
    if (nextOptOut) {
      addNotification(
        'Food Plan Removed',
        'Mess subscription removed from your resident plan. ₹3,600/mo meal dues subtracted.',
        'RENT'
      );
    } else {
      addNotification(
        'Food Plan Re-activated',
        'Mess subscription active. Daily breakfast, lunch, and dinner pass restored.',
        'RENT'
      );
    }
  };

  const unitBill = isDemoTenant
    ? electricityBills.find(b => b.unitNumber === '302')
    : (currentTenant ? electricityBills.find(b => b.propertyId === currentTenant.propertyId && b.unitNumber === currentTenant.unitNumber) : null);

  // If new tenant is not assigned to any property yet, show dedicated unassigned onboarding dashboard
  if (!currentTenant) {
    return (
      <div className="space-y-6 pb-12 font-sans text-[#263238]">
        {/* Unassigned Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#263238]">
                Welcome, {currentUser?.name || 'Resident'}!
              </h1>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold border flex items-center gap-1 shadow-2xs ${
                ekycStatus === 'Verified' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-[#FAF5EB] text-[#8C6B2E] border-[#ECCFA4]'
              }`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{ekycStatus === 'Verified' ? 'eKYC Verified' : 'KYC Pending'}</span>
              </span>
            </div>
            <p className="text-xs text-[#546E7A] mt-1 font-medium">
              Tenant Portal • No active lease assigned yet
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEKYCModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#E8F0EC] text-[#263238] text-xs font-bold border border-[#D2DDD7] transition shadow-2xs cursor-pointer"
            >
              <Fingerprint className="h-4 w-4 text-[#163B36]" />
              <span>Complete Digital KYC</span>
            </button>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4] flex items-center justify-center">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#263238]">Awaiting Property Lease Link</h2>
              <p className="text-xs text-[#546E7A] mt-1.5 leading-relaxed">
                Your tenant account is ready. Once your landlord or PG property manager links you to a unit, your tenancy agreement, upcoming rent dues, roommate splits, and power meter bills will appear here automatically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#546E7A]">Your Registered Identifier</span>
                <div className="font-mono font-bold text-[#263238] text-sm">{currentUser?.email || currentUser?.id}</div>
              </div>
              <span className="text-[11px] font-bold text-[#163B36] bg-white px-3 py-1.5 rounded-xl border border-[#D2DDD7] self-start sm:self-auto">
                Share with your landlord
              </span>
            </div>
          </div>
        </div>

        {/* 3 Onboarding Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">Instant Digital KYC</h3>
            <p className="text-xs text-[#546E7A]">
              Verify your Aadhaar and PAN so your landlord can draft a statutory lease agreement without physical paperwork.
            </p>
            <button
              onClick={() => setIsEKYCModalOpen(true)}
              className="text-xs font-bold text-[#163B36] hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              Verify KYC now →
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">Zero-Dispute Escrow</h3>
            <p className="text-xs text-[#546E7A]">
              Security deposits in Staywise are locked in an RBI-compliant bank escrow trust and released automatically upon clean checkout.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#FAF5EB] text-[#8C6B2E] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">Rent Rewards</h3>
            <p className="text-xs text-[#546E7A]">
              Earn Staywise resident points with every on-time UPI or bank autopay rent payment to redeem against maintenance discounts.
            </p>
          </div>
        </div>

        {/* Digital ID & KYC Modal */}
        {isEKYCModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-[#163B36]" />
                  <h3 className="font-extrabold text-base text-[#263238]">Resident Digital KYC</h3>
                </div>
                <button onClick={() => setIsEKYCModalOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setEkycStatus('Verified');
                setIsEKYCModalOpen(false);
                addNotification('KYC Verified', 'Your resident digital identity has been verified.', 'SYSTEM');
              }} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Aadhaar Number (12 Digits)</label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarNumber}
                    onChange={e => setAadhaarNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Instant UIDAI OTP & NSDL verification will link your lease legally.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#163B36] text-white font-bold text-xs hover:bg-[#102B27] transition shadow-md cursor-pointer"
                >
                  Verify &amp; Save KYC
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active / Assigned Tenant View
  const rentAmount = pendingInvoice ? pendingInvoice.totalAmount : (currentTenant.monthlyRent || 0);

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238]">
      {/* Resident Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#263238]">
              Welcome home, {currentTenant.name.split(' ')[0]}!
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold border flex items-center gap-1 shadow-2xs ${
              ekycStatus === 'Verified' 
                ? 'bg-[#163B36] text-white border-[#163B36]' 
                : 'bg-[#FAF5EB] text-[#8C6B2E] border-[#ECCFA4]'
            }`}>
              <ShieldCheck className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>{ekycStatus === 'Verified' ? 'eKYC Verified' : 'KYC Pending'}</span>
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-1 font-medium">
            Unit {currentTenant.unitNumber}, {currentTenant.propertyName} • Active lease until {currentTenant.leaseEnd || '2027'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#E8F0EC] text-[#263238] text-xs font-bold border border-[#D2DDD7] transition shadow-2xs cursor-pointer"
          >
            <Fingerprint className="h-4 w-4 text-[#163B36]" />
            <span>Digital ID</span>
          </button>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Wrench className="h-4 w-4 text-[#C69A55]" />
            <span>Request Repair</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Monthly Rent */}
        <div className="bg-[#E8F0EC] rounded-2xl p-4 border border-[#D2DDD7] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#546E7A]">Your Monthly Rent</div>
            <div className="text-xl font-black text-[#263238] mt-0.5 font-tabular">
              ₹{rentAmount.toLocaleString('en-IN')}
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${
              pendingInvoice ? 'text-amber-800' : 'text-emerald-800'
            }`}>
              <Clock className="h-3 w-3 text-[#C69A55]" />
              {pendingInvoice ? `Due: ${pendingInvoice.dueDate}` : 'Current month settled'}
            </span>
          </div>
          {pendingInvoice && (
            <button
              onClick={() => {
                setSelectedInvoiceForPay({
                  ...pendingInvoice,
                  tenantName: currentTenant.name,
                  unitNumber: currentTenant.unitNumber,
                  totalAmount: pendingInvoice.totalAmount
                });
                setIsPayRentOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-black shadow-xs transition cursor-pointer"
            >
              Pay UPI
            </button>
          )}
        </div>

        {/* Metric 2: Reliability Score */}
        <div className="bg-[#E8F0EC] rounded-2xl p-4 border border-[#D2DDD7] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#546E7A]">Reliability Score</div>
            <div className="text-xl font-black text-[#263238] mt-0.5 font-tabular">
              {currentTenant.reliabilityScore || 96} / 100
            </div>
            <span className="text-[10px] font-bold text-[#163B36] mt-1 block">
              ✓ On-Time Payment Profile
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#D2DDD7] text-[#163B36] flex items-center justify-center font-bold shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-[#163B36]" />
          </div>
        </div>

        {/* Metric 3: Resident Points & Rewards */}
        <div className="bg-[#E8F0EC] rounded-2xl p-4 border border-[#D2DDD7] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#546E7A]">Resident Points</div>
            <div className="text-xl font-black text-[#263238] mt-0.5 font-tabular">
              {currentTenant.rewardsBalance || 0} SWP
            </div>
            <span className="text-[10px] font-bold text-[#C69A55] mt-1 block">
              Earn on every on-time payment
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#D2DDD7] text-[#C69A55] flex items-center justify-center font-bold shadow-2xs">
            <Gift className="h-5 w-5 text-[#C69A55]" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Resident Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Span 8: Roommates Split + Documents */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Roommates & Split Rent Card */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Roommates &amp; Split Rent</h3>
                <p className="text-xs text-[#666666]">
                  {roommates.length > 0 
                    ? `Split unit rent & utilities with verified flatmates`
                    : 'Add co-tenants or flatmates to split monthly rent & utility bills'}
                </p>
              </div>
              <button
                onClick={() => setIsAddRoommateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5 text-[#C69A55]" />
                <span>Add Roommate</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {roommates.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#D2DDD7] rounded-2xl">
                  <Users className="h-7 w-7 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#546E7A]">No roommates registered</p>
                  <p className="text-[11px] text-[#78909C] mt-0.5">Click &ldquo;Add Roommate&rdquo; above to split rent payments seamlessly via WhatsApp UPI links.</p>
                </div>
              ) : (
                roommates.map((rm) => (
                  <div
                    key={rm.id}
                    className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#163B36] text-[#C69A55] font-black flex items-center justify-center text-xs shrink-0">
                        {rm.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-[#263238] flex items-center gap-1.5">
                          <span>{rm.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#163B36] text-white font-black">
                            {rm.splitPercentage}% Split
                          </span>
                        </div>
                        <div className="text-[11px] text-[#546E7A]">
                          Rent: ₹{rm.rentShare.toLocaleString('en-IN')} + Power: ₹{rm.utilityShare.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D2DDD7]">
                      <span className="font-black text-sm text-[#263238] font-tabular">
                        ₹{rm.totalPayable.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rm.status === 'Paid' ? 'bg-[#DCE8E1] text-[#163B36] border border-[#D2DDD7]' : 'bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4]'
                      }`}>
                        {rm.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tenancy Documents */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#263238]">My Tenancy Documents</h3>
            <div className="space-y-2">
              {residentDocs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#D2DDD7] rounded-2xl">
                  <FileText className="h-7 w-7 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#546E7A]">No lease documents uploaded yet</p>
                  <p className="text-[11px] text-[#78909C] mt-0.5">Your signed rental agreement and deposit certificates will appear here once executed.</p>
                </div>
              ) : (
                residentDocs.map(doc => (
                  <div key={doc.id} className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 text-[#163B36] shrink-0" />
                      <span className="font-bold text-[#263238] truncate">{doc.name}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      className="p-1.5 rounded-full hover:bg-[#DCE8E1] text-[#546E7A] hover:text-[#263238] transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-[#163B36]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mess & Dining Subscription Management Card (P1 Requirement) */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1D5DB] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#263238]">Mess &amp; Dining Subscription</h3>
                  <p className="text-xs text-[#546E7A]">
                    {foodOptedOut
                      ? 'You have opted out of the mess plan (₹3,600 deducted from monthly dues)'
                      : `Active Plan: ${[subscribedMeals.breakfast && 'Breakfast', subscribedMeals.lunch && 'Lunch', subscribedMeals.dinner && 'Dinner'].filter(Boolean).join(', ') || 'No meals selected'}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsViewMenuModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-[#E8F0EC] hover:bg-[#DCE8E1] text-[#163B36] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Menu</span>
                </button>
                <button
                  onClick={() => setIsMealCustomizerOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Utensils className="h-3.5 w-3.5 text-[#C69A55]" />
                  <span>Customize Meals</span>
                </button>
              </div>
            </div>

            {/* Plan Details & Cost Strip */}
            <div className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    foodOptedOut
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7]'
                  }`}>
                    {foodOptedOut ? 'Opted Out / No Food' : 'Active Resident Plan'}
                  </span>
                  <span className="text-xs font-bold text-[#546E7A]">
                    Vendor: Annapoorna Kitchens
                  </span>
                </div>
                <p className="text-xs text-[#263238] mt-1 font-medium">
                  {foodOptedOut
                    ? 'No meal charges will be billed to your account. You can opt back in anytime.'
                    : 'Unlimited mess dining pass during scheduled serving hours.'}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] text-[#546E7A] font-semibold">Monthly Mess Fee</div>
                  <div className="text-base font-black text-[#163B36] font-tabular">
                    {foodOptedOut ? '₹0' : '₹3,600 / mo'}
                  </div>
                </div>

                <button
                  onClick={toggleFoodPlanStatus}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    foodOptedOut
                      ? 'bg-[#163B36] text-white hover:bg-[#102B27] border-[#163B36]'
                      : 'bg-white text-rose-700 hover:bg-rose-50 border-rose-200'
                  }`}
                >
                  {foodOptedOut ? 'Opt Back In' : 'Remove Food Plan'}
                </button>
              </div>
            </div>

            {/* Included Daily Meals Pills */}
            {!foodOptedOut && (
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className={`p-3 rounded-2xl border transition ${
                  subscribedMeals.breakfast 
                    ? 'bg-[#E8F0EC] border-[#163B36]/30 text-[#163B36]' 
                    : 'bg-white border-[#D2DDD7] text-[#546E7A] opacity-60'
                }`}>
                  <div className="font-extrabold text-[11px] flex items-center justify-between">
                    <span>Breakfast</span>
                    <span>{subscribedMeals.breakfast ? '✓ Included' : 'Paused'}</span>
                  </div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">7:30 - 9:30 AM</div>
                </div>

                <div className={`p-3 rounded-2xl border transition ${
                  subscribedMeals.lunch 
                    ? 'bg-[#E8F0EC] border-[#163B36]/30 text-[#163B36]' 
                    : 'bg-white border-[#D2DDD7] text-[#546E7A] opacity-60'
                }`}>
                  <div className="font-extrabold text-[11px] flex items-center justify-between">
                    <span>Lunch</span>
                    <span>{subscribedMeals.lunch ? '✓ Included' : 'Paused'}</span>
                  </div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">12:30 - 2:30 PM</div>
                </div>

                <div className={`p-3 rounded-2xl border transition ${
                  subscribedMeals.dinner 
                    ? 'bg-[#E8F0EC] border-[#163B36]/30 text-[#163B36]' 
                    : 'bg-white border-[#D2DDD7] text-[#546E7A] opacity-60'
                }`}>
                  <div className="font-extrabold text-[11px] flex items-center justify-between">
                    <span>Dinner</span>
                    <span>{subscribedMeals.dinner ? '✓ Included' : 'Paused'}</span>
                  </div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">7:30 - 9:30 PM</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Span 4: Power Bill & Service Requests */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Unit Electricity Bill */}
          <div className="rounded-3xl bg-[#E8F0EC] border border-[#D2DDD7] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#263238] flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-[#C69A55]" />
                <span>Unit Electricity Bill</span>
              </span>
              {unitBill && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  unitBill.status === 'Paid' ? 'bg-[#DCE8E1] text-[#163B36]' : 'bg-[#FAF5EB] text-[#8C6B2E]'
                }`}>
                  {unitBill.status}
                </span>
              )}
            </div>

            {unitBill ? (
              <>
                <div className="text-2xl font-black text-[#263238] font-tabular">
                  ₹{unitBill.totalAmount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#546E7A]">{unitBill.discom} • Due {unitBill.dueDate}</p>

                {unitBill.status === 'Due' && (
                  <button
                    onClick={() => {
                      updateElectricityBill(unitBill.id, { status: 'Paid' });
                      alert('Power bill marked paid via UPI!');
                    }}
                    className="w-full py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    Pay Electricity Bill
                  </button>
                )}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-bold text-[#546E7A]">No pending power bills</p>
                <p className="text-[11px] text-[#78909C] mt-0.5">Sub-meter bills will show here when generated.</p>
              </div>
            )}
          </div>

          {/* Service Requests */}
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#263238]">Active Repairs</h3>
            <div className="space-y-2 text-xs">
              {tenantTickets.length === 0 ? (
                <div className="py-6 text-center">
                  <Wrench className="h-6 w-6 text-[#D2DDD7] mx-auto mb-1 opacity-50" />
                  <p className="text-xs font-bold text-[#546E7A]">No active repair tickets</p>
                  <p className="text-[10px] text-[#78909C] mt-0.5">Use &ldquo;Request Repair&rdquo; to notify maintenance.</p>
                </div>
              ) : (
                tenantTickets.map(t => (
                  <div key={t.id} className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-1">
                    <div className="flex justify-between font-bold text-[#263238]">
                      <span>{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#163B36] text-white font-black">{t.status}</span>
                    </div>
                    <p className="text-[11px] text-[#546E7A]">{t.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal Add Roommate */}
      {isAddRoommateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <h3 className="font-extrabold text-base text-[#263238]">Add Roommate</h3>
              <button onClick={() => setIsAddRoommateModalOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const added: Roommate = {
                id: `rm-${Date.now()}`,
                name: newRoommate.name,
                phone: newRoommate.phone,
                email: newRoommate.email,
                splitPercentage: newRoommate.splitPercentage,
                rentShare: Math.round(rentAmount * (newRoommate.splitPercentage / 100)),
                utilityShare: Math.round(1000 * (newRoommate.splitPercentage / 100)),
                totalPayable: Math.round((rentAmount + 1000) * (newRoommate.splitPercentage / 100)),
                status: 'Pending',
                isPrimary: false
              };
              setRoommates([...roommates, added]);
              setIsAddRoommateModalOpen(false);
              setNewRoommate({ name: '', phone: '', email: '', splitPercentage: 50 });
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Roommate Name</label>
                <input
                  type="text"
                  value={newRoommate.name}
                  onChange={e => setNewRoommate({ ...newRoommate, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newRoommate.phone}
                  onChange={e => setNewRoommate({ ...newRoommate, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={newRoommate.email}
                  onChange={e => setNewRoommate({ ...newRoommate, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                />
              </div>
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Split Percentage ({newRoommate.splitPercentage}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={newRoommate.splitPercentage}
                  onChange={e => setNewRoommate({ ...newRoommate, splitPercentage: Number(e.target.value) })}
                  className="w-full accent-[#163B36]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#163B36] text-white font-bold text-xs hover:bg-[#102B27] transition cursor-pointer"
              >
                Save Roommate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital ID & KYC Modal */}
      {isEKYCModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#163B36]" />
                <h3 className="font-extrabold text-base text-[#263238]">Resident Digital KYC</h3>
              </div>
              <button onClick={() => setIsEKYCModalOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setEkycStatus('Verified');
              setIsEKYCModalOpen(false);
              addNotification('KYC Verified', 'Your resident digital identity has been verified.', 'SYSTEM');
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Aadhaar Number (12 Digits)</label>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-bold font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Instant UIDAI OTP & NSDL verification will link your lease legally.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] text-white font-bold text-xs hover:bg-[#102B27] transition shadow-md cursor-pointer"
              >
                Verify &amp; Save KYC
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Customize Meals */}
      {isMealCustomizerOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Customize Daily Meal Plan</h3>
                <p className="text-xs text-[#546E7A]">Select which meals you want included in your monthly rent</p>
              </div>
              <button onClick={() => setIsMealCustomizerOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: 'breakfast' as const, label: 'Breakfast', timing: '7:30 - 9:30 AM', price: '₹1,200/mo', defaultMenu: 'Idli, Dosa, Poha, Coffee/Tea' },
                { key: 'lunch' as const, label: 'Lunch', timing: '12:30 - 2:30 PM', price: '₹1,400/mo', defaultMenu: 'Rice, Dal, 2 Sabzi, Curd, Salad' },
                { key: 'dinner' as const, label: 'Dinner', timing: '7:30 - 9:30 PM', price: '₹1,400/mo', defaultMenu: 'Roti, Paneer/Egg/Chicken, Rice, Kheer' }
              ].map(meal => (
                <div
                  key={meal.key}
                  onClick={() => toggleMealOption(meal.key)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    subscribedMeals[meal.key] && !foodOptedOut
                      ? 'bg-[#E8F0EC] border-[#163B36] text-[#263238]'
                      : 'bg-[#F7F8F6] border-[#D2DDD7] text-[#546E7A]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-sm text-[#263238] flex items-center gap-2">
                      <span>{meal.label}</span>
                      <span className="text-[10px] text-[#546E7A] font-normal">({meal.timing})</span>
                    </div>
                    <div className="text-[11px] text-[#546E7A]">{meal.defaultMenu}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-xs text-[#163B36] block">{meal.price}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                      subscribedMeals[meal.key] && !foodOptedOut ? 'bg-[#163B36] text-white' : 'bg-slate-200 text-[#546E7A]'
                    }`}>
                      {subscribedMeals[meal.key] && !foodOptedOut ? 'Included' : 'Paused'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-[#263238]">
              <b>Flexible Policy:</b> Any meal plan updates take effect immediately on your digital rent ledger.
            </div>

            <button
              onClick={() => {
                setIsMealCustomizerOpen(false);
                addNotification('Meal Plan Updated', 'Your customized daily dining preferences have been saved.', 'RENT');
              }}
              className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              Save Meal Preferences
            </button>
          </div>
        </div>
      )}

      {/* Modal: View Food Menu */}
      {isViewMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Weekly Hostel &amp; Mess Menu</h3>
                <p className="text-xs text-[#546E7A]">Catered by Annapoorna Kitchens • Quality Audited Weekly</p>
              </div>
              <button onClick={() => setIsViewMenuModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {(pgMeals.length > 0 ? pgMeals : [
                { id: '1', mealType: 'Breakfast', menu: 'Idli, Medu Vada, Coconut Chutney, Tomato Chutney, Piping Sambar & Coffee', costPerMeal: 60, vendor: 'Annapoorna Kitchens' },
                { id: '2', mealType: 'Lunch', menu: 'Steamed Basmati Rice, Chapati, Dal Tadka, Seasonal Mix Veg, Curd & Salad', costPerMeal: 80, vendor: 'Annapoorna Kitchens' },
                { id: '3', mealType: 'Dinner', menu: 'Wheat Phulkas, Paneer Butter Masala (Veg) / Egg Curry, Jeera Rice, Sweet Gulab Jamun', costPerMeal: 90, vendor: 'Annapoorna Kitchens' }
              ]).map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#263238] text-sm">{m.mealType}</span>
                    <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-md border border-[#D2DDD7]">
                      ₹{m.costPerMeal}/plate
                    </span>
                  </div>
                  <p className="text-xs text-[#546E7A] leading-relaxed">{m.menu}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setIsViewMenuModalOpen(false);
                  setIsMealCustomizerOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#102B27] transition shadow-xs cursor-pointer"
              >
                Customize My Plan
              </button>
              <button
                onClick={() => setIsViewMenuModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[#E8F0EC] text-[#263238] text-xs font-bold hover:bg-[#DCE8E1] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
