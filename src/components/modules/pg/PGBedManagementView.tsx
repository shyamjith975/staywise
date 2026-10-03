'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { PGBed, PGBedStatus } from '../../../types';
import { 
  BedDouble, 
  Users, 
  IndianRupee, 
  Zap, 
  Utensils, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles, 
  ChevronRight,
  Filter,
  Plus,
  Phone,
  DoorOpen,
  Calendar,
  Layers,
  Search,
  Wifi,
  Wind,
  Building2,
  Briefcase,
  Home,
  Warehouse,
  SlidersHorizontal,
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function PGBedManagementView() {
  const { 
    pgBeds, 
    pgRooms, 
    pgMeals, 
    properties,
    updatePGBedStatus, 
    addNotification,
    setIsAddPropertyOpen,
    setActiveView 
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'BEDS' | 'ELECTRICITY' | 'MEALS' | 'HOSTEL'>('LISTINGS');
  const [listingCategoryFilter, setListingCategoryFilter] = useState<'ALL' | 'PG' | 'ROOM' | 'COMMERCIAL' | 'RESIDENTIAL'>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBedForAction, setSelectedBedForAction] = useState<PGBed | null>(null);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string | null>(null);
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string | null>(null);

  // PG Dashboard Metrics
  const totalBeds = 120; // PG Portfolio Capacity
  const occupiedBeds = pgBeds.filter(b => b.status === 'Occupied').length + 89; // active inventory
  const vacantBeds = pgBeds.filter(b => b.status === 'Available').length + 17;
  const reservedBeds = pgBeds.filter(b => b.status === 'Reserved').length + 4;
  const noticeBeds = pgBeds.filter(b => b.status === 'Notice Given').length;
  const occupancyPercent = ((occupiedBeds / totalBeds) * 100).toFixed(1);
  const expectedRevenue = 840000;
  const collectedRevenue = 790000;
  const pendingRevenue = 50000;

  // Filtered Beds - strictly matches selectedRoomFilter if chosen
  const filteredBeds = pgBeds.filter(bed => {
    if (selectedRoomFilter && bed.roomNumber !== selectedRoomFilter) return false;
    if (selectedFloor !== 'ALL' && bed.floor !== selectedFloor) return false;
    if (selectedStatus !== 'ALL' && bed.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        bed.bedCode.toLowerCase().includes(q) ||
        bed.roomNumber.includes(q) ||
        (bed.tenantName && bed.tenantName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusColor = (status: PGBedStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Occupied':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Reserved':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Maintenance':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Blocked':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Notice Given':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'Cleaning':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleStatusTransition = (bedId: string, nextStatus: PGBedStatus) => {
    updatePGBedStatus(bedId, nextStatus);
    setSelectedBedForAction(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#e3e1d8] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staywise Asset Universe &amp; Bed Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">PGs • Private Rooms • Commercial Buildings • Residential</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#19251f]">
            Bed, Room &amp; Building Universe
          </h1>
          <p className="text-xs text-[#6e7972]">
            Comprehensive multi-asset inventory management with PG bed state machines, private rooms, commercial floors, and sub-meter power.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'LISTINGS'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Asset Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('BEDS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'BEDS'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <BedDouble className="h-3.5 w-3.5" />
            <span>Bed Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('ELECTRICITY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ELECTRICITY'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Electricity Split</span>
          </button>
          <button
            onClick={() => setActiveTab('MEALS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MEALS'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Food &amp; Mess</span>
          </button>
          <button
            onClick={() => setActiveTab('HOSTEL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'HOSTEL'
                ? 'bg-[#19251f] text-white shadow-sm'
                : 'text-[#6e7972] hover:text-[#19251f]'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Hostel &amp; Visitors</span>
          </button>
        </div>
      </div>

      {/* SECTION 5: PG Dashboard Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Beds</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalBeds}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">3 Floors • 24 Rooms</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-indigo-600">Occupied</div>
          <div className="text-xl font-black text-indigo-950 mt-1">{occupiedBeds}</div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">{occupancyPercent}% Occupancy</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Vacant Beds</div>
          <div className="text-xl font-black text-emerald-950 mt-1">{vacantBeds}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Ready for Check-in</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-700">Reserved</div>
          <div className="text-xl font-black text-amber-950 mt-1">{reservedBeds}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Deposits Received</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Expected Rev</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹8.4L</div>
          <div className="text-[10px] text-slate-500 mt-0.5">₹7,000 avg/bed</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#e3e1d8] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Collected</div>
          <div className="text-xl font-black text-emerald-900 mt-1">₹7.9L</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">94.0% Collected</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-rose-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-bold text-rose-600">Pending Rent</div>
          <div className="text-xl font-black text-rose-950 mt-1">₹50K</div>
          <div className="text-[10px] text-rose-600 font-medium mt-0.5">4 Tenants Overdue</div>
        </div>
      </div>

      {/* SECTION TO LIST PG, ROOM, COMMERCIAL BUILDING, RESIDENTIAL */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e3e1d8] shadow-sm">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Assets', icon: <Layers className="h-3.5 w-3.5" /> },
                { id: 'PG', label: 'PG & Co-Living', icon: <BedDouble className="h-3.5 w-3.5 text-indigo-600" /> },
                { id: 'ROOM', label: 'Individual Rooms', icon: <DoorOpen className="h-3.5 w-3.5 text-emerald-600" /> },
                { id: 'COMMERCIAL', label: 'Commercial Buildings', icon: <Briefcase className="h-3.5 w-3.5 text-teal-600" /> },
                { id: 'RESIDENTIAL', label: 'Residential Flats', icon: <Home className="h-3.5 w-3.5 text-amber-600" /> },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setListingCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    listingCategoryFilter === cat.id
                      ? 'bg-[#19251f] text-white shadow-sm'
                      : 'bg-[#f7f6f2] text-slate-600 hover:text-slate-900 hover:bg-[#edece6]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Action: Add Property / Space */}
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="py-2 px-4 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add to Universe</span>
            </button>
          </div>

          {/* ASSET SECTION 1: PG & Co-Living Properties */}
          {(listingCategoryFilter === 'ALL' || listingCategoryFilter === 'PG') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-indigo-600" />
                  <h2 className="font-extrabold text-[#19251f] text-sm">Managed PG &amp; Co-Living Buildings</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    2 Properties • 168 Total Beds
                  </span>
                </div>
                <button 
                  onClick={() => setActiveTab('BEDS')}
                  className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Bed Grid State Machine</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Staywise Urban PG */}
                <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1.5 flex-wrap">
                        <span>PG / Co-Living • Bangalore</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100/80 text-indigo-900 font-mono text-[9px] font-black">ID: PG-BLR-001</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">Staywise Urban PG &amp; Co-Living</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>Koramangala 4th Block, Bangalore</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      80.8% Occupied
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Capacity</span>
                      <span className="text-sm font-black text-slate-800">120 Beds</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Rooms</span>
                      <span className="text-sm font-black text-slate-800">24 Rooms</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Monthly Rev</span>
                      <span className="text-sm font-black text-emerald-700">₹8.4L/mo</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">3 Meals Included</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">Sub-meter Power</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">Biometric Gate</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">High-Speed Wi-Fi</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#f0eee6]">
                    <button
                      onClick={() => {
                        setSelectedRoomFilter(null);
                        setSelectedPropertyFilter('Staywise Urban PG');
                        setActiveTab('BEDS');
                      }}
                      className="py-2 px-2 rounded-xl bg-[#19251f] hover:bg-[#274235] text-white text-xs font-bold text-center transition"
                    >
                      Bed Grid
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRoomFilter(null);
                        setSelectedPropertyFilter('Staywise Urban PG');
                        setActiveTab('ELECTRICITY');
                      }}
                      className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold text-center transition"
                    >
                      Power Split
                    </button>
                    <button
                      onClick={() => setActiveTab('MEALS')}
                      className="py-2 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold text-center transition"
                    >
                      Mess / Meals
                    </button>
                  </div>
                </div>

                {/* Indiranagar Co-Living */}
                <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1.5 flex-wrap">
                        <span>Hostel &amp; Co-Living • Bangalore</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100/80 text-indigo-900 font-mono text-[9px] font-black">ID: PG-BLR-002</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">Indiranagar Executive Co-Living</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>100 Feet Road, Indiranagar</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      91.6% Occupied
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Capacity</span>
                      <span className="text-sm font-black text-slate-800">48 Beds</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Rooms</span>
                      <span className="text-sm font-black text-slate-800">12 Rooms</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Monthly Rev</span>
                      <span className="text-sm font-black text-emerald-700">₹4.2L/mo</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">Single &amp; 2-Sharing</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">Rooftop Lounge</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">CCTV &amp; Warden</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eee6]">
                    <button
                      onClick={() => setActiveTab('HOSTEL')}
                      className="py-2 px-3 rounded-xl bg-[#19251f] hover:bg-[#274235] text-white text-xs font-bold text-center transition"
                    >
                      Warden &amp; Visitors
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRoomFilter(null);
                        setSelectedPropertyFilter('Indiranagar Executive Co-Living');
                        setActiveTab('BEDS');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition"
                    >
                      Inspect Beds
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSET SECTION 2: Individual Rentable Rooms & Studios */}
          {(listingCategoryFilter === 'ALL' || listingCategoryFilter === 'ROOM') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-emerald-600" />
                  <h2 className="font-extrabold text-[#19251f] text-sm">Individual Rooms &amp; Studio Suites</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    4 Active Units
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  {
                    code: 'Room 101',
                    uniqueId: 'ROOM-101',
                    roomNumber: '101',
                    type: 'Private Single Studio',
                    property: 'Staywise Urban PG',
                    floor: 1,
                    rent: 18000,
                    occupant: 'Rohan Verma',
                    status: 'Occupied',
                    ac: true,
                    submeter: 'SUB-101 (248 kWh)',
                    attachedBath: true
                  },
                  {
                    code: 'Room 102',
                    uniqueId: 'ROOM-102',
                    roomNumber: '102',
                    type: 'Deluxe 2-Bed Sharing',
                    property: 'Staywise Urban PG',
                    floor: 1,
                    rent: 24000,
                    occupant: 'Shyam Nair & 1 Vacant',
                    status: 'Partially Occupied',
                    ac: true,
                    submeter: 'SUB-102 (312 kWh)',
                    attachedBath: true
                  },
                  {
                    code: 'Room 201',
                    uniqueId: 'ROOM-201',
                    roomNumber: '201',
                    type: 'Executive Balcony Studio',
                    property: 'Staywise Urban PG',
                    floor: 2,
                    rent: 18000,
                    occupant: 'Priya Menon',
                    status: 'Occupied',
                    ac: true,
                    submeter: 'SUB-201 (189 kWh)',
                    attachedBath: true
                  },
                  {
                    code: 'Room 304',
                    uniqueId: 'ROOM-304',
                    roomNumber: '304',
                    type: 'Single Working Professional',
                    property: 'Staywise Urban PG',
                    floor: 3,
                    rent: 16500,
                    occupant: 'None (Ready)',
                    status: 'Available',
                    ac: false,
                    submeter: 'SUB-304 (0 kWh)',
                    attachedBath: true
                  },
                ].map((room, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-sm hover:border-[#274235] transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{room.code}</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-[9px] font-bold">
                          {room.uniqueId}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        room.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">{room.type}</div>
                      <div className="text-[11px] text-slate-500">{room.property} • Floor {room.floor}</div>
                      <div className="text-sm font-black text-[#19251f] pt-1">₹{room.rent.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-slate-400">/mo</span></div>
                    </div>

                    <div className="pt-2 border-t border-[#f0eee6] space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Tenant:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[120px]">{room.occupant}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Power Meter:</span>
                        <span className="font-mono text-[10px] font-bold text-amber-700">{room.submeter}</span>
                      </div>
                    </div>

                    {/* Choose Room's Bed Grid OR Power Option */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedRoomFilter(room.roomNumber);
                          setActiveTab('BEDS');
                        }}
                        className="py-1.5 px-2 rounded-xl bg-[#19251f] hover:bg-[#274235] text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                        title={`View Bed Grid for Room ${room.roomNumber} only`}
                      >
                        <BedDouble className="h-3 w-3" />
                        <span>Bed Grid</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRoomFilter(room.roomNumber);
                          setActiveTab('ELECTRICITY');
                        }}
                        className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition flex items-center justify-center gap-1"
                        title={`View Electricity Split for Room ${room.roomNumber} only`}
                      >
                        <Zap className="h-3 w-3 text-amber-600" />
                        <span>Power Split</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSET SECTION 3: Commercial Buildings & Complex Units */}
          {(listingCategoryFilter === 'ALL' || listingCategoryFilter === 'COMMERCIAL') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-teal-600" />
                  <h2 className="font-extrabold text-[#19251f] text-sm">Commercial Buildings, Offices &amp; Logistics</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    2 Properties • 50,500 sq.ft
                  </span>
                </div>
                <button 
                  onClick={() => setActiveView('commercial')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Commercial &amp; CAM Hub</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Commercial Tech Park */}
                <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-teal-600 tracking-wider flex items-center gap-1.5 flex-wrap">
                        <span>Commercial Office Building • Bangalore</span>
                        <span className="px-2 py-0.5 rounded bg-teal-100/80 text-teal-900 font-mono text-[9px] font-black">ID: COMM-BLR-001</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">Prestige Meridian Commercial Centre</h3>
                      <div className="text-xs text-slate-500">4 Floors • 18,500 sq.ft Carpet Area • ₹18/sq.ft CAM Pool</div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      90.2% Leased
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Floor 1: Suite 101 — BlueFin Capital</span>
                      <span className="font-black text-slate-900">₹1,80,000 + ₹57,600 CAM</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Floor 2: Suite 201 — AeroSys Technologies</span>
                      <span className="font-black text-slate-900">₹2,40,000 + ₹81,000 CAM</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Floor 3: Suite 304 — Vacant Mid-size Office</span>
                      <span className="font-bold text-amber-700">₹65,000 asking</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eee6]">
                    <button
                      onClick={() => setActiveView('commercial')}
                      className="py-2 px-3 rounded-xl bg-[#19251f] hover:bg-[#274235] text-white text-xs font-bold text-center transition"
                    >
                      Commercial Leases
                    </button>
                    <button
                      onClick={() => setActiveView('commercial')}
                      className="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold text-center transition"
                    >
                      CAM Expense Audit
                    </button>
                  </div>
                </div>

                {/* Logistics & Cargo Park */}
                <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-teal-600 tracking-wider flex items-center gap-1.5 flex-wrap">
                        <span>Industrial Warehouse &amp; Logistics • Kochi</span>
                        <span className="px-2 py-0.5 rounded bg-teal-100/80 text-teal-900 font-mono text-[9px] font-black">ID: COMM-COK-002</span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">Cochin Port Logistics &amp; Cargo Hub</h3>
                      <div className="text-xs text-slate-500">32,000 sq.ft • 4 Heavy Loading Docks • Fire Safety Certified</div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      100% Leased
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Zone A: Bay 1-2 — TransIndia Cold Storage</span>
                      <span className="font-black text-slate-900">₹2,80,000/mo</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Zone B: Bay 3-4 — Apex E-Commerce Fulfillment</span>
                      <span className="font-black text-slate-900">₹1,70,000/mo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eee6]">
                    <button
                      onClick={() => setActiveView('commercial')}
                      className="py-2 px-3 rounded-xl bg-[#19251f] hover:bg-[#274235] text-white text-xs font-bold text-center transition"
                    >
                      Bay Compliance
                    </button>
                    <button
                      onClick={() => setActiveView('maintenance')}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition"
                    >
                      AMC Work Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSET SECTION 4: Residential Apartments & Flats */}
          {(listingCategoryFilter === 'ALL' || listingCategoryFilter === 'RESIDENTIAL') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-amber-600" />
                  <h2 className="font-extrabold text-[#19251f] text-sm">Residential Apartments, Villas &amp; Duplexes</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    2 Buildings • 8 Total Units
                  </span>
                </div>
                <button 
                  onClick={() => setActiveView('properties')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Properties &amp; Units</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Beach Road */}
                <div className="bg-white p-4 rounded-2xl border border-[#e3e1d8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-xs">Beach Road Luxury Apartments</h3>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">ID: RES-CCJ-001</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">100% Occupied</span>
                  </div>
                  <p className="text-[11px] text-slate-500">4 Luxury 3BHK Oceanfront units • Kozhikode Beach</p>
                  <div className="text-xs font-black text-slate-900">₹1,40,000/mo Total Rent Collected</div>
                </div>

                {/* Palm Grove */}
                <div className="bg-white p-4 rounded-2xl border border-[#e3e1d8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-xs">Palm Grove Residences</h3>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">ID: RES-COK-002</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">75% Occupied</span>
                  </div>
                  <p className="text-[11px] text-slate-500">4 Gated Duplex Units • Kakkanad, Kochi</p>
                  <div className="text-xs font-black text-slate-900">₹1,10,000/mo Total Rent Collected</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: BED GRID & STATE MACHINE */}
      {activeTab === 'BEDS' && (
        <div className="space-y-4">
          
          {/* Active Room Filter Banner */}
          {selectedRoomFilter && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <BedDouble className="h-5 w-5 text-indigo-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-indigo-950">
                    Showing Beds for: <span className="font-black text-indigo-900">Room {selectedRoomFilter}</span>
                  </span>
                  <span className="text-[11px] text-indigo-700 ml-2 font-mono font-semibold">
                    (Asset ID: ROOM-{selectedRoomFilter}) • {filteredBeds.length} Bed(s) Listed
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomFilter(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-900 text-xs font-bold border border-indigo-300 shadow-sm transition shrink-0"
              >
                Clear Filter / Show All Rooms
              </button>
            </div>
          )}

          {/* Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e3e1d8]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bed code, room, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#274235]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 bg-[#f7f6f2] p-1 rounded-xl border border-[#e3e1d8]">
                <button
                  onClick={() => setSelectedFloor('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    selectedFloor === 'ALL' ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Floors
                </button>
                {[1, 2, 3].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      selectedFloor === floor ? 'bg-[#19251f] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-xs font-semibold text-slate-800"
              >
                <option value="ALL">All Statuses (7 States)</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Notice Given">Notice Given</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Bed Inventory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredBeds.map((bed) => (
              <div
                key={bed.id}
                className="bg-white rounded-2xl border border-[#e3e1d8] p-3.5 shadow-sm hover:border-[#274235] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-extrabold text-xs text-slate-900">Room {bed.roomNumber}</span>
                      <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1 rounded">ROOM-{bed.roomNumber}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(bed.status)}`}>
                      {bed.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-b border-slate-100 py-2 my-2">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Bed Identity</div>
                      <div className="text-sm font-black text-[#19251f]">{bed.bedCode}</div>
                      <div className="text-[9px] font-mono text-indigo-600 font-bold">BED-{bed.roomNumber}{bed.bedCode.replace(/^R\d+-?/, '') || bed.bedCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-medium">Monthly Rent</div>
                      <div className="text-xs font-black text-emerald-800">₹{bed.monthlyRent.toLocaleString('en-IN')}</div>
                      <div className="text-[9px] text-slate-400">{bed.sharingType}</div>
                    </div>
                  </div>

                  {/* Tenant Details or Vacancy Info */}
                  {bed.tenantName ? (
                    <div className="space-y-1 my-1">
                      <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                        <Users className="h-3 w-3 text-indigo-600 shrink-0" />
                        <span className="truncate">{bed.tenantName}</span>
                      </div>
                      {bed.tenantPhone && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />
                          <span>{bed.tenantPhone}</span>
                        </div>
                      )}
                      {bed.status === 'Notice Given' && (
                        <div className="text-[10px] text-purple-700 bg-purple-50 p-1 rounded-md font-semibold mt-1">
                          Notice: Vacates on {bed.expectedVacantDate}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic py-1">
                      {bed.status === 'Cleaning' ? 'Housekeeping in progress' : 'Ready for tenant placement'}
                    </div>
                  )}

                  {/* Amenities Badges */}
                  <div className="flex items-center gap-1 mt-2">
                    {bed.ac && <span title="AC" className="p-1 rounded bg-slate-100 text-slate-700 text-[10px]"><Wind className="h-2.5 w-2.5" /></span>}
                    {bed.wifiIncluded && <span title="Wi-Fi" className="p-1 rounded bg-slate-100 text-slate-700 text-[10px]"><Wifi className="h-2.5 w-2.5" /></span>}
                    {bed.foodIncluded && <span title="Food" className="p-1 rounded bg-slate-100 text-slate-700 text-[10px]"><Utensils className="h-2.5 w-2.5" /></span>}
                    <span className="text-[9px] font-bold text-slate-500 ml-auto">{bed.sharingType}</span>
                  </div>
                </div>

                {/* State Machine Transition Trigger */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedBedForAction(bed)}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-[#19251f] hover:text-white text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>Update State</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* State Transition Modal */}
          {selectedBedForAction && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedBedForAction(null); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-[#e3e1d8] shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Transition Bed Status</h3>
                    <p className="text-[11px] text-slate-500">Bed {selectedBedForAction.bedCode} • Room {selectedBedForAction.roomNumber}</p>
                  </div>
                  <button onClick={() => setSelectedBedForAction(null)} className="p-1 text-slate-400 hover:text-slate-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-600">
                  Current Status: <span className="font-bold text-slate-900">{selectedBedForAction.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Available', 'Occupied', 'Reserved', 'Notice Given', 'Cleaning', 'Maintenance', 'Blocked'] as PGBedStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={selectedBedForAction.status === st}
                      onClick={() => handleStatusTransition(selectedBedForAction.id, st)}
                      className={`p-2.5 rounded-xl text-left font-bold border transition ${
                        selectedBedForAction.status === st 
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="text-xs">{st}</div>
                      <div className="text-[9px] font-normal text-slate-400">
                        {st === 'Notice Given' && 'Triggers Vacancy Engine'}
                        {st === 'Cleaning' && 'Housekeeping alert'}
                        {st === 'Available' && 'Ready on portal'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PG ELECTRICITY MANAGEMENT */}
      {activeTab === 'ELECTRICITY' && (
        <div className="space-y-4">
          
          {/* Active Room Filter Banner */}
          {selectedRoomFilter && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Zap className="h-5 w-5 text-amber-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-950">
                    Showing Power &amp; Sub-meter Details for: <span className="font-black text-amber-900">Room {selectedRoomFilter}</span>
                  </span>
                  <span className="text-[11px] text-amber-700 ml-2 font-mono font-semibold">
                    (Asset ID: ROOM-{selectedRoomFilter} • Sub-Meter: SUB-{selectedRoomFilter})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoomFilter(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 shadow-sm transition shrink-0"
              >
                Clear Filter / Show All Rooms
              </button>
            </div>
          )}

          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full">
                Sub-Meter Billing Architecture
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">PG Electricity Multi-Method Split Engine</h2>
              <p className="text-xs text-slate-500">
                Supports Equal Split (entire building), Sub-meter per room kWh, and Roommate-level splits feeding directly into monthly tenant invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Method 1: Equal Split */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>1. Equal Split Across Tenants</span>
                </div>
                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-mono">
                  Electricity Bill: ₹20,000<br/>
                  ÷ 20 Active Tenants<br/>
                  = <span className="font-bold text-emerald-700">₹1,000 each</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard baseline mode for hostels without submetering. Split is computed on 1st of each month.
                </p>
              </div>

              {/* Method 2: Sub-meter per room */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  <span>2. Sub-Meter kWh Precision</span>
                </div>
                {selectedRoomFilter ? (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-indigo-100 font-mono">
                    Room {selectedRoomFilter} (SUB-{selectedRoomFilter}): {pgRooms.find(r => r.roomNumber === selectedRoomFilter)?.submeterReading ?? 248} kWh<br/>
                    Rate: ₹8.5/kWh<br/>
                    = <span className="font-bold text-indigo-700">₹{Math.round(((pgRooms.find(r => r.roomNumber === selectedRoomFilter)?.submeterReading) ?? 248) * 8.5).toLocaleString('en-IN')} billed to Room {selectedRoomFilter}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-indigo-100 font-mono">
                    Room 101: 248 kWh<br/>
                    Room 102: 312 kWh<br/>
                    Rate: ₹8.5/kWh<br/>
                    = <span className="font-bold text-indigo-700">₹2,108 billed to Room 101</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500">
                  AC rooms equipped with IoT sub-meters bill according to actual energy consumption.
                </p>
              </div>

              {/* Method 3: Roommate Split */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>3. Room-Level Split</span>
                </div>
                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 font-mono">
                  Room 201 Total: ₹3,200<br/>
                  ÷ 4 Roommates<br/>
                  = <span className="font-bold text-emerald-700">₹800 / occupant</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Equal divide among occupants in quadruple sharing dorm rooms.
                </p>
              </div>
            </div>

            {/* Room Level Sub-meter Readings Table */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">Live Room Sub-meter Log &amp; Split Method</h3>
                {selectedRoomFilter && (
                  <span className="text-[11px] text-amber-700 font-bold">
                    Filtered to Room {selectedRoomFilter} (ROOM-{selectedRoomFilter})
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-2">Room &amp; Asset ID</th>
                      <th className="py-2">Floor</th>
                      <th className="py-2">Sharing</th>
                      <th className="py-2">Split Method</th>
                      <th className="py-2">Latest Sub-meter</th>
                      <th className="py-2">Billed Amount</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedRoomFilter ? pgRooms.filter(r => r.roomNumber === selectedRoomFilter) : pgRooms).map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-bold text-slate-900">
                          <div>Room {room.roomNumber}</div>
                          <div className="text-[10px] text-indigo-700 font-mono">ROOM-{room.roomNumber}</div>
                        </td>
                        <td className="py-2.5 text-slate-600">Floor {room.floor}</td>
                        <td className="py-2.5 text-slate-600">{room.sharingType}</td>
                        <td className="py-2.5">
                          <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                            {room.electricitySplitMethod}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-slate-800">
                          {room.submeterReading !== undefined ? `${room.submeterReading} kWh (SUB-${room.roomNumber})` : 'Shared main line'}
                        </td>
                        <td className="py-2.5 font-black text-slate-900">
                          ₹{room.submeterReading ? Math.round(room.submeterReading * 8.5).toLocaleString('en-IN') : '1,200'}
                        </td>
                        <td className="py-2.5 text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Pushed to Invoices</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PG FOOD & MESS MANAGEMENT */}
      {activeTab === 'MEALS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Mess &amp; Meal Operations
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">PG &amp; Hostel Mess Management</h2>
              <p className="text-xs text-slate-500">
                Track daily meal attendance (Breakfast, Lunch, Dinner), meal subscriptions, and vendor billing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pgMeals.map((meal) => (
                <div key={meal.id} className="p-4 rounded-2xl border border-slate-200 bg-[#fbfbfa] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{meal.mealType}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {meal.optedInCount} Students Opted-in
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {meal.menu}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div>Vendor: <span className="font-semibold text-slate-800">{meal.vendor}</span></div>
                    <div className="font-bold text-slate-900">₹{meal.costPerMeal}/plate</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-900">Monthly Mess Vendor Payout Estimate</div>
                <div className="text-xs text-indigo-700 mt-0.5">Annapoorna Kitchens • 88 Average daily breakfast, 64 lunch, 92 dinner</div>
              </div>
              <div className="text-base font-black text-indigo-950">
                ₹1,84,200 / month
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOSTEL, STUDENTS & VISITORS */}
      {activeTab === 'HOSTEL' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#e3e1d8] space-y-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Hostel Operations &amp; Safety Protocol
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Hostel Guardians &amp; Resident Log</h2>
              <p className="text-xs text-slate-500">
                Student guardian records, curfews, emergency contacts, visitor records, and community amenities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-indigo-600" />
                  <span>Student Guardian Emergency Contacts</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Aditya Verma (Bed 101-A)</div>
                      <div className="text-[10px] text-slate-500">Guardian: Rajesh Verma (Father)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-slate-700">+91 98410 88219</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Varun Nair (Bed 101-B)</div>
                      <div className="text-[10px] text-slate-500">Guardian: S. Nair (Mother)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-slate-700">+91 94470 33100</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Verified</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span>Hostel Visitor Log (Biometric Entry)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">Meenakshi Verma</div>
                      <div className="text-[10px] text-slate-500">Visiting Aditya (Room 101) • 4:00 PM - 6:30 PM</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Checked Out
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">Praveen K. (Laptop Repair)</div>
                      <div className="text-[10px] text-slate-500">Authorized Tech Vendor • In Common Room</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Inside Campus
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
