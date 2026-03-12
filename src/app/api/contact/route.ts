import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, scamType, amount, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Prepare email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@recoverlytrustbank.com';
    
    const emailSubject = `Web Inquiry: ${scamType} - from ${name}`;
    const emailText = `
New Secure Inquiry Received

Name: ${name}
Email: ${email}
Scam Type: ${scamType}
Amount Lost: ${amount}

Message:
${message}

Sent via Recoverly Contact Form.
    `;

    const emailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0b1626; border-bottom: 2px solid #c9933a; padding-bottom: 10px;">New Secure Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Scam Type:</strong> ${scamType}</p>
        <p><strong>Amount Lost:</strong> ${amount}</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <strong>Message:</strong><br/>
          ${message.replace(/\n/g, '<br/>')}
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">This message was sent securely via the Recoverly Contact Form.</p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been transmitted securely.'
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Transmission failed.' },
      { status: 500 }
    );
  }
}
