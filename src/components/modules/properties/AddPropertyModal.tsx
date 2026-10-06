'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '../../../context/AppStateContext';
import { PropertyType } from '../../../types';
import { 
  X, 
  MapPin, 
  IndianRupee, 
  CheckCircle,
  Home,
  BedDouble,
  Briefcase,
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
  CheckCircle2
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
  const [savedDraftInfo, setSavedDraftInfo] = useState<{
    propertyName: string;
    currentStep: 1 | 2 | 3 | 4 | 5 | 6;
    selectedAssetType: string;
    updatedAtTime: string;
    rawDraft: any;
  } | null>(null);
  const [isDraftExplicitlySaved, setIsDraftExplicitlySaved] = useState(false);

  // Field validation tracking
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear specific field error on user interaction
  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    if (validationError) setValidationError(null);
  };

  // STEP 1: BASICS (Common)
  const [selectedAsset, setSelectedAsset] = useState<AssetTypeOption>(ASSET_TYPES[0]);
  const [propertyName, setPropertyName] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressProofFile1, setAddressProofFile1] = useState<string | null>(null);
  const [mapPinCoords, setMapPinCoords] = useState<{ x: number; y: number }>({ x: 50, y: 46 });

  // STEP 2 & BEYOND: ASSET-SPECIFIC FIELDS (All clean without default hardcoded values)

  // === A. PG / HOSTEL SPECIFIC ===
  const [pgFloors, setPgFloors] = useState<string | number>('');
  const [pgRoomsPerFloor, setPgRoomsPerFloor] = useState<string | number>('');
  const [pgSharingType, setPgSharingType] = useState<'Single' | '2-Sharing' | '3-Sharing' | '4-Sharing'>('2-Sharing');
  const [pgRentPerBed, setPgRentPerBed] = useState<string | number>('');
  const [pgDepositPerBed, setPgDepositPerBed] = useState<string | number>('');
  const [pgGenderPolicy, setPgGenderPolicy] = useState<'Male Only' | 'Female Only' | 'Unisex / Co-ed'>('Unisex / Co-ed');
  const [pgElectricityBilling, setPgElectricityBilling] = useState<'Sub-meter OCR' | 'Equal Split' | 'Included in Rent'>('Sub-meter OCR');
  const [pgRoomAmenities, setPgRoomAmenities] = useState<string[]>([]);
  const [pgBuildingAmenities, setPgBuildingAmenities] = useState<string[]>([]);
  const [pgCleaningFreq, setPgCleaningFreq] = useState<'Daily' | 'Weekly' | 'Bi-weekly'>('Daily');
  const [pgMealsIncluded, setPgMealsIncluded] = useState<string[]>([]);
  const [pgLaundryProvided, setPgLaundryProvided] = useState(false);
  const [pgLifestyleRules, setPgLifestyleRules] = useState<string[]>([]);
  const [pgGuestCurfew, setPgGuestCurfew] = useState<string>('');
  const [pgGateClosingTime, setPgGateClosingTime] = useState<string>('');

  // === B. FLAT / APARTMENT SPECIFIC ===
  const [flatUnitsCount, setFlatUnitsCount] = useState<string | number>(1);
  const [flatBhkType, setFlatBhkType] = useState('2 BHK');
  const [flatUnitNumber, setFlatUnitNumber] = useState('');
  const [flatFloorNumber, setFlatFloorNumber] = useState<string | number>('');
  const [flatAreaSqFt, setFlatAreaSqFt] = useState<string | number>('');
  const [flatMonthlyRent, setFlatMonthlyRent] = useState<string | number>('');
  const [flatSecurityDeposit, setFlatSecurityDeposit] = useState<string | number>('');
  const [flatMaintenanceFee, setFlatMaintenanceFee] = useState<string | number>('');
  const [flatFurnishing, setFlatFurnishing] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [flatFittings, setFlatFittings] = useState<string[]>([]);
  const [flatSocietyAmenities, setFlatSocietyAmenities] = useState<string[]>([]);
  const [flatTenantPreference, setFlatTenantPreference] = useState<'Family Preferred' | 'Bachelors Allowed' | 'Any Welcome'>('Any Welcome');
  const [flatPetPolicy, setFlatPetPolicy] = useState<'Pets Allowed' | 'No Pets' | 'Small Pets Only'>('Pets Allowed');
  const [flatQuietHours, setFlatQuietHours] = useState('');
  const [flatMoveInRule, setFlatMoveInRule] = useState('');

  // === C. WAREHOUSE / INDUSTRIAL SPECIFIC ===
  const [whCarpetAreaSqFt, setWhCarpetAreaSqFt] = useState<string | number>('');
  const [whClearHeightFt, setWhClearHeightFt] = useState<string | number>('');
  const [whFlooringType, setWhFlooringType] = useState('FM2 Heavy Duty Laser Screed (5T/sq.m)');
  const [whLoadingDocks, setWhLoadingDocks] = useState<string | number>('');
  const [whBaseRentSqFt, setWhBaseRentSqFt] = useState<string | number>('');
  const [whSecurityDepositMonths, setWhSecurityDepositMonths] = useState<string | number>('');
  const [whLockInMonths, setWhLockInMonths] = useState<string | number>('');
  const [whEscalationPercent, setWhEscalationPercent] = useState<string | number>('');
  const [whPowerKva, setWhPowerKva] = useState<string | number>('');
  const [whInfrastructure, setWhInfrastructure] = useState<string[]>([]);
  const [whCampusAmenities, setWhCampusAmenities] = useState<string[]>([]);
  const [whOperationsRule, setWhOperationsRule] = useState<'24/7/365 Unrestricted Entry' | 'Standard Freight Timings'>('24/7/365 Unrestricted Entry');
  const [whHazmatPolicy, setWhHazmatPolicy] = useState<'Non-Hazardous Goods Only' | 'Class A Hazmat Approved'>('Non-Hazardous Goods Only');
  const [whCamRateSqFt, setWhCamRateSqFt] = useState<string | number>('');

  // === D. COMMERCIAL / OFFICE SPECIFIC ===
  const [commCarpetSqFt, setCommCarpetSqFt] = useState<string | number>('');
  const [commSuperBuiltUpSqFt, setCommSuperBuiltUpSqFt] = useState<string | number>('');
  const [commFitOutStatus, setCommFitOutStatus] = useState<'Plug & Play Furnished' | 'Warm Shell' | 'Bare Shell'>('Plug & Play Furnished');
  const [commWorkstations, setCommWorkstations] = useState<string | number>('');
  const [commMeetingRooms, setCommMeetingRooms] = useState<string | number>('');
  const [commBaseRentSqFt, setCommBaseRentSqFt] = useState<string | number>('');
  const [commCamSqFt, setCommCamSqFt] = useState<string | number>('');
  const [commCarBays, setCommCarBays] = useState<string | number>('');
  const [commTwoWheelerBays, setCommTwoWheelerBays] = useState<string | number>('');
  const [commLockInMonths, setCommLockInMonths] = useState<string | number>('');
  const [commFeatures, setCommFeatures] = useState<string[]>([]);
  const [commCampusAmenities, setCommCampusAmenities] = useState<string[]>([]);
  const [commOperatingHours, setCommOperatingHours] = useState<'24/7 ITeS Access Allowed' | 'Standard 8 AM - 9 PM'>('24/7 ITeS Access Allowed');

  // === E. VILLA / VACATION HOME SPECIFIC ===
  const [villaBedrooms, setVillaBedrooms] = useState<string | number>('');
  const [villaBuiltUpSqFt, setVillaBuiltUpSqFt] = useState<string | number>('');
  const [villaPlotSqFt, setVillaPlotSqFt] = useState<string | number>('');
  const [villaMonthlyRent, setVillaMonthlyRent] = useState<string | number>('');
  const [villaSecurityDeposit, setVillaSecurityDeposit] = useState<string | number>('');
  const [villaStaffBudget, setVillaStaffBudget] = useState<string | number>('');
  const [villaLuxuryAmenities, setVillaLuxuryAmenities] = useState<string[]>([]);
  const [villaServices, setVillaServices] = useState<string[]>([]);
  const [villaMaxGuests, setVillaMaxGuests] = useState<string | number>('');
  const [villaQuietHours, setVillaQuietHours] = useState('');

  // STEP 6: PREVIEW & PUBLISH / AADHAAR KYC
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [kycMethod, setKycMethod] = useState<'digilocker' | 'manual' | null>(null);
  const [isVerifyingDigiLocker, setIsVerifyingDigiLocker] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'basics' | 'inventory' | 'amenities' | 'rules' | null>('basics');

  // Reset all fields back to completely clean initial state (NO DEFAULT MOCK NUMBERS)
  const resetToInitialDefaults = () => {
    setCurrentStep(1);
    setSelectedAsset(ASSET_TYPES[0]);
    setPropertyName('');
    setAddressSearch('');
    setCity('');
    setState('');
    setPincode('');
    setAddressProofFile1(null);
    setMapPinCoords({ x: 50, y: 46 });
    setFieldErrors({});
    setValidationError(null);

    // PG
    setPgFloors('');
    setPgRoomsPerFloor('');
    setPgSharingType('2-Sharing');
    setPgRentPerBed('');
    setPgDepositPerBed('');
    setPgGenderPolicy('Unisex / Co-ed');
    setPgElectricityBilling('Sub-meter OCR');
    setPgRoomAmenities([]);
    setPgBuildingAmenities([]);
    setPgCleaningFreq('Daily');
    setPgMealsIncluded([]);
    setPgLaundryProvided(false);
    setPgLifestyleRules([]);
    setPgGuestCurfew('');
    setPgGateClosingTime('');

    // Flat
    setFlatUnitsCount(1);
    setFlatBhkType('2 BHK');
    setFlatUnitNumber('');
    setFlatFloorNumber('');
    setFlatAreaSqFt('');
    setFlatMonthlyRent('');
    setFlatSecurityDeposit('');
    setFlatMaintenanceFee('');
    setFlatFurnishing('Semi-Furnished');
    setFlatFittings([]);
    setFlatSocietyAmenities([]);
    setFlatTenantPreference('Any Welcome');
    setFlatPetPolicy('Pets Allowed');
    setFlatQuietHours('');
    setFlatMoveInRule('');

    // Warehouse
    setWhCarpetAreaSqFt('');
    setWhClearHeightFt('');
    setWhFlooringType('FM2 Heavy Duty Laser Screed (5T/sq.m)');
    setWhLoadingDocks('');
    setWhBaseRentSqFt('');
    setWhSecurityDepositMonths('');
    setWhLockInMonths('');
    setWhEscalationPercent('');
    setWhPowerKva('');
    setWhInfrastructure([]);
    setWhCampusAmenities([]);
    setWhOperationsRule('24/7/365 Unrestricted Entry');
    setWhHazmatPolicy('Non-Hazardous Goods Only');
    setWhCamRateSqFt('');

    // Commercial
    setCommCarpetSqFt('');
    setCommSuperBuiltUpSqFt('');
    setCommFitOutStatus('Plug & Play Furnished');
    setCommWorkstations('');
    setCommMeetingRooms('');
    setCommBaseRentSqFt('');
    setCommCamSqFt('');
    setCommCarBays('');
    setCommTwoWheelerBays('');
    setCommLockInMonths('');
    setCommFeatures([]);
    setCommCampusAmenities([]);
    setCommOperatingHours('24/7 ITeS Access Allowed');

    // Villa
    setVillaBedrooms('');
    setVillaBuiltUpSqFt('');
    setVillaPlotSqFt('');
    setVillaMonthlyRent('');
    setVillaSecurityDeposit('');
    setVillaStaffBudget('');
    setVillaLuxuryAmenities([]);
    setVillaServices([]);
    setVillaMaxGuests('');
    setVillaQuietHours('');

    // KYC
    setIsKycVerified(false);
    setKycMethod(null);
    setIsDraftExplicitlySaved(false);
  };

  // Inspect LocalStorage for explicitly saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isExplicitlySaved) {
          setSavedDraftInfo({
            propertyName: parsed.propertyName || 'Untitled Property',
            currentStep: (parsed.currentStep as any) || 1,
            selectedAssetType: parsed.selectedAssetType || 'PG',
            updatedAtTime: parsed.updatedAt ? new Date(parsed.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            rawDraft: parsed
          });
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    // Always start at Step 1 initially
    setCurrentStep(1);
  }, []);

  // When modal is reopened, ensure starting at step 1 if not explicitly saved
  useEffect(() => {
    if (isAddPropertyOpen && !isDraftExplicitlySaved) {
      setCurrentStep(1);
    }
  }, [isAddPropertyOpen, isDraftExplicitlySaved]);

  // Save Draft to LocalStorage explicitly
  const handleSaveDraft = () => {
    try {
      const draftData = {
        isExplicitlySaved: true,
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
      setIsDraftExplicitlySaved(true);
      setSavedDraftInfo({
        propertyName,
        currentStep,
        selectedAssetType: selectedAsset.type,
        updatedAtTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rawDraft: draftData
      });
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    } catch {
      // Ignore
    }
  };

  // Resume explicitly saved draft
  const handleResumeDraft = () => {
    if (!savedDraftInfo?.rawDraft) return;
    const parsed = savedDraftInfo.rawDraft;
    if (parsed.propertyName) setPropertyName(parsed.propertyName);
    if (parsed.selectedAssetType) {
      const matched = ASSET_TYPES.find(a => a.type === parsed.selectedAssetType);
      if (matched) setSelectedAsset(matched);
    }
    if (parsed.addressSearch) setAddressSearch(parsed.addressSearch);
    if (parsed.city) setCity(parsed.city);
    if (parsed.state) setState(parsed.state);
    if (parsed.pincode) setPincode(parsed.pincode);
    if (parsed.isKycVerified !== undefined) setIsKycVerified(parsed.isKycVerified);
    if (parsed.currentStep) setCurrentStep(parsed.currentStep);
    setIsDraftExplicitlySaved(true);
  };

  // Discard saved draft and reset
  const handleDiscardDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSavedDraftInfo(null);
    setIsDraftExplicitlySaved(false);
    resetToInitialDefaults();
  };

  // Reset Form Cleanly
  const handleResetForm = () => {
    if (confirm('Are you sure you want to reset and start fresh? All entered data will be cleared.')) {
      handleDiscardDraft();
    }
  };

  // Handle closing modal without saving: resets back to starting step 1
  const handleCloseWithoutSaving = () => {
    if (!isDraftExplicitlySaved) {
      resetToInitialDefaults();
    }
    setCurrentStep(1);
    setIsAddPropertyOpen(false);
  };

  if (!isAddPropertyOpen) return null;

  // Asset selection triggers tailored form view
  const handleAssetSelect = (asset: AssetTypeOption) => {
    setSelectedAsset(asset);
    setFieldErrors({});
    setValidationError(null);
  };

  // Calculations based on asset class
  const calculatedTotalUnits = () => {
    if (selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel') {
      const beds = pgSharingType === 'Single' ? 1 : pgSharingType === '2-Sharing' ? 2 : pgSharingType === '3-Sharing' ? 3 : 4;
      const floors = Number(pgFloors) || 0;
      const rooms = Number(pgRoomsPerFloor) || 0;
      return floors * rooms * beds;
    }
    if (selectedAsset.type === 'Flat' || selectedAsset.type === 'Apartment') {
      return Number(flatUnitsCount) || 1;
    }
    if (selectedAsset.type === 'Warehouse') {
      return Number(whLoadingDocks) || 1;
    }
    if (selectedAsset.type === 'Office') {
      const carpet = Number(commCarpetSqFt) || 0;
      return Math.max(1, Math.round(carpet / 1000));
    }
    return 1;
  };

  const calculatedMonthlyRent = () => {
    if (selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel') {
      return calculatedTotalUnits() * (Number(pgRentPerBed) || 0);
    }
    if (selectedAsset.type === 'Flat' || selectedAsset.type === 'Apartment') {
      return (Number(flatUnitsCount) || 1) * (Number(flatMonthlyRent) || 0);
    }
    if (selectedAsset.type === 'Warehouse') {
      return (Number(whCarpetAreaSqFt) || 0) * (Number(whBaseRentSqFt) || 0);
    }
    if (selectedAsset.type === 'Office') {
      const carpet = Number(commCarpetSqFt) || 0;
      const base = Number(commBaseRentSqFt) || 0;
      const cam = Number(commCamSqFt) || 0;
      return (carpet * base) + (carpet * cam);
    }
    if (selectedAsset.type === 'Independent House' || selectedAsset.type === 'Villa') {
      return Number(villaMonthlyRent) || 0;
    }
    return 0;
  };

  // Validation logic across steps with per-field error mapping
  const validateCurrentStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};
    setValidationError(null);

    if (stepNumber === 1) {
      if (!propertyName.trim() || propertyName.trim().length < 2) {
        errors.propertyName = 'Property name is required (min 2 chars)';
      }
      if (!addressSearch.trim() || addressSearch.trim().length < 3) {
        errors.addressSearch = 'Location / street address is required';
      }
    } else if (stepNumber === 2) {
      if (selectedAsset.type === 'PG' || selectedAsset.type === 'Hostel') {
        if (!pgFloors || Number(pgFloors) < 1) {
          errors.pgFloors = 'Enter valid floors (min 1)';
        }
        if (!pgRoomsPerFloor || Number(pgRoomsPerFloor) < 1) {
          errors.pgRoomsPerFloor = 'Enter rooms per floor (min 1)';
        }
        if (!pgRentPerBed || Number(pgRentPerBed) <= 0) {
          errors.pgRentPerBed = 'Enter monthly rent per bed (₹)';
        }
        if (pgDepositPerBed === '' || Number(pgDepositPerBed) < 0) {
          errors.pgDepositPerBed = 'Enter deposit amount (₹)';
        }
      } else if (selectedAsset.type === 'Flat' || selectedAsset.type === 'Apartment') {
        if (!flatUnitNumber.trim()) {
          errors.flatUnitNumber = 'Enter unit / flat number';
        }
        if (!flatMonthlyRent || Number(flatMonthlyRent) <= 0) {
          errors.flatMonthlyRent = 'Enter monthly rent for flat (₹)';
        }
        if (flatSecurityDeposit === '' || Number(flatSecurityDeposit) < 0) {
          errors.flatSecurityDeposit = 'Enter security deposit (₹)';
        }
        if (!flatAreaSqFt || Number(flatAreaSqFt) <= 0) {
          errors.flatAreaSqFt = 'Enter carpet area in sq.ft';
        }
      } else if (selectedAsset.type === 'Warehouse') {
        if (!whCarpetAreaSqFt || Number(whCarpetAreaSqFt) <= 0) {
          errors.whCarpetAreaSqFt = 'Enter carpet area in sq.ft';
        }
        if (!whClearHeightFt || Number(whClearHeightFt) <= 0) {
          errors.whClearHeightFt = 'Enter clear height (feet)';
        }
        if (!whBaseRentSqFt || Number(whBaseRentSqFt) <= 0) {
          errors.whBaseRentSqFt = 'Enter base rent (₹/sq.ft)';
        }
        if (!whLoadingDocks || Number(whLoadingDocks) < 1) {
          errors.whLoadingDocks = 'Enter dock count';
        }
      } else if (selectedAsset.type === 'Office') {
        if (!commCarpetSqFt || Number(commCarpetSqFt) <= 0) {
          errors.commCarpetSqFt = 'Enter usable carpet area (sq.ft)';
        }
        if (!commBaseRentSqFt || Number(commBaseRentSqFt) <= 0) {
          errors.commBaseRentSqFt = 'Enter base rent (₹/sq.ft)';
        }
        if (commCamSqFt === '' || Number(commCamSqFt) < 0) {
          errors.commCamSqFt = 'Enter CAM charges (₹/sq.ft)';
        }
        if (!commWorkstations || Number(commWorkstations) < 1) {
          errors.commWorkstations = 'Enter workstation capacity';
        }
      } else if (selectedAsset.type === 'Independent House' || selectedAsset.type === 'Villa') {
        if (!villaBedrooms || Number(villaBedrooms) < 1) {
          errors.villaBedrooms = 'Enter bedroom count';
        }
        if (!villaBuiltUpSqFt || Number(villaBuiltUpSqFt) <= 0) {
          errors.villaBuiltUpSqFt = 'Enter built-up area (sq.ft)';
        }
        if (!villaMonthlyRent || Number(villaMonthlyRent) <= 0) {
          errors.villaMonthlyRent = 'Enter monthly rent / tariff (₹)';
        }
        if (villaSecurityDeposit === '' || Number(villaSecurityDeposit) < 0) {
          errors.villaSecurityDeposit = 'Enter security deposit (₹)';
        }
      }
    }

    setFieldErrors(errors);
    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      setValidationError(`Please resolve the ${errorCount} highlighted field${errorCount > 1 ? 's' : ''} to proceed.`);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setValidationError(null);
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => (prev - 1) as any);
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
    const finalPropertyName = propertyName.trim() || `${selectedAsset.label} Property`;
    const finalAddress = addressSearch.trim() || 'Central City Area';
    const finalCity = city.trim() || 'Bengaluru';
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
      name: finalPropertyName,
      type: selectedAsset.type,
      portfolio: `${finalCity} Central`,
      address: finalAddress,
      city: finalCity,
      state: state.trim() || 'Karnataka',
      pincode: pincode.trim() || '560001',
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
      `"${finalPropertyName}" (${selectedAsset.label}) is now live with ${totalUnits} units/beds. UIDAI DigiLocker verified.`,
      'SYSTEM'
    );

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSavedDraftInfo(null);
    setIsDraftExplicitlySaved(false);
    resetToInitialDefaults();
    setIsAddPropertyOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#19251f]/60 backdrop-blur-md flex items-center justify-center p-2 xs:p-3 sm:p-5 overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseWithoutSaving();
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-[#e3e1d8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar in Staywise Forest Theme */}
        <div className="bg-[#fbfbfa] border-b border-[#eeece5] px-4 sm:px-6 pt-4 pb-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
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
                onClick={handleCloseWithoutSaving}
                className="text-[#6e7972] hover:text-[#19251f] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar (Staywise Forest Palette) */}
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

          {/* Validation Error Alert Banner */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-1 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-rose-600 hover:text-rose-800 p-0.5 rounded-full cursor-pointer"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Saved Draft Resume Notice on Step 1 */}
          {savedDraftInfo && currentStep === 1 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Save className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-amber-950">
                    Saved Draft: &ldquo;{savedDraftInfo.propertyName}&rdquo;
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Saved at Step {savedDraftInfo.currentStep} of 6 ({savedDraftInfo.selectedAssetType}) • {savedDraftInfo.updatedAtTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResumeDraft}
                  className="px-3.5 py-1.5 rounded-xl bg-[#274235] hover:bg-[#1e352a] text-white font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Resume Draft →
                </button>
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-[#e3e1d8] font-bold text-xs transition cursor-pointer"
                  title="Discard this draft and start fresh"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

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
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#19251f]">
                      Property Name / Identification <span className="text-rose-600">*</span>
                    </label>
                    {fieldErrors.propertyName && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md animate-in fade-in">
                        <AlertCircle className="h-3 w-3 text-rose-600 shrink-0" />
                        {fieldErrors.propertyName}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => {
                      setPropertyName(e.target.value);
                      clearFieldError('propertyName');
                    }}
                    placeholder="Enter building or property name (e.g. Sunrise PG, Greenview Villa)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-[#19251f] placeholder-[#95a099] focus:outline-none transition ${
                      fieldErrors.propertyName 
                        ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30' 
                        : 'border-[#d8d6cd] bg-white focus:border-[#274235]'
                    }`}
                  />
                  <p className="text-[10px] text-[#6e7972]">Displayed on tenant invoices, agreements, and online listings.</p>
                </div>

                {/* Location */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#19251f]">
                      Where is it located? <span className="text-rose-600">*</span>
                    </label>
                    {fieldErrors.addressSearch && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md animate-in fade-in">
                        <AlertCircle className="h-3 w-3 text-rose-600 shrink-0" />
                        {fieldErrors.addressSearch}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#274235]" />
                    <input
                      type="text"
                      value={addressSearch}
                      onChange={(e) => {
                        setAddressSearch(e.target.value);
                        clearFieldError('addressSearch');
                      }}
                      placeholder="Enter full street address, building number, area, city..."
                      className={`w-full pl-9 pr-24 py-2.5 rounded-xl border text-xs text-[#19251f] placeholder-[#95a099] focus:outline-none transition ${
                        fieldErrors.addressSearch 
                          ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30' 
                          : 'border-[#d8d6cd] bg-white focus:border-[#274235]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            () => {
                              setMapPinCoords({ x: 52, y: 48 });
                            },
                            () => {
                              setMapPinCoords({ x: 50, y: 46 });
                            }
                          );
                        }
                      }}
                      className="absolute right-2 top-1.5 px-2.5 py-1 rounded-lg bg-[#eef3f0] hover:bg-[#274235] hover:text-white text-[#274235] text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
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
                    Proof of Address (Electricity bill / Property tax / Deed)
                  </label>
                  {addressProofFile1 ? (
                    <div className="p-3.5 rounded-xl border border-dashed border-[#274235]/40 bg-[#eef3f0]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-[#274235] text-white flex items-center justify-center">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#19251f] block">{addressProofFile1}</span>
                          <span className="text-[10px] text-[#6e7972]">Attached Document</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddressProofFile1(null)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="p-3.5 rounded-xl border border-dashed border-[#d8d6cd] hover:border-[#274235] bg-[#fbfbfa] hover:bg-[#eef3f0]/30 flex items-center justify-between cursor-pointer transition">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-[#f4f3ef] text-[#6e7972] flex items-center justify-center">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#19251f] block">Upload ownership or address document</span>
                          <span className="text-[10px] text-[#6e7972]">PDF, JPG, or PNG up to 10MB</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#274235] text-white">Browse</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setAddressProofFile1(file.name);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: INVENTORY & PRICING (Zero Default Hardcoded Data)    */}
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
                  Enter the capacity and leasing metrics for your {selectedAsset.label}.
                </p>
              </div>

              {/* PG ONLY */}
              {selectedAsset.type === 'PG' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Number of Floors <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.pgFloors && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.pgFloors}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        placeholder="e.g. 3"
                        value={pgFloors}
                        onChange={(e) => {
                          setPgFloors(e.target.value);
                          clearFieldError('pgFloors');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.pgFloors
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Rooms Per Floor <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.pgRoomsPerFloor && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.pgRoomsPerFloor}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="e.g. 6"
                        value={pgRoomsPerFloor}
                        onChange={(e) => {
                          setPgRoomsPerFloor(e.target.value);
                          clearFieldError('pgRoomsPerFloor');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.pgRoomsPerFloor
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Rent per Bed / Month (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.pgRentPerBed && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.pgRentPerBed}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 12000"
                        value={pgRentPerBed}
                        onChange={(e) => {
                          setPgRentPerBed(e.target.value);
                          clearFieldError('pgRentPerBed');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.pgRentPerBed
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Security Deposit / Bed (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.pgDepositPerBed && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.pgDepositPerBed}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 24000"
                        value={pgDepositPerBed}
                        onChange={(e) => {
                          setPgDepositPerBed(e.target.value);
                          clearFieldError('pgDepositPerBed');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.pgDepositPerBed
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Unit Number <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.flatUnitNumber && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.flatUnitNumber}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={flatUnitNumber}
                        onChange={(e) => {
                          setFlatUnitNumber(e.target.value);
                          clearFieldError('flatUnitNumber');
                        }}
                        placeholder="e.g. 402 or Flat 3B"
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.flatUnitNumber
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Floor Number</label>
                      <input
                        type="number"
                        placeholder="e.g. 4"
                        value={flatFloorNumber}
                        onChange={(e) => setFlatFloorNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Monthly Rent for Flat (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.flatMonthlyRent && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.flatMonthlyRent}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 38000"
                        value={flatMonthlyRent}
                        onChange={(e) => {
                          setFlatMonthlyRent(e.target.value);
                          clearFieldError('flatMonthlyRent');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.flatMonthlyRent
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Security Deposit (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.flatSecurityDeposit && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.flatSecurityDeposit}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 150000"
                        value={flatSecurityDeposit}
                        onChange={(e) => {
                          setFlatSecurityDeposit(e.target.value);
                          clearFieldError('flatSecurityDeposit');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.flatSecurityDeposit
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Carpet Area (sq.ft) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.flatAreaSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.flatAreaSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 1250"
                        value={flatAreaSqFt}
                        onChange={(e) => {
                          setFlatAreaSqFt(e.target.value);
                          clearFieldError('flatAreaSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs transition focus:outline-none ${
                          fieldErrors.flatAreaSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Society Maintenance (₹/mo)</label>
                      <input
                        type="number"
                        placeholder="e.g. 4500"
                        value={flatMaintenanceFee}
                        onChange={(e) => setFlatMaintenanceFee(e.target.value)}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Clear Carpet Area (sq.ft) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.whCarpetAreaSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.whCarpetAreaSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={whCarpetAreaSqFt}
                        onChange={(e) => {
                          setWhCarpetAreaSqFt(e.target.value);
                          clearFieldError('whCarpetAreaSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.whCarpetAreaSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Clear Height (Feet) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.whClearHeightFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.whClearHeightFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 32"
                        value={whClearHeightFt}
                        onChange={(e) => {
                          setWhClearHeightFt(e.target.value);
                          clearFieldError('whClearHeightFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.whClearHeightFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Base Rent (₹/sq.ft/month) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.whBaseRentSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.whBaseRentSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 28"
                        value={whBaseRentSqFt}
                        onChange={(e) => {
                          setWhBaseRentSqFt(e.target.value);
                          clearFieldError('whBaseRentSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.whBaseRentSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Loading Docks <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.whLoadingDocks && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.whLoadingDocks}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 4"
                        value={whLoadingDocks}
                        onChange={(e) => {
                          setWhLoadingDocks(e.target.value);
                          clearFieldError('whLoadingDocks');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.whLoadingDocks
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Deposit (Months)</label>
                      <input
                        type="number"
                        placeholder="e.g. 6"
                        value={whSecurityDepositMonths}
                        onChange={(e) => setWhSecurityDepositMonths(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Lock-in (Months)</label>
                      <input
                        type="number"
                        placeholder="e.g. 36"
                        value={whLockInMonths}
                        onChange={(e) => setWhLockInMonths(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Annual Escalation %</label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={whEscalationPercent}
                        onChange={(e) => setWhEscalationPercent(e.target.value)}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Carpet Area (sq.ft) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.commCarpetSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.commCarpetSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 6500"
                        value={commCarpetSqFt}
                        onChange={(e) => {
                          setCommCarpetSqFt(e.target.value);
                          clearFieldError('commCarpetSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.commCarpetSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Base Rent (₹/sq.ft/month) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.commBaseRentSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.commBaseRentSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 95"
                        value={commBaseRentSqFt}
                        onChange={(e) => {
                          setCommBaseRentSqFt(e.target.value);
                          clearFieldError('commBaseRentSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.commBaseRentSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          CAM Charges (₹/sq.ft) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.commCamSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.commCamSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 18"
                        value={commCamSqFt}
                        onChange={(e) => {
                          setCommCamSqFt(e.target.value);
                          clearFieldError('commCamSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.commCamSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-[#eeece5]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">Workstations</label>
                        {fieldErrors.commWorkstations && (
                          <span className="text-[9px] font-bold text-rose-600">
                            {fieldErrors.commWorkstations}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 85"
                        value={commWorkstations}
                        onChange={(e) => {
                          setCommWorkstations(e.target.value);
                          clearFieldError('commWorkstations');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Car Bays</label>
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        value={commCarBays}
                        onChange={(e) => setCommCarBays(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Lock-in (Mo)</label>
                      <input
                        type="number"
                        placeholder="e.g. 36"
                        value={commLockInMonths}
                        onChange={(e) => setCommLockInMonths(e.target.value)}
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
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Bedrooms <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.villaBedrooms && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.villaBedrooms}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 4"
                        value={villaBedrooms}
                        onChange={(e) => {
                          setVillaBedrooms(e.target.value);
                          clearFieldError('villaBedrooms');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.villaBedrooms
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Built-up (sq.ft) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.villaBuiltUpSqFt && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.villaBuiltUpSqFt}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 4200"
                        value={villaBuiltUpSqFt}
                        onChange={(e) => {
                          setVillaBuiltUpSqFt(e.target.value);
                          clearFieldError('villaBuiltUpSqFt');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.villaBuiltUpSqFt
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Private Lawn (sq.ft)</label>
                      <input
                        type="number"
                        placeholder="e.g. 8500"
                        value={villaPlotSqFt}
                        onChange={(e) => setVillaPlotSqFt(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Monthly Rent / Tariff (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.villaMonthlyRent && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.villaMonthlyRent}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 125000"
                        value={villaMonthlyRent}
                        onChange={(e) => {
                          setVillaMonthlyRent(e.target.value);
                          clearFieldError('villaMonthlyRent');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.villaMonthlyRent
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#19251f]">
                          Security Deposit (₹) <span className="text-rose-600">*</span>
                        </label>
                        {fieldErrors.villaSecurityDeposit && (
                          <span className="text-[9px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            <AlertCircle className="h-2.5 w-2.5 text-rose-600 shrink-0" />
                            {fieldErrors.villaSecurityDeposit}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="e.g. 375000"
                        value={villaSecurityDeposit}
                        onChange={(e) => {
                          setVillaSecurityDeposit(e.target.value);
                          clearFieldError('villaSecurityDeposit');
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition focus:outline-none ${
                          fieldErrors.villaSecurityDeposit
                            ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/30'
                            : 'border-[#d8d6cd] text-[#19251f] focus:border-[#274235]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: IN-UNIT / TECHNICAL AMENITIES (Checklist)            */}
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
                  Select what exists directly inside this {selectedAsset.label}.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e3e1d8] space-y-3 shadow-2xs">
                {/* Dynamically Render Checklist */}
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
          {/* STEP 4: SHARED BUILDING / CAMPUS AMENITIES (Checklist)       */}
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
          {/* STEP 5: SERVICES & RULES (Clean Placeholders)                */}
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
                    <span className="text-xs font-bold text-[#19251f] block border-b border-[#eeece5] pb-2">House Rules & Curfew</span>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6e7972] uppercase">Main Gate Curfew</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {['9 PM', '10 PM', '11 PM', 'None'].map((t) => (
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
                      <label className="text-[11px] font-bold text-[#19251f]">Move-in Timings</label>
                      <input
                        type="text"
                        placeholder="e.g. Weekdays 9 AM - 6 PM only"
                        value={flatMoveInRule}
                        onChange={(e) => setFlatMoveInRule(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Society Quiet Hours</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 PM - 7 AM"
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
                    <label className="text-[11px] font-bold text-[#19251f]">CAM Charges Rate (₹/sq.ft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3.5"
                      value={whCamRateSqFt}
                      onChange={(e) => setWhCamRateSqFt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                    />
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
                    Primary HVAC billed in CAM. High-density server room power & internal light fixtures metered separately at state Discom commercial tariff.
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
                        placeholder="e.g. 12"
                        value={villaMaxGuests}
                        onChange={(e) => setVillaMaxGuests(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#d8d6cd] text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#19251f]">Outdoor Music Cutoff</label>
                      <input
                        type="text"
                        placeholder="e.g. No loud music after 10 PM"
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
                          <span>Auto-fetches Aadhaar & verified address</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[#274235] shrink-0" />
                          <span>100% government-backed & paperless</span>
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
                    <span className="text-[11px] text-amber-800">Complete Aadhaar KYC above to enable the "Create Building & Go Live" button.</span>
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
                      <h4 className="font-bold text-sm text-white tracking-tight">{propertyName || `${selectedAsset.label} Property`}</h4>
                      <p className="text-[10px] text-emerald-200/80 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{addressSearch || 'Central Location'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between bg-white border-t border-[#eeece5]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-[10px] text-[#6e7972]">
                        <span className="font-bold text-[#19251f]">{calculatedTotalUnits()} {selectedAsset.type === 'PG' ? 'beds' : 'units/bays'}</span>
                        <span>•</span>
                        <span>{city || 'Bengaluru'}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] text-[#6e7972] uppercase font-bold">RENT</span>
                        <span className="text-base font-black text-[#19251f]">
                          ₹{(selectedAsset.type === 'PG' ? (Number(pgRentPerBed) || 0) : selectedAsset.type === 'Flat' ? (Number(flatMonthlyRent) || 0) : calculatedMonthlyRent()).toLocaleString('en-IN')}
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
                    <span>1. Basics & Asset Class</span>
                    {expandedSection === 'basics' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedSection === 'basics' && (
                    <div className="px-4 pb-3 pt-1 text-[11px] text-[#4d5a52] space-y-1 bg-[#fbfbfa]">
                      <p>Property Name: <b>{propertyName || 'Not set'}</b></p>
                      <p>Class: <b>{selectedAsset.label}</b></p>
                      <p>Address: <b>{addressSearch || 'Not set'}</b></p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'inventory' ? null : 'inventory')}
                    className="w-full px-4 py-2.5 flex items-center justify-between font-bold text-[#19251f] cursor-pointer hover:bg-[#fbfbfa]"
                  >
                    <span>2. Capacity & Financials</span>
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

        {/* Modal Bottom Footer Navigation in Staywise Forest Theme */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-[#eeece5] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-full border border-[#d8d6cd] text-[#4d5a52] hover:bg-[#f4f3ef] font-bold text-xs transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCloseWithoutSaving}
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
                onClick={handleNextStep}
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
                    <span>Create Building & Go Live</span>
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
