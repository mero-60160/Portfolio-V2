// Point d'accès unique au défilement : Lenis si actif, sinon défilement natif.
let lenisInstance = null;

export const setLenis = (lenis) => {
  lenisInstance = lenis;
};

export const getLenis = () => lenisInstance;

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function scrollToTarget(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.6, easing: easeOutQuart, ...options });
    return;
  }

  const behavior = options.immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior, block: 'start' });
}
