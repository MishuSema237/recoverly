# Tesla Capital - Cron Jobs Setup

This document explains how to set up automated cron jobs for Tesla Capital.

## Required Environment Variables

Add these to your `.env.local` file:

```env
CRON_SECRET=your-secure-random-string-here
```

## Cron Jobs

### Daily Gains Processing

**Endpoint:** `POST /api/cron/daily-gains`

**Purpose:** Processes daily investment gains for all active users and sends notifications.

**Setup:** Add this to your cron job scheduler (e.g., Vercel Cron, GitHub Actions, or server cron):

```bash
# Run daily at 12:00 AM UTC
0 0 * * * curl -X POST https://your-domain.com/api/cron/daily-gains -H "Authorization: Bearer your-cron-secret"
```

**Vercel Cron Setup:**
1. Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-gains",
      "schedule": "0 0 * * *"
    }
  ]
}
```

2. Set environment variable `CRON_SECRET` in Vercel dashboard.

**GitHub Actions Setup:**
Create `.github/workflows/daily-gains.yml`:
```yaml
name: Daily Gains Processing
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  process-gains:
    runs-on: ubuntu-latest
    steps:
      - name: Process Daily Gains
        run: |
          curl -X POST https://your-domain.com/api/cron/daily-gains \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## What Each Cron Job Does

### Daily Gains Processing
- Finds all users with active investments
- Calculates daily gains based on investment plan rates
- Updates user balances
- Sends notifications to users about their daily gains
- Logs all transactions

## Security

- All cron endpoints require authentication via `CRON_SECRET`
- Use a strong, random secret key
- Keep the secret secure and don't commit it to version control

## Monitoring

- Check application logs for cron job execution
- Monitor user notifications to ensure they're being sent
- Verify balance updates are working correctly




