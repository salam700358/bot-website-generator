Parfait ! 🎉

Fichier suivant. Clique sur **`+`**.

Nom du fichier :
```
services/aiService.js
```

Contenu :
```javascript
const axios = require('axios');
const config = require('../config/config');

async function generateWebsite(description) {
  const systemPrompt = `Tu es un expert développeur web.
Quand l'utilisateur décrit un site web, tu génères le code complet.

Réponds UNIQUEMENT avec un objet JSON valide avec ces clés :
- "title": titre court de la page
- "html": HTML complet pour index.html
- "css": CSS additionnel (peut être vide)
- "js": JavaScript additionnel (peut être vide)

Exigences :
- Design moderne, responsive et beau
- CSS critique inline dans <style> dans <head>
- Tous les assets via CDN
- Code prêt pour la production`;

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: config.ai.model,
      max_tokens: config.ai.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Crée un site web pour : ${description}` }],
    },
    {
      headers: {
        'x-api-key': config.ai.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    }
  );

  const rawText = response.data.content[0].text.trim();
  const clean = rawText.replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(`L'IA a retourné un JSON invalide : ${err.message}`);
  }

  if (!parsed.html) throw new Error('Réponse IA sans champ "html".');

  return {
    title: parsed.title || 'Site Généré',
    html: parsed.html,
    css: parsed.css || '',
    js: parsed.js || '',
  };
}

module.exports = { generateWebsite };
```

Valide et dis-moi quand c'est fait ! ✅
