'use client';

import { useState, useEffect } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '@/context/AppContext';
import EnclosureLayer from '@/components/map/EnclosureLayer';
import AnimalMarkers from '@/components/map/AnimalMarkers';
import ThresholdLegend from '@/components/map/ThresholdLegend';

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

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
        initialViewState={{
          latitude: 40.156,
          longitude: -83.118,
          zoom: 16,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={`https://api.maptiler.com/maps/dataviz-light/style.json?key=${MAPTILER_KEY}`}
        cooperativeGestures
      >
        <NavigationControl position="bottom-right" />
        <EnclosureLayer />
        <AnimalMarkers />
      </Map>
    </div>
  );
}
