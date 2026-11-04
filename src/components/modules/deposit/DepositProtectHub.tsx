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
    addNotification,
    setActiveView
  } = useAppState();

  const isOwnerDefault = activeRole !== 'tenant';
  const [viewPersona, setViewPersona] = useState<'TENANT' | 'OWNER'>(isOwnerDefault ? 'OWNER' : 'TENANT');
  
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

  // Active contract for demo tenant
  const activeContract = protectionContracts[0];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === appPropertyId);
    await applyForDepositProtect({
      propertyId: appPropertyId,
      propertyName: prop?.name || 'Beach Road Apartments',
      unitNumber: appUnitNumber,
      monthlyRent: appMonthlyRent,
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
      contractId: activeContract?.id,
      propertyId: activeContract?.propertyId || 'prop-beach-road',
      propertyName: activeContract?.propertyName || 'Beach Road Apartments',
      unitNumber: activeContract?.unitNumber || '304',
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
    if (!activeContract) return;

    await submitProtectionClaim({
      contractId: activeContract.id,
      policyNumber: activeContract.policyNumber,
      propertyId: activeContract.propertyId,
      propertyName: activeContract.propertyName,
      unitNumber: activeContract.unitNumber,
      tenantId: activeContract.tenantId,
      tenantName: activeContract.tenantName,
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
      
      {/* Hero Header with Persona Switcher */}
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
            Tenants rent without locking away ₹50,000–₹1,50,000 in idle cash. Landlords receive institutional financial guarantees against unpaid rent and verified damage.
          </p>
        </div>

        {/* View Switcher: Tenant vs Owner */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex items-center p-1.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7]">
            <button
              onClick={() => setViewPersona('TENANT')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewPersona === 'TENANT'
                  ? 'bg-[#06110c] text-white shadow-xs'
                  : 'text-[#546E7A] hover:text-[#171717]'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Resident View</span>
            </button>
            <button
              onClick={() => setViewPersona('OWNER')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewPersona === 'OWNER'
                  ? 'bg-[#06110c] text-white shadow-xs'
                  : 'text-[#546E7A] hover:text-[#171717]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Property Owner View</span>
            </button>
          </div>
          <span className="text-[10px] text-[#546E7A]">
            Logged in as: <strong className="text-[#171717]">{currentUser?.name || 'Member'} ({activeRole})</strong>
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RESIDENT (TENANT) VIEW */}
      {/* ============================================================== */}
      {viewPersona === 'TENANT' && (
        <div className="space-y-6">
          
          {/* Active Policy Card or Enrollment Callout */}
          {activeContract ? (
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
                      Policy #{activeContract.policyNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Unit {activeContract.unitNumber}, {activeContract.propertyName}
                    </h3>
                    <p className="text-xs text-[#E8F0EC]/80 mt-1">
                      Institutional guarantee active underwritten by {activeContract.partnerName}. Traditional deposit of ₹60,000 avoided upfront.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeContract.coveredRisks.slice(0, 3).map((risk, idx) => (
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
                      ₹{activeContract.coverageLimit.toLocaleString('en-IN')}
                    </span>
                    <div className="text-xs text-[#E8F0EC]/80 pt-1">
                      Monthly Protection Fee: <strong>₹{activeContract.monthlyFee}/mo</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => addNotification('Certificate Downloaded', `Policy ${activeContract.policyNumber} certificate downloaded.`, 'SYSTEM')}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#06110c] text-xs font-bold hover:bg-[#E8F0EC] transition flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Certificate</span>
                    </button>
                    <button
                      onClick={() => setIsConditionModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition flex items-center gap-1"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Inspect (+100 pts)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-[#171717]">Enroll in Zero-Deposit Renting</h3>
                <p className="text-xs text-[#546E7A] mt-1">Replace heavy security deposits with an affordable monthly guarantee fee.</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-bold text-xs"
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
                    <span>Digital move-in inspection protects against wrongful damage claims</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Move-In Condition Reports Audit Gallery */}
          <div className="bg-white p-6 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#171717]">Digital Move-In Condition Evidence</h3>
                <p className="text-xs text-[#546E7A]">Verified audit photos establishing the baseline state of the property to safeguard both tenant and owner.</p>
              </div>
              <button
                onClick={() => setIsConditionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <Camera className="h-3.5 w-3.5 text-[#a31c1b]" />
                <span>Add Inspection Photos (+100 pts)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl bg-[#F7F8F6] border border-[#D2DDD7] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#E8F0EC] text-[#06110c]">
                        {report.reportType.replace(/_/g, ' ')}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#171717] mt-1">
                        Unit {report.unitNumber}, {report.propertyName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#546E7A]">
                      {report.inspectionDate}
                    </span>
                  </div>

                  <p className="text-xs text-[#546E7A] bg-white p-2.5 rounded-xl border border-[#D2DDD7]">
                    &ldquo;{report.notes}&rdquo;
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#546E7A]">Audited Elements:</span>
                    <div className="space-y-1 text-xs">
                      {report.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-[11px] p-1.5 rounded-lg bg-white border border-[#D2DDD7]/50">
                          <span className="font-medium text-[#171717]">{item.area} — {item.item}</span>
                          <span className="font-extrabold text-[#06110c]">{item.condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-green-700 font-bold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{report.verifiedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PROPERTY OWNER (LANDLORD) VIEW */}
      {/* ============================================================== */}
      {viewPersona === 'OWNER' && (
        <div className="space-y-6">
          
          {/* Portfolio Protection Header Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Protected Units</span>
              <div className="text-2xl font-black text-[#171717]">{protectionContracts.length} Units Active</div>
              <p className="text-[10px] text-green-600 font-bold">100% Zero-Deposit Guarantees</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#546E7A] uppercase">Total Guaranteed Coverage</span>
              <div className="text-2xl font-black text-[#06110c]">₹4,50,000</div>
              <p className="text-[10px] text-[#546E7A]">Underwritten by ICICI Lombard Risk Pool</p>
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
                <p className="text-xs text-[#546E7A]">Real-time status of Zero-Deposit policies protecting your rental income and physical asset condition.</p>
              </div>

              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#a31c1b] text-white hover:bg-[#8e1817] text-xs font-black transition flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>File Protection Claim</span>
              </button>
            </div>

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
                  {protectionContracts.map((ct) => (
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
              {protectionClaims.length === 0 ? (
                <div className="p-8 text-center text-[#546E7A] text-xs">
                  Zero claims filed. All units in pristine standing.
                </div>
              ) : (
                protectionClaims.map((claim) => (
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
                          className="px-3.5 py-1.5 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] text-xs font-bold transition flex items-center gap-1 active:scale-95"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve Institutional Settlement Payout</span>
                        </button>
                      )}

                      {claim.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={() => disputeProtectionClaim(claim.id, 'Tenant requested re-inspection and verified photo audit.')}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#546E7A] hover:bg-[#F7F8F6]"
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
      {/* STATUTORY IRDAI & LEGAL COMPLIANCE FOOTER */}
      {/* ============================================================== */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] text-xs text-[#546E7A] space-y-2">
        <div className="flex items-center gap-2 font-extrabold text-[#171717]">
          <Info className="h-4 w-4 text-[#06110c]" />
          <span>Statutory Regulatory Structure & Disclosures (IRDAI & RBI Compliance)</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Staywise Platform operates strictly as a property-management technology infrastructure provider. Staywise does not directly underwrite unregulated insurance policies on its own corporate balance sheet. Protection guarantees are issued under a structured group master protection facility in partnership with authorized, IRDAI-regulated general insurance partners (e.g., ICICI Lombard General Insurance Co. Ltd.) and institutional guarantee trusts.
        </p>
        <p className="leading-relaxed text-[11px]">
          All claims are subject to documented baseline Move-In Condition Reports, verified payment ledgers, and independent claims assessment guidelines under Indian tenancy jurisprudence.
        </p>
      </div>

      {/* ============================================================== */}
      {/* ZERO-DEPOSIT APPLICATION MODAL */}
      {/* ============================================================== */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#a31c1b]" />
                <h3 className="font-black text-base text-[#171717]">Enroll in Staywise Deposit Protect</h3>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-[#546E7A] hover:text-[#171717]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171717] block mb-1">Select Property</label>
                <select
                  value={appPropertyId}
                  onChange={(e) => setAppPropertyId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] text-[#171717] font-semibold"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
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

              {/* Automatic Fee Breakdown */}
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Traditional Deposit Avoided:</span>
                  <span className="font-bold text-[#171717]">₹{calculatedDepositAvoided.toLocaleString('en-IN')} (Saved Upfront)</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Monthly Protection Fee:</span>
                  <span className="font-black text-[#06110c] text-sm">₹{calculatedMonthlyFee}/mo</span>
                </div>
                <div className="flex justify-between items-center text-[#546E7A]">
                  <span>Guarantee Coverage Limit:</span>
                  <span className="font-bold text-[#171717]">₹{calculatedCoverage.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={appAcceptDisclosures}
                  onChange={(e) => setAppAcceptDisclosures(e.target.checked)}
                  className="rounded border-[#D2DDD7] text-[#06110c] focus:ring-0 mt-0.5"
                  required
                />
                <span className="text-[11px] text-[#546E7A] leading-relaxed">
                  I agree to the Staywise Zero-Deposit Institutional Guarantee Terms & authorize the partner risk pool assessment. I understand that normal wear & tear is excluded, and damages are audited via move-in photos.
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-black text-xs shadow-md active:scale-95"
                >
                  Activate Zero-Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOVE-IN CONDITION INSPECTION MODAL */}
      {/* ============================================================== */}
      {isConditionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#a31c1b]" />
                <h3 className="font-black text-base text-[#171717]">Move-In Condition Report (+100 WisePoints)</h3>
              </div>
              <button onClick={() => setIsConditionModalOpen(false)} className="text-[#546E7A] hover:text-[#171717]">
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
                    <option value="Kitchen">Kitchen</option>
                    <option value="Master Bathroom">Master Bathroom</option>
                    <option value="Balcony">Balcony</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#171717] block mb-1">Item / Fixture</label>
                  <input
                    type="text"
                    value={reportItem}
                    onChange={(e) => setReportItem(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#D2DDD7] bg-[#F7F8F6] font-bold"
                    placeholder="e.g. Paint, AC, Tiles"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171717] block mb-1">Observed Condition</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setReportCondition(cond)}
                      className={`py-2 rounded-xl border font-bold text-xs transition ${
                        reportCondition === cond
                          ? 'bg-[#06110c] text-white border-[#06110c]'
                          : 'bg-white border-[#D2DDD7] text-[#546E7A] hover:bg-[#F7F8F6]'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171717] block mb-1">Inspection Notes & Details</label>
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
                <div className="text-xs font-bold text-[#171717]">2 Audit Photos Attached (Geotagged & Timestamped)</div>
                <div className="text-[10px] text-[#546E7A]">living_room_wall_audit.jpg • ac_remote_serial.jpg</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConditionModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#06110c] text-white hover:bg-[#171717] font-black text-xs shadow-md active:scale-95 flex items-center justify-center gap-1.5"
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
              <button onClick={() => setIsClaimModalOpen(false)} className="text-[#546E7A] hover:text-[#171717]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171717] block mb-1">Select Policy / Unit</label>
                <div className="p-3 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-xs font-bold text-[#171717]">
                  Unit {activeContract?.unitNumber || '304'}, {activeContract?.propertyName || 'Beach Road Apartments'} (Policy #{activeContract?.policyNumber || 'SW-DP-2026-KL902'})
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
                    <option value="PAINTING_CLEANING">Deep Painting & Restoration</option>
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
                <label className="font-bold text-[#171717] block mb-1">Damage Description & Quotation Details</label>
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
                <div className="text-xs font-bold text-[#171717]">Contractor Quotation & Damage Photo Attached</div>
                <div className="text-[10px] text-[#546E7A]">plumbing_repair_invoice.pdf (₹4,500)</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D2DDD7] text-xs font-bold text-[#546E7A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#a31c1b] text-white hover:bg-[#8e1817] font-black text-xs shadow-md active:scale-95"
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
