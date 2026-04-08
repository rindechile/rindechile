"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/app/components/ui/sheet";
import { Check, ArrowUp, ArrowDown } from "lucide-react";

import type { ServerSortingState as SortingState } from "./SuppliersTable";
export type { SortingState };

interface SupplierMobileSortSheetProps {
  currentSort: SortingState;
  onSortChange: (sort: SortingState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SORT_OPTIONS = [
  { id: "name", label: "Nombre" },
  { id: "rut", label: "RUT" },
  { id: "size", label: "Tamaño" },
] as const;

export function SupplierMobileSortSheet({
  currentSort,
  onSortChange,
  open,
  onOpenChange,
}: SupplierMobileSortSheetProps) {
  const handleSelect = (id: string) => {
    if (currentSort?.id === id) {
      if (currentSort.desc) {
        onSortChange(null);
      } else {
        onSortChange({ id, desc: true });
      }
    } else {
      onSortChange({ id, desc: false });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-xl max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Ordenar por</SheetTitle>
          <SheetDescription>
            Selecciona el criterio de ordenamiento
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 py-4 overflow-y-auto">
          {SORT_OPTIONS.map((option) => {
            const isActive = currentSort?.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                aria-current={isActive ? "true" : undefined}
              >
                <span className={isActive ? "font-medium" : ""}>
                  {option.label}
                </span>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <>
                      {currentSort.desc ? (
                        <ArrowDown className="size-4 text-muted-foreground" />
                      ) : (
                        <ArrowUp className="size-4 text-muted-foreground" />
                      )}
                      <Check className="size-4 text-primary" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { SORT_OPTIONS };
