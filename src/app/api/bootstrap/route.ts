import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const [
      properties,
      tenants,
      invoices,
      ledger,
      disputes,
      influencerOffers,
      tickets,
      pgBeds,
      pgRooms,
      pgMeals,
      commercialUnits,
      camExpenses,
      commercialVisitors,
      estateAssets,
      staff,
      bills,
      subscription,
      leads,
      utilities,
      aiInsights,
      moveFlowChecklist,
      referrals,
      users
    ] = await Promise.all([
      db.properties.findMany(),
      db.tenants.findMany(),
      db.invoices.findMany(),
      db.ledger.findMany(),
      db.disputes.findMany(),
      db.influencerOffers.findMany(),
      db.tickets.findMany(),
      db.pg.getBeds(),
      db.pg.getRooms(),
      db.pg.getMeals(),
      db.commercial.getUnits(),
      db.commercial.getExpenses(),
      db.commercial.getVisitors(),
      db.estate.getAssets(),
      db.estate.getStaff(),
      db.bills.findMany(),
      db.subscriptions.getForUser(),
      db.leads.findMany(),
      db.utilities.findMany(),
      db.aiInsights.findMany(),
      db.moveFlow.findMany(),
      db.referrals.findMany(),
      db.users.findMany()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        properties,
        tenants,
        invoices,
        ledger,
        depositDisputes: disputes,
        influencerOffers,
        tickets,
        pgBeds,
        pgRooms,
        pgMeals,
        commercialUnits,
        camExpenses,
        commercialVisitors,
        estateAssets,
        staff,
        electricityBills: bills,
        subscription,
        leads,
        utilities,
        aiInsights,
        moveFlowChecklist,
        referrals,
        users: users.map(({ password, ...u }) => u)
      }
    });
  } catch (error) {
    console.error('[API /api/bootstrap] Error loading database data:', error);
    return NextResponse.json(
      { success: false, error: 'Database read failure' },
      { status: 500 }
    );
  }
}
