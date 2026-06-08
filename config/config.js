require('dotenv').config();
const path = require('path');

module.exports = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },

  server: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },

  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-opus-4-20250514',
    maxTokens: 8192,
  },

  deploy: {
    provider: process.env.DEPLOY_PROVIDER || 'local',
    vercelToken: process.env.VERCEL_TOKEN,
    netlifyToken: process.env.NETLIFY_TOKEN,
  },

  paths: {
    sites: path.join(__dirname, '..', 'sites'),
  },
};
