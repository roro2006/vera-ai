'use client';

import { useEffect, useState } from 'react';

interface BehaviorBarProps {
  behaviorToday: { moving: number; resting: number; eating: number };
}

const BEHAVIORS = [
  { key: 'moving' as const, label: 'Moving', color: '#3B82F6' },
  { key: 'resting' as const, label: 'Resting', color: '#A78BFA' },
  { key: 'eating' as const, label: 'Eating', color: '#D97706' },
] as const;

export default function BehaviorBar({ behaviorToday }: BehaviorBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setAnimated(true);
    });
  }, []);

  const total = behaviorToday.moving + behaviorToday.resting + behaviorToday.eating;

  return (
    <div>
      <h3 className="font-semibold text-sm px-4 pt-4 pb-2">Behavior — Today</h3>

      {/* Stacked bar */}
      <div className="px-4">
        <div className="flex h-2 rounded-full overflow-hidden bg-border">
          {BEHAVIORS.map((b, i) => {
            const percent = total > 0 ? (behaviorToday[b.key] / total) * 100 : 0;
            return (
              <div
                key={b.key}
                style={{
                  width: animated ? `${percent}%` : '0%',
                  backgroundColor: b.color,
                  transitionDelay: `${i * 100}ms`,
                }}
                className="transition-all duration-[400ms] ease-out"
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-4 pt-2 pb-4">
        {BEHAVIORS.map((b) => {
          const percent = total > 0 ? Math.round((behaviorToday[b.key] / total) * 100) : 0;
          return (
            <div key={b.key} className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-xs">{percent}%</span>
              <span className="text-xs text-secondary">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
