const express = require('express');
const pool = require('../db/connect');

const router = express.Router();

// GET winners by date range and account
router.get('/', async (req, res) => {
  try {
    const { account, dateFrom, dateTo, type } = req.query;

    let query = `
      SELECT
        w.*, c.crtv_id, c.briefer_name, c.editor_name, c.brief_type
      FROM winners w
      JOIN creatives c ON w.creative_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (account) {
      query += ` AND w.account = $${params.length + 1}`;
      params.push(account);
    }

    if (type) {
      query += ` AND w.winner_type = $${params.length + 1}`;
      params.push(type);
    }

    if (dateFrom && dateTo) {
      query += ` AND w.date_from >= $${params.length + 1} AND w.date_to <= $${params.length + 2}`;
      params.push(dateFrom, dateTo);
    }

    query += ` ORDER BY w.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching winners:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET winner stats summary
router.get('/stats/:account', async (req, res) => {
  try {
    const { account } = req.params;
    const { dateFrom, dateTo } = req.query;

    let query = `
      SELECT
        w.winner_type,
        COUNT(*) as count,
        AVG(w.cpl) as avg_cpl,
        AVG(w.cps) as avg_cps,
        SUM(w.sales) as total_sales
      FROM winners w
      WHERE w.account = $1
    `;
    const params = [account];

    if (dateFrom && dateTo) {
      query += ` AND w.date_from >= $2 AND w.date_to <= $3`;
      params.push(dateFrom, dateTo);
    }

    query += ` GROUP BY w.winner_type`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching winner stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
