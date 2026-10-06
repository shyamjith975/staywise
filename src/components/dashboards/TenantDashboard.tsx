'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  Gift, 
  FileText, 
  Download, 
  Zap, 
  Calendar,
  Fingerprint,
  X,
  Users,
  Share2,
  Send,
  UserPlus,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  ArrowUpRight,
  Sparkles
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
    electricityBills,
    updateElectricityBill
  } = useAppState();

  const currentTenant = tenants.find(t => t.id === 't-shyam') || tenants[0];
  const pendingInvoice = invoices.find(i => i.tenantId === currentTenant?.id && (i.status === 'Due' || i.status === 'Overdue'));
  const lastPaidInvoice = invoices.find(i => i.tenantId === currentTenant?.id && i.status === 'Paid');
  const tenantTickets = tickets.filter(t => t.unitNumber === '302');

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
    splitPercentage: 50
  });

  const unit302Bill = electricityBills.find(b => b.unitNumber === '302') || {
    id: 'eb-302',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Luxury Apartments',
    unitNumber: '302',
    tenantName: 'Shyam Sundar',
    discom: 'BESCOM Bangalore',
    meterNumber: 'BSC-MTR-9042',
    billingMonth: 'October 2026',
    billDate: '01 Oct 2026',
    dueDate: '15 Oct 2026',
    previousReading: 1020,
    currentReading: 1235,
    unitsConsumed: 215,
    ratePerUnit: 9.0,
    fixedCharges: 0,
    totalAmount: 1935,
    status: 'Due' as const,
    attachmentName: 'BESCOM_302_Oct2026.pdf',
    fileSize: '420 KB',
    verifiedOCR: true
  };

  const [isViewBillDocModalOpen, setIsViewBillDocModalOpen] = useState(false);
  const [ekycStatus, setEkycStatus] = useState<'Verified' | 'Pending'>('Verified');
  const [isEKYCModalOpen, setIsEKYCModalOpen] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('5481 9028 1142');
  const [panNumber, setPanNumber] = useState('BLRPS9912A');

  const residentDocs = [
    { id: 'rd-1', name: 'Digital Tenancy Agreement (Aadhaar eSigned)', size: '2.1 MB', date: 'Signed Oct 2026' },
    { id: 'rd-2', name: 'Security Deposit Escrow Certificate (₹60,000)', size: '420 KB', date: 'Verified' },
    { id: 'rd-3', name: 'Move-in Condition & Inventory Report', size: '1.8 MB', date: 'Attached 18 Photos' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#132A13]">
      {/* Resident Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DCE5D3]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#132A13]">
              Welcome home, {currentTenant?.name.split(' ')[0] || 'Shyam'}!
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-[#ECF39E] text-[#132A13] font-extrabold border border-[#132A13]/20 flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#31572C]" />
              <span>eKYC Verified</span>
            </span>
          </div>
          <p className="text-xs text-[#657D5C] mt-1 font-medium">
            Apartment {currentTenant?.unitNumber}, {currentTenant?.propertyName} • Active lease until {currentTenant?.leaseEnd}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEKYCModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#F3F6EE] text-[#132A13] text-xs font-bold border border-[#DCE5D3] transition shadow-2xs"
          >
            <Fingerprint className="h-4 w-4 text-[#31572C]" />
            <span>Digital ID</span>
          </button>
          <button
            onClick={() => setIsCreateTicketOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-bold shadow-xs transition"
          >
            <Wrench className="h-4 w-4" />
            <span>Request Repair</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Monthly Rent */}
        <div className="bg-[#F3F6EE] rounded-2xl p-4 border border-[#DCE5D3] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#657D5C]">Your Monthly Rent</div>
            <div className="text-xl font-black text-[#132A13] mt-0.5 font-tabular">
              ₹{pendingInvoice ? pendingInvoice.totalAmount.toLocaleString('en-IN') : '28,700'}
            </div>
            <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-amber-600" /> Due in 4 days (Oct 5)
            </span>
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
            className="px-4 py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-black shadow-xs transition border border-[#132A13]/20"
          >
            Pay UPI
          </button>
        </div>

        {/* Metric 2: Reliability Score */}
        <div className="bg-[#F3F6EE] rounded-2xl p-4 border border-[#DCE5D3] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#657D5C]">Reliability Score</div>
            <div className="text-xl font-black text-[#132A13] mt-0.5 font-tabular">
              {currentTenant?.reliabilityScore || 96} / 100
            </div>
            <span className="text-[10px] font-bold text-[#31572C] mt-1 block">
              ✓ 100% On-Time Record
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#DCE5D3] text-[#31572C] flex items-center justify-center font-bold shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-[#31572C]" />
          </div>
        </div>

        {/* Metric 3: Resident Points & Rewards */}
        <div className="bg-[#F3F6EE] rounded-2xl p-4 border border-[#DCE5D3] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#657D5C]">Resident Points</div>
            <div className="text-xl font-black text-[#132A13] mt-0.5 font-tabular">
              {currentTenant?.rewardsBalance || 1250} SWP
            </div>
            <span className="text-[10px] font-bold text-[#4F772D] mt-1 block">
              Redeemable for ₹500 off rent
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white border border-[#DCE5D3] text-[#4F772D] flex items-center justify-center font-bold shadow-2xs">
            <Gift className="h-5 w-5 text-[#4F772D]" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Resident Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Span 8: Roommates Split + Documents */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Roommates & Split Rent Card */}
          <div className="rounded-3xl bg-white border border-[#DCE5D3] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8EFE2] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#132A13]">Roommates &amp; Split Rent (Unit 302)</h3>
                <p className="text-xs text-[#657D5C]">Split rent (₹28,700) + BESCOM power (₹1,935) via WhatsApp UPI</p>
              </div>
              <button
                onClick={() => setIsAddRoommateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-bold transition flex items-center gap-1 shadow-2xs"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add Roommate</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {roommates.map((rm) => (
                <div
                  key={rm.id}
                  className="p-3.5 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#132A13] text-[#ECF39E] font-black flex items-center justify-center text-xs shrink-0">
                      {rm.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-[#132A13] flex items-center gap-1.5">
                        <span>{rm.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] font-black">
                          {rm.splitPercentage}% Split
                        </span>
                      </div>
                      <div className="text-[11px] text-[#657D5C]">
                        Rent: ₹{rm.rentShare.toLocaleString('en-IN')} + Power: ₹{rm.utilityShare.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DCE5D3]">
                    <span className="font-black text-sm text-[#132A13] font-tabular">
                      ₹{rm.totalPayable.toLocaleString('en-IN')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rm.status === 'Paid' ? 'bg-[#EBF0E6] text-[#31572C] border border-[#31572C]/30' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {rm.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tenancy Documents */}
          <div className="rounded-3xl bg-white border border-[#DCE5D3] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#132A13]">My Tenancy Documents</h3>
            <div className="space-y-2">
              {residentDocs.map(doc => (
                <div key={doc.id} className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-[#31572C] shrink-0" />
                    <span className="font-bold text-[#132A13] truncate">{doc.name}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    className="p-1.5 rounded-full hover:bg-[#EBF0E6] text-[#657D5C] hover:text-[#132A13] transition"
                  >
                    <Download className="h-3.5 w-3.5 text-[#31572C]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Span 4: Power Bill & Service Requests */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Unit Electricity Bill */}
          <div className="rounded-3xl bg-[#F3F6EE] border border-[#DCE5D3] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#132A13] flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Unit Electricity Bill</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                unit302Bill.status === 'Paid' ? 'bg-[#EBF0E6] text-[#31572C]' : 'bg-amber-100 text-amber-900'
              }`}>
                {unit302Bill.status}
              </span>
            </div>

            <div className="text-2xl font-black text-[#132A13] font-tabular">
              ₹{unit302Bill.totalAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-[#657D5C]">{unit302Bill.discom} • Due {unit302Bill.dueDate}</p>

            <button
              onClick={() => {
                updateElectricityBill('eb-302', { status: 'Paid' });
                alert('Power bill marked paid via UPI!');
              }}
              className="w-full py-2 rounded-full bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-bold shadow-xs transition"
            >
              Pay Electricity Bill
            </button>
          </div>

          {/* Service Requests */}
          <div className="rounded-3xl bg-white border border-[#DCE5D3] p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#132A13]">Active Repairs</h3>
            <div className="space-y-2 text-xs">
              {tenantTickets.map(t => (
                <div key={t.id} className="p-3 rounded-2xl bg-[#F3F6EE] border border-[#DCE5D3] space-y-1">
                  <div className="flex justify-between font-bold text-[#132A13]">
                    <span>{t.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECF39E] text-[#132A13] font-black">{t.status}</span>
                  </div>
                  <p className="text-[11px] text-[#657D5C]">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal Add Roommate */}
      {isAddRoommateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#132A13]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCE5D3] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8EFE2]">
              <h3 className="font-extrabold text-base text-[#132A13]">Add Roommate to Unit 302</h3>
              <button onClick={() => setIsAddRoommateModalOpen(false)} className="text-[#657D5C] hover:text-[#132A13]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const added: Roommate = {
                id: `rm-${Date.now()}`,
                name: newRoommate.name,
                phone: newRoommate.phone,
                email: newRoommate.email,
                splitPercentage: newRoommate.splitPercentage,
                rentShare: Math.round(28700 * (newRoommate.splitPercentage / 100)),
                utilityShare: Math.round(1935 * (newRoommate.splitPercentage / 100)),
                totalPayable: Math.round(30635 * (newRoommate.splitPercentage / 100)),
                status: 'Pending',
                isPrimary: false
              };
              setRoommates([...roommates, added]);
              setIsAddRoommateModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#657D5C] font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={newRoommate.name}
                  onChange={e => setNewRoommate({ ...newRoommate, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[#657D5C] font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={newRoommate.phone}
                  onChange={e => setNewRoommate({ ...newRoommate, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] font-bold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#132A13] text-[#ECF39E] font-bold text-xs hover:bg-[#31572C] transition"
              >
                Save Roommate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
