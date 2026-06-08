const aiService = require('../../services/aiService');
const fileBuilder = require('../../services/fileBuilder');
const deployService = require('../../services/deployService');

exports.generateSite = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description manquante' });
    }

    // 1. Générer le code via IA
    const siteData = await aiService.generateWebsite(description);

    // 2. Créer les fichiers
    const siteId = await fileBuilder.buildSite(siteData);

    // 3. Déployer
    const url = await deployService.deploy(siteId);

    res.json({ success: true, siteId, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSite = async (req, res) => {
  try {
    const { id } = req.params;
    const site = await fileBuilder.getSite(id);
    res.json(site);
  } catch (err) {
    res.status(404).json({ error: 'Site non trouvé' });
  }
};

exports.deleteSite = async (req, res) => {
  try {
    const { id } = req.params;
    await fileBuilder.deleteSite(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
