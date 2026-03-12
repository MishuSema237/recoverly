import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            return NextResponse.json({ success: false, error: 'Cloudinary configuration missing' }, { status: 500 });
        }

        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const signatureStr = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('api_key', apiKey);
        cloudinaryFormData.append('timestamp', timestamp);
        cloudinaryFormData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: cloudinaryFormData
        });

        const data = await response.json();

        if (data.secure_url) {
            return NextResponse.json({ success: true, url: data.secure_url });
        } else {
            console.error('Cloudinary upload error:', data);
            return NextResponse.json({ success: false, error: 'Upload failed: ' + (data.error?.message || 'Unknown error') }, { status: 500 });
        }
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
