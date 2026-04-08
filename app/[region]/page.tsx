import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  REGION_SLUGS,
  getCodeFromSlug,
  getRegionNameFromSlug,
} from '@/lib/region-slugs';
import { RegionPageClient } from './RegionPageClient';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export function generateStaticParams() {
  return REGION_SLUGS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { region: slug } = await params;
  const regionName = getRegionNameFromSlug(slug);

  if (!regionName) {
    return {};
  }

  const title = `${regionName} - Compras Municipales | RindeChile`;
  const description = `Transparencia en compras municipales de la ${regionName}. Análisis de sobreprecios y anomalías en el gasto público municipal.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://rindechile.cl/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://rindechile.cl/${slug}`,
    },
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: slug } = await params;
  const code = getCodeFromSlug(slug);

  if (!code) {
    notFound();
  }

  const regionName = getRegionNameFromSlug(slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://rindechile.cl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: regionName,
        item: `https://rindechile.cl/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <RegionPageClient regionCode={code} />
    </>
  );
}
