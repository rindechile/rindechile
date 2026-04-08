"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, type Supplier } from "./columns";
import { SuppliersTableSkeleton } from "./SuppliersTableSkeleton";

export type FilterOptions = {
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

export function SuppliersTable() {
  const [data, setData] = useState<Supplier[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
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

  // Fetch filter options once on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchFilters() {
      try {
        const response = await fetch('/api/suppliers/filters');
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
  }, []);

  // Fetch suppliers data when any parameter changes
  useEffect(() => {
    let cancelled = false;

    async function fetchSuppliers() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
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

        const response = await fetch(`/api/suppliers?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json() as {
          success: boolean;
          data?: Supplier[];
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
            setError(result.error || 'Failed to load suppliers data');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching data:', err);
          setError('No se pudieron cargar los datos. Actualiza e inténtalo de nuevo.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSuppliers();
    return () => { cancelled = true; };
  }, [pagination.page, pagination.limit, sorting, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortingChange = (newSorting: ServerSortingState) => {
    setSorting(newSorting);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return <SuppliersTableSkeleton />;
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
