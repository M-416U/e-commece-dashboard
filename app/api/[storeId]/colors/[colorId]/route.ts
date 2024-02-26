import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("size id is required", { status: 400 });
    }

    const color = await prismaDB.color.findFirst({
      where: { id: params.colorId, storeId: params.storeId },
    });
    return NextResponse.json({
      data: color,
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
  { params }: { params: { storeId: string; colorId: string } }
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
    if (!params.colorId) {
      return new NextResponse("color Id  is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("name is required", {
        status: 400,
        statusText: "name is required",
      });
    }
    if (!value) {
      return new NextResponse("color Id is required", {
        status: 400,
        statusText: "color Id required",
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

    const color = await prismaDB.color.updateMany({
      where: { id: params.colorId, storeId: params.storeId },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json({
      message: "size updated successfully",
      data: color,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("color id is required", { status: 400 });
    }
    const color = await prismaDB.color.deleteMany({
      where: { id: params.colorId, storeId: params.storeId },
    });
    return NextResponse.json({
      message: "size Deleted successfully",
      data: color,
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
