import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { AppProvider } from '../context/AppContext';
import type { ReactNode } from 'react';

export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <AudioPlayerProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AudioPlayerProvider>
  );
}