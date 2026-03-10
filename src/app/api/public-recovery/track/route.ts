import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import RecoveryCase from '@/lib/models/RecoveryCase';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const claimNumber = searchParams.get('claimNumber');

        if (!email || !claimNumber) {
            return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
        }

        await dbConnect();

        const caseData = await RecoveryCase.findOne({
            email,
            claimNumber: claimNumber.toUpperCase()
        });

        if (!caseData) {
            // Also check if the user is a registered user whose email matches
            const registeredCase = await RecoveryCase.findOne({
                claimNumber: claimNumber.toUpperCase()
            });

            if (registeredCase) {
                let userEmail = registeredCase.email;
                if (!userEmail && registeredCase.userId) {
                    const db = await getDb();
                    const user = await db.collection('users').findOne({ _id: new ObjectId(registeredCase.userId.toString()) });
                    if (user) userEmail = user.email;
                }

                if (userEmail === email) {
                    return NextResponse.json({ success: true, data: registeredCase });
                }
            }

            return NextResponse.json({ success: false, error: 'Authorization failed: Invalid claim/email combination' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: caseData });
    } catch (error) {
        console.error('Tracking API error:', error);
        return NextResponse.json({ success: false, error: 'Internal intelligence failure' }, { status: 500 });
    }
}
