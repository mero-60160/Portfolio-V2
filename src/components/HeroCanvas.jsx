import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';

const readColors = () => {
  const cs = getComputedStyle(document.documentElement);
  return { ink: cs.getPropertyValue('--ink').trim(), accent: cs.getPropertyValue('--accent').trim() };
};

/**
 * Grille de points vivante : ondulation lente, répulsion autour du pointeur
 * et onde de choc au clic. Couleurs lues depuis le thème courant.
 */
export default function HeroCanvas({ className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dots = [];
    let raf = 0;
    let running = false;
    let colors = readColors();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const shocks = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = width < 700 ? 22 : 30;
      dots = [];
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) dots.push({ bx: x, by: y, x, y });
      }
      if (!running) draw(performance.now());
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;

      for (let i = shocks.length - 1; i >= 0; i--) {
        if (time - shocks[i].t > 1600) shocks.splice(i, 1);
      }

      const R = 170;
      const highlighted = [];
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = colors.ink;
      ctx.beginPath();

      for (const d of dots) {
        let tx = d.bx;
        let ty = d.by;
        if (!reduced) ty += Math.sin(d.bx * 0.011 + time * 0.0009) * Math.cos(d.by * 0.013 + time * 0.0007) * 4;

        const dx = d.bx - pointer.x;
        const dy = d.by - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        let glow = 0;
        if (dist < R) {
          const f = 1 - dist / R;
          tx += (dx / dist) * f * f * 52;
          ty += (dy / dist) * f * f * 52;
          glow = f;
        }

        for (const s of shocks) {
          const age = time - s.t;
          const ring = age * 0.9;
          const sdx = d.bx - s.x;
          const sdy = d.by - s.y;
          const sd = Math.hypot(sdx, sdy) || 1;
          const band = 1 - Math.abs(sd - ring) / 60;
          if (band > 0) {
            const power = band * (1 - age / 1600) * 34;
            tx += (sdx / sd) * power;
            ty += (sdy / sd) * power;
            glow = Math.max(glow, band * (1 - age / 1600));
          }
        }

        d.x += (tx - d.x) * (reduced ? 1 : 0.16);
        d.y += (ty - d.y) * (reduced ? 1 : 0.16);

        if (glow > 0.05) highlighted.push(d, glow);
        else ctx.rect(d.x - 0.8, d.y - 0.8, 1.6, 1.6);
      }
      ctx.fill();

      ctx.fillStyle = colors.accent;
      for (let i = 0; i < highlighted.length; i += 2) {
        const d = highlighted[i];
        const g = highlighted[i + 1];
        ctx.globalAlpha = 0.25 + g * 0.75;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 0.9 + g * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (reduced) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        draw(performance.now());
      }
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const onClick = (e) => {
      if (reduced || e.target.closest('a, button')) return;
      const rect = canvas.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      shocks.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() });
    };

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      colors = readColors();
      if (!running) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onVisibility = () => (document.hidden ? stop() : start());

    const host = canvas.parentElement;
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onVisibility);

    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
