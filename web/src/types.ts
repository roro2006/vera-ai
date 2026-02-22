import type { Feature, Polygon } from 'geojson';

export type HealthStatus = 'healthy' | 'mild_concern' | 'alert' | 'offline';
export type BehaviorState = 'moving' | 'resting' | 'eating';

export interface Animal {
  id: string;
  name: string;
  species: string;
  status: HealthStatus;
  position: { lat: number; lng: number };
  enclosureId: string;
  behaviorToday: { moving: number; resting: number; eating: number };
  currentState: BehaviorState;
  cameraFrameUrl: string | null;
  alerts: Alert[];
  history7d: DayHistory[];
}

export interface Alert {
  timestamp: string;
  message: string;
  active: boolean;
}

export interface DayHistory {
  date: string;
  moving: number;
  resting: number;
  eating: number;
}

export interface Enclosure {
  id: string;
  name: string;
  polygon: Feature<Polygon>;
  labelPosition: { lat: number; lng: number };
}
