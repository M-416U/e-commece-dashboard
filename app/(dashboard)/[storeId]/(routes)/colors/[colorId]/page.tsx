import ColorForm from "@/components/dashboard/Colors/color-form";
import prismaDB from "@/lib/prismadb";
const Color = async ({
  params,
}: {
  params: { storeId: string; colorId: string };
}) => {
  const color = await prismaDB.color.findFirst({
    where: {
      id: params.colorId,
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6">
      <ColorForm initialData={color} />
    </div>
  );
};

export default Color;
