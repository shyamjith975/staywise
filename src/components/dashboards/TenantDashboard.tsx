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
  AlertCircle
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

  const unitBill = isDemoTenant
    ? electricityBills.find(b => b.unitNumber === '302')
    : (currentTenant ? electricityBills.find(b => b.propertyId === currentTenant.propertyId && b.unitNumber === currentTenant.unitNumber) : null);

  // If new tenant is not assigned to any property yet, show dedicated unassigned onboarding dashboard
  if (!currentTenant) {
    return (
      <div className="space-y-6 pb-12 font-sans text-[#2a2a2a]">
        {/* Unassigned Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#B5B5B5]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2a2a2a]">
                Welcome, {currentUser?.name || 'Resident'}!
              </h1>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold border flex items-center gap-1 shadow-2xs ${
                ekycStatus === 'Verified' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{ekycStatus === 'Verified' ? 'eKYC Verified' : 'KYC Pending'}</span>
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 font-medium">
              Tenant Portal • No active lease assigned yet
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEKYCModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f0f0f0] text-[#2a2a2a] text-xs font-bold border border-[#B5B5B5] transition shadow-2xs"
            >
              <Fingerprint className="h-4 w-4 text-[#383838]" />
              <span>Complete Digital KYC</span>
            </button>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-white to-[#f9f9f9] border border-[#B5B5B5] p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2a2a2a]">Awaiting Property Lease Link</h2>
              <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                Your tenant account is ready. Once your landlord or PG property manager links you to a unit, your tenancy agreement, upcoming rent dues, roommate splits, and power meter bills will appear here automatically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#666666]">Your Registered Identifier</span>
                <div className="font-mono font-bold text-[#2a2a2a] text-sm">{currentUser?.email || currentUser?.id}</div>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-[#B5B5B5] self-start sm:self-auto">
                Share with your landlord
              </span>
            </div>
          </div>
        </div>

        {/* 3 Onboarding Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-extrabold text-sm text-[#2a2a2a]">Instant Digital KYC</h3>
            <p className="text-xs text-[#666666]">
              Verify your Aadhaar and PAN so your landlord can draft a statutory lease agreement without physical paperwork.
            </p>
            <button
              onClick={() => setIsEKYCModalOpen(true)}
              className="text-xs font-bold text-blue-700 hover:underline pt-1 inline-flex items-center gap-1"
            >
              Verify KYC now →
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-extrabold text-sm text-[#2a2a2a]">Zero-Dispute Escrow</h3>
            <p className="text-xs text-[#666666]">
              Security deposits in Staywise are locked in an RBI-compliant bank escrow trust and released automatically upon clean checkout.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#B5B5B5] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-extrabold text-sm text-[#2a2a2a]">Rent Rewards</h3>
            <p className="text-xs text-[#666666]">
              Earn Staywise resident points with every on-time UPI or bank autopay rent payment to redeem against maintenance discounts.
            </p>
          </div>
        </div>

        {/* Digital ID & KYC Modal */}
        {isEKYCModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#2a2a2a]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#B5B5B5] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB]">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-[#2a2a2a]" />
                  <h3 className="font-extrabold text-base text-[#2a2a2a]">Resident Digital KYC</h3>
                </div>
                <button onClick={() => setIsEKYCModalOpen(false)} className="text-[#666666] hover:text-[#2a2a2a]">
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
                  <label className="block text-[#666666] font-semibold mb-1">Aadhaar Number (12 Digits)</label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarNumber}
                    onChange={e => setAadhaarNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#666666] font-semibold mb-1">Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold font-mono uppercase"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Instant UIDAI OTP & NSDL verification will link your lease legally.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#2a2a2a] text-white font-bold text-xs hover:bg-[#383838] transition shadow-md"
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
    <div className="space-y-6 pb-12 font-sans text-[#2a2a2a]">
      {/* Resident Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#B5B5B5]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2a2a2a]">
              Welcome home, {currentTenant.name.split(' ')[0]}!
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold border flex items-center gap-1 shadow-2xs ${
              ekycStatus === 'Verified' 
                ? 'bg-[#e10600] text-white border-[#2a2a2a]/20' 
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{ekycStatus === 'Verified' ? 'eKYC Verified' : 'KYC Pending'}</span>
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Unit {currentTenant.unitNumber}, {currentTenant.propertyName} • Active lease until {currentTenant.leaseEnd || '2027'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f0f0f0] text-[#2a2a2a] text-xs font-bold border border-[#B5B5B5] transition shadow-2xs"
          >
            <Fingerprint className="h-4 w-4 text-[#383838]" />
            <span>Digital ID</span>
          </button>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white text-xs font-bold shadow-xs transition"
          >
            <Wrench className="h-4 w-4" />
            <span>Request Repair</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Monthly Rent */}
        <div className="bg-[#f0f0f0] rounded-2xl p-4 border border-[#B5B5B5] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#666666]">Your Monthly Rent</div>
            <div className="text-xl font-black text-[#2a2a2a] mt-0.5 font-tabular">
              ₹{rentAmount.toLocaleString('en-IN')}
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${
              pendingInvoice ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              <Clock className="h-3 w-3" />
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
              className="px-4 py-2 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white text-xs font-black shadow-xs transition border border-[#2a2a2a]/20"
            >
              Pay UPI
            </button>
          )}
        </div>

        {/* Metric 2: Reliability Score */}
        <div className="bg-[#f0f0f0] rounded-2xl p-4 border border-[#B5B5B5] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#666666]">Reliability Score</div>
            <div className="text-xl font-black text-[#2a2a2a] mt-0.5 font-tabular">
              {currentTenant.reliabilityScore || 96} / 100
            </div>
            <span className="text-[10px] font-bold text-[#383838] mt-1 block">
              ✓ On-Time Payment Profile
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#B5B5B5] text-[#383838] flex items-center justify-center font-bold shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-[#383838]" />
          </div>
        </div>

        {/* Metric 3: Resident Points & Rewards */}
        <div className="bg-[#f0f0f0] rounded-2xl p-4 border border-[#B5B5B5] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#666666]">Resident Points</div>
            <div className="text-xl font-black text-[#2a2a2a] mt-0.5 font-tabular">
              {currentTenant.rewardsBalance || 0} SWP
            </div>
            <span className="text-[10px] font-bold text-[#e10600] mt-1 block">
              Earn on every on-time payment
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#B5B5B5] text-[#e10600] flex items-center justify-center font-bold shadow-2xs">
            <Gift className="h-5 w-5 text-[#e10600]" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Resident Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Span 8: Roommates Split + Documents */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Roommates & Split Rent Card */}
          <div className="rounded-3xl bg-white border border-[#B5B5B5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#2a2a2a]">Roommates &amp; Split Rent</h3>
                <p className="text-xs text-[#666666]">
                  {roommates.length > 0 
                    ? `Split unit rent & utilities with verified flatmates`
                    : 'Add co-tenants or flatmates to split monthly rent & utility bills'}
                </p>
              </div>
              <button
                onClick={() => setIsAddRoommateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add Roommate</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {roommates.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#B5B5B5] rounded-2xl">
                  <Users className="h-7 w-7 text-[#B5B5B5] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#666666]">No roommates registered</p>
                  <p className="text-[11px] text-[#999999] mt-0.5">Click &ldquo;Add Roommate&rdquo; above to split rent payments seamlessly via WhatsApp UPI links.</p>
                </div>
              ) : (
                roommates.map((rm) => (
                  <div
                    key={rm.id}
                    className="p-3.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#2a2a2a] text-[#e10600] font-black flex items-center justify-center text-xs shrink-0">
                        {rm.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-[#2a2a2a] flex items-center gap-1.5">
                          <span>{rm.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e10600] text-white font-black">
                            {rm.splitPercentage}% Split
                          </span>
                        </div>
                        <div className="text-[11px] text-[#666666]">
                          Rent: ₹{rm.rentShare.toLocaleString('en-IN')} + Power: ₹{rm.utilityShare.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#B5B5B5]">
                      <span className="font-black text-sm text-[#2a2a2a] font-tabular">
                        ₹{rm.totalPayable.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rm.status === 'Paid' ? 'bg-[#c0c0c0] text-[#383838] border border-[#383838]/30' : 'bg-amber-100 text-amber-900 border border-amber-300'
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
          <div className="rounded-3xl bg-white border border-[#B5B5B5] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#2a2a2a]">My Tenancy Documents</h3>
            <div className="space-y-2">
              {residentDocs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-[#B5B5B5] rounded-2xl">
                  <FileText className="h-7 w-7 text-[#B5B5B5] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#666666]">No lease documents uploaded yet</p>
                  <p className="text-[11px] text-[#999999] mt-0.5">Your signed rental agreement and deposit certificates will appear here once executed.</p>
                </div>
              ) : (
                residentDocs.map(doc => (
                  <div key={doc.id} className="p-3 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 text-[#383838] shrink-0" />
                      <span className="font-bold text-[#2a2a2a] truncate">{doc.name}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      className="p-1.5 rounded-full hover:bg-[#c0c0c0] text-[#666666] hover:text-[#2a2a2a] transition"
                    >
                      <Download className="h-3.5 w-3.5 text-[#383838]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Span 4: Power Bill & Service Requests */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Unit Electricity Bill */}
          <div className="rounded-3xl bg-[#f0f0f0] border border-[#B5B5B5] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2a2a2a] flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Unit Electricity Bill</span>
              </span>
              {unitBill && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  unitBill.status === 'Paid' ? 'bg-[#c0c0c0] text-[#383838]' : 'bg-amber-100 text-amber-900'
                }`}>
                  {unitBill.status}
                </span>
              )}
            </div>

            {unitBill ? (
              <>
                <div className="text-2xl font-black text-[#2a2a2a] font-tabular">
                  ₹{unitBill.totalAmount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#666666]">{unitBill.discom} • Due {unitBill.dueDate}</p>

                {unitBill.status === 'Due' && (
                  <button
                    onClick={() => {
                      updateElectricityBill(unitBill.id, { status: 'Paid' });
                      alert('Power bill marked paid via UPI!');
                    }}
                    className="w-full py-2 rounded-full bg-[#e10600] hover:bg-[#c50500] text-white text-xs font-bold shadow-xs transition"
                  >
                    Pay Electricity Bill
                  </button>
                )}
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-bold text-[#666666]">No pending power bills</p>
                <p className="text-[11px] text-[#999999] mt-0.5">Sub-meter bills will show here when generated.</p>
              </div>
            )}
          </div>

          {/* Service Requests */}
          <div className="rounded-3xl bg-white border border-[#B5B5B5] p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#2a2a2a]">Active Repairs</h3>
            <div className="space-y-2 text-xs">
              {tenantTickets.length === 0 ? (
                <div className="py-6 text-center">
                  <Wrench className="h-6 w-6 text-[#B5B5B5] mx-auto mb-1 opacity-50" />
                  <p className="text-xs font-bold text-[#666666]">No active repair tickets</p>
                  <p className="text-[10px] text-[#999999] mt-0.5">Use &ldquo;Request Repair&rdquo; to notify maintenance.</p>
                </div>
              ) : (
                tenantTickets.map(t => (
                  <div key={t.id} className="p-3 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] space-y-1">
                    <div className="flex justify-between font-bold text-[#2a2a2a]">
                      <span>{t.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e10600] text-white font-black">{t.status}</span>
                    </div>
                    <p className="text-[11px] text-[#666666]">{t.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal Add Roommate */}
      {isAddRoommateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2a2a2a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#B5B5B5] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB]">
              <h3 className="font-extrabold text-base text-[#2a2a2a]">Add Roommate</h3>
              <button onClick={() => setIsAddRoommateModalOpen(false)} className="text-[#666666] hover:text-[#2a2a2a]">
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
                <label className="block text-[#666666] font-semibold mb-1">Roommate Name</label>
                <input
                  type="text"
                  value={newRoommate.name}
                  onChange={e => setNewRoommate({ ...newRoommate, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newRoommate.phone}
                  onChange={e => setNewRoommate({ ...newRoommate, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={newRoommate.email}
                  onChange={e => setNewRoommate({ ...newRoommate, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold"
                />
              </div>
              <div>
                <label className="block text-[#666666] font-semibold mb-1">Split Percentage ({newRoommate.splitPercentage}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={newRoommate.splitPercentage}
                  onChange={e => setNewRoommate({ ...newRoommate, splitPercentage: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#2a2a2a] text-[#e10600] font-bold text-xs hover:bg-[#383838] transition"
              >
                Save Roommate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital ID & KYC Modal */}
      {isEKYCModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2a2a2a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#B5B5B5] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D1D5DB]">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#2a2a2a]" />
                <h3 className="font-extrabold text-base text-[#2a2a2a]">Resident Digital KYC</h3>
              </div>
              <button onClick={() => setIsEKYCModalOpen(false)} className="text-[#666666] hover:text-[#2a2a2a]">
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
                <label className="block text-[#666666] font-semibold mb-1">Aadhaar Number (12 Digits)</label>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#666666] font-semibold mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold font-mono uppercase"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Instant UIDAI OTP & NSDL verification will link your lease legally.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#2a2a2a] text-white font-bold text-xs hover:bg-[#383838] transition shadow-md"
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
