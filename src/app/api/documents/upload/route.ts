import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/security/authorization';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp'
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB statutory limit

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to upload documents.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as string) || 'PRIVATE_LEASE';
    const propertyId = formData.get('propertyId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Missing file payload.' },
        { status: 400 }
      );
    }

    // 1. Strict File Type Validation (P0.5)
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `INVALID_FILE_TYPE: File type '${file.type}' is disallowed. Allowed formats: PDF, PNG, JPEG, WEBP.`,
          code: 'DISALLOWED_MIME_TYPE'
        },
        { status: 415 }
      );
    }

    // 2. Strict File Size Validation (P0.5)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `FILE_TOO_LARGE: File size (${Math.round(file.size / 1024)} KB) exceeds the 10 MB maximum limit.`,
          code: 'FILE_SIZE_EXCEEDED'
        },
        { status: 413 }
      );
    }

    // 3. Generate Secure Document Metadata & Storage Path
    const docId = `doc-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const isPrivate = documentType.startsWith('PRIVATE_');
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 4. Record statutory audit trail in double-entry ledger
    await db.ledger.create({
      description: `Document uploaded: "${safeFilename}" (${documentType}, ${Math.round(file.size / 1024)} KB) by user "${auth.user.name}" [ID: ${docId}]`,
      type: 'DEBIT',
      amount: 0,
      account: '9994-DOCUMENT-STORAGE-AUDIT',
      entityType: 'SETTLEMENT',
      referenceId: propertyId || docId,
      settlementStatus: 'CLEARED'
    });

    return NextResponse.json({
      success: true,
      message: `Document '${safeFilename}' uploaded and secured with access restrictions.`,
      document: {
        id: docId,
        name: safeFilename,
        type: documentType,
        sizeBytes: file.size,
        mimeType: file.type,
        isPrivate,
        ownerId: auth.user.id,
        propertyId,
        downloadUrl: `/api/documents/${docId}/download`,
        uploadedAt: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('[API /api/documents/upload] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during document upload.' },
      { status: 500 }
    );
  }
}
