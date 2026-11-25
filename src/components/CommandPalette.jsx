import { useEffect, useMemo, useRef, useState } from 'react';

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Palette de commandes façon Raycast : navigation, thèmes et actions rapides. */
export default function CommandPalette({ commands, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const list = useRef(null);
  const previousFocus = useRef(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter((c) => normalize(`${c.label} ${c.group} ${c.keywords ?? ''}`).includes(q));
  }, [commands, query]);

  const safeActive = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    previousFocus.current = document.activeElement;
    input.current?.focus();
    return () => previousFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${safeActive}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [safeActive]);

  const run = (cmd) => {
    if (!cmd) return;
    onClose();
    requestAnimationFrame(() => cmd.run());
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((safeActive + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((safeActive - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[safeActive]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="palette" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette__panel" role="dialog" aria-modal="true" aria-label="Palette de commandes">
        <div className="palette__search">
          <span className="palette__prompt" aria-hidden="true">
            ›
          </span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Tapez une commande ou une section…"
            aria-label="Rechercher une commande"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[safeActive] ? `cmd-${results[safeActive].id}` : undefined}
            spellCheck="false"
            autoComplete="off"
          />
          <kbd className="palette__esc">Échap</kbd>
        </div>

        <ul ref={list} id="palette-list" className="palette__list" role="listbox">
          {results.length === 0 && <li className="palette__empty">Aucun résultat pour « {query} »</li>}
          {results.map((cmd, i) => {
            const header = i === 0 || results[i - 1].group !== cmd.group ? cmd.group : null;
            return (
              <li key={cmd.id} role="presentation">
                {header && <p className="palette__group">{header}</p>}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={i === safeActive}
                  data-index={i}
                  className={`palette__item ${i === safeActive ? 'is-active' : ''}`}
                  onPointerMove={() => i !== safeActive && setActive(i)}
                  onClick={() => run(cmd)}
                >
                  <span className="palette__icon" aria-hidden="true" style={cmd.swatch ? { background: cmd.swatch } : undefined}>
                    {cmd.swatch ? '' : cmd.icon}
                  </span>
                  <span className="palette__label">{cmd.label}</span>
                  {cmd.hint && <span className="palette__hint">{cmd.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="palette__footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> naviguer
          </span>
          <span>
            <kbd>Entrée</kbd> exécuter
          </span>
          <span>
            <kbd>T</kbd> thème suivant
          </span>
        </div>
      </div>
    </div>
  );
}
