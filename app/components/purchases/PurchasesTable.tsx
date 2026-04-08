"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, type Purchase } from "./columns";
import { useMapContext } from "../../contexts/MapContext";
import { PurchasesTableSkeleton } from "./PurchasesTableSkeleton";

export type FilterOptions = {
  items: string[];
  municipalities: string[];
};

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type ServerSortingState = {
  id: string;
  desc: boolean;
} | null;

export type FilterState = {
  search: string | null;
  municipalityName: string | null;
};

export function PurchasesTable() {
  const [data, setData] = useState<Purchase[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    items: [],
    municipalities: [],
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [sorting, setSorting] = useState<ServerSortingState>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: null,
    municipalityName: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { detailPanelData } = useMapContext();

  // Build geographic scope params (shared between both effects)
  const buildScopeParams = () => {
    const params = new URLSearchParams();
    if (detailPanelData) {
      params.append('level', detailPanelData.level);
      if (detailPanelData.level === 'region') {
        params.append('regionId', detailPanelData.regionId);
      } else if (detailPanelData.level === 'municipality') {
        params.append('municipalityId', detailPanelData.municipalityId.toString());
      }
    } else {
      params.append('level', 'country');
    }
    return params;
  };

  // Fetch filter options only when geographic scope changes
  useEffect(() => {
    let cancelled = false;

    async function fetchFilters() {
      try {
        const params = buildScopeParams();
        const response = await fetch(`/api/purchases/filters?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch filters');

        const result = await response.json() as {
          success: boolean;
          data?: FilterOptions;
          error?: string;
        };

        if (!cancelled && result.success && result.data) {
          setFilterOptions(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching filter options:', err);
        }
      }
    }

    fetchFilters();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailPanelData]);

  // Fetch purchase data when any parameter changes
  useEffect(() => {
    let cancelled = false;

    async function fetchPurchases() {
      try {
        setLoading(true);
        setError(null);

        const params = buildScopeParams();
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());

        if (sorting) {
          params.append('sortBy', sorting.id);
          params.append('sortOrder', sorting.desc ? 'desc' : 'asc');
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.municipalityName) {
          params.append('municipalityName', filters.municipalityName);
        }

        const response = await fetch(`/api/purchases?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json() as {
          success: boolean;
          data?: Purchase[];
          pagination?: PaginationInfo;
          error?: string;
        };

        if (!cancelled) {
          if (result.success && result.data) {
            setData(result.data);
            if (result.pagination) {
              setPagination(result.pagination);
            }
          } else {
            setError(result.error || 'Failed to load purchases data');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching data:', err);
          setError('Unable to load data. Please refresh and try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPurchases();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailPanelData, pagination.page, pagination.limit, sorting, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortingChange = (newSorting: ServerSortingState) => {
    setSorting(newSorting);
    // Reset to page 1 when sorting changes
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return <PurchasesTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      filterOptions={filterOptions}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      onPageChange={handlePageChange}
      onSortingChange={handleSortingChange}
      onFiltersChange={handleFiltersChange}
    />
  );
}
