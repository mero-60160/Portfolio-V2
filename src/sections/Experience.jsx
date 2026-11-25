import { useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel, SplitWords } from '../components/Split';
import { experiences } from '../data/portfolio';

export default function Experience() {
  const [open, setOpen] = useState(0);

  const toggle = (i) => {
    setOpen((o) => (o === i ? -1 : i));
    // La hauteur change : on recalcule les déclencheurs après la transition
    setTimeout(() => ScrollTrigger.refresh(), 650);
  };

  return (
    <section id="experiences" className="section experience">
      <div className="container">
        <SectionLabel index={3}>Expériences</SectionLabel>
        <h2 className="h2" data-split>
          <SplitWords text="Là où j'ai appris" />
        </h2>

        <ol className="xp">
          {experiences.map((xp, i) => {
            const isOpen = open === i;
            const [company, place] = xp.company.split(' · ');
            return (
              <li key={xp.role} className={`xp__item ${isOpen ? 'is-open' : ''}`} data-reveal>
                <button
                  type="button"
                  className="xp__head"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`xp-panel-${i}`}
                  data-cursor={isOpen ? 'Fermer' : 'Ouvrir'}
                >
                  <span className="xp__index">0{i + 1}</span>
                  <span className="xp__role">{xp.role}</span>
                  <span className="xp__company">
                    {company}
                    {place && <em> · {place}</em>}
                  </span>
                  <span className="xp__dates">{xp.dates}</span>
                  <span className="xp__toggle" aria-hidden="true" />
                </button>
                <div id={`xp-panel-${i}`} className="xp__panel" role="region" aria-label={xp.role}>
                  <div className="xp__panel-inner">
                    <ul>
                      {xp.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
