const axios = require('axios');

const ASANA_API_BASE = 'https://app.asana.com/api/1.0';
const PROJECT_ID = '1202836664104107'; // Creative requests board

const asanaClient = axios.create({
  baseURL: ASANA_API_BASE,
  headers: {
    Authorization: `Bearer ${process.env.ASANA_TOKEN}`,
  },
});

async function fetchCreativeRequests() {
  try {
    const response = await asanaClient.get(`/projects/${PROJECT_ID}/tasks`, {
      params: {
        opt_fields: 'name,custom_fields,assignee.name,assignee.email,created_at',
        limit: 100,
      },
    });

    return response.data.data.map((task) => {
      const customFields = task.custom_fields || [];
      const crtvIdField = customFields.find(f => f.name === 'CRTV ID');
      const briefTypeField = customFields.find(f => f.name === 'Brief Type');
      const clientField = customFields.find(f => f.name === 'Client');

      return {
        crtv_id: crtvIdField?.text_value || null,
        name: task.name,
        briefer_email: task.assignee?.email || null,
        briefer_name: task.assignee?.name || null,
        brief_type: briefTypeField?.enum_value?.name || null,
        client: clientField?.enum_value?.name || null,
        created_at: task.created_at,
      };
    });
  } catch (error) {
    console.error('Error fetching from Asana:', error.message);
    throw error;
  }
}

module.exports = { fetchCreativeRequests };
