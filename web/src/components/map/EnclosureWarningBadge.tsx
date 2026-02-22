'use client';

import { Marker } from 'react-map-gl/maplibre';

interface EnclosureWarningBadgeProps {
  position: { lat: number; lng: number };
}

export default function EnclosureWarningBadge({ position }: EnclosureWarningBadgeProps) {
  return (
    <Marker
      latitude={position.lat}
      longitude={position.lng + 0.0003}
      anchor="center"
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6 1L11 10H1L6 1Z" fill="#CC4444" />
      </svg>
    </Marker>
  );
}
