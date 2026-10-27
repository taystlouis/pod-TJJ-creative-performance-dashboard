const express = require('express');
const pool = require('../db/connect');

const router = express.Router();

// GET creator leaderboard (who created the best ads)
router.get('/creators', async (req, res) => {
  try {
    const { role, dateFrom, dateTo } = req.query;

    let query = `
      SELECT
        COALESCE(c.briefer_email, c.editor_email) as email,
        COALESCE(c.briefer_name, c.editor_name) as name,
        $1 as role,
        COUNT(DISTINCT c.id) as total_creatives,
        COUNT(DISTINCT CASE WHEN w.winner_type = 'true_winner' THEN c.id END) as true_winners,
        COUNT(DISTINCT CASE WHEN w.winner_type = 'emerging_winner' THEN c.id END) as emerging_winners,
        ROUND(AVG(p.cpl)::numeric, 2) as avg_cpl,
        ROUND(AVG(p.cps)::numeric, 2) as avg_cps,
        SUM(CASE WHEN p.sales IS NOT NULL THEN p.sales ELSE 0 END) as total_sales
      FROM creatives c
      LEFT JOIN performance p ON c.id = p.creative_id
      LEFT JOIN winners w ON c.id = w.creative_id
      WHERE 1=1
    `;
    const params = [role === 'editor' ? 'editor' : 'briefer'];

    if (dateFrom && dateTo) {
      query += ` AND p.date BETWEEN $2 AND $3`;
      params.push(dateFrom, dateTo);
    }

    const emailCol = role === 'editor' ? 'c.editor_email' : 'c.briefer_email';
    query += ` GROUP BY ${emailCol}, COALESCE(c.${role}_name, c.${role}_name)
               HAVING COUNT(DISTINCT c.id) > 0
               ORDER BY true_winners DESC, emerging_winners DESC, avg_cpl ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET top performers
router.get('/top-performers', async (req, res) => {
  try {
    const { limit = 10, dateFrom, dateTo } = req.query;

    let query = `
      SELECT
        c.crtv_id, c.client, c.account,
        c.briefer_name, c.editor_name,
        p.cpl, p.cps, p.sales, p.spend,
        w.winner_type
      FROM creatives c
      LEFT JOIN performance p ON c.id = p.creative_id
      LEFT JOIN winners w ON c.id = w.creative_id
      WHERE w.winner_type = 'true_winner'
    `;
    const params = [];

    if (dateFrom && dateTo) {
      query += ` AND p.date BETWEEN $1 AND $2`;
      params.push(dateFrom, dateTo);
    }

    query += ` ORDER BY p.cpl ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
