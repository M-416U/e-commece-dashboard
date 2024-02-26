import BillBoardForm from "@/components/dashboard/Billboards/billboard-form";
import prismaDB from "@/lib/prismadb";
const BillBoard = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  const billboard = await prismaDB.billboard.findFirst({
    where: {
      id: params.billboardId,
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6">
      <BillBoardForm initialData={billboard} />
    </div>
  );
};

export default BillBoard;
