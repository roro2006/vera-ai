'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

/* ─── Animation variants ─────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.11 } },
};

const inView = { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.25 } };

const container: React.CSSProperties = {
  maxWidth: '672px',
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
};

/* ─── SVG Components ─────────────────────────────────────────────── */

function DetectionPipeline() {
  return (
    <svg viewBox="0 0 640 160" width="100%" height="100%" role="img" aria-label="Detection pipeline: camera feed to YOLOv8 to classifier to dashboard">
      {/* Arrows */}
      <path d="M 140 70 L 176 70 M 170 66 L 176 70 L 170 74" stroke="var(--color-border)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 320 70 L 356 70 M 350 66 L 356 70 L 350 74" stroke="var(--color-border)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 460 70 L 496 70 M 490 66 L 496 70 L 490 74" stroke="var(--color-border)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Camera node */}
      <rect x="40" y="30" width="100" height="80" rx="8" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface)"/>
      <rect x="75" y="60" width="30" height="20" rx="2" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <circle cx="90" cy="70" r="4" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <text x="90" y="135" fontFamily="monospace" fontSize="10" fill="var(--color-secondary)" textAnchor="middle" letterSpacing="0.5">CAMERA</text>

      {/* YOLOv8 node */}
      <rect x="180" y="30" width="140" height="80" rx="8" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface)"/>
      <rect x="190" y="40" width="120" height="60" rx="4" fill="var(--color-surface-alt)"/>
      <rect x="205" y="50" width="90" height="40" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="2,2" fill="none"/>
      <rect x="205" y="50" width="84" height="14" fill="var(--color-primary)"/>
      <text x="209" y="59" fontFamily="monospace" fontSize="8" fill="var(--color-surface)">polar_bear · 0.94</text>
      <text x="250" y="135" fontFamily="monospace" fontSize="10" fill="var(--color-secondary)" textAnchor="middle" letterSpacing="0.5">YOLOV8</text>

      {/* Classifier node */}
      <rect x="360" y="30" width="100" height="80" rx="8" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface)"/>
      <rect x="395" y="52" width="30" height="6" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <rect x="395" y="67" width="30" height="6" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <rect x="395" y="82" width="30" height="6" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <text x="410" y="135" fontFamily="monospace" fontSize="10" fill="var(--color-secondary)" textAnchor="middle" letterSpacing="0.5">CLASSIFIER</text>

      {/* Dashboard node */}
      <rect x="500" y="30" width="100" height="80" rx="8" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface)"/>
      <rect x="536" y="56" width="12" height="12" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <rect x="552" y="56" width="12" height="12" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <rect x="536" y="72" width="12" height="12" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <rect x="552" y="72" width="12" height="12" rx="1" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <text x="550" y="135" fontFamily="monospace" fontSize="10" fill="var(--color-secondary)" textAnchor="middle" letterSpacing="0.5">DASHBOARD</text>
    </svg>
  );
}

function YoloInferenceCard() {
  return (
    <svg viewBox="0 0 280 160" width="100%" height="100%" role="img" aria-label="YOLO inference output showing detection of polar bear with 0.94 confidence">
      <rect x="1" y="1" width="278" height="158" rx="8" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-surface)"/>
      <rect x="10" y="10" width="120" height="140" rx="4" fill="var(--color-surface-alt)"/>
      <rect x="25" y="35" width="90" height="90" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4,4" fill="none"/>
      <path d="M 32 35 L 25 35 L 25 42 M 108 35 L 115 35 L 115 42 M 32 125 L 25 125 L 25 118 M 108 125 L 115 125 L 115 118" stroke="var(--color-primary)" strokeWidth="2" fill="none"/>
      <rect x="25" y="35" width="82" height="14" fill="var(--color-primary)"/>
      <text x="29" y="45" fontFamily="monospace" fontSize="8" fill="var(--color-surface)">polar_bear 0.94</text>
      <text x="145" y="38" fontFamily="monospace" fontSize="11" fill="var(--color-secondary)">class_id</text>
      <text x="195" y="38" fontFamily="monospace" fontSize="11" fill="var(--color-primary)">0</text>
      <text x="145" y="60" fontFamily="monospace" fontSize="11" fill="var(--color-secondary)">label</text>
      <text x="195" y="60" fontFamily="monospace" fontSize="11" fill="var(--color-primary)">polar_bear</text>
      <text x="145" y="82" fontFamily="monospace" fontSize="11" fill="var(--color-secondary)">conf</text>
      <text x="195" y="82" fontFamily="monospace" fontSize="11" fill="var(--color-primary)">0.94</text>
      <text x="145" y="104" fontFamily="monospace" fontSize="11" fill="var(--color-secondary)">bbox</text>
      <text x="195" y="104" fontFamily="monospace" fontSize="11" fill="var(--color-primary)">[142,89,318,241]</text>
      <text x="145" y="126" fontFamily="monospace" fontSize="11" fill="var(--color-secondary)">frame</text>
      <text x="195" y="126" fontFamily="monospace" fontSize="11" fill="var(--color-primary)">2847</text>
    </svg>
  );
}

function MovingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M 3 12 Q 7.5 4, 12 12 T 21 12" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="21" cy="12" r="1.5" fill="var(--color-primary)" stroke="none"/>
    </svg>
  );
}

function RestingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <line x1="3" y1="17" x2="21" y2="17" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 5 17 C 5 10, 19 10, 19 17" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function EatingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="var(--color-primary)" strokeWidth="1.5" fill="none"/>
      <path d="M 12 7 L 12 12 L 15.5 15.5" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BearLogo() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <polygon points="5,3 10,6 6,10" fill="var(--color-primary)"/>
      <polygon points="19,3 14,6 18,10" fill="var(--color-primary)"/>
      <circle cx="12" cy="13" r="8" fill="var(--color-primary)"/>
      <circle cx="12" cy="16" r="1.5" fill="var(--color-surface)"/>
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', color: 'var(--color-primary)' }}>
      {/* grain overlay */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 50, opacity: 0.025, backgroundImage: NOISE }}/>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav style={{ ...container, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 18, height: 18 }}>
            <BearLogo />
          </div>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Vera</span>
        </div>
        <Link href="/app" className="landing-nav-link">
          Dashboard →
        </Link>
      </nav>

      {/* ── Main (centered, single viewport) ─────────────────────────── */}
      <main style={{ ...container, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px 48px' }}>
        <motion.div variants={stagger} {...inView} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Section label */}
          <motion.p variants={fadeUp} style={{
            textTransform: 'uppercase', fontSize: '10px', fontWeight: 500,
            color: 'var(--color-secondary)', letterSpacing: '0.12em', marginBottom: '24px',
          }}>
            Columbus Zoo · Animal Intelligence
          </motion.p>

          {/* Headline */}
          <motion.h1 variants={fadeUp} style={{
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800,
            lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '20px',
          }}>
            Know every animal&#39;s behavior, automatically.
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={fadeUp} style={{
            fontSize: '15px', color: 'var(--color-secondary)',
            lineHeight: 1.7, maxWidth: '44ch', marginBottom: '32px',
          }}>
            Vera monitors every animal in your care — detecting behavioral patterns, flagging anomalies, and surfacing insights before problems escalate.
          </motion.p>

          {/* Detection pipeline */}
          <motion.div variants={fadeUp} style={{ width: '100%', maxWidth: '640px', marginBottom: '32px' }}>
            <DetectionPipeline />
          </motion.div>

          {/* Behavioral states row */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'center', marginBottom: '32px' }}>
            {[
              { Icon: MovingIcon, label: 'Moving' },
              { Icon: RestingIcon, label: 'Resting' },
              { Icon: EatingIcon, label: 'Eating' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: 36, height: 36, border: '1px solid var(--color-border)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 20, height: 20 }}>
                    <Icon />
                  </div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-secondary)' }}>{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <Link href="/app" className="landing-cta">
              Open Dashboard <span style={{ opacity: 0.6 }}>→</span>
            </Link>
          </motion.div>

        </motion.div>
      </main>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* ── Below fold: YOLO detail ──────────────────────────────────── */}
      <motion.section
        style={{ ...container, padding: '64px 24px', textAlign: 'center' }}
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}
        variants={fadeIn}
      >
        <p style={{
          textTransform: 'uppercase', fontSize: '10px', fontWeight: 500,
          color: 'var(--color-secondary)', letterSpacing: '0.12em', marginBottom: '24px',
        }}>
          Detection Detail
        </p>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          How inference works
        </h2>
        <p style={{
          fontSize: '14px', color: 'var(--color-secondary)', lineHeight: 1.65,
          maxWidth: '48ch', margin: '0 auto 32px',
        }}>
          Each frame is processed by a YOLOv8 model, which localises animals and outputs bounding-box coordinates and confidence scores. A classifier maps those detections to behavioral states.
        </p>
        <div style={{ margin: '0 auto', maxWidth: '320px' }}>
          <YoloInferenceCard />
        </div>
      </motion.section>

      {/* ── Tech stack strip ─────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--color-border)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '16px 24px',
      }}>
        {['Next.js 16', 'YOLOv8', 'MapLibre GL', 'MapTiler', 'React 19'].map((tech, i, arr) => (
          <span key={tech}>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-secondary)' }}>{tech}</span>
            {i < arr.length - 1 && <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-secondary)', marginLeft: '12px' }}>·</span>}
          </span>
        ))}
      </div>

      {/* ── Bottom strip ─────────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--color-border)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', height: '48px', gap: '8px',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-healthy)', display: 'inline-block' }}/>
        <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>Columbus Zoo · Live</span>
      </div>
    </div>
  );
}
