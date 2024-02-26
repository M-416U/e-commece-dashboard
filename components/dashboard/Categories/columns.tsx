"use client";

import { ColumnDef } from "@tanstack/react-table";
import CategoryActions from "./category-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Billboard Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <CategoryActions data={row.original} />,
  },
];
