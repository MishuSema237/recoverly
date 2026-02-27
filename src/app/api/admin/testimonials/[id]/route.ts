import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();
    const db = await getDb();

    const result = await db.collection('testimonials').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...data, 
          updatedAt: new Date(),
          rating: data.rating ? parseFloat(data.rating.toString()) : undefined
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Testimonial updated' });
  } catch (error) {
    console.error('Testimonial PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Testimonial DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
