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
  Receipt
} from 'lucide-react';

export default function FinancialAnalyticsView() {
  const { properties, invoices, addNotification } = useAppState();
  const [timeframe, setTimeframe] = useState<'FY26-27' | '12M' | 'Q2' | 'MTD'>('FY26-27');

  const handleExportPL = () => {
    addNotification('P&L Statement Exported', 'Downloaded Schedule HP & CA-certified P&L Report for FY 2026-27.', 'RENT');
    alert('Exporting CA-Certified Financial Statement & Section 24 Tax Computation (PDF)...');
  };

  const handleDownloadAudit = () => {
    addNotification('Audit Report Ready', 'Downloaded full statutory double-entry audit report.', 'RENT');
    alert('Downloading Statutory Double-Entry Audit Trail & Reconciliation Report...');
  };

  const propertyPerformances = [
    {
      name: 'Beach Road Luxury Apartments',
      location: 'Kozhikode, Kerala',
      units: '12 Units',
      inflow: 344400,
      opex: 28000,
      noi: 316400,
      assetValue: '₹4.50 Cr',
      yieldRate: '8.4%'
    },
    {
      name: 'Koramangala Co-living Suite',
      location: 'Bengaluru, Karnataka',
      units: '6 Suites',
      inflow: 180000,
      opex: 18500,
      noi: 161500,
      assetValue: '₹2.10 Cr',
      yieldRate: '9.2%'
    },
    {
      name: 'Wayanad Plantation & Villa',
      location: 'Wayanad, Kerala',
      units: 'Estate Asset',
      inflow: 450000,
      opex: 52000,
      noi: 398000,
      assetValue: '₹4.20 Cr',
      yieldRate: '11.4%'
    },
    {
      name: 'Commercial Tech Park Unit 304',
      location: 'Whitefield, Bengaluru',
      units: 'Commercial',
      inflow: 195000,
      opex: 14000,
      noi: 181000,
      assetValue: '₹2.80 Cr',
      yieldRate: '7.8%'
    }
  ];

  const expensesBreakdown = [
    { category: 'Property Maintenance & AMC', amount: 48500, pct: 43, color: 'bg-emerald-600' },
    { category: 'Municipal Property Taxes', amount: 24000, pct: 21, color: 'bg-[#274235]' },
    { category: 'Comprehensive Insurance', amount: 16500, pct: 15, color: 'bg-blue-600' },
    { category: 'Escrow Trustee & Legal Reserve', amount: 14000, pct: 12, color: 'bg-amber-600' },
    { category: 'Sub-meter Power & Utilities', amount: 9500, pct: 9, color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Financial Analytics & Portfolio Yield
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              CA Reconciled
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Capital Allocation • Net Operating Income (NOI) • Section 24 Income Tax Deductions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#e3e1d8] text-xs">
            {(['FY26-27', '12M', 'Q2', 'MTD'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  timeframe === t ? 'bg-[#274235] text-white shadow-sm' : 'text-[#6e7972] hover:text-[#19251f]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportPL}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <FileText className="h-4 w-4 text-[#274235]" />
            <span>Export Tax P&L</span>
          </button>

          <button
            onClick={handleDownloadAudit}
            className="px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Download Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Analytical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6e7972]">Gross Portfolio Yield</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +1.2% YoY
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#19251f] font-tabular mt-2">
            8.4%
          </div>
          <span className="text-[11px] text-[#6e7972] mt-1 block">
            vs 6.2% Bangalore Tier-1 Benchmark
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6e7972]">Annual Net Operating Income (NOI)</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Healthy
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#19251f] font-tabular mt-2">
            ₹1,04,20,000
          </div>
          <span className="text-[11px] text-[#6e7972] mt-1 block">
            ₹8,68,333 / month after OpEx
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6e7972]">Collection Efficiency</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Autopay 87%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-tabular mt-2">
            98.2%
          </div>
          <span className="text-[11px] text-[#6e7972] mt-1 block">
            ₹11.7L of ₹11.9L cleared within due date
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6e7972]">Operating Expense Ratio (OpEx)</span>
            <span className="text-[10px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full">
              Target &lt; 15%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#19251f] font-tabular mt-2">
            12.8%
          </div>
          <span className="text-[11px] text-[#6e7972] mt-1 block">
            ₹1,12,500 total monthly expenses
          </span>
        </div>
      </div>

      {/* Row 2: 12-Month Cashflow Graph & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Span 7: Cashflow Trends */}
        <div className="lg:col-span-7 organic-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Monthly Inflow vs Outflow Trends</h3>
              <p className="text-xs text-[#6e7972]">Real-time escrow receipts vs operating expenditure</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#274235]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#274235]" /> Inflows (Rent)
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
                    <stop offset="0%" stopColor="#274235" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#274235" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#eeece5" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#eeece5" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#eeece5" strokeDasharray="3 3" />

                {/* Inflow Wave (Rent collections) */}
                <path
                  d="M0 130 C60 125, 100 80, 160 85 C220 90, 260 50, 320 45 C380 40, 420 70, 480 60 C540 50, 570 35, 600 30"
                  stroke="#274235"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M0 130 C60 125, 100 80, 160 85 C220 90, 260 50, 320 45 C380 40, 420 70, 480 60 C540 50, 570 35, 600 30 L600 180 L0 180 Z"
                  fill="url(#inflowGrad)"
                />

                {/* Outflow Line (Maintenance & taxes) */}
                <path
                  d="M0 160 C60 155, 100 150, 160 145 C220 140, 260 155, 320 148 C380 140, 420 152, 480 145 C540 140, 570 142, 600 138"
                  stroke="#f43f5e"
                  strokeWidth="2.2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] sm:text-[11px] text-[#6e7972] pt-2 px-1">
              <span>Nov &apos;25</span>
              <span className="hidden sm:inline">Jan &apos;26</span>
              <span>Mar &apos;26</span>
              <span className="hidden sm:inline">May &apos;26</span>
              <span>Jul &apos;26</span>
              <span className="hidden sm:inline">Sep &apos;26</span>
              <span className="font-bold text-[#274235]">Oct &apos;26 (Live)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex items-center justify-between text-xs text-[#6e7972]">
            <span>Net Monthly Surplus: <b className="text-[#19251f]">₹10,57,500</b></span>
            <span className="font-bold text-[#274235]">100% Retained in Escrow</span>
          </div>
        </div>

        {/* Right Span 5: Expense Categories Breakdown */}
        <div className="lg:col-span-5 organic-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#19251f]">Operating Expense Breakdown</h3>
            <p className="text-xs text-[#6e7972]">Monthly operational cost allocation (₹1,12,500 Total)</p>
          </div>

          <div className="space-y-3 text-xs">
            {expensesBreakdown.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#19251f]">{exp.category}</span>
                  <span className="font-black font-tabular text-[#19251f]">₹{exp.amount.toLocaleString('en-IN')} ({exp.pct}%)</span>
                </div>
                <div className="w-full bg-[#f4f3ef] h-2 rounded-full overflow-hidden">
                  <div className={`${exp.color} h-full rounded-full`} style={{ width: `${exp.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#eeece5] flex items-center justify-between text-[11px] text-[#6e7972]">
            <span>Statutory Cap: Below 15% NOI</span>
            <span className="font-bold text-emerald-700">Tax Deductible ✓</span>
          </div>
        </div>
      </div>

      {/* Row 3: Asset-Wise Performance Table + Section 24 Tax Computation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Span 8: Asset Performance Table */}
        <div className="lg:col-span-8 organic-card overflow-hidden">
          <div className="p-5 border-b border-[#eeece5] bg-[#fbfbfa] flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#19251f]">Asset-Level Net Yield Performance</h3>
              <p className="text-xs text-[#6e7972]">Individual asset NOI and gross rental yield calculations</p>
            </div>
            <span className="text-xs font-bold text-[#274235] bg-[#eef3f0] px-2.5 py-1 rounded-full">
              4 Portfolios Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f6f2] text-[#6e7972] border-b border-[#e3e1d8] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-3 text-right">Inflow / mo</th>
                  <th className="py-3 px-3 text-right">OpEx / mo</th>
                  <th className="py-3 px-3 text-right">NOI / mo</th>
                  <th className="py-3 px-3 text-right">Capital Value</th>
                  <th className="py-3 px-4 text-center">Net Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece5]">
                {propertyPerformances.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#fbfbfa] transition">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-[#19251f]">{p.name}</div>
                      <div className="text-[11px] text-[#6e7972]">{p.location} • {p.units}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-black font-tabular text-[#19251f]">
                      ₹{p.inflow.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-tabular text-rose-600 font-semibold">
                      -₹{p.opex.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-black font-tabular text-[#274235]">
                      ₹{p.noi.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-tabular text-[#6e7972]">
                      {p.assetValue}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full text-xs">
                        {p.yieldRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Span 4: Section 24 Income Tax Computation */}
        <div className="lg:col-span-4 organic-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#19251f] flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-[#274235]" />
                <span>Section 24 Tax Computation</span>
              </h3>
              <span className="text-[10px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full">
                FY 2026-27
              </span>
            </div>
            <p className="text-xs text-[#6e7972] mt-0.5">
              Income from House Property calculations for statutory ITR filing
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6e7972]">Gross Annual Value (GAV):</span>
              <span className="font-bold text-[#19251f]">₹1,40,40,000</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: Municipal Taxes Paid:</span>
              <span className="font-bold">-₹48,000</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#eeece5] font-bold">
              <span>Net Annual Value (NAV):</span>
              <span className="text-[#19251f]">₹1,39,92,000</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: 30% Std Deduction u/s 24(a):</span>
              <span className="font-bold">-₹41,97,600</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: Borrowing Interest u/s 24(b):</span>
              <span className="font-bold">-₹2,00,000</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-[#274235] font-black text-sm">
              <span className="text-[#19251f]">Net Taxable House Income:</span>
              <span className="text-[#274235] font-tabular">₹95,94,400</span>
            </div>
          </div>

          <button
            onClick={() => alert('Generated ITR Schedule HP Summary with verified digital ledger cross-references.')}
            className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
          >
            Generate Schedule HP Computation
          </button>
        </div>
      </div>
    </div>
  );
}
