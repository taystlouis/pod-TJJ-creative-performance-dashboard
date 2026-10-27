-- Creatives table
CREATE TABLE IF NOT EXISTS creatives (
  id SERIAL PRIMARY KEY,
  crtv_id VARCHAR(255) UNIQUE NOT NULL,
  client VARCHAR(255) NOT NULL,
  account VARCHAR(255) NOT NULL,
  briefer_email VARCHAR(255),
  briefer_name VARCHAR(255),
  editor_email VARCHAR(255),
  editor_name VARCHAR(255),
  brief_type VARCHAR(50), -- NNC, Simple, Complex
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance data (daily snapshots)
CREATE TABLE IF NOT EXISTS performance (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES creatives(id) ON DELETE CASCADE,
  crtv_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  cpl DECIMAL(10, 2),
  cps DECIMAL(10, 2),
  sales INTEGER,
  spend DECIMAL(12, 2),
  impressions INTEGER,
  clicks INTEGER,
  ctr DECIMAL(5, 3),
  conversions INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(crtv_id, date)
);

-- Creator leaderboard (denormalized stats)
CREATE TABLE IF NOT EXISTS creator_stats (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  total_creatives INTEGER DEFAULT 0,
  true_winners INTEGER DEFAULT 0,
  emerging_winners INTEGER DEFAULT 0,
  avg_cpl DECIMAL(10, 2),
  avg_cps DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Winner classifications (for quick queries)
CREATE TABLE IF NOT EXISTS winners (
  id SERIAL PRIMARY KEY,
  creative_id INTEGER NOT NULL REFERENCES creatives(id) ON DELETE CASCADE,
  crtv_id VARCHAR(255) NOT NULL,
  account VARCHAR(255) NOT NULL,
  winner_type VARCHAR(50), -- true_winner, emerging_winner
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  cpl DECIMAL(10, 2),
  cps DECIMAL(10, 2),
  sales INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_crtv_id ON performance(crtv_id);
CREATE INDEX IF NOT EXISTS idx_performance_date ON performance(date);
CREATE INDEX IF NOT EXISTS idx_performance_creative_id ON performance(creative_id);
CREATE INDEX IF NOT EXISTS idx_creatives_account ON creatives(account);
CREATE INDEX IF NOT EXISTS idx_creatives_briefer ON creatives(briefer_email);
CREATE INDEX IF NOT EXISTS idx_winners_account_date ON winners(account, date_from, date_to);
