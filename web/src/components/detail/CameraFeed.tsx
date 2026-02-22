'use client';

import type { Animal, BehaviorState } from '@/types';

interface CameraFeedProps {
  animal: Animal;
  onExpand: () => void;
}

const STATE_PILLS: { key: BehaviorState; label: string; color: string }[] = [
  { key: 'moving', label: 'Moving', color: '#5088C5' },
  { key: 'resting', label: 'Resting', color: '#9B7EC8' },
  { key: 'eating', label: 'Eating', color: '#D4982C' },
];

/** Extract YouTube embed URL from various YT URL formats */
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes('youtube.com') && parsed.pathname.startsWith('/embed/')) {
      return url; // already an embed URL
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export default function CameraFeed({ animal, onExpand }: CameraFeedProps) {
  const embedUrl = animal.videoUrl ? getYouTubeEmbedUrl(animal.videoUrl) : null;

  return (
    <div>
      {/* Camera / Video container */}
      <div
        className="mx-4 rounded-xl aspect-video bg-surface overflow-hidden relative"
        {...(!embedUrl ? { onClick: onExpand, style: { cursor: 'pointer' } } : {})}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${animal.name} camera feed`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : animal.cameraFrameUrl ? (
          <img
            src={animal.cameraFrameUrl}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Generic quadruped silhouette */}
            <svg
              width="80"
              height="56"
              viewBox="0 0 80 56"
              fill="currentColor"
              className="opacity-[0.08] text-primary mb-2"
            >
              <path d="M16 40c0-2 1-6 3-10 2-4 5-8 9-10 2-1 4-2 6-2h2l2-4c1-2 3-4 5-5 2-1 4-1 6 0l3 2 3-1c2 0 4 1 5 3l2 5h2c3 0 6 1 8 4 2 3 3 6 3 10v2l2 4c1 2 1 4 0 6-1 1-2 2-4 2H18c-2 0-3-1-4-2-1-2-1-4 0-6l2-4v-1zM24 44h32v-2H24v2z" />
            </svg>
            <span className="text-sm text-secondary">
              No camera data available.
            </span>
          </div>
        )}

        {/* Camera Feed pill overlay */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: embedUrl ? '#4E9A3D' : '#CC4444' }}
          />
          <span className="font-medium text-[10px] text-white">
            {embedUrl ? 'Live Feed' : 'Camera Feed'}
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
