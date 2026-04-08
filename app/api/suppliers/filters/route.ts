import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { purchases, municipalities } from '@/schemas/drizzle';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    if (!env.DB) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    const db = drizzle(env.DB);

    // Distinct municipalities that appear in purchases — the set of
    // municipalities that at least one supplier has served.
    const municipalitiesResults = await db
      .select({ name: municipalities.name })
      .from(purchases)
      .innerJoin(municipalities, eq(purchases.municipality_id, municipalities.id))
      .groupBy(municipalities.name)
      .orderBy(municipalities.name)
      .limit(500)
      .all();

    return NextResponse.json({
      success: true,
      data: {
        municipalities: municipalitiesResults.map(r => r.name),
      },
    }, {
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200' },
    });
  } catch (error) {
    console.error('Error fetching supplier filter options:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
