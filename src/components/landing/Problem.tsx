'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 12, label: 'Animals Tracked' },
  { value: 3, label: 'Behavior States' },
  { value: 24, suffix: '/7', label: 'Monitoring' },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold sm:text-4xl"
        >
          Zoo animals can&apos;t tell you when something&apos;s wrong.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg leading-relaxed text-[#888888]"
        >
          Behavioral changes are often the earliest indicators of illness, stress, or injury —
          but they&apos;re easy to miss across dozens of animals. Polar uses computer vision and
          real-time tracking to surface anomalies before they become emergencies.
        </motion.p>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl font-bold text-[#2DD4BF] sm:text-5xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-2 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest text-[#888888]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
