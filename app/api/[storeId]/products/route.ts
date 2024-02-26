import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      images,
      price,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      colorId,
    } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }

    const thereIsStore = prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userID: userId,
      },
    });
    if (!thereIsStore) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const product = await prismaDB.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        sizeId,
        colorId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images?.map((image: typeof Image) => image)],
          },
        },
      },
    });
    return NextResponse.json({ data: product, message: "Product created" });
  } catch (error) {
    return new NextResponse("internal Server Error", {
      status: 500,
      statusText: JSON.stringify(error),
    });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const thereIsStore = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!thereIsStore) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const whereClause: any = {
      storeId: params.storeId,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (sizeId) {
      whereClause.sizeId = sizeId;
    }

    if (colorId) {
      whereClause.colorId = colorId;
    }

    if (isFeatured) {
      whereClause.isFeatured = true;
    }
    const products = await prismaDB.product.findMany({
      where: whereClause,
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    });

    console.log("Products", products);
    return NextResponse.json({
      data: products,
    });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal server error" });
  }
}
