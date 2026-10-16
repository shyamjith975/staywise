'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Building, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export default function PayRentModal() {
  const { 
    isPayRentOpen, 
    setIsPayRentOpen, 
    selectedInvoiceForPay, 
    payInvoice,
    setSelectedReceiptInvoice 
  } = useAppState();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Card' | 'Autopay' | 'FlexPay'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPayRentOpen || !selectedInvoiceForPay) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payInvoice(selectedInvoiceForPay.id, paymentMethod);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleDone = () => {
    setIsSuccess(false);
    setIsPayRentOpen(false);
    setSelectedReceiptInvoice(selectedInvoiceForPay);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-lg bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-[#ffffff]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#E8F0EC] text-[#263238] flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#263238]">RentFlow Instant Checkout</h2>
              <p className="text-[11px] text-[#666666]">Escrow Direct Settlement • RBI Compliant</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsPayRentOpen(false); setIsSuccess(false); }} 
            className="text-[#666666] hover:text-[#263238] p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {!isSuccess ? (
            <div className="space-y-4 text-xs">
              {/* Invoice Breakdown */}
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2">
                <div className="flex justify-between items-center text-[#666666]">
                  <span>Unit & Property:</span>
                  <span className="font-bold text-[#263238]">
                    Unit {selectedInvoiceForPay.unitNumber}, {selectedInvoiceForPay.propertyName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#666666]">
                  <span>Billing Period:</span>
                  <span className="font-bold text-[#263238]">{selectedInvoiceForPay.period}</span>
                </div>
                <div className="flex justify-between items-center text-[#666666]">
                  <span>Base Rent:</span>
                  <span className="font-bold text-[#263238]">₹{selectedInvoiceForPay.baseRent.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoiceForPay.camCharges && (
                  <div className="flex justify-between items-center text-[#666666]">
                    <span>CAM & Maintenance:</span>
                    <span className="font-bold text-[#263238]">₹{selectedInvoiceForPay.camCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedInvoiceForPay.utilityCharges && (
                  <div className="flex justify-between items-center text-[#666666]">
                    <span>Utility Charges:</span>
                    <span className="font-bold text-[#263238]">₹{selectedInvoiceForPay.utilityCharges.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedInvoiceForPay.lateFee && (
                  <div className="flex justify-between items-center text-rose-700">
                    <span>Late Penalty:</span>
                    <span className="font-bold">₹{selectedInvoiceForPay.lateFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E0E0E0] flex justify-between items-center text-sm font-bold text-[#263238]">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 font-tabular font-black text-base">
                    ₹{selectedInvoiceForPay.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-[#263238] font-semibold">Select Settlement Rail</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'UPI' 
                        ? 'bg-[#E8F0EC] border-[#263238] text-[#263238] font-extrabold' 
                        : 'bg-[#E8F0EC] border-[#D2DDD7] text-[#666666] hover:bg-white'
                    }`}
                  >
                    <QrCode className="h-5 w-5" />
                    <span className="text-[11px]">Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Autopay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'Autopay' 
                        ? 'bg-[#E8F0EC] border-[#263238] text-[#263238] font-extrabold' 
                        : 'bg-[#E8F0EC] border-[#D2DDD7] text-[#666666] hover:bg-white'
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                    <span className="text-[11px]">Bank Autopay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('FlexPay')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'FlexPay' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold' 
                        : 'bg-[#E8F0EC] border-[#D2DDD7] text-[#666666] hover:bg-white'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[11px]">FlexPay Finance</span>
                  </button>
                </div>
              </div>

              {/* QR / FlexPay details */}
              {paymentMethod === 'UPI' && (
                <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#263238]">VPA: staywise.escrow@axisbank</span>
                    <p className="text-[10px] text-[#666666]">Zero surcharge via GPay, PhonePe, Paytm, or BHIM</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    UPI Auto-Detect
                  </span>
                </div>
              )}

              {paymentMethod === 'FlexPay' && (
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] leading-relaxed">
                  <b>Partner-Powered FlexPay:</b> Pay ₹{(selectedInvoiceForPay.totalAmount / 3).toFixed(0)} today. Remaining 2 installments debited on subsequent salary dates via regulated partner.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full py-3.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold text-xs shadow-xl shadow-[#263238]/20 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Securing Settlement on Ledger...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authorize ₹{selectedInvoiceForPay.totalAmount.toLocaleString('en-IN')} Payment</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="h-9 w-9" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#263238]">Payment Cleared & Settled!</h3>
                <p className="text-xs text-[#666666] max-w-xs mx-auto mt-1 leading-relaxed">
                  ₹{selectedInvoiceForPay.totalAmount.toLocaleString('en-IN')} has been cleared into landlord escrow. Immutable ledger entry generated.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleDone}
                  className="px-5 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold text-xs shadow-md shadow-[#263238]/20 transition flex items-center gap-2"
                >
                  <span>View Official Rent Receipt</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
