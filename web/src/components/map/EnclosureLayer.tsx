'use client';

import { useState, useEffect, useMemo } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import { enclosures } from '@/data/enclosures';
import { animals } from '@/data/animals';
import { useApp } from '@/context/AppContext';
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
  const { state } = useApp();
  const dark = state.theme === 'dark';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Compute worst-case status per enclosure across all animals
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

  // Theme-dependent opacity for enclosure fills (slightly higher on dark for visibility)
  const fillAlpha = dark ? 0.18 : 0.12;

  return (
    <>
      <Source id="enclosures" type="geojson" data={geojson}>
        <Layer
          id="enclosure-circle"
          type="circle"
          paint={{
            'circle-color': [
              'match', ['get', 'status'],
              'alert',        `rgba(204,68,68,${fillAlpha})`,
              'mild_concern', `rgba(212,152,44,${fillAlpha})`,
              'healthy',      `rgba(78,154,61,${fillAlpha})`,
              /* offline */   dark ? 'rgba(50,50,42,0.40)' : 'rgba(173,165,146,0.50)',
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
              'alert',        '#CC4444',
              'mild_concern', '#D4982C',
              'healthy',      '#4E9A3D',
              /* offline */   dark ? '#3A3A30' : '#D0D0D0',
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
          <div className={`backdrop-blur-sm px-2 py-0.5 rounded-md ${
            dark
              ? 'bg-[#1C221A]/80'
              : 'bg-[#FEFBF3]/80'
          }`}>
            <span
              className="font-medium"
              style={{
                fontFamily: 'var(--font-outfit), Outfit, sans-serif',
                fontSize: '13px',
                color: dark ? '#8B9A7A' : '#7B8968',
              }}
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
