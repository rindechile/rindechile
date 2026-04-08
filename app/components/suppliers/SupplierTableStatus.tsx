import type { Table } from "@tanstack/react-table";
import { formatNumber } from "@/lib/utils";

interface ServerPaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface SupplierTableStatusProps<TData> {
  table: Table<TData>;
  serverPagination?: ServerPaginationInfo;
}

export function SupplierTableStatus<TData>({ table, serverPagination }: SupplierTableStatusProps<TData>) {
  const isServerMode = !!serverPagination;

  const totalRows = isServerMode
    ? serverPagination.total
    : table.getFilteredRowModel().rows.length;

  if (totalRows === 0) {
    return (
      <div className="flex-1 text-xs tablet:text-sm text-muted-foreground">
        Sin resultados
      </div>
    );
  }

  const startRow = isServerMode
    ? (serverPagination.page - 1) * serverPagination.limit + 1
    : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;

  const endRow = isServerMode
    ? Math.min(serverPagination.page * serverPagination.limit, totalRows)
    : Math.min(
        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
        totalRows
      );

  const noun = totalRows === 1 ? 'proveedor' : 'proveedores';
  const statusText = `Mostrando filas ${formatNumber(startRow)} a ${formatNumber(endRow)} de ${formatNumber(totalRows)} ${noun}`;

  return (
    <div className="flex-1 text-xs tablet:text-sm text-muted-foreground">
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {statusText}
      </span>

      <span className="tablet:hidden" aria-hidden="true">
        <span className="font-medium text-foreground">{formatNumber(startRow)}-{formatNumber(endRow)}</span>
        {' '}de{' '}
        <span className="font-medium text-foreground">{formatNumber(totalRows)}</span>
      </span>

      <span className="hidden tablet:inline" aria-hidden="true">
        Mostrando filas{' '}
        <span className="font-medium text-foreground">{formatNumber(startRow)}</span>
        {' '}a{' '}
        <span className="font-medium text-foreground">{formatNumber(endRow)}</span>
        {' '}de{' '}
        <span className="font-medium text-foreground">{formatNumber(totalRows)}</span>
        {' '}{noun}
      </span>
    </div>
  );
}
