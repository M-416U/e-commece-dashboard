import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Sizes/columns";
import { format } from "date-fns";
const sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formatedSizes = sizes.map((bill) => ({
    id: bill.id,
    name: bill.name,
    value: bill.value,
    createdAt: format(bill.createdAt, " yyyy  MMMM do"),
  }));
  return (
    <div className="p-8 pt-6">
      <div className="flex justify-between items-center">
        <Heading
          title={`sizes(${sizes.length})`}
          description="Here Your Store sizes"
        />
        <Link href={"sizes/new"}>
          <Button>
            <Plus />
            New
          </Button>
        </Link>
      </div>
      <DataTable filterKey="name" columns={columns} data={formatedSizes} />
    </div>
  );
};
export default sizes;
