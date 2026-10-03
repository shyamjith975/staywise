import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

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
    const body = await req.json();
    const { referralCode, referredName, propertyType, rewardAmount, status } = body;

    if (!referralCode || !referredName) {
      return NextResponse.json(
        { success: false, error: 'Referral code and referred person name are required.' },
        { status: 400 }
      );
    }

    const created = await db.referrals.create({
      referralCode: referralCode.toUpperCase().trim(),
      referredName: referredName.trim(),
      propertyType: propertyType || 'Residential Apartment',
      rewardAmount: Number(rewardAmount) || 2000,
      status: status || 'Pending'
    });

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
