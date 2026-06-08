const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

async function buildSite(siteData) {
  const siteId = uuidv4();
  const sitePath = path.join(config.paths.sites, siteId);

  await fs.ensureDir(sitePath);

  // Injecter le CSS et JS dans le HTML si présents
  let html = siteData.html;

  if (siteData.css) {
    html = html.replace('</head>', `<style>${siteData.css}</style></head>`);
  }

  if (siteData.js) {
    html = html.replace('</body>', `<script>${siteData.js}</script></body>`);
  }

  await fs.writeFile(path.join(sitePath, 'index.html'), html, 'utf8');

  // Sauvegarder les métadonnées
  const meta = {
    id: siteId,
    title: siteData.title,
    createdAt: new Date().toISOString(),
  };

  await fs.writeJson(path.join(sitePath, 'meta.json'), meta);

  return siteId;
}

async function getSite(siteId) {
  const metaPath = path.join(config.paths.sites, siteId, 'meta.json');
  const meta = await fs.readJson(metaPath);
  return meta;
}

async function deleteSite(siteId) {
  const sitePath = path.join(config.paths.sites, siteId);
  await fs.remove(sitePath);
}

module.exports = { buildSite, getSite, deleteSite };
