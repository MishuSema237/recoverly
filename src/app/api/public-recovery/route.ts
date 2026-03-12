import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import RecoveryCase from '@/lib/models/RecoveryCase';
import { sendEmail, emailTemplates } from '@/lib/email';
import crypto from 'crypto';

function generateClaimNumber() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomPart = '';
    for (let i = 0; i < 8; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REC-${new Date().getFullYear()}-${randomPart}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            scamType,
            amountLost,
            dateOfIncident,
            platformName,
            details,
            screenshotUrl
        } = body;

        if (!firstName || !lastName || !email || !scamType || !amountLost || !platformName) {
            return NextResponse.json({ success: false, error: 'Missing critical information' }, { status: 400 });
        }

        await dbConnect();

        const claimNumber = generateClaimNumber();

        const newCase = new RecoveryCase({
            claimNumber,
            isPublic: true,
            email,
            phone,
            address,
            scamType,
            amountLost: parseFloat(amountLost),
            dateOfIncident,
            platformName,
            details,
            screenshotUrl,
            status: 'pending',
            updates: [{
                status: 'pending',
                message: 'Forensic briefing transmitted and received by the registry.',
                timestamp: new Date()
            }]
        });

        await newCase.save();

        // Send confirmation email to user
        const fullName = `${firstName} ${lastName}`;
        const userEmailOptions = emailTemplates.recoveryClaimConfirmation(fullName, claimNumber, scamType);
        await sendEmail({
            to: email,
            ...userEmailOptions
        });

        // Send alert email to admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        if (adminEmail) {
            const adminOptions = emailTemplates.recoveryClaimAdminAlert(email, claimNumber, scamType, parseFloat(amountLost));
            await sendEmail({
                to: adminEmail,
                ...adminOptions
            });
        }

        return NextResponse.json({ success: true, data: { claimNumber } });
    } catch (error) {
        console.error('Public recovery submission error:', error);
        return NextResponse.json({ success: false, error: 'Intelligence transmission failed' }, { status: 500 });
    }
}
