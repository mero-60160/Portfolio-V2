import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { SectionLabel, SplitWords } from '../components/Split';
import { experiences, formations, languages, personalInfo, projects } from '../data/portfolio';
import { useReducedMotion } from '../hooks/useMediaQuery';

const STATS = [
  { value: personalInfo.age, label: 'ans' },
  { value: experiences.length, label: 'expériences' },
  { value: projects.length, label: 'projets phares' },
  { value: formations.length, label: 'formations' },
  { value: languages.length, label: 'langues parlées' },
];

export default function About() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Les mots s'allument au fil du défilement
      gsap.fromTo(
        '.about__text .word',
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: { trigger: '.about__text', start: 'top 78%', end: 'bottom 50%', scrub: true },
        },
      );

      // Portrait : révélation par le bas puis parallaxe
      gsap.fromTo(
        '.about__photo-frame',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '.about__photo', start: 'top 80%', once: true },
        },
      );
      gsap.fromTo(
        '.about__photo img',
        { yPercent: -10, scale: 1.25 },
        { yPercent: 10, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true } },
      );

      // Compteurs
      gsap.utils.toArray('.stat__value').forEach((el) => {
        const end = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = String(Math.round(obj.v)).padStart(2, '0')),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="profil" className="section about" ref={root}>
      <div className="container">
        <SectionLabel index={1}>Profil</SectionLabel>

        <div className="about__grid">
          <figure className="about__photo" data-cursor="Salut !">
            <div className="about__photo-frame">
              <img src="/photo.jpg" alt={`Portrait de ${personalInfo.name}`} width="600" height="900" loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <span>{personalInfo.name}</span>
              <span>{personalInfo.location}</span>
            </figcaption>
          </figure>

          <div className="about__content">
            <p className="about__text">
              <SplitWords text={personalInfo.profileText} mask={false} />
            </p>

            <ul className="about__facts" data-reveal>
              <li>{personalInfo.mobility}</li>
              <li>{personalInfo.permis}</li>
              <li>{personalInfo.seekingStage}</li>
            </ul>
          </div>
        </div>

        <dl className="stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat" data-reveal>
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__value" data-value={s.value}>
                {String(s.value).padStart(2, '0')}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
