'use client';

import { useState, useEffect } from 'react';
import { animals } from '@/data/animals';

export default function BottomStatusBar() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalAnimals = animals.length;
  const alertCount = animals.filter((a) => a.status === 'alert').length;

  return (
    <div className="flex h-10 items-center justify-center border-t border-border bg-surface">
      <span className="text-xs text-secondary">
        {totalAnimals} animals monitored &middot; <span style={{ color: '#F43F5E' }}>{alertCount} alerts active </span>&middot; Last updated {seconds}s ago
      </span>
    </div>
  );
}
