'use client';

import { MapProvider } from '../contexts/MapContext';
import { ClientPageContent } from '../components/ClientPageContent';

interface RegionPageClientProps {
  regionCode: number;
}

export function RegionPageClient({ regionCode }: RegionPageClientProps) {
  return (
    <MapProvider initialRegionCode={regionCode}>
      <ClientPageContent />
    </MapProvider>
  );
}
