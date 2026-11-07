import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { validateInfluencerOfferPayload } from '../../../lib/validation';

export async function GET() {
  try {
    const offers = await db.influencerOffers.findMany();
    return NextResponse.json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    console.error('[API /api/influencer-offers] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch influencer offers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    const validation = validateInfluencerOfferPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.errors[0]?.message || 'Invalid campaign payload',
          validationErrors: validation.errors 
        },
        { status: 400 }
      );
    }

    const newOffer = await db.influencerOffers.create(validation.sanitizedData!);
    return NextResponse.json({ success: true, data: newOffer }, { status: 201 });
  } catch (error) {
    console.error('[API /api/influencer-offers] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create influencer offer' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Offer ID is required' }, { status: 400 });
    }
    const toggled = await db.influencerOffers.toggleStatus(id);
    return NextResponse.json({ success: true, data: toggled });
  } catch (error) {
    console.error('[API /api/influencer-offers] PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle offer status' }, { status: 500 });
  }
}
