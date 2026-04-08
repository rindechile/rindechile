"use client";

import type { Supplier } from "./columns";
import { SupplierCard } from "./SupplierCard";

interface SupplierCardListProps {
  suppliers: Supplier[];
}

export function SupplierCardList({ suppliers }: SupplierCardListProps) {
  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-lg bg-card">
        <p className="text-muted-foreground">No se encontraron proveedores.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {suppliers.map((supplier, index) => (
        <SupplierCard
          key={supplier.rut}
          supplier={supplier}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}
