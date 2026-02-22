'use client';

import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

const thresholds = [
  {
    color: '#4E9A3D',
    label: 'Healthy',
    description: 'Within 10% of baseline',
  },
  {
    color: '#D4982C',
    label: 'Mild Concern',
    description: '10\u201320% deviation',
  },
  {
    color: '#CC4444',
    label: 'Alert',
    description: '>20% deviation',
  },
];

export default function ThresholdLegend() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="absolute bottom-4 left-4 z-10">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center"
        aria-label="Health threshold info"
      >
        <Info size={16} className="text-secondary" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-60 rounded-xl bg-surface border border-border p-3 shadow-md">
          <h4 className="mb-2 text-sm font-semibold">Health Thresholds</h4>
          {thresholds.map((t) => (
            <div key={t.label} className="mb-1.5 flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <p className="text-xs">
                <span className="font-medium">{t.label}</span>
                <span className="text-secondary">
                  {' '}&mdash; {t.description}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
