import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Products/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
const BillBoards = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismaDB.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
  });

  const formatedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    color: product.color.value,
    size: product.size.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    createdAt: format(product.createdAt, " yyyy  MMMM do"),
  }));
  return (
    <div className="p-8 pt-6">
      <div className="flex justify-between items-center">
        <Heading
          title={`Products(${formatedProducts.length})`}
          description="Here Your Store Products"
        />
        <Link href={"products/new"}>
          <Button>
            <Plus />
            New
          </Button>
        </Link>
      </div>
      <DataTable filterKey="name" columns={columns} data={formatedProducts} />
    </div>
  );
};
export default BillBoards;
