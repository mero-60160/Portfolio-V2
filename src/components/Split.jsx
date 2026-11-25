import { Fragment } from 'react';

/** Découpe un texte en lettres masquées, pour les animations lettre par lettre. */
export function SplitChars({ text, className = '' }) {
  return (
    <span className={`split ${className}`} aria-hidden="true">
      {Array.from(text).map((c, i) =>
        c === ' ' ? (
          <span key={i} className="char-space">
            {' '}
          </span>
        ) : (
          <span key={i} className="char-mask">
            <span className="char">{c}</span>
          </span>
        ),
      )}
    </span>
  );
}

/** Découpe un texte en mots (masqués ou non) en gardant les espaces lisibles. */
export function SplitWords({ text, mask = true }) {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className={mask ? 'word-mask' : 'word-wrap'}>
        <span className="word">{w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ));
}

export function SectionLabel({ index, children }) {
  return (
    <p className="label" data-reveal>
      <span className="label__index">({String(index).padStart(2, '0')})</span>
      <span className="label__line" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
