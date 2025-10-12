import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'File type not allowed. Allowed types: JPEG, PNG, GIF, PDF, DOC, DOCX, TXT, ZIP'
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;

    // Store file in MongoDB GridFS
    const db = await getDb();
    const bucket = db.collection('notification_files');
    
    // Store file metadata
    const fileDoc = {
      filename: filename,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date(),
      buffer: buffer
    };

    const result = await bucket.insertOne(fileDoc);

    // Return file info (in production, you'd return a URL to access the file)
    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        filename: filename,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        url: `/api/files/${result.insertedId}` // URL to access the file
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


