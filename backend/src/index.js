require('dotenv').config();
const express = require('express');
const cors = require('cors');
const creativeRoutes = require('./routes/creatives');
const winnersRoutes = require('./routes/winners');
const leaderboardRoutes = require('./routes/leaderboard');
const { startSyncSchedule } = require('./sync/scheduler');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/creatives', creativeRoutes);
app.use('/api/winners', winnersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Creative Performance Dashboard API running on port ${PORT}`);

  // Start sync schedule
  startSyncSchedule();
});
