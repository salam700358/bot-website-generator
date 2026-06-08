const express = require('express');
const routes = require('./routes');
const config = require('../config/config');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.listen(config.server.port, () => {
  console.log(`Serveur démarré sur le port ${config.server.port}`);
});

module.exports = app;
