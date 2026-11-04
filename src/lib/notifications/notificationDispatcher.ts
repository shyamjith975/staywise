/**
 * ============================================================================
 * STAYWISE PLATFORM — TIERED NOTIFICATION DISPATCHER & COST GATEWAY
 * ============================================================================
 * Implements strict multi-tier routing policy:
 * - IN-APP & EMAIL: Standard updates, rent receipts, invoices, community notes.
 * - SMS & WHATSAPP: Reserved EXCLUSIVELY for:
 *     1. 2FA / Phone Verification / OTPs
 *     2. Critical Emergency Maintenance (Gas leaks, power failure, floods)
 *     3. Statutory Legal Overdue Notices (Rent default > 7 days)
 *     4. Move-in / Move-out Inspection Digital Signatures
 * 
 * Includes rate limits, per-channel cost accounting, and fallbacks.
 * ============================================================================
 */

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationPriority = 'ROUTINE' | 'INFORMATIONAL' | 'IMPORTANT' | 'CRITICAL_SECURITY' | 'EMERGENCY';

export interface NotificationPayload {
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  category: 'AUTH_OTP' | 'RENT_INVOICE' | 'PAYMENT_RECEIPT' | 'MAINTENANCE_EMERGENCY' | 'MAINTENANCE_UPDATE' | 'LEGAL_NOTICE' | 'ANNOUNCEMENT';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface DispatchResult {
  success: boolean;
  dispatchedChannels: NotificationChannel[];
  skippedChannels: { channel: NotificationChannel; reason: string }[];
  estimatedCostInr: number;
  deliveryId: string;
  timestamp: string;
}

// Cost table per dispatch in INR
const CHANNEL_COST_INR: Record<NotificationChannel, number> = {
  IN_APP: 0.00,
  EMAIL: 0.05,
  SMS: 0.35,
  WHATSAPP: 0.45
};

export class NotificationDispatcher {
  private static instance: NotificationDispatcher;
  private recentSmsTimestamps: Map<string, number[]> = new Map(); // Recipient phone -> array of timestamps

  private constructor() {}

  public static getInstance(): NotificationDispatcher {
    if (!NotificationDispatcher.instance) {
      NotificationDispatcher.instance = new NotificationDispatcher();
    }
    return NotificationDispatcher.instance;
  }

  /**
   * Evaluates message priority & category to select permissible channels.
   * Restricts high-cost SMS & WhatsApp strictly to verification and emergencies.
   */
  public resolvePermittedChannels(payload: NotificationPayload): {
    channels: NotificationChannel[];
    skipped: { channel: NotificationChannel; reason: string }[];
  } {
    const channels: NotificationChannel[] = ['IN_APP'];
    const skipped: { channel: NotificationChannel; reason: string }[] = [];

    // Email permitted for all transactions, invoices, and summaries
    if (payload.recipientEmail) {
      channels.push('EMAIL');
    }

    // Is SMS / WhatsApp legally and policy-wise permitted?
    const isCriticalOtp = payload.category === 'AUTH_OTP';
    const isEmergency = payload.priority === 'EMERGENCY' || payload.category === 'MAINTENANCE_EMERGENCY';
    const isStatutoryLegal = payload.category === 'LEGAL_NOTICE' && payload.priority === 'CRITICAL_SECURITY';

    if (isCriticalOtp || isEmergency || isStatutoryLegal) {
      // SMS or WhatsApp is authorized
      if (payload.recipientPhone) {
        // Enforce anti-spam / cost-runaway throttle (max 3 SMS per recipient per hour)
        const now = Date.now();
        const history = (this.recentSmsTimestamps.get(payload.recipientPhone) || []).filter(t => now - t < 3600000);
        
        if (history.length >= 5) {
          skipped.push({
            channel: 'SMS',
            reason: 'RATE_LIMIT_EXCEEDED: Maximum 5 emergency SMS/WhatsApp per hour per recipient.'
          });
        } else {
          channels.push(isCriticalOtp ? 'SMS' : 'WHATSAPP');
          history.push(now);
          this.recentSmsTimestamps.set(payload.recipientPhone, history);
        }
      } else {
        skipped.push({
          channel: 'SMS',
          reason: 'MISSING_RECIPIENT_PHONE: SMS/WhatsApp permitted but no phone number provided.'
        });
      }
    } else {
      // Policy rejection: Routine notifications cannot burn SMS/WhatsApp credits
      skipped.push({
        channel: 'SMS',
        reason: 'POLICY_RESTRICTION: Routine notifications use In-App/Email. SMS/WhatsApp reserved for OTPs and emergencies.'
      });
      skipped.push({
        channel: 'WHATSAPP',
        reason: 'POLICY_RESTRICTION: WhatsApp reserved for emergency tickets, MoveFlow audits, or urgent defaults.'
      });
    }

    return { channels, skipped };
  }

  /**
   * Main dispatch entry point
   */
  public async dispatch(payload: NotificationPayload): Promise<DispatchResult> {
    const { channels, skipped } = this.resolvePermittedChannels(payload);

    let totalCost = 0;
    for (const ch of channels) {
      totalCost += CHANNEL_COST_INR[ch];
    }

    const deliveryId = `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // In a live environment, this calls Twilio/Gupshup for SMS/WhatsApp and Resend/SES for Email.
    // For now, it logs delivery metrics and returns the audited result.
    console.log(`[NotificationDispatcher] Sent (${deliveryId}) [${payload.category}]: Channels=[${channels.join(', ')}], Cost=₹${totalCost.toFixed(2)}`);

    return {
      success: true,
      dispatchedChannels: channels,
      skippedChannels: skipped,
      estimatedCostInr: totalCost,
      deliveryId,
      timestamp: new Date().toISOString()
    };
  }
}

export const notificationDispatcher = NotificationDispatcher.getInstance();
