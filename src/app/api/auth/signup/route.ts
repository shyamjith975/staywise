import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, portfolioName, city } = body;

    // Validate role: strictly Owner or EstateOS
    if (role !== 'owner' && role !== 'estate_manager') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Registration is restricted strictly to Property Owners and EstateOS Hospitality Directors.' 
        },
        { status: 403 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await db.users.findByEmail(trimmedEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const roleLabel = role === 'owner' ? 'Property Owner' : 'EstateOS & Hospitality';
    const avatar = role === 'owner' ? '👨‍💼' : '🏡';
    const portfolioTitle = portfolioName ? portfolioName.trim() : (role === 'owner' ? `${name}'s Portfolio` : `${name}'s Estate Collection`);
    const operationalCity = city ? city.trim() : 'Bangalore';

    // 1. Create and persist user account
    const user = await db.users.create({
      email: trimmedEmail,
      password,
      name: name.trim(),
      role,
      roleLabel,
      avatar,
      title: role === 'owner' ? `${portfolioTitle} Owner` : `${portfolioTitle} Director`,
      description: `${operationalCity} • Registered Asset Workspace • Escrow Bank Account Active`
    });

    // 2. Initialize starter property for this owner/host
    const propertyName = role === 'owner' 
      ? `${portfolioTitle} Residency` 
      : `${portfolioTitle} Luxury Villa`;

    const starterProperty = await db.properties.create({
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

    return NextResponse.json({
      success: true,
      message: `Account created successfully for ${user.name} (${roleLabel})`,
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
