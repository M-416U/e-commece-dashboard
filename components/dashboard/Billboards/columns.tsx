"use client";

import { ColumnDef } from "@tanstack/react-table";
import BillBoardActions from "./bill-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillBoard = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillBoard>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <BillBoardActions data={row.original} />,
  },
];
