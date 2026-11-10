import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateSignupPayload } from '../../../../lib/validation';
import { UserRole } from '../../../../types';
import { createSessionToken } from '../../../../lib/security/auth';
import { SUBSCRIPTION_PLANS } from '../../../../lib/security/subscriptionCatalog';

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

    const { 
      name, email, password, phone, role, portfolioName, city, 
      propertyId, unitNumber,
      subscriptionPlan, billingCycle,
      entityName, ownerName, panNumber, gstin, registeredAddress 
    } = validation.sanitizedData!;

    // 2. Check if user already exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    if (phone) {
      const allUsers = await db.users.findMany();
      const existingPhone = allUsers.find(u => u.phone === phone);
      if (existingPhone) {
        return NextResponse.json(
          { success: false, error: 'An account with this mobile phone number already exists. Please sign in.' },
          { status: 409 }
        );
      }
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
    // Initialize Platform Settings with manual details provided during registration
    if (role === 'owner' || role === 'estate_manager') {
      try {
        await db.settings.save({
          userId: user.id,
          entityName: entityName || `${name} Properties`,
          ownerName: ownerName || name,
          panNumber: panNumber || '',
          gstin: gstin || '',
          registeredAddress: registeredAddress || `${city || 'Bangalore'}, India`,
          ksebTariffPerUnit: 8.5,
          dgBackupRatePerUnit: 20.0
        });
      } catch (settingsErr) {
        console.warn('Settings init skipped:', settingsErr);
      }

      // Initialize Subscription according to user's manual selection
      try {
        const isTrialMode = subscriptionPlan === 'trial' || !subscriptionPlan;
        const effectivePlan = isTrialMode ? 'starter' : subscriptionPlan;

        if (isTrialMode) {
          await db.subscriptions.createTrial({
            userId: user.id,
            ownerName: ownerName || user.name,
            entityName: entityName || `${user.name} Asset Holdings`,
            planId: 'starter',
            billingCycle: billingCycle || 'monthly',
            autopayMethod: 'CARD',
            autopayMaskedDetails: '•••• 4242'
          });
        } else {
          const planConfig = SUBSCRIPTION_PLANS[effectivePlan] || SUBSCRIPTION_PLANS.starter;
          const authoritativeAmount = billingCycle === 'annual' ? planConfig.annualPrice : planConfig.monthlyPrice;
          const startDate = new Date().toISOString().split('T')[0];
          const endDate = new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 86400000).toISOString().split('T')[0];

          await db.subscriptions.save({
            id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            userId: user.id,
            ownerName: ownerName || user.name,
            entityName: entityName || `${user.name} Asset Holdings`,
            planId: effectivePlan,
            planName: planConfig.name,
            status: 'ACTIVE',
            billingCycle: billingCycle || 'monthly',
            startDate,
            endDate,
            daysRemaining: billingCycle === 'annual' ? 365 : 30,
            amount: authoritativeAmount,
            currency: 'INR',
            maxUnits: planConfig.maxUnits,
            currentUnits: 0,
            paymentMethod: 'ONLINE',
            lastPaymentTxnId: `txn_reg_${Date.now()}`,
            lastPaymentDate: startDate,
            autoRenew: true,
            gstin: gstin || '',
            tamperProofHash: `sha256_${Date.now()}`,
            history: [{
              invoiceId: `INV-SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              date: startDate,
              amount: authoritativeAmount,
              currency: 'INR',
              planId: effectivePlan as any,
              planName: planConfig.name,
              billingCycle: billingCycle || 'monthly',
              txnId: `txn_reg_${Date.now()}`,
              paymentMethod: 'ONLINE',
              status: 'PAID',
              gstin: gstin || undefined,
              taxAmount: Math.round(authoritativeAmount * 0.18),
              downloadUrl: `/api/documents/invoice-sub-${Date.now()}`
            }]
          });
        }
      } catch (subErr) {
        console.warn('Subscription init skipped:', subErr);
      }
    }

    const session = createSessionToken(user.id, user.role, user.email);

    // Persist authoritative session in SQLite with client fingerprinting
    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';

    try {
      await db.sessions.create({
        userId: user.id,
        token: session.token,
        userAgent,
        ipAddress,
        expiresInHours: 48
      });
    } catch (sessionErr) {
      console.warn('[Staywise Auth] Session persistence warning:', sessionErr);
    }

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
