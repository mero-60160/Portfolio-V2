# Omer Atici — Portfolio V2

Portfolio personnel construit avec **React 19 + Vite**, animé avec **GSAP (ScrollTrigger)** et **Lenis** (défilement fluide).

## Lancer le projet

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run lint
```

## Fonctionnalités

- **Intro animée** : compteur 000→100, nom révélé lettre par lettre, rideau qui s'ouvre (Échap / Entrée / « Passer » pour sauter).
- **Hero interactif** : grille de points qui fuit le curseur, onde de choc au clic, lettres dont la graisse varie à l'approche du pointeur, horloge en direct.
- **4 thèmes** (Nuit, Acide, Abysse, Papier) avec transition circulaire — bouton dans la barre de navigation ou touche **T**. Le choix est mémorisé.
- **Palette de commandes** (**Ctrl / ⌘ + K**) : navigation, thèmes, copier l'email, ouvrir GitHub/LinkedIn, rejouer l'intro.
- **Curseur personnalisé** avec libellés contextuels et boutons « magnétiques ».
- **Projets en défilement horizontal épinglé**, avec un visuel animé par projet.
- Bandeau de technologies réactif à la vitesse de défilement, textes révélés au scroll, compteurs, accordéon des expériences, bento des compétences avec halo.
- **Accessibilité** : `prefers-reduced-motion` respecté (intro, smooth scroll et animations désactivés), navigation clavier, lien d'évitement.

## Structure

```
src/
  data/portfolio.js     ← tout le contenu (textes, projets, compétences…) à modifier ici
  App.jsx               ← assemblage, Lenis, raccourcis, commandes
  index.css             ← thèmes (variables CSS) et styles
  components/           ← Intro, Cursor, Nav, CommandPalette, HeroCanvas, Toast, Split
  sections/             ← Hero, About, Marquee, Projects, Experience, Skills, Formation, Beyond, Contact
  lib/                  ← thèmes, défilement, liste des sections
  hooks/                ← media queries, effet magnétique
```

Pour ajouter un thème : ajoutez un bloc `[data-theme='…']` dans `index.css` et une entrée dans `src/lib/themes.js`.
