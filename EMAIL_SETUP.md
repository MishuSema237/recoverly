# Email Service Setup Guide - Using EmailJS

## Overview
Tesla Capital uses **EmailJS** for sending emails (password resets, notifications, etc.). EmailJS is free, easy to set up, and doesn't require a backend email server.

**MongoDB does not have an email service** - MongoDB is just a database. EmailJS handles all email delivery for us!

## Quick Setup with EmailJS (5 minutes)

### Step 1: Sign Up for EmailJS
1. Go to https://www.emailjs.com
2. Click "Sign Up" and create a free account (Google sign-in works too)
3. Free tier: **200 emails/month** - perfect for development!

### Step 2: Add an Email Service
1. Once logged in, go to **"Add New Service"**
2. Choose **"Gmail"** (or Gmail API, Outlook, etc.)
3. Click **"Connect Account"**
4. Authorize EmailJS to send emails from your Gmail
5. **Copy the Service ID** - you'll need this

### Step 3: Create an Email Template
1. Go to **"Email Templates"** → **"Create New Template"**
2. Give it a name: **"Password Reset"**
3. Set up your template like this:

**Subject:**
```
Password Reset Request - Tesla Capital
```

**Content:**
```
You requested a password reset for your Tesla Capital account.

Click the link below to reset your password:
{{reset_url}}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

© 2024 Tesla Capital. All rights reserved.
```

**Important:** Add a placeholder `{{message}}` in your template - this is where the HTML email content will go.

4. **Copy the Template ID**

### Step 4: Get Your Public Key
1. Go to **"Account"** → **"General"** (or Settings)
2. Find your **"Public Key"** (also called User ID)
3. **Copy the Public Key**

### Step 5: Add Environment Variables
Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# Create the file
touch .env.local
```

Add these three variables:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
EMAILJS_PUBLIC_KEY=your_public_key_here

# Optional: Where to send replies
EMAIL_FROM=noreply@teslacapital.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example:**
```env
EMAILJS_SERVICE_ID=service_abc123
EMAILJS_TEMPLATE_ID=template_xyz789
EMAILJS_PUBLIC_KEY=abcdefghijklmnop
EMAIL_FROM=noreply@teslacapital.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Test It!
1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to your login page and try "Forgot Password"
3. Enter an email address
4. Check that email's inbox - you should receive the reset email!

## EmailJS Free Tier Limits
- ✅ **200 emails per month** - FREE forever
- ✅ No credit card required
- ✅ Perfect for development and small deployments
- ✅ Upgrade to paid plans for more volume

## Alternative Setup Options

### Option 1: Gmail (with nodemailer) - Previous Method
If you prefer using Gmail directly, see the old setup in the git history.

### Option 2: SendGrid (For Production)
For production apps sending 1000+ emails/month:
- Visit https://sendgrid.com
- Free tier: 100 emails/day
- More setup required

### Option 3: AWS SES
For high-volume production apps
- Most cost-effective at scale
- More complex setup

## Troubleshooting

### Error: "EmailJS configuration is missing"
- Check that your `.env.local` file exists in the project root
- Verify all three EmailJS variables are set
- **Important:** Restart your dev server after changing `.env.local`

### Error: "EmailJS API error"
- Verify your Service ID, Template ID, and Public Key are correct
- Make sure your EmailJS account is active
- Check your monthly email limit (200/month on free tier)

### Emails not sending?
1. Check the server console for errors
2. Verify your EmailJS template includes `{{message}}` placeholder
3. Test your EmailJS service directly on emailjs.com dashboard
4. Make sure your Gmail account is properly connected to EmailJS

### Template variables not working?
- EmailJS uses `{{variable_name}}` syntax
- Common variables: `{{to_email}}`, `{{subject}}`, `{{message}}`
- Check EmailJS documentation for template setup

## Security Notes

⚠️ **Important:**
1. **Never commit `.env.local` to git** - it's already in `.gitignore`
2. **For production**, add these environment variables to your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Heroku: Dashboard → Settings → Config Vars
   - Netlify: Site Settings → Environment Variables

3. **EmailJS Public Key** is safe to be public (hence "public" key), but keep your Service ID and Template ID private

## Quick Start Checklist

- [ ] Sign up for EmailJS (free)
- [ ] Add Gmail service to EmailJS
- [ ] Create email template in EmailJS
- [ ] Copy Service ID, Template ID, and Public Key
- [ ] Create `.env.local` file in project root
- [ ] Add EmailJS credentials to `.env.local`
- [ ] Restart dev server: `npm run dev`
- [ ] Test "Forgot Password" feature
- [ ] ✅ Done!

## Need Help?

- **EmailJS Docs:** https://www.emailjs.com/docs/
- **EmailJS Support:** https://www.emailjs.com/support/
- **Check console logs** for detailed error messages

Your forgot password feature will work immediately once EmailJS is configured! 🚀
