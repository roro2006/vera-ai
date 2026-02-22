'use client';

import { useState, useEffect, useMemo } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import { enclosures } from '@/data/enclosures';
import { animals } from '@/data/animals';
import EnclosureWarningBadge from './EnclosureWarningBadge';
import type { FeatureCollection, Point } from 'geojson';
import type { HealthStatus } from '@/types';

const STATUS_PRIORITY: Record<HealthStatus, number> = {
  alert:        3,
  mild_concern: 2,
  healthy:      1,
  offline:      0,
};

export default function EnclosureLayer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Compute worst-case status per enclosure across all its animals
  const enclosureStatusMap = useMemo(() => {
    const map = new Map<string, HealthStatus>();
    for (const animal of animals) {
      const current = map.get(animal.enclosureId);
      const currentPriority = current !== undefined ? STATUS_PRIORITY[current] : -1;
      if (STATUS_PRIORITY[animal.status] > currentPriority) {
        map.set(animal.enclosureId, animal.status);
      }
    }
    return map;
  }, []);

  const alertEnclosureIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, status] of enclosureStatusMap) {
      if (status === 'alert') ids.add(id);
    }
    return ids;
  }, [enclosureStatusMap]);

  // Embed status as a GeoJSON property so MapLibre match expressions can use it
  const geojson: FeatureCollection<Point> = useMemo(() => ({
    type: 'FeatureCollection',
    features: enclosures.map((enc) => ({
      type: 'Feature' as const,
      properties: {
        id: enc.id,
        name: enc.name,
        status: enclosureStatusMap.get(enc.id) ?? 'offline',
      },
      geometry: {
        type: 'Point',
        coordinates: [enc.labelPosition.lng, enc.labelPosition.lat],
      },
    })),
  }), [enclosureStatusMap]);

  return (
    <>
      <Source id="enclosures" type="geojson" data={geojson}>
        <Layer
          id="enclosure-circle"
          type="circle"
          paint={{
            'circle-color': [
              'match', ['get', 'status'],
              'alert',        'rgba(244,63,94,0.12)',
              'mild_concern', 'rgba(217,119,6,0.12)',
              'healthy',      'rgba(45,212,191,0.12)',
              /* offline */   'rgba(245,245,245,0.75)',
            ],
            'circle-opacity': visible ? 1 : 0,
            'circle-opacity-transition': { duration: 800, delay: 200 },
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              14, 30,
              16, 70,
              18, 180,
            ],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': [
              'match', ['get', 'status'],
              'alert',        '#F43F5E',
              'mild_concern', '#D97706',
              'healthy',      '#2DD4BF',
              /* offline */   '#D0D0D0',
            ],
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
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
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
