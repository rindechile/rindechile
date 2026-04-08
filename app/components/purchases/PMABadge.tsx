"use client";

import { formatCurrency } from "@/lib/utils";

type PMABadgeProps = {
  maxAcceptablePrice: number | null;
};

export function PMABadge({ maxAcceptablePrice }: PMABadgeProps) {
  if (maxAcceptablePrice === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
      PMA: {formatCurrency(maxAcceptablePrice)}
    </div>
  );
}
