import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Colors/columns";
import { format } from "date-fns";
const Colors = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formatedColors = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, " yyyy  MMMM do"),
  }));
  return (
    <div className="p-8 pt-6">
      <div className="flex justify-between items-center">
        <Heading
          title={`Colors(${colors.length})`}
          description="Here Your Store Colors"
        />
        <Link href={"colors/new"}>
          <Button>
            <Plus />
            New
          </Button>
        </Link>
      </div>
      <DataTable filterKey="name" columns={columns} data={formatedColors} />
    </div>
  );
};
export default Colors;
