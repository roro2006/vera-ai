'use client';

import { useState, useEffect } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApp } from '@/context/AppContext';
import EnclosureLayer from '@/components/map/EnclosureLayer';
import AnimalMarkers from '@/components/map/AnimalMarkers';
import ThresholdLegend from '@/components/map/ThresholdLegend';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView() {
  const { state } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const timeout = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`relative flex-1 transition-opacity duration-[800ms] ${
        mounted ? 'opacity-100' : 'opacity-0'
      } ${
        state.panelOpen
          ? 'opacity-95 scale-[0.98] transition-all duration-300'
          : 'transition-all duration-300'
      }`}
    >
      <ThresholdLegend />
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          latitude: 40.156,
          longitude: -83.118,
          zoom: 16,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        cooperativeGestures
      >
        <NavigationControl position="bottom-right" />
        <EnclosureLayer />
        <AnimalMarkers />
      </Map>
    </div>
  );
}
