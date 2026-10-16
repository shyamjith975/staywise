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
  Phone,
  UserPlus
} from 'lucide-react';
import { EstateAsset } from '../../types';

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

const DEMO_BOOKINGS: EstateBooking[] = [
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
];

const DEMO_TURNOVERS = [
  { id: 'hk-1', room: 'Suite A (Sunset Wing)', status: 'Cleaning In Progress', housekeeper: 'Sunita D.', eta: '14:30 IST', inspected: false },
  { id: 'hk-2', room: 'Private Pool Villa 3', status: 'Inspected & Sanitized', housekeeper: 'Ramu K.', eta: 'Ready', inspected: true },
  { id: 'hk-3', room: 'Tea Valley Cottage 2', status: 'Needs Turnover', housekeeper: 'Sunita D.', eta: '16:00 IST', inspected: false },
  { id: 'hk-4', room: 'Alibaug Pool Villa A', status: 'Inspected & Sanitized', housekeeper: 'Shambhu', eta: 'Ready', inspected: true },
];

export default function EstateHospitalityDashboard({ initialTab = 'OVERVIEW' }: { initialTab?: string }) {
  const { 
    currentUser, 
    properties, 
    estateAssets, 
    staff, 
    utilities, 
    addNotification, 
    activeView, 
    setActiveView,
    setIsAddPropertyOpen,
    setIsExistingTenantWizardOpen,
    addEstateAsset,
    deleteEstateAsset,
    addStaffMember,
    deleteStaffMember
  } = useAppState();

  const isDemoEstate = currentUser?.email === 'estate@staywise.com' || currentUser?.id === 'user-estate-manoj';

  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [assetForm, setAssetForm] = useState({
    name: '',
    tag: '',
    category: 'Power & Generator' as EstateAsset['category'],
    estateName: 'Campus',
    purchaseDate: '2026-01-15',
    warrantyUntil: '2028-01-15',
    amcProvider: '',
    lastService: '10 Oct 2026',
    nextService: '10 Jan 2027',
    condition: 'Excellent' as EstateAsset['condition']
  });

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Head Caretaker',
    estateName: 'Campus',
    phone: '',
    shift: 'Morning (07:00 - 15:00)',
    attendanceStatus: 'Present',
    monthlySalary: 22000
  });

  const validTabs = ['OVERVIEW', 'BOOKINGS', 'VILLAS', 'HOUSEKEEPING', 'ASSETS', 'STAFF', 'PRICING'];
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOOKINGS' | 'VILLAS' | 'HOUSEKEEPING' | 'ASSETS' | 'STAFF' | 'PRICING'>(() => {
    const formatted = initialTab.toUpperCase();
    return validTabs.includes(formatted) ? (formatted as any) : 'OVERVIEW';
  });

  const [selectedCampus, setSelectedCampus] = useState<string>(() => isDemoEstate ? 'Wayanad' : (properties[0]?.name || 'My Campus'));

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

  // Bookings state - strictly isolated for new/non-demo users
  const [bookings, setBookings] = useState<EstateBooking[]>(() => isDemoEstate ? DEMO_BOOKINGS : []);
  const [turnovers, setTurnovers] = useState(() => isDemoEstate ? DEMO_TURNOVERS : []);

  React.useEffect(() => {
    if (isDemoEstate) {
      setBookings(DEMO_BOOKINGS);
      setTurnovers(DEMO_TURNOVERS);
    } else {
      setBookings([]);
      setTurnovers([]);
    }
  }, [currentUser?.id, currentUser?.email, isDemoEstate]);

  const userEstateNames = properties
    .filter(p => p.ownerId === currentUser?.id || isDemoEstate)
    .map(p => p.name.toLowerCase());

  const activeEstateProperties = isDemoEstate
    ? properties.filter(p => p.portfolio === 'Luxury Villas & Campuses' || p.type === 'Villa' || p.type === 'Estate')
    : properties.filter(p => p.ownerId === currentUser?.id);

  const activeEstateAssets = isDemoEstate
    ? estateAssets
    : estateAssets.filter(a => userEstateNames.includes(a.estateName.toLowerCase()) || (a as any).ownerId === currentUser?.id);

  const activeStaffMembers = isDemoEstate
    ? staff
    : staff.filter(s => userEstateNames.includes(s.estateName.toLowerCase()) || (s as any).ownerId === currentUser?.id);

  // Modal: Add Reservation
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [newResForm, setNewResForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    villaName: isDemoEstate ? 'Serene Mist Master Villa (5BHK)' : (properties[0]?.name || 'Villa Horizon'),
    campus: isDemoEstate ? 'Wayanad Plantation Campus' : (properties[0]?.name || 'My Campus'),
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

  // Metrics computation
  const totalRevenue = isDemoEstate
    ? 1485000
    : bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  const occupancyRate = isDemoEstate
    ? '91.4%'
    : bookings.length > 0
      ? `${Math.min(100, Math.round((bookings.length / 5) * 100))}%`
      : '0.0%';

  const liveGuestsCount = isDemoEstate
    ? 18
    : bookings.reduce((sum, b) => sum + (b.guestsCount || 0), 0);

  const activeStaysCount = isDemoEstate
    ? 4
    : bookings.length;

  const solarGeneration = isDemoEstate
    ? '+1,520 kWh'
    : activeEstateAssets.some(a => a.name.toLowerCase().includes('solar'))
      ? '+180 kWh'
      : '0 kWh';

  const userCampuses = isDemoEstate
    ? [
        { id: 'Wayanad', name: 'Wayanad Serene Mist Plantation (5BHK)' },
        { id: 'Alibaug', name: 'Alibaug Beachfront Haven & Suites' },
        { id: 'Goa', name: 'Goa Sunset Boutique Pool Villa' },
        { id: 'Munnar', name: 'Cloud Valley Heritage Retreat' }
      ]
    : properties.length > 0
      ? properties.map(p => ({ id: p.id, name: p.name }))
      : [{ id: 'primary', name: 'Primary Estate Campus' }];

  return (
    <div className="space-y-6 pb-12 font-sans bg-[#F7F8F6] text-[#263238]">
      {/* Top Hospitality Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#D2DDD7]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#263238] flex items-center gap-2">
              <Trees className="h-6 w-6 text-[#163B36]" />
              <span>EstateOS — Villas &amp; Campuses • Airbnb &amp; Hotels</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8F0EC] text-[#163B36] font-bold border border-[#D2DDD7]">
              {isDemoEstate ? 'Host Operations' : `${currentUser?.name || 'Host'} Workspace`}
            </span>
          </div>
          <p className="text-xs text-[#263238]/70 mt-0.5">
            Luxury Villa Management • Short-Stay Airbnb &amp; Boutique Hotel Suites • Dynamic Nightly Pricing • Guest Smart Check-In
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Campus Switcher */}
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36] shadow-2xs"
          >
            {userCampuses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handleSyncOTAs}
            className="px-3 py-2 rounded-2xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#263238] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
            title="Sync with Airbnb iCal & Booking.com API"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#163B36]" />
            <span>Sync OTAs</span>
          </button>

          <button
            onClick={() => setIsAddReservationOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold shadow-md shadow-[#163B36]/20 flex items-center gap-1.5 transition"
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
            <span className="text-xs font-semibold text-[#263238]/70">Hospitality Revenue (Oct)</span>
            <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              {isDemoEstate ? '+24% YoY' : 'Active Period'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#263238]/70 mt-1 block">
            {isDemoEstate 
              ? 'RevPAR: ₹8,250/night across 4 Campuses' 
              : bookings.length > 0 
                ? `${bookings.length} reservations logged` 
                : 'Zero bookings logged yet'}
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#263238]/70">Villa &amp; Suite Occupancy</span>
            <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              {isDemoEstate ? 'High Season' : (bookings.length > 0 ? 'Active' : 'Standby')}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#163B36] font-tabular mt-2">
            {occupancyRate}
          </div>
          <span className="text-[11px] text-[#263238]/70 mt-1 block">
            {isDemoEstate 
              ? '28 Nights booked in Oct (Airbnb + Direct)' 
              : `${bookings.reduce((s, b) => s + b.nights, 0)} Nights booked`}
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#263238]/70">Active In-House Guests</span>
            <span className="text-[10px] font-bold text-[#C69A55] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#C69A55]/30">
              {liveGuestsCount} Guests
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#263238] font-tabular mt-2">
            {activeStaysCount} Stays Live
          </div>
          <span className="text-[11px] text-[#263238]/70 mt-1 block">
            {isDemoEstate ? '2 Check-ins Today • 1 Check-out Tomorrow' : `${bookings.length} reservations confirmed`}
          </span>
        </div>

        <div className="organic-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#263238]/70">Campus Solar &amp; Microgrid</span>
            <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
              {isDemoEstate ? 'Net Surplus' : (activeEstateAssets.length > 0 ? 'Eco Active' : 'Standby')}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#163B36] font-tabular mt-2">
            {solarGeneration}
          </div>
          <span className="text-[11px] text-[#263238]/70 mt-1 block">
            {isDemoEstate ? '100% Eco-Sustainable • Generator Idle' : 'Microgrid status & telemetry'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#D2DDD7] text-xs">
        <button
          onClick={() => handleTabClick('OVERVIEW')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Sparkles className={`h-4 w-4 ${activeTab === 'OVERVIEW' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Host Overview</span>
        </button>

        <button
          onClick={() => handleTabClick('BOOKINGS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'BOOKINGS'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Calendar className={`h-4 w-4 ${activeTab === 'BOOKINGS' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Airbnb &amp; Hotel Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('VILLAS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'VILLAS'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Building2 className={`h-4 w-4 ${activeTab === 'VILLAS' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Villas &amp; Campuses ({isDemoEstate ? 4 : activeEstateProperties.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('HOUSEKEEPING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'HOUSEKEEPING'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <BedDouble className={`h-4 w-4 ${activeTab === 'HOUSEKEEPING' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Housekeeping Turnovers ({turnovers.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('ASSETS')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'ASSETS'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Wrench className={`h-4 w-4 ${activeTab === 'ASSETS' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Campus Physical Assets ({activeEstateAssets.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('STAFF')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'STAFF'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Users className={`h-4 w-4 ${activeTab === 'STAFF' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
          <span>Estate Staff ({activeStaffMembers.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('PRICING')}
          className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'PRICING'
              ? 'bg-[#163B36] text-white shadow-sm'
              : 'text-[#263238]/70 hover:text-[#263238] hover:bg-white'
          }`}
        >
          <Sliders className={`h-4 w-4 ${activeTab === 'PRICING' ? 'text-[#C69A55]' : 'text-[#163B36]'}`} />
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
              <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
                <div>
                  <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#163B36]" />
                    <span>Today&apos;s Guest Stays &amp; Digital Access</span>
                  </h3>
                  <p className="text-xs text-[#263238]/70">Live guests in-house, check-in time, and Smart Lock PINs</p>
                </div>
                {bookings.length > 0 && (
                  <button
                    onClick={() => setActiveTab('BOOKINGS')}
                    className="text-xs font-bold text-[#163B36] hover:underline"
                  >
                    View All ({bookings.length})
                  </button>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#E8F0EC]/60 border border-[#D2DDD7] text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-white text-[#163B36] border border-[#D2DDD7] flex items-center justify-center mx-auto shadow-xs">
                    <Calendar className="h-6 w-6 text-[#163B36]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#263238] text-sm">No Active Hospitality Bookings</h4>
                    <p className="text-xs text-[#263238]/70 max-w-sm mx-auto">
                      Your guest reservations from Airbnb, Booking.com, and direct inquiries will appear here with smart lock access.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddReservationOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold transition shadow-xs"
                  >
                    + Add First Booking
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((bk) => (
                    <div
                      key={bk.id}
                      className="p-4 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-[#263238] text-sm">{bk.guestName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#163B36] border border-[#D2DDD7]">
                            {bk.channel}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#163B36]/10 text-[#163B36]">
                            {bk.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#263238]/70">
                          {bk.villaName} • {bk.checkIn} → {bk.checkOut} ({bk.nights}N • {bk.guestsCount} Guests)
                        </div>

                        <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                          <span className="text-[#263238]/70">Smart Lock:</span>
                          <span className="font-bold text-[#163B36] bg-white px-2 py-0.5 rounded-md border border-[#D2DDD7]">
                            {bk.smartLockPin}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-right mr-1">
                          <div className="font-black text-sm text-[#263238] font-tabular">
                            ₹{bk.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-[#163B36] font-bold">{bk.depositStatus}</div>
                        </div>

                        <button
                          onClick={() => handleSendDigitalKeyWhatsApp(bk)}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                          title="Send WhatsApp Welcome Guide & Digital Key"
                        >
                          <Send className="h-3.5 w-3.5 text-[#163B36]" />
                          <span className="hidden sm:inline">WhatsApp Key</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 5: Housekeeping Turnover Pipeline */}
            <div className="lg:col-span-5 organic-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
                  <div>
                    <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-[#163B36]" />
                      <span>Housekeeping Turnovers</span>
                    </h3>
                    <p className="text-xs text-[#263238]/70">Room sanitization and guest arrival readiness</p>
                  </div>
                </div>

                {turnovers.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#E8F0EC]/60 border border-[#D2DDD7] text-center space-y-2 mt-4">
                    <CheckCircle2 className="h-8 w-8 text-[#163B36] mx-auto" />
                    <div className="font-extrabold text-[#263238] text-sm">All Rooms Inspected &amp; Ready</div>
                    <p className="text-xs text-[#263238]/70">No pending housekeeping turnovers logged.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2 text-xs">
                    {turnovers.map((t) => (
                      <div key={t.id} className="p-3 rounded-2xl bg-white border border-[#D2DDD7] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#263238]">{t.room}</div>
                          <div className="text-[11px] text-[#263238]/70 mt-0.5">
                            Assigned: {t.housekeeper} • {t.eta}
                          </div>
                        </div>

                        <div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            t.status === 'Inspected & Sanitized' 
                              ? 'bg-[#163B36]/10 text-[#163B36]' 
                              : 'bg-[#C69A55]/15 text-[#C69A55]'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('HOUSEKEEPING')}
                className="w-full py-2.5 rounded-2xl bg-[#E8F0EC] hover:bg-[#163B36] hover:text-white text-[#163B36] font-bold text-xs transition border border-[#D2DDD7]"
              >
                Open Housekeeping Checklist
              </button>
            </div>
          </div>

          {/* Row: Campus Assets & Solar Generation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#263238]/70 flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-[#C69A55]" />
                  <span>Rooftop Solar Grid</span>
                </span>
                <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
                  {isDemoEstate ? '38.5 kWh Today' : 'Telemetry Online'}
                </span>
              </div>
              <div className="text-xl font-black text-[#263238] font-tabular">
                {isDemoEstate ? '100% Campus Powered' : 'Microgrid Active'}
              </div>
              <p className="text-[11px] text-[#263238]/70">
                Net-metering surplus to state grid. Zero grid power draw during peak sun hours.
              </p>
            </div>

            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#263238]/70 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-[#163B36]" />
                  <span>Silent DG Power Backup</span>
                </span>
                <span className="text-[10px] font-bold text-[#263238] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
                  Fuel: 82%
                </span>
              </div>
              <div className="text-xl font-black text-[#263238] font-tabular">
                Auto-Mains Failure (AMF)
              </div>
              <p className="text-[11px] text-[#263238]/70">
                Instant switchover in &lt; 8 seconds. Service AMC valid through Nov 2026.
              </p>
            </div>

            <div className="organic-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#263238]/70 flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-[#163B36]" />
                  <span>Infinity Pool &amp; UV Filtration</span>
                </span>
                <span className="text-[10px] font-bold text-[#163B36] bg-[#E8F0EC] px-2 py-0.5 rounded-full border border-[#D2DDD7]">
                  pH 7.2 • Clean
                </span>
              </div>
              <div className="text-xl font-black text-[#263238] font-tabular">
                Heated Pool 28°C
              </div>
              <p className="text-[11px] text-[#263238]/70">
                Dual sand filters and UV sanitizer operating on automated sanitization cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS (AIRBNB & HOTELS) */}
      {activeTab === 'BOOKINGS' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#163B36]" />
                <span>Airbnb, Hotels &amp; Direct Villa Reservations</span>
              </h3>
              <p className="text-xs text-[#263238]/70">
                Unified multi-channel calendar across Airbnb Superhost, Booking.com, and Direct Concierge
              </p>
            </div>

            <button
              onClick={() => setIsAddReservationOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold shadow-md shadow-[#163B36]/20 flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>+ New Booking</span>
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] space-y-3">
              <Calendar className="h-10 w-10 text-[#163B36] mx-auto" />
              <div className="font-extrabold text-base text-[#263238]">No Reservations Found</div>
              <p className="text-xs text-[#263238]/70 max-w-md mx-auto">
                No active bookings recorded. Click &quot;+ New Booking&quot; to log your first guest reservation or connect Airbnb / Booking.com OTA channels.
              </p>
              <button
                onClick={() => setIsAddReservationOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs transition"
              >
                + Add Reservation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E8F0EC] text-[#263238] border-b border-[#D2DDD7] text-[11px] font-bold uppercase tracking-wider">
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
                <tbody className="divide-y divide-[#D2DDD7] text-[#263238]">
                  {bookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-white transition">
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-[#263238]">{bk.guestName}</div>
                        <div className="text-[11px] text-[#263238]/70">{bk.phone} • {bk.guestsCount} Guests</div>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        {bk.villaName}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-[#263238]">{bk.checkIn} → {bk.checkOut}</div>
                        <div className="text-[10px] text-[#263238]/70">{bk.nights} Nights</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#163B36] border border-[#D2DDD7]">
                          {bk.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#163B36]">
                        {bk.smartLockPin}
                      </td>
                      <td className="py-3 px-3 text-right font-black font-tabular text-[#263238]">
                        ₹{bk.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#163B36]/10 text-[#163B36]">
                          {bk.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleSendDigitalKeyWhatsApp(bk)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7] text-xs font-bold inline-flex items-center gap-1 transition shadow-2xs"
                        >
                          <Send className="h-3 w-3 text-[#163B36]" />
                          <span>WhatsApp Key</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VILLAS & CAMPUSES */}
      {activeTab === 'VILLAS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Villas &amp; Luxury Campuses</h3>
              <p className="text-xs text-[#263238]/70">Boutique private estates, whole villas, and verified channel listings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isDemoEstate ? (
              <>
                <div className="organic-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#163B36] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#D2DDD7]">
                        Flagship Estate
                      </span>
                      <h3 className="text-lg font-black text-[#263238] mt-1.5">
                        Serene Mist Estate &amp; 5BHK Villa
                      </h3>
                      <p className="text-xs text-[#263238]/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-[#163B36]" />
                        <span>Vythiri Tea Valley, Wayanad, Kerala • 12 Acre Private Campus</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#263238] font-tabular">₹35,000</div>
                      <div className="text-[10px] text-[#263238]/70">per night (Whole Villa)</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#E8F0EC]/60 border border-[#D2DDD7] space-y-2 text-xs">
                    <div className="font-extrabold text-[#263238]">Amenities &amp; Features:</div>
                    <div className="grid grid-cols-2 gap-2 text-[#263238]/70">
                      <div>• 5 King Suites with Valley Balcony</div>
                      <div>• Private Heated Infinity Pool</div>
                      <div>• Starlink High-Speed Internet</div>
                      <div>• 10 kW Solar + 15 kVA Generator</div>
                      <div>• Private Chef &amp; Butler Quarters</div>
                      <div>• Organic Coffee &amp; Tea Trail</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-[#163B36]">● Live on Airbnb Superhost &amp; Direct</span>
                    <button
                      onClick={() => alert('Updated Wayanad Villa calendar and base rates.')}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] font-bold text-[#163B36] shadow-sm transition"
                    >
                      Configure Tariffs
                    </button>
                  </div>
                </div>

                <div className="organic-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C69A55] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#C69A55]/30">
                        Beachfront Campus
                      </span>
                      <h3 className="text-lg font-black text-[#263238] mt-1.5">
                        Beachfront Haven &amp; Luxury Suites
                      </h3>
                      <p className="text-xs text-[#263238]/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-[#163B36]" />
                        <span>Awas Beach Road, Alibaug, Maharashtra • 4 Pool Villas + 6 Suites</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#263238] font-tabular">₹28,000</div>
                      <div className="text-[10px] text-[#263238]/70">per night (Pool Villa)</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#E8F0EC]/60 border border-[#D2DDD7] space-y-2 text-xs">
                    <div className="font-extrabold text-[#263238]">Amenities &amp; Features:</div>
                    <div className="grid grid-cols-2 gap-2 text-[#263238]/70">
                      <div>• Direct Private Beach Access</div>
                      <div>• Plunge Pools in every villa</div>
                      <div>• Rooftop Sundeck &amp; Barbecue</div>
                      <div>• Smart Yale Digital Door Locks</div>
                      <div>• 24/7 Security &amp; Concierge Desk</div>
                      <div>• Corporate Offsite AV Conference Hall</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-[#163B36]">● Live on Booking.com &amp; Airbnb</span>
                    <button
                      onClick={() => alert('Updated Alibaug Beachfront calendar and base rates.')}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] font-bold text-[#163B36] shadow-sm transition"
                    >
                      Configure Tariffs
                    </button>
                  </div>
                </div>
              </>
            ) : activeEstateProperties.length > 0 ? (
              activeEstateProperties.map(p => (
                <div key={p.id} className="organic-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#163B36] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#D2DDD7]">
                        {p.type || 'Villa'}
                      </span>
                      <h3 className="text-lg font-black text-[#263238] mt-1.5">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#263238]/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-[#163B36]" />
                        <span>{p.address}, {p.city}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#263238] font-tabular">₹{p.totalUnits > 0 ? (p.totalUnits * 25000).toLocaleString('en-IN') : '25,000'}</div>
                      <div className="text-[10px] text-[#263238]/70">per night</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#E8F0EC]/60 border border-[#D2DDD7] space-y-2 text-xs">
                    <div className="font-extrabold text-[#263238]">Property Units &amp; Occupancy:</div>
                    <div className="grid grid-cols-2 gap-2 text-[#263238]/70">
                      <div>• {p.totalUnits} Total Units</div>
                      <div>• {p.occupiedUnits} Occupied</div>
                      <div>• Digital Smart Locks Ready</div>
                      <div>• OTA Sync Capable</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] space-y-3">
                <Building2 className="h-10 w-10 text-[#163B36] mx-auto" />
                <div className="font-extrabold text-base text-[#263238]">No Luxury Campuses Registered</div>
                <p className="text-xs text-[#263238]/70 max-w-md mx-auto">
                  Use the <span className="font-semibold text-[#163B36]">+ Add Property</span> button in the top header to onboard your first villa, holiday home, or boutique resort.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HOUSEKEEPING */}
      {activeTab === 'HOUSEKEEPING' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-[#163B36]" />
                <span>Housekeeping &amp; Villa Turnover Management</span>
              </h3>
              <p className="text-xs text-[#263238]/70">Sanitization logs, fresh linen replacement, and room turnaround SLAs</p>
            </div>
          </div>

          {turnovers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] space-y-2">
              <CheckCircle2 className="h-10 w-10 text-[#163B36] mx-auto" />
              <div className="font-extrabold text-base text-[#263238]">No Pending Turnovers</div>
              <p className="text-xs text-[#263238]/70 max-w-md mx-auto">
                All rooms and suites are clean and guest ready. New turnovers will automatically generate upon upcoming check-outs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {turnovers.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#E8F0EC]/40 border border-[#D2DDD7] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-sm text-[#263238]">{t.room}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Inspected & Sanitized' 
                        ? 'bg-[#163B36]/10 text-[#163B36]' 
                        : 'bg-[#C69A55]/15 text-[#C69A55]'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-[#263238]/70">
                    <div>Housekeeper: <b className="text-[#263238]">{t.housekeeper}</b></div>
                    <div>Turnaround SLA: <b className="text-[#263238]">{t.eta}</b></div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#D2DDD7] space-y-1 text-[11px] text-[#263238]">
                    <div className="flex items-center gap-1.5 text-[#163B36] font-bold">
                      <Check className="h-3 w-3" />
                      <span>Linen &amp; Towels Fresh 400TC Egyptian Cotton</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#163B36] font-bold">
                      <Check className="h-3 w-3" />
                      <span>Pool Water Tested &amp; Vacuumed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#163B36] font-bold">
                      <Check className="h-3 w-3" />
                      <span>Smart Lock Passcode Rotated</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Marked ${t.room} as Inspected and Guest-Ready!`)}
                    className="w-full py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs transition"
                  >
                    Mark Inspected &amp; Guest-Ready
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PHYSICAL ASSETS */}
      {activeTab === 'ASSETS' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#163B36]" />
                <span>Campus Physical Assets &amp; AMC Registry</span>
              </h3>
              <p className="text-xs text-[#263238]/70">Critical infrastructure tracking for private estates, power grids, and water</p>
            </div>
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Physical Asset</span>
            </button>
          </div>

          {activeEstateAssets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] space-y-3">
              <Wrench className="h-10 w-10 text-[#163B36] mx-auto" />
              <div className="font-extrabold text-base text-[#263238]">No Physical Assets Logged</div>
              <p className="text-xs text-[#263238]/70 max-w-md mx-auto">
                No solar grids, DG sets, or pool filtration machinery registered for your estate.
              </p>
              <button
                onClick={() => setIsAddAssetModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Physical Asset</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeEstateAssets.map((asset) => (
                <div key={asset.id} className="p-4 rounded-2xl bg-[#E8F0EC]/40 border border-[#D2DDD7] space-y-2.5 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#163B36] font-bold">{asset.tag}</span>
                      <h4 className="font-extrabold text-[#263238] text-sm mt-0.5">{asset.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#163B36]/10 text-[#163B36]">
                      {asset.condition}
                    </span>
                  </div>

                  <div className="space-y-1 text-[#263238]/70 text-[11px]">
                    <div>Category: <b className="text-[#263238]">{asset.category}</b></div>
                    <div>AMC Contractor: <b className="text-[#263238]">{asset.amcProvider}</b></div>
                    <div>Next Service: <b className="text-[#263238]">{asset.nextService}</b></div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => alert(`Service ticket logged for ${asset.name}.`)}
                      className="flex-1 py-1.5 rounded-xl bg-white hover:bg-[#E8F0EC] border border-[#D2DDD7] text-[#163B36] font-bold text-xs transition shadow-2xs"
                    >
                      Schedule AMC
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove asset ${asset.name}?`)) deleteEstateAsset(asset.id);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: STAFF */}
      {activeTab === 'STAFF' && (
        <div className="organic-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D2DDD7]">
            <div>
              <h3 className="text-base font-extrabold text-[#263238] flex items-center gap-2">
                <Users className="h-5 w-5 text-[#163B36]" />
                <span>Estate Caretakers, Security &amp; Hospitality Team</span>
              </h3>
              <p className="text-xs text-[#263238]/70">Shifts, biometric attendance, and guest hospitality responsibilities</p>
            </div>
            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Staff Member</span>
            </button>
          </div>

          {activeStaffMembers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] space-y-3">
              <Users className="h-10 w-10 text-[#163B36] mx-auto" />
              <div className="font-extrabold text-base text-[#263238]">No Staff Registered</div>
              <p className="text-xs text-[#263238]/70 max-w-md mx-auto">
                No estate caretakers or housekeeping staff assigned yet.
              </p>
              <button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Staff Member</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStaffMembers.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-[#E8F0EC]/40 border border-[#D2DDD7] flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#263238]">{s.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#163B36]/10 text-[#163B36]">
                        {s.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#263238]/70">
                      Shift: {s.shift} • {s.phone}
                    </div>
                    <div className="text-[10px] text-[#163B36] font-bold">
                      ✓ Biometric Present Today
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-sm text-[#263238] font-tabular">
                        ₹{s.monthlySalary.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#263238]/70">Monthly Payroll</div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Remove staff member ${s.name}?`)) deleteStaffMember(s.id);
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs transition"
                      title="Remove Staff"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: PRICING & OTAS */}
      {activeTab === 'PRICING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Dynamic Weekend &amp; Season Surge</h3>
              <p className="text-xs text-[#263238]/70">Automatic rate adjustment synced across Airbnb, Booking.com, and Agoda</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#263238] block">Friday - Sunday Weekend Surge</span>
                  <span className="text-[11px] text-[#263238]/70">Increases base tariff by +25%</span>
                </div>
                <span className="text-xs font-bold text-[#163B36] bg-white px-2.5 py-1 rounded-full border border-[#D2DDD7]">
                  Active (+25%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#263238] block">High-Season Festival Surge (Diwali / Christmas)</span>
                  <span className="text-[11px] text-[#263238]/70">Increases base tariff by +40% (Min 3 nights)</span>
                </div>
                <span className="text-xs font-bold text-[#163B36] bg-white px-2.5 py-1 rounded-full border border-[#D2DDD7]">
                  Active (+40%)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#263238] block">Direct Booking Concierge Discount</span>
                  <span className="text-[11px] text-[#263238]/70">Save 10% on direct bookings vs OTA commission</span>
                </div>
                <span className="text-xs font-bold text-[#C69A55] bg-white px-2.5 py-1 rounded-full border border-[#D2DDD7]">
                  Active (-10%)
                </span>
              </div>
            </div>
          </div>

          <div className="organic-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#263238]">Connected Channels &amp; Calendar Feeds</h3>
              <p className="text-xs text-[#263238]/70">Two-way iCal and XML channel connectivity</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white text-[#163B36] border border-[#D2DDD7] flex items-center justify-center font-black">
                    Ab
                  </div>
                  <div>
                    <span className="font-bold text-[#263238] block">Airbnb Superhost API</span>
                    <span className="text-[11px] text-[#263238]/70">Last synced 2 mins ago • Instant Book ON</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#163B36]">✓ Connected</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F0EC]/50 border border-[#D2DDD7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white text-[#163B36] border border-[#D2DDD7] flex items-center justify-center font-black">
                    Bk
                  </div>
                  <div>
                    <span className="font-bold text-[#263238] block">Booking.com Genius Channel</span>
                    <span className="text-[11px] text-[#263238]/70">XML rate distribution active</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#163B36]">✓ Connected</span>
              </div>
            </div>

            <button
              onClick={handleSyncOTAs}
              className="w-full py-2.5 rounded-2xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs transition"
            >
              Force Synchronize All Channels
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Reservation */}
      {isAddReservationOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#D2DDD7] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto text-[#263238]">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#163B36]" />
                <h3 className="font-extrabold text-base text-[#263238]">Add Hospitality / Villa Booking</h3>
              </div>
              <button onClick={() => setIsAddReservationOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddReservationSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={newResForm.guestName}
                    onChange={(e) => setNewResForm({ ...newResForm, guestName: e.target.value })}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={newResForm.phone}
                    onChange={(e) => setNewResForm({ ...newResForm, phone: e.target.value })}
                    placeholder="+91 98450 11928"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Villa / Room</label>
                  <input
                    type="text"
                    value={newResForm.villaName}
                    onChange={(e) => setNewResForm({ ...newResForm, villaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Booking Channel</label>
                  <select
                    value={newResForm.channel}
                    onChange={(e) => setNewResForm({ ...newResForm, channel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
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
                  <label className="block text-[#263238] font-semibold mb-1">Check-in</label>
                  <input
                    type="text"
                    value={newResForm.checkIn}
                    onChange={(e) => setNewResForm({ ...newResForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Check-out</label>
                  <input
                    type="text"
                    value={newResForm.checkOut}
                    onChange={(e) => setNewResForm({ ...newResForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-semibold mb-1">Total Payout (₹)</label>
                  <input
                    type="number"
                    value={newResForm.totalAmount}
                    onChange={(e) => setNewResForm({ ...newResForm, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DDD7] bg-white font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#163B36]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddReservationOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#E8F0EC] hover:bg-[#D2DDD7] text-[#263238] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#163B36] hover:bg-[#0F2925] text-white font-bold text-xs shadow-md transition"
                >
                  Confirm &amp; Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ADD ASSET MODAL */}
      {isAddAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#D2DDD7] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Log Campus Infrastructure</h3>
                <p className="text-xs text-[#263238]/70">Solar, DG gensets, borewell pumps &amp; pool systems</p>
              </div>
              <button onClick={() => setIsAddAssetModalOpen(false)} className="p-1 rounded-full hover:bg-[#E8F0EC] text-[#263238]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addEstateAsset({
                name: assetForm.name,
                tag: assetForm.tag || `AST-${Date.now().toString().slice(-4)}`,
                category: assetForm.category,
                estateName: assetForm.estateName,
                purchaseDate: assetForm.purchaseDate,
                warrantyUntil: assetForm.warrantyUntil,
                amcProvider: assetForm.amcProvider || 'In-House Maintenance',
                lastService: assetForm.lastService,
                nextService: assetForm.nextService,
                condition: assetForm.condition
              });
              setIsAddAssetModalOpen(false);
              setAssetForm({ ...assetForm, name: '', tag: '', amcProvider: '' });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. 15 kVA Diesel Generator (Cummins)"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Asset Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. DG-01"
                    value={assetForm.tag}
                    onChange={(e) => setAssetForm({ ...assetForm, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Power & Generator">Power &amp; Generator</option>
                    <option value="Solar & Inverters">Solar &amp; Inverters</option>
                    <option value="Water & Borewell">Water &amp; Borewell</option>
                    <option value="Pool & Filtration">Pool &amp; Filtration</option>
                    <option value="Vehicles & Buggies">Vehicles &amp; Buggies</option>
                    <option value="HVAC & Climate">HVAC &amp; Climate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">AMC Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. Cummins Power India"
                    value={assetForm.amcProvider}
                    onChange={(e) => setAssetForm({ ...assetForm, amcProvider: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Condition</label>
                  <select
                    value={assetForm.condition}
                    onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Maintenance Due">Maintenance Due</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer mt-2"
              >
                Register Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#D2DDD7] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D2DDD7]">
              <div>
                <h3 className="text-base font-extrabold text-[#263238]">Enroll Estate Staff</h3>
                <p className="text-xs text-[#263238]/70">Caretakers, security guards, housekeepers &amp; chefs</p>
              </div>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="p-1 rounded-full hover:bg-[#E8F0EC] text-[#263238]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addStaffMember({
                name: staffForm.name,
                role: staffForm.role,
                estateName: staffForm.estateName,
                phone: staffForm.phone,
                shift: staffForm.shift,
                attendanceStatus: staffForm.attendanceStatus,
                monthlySalary: Number(staffForm.monthlySalary) || 20000
              });
              setIsAddStaffModalOpen(false);
              setStaffForm({ ...staffForm, name: '', phone: '' });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#263238] font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Role / Designation</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Head Caretaker">Head Caretaker</option>
                    <option value="Security Supervisor">Security Supervisor</option>
                    <option value="Gardener & Landscaper">Gardener & Landscaper</option>
                    <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
                    <option value="Chef & Butler">Chef & Butler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94470 12891"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Duty Shift</label>
                  <select
                    value={staffForm.shift}
                    onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium"
                  >
                    <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
                    <option value="General (09:00 - 18:00)">General (09:00 - 18:00)</option>
                    <option value="Night (19:00 - 07:00)">Night (19:00 - 07:00)</option>
                    <option value="Full Residential Caretaker">Full Residential Caretaker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#263238] font-bold mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={staffForm.monthlySalary}
                    onChange={(e) => setStaffForm({ ...staffForm, monthlySalary: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DDD7] bg-white text-[#263238] font-medium font-tabular"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer mt-2"
              >
                Enroll Staff Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
