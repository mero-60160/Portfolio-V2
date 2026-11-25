import { useEffect, useEffectEvent, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitChars } from './Split';

const skipToExit = (tl) => {
  if (tl && tl.time() < tl.labels.exit) tl.seek('exit');
};

/**
 * Séquence d'entrée : compteur 000→100, nom révélé lettre par lettre,
 * puis le rideau s'ouvre en deux pour dévoiler le site.
 */
export default function Intro({ onReveal, onDone }) {
  const root = useRef(null);
  const counter = useRef(null);
  const timeline = useRef(null);

  const reveal = useEffectEvent(() => onReveal?.());
  const done = useEffectEvent(() => onDone?.());

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const progress = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => done() });

      tl.from('.intro__meta', { opacity: 0, y: 14, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
        .to(
          progress,
          {
            v: 100,
            duration: 2.3,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(progress.v)).padStart(3, '0');
            },
          },
          0.1,
        )
        .to('.intro__bar-fill', { scaleX: 1, duration: 2.3, ease: 'power2.inOut' }, 0.1)
        .from('.intro__word .char', { yPercent: 120, rotate: 8, duration: 1.1, stagger: 0.05, ease: 'expo.out' }, 0.45)
        .from('.intro__tag', { opacity: 0, letterSpacing: '0.8em', duration: 1.2, ease: 'power3.out' }, 0.9)
        .addLabel('exit', 2.55)
        .to('.intro__word .char', { yPercent: -120, duration: 0.7, stagger: 0.025, ease: 'expo.in' }, 'exit')
        .to('.intro__tag, .intro__meta, .intro__counter, .intro__skip, .intro__bar', { opacity: 0, duration: 0.4 }, 'exit')
        .addLabel('open', 'exit+=0.6')
        .call(() => reveal(), null, 'open+=0.15')
        .to('.intro__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 'open')
        .to('.intro__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 'open')
        .to('.intro__flash', { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 'open+=0.08');

      timeline.current = tl;
    }, root);
    return () => ctx.revert();
  }, []);

  const skip = () => skipToExit(timeline.current);

  useEffect(() => {
    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) skipToExit(timeline.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="intro" ref={root} role="status" aria-label="Chargement du portfolio">
      <div className="intro__panel intro__panel--top" />
      <div className="intro__panel intro__panel--bottom" />
      <div className="intro__flash" aria-hidden="true" />

      <div className="intro__content">
        <div className="intro__row">
          <span className="intro__meta">Omer Atici ©2026</span>
          <span className="intro__meta intro__meta--center">Portfolio — V2</span>
          <span className="intro__meta">Amiens, FR</span>
        </div>

        <div className="intro__center">
          <p className="intro__word">
            <SplitChars text="OMER ATICI" />
          </p>
          <p className="intro__tag">Data · Cloud · Fullstack</p>
        </div>

        <div className="intro__row intro__row--bottom">
          <span ref={counter} className="intro__counter">
            000
          </span>
          <button type="button" className="intro__skip" onClick={() => skip()}>
            Passer l&apos;intro →
          </button>
        </div>
        <div className="intro__bar" aria-hidden="true">
          <div className="intro__bar-fill" />
        </div>
      </div>
    </div>
  );
}
