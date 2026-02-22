'use client';

import type { Animal, BehaviorState } from '@/types';
interface CameraFeedProps {
  animal: Animal;
  onExpand: () => void;
}

const STATE_PILLS: { key: BehaviorState; label: string; color: string }[] = [
  { key: 'moving', label: 'Moving', color: '#3B82F6' },
  { key: 'resting', label: 'Resting', color: '#A78BFA' },
  { key: 'eating', label: 'Eating', color: '#D97706' },
];

export default function CameraFeed({ animal, onExpand }: CameraFeedProps) {
  return (
    <div>
      {/* Camera container */}
      <div
        className="mx-4 rounded-xl aspect-video bg-surface overflow-hidden relative cursor-pointer"
        onClick={onExpand}
      >
          <video
          src="/api/video"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Camera Feed pill overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#F43F5E' }}
          />
          <span className="font-medium text-[10px] text-white">
            Camera Feed
          </span>
        </div>
      </div>

      {/* State pills */}
      <div className="flex gap-2 px-4 pt-3">
        {STATE_PILLS.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex items-center gap-1"
            style={{ opacity: animal.currentState === key ? 1 : 0.3 }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-medium text-primary">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
