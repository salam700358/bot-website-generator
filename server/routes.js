const express = require('express');
const router = express.Router();
const siteController = require('./controllers/siteController');

router.post('/generate', siteController.generateSite);
router.get('/site/:id', siteController.getSite);
router.delete('/site/:id', siteController.deleteSite);

module.exports = router;
