import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { validateLoginPayload } from '../../../../lib/validation';

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

    // 2. Authenticate
    let user = null;
    if (email && password) {
      user = await db.users.authenticate(email, password);
    } else if (role) {
      // Role-based demo switcher support
      const allUsers = await db.users.findMany();
      user = allUsers.find(u => u.role === role) || null;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Return sanitized user profile (password stripped)
    return NextResponse.json({
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
      token: `token-${user.id}-${Date.now()}`
    });
  } catch (error) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
