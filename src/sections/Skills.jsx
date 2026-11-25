import { SectionLabel, SplitWords } from '../components/Split';
import { skills } from '../data/portfolio';

const CATEGORIES = {
  data_ia: { title: 'Data & IA', glyph: '◆', size: 'xl' },
  cloud_devops: { title: 'Cloud & DevOps', glyph: '☁', size: 'l' },
  backend: { title: 'Backend', glyph: '⌁', size: 'm' },
  frontend: { title: 'Frontend', glyph: '◐', size: 'm' },
  databases: { title: 'Bases de données', glyph: '▤', size: 'm' },
  tools_mgmt: { title: 'Outils & gestion', glyph: '✦', size: 'wide' },
};

/** Le halo suit le pointeur sur chaque carte. */
const trackSpotlight = (e) => {
  const card = e.target.closest('.bento__card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export default function Skills() {
  return (
    <section id="competences" className="section skills">
      <div className="container">
        <SectionLabel index={4}>Compétences</SectionLabel>
        <h2 className="h2" data-split>
          <SplitWords text="Ma boîte à outils" />
        </h2>

        <div className="bento" onPointerMove={trackSpotlight}>
          {Object.entries(skills).map(([key, list], i) => {
            const cat = CATEGORIES[key] ?? { title: key, glyph: '•', size: 'm' };
            return (
              <article key={key} className={`bento__card bento__card--${cat.size}`} data-reveal>
                <header className="bento__head">
                  <span className="bento__glyph" aria-hidden="true">
                    {cat.glyph}
                  </span>
                  <span className="bento__count tabular">
                    {String(i + 1).padStart(2, '0')} — {list.length} outils
                  </span>
                </header>
                <h3 className="bento__title">{cat.title}</h3>
                <ul className="bento__chips">
                  {list.map((s, j) => (
                    <li key={s} style={{ '--j': j }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
