const pool = require('../db/connect');
const { fetchCreativeRequests } = require('../connectors/asana');

async function syncCreativesFromAsana() {
  try {
    const creatives = await fetchCreativeRequests();

    for (const creative of creatives) {
      if (!creative.crtv_id) continue;

      // Map account name from client
      const accountMap = {
        'Express Flooring': 'Express Flooring',
        'Matrix Home': 'Matrix Home Basement',
        'Long Home': 'Long Home Siding',
        'Improveit': 'ImproveIt Kitchen',
      };

      let account = 'Unknown';
      for (const [key, value] of Object.entries(accountMap)) {
        if (creative.client?.includes(key)) {
          account = value;
          break;
        }
      }

      // Upsert creative
      await pool.query(
        `INSERT INTO creatives (crtv_id, client, account, briefer_email, briefer_name, brief_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (crtv_id) DO UPDATE SET
         client = $2, account = $3, briefer_email = $4, briefer_name = $5, brief_type = $6, updated_at = CURRENT_TIMESTAMP`,
        [
          creative.crtv_id,
          creative.client,
          account,
          creative.briefer_email,
          creative.briefer_name,
          creative.brief_type,
        ]
      );
    }

    console.log(`Synced ${creatives.length} creatives from Asana`);
  } catch (error) {
    console.error('Error syncing creatives:', error.message);
    throw error;
  }
}

module.exports = { syncCreativesFromAsana };
