'use client';

import React, { useState } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { PropertyType } from '../../../types';
import { 
  X, 
  Building2, 
  MapPin, 
  Layers, 
  IndianRupee, 
  CheckCircle,
  Plus,
  Home,
  BedDouble,
  Briefcase,
  Trees,
  Utensils,
  Zap,
  ShieldCheck,
  Truck,
  Car,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface AssetCategoryOption {
  type: PropertyType;
  label: string;
  category: 'residential' | 'shared_living' | 'commercial' | 'estate';
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const ASSET_TYPE_CHOICES: AssetCategoryOption[] = [
  // Residential
  { type: 'Apartment', label: 'Apartment / Flat', category: 'residential', description: 'Gated society flats, single units & multi-unit complexes', badge: 'Residential', icon: <Home className="h-5 w-5 text-emerald-700" /> },
  { type: 'Independent House', label: 'Independent House / Villa', category: 'residential', description: 'Stand-alone homes, duplexes & residential villas', badge: 'Residential', icon: <Home className="h-5 w-5 text-emerald-700" /> },
  { type: 'Holiday Home', label: 'Holiday Home / Vacation Rental', category: 'residential', description: 'Short-stay serviced villas & Airbnb holiday retreats', badge: 'Residential', icon: <Home className="h-5 w-5 text-emerald-700" /> },
  
  // Shared / Managed Living
  { type: 'PG', label: 'PG (Paying Guest)', category: 'shared_living', description: 'Bed-level inventory, single/double/quad sharing & food plans', badge: 'Managed Living', icon: <BedDouble className="h-5 w-5 text-indigo-600" /> },
  { type: 'Hostel', label: 'Hostel / Student Housing', category: 'shared_living', description: 'Dormitories, student attendance, guardians & mess food', badge: 'Managed Living', icon: <BedDouble className="h-5 w-5 text-indigo-600" /> },
  { type: 'Co-living', label: 'Co-Living Space', category: 'shared_living', description: 'Private/shared suites with community amenities & services', badge: 'Managed Living', icon: <BedDouble className="h-5 w-5 text-indigo-600" /> },
  
  // Commercial
  { type: 'Commercial Building', label: 'Commercial Building / Complex', category: 'commercial', description: 'Multi-tenant commercial hubs with CAM & parking pools', badge: 'Commercial', icon: <Briefcase className="h-5 w-5 text-amber-700" /> },
  { type: 'Office', label: 'Office / Business Centre', category: 'commercial', description: 'IT offices, coworking floor plates & professional suites', badge: 'Commercial', icon: <Briefcase className="h-5 w-5 text-amber-700" /> },
  { type: 'Shop', label: 'Shop / Retail Showroom', category: 'commercial', description: 'High-street retail, mall units & commercial showrooms', badge: 'Commercial', icon: <Briefcase className="h-5 w-5 text-amber-700" /> },
  { type: 'Warehouse', label: 'Warehouse / Godown', category: 'commercial', description: 'Storage zones, loading bays, clear height & logistics hubs', badge: 'Industrial', icon: <Truck className="h-5 w-5 text-sky-700" /> },
  { type: 'Industrial Property', label: 'Industrial Factory / Workshop', category: 'commercial', description: 'Manufacturing facilities, industrial power & NFPA safety', badge: 'Industrial', icon: <Briefcase className="h-5 w-5 text-slate-700" /> },

  // Large Assets / Estates
  { type: 'Villa Estate', label: 'Estate / Private Campus', category: 'estate', description: 'Multi-acre agricultural estates, plantations & farmhouses', badge: 'EstateOS', icon: <Trees className="h-5 w-5 text-emerald-800" /> }
];

export default function AddPropertyModal() {
  const { isAddPropertyOpen, setIsAddPropertyOpen, addProperty, addNotification } = useAppState();

  // Wizard Step: 1 = What are you managing? (Selection), 2 = Asset-specific Configuration Form
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAssetOption, setSelectedAssetOption] = useState<AssetCategoryOption>(ASSET_TYPE_CHOICES[0]);

  // Common Form Data
  const [name, setName] = useState('');
  const [portfolio, setPortfolio] = useState('Kozhikode Coastal');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kozhikode');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('673001');
  const [imageUrl, setImageUrl] = useState('/images/properties/beach-road.jpg');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // PG / Shared Living Specific Fields
  const [pgFloors, setPgFloors] = useState(3);
  const [pgRoomsPerFloor, setPgRoomsPerFloor] = useState(8);
  const [pgTotalBeds, setPgTotalBeds] = useState(48);
  const [pgSharingType, setPgSharingType] = useState<'Single' | '2-Sharing' | '3-Sharing' | '4-Sharing'>('2-Sharing');
  const [pgRentPerBed, setPgRentPerBed] = useState(12000);
  const [pgDepositPerBed, setPgDepositPerBed] = useState(24000);
  const [pgElectricitySplit, setPgElectricitySplit] = useState<'Equal' | 'Submeter' | 'Room-level'>('Submeter');
  const [pgFoodIncluded, setPgFoodIncluded] = useState(true);
  const [pgFoodVendor, setPgFoodVendor] = useState('Annapoorna Kitchens');

  // Commercial Specific Fields
  const [commAreaSqFt, setCommAreaSqFt] = useState(3500);
  const [commBaseRent, setCommBaseRent] = useState(120000);
  const [commCamRate, setCommCamRate] = useState(18); // ₹18/sq.ft
  const [commParkingSlots, setCommParkingSlots] = useState(4);
  const [commLockInMonths, setCommLockInMonths] = useState(36);
  const [commEscalationPercent, setCommEscalationPercent] = useState(5);
  const [commFitOutDays, setCommFitOutDays] = useState(60);
  const [commLoadingBays, setCommLoadingBays] = useState(2);

  // Residential Specific Fields
  const [resUnitsCount, setResUnitsCount] = useState(4);
  const [resRentPerUnit, setResRentPerUnit] = useState(25000);
  const [resDepositPerUnit, setResDepositPerUnit] = useState(75000);
  const [resBhkType, setResBhkType] = useState('2 BHK');
  const [resAreaSqFt, setResAreaSqFt] = useState(1250);

  // Estate Specific Fields
  const [estateAcreage, setEstateAcreage] = useState('12.5 Acres');
  const [estateMainStructures, setEstateMainStructures] = useState('Main Heritage Villa (5BHK), Guest Cottage, Staff Quarters, Solar Farm');
  const [estateMonthlyBudget, setEstateMonthlyBudget] = useState(150000);

  if (!isAddPropertyOpen) return null;

  const handleAssetSelect = (option: AssetCategoryOption) => {
    setSelectedAssetOption(option);
    if (!name) {
      if (option.category === 'shared_living') setName('Staywise Signature PG');
      else if (option.category === 'commercial') setName('Horizon Commercial Centre');
      else if (option.category === 'estate') setName('Whispering Pines Estate');
      else setName('Greenview Residency');
    }
    setStep(2);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isPG = selectedAssetOption.category === 'shared_living';
    const isCommercial = selectedAssetOption.category === 'commercial';
    const isEstate = selectedAssetOption.category === 'estate';

    const calculatedExpectedRent = isPG 
      ? pgTotalBeds * pgRentPerBed 
      : isCommercial 
      ? commBaseRent + (commAreaSqFt * commCamRate)
      : isEstate 
      ? estateMonthlyBudget 
      : resUnitsCount * resRentPerUnit;

    const calculatedUnits = isPG ? pgTotalBeds : isCommercial ? Math.max(1, Math.round(commAreaSqFt / 1200)) : isEstate ? 1 : resUnitsCount;

    addProperty({
      name,
      type: selectedAssetOption.type,
      portfolio,
      address,
      city,
      state,
      pincode,
      totalUnits: calculatedUnits,
      expectedMonthlyRent: calculatedExpectedRent,
      amenities: isPG 
        ? ['Sub-meter Electricity', pgFoodIncluded ? '3x Meals Included' : 'Optional Mess', 'High-Speed Wi-Fi', 'Biometric Gate Access', 'Housekeeping']
        : isCommercial 
        ? [`CAM ₹${commCamRate}/sq.ft`, '100% DG Backup', `${commParkingSlots}x Reserved Parking`, `${commFitOutDays} Days Fit-Out`, 'NFPA Fire NOC']
        : isEstate 
        ? ['Solar Power Grid', 'Private Estate Pool', 'Staff Quarters', 'Organic Plantation', 'High-Speed Starlink']
        : ['24/7 Security', 'Elevator', 'Covered Parking', 'Power Backup'],
      imageUrl: imageUrl || (isEstate 
        ? '/images/properties/estate-villa.jpg' 
        : isCommercial 
        ? '/images/properties/tech-park.jpg' 
        : '/images/properties/beach-road.jpg')
    });

    addNotification(
      'New Asset Submitted',
      `Registered "${name}" (${selectedAssetOption.type}). Awaiting Admin verification and doc audit before live statutory activation.`,
      'SYSTEM'
    );

    setIsAddPropertyOpen(false);
    setStep(1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAddPropertyOpen(false);
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeece5] bg-[#fbfbfa]">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                title="Back to Asset Selector"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="h-9 w-9 rounded-2xl bg-[#eef3f0] text-[#274235] flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#19251f]">
                {step === 1 ? 'Dynamic Property Setup' : `Configure ${selectedAssetOption.label}`}
              </h2>
              <p className="text-[11px] text-[#6e7972]">
                {step === 1 ? 'Step 1 of 2: What are you managing?' : 'Step 2 of 2: Asset Type Engine Workflow'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddPropertyOpen(false)} 
            className="text-[#6e7972] hover:text-[#19251f] p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: What are you managing? (Section 3 of Master Spec) */}
        {step === 1 ? (
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-80px)] space-y-5">
            <div>
              <span className="text-[11px] font-bold text-[#274235] tracking-wider uppercase bg-[#eef3f0] px-2.5 py-1 rounded-full">
                Asset Universe Engine
              </span>
              <h3 className="text-lg font-black text-[#19251f] mt-1.5">What are you managing?</h3>
              <p className="text-xs text-[#6e7972]">
                Select the property asset class. Staywise will automatically adapt the operational hierarchy, leasing models, and pricing engines to match your asset.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ASSET_TYPE_CHOICES.map((choice) => (
                <button
                  key={choice.type}
                  type="button"
                  onClick={() => handleAssetSelect(choice)}
                  className="p-4 rounded-2xl border border-[#e3e1d8] bg-[#fbfbfa] hover:bg-white hover:border-[#274235] hover:shadow-md transition text-left group flex items-start gap-3.5 relative overflow-hidden"
                >
                  <div className="h-10 w-10 rounded-2xl bg-white border border-[#e8e6de] group-hover:border-[#274235]/40 flex items-center justify-center shrink-0 shadow-sm transition">
                    {choice.icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#19251f] group-hover:text-[#274235] transition">
                        {choice.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6e7972] leading-relaxed line-clamp-2 mt-0.5">
                      {choice.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {choice.badge}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#274235] group-hover:translate-x-0.5 transition shrink-0 self-center" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* STEP 2: Tailored Setup Workflow */
          <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[calc(92vh-80px)]">
            
            {/* Selected Asset Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#eef3f0] border border-[#274235]/20 text-[#274235]">
              <div className="flex items-center gap-2.5">
                {selectedAssetOption.icon}
                <div>
                  <div className="font-bold text-xs">{selectedAssetOption.label}</div>
                  <div className="text-[10px] text-[#274235]/80">Engine active: {selectedAssetOption.badge}</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-[11px] font-bold underline hover:text-[#19251f]"
              >
                Change Asset
              </button>
            </div>

            {/* Property Cover Photo Picker */}
            <div className="p-3.5 rounded-2xl bg-[#fbfbfa] border border-[#e3e1d8] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#274235] flex items-center gap-1.5 uppercase tracking-wider">
                  <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Property Cover Image</span>
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-[#274235] text-slate-700 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <Upload className="h-3.5 w-3.5 text-[#274235]" />
                  <span>Upload Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative h-18 w-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL or choose preset below..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#274235] bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Beach Road', url: '/images/properties/beach-road.jpg' },
                      { label: 'Estate Villa', url: '/images/properties/estate-villa.jpg' },
                      { label: 'Tech Park', url: '/images/properties/tech-park.jpg' },
                      { label: 'Modern Suite', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold transition ${
                          imageUrl === p.url ? 'bg-[#19251f] text-white border-[#19251f]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Property Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[#19251f] font-semibold mb-1">Property / Complex Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staywise Urban PG or Apex Business Tower"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[#19251f] font-semibold mb-1">Portfolio Group</label>
                <select
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                >
                  <option value="Kozhikode Coastal">Kozhikode Coastal</option>
                  <option value="Kochi Commercial">Kochi Commercial</option>
                  <option value="Bangalore Co-living">Bangalore Co-living & PG</option>
                  <option value="Wayanad Hill Retreats">Wayanad Hill Retreats</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[#19251f] font-semibold mb-1">Street Address & Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 80ft Road, 4th Block, Koramangala"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] placeholder-[#95a099] focus:outline-none focus:border-[#274235] focus:bg-white"
                />
              </div>

              <div className="col-span-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC SECTION A: PG / SHARED LIVING SETUP (Sections 4-9) */}
            {selectedAssetOption.category === 'shared_living' && (
              <div className="pt-2 border-t border-[#eeece5] space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-extrabold">
                  <BedDouble className="h-4 w-4" />
                  <span>PG & Bed Inventory Configuration</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Total Floors</label>
                    <input
                      type="number"
                      min={1}
                      value={pgFloors}
                      onChange={(e) => setPgFloors(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Rooms/Floor</label>
                    <input
                      type="number"
                      min={1}
                      value={pgRoomsPerFloor}
                      onChange={(e) => setPgRoomsPerFloor(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Total Beds</label>
                    <input
                      type="number"
                      min={1}
                      value={pgTotalBeds}
                      onChange={(e) => setPgTotalBeds(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Primary Sharing Tier</label>
                    <select
                      value={pgSharingType}
                      onChange={(e) => setPgSharingType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    >
                      <option value="Single">Single Room (Private)</option>
                      <option value="2-Sharing">2-Sharing (Double)</option>
                      <option value="3-Sharing">3-Sharing (Triple)</option>
                      <option value="4-Sharing">4-Sharing (Quad Dorm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Rent per Bed (₹/mo)</label>
                    <input
                      type="number"
                      value={pgRentPerBed}
                      onChange={(e) => setPgRentPerBed(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-bold"
                    />
                  </div>
                </div>

                {/* PG Electricity Engine */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px]">
                    <Zap className="h-3.5 w-3.5" />
                    <span>PG Electricity Management Engine</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {(['Submeter', 'Equal', 'Room-level'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPgElectricitySplit(method)}
                        className={`p-2 rounded-xl text-center font-bold border transition ${
                          pgElectricitySplit === method 
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                            : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
                        }`}
                      >
                        {method === 'Submeter' ? 'Sub-meter kWh' : method === 'Equal' ? 'Equal Split' : 'Room-level'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-800/80">
                    {pgElectricitySplit === 'Submeter' && 'Tenant A (72 units) & Tenant B (94 units) billed precisely on submeter readings.'}
                    {pgElectricitySplit === 'Equal' && 'Main bill divided equally among all occupied tenants (e.g. ₹20,000 ÷ 20 = ₹1,000 each).'}
                    {pgElectricitySplit === 'Room-level' && 'Bill shared strictly between roommates inside each specific room.'}
                  </p>
                </div>

                {/* Food / Meal Module */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900">Food & Mess Management</div>
                      <div className="text-[10px] text-slate-500">Breakfast, Lunch, Dinner subscription attendance</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pgFoodIncluded} 
                      onChange={(e) => setPgFoodIncluded(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION B: COMMERCIAL & CAM SETUP (Sections 12-21) */}
            {selectedAssetOption.category === 'commercial' && (
              <div className="pt-2 border-t border-[#eeece5] space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold">
                  <Briefcase className="h-4 w-4" />
                  <span>Commercial Lease & CAM Management</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Area (Sq. Ft)</label>
                    <input
                      type="number"
                      value={commAreaSqFt}
                      onChange={(e) => setCommAreaSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Base Rent (₹)</label>
                    <input
                      type="number"
                      value={commBaseRent}
                      onChange={(e) => setCommBaseRent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CAM Rate (₹/sqft)</label>
                    <input
                      type="number"
                      value={commCamRate}
                      onChange={(e) => setCommCamRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Parking Slots</label>
                    <input
                      type="number"
                      value={commParkingSlots}
                      onChange={(e) => setCommParkingSlots(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Fit-out Period</label>
                    <input
                      type="number"
                      value={commFitOutDays}
                      onChange={(e) => setCommFitOutDays(Number(e.target.value))}
                      placeholder="e.g. 60 days"
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Lock-in (Months)</label>
                    <input
                      type="number"
                      value={commLockInMonths}
                      onChange={(e) => setCommLockInMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Escalation (%)</label>
                    <input
                      type="number"
                      value={commEscalationPercent}
                      onChange={(e) => setCommEscalationPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                </div>

                {/* CAM Calculation Preview */}
                <div className="p-3 rounded-2xl bg-[#19251f] text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase tracking-wider font-bold">Monthly Commercial Revenue Target</span>
                    <div className="text-sm font-black mt-0.5">
                      ₹{(commBaseRent + (commAreaSqFt * commCamRate)).toLocaleString('en-IN')}/month
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-300">
                    <div>Base Rent: ₹{commBaseRent.toLocaleString('en-IN')}</div>
                    <div>CAM Pool: ₹{(commAreaSqFt * commCamRate).toLocaleString('en-IN')} (₹{commCamRate}/sq.ft)</div>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION C: ESTATES & LARGE ASSETS (Sections 22-24) */}
            {selectedAssetOption.category === 'estate' && (
              <div className="pt-2 border-t border-[#eeece5] space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                  <Trees className="h-4 w-4" />
                  <span>Estate & Digital Twin Setup</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Total Acreage</label>
                    <input
                      type="text"
                      value={estateAcreage}
                      onChange={(e) => setEstateAcreage(e.target.value)}
                      placeholder="e.g. 15 Acres / 80 Cents"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Target Monthly Yield (₹)</label>
                    <input
                      type="number"
                      value={estateMonthlyBudget}
                      onChange={(e) => setEstateMonthlyBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-950 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#19251f] font-semibold mb-1">Structures & Campus Assets</label>
                  <textarea
                    rows={2}
                    value={estateMainStructures}
                    onChange={(e) => setEstateMainStructures(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] text-xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC SECTION D: RESIDENTIAL SETUP */}
            {selectedAssetOption.category === 'residential' && (
              <div className="pt-2 border-t border-[#eeece5] space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                  <Home className="h-4 w-4" />
                  <span>Residential Unit Configuration</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Number of Units</label>
                    <input
                      type="number"
                      min={1}
                      value={resUnitsCount}
                      onChange={(e) => setResUnitsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">BHK Spec</label>
                    <select
                      value={resBhkType}
                      onChange={(e) => setResBhkType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK Luxury</option>
                      <option value="4 BHK">4 BHK Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Area (Sq. Ft)</label>
                    <input
                      type="number"
                      value={resAreaSqFt}
                      onChange={(e) => setResAreaSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Target Rent per Unit (₹/mo)</label>
                    <input
                      type="number"
                      value={resRentPerUnit}
                      onChange={(e) => setResRentPerUnit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[#19251f] font-semibold mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={resDepositPerUnit}
                      onChange={(e) => setResDepositPerUnit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#f7f6f2] border border-[#e3e1d8] text-[#19251f]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs shadow-xl shadow-[#274235]/20 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Onboard {selectedAssetOption.label} into Staywise PropOS</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
