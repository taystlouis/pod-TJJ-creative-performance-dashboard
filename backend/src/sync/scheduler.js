const cron = require('node-cron');
const { syncCreativesFromAsana } = require('./asanaSync');
const { syncPerformanceFromLooker } = require('./lookerSync');

function startSyncSchedule() {
  // Sync Asana data daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Starting Asana sync...');
    try {
      await syncCreativesFromAsana();
      console.log('Asana sync completed');
    } catch (error) {
      console.error('Asana sync failed:', error.message);
    }
  });

  // Sync Looker performance data daily at 3 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('Starting Looker sync...');
    try {
      await syncPerformanceFromLooker();
      console.log('Looker sync completed');
    } catch (error) {
      console.error('Looker sync failed:', error.message);
    }
  });

  console.log('Sync schedule started');
}

module.exports = { startSyncSchedule };
