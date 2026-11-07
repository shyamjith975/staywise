'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  ShieldCheck, 
  Shield, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Camera, 
  Upload, 
  Sparkles, 
  Plus, 
  X, 
  ChevronRight, 
  HelpCircle, 
  DollarSign, 
  Clock, 
  Check, 
  Building2, 
  User, 
  Eye, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { ClaimType, ConditionReportItem, PropertyConditionReport, ProtectionClaim } from '../../../types';

export default function DepositProtectHub() {
  const { 
    currentUser, 
    activeRole, 
    protectionContracts, 
    depositApplications, 
    conditionReports, 
    protectionClaims,
    applyForDepositProtect,
    submitConditionReport,
    submitProtectionClaim,
    settleProtectionClaim,
    disputeProtectionClaim,
    properties,
    tenants,
    addNotification,
    setActiveView
  } = useAppState();

  // Automatic Role Determination: Tenants see Tenant details; Owners see Owner details
  const isTenant = activeRole === 'tenant';
  
  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<ProtectionClaim | null>(null);

  // Application Form State
  const [appMonthlyRent, setAppMonthlyRent] = useState<number>(25000);
  const [appUnitNumber, setAppUnitNumber] = useState<string>('304');
  const [appPropertyId, setAppPropertyId] = useState<string>(properties[0]?.id || 'prop-beach-road');
  const [appAcceptDisclosures, setAppAcceptDisclosures] = useState(true);

  // Condition Report Form State
  const [reportRoom, setReportRoom] = useState<string>('Living Room');
  const [reportItem, setReportItem] = useState<string>('Walls & Acrylic Paint');
  const [reportCondition, setReportCondition] = useState<'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED'>('EXCELLENT');
  const [reportNotes, setReportNotes] = useState<string>('Inspected on move-in. Clean walls with fresh paint and zero nail holes.');

  // Claim Form State
  const [claimType, setClaimType] = useState<ClaimType>('TENANT_DAMAGE');
  const [claimedAmount, setClaimedAmount] = useState<number>(4500);
  const [claimDescription, setClaimDescription] = useState<string>('Water leakage damage to master bedroom skirting and damaged bathroom mixer fixture.');

  // Calculation helpers
  const calculatedDepositAvoided = appMonthlyRent * 2.5;
  const calculatedMonthlyFee = Math.min(1200, Math.max(600, Math.round(appMonthlyRent * 0.035)));
  const calculatedCoverage = Math.max(100000, appMonthlyRent * 3.5);

  // -------------------------------------------------------------------------
  // STRICT ID MATCHING: TENANT SCOPE
  // -------------------------------------------------------------------------
  const myTenant = tenants.find(t => 
    (currentUser?.id && t.userId === currentUser.id) || 
    (currentUser?.email && t.email.toLowerCase() === currentUser.email.toLowerCase())
  );
  const myTenantId = myTenant?.id || currentUser?.id || '';
  const isDemoTenant = currentUser?.email === 'tenant@staywise.com' || currentUser?.id === 'user-tenant-shyam';

  const matchingTenantContracts = protectionContracts.filter(c => 
    c.tenantId === myTenantId || 
    (currentUser?.id && c.tenantId === currentUser.id) || 
    (isDemoTenant && (c.tenantName === 'Shyam Sundar' || c.tenantId === 'user-tenant-shyam'))
  );
  const activeTenantContract = matchingTenantContracts[0] || null;

  // Auto-populate active tenant lease details into application form
  React.useEffect(() => {
    if (myTenant) {
      if (myTenant.propertyId) setAppPropertyId(myTenant.propertyId);
      if (myTenant.unitNumber) setAppUnitNumber(myTenant.unitNumber);
      if (myTenant.monthlyRent) setAppMonthlyRent(myTenant.monthlyRent);
    } else if (properties.length > 0 && (!appPropertyId || appPropertyId === 'prop-beach-road')) {
      setAppPropertyId(properties[0].id);
      if (properties[0].units && properties[0].units.length > 0) {
        setAppUnitNumber(properties[0].units[0].unitNumber);
        if (properties[0].units[0].rentAmount) {
          setAppMonthlyRent(properties[0].units[0].rentAmount);
        }
      }
    }
  }, [myTenant, properties]);

  const matchingTenantApplications = depositApplications.filter(a => 
    a.tenantId === myTenantId || 
    (currentUser?.id && a.tenantId === currentUser.id) || 
    (isDemoTenant && a.tenantName === 'Shyam Sundar')
  );

  const matchingTenantReports = conditionReports.filter(r => 
    r.tenantId === myTenantId || 
    (currentUser?.id && r.tenantId === currentUser.id) || 
    (isDemoTenant && r.tenantName === 'Shyam Sundar')
  );

  const matchingTenantClaims = protectionClaims.filter(cl => 
    cl.tenantId === myTenantId || 
    (currentUser?.id && cl.tenantId === currentUser.id) || 
    (isDemoTenant && cl.tenantName === 'Shyam Sundar')
  );

  // -------------------------------------------------------------------------
  // STRICT ID MATCHING: OWNER SCOPE
  // -------------------------------------------------------------------------
  const ownerProperties = properties.filter(p => currentUser?.id && p.ownerId === currentUser.id);
  const ownerPropIds = ownerProperties.map(p => p.id);
  const isDemoOwner = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';

  const matchingOwnerContracts = isDemoOwner
    ? protectionContracts
    : protectionContracts.filter(c => 
        (currentUser?.id && c.ownerId === currentUser.id) || 
        ownerPropIds.includes(c.propertyId)
      );

  const matchingOwnerClaims = isDemoOwner
    ? protectionClaims
    : protectionClaims.filter(cl => 
        (currentUser?.id && cl.ownerId === currentUser.id) || 
        ownerPropIds.includes(cl.propertyId)
      );

  const matchingOwnerReports = isDemoOwner
    ? conditionReports
    : conditionReports.filter(cr => 
        ownerPropIds.includes(cr.propertyId)
      );

  const totalOwnerGuaranteedCoverage = matchingOwnerContracts.reduce((sum, c) => sum + (c.coverageLimit || 0), 0);

  // Form Submissions
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === appPropertyId);
    await applyForDepositProtect({
      propertyId: appPropertyId || myTenant?.propertyId || 'prop-beach-road',
      propertyName: prop?.name || myTenant?.propertyName || 'Beach Road Luxury Apartments',
      unitNumber: appUnitNumber || myTenant?.unitNumber || '304',
      monthlyRent: appMonthlyRent || myTenant?.monthlyRent || 25000,
      traditionalDepositAmount: calculatedDepositAvoided,
      monthlyFee: calculatedMonthlyFee,
      coverageLimit: calculatedCoverage,
      disclosuresAccepted: appAcceptDisclosures
    });
    setIsApplyModalOpen(false);
  };

  const handleConditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: ConditionReportItem = {
      id: `ci-${Date.now()}`,
      area: reportRoom,
      item: reportItem,
      condition: reportCondition,
      notes: reportNotes,
      photoUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'
    };

    await submitConditionReport({
      contractId: activeTenantContract?.id,
      propertyId: activeTenantContract?.propertyId || 'prop-beach-road',
      propertyName: activeTenantContract?.propertyName || 'Beach Road Apartments',
      unitNumber: activeTenantContract?.unitNumber || '304',
      reportType: 'MOVE_IN',
      overallCondition: 'Pristine',
      items: [item],
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500'
      ],
      notes: reportNotes
    });
    setIsConditionModalOpen(false);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetContract = matchingOwnerContracts[0];
    if (!targetContract) return;

    await submitProtectionClaim({
      contractId: targetContract.id,
      policyNumber: targetContract.policyNumber,
      propertyId: targetContract.propertyId,
      propertyName: targetContract.propertyName,
      unitNumber: targetContract.unitNumber,
      tenantId: targetContract.tenantId,
      tenantName: targetContract.tenantName,
      claimType,
      claimedAmount,
      description: claimDescription,
      evidenceUrls: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'
      ]
    });
    setIsClaimModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans bg-[#F7F8F6] text-[#171717]">
      
      {/* Hero Header (Direct ID Scoped - View Switcher Options Removed) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D2DDD7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#06110c] text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-[#a31c1b]" />
              Staywise Deposit Protect
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EC] text-[#06110c] border border-[#D2DDD7]">
              Zero Upfront Security Deposit
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5EB] text-[#8C6B2E] border border-[#ECCFA4]">
              IRDAI-Aligned Underwriter Partner
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            Institutional Zero-Deposit Protection
          </h1>
          <p className="text-xs sm:text-sm text-[#546E7A]">
            {isTenant 
              ? 'Rent without locking away ₹50,000–₹1,50,000 in idle cash. Enjoy institutional guarantee protection with transparent move-out inspections.'
              : 'Institutional financial guarantees against tenant unpaid rent arrears and verified physical damage across your managed properties.'}
          </p>
        </div>

        {/* User Identity Stamp (Matched strictly to ID) */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0 p-3 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7]">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#546E7A]">
            {isTenant ? 'Resident Account' : 'Property Owner Portfolio'}
          </span>
          <div className="flex items-center gap-1.5 font-black text-sm text-[#06110c]">
            {isTenant ? <User className="h-4 w-4 text-emerald-600" /> : <Building2 className="h-4 w-4 text-[#a31c1b]" />}
            <span>{currentUser?.name || 'Verified Member'}</span>
          </div>
          <span className="text-[10px] font-mono text-[#546E7A]">
            ID: {currentUser?.id || 'id-verified'}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. RESIDENT (TENANT) VIEW — Strictly ID Matched                */}
      {/* ============================================================== */}
      {isTenant && (
        <div className="space-y-6">
          
          {/* Active Policy Card or Enrollment Callout */}
          {activeTenantContract ? (
            <div className="bg-linear-to-br from-[#06110c] to-[#171717] rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-[#D2DDD7] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#a31c1b]/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Active Protection Guarantee
                    </span>
                    <span className="font-mono text-xs text-white/70">
                      Policy #{activeTenantContract.policyNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Unit {activeTenantContract.unitNumber}, {activeTenantContract.propertyName}
                    </h3>
                    <p className="text-xs text-[#E8F0EC]/80 mt-1">
                      Institutional guarantee active underwritten by {activeTenantContract.partnerName}. Traditional deposit of ₹{(activeTenantContract.coverageLimit * 0.6).toLocaleString('en-IN')} avoided upfront.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeTenantContract.coveredRisks?.slice(0, 3).map((risk, idx) => (
                      <span key={idx} className="text-[10px] bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-[#E8F0EC]">
                        ✓ {risk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 flex flex-col justify-between min-w-[240px]">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#E8F0EC]/70 uppercase block">Total Coverage Limit</span>
                    <span className="text-3xl font-black text-white tracking-tight">
                      ₹{activeTenantContract.coverageLimit.toLocaleString('en-IN')}
                    </span>
                    <div className="text-xs text-[#E8F0EC]/80 pt-1">
                      Monthly Protection Fee: <strong>₹{activeTenantContract.monthlyFee}/mo</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => addNotification('Certificate Downloaded', `Policy ${activeTenantContract.policyNumber} certificate downloaded.`, 'SYSTEM')}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#06110c] text-xs font-bold hover:bg-[#E8F0EC] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Certificate</span>
                    </button>
                    <button
                      onClick={() => setIsConditionModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Inspect (+100 pts)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : matchingTenantApplications.length > 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Application Underwriting Status: {matchingTenantApplications[0].status}
                </span>
                <span className="text-xs font-mono text-[#546E7A]">
                  App #{matchingTenantApplications[0].id}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#171717]">
                Application in Progress for Unit {matchingTenantApplications[0].unitNumber}, {matchingTenantApplications[0].propertyName}
              </h3>
              <p className="text-xs text-[#546E7A]">
                Our partner underwriter ({matchingTenantApplications[0].partnerProvider}) is verifying your credit profile. Once approved, your policy certificate will activate immediately.
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#171717]">Enroll in Zero-Deposit Renting</h3>
                <p className="text-xs text-[#546E7A] mt-1">Replace heavy security deposits with an affordable monthly guarantee fee.</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-bold text-xs cursor-pointer active:scale-95 transition"
              >
                Apply for Protection
              </button>
            </div>
          )}

          {/* Interactive Calculator: Traditional Cash Deposit vs Staywise Protect */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c]">
                Financial Comparison
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#171717] mt-1">
                Traditional Security Deposit vs Staywise Zero-Deposit
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Traditional Deposit Option */}
              <div className="p-5 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#546E7A] uppercase">Traditional Deposit</span>
                  <span className="text-xs text-[#a31c1b] font-bold">Locks Liquid Capital</span>
                </div>
                <div className="text-3xl font-black text-[#171717]">
                  ₹60,000 <span className="text-xs font-medium text-[#546E7A]">Upfront Cash</span>
                </div>
                <ul className="text-xs text-[#546E7A] space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#a31c1b] font-bold">✕</span>
                    <span>₹60,000 cash locked away at 0% return for 11–24 months</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#a31c1b] font-bold">✕</span>
                    <span>Painful move-out deductions and arbitrary deductions</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#a31c1b] font-bold">✕</span>
                    <span>Delays in refund settlements post move-out</span>
                  </li>
                </ul>
              </div>

              {/* Staywise Deposit Protect Option */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-[#E8F0EC] to-white border-2 border-[#06110c] space-y-3 relative overflow-hidden">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#06110c] text-white text-[9px] font-black uppercase">
                  Recommended
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#06110c] uppercase">Staywise Deposit Protect</span>
                </div>
                <div className="text-3xl font-black text-[#06110c]">
                  ₹0 <span className="text-xs font-medium text-[#546E7A]">Upfront Deposit (₹750/mo fee)</span>
                </div>
                <ul className="text-xs text-[#171717] space-y-1.5 font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Keep your ₹60,000 liquid in mutual funds, stocks, or emergency savings</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Landlord gets up to ₹1,00,000 institutional protection</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Digital move-in condition audit shields against false deductions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Condition Reports for this Tenant */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#171717]">Digital Condition Audit Proofs</h3>
                <p className="text-xs text-[#546E7A]">Move-in condition photographs with cryptographic timestamp and audit seal.</p>
              </div>
              <button
                onClick={() => setIsConditionModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#06110c] text-white text-xs font-bold hover:bg-[#171717] transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Condition Proof</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingTenantReports.length === 0 ? (
                <div className="col-span-2 p-6 text-center text-xs text-[#546E7A] bg-[#F7F8F6] rounded-2xl border border-[#D2DDD7]">
                  No condition reports logged yet. Click &quot;Add Condition Proof&quot; to audit your move-in condition and earn 100 Staywise Reward points.
                </div>
              ) : (
                matchingTenantReports.map((report) => (
                  <div key={report.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#171717]">{report.reportType} Inspection</span>
                      <span className="text-[10px] text-[#546E7A] font-mono">{report.inspectionDate}</span>
                    </div>
                    <p className="text-xs text-[#546E7A]">{report.notes}</p>
                    <div className="text-[10px] text-green-700 font-bold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified by {report.verifiedBy}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tenant Matched Claims Desk */}
          {matchingTenantClaims.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-3">
              <h3 className="text-base font-black text-[#171717]">Filed Protection Claims on Your Unit</h3>
              <div className="space-y-2">
                {matchingTenantClaims.map(claim => (
                  <div key={claim.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#171717]">{claim.claimType.replace(/_/g, ' ')}</span>
                      <p className="text-[#546E7A] text-[11px] mt-0.5">{claim.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#a31c1b] block">₹{claim.claimedAmount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold">
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PROPERTY OWNER VIEW — Strictly ID Matched                   */}
      {/* ============================================================== */}
      {!isTenant && (
        <div className="space-y-6">
          
          {/* Portfolio Protection Header Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Protected Units</span>
              <div className="text-2xl font-black text-[#171717]">{matchingOwnerContracts.length} Units Active</div>
              <p className="text-[10px] text-green-600 font-bold">100% Zero-Deposit Guarantees</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Total Guaranteed Coverage</span>
              <div className="text-2xl font-black text-[#06110c]">
                ₹{totalOwnerGuaranteedCoverage > 0 ? totalOwnerGuaranteedCoverage.toLocaleString('en-IN') : '0'}
              </div>
              <p className="text-[10px] text-[#546E7A]">Underwritten by Partner Insurer Risk Pool</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Rent Arrears Guarantee</span>
              <div className="text-2xl font-black text-[#171717]">Up to 3 Months</div>
              <p className="text-[10px] text-[#546E7A]">Direct payout on verified default</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Damage Protection</span>
              <div className="text-2xl font-black text-[#06110c]">₹1,00,000 / unit</div>
              <p className="text-[10px] text-[#546E7A]">Beyond ordinary wear and tear</p>
            </div>
          </div>

          {/* Protected Units Roster */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#171717]">Active Institutional Protection Policies</h3>
                <p className="text-xs text-[#546E7A]">
                  Real-time status of Zero-Deposit policies protecting your properties: {ownerProperties.map(p => p.name).join(', ') || 'All Listed Assets'}.
                </p>
              </div>

              {matchingOwnerContracts.length > 0 && (
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#a31c1b] text-white hover:bg-[#8e1817] text-xs font-black transition flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>File Protection Claim</span>
                </button>
              )}
            </div>

            {matchingOwnerContracts.length === 0 ? (
              <div className="p-8 text-center bg-[#F7F8F6] rounded-2xl border border-[#D2DDD7] space-y-2">
                <Shield className="h-8 w-8 text-[#546E7A] mx-auto opacity-40" />
                <h4 className="text-sm font-bold text-[#171717]">No Zero-Deposit Policies Enrolled Yet</h4>
                <p className="text-xs text-[#546E7A] max-w-md mx-auto">
                  When new residents apply for Zero-Deposit renting on your properties, their underwritten institutional guarantee policies will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#D2DDD7] text-[11px] font-extrabold text-[#546E7A] uppercase tracking-wider bg-[#F7F8F6]">
                      <th className="py-3 px-4 rounded-l-xl">Policy Number</th>
                      <th className="py-3 px-4">Unit & Property</th>
                      <th className="py-3 px-4">Tenant Name</th>
                      <th className="py-3 px-4">Coverage Limit</th>
                      <th className="py-3 px-4">Monthly Fee</th>
                      <th className="py-3 px-4">Valid Period</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D2DDD7]/50">
                    {matchingOwnerContracts.map((ct) => (
                      <tr key={ct.id} className="hover:bg-[#F7F8F6]/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#06110c]">
                          {ct.policyNumber}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#171717]">
                          Unit {ct.unitNumber}, {ct.propertyName}
                        </td>
                        <td className="py-3.5 px-4 text-[#171717] font-medium">
                          {ct.tenantName}
                        </td>
                        <td className="py-3.5 px-4 font-black text-[#06110c]">
                          ₹{ct.coverageLimit.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-[#546E7A]">
                          ₹{ct.monthlyFee}/mo
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#546E7A] font-mono">
                          {ct.startDate} → {ct.endDate}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E8F0EC] text-[#06110c] border border-[#D2DDD7]">
                            {ct.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Claims Desk & Dispute Ledger */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#171717]">Protection Claims Desk & Settlements</h3>
                <p className="text-xs text-[#546E7A]">Claims submitted for unpaid rent arrears or tenant-caused physical repairs with transparent evidence audit.</p>
              </div>
            </div>

            <div className="space-y-3">
              {matchingOwnerClaims.length === 0 ? (
                <div className="p-8 text-center text-[#546E7A] text-xs bg-[#F7F8F6] rounded-2xl border border-[#D2DDD7]">
                  Zero claims filed across your properties. All units in pristine standing.
                </div>
              ) : (
                matchingOwnerClaims.map((claim) => (
                  <div key={claim.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          claim.status === 'SETTLED'
                            ? 'bg-green-100 text-green-800'
                            : claim.status === 'DISPUTED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#fbebeb] text-[#a31c1b]'
                        }`}>
                          {claim.status}
                        </span>
                        <span className="font-mono text-xs text-[#546E7A]">
                          Claim #{claim.id} • Policy #{claim.policyNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#546E7A]">Claimed Sum:</span>
                        <span className="text-base font-black text-[#a31c1b]">
                          ₹{claim.claimedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#171717]">
                        {claim.claimType.replace(/_/g, ' ')} — Unit {claim.unitNumber}, {claim.propertyName}
                      </h4>
                      <p className="text-xs text-[#546E7A] mt-1">
                        {claim.description}
                      </p>
                    </div>

                    {claim.disputeReason && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="font-bold block">Tenant Review / Dispute Note:</span>
                        <p>{claim.disputeReason}</p>
                      </div>
                    )}

                    {claim.settlementTxnId && (
                      <div className="p-2.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-[#06110c] flex items-center justify-between">
                        <span>Settlement Payout Txn: <strong className="font-mono">{claim.settlementTxnId}</strong></span>
                        <span className="font-bold">Paid on {new Date(claim.settlementDate || '').toLocaleDateString('en-IN')}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-[#D2DDD7] flex flex-wrap items-center gap-2">
                      {claim.status !== 'SETTLED' && (
                        <button
                          onClick={() => settleProtectionClaim(claim.id, claim.claimedAmount)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve Institutional Settlement Payout</span>
                        </button>
                      )}

                      {claim.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={() => disputeProtectionClaim(claim.id, 'Tenant requested re-inspection and verified photo audit.')}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#546E7A] hover:bg-[#F7F8F6] cursor-pointer"
                        >
                          Send to Dispute Arbitration
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* APPLY FOR ZERO-DEPOSIT PROTECTION MODAL */}
      {/* ============================================================== */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#a31c1b]" />
                <h3 className="font-black text-base text-[#171717]">Apply for Zero-Deposit Guarantee</h3>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-[#546E7A] hover:text-[#171717] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171717] block mb-1">Target Property</label>
                {properties.length > 0 ? (
                  <select 
                    value={appPropertyId} 
                    onChange={(e) => {
                      setAppPropertyId(e.target.value);
                      const prop = properties.find(p => p.id === e.target.value);
                      if (prop?.units && prop.units.length > 0) {
                        setAppUnitNumber(prop.units[0].unitNumber);
                        if (prop.units[0].rentAmount) {
                          setAppMonthlyRent(prop.units[0].rentAmount);
                        }
                      }
                    }}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-bold"
                  >
                    <option value="">Select registered property...</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="e.g. Beach Road Luxury Apartments"
                      value={myTenant?.propertyName || 'Beach Road Luxury Apartments'}
                      readOnly
                      className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-bold"
                    />
                    <span className="text-[10px] text-[#546E7A]">Using your registered lease property</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Unit Number</label>
                  <input
                    type="text"
                    value={appUnitNumber}
                    onChange={(e) => setAppUnitNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={appMonthlyRent}
                    onChange={(e) => setAppMonthlyRent(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] font-bold"
                    required
                  />
                </div>
              </div>

              {/* Real-time Calculation Summary Card */}
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-[#546E7A]">Upfront Cash Saved:</span>
                  <span className="text-[#06110c]">₹{calculatedDepositAvoided.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-[#546E7A]">Monthly Guarantee Fee:</span>
                  <span className="text-emerald-700 font-extrabold">₹{calculatedMonthlyFee}/mo</span>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-[#546E7A]">Landlord Coverage:</span>
                  <span className="text-[#171717]">₹{calculatedCoverage.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acceptDisclosures"
                  checked={appAcceptDisclosures}
                  onChange={(e) => setAppAcceptDisclosures(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-[#06110c]"
                  required
                />
                <label htmlFor="acceptDisclosures" className="text-[11px] text-[#546E7A]">
                  I consent to automated soft-pull bureau underwriting and agree that intentional damage or willful rent defaults will be recovered via the surety underwriter.
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-black text-xs shadow-md active:scale-95 cursor-pointer"
                >
                  Submit Instant Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DIGITAL MOVE-IN CONDITION REPORT MODAL */}
      {/* ============================================================== */}
      {isConditionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#06110c]" />
                <h3 className="font-black text-base text-[#171717]">Log Move-In Inspection Proof</h3>
              </div>
              <button onClick={() => setIsConditionModalOpen(false)} className="text-[#546E7A] hover:text-[#171717] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConditionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Room / Area</label>
                  <select
                    value={reportRoom}
                    onChange={(e) => setReportRoom(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-bold"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Kitchen">Kitchen &amp; Hob</option>
                    <option value="Bathroom">Bathroom Fixtures</option>
                    <option value="Balcony">Balcony &amp; Railings</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Condition Rating</label>
                  <select
                    value={reportCondition}
                    onChange={(e) => setReportCondition(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-bold"
                  >
                    <option value="EXCELLENT">Pristine / Excellent</option>
                    <option value="GOOD">Good (Minor Wear)</option>
                    <option value="FAIR">Fair (Existing Marks)</option>
                    <option value="DAMAGED">Pre-existing Damage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171717] block mb-1">Item Inspected</label>
                <input
                  type="text"
                  value={reportItem}
                  onChange={(e) => setReportItem(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#171717] block mb-1">Audit Notes</label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-xs font-medium"
                  placeholder="Note any existing scratches, working condition of fixtures..."
                  required
                />
              </div>

              {/* Photo Upload Simulation */}
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-dashed border-[#D2DDD7] text-center space-y-2">
                <Upload className="h-6 w-6 text-[#06110c] mx-auto" />
                <div className="text-xs font-bold text-[#171717]">2 Audit Photos Attached (Geotagged &amp; Timestamped)</div>
                <div className="text-[10px] text-[#546E7A]">living_room_wall_audit.jpg • ac_remote_serial.jpg</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConditionModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-black text-xs shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#a31c1b]" />
                  <span>Verify Report (+100 pts)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FILE PROTECTION CLAIM MODAL */}
      {/* ============================================================== */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#a31c1b]" />
                <h3 className="font-black text-base text-[#171717]">File Protection Claim (Landlord)</h3>
              </div>
              <button onClick={() => setIsClaimModalOpen(false)} className="text-[#546E7A] hover:text-[#171717] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171717] block mb-1">Select Policy / Unit</label>
                <div className="p-3 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-xs font-bold text-[#171717]">
                  Unit {matchingOwnerContracts[0]?.unitNumber || '304'}, {matchingOwnerContracts[0]?.propertyName || 'Beach Road Apartments'} (Policy #{matchingOwnerContracts[0]?.policyNumber || 'SW-DP-2026-KL902'})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Claim Type</label>
                  <select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-bold"
                  >
                    <option value="TENANT_DAMAGE">Tenant-Caused Damage</option>
                    <option value="UNPAID_RENT">Unpaid Rent Arrears</option>
                    <option value="PAINTING_CLEANING">Deep Painting &amp; Restoration</option>
                    <option value="COMBINED">Combined Arrears + Damage</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Claimed Amount (₹)</label>
                  <input
                    type="number"
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171717] block mb-1">Damage Description &amp; Quotation Details</label>
                <textarea
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-xs font-medium"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-dashed border-[#D2DDD7] text-center space-y-1">
                <Upload className="h-5 w-5 text-[#06110c] mx-auto" />
                <div className="text-xs font-bold text-[#171717]">Contractor Quotation &amp; Damage Photo Attached</div>
                <div className="text-[10px] text-[#546E7A]">plumbing_repair_invoice.pdf (₹4,500)</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#a31c1b] text-white hover:bg-[#8e1817] font-black text-xs shadow-md active:scale-95 cursor-pointer"
                >
                  Submit Claim to Underwriter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
