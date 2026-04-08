"use client";

import type { Supplier } from "./columns";
import { Badge } from "@/app/components/ui/badge";
import { toSentenceCase } from "@/lib/utils";

interface SupplierCardProps {
  supplier: Supplier;
  animationDelay?: number;
}

export function SupplierCard({ supplier, animationDelay = 0 }: SupplierCardProps) {
  return (
    <div
      className="bg-background border border-border rounded-lg animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex flex-row items-start justify-between gap-3 px-4 py-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base text-wrap leading-tight line-clamp-2">
            {supplier.name ? toSentenceCase(supplier.name) : "—"}
          </p>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            RUT: {supplier.rut}
          </p>
        </div>
        <div className="flex-shrink-0">
          {supplier.size ? (
            <Badge variant="secondary">{supplier.size}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
