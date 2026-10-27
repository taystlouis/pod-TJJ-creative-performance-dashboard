const pool = require('../db/connect');
const { fetchPerformanceData, classifyWinner } = require('../connectors/looker');

async function syncPerformanceFromLooker() {
  try {
    // Fetch last 90 days of performance data
    const today = new Date();
    const dateTo = new Date(today.toISOString().split('T')[0]);
    const dateFrom = new Date(dateTo);
    dateFrom.setDate(dateFrom.getDate() - 90);

    const performances = await fetchPerformanceData(
      dateFrom.toISOString().split('T')[0],
      dateTo.toISOString().split('T')[0]
    );

    for (const perf of performances) {
      // Find or create creative
      const creative = await pool.query(
        'SELECT id, account FROM creatives WHERE crtv_id = $1',
        [perf.crtv_id]
      );

      let creativeId;
      if (creative.rows.length === 0) {
        const result = await pool.query(
          'INSERT INTO creatives (crtv_id, account, client) VALUES ($1, $2, $3) RETURNING id',
          [perf.crtv_id, perf.account, 'Unknown']
        );
        creativeId = result.rows[0].id;
      } else {
        creativeId = creative.rows[0].id;
      }

      // Upsert performance data
      await pool.query(
        `INSERT INTO performance (creative_id, crtv_id, date, cpl, cps, sales, spend, impressions, clicks, ctr)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (crtv_id, date) DO UPDATE SET
         cpl = $4, cps = $5, sales = $6, spend = $7, impressions = $8, clicks = $9, ctr = $10`,
        [
          creativeId,
          perf.crtv_id,
          perf.date,
          perf.cpl,
          perf.cps,
          perf.sales,
          perf.spend,
          perf.impressions,
          perf.clicks,
          perf.ctr,
        ]
      );

      // Classify and store winner status
      const winnerType = classifyWinner(perf, perf.account);
      if (winnerType) {
        await pool.query(
          `INSERT INTO winners (creative_id, crtv_id, account, winner_type, date_from, date_to, cpl, cps, sales)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT DO NOTHING`,
          [
            creativeId,
            perf.crtv_id,
            perf.account,
            winnerType,
            perf.date,
            perf.date,
            perf.cpl,
            perf.cps,
            perf.sales,
          ]
        );
      }
    }

    console.log(`Synced ${performances.length} performance records from Looker`);
  } catch (error) {
    console.error('Error syncing performance data:', error.message);
    throw error;
  }
}

module.exports = { syncPerformanceFromLooker };
