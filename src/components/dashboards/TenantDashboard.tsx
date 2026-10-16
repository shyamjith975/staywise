'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  CreditCard, 
  CheckCircle,
  CheckCircle2, 
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
  Utensils,
  UploadCloud,
  Check,
  Trash2,
  BedDouble,
  Building2,
  LogOut
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
    foodMenuItems,
    properties,
    tenantConnectionRequests,
    createTenantConnectionRequest,
    requestTenantMoveOut,
    addNotification
  } = useAppState();

  const isDemoTenant = currentUser?.email === 'tenant@staywise.com' || currentUser?.id === 'user-tenant-shyam';

  // Tenancy Property Category: PG, Residential, Commercial
  const [activeTenancyType, setActiveTenancyType] = useState<'PG' | 'Residential' | 'Commercial'>('PG');

  // Connect to Landlord Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({
    ownerIdentifier: '',
    ownerEmail: '',
    propertyId: '',
    propertyName: '',
    unitNumber: '',
    monthlyRent: 25000,
    depositAmount: 50000,
    leaseStartDate: '2026-11-01',
    tenancyType: 'PG' as 'PG' | 'Residential' | 'Commercial',
    includeFoodPlan: true,
    aadhaarNumber: '',
    panNumber: '',
    documents: [] as Array<{ id: string; name: string; size: string; type: string; uploadDate: string; dataUrl?: string }>
  });
  const [connectValidationError, setConnectValidationError] = useState('');

  // Move-Out Modal State
  const [isMoveOutModalOpen, setIsMoveOutModalOpen] = useState(false);
  const [moveOutForm, setMoveOutForm] = useState({
    moveOutDate: '2026-11-30',
    moveOutReason: 'Job relocation / lease completion',
    forwardingUpi: currentUser.email || ''
  });

  // Check connection requests for this user
  const userConnection = tenantConnectionRequests.find(r => 
    r.tenantUserId === currentUser.id || 
    (currentUser.email && r.tenantEmail?.toLowerCase() === currentUser.email?.toLowerCase())
  );

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

  // Reset demo states or populate from currentTenant and database
  useEffect(() => {
    if (isDemoTenant) {
      setRoommates(DEMO_ROOMMATES);
      setResidentDocs(DEMO_RESIDENT_DOCS);
      setEkycStatus('Verified');
      setAadhaarNumber('5481 9028 1142');
      setPanNumber('BLRPS9912A');
      setActiveTenancyType('PG');
    } else if (currentTenant) {
      if (currentTenant.tenancyType) {
        setActiveTenancyType(currentTenant.tenancyType);
      }
      if (currentTenant.aadhaarNumber) {
        setAadhaarNumber(currentTenant.aadhaarNumber);
        setEkycStatus('Verified');
      }
      if (currentTenant.panNumber) {
        setPanNumber(currentTenant.panNumber);
      }
      if (currentTenant.documents && Array.isArray(currentTenant.documents)) {
        setResidentDocs(currentTenant.documents.map(d => ({
          id: d.id,
          name: d.name,
          size: d.size || '1.0 MB',
          date: d.date || (d as any).uploadDate || '2026-10-16'
        })));
      }

      // Automatically sync roommates from coTenant or roommates sharing same unit
      const matchedRoommates: Roommate[] = [];
      if (currentTenant.coTenantName) {
        const splitPct = currentTenant.rentSharePercentage ? (100 - currentTenant.rentSharePercentage) : 50;
        const rShare = Math.round(((currentTenant.monthlyRent || 20000) * splitPct) / 100);
        matchedRoommates.push({
          id: currentTenant.coTenantId || 'rm-cotenant',
          name: currentTenant.coTenantName,
          phone: currentTenant.coTenantPhone || '',
          email: currentTenant.coTenantEmail || '',
          splitPercentage: splitPct,
          rentShare: rShare,
          utilityShare: 1200,
          totalPayable: rShare + 1200,
          status: 'Paid',
          isPrimary: false
        });
      }
      // Check other tenants sharing same property & unit
      const unitRoommates = tenants.filter(t => 
        t.id !== currentTenant.id && 
        t.propertyId === currentTenant.propertyId && 
        t.unitNumber === currentTenant.unitNumber
      );
      for (const urm of unitRoommates) {
        if (!matchedRoommates.some(m => m.id === urm.id || (m.email && m.email === urm.email))) {
          const rShare = Math.round(urm.monthlyRent || 0);
          matchedRoommates.push({
            id: urm.id,
            name: urm.name,
            phone: urm.phone,
            email: urm.email,
            splitPercentage: urm.rentSharePercentage || 50,
            rentShare: rShare,
            utilityShare: 1200,
            totalPayable: rShare + 1200,
            status: 'Paid',
            isPrimary: false
          });
        }
      }
      setRoommates(matchedRoommates);
    } else {
      setRoommates([]);
      setResidentDocs([]);
      setEkycStatus('Pending');
      setAadhaarNumber('');
      setPanNumber('');
    }
  }, [isDemoTenant, currentTenant, tenants]);

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

  const renderConnectModal = () => {
    if (!isConnectModalOpen) return null;

    const handleDocumentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      const newDocs = Array.from(e.target.files).map((file, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.name.toLowerCase().includes('agreement') ? 'RENTAL_AGREEMENT' : 'EKYC_IDENTITY',
        uploadDate: new Date().toISOString().split('T')[0]
      }));
      setConnectForm(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
      setConnectValidationError('');
    };

    const handleAttachSampleDocs = () => {
      const sampleDocs = [
        {
          id: `doc-${Date.now()}-1`,
          name: 'Aadhaar_Card_eKYC_Verified.pdf',
          size: '420.5 KB',
          type: 'EKYC_IDENTITY',
          uploadDate: new Date().toISOString().split('T')[0]
        },
        {
          id: `doc-${Date.now()}-2`,
          name: 'Signed_Rental_Agreement_Copy.pdf',
          size: '1.2 MB',
          type: 'RENTAL_AGREEMENT',
          uploadDate: new Date().toISOString().split('T')[0]
        }
      ];
      setConnectForm(prev => ({
        ...prev,
        aadhaarNumber: prev.aadhaarNumber || '5481 9028 1142',
        panNumber: prev.panNumber || 'BLRPS9912A',
        documents: [...prev.documents, ...sampleDocs]
      }));
      setConnectValidationError('');
    };

    const removeDoc = (id: string) => {
      setConnectForm(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== id)
      }));
    };

    const handleConnectSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setConnectValidationError('');

      const rawAadhaar = connectForm.aadhaarNumber.replace(/[\s\-]/g, '');
      if (!/^\d{12}$/.test(rawAadhaar)) {
        setConnectValidationError('Mandatory eKYC: Please enter a valid 12-digit Aadhaar number.');
        return;
      }

      const rawPan = connectForm.panNumber.trim().toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(rawPan)) {
        setConnectValidationError('Mandatory eKYC: Please enter a valid 10-character PAN (e.g. ABCDE1234F).');
        return;
      }

      if (connectForm.documents.length === 0) {
        setConnectValidationError('Mandatory Documents: Please upload at least one identity document or signed rental agreement.');
        return;
      }

      const identifier = connectForm.ownerIdentifier.trim();
      const isEmail = identifier.includes('@');
      const isPhone = /^(\+91[\-\s]?)?[0-9]{10}$/.test(identifier.replace(/[\s\-]/g, '')) || (!isEmail && !identifier.startsWith('usr-') && !identifier.startsWith('owner-') && /\d{6,}/.test(identifier));

      createTenantConnectionRequest({
        tenantUserId: currentUser.id || 'usr-tenant',
        tenantName: currentUser.name || 'Tenant',
        tenantEmail: currentUser.email || '',
        tenantPhone: (currentUser as any).phone || '+91 98450 11928',
        ownerEmail: isEmail ? identifier : (connectForm.ownerEmail || undefined),
        ownerPhone: isPhone ? identifier : undefined,
        ownerId: (!isEmail && !isPhone) ? identifier : undefined,
        ownerCode: identifier,
        propertyId: connectForm.propertyId || properties[0]?.id || '',
        propertyName: connectForm.propertyName || properties[0]?.name || 'Apartments',
        unitNumber: connectForm.unitNumber || 'Unit 101',
        monthlyRent: Number(connectForm.monthlyRent) || 20000,
        depositAmount: Number(connectForm.depositAmount) || 40000,
        leaseStartDate: connectForm.leaseStartDate,
        tenancyType: connectForm.tenancyType,
        hasFood: connectForm.tenancyType === 'PG' ? connectForm.includeFoodPlan : false,
        aadhaarNumber: connectForm.aadhaarNumber,
        panNumber: rawPan,
        documents: connectForm.documents.map(d => ({
          id: d.id,
          name: d.name,
          size: d.size,
          date: d.uploadDate || new Date().toISOString().split('T')[0],
          type: d.type
        }))
      });

      setEkycStatus('Verified');
      setAadhaarNumber(connectForm.aadhaarNumber);
      setPanNumber(rawPan);
      setIsConnectModalOpen(false);

      addNotification(
        'Connection & eKYC Sent',
        `Your lease connection request with verified Aadhaar, PAN, and ${connectForm.documents.length} document(s) was sent to the landlord.`,
        'RENT'
      );
    };

    return (
      <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Connect to Landlord &amp; Complete eKYC</h3>
              <p className="text-xs text-[#546E7A]">Mandatory Digital KYC, Agreement &amp; Unit Linking</p>
            </div>
            <button onClick={() => setIsConnectModalOpen(false)} className="text-[#546E7A] hover:text-[#263238] cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {connectValidationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{connectValidationError}</span>
            </div>
          )}

          <form onSubmit={handleConnectSubmit} className="space-y-4 text-xs">
            {/* Landlord Identification */}
            <div>
              <label className="block text-[#263238] font-bold mb-1">
                Owner Phone Number, Owner ID, or Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98450 11928, user-owner-vikram, or owner@staywise.com"
                value={connectForm.ownerIdentifier}
                onChange={(e) => setConnectForm({ ...connectForm, ownerIdentifier: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              />
              <span className="text-[10px] text-[#546E7A] mt-0.5 block">
                Enter your landlord&apos;s registered mobile number, email, or unique Owner ID.
              </span>
            </div>

            {/* Property Selection */}
            <div>
              <label className="block text-[#263238] font-bold mb-1">Property Name / Campus (Optional)</label>
              {properties.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={connectForm.propertyId}
                    onChange={(e) => {
                      const p = properties.find(prop => prop.id === e.target.value);
                      setConnectForm({ ...connectForm, propertyId: e.target.value, propertyName: p?.name || '' });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="">Select registered property (or enter name below)...</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter property name (e.g. Prestige Greenwoods)"
                    value={connectForm.propertyName}
                    onChange={(e) => setConnectForm({ ...connectForm, propertyName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium text-xs"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Beach Road Luxury Apartments, Horizon Villa"
                  value={connectForm.propertyName}
                  onChange={(e) => setConnectForm({ ...connectForm, propertyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              )}
            </div>

            {/* Tenancy Type */}
            <div>
              <label className="block text-[#263238] font-bold mb-1">
                Tenancy Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={connectForm.tenancyType}
                onChange={(e) => {
                  const newType = e.target.value as 'PG' | 'Residential' | 'Commercial';
                  setConnectForm({ ...connectForm, tenancyType: newType });
                  setActiveTenancyType(newType);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
              >
                <option value="PG">PG &amp; Co-Living (Hostel / Bed / Shared Room)</option>
                <option value="Residential">Residential (Apartment / Flat / Independent Home)</option>
                <option value="Commercial">Commercial (Office Space / Retail Shop / Warehouse)</option>
              </select>
            </div>

            {connectForm.tenancyType === 'PG' && (
              <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#263238] text-xs">Include Mess &amp; Daily Meals</div>
                  <div className="text-[10px] text-[#546E7A]">₹3,600/month for daily breakfast, lunch &amp; dinner pass</div>
                </div>
                <input
                  type="checkbox"
                  checked={connectForm.includeFoodPlan}
                  onChange={(e) => setConnectForm({ ...connectForm, includeFoodPlan: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#163B36] cursor-pointer"
                />
              </div>
            )}

            {/* Unit & Lease Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#263238] font-bold mb-1">
                  Unit / Flat / Room <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 302 or Bed A-1"
                  value={connectForm.unitNumber}
                  onChange={(e) => setConnectForm({ ...connectForm, unitNumber: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>
              <div>
                <label className="block text-[#263238] font-bold mb-1">Lease Start Date</label>
                <input
                  type="date"
                  value={connectForm.leaseStartDate}
                  onChange={(e) => setConnectForm({ ...connectForm, leaseStartDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>
            </div>

            {/* Rent & Deposit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={connectForm.monthlyRent}
                  onChange={(e) => setConnectForm({ ...connectForm, monthlyRent: Number(e.target.value) })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-tabular"
                />
              </div>
              <div>
                <label className="block text-[#263238] font-bold mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={connectForm.depositAmount}
                  onChange={(e) => setConnectForm({ ...connectForm, depositAmount: Number(e.target.value) })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-tabular"
                />
              </div>
            </div>

            {/* MANDATORY eKYC SECTION */}
            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-[#263238]">
                  <Fingerprint className="h-4 w-4 text-[#163B36]" />
                  <span>Mandatory Resident eKYC</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  UIDAI &amp; ITD Mandated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#546E7A] font-bold mb-1">
                    Aadhaar Number (12 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="XXXX XXXX XXXX"
                    value={connectForm.aadhaarNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, '').slice(0, 12);
                      const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
                      setConnectForm({ ...connectForm, aadhaarNumber: formatted });
                    }}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
                  />
                  <span className="text-[10px] text-[#546E7A] mt-0.5 block">12-digit Indian Aadhaar</span>
                </div>

                <div>
                  <label className="block text-[#546E7A] font-bold mb-1">
                    PAN Card (10 Characters) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={connectForm.panNumber}
                    onChange={(e) => setConnectForm({ ...connectForm, panNumber: e.target.value.toUpperCase().trim() })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold uppercase"
                  />
                  <span className="text-[10px] text-[#546E7A] mt-0.5 block">10-digit Permanent Account Number</span>
                </div>
              </div>
            </div>

            {/* MANDATORY DOCUMENTS & RENTAL AGREEMENT UPLOAD */}
            <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-[#263238]">
                  <FileText className="h-4 w-4 text-[#163B36]" />
                  <span>Rental Agreement &amp; Identity Documents <span className="text-rose-500">*</span></span>
                </div>
                <button
                  type="button"
                  onClick={handleAttachSampleDocs}
                  className="text-[11px] font-bold text-[#163B36] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3 text-[#C69A55]" />
                  <span>+ Auto-attach Sample eKYC &amp; Agreement</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-[#D2DDD7] hover:border-[#163B36] rounded-2xl p-4 text-center block cursor-pointer transition bg-white">
                <UploadCloud className="h-6 w-6 text-[#163B36] mx-auto mb-1" />
                <span className="font-bold text-[#263238] block text-xs">Click to browse or drag and drop</span>
                <span className="text-[10px] text-[#546E7A] block">Upload Aadhaar / Passport PDF, Voter ID, and signed Rental Agreement (PDF, PNG, JPG)</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleDocumentAdd}
                  className="hidden"
                />
              </label>

              {/* Attached Documents List */}
              {connectForm.documents.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-[#546E7A]">Attached Documents ({connectForm.documents.length}):</div>
                  {connectForm.documents.map((doc) => (
                    <div key={doc.id} className="p-2.5 rounded-xl bg-white border border-[#D2DDD7] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-[#163B36] shrink-0" />
                        <span className="font-bold text-[#263238] truncate text-[11px]">{doc.name}</span>
                        <span className="text-[10px] text-[#546E7A] shrink-0">({doc.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoc(doc.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer shrink-0"
                        title="Remove Document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-black text-xs transition shadow-md cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-[#C69A55]" />
              <span>Verify eKYC &amp; Send Connection Request</span>
            </button>
          </form>
        </div>
      </div>
    );
  };

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

        {/* Connection Status or Connect Button */}
        {userConnection?.status === 'PENDING_APPROVAL' ? (
          <div className="rounded-3xl bg-[#E8F0EC] border border-[#163B36]/30 p-6 sm:p-8 shadow-sm">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-black tracking-wide text-amber-900 uppercase">
                  Connection Request Pending Approval
                </span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#263238]">
                  Connecting to {userConnection.propertyName || 'Property'} • Unit {userConnection.unitNumber}
                </h2>
                <p className="text-xs text-[#546E7A] mt-1 leading-relaxed">
                  Your tenancy connection request has been sent to the property owner ({userConnection.ownerEmail || 'Owner'}). Once verified and approved, your lease ledger, power bills, and keys will activate immediately.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#D2DDD7]">
                  <span className="text-[10px] text-[#546E7A] block">Unit Number</span>
                  <span className="font-bold text-[#263238]">{userConnection.unitNumber}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D2DDD7]">
                  <span className="text-[10px] text-[#546E7A] block">Monthly Rent</span>
                  <span className="font-bold text-[#163B36] font-tabular">₹{userConnection.monthlyRent?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D2DDD7]">
                  <span className="text-[10px] text-[#546E7A] block">Security Deposit</span>
                  <span className="font-bold text-[#263238] font-tabular">₹{userConnection.depositAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D2DDD7]">
                  <span className="text-[10px] text-[#546E7A] block">Lease Start</span>
                  <span className="font-bold text-[#263238]">{userConnection.leaseStartDate}</span>
                </div>
              </div>
            </div>
          </div>
        ) : userConnection?.status === 'MOVED_OUT' ? (
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 shadow-sm">
            <div className="max-w-2xl space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#263238]">Previous Tenancy Completed &amp; Settled</h2>
                <p className="text-xs text-[#546E7A] mt-1.5 leading-relaxed">
                  Your move-out from {userConnection.propertyName} Unit {userConnection.unitNumber} was verified by the owner. Security deposit escrow of ₹{userConnection.depositSettledAmount?.toLocaleString('en-IN')} has been settled.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  <span>+ Connect to Next Property / Landlord</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 sm:p-8 shadow-sm">
            <div className="max-w-2xl space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4] flex items-center justify-center">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#263238]">Connect to Your Property (Residential, PG, or Commercial)</h2>
                <p className="text-xs text-[#546E7A] mt-1.5 leading-relaxed">
                  Connect your tenant account directly to your property owner to view your lease agreement, upcoming rent dues, roommate splits, electricity bills, and service requests.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  <span>+ Connect with Property Owner</span>
                </button>
                <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-[#546E7A]">
                  Your ID: <b className="text-[#263238] font-mono">{currentUser?.email || currentUser?.id}</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3 Onboarding Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">Quick Identity Verification</h3>
            <p className="text-xs text-[#546E7A]">
              Verify your Aadhaar and PAN so your landlord can prepare your rental agreement without paperwork.
            </p>
            <button
              onClick={() => setIsEKYCModalOpen(true)}
              className="text-xs font-bold text-[#163B36] hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              Verify identity now →
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">Safe Security Deposit</h3>
            <p className="text-xs text-[#546E7A]">
              Your deposit is tracked with a clear digital record and itemized checkout checklist for a smooth, fair refund.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#D2DDD7] p-5 space-y-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#FAF5EB] text-[#8C6B2E] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-extrabold text-sm text-[#263238]">On-Time Rent Rewards</h3>
            <p className="text-xs text-[#546E7A]">
              Earn resident reward points every time you pay rent on time via UPI, card, or autopay.
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

        {/* Connect to Landlord Modal */}
        {renderConnectModal()}
      </div>
    );
  }

  // Active / Assigned Tenant View
  const rentAmount = pendingInvoice ? pendingInvoice.totalAmount : (currentTenant.monthlyRent || 0);

  // Tenancy Category fetched from Database (tenants.tenancy_type or connection request or property)
  const tenantProperty = properties.find(p => 
    (currentTenant?.propertyId && p.id === currentTenant.propertyId) ||
    (currentTenant?.propertyName && p.name.toLowerCase() === currentTenant.propertyName.toLowerCase())
  );

  const dbTenancyType = (
    currentTenant?.tenancyType ||
    userConnection?.tenancyType ||
    activeTenancyType ||
    (tenantProperty?.type?.toLowerCase().includes('pg') || tenantProperty?.type?.toLowerCase().includes('co-living') || tenantProperty?.type?.toLowerCase().includes('hostel') ? 'PG' :
     tenantProperty?.type?.toLowerCase().includes('commercial') || tenantProperty?.type?.toLowerCase().includes('office') || tenantProperty?.type?.toLowerCase().includes('shop') ? 'Commercial' : 'Residential')
  );

  const normalizedCategory: 'PG' | 'Commercial' | 'Residential' = 
    dbTenancyType.toUpperCase().includes('PG') || dbTenancyType.toUpperCase().includes('HOSTEL') || dbTenancyType.toUpperCase().includes('CO-LIVING')
      ? 'PG'
      : dbTenancyType.toUpperCase().includes('COMMERCIAL') || dbTenancyType.toUpperCase().includes('OFFICE') || dbTenancyType.toUpperCase().includes('SHOP')
        ? 'Commercial'
        : 'Residential';

  const categoryDetails = {
    PG: {
      label: 'PG & Co-Living',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: <BedDouble className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
    },
    Commercial: {
      label: 'Commercial Space',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: <Building2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
    },
    Residential: {
      label: 'Residential Flat',
      badgeClass: 'bg-emerald-50 text-[#163B36] border-emerald-200',
      icon: <Home className="h-3.5 w-3.5 text-[#163B36] shrink-0" />
    }
  }[normalizedCategory];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238]">
      {/* Resident Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#D2DDD7]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#263238] flex flex-wrap items-center gap-2">
              <span>Welcome home, {currentTenant.name.split(' ')[0]}!</span>
              <span 
                className={`text-xs px-2.5 py-1 rounded-full font-extrabold border inline-flex items-center gap-1.5 shadow-2xs ${categoryDetails.badgeClass}`}
                title={`Tenancy Category: ${categoryDetails.label} (Database Record)`}
              >
                {categoryDetails.icon}
                <span>{categoryDetails.label}</span>
              </span>
            </h1>
            <span className={`text-xs px-2.5 sm:px-3 py-1 rounded-full font-extrabold border flex items-center gap-1 shadow-2xs shrink-0 ${
              ekycStatus === 'Verified' 
                ? 'bg-[#163B36] text-white border-[#163B36]' 
                : 'bg-[#FAF5EB] text-[#8C6B2E] border-[#ECCFA4]'
            }`}>
              <ShieldCheck className="h-3.5 w-3.5 text-[#C69A55] shrink-0" />
              <span>{ekycStatus === 'Verified' ? 'eKYC Verified' : 'KYC Pending'}</span>
            </span>
          </div>
          <p className="text-xs text-[#546E7A] font-medium">
            Unit {currentTenant.unitNumber}, {currentTenant.propertyName} • Active lease until {currentTenant.leaseEnd || '2027'}
          </p>
        </div>

        {/* Action Buttons: Responsive with small icons on mobile to avoid overflow */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0">
          {userConnection?.status === 'MOVE_OUT_PENDING' ? (
            <span className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Move-Out Pending Verification</span>
              <span className="sm:hidden text-[11px]">Move-Out Pending</span>
            </span>
          ) : (
            <button
              onClick={() => setIsMoveOutModalOpen(true)}
              className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3.5 sm:py-2 rounded-full bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 transition shadow-2xs cursor-pointer shrink-0"
              title="Request Move-Out"
              aria-label="Request Move-Out"
            >
              <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
              <span className="hidden sm:inline">Request Move-Out</span>
            </button>
          )}
          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-3.5 sm:py-2 rounded-full bg-white hover:bg-[#E8F0EC] text-[#263238] text-xs font-bold border border-[#D2DDD7] transition shadow-2xs cursor-pointer shrink-0"
            title="Digital ID / eKYC"
            aria-label="Digital ID"
          >
            <Fingerprint className="h-4 w-4 text-[#163B36] shrink-0" />
            <span className="hidden sm:inline">Digital ID</span>
          </button>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="flex items-center justify-center gap-1.5 h-8 w-8 sm:h-auto sm:w-auto p-0 sm:px-4 sm:py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            title="Request Repair / Maintenance"
            aria-label="Request Repair"
          >
            <Wrench className="h-4 w-4 text-[#C69A55] shrink-0" />
            <span className="hidden sm:inline">Request Repair</span>
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
                className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
                title="Add Roommate"
              >
                <UserPlus className="h-3.5 w-3.5 text-[#C69A55] shrink-0" />
                <span className="hidden sm:inline">Add Roommate</span>
                <span className="sm:hidden text-[11px]">+ Add</span>
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

          {/* Tenancy Category Specific Service Card */}
          {activeTenancyType === 'PG' ? (
            currentTenant && currentTenant.hasFood === false ? (
              /* Mess & Dining Service Disabled / Accommodation Only Message Card */
              <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-[#D1D5DB] pb-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4] flex items-center justify-center font-bold">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#263238]">Mess &amp; Dining Service — Accommodation Only</h3>
                    <p className="text-xs text-[#546E7A]">No meal plan is registered for Room {currentTenant.unitNumber || 'assigned'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#ECCFA4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-white text-[#8C6B2E] border border-[#ECCFA4]">
                        No Food Facility Active
                      </span>
                      <span className="text-xs font-bold text-[#8C6B2E]">Mess charges excluded from your rent</span>
                    </div>
                    <p className="text-xs text-[#263238] leading-relaxed">
                      Your room/bed was onboarded with accommodation-only (No Food). If you would like fresh breakfast, lunch, and dinner delivered daily from Annapoorna Kitchens, submit an activation request to your property manager.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        addNotification(
                          'Meal Plan Requested',
                          'Your request to activate daily mess & food plan (₹3,600/mo) has been sent to the property manager.',
                          'RENT'
                        );
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Utensils className="h-3.5 w-3.5 text-[#C69A55]" />
                      <span>Request Meal Plan (₹3,600/mo)</span>
                    </button>
                    <button
                      onClick={() => setIsViewMenuModalOpen(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7] text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>View Menu</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Mess & Dining Subscription Management Card (PG Tenants with Food Enabled) */
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
            )
          ) : activeTenancyType === 'Residential' ? (
            /* Residential Community & Amenities Card (No Food Option) */
            <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1D5DB] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#263238]">Society Amenities &amp; Access</h3>
                    <p className="text-xs text-[#546E7A]">Residential apartment privileges, visitor gatepass, and parking slot</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active Resident
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Designated Parking</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">Slot P-204 (Basement 1)</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">Four-wheeler &amp; two-wheeler permit</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Visitor Gatepass Code</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">#SW-9842</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">Share with guests for security entry</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Clubhouse &amp; Gym</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">Digital Access Active</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">6:00 AM – 10:00 PM Daily</div>
                </div>
              </div>
            </div>
          ) : (
            /* Commercial Tenancy & GST Card (No Food Option) */
            <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1D5DB] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center font-bold">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#263238]">Commercial Lease &amp; Business GST</h3>
                    <p className="text-xs text-[#546E7A]">Registered GSTIN, Input Tax Credit (ITC) tax invoice, and CAM schedule</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#163B36] text-white">
                    Commercial Lease
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Registered Business GSTIN</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">29AABCS1429K1Z5</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">18% GST Input Credit applicable</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Monthly CAM Charges</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">₹4,500 / month</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">Common area maintenance &amp; HVAC</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
                  <div className="font-bold text-[#263238]">Loading Dock &amp; Safety</div>
                  <div className="text-[11px] text-[#163B36] mt-1 font-mono font-bold">NOC Compliant (Active)</div>
                  <div className="text-[10px] text-[#546E7A] mt-0.5">Commercial cargo access Bay 2</div>
                </div>
              </div>
            </div>
          )}

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
      {/* Modal: Customize Meals (PG Tenants Only) */}
      {activeTenancyType === 'PG' && isMealCustomizerOpen && (
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

      {/* Modal: View Food Menu (PG Tenants Only) */}
      {activeTenancyType === 'PG' && isViewMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Hostel &amp; Mess Dining Menu</h3>
                <p className="text-xs text-[#546E7A]">
                  {foodMenuItems.length > 0 ? `${foodMenuItems[0].vendor || 'Kitchen'} • Daily Rotation` : (isDemoTenant ? 'Catered by Annapoorna Kitchens • Quality Audited Weekly' : 'Daily Resident Menu')}
                </p>
              </div>
              <button onClick={() => setIsViewMenuModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto">
              {(() => {
                const combinedMeals = foodMenuItems.length > 0 
                  ? foodMenuItems 
                  : (pgMeals.length > 0 
                      ? pgMeals.map(m => ({ id: m.id, mealType: m.mealType, menu: m.menu, costPerMeal: m.costPerMeal, vendor: m.vendor, dietaryType: 'Veg' }))
                      : (isDemoTenant ? [
                          { id: '1', mealType: 'Breakfast', menu: 'Idli, Medu Vada, Coconut Chutney, Tomato Chutney, Piping Sambar & Coffee', costPerMeal: 60, vendor: 'Annapoorna Kitchens', dietaryType: 'Veg' },
                          { id: '2', mealType: 'Lunch', menu: 'Steamed Basmati Rice, Chapati, Dal Tadka, Seasonal Mix Veg, Curd & Salad', costPerMeal: 80, vendor: 'Annapoorna Kitchens', dietaryType: 'Veg' },
                          { id: '3', mealType: 'Dinner', menu: 'Wheat Phulkas, Paneer Butter Masala (Veg) / Egg Curry, Jeera Rice, Sweet Gulab Jamun', costPerMeal: 90, vendor: 'Annapoorna Kitchens', dietaryType: 'Veg' }
                        ] : []));

                if (combinedMeals.length === 0) {
                  return (
                    <div className="p-8 text-center rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2">
                      <Utensils className="h-8 w-8 text-[#546E7A] mx-auto opacity-50" />
                      <div className="font-extrabold text-sm text-[#263238]">No Meal Plan Published Yet</div>
                      <p className="text-xs text-[#546E7A] max-w-xs mx-auto">
                        Your property manager has not published the dining menu for this hostel/residence.
                      </p>
                    </div>
                  );
                }

                return combinedMeals.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#263238] text-sm">{m.mealType}</span>
                        {m.dietaryType && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {m.dietaryType}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-md border border-[#D2DDD7]">
                        ₹{m.costPerMeal}/plate
                      </span>
                    </div>
                    <p className="text-xs text-[#546E7A] leading-relaxed">{m.menu}</p>
                  </div>
                ));
              })()}
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

      {/* Modal: Connect to Landlord / Property */}
      {renderConnectModal()}

      {/* Modal: Request Move-Out */}
      {isMoveOutModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Request Move-Out &amp; Settlement</h3>
                <p className="text-xs text-[#546E7A]">Initiate move-out inspection and escrow deposit release</p>
              </div>
              <button onClick={() => setIsMoveOutModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              requestTenantMoveOut(userConnection?.id || (currentTenant ? currentTenant.id : 'req-default'), {
                moveOutDate: moveOutForm.moveOutDate,
                moveOutReason: moveOutForm.moveOutReason
              });
              setIsMoveOutModalOpen(false);
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Expected Move-Out Date</label>
                <input
                  type="date"
                  value={moveOutForm.moveOutDate}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, moveOutDate: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>

              <div>
                <label className="block text-[#263238] font-bold mb-1">Reason for Move-Out</label>
                <select
                  value={moveOutForm.moveOutReason}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, moveOutReason: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                >
                  <option value="Job relocation">Job relocation</option>
                  <option value="Lease tenure completed">Lease tenure completed</option>
                  <option value="Moving to larger apartment">Moving to larger apartment</option>
                  <option value="Personal reasons">Personal reasons</option>
                </select>
              </div>

              <div>
                <label className="block text-[#263238] font-bold mb-1">Refund Bank UPI ID (For Escrow Release)</label>
                <input
                  type="text"
                  placeholder="e.g. resident@okhdfcbank"
                  value={moveOutForm.forwardingUpi}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, forwardingUpi: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-mono"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[11px] text-[#263238] leading-relaxed">
                <b>MoveFlow Settlement:</b> Your landlord will perform the move-out inspection and counter-sign the escrow release to transfer your deposit directly to your verified bank account.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Confirm Move-Out Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
