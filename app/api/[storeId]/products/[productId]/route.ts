import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
    }

    const product = await prismaDB.product.findFirst({
      where: { id: params.productId, storeId: params.storeId },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });
    return NextResponse.json({
      data: product,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({
      message: "internal server error",
      error: error,
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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
      return new NextResponse("unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    if (!params.productId) {
      return new NextResponse("productId id is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!images || images.length === 0) {
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
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
        statusText: "store id is required",
      });
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

    await prismaDB.product.update({
      where: { id: params.productId, storeId: params.storeId },
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
          deleteMany: {},
        },
      },
    });

    const product = await prismaDB.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images],
          },
        },
      },
    });
    return NextResponse.json({
      message: "Product updated successfully",
      data: product,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("product is required", { status: 400 });
    }
    const product = await prismaDB.product.deleteMany({
      where: { id: params.productId, storeId: params.storeId },
    });
    return NextResponse.json({
      message: "product Deleted successfully",
      data: product,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({
      message: "internal server error",
      error: error,
      status: 500,
    });
  }
}
