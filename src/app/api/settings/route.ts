import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

/**
 * ============================================================================
 * STAYWISE PLATFORM — PRODUCTION SETTINGS API ROUTE
 * ============================================================================
 * Handles persistent GET and POST/PATCH for platform configuration:
 * - Entity & Identity (Organization / Host profile)
 * - Rent & Grace Period Rules
 * - Electricity & Sub-meter Tariff Rules
 * - Payout Escrow & Bank/UPI details
 * - User notification preferences
 * ============================================================================
 */

import {
  getSettingsCache,
  setSettingsCache,
  invalidateSettingsCache,
  invalidateBootstrapCache
} from '../../../lib/cache/apiCache';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-owner-vikram';

    const cached = getSettingsCache(userId);
    const ifNoneMatch = req.headers.get('if-none-match');
    if (cached) {
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        return new NextResponse(null, { status: 304, headers: { 'ETag': cached.etag } });
      }
      return NextResponse.json({ success: true, data: cached.data }, { headers: { 'ETag': cached.etag } });
    }

    let settings = await db.settings.getForUser(userId);

    // If not found in DB, populate default from user account
    if (!settings) {
      const user = await db.users.findById(userId);
      settings = await db.settings.save({
        userId,
        entityName: user?.role === 'tenant' ? 'Resident Account' : (user?.name ? `${user.name} Asset Portfolio` : 'Singhania Asset Holdings LLP'),
        ownerName: user?.name || 'Authorized Member',
        panNumber: user?.role === 'tenant' ? '' : 'AAACS1928K',
        gstin: user?.role === 'tenant' ? '' : '29AAACS1928K1Z5',
        bankAccount: user?.role === 'tenant' ? '' : '918020048192842',
        ifsc: user?.role === 'tenant' ? '' : 'UTIB0000042',
        bankName: user?.role === 'tenant' ? '' : 'Axis Bank (Escrow Banking Division)',
        upiId: user?.role === 'tenant' ? '' : 'staywise.escrow@axisbank',
        autoSweepCadence: 'Daily at 18:00 IST',
        rentDueDay: 5,
        gracePeriodDays: 3,
        lateFeeFixed: 500,
        lateFeeDailyRate: 50,
        autoWhatsAppReminder: true,
        allowPartialPayments: false,
        ksebTariffPerUnit: 9.5,
        dgBackupRatePerUnit: 24.0,
        meterReadingCycle: '1st to 5th of every month',
        commonAreaPowerRatio: 10,
        preferences: {
          whatsappAlerts: true,
          smsAlerts: true,
          emailDigests: true,
          instantBookingNotifications: true
        }
      });
    }

    const etag = `W/"${Buffer.from(JSON.stringify(settings)).toString('base64').slice(0, 16)}"`;
    setSettingsCache(userId, settings, etag);

    return NextResponse.json({
      success: true,
      data: settings
    }, { headers: { 'ETag': etag } });
  } catch (error) {
    console.error('[API /api/settings] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user-owner-vikram';

    const savedSettings = await db.settings.save({
      userId,
      entityName: body.entityName,
      ownerName: body.ownerName,
      panNumber: body.panNumber,
      gstin: body.gstin,
      bankAccount: body.bankAccount,
      ifsc: body.ifsc,
      bankName: body.bankName,
      upiId: body.upiId,
      autoSweepCadence: body.autoSweepCadence,
      rentDueDay: typeof body.rentDueDay === 'number' ? body.rentDueDay : undefined,
      gracePeriodDays: typeof body.gracePeriodDays === 'number' ? body.gracePeriodDays : undefined,
      lateFeeFixed: typeof body.lateFeeFixed === 'number' ? body.lateFeeFixed : undefined,
      lateFeeDailyRate: typeof body.lateFeeDailyRate === 'number' ? body.lateFeeDailyRate : undefined,
      autoWhatsAppReminder: typeof body.autoWhatsAppReminder === 'boolean' ? body.autoWhatsAppReminder : undefined,
      allowPartialPayments: typeof body.allowPartialPayments === 'boolean' ? body.allowPartialPayments : undefined,
      ksebTariffPerUnit: typeof body.ksebTariffPerUnit === 'number' ? body.ksebTariffPerUnit : undefined,
      dgBackupRatePerUnit: typeof body.dgBackupRatePerUnit === 'number' ? body.dgBackupRatePerUnit : undefined,
      meterReadingCycle: body.meterReadingCycle,
      commonAreaPowerRatio: typeof body.commonAreaPowerRatio === 'number' ? body.commonAreaPowerRatio : undefined,
      preferences: body.preferences
    });

    // Also update user profile if name/phone provided
    if (body.ownerName || body.phone) {
      await db.users.updateProfile(userId, {
        name: body.ownerName,
        phone: body.phone
      });
    }

    // Also record statutory audit entry
    await db.ledger.create({
      description: `Platform Configurations Updated for User ${userId} [SQLite Verified]`,
      type: 'DEBIT',
      amount: 0,
      account: '9992-SETTINGS-CONFIGURATION-AUDIT',
      entityType: 'SETTLEMENT',
      referenceId: userId,
      settlementStatus: 'CLEARED'
    });

    // Invalidate RAM cache so subsequent GETs fetch fresh settings and bootstrap state immediately
    invalidateSettingsCache(userId);
    invalidateBootstrapCache();

    return NextResponse.json({
      success: true,
      message: 'Platform configurations updated and saved to SQLite database successfully.',
      data: savedSettings
    });
  } catch (error) {
    console.error('[API /api/settings] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
