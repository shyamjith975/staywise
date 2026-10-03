'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Settings as SettingsIcon, 
  Building2, 
  CreditCard, 
  Zap, 
  Bell, 
  ShieldCheck, 
  Users, 
  Save, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Smartphone, 
  Download, 
  Key, 
  Sliders,
  DollarSign
} from 'lucide-react';

export default function SettingsView() {
  const { currentUser, addNotification } = useAppState();

  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'RENT_RULES' | 'UTILITIES' | 'BANKING' | 'DELEGATES' | 'SECURITY'>('PORTFOLIO');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Form State: Portfolio & Entity
  const [entityName, setEntityName] = useState('Singhania Asset Holdings LLP');
  const [ownerName, setOwnerName] = useState('Vikram Singhania');
  const [panNumber, setPanNumber] = useState('AAACS1928K');
  const [gstin, setGstin] = useState('29AAACS1928K1Z5');
  const [supportPhone, setSupportPhone] = useState('+91 98450 11928');
  const [supportEmail, setSupportEmail] = useState('vikram.singhania@staywise.com');
  const [registeredAddress, setRegisteredAddress] = useState('Level 8, Prestige Trade Tower, Palace Road, Bengaluru 560001');

  // Form State: Rent Automation Rules
  const [rentDueDay, setRentDueDay] = useState(1);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeeType, setLateFeeType] = useState<'flat' | 'percentage'>('flat');
  const [lateFeeAmount, setLateFeeAmount] = useState(100);
  const [autoReminder7Days, setAutoReminder7Days] = useState(true);
  const [autoReminder3Days, setAutoReminder3Days] = useState(true);
  const [autoReminderDueDate, setAutoReminderDueDate] = useState(true);
  const [autoReminderOverdue1Day, setAutoReminderOverdue1Day] = useState(true);
  const [autoReminderOverdue7Days, setAutoReminderOverdue7Days] = useState(true);

  // Form State: Utility & Electricity Defaults
  const [defaultDiscom, setDefaultDiscom] = useState('BESCOM Bangalore');
  const [defaultRatePerUnit, setDefaultRatePerUnit] = useState(8.5);
  const [defaultFixedCharges, setDefaultFixedCharges] = useState(150);
  const [meterReadingCycle, setMeterReadingCycle] = useState('1st to 5th of every month');
  const [commonAreaPowerRatio, setCommonAreaPowerRatio] = useState(10);

  // Form State: Banking & UPI
  const [bankAccount, setBankAccount] = useState('918020048192842');
  const [ifsc, setIfsc] = useState('UTIB0000042');
  const [bankName, setBankName] = useState('Axis Bank (Escrow Banking Division)');
  const [upiId, setUpiId] = useState('staywise.escrow@axisbank');
  const [autoSweepCadence, setAutoSweepCadence] = useState('Daily at 18:00 IST');

  // Save handler
  const handleSaveSettings = () => {
    setIsSavedToast(true);
    addNotification('Settings Updated', 'Platform configurations and rent automation rules saved successfully.', 'SYSTEM');
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleExportBackup = () => {
    addNotification('Backup Created', 'Full portfolio records & ledger exported as encrypted JSON.', 'SYSTEM');
    alert('Exporting complete portfolio ledger, tenant contracts, and audit trail (ZIP/JSON)...');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e3e1d8]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#19251f]">
              Platform &amp; Portfolio Settings
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#eef3f0] text-[#274235] font-bold border border-[#274235]/20">
              Live Configuration
            </span>
          </div>
          <p className="text-xs text-[#6e7972] mt-0.5">
            Configure entity profile, automated rent schedules, electricity tariffs, and escrow payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="h-4 w-4 text-[#274235]" />
            <span>Export Full Backup</span>
          </button>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 flex items-center gap-2 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#eeece5] text-xs">
        <button
          onClick={() => setActiveTab('PORTFOLIO')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'PORTFOLIO'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Entity &amp; Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('RENT_RULES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'RENT_RULES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Rent &amp; Grace Period Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('UTILITIES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'UTILITIES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Electricity &amp; Utilities</span>
        </button>

        <button
          onClick={() => setActiveTab('BANKING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'BANKING'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payout Escrow &amp; UPI</span>
        </button>

        <button
          onClick={() => setActiveTab('DELEGATES')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'DELEGATES'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Managers &amp; Accountants</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'SECURITY'
              ? 'bg-[#19251f] text-white shadow-md shadow-[#19251f]/10'
              : 'text-[#6e7972] hover:text-[#19251f] hover:bg-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Security &amp; 2FA</span>
        </button>
      </div>

      {/* TAB 1: Portfolio & Legal Entity */}
      {activeTab === 'PORTFOLIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Asset Owner &amp; Legal Entity Information</h3>
              <p className="text-xs text-[#6e7972]">
                Appears on all official rent receipts, lease agreements, and Form 16/Schedule HP filings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Entity / Trust Legal Name</label>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Primary Landlord / Signatory</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Income Tax PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">GSTIN (Commercial Leases)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Official WhatsApp &amp; SMS Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Support &amp; Escrow Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#19251f] font-semibold mb-1">Registered Statutory Office Address</label>
                <input
                  type="text"
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Digital Seal &amp; Brand Stamp</h3>
              <p className="text-xs text-[#6e7972]">Auto-applied to digital rent receipts and eKYC tenant contracts</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-20 w-20 rounded-full border-4 border-[#274235] bg-white flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-[#274235]">SW</span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#19251f]">{entityName}</div>
                <div className="text-[11px] text-[#6e7972]">Staywise Verified Digital Signatory</div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                DSC Token Valid (eMudhra)
              </span>
            </div>

            <button
              onClick={() => alert('Certificate is active and synchronized with DigiLocker and MCA.')}
              className="w-full py-2.5 rounded-2xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] font-bold text-xs transition"
            >
              Update DSC Certificate
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Rent & Grace Period Rules */}
      {activeTab === 'RENT_RULES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Rent Collection Schedule &amp; Penalties</h3>
              <p className="text-xs text-[#6e7972]">
                Configure when invoices are generated, grace period before overdue fees, and late fee formulas
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Monthly Due Date</label>
                  <select
                    value={rentDueDay}
                    onChange={(e) => setRentDueDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  >
                    <option value={1}>1st of every month</option>
                    <option value={5}>5th of every month</option>
                    <option value={10}>10th of every month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Grace Period (Days)</label>
                  <select
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  >
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days (Recommended)</option>
                    <option value={7}>7 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3">
                <span className="font-extrabold text-[#19251f] block">Late Fee Computation</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#6e7972] font-semibold mb-1">Fee Mode</label>
                    <select
                      value={lateFeeType}
                      onChange={(e) => setLateFeeType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                    >
                      <option value="flat">Flat Per Day (₹)</option>
                      <option value="percentage">Percentage (1.5% / month)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#6e7972] font-semibold mb-1">Per Day Amount (₹)</label>
                    <input
                      type="number"
                      value={lateFeeAmount}
                      onChange={(e) => setLateFeeAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#6e7972]">
                  Late fees automatically accrue on the 6th day after the due date and are invoiced on the tenant portal.
                </p>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Automated Reminder Matrix</h3>
              <p className="text-xs text-[#6e7972]">
                Multichannel alerts sent to tenants via WhatsApp, SMS, Push, and Email
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">7 Days Before Due Date</span>
                  <span className="text-[11px] text-[#6e7972]">Friendly advance statement &amp; Autopay confirmation</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder7Days}
                  onChange={(e) => setAutoReminder7Days(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">3 Days Before Due Date</span>
                  <span className="text-[11px] text-[#6e7972]">WhatsApp reminder with 1-click UPI quick pay</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminder3Days}
                  onChange={(e) => setAutoReminder3Days(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">Due Date Morning (09:00 AM)</span>
                  <span className="text-[11px] text-[#6e7972]">Direct UPI dynamic QR dispatched on WhatsApp</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderDueDate}
                  onChange={(e) => setAutoReminderDueDate(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-[#19251f] block">1 Day Overdue (Grace Alert)</span>
                  <span className="text-[11px] text-[#6e7972]">Polite notification reminding 4 days remain before late fine</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderOverdue1Day}
                  onChange={(e) => setAutoReminderOverdue1Day(e.target.checked)}
                  className="h-4 w-4 accent-[#274235]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] cursor-pointer hover:bg-white transition">
                <div>
                  <span className="font-bold text-rose-700 block">7 Days Overdue (Formal Escalation)</span>
                  <span className="text-[11px] text-[#6e7972]">Overdue notice + manager phone follow-up task created</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminderOverdue7Days}
                  onChange={(e) => setAutoReminderOverdue7Days(e.target.checked)}
                  className="h-4 w-4 accent-rose-700"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Electricity & Utilities */}
      {activeTab === 'UTILITIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Electricity Board &amp; Sub-meter Defaults</h3>
              <p className="text-xs text-[#6e7972]">
                Applied when uploading or calculating monthly power bills for residential and commercial units
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Primary State Discom Provider</label>
                <select
                  value={defaultDiscom}
                  onChange={(e) => setDefaultDiscom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                >
                  <option value="BESCOM Bangalore">BESCOM (Bangalore Electricity Supply Co.)</option>
                  <option value="KSEB Kerala">KSEB (Kerala State Electricity Board)</option>
                  <option value="TANGEDCO Chennai">TANGEDCO (Tamil Nadu Generation &amp; Distribution)</option>
                  <option value="BSES Delhi">BSES Rajdhani / Yamuna (Delhi)</option>
                  <option value="MSEDCL Mumbai">MSEDCL (Maharashtra State Electricity)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Default Tariff / Unit (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={defaultRatePerUnit}
                    onChange={(e) => setDefaultRatePerUnit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Fixed Meter Charge / Mo (₹)</label>
                  <input
                    type="number"
                    value={defaultFixedCharges}
                    onChange={(e) => setDefaultFixedCharges(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Monthly Meter Reading Cycle</label>
                <input
                  type="text"
                  value={meterReadingCycle}
                  onChange={(e) => setMeterReadingCycle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">
                  Common Area Lighting &amp; Lift Allocation Ratio (%)
                </label>
                <input
                  type="number"
                  value={commonAreaPowerRatio}
                  onChange={(e) => setCommonAreaPowerRatio(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                />
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Sub-Meter Calibration &amp; IoT Smart Meters</h3>
              <p className="text-xs text-[#6e7972]">
                Automated pulse counters and photo OCR meter verification
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
                <span className="font-bold text-[#19251f]">Smart IoT Pulse Reader</span>
                <p className="text-[11px] text-[#6e7972]">
                  Reads kWh consumption directly from RS-485 Modbus meters every 24 hours.
                </p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  ✓ Online (12 Units Connected)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-1">
                <span className="font-bold text-[#19251f]">Caretaker Photo OCR Verification</span>
                <p className="text-[11px] text-[#6e7972]">
                  When caretaker uploads meter dial photograph, Staywise AI extracts kWh numbers automatically.
                </p>
                <span className="text-[10px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full inline-block mt-1">
                  AI OCR Active
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('All 12 sub-meters calibrated with official BESCOM master meter.')}
              className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
            >
              Calibrate Sub-Meters Now
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Payout Escrow & UPI */}
      {activeTab === 'BANKING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Primary Escrow Payout Bank Account</h3>
              <p className="text-xs text-[#6e7972]">
                Where collected tenant rents and security deposits are deposited and swept
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Escrow Bank &amp; Branch</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white text-[#19251f] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                  />
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#19251f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Dedicated UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-mono font-bold text-[#274235]"
                />
              </div>

              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Auto-Sweep Cadence to Landlord Operating Account</label>
                <select
                  value={autoSweepCadence}
                  onChange={(e) => setAutoSweepCadence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e3e1d8] bg-white font-bold text-[#19251f]"
                >
                  <option value="Daily at 18:00 IST">Daily at 18:00 IST (Default)</option>
                  <option value="Instant per Rent Payment">Instant per Rent Payment</option>
                  <option value="Weekly Every Monday">Weekly Every Monday</option>
                </select>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Escrow Trustee Verification</h3>
              <p className="text-xs text-[#6e7972]">RBI-regulated tri-party escrow structure</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Escrow Node Active</span>
              </div>
              <p className="text-[11px] text-[#274235] leading-relaxed">
                Rent is received directly in RBI-monitored escrow account. Landlord and vendor payouts are disbursed with automated digital audit logs.
              </p>
              <div className="pt-2 border-t border-[#274235]/20 flex justify-between font-bold text-[#19251f]">
                <span>Escrow Trustee:</span>
                <span>Axis Trustee Services Ltd.</span>
              </div>
            </div>

            <button
              onClick={() => alert('Bank statements and penny-drop test verified.')}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs shadow-sm transition"
            >
              Run Penny-Drop Re-Verification
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Managers & Accountants (Authorized Delegates) */}
      {activeTab === 'DELEGATES' && (
        <div className="organic-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eeece5]">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Authorized Delegate Access Control</h3>
              <p className="text-xs text-[#6e7972]">
                Grant scoped read/audit access to external Accountants, Property Managers, and Tax Consultants
              </p>
            </div>

            <button
              onClick={() => alert('Invite new Accountant or Property Manager with scoped permissions')}
              className="px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+ Invite New Delegate</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#19251f]">CA Rajesh K.</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                    Chartered Accountant
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[#6e7972]">rajesh.k@cacafe.in • +91 98410 44219</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Double-Entry Ledger</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Section 24 Tax P&amp;L</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Invoices &amp; TDS</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Permissions updated for CA Rajesh K.')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
                >
                  Configure Scope
                </button>
                <button
                  onClick={() => alert('Access suspended for CA Rajesh K.')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                  Revoke
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#19251f]">Arjun Das</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    Field Operations Manager
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-[#6e7972]">arjun.das@staywise.com • +91 94470 12891</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Leads &amp; Showing Visits</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Maintenance Work Orders</span>
                  <span className="text-[10px] bg-white border border-[#e3e1d8] text-[#19251f] px-2 py-0.5 rounded-md font-medium">Electricity Sub-Meters</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Permissions updated for Arjun Das')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition"
                >
                  Configure Scope
                </button>
                <button
                  onClick={() => alert('Access suspended for Arjun Das')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Security & 2FA */}
      {activeTab === 'SECURITY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Account Security &amp; MFA</h3>
              <p className="text-xs text-[#6e7972]">
                Protect portfolio bank withdrawals and sensitive lease agreements
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-[#274235]" />
                    <span>Two-Factor Authentication (2FA)</span>
                  </span>
                  <span className="text-[11px] text-[#6e7972]">SMS OTP + Google Authenticator Active</span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] block">Session Inactivity Timeout</span>
                  <span className="text-[11px] text-[#6e7972]">Auto-lock dashboard after 30 minutes of idle time</span>
                </div>
                <span className="text-xs font-bold text-[#19251f]">30 min</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#19251f] block">Audit Log Retention</span>
                  <span className="text-[11px] text-[#6e7972]">Immutable ledger and activity history archived</span>
                </div>
                <span className="text-xs font-bold text-[#274235]">7 Years Statutory</span>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Change Password</h3>
              <p className="text-xs text-[#6e7972]">Current user: {currentUser.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  defaultValue="Owner@123"
                  className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                />
              </div>
              <div>
                <label className="block text-[#19251f] font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter strong new password"
                  className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Password updated securely.')}
              className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-sm transition"
            >
              Update Security Password
            </button>
          </div>
        </div>
      )}

      {/* Floating Save Toast feedback */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#19251f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#274235] animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold">Settings and automation rules saved!</span>
        </div>
      )}
    </div>
  );
}
