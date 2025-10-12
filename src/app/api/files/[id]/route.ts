import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const bucket = db.collection('notification_files');
    
    const file = await bucket.findOne({ _id: new ObjectId(params.id) });
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'File not found'
      }, { status: 404 });
    }

    // Return file with proper headers
    return new NextResponse(file.buffer, {
      headers: {
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
        'Content-Length': file.size.toString()
      }
    });

  } catch (error) {
    console.error('Error retrieving file:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


