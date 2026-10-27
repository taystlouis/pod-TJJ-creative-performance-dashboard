# 🚀 Pod TJJ Dashboard — Quick Start Checklist

**Goal**: Get the dashboard live in ~30 minutes.

## Checklist

- [ ] **1. Create GitHub Repo** (2 min)
  ```
  Go to github.com/Clever-Digital-Marketing
  Click New → Name it "pod-TJJ-creative-performance-dashboard"
  Click Create → Copy the URL
  ```

- [ ] **2. Push Code** (1 min)
  ```bash
  cd /Users/taylor.s/pod-TJJ-creative-performance-dashboard
  git remote add origin https://github.com/Clever-Digital-Marketing/pod-TJJ-creative-performance-dashboard.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **3. Create Database** (5 min)
  - Go to railway.app OR render.com
  - Create PostgreSQL database
  - Copy the connection URL

- [ ] **4. Deploy Backend** (5 min)
  - Go to render.com
  - New → Web Service → Connect GitHub repo
  - Set environment variables:
    ```
    DATABASE_URL = [from step 3]
    ASANA_TOKEN = [get from Asana settings]
    NODE_ENV = production
    PORT = 10000
    ```
  - Deploy
  - Copy the backend URL (looks like: https://pod-tjj-backend.onrender.com)

- [ ] **5. Get Asana Token** (2 min)
  - app.asana.com → Profile → Settings → Apps → Personal access tokens
  - Create new token
  - Add to Render environment (this will redeploy)

- [ ] **6. Deploy Frontend** (5 min)
  - Go to vercel.com
  - Add Project → Select GitHub repo
  - Root directory: `frontend`
  - Add environment variable:
    ```
    REACT_APP_API_BASE = [backend URL from step 4]
    ```
  - Deploy
  - Copy the frontend URL

- [ ] **7. Connect Looker** (5 min)
  - **Option A**: If you have Looker API key → add to Render as `LOOKER_API_KEY`
  - **Option B**: Export Looker data to Google Sheet → Share publicly → add Sheet ID as `LOOKER_SHEET_ID` in Render
  - Render will auto-redeploy

- [ ] **8. Test** (1 min)
  - Open your frontend URL
  - Select account
  - Should see dashboard (may be empty until tomorrow's sync)

---

## Important URLs to Save

- **GitHub**: https://github.com/Clever-Digital-Marketing/pod-TJJ-creative-performance-dashboard
- **Backend** (Render): https://pod-tjj-backend.onrender.com
- **Frontend** (Vercel): https://[your-project].vercel.app
- **Database** (Railway/Render): [your-connection-url]

---

## What Happens Next

✅ Data syncs automatically:
- **2 AM** each day: Asana creative briefs
- **3 AM** each day: Looker performance data

✅ Dashboard updates with:
- True Winners (CPL + CPS targets met + ≥8 sales)
- Emerging Winners (good metrics, 1-7 sales)
- Creator leaderboards
- Top performers

---

## If Something Goes Wrong

**Dashboard shows "No Data"?**
- Check logs in Render (backend)
- Verify ASANA_TOKEN is valid
- Wait until 3 AM for first Looker sync

**Frontend won't load?**
- Check REACT_APP_API_BASE is correct in Vercel
- Verify backend is running (check Render logs)

**Database error?**
- Check DATABASE_URL in Render environment
- Verify database exists

---

## Done! 🎉

Your dashboard is live and syncing automatically.

Next step: Give me your Looker Studio details so I can wire it up fully (API key or Sheet ID).
