'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation variants ─────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.11 } },
};

const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.25 } };

/* ─── Mini SVG graphics ──────────────────────────────────────────── */

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="7" width="24" height="17" rx="2.5" stroke="#2C3B1F" strokeWidth="1.5"/>
      <circle cx="14" cy="15.5" r="4.5" stroke="#2C3B1F" strokeWidth="1.5"/>
      <path d="M10 7V6a2 2 0 012-2h4a2 2 0 012 2v1" stroke="#2C3B1F" strokeWidth="1.5"/>
      <circle cx="22" cy="11" r="1" fill="#2C3B1F"/>
    </svg>
  );
}

function BoundingBoxFrame() {
  return (
    <svg width="120" height="88" viewBox="0 0 120 88" fill="none" style={{ display: 'block' }}>
      <rect width="120" height="88" rx="3" fill="#EDE8DC"/>
      <rect x="0" y="0" width="120" height="88" rx="3" fill="url(#scanlines)" opacity="0.3"/>
      <rect x="22" y="18" width="72" height="52" rx="1" fill="none" stroke="#2C3B1F" strokeWidth="1.2" strokeDasharray="5 3"/>
      <path d="M22 30 L22 18 L34 18" stroke="#3D7A22" strokeWidth="2" strokeLinecap="round"/>
      <path d="M86 18 L94 18 L94 30" stroke="#3D7A22" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 58 L22 70 L34 70" stroke="#3D7A22" strokeWidth="2" strokeLinecap="round"/>
      <path d="M94 58 L94 70 L82 70" stroke="#3D7A22" strokeWidth="2" strokeLinecap="round"/>
      <rect x="22" y="10" width="72" height="13" rx="2" fill="#3D7A22"/>
      <text x="58" y="20" fill="white" fontSize="7" fontFamily="monospace" textAnchor="middle">polar_bear · 0.94</text>
      <defs>
        <pattern id="scanlines" patternUnits="userSpaceOnUse" width="2" height="4">
          <line x1="0" y1="0" x2="0" y2="2" stroke="#2C3B1F" strokeWidth="0.5"/>
        </pattern>
      </defs>
    </svg>
  );
}

function MovingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10 Q6 6 10 10 Q14 14 17 10" stroke="#2C3B1F" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="17" cy="10" r="1.5" fill="#3D7A22"/>
    </svg>
  );
}

function RestingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 13 Q10 7 16 13" stroke="#2C3B1F" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="4" y1="14" x2="16" y2="14" stroke="#2C3B1F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function EatingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="5.5" stroke="#2C3B1F" strokeWidth="1.5"/>
      <path d="M10 7 L10 10 L12.5 12.5" stroke="#2C3B1F" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 4px' }}>
      <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
        <line x1="0" y1="6" x2="26" y2="6" stroke="#D6CBB8" strokeWidth="1.5"/>
        <path d="M24 2 L30 6 L24 10" stroke="#D6CBB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* ─── Decorative leaf SVG ────────────────────────────────────────── */

function LeafDecoration({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.06, ...style }}>
      <path d="M60 10 C20 30 10 70 40 100 C50 80 55 60 60 40 C65 60 70 80 80 100 C110 70 100 30 60 10Z" fill="#3D7A22"/>
      <path d="M60 40 L60 95" stroke="#3D7A22" strokeWidth="1.5"/>
      <path d="M60 55 L45 45" stroke="#3D7A22" strokeWidth="1"/>
      <path d="M60 65 L75 55" stroke="#3D7A22" strokeWidth="1"/>
      <path d="M60 75 L48 68" stroke="#3D7A22" strokeWidth="1"/>
    </svg>
  );
}

/* ─── Shared section label ───────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#7B8968',
      marginBottom: '24px',
    }}>
      {children}
    </p>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const col: React.CSSProperties = {
  maxWidth: '680px',
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
};

const divider: React.CSSProperties = {
  borderTop: '1px solid #D6CBB8',
  margin: '0',
};

export default function LandingPage() {
  return (
    <div style={{ background: '#F4EEE3', color: '#2C3B1F', fontFamily: 'var(--font-outfit), Outfit, sans-serif', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* grain */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 50, opacity: 0.03, backgroundImage: NOISE }}/>

      {/* Decorative leaves */}
      <div style={{ position: 'absolute', top: '-20px', right: '-30px', pointerEvents: 'none' }}>
        <LeafDecoration />
      </div>
      <div style={{ position: 'absolute', top: '400px', left: '-40px', pointerEvents: 'none', transform: 'rotate(-30deg)' }}>
        <LeafDecoration />
      </div>

      {/* ── Top nav ────────────────────────────────────────────────── */}
      <nav style={{ ...col, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="4,8 7,3 10,8" fill="#3D7A22"/>
            <polygon points="14,8 17,3 20,8" fill="#3D7A22"/>
            <circle cx="12" cy="14" r="8" fill="#3D7A22"/>
            <circle cx="12" cy="16" r="1.5" fill="#F4EEE3"/>
          </svg>
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#2C3B1F' }}>Vera</span>
        </div>
        <Link href="/app" style={{
          fontSize: '13px', color: '#7B8968', textDecoration: 'none',
          padding: '6px 14px', border: '1px solid #D6CBB8', borderRadius: '6px',
          transition: 'border-color 200ms, color 200ms, background 200ms',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3D7A22'; e.currentTarget.style.color = '#3D7A22'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#D6CBB8'; e.currentTarget.style.color = '#7B8968'; }}
        >
          Open Dashboard
        </Link>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <motion.section
        style={{ ...col, padding: '72px 24px 80px', position: 'relative', zIndex: 1 }}
        variants={stagger} {...inView}
      >
        <motion.p variants={fadeUp} style={{ fontSize: '12px', fontWeight: 500, color: '#7B8968', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '28px' }}>
          Columbus Zoo · Animal Intelligence
        </motion.p>
        <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '24px', color: '#2C3B1F' }}>
          Behavioral<br />intelligence,<br />in real time.
        </motion.h1>
        <motion.p variants={fadeUp} style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#6A7860', maxWidth: '44ch', marginBottom: '36px' }}>
          Vera monitors every animal in your care — detecting behavioral patterns, flagging anomalies, and surfacing insights before problems escalate.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link href="/app" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 600, color: '#fff', background: '#3D7A22',
            textDecoration: 'none', padding: '10px 22px', borderRadius: '7px',
            transition: 'opacity 200ms, transform 200ms',
            boxShadow: '0 2px 8px rgba(61,122,34,0.25)',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Open Dashboard <span style={{ opacity: 0.7 }}>→</span>
          </Link>
        </motion.div>
      </motion.section>

      <div style={divider}/>

      {/* ── Pipeline ───────────────────────────────────────────────── */}
      <motion.section style={{ ...col, padding: '72px 24px', position: 'relative', zIndex: 1 }} variants={stagger} {...inView}>
        <motion.div variants={fadeUp}>
          <SectionLabel>Detection Pipeline</SectionLabel>
        </motion.div>
        <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
          From camera feed to health status
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '0.95rem', color: '#7B8968', lineHeight: 1.65, marginBottom: '40px', maxWidth: '48ch' }}>
          Each frame is processed by a YOLOv8 model, which localises animals and outputs bounding-box coordinates and confidence scores. A classifier maps those detections to behavioral states.
        </motion.p>

        {/* Pipeline row */}
        <motion.div variants={fadeUp} style={{
          display: 'flex', alignItems: 'center', gap: '0',
          overflowX: 'auto', paddingBottom: '4px',
        }}>
          {/* Node: Camera */}
          <div style={{ flexShrink: 0, border: '1px solid #D6CBB8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '88px', background: '#FEFBF3' }}>
            <CameraIcon />
            <span style={{ fontSize: '10px', color: '#7B8968', fontFamily: 'monospace', textAlign: 'center' }}>camera<br/>feed</span>
          </div>

          <ArrowRight />

          {/* Node: YOLO (wide) */}
          <div style={{
            flexShrink: 0, border: '1.5px solid #3D7A22', borderRadius: '8px', padding: '16px',
            display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#FEFBF3',
          }}>
            <div style={{ flexShrink: 0 }}>
              <BoundingBoxFrame />
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.8, paddingTop: '4px' }}>
              <div style={{ fontWeight: 700, color: '#3D7A22', marginBottom: '6px', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>YOLOv8 output</div>
              <div><span style={{ color: '#7B8968' }}>class_id  </span><span style={{ color: '#2C3B1F' }}>0</span></div>
              <div><span style={{ color: '#7B8968' }}>label     </span><span style={{ color: '#2C3B1F' }}>polar_bear</span></div>
              <div><span style={{ color: '#7B8968' }}>conf      </span><span style={{ color: '#2C3B1F' }}>0.94</span></div>
              <div><span style={{ color: '#7B8968' }}>bbox      </span><span style={{ color: '#2C3B1F' }}>[142,89,318,241]</span></div>
              <div><span style={{ color: '#7B8968' }}>frame     </span><span style={{ color: '#2C3B1F' }}>2847</span></div>
            </div>
          </div>

          <ArrowRight />

          {/* Node: Classifier */}
          <div style={{ flexShrink: 0, border: '1px solid #D6CBB8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '88px', background: '#FEFBF3' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="4" width="8" height="8" rx="2" fill="#3D7A22"/>
              <rect x="16" y="4" width="8" height="8" rx="2" fill="#D6CBB8"/>
              <rect x="4" y="16" width="8" height="8" rx="2" fill="#D6CBB8"/>
              <rect x="16" y="16" width="8" height="8" rx="2" fill="#3D7A22"/>
            </svg>
            <span style={{ fontSize: '10px', color: '#7B8968', fontFamily: 'monospace', textAlign: 'center' }}>behavior<br/>classifier</span>
          </div>

          <ArrowRight />

          {/* Node: Status */}
          <div style={{ flexShrink: 0, border: '1px solid #D6CBB8', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '88px', background: '#FEFBF3' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4E9A3D', display: 'inline-block' }}/>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2C3B1F' }}>healthy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4982C', display: 'inline-block' }}/>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2C3B1F' }}>concern</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#CC4444', display: 'inline-block' }}/>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2C3B1F' }}>alert</span>
              </div>
            </div>
            <span style={{ fontSize: '10px', color: '#7B8968', fontFamily: 'monospace', textAlign: 'center' }}>dashboard<br/>status</span>
          </div>
        </motion.div>
      </motion.section>

      <div style={divider}/>

      {/* ── What we track ──────────────────────────────────────────── */}
      <motion.section style={{ ...col, padding: '72px 24px', position: 'relative', zIndex: 1 }} variants={stagger} {...inView}>
        <motion.div variants={fadeUp}>
          <SectionLabel>Behavioral States</SectionLabel>
        </motion.div>
        <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '40px' }}>
          What Vera tracks
        </motion.h2>

        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#D6CBB8', border: '1px solid #D6CBB8', borderRadius: '10px', overflow: 'hidden' }}>
          {[
            { icon: <MovingIcon />, label: 'Moving', desc: 'Locomotion, pacing, swimming — active displacement tracked frame-by-frame.' },
            { icon: <RestingIcon />, label: 'Resting', desc: 'Stationary postures detected. Extended rest triggers a passive monitoring flag.' },
            { icon: <EatingIcon />, label: 'Eating', desc: 'Feeding proximity and head-down posture inferred from bounding box position.' },
          ].map(({ icon, label, desc }) => (
            <motion.div key={label} variants={fadeUp} style={{ background: '#FEFBF3', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', border: '1px solid #D6CBB8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4EEE3' }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: '#2C3B1F' }}>{label}</div>
                <div style={{ fontSize: '12.5px', color: '#7B8968', lineHeight: 1.65 }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div style={divider}/>

      {/* ── Built with ─────────────────────────────────────────────── */}
      <motion.section style={{ ...col, padding: '72px 24px', position: 'relative', zIndex: 1 }} variants={stagger} {...inView}>
        <motion.div variants={fadeUp}>
          <SectionLabel>Stack</SectionLabel>
        </motion.div>
        <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '32px' }}>
          Built with
        </motion.h2>

        <motion.div variants={stagger} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { name: 'YOLOv8', note: 'object detection' },
            { name: 'MapLibre GL', note: 'map rendering' },
            { name: 'MapTiler', note: 'tile provider' },
            { name: 'Next.js 16', note: 'framework' },
            { name: 'React 19', note: 'ui' },
          ].map(({ name, note }) => (
            <motion.div key={name} variants={fadeUp} style={{
              border: '1px solid #D6CBB8', borderRadius: '7px', padding: '10px 14px',
              display: 'flex', flexDirection: 'column', gap: '2px', background: '#FEFBF3',
              transition: 'border-color 200ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3D7A22'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#D6CBB8'; }}
            >
              <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', color: '#2C3B1F' }}>{name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#7B8968' }}>{note}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div style={divider}/>

      {/* ── CTA footer ─────────────────────────────────────────────── */}
      <motion.section
        style={{ ...col, padding: '72px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}
        variants={stagger} {...inView}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-breathe">
            <polygon points="4,8 7,3 10,8" fill="#3D7A22"/>
            <polygon points="14,8 17,3 20,8" fill="#3D7A22"/>
            <circle cx="12" cy="14" r="8" fill="#3D7A22"/>
            <circle cx="12" cy="16" r="1.5" fill="#F4EEE3"/>
          </svg>
        </motion.div>
        <motion.p variants={fadeUp} style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '24px' }}>
          Ready to go live?
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link href="/app" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 600, color: '#fff', background: '#3D7A22',
            textDecoration: 'none', padding: '10px 22px', borderRadius: '7px',
            transition: 'opacity 200ms, transform 200ms',
            boxShadow: '0 2px 8px rgba(61,122,34,0.25)',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Open Dashboard <span style={{ opacity: 0.7 }}>→</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* ── Bottom strip ───────────────────────────────────────────── */}
      <div style={{ ...divider }}>
        <div style={{ ...col, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', gap: '8px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4E9A3D', display: 'inline-block' }}/>
          <span style={{ fontSize: '12px', color: '#7B8968' }}>Columbus Zoo · Live</span>
        </div>
      </div>
    </div>
  );
}
