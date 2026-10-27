# Pod TJJ Creative Performance Dashboard

A comprehensive dashboard for tracking creative performance across Clever Digital Marketing accounts. Syncs data from Asana (creative briefs) and Looker Studio (Facebook Ads performance) to show winners, creator leaderboards, and performance metrics.

## Features

- **Creative Performance Tracking**: View all creatives ranked by CPL, CPS, and sales
- **Winner Classification**: Automatic categorization of True Winners and Emerging Winners based on account KPIs
- **Creator Leaderboard**: Ranking of top-performing briefers and editors
- **Date Range Filtering**: View winners from last 7 days, 14 days, 42 days, 30 days, or all-time
- **Account-Specific Views**: Separate dashboards for Express Flooring, Matrix Home, Long Home Siding, and ImproveIt Kitchen

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React 18
- **Database**: PostgreSQL
- **Hosting**: Vercel (frontend) + Render/Railway (backend)
- **Data Sources**: Asana API, Looker Studio

## Setup Instructions

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Asana personal access token
- Looker Studio API access

### Local Development

#### 1. Clone the repository

```bash
cd pod-TJJ-creative-performance-dashboard
```

#### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run migrate
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm start
```

The dashboard will be available at `http://localhost:3000`.

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/pod_tjj_dashboard
ASANA_TOKEN=your_asana_personal_access_token
LOOKER_API_KEY=your_looker_api_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env.local)**
```
REACT_APP_API_BASE=http://localhost:5000/api
```

## Deployment

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Create new "Web Service"
4. Set environment variables from `.env.example`
5. Deploy

### Frontend Deployment (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set `REACT_APP_API_BASE` to your Render backend URL
4. Deploy

## API Endpoints

### Creatives
- `GET /api/creatives` - Get all creatives with performance data
- `GET /api/creatives/:id` - Get creative detail with history

### Winners
- `GET /api/winners` - Get winners filtered by account/date/type
- `GET /api/winners/stats/:account` - Get winner statistics

### Leaderboard
- `GET /api/leaderboard/creators` - Get creator rankings
- `GET /api/leaderboard/top-performers` - Get top 10 performers

## Data Sync

The dashboard syncs data automatically:
- **Asana**: Daily at 2 AM (creative brief metadata)
- **Looker**: Daily at 3 AM (performance metrics)

To trigger manual sync, restart the backend service.

## Winner Classification

**True Winner**
- CPL ≤ account target
- CPS ≤ account target
- At least 8 sales

**Emerging Winner**
- Good CPL (≤ account target)
- Good CPS (≤ account target)
- 1–7 sales

## Account KPI Targets

| Account | CPL Target | CPS Target |
|---------|-----------|-----------|
| Express Flooring | $145.00 | $529.20 |
| Matrix Home Basement | $232.67 | $1,042.93 |
| Long Home Siding | $199.00 | $663.33 |
| ImproveIt Kitchen | $161.00 | $661.19 |

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Asana API Error
- Verify ASANA_TOKEN is valid
- Check project ID in `asana.js`
- Ensure board has CRTV ID field

### Frontend Not Loading Data
- Check REACT_APP_API_BASE points to running backend
- Verify backend is running on port 5000
- Check browser console for CORS errors

## Future Enhancements

- Deep-dive creative analysis by winning angles
- Custom alert rules for emerging winners
- Export reports as PDF/CSV
- Real-time data sync with webhooks
- Multi-pod comparison views
- AI-powered creative recommendations

## Support

For issues or questions, contact the development team or submit an issue in GitHub.

## License

Internal use only - Clever Digital Marketing
