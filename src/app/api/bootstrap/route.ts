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
      bills
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
      db.bills.findMany()
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
        electricityBills: bills
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
