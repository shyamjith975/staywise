'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Gift, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  BedDouble, 
  SlidersHorizontal, 
  ArrowRight, 
  QrCode,
  Check,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';

export default function FindHomeView() {
  const { properties, pgBeds, addNotification, currentUser } = useAppState();

  const [searchCity, setSearchCity] = useState('All');
  const [assetFilter, setAssetFilter] = useState<'ALL' | 'APARTMENT' | 'PG_BED' | 'ROOM' | 'COMMERCIAL'>('ALL');
  const [bhkFilter, setBhkFilter] = useState('All');
  const [maxRent, setMaxRent] = useState(45000);
  const [searchQuery, setSearchQuery] = useState('');

  // Referral Modal State
  const [selectedListingForReferral, setSelectedListingForReferral] = useState<{
    id: string;
    name: string;
    propertyName: string;
    type: string;
    rent: number;
    city: string;
    bounty: number;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Generate vacant items from standard properties and PG beds
  const vacantUnits = properties.flatMap(p => 
    p.units.filter(u => u.status === 'VACANT' || u.status === 'RESERVED').map(u => ({
      id: u.id,
      name: `Unit ${u.unitNumber} (${u.type})`,
      propertyName: p.name,
      propertyType: p.type,
      category: p.type === 'PG' ? 'PG_BED' : p.type === 'Commercial' ? 'COMMERCIAL' : 'APARTMENT',
      city: p.city,
      state: p.state,
      rent: u.rentAmount,
      deposit: u.depositAmount,
      furnishing: 'Semi-Furnished',
      status: u.status,
      imageUrl: p.imageUrl,
      amenities: ['Power Backup', '24x7 Security', 'Elevator', 'Covered Parking'],
      bounty: u.rentAmount > 25000 ? 3000 : 2000
    }))
  );

  // Add sample PG vacant beds
  const vacantPGBeds = [
    {
      id: 'bed-101-b',
      name: 'Bed 101-B (2-Sharing AC)',
      propertyName: 'Staywise Urban PG & Co-Living',
      propertyType: 'PG / Co-Living',
      category: 'PG_BED',
      city: 'Bangalore',
      state: 'Karnataka',
      rent: 12000,
      deposit: 24000,
      furnishing: 'Fully Furnished',
      status: 'VACANT',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      amenities: ['High-speed Wi-Fi', '3 Meals Included', 'AC', 'Housekeeping', 'Biometric Access'],
      bounty: 1500
    },
    {
      id: 'bed-202-b',
      name: 'Bed 202-B (4-Sharing Economy)',
      propertyName: 'Staywise Urban PG & Co-Living',
      propertyType: 'PG / Co-Living',
      category: 'PG_BED',
      city: 'Bangalore',
      state: 'Karnataka',
      rent: 8000,
      deposit: 16000,
      furnishing: 'Fully Furnished',
      status: 'VACANT',
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      amenities: ['Wi-Fi', 'Meals Included', 'Laundry', 'Locker Bed'],
      bounty: 1000
    },
    {
      id: 'suite-304-comm',
      name: 'Suite 304 (Mid-size Tech Office)',
      propertyName: 'Prestige Meridian Commercial Centre',
      propertyType: 'Commercial Office',
      category: 'COMMERCIAL',
      city: 'Bangalore',
      state: 'Karnataka',
      rent: 65000,
      deposit: 260000,
      furnishing: 'Warm Shell (Fit-out ready)',
      status: 'VACANT',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      amenities: ['100% DG Backup', 'CAM Included', 'Dedicated Parking', 'Central AC'],
      bounty: 5000
    },
    {
      id: 'room-301-coliving',
      name: 'Studio Suite 301 (Private Balcony)',
      propertyName: 'Koramangala Co-Living Commons',
      propertyType: 'Co-living Room',
      category: 'ROOM',
      city: 'Bangalore',
      state: 'Karnataka',
      rent: 18500,
      deposit: 37000,
      furnishing: 'Fully Furnished',
      status: 'VACANT',
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      amenities: ['Attached Washroom', 'Workstation', 'Kitchenette', 'Community Gym'],
      bounty: 2000
    }
  ];

  const allVacantListings = [...vacantUnits, ...vacantPGBeds];

  // Filtering
  const filteredListings = allVacantListings.filter(item => {
    if (searchCity !== 'All' && item.city !== searchCity) return false;
    if (assetFilter !== 'ALL' && item.category !== assetFilter) return false;
    if (item.rent > maxRent) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.propertyName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tenantReferralCode = 'SW-SHYAM-123';

  const handleOpenReferralModal = (item: any) => {
    setSelectedListingForReferral({
      id: item.id,
      name: item.name,
      propertyName: item.propertyName,
      type: item.propertyType,
      rent: item.rent,
      city: item.city,
      bounty: item.bounty
    });
    setIsCopied(false);
  };

  const getShareLink = () => {
    if (!selectedListingForReferral) return '';
    return `https://staywise.in/listing/${selectedListingForReferral.id}?ref=${tenantReferralCode}&bounty=${selectedListingForReferral.bounty}`;
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    navigator.clipboard?.writeText(link);
    setIsCopied(true);
    addNotification('Referral Link Copied', `Personalized referral link copied! Share with friends to earn ₹${selectedListingForReferral?.bounty}.`, 'SYSTEM');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!selectedListingForReferral) return;
    const link = getShareLink();
    const text = `Hey! I found this verified ${selectedListingForReferral.name} at ${selectedListingForReferral.propertyName}, ${selectedListingForReferral.city} on Staywise for ₹${selectedListingForReferral.rent.toLocaleString('en-IN')}/mo. Zero brokerage and automated escrow deposits!\n\nCheck out the property & register with my link to get ₹1,000 OFF your first month:\n${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Hero Banner with Viral Referral Incentive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#19251f] via-[#23382c] to-[#121c17] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Gift className="h-3.5 w-3.5" />
            <span>Staywise Tenant Referral Engine • Refer Vacant Homes &amp; Earn</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Your Next Home or <span className="text-amber-300">Refer Vacant Homes</span> to Earn Rent Credits
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Browse verified Staywise inventory with zero broker fees. Share any vacant apartment, PG bed, or commercial suite with friends: when they register and move in, <strong>you earn up to ₹5,000 direct rent credit</strong> and they get ₹1,000 off!
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="font-bold text-amber-300">Your Code:</span>
              <span className="font-mono font-black text-white bg-white/20 px-2 py-0.5 rounded tracking-wide">{tenantReferralCode}</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-400/30 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Avg. Referral Reward: <strong>₹2,000 / tenant</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6e7972]" />
            <input
              type="text"
              placeholder="Search by apartment name, PG locality, or area (e.g. Indiranagar, Marine Drive)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e8e6de] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#274235]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e8e6de] text-xs font-bold text-[#19251f] focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kochi">Kochi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
            </select>

            <select
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-[#f7f6f2] border border-[#e8e6de] text-xs font-bold text-[#19251f] focus:outline-none"
            >
              <option value={15000}>Budget: Under ₹15K</option>
              <option value={25000}>Budget: Under ₹25K</option>
              <option value={45000}>Budget: Under ₹45K</option>
              <option value={100000}>Budget: Any Budget</option>
            </select>
          </div>
        </div>

        {/* Category Pill Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#f0eee6] pt-3 text-xs">
          <span className="text-[#6e7972] font-semibold text-[11px] uppercase tracking-wider shrink-0 mr-1">Asset Category:</span>
          {[
            { id: 'ALL', label: 'All Inventory' },
            { id: 'APARTMENT', label: 'Apartments & Flats' },
            { id: 'PG_BED', label: 'PG & Co-Living Beds' },
            { id: 'ROOM', label: 'Private Studio Rooms' },
            { id: 'COMMERCIAL', label: 'Commercial Offices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setAssetFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                assetFilter === cat.id
                  ? 'bg-[#19251f] text-white shadow-sm'
                  : 'bg-[#f7f6f2] text-[#6e7972] hover:text-[#19251f] hover:bg-[#edece6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Vacant Inventory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#19251f] text-base">Verified Vacant Spaces Available for Immediate Move-In</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
              {filteredListings.length} Available
            </span>
          </div>
          <span className="text-xs text-[#6e7972]">Direct Owner Listings • 100% Escrow Protected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl border border-[#e3e1d8] overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Bounty Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-md">
                  <Gift className="h-3.5 w-3.5" />
                  <span>Referral Bounty: ₹{item.bounty.toLocaleString('en-IN')}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider">
                  {item.category === 'PG_BED' ? 'PG Bed' : item.category === 'COMMERCIAL' ? 'Commercial' : 'Apartment'}
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.city}, {item.state}</span>
                  </div>
                  <h3 className="font-extrabold text-base leading-tight truncate">{item.name}</h3>
                  <div className="text-[11px] text-slate-200 truncate">{item.propertyName}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Financials */}
                  <div className="flex items-baseline justify-between pb-2.5 border-b border-[#f0eee6]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Rent</span>
                      <span className="text-lg font-black text-[#19251f]">
                        ₹{item.rent.toLocaleString('en-IN')}
                        <span className="text-xs font-medium text-slate-500">/mo</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Deposit</span>
                      <span className="text-xs font-bold text-slate-700">₹{item.deposit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 py-2.5">
                    {item.amenities.map((am, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f7f6f2] text-slate-600 border border-[#e8e6de]">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: 1) Refer & Earn, 2) Apply / Book */}
                <div className="pt-2 border-t border-[#f0eee6] space-y-2">
                  <button
                    onClick={() => handleOpenReferralModal(item)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <Gift className="h-4 w-4 text-amber-700" />
                    <span>Refer This Home &amp; Earn ₹{item.bounty.toLocaleString('en-IN')}</span>
                  </button>

                  <button
                    onClick={() => addNotification('Visit Requested', `Owner of ${item.propertyName} has been notified. They will contact you shortly!`, 'SYSTEM')}
                    className="w-full py-2 px-3 rounded-2xl bg-[#19251f] hover:bg-[#274235] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>I Want to Move Here (1-Click Fast Apply)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share & Earn Modal for Specific Vacant Home */}
      {selectedListingForReferral && (
        <div 
          onClick={() => setSelectedListingForReferral(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#e3e1d8] shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedListingForReferral(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                <Gift className="h-3 w-3" />
                <span>Vacant Listing Referral Program</span>
              </div>
              <h2 className="text-xl font-black text-[#19251f]">
                Refer {selectedListingForReferral.name}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedListingForReferral.propertyName} • {selectedListingForReferral.city} • ₹{selectedListingForReferral.rent.toLocaleString('en-IN')}/mo
              </p>
            </div>

            {/* Reward Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Your Bounty on Lease</span>
                <span className="text-2xl font-black text-[#19251f]">₹{selectedListingForReferral.bounty.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-700 block font-medium">Credited to your rent ledger</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Referee Benefit</span>
                <span className="text-sm font-black text-emerald-800">₹1,000 OFF</span>
                <span className="text-[10px] text-slate-500 block">Deposit discount</span>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Your Unique Referral Link</label>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e8e6de]">
                <input 
                  type="text" 
                  readOnly 
                  value={getShareLink()} 
                  className="bg-transparent text-xs font-mono font-medium text-slate-700 flex-1 focus:outline-none truncate" 
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    isCopied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleShareWhatsApp}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
              >
                <Share2 className="h-4 w-4" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-2xl bg-[#19251f] hover:bg-[#274235] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Share Link</span>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>When the referee signs the digital lease and pays deposit, Staywise automatically logs the reward into your ledger.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
