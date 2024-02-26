import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Categories/columns";
import { format } from "date-fns";
const categories = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
  });

  const formatedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, " yyyy  MMMM do"),
  }));
  return (
    <div className="p-8 pt-6">
      <div className="flex justify-between items-center">
        <Heading
          title={`categories(${categories.length})`}
          description="Here Your Store categories"
        />
        <Link href={"categories/new"}>
          <Button>
            <Plus />
            New
          </Button>
        </Link>
      </div>
      <DataTable filterKey="name" columns={columns} data={formatedCategories} />
    </div>
  );
};
export default categories;
