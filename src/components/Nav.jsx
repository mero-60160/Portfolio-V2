import { useEffect, useRef, useState } from 'react';
import { scrollToTarget } from '../lib/scroll';
import { THEMES } from '../lib/themes';
import { useMagnetic } from '../hooks/useMagnetic';
import { NAV_LINKS } from '../lib/sections';

function RollText({ children }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

export default function Nav({ theme, onThemeClick, onOpenPalette, menuOpen, setMenuOpen }) {
  const [active, setActive] = useState('');
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef(null);
  const themeBtn = useRef(null);
  useMagnetic(themeBtn, 0.4);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // Section active (scrollspy)
  useEffect(() => {
    const ids = ['top', ...NAV_LINKS.map((l) => l.id), 'formation', 'plus'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const mapped = id === 'formation' || id === 'plus' ? 'experiences' : id === 'top' ? '' : id;
          setActive(mapped);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Masquage au défilement vers le bas + barre de progression
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 300);
        lastY = y;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(id === 'top' ? 0 : `#${id}`);
  };

  return (
    <>
      <header className={`nav ${hidden && !menuOpen ? 'is-hidden' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#top" className="nav__logo" onClick={(e) => go(e, 'top')} data-cursor="Accueil" aria-label="Retour en haut">
          <span className="nav__logo-mark">OA</span>
          <span className="nav__logo-text">Omer Atici</span>
        </a>

        <nav className="nav__links" aria-label="Navigation principale">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav__link ${active === l.id ? 'is-active' : ''}`}
              onClick={(e) => go(e, l.id)}
              aria-current={active === l.id ? 'true' : undefined}
            >
              <span className="nav__link-index">0{i + 1}</span>
              <RollText>{l.label}</RollText>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button type="button" className="nav__kbd" onClick={onOpenPalette} data-cursor="Commandes" aria-label="Ouvrir la palette de commandes">
            <kbd>Ctrl</kbd>
            <kbd>K</kbd>
          </button>
          <button
            ref={themeBtn}
            type="button"
            className="nav__theme"
            onClick={onThemeClick}
            data-cursor={current.label}
            aria-label={`Changer de thème (actuel : ${current.label})`}
          >
            <span className="nav__theme-dot" />
          </button>
          <button
            type="button"
            className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span />
            <span />
          </button>
        </div>
        <div className="nav__progress" aria-hidden="true">
          <div ref={progress} className="nav__progress-fill" />
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="menu__links" aria-label="Menu mobile">
          {NAV_LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} className="menu__link" style={{ '--i': i }} onClick={(e) => go(e, l.id)}>
              <span className="menu__index">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="menu__hint">Astuce : appuyez sur T pour changer de thème.</p>
      </div>
    </>
  );
}
