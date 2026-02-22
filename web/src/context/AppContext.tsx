'use client';

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
