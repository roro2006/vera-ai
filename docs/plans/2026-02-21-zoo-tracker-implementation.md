# Zoo Animal Behavior Tracker — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page React app showing a Mapbox map of the Columbus Zoo with interactive animal health status dots and a slide-in detail panel.

**Architecture:** Vite + React + TypeScript SPA. State managed via React context + useReducer (selected animal, panel open/closed). Map rendered with react-map-gl. All data mocked locally — no backend. Component tree: App → TopBar + MapView + DetailPanel + BottomStatusBar + CameraModal.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, react-map-gl, Mapbox GL JS, Recharts, Framer Motion, Lucide React

**Design doc:** `docs/plans/2026-02-21-zoo-tracker-frontend-design.md`

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Step 1: Create Vite project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Accept overwrite if prompted (repo only has docs/).

**Step 2: Install dependencies**

Run:
```bash
npm install react-map-gl mapbox-gl recharts framer-motion lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Tailwind**

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 4: Set up Inter font**

In `index.html`, add to `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

In `src/index.css`, add after the import:
```css
@theme {
  --font-sans: 'Inter', sans-serif;
  --color-surface: #FAFAFA;
  --color-border: #E5E5E5;
  --color-primary: #1A1A1A;
  --color-secondary: #6B6B6B;
  --color-healthy: #2DD4BF;
  --color-mild-concern: #D97706;
  --color-alert: #F43F5E;
  --color-offline: #D4D4D4;
  --color-behavior-moving: #3B82F6;
  --color-behavior-resting: #A78BFA;
  --color-behavior-eating: #D97706;
}
```

**Step 5: Verify it runs**

Run: `npm run dev`
Expected: Vite dev server starts, page loads with default React content.

**Step 6: Clean up default files**

- Delete `src/App.css`, `src/assets/` folder
- Replace `src/App.tsx` with a minimal shell:

```tsx
export default function App() {
  return <div className="relative h-screen w-screen bg-white font-sans text-primary">
    {/* Noise texture overlay for analog warmth */}
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
    Polar
  </div>
}
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold vite + react + tailwind project"
```

---

### Task 2: TypeScript Types & Mock Data

**Files:**
- Create: `src/types.ts`, `src/data/animals.ts`, `src/data/enclosures.ts`

**Step 1: Define types**

Create `src/types.ts`:
```ts
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
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  labelPosition: { lat: number; lng: number };
}
```

**Step 2: Create mock animal data**

Create `src/data/animals.ts` with ~12 animals across 5 enclosures. Key points:
- Use real Columbus Zoo enclosure names: `polar-frontier`, `heart-of-africa`, `asia-quest`, `north-america`, `shores-aquarium`
- Positions clustered within each enclosure's approximate lat/lng bounds (centered around `40.156, -83.118`)
- Mix of statuses: ~8 healthy, 2 mild_concern, 1 alert, 1 offline
- `behaviorToday` percentages sum to 100
- `history7d` has 7 entries with realistic variation
- `cameraFrameUrl` set to `null` for now (placeholder images added later)
- The alert animal should have 2-3 active alerts with realistic messages
- Include one animal with empty alerts array to test empty state

Each animal needs believable data. Example:
```ts
{
  id: 'aurora',
  name: 'Aurora',
  species: 'Polar Bear',
  status: 'healthy',
  position: { lat: 40.1575, lng: -83.1185 },
  enclosureId: 'polar-frontier',
  behaviorToday: { moving: 45, resting: 35, eating: 20 },
  currentState: 'moving',
  cameraFrameUrl: null,
  alerts: [],
  history7d: [
    { date: '2026-02-15', moving: 42, resting: 38, eating: 20 },
    // ... 6 more days
  ],
}
```

**Step 3: Create enclosure GeoJSON data**

Create `src/data/enclosures.ts` with 5 enclosures. Each needs:
- A GeoJSON polygon approximating the enclosure area (use rectangular approximations — 4-5 coordinate pairs per polygon)
- A label position (center of the polygon)
- Coordinates should be within the Columbus Zoo bounds

The polygons don't need to be geographically precise — they're visual regions on the map. Use approximate rectangular areas spread across the zoo footprint.

**Step 4: Commit**

```bash
git add src/types.ts src/data/
git commit -m "feat: add typescript types and mock animal/enclosure data"
```

---

### Task 3: App State Context

**Files:**
- Create: `src/context/AppContext.tsx`
- Modify: `src/App.tsx`

**Step 1: Create context with useReducer**

Create `src/context/AppContext.tsx`:
```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Animal } from '../types';

interface AppState {
  selectedAnimal: Animal | null;
  panelOpen: boolean;
}

type Action =
  | { type: 'SELECT_ANIMAL'; animal: Animal }
  | { type: 'CLOSE_PANEL' };

const initialState: AppState = {
  selectedAnimal: null,
  panelOpen: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_ANIMAL':
      return { selectedAnimal: action.animal, panelOpen: true };
    case 'CLOSE_PANEL':
      return { selectedAnimal: null, panelOpen: false };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
```

**Step 2: Wrap App in provider**

Update `src/App.tsx`:
```tsx
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen flex-col bg-white font-sans text-primary">
        {/* TopBar, MapView, DetailPanel, BottomStatusBar go here */}
        <p className="p-4">Polar — Zoo Animal Behavior Tracker</p>
      </div>
    </AppProvider>
  );
}
```

**Step 3: Commit**

```bash
git add src/context/ src/App.tsx
git commit -m "feat: add app state context with useReducer"
```

---

### Task 4: Top Bar

**Files:**
- Create: `src/components/TopBar.tsx`
- Modify: `src/App.tsx`

**Step 1: Build TopBar component**

Create `src/components/TopBar.tsx`:
- 56px height, white bg, bottom border `#E5E5E5`
- Left: geometric polar bear SVG mark (minimal: head circle, two ear triangles, nose dot — all `#1A1A1A` monochrome, ~24px) with CSS breathing animation (`translateY` oscillating 2px over 4s ease-in-out infinite) + "Polar" text in Inter 600 18px
- Right: "Columbus Zoo" text + red 8px dot + "Camera Feed" label in secondary text
- The breathing animation is a CSS `@keyframes` applied to the SVG wrapper

**Step 2: Add to App**

Import TopBar into App.tsx and render it at the top of the flex column.

**Step 3: Verify visually**

Run: `npm run dev`
Expected: Top bar visible with logo, title, and status indicator.

**Step 4: Commit**

```bash
git add src/components/TopBar.tsx src/App.tsx
git commit -m "feat: add top bar with logo and status indicator"
```

---

### Task 5: Map Setup

**Files:**
- Create: `src/components/MapView.tsx`, `src/components/map/EnclosureLayer.tsx`
- Modify: `src/App.tsx`

**Step 1: Set up Mapbox token**

Create `.env` file:
```
VITE_MAPBOX_TOKEN=your_token_here
```

Add `.env` to `.gitignore`.

**Step 2: Build MapView component**

Create `src/components/MapView.tsx`:
- Uses `react-map-gl` `<Map>` component
- Centered on Columbus Zoo: `latitude: 40.156, longitude: -83.118, zoom: 16`
- Map style: `mapbox://styles/mapbox/light-v11` (Mapbox's light monochrome style — free, no Studio customization needed for v1)
- `cooperativeGestures` prop enabled (requires Ctrl/Cmd + scroll to zoom)
- `<NavigationControl>` in bottom-right position
- Wrapper div has 800ms fade-in animation (CSS opacity transition triggered on mount)
- When `panelOpen` is true (from context), apply `opacity-95 scale-[0.98]` with 300ms transition
- Import `mapbox-gl/dist/mapbox-gl.css` for default Mapbox styling

**Step 3: Build EnclosureLayer component**

Create `src/components/map/EnclosureLayer.tsx`:
- Import enclosure data from `src/data/enclosures.ts`
- Import animal data to check if any animal in an enclosure has alert status
- Render a `<Source>` with GeoJSON FeatureCollection of all enclosure polygons
- Render two `<Layer>` components:
  - Fill layer: `#F5F5F5` fill, with conditional coral tint `rgba(244,63,94,0.03)` for alert enclosures (use `case` expression in paint property keyed on enclosure `id`)
  - Line layer: dashed gray `#E0E0E0` by default, coral `#F43F5E` for alert enclosures
  - Polygon fill-opacity animates from 0 to target value with staggered delay (200ms per enclosure) after map load — use `fill-opacity-transition` paint property or React state toggle
- Enclosure labels rendered as `<Marker>` components at each enclosure's `labelPosition` — Inter 500, 11px, secondary color, with frosted glass backdrop (`backdrop-blur-sm bg-white/70 px-2 py-0.5 rounded-md`)

**Step 4: Add to App layout**

Update App.tsx: render MapView in the main content area (flex-1 to fill available space).

**Step 5: Verify**

Run: `npm run dev`
Expected: Map renders centered on Columbus Zoo with enclosure polygons visible.

**Step 6: Commit**

```bash
git add src/components/MapView.tsx src/components/map/ src/App.tsx .env .gitignore
git commit -m "feat: add mapbox map with enclosure polygon layers"
```

---

### Task 6: Animal Dot Markers

**Files:**
- Create: `src/components/map/AnimalDot.tsx`, `src/components/map/AnimalMarkers.tsx`, `src/styles/dot-pulse.css`
- Modify: `src/components/MapView.tsx`

**Step 1: Create dot pulse CSS animations**

Create `src/styles/dot-pulse.css` with keyframes:
- `.dot-pulse-healthy`: scale 1→1.15→1, opacity 1→0.7→1 over 3s ease-in-out infinite
- `.dot-pulse-mild-concern`: same timing as healthy but with ochre box-shadow glow
- `.dot-pulse-alert`: scale 1→1.2→1, opacity 1→0.6→1 over 1.5s ease-in-out infinite, with coral box-shadow glow (`0 0 6px rgba(244,63,94,0.4)`)
- `.dot-pulse-offline`: no animation (static)
- `.dot-selected`: no pulse, double ring via box-shadow (`0 0 0 2px white, 0 0 0 4px var(--ring-color)`)

Import this CSS file in `src/main.tsx`.

**Step 2: Build AnimalDot component**

Create `src/components/map/AnimalDot.tsx`:
- Props: `animal: Animal`, `isSelected: boolean`
- Renders a 12px circle div with background color mapped from `animal.status`:
  - healthy → `#2DD4BF` (teal), mild_concern → `#D97706` (ochre), alert → `#F43F5E` (coral), offline → `#D4D4D4`
- Applies pulse CSS class based on status (unless `isSelected`, then applies `.dot-selected`)
- `cursor: pointer`
- `onClick`: dispatch `SELECT_ANIMAL` via context
- Hover state managed with `onMouseEnter`/`onMouseLeave` + 300ms timeout:
  - On enter: start a 300ms timer. If timer fires, show tooltip.
  - On leave: clear the timer, hide tooltip.
  - Tooltip: absolutely positioned div above the dot showing `"Name · Status"` in Inter 400 12px, white bg, shadow, 8px border-radius, fade-in 150ms, with a small downward-pointing CSS caret/arrow (`border` trick or `clip-path`) connecting the tooltip to the dot

**Step 3: Build AnimalMarkers component**

Create `src/components/map/AnimalMarkers.tsx`:
- Imports animals from mock data
- Maps each animal to a `<Marker>` (from react-map-gl) at `animal.position` wrapping an `<AnimalDot>`
- Passes `isSelected` by comparing with `state.selectedAnimal?.id`

**Step 4: Add AnimalMarkers to MapView**

Render `<AnimalMarkers />` inside the `<Map>` component, after `<EnclosureLayer />`.

**Step 5: Verify**

Run: `npm run dev`
Expected: Colored dots visible on map at animal positions. Hovering shows tooltip after 300ms delay. Clicking a dot logs selection (panel not built yet).

**Step 6: Commit**

```bash
git add src/components/map/AnimalDot.tsx src/components/map/AnimalMarkers.tsx src/styles/ src/components/MapView.tsx src/main.tsx
git commit -m "feat: add animal dot markers with pulse animations and hover tooltips"
```

---

### Task 7: Detail Panel Shell

**Files:**
- Create: `src/components/DetailPanel.tsx`
- Modify: `src/App.tsx`

**Step 1: Build DetailPanel with Framer Motion**

Create `src/components/DetailPanel.tsx`:
- Uses `<AnimatePresence>` and `<motion.div>` from Framer Motion
- Only renders when `state.panelOpen && state.selectedAnimal`
- Animation: slides in from right (`x: '100%'` → `x: 0`), fades (`opacity: 0` → `1`), 300ms ease-out
- Exit animation: reverse
- Width: 35% of viewport on desktop, `w-full` on mobile (≤1024px)
- White background, left border `#E5E5E5`, overflow-y auto for scrolling
- Close button (× using Lucide `X` icon) in top-right, 16px, `#6B6B6B`, hover `#1A1A1A`
- On close: dispatch `CLOSE_PANEL`

**Step 2: Add to App layout**

Update App.tsx layout to be a flex row for the main content area:
```tsx
<div className="flex flex-1 overflow-hidden">
  <MapView />
  <DetailPanel />
</div>
```

The MapView should use `flex-1` to fill remaining space. When panel is closed, map takes full width.

**Step 3: Verify**

Run: `npm run dev`
Expected: Clicking a dot slides in the panel from the right. Map dims slightly. Clicking × closes it with reverse animation.

**Step 4: Commit**

```bash
git add src/components/DetailPanel.tsx src/App.tsx
git commit -m "feat: add slide-in detail panel with framer motion"
```

---

### Task 8: Detail Panel — Header & Camera Feed

**Files:**
- Create: `src/components/detail/PanelHeader.tsx`, `src/components/detail/CameraFeed.tsx`
- Modify: `src/components/DetailPanel.tsx`

**Step 1: Build PanelHeader**

Create `src/components/detail/PanelHeader.tsx`:
- Props: `animal: Animal`
- Animal name: Inter 600, 22px, with health status dot (8px circle) inline to the left
- Species: Inter 400, 14px, secondary color, below name
- Compact layout with 16px padding

**Step 2: Build CameraFeed**

Create `src/components/detail/CameraFeed.tsx`:
- Props: `animal: Animal`, `onExpand: () => void`
- Rounded 12px container, aspect-ratio 16/9, bg `#F5F5F5`
- If `cameraFrameUrl` is null: show gray placeholder with a subtle centered animal silhouette SVG (generic quadruped outline, `opacity-[0.08]`, ~80px wide) and "No camera data available." text below it in secondary color
- If URL exists: `<img>` tag with `object-fit: cover`
- Top-left: pill overlay with red 6px dot + "Camera Feed" in Inter 500 10px white text on `rgba(0,0,0,0.6)` rounded pill
- Below the feed: three state pills in a row. The active `currentState` pill is fully opaque with its color, others are dimmed (`opacity-30`):
  - Moving: blue dot + "Moving"
  - Resting: purple dot + "Resting"
  - Eating: amber dot + "Eating"
- `onClick` on the container calls `onExpand` (for lightbox)

**Step 3: Wire into DetailPanel**

Import and render PanelHeader and CameraFeed inside DetailPanel, passing the selected animal.

**Step 4: Commit**

```bash
git add src/components/detail/ src/components/DetailPanel.tsx
git commit -m "feat: add panel header and camera feed sections"
```

---

### Task 9: Detail Panel — Behavior Bar & Sparklines

**Files:**
- Create: `src/components/detail/BehaviorBar.tsx`, `src/components/detail/HistorySparklines.tsx`
- Modify: `src/components/DetailPanel.tsx`

**Step 1: Build BehaviorBar**

Create `src/components/detail/BehaviorBar.tsx`:
- Props: `behaviorToday: { moving: number; resting: number; eating: number }`
- Section header: "Behavior — Today" in Inter 600, 14px
- Stacked bar: flex container, 8px height, rounded-full, overflow-hidden
  - Three divs with `width: ${percent}%` and background colors (Moving blue, Resting purple, Eating amber)
  - CSS transition on `width` property: 400ms ease-out, staggered by adding `transition-delay` (0ms, 100ms, 200ms)
  - Initial width is 0%, animated to actual width on mount (use a `useEffect` + state toggle)
- Below bar: three columns showing percentage + label in Inter 400, 12px with corresponding color dot

**Step 2: Build HistorySparklines**

Create `src/components/detail/HistorySparklines.tsx`:
- Props: `history7d: DayHistory[]`, `behaviorToday: { moving: number; resting: number; eating: number }`
- Section header: "7-Day Trend" in Inter 600, 14px
- Three small area charts (one per behavior) using Recharts `<AreaChart>`:
  - Height: 60px each, full width
  - `<Area>` with matching behavior color, fill with low opacity (`fillOpacity={0.1}`)
  - No axes, no grid — just the area shape (`<XAxis hide>`, `<YAxis hide>`, `<CartesianGrid>` removed)
  - `<Tooltip>` showing day + percentage on hover
  - Today's value (last entry) highlighted with a `<ReferenceDot>` at the last data point
  - If today's value is >20% different from the 7-day average, the area fill shifts to red tint
- Label above each chart: behavior name in Inter 500, 12px

**Step 3: Wire into DetailPanel**

Add both components below CameraFeed in DetailPanel.

**Step 4: Commit**

```bash
git add src/components/detail/BehaviorBar.tsx src/components/detail/HistorySparklines.tsx src/components/DetailPanel.tsx
git commit -m "feat: add behavior bar and historical sparklines"
```

---

### Task 10: Detail Panel — Alert Feed

**Files:**
- Create: `src/components/detail/AlertFeed.tsx`
- Modify: `src/components/DetailPanel.tsx`

**Step 1: Build AlertFeed**

Create `src/components/detail/AlertFeed.tsx`:
- Props: `alerts: Alert[]`
- Section header: "Alerts" in Inter 600, 14px
- If `alerts.length === 0`: centered gray text "No behavioral anomalies detected today." in Inter 400, 14px, secondary color
- If alerts exist: scrollable list (`max-h-48 overflow-y-auto`)
  - Each alert: single line with timestamp (Inter 500, 12px, secondary) + em-dash + message (Inter 400, 14px)
  - Active alerts: 3px left red border accent (`border-l-3 border-alert`)
  - Stagger animation: each item uses Framer Motion `<motion.div>` with `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ delay: index * 0.15, duration: 0.15 }}`

**Step 2: Wire into DetailPanel**

Add AlertFeed below HistorySparklines.

**Step 3: Commit**

```bash
git add src/components/detail/AlertFeed.tsx src/components/DetailPanel.tsx
git commit -m "feat: add alert feed with stagger animation"
```

---

### Task 11: Camera Lightbox Modal

**Files:**
- Create: `src/components/CameraModal.tsx`
- Modify: `src/App.tsx`, `src/components/DetailPanel.tsx`

**Step 1: Build CameraModal**

Create `src/components/CameraModal.tsx`:
- Props: `imageUrl: string`, `animalName: string`, `onClose: () => void`
- Framer Motion `<AnimatePresence>`:
  - Backdrop: `motion.div` covering viewport, bg `rgba(0,0,0,0.5)`, fade 200ms, `onClick` → `onClose`
  - Content: `motion.div` centered, max-width 70vw, max-height 80vh, white bg, rounded-xl, 200ms scale-up from 0.95
  - Image: `<img>` with `object-fit: contain`, rounded
  - Close button (× Lucide icon) in top-right corner of the content box
  - Animal name label below the image in Inter 600, 16px

**Step 2: Add modal state to DetailPanel**

In DetailPanel, add local state `modalOpen`. Pass `onExpand={() => setModalOpen(true)}` to CameraFeed. Render CameraModal conditionally.

**Step 3: Commit**

```bash
git add src/components/CameraModal.tsx src/components/DetailPanel.tsx
git commit -m "feat: add camera lightbox modal"
```

---

### Task 12: Bottom Status Bar

**Files:**
- Create: `src/components/BottomStatusBar.tsx`
- Modify: `src/App.tsx`

**Step 1: Build BottomStatusBar**

Create `src/components/BottomStatusBar.tsx`:
- 40px height, bg `#FAFAFA`, top border `#E5E5E5`, centered content
- Text: Inter 400, 12px, secondary color
- Compute from mock data:
  - Total animals count
  - Count of animals with `status === 'alert'`
- "Last updated" counter: `useEffect` with `setInterval` every 1000ms, incrementing a seconds counter. Display as `${seconds}s ago`. Resets to 0 whenever selected animal changes.
- Format: `"12 animals monitored · 2 alerts active · Last updated 3s ago"` (use `·` middle dot separator)

**Step 2: Add to App layout**

Render BottomStatusBar below the main content flex row.

**Step 3: Commit**

```bash
git add src/components/BottomStatusBar.tsx src/App.tsx
git commit -m "feat: add bottom status bar with live counter"
```

---

### Task 13: Health Threshold Legend

**Files:**
- Create: `src/components/map/ThresholdLegend.tsx`
- Modify: `src/components/MapView.tsx`

**Step 1: Build ThresholdLegend**

Create `src/components/map/ThresholdLegend.tsx`:
- An info icon (Lucide `Info`, 16px, secondary color) positioned absolutely in bottom-left of the map container
- On click: toggles a popover (small white card, shadow, 12px border-radius, 240px width)
- Popover content:
  - Title: "Health Thresholds" Inter 600, 14px
  - Three rows, each with a colored dot + status name + description:
    - Teal dot: "Healthy — Within 10% of baseline"
    - Ochre dot: "Mild Concern — 10–20% deviation"
    - Coral dot: "Alert — >20% deviation"
  - Inter 400, 12px for descriptions
- Click outside or click icon again to close

**Step 2: Add to MapView**

Render ThresholdLegend inside the MapView container (positioned absolute, bottom-left with padding).

**Step 3: Commit**

```bash
git add src/components/map/ThresholdLegend.tsx src/components/MapView.tsx
git commit -m "feat: add health threshold legend popover"
```

---

### Task 14: Enclosure Alert Warning Badges

**Files:**
- Create: `src/components/map/EnclosureWarningBadge.tsx`
- Modify: `src/components/map/EnclosureLayer.tsx`

**Step 1: Build warning badge**

Create `src/components/map/EnclosureWarningBadge.tsx`:
- Props: `position: { lat: number; lng: number }`, `enclosureName: string`
- A `<Marker>` component that renders a small warning triangle SVG (not emoji) next to the enclosure label
- Triangle: 12px, filled with `#EF4444`, simple equilateral triangle path
- Positioned slightly offset from the enclosure label position

**Step 2: Add to EnclosureLayer**

In EnclosureLayer, for each enclosure that contains any alert-status animal, render a WarningBadge `<Marker>` next to its label.

**Step 3: Commit**

```bash
git add src/components/map/EnclosureWarningBadge.tsx src/components/map/EnclosureLayer.tsx
git commit -m "feat: add warning badges on alert enclosures"
```

---

### Task 15: Responsive Layout

**Files:**
- Modify: `src/App.tsx`, `src/components/DetailPanel.tsx`, `src/components/map/AnimalDot.tsx`

**Step 1: Mobile detail panel**

Update DetailPanel:
- On screens ≤1024px (`useMediaQuery` hook or Tailwind responsive classes):
  - Panel takes full width and full height (overlay)
  - Add a back button (Lucide `ArrowLeft`) in the header instead of ×
  - `z-index` above the map

**Step 2: Larger tap targets on mobile**

Update AnimalDot:
- On screens ≤1024px: dot size increases to 16px (pass via prop or media query)

**Step 3: Verify both layouts**

Test at desktop width (>1024px) and mobile width (≤1024px) using browser devtools.

**Step 4: Commit**

```bash
git add src/App.tsx src/components/DetailPanel.tsx src/components/map/AnimalDot.tsx
git commit -m "feat: add responsive layout for mobile/tablet"
```

---

### Task 16: Placeholder Images & Final Polish

**Files:**
- Modify: `src/data/animals.ts`, various components for animation tuning

**Step 1: Add placeholder camera images**

Update `src/data/animals.ts`:
- Set `cameraFrameUrl` to placeholder wildlife image URLs (use `https://placehold.co/640x360/f5f5f5/6b6b6b?text=Camera+Feed` or similar placeholder service) for most animals
- Leave 1-2 animals with `null` to test the no-data state

**Step 2: Animation polish pass**

Review all animations match the design spec timings:
- Dot pulses: healthy 3s, alert 1.5s
- Panel slide: 300ms ease-out
- Map dim: 300ms synced
- Behavior bar: 400ms staggered
- Alert stagger: 150ms per item
- Tooltips: 300ms enter delay, 150ms fade

**Step 3: Final visual check**

Run: `npm run dev`
Walk through all interactions:
1. Page loads with map fade-in
2. Dots pulse correctly
3. Hover tooltip appears after delay
4. Click opens panel, map dims
5. Panel sections render correctly
6. Camera lightbox opens/closes
7. Close panel, map restores
8. Check enclosure alert state
9. Check responsive at mobile width
10. Status bar counter ticks

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add placeholder images and polish animations"
```

---

## Task Dependency Graph

```
Task 1 (Scaffold)
  └─→ Task 2 (Types & Data)
       └─→ Task 3 (Context)
            ├─→ Task 4 (Top Bar)
            └─→ Task 5 (Map)
                 ├─→ Task 6 (Animal Dots)
                 │    └─→ Task 7 (Detail Panel Shell)
                 │         └─→ Task 8 (Header & Camera)
                 │              └─→ Task 9 (Bar & Sparklines)
                 │                   └─→ Task 10 (Alert Feed)
                 │                        └─→ Task 11 (Camera Modal)
                 ├─→ Task 13 (Legend)
                 └─→ Task 14 (Warning Badges)
            └─→ Task 12 (Status Bar)
  Task 15 (Responsive) — after Tasks 7 + 6
  Task 16 (Polish) — after all other tasks
```

Tasks 4, 12, 13, 14 are independent of the detail panel chain and can be parallelized.
