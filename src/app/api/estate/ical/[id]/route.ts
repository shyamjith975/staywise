import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if matching property exists
    const property = await db.properties.findById(id).catch(() => null);
    const propName = property?.name || 'Staywise Luxury Estate';

    // Format dates to YYYYMMDD
    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const formatIcalDate = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const formatIcalDay = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return `${now.getFullYear()}${pad(now.getMonth() + 1)}01`;
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
      } catch {
        return `${now.getFullYear()}${pad(now.getMonth() + 1)}01`;
      }
    };

    const reservations = [
      {
        id: `res-${id}-101`,
        guestName: 'Ananya Roy',
        villaName: 'Pool Villa 01',
        checkIn: '2026-10-12',
        checkOut: '2026-10-16',
        channel: 'Airbnb Superhost',
        totalAmount: 140000,
        pin: '8491'
      },
      {
        id: `res-${id}-102`,
        guestName: 'Vikram & Priyasha',
        villaName: 'Luxury Suite 03',
        checkIn: '2026-10-18',
        checkOut: '2026-10-21',
        channel: 'Direct Concierge',
        totalAmount: 42500,
        pin: '2294'
      },
      {
        id: `res-${id}-103`,
        guestName: 'Techstars Leadership',
        villaName: 'Entire Estate Campus',
        checkIn: '2026-10-24',
        checkOut: '2026-10-28',
        channel: 'Corporate Direct',
        totalAmount: 280000,
        pin: '9103'
      }
    ];

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Staywise Technologies//Hospitality OS iCal 1.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${propName.replace(/[,;]/g, '')} - Staywise Reservations`,
      'X-WR-TIMEZONE:Asia/Kolkata',
      'X-WR-CALDESC:Real-time synchronized reservation feed for Airbnb, Booking.com, and OTA channels.',
    ];

    for (const res of reservations) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:staywise-${res.id}@staywise.com`,
        `DTSTAMP:${formatIcalDate(now)}`,
        `DTSTART;VALUE=DATE:${formatIcalDay(res.checkIn)}`,
        `DTEND;VALUE=DATE:${formatIcalDay(res.checkOut)}`,
        `SUMMARY:${res.guestName} - ${res.villaName} (${res.channel})`,
        `DESCRIPTION:Staywise Reservation #${res.id}\\nGuest: ${res.guestName}\\nChannel: ${res.channel}\\nAmount: INR ${res.totalAmount}\\nSmart Lock Passcode: ${res.pin}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      );
    }

    lines.push('END:VCALENDAR');
    const icalContent = lines.join('\r\n');

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="staywise-${id}-calendar.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[API /api/estate/ical/[id]] GET Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

