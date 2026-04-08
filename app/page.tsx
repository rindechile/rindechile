import type { Metadata } from 'next';
import { HomePageClient } from './components/HomePageClient';

export const metadata: Metadata = {
  title: 'RindeChile - Transparencia en Compras Municipales',
  description:
    'Explora datos de compras públicas municipales en Chile. Descubre dónde se concentran las compras que superan significativamente el rango histórico de precio.',
  alternates: {
    canonical: 'https://rindechile.cl',
  },
  openGraph: {
    title: 'RindeChile - Transparencia en Compras Municipales',
    description:
      'Explora datos de compras públicas municipales en Chile. Descubre dónde se concentran las compras que superan significativamente el rango histórico de precio.',
    url: 'https://rindechile.cl',
  },
};

export default function Home() {
  return <HomePageClient />;
}
