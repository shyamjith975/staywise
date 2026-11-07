import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateLoginPayload } from '../../../../lib/validation';
import { 
  createSessionToken, 
  checkLoginLockout, 
  recordLoginFailure, 
  recordLoginSuccess 
} from '../../../../lib/security/auth';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // 1. Rigorous input validation & sanitization
    const validation = validateLoginPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.errors[0]?.message || 'Invalid login payload',
          validationErrors: validation.errors
        },
        { status: 400 }
      );
    }

    const { email, password, role } = validation.sanitizedData!;

    // 2. Progressive Brute-Force Account Lockout Check (P0.2)
    if (email) {
      const lockout = checkLoginLockout(email);
      if (lockout.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: `ACCOUNT_LOCKED: Too many consecutive failed login attempts. Account is locked for ${lockout.remainingMinutes} minutes to protect your assets. Please retry later or request a password reset.`,
            code: 'ACCOUNT_LOCKED',
            remainingMinutes: lockout.remainingMinutes
          },
          { status: 429 }
        );
      }
    }

    // 3. Authenticate
    let user = null;
    if (email && password) {
      user = await db.users.authenticate(email, password);
      if (!user) {
        const fail = recordLoginFailure(email);
        const warning = fail.isLocked
          ? 'Account has now been locked for 15 minutes due to 5 failed attempts.'
          : `${fail.remainingAttempts} attempts remaining before temporary account lockout.`;

        return NextResponse.json(
          { 
            success: false, 
            error: `Invalid email or password. ${warning}`,
            attemptsRemaining: fail.remainingAttempts,
            isLocked: fail.isLocked
          },
          { status: 401 }
        );
      }

      // Reset failed attempt counter on success
      recordLoginSuccess(email);
    } else if (role) {
      // Role-based demo switcher: strictly map to canonical demo accounts
      // In strict production mode, unauthenticated demo switching is disallowed
      if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_LOGIN !== 'true') {
        return NextResponse.json(
          { success: false, error: 'Password authentication is strictly required in production.' },
          { status: 403 }
        );
      }

      const CANONICAL_DEMO_EMAILS: Record<string, string> = {
        owner: 'owner@staywise.com',
        tenant: 'tenant@staywise.com',
        manager: 'manager@staywise.com',
        vendor: 'vendor@staywise.com',
        admin: 'admin@staywise.com',
        estate_manager: 'estate@staywise.com'
      };
      const canonicalEmail = CANONICAL_DEMO_EMAILS[role];
      if (canonicalEmail) {
        user = await db.users.findByEmail(canonicalEmail);
      }
      if (!user) {
        const allUsers = await db.users.findMany();
        user = allUsers.find(u => u.role === role) || null;
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      );
    }

    // 4. Generate HMAC-SHA256 authenticated session token
    const session = createSessionToken(user.id, user.role, user.email);

    // 5. Construct response with HTTP-only session cookie
    const response = NextResponse.json({
      success: true,
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
    });

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
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
