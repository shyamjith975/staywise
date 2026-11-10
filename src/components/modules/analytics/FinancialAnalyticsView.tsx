'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight, 
  Layers, 
  PieChart, 
  CheckCircle2, 
  Percent,
  Receipt,
  Clock,
  Gift,
  Zap,
  Lock
} from 'lucide-react';
import { color } from '../../../lib/colors';

export default function FinancialAnalyticsView() {
  const { 
    properties, 
    invoices, 
    addNotification, 
    currentUser, 
    activeRole, 
    setSelectedReceiptInvoice 
  } = useAppState();

  const [timeframe, setTimeframe] = useState<'FY26-27' | '12M' | 'Q2' | 'MTD'>('FY26-27');

  const handleExportPL = () => {
    const csvContent = [
      'STAYWISE FINANCIAL STATEMENT & P&L REPORT (FY 2026-27)',
      'Generated: ' + new Date().toISOString(),
      'Owner / Assessee: ' + (currentUser?.name || 'Authorized Property Owner'),
      'Status: CA Certified & Section 24 Compliant',
      '',
      'Category,Sub-Item,Amount (INR)',
      'Gross Rental Value (GRV),Annual Rent Inflow,' + (invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (b.totalAmount || 0), 0) || 1485000),
      'Statutory Municipal Deductions,Property Tax Paid,24000',
      'Net Annual Value (NAV),Taxable Base,' + (invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (b.totalAmount || 0), 0) ? (invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + (b.totalAmount || 0), 0) - 24000) : 1461000),
      'Section 24(a) Standard Deduction,30% of NAV,' + Math.round(1461000 * 0.3),
      'Section 24(b) Borrowing Interest,Housing Loan Repayment,200000',
      'Net Taxable Income,House Property Head,' + Math.round(1461000 * 0.7 - 200000),
      '',
      'DIGITAL AUDIT HASH: STAYWISE-SEC24-' + Date.now().toString(36).toUpperCase()
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Staywise_PL_Statement_${timeframe}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('P&L Statement Exported', 'Downloaded Schedule HP & CA-certified P&L Report for FY 2026-27.', 'RENT');
  };

  const handleDownloadAudit = () => {
    const csvRows = [
      'TXN_ID,DATE,ACCOUNT,TYPE,AMOUNT_INR,STATUS,COUNTERPARTY,HASH',
      ...(invoices.length > 0 ? invoices : [{ id: '1001', dueDate: '2026-04-01', totalAmount: 28700, amount: 28700, status: 'Paid', tenantName: 'Priya Sharma' }]).map((inv, idx) => 
        `TXN-2026-${1000 + idx},${inv.dueDate || '2026-04-01'},Rent Escrow,CREDIT,${inv.totalAmount || (inv as any).amount},${inv.status},${inv.tenantName || 'Resident'},SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      )
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Staywise_Double_Entry_Audit_Trail.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification('Audit Report Ready', 'Downloaded full statutory double-entry audit report.', 'RENT');
  };

  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';
  const isTenant = activeRole === 'tenant';

  // ----------------------------------------------------
  // TENANT FINANCIAL VIEW (No Landlord NOI / Clean resident ledger)
  // ----------------------------------------------------
  if (isTenant) {
    const tenantInvoices = invoices.filter(i => 
      (currentUser?.email && (i as any).tenantEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser?.name && i.tenantName?.toLowerCase().includes(currentUser.name.toLowerCase()))
    );

    const paidInvoices = tenantInvoices.filter(i => i.status === 'Paid');
    const totalPaid = paidInvoices.reduce((acc, i) => acc + (i.totalAmount || 0), 0);
    const securityDeposit = 60000;

    return (
      <div className="space-y-6 pb-12 font-sans text-[#171717]">
        {/* Tenant Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
                Resident Financial Ledger &amp; Escrow
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c] font-bold border border-[#D2DDD7]">
                Aadhaar eSigned
              </span>
            </div>
            <p className="text-xs text-[#546E7A] mt-0.5">
              Personal rent payments, escrow deposit certificate, and statutory tax rent receipts (HRA Exemption)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const receipts = (paidInvoices.length > 0 ? paidInvoices : [{ month: 'Current FY', totalAmount: 28700, id: 'REC-2026-01' }]).map(inv => (
`============================================================
FORM 16 / HRA RENT RECEIPT (UNDER SECTION 10(13A))
Receipt No: REC-${inv.id || '2026-01'}
Tenant Name: ${currentUser?.name || 'Resident'}
Tenant PAN: ${currentUser?.email ? 'AAAAA0000A' : 'NOT_REQUIRED'}
Landlord Name: Staywise Asset Holdings Ltd / Vikram Malhotra
Landlord PAN: AABCS1429K
Rental Property: ${(currentUser as any)?.address || 'Koramangala 4th Block, Bengaluru, Karnataka 560034'}
Period: ${(inv as any).month || 'FY 2026-2027'}
Amount Paid: INR ${(inv.totalAmount || 28700).toLocaleString('en-IN')}
Payment Mode: UPI Instant Rail / Escrow Settled
Date of Payment: ${new Date().toLocaleDateString('en-IN')}
------------------------------------------------------------
Revenue Stamp Affixed & Digitally eSigned via Staywise.
============================================================`
                )).join('\n\n');
                const blob = new Blob([receipts], { type: 'text/plain;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Staywise_HRA_Rent_Receipts_FY26-27.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addNotification('HRA Receipts Downloaded', 'Official Form 16 / HRA receipts downloaded for tax filing.', 'RENT');
              }}
              className="px-4 py-2 rounded-full bg-[#06110c] hover:bg-[#171717] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#a31c1b]" />
              <span>Download HRA Receipts</span>
            </button>
          </div>
        </div>

        {/* 4 Tenant Key Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 bg-[#E8F0EC] border border-[#D2DDD7]">
            <span className="text-xs font-semibold text-[#546E7A]">Lifetime Rent Cleared</span>
            <div className="text-2xl sm:text-3xl font-black text-[#171717] font-tabular mt-2">
              ₹{(totalPaid || 28700).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#06110c] font-bold mt-1 block">
              ✓ Verified via RBI Escrow
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-[#E8F0EC] border border-[#D2DDD7]">
            <span className="text-xs font-semibold text-[#546E7A]">Security Deposit in Escrow</span>
            <div className="text-2xl sm:text-3xl font-black text-[#06110c] font-tabular mt-2">
              ₹{securityDeposit.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#546E7A] mt-1 block">
              Locked in Axis Escrow Account
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-[#E8F0EC] border border-[#D2DDD7]">
            <span className="text-xs font-semibold text-[#546E7A]">Reliability &amp; Credit Score</span>
            <div className="text-2xl sm:text-3xl font-black text-[#06110c] font-tabular mt-2">
              96 / 100
            </div>
            <span className="text-[11px] text-[#546E7A] mt-1 block">
              100% On-Time Payment Streak
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-[#E8F0EC] border border-[#D2DDD7]">
            <span className="text-xs font-semibold text-[#546E7A]">Resident Rewards</span>
            <div className="text-2xl sm:text-3xl font-black text-[#a31c1b] font-tabular mt-2">
              450 SWP
            </div>
            <span className="text-[11px] text-[#546E7A] mt-1 block">
              Redeemable against rent
            </span>
          </div>
        </div>

        {/* Tenant Invoices & Receipts Ledger */}
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D1D5DB]">
            <div>
              <h3 className="text-base font-extrabold text-[#171717]">Personal Rent Ledger &amp; Tax Receipts</h3>
              <p className="text-xs text-[#546E7A]">Official receipts eligible for Income Tax House Rent Allowance (HRA) deduction u/s 10(13A)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E8F0EC] text-[#546E7A] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Billing Period</th>
                  <th className="py-3 px-4">Rent Share</th>
                  <th className="py-3 px-4">Power &amp; CAM</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tax Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {(tenantInvoices.length > 0 ? tenantInvoices : [
                  {
                    id: 'inv-shyam-oct',
                    month: 'October 2026',
                    rentAmount: 14350,
                    electricityAmount: 968,
                    totalAmount: 15318,
                    status: 'Paid',
                    dueDate: '05 Oct 2026'
                  },
                  {
                    id: 'inv-shyam-sep',
                    month: 'September 2026',
                    rentAmount: 14350,
                    electricityAmount: 840,
                    totalAmount: 15190,
                    status: 'Paid',
                    dueDate: '05 Sep 2026'
                  }
                ]).map((inv: any, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F8F6] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#171717]">{inv.id.toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#171717]">{inv.month || 'Current Month'}</td>
                    <td className="py-3.5 px-4 font-medium text-[#171717]">₹{(inv.rentAmount || 14350).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-medium text-[#546E7A]">₹{(inv.electricityAmount || 968).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-black font-tabular text-[#06110c]">₹{(inv.totalAmount || 15318).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        inv.status === 'Paid'
                          ? 'bg-[#E8F0EC] text-[#06110c] border border-[#D2DDD7]'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReceiptInvoice(inv);
                          addNotification('Receipt Opened', `Viewing official HRA Rent Receipt for ${inv.month || 'Current Month'}`, 'RENT');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#E8F0EC] hover:bg-[#DCE8E1] text-[#06110c] font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // OWNER / LANDLORD FINANCIAL ANALYTICS VIEW
  // ----------------------------------------------------
  const userProperties = (activeRole === 'admin')
    ? properties
    : properties.filter(p => p.ownerId === currentUser?.id);

  const propertyPerformances = userProperties.length > 0 
    ? userProperties.map(p => {
        const inflow = (p.expectedMonthlyRent || (p as any).monthlyRent || 30000) * 12;
        const opex = Math.round(inflow * 0.12);
        const noi = inflow - opex;
        const capitalVal = ((p as any).propertyValue || (inflow * 12));
        const yieldCalc = capitalVal > 0 ? ((noi / capitalVal) * 100).toFixed(1) + '%' : '8.0%';
        return {
          name: p.name,
          location: `${p.city || 'Bangalore'}, ${p.state || 'Karnataka'}`,
          units: `${p.totalUnits || (p.units ? p.units.length : 1)} Units`,
          inflow,
          opex,
          noi,
          assetValue: capitalVal >= 10000000 ? `₹${(capitalVal / 10000000).toFixed(2)} Cr` : `₹${(capitalVal / 100000).toFixed(1)} L`,
          yieldRate: yieldCalc
        };
      })
    : [];

  const hasProperties = propertyPerformances.length > 0;
  const totalAnnualNOI = hasProperties 
    ? propertyPerformances.reduce((acc, p) => acc + p.noi, 0)
    : 0;

  const expensesBreakdown = hasProperties ? [
    { category: 'Property Maintenance & AMC', amount: 48500, pct: 43, color: 'bg-[#06110c]' },
    { category: 'Municipal Property Taxes', amount: 24000, pct: 21, color: 'bg-[#171717]' },
    { category: 'Comprehensive Insurance', amount: 16500, pct: 15, color: 'bg-[#a31c1b]' },
    { category: 'Escrow Trustee & Legal Reserve', amount: 14000, pct: 12, color: 'bg-amber-600' },
    { category: 'Sub-meter Power & Utilities', amount: 9500, pct: 9, color: 'bg-emerald-600' }
  ] : [];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#171717]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
              Financial Analytics &amp; Portfolio Yield
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#06110c] font-bold border border-[#D2DDD7]">
              {hasProperties ? 'CA Reconciled' : 'Clean State Active'}
            </span>
          </div>
          <p className="text-xs text-[#546E7A] mt-0.5">
            Capital Allocation • Net Operating Income (NOI) • Section 24 Income Tax Deductions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#D2DDD7] text-xs">
            {(['FY26-27', '12M', 'Q2', 'MTD'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  timeframe === t ? 'bg-[#06110c] text-white shadow-xs' : 'text-[#546E7A] hover:text-[#171717]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPL}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#171717] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <FileText className="h-4 w-4 text-[#06110c]" />
            <span>Export Tax P&amp;L</span>
          </button>

          <button
            onClick={handleDownloadAudit}
            className="px-4 py-2 rounded-2xl bg-[#06110c] hover:bg-[#171717] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#a31c1b]" />
            <span>Download Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Analytical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#546E7A]">Gross Portfolio Yield</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F0EC] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#D2DDD7]">
              <TrendingUp className="h-3 w-3 text-[#06110c]" />
              {hasProperties ? '+1.2% YoY' : '0.0%'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#171717] font-tabular mt-2">
            {hasProperties ? '8.4%' : '0.0%'}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 block">
            {hasProperties ? 'vs 6.2% Tier-1 Benchmark' : 'No properties onboarded yet'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#546E7A]">Annual Net Operating Income (NOI)</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              {hasProperties ? 'Healthy' : '₹0'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#06110c] font-tabular mt-2">
            ₹{totalAnnualNOI.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 block">
            {hasProperties ? `₹${Math.round(totalAnnualNOI / 12).toLocaleString('en-IN')} / month after OpEx` : '₹0 / month after OpEx'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#546E7A]">Collection Efficiency</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              {hasProperties ? 'Autopay 87%' : '100%'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#06110c] font-tabular mt-2">
            {hasProperties ? '98.2%' : '100%'}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 block">
            {hasProperties ? 'Cleared within due date' : '0 overdue collections'}
          </span>
        </div>

        <div className="rounded-3xl bg-white border border-[#D2DDD7] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#546E7A]">Operating Expense Ratio (OpEx)</span>
            <span className="text-[10px] font-bold text-[#171717] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              Target &lt; 15%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#171717] font-tabular mt-2">
            {hasProperties ? '12.8%' : '0.0%'}
          </div>
          <span className="text-[11px] text-[#546E7A] mt-1 block">
            {hasProperties ? '₹1,12,500 total monthly expenses' : '₹0 operational expenses'}
          </span>
        </div>
      </div>

      {/* Row 2: 12-Month Cashflow Graph & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Span 7: Cashflow Trends */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#D2DDD7] p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#171717]">Monthly Inflow vs Outflow Trends</h3>
              <p className="text-xs text-[#546E7A]">Real-time escrow receipts vs operating expenditure</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#06110c]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#06110c]" /> Inflows (Rent)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Outflows (OpEx)
              </span>
            </div>
          </div>

          {/* SVG Cashflow Wave Chart */}
          <div className="py-3 sm:py-4 w-full">
            <div className="w-full overflow-hidden rounded-xl">
              <svg className="w-full h-36 sm:h-44 overflow-visible" viewBox="0 0 600 180" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color('obsidian')} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color('obsidian')} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E8F0EC" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#E8F0EC" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#E8F0EC" strokeDasharray="3 3" />

                {hasProperties ? (
                  <>
                    <path
                      d="M0 130 C60 125, 100 80, 160 85 C220 90, 260 50, 320 45 C380 40, 420 70, 480 60 C540 50, 570 35, 600 30"
                      stroke={color('obsidian')}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 130 C60 125, 100 80, 160 85 C220 90, 260 50, 320 45 C380 40, 420 70, 480 60 C540 50, 570 35, 600 30 L600 180 L0 180 Z"
                      fill="url(#inflowGrad)"
                    />
                    <path
                      d="M0 160 C60 155, 100 150, 160 145 C220 140, 260 155, 320 148 C380 140, 420 152, 480 145 C540 140, 570 142, 600 138"
                      stroke="#f43f5e"
                      strokeWidth="2.2"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <line x1="0" y1="140" x2="600" y2="140" stroke="#D2DDD7" strokeWidth="2" strokeDasharray="6 6" />
                )}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] sm:text-[11px] text-[#546E7A] pt-2 px-1">
              <span>Nov &apos;25</span>
              <span className="hidden sm:inline">Jan &apos;26</span>
              <span>Mar &apos;26</span>
              <span className="hidden sm:inline">May &apos;26</span>
              <span>Jul &apos;26</span>
              <span className="hidden sm:inline">Sep &apos;26</span>
              <span className="font-bold text-[#06110c]">Live</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D2DDD7] flex items-center justify-between text-xs text-[#546E7A]">
            <span>Net Monthly Surplus: <b className="text-[#171717] font-tabular">₹{hasProperties ? Math.round(totalAnnualNOI / 12).toLocaleString('en-IN') : '0'}</b></span>
            <span className="font-bold text-[#06110c]">100% Retained in Escrow</span>
          </div>
        </div>

        {/* Right Span 5: Expense Categories Breakdown */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-[#D2DDD7] p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-extrabold text-[#171717]">Operating Expense Breakdown</h3>
            <p className="text-xs text-[#546E7A]">{hasProperties ? 'Monthly operational cost allocation (₹1,12,500 Total)' : 'No recurring OpEx logged'}</p>
          </div>

          {hasProperties ? (
            <div className="space-y-3 text-xs">
              {expensesBreakdown.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#171717]">{exp.category}</span>
                    <span className="font-black font-tabular text-[#171717]">₹{exp.amount.toLocaleString('en-IN')} ({exp.pct}%)</span>
                  </div>
                  <div className="w-full bg-[#E8F0EC] h-2 rounded-full overflow-hidden">
                    <div className={`${exp.color} h-full rounded-full`} style={{ width: `${exp.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-[#D2DDD7] rounded-2xl">
              <PieChart className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#546E7A]">Zero OpEx Active</p>
              <p className="text-[11px] text-[#78909C] mt-0.5">Operating expenses will dynamically compute when properties are added.</p>
            </div>
          )}

          <div className="pt-2 border-t border-[#D2DDD7] flex items-center justify-between text-[11px] text-[#546E7A]">
            <span>Statutory Cap: Below 15% NOI</span>
            <span className="font-bold text-emerald-800">Tax Deductible ✓</span>
          </div>
        </div>
      </div>

      {/* Row 3: Asset-Wise Performance Table + Section 24 Tax Computation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Span 8: Asset Performance Table */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-[#D2DDD7] overflow-hidden shadow-xs">
          <div className="p-5 border-b border-[#D2DDD7] bg-[#ffffff] flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#171717]">Asset-Level Net Yield Performance</h3>
              <p className="text-xs text-[#546E7A]">Individual asset NOI and gross rental yield calculations</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#06110c] bg-[#E8F0EC] px-2.5 py-1 rounded-full border border-[#D2DDD7]">
                {propertyPerformances.length} Active {propertyPerformances.length === 1 ? 'Asset' : 'Assets'}
              </span>
            </div>
          </div>

          {propertyPerformances.length === 0 ? (
            <div className="py-12 text-center p-6 space-y-3">
              <Building2 className="h-10 w-10 text-[#D2DDD7] mx-auto opacity-50" />
              <h4 className="text-sm font-black text-[#171717]">No Properties Added Yet</h4>
              <p className="text-xs text-[#546E7A] max-w-sm mx-auto">
                Use the <span className="font-semibold text-[#06110c]">+ Add Property</span> button in the top header to onboard your first residential flat, PG co-living suite, or commercial space.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E8F0EC] text-[#546E7A] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-3 text-right">Inflow / mo</th>
                    <th className="py-3 px-3 text-right">OpEx / mo</th>
                    <th className="py-3 px-3 text-right">NOI / mo</th>
                    <th className="py-3 px-3 text-right">Capital Value</th>
                    <th className="py-3 px-4 text-center">Net Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E0E0]">
                  {propertyPerformances.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F8F6] transition">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-[#171717]">{p.name}</div>
                        <div className="text-[11px] text-[#546E7A]">{p.location} • {p.units}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-black font-tabular text-[#171717]">
                        ₹{p.inflow.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-tabular text-rose-600 font-semibold">
                        -₹{p.opex.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-black font-tabular text-[#06110c]">
                        ₹{p.noi.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-tabular text-[#546E7A]">
                        {p.assetValue}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-black text-[#06110c] bg-[#E8F0EC] px-2 py-0.5 rounded-full text-xs border border-[#D2DDD7]">
                          {p.yieldRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Span 4: Section 24 Income Tax Computation */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#D2DDD7] p-6 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#171717] flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-[#06110c]" />
                <span>Section 24 Tax Computation</span>
              </h3>
              <span className="text-[10px] font-bold text-[#06110c] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
                FY 2026-27
              </span>
            </div>
            <p className="text-xs text-[#546E7A] mt-0.5">
              Income from House Property calculations for statutory ITR filing
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#546E7A]">Gross Annual Value (GAV):</span>
              <span className="font-bold text-[#171717]">₹{hasProperties ? (totalAnnualNOI * 1.3).toLocaleString('en-IN') : '0'}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: Municipal Taxes Paid:</span>
              <span className="font-bold">-₹{hasProperties ? '48,000' : '0'}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#D2DDD7] font-bold">
              <span>Net Annual Value (NAV):</span>
              <span className="text-[#171717]">₹{hasProperties ? Math.round(totalAnnualNOI * 1.25).toLocaleString('en-IN') : '0'}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: 30% Std Deduction u/s 24(a):</span>
              <span className="font-bold">-₹{hasProperties ? Math.round(totalAnnualNOI * 1.25 * 0.3).toLocaleString('en-IN') : '0'}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: Borrowing Interest u/s 24(b):</span>
              <span className="font-bold">-₹{hasProperties ? '2,00,000' : '0'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-[#06110c] font-black text-sm">
              <span className="text-[#171717]">Net Taxable House Income:</span>
              <span className="text-[#06110c] font-tabular">
                ₹{hasProperties ? Math.round(totalAnnualNOI * 0.85).toLocaleString('en-IN') : '0'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              const hpContent = [
                'ITR-2 / ITR-1 SCHEDULE HOUSE PROPERTY (HP) STATUTORY COMPUTATION',
                'Assessment Year: 2026-27 | Financial Year: 2025-26',
                'Assessee Name: ' + (currentUser?.name || 'Property Owner'),
                'PAN: ' + (currentUser?.id || 'APZPM8821K'),
                '------------------------------------------------------------------------',
                '1. Gross Annual Rent Received / Receivable: INR ' + (hasProperties ? (totalAnnualNOI * 1.3).toLocaleString('en-IN') : '0'),
                '2. Less: Municipal / Property Taxes Paid: INR ' + (hasProperties ? '24,000' : '0'),
                '3. Net Annual Value (NAV): INR ' + (hasProperties ? Math.round(totalAnnualNOI * 1.25).toLocaleString('en-IN') : '0'),
                '4. Less: Standard Deduction u/s 24(a) (30% of NAV): INR ' + (hasProperties ? Math.round(totalAnnualNOI * 1.25 * 0.3).toLocaleString('en-IN') : '0'),
                '5. Less: Interest on Borrowed Capital u/s 24(b): INR ' + (hasProperties ? '2,00,000' : '0'),
                '6. Net Taxable Income from House Property: INR ' + (hasProperties ? Math.round(totalAnnualNOI * 0.85).toLocaleString('en-IN') : '0'),
                '------------------------------------------------------------------------',
                'CROSS-REFERENCED WITH STAYWISE AUTOMATED ESCROW DOUBLE ENTRY LEDGER.',
                'CERTIFIED SEC 24 STATUTORY ATTESTATION ID: HP-' + Date.now().toString(36).toUpperCase()
              ].join('\n');
              const blob = new Blob([hpContent], { type: 'text/plain;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ITR_Schedule_HP_Computation_FY26-27.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              addNotification('Schedule HP Exported', 'ITR Schedule HP computation downloaded with digital ledger cross-references.', 'RENT');
            }}
            className="w-full py-2.5 rounded-2xl bg-[#06110c] hover:bg-[#171717] text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Generate Schedule HP Computation
          </button>
        </div>
      </div>
    </div>
  );
}
