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
  Layers
} from 'lucide-react';

export default function EstateOSView() {
  const { estateAssets, staff, utilities } = useAppState();

  const [activeTab, setActiveTab] = useState<'ASSETS' | 'STAFF' | 'UTILITIES'>('ASSETS');

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f] flex items-center gap-2">
              <Trees className="h-6 w-6 text-[#274235]" />
              <span>EstateOS — Villas & Campuses</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              Campus Operations
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Dedicated asset operations for Serene Mist Estate Villa (Wayanad) & large private estates
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#e3e1d8] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('ASSETS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'ASSETS' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            Physical Assets ({estateAssets.length})
          </button>
          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'STAFF' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            Estate Staff ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('UTILITIES')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'UTILITIES' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            Utility Meters
          </button>
        </div>
      </div>

      {/* Hero 4-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Estate Health Score</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">96%</div>
          <span className="text-[11px] text-[#6e7972] mt-1 inline-block">Optimal operating condition</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Dedicated Staff</span>
          <div className="text-2xl font-black text-[#19251f] mt-1 font-tabular">4 Members</div>
          <span className="text-[11px] text-[#274235] font-bold mt-1 inline-block">All Present Today</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Solar Net Export</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">+1,520 kWh</div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">Negative electricity bill</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Monthly Operating Budget</span>
          <div className="text-2xl font-black text-[#19251f] mt-1 font-tabular">₹86,000</div>
          <span className="text-[11px] text-[#6e7972] mt-1 inline-block">Staff + AMC + Fuel</span>
        </div>
      </div>

      {/* TAB 1: Assets Management */}
      {activeTab === 'ASSETS' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#19251f]">Campus & Villa Asset Registry</h3>
            <p className="text-[11px] text-[#6e7972]">AMC contracts, servicing schedules, and asset condition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estateAssets.map(asset => (
              <div
                key={asset.id}
                className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#274235] font-bold">{asset.tag}</span>
                    <h4 className="font-extrabold text-[#19251f] text-sm mt-0.5">{asset.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asset.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asset.condition}
                  </span>
                </div>

                <div className="space-y-1.5 text-[#6e7972] text-[11px]">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-[#19251f] font-semibold">{asset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AMC Partner:</span>
                    <span className="text-[#19251f] font-semibold">{asset.amcProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Service:</span>
                    <span className="text-[#19251f]">{asset.lastService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Due:</span>
                    <span className="text-[#274235] font-bold">{asset.nextService}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#eeece5] flex justify-between items-center text-[10px] text-[#6e7972]">
                  <span>Warranty: {asset.warrantyUntil}</span>
                  <span className="text-[#274235] font-bold cursor-pointer hover:underline">Log Service →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Staff Management */}
      {activeTab === 'STAFF' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#19251f]">Estate Staff Roster & Shifts</h3>
            <p className="text-[11px] text-[#6e7972]">Security, Caretaker, Gardener, and Housekeeping</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f6f2] text-[#6e7972] border-b border-[#e3e1d8] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Staff Member</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Estate</th>
                  <th className="py-2.5 px-4">Shift</th>
                  <th className="py-2.5 px-4">Salary</th>
                  <th className="py-2.5 px-4">Today&apos;s Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece5] text-[#19251f]">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-[#fbfbfa]">
                    <td className="py-3 px-4 font-bold">{s.name}</td>
                    <td className="py-3 px-4 text-[#6e7972]">{s.role}</td>
                    <td className="py-3 px-4">{s.estateName}</td>
                    <td className="py-3 px-4 text-[#274235] font-bold">{s.shift}</td>
                    <td className="py-3 px-4 font-tabular font-medium">₹{s.monthlySalary.toLocaleString('en-IN')}/mo</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="h-3 w-3" />
                        {s.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Utility Readings */}
      {activeTab === 'UTILITIES' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#19251f]">Utility Meter Logs & Solar Generation</h3>
            <p className="text-[11px] text-[#6e7972]">Real-time recording of KSEB, Solar export, and Generator fuel levels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {utilities.map(u => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {u.utilityType === 'Solar Grid' && <Sun className="h-5 w-5 text-amber-600" />}
                    {u.utilityType === 'Electricity' && <Zap className="h-5 w-5 text-[#274235]" />}
                    {u.utilityType === 'Generator Fuel' && <Fuel className="h-5 w-5 text-rose-600" />}
                    <span className="font-extrabold text-[#19251f]">{u.utilityType}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6e7972]">{u.meterNumber}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#e3e1d8] space-y-1.5">
                  <div className="flex justify-between text-[#6e7972]">
                    <span>Current Reading:</span>
                    <span className="font-bold text-[#19251f] font-tabular">{u.currentReading.toLocaleString()} {u.consumptionUnit}</span>
                  </div>
                  <div className="flex justify-between text-[#6e7972]">
                    <span>Net Bill / Credit:</span>
                    <span className={`font-bold font-tabular ${u.billAmount < 0 ? 'text-emerald-700' : 'text-[#19251f]'}`}>
                      {u.billAmount < 0 ? `- ₹${Math.abs(u.billAmount)} (Credit)` : `₹${u.billAmount.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-[#6e7972] flex justify-between items-center">
                  <span>Logged: {u.readingDate}</span>
                  <span className="text-[#274235] font-bold">{u.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
