const express = require('express');
const pool = require('../db/connect');

const router = express.Router();

// GET all creatives with performance data
router.get('/', async (req, res) => {
  try {
    const { account, dateFrom, dateTo, status } = req.query;

    let query = `
      SELECT
        c.id, c.crtv_id, c.client, c.account,
        c.briefer_name, c.editor_name, c.brief_type,
        p.cpl, p.cps, p.sales, p.spend, p.impressions, p.ctr,
        w.winner_type
      FROM creatives c
      LEFT JOIN performance p ON c.id = p.creative_id
      LEFT JOIN winners w ON c.id = w.creative_id
      WHERE 1=1
    `;
    const params = [];

    if (account) {
      query += ` AND c.account = $${params.length + 1}`;
      params.push(account);
    }

    if (dateFrom && dateTo) {
      query += ` AND p.date BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(dateFrom, dateTo);
    }

    if (status === 'winners') {
      query += ` AND w.winner_type IS NOT NULL`;
    }

    query += ` ORDER BY COALESCE(p.cpl, 999) ASC LIMIT 500`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching creatives:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET creative detail with full performance history
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const creative = await pool.query(
      'SELECT * FROM creatives WHERE id = $1',
      [id]
    );

    if (creative.rows.length === 0) {
      return res.status(404).json({ error: 'Creative not found' });
    }

    const performance = await pool.query(
      'SELECT * FROM performance WHERE creative_id = $1 ORDER BY date DESC',
      [id]
    );

    res.json({
      creative: creative.rows[0],
      performance: performance.rows,
    });
  } catch (error) {
    console.error('Error fetching creative detail:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
