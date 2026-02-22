'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera, Cpu, BarChart3, Monitor } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Camera Feeds',
    description: 'Live video streams from enclosure-mounted cameras capture animal activity around the clock.',
    color: '#2DD4BF',
  },
  {
    icon: Cpu,
    title: 'CV Processing',
    description: 'Computer vision models detect and track individual animals using bounding box identification.',
    color: '#3B82F6',
  },
  {
    icon: BarChart3,
    title: 'Behavior Classification',
    description: 'Movement patterns are classified into behavioral states: moving, resting, or eating.',
    color: '#A78BFA',
  },
  {
    icon: Monitor,
    title: 'Real-time Dashboard',
    description: 'Health status, behavior trends, and anomaly alerts surface on an interactive map interface.',
    color: '#F43F5E',
  },
];

export default function Architecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-widest text-[#2DD4BF]">
            Architecture
          </span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">How it works</h2>
        </motion.div>

        {/* Flow diagram */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="relative"
              >
                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
                    className="absolute right-0 top-10 hidden h-px w-4 origin-left lg:block"
                    style={{ background: step.color, right: '-16px' }}
                  />
                )}

                <div
                  className="rounded-2xl border border-[#1F1F1F] bg-[#141414] p-6 transition-all hover:border-[#333]"
                  style={{ boxShadow: `0 0 40px ${step.color}10` }}
                >
                  {/* Step number */}
                  <span
                    className="font-[family-name:var(--font-jetbrains)] text-xs"
                    style={{ color: step.color }}
                  >
                    0{i + 1}
                  </span>

                  {/* Icon */}
                  <div className="mt-3 mb-4">
                    <Icon size={28} style={{ color: step.color }} />
                  </div>

                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#888888]">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
