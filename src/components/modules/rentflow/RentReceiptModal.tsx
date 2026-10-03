'use client';

import React from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  X, 
  Download, 
  Printer, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode 
} from 'lucide-react';

export default function RentReceiptModal() {
  const { selectedReceiptInvoice, setSelectedReceiptInvoice } = useAppState();

  if (!selectedReceiptInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setSelectedReceiptInvoice(null); }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#eeece5] bg-[#fbfbfa] print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#274235]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Official Staywise Rent Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] text-[#19251f] text-xs font-bold flex items-center gap-1.5 border border-[#e3e1d8] transition shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedReceiptInvoice(null)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#6e7972] hover:text-[#19251f] hover:bg-[#f4f3ef] transition"
              aria-label="Close receipt"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 overflow-y-auto bg-white text-[#19251f] space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-[#eeece5]">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#274235] flex items-center justify-center text-white font-black text-xs">
                  SW
                </div>
                <span className="font-black text-lg tracking-tight text-[#19251f]">STAYWISE</span>
              </div>
              <p className="text-[11px] text-[#6e7972] mt-1">
                Staywise Technologies Pvt. Ltd. • Escrow Trustee
              </p>
              <p className="text-[10px] text-[#95a099]">CIN: U72900KL2024PTC081234 • GSTIN: 32AABCU9812K1Z9</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Payment Settled
              </span>
              <div className="text-xs font-mono font-bold text-[#19251f] mt-2">
                Receipt #{selectedReceiptInvoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-[#6e7972]">
                Date: {selectedReceiptInvoice.paidDate || '2026-10-01'}
              </div>
            </div>
          </div>

          {/* Tenancy & Property Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7972] font-bold">
                Received From (Tenant)
              </span>
              <div className="font-extrabold text-[#19251f] text-sm">{selectedReceiptInvoice.tenantName}</div>
              <div className="text-[#6e7972]">Resident ID: {selectedReceiptInvoice.tenantId}</div>
              <div className="text-[#274235] font-semibold">Digital KYC: Aadhaar Verified ✓</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6e7972] font-bold">
                Property & Unit
              </span>
              <div className="font-extrabold text-[#19251f] text-sm">{selectedReceiptInvoice.propertyName}</div>
              <div className="text-[#6e7972]">Unit: Apartment {selectedReceiptInvoice.unitNumber}</div>
              <div className="text-[#6e7972]">Rental Period: {selectedReceiptInvoice.period}</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-[#e3e1d8] rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#f7f6f2] text-[#6e7972] text-[11px] font-bold uppercase tracking-wider border-b border-[#e3e1d8]">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece5]">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-[#19251f]">Monthly Base Rent ({selectedReceiptInvoice.period})</td>
                  <td className="py-2.5 px-4 text-right font-tabular font-bold">₹{selectedInvoiceOrFallback(selectedReceiptInvoice.baseRent)}</td>
                </tr>
                {selectedReceiptInvoice.camCharges && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#19251f]">Common Area Maintenance (CAM) & Facilities</td>
                    <td className="py-2.5 px-4 text-right font-tabular">₹{selectedReceiptInvoice.camCharges.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                {selectedReceiptInvoice.utilityCharges && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#19251f]">Electricity & Water Pro-Rata Share</td>
                    <td className="py-2.5 px-4 text-right font-tabular">₹{selectedReceiptInvoice.utilityCharges.toLocaleString('en-IN')}</td>
                  </tr>
                )}
                <tr className="bg-[#f7f6f2] font-extrabold text-[#19251f]">
                  <td className="py-3 px-4 text-sm">Total Cleared Payment</td>
                  <td className="py-3 px-4 text-right text-sm text-emerald-700 font-tabular font-black">
                    ₹{selectedReceiptInvoice.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Metadata & Verification Seal */}
          <div className="flex items-center justify-between pt-4 border-t border-[#eeece5] text-[11px] text-[#6e7972]">
            <div className="space-y-1">
              <div><b className="text-[#19251f]">Transaction ID:</b> {selectedReceiptInvoice.transactionId || 'UPI-774920198421'}</div>
              <div><b className="text-[#19251f]">Payment Rail:</b> {selectedReceiptInvoice.paymentMethod || 'UPI / Escrow Direct'}</div>
              <div><b className="text-[#19251f]">Status:</b> Cleared to Axis Nodal Settlement Account</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-[#274235]">Digital Seal</div>
                <div className="text-[10px] text-[#95a099]">Cryptographically Signed</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-center">
                <QrCode className="h-7 w-7 text-[#19251f]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function selectedInvoiceOrFallback(amt: number | undefined): string {
  if (!amt) return '0';
  return amt.toLocaleString('en-IN');
}
