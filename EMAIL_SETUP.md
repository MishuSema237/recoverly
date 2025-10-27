# Email Service Setup Guide

## Overview
Tesla Capital uses email for password resets and user notifications. MongoDB **does not have an email service** - you need to use a third-party email provider.

## Option 1: Gmail (Free - Best for Development)

### Setup Steps:

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable it

2. **Generate an App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other" and type "Tesla Capital"
   - Click "Generate"
   - **Copy the 16-character password** (no spaces)

3. **Add to your `.env.local` file**
   ```env
   # Email Configuration (Development - Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-app-password
   EMAIL_FROM=noreply@teslacapital.com
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Create `.env.local` file** in the project root:
   ```bash
   touch .env.local
   ```

## Option 2: SendGrid (Recommended for Production)

### Setup Steps:

1. **Sign up at SendGrid** (https://sendgrid.com)
   - Free tier: 100 emails/day forever

2. **Create an API Key**
   - Dashboard → Settings → API Keys
   - Click "Create API Key"
   - Name it "Tesla Capital"
   - Permissions: "Full Access" (or "Mail Send")
   - Copy the API key

3. **Verify your sender email**
   - Settings → Sender Authentication
   - Verify Single Sender or domain

4. **Add to your production environment variables:**
   ```env
   # Email Configuration (Production - SendGrid)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_SECURE=false
   EMAIL_FROM=noreply@teslacapital.com
   
   # App URL (Production)
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

## Option 3: Mailgun (Production Alternative)

### Setup Steps:

1. **Sign up at Mailgun** (https://www.mailgun.com)
   - Free tier: 5,000 emails/month for 3 months

2. **Get your SMTP credentials**
   - Dashboard → Sending → SMTP credentials
   - Copy the credentials

3. **Add to your production environment variables:**
   ```env
   # Email Configuration (Production - Mailgun)
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=your-mailgun-username
   SMTP_PASSWORD=your-mailgun-password
   SMTP_SECURE=false
   EMAIL_FROM=noreply@teslacapital.com
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

## Option 4: AWS SES (For High Volume)

Best for large-scale applications. More complex setup but very reliable and cost-effective at scale.

## Testing Your Email Setup

After setting up your credentials, test with:

```bash
# Start your development server
npm run dev
```

Try the forgot password feature on your login page - it should work!

## Troubleshooting

### Error: "Email configuration is missing"
- Check that your `.env.local` file exists
- Verify all required environment variables are set
- Restart your development server after adding environment variables

### Gmail: "Less secure app access"
- This is normal - use App Passwords instead (not your regular Gmail password)
- Make sure you generated an App Password, not using 2FA code

### SendGrid: "Authentication failed"
- Verify your API key is correct
- Check that "Mail Send" permission is enabled
- Ensure sender email is verified

## Security Notes

1. **Never commit `.env.local` to git** - it's already in `.gitignore`
2. **For production**, set environment variables in your hosting platform (Vercel, Heroku, etc.)
3. **App passwords** for Gmail are safer than your main password
4. **Rate limits**: Gmail has limits (500/day), SendGrid free tier is 100/day

## Quick Setup Summary

**For Development:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**For Production:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-api-key
```

That's it! Your forgot password feature will work once these are configured. 🚀

