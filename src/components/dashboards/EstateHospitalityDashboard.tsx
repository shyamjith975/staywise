'use client';

import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Trees, 
  Calendar, 
  Building2, 
  Users, 
  Zap, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  Share2, 
  Send, 
  Lock, 
  Key, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  Sliders, 
  Flame, 
  Coffee, 
  Wifi, 
  Wrench,
  X,
  FileText,
  UserCheck,
  BedDouble,
  Check,
  Phone
} from 'lucide-react';

interface EstateBooking {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  villaName: string;
  campus: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  channel: 'Airbnb' | 'Booking.com' | 'Direct VIP' | 'Corporate';
  totalAmount: number;
  depositStatus: 'Escrow Locked' | 'Collected' | 'Refunded';
  status: 'Checked-In' | 'Arriving Today' | 'Confirmed' | 'Checked-Out';
  smartLockPin: string;
}

export default function EstateHospitalityDashboard({ initialTab = 'OVERVIEW' }: { initialTab?: string }) {
  const { estateAssets, staff, utilities, addNotification, activeView, setActiveView } = useAppState();

  const validTabs = ['OVERVIEW', 'BOOKINGS', 'VILLAS', 'HOUSEKEEPING', 'ASSETS', 'STAFF', 'PRICING'];
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOOKINGS' | 'VILLAS' | 'HOUSEKEEPING' | 'ASSETS' | 'STAFF' | 'PRICING'>(() => {
    const formatted = initialTab.toUpperCase();
    return validTabs.includes(formatted) ? (formatted as any) : 'OVERVIEW';
  });
  const [selectedCampus, setSelectedCampus] = useState<'Wayanad' | 'Alibaug' | 'Goa' | 'Munnar'>('Wayanad');

  // Mapping between EstateOS internal tabs and global activeView IDs
  const tabToViewMap: Record<string, string> = {
    OVERVIEW: 'dashboard',
    BOOKINGS: 'bookings',
    VILLAS: 'villas',
    HOUSEKEEPING: 'housekeeping',
    ASSETS: 'assets',
    STAFF: 'staff',
    PRICING: 'pricing'
  };

  const viewToTabMap: Record<string, 'OVERVIEW' | 'BOOKINGS' | 'VILLAS' | 'HOUSEKEEPING' | 'ASSETS' | 'STAFF' | 'PRICING'> = {
    dashboard: 'OVERVIEW',
    overview: 'OVERVIEW',
    estate: 'OVERVIEW',
    bookings: 'BOOKINGS',
    villas: 'VILLAS',
    housekeeping: 'HOUSEKEEPING',
    assets: 'ASSETS',
    staff: 'STAFF',
    pricing: 'PRICING'
  };

  const handleTabClick = (tab: 'OVERVIEW' | 'BOOKINGS' | 'VILLAS' | 'HOUSEKEEPING' | 'ASSETS' | 'STAFF' | 'PRICING') => {
    setActiveTab(tab);
    if (tabToViewMap[tab] && setActiveView) {
      setActiveView(tabToViewMap[tab]);
    }
  };

  // Sync when activeView or initialTab updates from sidebar / mobile nav
  React.useEffect(() => {
    if (activeView && viewToTabMap[activeView]) {
      setActiveTab(viewToTabMap[activeView]);
    } else if (initialTab) {
      const formatted = initialTab.toUpperCase();
      if (validTabs.includes(formatted)) {
        setActiveTab(formatted as any);
      }
    }
  }, [activeView, initialTab]);

  // Bookings state
  const [bookings, setBookings] = useState<EstateBooking[]>([
    {
      id: 'bk-101',
      guestName: 'Vikram & Maya Singhania',
      phone: '+91 98450 11928',
      email: 'vikram.singhania@staywise.com',
      villaName: 'Serene Mist Master Villa (5BHK)',
      campus: 'Wayanad Plantation Campus',
      checkIn: '01 Oct 2026',
      checkOut: '05 Oct 2026',
      nights: 4,
      guestsCount: 6,
      channel: 'Direct VIP',
      totalAmount: 140000,
      depositStatus: 'Escrow Locked',
      status: 'Checked-In',
      smartLockPin: '4821#'
    },
    {
      id: 'bk-102',
      guestName: 'David & Sarah Jenkins',
      phone: '+44 7911 123456',
      email: 'd.jenkins@uktravel.co.uk',
      villaName: 'Tea Valley Sunset Suite A',
      campus: 'Wayanad Plantation Campus',
      checkIn: '01 Oct 2026',
      checkOut: '06 Oct 2026',
      nights: 5,
      guestsCount: 2,
      channel: 'Airbnb',
      totalAmount: 42500,
      depositStatus: 'Escrow Locked',
      status: 'Arriving Today',
      smartLockPin: '9182#'
    },
    {
      id: 'bk-103',
      guestName: 'TechStar Founders Offsite (12 Pax)',
      phone: '+91 98190 44211',
      email: 'founder@techstar.io',
      villaName: 'Beachfront Haven Luxury Villa',
      campus: 'Alibaug Beachfront Haven',
      checkIn: '06 Oct 2026',
      checkOut: '10 Oct 2026',
      nights: 4,
      guestsCount: 12,
      channel: 'Corporate',
      totalAmount: 280000,
      depositStatus: 'Escrow Locked',
      status: 'Confirmed',
      smartLockPin: '3310#'
    },
    {
      id: 'bk-104',
      guestName: 'Anya & Siddharth Malhotra',
      phone: '+91 98200 55182',
      email: 'anya.m@fashionhouse.com',
      villaName: 'Goa Sunset Pool Villa 2',
      campus: 'Goa Sunset Boutique Pool Villa',
      checkIn: '30 Sep 2026',
      checkOut: '04 Oct 2026',
      nights: 4,
      guestsCount: 4,
      channel: 'Booking.com',
      totalAmount: 64000,
      depositStatus: 'Collected',
      status: 'Checked-In',
      smartLockPin: '7749#'
    }
  ]);

  // Housekeeping Turnovers
  const [turnovers, setTurnovers] = useState([
    { id: 'hk-1', room: 'Suite A (Sunset Wing)', status: 'Cleaning In Progress', housekeeper: 'Sunita D.', eta: '14:30 IST', inspected: false },
    { id: 'hk-2', room: 'Private Pool Villa 3', status: 'Inspected & Sanitized', housekeeper: 'Ramu K.', eta: 'Ready', inspected: true },
    { id: 'hk-3', room: 'Tea Valley Cottage 2', status: 'Needs Turnover', housekeeper: 'Sunita D.', eta: '16:00 IST', inspected: false },
    { id: 'hk-4', room: 'Alibaug Pool Villa A', status: 'Inspected & Sanitized', housekeeper: 'Shambhu', eta: 'Ready', inspected: true },
  ]);

  // Modal: Add Reservation
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [newResForm, setNewResForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    villaName: 'Serene Mist Master Villa (5BHK)',
    campus: 'Wayanad Plantation Campus',
    checkIn: '10 Oct 2026',
    checkOut: '14 Oct 2026',
    nights: 4,
    guestsCount: 4,
    channel: 'Airbnb' as const,
    totalAmount: 95000,
  });

  const handleSendDigitalKeyWhatsApp = (bk: EstateBooking) => {
    const text = `🌴 *Welcome to Staywise Luxury Estates & Hospitality* 🏡\n\nDear ${bk.guestName.split(' ')[0]},\nWe are delighted to host your stay at *${bk.villaName}* (${bk.campus})!\n\n📅 *Stay Dates:* ${bk.checkIn} → ${bk.checkOut} (${bk.nights} Nights)\n🔐 *Smart Lock Digital Passcode:* *${bk.smartLockPin}*\n📍 *GPS Coordinates & Map:* https://maps.staywise.app/serene-mist\n📶 *Private Starlink High-Speed WiFi:* SSID: *Staywise_Guest_5G* | Pass: *SereneMist2026*\n☕ *Private Caretaker & Butler:* Ramu (+91 94470 12891)\n\nHave a magical and relaxing stay!`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${bk.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    addNotification('Digital Key Dispatched', `WhatsApp luxury welcome guide and smart lock PIN sent to ${bk.guestName}.`, 'SYSTEM');
  };

  const handleAddReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EstateBooking = {
      id: `bk-${Date.now()}`,
      guestName: newResForm.guestName,
      phone: newResForm.phone,
      email: newResForm.email,
      villaName: newResForm.villaName,
      campus: newResForm.campus,
      checkIn: newResForm.checkIn,
      checkOut: newResForm.checkOut,
      nights: Number(newResForm.nights),
      guestsCount: Number(newResForm.guestsCount),
      channel: newResForm.channel,
      totalAmount: Number(newResForm.totalAmount),
      depositStatus: 'Escrow Locked',
      status: 'Confirmed',
      smartLockPin: `${Math.floor(1000 + Math.random() * 9000)}#`
    };

    setBookings([created, ...bookings]);
    setIsAddReservationOpen(false);
    addNotification('Reservation Confirmed', `New ${newResForm.channel} booking logged for ${created.guestName} (₹${created.totalAmount.toLocaleString('en-IN')}).`, 'SYSTEM');
  };

  const handleSyncOTAs = () => {
    addNotification('OTA Channels Synced', 'Updated real-time calendars across Airbnb, Booking.com, and Agoda.', 'SYSTEM');
    alert('Synchronization complete! All calendars, nightly tariffs, and smart-lock timecodes synced across Airbnb Superhost & Booking.com Genius.');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Hospitality Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#DCE5D3]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#132A13] flex items-center gap-2">
              <Trees className="h-6 w-6 text-[#31572C]" />
              <span>EstateOS — Villas &amp; Campuses • Airbnb &amp; Hotels</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF0E6] text-[#31572C] font-bold border border-[#31572C]/20">
              Host Operations
            </span>
          </div>
          <p className="text-xs text-[#657D5C] mt-0.5">
            Luxury Villa Management • Short-Stay Airbnb &amp; Boutique Hotel Suites • Dynamic Nightly Pricing • Guest Smart Check-In
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Campus Switcher */}
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value as any)}
            className="px-3 py-2 rounded-2xl bg-white border border-[#DCE5D3] text-xs font-bold text-[#132A13] focus:outline-none focus:ring-2 focus:ring-[#31572C] shadow-2xs"
          >
            <option value="Wayanad">Wayanad Serene Mist Plantation (5BHK)</option>
            <option value="Alibaug">Alibaug Beachfront Haven &amp; Suites</option>
            <option value="Goa">Goa Sunset Boutique Pool Villa</option>
            <option value="Munnar">Cloud Valley Heritage Retreat</option>
          </select>

          <button
            onClick={handleSyncOTAs}
            className="px-3 py-2 rounded-2xl bg-white hover:bg-[#F3F6EE] border border-[#DCE5D3] text-[#132A13] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            title="Sync with Airbnb iCal & Booking.com API"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#31572C]" />
            <span>Sync OTAs</span>
          </button>

          <button
            onClick={() => setIsAddReservationOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#132A13] hover:bg-[#31572C] text-[#ECF39E] text-xs font-bold shadow-md shadow-[#132A13]/20 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Booking</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657D5C]">Hospitality Revenue (Oct)</span>
            <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2 py-0.5 rounded-full">
              +24% YoY
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#132A13] font-tabular mt-2">
            ₹14,85,000
          </div>
          <span className="text-[11px] text-[#657D5C] mt-1 block">
            RevPAR: ₹8,250/night across 4 Campuses
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657D5C]">Villa &amp; Suite Occupancy</span>
            <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2 py-0.5 rounded-full">
              High Season
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#31572C] font-tabular mt-2">
            91.4%
          </div>
          <span className="text-[11px] text-[#657D5C] mt-1 block">
            28 Nights booked in Oct (Airbnb + Direct)
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657D5C]">Active In-House Guests</span>
            <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2 py-0.5 rounded-full">
              18 Guests
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#132A13] font-tabular mt-2">
            4 Stays Live
          </div>
          <span className="text-[11px] text-[#657D5C] mt-1 block">
            2 Check-ins Today • 1 Check-out Tomorrow
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#657D5C]">Campus Solar &amp; Microgrid</span>
            <span className="text-[10px] font-bold text-[#31572C] bg-[#EBF0E6] px-2 py-0.5 rounded-full">
              Net Surplus
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#31572C] font-tabular mt-2">
            +1,520 kWh
          </div>
          <span className="text-[11px] text-[#657D5C] mt-1 block">
            100% Eco-Sustainable • Generator Idle
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E8EFE2] text-xs">
        <button
          onClick={() => handleTabClick('OVERVIEW')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#4F772D]" />
          <span>Host Overview</span>
        </button>

        <button
          onClick={() => handleTabClick('BOOKINGS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'BOOKINGS'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Calendar className="h-4 w-4 text-[#4F772D]" />
          <span>Airbnb &amp; Hotel Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('VILLAS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'VILLAS'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Villas &amp; Campuses (4)</span>
        </button>

        <button
          onClick={() => handleTabClick('HOUSEKEEPING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'HOUSEKEEPING'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <BedDouble className="h-4 w-4 text-[#4F772D]" />
          <span>Housekeeping Turnovers</span>
        </button>

        <button
          onClick={() => handleTabClick('ASSETS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'ASSETS'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Campus Physical Assets ({estateAssets.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('STAFF')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'STAFF'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Estate Staff ({staff.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('PRICING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'PRICING'
              ? 'bg-[#132A13] text-[#ECF39E] shadow-sm'
              : 'text-[#657D5C] hover:text-[#132A13] hover:bg-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Dynamic Pricing &amp; OTAs</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Row: Active Check-Ins Today + Turnovers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7: Today's Guest Check-Ins & Stays */}
            <div className="lg:col-span-7 organic-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eeece5]">
                <div>
                  <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-rose-600" />
                    <span>Today&apos;s Guest Stays &amp; Digital Access</span>
                  </h3>
                  <p className="text-xs text-[#6e7972]">Live guests in-house, check-in time, and Smart Lock PINs</p>
                </div>
                <button
                  onClick={() => setActiveTab('BOOKINGS')}
                  className="text-xs font-bold text-[#274235] hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 3).map((bk) => (
                  <div
                    key={bk.id}
                    className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-[#19251f] text-sm">{bk.guestName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          bk.channel === 'Airbnb' ? 'bg-rose-100 text-rose-800' :
                          bk.channel === 'Booking.com' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {bk.channel}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                          {bk.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#6e7972]">
                        {bk.villaName} • {bk.checkIn} → {bk.checkOut} ({bk.nights}N • {bk.guestsCount} Guests)
                      </div>

                      <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                        <span className="text-[#6e7972]">Smart Lock:</span>
                        <span className="font-bold text-[#274235] bg-white px-2 py-0.5 rounded-md border border-[#e3e1d8]">
                          {bk.smartLockPin}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="text-right mr-1">
                        <div className="font-black text-sm text-[#19251f] font-tabular">
                          ₹{bk.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold">{bk.depositStatus}</div>
                      </div>

                      <button
                        onClick={() => handleSendDigitalKeyWhatsApp(bk)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
                        title="Send WhatsApp Welcome Guide & Digital Key"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">WhatsApp Key</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5: Housekeeping Turnover Pipeline */}
            <div className="lg:col-span-5 organic-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#eeece5]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-blue-600" />
                      <span>Housekeeping Turnovers</span>
                    </h3>
                    <p className="text-xs text-[#6e7972]">Room sanitization and guest arrival readiness</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs">
                  {turnovers.map((t) => (
                    <div key={t.id} className="p-3 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#19251f]">{t.room}</div>
                        <div className="text-[11px] text-[#6e7972] mt-0.5">
                          Assigned: {t.housekeeper} • {t.eta}
                        </div>
                      </div>

                      <div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          t.status === 'Inspected & Sanitized' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'Cleaning In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('HOUSEKEEPING')}
                className="w-full py-2.5 rounded-2xl bg-[#f4f3ef] hover:bg-[#274235] hover:text-white text-[#19251f] font-bold text-xs transition"
              >
                Open Housekeeping Checklist
              </button>
            </div>
          </div>

          {/* Row: Campus Assets & Solar Generation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6e7972] flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>10 kW Rooftop Solar Grid</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Generating 38.5 kWh Today
                </span>
              </div>
              <div className="text-xl font-black text-[#19251f] font-tabular">
                100% Campus Powered
              </div>
              <p className="text-[11px] text-[#6e7972]">
                Net-metering surplus to KSEB grid. Zero grid power draw during day hours.
              </p>
            </div>

            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6e7972] flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-[#274235]" />
                  <span>15 kVA Silent DG Backup</span>
                </span>
                <span className="text-[10px] font-bold text-[#274235] bg-[#eef3f0] px-2 py-0.5 rounded-full">
                  Fuel: 82% (120 Liters)
                </span>
              </div>
              <div className="text-xl font-black text-[#19251f] font-tabular">
                Auto-Mains Failure (AMF)
              </div>
              <p className="text-[11px] text-[#6e7972]">
                Instant switchover in &lt; 8 seconds. Service AMC valid through Nov 2026.
              </p>
            </div>

            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6e7972] flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-blue-600" />
                  <span>Infinity Pool &amp; UV Filtration</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  pH 7.2 • Clean
                </span>
              </div>
              <div className="text-xl font-black text-[#19251f] font-tabular">
                Heated Pool 28°C
              </div>
              <p className="text-[11px] text-[#6e7972]">
                Dual Hayward sand filters and UV sanitizer operating on automated cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS (AIRBNB & HOTELS) */}
      {activeTab === 'BOOKINGS' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#eeece5]">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-rose-600" />
                <span>Airbnb, Hotels &amp; Direct Villa Reservations</span>
              </h3>
              <p className="text-xs text-[#6e7972]">
                Unified multi-channel calendar across Airbnb Superhost, Booking.com, and Direct Concierge
              </p>
            </div>

            <button
              onClick={() => setIsAddReservationOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold shadow-md shadow-[#274235]/20 flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>+ New Booking</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f6f2] text-[#6e7972] border-b border-[#e3e1d8] text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Guest Details</th>
                  <th className="py-3 px-3">Villa / Suite</th>
                  <th className="py-3 px-3">Dates &amp; Nights</th>
                  <th className="py-3 px-3">Channel</th>
                  <th className="py-3 px-3">Smart Lock PIN</th>
                  <th className="py-3 px-3 text-right">Payout (₹)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece5] text-[#19251f]">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#fbfbfa] transition">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-[#19251f]">{bk.guestName}</div>
                      <div className="text-[11px] text-[#6e7972]">{bk.phone} • {bk.guestsCount} Guests</div>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {bk.villaName}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-[#19251f]">{bk.checkIn} → {bk.checkOut}</div>
                      <div className="text-[10px] text-[#6e7972]">{bk.nights} Nights</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bk.channel === 'Airbnb' ? 'bg-rose-100 text-rose-800' :
                        bk.channel === 'Booking.com' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {bk.channel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#274235]">
                      {bk.smartLockPin}
                    </td>
                    <td className="py-3 px-3 text-right font-black font-tabular text-[#19251f]">
                      ₹{bk.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bk.status === 'Checked-In' ? 'bg-emerald-100 text-emerald-800' :
                        bk.status === 'Arriving Today' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleSendDigitalKeyWhatsApp(bk)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1 transition"
                      >
                        <Send className="h-3 w-3" />
                        <span>WhatsApp Key</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VILLAS & CAMPUSES */}
      {activeTab === 'VILLAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="organic-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#274235] bg-[#eef3f0] px-2.5 py-0.5 rounded-full">
                  Flagship Estate
                </span>
                <h3 className="text-lg font-black text-[#19251f] mt-1.5">
                  Serene Mist Estate &amp; 5BHK Villa
                </h3>
                <p className="text-xs text-[#6e7972] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#274235]" />
                  <span>Vythiri Tea Valley, Wayanad, Kerala • 12 Acre Private Campus</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#19251f] font-tabular">₹35,000</div>
                <div className="text-[10px] text-[#6e7972]">per night (Whole Villa)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2 text-xs">
              <div className="font-extrabold text-[#19251f]">Amenities &amp; Features:</div>
              <div className="grid grid-cols-2 gap-2 text-[#6e7972]">
                <div>• 5 King Suites with Valley Balcony</div>
                <div>• Private Heated Infinity Pool</div>
                <div>• Starlink High-Speed Internet</div>
                <div>• 10 kW Solar + 15 kVA Generator</div>
                <div>• Private Chef &amp; Butler Quarters</div>
                <div>• Organic Coffee &amp; Tea Trail</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-emerald-700">● Live on Airbnb Superhost &amp; Direct</span>
              <button
                onClick={() => alert('Updated Wayanad Villa calendar and base rates.')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] font-bold text-[#19251f] shadow-sm transition"
              >
                Configure Tariffs
              </button>
            </div>
          </div>

          <div className="organic-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Beachfront Campus
                </span>
                <h3 className="text-lg font-black text-[#19251f] mt-1.5">
                  Beachfront Haven &amp; Luxury Suites
                </h3>
                <p className="text-xs text-[#6e7972] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-700" />
                  <span>Awas Beach Road, Alibaug, Maharashtra • 4 Pool Villas + 6 Suites</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#19251f] font-tabular">₹28,000</div>
                <div className="text-[10px] text-[#6e7972]">per night (Pool Villa)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2 text-xs">
              <div className="font-extrabold text-[#19251f]">Amenities &amp; Features:</div>
              <div className="grid grid-cols-2 gap-2 text-[#6e7972]">
                <div>• Direct Private Beach Access</div>
                <div>• Plunge Pools in every villa</div>
                <div>• Rooftop Sundeck &amp; Barbecue</div>
                <div>• Smart Yale Digital Door Locks</div>
                <div>• 24/7 Security &amp; Concierge Desk</div>
                <div>• Corporate Offsite AV Conference Hall</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-emerald-700">● Live on Booking.com &amp; Airbnb</span>
              <button
                onClick={() => alert('Updated Alibaug Beachfront calendar and base rates.')}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] font-bold text-[#19251f] shadow-sm transition"
              >
                Configure Tariffs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOUSEKEEPING */}
      {activeTab === 'HOUSEKEEPING' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eeece5]">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-blue-600" />
                <span>Housekeeping &amp; Villa Turnover Management</span>
              </h3>
              <p className="text-xs text-[#6e7972]">Sanitization logs, fresh linen replacement, and room turnaround SLAs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {turnovers.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-black text-sm text-[#19251f]">{t.room}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'Inspected & Sanitized' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'Cleaning In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1 text-[#6e7972]">
                  <div>Housekeeper: <b className="text-[#19251f]">{t.housekeeper}</b></div>
                  <div>Turnaround SLA: <b className="text-[#19251f]">{t.eta}</b></div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#e3e1d8] space-y-1 text-[11px] text-[#19251f]">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="h-3 w-3" />
                    <span>Linen &amp; Towels Fresh 400TC Egyptian Cotton</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="h-3 w-3" />
                    <span>Pool Water Tested &amp; Vacuumed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Check className="h-3 w-3" />
                    <span>Smart Lock Passcode Rotated</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Marked ${t.room} as Inspected and Guest-Ready!`)}
                  className="w-full py-2 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs transition"
                >
                  Mark Inspected &amp; Guest-Ready
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PHYSICAL ASSETS */}
      {activeTab === 'ASSETS' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#274235]" />
              <span>Campus Physical Assets &amp; AMC Registry</span>
            </h3>
            <p className="text-xs text-[#6e7972]">Critical infrastructure tracking for private estates, power grids, and water</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {estateAssets.map((asset) => (
              <div key={asset.id} className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] space-y-2.5 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#274235] font-bold">{asset.tag}</span>
                    <h4 className="font-extrabold text-[#19251f] text-sm mt-0.5">{asset.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    asset.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asset.condition}
                  </span>
                </div>

                <div className="space-y-1 text-[#6e7972] text-[11px]">
                  <div>Category: <b className="text-[#19251f]">{asset.category}</b></div>
                  <div>AMC Contractor: <b className="text-[#19251f]">{asset.amcProvider}</b></div>
                  <div>Next Service: <b className="text-[#19251f]">{asset.nextService}</b></div>
                </div>

                <button
                  onClick={() => alert(`Service ticket logged for ${asset.name}.`)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-[#f4f3ef] border border-[#e3e1d8] text-[#19251f] font-bold text-xs transition shadow-sm"
                >
                  Schedule AMC Inspection
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STAFF */}
      {activeTab === 'STAFF' && (
        <div className="organic-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#19251f] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#274235]" />
              <span>Estate Caretakers, Security &amp; Hospitality Team</span>
            </h3>
            <p className="text-xs text-[#6e7972]">Shifts, biometric attendance, and guest hospitality responsibilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#19251f]">{s.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {s.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6e7972]">
                    Shift: {s.shift} • {s.phone}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    ✓ Biometric Present Today
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-[#19251f] font-tabular">
                    ₹{s.monthlySalary.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#6e7972]">Monthly Payroll</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PRICING & OTAS */}
      {activeTab === 'PRICING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Dynamic Weekend &amp; Season Surge</h3>
              <p className="text-xs text-[#6e7972]">Automatic rate adjustment synced across Airbnb, Booking.com, and Agoda</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#19251f] block">Friday - Sunday Weekend Surge</span>
                  <span className="text-[11px] text-[#6e7972]">Increases base tariff by +25%</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Active (+25%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#19251f] block">High-Season Festival Surge (Diwali / Christmas)</span>
                  <span className="text-[11px] text-[#6e7972]">Increases base tariff by +40% (Min 3 nights)</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Active (+40%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#19251f] block">Direct Booking Concierge Discount</span>
                  <span className="text-[11px] text-[#6e7972]">Save 10% on direct bookings vs OTA commission</span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  Active (-10%)
                </span>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#19251f]">Connected Channels &amp; Calendar Feeds</h3>
              <p className="text-xs text-[#6e7972]">Two-way iCal and XML channel connectivity</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                    Ab
                  </div>
                  <div>
                    <span className="font-bold text-[#19251f] block">Airbnb Superhost API</span>
                    <span className="text-[11px] text-[#6e7972]">Last synced 2 mins ago • Instant Book ON</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">✓ Connected</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                    Bk
                  </div>
                  <div>
                    <span className="font-bold text-[#19251f] block">Booking.com Genius Channel</span>
                    <span className="text-[11px] text-[#6e7972]">XML rate distribution active</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">✓ Connected</span>
              </div>
            </div>

            <button
              onClick={handleSyncOTAs}
              className="w-full py-2.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs transition"
            >
              Force Synchronize All Channels
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Reservation */}
      {isAddReservationOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#e3e1d8] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#eeece5]">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-rose-600" />
                <h3 className="font-extrabold text-base text-[#19251f]">Add Hospitality / Villa Booking</h3>
              </div>
              <button onClick={() => setIsAddReservationOpen(false)} className="text-[#6e7972] hover:text-[#19251f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddReservationSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={newResForm.guestName}
                    onChange={(e) => setNewResForm({ ...newResForm, guestName: e.target.value })}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={newResForm.phone}
                    onChange={(e) => setNewResForm({ ...newResForm, phone: e.target.value })}
                    placeholder="+91 98450 11928"
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Villa / Room</label>
                  <select
                    value={newResForm.villaName}
                    onChange={(e) => setNewResForm({ ...newResForm, villaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold"
                  >
                    <option value="Serene Mist Master Villa (5BHK)">Serene Mist Villa (Wayanad)</option>
                    <option value="Beachfront Haven Luxury Villa">Beachfront Villa (Alibaug)</option>
                    <option value="Goa Sunset Pool Villa 2">Goa Sunset Pool Villa</option>
                    <option value="Tea Valley Sunset Suite A">Tea Valley Suite A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Booking Channel</label>
                  <select
                    value={newResForm.channel}
                    onChange={(e) => setNewResForm({ ...newResForm, channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold"
                  >
                    <option value="Airbnb">Airbnb</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Direct VIP">Direct VIP Walk-in</option>
                    <option value="Corporate">Corporate Offsite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Check-in</label>
                  <input
                    type="text"
                    value={newResForm.checkIn}
                    onChange={(e) => setNewResForm({ ...newResForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Check-out</label>
                  <input
                    type="text"
                    value={newResForm.checkOut}
                    onChange={(e) => setNewResForm({ ...newResForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Total Payout (₹)</label>
                  <input
                    type="number"
                    value={newResForm.totalAmount}
                    onChange={(e) => setNewResForm({ ...newResForm, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#e3e1d8] bg-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddReservationOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#f4f3ef] hover:bg-[#e6e4dc] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-md transition"
                >
                  Confirm &amp; Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
