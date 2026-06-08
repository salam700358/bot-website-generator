const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const config = require('../config/config');

const bot = new TelegramBot(config.telegram.token, { polling: true });

console.log('🤖 Bot Telegram démarré...');

// Commande /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `👋 Bienvenue sur le Générateur de Sites Web IA !

Pour créer un site, utilise la commande :
/create [description de ton site]

Exemple :
/create Un site portfolio pour un photographe professionnel`
  );
});

// Commande /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `📖 Aide :

/start - Message de bienvenue
/create [description] - Génère un site web
/help - Affiche cette aide

Exemple :
/create Une landing page pour une application mobile de fitness`
  );
});

// Commande /create
bot.onText(/\/create (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const description = match[1];

  await bot.sendMessage(chatId, '⏳ Génération de ton site en cours... Patiente quelques secondes !');

  try {
    const response = await axios.post(
      `${config.server.baseUrl}/api/generate`,
      { description }
    );

    const { url, siteId } = response.data;

    await bot.sendMessage(chatId,
      `✅ Ton site est prêt !

🌐 URL : ${url}
🆔 ID : ${siteId}

Pour supprimer ce site, utilise :
/delete ${siteId}`
    );
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId,
      '❌ Une erreur est survenue lors de la génération. Réessaie plus tard.'
    );
  }
});

// Commande /delete
bot.onText(/\/delete (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const siteId = match[1];

  try {
    await axios.delete(`${config.server.baseUrl}/api/site/${siteId}`);
    await bot.sendMessage(chatId, `🗑️ Site ${siteId} supprimé avec succès !`);
  } catch (err) {
    await bot.sendMessage(chatId, '❌ Impossible de supprimer ce site.');
  }
});
