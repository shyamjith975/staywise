import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { paymentMethod, amount } = body;

    const result = await db.invoices.pay(
      id, 
      paymentMethod || 'UPI', 
      amount ? Number(amount) : undefined
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
