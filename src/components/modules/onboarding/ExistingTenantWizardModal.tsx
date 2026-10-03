'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  X, 
  UserPlus, 
  Send, 
  CheckCircle, 
  FileText, 
  Building, 
  Copy, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function ExistingTenantWizardModal() {
  const { 
    isExistingTenantWizardOpen, 
    setIsExistingTenantWizardOpen, 
    properties, 
    addExistingTenant 
  } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyId: properties[0]?.id || 'prop-beach-road',
    unitNumber: '304',
    monthlyRent: 26000,
    deposit: 78000,
    leaseStart: '2026-10-01',
    leaseEnd: '2027-09-30',
    rentDueDate: 5
  });

  const [copied, setCopied] = useState(false);

  if (!isExistingTenantWizardOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSimulateTenantAcceptance = () => {
    addExistingTenant(formData);
    setStep(3);
  };

  const handleClose = () => {
    setIsExistingTenantWizardOpen(false);
    setStep(1);
    setFormData({
      name: '',
      phone: '',
      email: '',
      propertyId: properties[0]?.id || 'prop-beach-road',
      unitNumber: '304',
      monthlyRent: 26000,
      deposit: 78000,
      leaseStart: '2026-10-01',
      leaseEnd: '2027-09-30',
      rentDueDate: 5
    });
  };

  const inviteLink = `https://staywise.app/invite/stw-${formData.unitNumber || '304'}-${Date.now().toString().slice(-4)}`;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeece5] bg-[#fbfbfa]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#eef3f0] text-[#274235] flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#19251f]">Onboard Existing Tenant</h2>
              <p className="text-[11px] text-[#6e7972]">Fast Onboarding & Digital Lease Connection</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose} 
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-[#f7f6f2] border-b border-[#eeece5] flex items-center justify-between text-xs">
          <span className={`font-bold ${step >= 1 ? 'text-[#274235]' : 'text-[#95a099]'}`}>
            1. Tenancy Terms
          </span>
          <span className="text-[#95a099]">→</span>
          <span className={`font-bold ${step >= 2 ? 'text-[#274235]' : 'text-[#95a099]'}`}>
            2. Send Invite Link
          </span>
          <span className="text-[#95a099]">→</span>
          <span className={`font-bold ${step === 3 ? 'text-emerald-700' : 'text-[#95a099]'}`}>
            3. Connected
          </span>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {step === 1 && (
            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Tenant Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohith Varma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98470 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="tenant@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Target Property</label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Lease Start</label>
                  <input
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Lease End</label>
                  <input
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                    className="w-full px-3 py-2 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Rent Due Date</label>
                  <select
                    value={formData.rentDueDate}
                    onChange={(e) => setFormData({ ...formData, rentDueDate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
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
                  className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-xl shadow-[#274235]/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Generate Onboarding Invite Link</span>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 text-[#274235]">
                <div className="font-extrabold text-sm mb-1 text-[#19251f]">Invitation Link Ready!</div>
                <p className="text-[11px] leading-relaxed">
                  Tenant <b>{formData.name}</b> will complete digital Aadhaar eKYC, register their bank autopay, and sign the digital lease.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[#6e7972] font-semibold">Unique Onboarding Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] text-xs select-all font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#274235] text-white font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                <div className="font-bold text-[#19251f]">Included in Onboarding Flow:</div>
                <ul className="space-y-1.5 text-[#6e7972] text-[11px]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>UIDAI Aadhaar / Digilocker Digital KYC Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Review & e-Sign Digital Tenancy Agreement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Automated Bank UPI / NACH Mandate Registration</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-2xl bg-[#f4f3ef] text-[#19251f] hover:bg-[#e3e1d8] font-bold"
                >
                  Edit Terms
                </button>

                <button
                  onClick={handleSimulateTenantAcceptance}
                  className="flex-1 py-3 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold shadow-md shadow-[#274235]/20 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Simulate Instant Tenant Acceptance</span>
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
                <h3 className="text-lg font-extrabold text-[#19251f]">Tenancy Successfully Connected!</h3>
                <p className="text-xs text-[#6e7972] max-w-sm mx-auto mt-1 leading-relaxed">
                  <b>{formData.name}</b> has been onboarded into Unit {formData.unitNumber}. Unit marked OCCUPIED, security deposit recorded in escrow ledger, and automated rent schedule activated.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md transition"
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
