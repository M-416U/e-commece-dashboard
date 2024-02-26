import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Billboards/columns";
import { format } from "date-fns";
const BillBoards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formatedBill = billboards.map((bill) => ({
    id: bill.id,
    label: bill.label,
    createdAt: format(bill.createdAt, " yyyy  MMMM do"),
  }));
  return (
    <div className="p-8 pt-6">
      <div className="flex justify-between items-center">
        <Heading
          title={`BillBoards(${billboards.length})`}
          description="Here Your Store BillBoards"
        />
        <Link href={"billboards/new"}>
          <Button>
            <Plus />
            New
          </Button>
        </Link>
      </div>
      <DataTable filterKey="label" columns={columns} data={formatedBill} />
    </div>
  );
};
export default BillBoards;
