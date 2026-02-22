'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import type { DayHistory } from '@/types';

interface HistorySparklinesProps {
  history7d: DayHistory[];
  behaviorToday: { moving: number; resting: number; eating: number };
}

const BEHAVIORS = [
  { key: 'moving' as const, label: 'Moving', color: '#3B82F6' },
  { key: 'resting' as const, label: 'Resting', color: '#A78BFA' },
  { key: 'eating' as const, label: 'Eating', color: '#D97706' },
] as const;

const ANOMALY_COLOR = '#F43F5E';

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-border rounded px-2 py-1 text-xs shadow-sm">
      <p>{label}</p>
      <p className="font-medium">{payload[0].value}%</p>
    </div>
  );
}

export default function HistorySparklines({
  history7d,
  behaviorToday,
}: HistorySparklinesProps) {
  return (
    <div>
      <h3 className="font-semibold text-sm px-4 pt-2 pb-2">7-Day Trend</h3>

      {BEHAVIORS.map((b) => {
        const chartData = history7d.map((day) => ({
          date: day.date,
          value: day[b.key],
        }));

        const avg =
          chartData.length > 0
            ? chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length
            : 0;

        const todayValue = behaviorToday[b.key];
        const isAnomaly = avg > 0 && Math.abs(todayValue - avg) / avg > 0.2;
        const fillColor = isAnomaly ? ANOMALY_COLOR : b.color;

        const lastIndex = chartData.length - 1;
        const lastPoint = chartData[lastIndex];

        return (
          <div key={b.key} className="px-4 mb-2">
            <span className="font-medium text-xs text-secondary">{b.label}</span>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={b.color}
                  fill={fillColor}
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  dot={false}
                />
                {lastPoint && (
                  <ReferenceDot
                    x={lastPoint.date}
                    y={lastPoint.value}
                    r={3}
                    fill={b.color}
                    stroke="none"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
