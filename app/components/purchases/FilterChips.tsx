"use client";

import { X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import type { SortingState } from "./MobileSortSheet";
import { SORT_OPTIONS } from "./MobileSortSheet";

interface FilterChipProps {
  label: string;
  onClear: () => void;
  ariaLabel: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

function FilterChip({ label, onClear, ariaLabel, variant = "secondary", className }: FilterChipProps) {
  return (
    <Badge variant={variant} className={`gap-1 pr-1 ${className ?? ""}`}>
      <span className="truncate">{label}</span>
      <button
        onClick={onClear}
        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
        aria-label={ariaLabel}
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}

interface FilterChipsProps {
  search: string | null;
  municipalityName: string | null;
  sorting: SortingState;
  onClearSearch: () => void;
  onClearMunicipality: () => void;
  onClearSort: () => void;
  onClearAll: () => void;
}

function getSortLabel(sortId: string): string {
  const option = SORT_OPTIONS.find((opt) => opt.id === sortId);
  return option?.label ?? sortId;
}

export function FilterChips({
  search,
  municipalityName,
  sorting,
  onClearSearch,
  onClearMunicipality,
  onClearSort,
  onClearAll,
}: FilterChipsProps) {
  const hasAnyFilter = search || municipalityName || sorting;

  if (!hasAnyFilter) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {search && (
        <FilterChip
          label={`Busqueda: ${search}`}
          onClear={onClearSearch}
          ariaLabel="Eliminar filtro de busqueda"
          className="max-w-[200px]"
        />
      )}
      {municipalityName && (
        <FilterChip
          label={`Municipio: ${municipalityName}`}
          onClear={onClearMunicipality}
          ariaLabel="Eliminar filtro de municipio"
          className="max-w-[200px]"
        />
      )}
      {sorting && (
        <FilterChip
          label={`Orden: ${getSortLabel(sorting.id)} (${sorting.desc ? "desc" : "asc"})`}
          onClear={onClearSort}
          ariaLabel="Eliminar ordenamiento"
          variant="outline"
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 px-2 text-xs"
      >
        Limpiar todo
      </Button>
    </div>
  );
}
