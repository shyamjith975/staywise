import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateSignupPayload } from '../../../../lib/validation';
import { UserRole } from '../../../../types';
import { createSessionToken } from '../../../../lib/security/auth';

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

    const { name, email, password, phone, role, portfolioName, city, propertyId, unitNumber, subscriptionPlan, billingCycle } = validation.sanitizedData!;

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

    // 4. Role specific onboarding workflows:
    // Newly onboarded users start with a clean slate (0 properties, 0 mock data).
    // Initialize Trial Subscription for Owner if role is owner or estate_manager
    if (role === 'owner' || role === 'estate_manager') {
      try {
        await db.subscriptions.createTrial({
          userId: user.id,
          ownerName: user.name,
          entityName: `${user.name} Asset Holdings`,
          planId: subscriptionPlan || 'starter',
          billingCycle: billingCycle || 'monthly',
          autopayMethod: 'CARD',
          autopayMaskedDetails: '•••• 4242'
        });
      } catch (subErr) {
        console.warn('Subscription trial init skipped:', subErr);
      }
    }

    const session = createSessionToken(user.id, user.role, user.email);

    const response = NextResponse.json({
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
      token: session.token,
      expiresAt: session.expiresAt
    }, { status: 201 });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'staywise_token',
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 48 * 60 * 60 // 48 hours
    });

    return response;
  } catch (error) {
    console.error('[API /api/auth/signup] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
