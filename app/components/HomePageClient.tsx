'use client';

import { MapProvider } from '../contexts/MapContext';
import { ClientPageContent } from './ClientPageContent';

export function HomePageClient() {
  return (
    <MapProvider>
      <ClientPageContent />
    </MapProvider>
  );
}
