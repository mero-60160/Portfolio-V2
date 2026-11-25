import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Intro from './components/Intro';
import Nav from './components/Nav';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';
import Hero from './sections/Hero';
import About from './sections/About';
import Marquee from './sections/Marquee';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Formation from './sections/Formation';
import Beyond from './sections/Beyond';
import Contact from './sections/Contact';

import { personalInfo } from './data/portfolio';
import { getLenis, scrollToTarget, setLenis } from './lib/scroll';
import { applyTheme, nextThemeId, THEMES } from './lib/themes';
import { ALL_SECTIONS } from './lib/sections';
import { REDUCED_MOTION_QUERY, useReducedMotion } from './hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const isTyping = (el) => el?.closest?.('input, textarea, [contenteditable="true"]');

export default function App() {
  const reduced = useReducedMotion();
  const [introOn, setIntroOn] = useState(() => !prefersReduced());
  const [revealKey, setRevealKey] = useState(() => (prefersReduced() ? 1 : 0));
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Classe globale qui active les états initiaux des animations
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('motion', !reduced);
  }, [reduced]);

  // Défilement fluide Lenis synchronisé avec le ticker GSAP
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Bloque le défilement pendant l'intro, la palette ou le menu mobile
  const locked = introOn || paletteOpen || menuOpen;
  useEffect(() => {
    const lenis = getLenis();
    document.documentElement.classList.toggle('is-locked', locked);
    if (locked) lenis?.stop();
    else lenis?.start();
  }, [locked, reduced]);

  // Apparitions génériques : [data-reveal] (fondu) et [data-split] (mots masqués)
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      });
      gsap.utils.toArray('[data-split]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.word'),
          { yPercent: 115, y: 0 },
          { yPercent: 0, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        );
      });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [reduced]);

  const showToast = useCallback((message) => setToast({ message, id: Date.now() }), []);
  const clearToast = useCallback(() => setToast(null), []);

  const changeTheme = useCallback((id, origin) => {
    applyTheme(id, origin, () => flushSync(() => setTheme(id)));
  }, []);

  const cycleTheme = useCallback(
    (origin) => changeTheme(nextThemeId(document.documentElement.dataset.themeTarget || document.documentElement.dataset.theme), origin),
    [changeTheme],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      showToast('Email copié dans le presse-papiers');
    } catch {
      window.location.href = `mailto:${personalInfo.email}`;
    }
  }, [showToast]);

  const replayIntro = useCallback(() => {
    if (prefersReduced()) return;
    scrollToTarget(0, { immediate: true });
    setIntroOn(true);
  }, []);

  // Raccourcis clavier : Ctrl/Cmd+K (palette) et T (thème suivant)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
        cycleTheme();
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cycleTheme]);

  const commands = useMemo(() => {
    const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');
    return [
      ...ALL_SECTIONS.map((s) => ({
        id: `go-${s.id}`,
        group: 'Navigation',
        icon: '→',
        label: s.label,
        keywords: 'aller section',
        run: () => scrollToTarget(s.id === 'top' ? 0 : `#${s.id}`),
      })),
      ...THEMES.map((t) => ({
        id: `theme-${t.id}`,
        group: 'Thème',
        swatch: t.swatch,
        label: `Thème ${t.label}`,
        hint: t.id === theme ? 'actif' : undefined,
        keywords: 'couleur apparence mode',
        run: () => changeTheme(t.id),
      })),
      { id: 'copy-email', group: 'Actions', icon: '⧉', label: "Copier l'email", hint: personalInfo.email, keywords: 'contact mail', run: copyEmail },
      { id: 'mail', group: 'Actions', icon: '✉', label: 'Écrire un email', keywords: 'contact mail', run: () => (window.location.href = `mailto:${personalInfo.email}`) },
      { id: 'phone', group: 'Actions', icon: '☏', label: 'Appeler', hint: personalInfo.phone, keywords: 'téléphone', run: () => (window.location.href = `tel:${personalInfo.phone.replace(/\s/g, '')}`) },
      { id: 'github', group: 'Actions', icon: '↗', label: 'Ouvrir GitHub', keywords: 'code repo', run: () => open(personalInfo.github.url) },
      { id: 'linkedin', group: 'Actions', icon: '↗', label: 'Ouvrir LinkedIn', keywords: 'réseau profil', run: () => open(personalInfo.linkedin.url) },
      { id: 'replay', group: 'Actions', icon: '↻', label: "Rejouer l'intro", keywords: 'animation chargement', run: replayIntro },
    ];
  }, [theme, changeTheme, copyEmail, replayIntro]);

  return (
    <>
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>

      {introOn && <Intro onReveal={() => setRevealKey((k) => k + 1)} onDone={() => setIntroOn(false)} />}

      <div className="grain" aria-hidden="true" />

      <Nav
        theme={theme}
        onThemeClick={(e) => cycleTheme({ x: e.clientX, y: e.clientY })}
        onOpenPalette={() => setPaletteOpen(true)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main id="main">
        <Hero revealKey={revealKey} />
        <About />
        <Marquee />
        <Projects />
        <Experience />
        <Skills />
        <Formation />
        <Beyond />
        <Contact onCopyEmail={copyEmail} />
      </main>

      {paletteOpen && <CommandPalette commands={commands} onClose={() => setPaletteOpen(false)} />}
      <Toast toast={toast} onDone={clearToast} />
    </>
  );
}
