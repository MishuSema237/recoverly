/* eslint-disable */
const nodemailer = require('nodemailer');
console.log('Current directory:', process.cwd());
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    console.log('Testing email with credentials:');
    console.log('Host:', host);
    console.log('Port:', port);
    console.log('User:', user);
    console.log('Pass:', pass ? '******' : 'MISSING');

    if (!user || !pass) {
        console.error('Missing SMTP credentials in .env.local');
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Tesla Capital Test" <${user}>`,
            to: user, // Send to self
            subject: "Tesla Capital Email Test",
            text: "This is a test email from Tesla Capital's new Node mailer service.",
            html: "<b>This is a test email from Tesla Capital's new Node mailer service.</b>",
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

testEmail();
