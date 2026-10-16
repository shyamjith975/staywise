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
  Plus
} from 'lucide-react';

export default function EstateOSView() {
  const { 
    estateAssets, 
    staff, 
    utilities, 
    currentUser, 
    activeRole,
    setIsAddPropertyOpen,
    addNotification 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'ASSETS' | 'STAFF' | 'UTILITIES'>('ASSETS');

  const isDemoEstate = currentUser?.email === 'estate@staywise.com' || currentUser?.id === 'user-estate-manoj' || currentUser?.email === 'owner@staywise.com';

  const activeAssets = isDemoEstate ? estateAssets : (estateAssets || []);
  const activeStaff = isDemoEstate ? staff : (staff || []);
  const activeUtilities = isDemoEstate ? utilities : (utilities || []);

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

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#D2DDD7] text-xs self-start sm:self-auto">
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
              onClick={() => setIsAddPropertyOpen(true)}
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
                Add your luxury villa or private estate to monitor physical equipment, HVAC, solar arrays, and AMC warranties.
              </p>
              <button
                onClick={() => setIsAddPropertyOpen(true)}
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
              onClick={() => alert('Opening Staff Member Enrollment Form...')}
              className="px-3.5 py-1.5 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#C69A55]" />
              <span>+ Add Staff Member</span>
            </button>
          </div>

          {activeStaff.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6">
              <Users className="h-10 w-10 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#263238]">No estate staff rostered</p>
              <p className="text-[11px] text-[#546E7A] mt-0.5">Add security guards, gardeners, and caretakers to manage monthly salaries and shifts.</p>
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
    </div>
  );
}
