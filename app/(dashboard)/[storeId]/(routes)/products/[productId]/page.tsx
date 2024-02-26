import ProductForm from "@/components/dashboard/Products/product-form";
import prismaDB from "@/lib/prismadb";
const BillBoard = async ({
  params,
}: {
  params: { storeId: string; productId: string };
}) => {
  const product = await prismaDB.product.findUnique({
    where: {
      id: params.productId,
      storeId: params.storeId,
    },
    include: {
      images: true,
    },
  });
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6">
      <ProductForm
        categories={categories}
        colors={colors}
        sizes={sizes}
        initialData={product}
      />
    </div>
  );
};

export default BillBoard;
