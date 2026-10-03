'use client';

import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Building2, 
  Users, 
  Receipt, 
  Wrench, 
  Compass, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function ManagerDashboard() {
  const { properties, tickets, leads, invoices, setActiveView } = useAppState();

  const totalProps = properties.length;
  const totalUnits = properties.reduce((acc, p) => acc + p.totalUnits, 0);
  const occupied = properties.reduce((acc, p) => acc + p.occupiedUnits, 0);
  const vacant = totalUnits - occupied;
  const pendingRent = properties.reduce((acc, p) => acc + p.pendingRent, 0);
  const openTickets = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Closed');

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Operations & Field Command
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              Field Active
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Day-to-day management of residential buildings, commercial spaces, and maintenance staff
          </p>
        </div>
      </div>

      {/* Operational 7-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Properties</span>
          <div className="text-xl font-black text-[#19251f] mt-1 font-tabular">{totalProps}</div>
        </div>
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Occupied</span>
          <div className="text-xl font-black text-emerald-700 mt-1 font-tabular">{occupied}</div>
        </div>
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Vacant</span>
          <div className="text-xl font-black text-amber-700 mt-1 font-tabular">{vacant}</div>
        </div>
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Pending Rent</span>
          <div className="text-xl font-black text-rose-700 mt-1 font-tabular">₹{(pendingRent / 1000).toFixed(0)}K</div>
        </div>
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Open Tickets</span>
          <div className="text-xl font-black text-amber-700 mt-1 font-tabular">{openTickets.length}</div>
        </div>
        <div className="organic-card p-3.5">
          <span className="text-[11px] font-semibold text-[#6e7972]">Active Leads</span>
          <div className="text-xl font-black text-[#274235] mt-1 font-tabular">{leads.length}</div>
        </div>
        <div className="organic-card p-3.5 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-[#6e7972]">Visits Today</span>
          <div className="text-xl font-black text-blue-700 mt-1 font-tabular">1 Showing</div>
        </div>
      </div>

      {/* Operations 2-Column: Tickets Triage & Scheduled Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Triage Queue */}
        <div className="organic-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#19251f]">Maintenance Triage Queue</h3>
              <p className="text-[11px] text-[#6e7972]">Field requests waiting for triage or vendor dispatch</p>
            </div>
            <button 
              onClick={() => setActiveView('maintenance')}
              className="text-xs font-bold text-[#274235] hover:underline"
            >
              All tickets →
            </button>
          </div>

          <div className="space-y-3">
            {openTickets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#19251f] flex items-center gap-2">
                    <span>{t.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      t.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {t.unitNumber} • {t.category}
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('maintenance')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#274235] hover:text-white text-[#19251f] font-bold text-xs border border-[#e3e1d8] transition shrink-0"
                >
                  Dispatch
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Showings & Physical Visits */}
        <div className="organic-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#19251f]">Upcoming Property Visits</h3>
              <p className="text-[11px] text-[#6e7972]">Prospective tenants scheduled for physical inspection</p>
            </div>
            <button 
              onClick={() => setActiveView('leads')}
              className="text-xs font-bold text-[#274235] hover:underline"
            >
              CRM pipeline →
            </button>
          </div>

          <div className="space-y-3">
            {leads.filter(l => l.visitDate).map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#19251f] flex items-center gap-2">
                    <span>{lead.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {lead.stage}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6e7972] mt-0.5">
                    {lead.assignedAgent} • Visit: {lead.visitDate}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-2 rounded-xl bg-white hover:bg-[#274235] hover:text-white text-[#19251f] border border-[#e3e1d8] transition"
                  >
                    📞
                  </a>
                  <button
                    onClick={() => setActiveView('leads')}
                    className="px-3 py-1.5 rounded-xl bg-[#274235] text-white font-bold text-xs shadow-sm hover:bg-[#1e352a] transition"
                  >
                    Conduct Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
