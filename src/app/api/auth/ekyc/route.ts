import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { invalidateBootstrapCache } from '../../../../lib/cache/apiCache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = body.userId || body.email;

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'User identifier (userId or email) is required' },
        { status: 400 }
      );
    }

    const cleanAadhaar = body.aadhaarNumber ? String(body.aadhaarNumber).trim() : undefined;
    const cleanPan = body.panNumber ? String(body.panNumber).toUpperCase().trim() : undefined;

    await db.users.updateEkyc(identifier, {
      aadhaarNumber: cleanAadhaar,
      panNumber: cleanPan,
      ekycVerified: true
    });

    invalidateBootstrapCache();

    return NextResponse.json({
      success: true,
      message: 'Resident Digital KYC verified and recorded successfully in database.',
      ekycVerified: true,
      aadhaarNumber: cleanAadhaar,
      panNumber: cleanPan
    });
  } catch (error) {
    console.error('[API /api/auth/ekyc] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record eKYC in database' },
      { status: 500 }
    );
  }
}

