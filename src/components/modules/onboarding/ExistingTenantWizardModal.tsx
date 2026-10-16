'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  X, 
  UserPlus, 
  Send, 
  CheckCircle, 
  Copy, 
  ShieldCheck,
  AlertCircle,
  Users,
  Home,
  Building,
  Utensils,
  Share2,
  Check
} from 'lucide-react';

export default function ExistingTenantWizardModal() {
  const { 
    isExistingTenantWizardOpen, 
    setIsExistingTenantWizardOpen, 
    properties, 
    addExistingTenant 
  } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyId: properties[0]?.id || '',
    unitNumber: '',
    monthlyRent: '' as any,
    deposit: '' as any,
    leaseStart: '2026-10-01',
    leaseEnd: '2027-09-30',
    rentDueDate: 5,
    tenancyType: 'PG' as 'PG' | 'Residential' | 'Commercial',
    roomSharing: 'Single' as 'Single' | '2_Sharing',
    includeFood: true,
    // Co-Tenant 2 (for 2_Sharing)
    coTenantName: '',
    coTenantPhone: '',
    coTenantEmail: '',
    rentSharePercentage: 50
  });

  const [copiedPrimary, setCopiedPrimary] = useState(false);
  const [copiedCoTenant, setCopiedCoTenant] = useState(false);

  if (!isExistingTenantWizardOpen) return null;

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (validationError) setValidationError(null);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    setValidationError(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name is required (min 2 chars)';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit phone required';
    }
    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      errors.email = 'Valid email is required';
    }
    if (!formData.unitNumber.trim()) {
      errors.unitNumber = 'Unit / Room number is required';
    }
    if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0) {
      errors.monthlyRent = 'Enter valid rent (₹)';
    }

    // Co-Tenant validation if 2-person sharing
    if (formData.roomSharing === '2_Sharing') {
      if (!formData.coTenantName.trim() || formData.coTenantName.trim().length < 2) {
        errors.coTenantName = 'Co-tenant name is required';
      }
      const cleanCoPhone = formData.coTenantPhone.replace(/\D/g, '');
      if (cleanCoPhone.length < 10) {
        errors.coTenantPhone = 'Valid 10-digit phone required';
      }
      if (!formData.coTenantEmail.trim() || !formData.coTenantEmail.includes('@')) {
        errors.coTenantEmail = 'Valid email is required';
      }
    }

    setFieldErrors(errors);
    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      setValidationError(`Please fill out the ${errorCount} required field${errorCount > 1 ? 's' : ''} highlighted.`);
      return;
    }

    setStep(2);
  };

  const handleSimulateTenantAcceptance = () => {
    const isSharing = formData.roomSharing === '2_Sharing';
    addExistingTenant({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      propertyId: formData.propertyId,
      unitNumber: formData.unitNumber || '101',
      monthlyRent: Number(formData.monthlyRent) || 25000,
      deposit: Number(formData.deposit) || 50000,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      rentDueDate: Number(formData.rentDueDate) || 5,
      tenancyType: formData.tenancyType,
      hasFood: formData.includeFood,
      roomSharing: formData.roomSharing,
      coTenant: isSharing ? {
        name: formData.coTenantName,
        phone: formData.coTenantPhone,
        email: formData.coTenantEmail,
        rentSharePercentage: formData.rentSharePercentage
      } : undefined
    });
    setStep(3);
  };

  const handleClose = () => {
    setIsExistingTenantWizardOpen(false);
    setValidationError(null);
    setFieldErrors({});
    setStep(1);
    setFormData({
      name: '',
      phone: '',
      email: '',
      propertyId: properties[0]?.id || '',
      unitNumber: '',
      monthlyRent: '' as any,
      deposit: '' as any,
      leaseStart: '2026-10-01',
      leaseEnd: '2027-09-30',
      rentDueDate: 5,
      tenancyType: 'PG',
      roomSharing: 'Single',
      includeFood: true,
      coTenantName: '',
      coTenantPhone: '',
      coTenantEmail: '',
      rentSharePercentage: 50
    });
  };

  const baseUnitCode = (formData.unitNumber || '304').replace(/\s+/g, '-');
  const inviteLinkPrimary = `https://staywise.app/invite/stw-${baseUnitCode}-t1-${Date.now().toString().slice(-4)}`;
  const inviteLinkCoTenant = `https://staywise.app/invite/stw-${baseUnitCode}-t2-${Date.now().toString().slice(-4)}`;

  const totalRentNum = Number(formData.monthlyRent) || 0;
  const primaryRentNum = formData.roomSharing === '2_Sharing'
    ? Math.round((totalRentNum * (100 - formData.rentSharePercentage)) / 100)
    : totalRentNum;
  const coRentNum = totalRentNum - primaryRentNum;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-[#ffffff]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#E8F0EC] text-[#163B36] flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#263238]">Onboard Tenant &amp; Roommates</h2>
              <p className="text-[11px] text-[#666666]">PG, Residential Flats &amp; Commercial Multi-Tenant Digital Onboarding</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose} 
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#666666] hover:text-[#263238] hover:bg-[#E8F0EC] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-[#E8F0EC] border-b border-[#E0E0E0] flex items-center justify-between text-xs">
          <span className={`font-bold ${step >= 1 ? 'text-[#163B36]' : 'text-[#888888]'}`}>
            1. Tenancy &amp; Sharing Terms
          </span>
          <span className="text-[#888888]">→</span>
          <span className={`font-bold ${step >= 2 ? 'text-[#163B36]' : 'text-[#888888]'}`}>
            2. Send Dual Invite Links
          </span>
          <span className="text-[#888888]">→</span>
          <span className={`font-bold ${step === 3 ? 'text-[#163B36]' : 'text-[#888888]'}`}>
            3. Verification &amp; Connected
          </span>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#ffffff]">
          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-rose-600 hover:text-rose-800 p-0.5 rounded-full cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              
              {/* 1. Tenancy Type Selection */}
              <div>
                <label className="block text-[#263238] font-bold mb-1.5">
                  Tenancy Category (What type of tenant?)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tenancyType: 'PG', includeFood: true })}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      formData.tenancyType === 'PG'
                        ? 'bg-[#163B36] text-white border-[#163B36] shadow-sm'
                        : 'bg-[#E8F0EC] text-[#263238] border-[#D2DDD7] hover:bg-[#DCE8E1]'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-[11px]">PG &amp; Co-Living</span>
                    <span className="text-[9px] opacity-80">Hostel, Bed &amp; Shared</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tenancyType: 'Residential', includeFood: false })}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      formData.tenancyType === 'Residential'
                        ? 'bg-[#163B36] text-white border-[#163B36] shadow-sm'
                        : 'bg-[#E8F0EC] text-[#263238] border-[#D2DDD7] hover:bg-[#DCE8E1]'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="font-bold text-[11px]">Residential Flat</span>
                    <span className="text-[9px] opacity-80">Apartment / House</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tenancyType: 'Commercial', includeFood: false })}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      formData.tenancyType === 'Commercial'
                        ? 'bg-[#163B36] text-white border-[#163B36] shadow-sm'
                        : 'bg-[#E8F0EC] text-[#263238] border-[#D2DDD7] hover:bg-[#DCE8E1]'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    <span className="font-bold text-[11px]">Commercial</span>
                    <span className="text-[9px] opacity-80">Office / Retail</span>
                  </button>
                </div>
              </div>

              {/* 2. Room Sharing Occupancy Selector */}
              <div className="p-3.5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[#263238] font-bold text-xs">Room Occupancy &amp; Sharing</label>
                    <p className="text-[10px] text-[#666666]">Add more tenants on the same room (e.g. 2-person sharing roommates)</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#D2DDD7]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, roomSharing: 'Single' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        formData.roomSharing === 'Single'
                          ? 'bg-[#163B36] text-white shadow-2xs'
                          : 'text-[#666666] hover:text-[#263238]'
                      }`}
                    >
                      Single Occupancy
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, roomSharing: '2_Sharing' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        formData.roomSharing === '2_Sharing'
                          ? 'bg-[#163B36] text-white shadow-2xs'
                          : 'text-[#666666] hover:text-[#263238]'
                      }`}
                    >
                      <Users className="h-3 w-3" />
                      <span>2-Person Sharing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Primary Tenant 1 Details */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7]">
                <div className="font-extrabold text-[#163B36] flex items-center justify-between text-xs">
                  <span>{formData.roomSharing === '2_Sharing' ? 'Tenant 1 (Primary Resident)' : 'Tenant Details'}</span>
                  {formData.roomSharing === '2_Sharing' && (
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#D2DDD7] text-[#263238]">
                      Rent Share: {100 - formData.rentSharePercentage}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#263238] font-semibold">Full Name <span className="text-rose-600">*</span></label>
                      {fieldErrors.name && (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                          {fieldErrors.name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Rohith Varma"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        clearFieldError('name');
                      }}
                      className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                        fieldErrors.name
                          ? 'border-rose-500 bg-rose-50/20'
                          : 'bg-white border-[#D2DDD7] focus:border-[#163B36]'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#263238] font-semibold">Mobile Number <span className="text-rose-600">*</span></label>
                      {fieldErrors.phone && (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                          {fieldErrors.phone}
                        </span>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 98470 XXXXX"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        clearFieldError('phone');
                      }}
                      className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                        fieldErrors.phone
                          ? 'border-rose-500 bg-rose-50/20'
                          : 'bg-white border-[#D2DDD7] focus:border-[#163B36]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#263238] font-semibold">Email Address <span className="text-rose-600">*</span></label>
                    {fieldErrors.email && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    placeholder="tenant1@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearFieldError('email');
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                      fieldErrors.email
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'bg-white border-[#D2DDD7] focus:border-[#163B36]'
                    }`}
                  />
                </div>
              </div>

              {/* 4. Co-Tenant 2 (When 2-Person Sharing) */}
              {formData.roomSharing === '2_Sharing' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 animate-in fade-in">
                  <div className="font-extrabold text-amber-900 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-amber-800" />
                      <span>Tenant 2 (Shared Roommate)</span>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-amber-300 text-amber-900">
                      Rent Share: {formData.rentSharePercentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#263238] font-semibold">Co-Tenant Name <span className="text-rose-600">*</span></label>
                        {fieldErrors.coTenantName && (
                          <span className="text-[10px] font-bold text-rose-600">
                            {fieldErrors.coTenantName}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Nair"
                        value={formData.coTenantName}
                        onChange={(e) => {
                          setFormData({ ...formData, coTenantName: e.target.value });
                          clearFieldError('coTenantName');
                        }}
                        className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                          fieldErrors.coTenantName
                            ? 'border-rose-500 bg-rose-50/20'
                            : 'bg-white border-amber-300 focus:border-amber-700'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#263238] font-semibold">Mobile Number <span className="text-rose-600">*</span></label>
                        {fieldErrors.coTenantPhone && (
                          <span className="text-[10px] font-bold text-rose-600">
                            {fieldErrors.coTenantPhone}
                          </span>
                        )}
                      </div>
                      <input
                        type="tel"
                        placeholder="+91 98450 XXXXX"
                        value={formData.coTenantPhone}
                        onChange={(e) => {
                          setFormData({ ...formData, coTenantPhone: e.target.value });
                          clearFieldError('coTenantPhone');
                        }}
                        className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                          fieldErrors.coTenantPhone
                            ? 'border-rose-500 bg-rose-50/20'
                            : 'bg-white border-amber-300 focus:border-amber-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#263238] font-semibold">Email Address <span className="text-rose-600">*</span></label>
                        {fieldErrors.coTenantEmail && (
                          <span className="text-[10px] font-bold text-rose-600">
                            {fieldErrors.coTenantEmail}
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        placeholder="tenant2@example.com"
                        value={formData.coTenantEmail}
                        onChange={(e) => {
                          setFormData({ ...formData, coTenantEmail: e.target.value });
                          clearFieldError('coTenantEmail');
                        }}
                        className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                          fieldErrors.coTenantEmail
                            ? 'border-rose-500 bg-rose-50/20'
                            : 'bg-white border-amber-300 focus:border-amber-700'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[#263238] font-semibold block mb-1">Rent Split Ratio</label>
                      <select
                        value={formData.rentSharePercentage}
                        onChange={(e) => setFormData({ ...formData, rentSharePercentage: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-[#263238]"
                      >
                        <option value={50}>50% / 50% Equal Split</option>
                        <option value={60}>60% (Tenant 2) / 40% (Tenant 1)</option>
                        <option value={40}>40% (Tenant 2) / 60% (Tenant 1)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Property & Unit Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Target Property</label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
                  >
                    {properties.length === 0 ? (
                      <option value="">No properties available (add one first)</option>
                    ) : (
                      properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#263238] font-semibold">Unit / Room Number <span className="text-rose-600">*</span></label>
                    {fieldErrors.unitNumber && (
                      <span className="text-[10px] font-bold text-rose-600">
                        {fieldErrors.unitNumber}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Room 204 or Flat 3B"
                    value={formData.unitNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, unitNumber: e.target.value });
                      clearFieldError('unitNumber');
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition ${
                      fieldErrors.unitNumber
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'bg-[#E8F0EC] border-[#D2DDD7] focus:border-[#163B36]'
                    }`}
                  />
                </div>
              </div>

              {/* 6. Rent & Deposit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#263238] font-semibold">Total Room Rent (₹) <span className="text-rose-600">*</span></label>
                    {fieldErrors.monthlyRent && (
                      <span className="text-[10px] font-bold text-rose-600">
                        {fieldErrors.monthlyRent}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 24000"
                    value={formData.monthlyRent}
                    onChange={(e) => {
                      setFormData({ ...formData, monthlyRent: e.target.value });
                      clearFieldError('monthlyRent');
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl border text-[#263238] placeholder-[#888888] focus:outline-none transition font-tabular ${
                      fieldErrors.monthlyRent
                        ? 'border-rose-500 bg-rose-50/20'
                        : 'bg-[#E8F0EC] border-[#D2DDD7] focus:border-[#163B36]'
                    }`}
                  />
                  {formData.roomSharing === '2_Sharing' && totalRentNum > 0 && (
                    <span className="text-[10px] text-[#163B36] font-bold mt-0.5 block">
                      T1: ₹{primaryRentNum.toLocaleString('en-IN')} | T2: ₹{coRentNum.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Total Security Deposit (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 48000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] placeholder-[#888888] focus:outline-none focus:border-[#163B36] font-tabular"
                  />
                </div>
              </div>

              {/* 7. Room Food & Mess Plan Checkbox */}
              <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white text-[#163B36] flex items-center justify-center">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#263238] text-xs">Include Room Food &amp; Mess Subscription</div>
                    <div className="text-[10px] text-[#666666]">
                      {formData.includeFood
                        ? 'Dining card active on tenant portal (breakfast, lunch, dinner passes included)'
                        : 'No food added for this room (tenant will see accommodation-only notice)'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.includeFood}
                  onChange={(e) => setFormData({ ...formData, includeFood: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#163B36] cursor-pointer"
                />
              </div>

              {/* 8. Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Lease Start</label>
                  <input
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
                  />
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Lease End</label>
                  <input
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
                  />
                </div>

                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Rent Due Date</label>
                  <select
                    value={formData.rentDueDate}
                    onChange={(e) => setFormData({ ...formData, rentDueDate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#163B36]"
                  >
                    <option value={1}>1st of month</option>
                    <option value={5}>5th of month</option>
                    <option value={10}>10th of month</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>
                    {formData.roomSharing === '2_Sharing'
                      ? 'Generate Dual Onboarding Invite Links (2 Roommates)'
                      : 'Generate Onboarding Invite Link'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#163B36]/30 text-[#263238]">
                <div className="font-extrabold text-sm mb-1 text-[#163B36]">
                  {formData.roomSharing === '2_Sharing'
                    ? 'Dual Roommate Onboarding Links Ready!'
                    : 'Invitation Link Ready!'}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {formData.roomSharing === '2_Sharing' ? (
                    <>Send the personal invite links to both <b>{formData.name}</b> and <b>{formData.coTenantName}</b>. Both tenants will complete mandatory Aadhaar/PAN eKYC, upload rental documents, and sign their joint lease agreement.</>
                  ) : (
                    <>Tenant <b>{formData.name}</b> will complete digital Aadhaar eKYC, register their bank autopay, and sign the digital lease.</>
                  )}
                </p>
              </div>

              {/* Link for Tenant 1 */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#D2DDD7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#263238] text-xs">
                    {formData.roomSharing === '2_Sharing' ? `1. Invite Link for ${formData.name}` : 'Tenant Onboarding Link'}
                  </span>
                  {formData.roomSharing === '2_Sharing' && (
                    <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full">
                      Rent: ₹{primaryRentNum.toLocaleString('en-IN')}/mo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLinkPrimary}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] text-xs select-all font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLinkPrimary);
                      setCopiedPrimary(true);
                      setTimeout(() => setCopiedPrimary(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#163B36] text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    {copiedPrimary ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedPrimary ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Hi ${formData.name}, here is your digital tenancy onboarding & lease agreement link for Unit ${formData.unitNumber}: ${inviteLinkPrimary}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Link for Tenant 2 (When Sharing) */}
              {formData.roomSharing === '2_Sharing' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 text-xs">
                      2. Invite Link for {formData.coTenantName} (Roommate)
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      Rent: ₹{coRentNum.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={inviteLinkCoTenant}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-[#263238] text-xs select-all font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLinkCoTenant);
                        setCopiedCoTenant(true);
                        setTimeout(() => setCopiedCoTenant(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#163B36] text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      {copiedCoTenant ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCoTenant ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hi ${formData.coTenantName}, here is your shared room onboarding & joint lease agreement link for Unit ${formData.unitNumber}: ${inviteLinkCoTenant}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
                <div className="font-bold text-[#263238]">Included in Digital Onboarding:</div>
                <ul className="space-y-1.5 text-[#666666] text-[11px]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>UIDAI Aadhaar &amp; PAN mandatory eKYC + Document Upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {formData.roomSharing === '2_Sharing'
                        ? 'Joint Rental Agreement signed by both roommates, shared with landlord'
                        : 'Digital Tenancy Agreement signed & shared with landlord'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {formData.includeFood
                        ? 'Mess & Dining food pass enabled on tenant dashboard'
                        : 'Room-only accommodation activated (no food plan)'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl bg-[#E8F0EC] text-[#263238] hover:bg-[#D2DDD7] font-bold cursor-pointer"
                >
                  Edit Terms
                </button>

                <button
                  onClick={handleSimulateTenantAcceptance}
                  className="flex-1 py-3 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {formData.roomSharing === '2_Sharing'
                      ? 'Simulate Dual Acceptance (Connect Both Roommates)'
                      : 'Simulate Instant Tenant Acceptance'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-[#263238]">
                  {formData.roomSharing === '2_Sharing'
                    ? 'Both Roommates Successfully Connected!'
                    : 'Tenancy Successfully Connected!'}
                </h3>
                <p className="text-xs text-[#666666] max-w-md mx-auto mt-1 leading-relaxed">
                  {formData.roomSharing === '2_Sharing' ? (
                    <><b>{formData.name}</b> and <b>{formData.coTenantName}</b> are connected to Unit {formData.unitNumber}. Both tenants have joint roommate status, split rent invoices (₹{primaryRentNum.toLocaleString('en-IN')} &amp; ₹{coRentNum.toLocaleString('en-IN')}), shared maintenance ticket coordination, and digital agreements verified.</>
                  ) : (
                    <><b>{formData.name}</b> has been onboarded into Unit {formData.unitNumber}. Unit marked OCCUPIED, security deposit recorded in escrow ledger, and automated rent schedule activated.</>
                  )}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
