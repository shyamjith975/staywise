'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Zap, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  Send, 
  IndianRupee, 
  Building2, 
  User, 
  Calendar,
  AlertCircle,
  Paperclip,
  Check
} from 'lucide-react';
import { ElectricityBill } from '../../../types';

interface UploadElectricityBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedUnit?: string | null;
}

export default function UploadElectricityBillModal({
  isOpen,
  onClose,
  preselectedUnit
}: UploadElectricityBillModalProps) {
  const { 
    currentUser,
    properties, 
    tenants, 
    addElectricityBill, 
    addNotification 
  } = useAppState();

  const isDemoAccount = currentUser?.email === 'vikram@staywise.in' || currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram';

  const userTenants = tenants.filter(t => t.status === 'Active' || !t.status);
  const dynamicUnitOptions = userTenants.map(t => {
    const prop = properties.find(p => p.id === t.propertyId);
    return {
      unit: t.unitNumber || '101',
      tenant: t.name,
      property: prop?.name || 'Property',
      propertyId: t.propertyId,
      meter: `MTR-${t.unitNumber || '101'}`,
      prevReading: 0
    };
  });

  const DEMO_UNIT_OPTIONS = [
    { unit: '302', tenant: 'Shyam Sundar', property: 'Beach Road Luxury Apartments', propertyId: 'prop-beach-road', meter: 'MTR-BLR-8921-A', prevReading: 1630 },
    { unit: '201', tenant: 'Dr. Faisal Ahmed', property: 'Beach Road Luxury Apartments', propertyId: 'prop-beach-road', meter: 'MTR-BLR-8921-B', prevReading: 2440 },
    { unit: '101', tenant: 'Rahul Menon', property: 'Beach Road Luxury Apartments', propertyId: 'prop-beach-road', meter: 'MTR-BLR-8921-C', prevReading: 1110 },
    { unit: '102', tenant: 'Ananya Pillai', property: 'Beach Road Luxury Apartments', propertyId: 'prop-beach-road', meter: 'MTR-BLR-8921-D', prevReading: 890 }
  ];

  const unitOptions = dynamicUnitOptions.length > 0 ? dynamicUnitOptions : (isDemoAccount ? DEMO_UNIT_OPTIONS : []);

  const [selectedUnit, setSelectedUnit] = useState<string>(preselectedUnit || (unitOptions[0]?.unit || ''));
  const [discom, setDiscom] = useState('BESCOM Bangalore');
  const [billingMonth, setBillingMonth] = useState('October 2026');
  const [previousReading, setPreviousReading] = useState<number>(isDemoAccount ? 1630 : 0);
  const [currentReading, setCurrentReading] = useState<number>(isDemoAccount ? 1865 : 0);
  const [ratePerUnit, setRatePerUnit] = useState<number>(8.5);
  const [fixedCharges, setFixedCharges] = useState<number>(150);
  const [dueDate, setDueDate] = useState('20 Oct 2026');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(isDemoAccount ? {
    name: 'BESCOM_Official_Bill_Oct2026.pdf',
    size: '482 KB'
  } : null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync when preselected unit changes
  useEffect(() => {
    if (preselectedUnit) {
      setSelectedUnit(preselectedUnit);
      const match = unitOptions.find(u => u.unit === preselectedUnit);
      if (match) {
        setPreviousReading(match.prevReading);
        setCurrentReading(match.prevReading > 0 ? match.prevReading + 215 : 0);
      }
    } else if (unitOptions.length > 0 && !selectedUnit) {
      setSelectedUnit(unitOptions[0].unit);
    }
  }, [preselectedUnit, unitOptions]);

  // When selected unit changes from dropdown
  const handleUnitChange = (unitNum: string) => {
    setSelectedUnit(unitNum);
    const match = unitOptions.find(u => u.unit === unitNum);
    if (match) {
      setPreviousReading(match.prevReading);
      setCurrentReading(match.prevReading > 0 ? match.prevReading + 220 : 0);
    }
  };

  const selectedTenantInfo = unitOptions.find(u => u.unit === selectedUnit) || unitOptions[0] || {
    unit: '101',
    tenant: 'Tenant',
    property: 'Property',
    propertyId: '',
    meter: 'MTR-101',
    prevReading: 0
  };

  const unitsConsumed = Math.max(0, currentReading - previousReading);
  const totalAmount = Math.round(unitsConsumed * ratePerUnit + fixedCharges);

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    }
  };

  const handleSubmit = (sendWhatsApp: boolean) => {
    const newBill: ElectricityBill = {
      id: `eb-${Date.now()}`,
      propertyId: selectedTenantInfo.propertyId,
      propertyName: selectedTenantInfo.property,
      unitNumber: selectedTenantInfo.unit,
      tenantName: selectedTenantInfo.tenant,
      meterNumber: selectedTenantInfo.meter,
      billingMonth,
      previousReading,
      currentReading,
      unitsConsumed,
      ratePerUnit,
      fixedCharges,
      totalAmount,
      dueDate,
      status: 'Due',
      discom,
      attachmentName: uploadedFile?.name || `Electricity_Bill_Unit_${selectedTenantInfo.unit}.pdf`,
      fileSize: uploadedFile?.size || '420 KB',
      billDocumentUrl: '#',
      uploadedAt: 'Today',
      notes
    };

    addElectricityBill(newBill);

    if (sendWhatsApp) {
      const shareText = `*Staywise Official Electricity Bill Uploaded*\nTenant: ${selectedTenantInfo.tenant}\nUnit: ${selectedTenantInfo.unit} (${selectedTenantInfo.property})\nMonth: ${billingMonth}\nMeter Number: ${selectedTenantInfo.meter} (${discom})\nConsumption: ${unitsConsumed} units (${previousReading} -> ${currentReading} kWh @ ₹${ratePerUnit}/unit)\nFixed Meter Charges: ₹${fixedCharges}\n*Total Payable: ₹${totalAmount.toLocaleString('en-IN')}*\nDue Date: ${dueDate}\nAttached Bill: ${uploadedFile?.name || 'Bill.pdf'}\n\nPay securely via UPI: staywise.escrow@axisbank\nView full bill & breakdown in your tenant portal: https://staywise.app/tenant`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      addNotification('WhatsApp Bill Dispatched', `Electricity bill & UPI payment link sent to ${selectedTenantInfo.tenant} on WhatsApp.`, 'RENT');
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-[#D2DDD7] rounded-3xl shadow-2xl p-5 sm:p-6 space-y-5 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#263238]">
                Upload Electricity Bill for Tenant
              </h2>
              <p className="text-xs text-[#666666]">
                Target specific tenant unit, attach official Discom PDF/image, and compute split
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-[#666666] hover:text-[#263238] hover:bg-[#E8F0EC] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Select Specific Tenant / Unit */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#263238] uppercase tracking-wider">
            1. Select Specific Tenant &amp; Unit
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={selectedUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-[#ffffff] text-xs font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
            >
              {unitOptions.map((opt) => (
                <option key={opt.unit} value={opt.unit}>
                  Unit {opt.unit} — {opt.tenant}
                </option>
              ))}
            </select>

            <div className="px-3.5 py-2.5 rounded-xl bg-[#E8F0EC] border border-[#263238]/20 flex items-center justify-between text-xs">
              <span className="text-[#666666]">Meter Serial:</span>
              <span className="font-mono font-bold text-[#263238]">{selectedTenantInfo.meter}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#666666] flex items-center gap-1.5 px-1">
            <Building2 className="h-3 w-3 text-[#263238]" />
            <span>Property: <b>{selectedTenantInfo.property}</b></span>
            <span>•</span>
            <User className="h-3 w-3 text-[#263238]" />
            <span>Assigned Tenant: <b>{selectedTenantInfo.tenant}</b></span>
          </div>
        </div>

        {/* Step 2: Upload Bill Document (PDF / Image) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#263238] uppercase tracking-wider">
            2. Attach Official Discom Bill Document (PDF / Image)
          </label>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                setUploadedFile({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` });
              }
            }}
            className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition ${
              isDragging ? 'border-[#263238] bg-[#E8F0EC]/50' : 'border-[#D2DDD7] bg-[#ffffff] hover:bg-white'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleSimulateFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            
            {uploadedFile ? (
              <div className="flex items-center justify-between bg-white border border-[#D2DDD7] rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-extrabold text-[#263238] truncate max-w-[200px] sm:max-w-xs">
                      {uploadedFile.name}
                    </div>
                    <div className="text-[10px] text-[#666666]">{uploadedFile.size} • Verified &amp; Attached</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Check className="h-3.5 w-3.5" />
                  <span>Attached</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
                <UploadCloud className="h-8 w-8 text-[#263238]" />
                <div className="text-xs font-bold text-[#263238]">
                  Drop Discom bill PDF or image here, or <span className="text-[#263238] underline">browse</span>
                </div>
                <div className="text-[10px] text-[#666666]">Supports PDF, PNG, JPG (Max 10 MB)</div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Meter Readings & Computation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#263238] uppercase tracking-wider">
            3. Readings &amp; Consumption Breakdown
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-[#666666] font-semibold mb-1">Discom Provider</label>
              <select
                value={discom}
                onChange={(e) => setDiscom(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
              >
                <option value="BESCOM Bangalore">BESCOM</option>
                <option value="KSEB Kerala">KSEB Kerala</option>
                <option value="TANGEDCO Chennai">TANGEDCO</option>
                <option value="BSES Delhi">BSES Delhi</option>
                <option value="MSEDCL Mumbai">MSEDCL</option>
              </select>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Billing Month</label>
              <input
                type="text"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Prev Reading (kWh)</label>
              <input
                type="number"
                value={previousReading}
                onChange={(e) => setPreviousReading(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Current Reading (kWh)</label>
              <input
                type="number"
                value={currentReading}
                onChange={(e) => setCurrentReading(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
            <div>
              <label className="block text-[#666666] font-semibold mb-1">Rate / Unit (₹)</label>
              <input
                type="number"
                step="0.1"
                value={ratePerUnit}
                onChange={(e) => setRatePerUnit(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Fixed Charges (₹)</label>
              <input
                type="number"
                value={fixedCharges}
                onChange={(e) => setFixedCharges(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
              />
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238]"
              />
            </div>
          </div>

          {/* Computed Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#666666] block">Net Sub-meter Units:</span>
              <span className="font-extrabold text-[#263238] text-sm font-tabular">
                {unitsConsumed} kWh
              </span>
              <span className="text-[11px] text-[#666666]"> ({unitsConsumed} × ₹{ratePerUnit} + ₹{fixedCharges})</span>
            </div>

            <div className="text-right">
              <span className="text-[#666666] block text-[11px]">Total Tenant Due:</span>
              <span className="text-xl font-black text-[#263238] font-tabular">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-[#666666] text-[11px] font-semibold mb-1">Split Note / Remark (Visible to Tenant)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sub-meter kWh reading verified with caretaker"
              className="w-full px-3 py-1.5 rounded-xl border border-[#D2DDD7] bg-white text-xs text-[#263238]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-[#E0E0E0]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#E8F0EC] hover:bg-[#D2DDD7] text-[#263238] text-xs font-bold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <FileText className="h-4 w-4 text-[#263238]" />
            <span>Save to Tenant Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold shadow-md shadow-[#263238]/20 flex items-center justify-center gap-2 transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Upload &amp; WhatsApp Tenant</span>
          </button>
        </div>
      </div>
    </div>
  );
}
