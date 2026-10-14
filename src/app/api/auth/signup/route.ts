import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateSignupPayload } from '../../../../lib/validation';
import { UserRole } from '../../../../types';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Rigorous input validation & sanitization
    const validation = validateSignupPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.errors[0]?.message || 'Validation failed on registration form.',
          validationErrors: validation.errors 
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role, portfolioName, city, propertyId, unitNumber } = validation.sanitizedData!;

    // 2. Check if user already exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Role-specific presentation metadata
    const ROLE_METADATA: Record<UserRole, { roleLabel: string; avatar: string; title: string; desc: string }> = {
      owner: {
        roleLabel: 'Property Owner',
        avatar: '👨‍💼',
        title: `${portfolioName || `${name}'s Portfolio`} Owner`,
        desc: `${city || 'Bangalore'} • Registered Asset Workspace • Escrow Bank Account Active`
      },
      tenant: {
        roleLabel: 'Tenant / Resident',
        avatar: '👨‍🎓',
        title: unitNumber ? `Resident • Unit ${unitNumber}` : 'Resident • Verified Tenant',
        desc: `${city || 'Bangalore'} • Digital Lease Active`
      },
      manager: {
        roleLabel: 'Property Manager',
        avatar: '🧑‍💻',
        title: 'Operations & Field Manager',
        desc: 'Triage Queue • Multi-Portfolio Operations'
      },
      vendor: {
        roleLabel: 'Service Vendor',
        avatar: '🔧',
        title: 'Certified Service Contractor',
        desc: 'Escrow Payouts Connected • Verified KYC'
      },
      estate_manager: {
        roleLabel: 'EstateOS & Hospitality',
        avatar: '🏡',
        title: `${portfolioName || `${name}'s Estate Collection`} Director`,
        desc: `${city || 'Bangalore'} • Luxury Villas & Smart Check-in`
      },
      admin: {
        roleLabel: 'Super Admin',
        avatar: '🛡️',
        title: 'Platform Governance & Risk',
        desc: 'Statutory Double-Entry Ledger Surveillance'
      }
    };

    const meta = ROLE_METADATA[role] || ROLE_METADATA.owner;

    // 3. Create and persist user account to SQLite database
    const user = await db.users.create({
      email,
      password,
      name,
      role,
      roleLabel: meta.roleLabel,
      avatar: meta.avatar,
      title: meta.title,
      description: meta.desc,
      phone
    });

    let starterProperty = null;
    let tenantRecord = null;

    // 4. Role specific onboarding workflows:
    if (role === 'owner' || role === 'estate_manager') {
      const portfolioTitle = portfolioName || (role === 'owner' ? `${name}'s Portfolio` : `${name}'s Estate Collection`);
      const operationalCity = city || 'Bangalore';
      const propertyName = role === 'owner' ? `${portfolioTitle} Residency` : `${portfolioTitle} Luxury Villa`;

      starterProperty = await db.properties.create({
        ownerId: user.id,
        name: propertyName,
        type: role === 'owner' ? 'Apartment' : 'Villa',
        portfolio: portfolioTitle,
        address: 'Central Commercial Boulevard',
        city: operationalCity,
        state: 'Karnataka',
        pincode: '560001',
        totalUnits: role === 'owner' ? 6 : 4,
        occupiedUnits: 0,
        expectedMonthlyRent: role === 'owner' ? 150000 : 280000,
        collectedRent: 0,
        pendingRent: role === 'owner' ? 150000 : 280000,
        imageUrl: role === 'owner' ? '/images/properties/beach-road.jpg' : '/images/properties/luxury-estate.jpg',
        status: 'VACANT',
        healthScore: 92,
        verificationStatus: 'PENDING',
        submittedDocs: [
          'Title_Deed_Ownership_Registration.pdf',
          'Municipal_Building_Permit_2026.pdf',
          'Fire_Safety_NOC_Clearance.pdf'
        ],
        amenities: [
          'Covered Parking',
          '24/7 Security & CCTV',
          'Solar Rooftop Grid',
          'Smart Access Keyless Entry'
        ],
        units: []
      });

      // Initialize Trial Subscription for Owner
      try {
        await db.subscriptions.createTrial({
          userId: user.id,
          ownerName: user.name,
          entityName: `${user.name} Asset Holdings`,
          planId: 'growth_pro',
          billingCycle: 'annual',
          autopayMethod: 'CARD',
          autopayMaskedDetails: '•••• 4242'
        });
      } catch (subErr) {
        console.warn('Subscription trial init skipped:', subErr);
      }
    } else if (role === 'tenant') {
      // If propertyId & unitNumber provided, link tenant
      const targetPropId = propertyId || 'prop-beach-road';
      const targetUnit = unitNumber || '101';
      const prop = await db.properties.findById(targetPropId);

      tenantRecord = await db.tenants.create({
        id: `t-${user.id}`,
        name: user.name,
        email: user.email,
        phone: phone || '+91 98000 00000',
        propertyId: targetPropId,
        propertyName: prop ? prop.name : 'Staywise Residency',
        unitNumber: targetUnit,
        monthlyRent: 25000,
        depositPaid: 50000,
        leaseStart: new Date().toISOString().split('T')[0],
        leaseEnd: '2027-09-30',
        rentDueDate: 5,
        autopayActive: true,
        reliabilityScore: 100,
        kycVerified: true,
        rewardsBalance: 500,
        emergencyContact: 'Primary Family Contact'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Account created successfully for ${user.name} (${meta.roleLabel}) in SQLite database.`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        roleLabel: user.roleLabel,
        avatar: user.avatar,
        title: user.title,
        description: user.description
      },
      property: starterProperty,
      tenant: tenantRecord,
      token: `token-${user.id}-${Date.now()}`
    }, { status: 201 });
  } catch (error) {
    console.error('[API /api/auth/signup] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
