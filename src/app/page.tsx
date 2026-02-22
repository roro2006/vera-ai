'use client';

import { AppProvider } from '../context/AppContext';
import TopBar from '../components/TopBar';
import MapView from '../components/MapView';
import DetailPanel from '../components/DetailPanel';

export default function Home() {
  return (
    <AppProvider>
      <div className="relative flex h-screen w-screen flex-col bg-white text-primary">
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <MapView />
          <DetailPanel />
        </div>
      </div>
    </AppProvider>
  );
}
