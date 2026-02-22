import { Animal, Alert, HealthStatus, BehaviorState } from '../types';
import { animals as mockAnimals } from './animals';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

// Video feeds for model-created animals from the backend.
// Update the URL here when the labeled inference video is uploaded to YouTube.
const DEFAULT_VIDEO_FEED = 'https://www.youtube.com/watch?v=KUWB8EiKUhc';

const ANIMAL_VIDEO_FEEDS: Record<string, string> = {
  nanuq: DEFAULT_VIDEO_FEED,
  bear_01: DEFAULT_VIDEO_FEED,
  bear_02: DEFAULT_VIDEO_FEED,
};

/** Turn "bear_01" into "Bear 01", "nanuq" into "Nanuq" */
function formatAnimalName(id: string): string {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function fetchAnimals(): Promise<Animal[]> {
  try {
    const response = await fetch(`${API_BASE}/animals`);
    if (!response.ok) {
      console.warn('API fetch failed, falling back to mock data');
      return mockAnimals;
    }
    const data = await response.json();
    
    // If API returns no animals, fallback to mock data (useful for first run)
    if (!data.animals || data.animals.length === 0) {
      console.warn('API returned no animals, falling back to mock data');
      return mockAnimals;
    }

    // Map API response and merge with mock metadata if available
    return data.animals.map((a: any) => {
      const mock = mockAnimals.find(m => m.id === a.animal_id);
      return {
        id: a.animal_id,
        name: mock?.name || formatAnimalName(a.animal_id),
        species: mock?.species || 'Polar Bear',
        status: mapStatus(a.open_alert_count, a.drift_detected),
        position: mock?.position || { lat: 40.156, lng: -83.118 },
        enclosureId: mock?.enclosureId || 'polar-frontier',
        behaviorToday: a.behavior_distribution || mock?.behaviorToday || { moving: 0, resting: 0, eating: 0 },
        currentState: (a.current_behavior_label as BehaviorState) || 'resting',
        cameraFrameUrl: mock?.cameraFrameUrl || null,
        videoUrl: a.video_url || ANIMAL_VIDEO_FEEDS[a.animal_id] || mock?.videoUrl || null,
        alerts: mock?.alerts || [],
        history7d: mock?.history7d || [],
        observation_counts: a.observation_counts,
        last_behavioral_integrity_error: a.last_behavior_violation,
        last_violation_time: a.last_violation_time,
      };
    });
  } catch (err) {
    console.warn('API fetch error, falling back to mock data:', err);
    return mockAnimals;
  }
}

export async function fetchAnimalStatus(animalId: string): Promise<Partial<Animal>> {
  const response = await fetch(`${API_BASE}/animals/${animalId}/status`);
  if (!response.ok) {
    throw new Error(`Failed to fetch status for animal ${animalId}`);
  }
  const data = await response.json();
  return {
    id: data.animal_id,
    currentState: data.current_behavior_label as BehaviorState,
    behaviorToday: data.behavior_distribution,
    observation_counts: data.observation_counts,
    last_behavioral_integrity_error: data.last_behavior_violation,
    last_violation_time: data.last_violation_time,
    status: mapStatus(data.has_open_alert ? 1 : 0, data.drift_detected),
  };
}

export async function fetchAnimalAlerts(animalId: string): Promise<Alert[]> {
  const response = await fetch(`${API_BASE}/animals/${animalId}/alerts?status=open`);
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts for animal ${animalId}`);
  }
  const data = await response.json();
  return data.alerts.map((a: any) => ({
    timestamp: new Date(a.timestamp).toLocaleTimeString(),
    message: `Behavioral anomaly: ${a.anomaly_type} (Score: ${a.anomaly_score.toFixed(2)})`,
    active: a.status === 'open',
  }));
}

function mapStatus(openAlertCount: number, driftDetected: boolean): HealthStatus {
  if (openAlertCount > 0) return 'alert';
  if (driftDetected) return 'mild_concern';
  return 'healthy';
}
