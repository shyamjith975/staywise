import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { validateReferralPayload } from '../../../lib/validation';

export async function GET() {
  try {
    const referrals = await db.referrals.findMany();
    return NextResponse.json({
      success: true,
      data: referrals,
      count: referrals.length
    });
  } catch (error) {
    console.error('[API /api/referrals GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve referral records' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    const validation = validateReferralPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.errors[0]?.message || 'Invalid referral payload',
          validationErrors: validation.errors 
        },
        { status: 400 }
      );
    }

    const created = await db.referrals.create(validation.sanitizedData!);

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Referral created successfully.'
    }, { status: 201 });
  } catch (error) {
    console.error('[API /api/referrals POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create referral record' },
      { status: 500 }
    );
  }
}
