'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { Lead } from '../../../types';
import { 
  Compass, 
  Phone, 
  Mail, 
  Calendar, 
  Flame, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Plus, 
  MapPin,
  ArrowRight,
  X
} from 'lucide-react';

export default function LeadsCRM() {
  const { leads, advanceLeadStage, setIsExistingTenantWizardOpen, addNotification } = useAppState();

  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<Lead | null>(null);
  const [visitDate, setVisitDate] = useState('2026-10-02');
  const [visitTime, setVisitTime] = useState('11:00 AM');

  const STAGES: Lead['stage'][] = [
    'New',
    'Contacted',
    'Visit Scheduled',
    'Visited',
    'Converted'
  ];

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLeadForVisit) {
      advanceLeadStage(selectedLeadForVisit.id, 'Visit Scheduled');
      addNotification('Showing Scheduled', `Physical visit confirmed for ${selectedLeadForVisit.name} on ${visitDate} at ${visitTime}.`, 'LEAD');
      setSelectedLeadForVisit(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#B5B5B5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2a2a2a]">
              Leads CRM & Physical Visits Pipeline
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#2a2a2a] font-bold border border-[#2a2a2a]/20">
              Acquire Engine
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Transparent Lead Scoring (Hot/Warm/Cold) & Physical Visit Management
          </p>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage);
          return (
            <div
              key={stage}
              className="organic-card p-4 flex flex-col min-h-[460px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E0E0E0]">
                <span className="font-extrabold text-xs text-[#2a2a2a]">{stage}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0f0f0] text-[#2a2a2a] font-bold border border-[#B5B5B5]">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageLeads.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-[11px] font-medium text-[#888888]">No leads in this stage</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl bg-[#ffffff] border border-[#B5B5B5] hover:border-[#2a2a2a]/50 transition space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-extrabold text-[#2a2a2a] text-sm">{lead.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        lead.scoreCategory === 'Hot' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {lead.scoreCategory}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#2a2a2a] font-bold">
                      {lead.propertyInterest}
                    </div>

                    <p className="text-[10px] text-[#666666] leading-relaxed bg-[#f0f0f0] p-2 rounded-xl border border-[#B5B5B5]/80">
                      <b className="text-[#2a2a2a]">Rationale:</b> {lead.scoreExplanation}
                    </p>

                    <div className="text-[11px] text-[#666666] flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-[#2a2a2a]" />
                      <span>{lead.phone}</span>
                    </div>

                    {lead.visitDate && (
                      <div className="p-1.5 rounded-xl bg-[#f0f0f0] border border-[#2a2a2a]/20 text-[10px] text-[#2a2a2a] font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{lead.visitDate}</span>
                      </div>
                    )}

                    {/* Stage Progression Action */}
                    <div className="pt-2 border-t border-[#E0E0E0] flex items-center justify-between gap-1">
                      {stage === 'New' && (
                        <button
                          onClick={() => advanceLeadStage(lead.id, 'Contacted')}
                          className="w-full py-1.5 rounded-xl bg-[#f0f0f0] hover:bg-[#2a2a2a] hover:text-white text-[#2a2a2a] text-[11px] font-bold transition"
                        >
                          Mark Contacted →
                        </button>
                      )}
                      {stage === 'Contacted' && (
                        <button
                          onClick={() => setSelectedLeadForVisit(lead)}
                          className="w-full py-1.5 rounded-xl bg-[#f0f0f0] hover:bg-[#2a2a2a] hover:text-white text-[#2a2a2a] text-[11px] font-bold border border-[#2a2a2a]/30 transition"
                        >
                          Schedule Visit 📅
                        </button>
                      )}
                      {stage === 'Visit Scheduled' && (
                        <button
                          onClick={() => advanceLeadStage(lead.id, 'Visited')}
                          className="w-full py-1.5 rounded-xl bg-[#f0f0f0] hover:bg-[#2a2a2a] hover:text-white text-[#2a2a2a] text-[11px] font-bold transition"
                        >
                          Visit Completed ✓
                        </button>
                      )}
                      {stage === 'Visited' && (
                        <button
                          onClick={() => {
                            advanceLeadStage(lead.id, 'Converted');
                            setIsExistingTenantWizardOpen(true);
                          }}
                          className="w-full py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white text-[11px] font-bold shadow-sm transition"
                        >
                          Convert to Tenant ✍️
                        </button>
                      )}
                      {stage === 'Converted' && (
                        <span className="w-full text-center py-1 text-[11px] text-emerald-700 font-extrabold">
                          ✓ Tenant Active
                        </span>
                      )}
                    </div>
                  </div>
                )))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Visit Modal */}
      {selectedLeadForVisit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#B5B5B5] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#E0E0E0]">
              <h3 className="font-extrabold text-[#2a2a2a] text-base">Schedule Showing for {selectedLeadForVisit.name}</h3>
              <button onClick={() => setSelectedLeadForVisit(null)} className="text-[#666666] hover:text-[#2a2a2a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookVisit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#2a2a2a] font-semibold mb-1">Target Property</label>
                <input
                  type="text"
                  readOnly
                  value={selectedLeadForVisit.propertyInterest}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2a2a2a] font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#B5B5B5] text-[#2a2a2a] focus:outline-none focus:border-[#2a2a2a]"
                  />
                </div>
                <div>
                  <label className="block text-[#2a2a2a] font-semibold mb-1">Visit Time</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#B5B5B5] text-[#2a2a2a] focus:outline-none focus:border-[#2a2a2a]"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2a2a2a] font-semibold mb-1">Assigned Leasing Rep</label>
                <input
                  type="text"
                  readOnly
                  value="Vikram Singhania (Leasing Lead)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-[#2a2a2a] font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white font-bold text-xs shadow-md shadow-[#2a2a2a]/20 transition"
                >
                  Confirm Physical Showing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
