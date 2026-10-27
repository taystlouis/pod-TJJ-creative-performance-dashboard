const axios = require('axios');

// Looker Studio connector - pulls performance data via Looker API
// Data comes from Facebook Ads Manager, filtered by CRTV ID (ad name)

const lookerClient = axios.create({
  baseURL: 'https://lookerstudio.google.com/api',
  headers: {
    Authorization: `Bearer ${process.env.LOOKER_API_KEY}`,
  },
});

// Account targets for winner classification
const ACCOUNT_TARGETS = {
  'Express Flooring': { cpl: 145.00, cps: 529.20 },
  'Matrix Home Basement': { cpl: 232.67, cps: 1042.93 },
  'Long Home Siding': { cpl: 199.00, cps: 663.33 },
  'ImproveIt Kitchen': { cpl: 161.00, cps: 661.19 },
};

async function fetchPerformanceData(dateFrom, dateTo) {
  try {
    if (process.env.LOOKER_API_KEY) {
      return await fetchFromLookerAPI(dateFrom, dateTo);
    } else if (process.env.LOOKER_SHEET_ID) {
      return await fetchFromGoogleSheets(dateFrom, dateTo);
    } else {
      console.warn('No Looker data source configured. Set LOOKER_API_KEY or LOOKER_SHEET_ID in .env');
      return [];
    }
  } catch (error) {
    console.error('Error fetching performance data:', error.message);
    throw error;
  }
}

async function fetchFromLookerAPI(dateFrom, dateTo) {
  console.log('Looker API: Configure when API key available');
  return [];
}

async function fetchFromGoogleSheets(dateFrom, dateTo) {
  try {
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.LOOKER_SHEET_ID}/export?format=csv`;
    const response = await axios.get(sheetUrl);
    const lines = response.data.split('\n');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const [crtv_id, account, date, cpl, cps, sales, spend, impressions, clicks] = lines[i].split(',');
      data.push({
        crtv_id: crtv_id?.trim(),
        account: account?.trim(),
        date: date?.trim(),
        cpl: parseFloat(cpl),
        cps: parseFloat(cps),
        sales: parseInt(sales),
        spend: parseFloat(spend),
        impressions: parseInt(impressions),
        clicks: parseInt(clicks),
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error.message);
    return [];
  }
}

function classifyWinner(performance, account) {
  const target = ACCOUNT_TARGETS[account];
  if (!target) return null;

  const cplMeet = performance.cpl <= target.cpl;
  const cpsMeet = performance.cps <= target.cps;
  const salesCount = performance.sales || 0;

  if (cplMeet && cpsMeet && salesCount >= 8) {
    return 'true_winner';
  } else if (cplMeet && cpsMeet && salesCount >= 1) {
    return 'emerging_winner';
  }
  return null;
}

module.exports = { fetchPerformanceData, classifyWinner, ACCOUNT_TARGETS };
