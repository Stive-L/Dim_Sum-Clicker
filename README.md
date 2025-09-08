# Dim Sum Clicker

Petit jeu « clicker » réalisé avec **Vue.js + Vite**.

## Fonctionnalités
- Clique sur le panier de dim sum pour gagner des dim sum.
- Achète des améliorations (Plieur, Panier vapeur, Cuisine centrale) qui génèrent automatiquement des dim sum par seconde.
- Système d’utilisateurs local (pseudo) avec sauvegarde/chargement via `localStorage`.
- Classement des joueurs (total et moyenne par seconde).

## Démarrer le projet
```bash
npm install
npm run dev
```
Ouvre ensuite l’URL indiquée dans le terminal (généralement `http://localhost:5173`).

## Structure simplifiée
- `src/App.vue` : point d’entrée; charge le conteneur.
- `src/components/CorpsDeVue.vue` : conteneur principal (auth, stats, bouton, améliorations, classement).
- `src/components/AuthBar.vue` : connexion/déconnexion, chargement/sauvegarde.
- `src/components/StatsBar.vue` : dim sum, auto/s, moyenne/s.
- `src/components/DimSumButton.vue` : bouton principal.
- `src/components/UpgradesList.vue` : liste d’améliorations.
- `src/components/Leaderboard.vue` : classement (total, moyenne/s).
- `src/store/index.js` : store Vuex (state, mutations, actions, getters) + persistence locale.

## Données et sauvegarde
- Les parties sont stockées dans le navigateur via `localStorage`.
