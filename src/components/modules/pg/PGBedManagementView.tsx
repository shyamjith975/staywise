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
    currentUser,
    activeRole,
    pgBeds, 
    pgRooms, 
    pgMeals, 
    addPgMeal,
    updatePgMeal,
    deletePgMeal,
    properties,
    updatePGBedStatus, 
    addNotification,
    setIsAddPropertyOpen,
    setActiveView,
    foodMenuItems,
    addFoodMenuItem,
    deleteFoodMenuItem
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'BEDS' | 'ELECTRICITY' | 'MEALS' | 'HOSTEL'>('LISTINGS');
  const [listingCategoryFilter, setListingCategoryFilter] = useState<'ALL' | 'PG' | 'ROOM' | 'COMMERCIAL' | 'RESIDENTIAL'>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBedForAction, setSelectedBedForAction] = useState<PGBed | null>(null);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string | null>(null);
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string | null>(null);

  // Meal Modal State
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [mealForm, setMealForm] = useState<{
    mealType: 'Breakfast' | 'Lunch' | 'Dinner';
    menu: string;
    vendor: string;
    costPerMeal: number;
    optedInCount: number;
  }>({
    mealType: 'Breakfast',
    menu: '',
    vendor: '',
    costPerMeal: 60,
    optedInCount: 0
  });

  // Submeter modal state
  const [isUpdateSubmeterModalOpen, setIsUpdateSubmeterModalOpen] = useState(false);
  const [meterModalRoomId, setMeterModalRoomId] = useState<string>('');
  const [meterModalReading, setMeterModalReading] = useState<number>(0);
  const [meterModalSplitMethod, setMeterModalSplitMethod] = useState<'Equal' | 'Submeter' | 'Room-level'>('Submeter');
  const [meterModalRate, setMeterModalRate] = useState<number>(8.5);

  // Total building bill state for electricity split calculation
  const isDemoAccountInitial = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';
  const [totalBuildingBill, setTotalBuildingBill] = useState<number>(isDemoAccountInitial ? 20000 : 0);

  // Local room overrides for manual submeter updates
  const [roomOverrides, setRoomOverrides] = useState<Record<string, { submeterReading: number; electricitySplitMethod: 'Equal' | 'Submeter' | 'Room-level' }>>({});

  // Daily Food Menu Item Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [foodItemForm, setFoodItemForm] = useState({
    name: '',
    category: 'Standard' as 'Standard' | 'Special' | 'Add-on',
    mealType: 'Breakfast' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks',
    dietaryTag: 'Vegetarian' as 'Vegetarian' | 'Non-Vegetarian' | 'Jain',
    price: 60,
    availableTimings: '07:30 - 10:00 AM',
    description: ''
  });

  // Check demo account vs real new onboarded owner
  const isDemoAccount = currentUser?.email === 'owner@staywise.com' || currentUser?.id === 'user-owner-vikram' || activeRole === 'admin';

  // Demo vs dynamic guardian & visitor states
  const [guardianContacts, setGuardianContacts] = useState(isDemoAccount ? [
    { id: 'g-1', studentName: 'Aditya Verma (Bed 101-A)', guardianName: 'Rajesh Verma (Father)', phone: '+91 98410 88219', status: 'Verified' },
    { id: 'g-2', studentName: 'Varun Nair (Bed 101-B)', guardianName: 'S. Nair (Mother)', phone: '+91 94470 33100', status: 'Verified' }
  ] : []);
  const [isAddGuardianModalOpen, setIsAddGuardianModalOpen] = useState(false);
  const [guardianForm, setGuardianForm] = useState({
    studentName: '',
    guardianName: '',
    relationship: 'Father',
    phone: ''
  });

  const [hostelVisitors, setHostelVisitors] = useState(isDemoAccount ? [
    { id: 'v-1', name: 'Meenakshi Verma', purpose: 'Visiting Aditya (Room 101) • 4:00 PM - 6:30 PM', status: 'Checked Out' },
    { id: 'v-2', name: 'Praveen K. (Laptop Repair)', purpose: 'Authorized Tech Vendor • In Common Room', status: 'Inside Campus' }
  ] : []);
  const [isLogVisitorModalOpen, setIsLogVisitorModalOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    purpose: '',
    status: 'Inside Campus' as 'Inside Campus' | 'Checked Out'
  });

  // For non-demo user, scope beds and rooms strictly to properties owned by currentUser
  const userOwnedProperties = isDemoAccount ? properties : properties.filter(p => p.ownerId === currentUser?.id);
  const userOwnedPropIds = userOwnedProperties.map(p => p.id);
  const activePgRooms = isDemoAccount ? pgRooms : pgRooms.filter(r => userOwnedPropIds.includes(r.propertyId));
  const activePgRoomIds = activePgRooms.map(r => r.id);
  const activePgRoomNumbers = activePgRooms.map(r => r.roomNumber);
  const activePgBeds = isDemoAccount 
    ? pgBeds 
    : pgBeds.filter(b => activePgRoomIds.includes(b.roomId) || activePgRoomNumbers.includes(b.roomNumber));

  // Dynamic PG Dashboard Metrics (Zero mock additions)
  const totalBeds = activePgBeds.length;
  const occupiedBeds = activePgBeds.filter(b => b.status === 'Occupied').length;
  const vacantBeds = activePgBeds.filter(b => b.status === 'Available').length;
  const reservedBeds = activePgBeds.filter(b => b.status === 'Reserved').length;
  const noticeBeds = activePgBeds.filter(b => b.status === 'Notice Given').length;
  const occupancyPercent = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '0.0';
  const expectedRevenue = activePgBeds.reduce((acc, b) => acc + (b.monthlyRent || 0), 0);
  const collectedRevenue = activePgBeds.filter(b => b.status === 'Occupied').reduce((acc, b) => acc + (b.monthlyRent || 0), 0);
  const pendingRevenue = Math.max(0, expectedRevenue - collectedRevenue);

  // Filtered Beds - strictly matches selectedRoomFilter if chosen
  const filteredBeds = activePgBeds.filter(bed => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#D2DDD7] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Staywise Asset Universe &amp; Bed Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">PGs • Private Rooms • Commercial Buildings • Residential</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#263238]">
            Bed, Room &amp; Building Universe
          </h1>
          <p className="text-xs text-[#666666]">
            Comprehensive multi-asset inventory management with PG bed state machines, private rooms, commercial floors, and sub-meter power.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'LISTINGS'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Asset Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('BEDS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'BEDS'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <BedDouble className="h-3.5 w-3.5" />
            <span>Bed Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('ELECTRICITY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ELECTRICITY'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Electricity Split</span>
          </button>
          <button
            onClick={() => setActiveTab('MEALS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MEALS'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <Utensils className="h-3.5 w-3.5" />
            <span>Food &amp; Mess</span>
          </button>
          <button
            onClick={() => setActiveTab('HOSTEL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'HOSTEL'
                ? 'bg-[#163B36] text-white shadow-xs'
                : 'text-[#546E7A] hover:text-[#263238]'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Hostel &amp; Visitors</span>
          </button>
        </div>
      </div>

      {/* SECTION 5: PG Dashboard Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Beds</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalBeds}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{activePgRooms.length} Active Rooms</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-indigo-600">Occupied</div>
          <div className="text-xl font-black text-indigo-950 mt-1">{occupiedBeds}</div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">{occupancyPercent}% Occupancy</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Vacant Beds</div>
          <div className="text-xl font-black text-emerald-950 mt-1">{vacantBeds}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{vacantBeds > 0 ? 'Ready for Check-in' : 'No Vacant Beds'}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-700">Reserved</div>
          <div className="text-xl font-black text-amber-950 mt-1">{reservedBeds}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Deposits Received</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Expected Rev</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {expectedRevenue >= 100000 ? `₹${(expectedRevenue / 100000).toFixed(1)}L` : `₹${expectedRevenue.toLocaleString('en-IN')}`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {totalBeds > 0 ? `₹${Math.round(expectedRevenue / totalBeds).toLocaleString('en-IN')} avg/bed` : '₹0 avg'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#D2DDD7] shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Collected</div>
          <div className="text-xl font-black text-emerald-900 mt-1">
            {collectedRevenue >= 100000 ? `₹${(collectedRevenue / 100000).toFixed(1)}L` : `₹${collectedRevenue.toLocaleString('en-IN')}`}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {expectedRevenue > 0 ? `${Math.round((collectedRevenue / expectedRevenue) * 100)}% Collected` : '0%'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-rose-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[10px] uppercase font-bold text-rose-600">Pending Rent</div>
          <div className="text-xl font-black text-rose-950 mt-1">
            {pendingRevenue >= 100000 ? `₹${(pendingRevenue / 100000).toFixed(1)}L` : `₹${pendingRevenue.toLocaleString('en-IN')}`}
          </div>
          <div className="text-[10px] text-rose-600 font-medium mt-0.5">
            {pendingRevenue > 0 ? 'Pending Collection' : 'Zero Overdue'}
          </div>
        </div>
      </div>

      {/* SECTION TO LIST PG, ROOM, COMMERCIAL BUILDING, RESIDENTIAL */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#D2DDD7] shadow-sm">
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
                      ? 'bg-[#263238] text-white shadow-sm'
                      : 'bg-[#E8F0EC] text-slate-600 hover:text-slate-900 hover:bg-[#E8F0EC]'
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
              className="py-2 px-4 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add to Universe</span>
            </button>
          </div>

          {(!isDemoAccount && userOwnedProperties.length === 0) ? (
            <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-[#D2DDD7] text-center space-y-4 animate-in fade-in duration-200">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#263238]">No assets or properties registered yet</h3>
                <p className="text-xs text-[#666666] max-w-md mx-auto">
                  Your asset universe is currently clean. Add your first PG, residential apartment, or commercial floor to start managing beds and tenants.
                </p>
              </div>
              <button
                onClick={() => setIsAddPropertyOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Property to Universe</span>
              </button>
            </div>
          ) : !isDemoAccount ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-[#263238] text-sm">Your Registered Properties ({userOwnedProperties.length})</h2>
                <button
                  onClick={() => setIsAddPropertyOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#163B36] text-white text-xs font-bold hover:bg-[#0F2925] transition shadow-xs"
                >
                  + Add Property
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userOwnedProperties.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {p.type}
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1">{p.name}</h3>
                        <p className="text-xs text-slate-500">{p.address}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {p.totalUnits > 0 ? `${Math.round((p.occupiedUnits / p.totalUnits) * 100)}% Occupied` : '0 Units'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#E8F0EC] text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Units</span>
                        <span className="font-bold text-slate-900">{p.occupiedUnits} / {p.totalUnits}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Expected Rent</span>
                        <span className="font-bold text-slate-900">₹{p.expectedMonthlyRent.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* ASSET SECTION 1: PG & Co-Living Properties */}
              {(listingCategoryFilter === 'ALL' || listingCategoryFilter === 'PG') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-indigo-600" />
                  <h2 className="font-extrabold text-[#263238] text-sm">Managed PG &amp; Co-Living Buildings</h2>
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
                <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-sm hover:shadow-md transition space-y-4">
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

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-center">
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

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8F0EC]">
                    <button
                      onClick={() => {
                        setSelectedRoomFilter(null);
                        setSelectedPropertyFilter('Staywise Urban PG');
                        setActiveTab('BEDS');
                      }}
                      className="py-2 px-2 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold text-center transition"
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
                <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-sm hover:shadow-md transition space-y-4">
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

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] text-center">
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

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8F0EC]">
                    <button
                      onClick={() => setActiveTab('HOSTEL')}
                      className="py-2 px-3 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold text-center transition"
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
                  <h2 className="font-extrabold text-[#263238] text-sm">Individual Rooms &amp; Studio Suites</h2>
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
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-[#D2DDD7] space-y-3 shadow-sm hover:border-[#263238] transition">
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
                      <div className="text-sm font-black text-[#263238] pt-1">₹{room.rent.toLocaleString('en-IN')}<span className="text-[10px] font-medium text-slate-400">/mo</span></div>
                    </div>

                    <div className="pt-2 border-t border-[#E8F0EC] space-y-1 text-[11px] text-slate-600">
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
                        className="py-1.5 px-2 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
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
                  <h2 className="font-extrabold text-[#263238] text-sm">Commercial Buildings, Offices &amp; Logistics</h2>
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
                <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-sm space-y-4">
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

                  <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
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

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8F0EC]">
                    <button
                      onClick={() => setActiveView('commercial')}
                      className="py-2 px-3 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold text-center transition"
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
                <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] shadow-sm space-y-4">
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

                  <div className="p-3 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Zone A: Bay 1-2 — TransIndia Cold Storage</span>
                      <span className="font-black text-slate-900">₹2,80,000/mo</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Zone B: Bay 3-4 — Apex E-Commerce Fulfillment</span>
                      <span className="font-black text-slate-900">₹1,70,000/mo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8F0EC]">
                    <button
                      onClick={() => setActiveView('commercial')}
                      className="py-2 px-3 rounded-xl bg-[#263238] hover:bg-[#263238] text-white text-xs font-bold text-center transition"
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
                  <h2 className="font-extrabold text-[#263238] text-sm">Residential Apartments, Villas &amp; Duplexes</h2>
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
                <div className="bg-white p-4 rounded-2xl border border-[#D2DDD7] space-y-2">
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
                <div className="bg-white p-4 rounded-2xl border border-[#D2DDD7] space-y-2">
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

            </>
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#D2DDD7]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bed code, room, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#263238]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 bg-[#E8F0EC] p-1 rounded-xl border border-[#D2DDD7]">
                <button
                  onClick={() => setSelectedFloor('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    selectedFloor === 'ALL' ? 'bg-[#263238] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Floors
                </button>
                {[1, 2, 3].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      selectedFloor === floor ? 'bg-[#263238] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs font-semibold text-slate-800"
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
          {filteredBeds.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-[#D2DDD7] p-8 space-y-3">
              <BedDouble className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No PG Beds Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedRoomFilter 
                  ? `No beds configured under Room ${selectedRoomFilter}.`
                  : 'There are no active PG beds in your portfolio. Add a PG property to configure rooms, beds, and sub-meters.'}
              </p>
              <button
                onClick={() => setIsAddPropertyOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#263238] text-white text-xs font-bold hover:bg-[#263238]/90 transition"
              >
                + Add PG Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {filteredBeds.map((bed) => (
                <div
                  key={bed.id}
                  className="bg-white rounded-2xl border border-[#D2DDD7] p-3.5 shadow-sm hover:border-[#263238] hover:shadow-md transition flex flex-col justify-between"
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
                        <div className="text-sm font-black text-[#263238]">{bed.bedCode}</div>
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
                      className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-[#263238] hover:text-white text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>Update State</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* State Transition Modal */}
          {selectedBedForAction && (
            <div 
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedBedForAction(null); }}
            >
              <div className="w-full max-w-md bg-white rounded-3xl p-5 border border-[#D2DDD7] shadow-2xl space-y-4">
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

          <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Sub-Meter Billing Architecture
                </span>
                <h2 className="text-base font-extrabold text-[#263238] mt-1">PG Electricity Multi-Method Split Engine</h2>
                <p className="text-xs text-[#546E7A]">
                  Supports Equal Split (entire building), Sub-meter per room kWh, and Roommate-level splits feeding directly into monthly tenant invoices.
                </p>
              </div>

              <button
                onClick={() => {
                  if (activePgRooms.length > 0) {
                    setMeterModalRoomId(activePgRooms[0].roomNumber);
                    setMeterModalReading(activePgRooms[0].submeterReading || 0);
                    setMeterModalSplitMethod(activePgRooms[0].electricitySplitMethod || 'Submeter');
                  }
                  setIsUpdateSubmeterModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#C69A55]" />
                <span>+ Update Room Sub-Meter</span>
              </button>
            </div>

            {/* Bill Input / Config Bar */}
            <div className="p-3.5 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#163B36]" />
                <span className="font-bold text-[#263238]">Total Building Electricity Bill (₹):</span>
                <input
                  type="number"
                  value={totalBuildingBill}
                  onChange={(e) => setTotalBuildingBill(Number(e.target.value) || 0)}
                  placeholder="e.g. 20000"
                  className="w-32 px-3 py-1.5 rounded-xl border border-[#D2DDD7] bg-white font-mono font-bold text-[#263238] text-xs"
                />
              </div>
              <div className="text-[11px] text-[#546E7A]">
                Active Occupied Tenants: <b className="text-[#263238]">{occupiedBeds}</b> • Configured Rooms: <b className="text-[#263238]">{activePgRooms.length}</b>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Method 1: Equal Split */}
              <div className="p-4 rounded-2xl border border-[#D2DDD7] bg-[#F7F8F6] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#263238]">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>1. Equal Split Across Tenants</span>
                </div>
                <div className="text-xs text-[#263238] bg-white p-3 rounded-xl border border-[#D2DDD7] font-mono">
                  Total Bill: ₹{totalBuildingBill.toLocaleString('en-IN')}<br/>
                  ÷ {occupiedBeds} Occupied Tenants<br/>
                  = <span className="font-bold text-emerald-700">
                    ₹{occupiedBeds > 0 && totalBuildingBill > 0 ? Math.round(totalBuildingBill / occupiedBeds).toLocaleString('en-IN') : 0} each
                  </span>
                </div>
                <p className="text-[11px] text-[#546E7A]">
                  Standard baseline mode for hostels without submetering. Split is computed on 1st of each month.
                </p>
              </div>

              {/* Method 2: Sub-meter per room */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  <span>2. Sub-Meter kWh Precision</span>
                </div>
                {activePgRooms.length > 0 ? (
                  <div className="text-xs text-[#263238] bg-white p-3 rounded-xl border border-indigo-100 font-mono">
                    Room {activePgRooms[0].roomNumber}: {roomOverrides[activePgRooms[0].roomNumber]?.submeterReading ?? (activePgRooms[0].submeterReading || 0)} kWh<br/>
                    Rate: ₹8.5/kWh<br/>
                    = <span className="font-bold text-indigo-700">
                      ₹{Math.round((roomOverrides[activePgRooms[0].roomNumber]?.submeterReading ?? (activePgRooms[0].submeterReading || 0)) * 8.5).toLocaleString('en-IN')} billed to Room {activePgRooms[0].roomNumber}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-[#546E7A] bg-white p-3 rounded-xl border border-indigo-100">
                    No rooms onboarded yet
                  </div>
                )}
                <p className="text-[11px] text-[#546E7A]">
                  AC rooms equipped with IoT sub-meters bill according to actual energy consumption.
                </p>
              </div>

              {/* Method 3: Roommate Split */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>3. Room-Level Split</span>
                </div>
                <div className="text-xs text-[#263238] bg-white p-3 rounded-xl border border-emerald-100 font-mono">
                  Sub-meter room bill<br/>
                  ÷ Active Roommates in Room<br/>
                  = <span className="font-bold text-emerald-700">Equally divided per occupant</span>
                </div>
                <p className="text-[11px] text-[#546E7A]">
                  Equal divide among occupants in quadruple sharing dorm rooms.
                </p>
              </div>
            </div>

            {/* Room Level Sub-meter Readings Table */}
            <div className="mt-4 border-t border-[#D2DDD7] pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[#263238]">Live Room Sub-meter Log &amp; Split Method</h3>
                {selectedRoomFilter && (
                  <span className="text-[11px] text-amber-700 font-bold">
                    Filtered to Room {selectedRoomFilter} (ROOM-{selectedRoomFilter})
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#D2DDD7] text-[#546E7A] uppercase text-[10px]">
                      <th className="py-2">Room &amp; Asset ID</th>
                      <th className="py-2">Floor</th>
                      <th className="py-2">Sharing</th>
                      <th className="py-2">Split Method</th>
                      <th className="py-2">Latest Sub-meter</th>
                      <th className="py-2">Billed Amount</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D2DDD7]/50">
                    {activePgRooms.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#546E7A]">
                          <p className="font-bold">No rooms configured for this property.</p>
                          <p className="text-[11px] mt-0.5">Add PG rooms or units in Listings to begin logging electricity sub-meter readings.</p>
                        </td>
                      </tr>
                    ) : (
                      (selectedRoomFilter ? activePgRooms.filter(r => r.roomNumber === selectedRoomFilter) : activePgRooms).map((room) => {
                        const override = roomOverrides[room.roomNumber];
                        const reading = override?.submeterReading ?? room.submeterReading;
                        const splitMethod = override?.electricitySplitMethod ?? room.electricitySplitMethod;
                        const billed = reading !== undefined ? Math.round(reading * 8.5) : (occupiedBeds > 0 && totalBuildingBill > 0 ? Math.round(totalBuildingBill / occupiedBeds) : 0);

                        return (
                          <tr key={room.id} className="hover:bg-slate-50">
                            <td className="py-2.5 font-bold text-[#263238]">
                              <div>Room {room.roomNumber}</div>
                              <div className="text-[10px] text-indigo-700 font-mono">ROOM-{room.roomNumber}</div>
                            </td>
                            <td className="py-2.5 text-[#546E7A]">Floor {room.floor}</td>
                            <td className="py-2.5 text-[#546E7A]">{room.sharingType}</td>
                            <td className="py-2.5">
                              <span className="font-semibold px-2 py-0.5 rounded-md bg-[#E8F0EC] text-[#163B36] text-[10px]">
                                {splitMethod}
                              </span>
                            </td>
                            <td className="py-2.5 font-mono text-[#263238]">
                              {reading !== undefined ? `${reading} kWh (SUB-${room.roomNumber})` : 'Shared main line'}
                            </td>
                            <td className="py-2.5 font-black text-[#263238]">
                              ₹{billed.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 text-[#163B36] font-bold">
                              {reading !== undefined ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Reading Logged</span>
                                </span>
                              ) : (
                                <span className="text-amber-700">Pending Reading</span>
                              )}
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => {
                                  setMeterModalRoomId(room.roomNumber);
                                  setMeterModalReading(reading || 0);
                                  setMeterModalSplitMethod(splitMethod || 'Submeter');
                                  setIsUpdateSubmeterModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#E8F0EC] hover:bg-[#D2DDD7] text-[#163B36] text-[11px] font-bold transition"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
          <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Mess &amp; Meal Operations
                </span>
                <h2 className="text-base font-extrabold text-[#263238] mt-1">PG &amp; Hostel Mess Management</h2>
                <p className="text-xs text-[#546E7A]">
                  Track daily meal attendance (Breakfast, Lunch, Dinner), meal subscriptions, and vendor billing.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMealId(null);
                  setMealForm({
                    mealType: 'Breakfast',
                    menu: '',
                    vendor: 'Annapoorna Kitchens',
                    costPerMeal: 60,
                    optedInCount: 40
                  });
                  setIsMealModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#C69A55]" />
                <span>+ Add Meal Plan</span>
              </button>
            </div>

            {pgMeals.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6">
                <Utensils className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                <h4 className="text-xs font-bold text-[#263238]">No Meal Plans Configured</h4>
                <p className="text-[11px] text-[#546E7A] mt-0.5">Click &ldquo;+ Add Meal Plan&rdquo; above to setup daily breakfast, lunch, or dinner menus.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pgMeals.map((meal) => (
                  <div key={meal.id} className="p-4 rounded-2xl border border-[#D2DDD7] bg-[#ffffff] space-y-3 flex flex-col justify-between hover:shadow-sm transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#263238]">{meal.mealType}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-[#E8F0EC] px-2 py-0.5 rounded-md border border-[#D2DDD7]">
                          {meal.optedInCount} Students Opted-in
                        </span>
                      </div>
                      <p className="text-xs text-[#263238] leading-relaxed bg-[#F7F8F6] p-3 rounded-xl border border-[#D2DDD7]">
                        {meal.menu}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#D2DDD7] space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#546E7A]">
                        <div>Vendor: <span className="font-semibold text-[#263238]">{meal.vendor}</span></div>
                        <div className="font-bold text-[#163B36]">₹{meal.costPerMeal}/plate</div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setEditingMealId(meal.id);
                            setMealForm({
                              mealType: meal.mealType,
                              menu: meal.menu,
                              vendor: meal.vendor,
                              costPerMeal: meal.costPerMeal,
                              optedInCount: meal.optedInCount
                            });
                            setIsMealModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#E8F0EC] hover:bg-[#DCE8E1] text-[#163B36] text-[11px] font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove the ${meal.mealType} meal plan?`)) {
                              deletePgMeal(meal.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Monthly vendor payout dynamic estimate */}
            {pgMeals.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#D2DDD7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-[#163B36]">Monthly Mess Vendor Payout Estimate</div>
                  <div className="text-xs text-[#546E7A] mt-0.5">
                    {pgMeals.map(m => `${m.optedInCount} ${m.mealType.toLowerCase()}`).join(' • ')} (Calculated over 30 days)
                  </div>
                </div>
                <div className="text-base font-black text-[#163B36] font-tabular">
                  ₹{pgMeals.reduce((acc, m) => acc + (m.optedInCount * m.costPerMeal * 30), 0).toLocaleString('en-IN')} / month
                </div>
              </div>
            )}

            {/* Daily Food & Menu Items Section */}
            <div className="pt-6 border-t border-[#D2DDD7] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#163B36] uppercase tracking-wider bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#D2DDD7]">
                    Published Food Menu
                  </span>
                  <h3 className="text-base font-extrabold text-[#263238] mt-1">Tenant Daily Food &amp; Mess Items</h3>
                  <p className="text-xs text-[#546E7A]">
                    Published menu items with dietary preferences and live tenant opt-in/opt-out toggles.
                  </p>
                </div>

                <button
                  onClick={() => setIsFoodModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#163B36] hover:bg-[#102B27] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-[#C69A55]" />
                  <span>+ Add Food Menu Item</span>
                </button>
              </div>

              {foodMenuItems.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-[#D2DDD7] rounded-2xl p-6 bg-[#F7F8F6]">
                  <Utensils className="h-8 w-8 text-[#D2DDD7] mx-auto mb-2 opacity-50" />
                  <h4 className="text-xs font-bold text-[#263238]">No Daily Menu Items Published</h4>
                  <p className="text-[11px] text-[#546E7A] mt-0.5">Click &ldquo;+ Add Food Menu Item&rdquo; above to publish dishes for breakfast, lunch, or dinner.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {foodMenuItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-[#D2DDD7] bg-white space-y-2.5 flex flex-col justify-between hover:shadow-sm transition">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#263238]">{item.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            item.dietaryTag === 'Vegetarian' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                              : item.dietaryTag === 'Non-Vegetarian'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {item.dietaryTag}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#546E7A]">
                          {item.mealType} • <span className="text-[#263238] font-semibold">{item.availableTimings}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-[#263238]/80 bg-[#F7F8F6] p-2 rounded-xl border border-[#D2DDD7]">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#D2DDD7] flex items-center justify-between">
                        <span className="text-xs font-black text-[#163B36] font-tabular">
                          ₹{item.price} / serving
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Delete menu item ${item.name}?`)) deleteFoodMenuItem(item.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOSTEL, STUDENTS & VISITORS */}
      {activeTab === 'HOSTEL' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#D2DDD7] space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#163B36] uppercase tracking-wider bg-[#E8F0EC] px-2.5 py-0.5 rounded-full border border-[#D2DDD7]">
                Hostel Operations &amp; Safety Protocol
              </span>
              <h2 className="text-base font-extrabold text-[#263238] mt-1">Hostel Guardians &amp; Resident Log</h2>
              <p className="text-xs text-[#546E7A]">
                Student guardian records, curfews, emergency contacts, visitor records, and community amenities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Contacts Card */}
              <div className="p-4 rounded-2xl border border-[#D2DDD7] bg-[#F7F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#263238] flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-[#163B36]" />
                    <span>Student Guardian Emergency Contacts</span>
                  </div>
                  <button
                    onClick={() => setIsAddGuardianModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DDD7] text-[#163B36] text-[11px] font-bold hover:bg-[#E8F0EC] transition"
                  >
                    + Add Contact
                  </button>
                </div>

                {guardianContacts.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[#D2DDD7] rounded-xl bg-white">
                    <p className="text-xs font-semibold text-[#546E7A]">No emergency guardian contacts logged</p>
                    <p className="text-[10px] text-[#78909C] mt-0.5">Click &ldquo;+ Add Contact&rdquo; to store parent/guardian contact numbers.</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {guardianContacts.map(g => (
                      <div key={g.id} className="p-2.5 rounded-xl bg-white border border-[#D2DDD7] flex justify-between items-center">
                        <div>
                          <div className="font-bold text-[#263238]">{g.studentName}</div>
                          <div className="text-[10px] text-[#546E7A]">Guardian: {g.guardianName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[#263238] font-bold">{g.phone}</div>
                          <div className="text-[10px] text-emerald-800 font-semibold">{g.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visitor Log Card */}
              <div className="p-4 rounded-2xl border border-[#D2DDD7] bg-[#F7F8F6] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#263238] flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#163B36]" />
                    <span>Hostel Visitor Log (Biometric Entry)</span>
                  </div>
                  <button
                    onClick={() => setIsLogVisitorModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DDD7] text-[#163B36] text-[11px] font-bold hover:bg-[#E8F0EC] transition"
                  >
                    + Log Visitor
                  </button>
                </div>

                {hostelVisitors.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[#D2DDD7] rounded-xl bg-white">
                    <p className="text-xs font-semibold text-[#546E7A]">No visitor entries logged today</p>
                    <p className="text-[10px] text-[#78909C] mt-0.5">Click &ldquo;+ Log Visitor&rdquo; to record biometric guest check-ins.</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {hostelVisitors.map(v => (
                      <div key={v.id} className="p-2.5 rounded-xl bg-white border border-[#D2DDD7] flex justify-between items-center">
                        <div>
                          <div className="font-bold text-[#263238]">{v.name}</div>
                          <div className="text-[10px] text-[#546E7A]">{v.purpose}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          v.status === 'Inside Campus' 
                            ? 'bg-[#E8F0EC] text-[#163B36] border border-[#D2DDD7]' 
                            : 'bg-slate-100 text-[#546E7A]'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Meal Plan */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <h3 className="font-extrabold text-base text-[#263238]">
                {editingMealId ? 'Edit Meal Plan' : 'Add New Meal Plan'}
              </h3>
              <button onClick={() => setIsMealModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingMealId) {
                  updatePgMeal(editingMealId, mealForm);
                } else {
                  addPgMeal({
                    mealType: mealForm.mealType,
                    menu: mealForm.menu,
                    vendor: mealForm.vendor,
                    costPerMeal: Number(mealForm.costPerMeal),
                    optedInCount: Number(mealForm.optedInCount),
                    date: new Date().toISOString().split('T')[0]
                  });
                }
                setIsMealModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Meal Timing / Type</label>
                <select
                  value={mealForm.mealType}
                  onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                >
                  <option value="Breakfast">Breakfast (Morning 7:30 - 9:30 AM)</option>
                  <option value="Lunch">Lunch (Afternoon 12:30 - 2:30 PM)</option>
                  <option value="Dinner">Dinner (Night 7:30 - 9:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Menu Description</label>
                <textarea
                  required
                  rows={3}
                  value={mealForm.menu}
                  onChange={(e) => setMealForm({ ...mealForm, menu: e.target.value })}
                  placeholder="e.g. South Indian Idli, Vada, Sambar, Chutney &amp; Filter Coffee"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] text-[#263238] font-medium focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Cost Per Plate (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={mealForm.costPerMeal}
                    onChange={(e) => setMealForm({ ...mealForm, costPerMeal: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Students Opted-In</label>
                  <input
                    type="number"
                    min={0}
                    value={mealForm.optedInCount}
                    onChange={(e) => setMealForm({ ...mealForm, optedInCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Catering / Kitchen Vendor</label>
                <input
                  type="text"
                  required
                  value={mealForm.vendor}
                  onChange={(e) => setMealForm({ ...mealForm, vendor: e.target.value })}
                  placeholder="e.g. Annapoorna Kitchens"
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                {editingMealId ? 'Save Changes' : 'Create Meal Plan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Guardian Contact */}
      {isAddGuardianModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <h3 className="font-extrabold text-base text-[#263238]">Add Emergency Guardian Contact</h3>
              <button onClick={() => setIsAddGuardianModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGuardianContacts(prev => [
                  ...prev,
                  {
                    id: `g-${Date.now()}`,
                    studentName: guardianForm.studentName,
                    guardianName: `${guardianForm.guardianName} (${guardianForm.relationship})`,
                    phone: guardianForm.phone,
                    status: 'Verified'
                  }
                ]);
                addNotification('Guardian Contact Added', `Emergency record saved for ${guardianForm.studentName}.`, 'SYSTEM');
                setIsAddGuardianModalOpen(false);
                setGuardianForm({ studentName: '', guardianName: '', relationship: 'Father', phone: '' });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Student &amp; Bed/Room</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma (Bed 204-A)"
                  value={guardianForm.studentName}
                  onChange={(e) => setGuardianForm({ ...guardianForm, studentName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Guardian Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manoj Sharma"
                  value={guardianForm.guardianName}
                  onChange={(e) => setGuardianForm({ ...guardianForm, guardianName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Relationship</label>
                  <select
                    value={guardianForm.relationship}
                    onChange={(e) => setGuardianForm({ ...guardianForm, relationship: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Local Guardian">Local Guardian</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#546E7A] font-semibold mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={guardianForm.phone}
                    onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Save Emergency Contact
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Visitor */}
      {isLogVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263238]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D2DDD7] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <h3 className="font-extrabold text-base text-[#263238]">Log Campus Visitor</h3>
              <button onClick={() => setIsLogVisitorModalOpen(false)} className="text-[#546E7A] hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHostelVisitors(prev => [
                  {
                    id: `v-${Date.now()}`,
                    name: visitorForm.name,
                    purpose: visitorForm.purpose,
                    status: visitorForm.status
                  },
                  ...prev
                ]);
                addNotification('Visitor Pass Generated', `Visitor entry logged for ${visitorForm.name}.`, 'SYSTEM');
                setIsLogVisitorModalOpen(false);
                setVisitorForm({ name: '', purpose: '', status: 'Inside Campus' });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Devi"
                  value={visitorForm.name}
                  onChange={(e) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Purpose / Student Visited</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visiting Ananya (Room 202) • 3:00 PM - 5:30 PM"
                  value={visitorForm.purpose}
                  onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-medium text-[#263238] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#546E7A] font-semibold mb-1">Current Gate Status</label>
                <select
                  value={visitorForm.status}
                  onChange={(e) => setVisitorForm({ ...visitorForm, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F8F6] border border-[#D2DDD7] font-bold text-[#263238] focus:bg-white focus:outline-none"
                >
                  <option value="Inside Campus">Inside Campus (Biometric Pass Active)</option>
                  <option value="Checked Out">Checked Out</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#163B36] hover:bg-[#102B27] text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Log Visitor Pass
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE ROOM SUBMETER MODAL */}
      {isUpdateSubmeterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Update Room Sub-Meter Reading</h3>
                <p className="text-xs text-[#546E7A]">Set latest kWh reading &amp; split allocation method</p>
              </div>
              <button onClick={() => setIsUpdateSubmeterModalOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setRoomOverrides(prev => ({
                ...prev,
                [meterModalRoomId]: {
                  submeterReading: Number(meterModalReading) || 0,
                  electricitySplitMethod: meterModalSplitMethod
                }
              }));
              addNotification('Sub-Meter Logged', `Room ${meterModalRoomId} reading updated to ${meterModalReading} kWh (${meterModalSplitMethod} split).`, 'RENT');
              setIsUpdateSubmeterModalOpen(false);
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Select Room</label>
                <select
                  value={meterModalRoomId}
                  onChange={(e) => {
                    const rNum = e.target.value;
                    setMeterModalRoomId(rNum);
                    const found = activePgRooms.find(r => r.roomNumber === rNum);
                    if (found) {
                      setMeterModalReading(roomOverrides[rNum]?.submeterReading ?? (found.submeterReading || 0));
                      setMeterModalSplitMethod(roomOverrides[rNum]?.electricitySplitMethod ?? (found.electricitySplitMethod || 'Submeter'));
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                >
                  {activePgRooms.map(r => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} ({r.sharingType} — Floor {r.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Sub-Meter Reading (kWh)</label>
                  <input
                    type="number"
                    value={meterModalReading}
                    onChange={(e) => setMeterModalReading(Number(e.target.value) || 0)}
                    required
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Rate per kWh (₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={meterModalRate}
                    onChange={(e) => setMeterModalRate(Number(e.target.value) || 8.5)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Split Method</label>
                <select
                  value={meterModalSplitMethod}
                  onChange={(e) => setMeterModalSplitMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                >
                  <option value="Submeter">Submeter (Direct kWh Reading)</option>
                  <option value="Equal">Equal (Evenly divide among building occupants)</option>
                  <option value="Room-level">Room-level (Divided among roommates only)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#E8F0EC] border border-[#D2DDD7] text-xs space-y-1">
                <span className="text-[#546E7A]">Estimated Monthly Room Charge:</span>
                <div className="text-base font-black text-[#163B36] font-tabular">
                  ₹{Math.round(meterModalReading * meterModalRate).toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs cursor-pointer"
              >
                Save Room Sub-Meter Reading
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD DAILY FOOD MENU ITEM MODAL */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D2DDD7] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#D2DDD7]">
              <div>
                <h3 className="font-extrabold text-base text-[#263238]">Publish Food Menu Item</h3>
                <p className="text-xs text-[#546E7A]">Dish details, meal slot &amp; dietary classification</p>
              </div>
              <button onClick={() => setIsFoodModalOpen(false)} className="text-[#263238]/70 hover:text-[#263238]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addFoodMenuItem({
                name: foodItemForm.name,
                category: foodItemForm.category,
                mealType: foodItemForm.mealType,
                dietaryTag: foodItemForm.dietaryTag,
                price: Number(foodItemForm.price) || 60,
                availableTimings: foodItemForm.availableTimings,
                description: foodItemForm.description
              });
              setIsFoodModalOpen(false);
              setFoodItemForm({
                name: '',
                category: 'Standard',
                mealType: 'Breakfast',
                dietaryTag: 'Vegetarian',
                price: 60,
                availableTimings: '07:30 - 10:00 AM',
                description: ''
              });
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. South Indian Dosa &amp; Vada Combo"
                  value={foodItemForm.name}
                  onChange={(e) => setFoodItemForm({ ...foodItemForm, name: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Meal Slot</label>
                  <select
                    value={foodItemForm.mealType}
                    onChange={(e) => setFoodItemForm({ ...foodItemForm, mealType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks &amp; Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Dietary Tag</label>
                  <select
                    value={foodItemForm.dietaryTag}
                    onChange={(e) => setFoodItemForm({ ...foodItemForm, dietaryTag: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Jain">Jain / No Onion Garlic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Price per Plate (₹)</label>
                  <input
                    type="number"
                    value={foodItemForm.price}
                    onChange={(e) => setFoodItemForm({ ...foodItemForm, price: Number(e.target.value) || 0 })}
                    required
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#263238] block mb-1">Serving Timings</label>
                  <input
                    type="text"
                    value={foodItemForm.availableTimings}
                    onChange={(e) => setFoodItemForm({ ...foodItemForm, availableTimings: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs font-bold text-[#263238]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263238] block mb-1">Description / Accompaniments</label>
                <textarea
                  placeholder="e.g. Served with hot sambar, coconut chutney, and filter coffee"
                  value={foodItemForm.description}
                  onChange={(e) => setFoodItemForm({ ...foodItemForm, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#D2DDD7] text-xs text-[#263238]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#163B36] text-white text-xs font-black hover:bg-[#0F2925] transition shadow-xs cursor-pointer"
              >
                Publish to Food Menu
              </button>
            </form>
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
