'use client';

import { useState, useEffect, useMemo } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import { enclosures } from '@/data/enclosures';
import { animals } from '@/data/animals';
import EnclosureWarningBadge from './EnclosureWarningBadge';
import type { FeatureCollection, Point } from 'geojson';

export default function EnclosureLayer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Staggered fade-in after map load
    const timeout = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Determine which enclosures contain alert-status animals
  const alertEnclosureIds = useMemo(() => {
    const ids = new Set<string>();
    for (const animal of animals) {
      if (animal.status === 'alert') {
        ids.add(animal.enclosureId);
      }
    }
    return ids;
  }, []);

  // Build GeoJSON FeatureCollection using enclosure center points
  const geojson: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: enclosures.map((enc) => ({
      type: 'Feature' as const,
      properties: {
        id: enc.id,
        name: enc.name,
        hasAlert: alertEnclosureIds.has(enc.id),
      },
      geometry: {
        type: 'Point',
        coordinates: [enc.labelPosition.lng, enc.labelPosition.lat],
      },
    })),
  }), [alertEnclosureIds]);

  // Build GL match expressions for conditional styling based on alert status
  const alertIds = Array.from(alertEnclosureIds);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleColorExpr: any = [
    'match',
    ['get', 'id'],
    ...alertIds.flatMap((id) => [id, 'rgba(244,63,94,0.12)']),
    'rgba(245,245,245,0.75)',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const strokeColorExpr: any = [
    'match',
    ['get', 'id'],
    ...alertIds.flatMap((id) => [id, '#F43F5E']),
    '#D0D0D0',
  ];

  return (
    <>
      <Source id="enclosures" type="geojson" data={geojson}>
        <Layer
          id="enclosure-circle"
          type="circle"
          paint={{
            'circle-color': circleColorExpr,
            'circle-opacity': visible ? 1 : 0,
            'circle-opacity-transition': { duration: 800, delay: 200 },
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              14, 16,
              16, 36,
              18, 72,
            ],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': strokeColorExpr,
            'circle-stroke-opacity': visible ? 1 : 0,
            'circle-stroke-opacity-transition': { duration: 800, delay: 400 },
          }}
        />
      </Source>

      {enclosures.map((enc) => (
        <Marker
          key={enc.id}
          latitude={enc.labelPosition.lat}
          longitude={enc.labelPosition.lng}
          anchor="center"
        >
          <div className="backdrop-blur-sm bg-white/70 px-2 py-0.5 rounded-md">
            <span
              className="text-secondary font-medium"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}
            >
              {enc.name}
            </span>
          </div>
        </Marker>
      ))}

      {enclosures
        .filter((enc) => alertEnclosureIds.has(enc.id))
        .map((enc) => (
          <EnclosureWarningBadge
            key={`warning-${enc.id}`}
            position={{ lat: enc.labelPosition.lat, lng: enc.labelPosition.lng }}
          />
        ))}
    </>
  );
}
