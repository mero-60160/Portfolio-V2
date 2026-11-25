import { useRef } from 'react';
import { SectionLabel, SplitWords } from '../components/Split';
import { personalInfo } from '../data/portfolio';
import { scrollToTarget } from '../lib/scroll';
import { useMagnetic } from '../hooks/useMagnetic';

const LINKS = [
  { label: 'LinkedIn', value: personalInfo.linkedin.value, href: personalInfo.linkedin.url, external: true },
  { label: 'GitHub', value: `@${personalInfo.github.value}`, href: personalInfo.github.url, external: true },
  { label: 'Téléphone', value: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/\s/g, '')}` },
  { label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
];

export default function Contact({ onCopyEmail }) {
  const cta = useRef(null);
  useMagnetic(cta, 0.25);

  return (
    <section id="contact" className="contact">
      <div className="container">
        <SectionLabel index={7}>Contact</SectionLabel>

        <h2 className="contact__title" data-split>
          <span className="contact__line">
            <SplitWords text="Construisons" />
          </span>
          <span className="contact__line contact__line--serif">
            <SplitWords text="quelque chose" />
          </span>
          <span className="contact__line">
            <SplitWords text="ensemble." />
          </span>
        </h2>

        <div className="contact__cta" data-reveal>
          <button ref={cta} type="button" className="contact__email" onClick={onCopyEmail} data-cursor="Copier">
            <span className="contact__email-text">{personalInfo.email}</span>
            <span className="contact__email-icon" aria-hidden="true">
              ⧉
            </span>
          </button>
          <p className="contact__note">
            <span className="pulse" aria-hidden="true" />
            {personalInfo.seekingStage} · {personalInfo.mobility}
          </p>
        </div>

        <ul className="contact__links">
          {LINKS.map((l) => (
            <li key={l.label} data-reveal>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="contact__link"
                data-cursor="Ouvrir"
              >
                <span className="contact__link-label">{l.label}</span>
                <span className="contact__link-value">{l.value}</span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer">
        <p className="footer__giant" aria-hidden="true">
          OMER ATICI
        </p>
        <div className="footer__bar container">
          <span>© {new Date().getFullYear()} {personalInfo.name}</span>
          <span className="footer__hint">
            <kbd>Ctrl</kbd>
            <kbd>K</kbd> pour tout explorer
          </span>
          <button type="button" className="footer__top" onClick={() => scrollToTarget(0)} data-cursor="Haut">
            Retour en haut ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
