"use client";

import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { SupplierTableFilters } from "./SupplierTableFilters";
import { SupplierTableStatus } from "./SupplierTableStatus";
import { TablePagination } from "@/app/components/purchases/TablePagination";
import { SupplierCardList } from "./SupplierCardList";
import type { Supplier } from "./columns";
import type { FilterOptions, PaginationInfo, ServerSortingState, FilterState } from "./SuppliersTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions: FilterOptions;
  pagination?: PaginationInfo;
  sorting?: ServerSortingState;
  filters?: FilterState;
  onPageChange?: (page: number) => void;
  onSortingChange?: (sorting: ServerSortingState) => void;
  onFiltersChange?: (filters: FilterState) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterOptions,
  pagination: serverPagination,
  sorting: serverSorting,
  filters,
  onPageChange,
  onSortingChange,
  onFiltersChange,
}: DataTableProps<TData, TValue>) {
  const [clientSorting, setClientSorting] = useState<SortingState>([]);

  const useServerMode = !!serverPagination && !!onPageChange && !!onSortingChange && !!onFiltersChange;

  const [clientPagination, setClientPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableSorting = useServerMode && serverSorting
    ? [{ id: serverSorting.id, desc: serverSorting.desc }]
    : clientSorting;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: useServerMode ? undefined : getPaginationRowModel(),
    getSortedRowModel: useServerMode ? undefined : getSortedRowModel(),
    onSortingChange: useServerMode
      ? (updater) => {
          const newSorting = typeof updater === 'function' ? updater(tableSorting) : updater;
          if (newSorting.length > 0) {
            onSortingChange({ id: newSorting[0].id, desc: newSorting[0].desc });
          } else {
            onSortingChange(null);
          }
        }
      : setClientSorting,
    onPaginationChange: useServerMode ? undefined : setClientPagination,
    manualPagination: useServerMode,
    manualSorting: useServerMode,
    pageCount: useServerMode ? serverPagination.totalPages : undefined,
    state: {
      sorting: tableSorting,
      pagination: useServerMode
        ? { pageIndex: serverPagination.page - 1, pageSize: serverPagination.limit }
        : clientPagination,
    },
  });

  const handleClearAll = () => {
    if (onFiltersChange) {
      onFiltersChange({ search: null, municipalityName: null });
    }
    if (onSortingChange) {
      onSortingChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <SupplierTableFilters
        search={filters?.search ?? null}
        municipalityName={filters?.municipalityName ?? null}
        sorting={serverSorting ?? null}
        filterOptions={filterOptions}
        onSearchChange={(value) => onFiltersChange?.({ ...filters, search: value, municipalityName: filters?.municipalityName ?? null })}
        onMunicipalityChange={(value) => onFiltersChange?.({ ...filters, search: filters?.search ?? null, municipalityName: value })}
        onSortChange={(sort) => onSortingChange?.(sort)}
        onClearAll={handleClearAll}
      />

      {/* Mobile: Card View */}
      <div className="tablet:hidden">
        <SupplierCardList suppliers={data as Supplier[]} />
      </div>

      {/* Tablet+: Table View */}
      <div className="hidden tablet:block border border-border rounded-lg">
        <Table aria-label="Tabla de proveedores del Estado">
          <TableCaption className="sr-only">
            Tabla de proveedores del Estado. Usa los filtros para restringir por municipio o buscar por nombre o RUT.
          </TableCaption>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron proveedores.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <SupplierTableStatus
          table={table}
          serverPagination={useServerMode ? {
            total: serverPagination.total,
            page: serverPagination.page,
            limit: serverPagination.limit,
          } : undefined}
        />
        <TablePagination
          table={table}
          onPageChange={useServerMode ? onPageChange : undefined}
        />
      </div>
    </div>
  );
}
