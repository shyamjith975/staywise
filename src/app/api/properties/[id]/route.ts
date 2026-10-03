import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await db.properties.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('[API /api/properties/[id]] GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db.properties.update(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[API /api/properties/[id]] PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.properties.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('[API /api/properties/[id]] DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
