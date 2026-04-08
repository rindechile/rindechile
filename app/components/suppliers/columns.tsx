"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { toSentenceCase } from "@/lib/utils";

export type Supplier = {
  rut: string;
  name: string | null;
  size: string | null;
};

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "rut",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="table"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RUT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-light font-mono">{row.getValue("rut")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="table"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null;
      return (
        <div className="font-light text-wrap min-w-[200px]">
          {name ? toSentenceCase(name) : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="table"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tamaño
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.getValue("size") as string | null;
      if (!size) return <div className="font-light text-muted-foreground">—</div>;
      return <Badge variant="secondary">{size}</Badge>;
    },
  },
];
