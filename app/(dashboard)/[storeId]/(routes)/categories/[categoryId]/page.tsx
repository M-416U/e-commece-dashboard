import BillBoardForm from "@/components/dashboard/Categories/categories-form";
import prismaDB from "@/lib/prismadb";
const BillBoard = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  const category = await prismaDB.category.findFirst({
    where: {
      id: params.categoryId,
      storeId: params.storeId,
    },
  });
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6">
      <BillBoardForm initialData={category} billboards={billboards} />
    </div>
  );
};

export default BillBoard;
