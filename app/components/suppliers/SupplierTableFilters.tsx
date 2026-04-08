"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableCombobox } from "@/app/components/purchases/TableCombobox";
import { SmartSearch } from "@/app/components/purchases/SmartSearch";
import { SupplierMobileSortSheet, type SortingState } from "./SupplierMobileSortSheet";
import { SupplierFilterChips } from "./SupplierFilterChips";
import type { FilterOptions } from "./SuppliersTable";

interface SupplierTableFiltersProps {
  search: string | null;
  municipalityName: string | null;
  sorting: SortingState;
  filterOptions: FilterOptions;
  onSearchChange: (value: string | null) => void;
  onMunicipalityChange: (value: string | null) => void;
  onSortChange: (sort: SortingState) => void;
  onClearAll: () => void;
}

export function SupplierTableFilters({
  search,
  municipalityName,
  sorting,
  filterOptions,
  onSearchChange,
  onMunicipalityChange,
  onSortChange,
  onClearAll,
}: SupplierTableFiltersProps) {
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Sort Button (mobile only) */}
      <div className="flex gap-2">
        <SmartSearch
          value={search ?? ""}
          onChange={(value) => onSearchChange(value || null)}
          placeholder="Buscar por nombre o RUT..."
        />
        <Button
          variant="outline"
          size="icon"
          className="tablet:hidden shrink-0"
          onClick={() => setIsSortSheetOpen(true)}
          aria-label="Ordenar resultados"
        >
          <ArrowUpDown className="size-4" />
        </Button>
      </div>

      {/* Row 2: Municipality filter (always visible) */}
      <div>
        <TableCombobox
          options={filterOptions.municipalities}
          value={municipalityName ?? ""}
          onValueChange={(value) => onMunicipalityChange(value || null)}
          placeholder="Filtrar por municipio..."
          searchPlaceholder="Buscar municipios..."
          emptyText="No se encontraron municipios."
        />
      </div>

      {/* Row 3: Filter chips */}
      <SupplierFilterChips
        search={search}
        municipalityName={municipalityName}
        sorting={sorting}
        onClearSearch={() => onSearchChange(null)}
        onClearMunicipality={() => onMunicipalityChange(null)}
        onClearSort={() => onSortChange(null)}
        onClearAll={onClearAll}
      />

      {/* Mobile sort sheet */}
      <SupplierMobileSortSheet
        currentSort={sorting}
        onSortChange={onSortChange}
        open={isSortSheetOpen}
        onOpenChange={setIsSortSheetOpen}
      />
    </div>
  );
}
