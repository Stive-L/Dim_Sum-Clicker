# Dim Sum Clicker

![Demo](demo.gif)

## Fonctionnalités

- Améliorations : Achète des générateurs automatiques (Plieur de dim sum, Panier vapeur, Cuisine centrale)
- Multiplicateur : Système de multiplication des gains (x2, x4, x8...) qui s'accumule
- Utilisateurs : Système de connexion avec sauvegarde/chargement via localStorage
- Classement : Leaderboard des joueurs (total et moyenne par seconde)

## Démarrer le projet

```bash
npm install
npm run dev
```
Ouvre ensuite l’URL indiquée dans le terminal (`http://localhost:5173`).

## Structure

- `src/components/CorpsDeVue.vue` : Conteneur principal
- `src/components/AuthBar.vue` : Authentification utilisateur
- `src/components/StatsBar.vue` : Affichage des statistiques
- `src/components/DimSumButton.vue` : Bouton principal avec animations de clic
- `src/components/ClickAnimation.vue` : Animations PNG qui apparaissent lors des clics
- `src/components/UpgradesList.vue` : Liste des améliorations
- `src/components/Leaderboard.vue` : Classement des joueurs
- `src/store/index.js` : Store Vuex centralisé (state, mutations, actions, getters)

