'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stack = ['Next.js', 'Mapbox GL', 'Framer Motion', 'Recharts', 'Tailwind CSS', 'TypeScript'];

export default function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest text-[#888888]">
            Built with
          </span>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {stack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="rounded-lg border border-[#1F1F1F] bg-[#141414] px-4 py-2 font-[family-name:var(--font-jetbrains)] text-sm text-[#888888] transition-colors hover:border-[#333] hover:text-[#F5F5F5]"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
