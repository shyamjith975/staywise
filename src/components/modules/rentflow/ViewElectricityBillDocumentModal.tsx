'use client';

import React from 'react';
import { 
  Zap, 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  User, 
  Calendar,
  Share2,
  FileText,
  IndianRupee
} from 'lucide-react';
import { ElectricityBill } from '../../../types';

interface ViewElectricityBillDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: ElectricityBill | null;
  onPayUPI?: (bill: ElectricityBill) => void;
  isTenant?: boolean;
}

export default function ViewElectricityBillDocumentModal({
  isOpen,
  onClose,
  bill,
  onPayUPI,
  isTenant = false
}: ViewElectricityBillDocumentModalProps) {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert(`Downloading official statement: ${bill.attachmentName || `Electricity_Bill_Unit_${bill.unitNumber}.pdf`}`);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl p-5 sm:p-8 space-y-6 my-auto font-sans max-h-[90vh] overflow-y-auto">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eeece5]">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Official Discom Sub-meter Verified</span>
            </span>
            <span className="text-xs text-[#6e7972]">
              {bill.attachmentName || 'BESCOM_Official_Bill.pdf'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef] transition"
              title="Print Bill"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-[#274235]" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Official Bill Document Preview Body */}
        <div className="border-2 border-[#19251f] rounded-2xl p-6 space-y-6 bg-[#fffdfa] shadow-inner relative overflow-hidden">
          {/* Subtle Watermark Stamp */}
          <div className="absolute right-6 top-20 opacity-10 pointer-events-none select-none rotate-12">
            <div className="border-4 border-[#274235] text-[#274235] font-black text-3xl px-6 py-2 rounded-2xl uppercase tracking-widest text-center">
              STAYWISE VERIFIED
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#19251f]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                  ⚡
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-[#19251f]">
                  {bill.discom}
                </h3>
              </div>
              <p className="text-[11px] text-[#6e7972]">
                Electricity Supply &amp; Sub-meter Power Allocation Statement
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-xs font-mono font-bold text-[#19251f]">
                BILL ID: {bill.id.toUpperCase()}
              </div>
              <div className="text-[11px] text-[#6e7972]">
                Billing Period: <b className="text-[#19251f]">{bill.billingMonth}</b>
              </div>
              <div className="text-[11px] text-[#6e7972]">
                Due Date: <b className="text-rose-600">{bill.dueDate}</b>
              </div>
            </div>
          </div>

          {/* Consumer & Property Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-xs">
            <div className="space-y-1.5">
              <div className="text-[#6e7972] font-semibold">CONSUMER DETAILS:</div>
              <div className="font-extrabold text-[#19251f] text-sm">{bill.tenantName}</div>
              <div className="text-[#6e7972]">Unit {bill.unitNumber}, {bill.propertyName}</div>
              <div className="text-[#6e7972]">Tariff Class: <b className="text-[#19251f]">LT-2A Domestic Residential</b></div>
            </div>

            <div className="space-y-1.5 sm:text-right">
              <div className="text-[#6e7972] font-semibold">METER TECHNICAL SPECS:</div>
              <div className="font-mono font-extrabold text-[#19251f] text-sm">{bill.meterNumber}</div>
              <div className="text-[#6e7972]">Status: <span className="font-bold text-emerald-700">Digital Smart Sub-Meter</span></div>
              <div className="text-[#6e7972]">Phase: <b>Single Phase 230V • 50Hz</b></div>
            </div>
          </div>

          {/* Meter Readings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#eeece5]">
              <thead className="bg-[#eeece5] text-[#19251f] font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Previous Reading (kWh)</th>
                  <th className="py-2.5 px-3">Current Reading (kWh)</th>
                  <th className="py-2.5 px-3">Units Consumed (kWh)</th>
                  <th className="py-2.5 px-3 text-right">Tariff Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece5] bg-white font-tabular">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#19251f]">{bill.previousReading}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#19251f]">{bill.currentReading}</td>
                  <td className="py-2.5 px-3 font-mono font-black text-amber-600 text-sm">
                    {bill.unitsConsumed} Units
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#19251f]">
                    ₹{bill.ratePerUnit.toFixed(2)} / unit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Charges Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#eeece5]">
              <span className="text-[#6e7972]">Energy Consumption Charges ({bill.unitsConsumed} × ₹{bill.ratePerUnit}):</span>
              <span className="font-mono font-bold text-[#19251f]">₹{(bill.unitsConsumed * bill.ratePerUnit).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeece5]">
              <span className="text-[#6e7972]">Fixed Meter &amp; Standing Charges:</span>
              <span className="font-mono font-bold text-[#19251f]">₹{bill.fixedCharges.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#eeece5]">
              <span className="text-[#6e7972]">Escrow Surcharge &amp; Common Area Factor:</span>
              <span className="font-mono font-bold text-emerald-700">₹0.00 (Included)</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t-2 border-[#19251f]">
              <div>
                <span className="text-base font-black text-[#19251f] block">Total Amount Payable</span>
                <span className="text-[11px] text-[#6e7972]">Due by {bill.dueDate}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#274235] font-tabular">
                  ₹{bill.totalAmount.toLocaleString('en-IN')}
                </span>
                <div className="text-[10px] font-bold">
                  {bill.status === 'Paid' ? (
                    <span className="text-emerald-700">✓ Settled on {bill.paidDate || 'UPI'}</span>
                  ) : (
                    <span className="text-rose-600">● Payment Due</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Split Note if present */}
          {bill.notes && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Zap className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold">Landlord / Manager Note: </span>
                <span>{bill.notes}</span>
              </div>
            </div>
          )}

          {/* Digital Verification Footer */}
          <div className="pt-3 border-t border-[#eeece5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6e7972]">
            <span>Digitally uploaded &amp; validated via Staywise Asset OS</span>
            <span className="font-mono font-bold text-[#274235]">UPI: staywise.escrow@axisbank</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-[#f4f3ef] hover:bg-[#e6e4dc] text-[#19251f] text-xs font-bold transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {bill.status === 'Due' && onPayUPI && (
              <button
                onClick={() => onPayUPI(bill)}
                className="px-5 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                <span>Pay ₹{bill.totalAmount.toLocaleString('en-IN')} via Instant UPI</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
