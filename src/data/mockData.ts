import { 
  Property, 
  Tenant, 
  RentInvoice, 
  LedgerEntry, 
  MaintenanceTicket, 
  Lead, 
  EstateAsset, 
  StaffMember, 
  UtilityReading, 
  AIInsight,
  PGBed,
  PGRoom,
  PGMealPlan,
  CommercialUnit,
  CAMExpenseItem,
  CommercialVisitor,
  MoveFlowChecklistItem,
  DepositSettlementDispute,
  TenantReferralItem,
  MoneyLeakAlert,
  VacancyCostReport,
  PropertyPassportData,
  TenantPassportData
} from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-beach-road',
    name: 'Beach Road Apartments',
    type: 'Apartment',
    portfolio: 'Kozhikode Coastal',
    address: 'Beach Road, Near Old Light House',
    city: 'Kozhikode',
    state: 'Kerala',
    pincode: '673032',
    totalUnits: 12,
    occupiedUnits: 11,
    expectedMonthlyRent: 480000,
    collectedRent: 430000,
    pendingRent: 50000,
    imageUrl: '/images/properties/beach-road.jpg',
    status: 'ACTIVE',
    healthScore: 92,
    verificationStatus: 'APPROVED',
    submittedDocs: ['Title_Deed_Kozhikode_Reg.pdf', 'Fire_Safety_NOC_2026.pdf', 'Bescom_Tariff_Card.pdf'],
    amenities: ['Sea View', 'Covered Parking', 'Elevator', '24/7 Security', 'Generator Backup', 'Rooftop Infinity Deck'],
    units: [
      { id: 'unit-101', propertyId: 'prop-beach-road', unitNumber: '101', floor: 1, type: '2 BHK', rentAmount: 25000, depositAmount: 75000, status: 'OCCUPIED', currentTenantId: 't-1', currentTenantName: 'Rahul Menon', leaseEnd: '2027-03-31', areaSqFt: 1250, bedrooms: 2, bathrooms: 2 },
      { id: 'unit-102', propertyId: 'prop-beach-road', unitNumber: '102', floor: 1, type: '2 BHK', rentAmount: 25000, depositAmount: 75000, status: 'OCCUPIED', currentTenantId: 't-2', currentTenantName: 'Ananya Pillai', leaseEnd: '2027-06-30', areaSqFt: 1250, bedrooms: 2, bathrooms: 2 },
      { id: 'unit-201', propertyId: 'prop-beach-road', unitNumber: '201', floor: 2, type: '3 BHK Sea View', rentAmount: 38000, depositAmount: 114000, status: 'OCCUPIED', currentTenantId: 't-3', currentTenantName: 'Dr. Faisal Ahmed', leaseEnd: '2026-12-31', areaSqFt: 1800, bedrooms: 3, bathrooms: 3 },
      { id: 'unit-302', propertyId: 'prop-beach-road', unitNumber: '302', floor: 3, type: '2 BHK Luxury', rentAmount: 25000, depositAmount: 75000, status: 'OCCUPIED', currentTenantId: 't-shyam', currentTenantName: 'Shyam Sundar', leaseEnd: '2027-12-31', areaSqFt: 1350, bedrooms: 2, bathrooms: 2 },
      { id: 'unit-304', propertyId: 'prop-beach-road', unitNumber: '304', floor: 3, type: '2 BHK Sea View', rentAmount: 26000, depositAmount: 78000, status: 'VACANT', areaSqFt: 1300, bedrooms: 2, bathrooms: 2 },
    ]
  },
  {
    id: 'prop-hillview-heights',
    name: 'Hillview Heights Residency',
    type: 'Apartment',
    portfolio: 'Trivandrum Heights',
    address: 'Cliff View Road, Kowdiar',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695003',
    totalUnits: 6,
    occupiedUnits: 0,
    expectedMonthlyRent: 180000,
    collectedRent: 0,
    pendingRent: 0,
    imageUrl: '/images/properties/beach-road.jpg',
    status: 'VACANT',
    healthScore: 89,
    verificationStatus: 'PENDING',
    submittedDocs: ['Title_Deed_Kowdiar_2026.pdf', 'Panchayat_Occupancy_Cert.pdf', 'Fire_Safety_Clearance.pdf'],
    amenities: ['Clubhouse', 'Solar Grid', '24/7 Security'],
    units: [
      { id: 'unit-h1', propertyId: 'prop-hillview-heights', unitNumber: '101', floor: 1, type: '2 BHK', rentAmount: 30000, depositAmount: 90000, status: 'VACANT', areaSqFt: 1200, bedrooms: 2, bathrooms: 2 }
    ]
  },
  {
    id: 'prop-wayanad-villa',
    name: 'Serene Mist Estate Villa',
    type: 'Estate',
    portfolio: 'Wayanad Hill Retreats',
    address: 'Vythiri Estate Road, Tea Valley',
    city: 'Wayanad',
    state: 'Kerala',
    pincode: '673576',
    totalUnits: 1,
    occupiedUnits: 1,
    expectedMonthlyRent: 150000,
    collectedRent: 150000,
    pendingRent: 0,
    imageUrl: '/images/properties/estate-villa.jpg',
    status: 'ACTIVE',
    healthScore: 96,
    amenities: ['Private Infinity Pool', 'Solar Grid', 'Organic Plantation', 'Servant Quarters', 'Gated Perimeter', 'High-Speed Starlink'],
    units: [
      { id: 'unit-main-estate', propertyId: 'prop-wayanad-villa', unitNumber: 'Private Estate', floor: 1, type: 'Luxury Villa 5BHK', rentAmount: 150000, depositAmount: 450000, status: 'OCCUPIED', currentTenantId: 't-nri', currentTenantName: 'Vikram & Maya Singhania', leaseEnd: '2028-05-15', areaSqFt: 5400, bedrooms: 5, bathrooms: 6 }
    ]
  },
  {
    id: 'prop-infovision',
    name: 'Infovision Commercial Hub',
    type: 'Commercial',
    portfolio: 'Kochi Commercial',
    address: 'Cyber Park Road, Kakkanad',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682030',
    totalUnits: 8,
    occupiedUnits: 7,
    expectedMonthlyRent: 610000,
    collectedRent: 590000,
    pendingRent: 20000,
    imageUrl: '/images/properties/tech-park.jpg',
    status: 'PARTIALLY_OCCUPIED',
    healthScore: 88,
    amenities: ['Central HVAC', '100% DG Backup', 'CAM Management', 'High-Speed Elevators', 'Visitor Parking', 'BMS Automation'],
    units: [
      { id: 'unit-c101', propertyId: 'prop-infovision', unitNumber: 'Suite 101', floor: 1, type: 'Retail Showroom', rentAmount: 85000, depositAmount: 300000, status: 'OCCUPIED', currentTenantName: 'BlueFin Capital', leaseEnd: '2028-01-31', areaSqFt: 2200, bedrooms: 0, bathrooms: 2 },
      { id: 'unit-c201', propertyId: 'prop-infovision', unitNumber: 'Floor 2 Tech Wing', floor: 2, type: 'IT Office Space', rentAmount: 220000, depositAmount: 800000, status: 'OCCUPIED', currentTenantName: 'AeroSys Technologies', leaseEnd: '2029-08-31', areaSqFt: 4800, bedrooms: 0, bathrooms: 4 },
      { id: 'unit-c304', propertyId: 'prop-infovision', unitNumber: 'Suite 304', floor: 3, type: 'Executive Suite', rentAmount: 45000, depositAmount: 150000, status: 'VACANT', areaSqFt: 1100, bedrooms: 0, bathrooms: 1 }
    ]
  },
  {
    id: 'prop-urban-pg',
    name: 'Staywise Urban PG & Co-living',
    type: 'PG',
    portfolio: 'Bangalore Student & Tech Hub',
    address: 'Koramangala 4th Block, 80ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    totalUnits: 120, // 120 beds across 3 floors
    occupiedUnits: 97,
    expectedMonthlyRent: 840000,
    collectedRent: 790000,
    pendingRent: 50000,
    imageUrl: '/images/properties/beach-road.jpg',
    status: 'ACTIVE',
    healthScore: 94,
    amenities: ['High-Speed Wi-Fi', '3x Meals Included', 'Housekeeping', 'Biometric Access', 'Sub-meter Power', 'Rooftop Lounge'],
    units: [
      { id: 'unit-pg-101', propertyId: 'prop-urban-pg', unitNumber: 'Room 101 (2-Sharing)', floor: 1, type: 'Double Sharing AC', rentAmount: 24000, depositAmount: 48000, status: 'OCCUPIED', currentTenantName: 'Aditya & Varun', areaSqFt: 280, bedrooms: 1, bathrooms: 1 },
      { id: 'unit-pg-102', propertyId: 'prop-urban-pg', unitNumber: 'Room 102 (Single)', floor: 1, type: 'Private Suite', rentAmount: 18000, depositAmount: 36000, status: 'OCCUPIED', currentTenantName: 'Karthik Rao', areaSqFt: 180, bedrooms: 1, bathrooms: 1 },
      { id: 'unit-pg-201', propertyId: 'prop-urban-pg', unitNumber: 'Room 201 (4-Sharing)', floor: 2, type: 'Dorm Quad', rentAmount: 32000, depositAmount: 64000, status: 'PARTIALLY_OCCUPIED', currentTenantName: 'Rohan, Dev + 2 Vacant', areaSqFt: 360, bedrooms: 1, bathrooms: 2 }
    ]
  },
  {
    id: 'prop-cochin-logistics',
    name: 'Cochin Port Logistics Park',
    type: 'Warehouse',
    portfolio: 'Kochi Commercial',
    address: 'Vallarpadam Terminal Expressway',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682504',
    totalUnits: 4,
    occupiedUnits: 3,
    expectedMonthlyRent: 420000,
    collectedRent: 420000,
    pendingRent: 0,
    imageUrl: '/images/properties/tech-park.jpg',
    status: 'ACTIVE',
    healthScore: 91,
    amenities: ['12m Clear Height', '4x Loading Bays', 'Fire Sprinkler NFPA', 'Heavy Truck Parking', '24/7 Security CCTV', 'Weighbridge'],
    units: [
      { id: 'unit-wh-a', propertyId: 'prop-cochin-logistics', unitNumber: 'Bay A (FMCG Storage)', floor: 1, type: 'Grade A Warehouse', rentAmount: 140000, depositAmount: 560000, status: 'OCCUPIED', currentTenantName: 'QuickLogistics India', areaSqFt: 7000, bedrooms: 0, bathrooms: 2 },
      { id: 'unit-wh-b', propertyId: 'prop-cochin-logistics', unitNumber: 'Bay B (Cold Storage Unit)', floor: 1, type: 'Temperature Controlled', rentAmount: 160000, depositAmount: 640000, status: 'OCCUPIED', currentTenantName: 'OceanFresh Seafoods', areaSqFt: 6500, bedrooms: 0, bathrooms: 2 },
      { id: 'unit-wh-c', propertyId: 'prop-cochin-logistics', unitNumber: 'Bay C (Dry Cargo)', floor: 1, type: 'Open Storage Zone', rentAmount: 120000, depositAmount: 480000, status: 'VACANT', areaSqFt: 6000, bedrooms: 0, bathrooms: 1 }
    ]
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't-shyam',
    name: 'Shyam Sundar',
    email: 'shyam.sundar@example.com',
    phone: '+91 98460 21980',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '302',
    monthlyRent: 25000,
    depositPaid: 75000,
    leaseStart: '2024-01-01',
    leaseEnd: '2027-12-31',
    rentDueDate: 5,
    salaryDate: 10,
    autopayActive: true,
    reliabilityScore: 87,
    kycVerified: true,
    rewardsBalance: 1250,
    emergencyContact: 'Lakshmi Sundar (+91 94471 88201)'
  },
  {
    id: 't-1',
    name: 'Rahul Menon',
    email: 'rahul.menon@techcorp.in',
    phone: '+91 98950 33411',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '101',
    monthlyRent: 25000,
    depositPaid: 75000,
    leaseStart: '2024-04-01',
    leaseEnd: '2027-03-31',
    rentDueDate: 5,
    autopayActive: false,
    reliabilityScore: 92,
    kycVerified: true,
    rewardsBalance: 2100,
    emergencyContact: 'Deepak Menon (+91 98470 11992)'
  },
  {
    id: 't-2',
    name: 'Ananya Pillai',
    email: 'ananya.p@designstudio.org',
    phone: '+91 97455 60122',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '102',
    monthlyRent: 25000,
    depositPaid: 75000,
    leaseStart: '2024-07-01',
    leaseEnd: '2027-06-30',
    rentDueDate: 5,
    autopayActive: true,
    reliabilityScore: 96,
    kycVerified: true,
    rewardsBalance: 3400,
    emergencyContact: 'Radha Pillai (+91 94960 55110)'
  }
];

export const INITIAL_INVOICES: RentInvoice[] = [
  {
    id: 'inv-oct-302',
    invoiceNumber: 'STW-2026-10-302',
    tenantId: 't-shyam',
    tenantName: 'Shyam Sundar',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '302',
    period: 'October 2026',
    baseRent: 25000,
    camCharges: 2500,
    utilityCharges: 1200,
    totalAmount: 28700,
    paidAmount: 0,
    dueDate: '2026-10-05',
    status: 'Due'
  },
  {
    id: 'inv-sep-302',
    invoiceNumber: 'STW-2026-09-302',
    tenantId: 't-shyam',
    tenantName: 'Shyam Sundar',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '302',
    period: 'September 2026',
    baseRent: 25000,
    camCharges: 2500,
    utilityCharges: 1100,
    totalAmount: 28600,
    paidAmount: 28600,
    dueDate: '2026-09-05',
    status: 'Paid',
    paymentMethod: 'UPI',
    paidDate: '2026-09-04',
    transactionId: 'UPI-774920198421'
  },
  {
    id: 'inv-oct-101',
    invoiceNumber: 'STW-2026-10-101',
    tenantId: 't-1',
    tenantName: 'Rahul Menon',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '101',
    period: 'October 2026',
    baseRent: 25000,
    camCharges: 2500,
    lateFee: 500,
    totalAmount: 28000,
    paidAmount: 0,
    dueDate: '2026-09-25',
    status: 'Overdue'
  },
  {
    id: 'inv-oct-102',
    invoiceNumber: 'STW-2026-10-102',
    tenantId: 't-2',
    tenantName: 'Ananya Pillai',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '102',
    period: 'October 2026',
    baseRent: 25000,
    camCharges: 2500,
    totalAmount: 27500,
    paidAmount: 27500,
    dueDate: '2026-10-05',
    status: 'Paid',
    paymentMethod: 'Autopay',
    paidDate: '2026-10-01',
    transactionId: 'ACH-AUTO-889104'
  }
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'ledg-001',
    timestamp: '2026-10-01 09:15 AM',
    description: 'Rent Collection - Unit 102 (Ananya Pillai)',
    type: 'CREDIT',
    amount: 27500,
    account: 'Client Escrow / Axis Clearing',
    entityType: 'RENT',
    referenceId: 'STW-2026-10-102',
    settlementStatus: 'CLEARED'
  },
  {
    id: 'ledg-002',
    timestamp: '2026-09-29 02:40 PM',
    description: 'Vendor Payout - RapidCool AC Services (Beach Road Unit 201)',
    type: 'DEBIT',
    amount: 2500,
    account: 'Property Maintenance Operating Wallet',
    entityType: 'MAINTENANCE',
    referenceId: 'WO-2026-881',
    settlementStatus: 'CLEARED'
  },
  {
    id: 'ledg-003',
    timestamp: '2026-09-28 11:00 AM',
    description: 'Owner Settlement - Wayanad Estate September Net Yield',
    type: 'DEBIT',
    amount: 142000,
    account: 'HDFC Escrow Disbursement',
    entityType: 'SETTLEMENT',
    referenceId: 'SETTLE-WY-09',
    settlementStatus: 'RECONCILED'
  },
  {
    id: 'ledg-004',
    timestamp: '2026-09-25 04:30 PM',
    description: 'Security Deposit Held - Unit 302 Escrow Retention',
    type: 'CREDIT',
    amount: 75000,
    account: 'Statutory Tenant Deposit Trust',
    entityType: 'SECURITY_DEPOSIT',
    referenceId: 'DEP-302-SHYAM',
    settlementStatus: 'CLEARED'
  }
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'TKT-8841',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '302',
    tenantName: 'Shyam Sundar',
    category: 'AC',
    title: 'Master Bedroom AC cooling efficiency drop',
    description: 'The Daikin 1.5T inverter AC is blowing room-temperature air. Indoor fan is operational, compressor may need coolant recharge.',
    priority: 'Medium',
    status: 'Scheduled',
    estimatedCost: 1800,
    requiresOwnerApproval: false, // Under 2000 threshold -> Auto approved
    vendorId: 'v-cool',
    vendorName: 'RapidCool Aircon Services',
    createdAt: '2026-09-29',
    scheduledDate: '2026-10-02 (Tomorrow 3:00 PM)'
  },
  {
    id: 'tkt-002',
    ticketNumber: 'TKT-8842',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '201',
    tenantName: 'Dr. Faisal Ahmed',
    category: 'Plumbing',
    title: 'Main bathroom concealed pipe leakage',
    description: 'Water seepage visible on adjacent bedroom wall. Requires acoustic pipe inspection and tile restoration.',
    priority: 'Emergency',
    status: 'Triaged',
    estimatedCost: 4500,
    requiresOwnerApproval: true, // Above 2000 threshold -> Owner approval required
    ownerApproved: false,
    createdAt: '2026-09-30'
  },
  {
    id: 'tkt-003',
    ticketNumber: 'TKT-8839',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitNumber: '101',
    tenantName: 'Rahul Menon',
    category: 'Electrical',
    title: 'Balcony water heater circuit breaker tripping',
    description: 'Replaced burnt 20A MCB and tested insulation resistance. Unit fully restored.',
    priority: 'High',
    status: 'Completed',
    estimatedCost: 1200,
    actualCost: 1150,
    requiresOwnerApproval: false,
    vendorName: 'Apex Spark Electricals',
    createdAt: '2026-09-27',
    completedAt: '2026-09-28',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Kavita Nambiar',
    phone: '+91 94470 99211',
    email: 'kavita.n@hdfcbank.com',
    preferredArea: 'Beach Road / West Hill',
    budgetMin: 24000,
    budgetMax: 28000,
    moveInUrgency: 'Immediate',
    scoreCategory: 'Hot',
    scoreExplanation: 'Budget matches Unit 304 (₹26K), corporate banking employment verified, requested immediate viewing.',
    stage: 'Visit Scheduled',
    propertyInterest: 'Beach Road Apartments — Unit 304',
    source: 'Staywise Direct Listing',
    createdAt: '2026-09-28',
    assignedAgent: 'Arjun Das (Leasing Mgr)',
    visitDate: '2026-10-01 at 05:00 PM'
  },
  {
    id: 'lead-2',
    name: 'Siddharth Varma',
    phone: '+91 98471 22340',
    email: 'sid.varma@startup.co',
    preferredArea: 'Cyber Park / Kakkanad',
    budgetMin: 40000,
    budgetMax: 50000,
    moveInUrgency: 'Within 15 Days',
    scoreCategory: 'Hot',
    scoreExplanation: 'Looking for Infovision Suite 304. GST registered firm, ready with 6 months advance.',
    stage: 'Contacted',
    propertyInterest: 'Infovision Commercial Hub — Suite 304',
    source: 'Website Organic',
    createdAt: '2026-09-29',
    assignedAgent: 'Arjun Das (Leasing Mgr)'
  },
  {
    id: 'lead-3',
    name: 'Gautam Ramachandran',
    phone: '+91 99951 88712',
    email: 'gautam.r@gmail.com',
    preferredArea: 'Beach Road',
    budgetMin: 20000,
    budgetMax: 22000,
    moveInUrgency: 'Next Month',
    scoreCategory: 'Warm',
    scoreExplanation: 'Budget slightly below asking (₹26K), flexible move-in date.',
    stage: 'New',
    propertyInterest: 'Beach Road Apartments',
    source: 'WhatsApp Referral',
    createdAt: '2026-09-30',
    assignedAgent: 'Arjun Das (Leasing Mgr)'
  }
];

export const INITIAL_ESTATE_ASSETS: EstateAsset[] = [
  {
    id: 'ast-01',
    name: 'Kohler 45kVA Silent Diesel Generator',
    tag: 'GEN-WY-01',
    category: 'Generator',
    estateName: 'Serene Mist Estate Villa',
    purchaseDate: '2023-04-10',
    warrantyUntil: '2026-04-10',
    amcProvider: 'Kerala Diesel Power Corp',
    lastService: '2026-08-15',
    nextService: '2026-11-15',
    condition: 'Excellent'
  },
  {
    id: 'ast-02',
    name: 'Enphase 15kW Microinverter Solar Rooftop',
    tag: 'SLR-WY-02',
    category: 'Solar System',
    estateName: 'Serene Mist Estate Villa',
    purchaseDate: '2023-01-20',
    warrantyUntil: '2033-01-20',
    amcProvider: 'SunGrid Kerala Solutions',
    lastService: '2026-09-10',
    nextService: '2026-12-10',
    condition: 'Excellent'
  },
  {
    id: 'ast-03',
    name: 'Pentair Commercial Pool Filtration & Ozone Pump',
    tag: 'PMP-WY-03',
    category: 'Water Pump',
    estateName: 'Serene Mist Estate Villa',
    purchaseDate: '2023-06-05',
    warrantyUntil: '2025-06-05',
    amcProvider: 'AquaTech Wayanad',
    lastService: '2026-07-20',
    nextService: '2026-10-10',
    condition: 'Needs Service'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'stf-1', name: 'Manoj Kumar', role: 'Caretaker', estateName: 'Serene Mist Estate Villa', phone: '+91 94470 12389', shift: 'Full-time', attendanceStatus: 'Present', monthlySalary: 28000 },
  { id: 'stf-2', name: 'Vijayan Nair', role: 'Security', estateName: 'Serene Mist Estate Villa', phone: '+91 98461 44521', shift: 'Night', attendanceStatus: 'Present', monthlySalary: 18000 },
  { id: 'stf-3', name: 'Selvaraj M.', role: 'Gardener', estateName: 'Serene Mist Estate Villa', phone: '+91 97450 88123', shift: 'Morning', attendanceStatus: 'Present', monthlySalary: 16000 },
  { id: 'stf-4', name: 'Sunil K.', role: 'Electrician', estateName: 'Beach Road Apartments', phone: '+91 94960 77124', shift: 'Morning', attendanceStatus: 'Present', monthlySalary: 24000 }
];

export const INITIAL_UTILITIES: UtilityReading[] = [
  { id: 'ut-1', utilityType: 'Electricity', estateName: 'Serene Mist Estate Villa', meterNumber: 'KSEB-WY-88910', previousReading: 14210, currentReading: 15480, consumptionUnit: 'kWh', billAmount: 11430, readingDate: '2026-09-28', paymentStatus: 'Paid' },
  { id: 'ut-2', utilityType: 'Solar Grid', estateName: 'Serene Mist Estate Villa', meterNumber: 'SLR-NET-2201', previousReading: 8900, currentReading: 10420, consumptionUnit: 'Units Exported', billAmount: -4560, readingDate: '2026-09-28', paymentStatus: 'Paid' },
  { id: 'ut-3', utilityType: 'Generator Fuel', estateName: 'Serene Mist Estate Villa', meterNumber: 'DG-TANK-45KVA', previousReading: 220, currentReading: 180, consumptionUnit: 'Litres Remaining', billAmount: 3800, readingDate: '2026-09-30', paymentStatus: 'Pending' }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    category: 'URGENT',
    title: '₹35,000 Overdue Rent Detected',
    description: 'Rahul Menon (Beach Road #101) is 6 days overdue. WhatsApp reminder can be dispatched automatically.',
    impactAmount: 35000,
    actionText: 'Dispatch WhatsApp Reminder',
    actionPayload: 'REMIND_OVERDUE'
  },
  {
    id: 'ins-2',
    category: 'VACANCY',
    title: 'Unit 304 Vacancy Loss Mitigation',
    description: 'Unit 304 has been vacant for 8 days (est. lost rent: ₹6,930). 1 Hot Lead (Kavita Nambiar) is scheduled to visit today at 5:00 PM.',
    impactAmount: 26000,
    actionText: 'View Visit Schedule',
    actionPayload: 'NAV_LEADS'
  },
  {
    id: 'ins-3',
    category: 'MAINTENANCE',
    title: 'Owner Approval Required for Ticket #8842',
    description: 'Emergency plumbing quote for Unit 201 exceeds ₹2,000 budget threshold (₹4,500). Quick approval needed.',
    impactAmount: 4500,
    actionText: 'Review & 1-Click Approve',
    actionPayload: 'APPROVE_TICKET_8842'
  },
  {
    id: 'ins-4',
    category: 'FINANCIAL',
    title: 'Upcoming Lease Expiry in 90 Days',
    description: 'Dr. Faisal Ahmed (#201) lease expires on 31 Dec 2026. Recommended 6% escalation brings rent to ₹40,280/mo.',
    actionText: 'Generate Renewal Notice',
    actionPayload: 'RENEW_LEASE_201'
  }
];

// ----------------------------------------------------
// PG / SHARED LIVING MOCK DATA (Sections 4-11)
// ----------------------------------------------------
export const INITIAL_PG_BEDS: PGBed[] = [
  { id: 'bed-101-a', bedCode: 'R101-A', roomId: 'room-101', roomNumber: '101', floor: 1, sharingType: '2-Sharing', status: 'Occupied', monthlyRent: 12000, deposit: 24000, tenantId: 'pg-t1', tenantName: 'Rohan Verma', tenantPhone: '+91 98410 11200', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-101-b', bedCode: 'R101-B', roomId: 'room-101', roomNumber: '101', floor: 1, sharingType: '2-Sharing', status: 'Occupied', monthlyRent: 12000, deposit: 24000, tenantId: 'pg-t2', tenantName: 'Aditya V.', tenantPhone: '+91 98410 11201', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-102-a', bedCode: 'R102-A', roomId: 'room-102', roomNumber: '102', floor: 1, sharingType: '2-Sharing', status: 'Occupied', monthlyRent: 12000, deposit: 24000, tenantId: 'pg-t3', tenantName: 'Shyam Nair', tenantPhone: '+91 97420 55102', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-102-b', bedCode: 'R102-B', roomId: 'room-102', roomNumber: '102', floor: 1, sharingType: '2-Sharing', status: 'Available', monthlyRent: 12000, deposit: 24000, ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-103-a', bedCode: 'R103-A', roomId: 'room-103', roomNumber: '103', floor: 1, sharingType: '2-Sharing', status: 'Notice Given', monthlyRent: 12000, deposit: 24000, tenantId: 'pg-t4', tenantName: 'Sanjay Krishnan', tenantPhone: '+91 98950 44103', noticeGivenDate: '2026-09-20', expectedVacantDate: '2026-10-20', ac: true, attachedBath: false, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-103-b', bedCode: 'R103-B', roomId: 'room-103', roomNumber: '103', floor: 1, sharingType: '2-Sharing', status: 'Cleaning', monthlyRent: 12000, deposit: 24000, expectedVacantDate: '2026-10-03', ac: true, attachedBath: false, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-201-a', bedCode: 'R201-A', roomId: 'room-201', roomNumber: '201', floor: 2, sharingType: '4-Sharing', status: 'Occupied', monthlyRent: 8000, deposit: 16000, tenantId: 'pg-t5', tenantName: 'Priya Menon', tenantPhone: '+91 97410 33201', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-201-b', bedCode: 'R201-B', roomId: 'room-201', roomNumber: '201', floor: 2, sharingType: '4-Sharing', status: 'Occupied', monthlyRent: 8000, deposit: 16000, tenantId: 'pg-t6', tenantName: 'Dev Roy', tenantPhone: '+91 97410 33202', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-201-c', bedCode: 'R201-C', roomId: 'room-201', roomNumber: '201', floor: 2, sharingType: '4-Sharing', status: 'Available', monthlyRent: 8000, deposit: 16000, ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-201-d', bedCode: 'R201-D', roomId: 'room-201', roomNumber: '201', floor: 2, sharingType: '4-Sharing', status: 'Reserved', monthlyRent: 8000, deposit: 16000, tenantName: 'Aakash G. (Starts Oct 5)', ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-202-a', bedCode: 'R202-A', roomId: 'room-202', roomNumber: '202', floor: 2, sharingType: '2-Sharing', status: 'Maintenance', monthlyRent: 12000, deposit: 24000, ac: true, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true },
  { id: 'bed-304-a', bedCode: 'R304-A', roomId: 'room-304', roomNumber: '304', floor: 3, sharingType: 'Single', status: 'Available', monthlyRent: 16500, deposit: 33000, ac: false, attachedBath: true, foodIncluded: true, wifiIncluded: true, laundryIncluded: true }
];

export const INITIAL_PG_ROOMS: PGRoom[] = [
  { id: 'room-101', propertyId: 'prop-urban-pg', roomNumber: '101', floor: 1, sharingType: '2-Sharing', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-101'), electricitySplitMethod: 'Submeter', submeterReading: 248, roomRentTotal: 18000 },
  { id: 'room-102', propertyId: 'prop-urban-pg', roomNumber: '102', floor: 1, sharingType: '2-Sharing', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-102'), electricitySplitMethod: 'Submeter', submeterReading: 312, roomRentTotal: 24000 },
  { id: 'room-103', propertyId: 'prop-urban-pg', roomNumber: '103', floor: 1, sharingType: '2-Sharing', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-103'), electricitySplitMethod: 'Submeter', submeterReading: 218, roomRentTotal: 24000 },
  { id: 'room-201', propertyId: 'prop-urban-pg', roomNumber: '201', floor: 2, sharingType: '4-Sharing', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-201'), electricitySplitMethod: 'Room-level', submeterReading: 189, roomRentTotal: 32000 },
  { id: 'room-202', propertyId: 'prop-urban-pg', roomNumber: '202', floor: 2, sharingType: '2-Sharing', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-202'), electricitySplitMethod: 'Equal', roomRentTotal: 24000 },
  { id: 'room-304', propertyId: 'prop-urban-pg', roomNumber: '304', floor: 3, sharingType: 'Single', beds: INITIAL_PG_BEDS.filter(b => b.roomId === 'room-304'), electricitySplitMethod: 'Submeter', submeterReading: 0, roomRentTotal: 16500 }
];

export const INITIAL_PG_MEALS: PGMealPlan[] = [
  { id: 'meal-1', date: 'Today', mealType: 'Breakfast', menu: 'Idli, Medu Vada, Sambar & Coconut Chutney + Tea/Coffee', vendor: 'Annapoorna Kitchens', optedInCount: 88, costPerMeal: 45 },
  { id: 'meal-2', date: 'Today', mealType: 'Lunch', menu: 'Rice, Dal Makhani, Paneer Butter Masala, Roti, Curd', vendor: 'Annapoorna Kitchens', optedInCount: 64, costPerMeal: 75 },
  { id: 'meal-3', date: 'Today', mealType: 'Dinner', menu: 'Chapati, Malabar Veg Kurma / Chicken Curry, Jeera Rice, Salad', vendor: 'Annapoorna Kitchens', optedInCount: 92, costPerMeal: 80 }
];

// ----------------------------------------------------
// COMMERCIAL & CAM MOCK DATA (Sections 12-21)
// ----------------------------------------------------
export const INITIAL_COMMERCIAL_UNITS: CommercialUnit[] = [
  {
    id: 'comm-101',
    propertyId: 'prop-infovision',
    unitNumber: 'Suite 101',
    floor: 1,
    businessName: 'BlueFin Capital Advisors',
    businessType: 'Financial Services & Wealth Mgmt',
    areaSqFt: 2200,
    baseRent: 85000,
    camRatePerSqFt: 18,
    camAmount: 39600,
    parkingSlots: 4,
    lockInPeriodMonths: 36,
    noticePeriodMonths: 6,
    escalationPercent: 5,
    fitOutStatus: 'Ready for Opening',
    status: 'Occupied'
  },
  {
    id: 'comm-201',
    propertyId: 'prop-infovision',
    unitNumber: 'Floor 2 Tech Wing',
    floor: 2,
    businessName: 'AeroSys Technologies Pvt Ltd',
    businessType: 'Aerospace Embedded Software',
    areaSqFt: 4800,
    baseRent: 220000,
    camRatePerSqFt: 18,
    camAmount: 86400,
    parkingSlots: 10,
    lockInPeriodMonths: 60,
    noticePeriodMonths: 6,
    escalationPercent: 7.5,
    fitOutStatus: 'Ready for Opening',
    status: 'Occupied'
  },
  {
    id: 'comm-301',
    propertyId: 'prop-infovision',
    unitNumber: 'Suite 301',
    floor: 3,
    businessName: 'NexGen Cloud Solutions',
    businessType: 'SaaS Development',
    areaSqFt: 1600,
    baseRent: 65000,
    camRatePerSqFt: 18,
    camAmount: 28800,
    parkingSlots: 3,
    lockInPeriodMonths: 24,
    noticePeriodMonths: 3,
    escalationPercent: 5,
    fitOutStatus: 'Electrical & Interiors',
    status: 'Fit-out'
  },
  {
    id: 'comm-304',
    propertyId: 'prop-infovision',
    unitNumber: 'Suite 304',
    floor: 3,
    businessName: 'Available for Lease',
    businessType: 'Office / Clinic / Studio',
    areaSqFt: 1100,
    baseRent: 45000,
    camRatePerSqFt: 18,
    camAmount: 19800,
    parkingSlots: 2,
    lockInPeriodMonths: 24,
    noticePeriodMonths: 3,
    escalationPercent: 5,
    fitOutStatus: 'Not Applicable',
    status: 'Vacant'
  }
];

export const INITIAL_CAM_EXPENSES: CAMExpenseItem[] = [
  { id: 'cam-1', category: 'Security', monthlyCost: 48000, allocationMethod: 'Area-based', vendorName: 'Apex Security Force' },
  { id: 'cam-2', category: 'Housekeeping', monthlyCost: 32000, allocationMethod: 'Area-based', vendorName: 'CleanCorp Facilities' },
  { id: 'cam-3', category: 'Lift AMC', monthlyCost: 18500, allocationMethod: 'Area-based', vendorName: 'Otis Elevator AMC' },
  { id: 'cam-4', category: 'Generator Diesel', monthlyCost: 28000, allocationMethod: 'Area-based', vendorName: 'Kirloskar Power Backup' },
  { id: 'cam-5', category: 'Common Electricity', monthlyCost: 22400, allocationMethod: 'Area-based', vendorName: 'KSEB Common Meter' },
  { id: 'cam-6', category: 'Water Tanker', monthlyCost: 12000, allocationMethod: 'Area-based', vendorName: 'Cochin Municipal Supply' },
  { id: 'cam-7', category: 'Fire Safety', monthlyCost: 9500, allocationMethod: 'Fixed', vendorName: 'Safeguard Fire Systems AMC' }
];

export const INITIAL_COMMERCIAL_VISITORS: CommercialVisitor[] = [
  { id: 'vis-1', visitorName: 'Sameer Qureshi', hostCompany: 'AeroSys Technologies', purpose: 'Client Technical Review', vehicleNumber: 'KL-07-CD-4421', checkInTime: '10:15 AM', status: 'Checked In', passCode: 'PASS-8921' },
  { id: 'vis-2', visitorName: 'Deepa Natarajan', hostCompany: 'BlueFin Capital', purpose: 'Auditor Verification', vehicleNumber: 'KL-07-BZ-1980', checkInTime: '11:00 AM', status: 'Checked In', passCode: 'PASS-8922' },
  { id: 'vis-3', visitorName: 'Mahesh Pillai', hostCompany: 'NexGen Cloud', purpose: 'Vendor Delivery', vehicleNumber: 'KL-07-ET-7712', checkInTime: '09:30 AM', checkOutTime: '10:45 AM', status: 'Checked Out', passCode: 'PASS-8919' }
];

// ----------------------------------------------------
// MOVEFLOW, DISPUTES & PASSPORTS (Sections 27-35)
// ----------------------------------------------------
export const INITIAL_MOVEFLOW_CHECKLIST: MoveFlowChecklistItem[] = [
  { id: 'mf-1', title: 'Schedule Pre-Move Inspection with Caretaker', category: 'Moving', completed: true, dueDate: '05 Oct 2026' },
  { id: 'mf-2', title: 'Compare Certified Movers & Packers (Staywise Partner Discount 15%)', category: 'Moving', completed: true, dueDate: '08 Oct 2026', servicePartner: 'Agarwal Safe Movers', cost: 12500 },
  { id: 'mf-3', title: 'Deep Cleaning & Sanitization Service', category: 'Cleaning', completed: false, dueDate: '12 Oct 2026', servicePartner: 'UrbanClap Staywise Verified', cost: 3500 },
  { id: 'mf-4', title: 'Sub-meter Electricity & Water Reading Handover', category: 'Utilities', completed: false, dueDate: '14 Oct 2026' },
  { id: 'mf-5', title: 'Broadband / Wi-Fi Transfer to New Residence', category: 'Utilities', completed: false, dueDate: '15 Oct 2026', servicePartner: 'JioFiber Home Connect' },
  { id: 'mf-6', title: 'Smart Escrow Deposit Settlement & Key Return', category: 'Deposit', completed: false, dueDate: '16 Oct 2026' },
  { id: 'mf-7', title: 'Find My Next Home: Browse Verified Staywise Portfolio Inventory', category: 'Next Home', completed: true, dueDate: 'Immediate' }
];

export const INITIAL_DEPOSIT_DISPUTES: DepositSettlementDispute[] = [
  {
    id: 'disp-101',
    propertyId: 'prop-beach-road',
    propertyName: 'Beach Road Apartments',
    unitOrBed: 'Unit 204',
    tenantName: 'Harish Varma',
    depositPaid: 75000,
    deductions: [
      { id: 'ded-1', item: 'Wall Touch-up & Repainting (Scuffs in Master Bedroom)', amount: 6500, timestamp: '01 Oct 2026 14:30', evidenceUrl: '#' },
      { id: 'ded-2', item: 'Unpaid BESCOM Sub-meter Units (140 kWh)', amount: 1190, timestamp: '01 Oct 2026 14:32', evidenceUrl: '#' },
      { id: 'ded-3', item: 'Deep Cleaning & Balcony Scrubbing', amount: 2500, timestamp: '01 Oct 2026 14:35', evidenceUrl: '#' }
    ],
    proposedRefund: 64810,
    disputedAmount: 4000,
    tenantNotes: 'Tenant contends wall repainting was normal wear-and-tear after 3-year tenancy. Requesting 50% split on painting fee.',
    status: 'Disputed'
  }
];

export const INITIAL_REFERRALS: TenantReferralItem[] = [
  { id: 'ref-1', referralCode: 'SW-SHYAM-123', referredName: 'Pranav Menon', propertyType: 'Apartment (Unit 102)', rewardAmount: 2500, status: 'Converted', date: '15 Sep 2026' },
  { id: 'ref-2', referralCode: 'SW-SHYAM-123', referredName: 'Naveen Joseph', propertyType: 'PG Bed (Urban PG #101)', rewardAmount: 1000, status: 'Pending', date: '28 Sep 2026' }
];

export const SAMPLE_PROPERTY_PASSPORT: PropertyPassportData = {
  passportId: 'PASSPORT-PROP-BR-8921',
  propertyId: 'prop-beach-road',
  propertyName: 'Beach Road Apartments',
  digitalIdentityNumber: 'IN-KL-KZK-2024-REG-00918',
  establishedYear: 2021,
  ownershipType: 'Clear Freehold Title (Verified)',
  complianceCertificates: ['Fire NOC 2026', 'Structural Safety Audit', 'Lift License (Otis)', 'Pollution Control Consent'],
  maintenanceLogCount: 47,
  lifetimeOccupancyRate: 94.6,
  historicalRoi: 8.8
};

export const SAMPLE_TENANT_PASSPORT: TenantPassportData = {
  passportId: 'PASSPORT-TEN-SS-9901',
  tenantName: 'Shyam Sundar',
  verifiedKyc: true,
  trustScore: 98,
  onTimePaymentPercent: 100,
  stayHistoryCount: 3,
  referenceRating: 4.9,
  reusableIdentityCard: 'VERIFIED-RESIDENT-GOLD'
};

// ----------------------------------------------------
// PORTFOLIO INTELLIGENCE & LEAKS (Sections 38-46)
// ----------------------------------------------------
export const INITIAL_MONEY_LEAKS: MoneyLeakAlert[] = [
  {
    id: 'leak-1',
    title: 'High Vacancy Duration on Unit 304',
    assetName: 'Beach Road Apartments #304',
    leakCategory: 'High Vacancy',
    estimatedLoss: 18200,
    recommendation: 'Unit vacant for 21 days. Market demand in Kozhikode Beach Road is high; consider reducing asking price by ₹1,500 or highlighting sea-view photos.',
    severity: 'High'
  },
  {
    id: 'leak-2',
    title: 'Under-Recovered CAM Charges in Tech Wing',
    assetName: 'Infovision Commercial Hub',
    leakCategory: 'Under-recovered CAM',
    estimatedLoss: 14200,
    recommendation: 'Actual common electricity & DG fuel exceeded CAM billed by 12%. Apply revised ₹20/sq.ft CAM adjustment clause on next quarter billing.',
    severity: 'Medium'
  },
  {
    id: 'leak-3',
    title: '3 Unallocated Reserved Parking Slots',
    assetName: 'Infovision Commercial Hub',
    leakCategory: 'Unused Parking',
    estimatedLoss: 9000,
    recommendation: 'Slots B-12, B-14, B-15 are unleased. Offer commercial monthly subscription to AeroSys Technologies for ₹3,000/slot.',
    severity: 'Low'
  },
  {
    id: 'leak-4',
    title: 'Sub-meter Water Pump Consumption Spike',
    assetName: 'Serene Mist Estate Villa',
    leakCategory: 'Utility Spike',
    estimatedLoss: 6400,
    recommendation: 'Daily pump run hours spiked from 2.5 hrs to 6.1 hrs. Potential subterranean pipe leak detected near plantation irrigation line.',
    severity: 'High'
  }
];

export const INITIAL_VACANCY_COSTS: VacancyCostReport[] = [
  { id: 'vac-1', unitOrBed: 'Unit 304 (2 BHK Sea View)', assetName: 'Beach Road Apartments', assetCategory: 'residential', daysVacant: 21, monthlyRent: 26000, estimatedLostRent: 18200, actionStatus: 'Lead Matched' },
  { id: 'vac-2', unitOrBed: 'Bed R201-C (Quad Dorm)', assetName: 'Staywise Urban PG', assetCategory: 'shared_living', daysVacant: 12, monthlyRent: 8000, estimatedLostRent: 3200, actionStatus: 'Marketed' },
  { id: 'vac-3', unitOrBed: 'Suite 304 (Executive Office)', assetName: 'Infovision Commercial Hub', assetCategory: 'commercial', daysVacant: 45, monthlyRent: 45000, estimatedLostRent: 67500, actionStatus: 'Priced' },
  { id: 'vac-4', unitOrBed: 'Bay C (Dry Cargo Zone)', assetName: 'Cochin Port Logistics Park', assetCategory: 'commercial', daysVacant: 30, monthlyRent: 120000, estimatedLostRent: 120000, actionStatus: 'Cleaning' }
];

