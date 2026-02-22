'use client';

import type { Animal, HealthStatus } from '@/types';

interface PanelHeaderProps {
  animal: Animal;
}

const STATUS_DOT_COLORS: Record<HealthStatus, string> = {
  healthy: '#4E9A3D',
  mild_concern: '#D4982C',
  alert: '#CC4444',
  offline: '#ADA592',
};

export default function PanelHeader({ animal }: PanelHeaderProps) {
  const dotColor = STATUS_DOT_COLORS[animal.status];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <h2 className="font-semibold text-[22px] text-primary leading-tight">
          {animal.name}
        </h2>
      </div>
      <p className="text-sm text-secondary mt-0.5 ml-4">
        {animal.species}
      </p>
    </div>
  );
}
