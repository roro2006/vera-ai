'use client';

import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TopBar() {
  const { state, dispatch } = useApp();
  const dark = state.theme === 'dark';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
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
            <polygon points="4,8 7,3 10,8" fill="currentColor" />
            <polygon points="14,8 17,3 20,8" fill="currentColor" />
            <circle cx="12" cy="14" r="8" fill="currentColor" />
            <circle cx="12" cy="16" r="1.5" fill={dark ? '#141414' : 'white'} />
          </svg>
        </div>
        <span className="text-lg font-semibold text-primary">Vera</span>
      </div>

      {/* Right: Status + theme toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-primary">Columbus Zoo</span>
        <span className="inline-block h-2 w-2 rounded-full bg-alert" />
        <span className="text-sm text-secondary">Camera Feed</span>

        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="ml-1 flex items-center justify-center w-8 h-8 rounded-md border border-border text-secondary hover:text-primary hover:border-primary transition-colors duration-150"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
