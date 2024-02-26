"use client";

import { ColumnDef } from "@tanstack/react-table";
import ColorsActions from "./color-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Color = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<Color>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    cell: ({ row }) => (
      <div className="flex">
        <span
          className="rounded-full w-6 h-6"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <ColorsActions data={row.original} />,
  },
];
