"use client";

import { formatCurrency } from "@/lib/utils";

type ExcessBadgeProps = {
  percentage: number | null;
  maxAcceptablePrice: number | null;
  variant?: "default" | "compact";
};

export function ExcessBadge({ percentage, maxAcceptablePrice, variant = "default" }: ExcessBadgeProps) {
  if (percentage === null || maxAcceptablePrice === null) {
    return <div className="font-light text-muted-foreground">N/A</div>;
  }

  const getTierColor = (percent: number) => {
    if (percent <= 20) {
      return "bg-[var(--tier-bajo)] text-[var(--tier-alto)]";
    } else if (percent <= 50) {
      return "bg-[var(--tier-medio)] text-[var(--tier-bajo)]";
    } else {
      return "bg-[var(--tier-alto)] text-[var(--tier-bajo)]";
    }
  };

  const colorClass = getTierColor(percentage);
  const priceRange = formatCurrency(maxAcceptablePrice);

  // Compact variant for mobile cards - only shows the badge with "Exceso:" prefix
  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        Exceso: +{percentage.toFixed(1)}%
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}>
        +{percentage.toFixed(1)}%
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        Precio Máximo Aceptable: {priceRange}
      </div>
    </div>
  );
}
