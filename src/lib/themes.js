export const THEMES = [
  { id: 'nuit', label: 'Nuit', swatch: '#ff5b1f' },
  { id: 'acide', label: 'Acide', swatch: '#c8ff3e' },
  { id: 'abysse', label: 'Abysse', swatch: '#7df0ff' },
  { id: 'papier', label: 'Papier', swatch: '#e3321b' },
];

const STORAGE_KEY = 'oa-theme';

export function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (THEMES.some((t) => t.id === saved)) return saved;
  } catch {
    /* stockage indisponible */
  }
  return THEMES[0].id;
}

export function nextThemeId(current) {
  const i = THEMES.findIndex((t) => t.id === current);
  return THEMES[(i + 1) % THEMES.length].id;
}

/**
 * Applique un thème avec une révélation circulaire (View Transitions API)
 * qui part du point `origin`. `commit` met à jour l'état React de façon synchrone.
 */
export function applyTheme(id, origin, commit) {
  const root = document.documentElement;
  root.dataset.themeTarget = id;
  const update = () => {
    root.dataset.theme = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* stockage indisponible */
    }
    commit?.();
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) {
    update();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(update);
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 950, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
}
