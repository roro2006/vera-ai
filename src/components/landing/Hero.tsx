'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-8"
      >
        <div className="relative inline-block">
          {/* Teal glow behind logo */}
          <div className="absolute inset-0 blur-[60px] bg-[#2DD4BF] opacity-20 rounded-full scale-150" />
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative"
          >
            <polygon points="4,8 7,3 10,8" fill="#F5F5F5" />
            <polygon points="14,8 17,3 20,8" fill="#F5F5F5" />
            <circle cx="12" cy="14" r="8" fill="#F5F5F5" />
            <circle cx="12" cy="16" r="1.5" fill="#0A0A0A" />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-7xl font-bold tracking-tight sm:text-8xl"
      >
        Polar
      </motion.h1>

      {/* Tagline */}
      <motion.p
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-6 max-w-xl text-lg text-[#888888] sm:text-xl"
      >
        Real-time behavioral intelligence for zoo animal welfare
      </motion.p>

      {/* Hackathon subtitle */}
      <motion.p
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-3 font-[family-name:var(--font-jetbrains)] text-sm text-[#555555]"
      >
        Built at HackOHI/O 2026
      </motion.p>

      {/* CTA */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-10"
      >
        <Link
          href="/dashboard"
          className="group relative inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-8 py-3.5 text-base font-semibold text-[#0A0A0A] transition-all hover:brightness-110"
        >
          {/* Pulse glow */}
          <span className="absolute inset-0 animate-pulse rounded-xl bg-[#2DD4BF] opacity-20 blur-lg" />
          <span className="relative">View Live Dashboard</span>
          <span className="relative transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[#555555]"
      >
        <span className="font-[family-name:var(--font-jetbrains)] text-xs">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-6 w-px bg-[#555555]"
        />
      </motion.div>
    </section>
  );
}
