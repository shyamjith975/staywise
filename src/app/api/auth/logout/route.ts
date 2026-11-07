import { NextRequest, NextResponse } from 'next/server';

/**
 * ============================================================================
 * STAYWISE PLATFORM — SECURE LOGOUT & SESSION REVOCATION (P0.2)
 * ============================================================================
 * Revokes active authentication cookies and terminates client sessions.
 * Clears:
 * - staywise_token (HTTP-only session cookie)
 * - staywise_user (Identity cookie)
 * ============================================================================
 */

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Authentication session successfully revoked. Logged out.'
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
