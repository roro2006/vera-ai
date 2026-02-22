# Zoo Animal Behavior Tracker — Frontend Design

## Summary

Single-page React app displaying a top-down Mapbox map of the Columbus Zoo with animal health status dots. Clicking a dot opens a slide-in detail panel with camera feed, behavior breakdown, historical sparklines, and alerts. Monochrome design with health status dots as the only color.

**Scope:** Frontend only. All data is mocked. No backend, no auth, no dark mode.

---

## Resolved Decisions

| Question | Decision |
|---|---|
| Zoo location | Columbus Zoo (`40.156, -83.118`, zoom ~16) |
| Camera modal | Lightbox overlay — 70% viewport centered, dark backdrop `rgba(0,0,0,0.5)`, close on backdrop click or x, 200ms fade-in. Same image scaled up with bounding box overlays. |
| API/data | Static mock data file with TypeScript interfaces. No backend. |
| Notes section | Cut. Not needed for v1. |
| State management | React context + useReducer for selected animal. No external state library. |

---

## Tech Stack

- **Framework:** React (Vite)
- **Map:** react-map-gl (Mapbox GL JS) with custom Monochrome white style
- **Charts:** Recharts (sparklines only)
- **Animations:** Framer Motion (panel transitions, staggers), CSS keyframes (dot pulses)
- **Styling:** Tailwind CSS
- **Font:** Inter (Google Fonts, preloaded)
- **Icons:** Lucide React

---

## Design System

### Colors
- Background: `#FFFFFF` with a subtle noise texture overlay (`opacity: 0.02`) for analog warmth
- Surface/Cards: `#FAFAFA` with `1px` border `#E5E5E5`
- Primary text: `#1A1A1A`
- Secondary text: `#6B6B6B`
- Health dots (nature-inspired palette):
  - Healthy: Teal `#2DD4BF` (water/life)
  - Mild Concern: Ochre `#D97706` (earth warning)
  - Alert: Coral `#F43F5E` (organic urgency — not traffic-light red)
  - Offline: Gray `#D4D4D4`
- Behavior: Moving `#3B82F6`, Resting `#A78BFA`, Eating `#D97706`

### Typography (Inter)
| Use | Weight | Size |
|---|---|---|
| Page title | 600 | 18px |
| Animal name | 600 | 22px |
| Section headers | 600 | 14px |
| Body | 400 | 14px |
| Secondary/labels | 400 | 12px |
| Pills/tags | 500 | 10px |

### Spacing
4px base grid: 8, 12, 16, 24, 32, 48, 64

### Borders
Cards: 12px radius. Buttons: 8px. Dots/avatars: 50%.

### Shadows
Cards: `0 1px 4px rgba(0,0,0,0.08)` — visible enough to create depth without being heavy

---

## Data Shape

```ts
interface Animal {
  id: string;
  name: string;
  species: string;
  status: 'healthy' | 'mild_concern' | 'alert' | 'offline';
  position: { lat: number; lng: number };
  enclosureId: string;
  behaviorToday: { moving: number; resting: number; eating: number };
  currentState: 'moving' | 'resting' | 'eating';
  cameraFrameUrl: string | null;
  alerts: { timestamp: string; message: string; active: boolean }[];
  history7d: { date: string; moving: number; resting: number; eating: number }[];
}

interface Enclosure {
  id: string;
  name: string;
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  labelPosition: { lat: number; lng: number };
}
```

---

## Page Structure

```
+--------------------------------------------------+
|  Top Bar (56px)                                  |
+------------------------+-------------------------+
|                        |                         |
|     Zoo Map (65%)      |   Detail Panel (35%)    |
|                        |   (slides in on click)  |
|                        |                         |
+------------------------+-------------------------+
|  Bottom Status Bar (40px, optional)              |
+--------------------------------------------------+
```

### Top Bar
- White, thin bottom border `#E5E5E5`
- Left: Geometric polar bear SVG mark (3-4 minimal shapes — head circle, ear triangles, nose dot — monochrome `#1A1A1A`) with subtle breathing animation (translateY, 4s cycle) + "Polar" in Inter 600 18px
- Right: "Columbus Zoo" + red dot + "Camera Feed" label

### Zoo Map
- react-map-gl centered on Columbus Zoo, custom Mapbox Monochrome white style
- GeoJSON enclosure polygons: soft fill `#F5F5F5`, dashed borders `#E0E0E0`
- Alert state on enclosures: faint coral tint `rgba(244,63,94,0.03)`, coral dashed border, warning triangle SVG badge
- Enclosure polygons fade in with staggered animation on map load (200ms per enclosure, after map fade-in)
- Animal dots: 12px Marker components, health-status colored
  - Hover (300ms delay with cancellation): scale to 16px, tooltip with "Name · Status" — tooltip has a small downward-pointing caret/arrow connecting it to the dot
  - Enclosure labels rendered with frosted glass backdrop (`backdrop-filter: blur(8px)`, `bg-white/70`, rounded-md) for readability over map tiles
  - Click: opens detail panel, dot shows double ring (2px white inner, 2px status-color outer), pulse disabled
  - Pulse: healthy 3s, alert 1.5s with red glow, offline static
- Cooperative scroll gestures (Ctrl/Cmd + scroll). NavigationControl bottom-right.
- 800ms fade-in on load
- Info icon bottom-left: popover explaining health thresholds

### Detail Panel
- Slides in from right, 300ms ease-out + fade
- Map dims to opacity 0.95, scales to 0.98 while panel is open
- Sections top to bottom:
  1. **Header:** Animal name (22px), species (14px secondary), health dot, close button
  2. **Camera feed:** Rounded container, static frame image refreshed on polling interval, red dot "Camera Feed" pill, bounding box overlays, current state pills (Moving/Resting/Eating). Click to open lightbox modal. No-data state: gray placeholder with a subtle, centered animal silhouette SVG (generic quadruped outline, `opacity: 0.08`) and "No camera data available." text below it.
  3. **Behavior bar:** CSS flexbox stacked bar (Moving blue, Resting purple, Eating amber), percentage labels below, animated width transition 400ms staggered
  4. **Historical sparklines:** Recharts area charts per behavior, last 7 days, today highlighted, red tint on significant deviation
  5. **Alert feed:** Scrollable list, timestamp + message, active alerts have 3px left red border, fade-in stagger. Empty state: "No behavioral anomalies detected today."

### Camera Lightbox Modal
- Triggered by clicking camera feed thumbnail
- 70% viewport, centered
- Dark backdrop `rgba(0,0,0,0.5)`, close on backdrop click or x button
- 200ms fade-in/out
- Same frame image scaled up with bounding box overlays

### Bottom Status Bar
- 40px, `#FAFAFA` background
- "12 animals monitored . 2 alerts active . Last updated 3s ago"
- Counter ticks every second

---

## Responsive Behavior

- **Desktop (>1024px):** Map + panel side by side
- **Mobile/Tablet (<=1024px):** Map fullscreen, panel is full-screen overlay with back button, dots 16px for tap targets

---

## Animations

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Health dots | Pulse (opacity + scale) | 3s | ease-in-out |
| Alert dots | Faster pulse + glow | 1.5s | ease-in-out |
| Logo bear | Breathing (translateY) | 4s | ease-in-out |
| Map load | Fade in | 800ms | ease-out |
| Detail panel | Slide right + fade | 300ms | ease-out |
| Map on panel open | Dim 0.95 + scale 0.98 | 300ms | ease-out |
| Behavior bar | Width grow staggered | 400ms | ease-out |
| Alert items | Fade-in stagger | 150ms each | ease |
| Tooltips | Fade in (300ms delay) | 150ms | ease |
| Enclosure polygons | Staggered fade-in on load | 200ms per | ease-out |
| Enclosure warning | Color transition | 500ms | ease |
| Camera modal | Fade in/out | 200ms | ease |

---

## Mock Data Requirements

- ~12 animals across 5-6 enclosures (Polar Frontier, Heart of Africa, Asia Quest, North America, Shores & Aquarium)
- Mix of statuses: mostly healthy, 1-2 mild concern, 1 alert, 1 offline
- Placeholder camera frame images (can use wildlife stock photos)
- GeoJSON polygons for Columbus Zoo enclosures (hand-traced from satellite imagery)
- 7 days of historical behavior data per animal
