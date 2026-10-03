import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Check by email and password if provided
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
