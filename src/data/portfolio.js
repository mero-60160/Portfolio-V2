export const personalInfo = {
  name: "Omer Atici",
  title: "Data Engineering · Cloud Architecture · Fullstack Development",
  birthDate: "07/12/2003",
  age: 22,
  location: "Amiens, France",
  mobility: "Mobile dans toute la France",
  phone: "07 66 26 59 54",
  email: "atc.pro@myyahoo.com",
  permis: "Permis B",
  linkedin: {
    label: "LinkedIn",
    url: "https://linkedin.com/in/omer-atici",
    value: "Ömer Atici",
  },
  github: {
    label: "GitHub",
    url: "https://github.com/mero-60160",
    value: "mero-60160",
  },
  portfolio: {
    label: "Portfolio",
    url: "https://aticiomerportfolio.netlify.app",
    value: "aticiomerportfolio.netlify.app",
  },
  seekingStage: "Recherche Stage 2 à 6 mois — 2026/2027",
  profileText:
    "Développeur Fullstack de formation, j'ai acquis de solides bases techniques dans la conception d'applications web. Je poursuis aujourd'hui mon parcours en Bac+3 Chef de projet Développement & Data à La Manu (Amiens), afin d'évoluer vers la Data (ingénierie, analyse), l'IA et le Cloud tout en renforçant mes compétences en gestion de projet. Dans le cadre de cette formation, je recherche un stage de 2 à 6 mois pour 2026-2027. J'ai à cœur d'apporter ma polyvalence, ma curiosité et ma soif d'apprendre au sein d'une équipe innovante.",
};

export const experiences = [
  {
    role: "Développeur Web Fullstack — Stage",
    company: "Opium Digital · Paris",
    dates: "Fév. 2024 – Mai 2024",
    tasks: [
      "Conception et déploiement d'interfaces utilisateur interactives en JavaScript, fidélité 100% aux maquettes graphiques.",
      "Création et maintenance de bases de données SQL/NoSQL et gestion des flux serveurs via API REST.",
      "Implémentation systématique de tests unitaires et fonctionnels, réduisant les bugs en production.",
      "Collaboration Agile intensive, utilisation de Git et participation aux réunions de suivi.",
    ],
  },
  {
    role: "Conseiller de Vente — Stage Erasmus+",
    company: "celio* · La Valette, Malte",
    dates: "Mai 2023 – Juin 2023",
    tasks: [
      "Accueil, accompagnement et conseil client en anglais au sein d'une équipe multiculturelle.",
      "Gestion des flux de marchandises, encaissement et participation au merchandising visuel de la boutique.",
    ],
  },
  {
    role: "Stagiaire en Agence Immobilière",
    company: "Stéphane Plaza Immobilier · Persan",
    dates: "2021 & 2022 (2 × 2 sem.)",
    tasks: [
      "Accueil physique et téléphonique de la clientèle, accompagnement lors des visites de biens.",
      "Aide à la prospection terrain, gestion administrative et mise à jour des annonces en vitrine.",
    ],
  },
];

export const projects = [
  {
    code: "PRJ_01",
    slug: "crm-m-atici.ts",
    name: "CRM M-Atici — Gestion Commerciale Fullstack",
    tech: ["Vue.js", "Node.js", "PostgreSQL", "Prisma"],
    status: "PROD // LIVE",
    github: "https://github.com/mero-60160",
    points: [
      "Architecture End-to-End : Application 100% JavaScript (Vue.js 3 / Node.js) permettant une gestion fluide des clients, devis et factures en temps réel.",
      "Backend & API : API REST robuste avec Express.js, validation de données (Zod), et intégration d'un système de génération de PDF dynamique.",
      "Base de données : Modélisation relationnelle avancée sous PostgreSQL avec Prisma ORM, incluant migrations automatiques et scripts de seeding.",
      "Sécurité & Conformité : Authentification sécurisée via JWT, hachage des mots de passe avec Bcrypt, et protection des données (RGPD).",
      "Dashboarding : Interface interactive avec indicateurs clés (CA, statut des devis) et filtrage dynamique.",
    ],
  },
  {
    code: "PRJ_02",
    slug: "monitoring-stack.yml",
    name: "Système de Monitoring & Alerting",
    tech: ["Prometheus", "Grafana", "AlertManager"],
    status: "ACTIVE // 99.9%",
    github: "https://github.com/mero-60160",
    points: [
      "Déploiement de Prometheus, Grafana et AlertManager pour assurer une haute disponibilité des services.",
      "Tableaux de bord Grafana personnalisés avec alertes automatisées sur seuils critiques.",
    ],
  },
  {
    code: "PRJ_03",
    slug: "mac-locker.daemon",
    name: "Mac-Locker — Sécurité à distance iOS/macOS",
    tech: ["FastAPI", "SwiftUI", "WebSocket", "Docker"],
    status: "DEV // v2.0",
    github: "https://github.com/mero-60160",
    points: [
      "Architecture 3 piliers : iPhone (télécommande) · Serveur relais · Agent macOS pour un contrôle instantané.",
      "WebSockets bidirectionnels pour une latence minimale — verrouillage du Mac à distance en quelques millisecondes.",
      "Infrastructure conteneurisée avec Docker, gestion rigoureuse des secrets et roadmap JWT.",
    ],
  },
];

export const formations = [
  {
    degree: "Bac+3 — Chef de projet Développement & Data",
    school: "La Manu — Amiens",
    years: "2026 – 2027",
  },
  {
    degree: "Bachelor Bac+3 — Architecte des Systèmes d'Information",
    school: "ECOLE-IT — Amiens",
    years: "2025 – 2026",
  },
  {
    degree: "Administrateur Système et Réseaux",
    school: "ETNA — Ivry-sur-Seine",
    years: "2024 – 2025",
  },
  {
    degree: "Titre Professionnel Bac+2 — Développeur Web & Web Mobile (DWWM)",
    school: "SJT — Nogent-sur-Oise",
    years: "2023 – 2024",
  },
  {
    degree: "Bac Pro Vente — Option B",
    school: "Lycée Amyot d'Inville — Senlis",
    years: "2021 – 2023",
  },
];

export const skills = {
  data_ia: ["Python", "Big Data", "IA", "MCD / MLD", "Cloud"],
  cloud_devops: ["Docker", "Docker Desktop", "CI/CD", "Prometheus", "Grafana"],
  backend: ["Node.js", "Express", "PHP", "Prisma ORM", "API REST"],
  frontend: ["Vue.js", "JavaScript ES6+", "HTML5 / CSS3"],
  databases: ["PostgreSQL", "MySQL", "MongoDB", "Heidi SQL"],
  tools_mgmt: ["VS Code", "Fork", "Antigravity", "Word", "Figma", "Canva", "Trello", "Teams"],
};

export const languages = [
  { name: "Français", level: "Courant" },
  { name: "Anglais", level: "Intermédiaire" },
  { name: "Turc", level: "Courant" },
  { name: "Kurde", level: "Courant" },
];

export const centres = {
  veille: ["Hacker News", "Medium", "GitHub"],
  cinema: ["Cinéma Fantastique", "Action", "Horreur"],
  sports: ["Football", "Boxe Anglaise", "Boxe Française", "Randonnée"],
  voyage: ["Malte", "Turquie", "Rhodes", "Bosnie", "Croatie", "Belgique", "Allemagne"],
  softskills: ["Autonomie", "Esprit d'équipe", "Rigueur", "Adaptabilité", "Curiosité technique"],
};
