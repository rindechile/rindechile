import type { Metadata } from 'next';
import { SuppliersTable } from '@/app/components/suppliers/SuppliersTable';

export const metadata: Metadata = {
  title: 'Proveedores del Estado | RindeChile',
  description:
    'Explora el directorio de proveedores del Estado chileno y filtra por las municipalidades que han abastecido.',
  alternates: {
    canonical: 'https://rindechile.cl/suppliers',
  },
  openGraph: {
    title: 'Proveedores del Estado | RindeChile',
    description:
      'Directorio de proveedores del Estado chileno con filtro por municipalidades servidas.',
    url: 'https://rindechile.cl/suppliers',
    type: 'website',
  },
};

export default function SuppliersPage() {
  return (
    <section className="max-w-5xl mx-auto py-12 px-4 tablet:px-6">
      <header className="mb-8">
        <h1 className="text-3xl tablet:text-4xl font-medium mb-3">
          Proveedores del Estado
        </h1>
        <p className="text-sm tablet:text-base text-muted-foreground max-w-2xl">
          Directorio de proveedores registrados en compras públicas. Busca por nombre o RUT, y filtra por la municipalidad que han abastecido.
        </p>
      </header>

      <SuppliersTable />
    </section>
  );
}
