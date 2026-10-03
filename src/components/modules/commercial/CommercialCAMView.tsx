'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { CommercialUnit, CAMExpenseItem, CommercialVisitor } from '../../../types';
import { 
  Briefcase, 
  Building2, 
  Layers, 
  IndianRupee, 
  QrCode, 
  Car, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Users, 
  Truck, 
  Search, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Printer
} from 'lucide-react';

export default function CommercialCAMView() {
  const { 
    commercialUnits, 
    camExpenses, 
    commercialVisitors, 
    addCommercialVisitor,
    addNotification 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'UNITS' | 'CAM_POOL' | 'FITOUT' | 'VISITORS' | 'PARKING'>('UNITS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<CommercialUnit | null>(null);

  // New Visitor Modal State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [hostCompany, setHostCompany] = useState('AeroSys Technologies Pvt Ltd');
  const [purpose, setPurpose] = useState('Business Consultation');
  const [vehicleNumber, setVehicleNumber] = useState('KL-07-');

  // CAM Pool Calculations (Section 14)
  const totalCAMMonthlyCost = camExpenses.reduce((acc, curr) => acc + curr.monthlyCost, 0);
  const totalLeasableSqFt = commercialUnits.reduce((acc, curr) => acc + curr.areaSqFt, 0);
  const totalOccupiedSqFt = commercialUnits.filter(u => u.status === 'Occupied').reduce((acc, curr) => acc + curr.areaSqFt, 0);
  const totalCAMRecovered = commercialUnits.filter(u => u.status === 'Occupied').reduce((acc, curr) => acc + curr.camAmount, 0);
  const camRecoveryRate = ((totalCAMRecovered / totalCAMMonthlyCost) * 100).toFixed(1);

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    addCommercialVisitor({
      visitorName,
      hostCompany,
      purpose,
      vehicleNumber,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setVisitorName('');
    setIsVisitorModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Commercial & CAM OS
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B Leases • Common Area Maintenance • Fit-out Tracker</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#19251f]">
            Commercial Asset & CAM Command Center
          </h1>
          <p className="text-xs text-[#6e7972]">
            Infovision Commercial Hub • 9,700 sq.ft Leasable Floor Plate • ₹18/sq.ft CAM Rate Pool.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('UNITS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'UNITS'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Leases & Units</span>
          </button>
          <button
            onClick={() => setActiveTab('CAM_POOL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CAM_POOL'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>CAM Management</span>
          </button>
          <button
            onClick={() => setActiveTab('FITOUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'FITOUT'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Fit-Out Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('VISITORS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VISITORS'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Visitor Passes</span>
          </button>
          <button
            onClick={() => setActiveTab('PARKING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PARKING'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Parking & Logistics</span>
          </button>
        </div>
      </div>

      {/* Top Financial Stat Highlights (Section 12 & 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Leasable Area</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalLeasableSqFt.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">Sq. Ft</span></div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{totalOccupiedSqFt.toLocaleString('en-IN')} sq.ft (88.6%) Leased</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Base Commercial Rent</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹4,15,000 <span className="text-xs font-normal text-slate-500">/mo</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">3 Active Corporate Tenants</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-700">Monthly CAM Pool</div>
          <div className="text-xl font-black text-amber-950 mt-1">₹{totalCAMRecovered.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{camRecoveryRate}% Expense Recovery</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-indigo-700">Total Monthly Invoiced</div>
          <div className="text-xl font-black text-indigo-950 mt-1">₹{(415000 + totalCAMRecovered).toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">+ 18% GST Compliance Tag</div>
        </div>
      </div>

      {/* TAB 1: COMMERCIAL LEASES & UNITS (Sections 12, 13 & 15) */}
      {activeTab === 'UNITS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commercialUnits.map((unit) => (
              <div 
                key={unit.id}
                className="bg-white rounded-3xl border border-[#e3e1d8] p-5 shadow-sm hover:border-[#274235] hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#19251f]">{unit.unitNumber}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Floor {unit.floor}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">{unit.businessName}</h3>
                    <p className="text-xs text-slate-500">{unit.businessType}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    unit.status === 'Occupied' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                    unit.status === 'Fit-out' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                    'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                {/* Lease Breakdown Matrix (Section 15) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f7f6f2] p-3 rounded-2xl text-[11px]">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Area</div>
                    <div className="font-extrabold text-slate-800">{unit.areaSqFt.toLocaleString('en-IN')} sq.ft</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Base Rent</div>
                    <div className="font-black text-emerald-800">₹{unit.baseRent.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">CAM Charge</div>
                    <div className="font-black text-amber-800">₹{unit.camAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Parking</div>
                    <div className="font-extrabold text-slate-800">{unit.parkingSlots} Reserved</div>
                  </div>
                </div>

                {/* Lease Clauses (Lock-in, Escalation, Notice) */}
                <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-[11px]">
                    <div>Lock-in: <span className="font-bold text-slate-800">{unit.lockInPeriodMonths} mo</span></div>
                    <div>Notice: <span className="font-bold text-slate-800">{unit.noticePeriodMonths} mo</span></div>
                    <div>Escalation: <span className="font-bold text-slate-800">{unit.escalationPercent}%</span></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Monthly</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{(unit.baseRent + unit.camAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CAM MANAGEMENT MODULE (Section 14) */}
      {activeTab === 'CAM_POOL' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-5">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
                CAM Allocation Engine
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Common Area Maintenance (CAM) Pool</h2>
              <p className="text-xs text-slate-500">
                Track facility expenses (Security, Housekeeping, Lift AMC, Generator Diesel, Common Power) and allocate precisely by leasable area formula.
              </p>
            </div>

            {/* Formula allocation explanation */}
            <div className="p-4 rounded-2xl bg-[#19251f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400">Allocation Formula</span>
                <div className="text-sm font-black">Area-based Ratio: ₹18.00 per Sq. Ft. / month</div>
                <p className="text-[11px] text-slate-300">
                  Total Facility Operating Budget: ₹{totalCAMMonthlyCost.toLocaleString('en-IN')} / month across {totalLeasableSqFt.toLocaleString('en-IN')} sq.ft.
                </p>
              </div>
              <div className="text-right shrink-0 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-[10px] text-slate-300">Total Expenses Logged</div>
                <div className="text-base font-black text-white">₹{totalCAMMonthlyCost.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Itemized CAM Facility Expenses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Contractor / Vendor</th>
                    <th className="py-2.5">Monthly Cost</th>
                    <th className="py-2.5">Allocation Method</th>
                    <th className="py-2.5">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {camExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs">
                          {exp.category[0]}
                        </div>
                        <span>{exp.category}</span>
                      </td>
                      <td className="py-3 text-slate-700">{exp.vendorName}</td>
                      <td className="py-3 font-black text-slate-900">₹{exp.monthlyCost.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {exp.allocationMethod}
                        </span>
                      </td>
                      <td className="py-3 text-emerald-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verified AMC</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FIT-OUT MANAGEMENT (Section 16) */}
      {activeTab === 'FITOUT' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4">
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
              Fit-Out Milestones
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">Commercial Fit-Out Coordination</h2>
            <p className="text-xs text-slate-500">
              Track fit-out milestones from Lease Signing → Electrical & Interior → Internet & Furniture → Business Opens.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900">Suite 301 • NexGen Cloud Solutions</span>
                <p className="text-[11px] text-amber-700">60-Day Rent-Free Fit-out Period (Ends 15 Nov 2026)</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
                Electrical & Interiors (Phase 3 of 5)
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 space-y-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div className="text-[10px] font-bold">1. Lease Signed</div>
                <div className="text-[9px] text-slate-400">15 Sep 2026</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 space-y-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div className="text-[10px] font-bold">2. Architectural Layout</div>
                <div className="text-[9px] text-slate-400">Approved by Staywise</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 space-y-1 shadow-sm">
                <Clock className="h-4 w-4 text-amber-600 animate-spin" />
                <div className="text-[10px] font-bold">3. Electrical & HVAC</div>
                <div className="text-[9px] text-amber-700">In Progress (80%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 space-y-1">
                <div className="text-[10px] font-bold">4. Internet & Furnishing</div>
                <div className="text-[9px]">Pending Step 3</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 space-y-1">
                <div className="text-[10px] font-bold">5. Business Opens</div>
                <div className="text-[9px]">Rent Billing Commences</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISITOR PASSES & SECURITY (Section 17) */}
      {activeTab === 'VISITORS' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Digital Gate Pass System
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Commercial Visitor Passes & Security Desk</h2>
              <p className="text-xs text-slate-500">QR Gate Passes, vehicle log, and host corporate authorization.</p>
            </div>
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#19251f] hover:bg-[#274235] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Visitor Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {commercialVisitors.map((vis) => (
              <div key={vis.id} className="p-4 rounded-2xl border border-slate-200 bg-[#fbfbfa] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-indigo-600" />
                    <span className="font-mono font-bold text-xs text-indigo-900">{vis.passCode}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    vis.status === 'Checked In' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {vis.status}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-black text-slate-900">{vis.visitorName}</div>
                  <div className="text-xs text-slate-600">Host: <span className="font-semibold text-slate-800">{vis.hostCompany}</span></div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Purpose: {vis.purpose}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 font-mono">
                    <Car className="h-3 w-3" />
                    <span>{vis.vehicleNumber}</span>
                  </div>
                  <div>In: {vis.checkInTime}</div>
                </div>
              </div>
            ))}
          </div>

          {/* New Visitor Pass Modal */}
          {isVisitorModalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setIsVisitorModalOpen(false); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-[#e3e1d8] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">Issue Corporate Visitor Pass</h3>
                  </div>
                  <button onClick={() => setIsVisitorModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleRegisterVisitor} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Visitor Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Host Company</label>
                    <select
                      value={hostCompany}
                      onChange={(e) => setHostCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <option value="AeroSys Technologies Pvt Ltd">AeroSys Technologies (Floor 2)</option>
                      <option value="BlueFin Capital Advisors">BlueFin Capital (Suite 101)</option>
                      <option value="NexGen Cloud Solutions">NexGen Cloud (Suite 301)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Purpose of Visit</label>
                    <input
                      type="text"
                      required
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">Vehicle Plate Number (For Parking Gate)</label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#19251f] hover:bg-[#274235] text-white font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Issue Instant QR Gate Pass</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PARKING & WAREHOUSE/INDUSTRIAL (Sections 18-21) */}
      {activeTab === 'PARKING' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] space-y-4">
          <div>
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full">
              Sections 18 - 21 Logistics Engine
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">Parking Slots, EV Charging & Warehouse Logistics</h2>
            <p className="text-xs text-slate-500">Commercial parking allocation, EV submeters, and warehouse loading bay tracking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Car className="h-4 w-4 text-indigo-600" />
                <span>Commercial Reserved Parking Allocation</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Slots A01 - A04 (Basement 1)</div>
                    <div className="text-[10px] text-slate-500">Assigned to BlueFin Capital • 4 Vehicles</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Billed in Lease</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Slots B01 - B10 (Basement 2)</div>
                    <div className="text-[10px] text-slate-500">Assigned to AeroSys Technologies • 10 Vehicles</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Billed in Lease</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-900">Slots B12, B14, B15 (Vacant)</div>
                    <div className="text-[10px] text-amber-700">Money Leak: ₹9,000/mo unleased parking revenue</div>
                  </div>
                  <button 
                    onClick={() => addNotification('Offer Dispatched', 'Sent ₹3,000/mo parking add-on offer to tech tenants.', 'SYSTEM')}
                    className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-lg"
                  >
                    Monetize
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-sky-600" />
                <span>Warehouse Loading Bays & Compliance (Sections 20 & 21)</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">Cochin Port Logistics Bay A & B</div>
                    <div className="text-[10px] text-slate-500">12m Clear Height • FMCG Storage • Active Container Inflow</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Operational</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">NFPA Fire Sprinkler & Safety Audit</div>
                    <div className="text-[10px] text-slate-500">Certified by Fire Safety Directorate • Valid through 2027</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
