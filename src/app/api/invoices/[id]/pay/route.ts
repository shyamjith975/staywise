import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { validatePaymentPayload } from '../../../../../lib/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rawBody = await req.json();

    // 1. Rigorous input validation & sanitization
    const validation = validatePaymentPayload(rawBody);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.errors[0]?.message || 'Invalid payment parameters',
          validationErrors: validation.errors 
        },
        { status: 400 }
      );
    }

    const { paymentMethod, amount } = validation.sanitizedData!;

    const result = await db.invoices.pay(
      id, 
      paymentMethod as any, 
      amount
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rent payment processed and recorded in statutory double-entry ledger',
      data: result
    });
  } catch (error) {
    console.error('[API /api/invoices/[id]/pay] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}
