const axios = require('axios');

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
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Crée un site web pour : ${description}` }
      ],
      max_tokens: 8192,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const rawText = response.data.choices[0].message.content.trim();
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
