'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { PropertyType } from '../../../types';
import { 
  X, 
  Building2, 
  MapPin, 
  IndianRupee, 
  CheckCircle,
  Plus,
  Home,
  BedDouble,
  Briefcase,
  Trees,
  Truck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Upload,
  Check,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Navigation,
  Lock,
  RotateCcw,
  Save,
  CheckCircle2,
  Warehouse as WarehouseIcon,
  Flame,
  Zap,
  Shield,
  Wifi,
  Users
} from 'lucide-react';

interface AssetTypeOption {
  type: PropertyType;
  label: string;
  category: 'shared_living' | 'residential' | 'commercial' | 'industrial' | 'estate';
  tagline: string;
  description: string;
  icon: React.ReactNode;
}

const ASSET_TYPES: AssetTypeOption[] = [
  { 
    type: 'PG', 
    label: 'PG / Co-Living', 
    category: 'shared_living', 
    tagline: 'Students & professionals', 
    description: 'Bed-level inventory, meals, cleaning & curfews',
    icon: <BedDouble className="h-5 w-5 text-[#274235]" />
  },
  { 
    type: 'Flat', 
    label: 'Flat / Apartment', 
    category: 'residential', 
    tagline: 'Rent the whole-unit', 
    description: 'Gated society flats, single units & multi-unit complexes',
    icon: <Home className="h-5 w-5 text-[#274235]" />
  },
  { 
    type: 'Warehouse', 
    label: 'Warehouse / Industrial', 
    category: 'industrial', 
    tagline: 'Storage, logistics & clear height', 
    description: 'Heavy duty floor, loading bays & industrial power',
    icon: <Truck className="h-5 w-5 text-[#274235]" />
  },
  { 
    type: 'Office', 
    label: 'Commercial / Office', 
    category: 'commercial', 
    tagline: 'Offices, retail & tech parks', 
    description: 'Workstations, CAM charges, HVAC & corporate leases',
    icon: <Briefcase className="h-5 w-5 text-[#274235]" />
  },
  { 
    type: 'Independent House', 
    label: 'Villa / Vacation Home', 
    category: 'estate', 
    tagline: 'Luxury private residences', 
    description: 'Private lawn, pool, caretaker & premium tariffs',
    icon: <Home className="h-5 w-5 text-[#274235]" />
  }
];

const LOCAL_STORAGE_KEY = 'staywise_onboarding_draft_v2';

export default function AddPropertyModal() {
  const { isAddPropertyOpen, setIsAddPropertyOpen, addProperty, addNotification } = useAppState();

  // Wizard Step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [hasDraftLoaded, setHasDraftLoaded] = useState(false);

  // STEP 1: BASICS (Common)
  const [selectedAsset, setSelectedAsset] = useState<AssetTypeOption>(ASSET_TYPES[0]);
  const [propertyName, setPropertyName] = useState('Koramangala Heights PG');
  const [addressSearch, setAddressSearch] = useState('80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');
  const [addressProofFile1, setAddressProofFile1] = useState<string | null>('electricity_bill_bescom.pdf');
  const [addressProofFile2, setAddressProofFile2] = useState<string | null>(null);
  const [mapPinCoords, setMapPinCoords] = useState<{ x: number; y: number }>({ x: 50, y: 46 });

  // STEP 2 & BEYOND: ASSET-SPECIFIC FIELDS

  // === A. PG / HOSTEL SPECIFIC ===
  const [pgFloors, setPgFloors] = useState(3);
  const [pgRoomsPerFloor, setPgRoomsPerFloor] = useState(6);
  const [pgSharingType, setPgSharingType] = useState<'Single' | '2-Sharing' | '3-Sharing' | '4-Sharing'>('2-Sharing');
  const [pgRentPerBed, setPgRentPerBed] = useState(12000);
  const [pgDepositPerBed, setPgDepositPerBed] = useState(24000);
  const [pgGenderPolicy, setPgGenderPolicy] = useState<'Male Only' | 'Female Only' | 'Unisex / Co-ed'>('Unisex / Co-ed');
  const [pgElectricityBilling, setPgElectricityBilling] = useState<'Sub-meter OCR' | 'Equal Split' | 'Included in Rent'>('Sub-meter OCR');
  const [pgRoomAmenities, setPgRoomAmenities] = useState<string[]>([
    'Air Conditioner (AC)',
    'Attached Washroom',
    'Geyser',
    'Orthopedic Bed & Mattress',
    'Spacious Wardrobe with Lock',
    'Study Desk & Chair'
  ]);
  const [pgBuildingAmenities, setPgBuildingAmenities] = useState<string[]>([
    'CCTV 24/7',
    'Security Guard',
    'Biometric Door Access',
    'Commercial RO Water Plant',
    'Power Backup Generator',
    'Lift / Elevator',
    '2-Wheeler Parking'
  ]);
  const [pgCleaningFreq, setPgCleaningFreq] = useState<'Daily' | 'Weekly' | 'Bi-weekly'>('Daily');
  const [pgMealsIncluded, setPgMealsIncluded] = useState<string[]>(['Breakfast', 'Dinner']);
  const [pgTiffinAvailable, setPgTiffinAvailable] = useState(true);
  const [pgLaundryProvided, setPgLaundryProvided] = useState(true);
  const [pgLifestyleRules, setPgLifestyleRules] = useState<string[]>(['No drinking', 'No smoking', 'Non-veg Allowed']);
  const [pgGuestPolicy, setPgGuestPolicy] = useState<'No guests' | 'Daytime guests allowed' | 'Same-gender only'>('Daytime guests allowed');
  const [pgGuestCurfew, setPgGuestCurfew] = useState<string>('9 PM');
  const [pgGateClosingTime, setPgGateClosingTime] = useState<string>('10 PM');

  // === B. FLAT / APARTMENT SPECIFIC ===
  const [flatUnitsCount, setFlatUnitsCount] = useState(1);
  const [flatBhkType, setFlatBhkType] = useState('2 BHK');
  const [flatUnitNumber, setFlatUnitNumber] = useState('A-402');
  const [flatFloorNumber, setFlatFloorNumber] = useState(4);
  const [flatAreaSqFt, setFlatAreaSqFt] = useState(1250);
  const [flatMonthlyRent, setFlatMonthlyRent] = useState(38000);
  const [flatSecurityDeposit, setFlatSecurityDeposit] = useState(150000);
  const [flatMaintenanceFee, setFlatMaintenanceFee] = useState(4500);
  const [flatFurnishing, setFlatFurnishing] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [flatFittings, setFlatFittings] = useState<string[]>([
    'Modular Kitchen & Chimney',
    'Piped Gas (PNG)',
    'Geysers in All Baths',
    'Bedroom Wardrobes',
    'Balcony Safety Grills',
    'Covered Car Parking Slot'
  ]);
  const [flatSocietyAmenities, setFlatSocietyAmenities] = useState<string[]>([
    'Gated Society Security',
    'Intercom to Gate',
    'Passenger & Service Lifts',
    '100% DG Power Backup',
    'Swimming Pool & Clubhouse',
    'Gymnasium'
  ]);
  const [flatTenantPreference, setFlatTenantPreference] = useState<'Family Preferred' | 'Bachelors Allowed' | 'Any Welcome'>('Any Welcome');
  const [flatPetPolicy, setFlatPetPolicy] = useState<'Pets Allowed' | 'No Pets' | 'Small Pets Only'>('Pets Allowed');
  const [flatQuietHours, setFlatQuietHours] = useState('10 PM - 7 AM');
  const [flatMoveInRule, setFlatMoveInRule] = useState('Weekdays 9 AM - 6 PM only');

  // === C. WAREHOUSE / INDUSTRIAL SPECIFIC ===
  const [whCarpetAreaSqFt, setWhCarpetAreaSqFt] = useState(25000);
  const [whClearHeightFt, setWhClearHeightFt] = useState(32);
  const [whFlooringType, setWhFlooringType] = useState('FM2 Heavy Duty Laser Screed (5T/sq.m)');
  const [whLoadingDocks, setWhLoadingDocks] = useState(4);
  const [whBaseRentSqFt, setWhBaseRentSqFt] = useState(28);
  const [whSecurityDepositMonths, setWhSecurityDepositMonths] = useState(6);
  const [whLockInMonths, setWhLockInMonths] = useState(36);
  const [whEscalationPercent, setWhEscalationPercent] = useState(5);
  const [whPowerKva, setWhPowerKva] = useState(250);
  const [whInfrastructure, setWhInfrastructure] = useState<string[]>([
    '250 kVA Industrial HT Power',
    '100% Industrial DG Backup',
    'NFPA Fire Hydrants & Sprinklers',
    'Roof Turbo Ventilators & Skylights',
    '40ft Multi-Axle Truck Turning Apron'
  ]);
  const [whCampusAmenities, setWhCampusAmenities] = useState<string[]>([
    '24/7 Armed Security & Boom Barriers',
    '100-Ton Truck Weighbridge',
    'Driver Restroom & Canteen',
    'Mezzanine Admin Office Space',
    'Heavy Vehicle Parking Slots'
  ]);
  const [whOperationsRule, setWhOperationsRule] = useState<'24/7/365 Unrestricted Entry' | 'Standard Freight Timings'>('24/7/365 Unrestricted Entry');
  const [whHazmatPolicy, setWhHazmatPolicy] = useState<'Non-Hazardous Goods Only' | 'Class A Hazmat Approved'>('Non-Hazardous Goods Only');
  const [whCamRateSqFt, setWhCamRateSqFt] = useState(3.5);

  // === D. COMMERCIAL / OFFICE SPECIFIC ===
  const [commCarpetSqFt, setCommCarpetSqFt] = useState(6500);
  const [commSuperBuiltUpSqFt, setCommSuperBuiltUpSqFt] = useState(8200);
  const [commFitOutStatus, setCommFitOutStatus] = useState<'Plug & Play Furnished' | 'Warm Shell' | 'Bare Shell'>('Plug & Play Furnished');
  const [commWorkstations, setCommWorkstations] = useState(85);
  const [commMeetingRooms, setCommMeetingRooms] = useState(4);
  const [commBaseRentSqFt, setCommBaseRentSqFt] = useState(95);
  const [commCamSqFt, setCommCamSqFt] = useState(18);
  const [commCarBays, setCommCarBays] = useState(12);
  const [commTwoWheelerBays, setCommTwoWheelerBays] = useState(30);
  const [commLockInMonths, setCommLockInMonths] = useState(36);
  const [commFeatures, setCommFeatures] = useState<string[]>([
    'Central HVAC (Mon-Sat 8AM-8PM)',
    'Dual Leased Line Fiber Redundancy',
    'RFID Turnstiles & Biometric Access',
    'High-Speed Passenger & Freight Elevators',
    '100% N+1 DG Power Backup'
  ]);
  const [commCampusAmenities, setCommCampusAmenities] = useState<string[]>([
    'Food Court & Executive Cafeteria',
    'Visitor Reception with Digital Passes',
    'ATM & Retail Banking',
    'Fire Safety NOC & Smoke Evacuation'
  ]);
  const [commOperatingHours, setCommOperatingHours] = useState<'24/7 ITeS Access Allowed' | 'Standard 8 AM - 9 PM'>('24/7 ITeS Access Allowed');

  // === E. VILLA / VACATION HOME SPECIFIC ===
  const [villaBedrooms, setVillaBedrooms] = useState(4);
  const [villaBuiltUpSqFt, setVillaBuiltUpSqFt] = useState(4200);
  const [villaPlotSqFt, setVillaPlotSqFt] = useState(8500);
  const [villaMonthlyRent, setVillaMonthlyRent] = useState(125000);
  const [villaSecurityDeposit, setVillaSecurityDeposit] = useState(375000);
  const [villaStaffBudget, setVillaStaffBudget] = useState(25000);
  const [villaLuxuryAmenities, setVillaLuxuryAmenities] = useState<string[]>([
    'Private Swimming Pool & Jacuzzi',
    'Landscaped Private Lawn & Gazebo',
    'Equipped Chef Kitchen & Bar Counter',
    'Smart Home Automation & Climate Control',
    'Private Home Theatre'
  ]);
  const [villaServices, setVillaServices] = useState<string[]>([
    'Resident Caretaker / Butler On-Site',
    'Dedicated Swimming Pool Maintenance',
    'Gardener & Landscaping Care',
    'Daily Housekeeping & Fresh Linen'
  ]);
  const [villaMaxGuests, setVillaMaxGuests] = useState(12);
  const [villaQuietHours, setVillaQuietHours] = useState('No loud outdoor music after 10 PM');

  // STEP 6: PREVIEW & PUBLISH / AADHAAR KYC
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [kycMethod, setKycMethod] = useState<'digilocker' | 'manual' | null>(null);
  const [isVerifyingDigiLocker, setIsVerifyingDigiLocker] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'basics' | 'inventory' | 'amenities' | 'rules' | null>('basics');

  // Load Draft from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.propertyName) setPropertyName(parsed.propertyName);
        if (parsed.selectedAssetType) {
          const matched = ASSET_TYPES.find(a => a.type === parsed.selectedAssetType);
          if (matched) setSelectedAsset(matched);
        }
        if (parsed.addressSearch) setAddressSearch(parsed.addressSearch);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.isKycVerified !== undefined) setIsKycVerified(parsed.isKycVerified);
        setHasDraftLoaded(true);
      }
    } catch {
      // Ignore localstorage errors
    }
  }, []);

  // Save Draft to LocalStorage
  const handleSaveDraft = () => {
    try {
      const draftData = {
        selectedAssetType: selectedAsset.type,
        propertyName,
        addressSearch,
        city,
        state,
        pincode,
        currentStep,
        isKycVerified,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draftData));
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch {
      // Ignore
    }
  };

  // Reset Form Cleanly
  const handleResetForm = () => {
    if (confirm('Are you sure you want to reset and start fresh? All entered data will be cleared.')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCurrentStep(1);
      setSelectedAsset(ASSET_TYPES[0]);
      setPropertyName('Koramangala Heights PG');
      setAddressSearch('80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034');
      setCity('Bengaluru');
      setState('Karnataka');
      setPincode('560034');
      setIsKycVerified(false);
      setKycMethod(null);
      setHasDraftLoaded(false);
    }
  };

  if (!isAddPropertyOpen) return null;

  // Asset selection triggers tailored defaults
  const handleAssetSelect = (asset: AssetTypeOption) => {
    setSelectedAsset(asset);
    if (asset.type === 'PG') {
      setPropertyName('Koramangala Heights PG');
      setAddressSearch('80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034');
    } else if (asset.type === 'Flat') {
      setPropertyName('Prestige Lakeside - Unit A-402');
      setAddressSearch('Varthur Main Road, Whitefield, Bengaluru, Karnataka 560066');
    } else if (asset.type === 'Warehouse') {
      setPropertyName('Indospace Logistics Hub - Bay 3');
      setAddressSearch('NH-44 Industrial Corridor, Dobbaspet, Karnataka 562111');
    } else if (asset.type === 'Office') {
      setPropertyName('Prestige CyberTower - Suite 501');
      setAddressSearch('Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103');
    } else if (asset.type === 'Independent House') {
      setPropertyName('Whispering Palms Luxury Villa');
      setAddressSearch('Palm Meadows, Whitefield, Bengaluru, Karnataka 560066');
    }
  };

  // Calculations based on asset class
  const calculatedTotalUnits = () => {
    if (selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel') {
      const beds = pgSharingType === 'Single' ? 1 : pgSharingType === '2-Sharing' ? 2 : pgSharingType === '3-Sharing' ? 3 : 4;
      return pgFloors * pgRoomsPerFloor * beds;
    }
    if (selectedAsset.type === 'Flat' || selectedAsset.type === 'Apartment') {
      return flatUnitsCount;
    }
    if (selectedAsset.type === 'Warehouse') {
      return whLoadingDocks;
    }
    if (selectedAsset.type === 'Office') {
      return Math.max(1, Math.round(commCarpetSqFt / 1000));
    }
    return 1;
  };

  const calculatedMonthlyRent = () => {
    if (selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel') {
      return calculatedTotalUnits() * pgRentPerBed;
    }
    if (selectedAsset.type === 'Flat' || selectedAsset.type === 'Apartment') {
      return flatUnitsCount * flatMonthlyRent;
    }
    if (selectedAsset.type === 'Warehouse') {
      return whCarpetAreaSqFt * whBaseRentSqFt;
    }
    if (selectedAsset.type === 'Office') {
      return (commCarpetSqFt * commBaseRentSqFt) + (commCarpetSqFt * commCamSqFt);
    }
    if (selectedAsset.type === 'Independent House' || selectedAsset.type === 'Villa') {
      return villaMonthlyRent;
    }
    return 50000;
  };

  const handleDigiLockerVerify = () => {
    setIsVerifyingDigiLocker(true);
    setTimeout(() => {
      setIsVerifyingDigiLocker(false);
      setIsKycVerified(true);
      setKycMethod('digilocker');
    }, 1100);
  };

  const handleManualUpload = () => {
    setIsKycVerified(true);
    setKycMethod('manual');
  };

  const handlePublishProperty = () => {
    const totalUnits = calculatedTotalUnits();
    const expectedRent = calculatedMonthlyRent();

    const amenitiesMap: Record<string, string[]> = {
      PG: [...pgRoomAmenities, ...pgBuildingAmenities],
      Flat: [...flatFittings, ...flatSocietyAmenities],
      Warehouse: [...whInfrastructure, ...whCampusAmenities],
      Office: [...commFeatures, ...commCampusAmenities],
      'Independent House': [...villaLuxuryAmenities, ...villaServices]
    };

    addProperty({
      name: propertyName,
      type: selectedAsset.type,
      portfolio: `${city} Central`,
      address: addressSearch,
      city,
      state,
      pincode,
      totalUnits,
      expectedMonthlyRent: expectedRent,
      amenities: amenitiesMap[selectedAsset.type] || ['24/7 Security', 'Elevator', 'Power Backup'],
      imageUrl: selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel'
        ? '/images/properties/beach-road.jpg'
        : selectedAsset.type === 'Warehouse'
        ? '/images/properties/tech-park.jpg'
        : selectedAsset.type === 'Office'
        ? '/images/properties/tech-park.jpg'
        : selectedAsset.type === 'Independent House'
        ? '/images/properties/estate-villa.jpg'
        : '/images/properties/beach-road.jpg'
    });

    addNotification(
      'Property Published & Live',
      `"${propertyName}" (${selectedAsset.label}) is now live with ${totalUnits} units/beds. UIDAI DigiLocker verified.`,
      'SYSTEM'
    );

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsAddPropertyOpen(false);
    setCurrentStep(1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#19251f]/60 backdrop-blur-md flex items-center justify-center p-2 xs:p-3 sm:p-5 overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAddPropertyOpen(false);
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar in Staywise Old Theme */}
        <div className="bg-[#fbfbfa] border-b border-[#eeece5] px-4 sm:px-6 pt-4 pb-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                  className="h-7 w-7 rounded-xl bg-[#eef3f0] hover:bg-[#274235] hover:text-white text-[#274235] flex items-center justify-center transition cursor-pointer"
                  title="Back (All entered data is preserved)"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              )}
              <span className="text-[10px] font-black uppercase tracking-wider text-[#274235] bg-[#eef3f0] px-2.5 py-0.5 rounded-full border border-[#274235]/20">
                Step {currentStep} of 6 · {
                  currentStep === 1 ? 'BASICS' :
                  currentStep === 2 ? (selectedAsset.type === 'PG' ? 'BED INVENTORY' : selectedAsset.type === 'Warehouse' ? 'SPECS & AREA' : selectedAsset.type === 'Office' ? 'FLOOR TERMS' : 'UNIT LAYOUT') :
                  currentStep === 3 ? (selectedAsset.type === 'Warehouse' ? 'INFRASTRUCTURE' : selectedAsset.type === 'Office' ? 'TECHNICAL SPECS' : 'IN-UNIT AMENITIES') :
                  currentStep === 4 ? (selectedAsset.type === 'Warehouse' ? 'LOGISTICS CAMPUS' : selectedAsset.type === 'Office' ? 'CAMPUS FACILITIES' : 'BUILDING AMENITIES') :
                  currentStep === 5 ? (selectedAsset.type === 'Warehouse' ? 'COMPLIANCE & CAM' : selectedAsset.type === 'Office' ? 'COMMERCIAL NORMS' : 'SERVICES & RULES') : 'PREVIEW & PUBLISH'
                }
              </span>
            </div>

            {/* Header Action Tools: Save Draft, Reset Form, Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#e3e1d8] bg-white hover:border-[#274235] text-[11px] font-bold text-[#274235] transition cursor-pointer shadow-2xs"
                title="Save your progress draft"
              >
                <Save className="h-3 w-3" />
                <span className="hidden xs:inline">Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#e3e1d8] bg-white hover:bg-rose-50 hover:text-rose-700 text-[11px] font-bold text-[#6e7972] transition cursor-pointer shadow-2xs"
                title="Reset form and start fresh"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden xs:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddPropertyOpen(false)}
                className="text-[#6e7972] hover:text-[#19251f] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar (Staywise Sage Palette) */}
          <div className="grid grid-cols-6 gap-1.5 h-1.5 w-full bg-[#e8e6de] rounded-full overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div 
                key={s}
                className={`h-full transition-all duration-300 rounded-full ${
                  s <= currentStep ? 'bg-[#274235]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Toast Notification when Draft Saved */}
          {draftSavedToast && (
            <div className="py-1 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Progress draft saved to local workspace. You can safely close or go back anytime.</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(94vh-125px)] space-y-5 bg-[#fbfbfa]">

          {/* ============================================================ */}
          {/* STEP 1: BASICS (Tailored Asset Selection)                    */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  Let's start with the basics.
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Select your exact property asset class. Staywise will automatically tailor every following step to only include relevant fields.
                </p>
              </div>

              {/* Asset Class Selector */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-2xs">
                <div>
                  <h3 className="text-xs font-bold text-[#19251f]">Asset Class Engine</h3>
                  <p className="text-[11px] text-[#6e7972]">Pick the property type you are onboarding</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {ASSET_TYPES.map((asset) => {
                    const isSelected = selectedAsset.type === asset.type;
                    return (
                      <button
                        key={asset.type}
                        type="button"
                        onClick={() => handleAssetSelect(asset)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#274235] bg-[#eef3f0] ring-1 ring-[#274235] shadow-xs'
                            : 'border-[#e3e1d8] bg-white hover:border-[#274235]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {asset.icon}
                            <span className="text-xs font-bold text-[#19251f]">{asset.label}</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#274235]" />}
                        </div>
                        <p className="text-[10px] text-[#6e7972] mt-1.5 leading-snug line-clamp-2">
                          {asset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Identity Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-2xs">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#19251f]">
                    Property Name / Identification <span className="text-[#274235]">*</span>
                  </label>
                  <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g. Koramangala Heights PG"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8d6cd] bg-white text-xs text-[#19251f] focus:outline-none focus:border-[#274235]"
                  />
                  <p className="text-[10px] text-[#6e7972]">Displayed on tenant invoices, agreements, and online listings.</p>
                </div>

                {/* Location */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-bold text-[#19251f]">
                    Where is it located? <span className="text-[#274235]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#274235]" />
                    <input
                      type="text"
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                      placeholder="Search property address or landmark..."
                      className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-[#d8d6cd] bg-white text-xs text-[#19251f] focus:outline-none focus:border-[#274235]"
                    />
                    <button
                      type="button"
                      onClick={() => setAddressSearch('80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034')}
                      className="absolute right-2 top-1.5 px-2.5 py-1 rounded-lg bg-[#eef3f0] hover:bg-[#274235] hover:text-white text-[#274235] text-[10px] font-bold flex items-center gap-1 transition"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Pin Location</span>
                    </button>
                  </div>
                </div>

                {/* Map Simulator */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.min(90, Math.max(10, ((e.clientX - rect.left) / rect.width) * 100));
                    const y = Math.min(90, Math.max(10, ((e.clientY - rect.top) / rect.height) * 100));
                    setMapPinCoords({ x, y });
                  }}
                  className="relative h-36 rounded-xl border border-[#e3e1d8] bg-[#eef1ed] overflow-hidden cursor-crosshair group mt-2"
                >
                  <svg className="w-full h-full opacity-60" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <rect width="400" height="160" fill="#eef3f0" />
                    <path d="M-10 30 Q 120 60, 240 25 T 420 70" stroke="#d5ded7" strokeWidth="10" fill="none" />
                    <path d="M60 -10 L 90 180" stroke="#ffffff" strokeWidth="8" />
                    <path d="M190 -10 L 220 180" stroke="#ffffff" strokeWidth="12" />
                    <path d="M-10 95 L 420 105" stroke="#759382" strokeWidth="4" />
                  </svg>

                  <div 
                    style={{ left: `${mapPinCoords.x}%`, top: `${mapPinCoords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 flex flex-col items-center pointer-events-none"
                  >
                    <div className="px-2 py-0.5 rounded-md bg-[#274235] text-white text-[9px] font-extrabold shadow-sm whitespace-nowrap mb-0.5">
                      {propertyName || 'Property Pin'}
                    </div>
                    <div className="h-6 w-6 rounded-full bg-[#274235] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="h-3 w-3 fill-current" />
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#19251f]/80 text-white text-[9px] font-bold">
                    Tap to adjust pin location
                  </div>
                </div>

                {/* Proof of Address Upload */}
                <div className="pt-2 border-t border-[#eeece5] space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#19251f]">
                    Proof of Address (Electricity bill / Property tax / Deed) <span className="text-[#274235]">*</span>
                  </label>
                  <div className="p-3.5 rounded-xl border border-dashed border-[#274235]/40 bg-[#eef3f0]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-[#274235] text-white flex items-center justify-center">
                        <Upload className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#19251f] block">{addressProofFile1}</span>
                        <span className="text-[10px] text-[#6e7972]">Verified PDF Attachment</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Attached ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: INVENTORY & PRICING (Strictly Tailored)               */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  {selectedAsset.type === 'PG' ? 'Bed Inventory & Rent Structure' :
                   selectedAsset.type === 'Flat' ? 'Flat Configuration & Financials' :
                   selectedAsset.type === 'Warehouse' ? 'Warehouse Specifications & Leases' :
                   selectedAsset.type === 'Office' ? 'Office Floor Plate & Commercials' : 'Villa Specs & Tariffs'}
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Only the required capacity and leasing metrics for your {selectedAsset.label}.
                </p>
              </div>

              {/* PG ONLY */}
              {selectedAsset.type === 'PG' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Number of Floors</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={pgFloors}
                        onChange={(e) => setPgFloors(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Rooms Per Floor</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={pgRoomsPerFloor}
                        onChange={(e) => setPgRoomsPerFloor(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#19251f]">Room Sharing Tier</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Single', '2-Sharing', '3-Sharing', '4-Sharing'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPgSharingType(s)}
                          className={`py-2 px-2 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                            pgSharingType === s
                              ? 'border-[#274235] bg-[#eef3f0] text-[#274235]'
                              : 'border-[#e3e1d8] text-[#4d5a52] hover:bg-[#fbfbfa]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Rent per Bed / Month (₹)</label>
                      <input
                        type="number"
                        value={pgRentPerBed}
                        onChange={(e) => setPgRentPerBed(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Security Deposit / Bed (₹)</label>
                      <input
                        type="number"
                        value={pgDepositPerBed}
                        onChange={(e) => setPgDepositPerBed(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Gender Policy</label>
                      <select
                        value={pgGenderPolicy}
                        onChange={(e) => setPgGenderPolicy(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="Male Only">Male Only</option>
                        <option value="Female Only">Female Only</option>
                        <option value="Unisex / Co-ed">Unisex / Co-ed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Electricity Billing</label>
                      <select
                        value={pgElectricityBilling}
                        onChange={(e) => setPgElectricityBilling(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="Sub-meter OCR">Sub-meter OCR (Per room)</option>
                        <option value="Equal Split">Equal Split across beds</option>
                        <option value="Included in Rent">Included in Rent (Fixed)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* FLAT ONLY */}
              {selectedAsset.type === 'Flat' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">BHK Layout</label>
                      <select
                        value={flatBhkType}
                        onChange={(e) => setFlatBhkType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-bold"
                      >
                        <option value="1 RK / Studio">1 RK / Studio</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK Penthouse">4 BHK Penthouse</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Unit Number</label>
                      <input
                        type="text"
                        value={flatUnitNumber}
                        onChange={(e) => setFlatUnitNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Floor Number</label>
                      <input
                        type="number"
                        value={flatFloorNumber}
                        onChange={(e) => setFlatFloorNumber(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Monthly Rent for Flat (₹)</label>
                      <input
                        type="number"
                        value={flatMonthlyRent}
                        onChange={(e) => setFlatMonthlyRent(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={flatSecurityDeposit}
                        onChange={(e) => setFlatSecurityDeposit(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Carpet Area (sq.ft)</label>
                      <input
                        type="number"
                        value={flatAreaSqFt}
                        onChange={(e) => setFlatAreaSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Society Maintenance (₹/mo)</label>
                      <input
                        type="number"
                        value={flatMaintenanceFee}
                        onChange={(e) => setFlatMaintenanceFee(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* WAREHOUSE ONLY */}
              {selectedAsset.type === 'Warehouse' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Clear Carpet Area (sq.ft)</label>
                      <input
                        type="number"
                        value={whCarpetAreaSqFt}
                        onChange={(e) => setWhCarpetAreaSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Clear Height (Feet)</label>
                      <input
                        type="number"
                        value={whClearHeightFt}
                        onChange={(e) => setWhClearHeightFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Base Rent (₹/sq.ft/month)</label>
                      <input
                        type="number"
                        value={whBaseRentSqFt}
                        onChange={(e) => setWhBaseRentSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Loading Docks / Levelers</label>
                      <input
                        type="number"
                        value={whLoadingDocks}
                        onChange={(e) => setWhLoadingDocks(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Deposit (Months)</label>
                      <input
                        type="number"
                        value={whSecurityDepositMonths}
                        onChange={(e) => setWhSecurityDepositMonths(parseInt(e.target.value) || 6)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Lock-in (Months)</label>
                      <input
                        type="number"
                        value={whLockInMonths}
                        onChange={(e) => setWhLockInMonths(parseInt(e.target.value) || 36)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Annual Escalation %</label>
                      <input
                        type="number"
                        value={whEscalationPercent}
                        onChange={(e) => setWhEscalationPercent(parseInt(e.target.value) || 5)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COMMERCIAL / OFFICE ONLY */}
              {selectedAsset.type === 'Office' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Carpet Area (sq.ft)</label>
                      <input
                        type="number"
                        value={commCarpetSqFt}
                        onChange={(e) => setCommCarpetSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Fit-Out Status</label>
                      <select
                        value={commFitOutStatus}
                        onChange={(e) => setCommFitOutStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-bold"
                      >
                        <option value="Plug & Play Furnished">Plug & Play Furnished</option>
                        <option value="Warm Shell">Warm Shell</option>
                        <option value="Bare Shell">Bare Shell</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Base Rent (₹/sq.ft/month)</label>
                      <input
                        type="number"
                        value={commBaseRentSqFt}
                        onChange={(e) => setCommBaseRentSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">CAM Charges (₹/sq.ft)</label>
                      <input
                        type="number"
                        value={commCamSqFt}
                        onChange={(e) => setCommCamSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Workstations</label>
                      <input
                        type="number"
                        value={commWorkstations}
                        onChange={(e) => setCommWorkstations(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Car Parking Bays</label>
                      <input
                        type="number"
                        value={commCarBays}
                        onChange={(e) => setCommCarBays(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Lock-in (Months)</label>
                      <input
                        type="number"
                        value={commLockInMonths}
                        onChange={(e) => setCommLockInMonths(parseInt(e.target.value) || 36)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VILLA ONLY */}
              {selectedAsset.type === 'Independent House' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Bedrooms</label>
                      <input
                        type="number"
                        value={villaBedrooms}
                        onChange={(e) => setVillaBedrooms(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Built-up (sq.ft)</label>
                      <input
                        type="number"
                        value={villaBuiltUpSqFt}
                        onChange={(e) => setVillaBuiltUpSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Private Lawn (sq.ft)</label>
                      <input
                        type="number"
                        value={villaPlotSqFt}
                        onChange={(e) => setVillaPlotSqFt(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Monthly Rent / Tariff (₹)</label>
                      <input
                        type="number"
                        value={villaMonthlyRent}
                        onChange={(e) => setVillaMonthlyRent(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={villaSecurityDeposit}
                        onChange={(e) => setVillaSecurityDeposit(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold text-[#19251f]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: IN-UNIT / TECHNICAL AMENITIES (Tailored)             */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  {selectedAsset.type === 'PG' ? 'In-Room Furnishings' :
                   selectedAsset.type === 'Flat' ? 'Flat In-Unit Fittings & Appliances' :
                   selectedAsset.type === 'Warehouse' ? 'Industrial Power & Safety Infrastructure' :
                   selectedAsset.type === 'Office' ? 'Corporate Floor Plate Specifications' : 'Luxury Villa In-House Amenities'}
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Select only what exists directly inside this {selectedAsset.label}.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-2xs">
                {/* Dynamically Render Appropriate Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(selectedAsset.type === 'PG' ? [
                    'Air Conditioner (AC)',
                    'Attached Washroom',
                    'Geyser',
                    'Orthopedic Bed & Mattress',
                    'Spacious Wardrobe with Lock',
                    'Study Desk & Chair',
                    'Private Balcony',
                    'Smart LED TV'
                  ] : selectedAsset.type === 'Flat' ? [
                    'Modular Kitchen & Chimney',
                    'Piped Gas (PNG)',
                    'Geysers in All Baths',
                    'Bedroom Wardrobes',
                    'Balcony Safety Grills',
                    'Covered Car Parking Slot',
                    'RO Water Purifier',
                    'Inverter Power Wiring'
                  ] : selectedAsset.type === 'Warehouse' ? [
                    '250 kVA Industrial HT Power',
                    '100% Industrial DG Backup',
                    'NFPA Fire Hydrants & Sprinklers',
                    'Roof Turbo Ventilators & Skylights',
                    '40ft Multi-Axle Truck Turning Apron',
                    'FM2 Laser Screed Floor (5T/sq.m)'
                  ] : selectedAsset.type === 'Office' ? [
                    'Central HVAC (Mon-Sat 8AM-8PM)',
                    'Dual Leased Line Fiber Redundancy',
                    'RFID Turnstiles & Biometric Access',
                    'High-Speed Passenger & Freight Elevators',
                    '100% N+1 DG Power Backup',
                    'Acoustic Boardroom with Video Wall'
                  ] : [
                    'Private Swimming Pool & Jacuzzi',
                    'Landscaped Private Lawn & Gazebo',
                    'Equipped Chef Kitchen & Bar Counter',
                    'Smart Home Automation & Climate Control',
                    'Private Home Theatre',
                    'Italian Marble Flooring'
                  ]).map((item) => {
                    const activeList = selectedAsset.type === 'PG' ? pgRoomAmenities :
                                       selectedAsset.type === 'Flat' ? flatFittings :
                                       selectedAsset.type === 'Warehouse' ? whInfrastructure :
                                       selectedAsset.type === 'Office' ? commFeatures : villaLuxuryAmenities;
                    const isChecked = activeList.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (selectedAsset.type === 'PG') {
                            setPgRoomAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Flat') {
                            setFlatFittings(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Warehouse') {
                            setWhInfrastructure(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Office') {
                            setCommFeatures(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else {
                            setVillaLuxuryAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'border-[#274235] bg-[#eef3f0] text-[#19251f]'
                            : 'border-[#e3e1d8] bg-white text-[#4d5a52] hover:bg-[#fbfbfa]'
                        }`}
                      >
                        <span className="text-xs font-semibold">{item}</span>
                        <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#274235] border-[#274235] text-white' : 'border-[#d8d6cd]'
                        }`}>
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: SHARED BUILDING / CAMPUS AMENITIES (Tailored)        */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  {selectedAsset.type === 'PG' ? 'Building Common Facilities' :
                   selectedAsset.type === 'Flat' ? 'Gated Society Facilities' :
                   selectedAsset.type === 'Warehouse' ? 'Logistics Park & Periphery Facilities' :
                   selectedAsset.type === 'Office' ? 'Commercial Tech Campus Amenities' : 'Private Estate Services'}
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Shared infrastructure and security outside the unit.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(selectedAsset.type === 'PG' ? [
                    'CCTV 24/7',
                    'Security Guard',
                    'Biometric Door Access',
                    'Commercial RO Water Plant',
                    'Power Backup Generator',
                    'Lift / Elevator',
                    '2-Wheeler Parking',
                    'Rooftop Clothes Drying Area'
                  ] : selectedAsset.type === 'Flat' ? [
                    'Gated Society Security',
                    'Intercom to Gate',
                    'Passenger & Service Lifts',
                    '100% DG Power Backup',
                    'Swimming Pool & Clubhouse',
                    'Gymnasium',
                    'Children Play Area',
                    'EV Charging Bay'
                  ] : selectedAsset.type === 'Warehouse' ? [
                    '24/7 Armed Security & Boom Barriers',
                    '100-Ton Truck Weighbridge',
                    'Driver Restroom & Canteen',
                    'Mezzanine Admin Office Space',
                    'Heavy Vehicle Parking Slots',
                    'Perimeter High-Mast Lighting'
                  ] : selectedAsset.type === 'Office' ? [
                    'Food Court & Executive Cafeteria',
                    'Visitor Reception with Digital Passes',
                    'ATM & Retail Banking',
                    'Fire Safety NOC & Smoke Evacuation',
                    'Dedicated Smoking Terrace Zone',
                    'Multi-Level Car Parking (MLCP)'
                  ] : [
                    'Resident Caretaker / Butler On-Site',
                    'Dedicated Swimming Pool Maintenance',
                    'Gardener & Landscaping Care',
                    'Daily Housekeeping & Fresh Linen',
                    'Private Chef On Call'
                  ]).map((item) => {
                    const activeList = selectedAsset.type === 'PG' ? pgBuildingAmenities :
                                       selectedAsset.type === 'Flat' ? flatSocietyAmenities :
                                       selectedAsset.type === 'Warehouse' ? whCampusAmenities :
                                       selectedAsset.type === 'Office' ? commCampusAmenities : villaServices;
                    const isChecked = activeList.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (selectedAsset.type === 'PG') {
                            setPgBuildingAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Flat') {
                            setFlatSocietyAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Warehouse') {
                            setWhCampusAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else if (selectedAsset.type === 'Office') {
                            setCommCampusAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          } else {
                            setVillaServices(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'border-[#274235] bg-[#eef3f0] text-[#19251f]'
                            : 'border-[#e3e1d8] bg-white text-[#4d5a52] hover:bg-[#fbfbfa]'
                        }`}
                      >
                        <span className="text-xs font-semibold">{item}</span>
                        <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#274235] border-[#274235] text-white' : 'border-[#d8d6cd]'
                        }`}>
                          {isChecked && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: SERVICES & RULES (Strictly Tailored)                  */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  {selectedAsset.type === 'PG' ? 'PG Services & House Rules' :
                   selectedAsset.type === 'Flat' ? 'Society Rules & Tenant Policies' :
                   selectedAsset.type === 'Warehouse' ? 'Logistics Protocols & Compliance' :
                   selectedAsset.type === 'Office' ? 'Commercial Leasing Standards' : 'Estate Guest Norms'}
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Define operating expectations, curfews, and service schedules.
                </p>
              </div>

              {/* PG ONLY: Services, Meals & Curfews */}
              {selectedAsset.type === 'PG' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#e3e1d8] space-y-3.5 shadow-2xs">
                    <span className="text-xs font-bold text-[#19251f] block border-b border-[#eeece5] pb-2">Included Services</span>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6e7972] uppercase">Housekeeping Frequency</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['Daily', 'Weekly', 'Bi-weekly'] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setPgCleaningFreq(f)}
                            className={`py-1 text-center rounded-lg text-[10px] font-bold border transition ${
                              pgCleaningFreq === f ? 'bg-[#eef3f0] border-[#274235] text-[#274235]' : 'border-[#e3e1d8] text-[#6e7972]'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6e7972] uppercase">Meals Included</span>
                      <div className="flex gap-1.5">
                        {['Breakfast', 'Lunch', 'Dinner'].map((m) => {
                          const isInc = pgMealsIncluded.includes(m);
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPgMealsIncluded(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${
                                isInc ? 'bg-[#eef3f0] border-[#274235] text-[#274235]' : 'border-[#e3e1d8] text-[#6e7972]'
                              }`}
                            >
                              {isInc && <Check className="h-3 w-3" />}
                              <span>{m}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#19251f]">Washing Machine / Laundry</span>
                      <button
                        type="button"
                        onClick={() => setPgLaundryProvided(!pgLaundryProvided)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${pgLaundryProvided ? 'bg-[#274235]' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${pgLaundryProvided ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#e3e1d8] space-y-3.5 shadow-2xs">
                    <span className="text-xs font-bold text-[#19251f] block border-b border-[#eeece5] pb-2">House Rules &amp; Curfew</span>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6e7972] uppercase">Main Gate Curfew</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['9 PM', '10 PM', '11 PM', 'Never'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPgGateClosingTime(t)}
                            className={`py-1 text-center rounded-lg text-[10px] font-bold border transition ${
                              pgGateClosingTime === t ? 'bg-[#eef3f0] border-[#274235] text-[#274235]' : 'border-[#e3e1d8] text-[#6e7972]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6e7972] uppercase">Guest Hours Cutoff</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['8 PM', '9 PM', '10 PM', 'No curfew'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPgGuestCurfew(t)}
                            className={`py-1 text-center rounded-lg text-[10px] font-bold border transition ${
                              pgGuestCurfew === t ? 'bg-[#eef3f0] border-[#274235] text-[#274235]' : 'border-[#e3e1d8] text-[#6e7972]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FLAT ONLY: Society Rules */}
              {selectedAsset.type === 'Flat' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Tenant Preference</label>
                      <select
                        value={flatTenantPreference}
                        onChange={(e) => setFlatTenantPreference(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="Family Preferred">Family Preferred</option>
                        <option value="Bachelors Allowed">Bachelors Allowed</option>
                        <option value="Any Welcome">Any Welcome</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Pet Policy</label>
                      <select
                        value={flatPetPolicy}
                        onChange={(e) => setFlatPetPolicy(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="Pets Allowed">Pets Allowed</option>
                        <option value="No Pets">No Pets</option>
                        <option value="Small Pets Only">Small Pets Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Society Shift / Move-in Timings</label>
                      <input
                        type="text"
                        value={flatMoveInRule}
                        onChange={(e) => setFlatMoveInRule(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Society Quiet Hours</label>
                      <input
                        type="text"
                        value={flatQuietHours}
                        onChange={(e) => setFlatQuietHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* WAREHOUSE ONLY */}
              {selectedAsset.type === 'Warehouse' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Logistics Operating Hours</label>
                      <select
                        value={whOperationsRule}
                        onChange={(e) => setWhOperationsRule(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="24/7/365 Unrestricted Entry">24/7/365 Unrestricted Entry</option>
                        <option value="Standard Freight Timings">Standard Freight Timings (6 AM - 10 PM)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">HAZMAT Material Policy</label>
                      <select
                        value={whHazmatPolicy}
                        onChange={(e) => setWhHazmatPolicy(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                      >
                        <option value="Non-Hazardous Goods Only">Non-Hazardous Goods Only</option>
                        <option value="Class A Hazmat Approved">Class A Hazmat Approved</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-[#eeece5]">
                    <label className="text-[11px] font-bold text-[#19251f]">CAM Charges Breakdown (₹{whCamRateSqFt}/sq.ft)</label>
                    <p className="text-[10px] text-[#6e7972]">Includes 24/7 armed perimeter security, internal concrete road maintenance, storm drainage &amp; exterior high-mast lighting.</p>
                  </div>
                </div>
              )}

              {/* COMMERCIAL / OFFICE ONLY */}
              {selectedAsset.type === 'Office' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#19251f]">Corporate Access Timings</label>
                    <select
                      value={commOperatingHours}
                      onChange={(e) => setCommOperatingHours(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs bg-white font-medium"
                    >
                      <option value="24/7 ITeS Access Allowed">24/7 ITeS Access Allowed (2-Shift/3-Shift)</option>
                      <option value="Standard 8 AM - 9 PM">Standard Business Hours (8 AM - 9 PM)</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-[#eef3f0] border border-[#274235]/20 text-[11px] text-[#274235] leading-relaxed">
                    <span className="font-bold">Sub-Meter Energy Protocol: </span>
                    Primary HVAC billed in CAM. High-density server room power &amp; internal light fixtures metered separately at state Discom commercial tariff.
                  </div>
                </div>
              )}

              {/* VILLA ONLY */}
              {selectedAsset.type === 'Independent House' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Maximum Guest Capacity</label>
                      <input
                        type="number"
                        value={villaMaxGuests}
                        onChange={(e) => setVillaMaxGuests(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Outdoor Music Cutoff</label>
                      <input
                        type="text"
                        value={villaQuietHours}
                        onChange={(e) => setVillaQuietHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 6: PREVIEW & PUBLISH / AADHAAR KYC                      */}
          {/* ============================================================ */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#19251f] tracking-tight">
                  Almost there.
                </h2>
                <p className="text-xs text-[#6e7972] mt-0.5">
                  Verify your identity to publish your listing and activate automated rent collection.
                </p>
              </div>

              {/* Aadhaar Verification Box (Staywise Forest Theme) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#274235]/30 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#eef3f0] text-[#274235] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#19251f]">Verify ownership with Aadhaar</h3>
                    <p className="text-[11px] text-[#6e7972]">Government-backed instant verification to list on Staywise.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* DigiLocker (Recommended) */}
                  <div className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isKycVerified && kycMethod === 'digilocker'
                      ? 'border-[#274235] bg-[#eef3f0]'
                      : 'border-[#d8d6cd] bg-white hover:border-[#274235]'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#274235]">DigiLocker</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#274235] text-white text-[9px] font-black uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4d5a52]">
                        Instant 1-minute verification via UIDAI DigiLocker service
                      </p>

                      <div className="space-y-1 text-[10px] text-[#274235] font-medium pt-1">
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[#274235] shrink-0" />
                          <span>Auto-fetches Aadhaar &amp; verified address</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[#274235] shrink-0" />
                          <span>100% government-backed &amp; paperless</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isKycVerified || isVerifyingDigiLocker}
                      onClick={handleDigiLockerVerify}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                        isKycVerified && kycMethod === 'digilocker'
                          ? 'bg-[#274235] text-white cursor-default'
                          : 'bg-[#274235] hover:bg-[#1e352a] text-white shadow-xs'
                      }`}
                    >
                      {isVerifyingDigiLocker ? 'Connecting to DigiLocker...' : isKycVerified && kycMethod === 'digilocker' ? 'Verified with DigiLocker ✓' : 'Verify with DigiLocker'}
                    </button>
                  </div>

                  {/* Manual Upload */}
                  <div className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isKycVerified && kycMethod === 'manual'
                      ? 'border-[#274235] bg-[#eef3f0]'
                      : 'border-[#d8d6cd] bg-white hover:border-[#19251f]'
                  }`}>
                    <div className="space-y-2">
                      <h4 className="font-bold text-xs text-[#19251f]">Manual Upload</h4>
                      <p className="text-[11px] text-[#4d5a52]">
                        Upload photos of your Aadhaar card for manual audit (24h)
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleManualUpload}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs border transition cursor-pointer text-center ${
                        isKycVerified && kycMethod === 'manual'
                          ? 'bg-[#274235] border-[#274235] text-white cursor-default'
                          : 'border-[#d8d6cd] text-[#19251f] hover:bg-[#f4f3ef]'
                      }`}
                    >
                      {isKycVerified && kycMethod === 'manual' ? 'Document Uploaded ✓' : 'Upload Aadhaar Photo'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Lock Warning Banner */}
              {!isKycVerified ? (
                <div className="p-3.5 rounded-2xl bg-[#fbf5e6] border border-amber-300 flex items-center gap-2.5 text-amber-900 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <span className="font-bold block">Building launch locked</span>
                    <span className="text-[11px] text-amber-800">Complete Aadhaar KYC above to enable the "Create Building &amp; Go Live" button.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#eef3f0] border border-[#274235]/30 flex items-center gap-2.5 text-[#274235] text-xs">
                  <CheckCircle className="h-4 w-4 text-[#274235] shrink-0" />
                  <div>
                    <span className="font-bold block">Identity Verified via UIDAI DigiLocker</span>
                    <span className="text-[11px] text-[#274235]">Shyam J • Aadhaar XXXX-XXXX-8832 • Ready to launch building!</span>
                  </div>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#19251f]">What tenants will see</h3>
                <div className="rounded-2xl border border-[#e3e1d8] bg-white overflow-hidden shadow-xs">
                  <div className="h-24 bg-gradient-to-r from-[#19251f] via-[#203429] to-[#274235] p-3 text-white flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#274235] text-white text-[10px] font-black uppercase">
                        {selectedAsset.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-xs text-[10px] font-bold">
                        Staywise Verified
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white tracking-tight">{propertyName}</h4>
                      <p className="text-[10px] text-emerald-200/80 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{addressSearch}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-white border-t border-[#eeece5]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-[10px] text-[#6e7972]">
                        <span className="font-bold text-[#19251f]">{calculatedTotalUnits()} {selectedAsset.type === 'PG' ? 'beds' : 'units/bays'}</span>
                        <span>•</span>
                        <span>{city}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] text-[#6e7972] uppercase font-bold">RENT</span>
                        <span className="text-base font-black text-[#19251f]">
                          ₹{(selectedAsset.type === 'PG' ? pgRentPerBed : selectedAsset.type === 'Flat' ? flatMonthlyRent : calculatedMonthlyRent()).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#6e7972]">/mo</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-[#6e7972] block font-bold">AUM / MONTH</span>
                      <span className="text-base font-black text-[#274235]">
                        ₹{calculatedMonthlyRent().toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Accordions */}
              <div className="rounded-xl border border-[#e3e1d8] bg-white divide-y divide-[#eeece5] text-xs">
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'basics' ? null : 'basics')}
                    className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-[#19251f] cursor-pointer hover:bg-[#fbfbfa]"
                  >
                    <span>1. Basics &amp; Asset Class</span>
                    {expandedSection === 'basics' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSection === 'basics' && (
                    <div className="px-4 pb-3 pt-1 text-[11px] text-[#4d5a52] space-y-1 bg-[#fbfbfa]">
                      <p>Property Name: <b>{propertyName}</b></p>
                      <p>Class: <b>{selectedAsset.label}</b></p>
                      <p>Address: <b>{addressSearch}</b></p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'inventory' ? null : 'inventory')}
                    className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-[#19251f] cursor-pointer hover:bg-[#fbfbfa]"
                  >
                    <span>2. Capacity &amp; Financials</span>
                    {expandedSection === 'inventory' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSection === 'inventory' && (
                    <div className="px-4 pb-3 pt-1 text-[11px] text-[#4d5a52] space-y-1 bg-[#fbfbfa]">
                      <p>Total Capacity: <b>{calculatedTotalUnits()} units/beds</b></p>
                      <p>Expected Monthly Rent: <b>₹{calculatedMonthlyRent().toLocaleString('en-IN')}</b></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation in Staywise Old Theme */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-[#eeece5] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 rounded-full border border-[#d8d6cd] text-[#4d5a52] hover:bg-[#f4f3ef] font-bold text-xs transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddPropertyOpen(false)}
              className="px-4 py-2 rounded-full border border-[#d8d6cd] text-[#6e7972] hover:bg-[#f4f3ef] font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-full border border-[#e3e1d8] bg-white hover:border-[#274235] text-xs font-bold text-[#274235] transition cursor-pointer"
            >
              Save Draft
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-6 py-2 rounded-full bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!isKycVerified}
                onClick={handlePublishProperty}
                className={`px-6 py-2 rounded-full font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer ${
                  isKycVerified
                    ? 'bg-[#274235] hover:bg-[#1e352a] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!isKycVerified ? (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Verify Aadhaar to Launch</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Create Building &amp; Go Live</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
