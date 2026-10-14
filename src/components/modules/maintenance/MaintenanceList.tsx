'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { MaintenanceTicket } from '../../../types';
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Plus, 
  ShieldCheck, 
  Calendar, 
  User,
  ArrowRight,
  X
} from 'lucide-react';

export default function MaintenanceList() {
  const { tickets, properties, approveTicket, setIsCreateTicketOpen, activeRole, currentUser } = useAppState();
  const [selectedTicketForPhotos, setSelectedTicketForPhotos] = useState<MaintenanceTicket | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'APPROVAL' | 'COMPLETED'>('ALL');

  // Role-scoped tickets: Owners see tickets for their properties, tenants see their own requests
  const roleFilteredTickets = (activeRole === 'owner' && currentUser.id && currentUser.id !== 'user-owner-vikram')
    ? tickets.filter(t => {
        const ownerProps = properties.filter(p => p.ownerId === currentUser.id);
        const ownerPropIds = ownerProps.map(p => p.id);
        const ownerPropNames = ownerProps.map(p => p.name.toLowerCase());
        return ownerPropIds.includes(t.propertyId) || (t.propertyName && ownerPropNames.includes(t.propertyName.toLowerCase()));
      })
    : (activeRole === 'tenant' && currentUser.name)
    ? tickets.filter(t => t.tenantName?.toLowerCase().includes(currentUser.name.toLowerCase()) || (currentUser.email && t.tenantName?.toLowerCase().includes(currentUser.email.split('@')[0])))
    : tickets;

  const filteredTickets = roleFilteredTickets.filter(t => {
    if (filter === 'OPEN') return t.status !== 'Completed' && t.status !== 'Closed';
    if (filter === 'APPROVAL') return t.requiresOwnerApproval && !t.ownerApproved;
    if (filter === 'COMPLETED') return t.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#B5B5B5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2a2a2a]">
              {activeRole === 'tenant' ? 'My Maintenance Requests' : 'Maintenance Triage & Work Orders'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#2a2a2a] font-bold border border-[#2a2a2a]/20">
              {roleFilteredTickets.length} Tickets Logged
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            {activeRole === 'tenant' 
              ? 'Track real-time progress and photos for your apartment service requests'
              : 'Smart Approval Routing (< ₹2,000 Auto / > ₹2,000 Owner Approval) + Before/After Proof'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#2a2a2a] hover:bg-[#2a2a2a] text-white font-bold text-xs shadow-md shadow-[#2a2a2a]/20 transition flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Threshold Rule Banner (Owner/Admin only) or Status Banner for Tenant */}
      {activeRole !== 'tenant' ? (
        <div className="organic-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#2a2a2a] shrink-0" />
            <div className="text-[#666666]">
              <b className="text-[#2a2a2a]">Operating Wallet Threshold Rule:</b> Quotes under ₹2,000 auto-assign to certified vendors. Quotes above ₹2,000 require 1-click owner approval.
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['ALL', 'OPEN', 'APPROVAL', 'COMPLETED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === f ? 'bg-[#2a2a2a] text-white shadow-sm' : 'bg-[#f0f0f0] text-[#666666] hover:text-[#2a2a2a]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {(['ALL', 'OPEN', 'COMPLETED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === f ? 'bg-[#2a2a2a] text-white shadow-sm' : 'bg-white border border-[#B5B5B5] text-[#666666] hover:text-[#2a2a2a]'
              }`}
            >
              {f === 'ALL' ? 'All My Tickets' : f}
            </button>
          ))}
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map(t => {
          const needsApproval = t.requiresOwnerApproval && !t.ownerApproved;
          return (
            <div
              key={t.id}
              className={`organic-card p-5 space-y-3 ${
                needsApproval ? 'border-amber-300 bg-[#ffffff]' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-[#666666] font-semibold">{t.ticketNumber}</span>
                    <h3 className="font-extrabold text-[#2a2a2a] text-sm sm:text-base">{t.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f0f0] text-[#666666] font-semibold border border-[#B5B5B5]">
                      {t.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#666666] mt-1">
                    {t.propertyName} (Unit {t.unitNumber}) • Reported on {t.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    t.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-[#f0f0f0] text-[#2a2a2a] border-[#2a2a2a]/20'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#2a2a2a] leading-relaxed bg-[#f0f0f0] p-3 rounded-2xl border border-[#B5B5B5]">
                {t.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#E0E0E0]">
                <div className="flex items-center gap-4 text-[#666666]">
                  {activeRole !== 'tenant' && (
                    <span>Estimated Quote: <b className="text-[#2a2a2a] font-tabular font-bold">₹{t.estimatedCost.toLocaleString('en-IN')}</b></span>
                  )}
                  {t.vendorName && (
                    <span>Assigned Partner: <b className="text-[#2a2a2a] font-bold">{t.vendorName}</b></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Before/After Photo Viewer trigger */}
                  {(t.beforePhotoUrl || t.status === 'Completed') && (
                    <button
                      onClick={() => setSelectedTicketForPhotos(t)}
                      className="px-3 py-1.5 rounded-xl bg-[#f0f0f0] hover:bg-[#2a2a2a] hover:text-white text-[#2a2a2a] font-bold text-[11px] flex items-center gap-1.5 border border-[#B5B5B5] transition"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Before / After Photos</span>
                    </button>
                  )}

                  {/* 1-Click Owner Approval */}
                  {needsApproval && activeRole !== 'tenant' && (
                    <button
                      onClick={() => approveTicket(t.id)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>1-Click Owner Approval (₹{t.estimatedCost.toLocaleString('en-IN')})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Before / After Photo Comparison Modal */}
      {selectedTicketForPhotos && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-[#B5B5B5] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
              <div>
                <h3 className="text-base font-extrabold text-[#2a2a2a]">Before & After Repair Proof</h3>
                <p className="text-[11px] text-[#666666]">
                  {selectedTicketForPhotos.ticketNumber} — {selectedTicketForPhotos.title}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTicketForPhotos(null)}
                className="text-[#666666] hover:text-[#2a2a2a]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-rose-700">Before Repair (Damage Photo)</span>
                <div className="h-48 w-full rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"
                    alt="Before repair"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/70 text-white">
                    Timestamp: 2026-09-27 10:14 AM
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-700">After Repair (Certified Restoration)</span>
                <div className="h-48 w-full rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600"
                    alt="After repair"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/70 text-white">
                    Timestamp: 2026-09-28 04:30 PM
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f0f0f0] border border-[#B5B5B5] text-xs flex justify-between items-center text-[#666666]">
              <span>Assigned Vendor: RapidCool Aircon (Certified)</span>
              <span className="font-bold text-[#2a2a2a]">Escrow Settled: ₹1,150</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
