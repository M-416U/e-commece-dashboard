import SizeForm from "@/components/dashboard/Sizes/size-form";
import prismaDB from "@/lib/prismadb";
const size = async ({
  params,
}: {
  params: { storeId: string; sizeId: string };
}) => {
  const size = await prismaDB.size.findFirst({
    where: {
      id: params.sizeId,
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6">
      <SizeForm initialData={size} />
    </div>
  );
};

export default size;
