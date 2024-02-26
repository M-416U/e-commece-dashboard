import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import prismaDB from "@/lib/prismadb";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/Orders/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
const Orders = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDB.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const formatedOrders = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((order) => order.product.name).join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, " yy  MMMM dd HH:mm:ss"),
  }));
  return (
    <div className="p-8 pt-6">
      <Heading
        title={`Orders(${orders.length})`}
        description="Here Your Store BillBoards"
      />
      <DataTable filterKey="products" columns={columns} data={formatedOrders} />
    </div>
  );
};
export default Orders;
