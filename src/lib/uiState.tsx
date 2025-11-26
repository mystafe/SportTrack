'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type UIStateContextValue = {
  hideFloatingAddButton: boolean;
  setHideFloatingAddButton: (hide: boolean) => void;
};

const UIStateContext = createContext<UIStateContextValue | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [hideFloatingAddButton, setHideFloatingAddButton] = useState(false);

  return (
    <UIStateContext.Provider value={{ hideFloatingAddButton, setHideFloatingAddButton }}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within UIStateProvider');
  }
  return context;
}
