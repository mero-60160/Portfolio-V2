import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from '../components/HeroCanvas';
import { SplitChars } from '../components/Split';
import { personalInfo } from '../data/portfolio';
import { scrollToTarget } from '../lib/scroll';
import { useReducedMotion } from '../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

const ROLES = personalInfo.title.split('·').map((s) => s.trim());

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function LocalClock() {
  const [now, setNow] = useState(() => timeFormatter.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(timeFormatter.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <time className="tabular">{now}</time>;
}

function RoleTicker() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="ticker" data-hero-fade>
      <span className="ticker__label">Focus actuel</span>
      <span className="ticker__window" aria-live="off">
        <span key={index} className="ticker__item">
          {ROLES[index]}
        </span>
      </span>
    </p>
  );
}

function ScrollBadge() {
  return (
    <button type="button" className="badge" onClick={() => scrollToTarget('#profil')} data-hero-fade data-cursor="Go" aria-label="Défiler vers le profil">
      <svg viewBox="0 0 120 120" className="badge__ring" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">DÉFILER • DÉCOUVRIR • DÉFILER • DÉCOUVRIR • </textPath>
        </text>
      </svg>
      <span className="badge__arrow" aria-hidden="true">
        ↓
      </span>
    </button>
  );
}

export default function Hero({ revealKey }) {
  const root = useRef(null);
  const reduced = useReducedMotion();

  // Entrée du hero, déclenchée à la fin de l'intro
  useLayoutEffect(() => {
    if (reduced || revealKey === 0) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo('.hero__title .char', { yPercent: 118, y: 0, rotate: 7 }, { yPercent: 0, y: 0, rotate: 0, duration: 1.5, stagger: 0.055, ease: 'expo.out' })
        .fromTo('[data-hero-fade]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, ease: 'power3.out' }, 0.45)
        .fromTo('.hero__canvas', { opacity: 0 }, { opacity: 1, duration: 2 }, 0.2)
        .fromTo('.hero__star', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 1.4, ease: 'expo.out' }, 0.7);
    }, root);
    return () => ctx.revert();
  }, [revealKey, reduced]);

  // Parallaxe à la sortie du hero
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__title', { yPercent: 28, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__inner-fade', { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="top" className="hero" ref={root}>
      <HeroCanvas className="hero__canvas" />

      <div className="hero__meta hero__inner-fade">
        <span data-hero-fade>Portfolio ©2026</span>
        <span data-hero-fade className="hero__meta-center">
          <LocalClock /> — {personalInfo.location}
        </span>
        <span data-hero-fade className="pill">
          <span className="pulse" aria-hidden="true" />
          Disponible · Stage 2026/27
        </span>
      </div>

      <h1 className="hero__title" aria-label={personalInfo.name}>
        <span className="hero__line">
          <SplitChars text="OMER" />
        </span>
        <span className="hero__line hero__line--2">
          <span className="hero__serif" data-hero-fade aria-hidden="true">
            (développeur)
          </span>
          <SplitChars text="ATICI" />
          <span className="hero__star" aria-hidden="true">
            ✳
          </span>
        </span>
      </h1>

      <div className="hero__bottom hero__inner-fade">
        <p className="hero__lede" data-hero-fade>
          Développeur <em>fullstack</em> en route vers la <em>data</em>, l&apos;<em>IA</em> et le <em>cloud</em>. Je cherche un stage de 2 à 6 mois
          pour 2026/27.
        </p>
        <RoleTicker />
        <ScrollBadge />
      </div>
      <p className="hero__hint" data-hero-fade aria-hidden="true">
        Cliquez n&apos;importe où ✦
      </p>
    </section>
  );
}
