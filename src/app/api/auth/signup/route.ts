import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateSignupPayload } from '../../../../lib/validation';

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

    const { name, email, password, phone, role, portfolioName, city } = validation.sanitizedData!;

    // 2. Check if user already exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const roleLabel = role === 'owner' ? 'Property Owner' : 'EstateOS & Hospitality';
    const avatar = role === 'owner' ? '👨‍💼' : '🏡';
    const portfolioTitle = portfolioName || (role === 'owner' ? `${name}'s Portfolio` : `${name}'s Estate Collection`);
    const operationalCity = city || 'Bangalore';

    // 3. Create and persist user account
    const user = await db.users.create({
      email,
      password,
      name,
      role,
      roleLabel,
      avatar,
      title: role === 'owner' ? `${portfolioTitle} Owner` : `${portfolioTitle} Director`,
      description: `${operationalCity} • Registered Asset Workspace • Escrow Bank Account Active`
    });

    // 4. Initialize starter property for this owner/host
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
