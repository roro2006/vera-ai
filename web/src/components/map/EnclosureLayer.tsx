'use client';

import { useState, useEffect, useMemo } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import { enclosures } from '@/data/enclosures';
import { animals } from '@/data/animals';
import EnclosureWarningBadge from './EnclosureWarningBadge';
import type { FeatureCollection, Polygon } from 'geojson';

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

  // Build GeoJSON FeatureCollection with id property on each feature
  const geojson: FeatureCollection<Polygon> = useMemo(() => ({
    type: 'FeatureCollection',
    features: enclosures.map((enc) => ({
      type: 'Feature' as const,
      properties: {
        id: enc.id,
        name: enc.name,
        hasAlert: alertEnclosureIds.has(enc.id),
      },
      geometry: enc.polygon.geometry,
    })),
  }), [alertEnclosureIds]);

  // Build Mapbox match expressions for conditional styling based on alert status
  const alertIds = Array.from(alertEnclosureIds);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fillColorExpr: any = [
    'match',
    ['get', 'id'],
    ...alertIds.flatMap((id) => [id, 'rgba(244,63,94,0.03)']),
    '#F5F5F5',
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineColorExpr: any = [
    'match',
    ['get', 'id'],
    ...alertIds.flatMap((id) => [id, '#F43F5E']),
    '#E0E0E0',
  ];

  return (
    <>
      <Source id="enclosures" type="geojson" data={geojson}>
        <Layer
          id="enclosure-fill"
          type="fill"
          paint={{
            'fill-color': fillColorExpr,
            'fill-opacity': visible ? 0.6 : 0,
            'fill-opacity-transition': { duration: 800, delay: 200 },
          }}
        />
        <Layer
          id="enclosure-line"
          type="line"
          paint={{
            'line-color': lineColorExpr,
            'line-width': 1.5,
            'line-dasharray': [4, 2],
            'line-opacity': visible ? 1 : 0,
            'line-opacity-transition': { duration: 800, delay: 400 },
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
