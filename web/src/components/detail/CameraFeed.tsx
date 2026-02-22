'use client';

import { useRef, useEffect, useState } from 'react';
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

function toApiUrl(cameraFrameUrl: string): string {
  const filename = cameraFrameUrl.split('/').pop()!;
  return `/api/video?file=${encodeURIComponent(filename)}`;
}

export default function CameraFeed({ animal, onExpand }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = animal.cameraFrameUrl?.endsWith('.mp4') ?? false;
  const [loading, setLoading] = useState(hasVideo);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo || !animal.cameraFrameUrl) return;

    setLoading(true);
    el.src = toApiUrl(animal.cameraFrameUrl);
    el.load();

    const onCanPlay = () => {
      setLoading(false);
      el.play().catch(() => {});
    };
    const onError = () => setLoading(false);

    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
      el.pause();
      el.removeAttribute('src');
      el.load();
    };
  }, [animal.cameraFrameUrl, hasVideo]);

  return (
    <div>
      {/* Camera container */}
      <div
        className={`mx-4 rounded-xl aspect-video bg-surface overflow-hidden relative ${
          hasVideo ? 'cursor-pointer' : ''
        }`}
        onClick={hasVideo ? onExpand : undefined}
      >
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* LIVE pill overlay */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5 backdrop-blur-sm">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#F43F5E' }}
              />
              <span className="font-medium text-[10px] text-white">
                LIVE
              </span>
            </div>
          </>
        ) : animal.cameraFrameUrl ? (
          <img
            src={animal.cameraFrameUrl}
            alt={`${animal.name} camera`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
            No camera available
          </div>
        )}
      </div>

      {/* State pills */}
      <div className="flex gap-2 px-4 pt-3">
        {STATE_PILLS.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex items-center gap-1 transition-opacity duration-300"
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
