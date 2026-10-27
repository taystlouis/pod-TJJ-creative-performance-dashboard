# Pod TJJ Dashboard — Deployment Guide

## Step 1: Create Empty GitHub Repo (2 minutes)

1. Go to https://github.com/Clever-Digital-Marketing
2. Click **New** (green button, top right)
3. **Repository name**: `pod-TJJ-creative-performance-dashboard`
4. **Description**: Creative Performance Dashboard - Clever Digital Marketing
5. **Public** (not private)
6. Click **Create repository**
7. Copy the repo URL (looks like `https://github.com/Clever-Digital-Marketing/pod-TJJ-creative-performance-dashboard.git`)

## Step 2: Push Code to GitHub (1 minute)

```bash
cd /Users/taylor.s/pod-TJJ-creative-performance-dashboard

# Add remote (replace URL with your repo URL from step 1)
git remote add origin https://github.com/Clever-Digital-Marketing/pod-TJJ-creative-performance-dashboard.git
git branch -M main
git push -u origin main
```

Done! Your code is now on GitHub. ✅

---

## Step 3: Create PostgreSQL Database (Free, 5 minutes)

### Option A: Railway (Recommended — easier)

1. Go to https://railway.app
2. Click **Start a New Project**
3. Choose **Provision PostgreSQL**
4. Click **Deploy**
5. Wait ~2 min for DB to start
6. Click **PostgreSQL** card → **Connect** tab
7. Copy the **Database URL** (starts with `postgresql://`)
8. Save this for later (you'll paste into backend .env)

### Option B: Render

1. Go to https://render.com
2. Click **New +** → **PostgreSQL**
3. Give it a name: `pod-tjj-db`
4. Click **Create Database**
5. Copy the **Internal Database URL**
6. Save for later

---

## Step 4: Deploy Backend (Render, 5 minutes)

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Select **Connect your repository** → choose `pod-TJJ-creative-performance-dashboard`
4. **Name**: `pod-tjj-backend`
5. **Environment**: Node
6. **Build Command**: `cd backend && npm install`
7. **Start Command**: `npm start --prefix backend`
8. Scroll down to **Environment** section
9. Add these variables:
   ```
   DATABASE_URL = [paste from Step 3]
   ASANA_TOKEN = [you'll get this from Asana]
   LOOKER_API_KEY = [we'll figure this out]
   NODE_ENV = production
   PORT = 10000
   ```
10. Click **Create Web Service**
11. Wait for deploy (3-5 min)
12. When done, copy the URL (looks like `https://pod-tjj-backend.onrender.com`)

---

## Step 5: Deploy Frontend (Vercel, 3 minutes)

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Select your GitHub repo: `pod-TJJ-creative-performance-dashboard`
4. **Framework**: React
5. **Root Directory**: `frontend`
6. Click **Build and Output Settings** → toggle **Override**
7. **Build Command**: `npm install && npm run build`
8. **Output Directory**: `build`
9. Add **Environment Variable**:
   ```
   REACT_APP_API_BASE = [paste backend URL from Step 4]
   ```
10. Click **Deploy**
11. Wait for deploy (2-3 min)

---

## Step 6: Get Asana Token (2 minutes)

1. Go to https://app.asana.com (logged in as you)
2. Click your profile icon (top right) → **Settings**
3. Left menu → **Apps**
4. Click **Personal access tokens**
5. Click **Create new token**
6. Give it a name: `Pod TJJ Dashboard`
7. **Copy the token** (you won't see it again)
8. Go to Render → `pod-tjj-backend` → **Environment**
9. Paste it into `ASANA_TOKEN`
10. Click **Save Changes** (this will redeploy)

---

## Step 7: Wire Up Looker Connection

**You need to clarify**: What is your "LSR connection"?

Option A: **Looker Studio API**
- Do you have an API key?
- If yes: paste it as `LOOKER_API_KEY` in Render

Option B: **Google Sheets Export**
- Export your Looker dashboard as a Google Sheet
- Share the link with me
- I'll modify the backend to read from it

Option C: **CSV Upload**
- Export your Looker data as CSV daily
- Upload to a folder (Google Drive, Dropbox)
- I'll wire backend to read from it

**Reply with which option and I'll finish wiring it up.**

---

## Step 8: Test the Dashboard

1. Go to your Vercel frontend URL
2. Select account and date range
3. Should show winners if data is syncing

---

## Troubleshooting

**Database connection error?**
- Make sure DATABASE_URL is correct in Render env
- Restart backend service in Render

**Frontend shows "No data"?**
- Check REACT_APP_API_BASE in Vercel is correct
- Open browser DevTools → Network tab → check API calls

**Asana/Looker sync not working?**
- Check logs in Render backend
- Verify tokens are correct

---

## Next: Data Syncing

Once deployed, the backend automatically syncs:
- **2 AM** each day: Fetches Asana creative briefs
- **3 AM** each day: Fetches Looker performance data

To trigger manual sync, restart backend in Render.
