import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("size id is required", { status: 400 });
    }

    const size = await prismaDB.size.findFirst({
      where: { id: params.sizeId, storeId: params.storeId },
    });
    return NextResponse.json({
      data: size,
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
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const body = await req.json();
    const { name, value } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    if (!params.sizeId) {
      return new NextResponse("sizeId id is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("name is required", {
        status: 400,
        statusText: "name is required",
      });
    }
    if (!value) {
      return new NextResponse("image URL is required", {
        status: 400,
        statusText: "image URL required",
      });
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

    const size = await prismaDB.size.updateMany({
      where: { id: params.sizeId, storeId: params.storeId },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json({
      message: "size updated successfully",
      data: size,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("sizeId id is required", { status: 400 });
    }
    const size = await prismaDB.size.deleteMany({
      where: { id: params.sizeId, storeId: params.storeId },
    });
    return NextResponse.json({
      message: "size Deleted successfully",
      data: size,
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
