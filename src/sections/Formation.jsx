import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SectionLabel, SplitWords } from '../components/Split';
import { formations } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useMediaQuery';

export default function Formation() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.edu__line-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.edu', start: 'top 70%', end: 'bottom 60%', scrub: true } },
      );
      gsap.utils.toArray('.edu__item').forEach((item) => {
        gsap.fromTo(
          item.querySelector('.edu__years'),
          { xPercent: -8, opacity: 0 },
          { xPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 85%', once: true } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="formation" className="section formation" ref={root}>
      <div className="container">
        <SectionLabel index={5}>Formation</SectionLabel>
        <h2 className="h2" data-split>
          <SplitWords text="Toujours en apprentissage" />
        </h2>

        <div className="edu">
          <span className="edu__line" aria-hidden="true">
            <span className="edu__line-fill" />
          </span>
          <ol className="edu__list">
          {formations.map((f, i) => (
            <li key={f.degree} className={`edu__item ${i === 0 ? 'is-current' : ''}`} data-reveal>
              <span className="edu__dot" aria-hidden="true" />
              <p className="edu__years">{f.years.replace(' – ', '—')}</p>
              <div className="edu__body">
                <h3 className="edu__degree">{f.degree}</h3>
                <p className="edu__school">{f.school}</p>
              </div>
              {i === 0 && <span className="edu__tag">À venir</span>}
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
