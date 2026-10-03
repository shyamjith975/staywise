'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  Star, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function MarketplaceNRI() {
  const { addNotification } = useAppState();

  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'NRI'>('NRI');

  const services = [
    {
      id: 'srv-1',
      title: 'Tenant Background & Police Verification',
      provider: 'Staywise TrustGuard India',
      category: 'Leasing',
      rating: 4.9,
      sla: 'Within 24 Hours',
      price: 999,
      description: 'Criminal record check, court verification, past landlord reference & Aadhaar authentic verification.'
    },
    {
      id: 'srv-2',
      title: '4K Staging Photography & Virtual Video Tour',
      provider: 'PixelLens Studio Kerala',
      category: 'Marketing',
      rating: 4.8,
      sla: '48 Hours',
      price: 3499,
      description: 'Ultra-wide architectural photography with drone footage to maximize rental yield and fast lead conversion.'
    },
    {
      id: 'srv-3',
      title: 'Comprehensive Deep Cleaning & Sanitization',
      provider: 'CleanCare Facilities',
      category: 'Maintenance',
      rating: 4.9,
      sla: 'Same Day Dispatch',
      price: 2499,
      description: 'Single-disc scrubber machine, bathroom descaling, kitchen degreasing, and balcony high-pressure wash.'
    },
    {
      id: 'srv-4',
      title: 'Annual AC Comprehensive Maintenance Contract',
      provider: 'RapidCool Aircon Services',
      category: 'HVAC',
      rating: 4.9,
      sla: 'Priority SLA (2hr emergency)',
      price: 1999,
      description: '3 wet services + unlimited breakdown visits + refrigerant top-up discount.'
    }
  ];

  const handleBookService = (title: string, price: number) => {
    addNotification('Service Order Placed', `Order for "${title}" (₹${price.toLocaleString('en-IN')}) placed with verified vendor.`, 'SYSTEM');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f] flex items-center gap-2">
              <Globe className="h-6 w-6 text-[#274235]" />
              <span>Marketplace & Staywise Remote Care (NRI)</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              NRI & Services
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Dedicated remote management for non-resident property owners & curated on-demand property services
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-[#e3e1d8] text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('NRI')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'NRI' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            NRI Remote Care
          </button>
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'MARKETPLACE' ? 'bg-[#274235] text-white' : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            Services Catalog
          </button>
        </div>
      </div>

      {/* TAB 1: NRI Remote Care */}
      {activeTab === 'NRI' && (
        <div className="space-y-6">
          {/* NRI Dashboard Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="organic-card p-4">
              <span className="text-[11px] font-semibold text-[#6e7972]">India Assets</span>
              <div className="text-xl font-black text-[#19251f] mt-1 font-tabular">7 Units</div>
            </div>
            <div className="organic-card p-4">
              <span className="text-[11px] font-semibold text-[#6e7972]">Occupied Units</span>
              <div className="text-xl font-black text-emerald-700 mt-1 font-tabular">6 Occupied</div>
            </div>
            <div className="organic-card p-4">
              <span className="text-[11px] font-semibold text-[#6e7972]">Vacant</span>
              <div className="text-xl font-black text-amber-700 mt-1 font-tabular">1 Vacant</div>
            </div>
            <div className="organic-card p-4">
              <span className="text-[11px] font-semibold text-[#6e7972]">Monthly Inflow</span>
              <div className="text-xl font-black text-[#19251f] mt-1 font-tabular">₹2.80L</div>
            </div>
            <div className="organic-card p-4">
              <span className="text-[11px] font-semibold text-[#6e7972]">Taxes & Sinking</span>
              <div className="text-xl font-black text-[#6e7972] mt-1 font-tabular">₹34K</div>
            </div>
            <div className="organic-card p-4 border-emerald-300 bg-emerald-50/40">
              <span className="text-[11px] text-emerald-800 font-bold">Net NRE Yield</span>
              <div className="text-xl font-black text-emerald-800 mt-1 font-tabular">₹2.46L</div>
            </div>
          </div>

          {/* Remote Care Operational Feeds */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="organic-card p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-[#19251f]">Remote Audits & Field Inspections</h3>
              <p className="text-[11px] text-[#6e7972]">Physical field inspection reports verified by Staywise inspectors</p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#19251f]">Beach Road Apartments (Unit 302 & 304)</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Audited 28 Sep
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6e7972]">
                    Waterproofing, balcony drainage, and AC units audited. 24 high-resolution geotagged photos uploaded to vault.
                  </p>
                  <div className="text-[11px] text-[#274235] font-bold cursor-pointer hover:underline">
                    View 24 Geotagged Photos & 4K Video Tour →
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#19251f]">Serene Mist Estate Villa (Wayanad)</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Audited 25 Sep
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6e7972]">
                    Solar generation check (100% efficiency), infinity pool filtration audited, generator fuel topped up.
                  </p>
                </div>
              </div>
            </div>

            <div className="organic-card p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-[#19251f]">Direct NRE / NRO Repatriation Rails</h3>
              <p className="text-[11px] text-[#6e7972]">Automated tax clearance (Form 15CA/15CB) and escrow disbursements</p>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Linked Repatriation Account:</span>
                  <span className="font-bold text-[#19251f]">HDFC Bank NRE •••• 9104</span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>TDS Compliance (Section 195):</span>
                  <span className="font-bold text-emerald-700">Pre-Computed & Deducted</span>
                </div>
                <div className="flex justify-between items-center text-[#6e7972]">
                  <span>Next Automated Remittance:</span>
                  <span className="font-bold text-[#274235] font-tabular">07 October 2026</span>
                </div>
                <div className="pt-2 border-t border-[#eeece5] flex justify-between items-center">
                  <span className="text-[#6e7972]">Est. Net Disbursement:</span>
                  <span className="text-lg font-black text-emerald-700 font-tabular">₹2,46,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Services Marketplace */}
      {activeTab === 'MARKETPLACE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(srv => (
            <div
              key={srv.id}
              className="organic-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f4f3ef] text-[#274235] font-bold uppercase tracking-wider border border-[#e3e1d8]">
                    {srv.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{srv.rating}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-[#19251f] text-base">{srv.title}</h3>
                <p className="text-xs text-[#6e7972] leading-relaxed">{srv.description}</p>
                <div className="text-[11px] text-[#274235] font-semibold">Provider: {srv.provider} • SLA: {srv.sla}</div>
              </div>

              <div className="pt-3 border-t border-[#eeece5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6e7972]">Fixed Rate</span>
                  <div className="text-lg font-black text-[#19251f] font-tabular">
                    ₹{srv.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleBookService(srv.title, srv.price)}
                  className="px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
