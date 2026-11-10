import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

/**
 * ============================================================================
 * STAYWISE PLATFORM — SECURE LOGOUT & SESSION REVOCATION (P0.2)
 * ============================================================================
 * Revokes active authentication cookies and terminates client sessions.
 * Clears:
 * - Server-side session record in SQLite (sets revoked_at timestamp)
 * - staywise_token (HTTP-only session cookie)
 * - staywise_user (Identity cookie)
 * ============================================================================
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Extract token from Authorization header or cookie
    let token: string | null = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    if (!token) {
      token = req.cookies.get('staywise_token')?.value || null;
    }

    // 2. Authoritative server-side session revocation in SQLite
    if (token) {
      try {
        await db.sessions.revoke(token);
      } catch (revErr) {
        console.warn('[Staywise Auth] Session revocation warning:', revErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Authentication session successfully revoked and expired. Logged out.'
    });

    // 1. Expire staywise_token cookie immediately
    response.cookies.set({
      name: 'staywise_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });

    // 2. Expire any supplementary cookies
    response.cookies.set({
      name: 'staywise_user',
      value: '',
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error('[API /api/auth/logout] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete logout.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Allow GET /api/auth/logout for direct browser redirects
  return POST(req);
}
