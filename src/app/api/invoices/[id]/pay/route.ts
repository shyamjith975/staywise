import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { validatePaymentPayload } from '../../../../../lib/validation';

/**
 * ============================================================================
 * STAYWISE PLATFORM — SECURE RENT INVOICE SETTLEMENT ENDPOINT
 * ============================================================================
 * Hardened against Burp Suite / OWASP API3 Parameter Tampering attacks.
 * 
 * SECURITY SPECIFICATIONS:
 * 1. Authoritative Pricing: The unpaid balance is looked up directly in the 
 *    statutory database. The server NEVER trusts client-supplied amounts.
 * 2. Tampering Interception: If an attacker intercepts the request in Burp Suite
 *    and modifies `amount: 1` or `amount: 0.01`, the system detects the anomaly,
 *    logs a security audit alert, and responds with HTTP 422 Unprocessable Entity.
 * 3. Double-Settlement Defense: Settling an already-paid invoice returns HTTP 409.
 * ============================================================================
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rawBody = await req.json();

    // 1. Rigorous input validation & schema sanitization
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

    // 2. Fetch authoritative invoice from persistent database
    const inv = await db.invoices.findById(id);
    if (!inv) {
      return NextResponse.json(
        { success: false, error: `Invoice '${id}' was not found in system.` },
        { status: 404 }
      );
    }

    // 3. Prevent double-spending / duplicate settlements
    if (inv.status === 'Paid') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVOICE_ALREADY_SETTLED: This invoice has already been cleared in the statutory ledger.',
          invoiceNumber: inv.invoiceNumber,
          settledDate: inv.paidDate
        },
        { status: 409 }
      );
    }

    // 4. White-Hat Defense: Detect Burp Suite Price Tampering
    const authoritativeDue = inv.totalAmount - (inv.paidAmount || 0);
    if (amount !== undefined && amount !== null) {
      if (Math.abs(amount - authoritativeDue) > 0.01 && Math.abs(amount - inv.totalAmount) > 0.01) {
        console.warn(
          `[SECURITY AUDIT] Burp Suite Parameter Tampering Blocked! ` +
          `Invoice ID: ${id}, Authoritative: ₹${authoritativeDue}, Intercepted/Tampered: ₹${amount}`
        );

        return NextResponse.json(
          {
            success: false,
            error: 'SECURITY VIOLATION: Payment parameter tampering detected. Attempted amount does not match authoritative invoice balance.',
            securityAlert: {
              threat: 'BURP_SUITE_PRICE_TAMPERING',
              authoritativeDue,
              attemptedTamperedAmount: amount,
              action: 'TRANSACTION_QUARANTINED',
              timestamp: new Date().toISOString()
            }
          },
          { status: 422 }
        );
      }
    }

    // 5. Execute authoritative settlement in database
    const result = await db.invoices.pay(
      id, 
      paymentMethod as any, 
      authoritativeDue
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rent payment processed securely and recorded in statutory double-entry ledger',
      securityVerified: true,
      data: result
    });
  } catch (error: any) {
    if (error.message === 'PRICE_TAMPERING_DETECTED') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SECURITY VIOLATION: Price tampering detected by database integrity guard.' 
        }, 
        { status: 422 }
      );
    }
    if (error.message === 'ALREADY_PAID') {
      return NextResponse.json(
        { success: false, error: 'Invoice has already been paid.' }, 
        { status: 409 }
      );
    }
    console.error('[API /api/invoices/[id]/pay] POST Error:', error);
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}
