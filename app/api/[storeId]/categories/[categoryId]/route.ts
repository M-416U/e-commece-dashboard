import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse("billboardId id is required", { status: 400 });
    }

    const category = await prismaDB.category.findFirst({
      where: { id: params.categoryId, storeId: params.storeId },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json({
      data: category,
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
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const body = await req.json();
    const { name, billboardId } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    if (!params.categoryId) {
      return new NextResponse("billboardId id is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
        statusText: "Name is required",
      });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", {
        status: 400,
        statusText: "Billboard Id required",
      });
    }
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
        statusText: "store id is required",
      });
    }
    const thereIsStore = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userID: userId,
      },
    });
    if (!thereIsStore) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await prismaDB.category.updateMany({
      where: { id: params.categoryId, storeId: params.storeId },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json({
      message: "category updated successfully",
      data: category,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
        statusText: "store Id",
      });
    }
    if (!params.categoryId) {
      return new NextResponse("category id is required", {
        status: 400,
        statusText: "category Id",
      });
    }

    const thereIsStore = await prismaDB.store.findFirst({
      where: {
        id: params.storeId,
        userID: userId,
      },
    });
    if (!thereIsStore) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const category = await prismaDB.category.deleteMany({
      where: { id: params.categoryId, storeId: params.storeId },
    });
    return NextResponse.json({
      message: "category Deleted successfully",
      data: category,
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
