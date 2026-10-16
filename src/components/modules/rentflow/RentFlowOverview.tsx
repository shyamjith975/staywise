'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Receipt, 
  CreditCard, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Shield,
  Zap,
  Share2,
  Plus,
  X,
  FileText,
  IndianRupee,
  Printer,
  UploadCloud,
  Paperclip
} from 'lucide-react';
import { ElectricityBill } from '../../../types';
import ViewElectricityBillDocumentModal from './ViewElectricityBillDocumentModal';

export default function RentFlowOverview() {
  const { 
    invoices, 
    properties,
    ledger, 
    activeRole, 
    currentUser,
    setSelectedInvoiceForPay, 
    setIsPayRentOpen, 
    setSelectedReceiptInvoice, 
    addNotification,
    electricityBills,
    updateElectricityBill,
    addElectricityBill,
    setIsUploadBillModalOpen,
    setPreselectedUnitForUpload
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEDGER' | 'ELECTRICITY' | 'SCHEDULE'>('OVERVIEW');
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');

  // Electricity & Document Viewer State
  const [selectedBillForDocView, setSelectedBillForDocView] = useState<ElectricityBill | null>(null);
  const [isViewDocModalOpen, setIsViewDocModalOpen] = useState(false);

  const [isGenBillModalOpen, setIsGenBillModalOpen] = useState(false);
  const [newBillForm, setNewBillForm] = useState({
    unitNumber: '101',
    tenantName: '',
    meterNumber: 'MTR-BLR-001',
    previousReading: 0,
    currentReading: 0,
    ratePerUnit: 8.5,
    fixedCharges: 150,
    discom: 'BESCOM Bangalore'
  });

  const handleShareElectricityBill = (bill: ElectricityBill) => {
    const shareText = `*Staywise Electricity Bill - Unit ${bill.unitNumber}*\nMonth: ${bill.billingMonth}\nMeter: ${bill.meterNumber} (${bill.discom})\nConsumption: ${bill.unitsConsumed} units (${bill.previousReading} -> ${bill.currentReading} kWh @ ₹${bill.ratePerUnit})\nFixed Meter Charges: ₹${bill.fixedCharges}\n*Total Payable: ₹${bill.totalAmount.toLocaleString('en-IN')}*\nDue Date: ${bill.dueDate}\nStatus: ${bill.status}\nAttached Document: ${bill.attachmentName || 'Discom_Bill.pdf'}\n\nPay directly via UPI: staywise.escrow@axisbank\nView in portal: https://staywise.app/tenant`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    addNotification('Electricity Bill Shared', `WhatsApp breakdown & UPI payment link dispatched for Unit ${bill.unitNumber}.`, 'RENT');
  };

  const handlePayElectricityBill = (bill: ElectricityBill) => {
    updateElectricityBill(bill.id, { status: 'Paid', paidDate: 'Today (UPI)' });
    addNotification('Electricity Payment Settled', `₹${bill.totalAmount.toLocaleString('en-IN')} paid via instant UPI for Unit ${bill.unitNumber}.`, 'RENT');
    alert(`₹${bill.totalAmount.toLocaleString('en-IN')} Electricity Bill paid successfully via UPI (BESCOM Discom Settled)!`);
  };

  const handleGenerateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const consumed = Math.max(0, Number(newBillForm.currentReading) - Number(newBillForm.previousReading));
    const total = Math.round(consumed * Number(newBillForm.ratePerUnit) + Number(newBillForm.fixedCharges));
    const createdBill: ElectricityBill = {
      id: `eb-${Date.now()}`,
      propertyId: 'prop-beach-road',
      propertyName: 'Beach Road Luxury Apartments',
      unitNumber: newBillForm.unitNumber,
      tenantName: newBillForm.tenantName,
      meterNumber: newBillForm.meterNumber,
      billingMonth: 'October 2026',
      previousReading: Number(newBillForm.previousReading),
      currentReading: Number(newBillForm.currentReading),
      unitsConsumed: consumed,
      ratePerUnit: Number(newBillForm.ratePerUnit),
      fixedCharges: Number(newBillForm.fixedCharges),
      totalAmount: total,
      dueDate: '20 Oct 2026',
      status: 'Due',
      discom: newBillForm.discom,
      attachmentName: `BESCOM_${newBillForm.unitNumber}_Oct2026.pdf`,
      fileSize: '410 KB',
      billDocumentUrl: '#'
    };

    addElectricityBill(createdBill);
    setIsGenBillModalOpen(false);
  };

  // Full portfolio payment rows (For Owner / Admin)
  const ownerPaymentRows = [
    {
      id: 'pay-priya',
      name: 'Priya Sharma',
      initial: 'P',
      unit: 'Room 4A',
      property: 'Beach Road / Sai Krishna Residency',
      dueDate: 'Due Jun 1',
      amount: 8500,
      status: 'Paid' as const,
      paymentRail: 'UPI Instant (GPay)'
    },
    {
      id: 'pay-arjun',
      name: 'Arjun Mehta',
      initial: 'A',
      unit: 'Room 2B',
      property: 'Beach Road Apartments',
      dueDate: 'Due Jun 1',
      amount: 12000,
      status: 'Paid' as const,
      paymentRail: 'Bank Autopay (Axis)'
    },
    {
      id: 'pay-divya',
      name: 'Divya Rao',
      initial: 'D',
      unit: 'Room 7C',
      property: 'Koramangala Co-living Suite',
      dueDate: 'Due Jun 5',
      amount: 6000,
      status: 'Pending' as const,
      paymentRail: 'Upcoming Autopay'
    },
    {
      id: 'pay-suresh',
      name: 'Suresh Babu',
      initial: 'S',
      unit: 'Room 1A',
      property: 'Beach Road / Sai Krishna Residency',
      dueDate: 'Due May 28',
      amount: 15000,
      status: 'Overdue' as const,
      paymentRail: 'Overdue (6 Days)'
    },
    {
      id: 'pay-shyam',
      name: 'Shyam Sundar',
      initial: 'S',
      unit: 'Apartment 302',
      property: 'Beach Road Luxury Apartments',
      dueDate: 'Due Oct 5',
      amount: 28700,
      status: 'Pending' as const,
      paymentRail: 'Autopay Scheduled'
    },
    {
      id: 'pay-rahul',
      name: 'Rahul Menon',
      initial: 'R',
      unit: 'Unit 101',
      property: 'Beach Road Apartments',
      dueDate: 'Due Sep 25',
      amount: 28000,
      status: 'Overdue' as const,
      paymentRail: 'WhatsApp Notified'
    }
  ];

  // Self payment rows ONLY for tenant (Strict privacy - never show other people)
  const tenantPaymentRows = [
    {
      id: 'pay-shyam-oct',
      name: 'Shyam Sundar (You)',
      initial: 'S',
      unit: 'Apartment 302',
      property: 'Beach Road Luxury Apartments',
      dueDate: 'Due Oct 5, 2026',
      amount: 28700,
      status: 'Pending' as const,
      paymentRail: 'Autopay Scheduled (Axis •••• 4091)'
    },
    {
      id: 'pay-shyam-sep',
      name: 'Shyam Sundar (You)',
      initial: 'S',
      unit: 'Apartment 302',
      property: 'Beach Road Luxury Apartments',
      dueDate: 'Paid Sep 4, 2026',
      amount: 28700,
      status: 'Paid' as const,
      paymentRail: 'UPI (GPay / Axis Escrow)'
    },
    {
      id: 'pay-shyam-aug',
      name: 'Shyam Sundar (You)',
      initial: 'S',
      unit: 'Apartment 302',
      property: 'Beach Road Luxury Apartments',
      dueDate: 'Paid Aug 5, 2026',
      amount: 28700,
      status: 'Paid' as const,
      paymentRail: 'Bank Autopay'
    }
  ];

  // Self Ledger ONLY for resident tenant (Strict isolation)
  const tenantLedger = [
    {
      id: 'TXN-302-09',
      timestamp: '2026-09-04 10:15 AM',
      description: 'Rent Payment Cleared - Apartment 302 (September 2026)',
      type: 'CREDIT' as const,
      amount: 28600,
      account: 'Axis Escrow Settlement (UPI Instant)',
      entityType: 'RENT',
      referenceId: 'UPI-774920198421',
      settlementStatus: 'CLEARED' as const
    },
    {
      id: 'TXN-302-08',
      timestamp: '2026-08-05 11:20 AM',
      description: 'Rent Payment Cleared - Apartment 302 (August 2026)',
      type: 'CREDIT' as const,
      amount: 28600,
      account: 'Bank Autopay (Axis •••• 4091)',
      entityType: 'RENT',
      referenceId: 'ACH-8891023819',
      settlementStatus: 'CLEARED' as const
    },
    {
      id: 'DEP-302-SEC',
      timestamp: '2026-06-15 03:30 PM',
      description: 'Security Deposit Held in Escrow Retention Trust (Unit 302)',
      type: 'CREDIT' as const,
      amount: 60000,
      account: 'Statutory Tenant Deposit Trust',
      entityType: 'SECURITY_DEPOSIT',
      referenceId: 'DEP-302-SHYAM',
      settlementStatus: 'CLEARED' as const
    }
  ];

  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';
  const isDemoTenant = currentUser?.email === 'tenant@staywise.com' || currentUser?.id === 'user-tenant-shyam';

  // Dynamically map real invoices from SQLite database scoped to the active role
  const scopedInvoices = (activeRole === 'owner')
    ? (isDemoAccount ? invoices : invoices.filter(inv => {
        const ownerProps = properties.filter(p => p.ownerId === currentUser.id);
        const ownerPropIds = ownerProps.map(p => p.id);
        const ownerPropNames = ownerProps.map(p => p.name.toLowerCase());
        return ownerPropIds.includes(inv.propertyId) || (inv.propertyName && ownerPropNames.includes(inv.propertyName.toLowerCase()));
      }))
    : (activeRole === 'tenant')
    ? (isDemoTenant ? invoices : invoices.filter(inv => inv.tenantId === currentUser.id || (currentUser.name && inv.tenantName?.toLowerCase().includes(currentUser.name.toLowerCase()))))
    : invoices;

  const dynamicPaymentRows = scopedInvoices.length > 0 ? scopedInvoices.map(inv => ({
    id: inv.id,
    name: inv.tenantName,
    initial: (inv.tenantName || 'T').charAt(0).toUpperCase(),
    unit: `Unit ${inv.unitNumber}`,
    property: inv.propertyName,
    dueDate: inv.dueDate,
    amount: inv.totalAmount,
    status: (inv.status === 'Paid' ? 'Paid' : inv.status === 'Overdue' ? 'Overdue' : 'Pending') as 'Paid' | 'Pending' | 'Overdue',
    paymentRail: inv.paymentMethod || 'UPI Instant (GPay)',
    rawInvoice: inv
  })) : ((activeRole === 'tenant' ? isDemoTenant : isDemoAccount) ? (activeRole === 'tenant' ? tenantPaymentRows : ownerPaymentRows) : []);

  const allPaymentRows = dynamicPaymentRows;
  
  const displayedLedger = (activeRole === 'tenant')
    ? (isDemoTenant ? tenantLedger : ledger.filter(l => (currentUser?.id && l.referenceId.includes(currentUser.id)) || (currentUser?.name && l.description.toLowerCase().includes(currentUser.name.toLowerCase()))))
    : (isDemoAccount ? ledger : ledger.filter(l => {
        const ownerProps = properties.filter(p => p.ownerId === currentUser?.id);
        const propIds = ownerProps.map(p => p.id);
        return propIds.some(pid => l.referenceId.includes(pid));
      }));

  const userElectricityBills = (activeRole === 'tenant')
    ? (isDemoTenant
        ? electricityBills.filter(b => b.unitNumber === '302')
        : electricityBills.filter(b => {
            const tenantUnits = scopedInvoices.map(i => i.unitNumber);
            return (b as any).tenantId === currentUser?.id || (b.tenantName && currentUser?.name && b.tenantName.toLowerCase().includes(currentUser.name.toLowerCase())) || tenantUnits.includes(b.unitNumber);
          }))
    : (isDemoAccount
        ? electricityBills
        : electricityBills.filter(b => {
            const ownerProps = properties.filter(p => p.ownerId === currentUser?.id);
            const ownerPropIds = ownerProps.map(p => p.id);
            return ownerPropIds.includes(b.propertyId);
          }));

  const filteredRows = allPaymentRows.filter(row => {
    if (filter === 'PAID') return row.status === 'Paid';
    if (filter === 'PENDING') return row.status === 'Pending';
    if (filter === 'OVERDUE') return row.status === 'Overdue';
    return true;
  });

  const handleSendReminder = (name: string) => {
    addNotification('WhatsApp Dispatched', `Automated payment reminder with instant UPI link sent to ${name}.`, 'RENT');
  };

  const handlePayNowSim = (row: typeof allPaymentRows[0]) => {
    const matchingInv = ('rawInvoice' in row && (row as any).rawInvoice) 
      ? (row as any).rawInvoice 
      : (invoices.find(i => i.id === row.id) || invoices.find(i => i.status === 'Due' || i.status === 'Overdue') || invoices[0]);
    if (matchingInv) {
      setSelectedInvoiceForPay({
        ...matchingInv,
        tenantName: row.name,
        unitNumber: row.unit.replace('Unit ', ''),
        totalAmount: row.amount
      });
      setIsPayRentOpen(true);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238]">
            {activeRole === 'tenant' ? 'My Rent & Payments' : 'Payments & Collections'}
          </h1>
          <div className="text-xs text-[#666666] font-semibold uppercase tracking-wider mt-0.5">
            {activeRole === 'tenant' 
              ? (isDemoTenant ? 'Apartment 302 • Beach Road Luxury Apartments' : (scopedInvoices[0]?.propertyName ? `${scopedInvoices[0]?.propertyName} • Unit ${scopedInvoices[0]?.unitNumber}` : 'Tenant Billing & Receipts'))
              : (isDemoAccount ? 'Real-time Escrow Inflows • Bengaluru & Kozhikode' : 'Real-time Escrow Inflows & Collections')}
          </div>
        </div>

        <div className="flex items-center gap-2.5 max-w-full overflow-x-auto pb-1">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#D2DDD7] text-xs whitespace-nowrap shrink-0">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'OVERVIEW' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
              }`}
            >
              {activeRole === 'tenant' ? 'My Receipts' : 'Collections'}
            </button>
            <button
              onClick={() => setActiveTab('LEDGER')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'LEDGER' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
              }`}
            >
              {activeRole === 'tenant' ? 'My Statement' : 'Double-Entry Ledger'}
            </button>
            <button
              onClick={() => setActiveTab('ELECTRICITY')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'ELECTRICITY' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
              }`}
            >
              {activeRole === 'tenant' ? 'My Electricity Bill' : 'Electricity Bills'}
            </button>
            {activeRole !== 'tenant' && (
              <button
                onClick={() => setActiveTab('SCHEDULE')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  activeTab === 'SCHEDULE' ? 'bg-[#263238] text-white' : 'text-[#666666] hover:text-[#263238]'
                }`}
              >
                Auto Reminders
              </button>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (() => {
        const tenantPendingInvoice = scopedInvoices.find(i => i.status === 'Due' || i.status === 'Overdue');
        const tenantDueAmount = scopedInvoices.filter(i => i.status === 'Due' || i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0);
        const tenantDisplayDue = (isDemoTenant && scopedInvoices.length === 0) ? 28700 : tenantDueAmount;
        const tenantDueDate = tenantPendingInvoice ? `Due on ${tenantPendingInvoice.dueDate}` : ((isDemoTenant && scopedInvoices.length === 0) ? 'Due on Oct 5, 2026' : 'No upcoming dues');
        const tenantDepositAmount = scopedInvoices.length > 0 
          ? (properties.find(p => p.id === scopedInvoices[0]?.propertyId)?.units?.find(u => u.unitNumber === scopedInvoices[0]?.unitNumber)?.depositAmount || 0)
          : ((isDemoTenant && scopedInvoices.length === 0) ? 60000 : 0);

        const totalCollected = scopedInvoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0);
        const totalPending = scopedInvoices.filter(i => i.status === 'Due').reduce((acc, i) => acc + i.totalAmount, 0);
        const totalOverdue = scopedInvoices.filter(i => i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0);

        const displayCollected = (isDemoAccount && scopedInvoices.length === 0) ? 1340000 : totalCollected;
        const displayPending = (isDemoAccount && scopedInvoices.length === 0) ? 120000 : totalPending;
        const displayOverdue = (isDemoAccount && scopedInvoices.length === 0) ? 40000 : totalOverdue;

        const totalExpected = displayCollected + displayPending + displayOverdue;
        const collectedWidth = totalExpected > 0 ? Math.round((displayCollected / totalExpected) * 100) : 0;
        const pendingWidth = totalExpected > 0 ? Math.round((displayPending / totalExpected) * 100) : 0;
        const overdueWidth = totalExpected > 0 ? Math.round((displayOverdue / totalExpected) * 100) : 0;

        const formatLakhs = (val: number) => {
          if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
          return `₹${val.toLocaleString('en-IN')}`;
        };

        return (
          <div className="space-y-6">
            {/* Top 3 Metrics Cards */}
            {activeRole === 'tenant' ? (
              // Tenant-specific 3 Cards (Zero other people's data)
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="organic-card p-5 bg-gradient-to-br from-[#ffffff] to-white border-amber-200">
                  <span className="text-xs font-bold text-amber-800">Current Rent Due</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-1">
                    ₹{tenantDisplayDue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-amber-700 font-bold mt-2 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{tenantDueDate}</span>
                  </div>
                </div>

                <div className="organic-card p-5 bg-gradient-to-br from-[#f5f5f5] to-white border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800">Security Deposit in Escrow</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-tabular mt-1">
                    ₹{tenantDepositAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{tenantDepositAmount > 0 ? 'Safe in Axis Nodal Escrow' : 'Zero deposit held'}</span>
                  </div>
                </div>

                <div className="organic-card p-5 bg-white">
                  <span className="text-xs font-bold text-[#666666]">Bank Autopay Status</span>
                  <div className="text-xl font-black text-[#263238] mt-1">
                    {isDemoTenant ? 'Active (Axis Bank)' : (scopedInvoices.length > 0 ? 'Active Mandate' : 'No Mandate Active')}
                  </div>
                  <div className="text-[11px] text-[#263238] font-bold mt-2 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    <span>{isDemoTenant ? 'Next auto-debit on 5th Oct' : (tenantPendingInvoice ? `Due on ${tenantPendingInvoice.dueDate}` : 'Autopay ready')}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Owner / Admin 3 Metrics Cards
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="organic-card p-5 bg-gradient-to-br from-[#f5f5f5] to-white flex flex-col justify-between h-32 relative overflow-hidden border-emerald-200">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-tabular tracking-tight">
                      {formatLakhs(displayCollected)}
                    </div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      Collected
                    </div>
                  </div>
                  <div>
                    <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full shadow-sm" style={{ width: `${collectedWidth}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="organic-card p-5 bg-gradient-to-br from-[#ffffff] to-white flex flex-col justify-between h-32 relative overflow-hidden border-amber-200">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-800 font-tabular tracking-tight">
                      {formatLakhs(displayPending)}
                    </div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">
                      Pending
                    </div>
                  </div>
                  <div>
                    <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full shadow-sm" style={{ width: `${pendingWidth}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="organic-card p-5 bg-gradient-to-br from-[#fff0f0] to-white flex flex-col justify-between h-32 relative overflow-hidden border-rose-200">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-rose-800 font-tabular tracking-tight">
                      {formatLakhs(displayOverdue)}
                    </div>
                    <div className="text-xs font-bold text-rose-700 mt-0.5">
                      Overdue
                    </div>
                  </div>
                  <div>
                    <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-600 h-full rounded-full shadow-sm" style={{ width: `${overdueWidth}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {(['ALL', 'PAID', 'PENDING'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition ${
                    filter === f 
                      ? 'bg-[#263238] text-white shadow-sm' 
                      : 'bg-white text-[#666666] hover:text-[#263238] border border-[#D2DDD7]'
                  }`}
                >
                  {f === 'ALL' ? (activeRole === 'tenant' ? 'All My Payments' : 'All Payments') : f}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#666666] font-semibold">
              Showing {filteredRows.length} rent records
            </span>
          </div>

          {/* Payment Rows */}
          {filteredRows.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E8F0EC] text-[#263238] flex items-center justify-center mx-auto">
                <Receipt className="h-6 w-6 text-[#263238]" />
              </div>
              <h3 className="text-base font-extrabold text-[#263238]">
                {activeRole === 'tenant' ? 'No rent invoices found' : 'No rent collections recorded yet'}
              </h3>
              <p className="text-xs text-[#666666] max-w-md mx-auto">
                {activeRole === 'tenant'
                  ? 'You have no current or pending rent invoices. Invoices generated by your landlord or property manager will appear here.'
                  : 'Once you add properties and onboard tenants, automated monthly rent schedules, UPI payment links, and reconciliation receipts will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="organic-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#263238]/40"
                >
                  {/* Left: Avatar + Tenant Name + Room & Due Date */}
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-[#E8F0EC] border border-[#263238]/20 flex items-center justify-center font-black text-[#263238] text-sm shadow-inner shrink-0">
                      {row.initial}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-[#263238] text-sm sm:text-base">
                        {row.name}
                      </h3>
                      <div className="text-xs text-[#666666] mt-0.5 flex items-center gap-1.5">
                        <span className="font-semibold text-[#263238]">{row.unit}</span>
                        <span>•</span>
                        <span>{row.dueDate}</span>
                        <span className="hidden md:inline">• {row.property}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount + Status Badge + 1-Click Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0E0E0]">
                    <div className="sm:text-right">
                      <div className="text-base sm:text-lg font-black text-[#263238] font-tabular">
                        ₹{row.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs font-bold mt-0.5">
                        <span className={`capitalize ${
                          row.status === 'Paid' 
                            ? 'text-emerald-700' 
                            : row.status === 'Pending' 
                            ? 'text-amber-700' 
                            : 'text-rose-700'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {row.status === 'Paid' ? (
                        <button
                          onClick={() => {
                            const paidInv = invoices.find(i => i.status === 'Paid') || invoices[0];
                            setSelectedReceiptInvoice({
                              ...paidInv,
                              tenantName: row.name,
                              unitNumber: row.unit,
                              totalAmount: row.amount
                            });
                          }}
                          className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] text-xs font-bold border border-[#D2DDD7] flex items-center gap-1.5 transition shadow-sm shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Download Receipt</span>
                          <span className="sm:hidden text-[11px]">Receipt</span>
                        </button>
                      ) : (
                        <>
                          {activeRole !== 'tenant' ? (
                            <>
                              <button
                                onClick={() => handleSendReminder(row.name)}
                                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition shrink-0"
                                title="Send polite WhatsApp alert"
                              >
                                <Send className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                              <button
                                onClick={() => {
                                  addNotification('Payment Recorded', `Marked ₹${row.amount.toLocaleString('en-IN')} as collected offline for ${row.name}.`, 'RENT');
                                  alert(`Recorded offline payment of ₹${row.amount.toLocaleString('en-IN')} for ${row.name}.`);
                                }}
                                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] text-xs font-bold border border-[#D2DDD7] flex items-center gap-1 transition shrink-0"
                                title="Record cash or direct bank transfer"
                              >
                                <span className="hidden sm:inline">Record Offline</span>
                                <span className="sm:hidden text-[11px]">Offline</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handlePayNowSim(row)}
                              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold shadow-md shadow-[#263238]/20 transition shrink-0"
                            >
                              <span className="hidden sm:inline">Pay Rent Now</span>
                              <span className="sm:hidden text-[11px]">Pay Now</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        );
      })()}

      {/* TAB 2: Immutable Double-Entry Ledger */}
      {activeTab === 'LEDGER' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#263238] flex items-center gap-2">
                <Database className="h-4 w-4 text-[#263238]" />
                <span>{activeRole === 'tenant' ? 'My Statement & Transaction Ledger' : 'Statutory Double-Entry Ledger'}</span>
              </h3>
              <p className="text-[11px] text-[#666666]">
                {activeRole === 'tenant' 
                  ? (isDemoTenant ? 'All rent transfers, security deposit receipts, and utility payments for Unit 302' : 'All your personal rent transfers, security deposit receipts, and utility payments')
                  : 'Balance is never the single source of truth. Every transaction logs an immutable debit/credit trail.'}
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Reconciled Real-Time
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8F0EC] text-[#666666] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Entry ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Account</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0] text-[#263238]">
                {displayedLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Database className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold text-[#666666]">No ledger transactions recorded yet</p>
                      <p className="text-[11px] text-[#999999] mt-0.5">Transactions will appear automatically as rent and deposit entries are settled.</p>
                    </td>
                  </tr>
                ) : (
                  displayedLedger.map(entry => (
                    <tr key={entry.id} className="hover:bg-[#ffffff]">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#666666]">{entry.id}</td>
                      <td className="py-2.5 px-3 text-[#666666] whitespace-nowrap">{entry.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold">{entry.description}</td>
                      <td className="py-2.5 px-3 text-[#666666] text-[11px]">{entry.account}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          entry.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black font-tabular">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          {entry.settlementStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Automated Reminders Schedule (Owner Only) */}
      {activeTab === 'SCHEDULE' && activeRole !== 'tenant' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#263238]">Automated Rent Reminders Schedule</h3>
            <p className="text-[11px] text-[#666666]">
              Configurable schedule across WhatsApp, SMS, Email, and Push Notifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3">
              <span className="font-extrabold text-[#263238] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#263238]" />
                <span>Pre-Due Date Reminders</span>
              </span>
              <div className="space-y-2 text-[#263238]">
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>7 days before due date</span>
                  <span className="text-emerald-700 font-bold">Active (WhatsApp + Email)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>3 days before due date</span>
                  <span className="text-emerald-700 font-bold">Active (WhatsApp + SMS)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>1 day before due date</span>
                  <span className="text-emerald-700 font-bold">Active (Push + WhatsApp)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7] font-bold">
                  <span>Due Date Morning (09:00 AM)</span>
                  <span className="text-[#263238]">Active (Instant UPI QR)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-3">
              <span className="font-extrabold text-[#263238] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Overdue Escalation Workflow</span>
              </span>
              <div className="space-y-2 text-[#263238]">
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>1 day overdue</span>
                  <span className="text-amber-700 font-bold">Polite WhatsApp Alert</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>3 days overdue</span>
                  <span className="text-amber-700 font-bold">SMS + Manager Notification</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white border border-[#D2DDD7]">
                  <span>7 days overdue</span>
                  <span className="text-rose-700 font-bold">Formal Overdue Escalation Notice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Electricity & Sub-meter Utility Billing */}
      {activeTab === 'ELECTRICITY' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span>{activeRole === 'tenant' ? (isDemoTenant ? 'My Unit 302 Electricity Bill' : 'My Electricity & Power Bills') : 'Electricity & Sub-Meter Utility Billing'}</span>
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                {activeRole === 'tenant'
                  ? 'Official utility power readings, tariff breakdown, and direct WhatsApp sharing'
                  : 'Track individual unit sub-meters, compute power bills, and dispatch WhatsApp payment links'}
              </p>
            </div>

            {activeRole !== 'tenant' && (
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => {
                    setPreselectedUnitForUpload(null);
                    setIsUploadBillModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold shadow-md shadow-[#263238]/20 transition flex items-center gap-1.5"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Bill to Tenant</span>
                </button>

                <button
                  onClick={() => setIsGenBillModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Generate Bill</span>
                </button>
              </div>
            )}
          </div>

          {/* 3 Metric Cards */}
          {(() => {
            const totalUnitsConsumed = userElectricityBills.reduce((acc, b) => acc + (b.unitsConsumed || 0), 0);
            const totalPowerDues = userElectricityBills.filter(b => b.status === 'Due').reduce((acc, b) => acc + b.totalAmount, 0);
            const earliestDueBill = userElectricityBills.find(b => b.status === 'Due');

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="organic-card p-5">
                  <span className="text-xs font-semibold text-[#666666]">Units Consumed (This Month)</span>
                  <div className="text-2xl font-black text-[#263238] font-tabular mt-1">
                    {totalUnitsConsumed} kWh
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                    {userElectricityBills.length > 0 ? 'Sub-meters Calibrated' : 'Zero Active Meters'}
                  </span>
                </div>

                <div className="organic-card p-5">
                  <span className="text-xs font-semibold text-[#666666]">Tariff Rate / Unit</span>
                  <div className="text-2xl font-black text-[#263238] font-tabular mt-1">
                    ₹8.50 <span className="text-xs font-normal text-[#666666]">/ kWh</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#263238] bg-[#E8F0EC] px-2 py-0.5 rounded-full mt-2 inline-block">
                    Govt Regulated Discom Rate
                  </span>
                </div>

                <div className="organic-card p-5">
                  <span className="text-xs font-semibold text-[#666666]">
                    {activeRole === 'tenant' ? 'Your Outstanding Bill' : 'Total Power Dues'}
                  </span>
                  <div className="text-2xl font-black text-amber-700 font-tabular mt-1">
                    ₹{totalPowerDues.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${
                    earliestDueBill ? 'text-amber-800 bg-amber-50' : 'text-emerald-800 bg-emerald-50'
                  }`}>
                    {earliestDueBill ? `Due: ${earliestDueBill.dueDate}` : 'All dues cleared'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Electricity Bills List */}
          <div className="organic-card overflow-hidden">
            <div className="p-4 border-b border-[#E0E0E0] bg-[#ffffff] flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#263238]">
                {activeRole === 'tenant' ? (isDemoTenant ? 'Apartment 302 Billing History' : 'My Unit Billing History') : 'All Unit Power Meters'}
              </span>
              <span className="text-[11px] text-[#666666]">BESCOM Discom Provider</span>
            </div>

            <div className="divide-y divide-[#E0E0E0]">
              {userElectricityBills.length === 0 ? (
                <div className="p-12 text-center">
                  <Zap className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-[#666666]">No electricity or utility bills found</p>
                  <p className="text-[11px] text-[#999999] mt-0.5">
                    {activeRole === 'tenant'
                      ? 'Utility bills uploaded by your property manager will appear here.'
                      : 'Generate or upload sub-meter bills for your units above.'}
                  </p>
                </div>
              ) : (
                userElectricityBills.map((bill) => (
                <div key={bill.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#ffffff] transition">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 fill-current" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#263238] text-sm sm:text-base">
                          Unit {bill.unitNumber} • {bill.tenantName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bill.status}
                        </span>
                        {bill.attachmentName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>PDF Attached</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#666666] mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Meter: <b className="font-mono text-[#263238]">{bill.meterNumber}</b></span>
                        <span>•</span>
                        <span>Reading: {bill.previousReading} → {bill.currentReading} ({bill.unitsConsumed} kWh)</span>
                        <span>•</span>
                        <span>Due: {bill.dueDate}</span>
                        {bill.notes && (
                          <span className="text-[11px] text-[#666666] italic hidden lg:inline">
                            • &ldquo;{bill.notes}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#E0E0E0]">
                    <div className="text-left md:text-right">
                      <div className="text-base sm:text-lg font-black text-[#263238] font-tabular">
                        ₹{bill.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#666666]">
                        ({bill.unitsConsumed} × ₹{bill.ratePerUnit} + ₹{bill.fixedCharges} fixed)
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedBillForDocView(bill);
                          setIsViewDocModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                        title="View and download official scanned Discom bill document"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#263238]" />
                        <span>View Bill</span>
                      </button>

                      <button
                        onClick={() => handleShareElectricityBill(bill)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                        title="Share on WhatsApp with direct UPI payment link"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </button>

                      {bill.status === 'Due' ? (
                        activeRole === 'tenant' ? (
                          <button
                            onClick={() => handlePayElectricityBill(bill)}
                            className="px-4 py-2 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold shadow-md shadow-[#263238]/20 transition"
                          >
                            Pay (UPI)
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateElectricityBill(bill.id, { status: 'Paid', paidDate: 'Today' });
                              addNotification('Electricity Bill Cleared', `Unit ${bill.unitNumber} marked as settled offline.`, 'RENT');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#E8F0EC] hover:bg-[#263238] hover:text-white text-[#263238] text-xs font-bold border border-[#D2DDD7] transition"
                          >
                            Mark Paid
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold px-2.5 py-1 bg-emerald-50 rounded-xl">
                          ✓ Settled {bill.paidDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Electricity Bill Modal */}
      {isGenBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#D2DDD7] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h3 className="font-extrabold text-base text-[#263238]">Generate Unit Electricity Bill</h3>
              </div>
              <button onClick={() => setIsGenBillModalOpen(false)} className="text-[#666666] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBillSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={newBillForm.unitNumber}
                    onChange={(e) => setNewBillForm({ ...newBillForm, unitNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Tenant Name</label>
                  <input
                    type="text"
                    required
                    value={newBillForm.tenantName}
                    onChange={(e) => setNewBillForm({ ...newBillForm, tenantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#263238] font-semibold mb-1">Meter ID & Discom</label>
                <input
                  type="text"
                  required
                  value={newBillForm.meterNumber}
                  onChange={(e) => setNewBillForm({ ...newBillForm, meterNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Previous Reading (kWh)</label>
                  <input
                    type="number"
                    required
                    value={newBillForm.previousReading}
                    onChange={(e) => setNewBillForm({ ...newBillForm, previousReading: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Current Reading (kWh)</label>
                  <input
                    type="number"
                    required
                    value={newBillForm.currentReading}
                    onChange={(e) => setNewBillForm({ ...newBillForm, currentReading: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Tariff Rate (₹/kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newBillForm.ratePerUnit}
                    onChange={(e) => setNewBillForm({ ...newBillForm, ratePerUnit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Fixed Meter Charge (₹)</label>
                  <input
                    type="number"
                    required
                    value={newBillForm.fixedCharges}
                    onChange={(e) => setNewBillForm({ ...newBillForm, fixedCharges: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] focus:outline-none focus:border-[#263238]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#263238]/20 flex justify-between items-center text-xs">
                <span className="text-[#666666]">Estimated Bill Total:</span>
                <span className="text-base font-black text-[#263238] font-tabular">
                  ₹{Math.max(0, Math.round((newBillForm.currentReading - newBillForm.previousReading) * newBillForm.ratePerUnit + newBillForm.fixedCharges)).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#263238] hover:bg-[#263238] text-white font-bold text-xs shadow-md shadow-[#263238]/20 transition"
              >
                Create Bill & Ready WhatsApp Share
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Scanned / Uploaded Electricity Bill Document Preview Modal */}
      <ViewElectricityBillDocumentModal
        isOpen={isViewDocModalOpen}
        onClose={() => setIsViewDocModalOpen(false)}
        bill={selectedBillForDocView}
        isTenant={activeRole === 'tenant'}
        onPayUPI={handlePayElectricityBill}
      />
    </div>
  );
}
