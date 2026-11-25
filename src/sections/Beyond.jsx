import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SectionLabel, SplitWords } from '../components/Split';
import { centres, languages } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useMediaQuery';

const LEVELS = { Courant: 100, Intermédiaire: 62 };

const GROUPS = [
  { key: 'veille', title: 'Veille tech' },
  { key: 'sports', title: 'Sports' },
  { key: 'cinema', title: 'Cinéma' },
  { key: 'softskills', title: 'Savoir-être' },
];

export default function Beyond() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lang__bar span',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.beyond__langs', start: 'top 80%', once: true } },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="plus" className="section beyond" ref={root}>
      <div className="container">
        <SectionLabel index={6}>Au-delà du code</SectionLabel>
        <h2 className="h2" data-split>
          <SplitWords text="Le reste du temps" />
        </h2>

        <div className="beyond__grid">
          <div className="beyond__langs" data-reveal>
            <h3 className="beyond__title">Langues</h3>
            <ul>
              {languages.map((l) => (
                <li key={l.name} className="lang">
                  <span className="lang__name">{l.name}</span>
                  <span className="lang__level">{l.level}</span>
                  <span className="lang__bar" aria-hidden="true">
                    <span style={{ '--w': `${LEVELS[l.level] ?? 50}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="beyond__travel" data-reveal>
            <h3 className="beyond__title">
              Pays visités <span className="beyond__big tabular">{String(centres.voyage.length).padStart(2, '0')}</span>
            </h3>
            <ul className="beyond__countries">
              {centres.voyage.map((c, i) => (
                <li key={c} style={{ '--i': i }} data-cursor="✈">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {GROUPS.map((g) => (
            <div key={g.key} className="beyond__group" data-reveal>
              <h3 className="beyond__title">{g.title}</h3>
              <ul className="chips">
                {centres[g.key].map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
