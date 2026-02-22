'use client';

import { motion, type Variants } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import Link from 'next/link';

const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400' });

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function LandingPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col bg-white text-primary">
      {/* Noise grain overlay — matches dashboard */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{ backgroundImage: NOISE }}
      />

      {/* Centered stage */}
      <motion.main
        className="flex flex-1 flex-col items-center justify-center gap-10"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Bear logomark */}
        <motion.div variants={fadeUp} className="animate-breathe">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <polygon points="4,8 7,3 10,8" fill="#1A1A1A" />
            <polygon points="14,8 17,3 20,8" fill="#1A1A1A" />
            <circle cx="12" cy="14" r="8" fill="#1A1A1A" />
            <circle cx="12" cy="16" r="1.5" fill="white" />
          </svg>
        </motion.div>

        {/* Wordmark + tagline */}
        <div className="flex flex-col items-center gap-5">
          <motion.h1
            variants={fadeUp}
            className={serif.className}
            style={{
              fontSize: 'clamp(5rem, 12vw, 7.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.025em',
              color: '#1A1A1A',
            }}
          >
            Polar
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#6B6B6B',
              letterSpacing: '0.005em',
              maxWidth: '28ch',
              textAlign: 'center',
            }}
          >
            Behavioral intelligence for the animals in your care.
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <Link
            href="/app"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6B6B6B',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A1A1A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
          >
            Open Dashboard
            <span style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>→</span>
          </Link>
        </motion.div>
      </motion.main>

      {/* Bottom status strip — matches dashboard BottomStatusBar */}
      <motion.div
        className="flex h-10 shrink-0 items-center justify-center border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: '#6B6B6B' }}>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full animate-breathe"
            style={{ backgroundColor: '#2DD4BF' }}
          />
          Columbus Zoo · Live
        </div>
      </motion.div>
    </div>
  );
}
