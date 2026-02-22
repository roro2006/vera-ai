'use client';

export default function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-2.5">
        <div className="animate-breathe">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left ear */}
            <polygon points="4,8 7,3 10,8" fill="#1A1A1A" />
            {/* Right ear */}
            <polygon points="14,8 17,3 20,8" fill="#1A1A1A" />
            {/* Head */}
            <circle cx="12" cy="14" r="8" fill="#1A1A1A" />
            {/* Nose */}
            <circle cx="12" cy="16" r="1.5" fill="white" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-primary">Polar</span>
      </div>

      {/* Right: Status indicator */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-primary">Columbus Zoo</span>
        <span className="inline-block h-2 w-2 rounded-full bg-alert" />
        <span className="text-sm text-secondary">Camera Feed</span>
      </div>
    </header>
  );
}
