# 🤖 Bot Website Generator

Un bot Telegram qui génère et déploie des sites web automatiquement grâce à l'IA (Claude d'Anthropic).

## Fonctionnalités
- Génère un site web complet à partir d'une description
- Déploie automatiquement sur Vercel, Netlify ou en local
- Commandes simples via Telegram

## Installation

1. Clone le projet
2. Installe les dépendances :
   npm install

3. Copie le fichier .env.example en .env :
   cp .env.example .env

4. Remplis les variables dans .env

## Démarrage

Lancer le serveur :
   npm start

Lancer le bot :
   npm run bot

## Commandes Telegram

/start - Message de bienvenue
/create [description] - Génère un site web
/delete [id] - Supprime un site
/help - Aide

## Exemple

/create Un site portfolio pour un photographe professionnel
