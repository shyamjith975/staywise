'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Trees, 
  Shield, 
  Users, 
  Zap, 
  Sun, 
  Fuel, 
  Wrench, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Layers,
  Plus,
  X
} from 'lucide-react';
import { EstateAsset } from '../../../types';

export default function EstateOSView() {
  const { 
    properties,
    estateAssets, 
    staff, 
    utilities, 
    currentUser, 
    activeRole,
    addNotification,
    addEstateAsset,
    deleteEstateAsset,
    addStaffMember,
    deleteStaffMember
  } = useAppState();

  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [assetForm, setAssetForm] = useState({
    name: '',
    tag: '',
    category: 'Power & Generator' as EstateAsset['category'],
    estateName: 'Campus',
    purchaseDate: '2026-01-15',
    warrantyUntil: '2028-01-15',
    amcProvider: '',
    lastService: '10 Oct 2026',
    nextService: '10 Jan 2027',
    condition: 'Excellent' as EstateAsset['condition']
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Caretaker',
    estateName: 'Campus',
    phone: '',
    shift: 'Morning (07:00 - 15:00)',
    attendanceStatus: 'Present',
    monthlySalary: 22000
  });

  const [activeTab, setActiveTab] = useState<'ASSETS' | 'STAFF' | 'UTILITIES'>('ASSETS');

  const isDemoEstate = currentUser?.email === 'estate@staywise.com' || currentUser?.id === 'user-estate-manoj';

  const userEstateNames = properties
    .filter(p => p.ownerId === currentUser?.id || isDemoEstate)
    .map(p => p.name.toLowerCase());

  const activeAssets = isDemoEstate 
    ? estateAssets 
    : estateAssets.filter(a => userEstateNames.includes(a.estateName.toLowerCase()) || (a as any).ownerId === currentUser?.id);

  const activeStaff = isDemoEstate 
    ? staff 
    : staff.filter(s => userEstateNames.includes(s.estateName.toLowerCase()) || (s as any).ownerId === currentUser?.id);

  const activeUtilities = isDemoEstate 
    ? utilities 
    : utilities.filter(u => userEstateNames.includes(u.estateName.toLowerCase()) || (u as any).ownerId === currentUser?.id);

  const totalMonthlyBudget = activeStaff.reduce((acc, s) => acc + (s.monthlySalary || 0), 0);
  const solarExport = activeUtilities.find(u => u.utilityType === 'Solar Grid')?.currentReading ?? (isDemoEstate ? 1520 : 0);

  return (
    <div className="space-y-6 pb-12 font-sans text-[#263238]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238] flex items-center gap-2">
              <Trees className="h-6 w-6 text-[#163B36]" />
              <span>EstateOS — Villas &amp; Campuses</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#163B36] font-bold border border-[#D2DDD7]">
              Campus Operations
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-0.5">
            Dedicated asset operations for private estates, luxury villas, and agricultural acreage
          </p>
        </div>

        {/* Tab Switcher & Manual Add Options */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#D2DDD7] text-xs">
            <button
              onClick={() => setActiveTab('ASSETS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'ASSETS' ? 'bg-[#163B36] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#263238]'
              }`}
            >
              Physical Assets ({activeAssets.length})
            </button>
            <button
              onClick={() => setActiveTab('STAFF')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'STAFF' ? 'bg-[#163B36] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#263238]'
              }`}
            >
              Estate Staff ({activeStaff.length})
            </button>
            <button
              onClick={() => setActiveTab('UTILITIES')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'UTILITIES' ? 'bg-[#163B36] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#263238]'
              }`}
            >
              Utility Meters ({activeUtilities.length})
            </button>
          </div>
        </div>
      </div>

      {/* Hero 4-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#546E7A]">Estate Health Score</span>
          <div className="text-2xl font-black text-emerald-800 mt-1 font-tabular">
            {activeAssets.length > 0 ? (isDemoEstate ? '96%' : '98%') : '0%'}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 inline-block">
            {activeAssets.length > 0 ? 'Optimal operating condition' : 'No campus assets registered'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#546E7A]">Dedicated Staff</span>
          <div className="text-2xl font-black text-[#263238] mt-1 font-tabular">
            {activeStaff.length} Members
          </div>
          <span className="text-[11px] text-[#163B36] font-bold mt-1 inline-block">
            {activeStaff.length > 0 ? 'All Present Today' : '0 active roster'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#546E7A]">Solar Net Export</span>
          <div className="text-2xl font-black text-emerald-800 mt-1 font-tabular">
            {solarExport > 0 ? `+${solarExport.toLocaleString()} kWh` : '0 kWh'}
          </div>
          <span className="text-[11px] text-emerald-800 font-bold mt-1 inline-block">
            {solarExport > 0 ? 'Net negative power bill' : 'Standby / Grid Connected'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <span className="text-xs font-semibold text-[#546E7A]">Monthly Operating Budget</span>
          <div className="text-2xl font-black text-[#263238] mt-1 font-tabular">
            ₹{totalMonthlyBudget > 0 ? totalMonthlyBudget.toLocaleString('en-IN') : (isDemoEstate ? '86,000' : '0')}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 inline-block">
            {totalMonthlyBudget > 0 ? 'Staff Roster + AMC + Fuel' : '₹0 allocated'}
          </span>
        </div>
      </div>

      {/* TAB 1: Assets Management */}
      {activeTab === 'ASSETS' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Campus &amp; Villa Asset Registry</h3>
              <p className="text-[11px] text-[#546E7A]">AMC contracts, servicing schedules, and asset condition</p>
            </div>
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>+ Add Campus Asset</span>
            </button>
          </div>

          {activeAssets.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6 space-y-3">
              <Trees className="h-10 w-10 text-[#D2DDD7] mx-auto opacity-50" />
              <h4 className="text-xs font-bold text-[#263238]">No Estate Assets Registered</h4>
              <p className="text-[11px] text-[#546E7A] max-w-sm mx-auto">
                Add your physical equipment, HVAC, solar arrays, generator sets, and AMC warranties.
              </p>
              <button
                onClick={() => setIsAddAssetModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
                <span>Add First Campus Asset</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeAssets.map(asset => (
                <div
                  key={asset.id}
                  className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#163B36] font-bold">{asset.tag}</span>
                      <h4 className="font-extrabold text-[#263238] text-sm mt-0.5">{asset.name}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      asset.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {asset.condition}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[#546E7A] text-[11px]">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-[#263238] font-semibold">{asset.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AMC Partner:</span>
                      <span className="text-[#263238] font-semibold">{asset.amcProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Service:</span>
                      <span className="text-[#263238]">{asset.lastService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Due:</span>
                      <span className="text-[#263238] font-bold">{asset.nextService}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D2DDD7] flex justify-between items-center text-[10px] text-[#546E7A]">
                    <span>Warranty: {asset.warrantyUntil}</span>
                    <span 
                      onClick={() => alert(`Service logged for ${asset.name}`)}
                      className="text-[#163B36] font-bold cursor-pointer hover:underline"
                    >
                      Log Service →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Staff Management */}
      {activeTab === 'STAFF' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Estate Staff Roster &amp; Shifts</h3>
              <p className="text-[11px] text-[#546E7A]">Security, Caretaker, Gardener, and Housekeeping</p>
            </div>
            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>+ Add Staff Member</span>
            </button>
          </div>

          {activeStaff.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6 space-y-3">
              <Users className="h-10 w-10 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#263238]">No estate staff rostered</p>
              <p className="text-[11px] text-[#546E7A] max-w-sm mx-auto">
                Add security guards, gardeners, and caretakers to manage monthly salaries and shifts.
              </p>
              <button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
                <span>Add First Staff Member</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E8F0EC] text-[#546E7A] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Staff Member</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Estate</th>
                    <th className="py-2.5 px-4">Shift</th>
                    <th className="py-2.5 px-4">Salary</th>
                    <th className="py-2.5 px-4">Today&apos;s Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0] text-[#263238]">
                  {activeStaff.map(s => (
                    <tr key={s.id} className="hover:bg-[#F7F8F6] transition">
                      <td className="py-3 px-4 font-bold">{s.name}</td>
                      <td className="py-3 px-4 text-[#546E7A]">{s.role}</td>
                      <td className="py-3 px-4">{s.estateName}</td>
                      <td className="py-3 px-4 text-[#263238] font-bold">{s.shift}</td>
                      <td className="py-3 px-4 font-tabular font-medium">₹{s.monthlySalary.toLocaleString('en-IN')}/mo</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7]">
                          <CheckCircle className="h-3 w-3" />
                          {s.attendanceStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Utility Readings */}
      {activeTab === 'UTILITIES' && (
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Utility Meter Logs &amp; Solar Generation</h3>
              <p className="text-[11px] text-[#546E7A]">Real-time recording of KSEB, Solar export, and Generator fuel levels</p>
            </div>
            <button
              onClick={() => alert('Connecting IoT Solar Inverter & KSEB Smart Meter...')}
              className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>+ Link New Meter</span>
            </button>
          </div>

          {activeUtilities.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6">
              <Sun className="h-10 w-10 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#263238]">No campus utility meters linked</p>
              <p className="text-[11px] text-[#546E7A] mt-0.5">Link your solar generation array, grid electricity meters, or backup diesel generator levels.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeUtilities.map(u => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {u.utilityType === 'Solar Grid' && <Sun className="h-5 w-5 text-[#C69A55]" />}
                      {u.utilityType === 'Electricity' && <Zap className="h-5 w-5 text-[#163B36]" />}
                      {u.utilityType === 'Generator Fuel' && <Fuel className="h-5 w-5 text-rose-600" />}
                      <span className="font-extrabold text-[#263238]">{u.utilityType}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#546E7A]">{u.meterNumber}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#D2DDD7] space-y-1.5">
                    <div className="flex justify-between text-[#546E7A]">
                      <span>Current Reading:</span>
                      <span className="font-bold text-[#263238] font-tabular">{u.currentReading.toLocaleString()} {u.consumptionUnit}</span>
                    </div>
                    <div className="flex justify-between text-[#546E7A]">
                      <span>Net Bill / Credit:</span>
                      <span className={`font-bold font-tabular ${u.billAmount < 0 ? 'text-[#163B36]' : 'text-[#263238]'}`}>
                        {u.billAmount < 0 ? `- ₹${Math.abs(u.billAmount)} (Credit)` : `₹${u.billAmount.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#546E7A] flex justify-between items-center">
                    <span>Logged: {u.readingDate}</span>
                    <span className="text-[#163B36] font-bold">{u.paymentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Campus Physical Asset */}
      {isAddAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Register Physical Campus Asset</h3>
                <p className="text-xs text-[#546E7A]">Power generator, solar inverter, pool pump, or HVAC</p>
              </div>
              <button onClick={() => setIsAddAssetModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addEstateAsset({
                name: assetForm.name,
                tag: assetForm.tag || `AST-${Date.now().toString().slice(-4)}`,
                category: assetForm.category,
                estateName: assetForm.estateName || 'Campus',
                purchaseDate: assetForm.purchaseDate,
                warrantyUntil: assetForm.warrantyUntil,
                amcProvider: assetForm.amcProvider || 'Authorized Service Partner',
                lastService: assetForm.lastService,
                nextService: assetForm.nextService,
                condition: assetForm.condition
              });
              setIsAddAssetModalOpen(false);
              setAssetForm({ ...assetForm, name: '', tag: '', amcProvider: '' });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kirloskar 25 kVA Silent Generator"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Asset Tag / Serial</label>
                  <input
                    type="text"
                    placeholder="e.g. DG-01"
                    value={assetForm.tag}
                    onChange={(e) => setAssetForm({ ...assetForm, tag: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Power & Generator">Power & Generator</option>
                    <option value="HVAC & Cooling">HVAC & Cooling</option>
                    <option value="Water & Sewage">Water & Sewage</option>
                    <option value="Solar & Eco">Solar & Eco</option>
                    <option value="Security & CCTV">Security & CCTV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">AMC Contractor</label>
                  <input
                    type="text"
                    placeholder="e.g. Cummins Power Solutions"
                    value={assetForm.amcProvider}
                    onChange={(e) => setAssetForm({ ...assetForm, amcProvider: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Next AMC Service</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Jan 2027"
                    value={assetForm.nextService}
                    onChange={(e) => setAssetForm({ ...assetForm, nextService: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer mt-2"
              >
                Register Campus Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Staff Member */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#D2DDD7] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Enroll Estate Staff Member</h3>
                <p className="text-xs text-[#546E7A]">Caretaker, gardener, housekeeper, or security</p>
              </div>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addStaffMember({
                name: staffForm.name,
                role: staffForm.role as any,
                estateName: staffForm.estateName || 'Campus',
                phone: staffForm.phone || '+91 94470 12891',
                shift: staffForm.shift as any,
                attendanceStatus: staffForm.attendanceStatus as any,
                monthlySalary: Number(staffForm.monthlySalary) || 20000
              });
              setIsAddStaffModalOpen(false);
              setStaffForm({ ...staffForm, name: '', phone: '' });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Role / Designation</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Head Caretaker">Head Caretaker</option>
                    <option value="Security Supervisor">Security Supervisor</option>
                    <option value="Gardener & Landscaper">Gardener & Landscaper</option>
                    <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
                    <option value="Chef & Butler">Chef & Butler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94470 12891"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Duty Shift</label>
                  <select
                    value={staffForm.shift}
                    onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
                    <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
                    <option value="Night (19:00 - 07:00)">Night (19:00 - 07:00)</option>
                    <option value="Full Residential Caretaker">Full Residential Caretaker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={staffForm.monthlySalary}
                    onChange={(e) => setStaffForm({ ...staffForm, monthlySalary: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-tabular"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer mt-2"
              >
                Enroll Staff Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
