'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Zap, IndianRupee, X, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';

export default function LiveActivityTicker() {
  const { setSelectedReceiptInvoice, invoices, activeRole } = useAppState();

  const [bottomToastIndex, setBottomToastIndex] = useState(0);
  const [showBottomToast, setShowBottomToast] = useState(true);

  const bottomSettlements = [
    { name: 'Rohan Sharma', amount: 12500, unit: 'Room 4A (Beach Road)', rail: 'UPI Instant' },
    { name: 'Ananya Pillai', amount: 27500, unit: 'Unit 102 (Beach Road)', rail: 'Bank Autopay' },
    { name: 'Dr. Faisal Ahmed', amount: 38000, unit: 'Unit 201 (Sea View)', rail: 'Axis Escrow' }
  ];

  useEffect(() => {
    const bottomTimer = setInterval(() => {
      setBottomToastIndex(prev => (prev + 1) % bottomSettlements.length);
    }, 7500);

    return () => {
      clearInterval(bottomTimer);
    };
  }, [bottomSettlements.length]);

  const currentBottom = bottomSettlements[bottomToastIndex];

  return (
    <>

      {/* Compact Side-Docked Live Escrow Money Banner (Non-blocking, short on mobile, working close button) */}
      {showBottomToast && activeRole !== 'tenant' && (
        <div className="fixed bottom-20 sm:bottom-24 lg:bottom-6 left-3 sm:left-auto sm:right-6 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 py-1.5 px-2.5 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#0b1722]/95 border border-teal-500/40 shadow-2xl backdrop-blur-md max-w-[220px] sm:max-w-sm">
            {/* Rupee icon */}
            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0 shadow-inner">
              <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
            </div>

            {/* Inflow Details */}
            <div className="text-left overflow-hidden min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-teal-400 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span>Just Collected</span>
              </div>
              <div className="text-xs sm:text-sm font-black text-white font-tabular truncate">
                ₹{currentBottom.amount.toLocaleString('en-IN')} 
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline"> from {currentBottom.name.split(' ')[0]}</span>
              </div>
            </div>

            {/* Dedicated High-Affordance Close Button (44px touch target area, reliable dismiss) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowBottomToast(false);
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center shrink-0 transition"
              aria-label="Close banner"
              title="Close banner"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
