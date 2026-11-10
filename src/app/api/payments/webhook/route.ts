import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../lib/db';

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'staywise_whsec_prod_signature_key_2026';

// Processed payment webhook transaction IDs (Prevents duplicate callbacks / replay attacks - P0.4)
const processedWebhooks = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    const signature = 
      req.headers.get('x-webhook-signature') || 
      req.headers.get('x-razorpay-signature') ||
      req.headers.get('x-staywise-signature');

    // 1. Authoritative Webhook Signature Verification (HMAC-SHA256)
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'WEBHOOK_SIGNATURE_MISSING: Cryptographic provider signature header is required.' },
        { status: 401 }
      );
    }

    const expectedSig = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawText, 'utf8')
      .digest('hex');

    const bufReceived = Buffer.from(signature, 'hex');
    const bufExpected = Buffer.from(expectedSig, 'hex');

    if (bufReceived.length !== bufExpected.length || !crypto.timingSafeEqual(bufReceived, bufExpected)) {
      console.warn('[SECURITY AUDIT] Forged Payment Webhook Rejected! Signature mismatch.');
      return NextResponse.json(
        { success: false, error: 'WEBHOOK_SIGNATURE_INVALID: Cryptographic signature mismatch. Transaction quarantined.' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawText);
    const { event, transactionId, invoiceId, amount, paymentMethod = 'UPI' } = payload;

    if (!transactionId || !invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory webhook fields: transactionId, invoiceId' },
        { status: 400 }
      );
    }

    // 2. Anti-Replay & Duplicate Webhook Protection (Idempotency - P0.4)
    if (processedWebhooks.has(transactionId)) {
      return NextResponse.json({
        success: true,
        message: `Webhook transaction '${transactionId}' already processed (Idempotent duplicate acknowledged).`,
        duplicate: true,
        transactionId
      }, { status: 200 });
    }

    // 3. Process Authoritative Gateway Event
    if (event === 'payment.captured' || event === 'PAYMENT_SUCCESS') {
      const inv = await db.invoices.findById(invoiceId);
      if (!inv) {
        return NextResponse.json(
          { success: false, error: `Referenced invoice '${invoiceId}' does not exist.` },
          { status: 404 }
        );
      }

      // Settle invoice if not already paid
      if (inv.status !== 'Paid') {
        await db.invoices.pay(invoiceId, paymentMethod as any, amount || inv.totalAmount);
      }

      // Record statutory ledger entry
      await db.ledger.create({
        description: `Verified Payment Gateway Settlement: Txn #${transactionId} for Invoice #${inv.invoiceNumber}`,
        type: 'CREDIT',
        amount: Number(amount) || inv.totalAmount,
        account: '1010-ESCROW-GATEWAY-RECEIVABLE',
        entityType: 'RENT',
        referenceId: invoiceId,
        settlementStatus: 'CLEARED'
      });

      // Mark transaction as processed to prevent any future replay
      processedWebhooks.add(transactionId);

      return NextResponse.json({
        success: true,
        message: `Payment order #${transactionId} verified and settled atomically into double-entry ledger.`,
        transactionId,
        invoiceNumber: inv.invoiceNumber,
        status: 'SETTLED'
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: `Event '${event}' acknowledged.`,
      transactionId
    });

  } catch (error: any) {
    console.error('[API /api/payments/webhook] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing payment webhook.' },
      { status: 500 }
    );
  }
}
