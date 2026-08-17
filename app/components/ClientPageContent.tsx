'use client';

import dynamic from 'next/dynamic';
import { useMapContext } from "../contexts/MapContext";
import { DetailPanel } from "./DetailPanel";
import MapContainerSuspense from "./map/MapContainerSuspense";
import { DetailPanelSkeleton } from "./DetailPanelSkeleton";
import { PurchasesTableSkeleton } from "./purchases/PurchasesTableSkeleton";

const PurchasesTable = dynamic(
  () => import('./purchases/PurchasesTable').then(mod => ({ default: mod.PurchasesTable })),
  { loading: () => <PurchasesTableSkeleton /> }
);

export function ClientPageContent() {
  const { detailPanelData, loading } = useMapContext();

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* Top Section */}
      <section className="flex flex-col desktop:flex-row w-full gap-8" aria-label="Mapa y panel de detalle">

        <div className="w-full desktop:w-1/5 flex flex-col gap-4">
          <section className="p-6 border rounded-lg flex flex-col gap-4" aria-label="Descripcion del mapa">
            <h1 className="text-2xl font-semibold">¿Dónde están las compras públicas que merecen atención?</h1>

            <p className="text-sm font-regular">
              Descubre dónde se concentran las compras que superan significativamente el rango histórico de precio. 
            </p>

            <p className="text-sm font-regular">
              Explora a nivel nacional, regional y municipal.
            </p>
          </section>

          <MapContainerSuspense />

        </div>

        <section className="w-full desktop:w-4/5" aria-label="Panel de detalle">
          {loading ? (
            <DetailPanelSkeleton />
          ) : (
            <DetailPanel data={detailPanelData} />
          )}
        </section>

      </section>

      {/* Purchases Table Section */}
      <section className="w-full" aria-label="Tabla de compras publicas">
        {loading ? (
          <PurchasesTableSkeleton />
        ) : (
          <PurchasesTable />
        )}
      </section>
    </div>
  );
}

// Explicit default export for module resolution
export default ClientPageContent;
