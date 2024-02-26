import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("billboardId id is required", { status: 400 });
    }

    const billboard = await prismaDB.billboard.findFirst({
      where: { id: params.billboardId, storeId: params.storeId },
    });
    return NextResponse.json({
      data: billboard,
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
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const body = await req.json();
    const { label, imageUrl } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    if (!params.billboardId) {
      return new NextResponse("billboardId id is required", { status: 400 });
    }
    if (!label) {
      return new NextResponse("label is required", {
        status: 400,
        statusText: "label is required",
      });
    }
    if (!imageUrl) {
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

    const billboard = await prismaDB.billboard.updateMany({
      where: { id: params.billboardId, storeId: params.storeId },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json({
      message: "billboard updated successfully",
      data: billboard,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("billboardId id is required", { status: 400 });
    }
    const billboard = await prismaDB.billboard.deleteMany({
      where: { id: params.billboardId, storeId: params.storeId },
    });
    return NextResponse.json({
      message: "billboard Deleted successfully",
      data: billboard,
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
