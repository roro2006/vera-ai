'use client';

import { useEffect, useState } from 'react';

interface BehaviorBarProps {
  behaviorToday: { moving: number; resting: number; eating: number };
  observationCounts?: Record<string, number>;
}

const BEHAVIORS = [
  { key: 'moving' as const, label: 'Moving', color: '#3B82F6' },
  { key: 'resting' as const, label: 'Resting', color: '#A78BFA' },
  { key: 'eating' as const, label: 'Eating', color: '#D97706' },
] as const;

export default function BehaviorBar({ behaviorToday, observationCounts }: BehaviorBarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setAnimated(true);
    });
  }, []);

  const totalToday = behaviorToday.moving + behaviorToday.resting + behaviorToday.eating;

  // Calculate baseline totals for the same 3 categories
  const movingBaseline = observationCounts?.moving || 0;
  const restingBaseline = (observationCounts?.resting || 0) + (observationCounts?.sleeping || 0);
  const eatingBaseline = (observationCounts?.eating || 0) + (observationCounts?.foraging || 0) + (observationCounts?.drinking || 0);
  const totalBaseline = movingBaseline + restingBaseline + eatingBaseline;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-xs px-4 pt-4 pb-2 text-secondary uppercase tracking-wider">Current Activity</h3>
        <div className="px-4">
          <div className="flex h-2 rounded-full overflow-hidden bg-border">
            {BEHAVIORS.map((b, i) => {
              const percent = totalToday > 0 ? (behaviorToday[b.key] / totalToday) * 100 : 0;
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
      </div>

      {totalBaseline > 0 && (
        <div>
          <h3 className="font-semibold text-xs px-4 pb-2 text-secondary uppercase tracking-wider">Expected (Baseline)</h3>
          <div className="px-4 opacity-50">
            <div className="flex h-1.5 rounded-full overflow-hidden bg-border">
              {BEHAVIORS.map((b, i) => {
                let baselineVal = 0;
                if (b.key === 'moving') baselineVal = movingBaseline;
                if (b.key === 'resting') baselineVal = restingBaseline;
                if (b.key === 'eating') baselineVal = eatingBaseline;

                const percent = (baselineVal / totalBaseline) * 100;
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
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 px-4 pb-4">
        {BEHAVIORS.map((b) => {
          const percent = totalToday > 0 ? Math.round((behaviorToday[b.key] / totalToday) * 100) : 0;
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
