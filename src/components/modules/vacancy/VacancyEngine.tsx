'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  Camera, 
  Send, 
  Building, 
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function VacancyEngine() {
  const { addNotification, setActiveView } = useAppState();

  const [activeTab, setActiveTab] = useState<'LOOP' | 'READINESS' | 'ANALYTICS'>('LOOP');

  // Interactive Readiness Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c-1', task: 'Deep Sanitization & Floor Scrubbing', status: 'Completed', cost: 2400 },
    { id: 'c-2', task: 'Wall Repainting & Patch Touchup (Asian Paints Royal)', status: 'In Progress', cost: 6500 },
    { id: 'c-3', task: 'AC Filter Servicing & Coolant Check (Unit 304)', status: 'Completed', cost: 1800 },
    { id: 'c-4', task: 'Electrical & Concealed Plumbing Audit', status: 'Completed', cost: 800 },
    { id: 'c-5', task: 'Smart Lock Passcode Reset & Master Key Handover', status: 'Pending', cost: 0 },
    { id: 'c-6', task: 'High-Res Staging Photography & 4K Video Tour', status: 'Completed', cost: 3500 },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Completed' ? 'Pending' : 'Completed'
        };
      }
      return item;
    }));
  };

  const completedCount = checklist.filter(c => c.status === 'Completed').length;
  const readinessPercent = Math.round((completedCount / checklist.length) * 100);

  const handlePublishListing = () => {
    addNotification('Listing Published!', 'Beach Road Unit 304 has been published across Staywise portals and partner channels.', 'LEAD');
    setActiveView('leads');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
              Vacancy Engine & Move-Out Automation
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#263238] font-bold border border-[#263238]/20">
              Turnaround Engine
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Automating the core loop: Move-out Notice → Inspection → Deposit Refund → Staging Readiness → Auto-Listing
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#D2DDD7] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('LOOP')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'LOOP' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
            }`}
          >
            Lifecycle Automation Flow
          </button>
          <button
            onClick={() => setActiveTab('READINESS')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'READINESS' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
            }`}
          >
            Readiness Checklist ({readinessPercent}%)
          </button>
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'ANALYTICS' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
            }`}
          >
            Vacancy Analytics
          </button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Current Vacant Units</span>
          <div className="text-2xl font-black text-amber-700 mt-1 font-tabular">2 Units</div>
          <span className="text-[11px] text-[#666666] mt-1 inline-block">Beach Road #304, Infovision #304</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Avg. Turnaround Time</span>
          <div className="text-2xl font-black text-[#263238] mt-1 font-tabular">12 Days</div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">↓ 4 days faster with PropOS</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Readiness Staging</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">{readinessPercent}%</div>
          <span className="text-[11px] text-[#666666] mt-1 inline-block">Unit 304 almost staged</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#666666]">Hot Lead Pipeline</span>
          <div className="text-2xl font-black text-[#263238] mt-1 font-tabular">2 Leads</div>
          <span className="text-[11px] text-[#263238] font-bold mt-1 inline-block">Ready for immediate move-in</span>
        </div>
      </div>

      {/* TAB 1: Automation Flow */}
      {activeTab === 'LOOP' && (
        <div className="organic-card p-6 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-[#263238]">Active Move-Out & Turnaround Case: Beach Road #304</h3>
            <p className="text-[11px] text-[#666666]">Triggered automatically when previous tenant submitted move-out notice</p>
          </div>

          {/* Stepper visual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Step 1 • Completed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              </div>
              <div className="font-extrabold text-[#263238]">Move-Out Notice & Deposit Settlement</div>
              <p className="text-[11px] text-[#666666]">
                Notice logged. Deposit ₹75,000 - ₹8,500 minor wall repairs = ₹66,500 refund issued.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#263238]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#263238]">Step 2 • Active</span>
                <Clock className="h-4 w-4 text-[#263238] animate-spin" />
              </div>
              <div className="font-extrabold text-[#263238]">Property Readiness Staging</div>
              <p className="text-[11px] text-[#666666]">
                Deep cleaning, AC service, and painting underway. 5/6 tasks complete ({readinessPercent}%).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Step 3 • Queued</span>
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div className="font-extrabold text-[#263238]">Instant Listing Syndication</div>
              <p className="text-[11px] text-[#666666]">
                Staywise AI generated listing copy & photos. Ready to publish to portals.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Step 4 • Pipeline</span>
                <ArrowRightLeft className="h-4 w-4 text-blue-600" />
              </div>
              <div className="font-extrabold text-[#263238]">Lead Visit & Fast Onboarding</div>
              <p className="text-[11px] text-[#666666]">
                1 Hot Lead (Kavita Nambiar) visiting today. Expected conversion within 48h.
              </p>
            </div>
          </div>

          {/* Quick CTA to Publish Listing */}
          <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-extrabold text-[#263238] text-sm">Property Ready for Relisting?</span>
              <p className="text-[11px] text-[#666666]">
                Draft listing is prepared with Sea View photos and rent ₹26,000/mo.
              </p>
            </div>
            <button
              onClick={handlePublishListing}
              className="px-5 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold shadow-md shadow-[#263238]/20 transition flex items-center gap-2 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Publish Listing & Activate Leads</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Readiness Checklist */}
      {activeTab === 'READINESS' && (
        <div className="organic-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238]">Unit 304 Property Readiness Checklist</h3>
              <p className="text-[11px] text-[#666666]">Comprehensive inspection checklist before re-tenancy</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#666666]">Readiness Score: </span>
              <span className="font-black text-emerald-700 text-sm">{readinessPercent}%</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] hover:border-[#263238]/40 transition flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.status === 'Completed'}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-[#D2DDD7] text-[#263238] focus:ring-[#163B36] cursor-pointer"
                  />
                  <span className={`font-medium ${item.status === 'Completed' ? 'text-[#263238] line-through opacity-70' : 'text-[#263238] font-bold'}`}>
                    {item.task}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {item.cost > 0 && (
                    <span className="text-[#666666] font-tabular">₹{item.cost.toLocaleString('en-IN')}</span>
                  )}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Vacancy Analytics */}
      {activeTab === 'ANALYTICS' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#263238]">Vacancy Analytics & Cost Surveillance</h3>
            <p className="text-[11px] text-[#666666]">Tracking daily vacancy drag on portfolio net yields</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3">
              <span className="font-extrabold text-[#263238]">Unit 304 (Beach Road Apartments)</span>
              <div className="space-y-2 text-[#666666]">
                <div className="flex justify-between">
                  <span>Days Vacant:</span>
                  <span className="font-bold text-amber-700">8 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Lost Rent:</span>
                  <span className="font-bold text-rose-700 font-tabular">₹6,933</span>
                </div>
                <div className="flex justify-between">
                  <span>Inbound Inquiries:</span>
                  <span className="font-bold text-[#263238]">24 Leads</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed / Scheduled Visits:</span>
                  <span className="font-bold text-[#263238]">7 Showings</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3">
              <span className="font-extrabold text-[#263238]">Suite 304 (Infovision Commercial Hub)</span>
              <div className="space-y-2 text-[#666666]">
                <div className="flex justify-between">
                  <span>Days Vacant:</span>
                  <span className="font-bold text-amber-700">14 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Lost Rent:</span>
                  <span className="font-bold text-rose-700 font-tabular">₹21,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial Inquiries:</span>
                  <span className="font-bold text-[#263238]">8 Tech Firms</span>
                </div>
                <div className="flex justify-between">
                  <span>Visit Scheduled:</span>
                  <span className="font-bold text-[#263238]">Siddharth Varma (AeroSys)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
