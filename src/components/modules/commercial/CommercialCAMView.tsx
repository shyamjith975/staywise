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
  Printer,
  Trash2,
  LogOut,
  Check
} from 'lucide-react';

export default function CommercialCAMView() {
  const { 
    commercialUnits, 
    camExpenses, 
    commercialVisitors, 
    addCommercialVisitor,
    checkoutCommercialVisitor,
    deleteCommercialVisitor,
    addCamExpense,
    deleteCamExpense,
    addNotification,
    currentUser,
    activeRole,
    properties,
    tenants
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'UNITS' | 'CAM_POOL' | 'FITOUT' | 'VISITORS' | 'PARKING'>('UNITS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<CommercialUnit | null>(null);

  // New Visitor Modal State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [hostCompany, setHostCompany] = useState('');
  const [purpose, setPurpose] = useState('Business Consultation');
  const [vehicleNumber, setVehicleNumber] = useState('KL-07-');

  // CAM Expense Modal State
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [newExpCategory, setNewExpCategory] = useState<CAMExpenseItem['category']>('Common Electricity');
  const [newExpVendor, setNewExpVendor] = useState('');
  const [newExpMonthlyCost, setNewExpMonthlyCost] = useState('');
  const [newExpAllocationMethod, setNewExpAllocationMethod] = useState<CAMExpenseItem['allocationMethod']>('Area-based');

  // Commercial Parking & Bay State
  const [parkingSlots, setParkingSlots] = useState<Array<{
    id: string;
    slotNumber: string;
    type: string;
    unitNumber: string;
    tenantName: string;
    monthlyFee: number;
    status: 'Occupied' | 'Vacant';
  }>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('staywise_commercial_parking');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);
  const [newSlotNumber, setNewSlotNumber] = useState('');
  const [newSlotType, setNewSlotType] = useState('4-Wheeler Reserved');
  const [newSlotUnit, setNewSlotUnit] = useState('');
  const [newSlotFee, setNewSlotFee] = useState('3000');

  const isDemoAccount = activeRole === 'admin';

  // Dynamic scoping: Owners only see commercial assets for properties they actually own. Admin sees all.
  const activeCommercialUnits = (activeRole === 'admin')
    ? commercialUnits 
    : commercialUnits.filter(u => {
        const ownerProps = properties.filter(p => p.ownerId === currentUser?.id);
        return ownerProps.some(p => p.id === u.propertyId);
      });

  const commercialProps = (activeRole === 'admin')
    ? properties.filter(p => p.type === 'Commercial' || p.type === 'Office' || p.type === 'Warehouse' || p.type === 'Commercial Building')
    : properties.filter(p => p.ownerId === currentUser?.id && (p.type === 'Commercial' || p.type === 'Office' || p.type === 'Warehouse' || p.type === 'Commercial Building'));

  const synthesizedCommUnits: CommercialUnit[] = React.useMemo(() => {
    if (activeCommercialUnits.length > 0) return activeCommercialUnits;
    const units: CommercialUnit[] = [];
    commercialProps.forEach(prop => {
      const propTenants = tenants.filter(t => t.propertyId === prop.id && t.status !== 'Moved Out');
      const count = Math.max(1, prop.totalUnits || 1);
      const baseRentPerUnit = Math.round(prop.expectedMonthlyRent / count) || 45000;
      const camRate = 18;
      const areaPerUnit = 2500;
      const camAmount = areaPerUnit * camRate;

      for (let i = 1; i <= count; i++) {
        const floor = Math.ceil(i / 2);
        const assignedTenant = propTenants[i - 1];
        units.push({
          id: `comm-unit-${prop.id}-${i}`,
          propertyId: prop.id,
          unitNumber: `Suite ${floor}0${((i - 1) % 2) + 1}`,
          floor,
          businessName: assignedTenant ? assignedTenant.name : `${prop.name} Unit ${i}`,
          businessType: prop.type === 'Warehouse' ? 'Logistics / Supply Chain' : 'Corporate / Tech Office',
          areaSqFt: areaPerUnit,
          baseRent: assignedTenant?.monthlyRent || baseRentPerUnit,
          camRatePerSqFt: camRate,
          camAmount,
          parkingSlots: 4,
          lockInPeriodMonths: 24,
          noticePeriodMonths: 3,
          escalationPercent: 5,
          fitOutStatus: 'Ready for Opening',
          status: assignedTenant ? 'Occupied' : 'Vacant'
        });
      }
    });
    return units;
  }, [activeCommercialUnits, commercialProps, tenants]);

  const effectiveCommercialUnits = activeCommercialUnits.length > 0 ? activeCommercialUnits : synthesizedCommUnits;

  // Real authoritative CAM expenses only - no unapproved fake mock baseline
  const activeCamExpenses = camExpenses;

  const activeCommercialVisitors = (activeRole === 'admin')
    ? commercialVisitors 
    : (effectiveCommercialUnits.length > 0 ? commercialVisitors : []);

  // CAM Pool Calculations (Section 14)
  const totalCAMMonthlyCost = activeCamExpenses.reduce((acc, curr) => acc + curr.monthlyCost, 0);
  const totalLeasableSqFt = effectiveCommercialUnits.reduce((acc, curr) => acc + curr.areaSqFt, 0);
  const totalOccupiedSqFt = effectiveCommercialUnits.filter(u => u.status === 'Occupied').reduce((acc, curr) => acc + curr.areaSqFt, 0);
  const totalCAMRecovered = effectiveCommercialUnits.filter(u => u.status === 'Occupied').reduce((acc, curr) => acc + curr.camAmount, 0);
  const baseCommercialRent = effectiveCommercialUnits.filter(u => u.status === 'Occupied').reduce((acc, curr) => acc + curr.baseRent, 0);
  const occupiedUnits = effectiveCommercialUnits.filter(u => u.status === 'Occupied');
  const camRecoveryRate = totalCAMMonthlyCost > 0 ? ((totalCAMRecovered / totalCAMMonthlyCost) * 100).toFixed(1) : '0.0';
  const leasedPercent = totalLeasableSqFt > 0 ? ((totalOccupiedSqFt / totalLeasableSqFt) * 100).toFixed(1) : '0.0';
  const totalMonthlyInvoiced = baseCommercialRent + totalCAMRecovered;

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    addCommercialVisitor({
      visitorName,
      hostCompany: hostCompany || (effectiveCommercialUnits[0]?.businessName || 'Commercial Tenant'),
      purpose,
      vehicleNumber,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setVisitorName('');
    setIsVisitorModalOpen(false);
  };

  const handleAddCamExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpCategory || !newExpMonthlyCost) return;
    await addCamExpense({
      category: newExpCategory,
      vendorName: newExpVendor || 'Verified Facility Contractor',
      monthlyCost: Number(newExpMonthlyCost) || 0,
      allocationMethod: newExpAllocationMethod
    });
    setIsAddExpenseModalOpen(false);
    setNewExpVendor('');
    setNewExpMonthlyCost('');
  };

  const handleAddParkingSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotNumber.trim()) return;
    const newSlot = {
      id: `slot-${Date.now()}`,
      slotNumber: newSlotNumber.trim(),
      type: newSlotType,
      unitNumber: newSlotUnit.trim() || 'General Pool',
      tenantName: newSlotUnit.trim() ? (effectiveCommercialUnits.find(u => u.unitNumber === newSlotUnit.trim())?.businessName || 'Assigned Tenant') : 'Unassigned',
      monthlyFee: Number(newSlotFee) || 0,
      status: (newSlotUnit.trim() ? 'Occupied' : 'Vacant') as 'Occupied' | 'Vacant'
    };
    setParkingSlots(prev => {
      const updated = [newSlot, ...prev];
      try { localStorage.setItem('staywise_commercial_parking', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setIsParkingModalOpen(false);
    setNewSlotNumber('');
    addNotification('Parking Bay Allocated', `Slot ${newSlot.slotNumber} (${newSlot.type}) registered.`, 'SYSTEM');
  };

  const handleRemoveParkingSlot = (id: string) => {
    setParkingSlots(prev => {
      const updated = prev.filter(s => s.id !== id);
      try { localStorage.setItem('staywise_commercial_parking', JSON.stringify(updated)); } catch {}
      return updated;
    });
    addNotification('Parking Slot Released', 'Parking allocation removed.', 'SYSTEM');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Commercial & CAM OS
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B Leases • Common Area Maintenance • Fit-out Tracker</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717]">
            Commercial Asset & CAM Command Center
          </h1>
          <p className="text-xs text-[#666666]">
            {isDemoAccount 
              ? 'Infovision Commercial Hub • 9,700 sq.ft Leasable Floor Plate • ₹18/sq.ft CAM Rate Pool.' 
              : (effectiveCommercialUnits.length > 0 
                  ? `${totalLeasableSqFt.toLocaleString('en-IN')} sq.ft Commercial Floor Plate • ₹${totalCAMRecovered.toLocaleString('en-IN')} Active CAM Recovery` 
                  : 'Manage corporate B2B leases, CAM cost allocation, and visitor passes.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('UNITS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'UNITS'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Leases & Units</span>
          </button>
          <button
            onClick={() => setActiveTab('CAM_POOL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CAM_POOL'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>CAM Management</span>
          </button>
          <button
            onClick={() => setActiveTab('FITOUT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'FITOUT'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Fit-Out Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('VISITORS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'VISITORS'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Visitor Passes</span>
          </button>
          <button
            onClick={() => setActiveTab('PARKING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PARKING'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Parking & Logistics</span>
          </button>
        </div>
      </div>

      {/* Top Financial Stat Highlights (Section 12 & 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Leasable Area</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalLeasableSqFt.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">Sq. Ft</span></div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{totalOccupiedSqFt.toLocaleString('en-IN')} sq.ft ({leasedPercent}%) Leased</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Base Commercial Rent</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{baseCommercialRent.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">/mo</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{occupiedUnits.length} Active Corporate Tenants</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-700">Monthly CAM Pool</div>
          <div className="text-xl font-black text-amber-950 mt-1">₹{totalCAMRecovered.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{camRecoveryRate}% Expense Recovery</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-indigo-700">Total Monthly Invoiced</div>
          <div className="text-xl font-black text-indigo-950 mt-1">₹{totalMonthlyInvoiced.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">+ 18% GST Compliance Tag</div>
        </div>
      </div>

      {/* TAB 1: COMMERCIAL LEASES & UNITS (Sections 12, 13 & 15) */}
      {activeTab === 'UNITS' && (
        <div className="space-y-4">
          {effectiveCommercialUnits.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#D2DDD7] p-12 text-center shadow-sm">
              <Briefcase className="h-10 w-10 text-[#D2DDD7] mx-auto mb-3 opacity-50" />
              <h3 className="text-sm font-bold text-[#171717]">No commercial units or B2B leases found</h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1">
                Commercial office spaces, tech suites, and retail lease agreements registered in your properties will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {effectiveCommercialUnits.map((unit) => (
                <div 
                  key={unit.id}
                  className="bg-white rounded-3xl border border-[#D2DDD7] p-5 shadow-sm hover:border-[#171717] hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#171717]">{unit.unitNumber}</span>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#E8F0EC] p-3 rounded-2xl text-[11px]">
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
          )}
        </div>
      )}

      {/* TAB 2: CAM MANAGEMENT MODULE (Section 14) */}
      {activeTab === 'CAM_POOL' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
                  CAM Allocation Engine
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">Common Area Maintenance (CAM) Pool</h2>
                <p className="text-xs text-slate-500">
                  Track facility expenses (Security, Housekeeping, Lift AMC, Generator Diesel, Common Power) and allocate precisely by leasable area formula.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-[#06110c] hover:bg-[#171717] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add CAM Expense</span>
              </button>
            </div>

            {/* Formula allocation explanation */}
            <div className="p-4 rounded-2xl bg-[#171717] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400">Allocation Formula</span>
                <div className="text-sm font-black">
                  {totalLeasableSqFt > 0 
                    ? `Area-based Ratio: ₹${(totalCAMMonthlyCost / totalLeasableSqFt).toFixed(2)} per Sq. Ft. / month`
                    : 'Area-based Ratio: Formula active upon adding unit sq.ft'}
                </div>
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
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCamExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Layers className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold text-[#666666]">No CAM expenses logged</p>
                        <p className="text-[11px] text-[#999999] mt-0.5">Click &ldquo;+ Add CAM Expense&rdquo; to log facility maintenance line items approved by the owner.</p>
                      </td>
                    </tr>
                  ) : (
                    activeCamExpenses.map((exp) => (
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
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteCamExpense(exp.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Expense"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add CAM Expense Modal */}
          {isAddExpenseModalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setIsAddExpenseModalOpen(false); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-700" />
                    <h3 className="font-extrabold text-base text-slate-900">Add CAM Facility Expense</h3>
                  </div>
                  <button onClick={() => setIsAddExpenseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleAddCamExpense} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Expense Category</label>
                    <select
                      value={newExpCategory}
                      onChange={(e) => setNewExpCategory(e.target.value as CAMExpenseItem['category'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      <option value="Common Electricity">Common Electricity &amp; High-Tension Meter</option>
                      <option value="Lift AMC">Elevator &amp; Lift Annual Maintenance (AMC)</option>
                      <option value="Generator Diesel">Backup Generator Diesel &amp; Fuel Run</option>
                      <option value="Security">Security Personnel &amp; CCTV Monitoring</option>
                      <option value="Housekeeping">Housekeeping, Deep Cleaning &amp; Waste Management</option>
                      <option value="Fire Safety">Fire Hydrant &amp; Smoke Detection Certification</option>
                      <option value="Water Tanker">Water Tanker &amp; Pumping Operations</option>
                      <option value="Landscaping">Commercial Campus Landscaping &amp; Grounds</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Vendor / Contractor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Otis Elevator Company, SIS Security India"
                      value={newExpVendor}
                      onChange={(e) => setNewExpVendor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Monthly Cost (INR)</label>
                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="e.g. 35000"
                      value={newExpMonthlyCost}
                      onChange={(e) => setNewExpMonthlyCost(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">CAM Allocation Method</label>
                    <select
                      value={newExpAllocationMethod}
                      onChange={(e) => setNewExpAllocationMethod(e.target.value as CAMExpenseItem['allocationMethod'])}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      <option value="Area-based">Area-based Ratio (Per Leasable Sq. Ft.)</option>
                      <option value="Fixed">Fixed Monthly Surcharge</option>
                      <option value="Percentage">Proportional Percentage</option>
                      <option value="Custom">Custom CAM Formula</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs transition cursor-pointer"
                    >
                      ✓ Save CAM Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddExpenseModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#D2DDD7] text-[#171717] font-bold text-xs hover:bg-[#F7F8F6] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FIT-OUT MANAGEMENT (Section 16) */}
      {activeTab === 'FITOUT' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] space-y-4">
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
              Fit-Out Milestones
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">Commercial Fit-Out Coordination</h2>
            <p className="text-xs text-slate-500">
              Track fit-out milestones from Lease Signing → Electrical & Interior → Internet & Furniture → Business Opens.
            </p>
          </div>

          {!isDemoAccount && effectiveCommercialUnits.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl">
              <Wrench className="h-10 w-10 text-[#D2DDD7] mx-auto mb-3 opacity-50" />
              <h3 className="text-sm font-bold text-[#171717]">No ongoing fit-outs</h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1">
                Commercial tenant interior architectural approvals and electrical fit-out milestones will track here.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* TAB 4: VISITOR PASSES & SECURITY (Section 17) */}
      {activeTab === 'VISITORS' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] space-y-4">
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
              className="px-4 py-2 rounded-2xl bg-[#171717] hover:bg-[#171717] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Visitor Pass</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeCommercialVisitors.length === 0 ? (
              <div className="col-span-full p-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl bg-[#ffffff]">
                <QrCode className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-[#666666]">No visitor gate passes active</p>
                <p className="text-[11px] text-[#999999] mt-0.5">Click &ldquo;Generate Visitor Pass&rdquo; to issue security QR passes for corporate guests.</p>
              </div>
            ) : (
              activeCommercialVisitors.map((vis) => (
                <div key={vis.id} className="p-4 rounded-2xl border border-slate-200 bg-[#ffffff] space-y-3">
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

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {vis.status === 'Checked In' && (
                      <button
                        type="button"
                        onClick={() => checkoutCommercialVisitor(vis.id)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Check-Out</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteCommercialVisitor(vis.id)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Revoke / Delete Pass"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Visitor Pass Modal */}
          {isVisitorModalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setIsVisitorModalOpen(false); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">Issue Corporate Visitor Pass</h3>
                  </div>
                  <button onClick={() => setIsVisitorModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
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
                    {effectiveCommercialUnits.length > 0 ? (
                      <select
                        value={hostCompany}
                        onChange={(e) => setHostCompany(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        {effectiveCommercialUnits.map(u => (
                          <option key={u.id} value={u.businessName}>
                            {u.businessName} ({u.unitNumber})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="e.g. AeroSys Technologies"
                        value={hostCompany}
                        onChange={(e) => setHostCompany(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                      />
                    )}
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
                    className="w-full py-3 rounded-2xl bg-[#06110c] hover:bg-[#171717] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
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

      {/* TAB 5: PARKING & WAREHOUSE/INDUSTRIAL */}
      {activeTab === 'PARKING' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full">
                Parking &amp; Warehouse Loading Bays
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Commercial Parking &amp; Industrial Docks</h2>
              <p className="text-xs text-slate-500">Reserved parking bays, EV chargers, and logistics loading docks configured for your estate.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsParkingModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#06110c] hover:bg-[#171717] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Allocate Parking Bay / Dock</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-[#F7F8F6] space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Car className="h-4 w-4 text-indigo-600" />
                  <span>Allocated Parking Bays ({parkingSlots.length})</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Active assignments</span>
              </div>
              <div className="space-y-2 text-xs">
                {parkingSlots.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-white space-y-1">
                    <Car className="h-7 w-7 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No parking bays allocated yet</p>
                    <p className="text-[10px] text-slate-400">Click &ldquo;+ Allocate Parking Bay / Dock&rdquo; above to assign reserved parking to tenants.</p>
                  </div>
                ) : (
                  parkingSlots.map(slot => (
                    <div key={slot.id} className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{slot.slotNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{slot.type}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Assigned to: <b className="text-slate-700">{slot.tenantName}</b> ({slot.unitNumber})
                          {slot.monthlyFee > 0 && ` • ₹${slot.monthlyFee.toLocaleString('en-IN')}/mo`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveParkingSlot(slot.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Release Parking Slot"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-[#F7F8F6] space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-sky-600" />
                <span>Warehouse Loading Bays &amp; Safety Compliance</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Clear Height &amp; Heavy Vehicle Access</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Hydraulic dock levelers, 40-ft container turn-radius, and fire safety clearance checked.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">EV Fleet Sub-Metering</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Industrial commercial 22kW AC/DC fast charger submeters linked with real-time tariff calculation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Allocate Parking Slot Modal */}
          {isParkingModalOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setIsParkingModalOpen(false); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#D2DDD7] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-extrabold text-base text-slate-900">Allocate Parking Bay / Loading Dock</h3>
                  </div>
                  <button onClick={() => setIsParkingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleAddParkingSlot} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Slot Identifier / Bay Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bay A-01 (Basement 1) or Loading Dock 2"
                      value={newSlotNumber}
                      onChange={(e) => setNewSlotNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Bay Type</label>
                    <select
                      value={newSlotType}
                      onChange={(e) => setNewSlotType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      <option value="4-Wheeler Reserved">4-Wheeler Reserved (Sedan / SUV)</option>
                      <option value="2-Wheeler Fleet">2-Wheeler Staff / Fleet Bay</option>
                      <option value="EV Fast Charging">EV Fast Charging Station</option>
                      <option value="Warehouse Loading Bay">Warehouse Heavy Container Loading Dock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Assigned Commercial Unit / Tenant</label>
                    {effectiveCommercialUnits.length > 0 ? (
                      <select
                        value={newSlotUnit}
                        onChange={(e) => setNewSlotUnit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <option value="">General Property Pool (Unallocated)</option>
                        {effectiveCommercialUnits.map(u => (
                          <option key={u.id} value={u.unitNumber}>
                            {u.unitNumber} • {u.businessName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Suite 301 or Logistics Client"
                        value={newSlotUnit}
                        onChange={(e) => setNewSlotUnit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Monthly Parking Tariff (INR)</label>
                    <input
                      type="number"
                      min="0"
                      value={newSlotFee}
                      onChange={(e) => setNewSlotFee(e.target.value)}
                      placeholder="0 if included in CAM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs transition cursor-pointer"
                    >
                      ✓ Save Slot Allocation
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsParkingModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#D2DDD7] text-[#171717] font-bold text-xs hover:bg-[#F7F8F6] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
