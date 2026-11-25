import { useEffect, useRef } from 'react';
import { skills } from '../data/portfolio';
import { getLenis } from '../lib/scroll';
import { useReducedMotion } from '../hooks/useMediaQuery';

const ALL = [...new Set(Object.values(skills).flat())];

/** Une rangée infinie dont la vitesse et l'inclinaison réagissent au défilement. */
function MarqueeRow({ items, direction = 1, variant }) {
  const track = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = track.current;
    let x = 0;
    let skew = 0;
    let raf = 0;
    let visible = false;

    const loop = () => {
      const velocity = getLenis()?.velocity ?? 0;
      x -= (0.6 + Math.abs(velocity) * 0.35) * direction;
      const half = el.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      skew += (Math.max(-12, Math.min(12, velocity * -0.6)) - skew) * 0.1;
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(el.parentElement);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [direction, reduced]);

  const sequence = items.map((item, i) => (
    <span key={i} className="marquee__item">
      {item}
      <span className="marquee__sep" aria-hidden="true">
        ✦
      </span>
    </span>
  ));

  return (
    <div className={`marquee__row marquee__row--${variant}`}>
      <div ref={track} className="marquee__track">
        <div className="marquee__group">{sequence}</div>
        <div className="marquee__group" aria-hidden="true">
          {sequence}
        </div>
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Technologies maîtrisées">
      <MarqueeRow items={ALL} direction={1} variant="solid" />
      <MarqueeRow items={[...ALL].reverse()} direction={-1} variant="outline" />
    </section>
  );
}
