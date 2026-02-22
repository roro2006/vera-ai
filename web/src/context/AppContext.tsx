'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Animal } from '../types';

interface AppState {
  selectedAnimal: Animal | null;
  panelOpen: boolean;
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'SELECT_ANIMAL'; animal: Animal }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  selectedAnimal: null,
  panelOpen: false,
  theme: 'light',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_ANIMAL':
      return { ...state, selectedAnimal: action.animal, panelOpen: true };
    case 'CLOSE_PANEL':
      return { ...state, selectedAnimal: null, panelOpen: false };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
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
