'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Building, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  Gift, 
  FileText, 
  Download, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Zap, 
  Calendar,
  Fingerprint,
  Camera,
  X,
  Shield,
  ExternalLink,
  Users,
  Share2,
  Send,
  Calculator,
  UserPlus,
  Paperclip
} from 'lucide-react';
import { Roommate } from '../../types';
import ViewElectricityBillDocumentModal from '../modules/rentflow/ViewElectricityBillDocumentModal';

export default function TenantDashboard() {
  const { 
    tenants, 
    invoices, 
    tickets, 
    setIsPayRentOpen, 
    setSelectedInvoiceForPay, 
    setSelectedReceiptInvoice, 
    setIsCreateTicketOpen, 
    setActiveView,
    addNotification,
    electricityBills,
    updateElectricityBill
  } = useAppState();

  // Self Details ONLY (Section: Resident Privacy Guarantee)
  const currentTenant = tenants.find(t => t.id === 't-shyam') || tenants[0];
  const pendingInvoice = invoices.find(i => i.tenantId === currentTenant?.id && (i.status === 'Due' || i.status === 'Overdue'));
  const lastPaidInvoice = invoices.find(i => i.tenantId === currentTenant?.id && i.status === 'Paid');
  const tenantTickets = tickets.filter(t => t.unitNumber === '302');

  // Roommates & Split Rent State
  const [roommates, setRoommates] = useState<Roommate[]>([
    {
      id: 'rm-1',
      name: 'Shyam Sundar (You)',
      phone: '+91 98460 21980',
      email: 'shyam.sundar@techpark.in',
      splitPercentage: 50,
      rentShare: 14350,
      utilityShare: 968,
      totalPayable: 15318,
      status: 'Paid',
      isPrimary: true
    },
    {
      id: 'rm-2',
      name: 'Rohan Verma',
      phone: '+91 98112 40912',
      email: 'rohan.verma@fintech.co',
      splitPercentage: 50,
      rentShare: 14350,
      utilityShare: 968,
      totalPayable: 15318,
      status: 'Pending',
      isPrimary: false
    }
  ]);

  const [isAddRoommateModalOpen, setIsAddRoommateModalOpen] = useState(false);
  const [newRoommate, setNewRoommate] = useState({
    name: '',
    phone: '',
    email: '',
    splitPercentage: 33
  });

  const [isSplitCalculatorModalOpen, setIsSplitCalculatorModalOpen] = useState(false);
  const [splitMethod, setSplitMethod] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');

  // Unit 302 Electricity Bill connected to shared state
  const unit302Bill = electricityBills.find(b => b.unitNumber === '302') || {
    id: 'eb-302',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Luxury Apartments',
    unitNumber: '302',
    tenantName: 'Shyam Sundar',
    meterNumber: 'MTR-BLR-8921-A',
    billingMonth: 'October 2026',
    previousReading: 1420,
    currentReading: 1630,
    unitsConsumed: 210,
    ratePerUnit: 8.5,
    fixedCharges: 150,
    totalAmount: 1935,
    dueDate: '15 Oct 2026',
    status: 'Due' as const,
    discom: 'BESCOM Bangalore',
    attachmentName: 'BESCOM_Oct2026_Bill_Unit302.pdf',
    fileSize: '420 KB',
    notes: 'Sub-meter kWh + 10% common area lift/lobby power split'
  };

  const [isViewBillDocModalOpen, setIsViewBillDocModalOpen] = useState(false);

  const handleShareUnitElectricityBill = () => {
    const text = `*Staywise Unit 302 Electricity Bill*\nMonth: ${unit302Bill.billingMonth}\nUnits Consumed: ${unit302Bill.unitsConsumed} kWh (@ ₹${unit302Bill.ratePerUnit}/unit)\nFixed Charges: ₹${unit302Bill.fixedCharges}\n*Total Payable: ₹${unit302Bill.totalAmount.toLocaleString('en-IN')}*\nDue Date: ${unit302Bill.dueDate}\nAttached Document: ${unit302Bill.attachmentName || 'Bill.pdf'}\n\nSplit per Roommate (${roommates.length} People): ₹${(unit302Bill.totalAmount / (roommates.length || 1)).toFixed(0)} each.\nPay online via UPI: staywise.escrow@axisbank`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    addNotification('Electricity Bill Shared', 'Dispatched bill breakdown & UPI link to roommates via WhatsApp.', 'RENT');
  };

  const handlePayUnitElectricityBill = () => {
    updateElectricityBill(unit302Bill.id, { status: 'Paid', paidDate: 'Today (UPI)' });
    addNotification('Electricity Payment Settled', `₹${unit302Bill.totalAmount.toLocaleString('en-IN')} paid via UPI to ${unit302Bill.discom}.`, 'RENT');
    alert(`₹${unit302Bill.totalAmount.toLocaleString('en-IN')} Electricity Bill paid successfully via UPI (${unit302Bill.discom} Settled)!`);
  };

  const handleSendRoommateWhatsAppSplit = (rm: Roommate) => {
    const text = `Hi ${rm.name.split(' ')[0]}, here is your Staywise October 2026 rent & electricity split for Unit 302:\n• Rent Share: ₹${rm.rentShare.toLocaleString('en-IN')}\n• Electricity Share: ₹${rm.utilityShare.toLocaleString('en-IN')}\n*Total Due: ₹${rm.totalPayable.toLocaleString('en-IN')}*\n\nPay directly to Staywise Escrow via UPI: staywise.escrow@axisbank`;
    window.open(`https://api.whatsapp.com/send?phone=${rm.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
    addNotification('Split Request Dispatched', `WhatsApp rent split ping sent to ${rm.name}.`, 'RENT');
  };

  const handleMarkRoommatePaid = (id: string) => {
    setRoommates(prev => prev.map(r => r.id === id ? { ...r, status: 'Paid' } : r));
    addNotification('Roommate Payment Confirmed', 'Roommate share marked as received.', 'RENT');
  };

  const handleAddRoommateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoommate.name) return;
    const totalCount = roommates.length + 1;
    const newEqualSplit = Math.round(100 / totalCount);
    const totalRent = 28700;
    const totalUtil = 1935;
    const rentPerPerson = Math.round(totalRent / totalCount);
    const utilPerPerson = Math.round(totalUtil / totalCount);

    const updatedExisting = roommates.map(r => ({
      ...r,
      splitPercentage: newEqualSplit,
      rentShare: rentPerPerson,
      utilityShare: utilPerPerson,
      totalPayable: rentPerPerson + utilPerPerson
    }));

    const added: Roommate = {
      id: `rm-${Date.now()}`,
      name: newRoommate.name,
      phone: newRoommate.phone,
      email: newRoommate.email,
      splitPercentage: newEqualSplit,
      rentShare: rentPerPerson,
      utilityShare: utilPerPerson,
      totalPayable: rentPerPerson + utilPerPerson,
      status: 'Pending',
      isPrimary: false
    };

    setRoommates([...updatedExisting, added]);
    setIsAddRoommateModalOpen(false);
    setNewRoommate({ name: '', phone: '', email: '', splitPercentage: 33 });
    addNotification('Roommate Added', `${added.name} added to Unit 302 with equal rent split of ₹${added.totalPayable.toLocaleString('en-IN')}.`, 'RENT');
  };

  // eKYC State for Tenant (User requested: make a ekyc option for tentns for digital verification)
  const [isEKYCModalOpen, setIsEKYCModalOpen] = useState(false);
  const [ekycStatus, setEkycStatus] = useState<'Verified' | 'Pending'>('Verified');
  const [ekycStep, setEkycStep] = useState<1 | 2 | 3>(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('5481 9028 1142');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [panNumber, setPanNumber] = useState('BLRPS9912A');

  // Resident Stored Documents
  const [residentDocs, setResidentDocs] = useState([
    { id: 'rd-1', name: 'Digital Tenancy Agreement (Aadhaar eSigned)', size: '2.1 MB', date: 'Signed Oct 2026' },
    { id: 'rd-2', name: 'Security Deposit Escrow Certificate (₹60,000)', size: '420 KB', date: 'Verified' },
    { id: 'rd-3', name: 'Move-in Condition & Inventory Report', size: '1.8 MB', date: 'Attached 18 Photos' }
  ]);

  const handleSendUIDAIOTP = () => {
    setOtpSent(true);
    alert('UIDAI OTP sent to registered mobile (+91 98460 21980): 482910');
  };

  const handleCompleteEKYC = (e: React.FormEvent) => {
    e.preventDefault();
    setEkycStatus('Verified');
    setIsEKYCModalOpen(false);
    alert('Digital eKYC verified via UIDAI & DigiLocker! Reliability score boosted to 96/100.');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Resident Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Welcome home, {currentTenant?.name.split(' ')[0] || 'Shyam'}!
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Digital eKYC Verified</span>
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Apartment {currentTenant?.unitNumber}, {currentTenant?.propertyName} • Lease active until {currentTenant?.leaseEnd}
          </p>
        </div>

        {/* Quick Action: Raise Service Ticket */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#f4f3ef] text-[#274235] text-xs font-bold border border-[#e3e1d8] shadow-sm transition"
          >
            <Fingerprint className="h-4 w-4" />
            <span>eKYC Digital ID</span>
          </button>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition"
          >
            <Wrench className="h-4 w-4" />
            <span>Request Repair</span>
          </button>
        </div>
      </div>

      {/* Hero Rent Card & Reliability Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 organic-card p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6e7972]">
                Your Rent for October 2026
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#19251f] mt-1 font-tabular">
                ₹{pendingInvoice ? pendingInvoice.totalAmount.toLocaleString('en-IN') : '28,700'}
              </div>
              <p className="text-xs text-[#6e7972] mt-1">
                Base Rent: ₹{currentTenant?.monthlyRent.toLocaleString('en-IN')} + CAM & Escrow Utilities
              </p>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="h-3.5 w-3.5" />
                Due in 4 days (Oct 5)
              </span>
            </div>
          </div>

          {/* Autopay & Salary Alignment Badge */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-9 w-9 rounded-xl bg-[#274235] text-white flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#19251f] flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="break-words">Bank Autopay Configured (Axis Bank •••• 4091)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">Scheduled</span>
                </div>
                <div className="text-[11px] text-[#6e7972] truncate mt-0.5">
                  Configured Salary Date: 10th • Scheduled debit on 5th
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const inv = pendingInvoice || invoices[0];
                setSelectedInvoiceForPay({
                  ...inv,
                  tenantName: 'Shyam Sundar',
                  unitNumber: '302',
                  totalAmount: 28700
                });
                setIsPayRentOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition shrink-0 self-start sm:self-auto"
            >
              Pay Now (UPI)
            </button>
          </div>
        </div>

        {/* Tenant Reliability Score Card */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#6e7972] mb-1">
              <span className="font-semibold">Your Staywise Reliability Score</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-700 font-tabular">
                {currentTenant?.reliabilityScore || 96}
              </span>
              <span className="text-[#6e7972] text-sm">/ 100</span>
            </div>
            <p className="text-[11px] text-[#6e7972] mt-2 leading-relaxed">
              Based on verified on-time payments, zero lease violations, and digital Aadhaar KYC verification.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#eeece5] space-y-2 text-xs">
            <div className="flex justify-between text-[#6e7972]">
              <span>On-Time Payments</span>
              <span className="font-bold text-[#19251f]">100%</span>
            </div>
            <div className="flex justify-between text-[#6e7972]">
              <span>Aadhaar eKYC</span>
              <span className="font-bold text-emerald-700">Verified ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Digital eKYC Card + Resident Document Vault + Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* eKYC Digital Verification Card */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#274235] uppercase tracking-wider flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4" />
                <span>Digital eKYC Status</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {ekycStatus}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-[#19251f]">
              UIDAI & DigiLocker Verified Resident
            </h3>
            <p className="text-xs text-[#6e7972] leading-relaxed">
              Your identity is verified via Aadhaar OTP and PAN validation. Zero paper visits needed.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex justify-between items-center">
              <span className="text-[#6e7972]">Aadhaar:</span>
              <span className="font-bold text-[#19251f] font-mono">•••• •••• 1142</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex justify-between items-center">
              <span className="text-[#6e7972]">PAN Card:</span>
              <span className="font-bold text-[#19251f] font-mono">BLRPS••••A</span>
            </div>
          </div>

          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
          >
            View / Re-verify Digital eKYC
          </button>
        </div>

        {/* Resident Digital Document Vault */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#274235]" />
                <span>My Tenancy Documents</span>
              </h3>
              <span className="text-[11px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full">
                3 Files
              </span>
            </div>
            <p className="text-xs text-[#6e7972] mt-0.5">
              Secure PDF copies of your agreement and deposit slips
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {residentDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => alert(`Downloading ${doc.name}...`)}
                className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] hover:bg-white flex items-center justify-between cursor-pointer transition"
              >
                <div className="truncate pr-2 min-w-0 flex-1">
                  <div className="font-bold text-[#19251f] truncate">{doc.name}</div>
                  <div className="text-[10px] text-[#6e7972]">{doc.date} • {doc.size}</div>
                </div>
                <Download className="h-4 w-4 text-[#274235] shrink-0" />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (lastPaidInvoice) setSelectedReceiptInvoice(lastPaidInvoice);
              else alert('Loading your latest paid rent receipt...');
            }}
            className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
          >
            Download Latest Rent Receipt
          </button>
        </div>

        {/* Staywise Points & Rewards */}
        <div className="organic-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="h-4 w-4" />
              <span>Resident Rewards</span>
            </span>
            <div className="text-3xl font-black text-[#19251f] mt-1 font-tabular">
              {currentTenant?.rewardsBalance || 1250} SWP
            </div>
            <p className="text-xs text-[#6e7972] mt-1">
              Earned from 4 consecutive on-time rent payments via UPI / Autopay
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] space-y-1.5 text-xs">
            <span className="font-bold text-[#19251f] block">Redeem Points For:</span>
            <div className="text-[11px] text-[#6e7972]">• ₹500 off on next month rent</div>
            <div className="text-[11px] text-[#6e7972]">• Free quarterly AC filter service</div>
            <div className="text-[11px] text-[#6e7972]">• Swiggy / Zomato ₹250 voucher</div>
          </div>

          <button
            onClick={() => setActiveView('rentflow')}
            className="w-full py-2.5 rounded-2xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] font-bold text-xs transition"
          >
            View Rent Ledger & Points History
          </button>
        </div>
      </div>

      {/* Row 3: Roommates & Split Rent + Unit Electricity Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span 2: Roommates & Split Rent */}
        <div className="lg:col-span-2 organic-card p-6 flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eeece5]">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Roommates & Split Rent (Unit 302)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold">
                  {roommates.length} Co-Residents
                </span>
              </div>
              <p className="text-xs text-[#6e7972] mt-0.5">
                Automatically split monthly rent (₹28,700) + electricity (₹1,935) and collect via WhatsApp UPI
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSplitCalculatorModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Calculator className="h-3.5 w-3.5 text-[#274235]" />
                <span>Split Options</span>
              </button>
              <button
                onClick={() => setIsAddRoommateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add Roommate</span>
              </button>
            </div>
          </div>

          {/* Roommates Grid */}
          <div className="space-y-3">
            {roommates.map((rm) => (
              <div
                key={rm.id}
                className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white border border-[#e3e1d8] flex items-center justify-center font-black text-[#274235] text-xs shadow-sm">
                    {rm.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-extrabold text-[#19251f] flex items-center gap-2">
                      <span>{rm.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eef3f0] text-[#274235]">
                        {rm.splitPercentage}% Split
                      </span>
                      {rm.isPrimary && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          Primary Leasee
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6e7972] mt-0.5">
                      Rent: ₹{rm.rentShare.toLocaleString('en-IN')} + Power: ₹{rm.utilityShare.toLocaleString('en-IN')} • {rm.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eeece5]">
                  <div className="sm:text-right">
                    <div className="text-base font-black text-[#19251f] font-tabular">
                      ₹{rm.totalPayable.toLocaleString('en-IN')}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      rm.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rm.status === 'Paid' ? 'Settled via Autopay' : 'Share Due'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {rm.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleSendRoommateWhatsAppSplit(rm)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition"
                          title="Send split breakdown with UPI link to roommate"
                        >
                          <Send className="h-3 w-3" />
                          <span>WhatsApp Ping</span>
                        </button>
                        <button
                          onClick={() => handleMarkRoommatePaid(rm.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#274235] text-white text-xs font-bold hover:bg-[#1e352a] transition"
                        >
                          Mark Paid
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-xl">
                        ✓ Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6e7972]">
            <span>Total Apartment Cost: <b>₹30,635</b> (₹28,700 Rent + ₹1,935 Power)</span>
            <span className="text-[#274235] font-bold">100% Accounted across {roommates.length} Roommates</span>
          </div>
        </div>

        {/* Right Span 1: Unit Electricity Bill & Sharing */}
        <div className="organic-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4 w-4 fill-current" />
                <span>Apartment Electricity Bill</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                unit302Bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {unit302Bill.status}
              </span>
            </div>

            <div className="text-3xl font-black text-[#19251f] mt-2 font-tabular">
              ₹{unit302Bill.totalAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-[#6e7972] mt-0.5">
              {unit302Bill.billingMonth} • Due {unit302Bill.dueDate}
            </p>
          </div>

          {/* Uploaded Bill Attachment Preview if present */}
          {unit302Bill.attachmentName && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-extrabold text-[#19251f] truncate max-w-[150px] sm:max-w-[170px]">
                    {unit302Bill.attachmentName}
                  </div>
                  <div className="text-[10px] text-[#6e7972]">{unit302Bill.fileSize || 'PDF'} • Attached by Landlord</div>
                </div>
              </div>
              <button
                onClick={() => setIsViewBillDocModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-blue-800 font-bold text-[11px] border border-blue-300 transition shadow-sm"
              >
                View
              </button>
            </div>
          )}

          {/* Reading Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6e7972]">Discom Provider:</span>
              <span className="font-bold text-[#19251f]">{unit302Bill.discom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6e7972]">Meter Number:</span>
              <span className="font-mono font-bold text-[#19251f]">{unit302Bill.meterNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6e7972]">Consumption:</span>
              <span className="font-bold text-[#19251f]">{unit302Bill.unitsConsumed} kWh @ ₹{unit302Bill.ratePerUnit}/unit</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#eeece5]">
              <span className="text-[#6e7972]">Split Per Roommate:</span>
              <span className="font-bold text-[#274235]">₹{(unit302Bill.totalAmount / (roommates.length || 1)).toFixed(0)} / person</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsViewBillDocModalOpen(true)}
              className="w-full py-2 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <FileText className="h-3.5 w-3.5 text-[#274235]" />
              <span>View Official Scanned Bill</span>
            </button>

            <button
              onClick={handleShareUnitElectricityBill}
              className="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Bill with Roommates</span>
            </button>

            {unit302Bill.status === 'Due' ? (
              <button
                onClick={handlePayUnitElectricityBill}
                className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
              >
                Pay Full Electricity Bill (UPI)
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-2xl">
                ✓ Settled via UPI
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Service Requests & Maintenance Status (Unit 302 ONLY) */}
      <div className="organic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#19251f]">Your Apartment 302 Service Requests</h3>
            <p className="text-xs text-[#6e7972]">Live tracking for repairs reported in your unit</p>
          </div>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="text-xs font-bold text-[#274235] hover:underline flex items-center gap-1"
          >
            <span>+ New request</span>
          </button>
        </div>

        <div className="space-y-3">
          {tenantTickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#19251f]">{t.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#6e7972] border border-[#e3e1d8] font-semibold">
                    {t.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    t.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <p className="text-[11px] text-[#6e7972]">{t.description}</p>
                {t.scheduledDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#274235] font-semibold pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Vendor Scheduled: {t.scheduledDate} ({t.vendorName || 'Assigned Vendor'})</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] px-3 py-1 rounded-xl bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Digital eKYC Modal (Interactive Verification Flow) */}
      {isEKYCModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#e3e1d8] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Resident Digital eKYC Verification</h3>
              </div>
              <button onClick={() => setIsEKYCModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteEKYC} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 text-[#274235]">
                <span className="font-extrabold block text-sm">UIDAI & DigiLocker Digital Verification</span>
                <p className="text-[11px] mt-0.5 text-[#6e7972]">
                  Authenticates your identity directly against government databases for digital lease validity.
                </p>
              </div>

              {/* Aadhaar Number Input */}
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">12-Digit Aadhaar Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="5481 9028 1142"
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-mono focus:outline-none focus:border-[#274235]"
                  />
                  <button
                    type="button"
                    onClick={handleSendUIDAIOTP}
                    className="px-4 py-2.5 rounded-2xl bg-[#274235] text-white font-bold text-xs shrink-0"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* OTP Field */}
              {otpSent && (
                <div className="animate-in fade-in duration-150">
                  <label className="block text-[#19251f] font-semibold mb-1">Enter 6-Digit UIDAI OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 482910"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-mono text-center tracking-widest text-sm focus:outline-none focus:border-[#274235]"
                  />
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    Demo OTP sent: 482910
                  </span>
                </div>
              )}

              {/* PAN Card Input */}
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  required
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  placeholder="BLRPS9912A"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-mono uppercase focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] flex items-center justify-between text-[#6e7972]">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#274235]" />
                  <span>Live Facial Liveness Match:</span>
                </div>
                <span className="font-bold text-emerald-700">98.4% Matched ✓</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Digital eKYC Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Roommate Modal */}
      {isAddRoommateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#e3e1d8] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Add Roommate to Unit 302</h3>
              </div>
              <button onClick={() => setIsAddRoommateModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoommateSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 text-[#274235]">
                <span className="font-bold block">Automatic Rent & Utility Division</span>
                <p className="text-[11px] text-[#6e7972] mt-0.5">
                  Adding a roommate will divide the ₹28,700 rent and ₹1,935 power bill into equal shares of ₹{Math.round((28700 + 1935) / (roommates.length + 1)).toLocaleString('en-IN')}/person.
                </p>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Roommate Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aniket Joshi"
                  value={newRoommate.name}
                  onChange={(e) => setNewRoommate({ ...newRoommate, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">WhatsApp Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newRoommate.phone}
                  onChange={(e) => setNewRoommate({ ...newRoommate, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="aniket@example.com"
                  value={newRoommate.email}
                  onChange={(e) => setNewRoommate({ ...newRoommate, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Roommate & Enable UPI Split</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Split Rent Calculator Modal */}
      {isSplitCalculatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#e3e1d8] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#274235]" />
                <h3 className="font-extrabold text-base text-[#19251f]">Rent & Electricity Split Calculator</h3>
              </div>
              <button onClick={() => setIsSplitCalculatorModalOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Cost Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-center">
                  <span className="text-[10px] text-[#6e7972] block">Monthly Rent</span>
                  <span className="font-black text-sm text-[#19251f] mt-0.5 block">₹28,700</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] text-amber-800 block">Electricity Bill</span>
                  <span className="font-black text-sm text-amber-900 mt-0.5 block">₹1,935</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 text-center">
                  <span className="text-[10px] text-[#274235] block">Total to Split</span>
                  <span className="font-black text-sm text-[#274235] mt-0.5 block">₹30,635</span>
                </div>
              </div>

              {/* Split Mode Selector */}
              <div>
                <label className="block text-[#19251f] font-semibold mb-1.5">Split Allocation Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitMethod('EQUAL')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      splitMethod === 'EQUAL'
                        ? 'bg-[#274235] text-white border-[#274235]'
                        : 'bg-[#f7f6f2] border-[#e3e1d8] text-[#6e7972]'
                    }`}
                  >
                    <span>Equal Split (50% / 50%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMethod('CUSTOM')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      splitMethod === 'CUSTOM'
                        ? 'bg-[#274235] text-white border-[#274235]'
                        : 'bg-[#f7f6f2] border-[#e3e1d8] text-[#6e7972]'
                    }`}
                  >
                    <span>By Room Size (60% / 40%)</span>
                  </button>
                </div>
              </div>

              {/* Roommate Breakdown Table */}
              <div className="p-4 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] space-y-2.5">
                <span className="font-extrabold text-[#19251f] block">Per-Resident Calculation:</span>
                {roommates.map((rm, idx) => {
                  const pct = splitMethod === 'EQUAL' 
                    ? Math.round(100 / roommates.length) 
                    : (idx === 0 ? 55 : Math.round(45 / (roommates.length - 1)));
                  const amt = Math.round((30635 * pct) / 100);
                  return (
                    <div key={rm.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e3e1d8]">
                      <div>
                        <span className="font-bold text-[#19251f]">{rm.name}</span>
                        <div className="text-[10px] text-[#6e7972]">{pct}% Allocation</div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[#274235] text-sm">₹{amt.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-[#6e7972] block">Rent + Power</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSplitCalculatorModalOpen(false);
                    addNotification('Split Applied', 'Updated roommate rent and utility shares.', 'RENT');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md shadow-[#274235]/20 transition"
                >
                  Apply & Save Split Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Scanned / Uploaded Electricity Bill Document Preview Modal */}
      <ViewElectricityBillDocumentModal
        isOpen={isViewBillDocModalOpen}
        onClose={() => setIsViewBillDocModalOpen(false)}
        bill={unit302Bill}
        isTenant={true}
        onPayUPI={handlePayUnitElectricityBill}
      />
    </div>
  );
}
