"use client";

import { ColumnDef } from "@tanstack/react-table";
import ProductActions from "./product-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string;
  name: string;
  price: string;
  color: string;
  size: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "color",
    cell: ({ row }) => (
      <div className="flex">
        <span
          className="rounded-full w-6 h-6"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <ProductActions data={row.original} />,
  },
];
