const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const config = require('../config/config');

async function deploy(siteId) {
  const provider = config.deploy.provider;

  switch (provider) {
    case 'vercel':
      return await deployToVercel(siteId);
    case 'netlify':
      return await deployToNetlify(siteId);
    default:
      return deployLocal(siteId);
  }
}

function deployLocal(siteId) {
  const url = `${config.server.baseUrl}/sites/${siteId}/index.html`;
  console.log(`Site disponible localement : ${url}`);
  return url;
}

async function deployToVercel(siteId) {
  const sitePath = path.join(config.paths.sites, siteId);
  const htmlContent = await fs.readFile(
    path.join(sitePath, 'index.html'),
    'utf8'
  );

  const response = await axios.post(
    'https://api.vercel.com/v13/deployments',
    {
      name: `site-${siteId}`,
      files: [
        {
          file: 'index.html',
          data: htmlContent,
        },
      ],
      projectSettings: { framework: null },
    },
    {
      headers: {
        Authorization: `Bearer ${config.deploy.vercelToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return `https://${response.data.url}`;
}

async function deployToNetlify(siteId) {
  const sitePath = path.join(config.paths.sites, siteId);
  const htmlContent = await fs.readFile(
    path.join(sitePath, 'index.html'),
    'utf8'
  );

  const response = await axios.post(
    'https://api.netlify.com/api/v1/sites',
    {},
    {
      headers: {
        Authorization: `Bearer ${config.deploy.netlifyToken}`,
      },
    }
  );

  const siteNetlifyId = response.data.id;

  await axios.put(
    `https://api.netlify.com/api/v1/sites/${siteNetlifyId}/files/index.html`,
    htmlContent,
    {
      headers: {
        Authorization: `Bearer ${config.deploy.netlifyToken}`,
        'Content-Type': 'text/html',
      },
    }
  );

  return `https://${response.data.subdomain}.netlify.app`;
}

module.exports = { deploy };
