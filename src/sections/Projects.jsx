import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel, SplitWords } from '../components/Split';
import { personalInfo, projects } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Visuels génératifs, un par projet ---------- */

function CrmVisual() {
  const bars = [38, 62, 45, 80, 58, 92, 70, 100];
  return (
    <div className="viz viz--crm" aria-hidden="true">
      <div className="viz__window">
        <div className="viz__chrome">
          <i />
          <i />
          <i />
          <span>dashboard.vue</span>
        </div>
        <div className="crm">
          <div className="crm__tiles">
            {['Clients', 'Devis', 'Factures'].map((t) => (
              <div key={t} className="crm__tile">
                <span>{t}</span>
                <b />
              </div>
            ))}
          </div>
          <div className="crm__chart">
            {bars.map((h, i) => (
              <span key={i} style={{ '--h': `${h}%`, '--i': i }} />
            ))}
          </div>
          <div className="crm__rows">
            {[0, 1, 2].map((i) => (
              <div key={i} className="crm__row" style={{ '--i': i }}>
                <i />
                <b />
                <em>PDF</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonitoringVisual({ status }) {
  const path = 'M0,70 L40,62 L80,66 L120,40 L160,48 L200,22 L240,34 L280,18 L320,30 L360,12 L400,20';
  return (
    <div className="viz viz--monitor" aria-hidden="true">
      <div className="monitor__head">
        <span className="pulse" />
        <span>{status}</span>
      </div>
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="monitor__chart">
        <path d={`${path} L400,90 L0,90 Z`} className="monitor__area" />
        <path d={path} className="monitor__line" pathLength="1" />
      </svg>
      <div className="monitor__grid">
        {['Prometheus', 'Grafana', 'AlertManager'].map((s, i) => (
          <div key={s} className="monitor__cell" style={{ '--i': i }}>
            <span>{s}</span>
            <b>UP</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockerVisual() {
  return (
    <div className="viz viz--locker" aria-hidden="true">
      <div className="locker">
        <div className="locker__node">
          <span className="locker__icon">▯</span>
          <span>iPhone</span>
        </div>
        <div className="locker__wire">
          <i />
          <i />
        </div>
        <div className="locker__node locker__node--relay">
          <span className="locker__icon">◎</span>
          <span>Relais WS</span>
        </div>
        <div className="locker__wire">
          <i />
          <i />
        </div>
        <div className="locker__node">
          <span className="locker__icon locker__lock">
            <svg viewBox="0 0 24 24">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" className="locker__shackle" />
            </svg>
          </span>
          <span>macOS</span>
        </div>
      </div>
      <p className="locker__log">
        <span>› lock --remote</span>
        <span className="locker__ok">✓ verrouillé</span>
      </p>
    </div>
  );
}

const VISUALS = [CrmVisual, MonitoringVisual, LockerVisual];

function ProjectCard({ project, index, total }) {
  const Visual = VISUALS[index % VISUALS.length];
  const [name, subtitle] = project.name.split(' — ');
  return (
    <article className="project">
      <div className="project__info">
        <header className="project__top">
          <span className="project__code">{project.code}</span>
          <span className="project__status">
            <span className="pulse" aria-hidden="true" />
            {project.status}
          </span>
        </header>

        <p className="project__num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
          <span>/{String(total).padStart(2, '0')}</span>
        </p>

        <h3 className="project__title">
          {name}
          {subtitle && <em>{subtitle}</em>}
        </h3>
        <p className="project__slug">{project.slug}</p>

        <ul className="project__tech" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <ul className="project__points">
          {project.points.slice(0, 3).map((p) => {
            const [title, ...rest] = p.split(' : ');
            return (
              <li key={p}>
                {rest.length ? (
                  <>
                    <strong>{title}</strong> {rest.join(' : ')}
                  </>
                ) : (
                  p
                )}
              </li>
            );
          })}
        </ul>

        <a className="project__link" href={project.github} target="_blank" rel="noopener noreferrer" data-cursor="GitHub">
          Voir le code <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="project__visual">
        <Visual status={project.status} />
      </div>
    </article>
  );
}

export default function Projects() {
  const root = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const counter = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.project, .project-end', track.current);
      const distance = () => track.current.scrollWidth - viewport.current.clientWidth;

      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            if (counter.current) {
              const i = Math.min(projects.length, Math.floor(self.progress * projects.length) + 1);
              counter.current.textContent = String(i).padStart(2, "0");
            }
          },
        },
      });

      // Parallaxe et inclinaison des cartes pendant le défilement horizontal
      cards.forEach((card) => {
        const visual = card.querySelector('.project__visual');
        if (visual) {
          gsap.fromTo(
            visual,
            { xPercent: 10 },
            { xPercent: -10, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
          );
        }
        gsap.fromTo(
          card,
          { rotate: 2.5, scale: 0.92, opacity: 0.4 },
          {
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 35%', scrub: true },
          },
        );
      });
    });

    mm.add('(max-width: 959px), (prefers-reduced-motion: reduce)', () => {
      if (bar.current) bar.current.style.transform = 'scaleX(1)';
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projets" className="projects" ref={root}>
      <div className="projects__head container">
        <SectionLabel index={2}>Projets sélectionnés</SectionLabel>
        <h2 className="h2" data-split>
          <SplitWords text="Ce que j'ai construit" />
        </h2>
        <div className="projects__progress" aria-hidden="true">
          <span ref={counter} className="tabular">
            01
          </span>
          <span className="projects__progress-bar">
            <span ref={bar} />
          </span>
          <span className="tabular">{String(projects.length).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="projects__viewport" ref={viewport}>
        <div className="projects__track" ref={track}>
          {projects.map((p, i) => (
            <ProjectCard key={p.code} project={p} index={i} total={projects.length} />
          ))}
          <a className="project-end" href={personalInfo.github.url} target="_blank" rel="noopener noreferrer" data-cursor="GitHub">
            <span className="project-end__kicker">Et ce n&apos;est pas tout</span>
            <span className="project-end__title">
              Plus de code
              <br />
              sur GitHub
            </span>
            <span className="project-end__handle">@{personalInfo.github.value} ↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
