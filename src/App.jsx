import { useEffect, useRef, useState } from 'react';
import './index.css';
import {
  personalInfo,
  experiences,
  projects,
  formations,
  skills,
  languages,
  centres,
} from './data/portfolio';

// ===== ICONS =====
const Icon = ({ name }) => {
  const icons = {
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 .77h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.36a16 16 0 006.73 6.73l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    terminal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    play: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ===== UNIFIED MOTION DESIGN ENGINE (INTRO -> PORTAL SWITCH -> 30s SEAMLESS BG LOOP) =====
const INTRO_STATUS = [
  'BOOTING DATA PIPELINES',
  'MOUNTING DEV & CLOUD STACK',
  'DECODING OMER_ATICI.DEV',
  'CALIBRATING 3D WORKSPACE',
  'PORTAL READY // LAUNCHING',
];

const CIPHER_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>';
const LOOP_DURATION_MS = 30000;
const INTRO_DURATION_MS = 4600;
const SWITCH_DURATION_MS = 1350;

function MotionDesignEngine({ siteRef }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    phase: 'intro', // 'intro' | 'switch' | 'ambient'
    introStart: 0,
    switchStart: 0,
    ambientStart: 0,
    progress: 0,
  });

  const [uiPhase, setUiPhase] = useState('intro'); // 'intro' | 'switch' | 'ambient'
  const [progress, setProgress] = useState(1);
  const [decodedTitle, setDecodedTitle] = useState('##########');

  const triggerSwitch = () => {
    const st = stateRef.current;
    if (st.phase !== 'intro') return;
    st.phase = 'switch';
    st.switchStart = performance.now();
    st.progress = 100;
    setProgress(100);
    setDecodedTitle('OMER ATICI');
    setUiPhase('switch');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const unlockSite = () => {
      document.body.style.overflow = '';
      if (siteRef.current) {
        siteRef.current.style.clipPath = '';
        siteRef.current.style.pointerEvents = 'auto';
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stateRef.current.phase = 'ambient';
      setUiPhase('ambient');
      unlockSite();
      return;
    }

    // Lock scroll & clip site to 0px circle at viewport center during intro
    document.body.style.overflow = 'hidden';
    if (siteRef.current) {
      const initY = window.innerHeight / 2 + (window.scrollY || 0);
      siteRef.current.style.clipPath = `circle(0px at 50% ${initY}px)`;
      siteRef.current.style.pointerEvents = 'none';
    }

    const ctx = canvas.getContext('2d');
    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999 };
    const ripples = [];

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onClick = (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 6, alpha: 0.42 });
    };
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        triggerSwitch();
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    window.addEventListener('keydown', onKey);

    // 3D Warp Stars for Intro
    const stars = Array.from({ length: 220 }, () => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * 1400 + 80,
      pz: 1400,
      angle: Math.random() * Math.PI * 2,
    }));

    // Seamless 30s Harmonic Nodes for Ambient Background
    const ambientNodes = Array.from({ length: 56 }, (_, idx) => ({
      bx: (idx % 8) / 7,
      by: Math.floor(idx / 8) / 6,
      fx: (idx % 3) + 1, // integer harmonics guarantee exact 30s loop
      fy: ((idx + 1) % 3) + 1,
      phase: (idx / 56) * Math.PI * 2,
      ampX: 35 + (idx % 5) * 14,
      ampY: 30 + (idx % 4) * 16,
      r: 1.3 + (idx % 3) * 0.65,
      ox: 0,
      oy: 0,
    }));

    stateRef.current.introStart = performance.now();
    const targetName = 'OMER ATICI';

    const drawIntroScene = (now, tIntro) => {
      // Trail fade in deep obsidian
      ctx.fillStyle = 'rgba(5, 5, 7, 0.36)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const compression = tIntro > 0.78 ? (tIntro - 0.78) / 0.22 : 0;
      const speed = 11 + tIntro * 30 + compression * 42;

      // Perspective cyber horizon lines
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + tIntro * 0.05})`;
      ctx.lineWidth = 1;
      for (let g = -5; g <= 5; g++) {
        ctx.beginPath();
        ctx.moveTo(cx + g * 40, cy);
        ctx.lineTo(cx + g * 280, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + g * 40, cy);
        ctx.lineTo(cx + g * 280, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Spiral Warp Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;
        s.angle += 0.006 + tIntro * 0.012;

        if (s.z <= 10) {
          s.x = (Math.random() - 0.5) * 2200;
          s.y = (Math.random() - 0.5) * 1600;
          s.z = 1400;
          s.pz = 1400;
        }

        const pull = 1 - compression * 0.65;
        const sx = cx + ((s.x * pull) / s.z) * 440;
        const sy = cy + ((s.y * pull) / s.z) * 440;
        const px = cx + ((s.x * pull) / s.pz) * 440;
        const py = cy + ((s.y * pull) / s.pz) * 440;

        const alpha = Math.min(1, (1 - s.z / 1400) * 1.25);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = Math.max(0.7, (1 - s.z / 1400) * 2.5);
        ctx.stroke();
      }

      // Kinetic Motion Design Waveform Ring around center
      const ringRadius = Math.min(w, h) * (0.24 - compression * 0.14);
      const bars = 64;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(now * 0.0005);
      for (let b = 0; b < bars; b++) {
        const a = (b / bars) * Math.PI * 2;
        const wave = Math.sin(b * 0.45 + now * 0.006) * (10 + tIntro * 22);
        const r1 = ringRadius;
        const r2 = ringRadius + Math.abs(wave) + 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + (b % 2) * 0.25})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawAmbientLoop = (now) => {
      const st = stateRef.current;
      const elapsed = now - st.ambientStart;
      // Exact 30-second periodic parameter [0, 1)
      const cycle = ((elapsed % LOOP_DURATION_MS) + LOOP_DURATION_MS) % LOOP_DURATION_MS / LOOP_DURATION_MS;
      const twoPi = Math.PI * 2;
      const scrollShift = (window.scrollY || 0) * 0.08;

      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural grid with slow breathing opacity
      const gridAlpha = 0.025 + Math.sin(cycle * twoPi * 2) * 0.01;
      ctx.strokeStyle = `rgba(9, 9, 11, ${gridAlpha})`;
      ctx.lineWidth = 1;
      const step = 64;
      for (let gx = 0; gx < w; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = -((scrollShift) % step); gy < h; gy += step) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // 1) Giant 30s Orbital Filigree Rings in Motion
      const cx = w * 0.5;
      const cy = h * 0.48 - (scrollShift % 120) * 0.25;
      const baseR = Math.min(w, h) * 0.36;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(cycle * twoPi);
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, twoPi);
      ctx.setLineDash([8, 16]);
      ctx.strokeStyle = 'rgba(9, 9, 11, 0.075)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.rotate(-cycle * twoPi * 3);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.72, 0, Math.PI * 1.45);
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(9, 9, 11, 0.09)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();

      // 2) Flowing 30s Harmonic Sinusoidal Motion Ribbons
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const yBase = h * (0.25 + layer * 0.18);
        const amp = 28 + layer * 10;
        const harmonic = layer + 1;
        for (let x = 0; x <= w; x += 18) {
          const nx = x / w;
          const y =
            yBase +
            Math.sin(nx * twoPi * 1.5 + cycle * twoPi * harmonic + layer) * amp +
            Math.cos(nx * twoPi * 2 - cycle * twoPi) * (amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(9, 9, 11, ${0.045 + layer * 0.014})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // 3) 30s Orbital Constellation Nodes + Magnetic Cursor Interaction
      for (let i = 0; i < ambientNodes.length; i++) {
        const n = ambientNodes[i];
        const targetX =
          n.bx * w + Math.cos(cycle * twoPi * n.fx + n.phase) * n.ampX;
        const targetY =
          n.by * h + Math.sin(cycle * twoPi * n.fy + n.phase) * n.ampY;

        // Magnetic repulsion offset
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const distM = Math.hypot(dx, dy);
        if (distM < 150 && distM > 1) {
          const push = ((150 - distM) / 150) * 26;
          n.ox += ((dx / distM) * push - n.ox) * 0.14;
          n.oy += ((dy / distM) * push - n.oy) * 0.14;
        } else {
          n.ox *= 0.92;
          n.oy *= 0.92;
        }

        n.px = targetX + n.ox;
        n.py = targetY + n.oy;

        if (distM < 190) {
          ctx.beginPath();
          ctx.moveTo(n.px, n.py);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(9, 9, 11, ${(1 - distM / 190) * 0.22})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r, 0, twoPi);
        ctx.fillStyle = 'rgba(9, 9, 11, 0.26)';
        ctx.fill();

        for (let j = i + 1; j < ambientNodes.length; j++) {
          const m = ambientNodes[j];
          if (m.px === undefined) continue;
          const d = Math.hypot(n.px - m.px, n.py - m.py);
          if (d < 135) {
            ctx.beginPath();
            ctx.moveTo(n.px, n.py);
            ctx.lineTo(m.px, m.py);
            ctx.strokeStyle = `rgba(9, 9, 11, ${(1 - d / 135) * 0.1})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 4) Interactive Click Shockwave Ripples
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rp = ripples[k];
        rp.r += 5.5;
        rp.alpha *= 0.93;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, twoPi);
        ctx.strokeStyle = `rgba(9, 9, 11, ${rp.alpha})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
        if (rp.alpha < 0.02) ripples.splice(k, 1);
      }
    };

    const tick = (now) => {
      const st = stateRef.current;

      if (st.phase === 'intro') {
        const elapsed = now - st.introStart;
        const t = Math.min(1, elapsed / INTRO_DURATION_MS);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pct = Math.max(1, Math.round(eased * 100));

        if (pct !== st.progress) {
          st.progress = pct;
          setProgress(pct);
        }

        const lockIndex = Math.floor(Math.max(0, (t - 0.18) / 0.68) * targetName.length);
        setDecodedTitle(
          targetName
            .split('')
            .map((ch, idx) => {
              if (ch === ' ') return ' ';
              if (idx < lockIndex) return ch;
              return CIPHER_POOL[Math.floor(Math.random() * CIPHER_POOL.length)];
            })
            .join('')
        );

        drawIntroScene(now, t);

        if (t >= 1) {
          triggerSwitch();
        }
      } else if (st.phase === 'switch') {
        const elapsed = now - st.switchStart;
        const t = Math.min(1, elapsed / SWITCH_DURATION_MS);
        // Smooth cubic out portal expansion
        const eased = 1 - Math.pow(1 - t, 3);
        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = Math.hypot(cx, cy) * 1.15;
        const portalR = eased * maxRadius;

        if (!st.ambientStart) st.ambientStart = now;

        // Draw closing dark intro scene underneath
        drawIntroScene(now, 1);

        // Inside the expanding circular portal, reveal the live 30s ambient motion design!
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, portalR, 0, Math.PI * 2);
        ctx.clip();
        drawAmbientLoop(now);
        ctx.restore();

        // Synchronize the real portfolio viewport directly to the exact same expanding circle!
        if (siteRef.current) {
          const siteCenterY = cy + (window.scrollY || 0);
          siteRef.current.style.clipPath = `circle(${portalR}px at ${cx}px ${siteCenterY}px)`;
        }

        // Crisp shockwave ring along the portal boundary
        ctx.beginPath();
        ctx.arc(cx, cy, portalR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - t * 0.65})`;
        ctx.lineWidth = Math.max(2, 14 * (1 - t));
        ctx.stroke();

        // Secondary echo shockwave
        if (portalR > 40) {
          ctx.beginPath();
          ctx.arc(cx, cy, portalR * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(9, 9, 11, ${(1 - t) * 0.25})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (t >= 1) {
          st.phase = 'ambient';
          setUiPhase('ambient');
          unlockSite();
        }
      } else {
        drawAmbientLoop(now);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      unlockSite();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusIndex = Math.min(
    INTRO_STATUS.length - 1,
    Math.floor((progress / 100) * INTRO_STATUS.length)
  );

  return (
    <>
      <canvas ref={canvasRef} className="motion-master-canvas" aria-hidden="true" />

      {uiPhase !== 'ambient' && (
        <div
          className={`motion-hud-overlay${uiPhase === 'switch' ? ' is-switching' : ''}`}
          aria-hidden="true"
        >
          <div className="loader-hud-tl">
            <span className="pulse-dot-light" />
            <span>OA_MOTION // 30S_ENGINE</span>
          </div>

          <button type="button" className="loader-skip" onClick={triggerSwitch}>
            SKIP [ESC] →
          </button>

          <div className="loader-hud-bl">
            <span>LAT 49.8941° N · LON 2.2958° E</span>
          </div>

          <div className="loader-hud-br">
            <div className="loader-eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <span>SYNC: {progress}%</span>
          </div>

          <div className="loader-stage">
            <div className="loader-gyro">
              <svg className="gyro-svg gyro-outer" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="122" strokeDasharray="6 10" />
                <circle cx="130" cy="130" r="108" strokeDasharray="80 260" className="gyro-arc" />
              </svg>
              <svg className="gyro-svg gyro-inner" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="88" strokeDasharray="3 8" />
                <circle cx="130" cy="130" r="74" strokeDasharray="46 180" className="gyro-arc-bright" />
              </svg>
              <div className="loader-core-orb">
                <span className="loader-monogram">OA</span>
              </div>
            </div>

            <div className="loader-title-wrap">
              <div className="loader-decoded-name">{decodedTitle}</div>
              <div className="loader-subtitle">
                DATA ENGINEERING · CLOUD ARCHITECTURE · FULLSTACK
              </div>
            </div>

            <div className="loader-meter">
              <div className="loader-meter-head">
                <span>&gt;_ {INTRO_STATUS[statusIndex]}</span>
                <span className="loader-counter-mono">{progress}%</span>
              </div>
              <div className="loader-bar-track">
                <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== 3D TILT CARD WRAPPER =====
function TiltCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null);

  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 5;
    const rotateX = ((cy - y) / cy) * 5;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

// ===== MAGNETIC BUTTON =====
function MagneticLink({ href, className, children, ...props }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </a>
  );
}

// ===== SCRAMBLE TEXT (CIPHER DECODE) =====
const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#$/*<>[]';

function ScrambleText({ text, triggerOnView = true }) {
  const [display, setDisplay] = useState(text);
  const elRef = useRef(null);
  const timerRef = useRef(null);

  const runScramble = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    clearInterval(timerRef.current);
    let iteration = 0;
    timerRef.current = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join('')
      );
      iteration += 0.65;
      if (iteration >= text.length) {
        clearInterval(timerRef.current);
        setDisplay(text);
      }
    }, 26);
  };

  useEffect(() => {
    if (!triggerOnView) {
      runScramble();
      return () => clearInterval(timerRef.current);
    }
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runScramble();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span ref={elRef} onMouseEnter={runScramble} className="scramble-text">
      {display}
    </span>
  );
}

// ===== ROLE CYCLER TYPEWRITER =====
const HERO_ROLES = [
  'Développeur Fullstack',
  'Data Engineer (En devenir)',
  'Cloud & DevOps Builder',
  'Chef de projet Développement & Data',
];

function RoleTypewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState(HERO_ROLES[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function loop() {
      let idx = 0;
      while (!cancelled) {
        const target = HERO_ROLES[idx];
        for (let i = 0; i <= target.length; i++) {
          if (cancelled) return;
          setText(target.slice(0, i));
          await sleep(42);
        }
        await sleep(1600);
        for (let i = target.length; i >= 0; i--) {
          if (cancelled) return;
          setText(target.slice(0, i));
          await sleep(22);
        }
        idx = (idx + 1) % HERO_ROLES.length;
        setRoleIdx(idx);
        await sleep(200);
      }
    }

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <p className="hero-title" data-role-idx={roleIdx}>
      <span className="hero-title-prefix">&gt;_</span> {text}
      <span className="term-cursor-dark" />
    </p>
  );
}

// ===== SCROLL ANIMATION HOOK =====
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ===== INTERACTIVE TERMINAL CONSOLE =====
const BOOT_SEQUENCE = [
  { cmd: 'whoami --verbose', out: 'Omer Atici // Développeur Fullstack & Chef de projet Data (Bac+3)' },
  { cmd: 'cat status.json', out: '{ "availability": "Stage 2-6 mois (2026/2027)", "location": "Amiens, FR" }' },
  { cmd: 'ls ./core-stack', out: 'Python/  BigData/  Docker/  PostgreSQL/  React/  Node.js/  Cloud/' },
];

function InteractiveTerminal() {
  const [lines, setLines] = useState([]);
  const [typingCmd, setTypingCmd] = useState('');
  const [bootDone, setBootDone] = useState(false);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLines(
        BOOT_SEQUENCE.flatMap((step) => [
          { type: 'cmd', text: step.cmd },
          { type: 'out', text: step.out },
        ])
      );
      setBootDone(true);
      return;
    }

    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function runBoot() {
      await sleep(300);
      for (const step of BOOT_SEQUENCE) {
        if (cancelled) return;
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return;
          setTypingCmd(step.cmd.slice(0, i));
          await sleep(24);
        }
        await sleep(120);
        if (cancelled) return;
        setTypingCmd('');
        setLines((prev) => [
          ...prev,
          { type: 'cmd', text: step.cmd },
          { type: 'out', text: step.out },
        ]);
        await sleep(180);
      }
      if (!cancelled) setBootDone(true);
    }

    runBoot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, typingCmd]);

  const executeCommand = (raw) => {
    const clean = raw.trim().toLowerCase();
    if (!clean) return;

    if (clean === 'clear') {
      setLines([]);
      return;
    }

    const responses = {
      help: [
        'Commandes disponibles :',
        '  whoami    → Profil & recherche de stage',
        '  projects  → Lister & scroller vers les projets',
        '  stack     → Compétences techniques',
        '  contact   → Coordonnées directes',
        '  clear     → Vider le terminal',
      ],
      whoami: [
        `${personalInfo.name} — ${personalInfo.age} ans (${personalInfo.location})`,
        'Formation : Bac+3 Chef de projet Développement & Data (La Manu)',
        `Statut    : ${personalInfo.seekingStage}`,
      ],
      projects: [
        ...projects.map((p) => `[${p.code}] ${p.name} (${p.status})`),
        '→ Scroll vers #projets...',
      ],
      stack: [
        `Data & IA : ${skills.data_ia.join(', ')}`,
        `Cloud     : ${skills.cloud_devops.join(', ')}`,
        `Backend   : ${skills.backend.join(', ')}`,
        `Frontend  : ${skills.frontend.join(', ')}`,
      ],
      contact: [
        `Email    : ${personalInfo.email}`,
        `Tél      : ${personalInfo.phone}`,
        `GitHub   : ${personalInfo.github.url}`,
        `LinkedIn : ${personalInfo.linkedin.url}`,
      ],
    };

    const output = responses[clean] || [
      `zsh: command not found: ${clean}. Tape "help" pour la liste.`,
    ];

    setLines((prev) => [
      ...prev,
      { type: 'cmd', text: raw.trim() },
      ...output.map((o) => ({ type: 'out', text: o })),
    ]);

    if (clean === 'projects') {
      document.getElementById('projets')?.scrollIntoView({ behavior: 'smooth' });
    } else if (clean === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (clean === 'stack') {
      document.getElementById('competences')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  return (
    <div className="terminal-shell fade-in fade-in-delay-4" data-cursor="INTERACT">
      <div className="terminal-topbar">
        <div className="terminal-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="terminal-title">omer-atici@data-dev:~ — zsh</div>
        <div className="terminal-badge">
          <span className="pulse-dot-light" /> LIVE SHELL
        </div>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i} className={`term-line term-${line.type}`}>
            {line.type === 'cmd' ? (
              <>
                <span className="term-prompt">omer@portfolio:~$</span> {line.text}
              </>
            ) : (
              <span className="term-out-text">{line.text}</span>
            )}
          </div>
        ))}

        {!bootDone && (
          <div className="term-line term-cmd">
            <span className="term-prompt">omer@portfolio:~$</span> {typingCmd}
            <span className="term-cursor-light" />
          </div>
        )}

        {bootDone && (
          <form onSubmit={handleSubmit} className="term-input-row">
            <label htmlFor="cli-input" className="term-prompt">
              omer@portfolio:~$
            </label>
            <input
              id="cli-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='tape "help", "projects", "stack" ou clique ci-dessous...'
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        )}
      </div>

      <div className="terminal-quickbar">
        {['help', 'whoami', 'projects', 'stack', 'contact', 'clear'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            className="term-quick-btn"
            onClick={() => executeCommand(cmd)}
          >
            $ {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== KINETIC MARQUEE BANNER =====
function KineticMarquee() {
  const items = [
    'DATA ENGINEERING',
    'CLOUD ARCHITECTURE',
    'FULLSTACK DEVELOPMENT',
    'DOCKER & DEVOPS',
    'POSTGRESQL · PRISMA',
    'PYTHON · BIG DATA · IA',
    'STAGE 2026 / 2027',
  ];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((txt, i) => (
          <span className="marquee-item" key={i}>
            {txt} <span className="marquee-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== NAVBAR =====
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navItems = [
    { num: '01', label: 'Profil', id: 'profil' },
    { num: '02', label: 'Expériences', id: 'experiences' },
    { num: '03', label: 'Projets', id: 'projets' },
    { num: '04', label: 'Compétences', id: 'competences' },
    { num: '05', label: 'Formation', id: 'formation' },
    { num: '06', label: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="navbar-progress" style={{ width: `${scrollProgress}%` }} />
      <a href="#profil" className="navbar-logo">
        <span className="logo-bracket">[</span>
        OA<span className="logo-slash">//</span>DATA·DEV
        <span className="logo-bracket">]</span>
      </a>
      <button
        className={`navbar-toggle${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
              <span className="nav-index">{item.num}.</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="navbar-status" aria-hidden="true">
        <span className="pulse-dot-dark" />
        <span>DISPO STAGE 2026</span>
      </div>
    </nav>
  );
}

// ===== HERO =====
function Hero() {
  return (
    <section id="profil" className="hero">
      <div className="hero-hud-grid" aria-hidden="true" />
      <div className="hero-container">
        <div className="hero-grid">
          {/* Photo Full-Color 3D HUD Card */}
          <div className="hero-photo-stage fade-in">
            <TiltCard className="hero-photo-card" cursorTag="OMER">
              <div className="hero-photo-orbit" aria-hidden="true" />
              <div className="hero-photo-frame">
                <img
                  src="/photo.jpg"
                  alt="Omer Atici"
                  width="600"
                  height="900"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="hero-photo-glare" aria-hidden="true" />
              </div>
              <div className="floating-chip chip-top-left">⚡ Fullstack</div>
              <div className="floating-chip chip-bottom-right">☁️ Data &amp; Cloud</div>
            </TiltCard>
            <div className="hero-hud-tag">
              <span className="pulse-dot-dark" /> AMIENS, FR // {personalInfo.age} ANS
            </div>
          </div>

          {/* Content */}
          <div className="hero-content">
            <div className="hero-eyebrow fade-in fade-in-delay-1">
              <span className="eyebrow-pill">DATA &amp; DEV</span>
              <span>DATA ENGINEERING · CLOUD ARCHITECTURE</span>
            </div>
            <h1 className="hero-name fade-in fade-in-delay-1">
              <ScrambleText text="Omer" triggerOnView={false} />{' '}
              <span className="hero-name-outline">
                <ScrambleText text="Atici" triggerOnView={false} />
              </span>
            </h1>
            <RoleTypewriter />
            <div className="hero-badge fade-in fade-in-delay-2">
              <span className="pulse-dot-light" />
              {personalInfo.seekingStage}
            </div>
            <p className="hero-profile fade-in fade-in-delay-3">
              {personalInfo.profileText}
            </p>

            <div className="hero-contact-row fade-in fade-in-delay-3">
              <a href={`tel:${personalInfo.phone}`} className="contact-chip">
                <Icon name="phone" /> {personalInfo.phone}
              </a>
              <a href={`mailto:${personalInfo.email}`} className="contact-chip">
                <Icon name="mail" /> {personalInfo.email}
              </a>
              <span className="contact-chip">
                <Icon name="location" /> {personalInfo.location}
              </span>
              <span className="contact-chip">
                <Icon name="calendar" /> {personalInfo.birthDate}
              </span>
            </div>

            <div className="hero-cta fade-in fade-in-delay-4">
              <MagneticLink href="#contact" className="btn-primary" data-cursor="GO">
                <Icon name="terminal" /> Initialiser le contact
              </MagneticLink>
              <MagneticLink
                href="/cv.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                data-cursor="PDF"
              >
                <Icon name="download" /> Voir le CV
              </MagneticLink>
            </div>
          </div>
        </div>

        <InteractiveTerminal />
      </div>
    </section>
  );
}

// ===== EXPERIENCE =====
function Experience() {
  return (
    <section id="experiences" className="section">
      <div className="section-header reveal">
        <div className="section-label">02 // Parcours professionnel</div>
        <h2 className="section-title">
          <ScrambleText text="Expériences" />
        </h2>
        <div className="section-divider" />
      </div>
      <div className="exp-timeline">
        {experiences.map((exp, i) => (
          <div
            className="exp-item reveal"
            key={i}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="exp-badge">
              <span>0{i + 1}</span>
            </div>
            <TiltCard className="exp-content">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />
              <div className="exp-header">
                <div className="exp-title-box">
                  <span className="exp-role">{exp.role}</span>
                  <span className="exp-company">{exp.company}</span>
                </div>
                <span className="exp-date">{exp.dates}</span>
              </div>
              <ul className="exp-tasks">
                {exp.tasks.map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== INTERACTIVE PROJECT CARD =====
const PROJECT_SIMULATIONS = {
  PRJ_01: [
    '$ npm run build && docker compose up -d',
    '[OK] PostgreSQL + Prisma migrations applied',
    '[OK] Express API + JWT auth listening on :4000',
    '[OK] Vue.js 3 dashboard ready (latency: 18ms)',
  ],
  PRJ_02: [
    '$ promtool check config prometheus.yml',
    '[OK] Scraping 14 active targets (99.98% uptime)',
    '[OK] Grafana dashboards synced · 0 critical alerts',
  ],
  PRJ_03: [
    '$ docker compose up mac-locker-relay',
    '[OK] WebSocket tunnel active (wss://relay.local)',
    '[OK] iOS Remote ↔ macOS Agent paired (RTT: 4ms)',
  ],
};

function ProjectCard({ proj, index }) {
  const [simLogs, setSimLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const runSimulation = () => {
    if (running) return;
    const logs = PROJECT_SIMULATIONS[proj.code] || ['[OK] System ready'];
    setSimLogs([]);
    setRunning(true);

    logs.forEach((line, idx) => {
      setTimeout(() => {
        setSimLogs((prev) => [...prev, line]);
        if (idx === logs.length - 1) setRunning(false);
      }, idx * 280);
    });
  };

  return (
    <TiltCard
      className={`project-card-new reveal${index === 0 ? ' pcn-featured' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      cursorTag="OPEN"
    >
      <span className="hud-corner-light tl" />
      <span className="hud-corner-light tr" />
      <span className="hud-corner-light bl" />
      <span className="hud-corner-light br" />

      {/* Terminal Window Bar */}
      <div className="pcn-window-bar">
        <div className="terminal-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="pcn-filepath">~/projects/{proj.slug}</span>
        <span className="pcn-status">
          <span className="pulse-dot-light" /> {proj.status}
        </span>
      </div>

      {/* Header */}
      <div className="pcn-header">
        <span className="pcn-code">{proj.code}</span>
        <h3 className="pcn-name">{proj.name}</h3>
      </div>

      {/* Tech pills */}
      <div className="pcn-techs">
        {proj.tech.map((t, j) => (
          <span className="pcn-tech-pill" key={j}>
            {t}
          </span>
        ))}
      </div>

      {/* Points */}
      <ul className="pcn-points">
        {proj.points.map((p, j) => (
          <li key={j}>{p}</li>
        ))}
      </ul>

      {/* Live simulation drawer */}
      {simLogs.length > 0 && (
        <div className="pcn-sim-console">
          {simLogs.map((log, k) => (
            <div key={k} className="pcn-sim-line">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pcn-footer">
        <button
          type="button"
          className="pcn-run-btn"
          onClick={runSimulation}
          disabled={running}
        >
          <Icon name="play" />
          <span>{running ? 'Exécution...' : '$ run --demo'}</span>
        </button>

        <a
          href={proj.github}
          target="_blank"
          rel="noreferrer"
          className="pcn-github-btn"
        >
          <Icon name="github" />
          <span>Voir sur GitHub</span>
          <span className="pcn-arrow">↗</span>
        </a>
      </div>
    </TiltCard>
  );
}

// ===== PROJECTS =====
function Projects() {
  return (
    <section id="projets" className="section-alt">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-label">03 // Réalisations majeures</div>
          <h2 className="section-title">
            <ScrambleText text="Projets phares" />
          </h2>
          <div className="section-divider" />
        </div>
        <div className="projects-grid-new">
          {projects.map((proj, i) => (
            <ProjectCard proj={proj} index={i} key={proj.code} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SKILLS =====
function Skills() {
  const skillGroups = [
    { title: 'Data & IA', code: 'MOD_01', items: skills.data_ia },
    { title: 'Cloud & DevOps', code: 'MOD_02', items: skills.cloud_devops },
    { title: 'Backend', code: 'MOD_03', items: skills.backend },
    { title: 'Frontend', code: 'MOD_04', items: skills.frontend },
    { title: 'Bases de données', code: 'MOD_05', items: skills.databases },
    { title: 'Outils & Management', code: 'MOD_06', items: skills.tools_mgmt },
  ];

  const interestGroups = [
    { title: 'Veille Tech', items: centres.veille },
    { title: 'Cinéma', items: centres.cinema },
    { title: 'Sports', items: centres.sports },
    { title: 'Voyages', items: centres.voyage },
    { title: 'Soft Skills', items: centres.softskills },
  ];

  return (
    <section id="competences" className="section">
      <div className="section-header reveal">
        <div className="section-label">04 // Stack technique</div>
        <h2 className="section-title">
          <ScrambleText text="Compétences" />
        </h2>
        <div className="section-divider" />
      </div>
      <div className="skills-grid">
        {skillGroups.map((group, i) => (
          <TiltCard
            className="skill-group reveal"
            key={i}
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <div className="skill-group-title">
              <span className="skill-code">[{group.code}]</span>
              <span>{group.title}</span>
            </div>
            <div className="skill-tags">
              {group.items.map((tag, j) => (
                <span className="skill-tag" key={j}>
                  {tag}
                </span>
              ))}
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Languages */}
      <div style={{ marginTop: '4rem' }}>
        <div className="section-label reveal" style={{ marginBottom: '1.5rem' }}>
          Langues // I/O
        </div>
        <div className="lang-grid">
          {languages.map((lang, i) => (
            <div
              className="lang-card reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="lang-card-top">
                <span className="lang-name">{lang.name}</span>
                <span className="lang-level">{lang.level}</span>
              </div>
              <div className="lang-bar-bg">
                <div
                  className="lang-bar-fill"
                  style={{ '--target-width': lang.level === 'Courant' ? '92%' : '62%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centres d'intérêt */}
      <div style={{ marginTop: '4rem' }}>
        <div className="section-label reveal" style={{ marginBottom: '1.5rem' }}>
          Centres d&apos;intérêt // HUMAN_LAYER
        </div>
        <div className="skills-grid">
          {interestGroups.map((group, i) => (
            <div
              className="skill-group reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div className="skill-group-title">{group.title}</div>
              <div className="interest-row">
                {group.items.map((item, j) => (
                  <span className="interest-tag" key={j}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== FORMATION =====
function Formation() {
  return (
    <section id="formation" className="section-alt">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-label">05 // Parcours académique</div>
          <h2 className="section-title">
            <ScrambleText text="Formation" />
          </h2>
          <div className="section-divider" />
        </div>
        <div className="edu-list">
          {formations.map((edu, i) => (
            <div
              className="edu-card reveal"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-school">{edu.school}</div>
              </div>
              <div className="edu-year">{edu.years}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== CONTACT =====
function Contact() {
  return (
    <section id="contact" className="links-section">
      <div className="links-inner">
        <div className="section-header reveal">
          <div className="section-label">06 // Me retrouver</div>
          <h2 className="section-title">
            <ScrambleText text="Liens & Contact" />
          </h2>
          <div className="section-divider" />
        </div>
        <div className="links-cards reveal">
          <a href={`tel:${personalInfo.phone}`} className="link-card" data-cursor="CALL">
            <div className="link-card-icon"><Icon name="phone" /></div>
            <div>
              <div className="link-label">Téléphone</div>
              <div className="link-value">{personalInfo.phone}</div>
            </div>
          </a>
          <a href={`mailto:${personalInfo.email}`} className="link-card" data-cursor="MAIL">
            <div className="link-card-icon"><Icon name="mail" /></div>
            <div>
              <div className="link-label">Email</div>
              <div className="link-value">{personalInfo.email}</div>
            </div>
          </a>
          <a href={personalInfo.linkedin.url} target="_blank" rel="noreferrer" className="link-card" data-cursor="VISIT">
            <div className="link-card-icon"><Icon name="linkedin" /></div>
            <div>
              <div className="link-label">LinkedIn</div>
              <div className="link-value">{personalInfo.linkedin.value}</div>
            </div>
          </a>
          <a href={personalInfo.github.url} target="_blank" rel="noreferrer" className="link-card" data-cursor="CODE">
            <div className="link-card-icon"><Icon name="github" /></div>
            <div>
              <div className="link-label">GitHub</div>
              <div className="link-value">{personalInfo.github.value}</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-cmd">
        &gt;_ © 2026 <strong>OMER ATICI</strong> · DATA &amp; DEV PORTFOLIO · ALL RIGHTS RESERVED
      </p>
      <p className="footer-sub">
        DATA ENGINEERING // CLOUD ARCHITECTURE // FULLSTACK DEVELOPMENT
      </p>
    </footer>
  );
}

// ===== APP =====
function App() {
  const siteRef = useRef(null);
  useScrollReveal();

  return (
    <>
      <MotionDesignEngine siteRef={siteRef} />
      <div ref={siteRef} className="site-viewport">
        <Navbar />
        <main className="main-shell">
          <Hero />
          <KineticMarquee />
          <Experience />
          <Projects />
          <Skills />
          <Formation />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
