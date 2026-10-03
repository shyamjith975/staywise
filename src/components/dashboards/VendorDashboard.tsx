'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  Camera, 
  Receipt, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function VendorDashboard() {
  const { tickets, addNotification } = useAppState();
  const [jobInProgress, setJobInProgress] = useState<string | null>(null);
  const [uploadedBefore, setUploadedBefore] = useState(false);
  const [uploadedAfter, setUploadedAfter] = useState(false);

  const vendorTickets = tickets.filter(t => t.vendorId === 'v-cool' || t.status === 'Approved' || t.status === 'Scheduled');

  const handleStartJob = (id: string) => {
    setJobInProgress(id);
    addNotification('Job Started', 'Technician checked in on-site at Beach Road Unit 302.', 'MAINTENANCE');
  };

  const handleCompleteJob = (id: string) => {
    setJobInProgress(null);
    setUploadedBefore(false);
    setUploadedAfter(false);
    addNotification('Job Completed', 'AC service completed. Invoice #VO-881 submitted for escrow clearance.', 'MAINTENANCE');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              RapidCool Aircon Services — Vendor Dispatch
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Certified HVAC & Cooling Contractor for Kozhikode Portfolios • GST Verified
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Today&apos;s Jobs</span>
          <div className="text-2xl font-black text-[#19251f] mt-1 font-tabular">5</div>
          <span className="text-[11px] text-[#274235] font-bold mt-1 inline-block">3 On Schedule</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Pending Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1 font-tabular">8</div>
          <span className="text-[11px] text-[#6e7972] mt-1 inline-block">Awaiting quotes</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Completed (YTD)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-tabular">42</div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">98% SLA Rating</span>
        </div>
        <div className="organic-card p-5">
          <span className="text-xs font-semibold text-[#6e7972]">Escrow Payout Pending</span>
          <div className="text-2xl font-black text-[#19251f] mt-1 font-tabular">₹18,400</div>
          <span className="text-[11px] text-[#6e7972] mt-1 inline-block">Clears this Friday</span>
        </div>
      </div>

      {/* Active Work Order Action Card */}
      <div className="organic-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e1d8]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#274235]">Active Work Order #8841</span>
            <h3 className="text-lg font-extrabold text-[#19251f] mt-0.5">Master Bedroom AC Cooling Efficiency Drop</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Scheduled for 3:00 PM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6e7972]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#274235]" />
              <span className="text-[#19251f] font-semibold">Beach Road Apartments, Apartment 302 (Floor 3)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#274235]" />
              <span>Resident: Shyam Sundar (+91 98460 21980)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
            <span className="font-bold text-[#19251f] block">Pre-Authorized Budget</span>
            <div className="text-base font-black text-[#19251f] font-tabular">₹1,500 Max Cap</div>
            <p className="text-[11px] text-[#6e7972]">Owner approved for condenser coil wash & refrigerant test.</p>
          </div>
        </div>

        {/* 2-Step Proof of Work Checklist */}
        <div className="pt-2 border-t border-[#eeece5] space-y-3">
          <span className="text-xs font-extrabold text-[#19251f] block">Proof of Work (Mandatory for Escrow Release)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => setUploadedBefore(true)}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                uploadedBefore
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-[#f7f6f2] text-[#19251f] border-[#e3e1d8] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <Camera className="h-4 w-4" />
                <span>1. Upload Pre-Service Photo</span>
              </div>
              {uploadedBefore ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <span className="text-[11px] text-[#6e7972]">Tap to snap</span>}
            </button>

            <button
              onClick={() => setUploadedAfter(true)}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                uploadedAfter
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-[#f7f6f2] text-[#19251f] border-[#e3e1d8] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                <Camera className="h-4 w-4" />
                <span>2. Upload Post-Service Photo</span>
              </div>
              {uploadedAfter ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <span className="text-[11px] text-[#6e7972]">Tap to snap</span>}
            </button>
          </div>
        </div>

        {/* Execution Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {jobInProgress !== 't-8841' ? (
            <button
              onClick={() => handleStartJob('t-8841')}
              className="px-5 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition"
            >
              Check-In & Start Work
            </button>
          ) : (
            <button
              onClick={() => handleCompleteJob('t-8841')}
              disabled={!uploadedBefore || !uploadedAfter}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition ${
                uploadedBefore && uploadedAfter
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                  : 'bg-[#e3e1d8] text-[#95a099] cursor-not-allowed'
              }`}
            >
              Submit for Escrow Release (₹1,500)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
