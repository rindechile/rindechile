import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { suppliers, purchases, municipalities } from '@/schemas/drizzle';
import { desc, asc, sql, like, and, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 1000);
    const offset = (page - 1) * limit;

    // Filtering parameters
    const searchQuery = searchParams.get('search'); // Name or RUT
    const municipalityNameFilter = searchParams.get('municipalityName');

    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Access Cloudflare D1 database via context
    const { env } = getCloudflareContext();
    if (!env.DB) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    const db = drizzle(env.DB);

    // Base select — no JOIN needed when municipality filter is absent
    let query = db
      .select({
        rut: suppliers.rut,
        name: suppliers.name,
        size: suppliers.size,
      })
      .from(suppliers)
      .$dynamic();

    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(suppliers)
      .$dynamic();

    // Build WHERE conditions array
    const whereConditions = [];

    // Apply municipality filter via EXISTS subquery — avoids DISTINCT over
    // the 620K-row purchases table and keeps the count accurate.
    if (municipalityNameFilter) {
      whereConditions.push(
        sql`EXISTS (
          SELECT 1 FROM ${purchases}
          INNER JOIN ${municipalities} ON ${municipalities.id} = ${purchases.municipality_id}
          WHERE ${purchases.supplier_rut} = ${suppliers.rut}
            AND ${municipalities.name} = ${municipalityNameFilter}
        )`
      );
    }

    // Apply search filter (searches name and RUT)
    if (searchQuery) {
      const escapedSearch = searchQuery.replace(/[%_]/g, '\\$&');
      whereConditions.push(
        or(
          like(suppliers.name, `%${escapedSearch}%`),
          like(suppliers.rut, `%${escapedSearch}%`)
        )
      );
    }

    // Apply WHERE conditions to both queries
    if (whereConditions.length > 0) {
      const combinedConditions = whereConditions.length === 1
        ? whereConditions[0]
        : and(...whereConditions);
      query = query.where(combinedConditions);
      countQuery = countQuery.where(combinedConditions);
    }

    // Apply sorting
    let orderByClause;
    const isAsc = sortOrder === 'asc';

    switch (sortBy) {
      case 'rut':
        orderByClause = isAsc ? asc(suppliers.rut) : desc(suppliers.rut);
        break;
      case 'size':
        orderByClause = isAsc ? asc(suppliers.size) : desc(suppliers.size);
        break;
      case 'name':
      default:
        orderByClause = isAsc ? asc(suppliers.name) : desc(suppliers.name);
        break;
    }

    // Execute both queries in parallel
    const [countResult, results] = await Promise.all([
      countQuery.get(),
      query
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset)
        .all(),
    ]);

    const total = countResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (error) {
    console.error('Error fetching suppliers data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
