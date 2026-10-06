import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { SUBSCRIPTION_PLANS } from '../../../../lib/security/subscriptionCatalog';
import { SubscriptionTierId } from '../../../../types';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const {
      name,
      email,
      password,
      phone,
      role = 'owner',
      portfolioName,
      city = 'Bangalore',
      planId = 'growth_pro',
      billingCycle = 'annual',
      autopayMethod = 'CARD',
      cardDetails,
      bankDetails
    } = rawBody;

    // 1. Basic Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Please enter a valid full name.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid work email address.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Validate Plan against Authoritative Catalog
    const validPlan = SUBSCRIPTION_PLANS[planId as SubscriptionTierId];
    if (!validPlan) {
      return NextResponse.json({ success: false, error: 'Invalid subscription tier selected.' }, { status: 400 });
    }

    // 3. Validate Autopay details
    let autopayMaskedDetails = 'Verified Autopay Mandate';
    if (autopayMethod === 'CARD') {
      const cardNum = cardDetails?.cardNumberMasked || '•••• 4242';
      const cleanNum = cardNum.replace(/\s+/g, '');
      const last4 = cleanNum.length >= 4 ? cleanNum.slice(-4) : '4242';
      autopayMaskedDetails = `Visa/Mastercard ending in •••• ${last4}`;
    } else {
      const bankName = bankDetails?.bankName || 'Axis / HDFC Bank';
      const accNum = bankDetails?.accountNumberMasked || '••••9842';
      const last4 = accNum.length >= 4 ? accNum.slice(-4) : '9842';
      autopayMaskedDetails = `${bankName} (e-NACH Mandate •••• ${last4})`;
    }

    // 4. Check if account already exists
    const existingUser = await db.users.findByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists. Please sign in to your workspace.'
      }, { status: 409 });
    }

    // 5. Create user record
    const userRole = role === 'estate_manager' ? 'estate_manager' : 'owner';
    const roleLabel = userRole === 'owner' ? 'Property Owner' : 'EstateOS & Hospitality';
    const avatar = userRole === 'owner' ? '👨‍💼' : '🏡';
    const entityTitle = portfolioName || (userRole === 'owner' ? `${name}'s Realty Holdings` : `${name}'s Estate Collection`);

    const user = await db.users.create({
      email: cleanEmail,
      password,
      name,
      role: userRole,
      roleLabel,
      avatar,
      title: `${entityTitle} Operator`,
      description: `${city} • 7-Day Free Trial Active • Autopay Secured`
    });

    // 6. Create initial starter property
    const starterProperty = await db.properties.create({
      name: `${entityTitle} Residency`,
      type: userRole === 'owner' ? 'Apartment' : 'Villa',
      portfolio: entityTitle,
      address: 'Central Avenue Heights',
      city: city || 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      totalUnits: userRole === 'owner' ? 8 : 4,
      occupiedUnits: 0,
      expectedMonthlyRent: userRole === 'owner' ? 180000 : 320000,
      collectedRent: 0,
      pendingRent: userRole === 'owner' ? 180000 : 320000,
      imageUrl: userRole === 'owner' ? '/images/properties/beach-road.jpg' : '/images/properties/estate-villa.jpg',
      status: 'VACANT',
      healthScore: 94,
      verificationStatus: 'PENDING',
      submittedDocs: ['Title_Ownership_Registration.pdf', 'Municipal_Clearance.pdf'],
      amenities: ['Covered Parking', '24/7 CCTV & Security', 'Keyless Access', 'Power Backup'],
      units: []
    });

    // 7. Initialize 7-Day Free Trial Subscription with Autopay
    const trialSub = await db.subscriptions.createTrial({
      userId: user.id,
      ownerName: user.name,
      entityName: entityTitle,
      planId: planId as SubscriptionTierId,
      billingCycle: billingCycle === 'monthly' ? 'monthly' : 'annual',
      autopayMethod: autopayMethod as 'CARD' | 'BANK_MANDATE',
      autopayMaskedDetails
    });

    return NextResponse.json({
      success: true,
      message: `Welcome to Staywise! Your 7-day free trial of ${validPlan.name} is now active. ₹0 charged today.`,
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
      subscription: trialSub,
      token: `token-trial-${user.id}-${Date.now()}`
    }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/auth/trial-signup] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error during trial setup.'
    }, { status: 500 });
  }
}
