'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Map, Activity, AlertTriangle } from 'lucide-react';

const features = [
  {
    icon: Map,
    title: 'Live Map Tracking',
    description: 'GPS-tagged animals on an interactive Mapbox map with pulsing health-status indicators and enclosure boundaries.',
    color: '#2DD4BF',
  },
  {
    icon: Activity,
    title: 'Behavior Analysis',
    description: 'Automated classification into moving, resting, and eating states with 7-day trend sparklines and deviation detection.',
    color: '#A78BFA',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Alerts',
    description: 'Real-time alerts surface when behavior deviates from baselines — catching issues hours before manual observation.',
    color: '#F43F5E',
  },
];

export default function Features() {
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
            Features
          </span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">What you get</h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="group rounded-2xl border border-[#1F1F1F] bg-[#141414] p-8 transition-all hover:border-[#333]"
                style={{ boxShadow: `0 0 60px ${feature.color}08` }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#888888]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
