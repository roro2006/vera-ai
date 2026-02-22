'use client';

import { useState, useRef, useCallback } from 'react';
import type { Animal, HealthStatus } from '@/types';
import { useApp } from '@/context/AppContext';

interface AnimalDotProps {
  animal: Animal;
  isSelected: boolean;
}

const STATUS_COLORS: Record<HealthStatus, string> = {
  healthy: '#4E9A3D',
  mild_concern: '#D4982C',
  alert: '#CC4444',
  offline: '#ADA592',
};

const STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: 'Healthy',
  mild_concern: 'Mild Concern',
  alert: 'Alert',
  offline: 'Offline',
};

const PULSE_CLASSES: Record<HealthStatus, string> = {
  healthy: 'dot-pulse-healthy',
  mild_concern: 'dot-pulse-mild-concern',
  alert: 'dot-pulse-alert',
  offline: 'dot-pulse-offline',
};

export default function AnimalDot({ animal, isSelected }: AnimalDotProps) {
  const { state, dispatch } = useApp();
  const dark = state.theme === 'dark';
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const color = STATUS_COLORS[animal.status];
  const dotClass = isSelected ? 'dot-selected' : PULSE_CLASSES[animal.status];

  const handleClick = useCallback(() => {
    dispatch({ type: 'SELECT_ANIMAL', animal });
  }, [dispatch, animal]);

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 8,
          whiteSpace: 'nowrap',
          backgroundColor: dark ? '#1C221A' : '#FEFBF3',
          color: dark ? '#E5DFD0' : '#2C3B1F',
          fontSize: 12,
          lineHeight: '16px',
          padding: '4px 8px',
          borderRadius: 8,
          border: `1px solid ${dark ? '#2E3828' : '#D6CBB8'}`,
          boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
          zIndex: 50,
          pointerEvents: 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 150ms ease',
        }}
      >
        {animal.name} &middot; {STATUS_LABELS[animal.status]}
        {/* Caret arrow */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `4px solid ${dark ? '#1C221A' : '#FEFBF3'}`,
          }}
        />
      </div>

      {/* Dot */}
      <div
        className={`${dotClass} w-4 h-4 lg:w-3 lg:h-3`}
        onClick={handleClick}
        style={{
          borderRadius: '50%',
          backgroundColor: color,
          cursor: 'pointer',
          ...(isSelected ? { '--ring-color': color } as React.CSSProperties : {}),
        }}
      />
    </div>
  );
}
