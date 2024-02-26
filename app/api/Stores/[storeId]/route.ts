import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    if (!name) {
      return new NextResponse("name is required", {
        status: 400,
        statusText: "name is required",
      });
    }
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
        statusText: "store id is required",
      });
    }

    const store = await prismaDB.store.updateMany({
      where: { id: params.storeId, userID: userId },
      data: {
        name,
      },
    });
    return NextResponse.json({
      message: "Store updated successfully",
      data: store,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const store = await prismaDB.store.deleteMany({
      where: { id: params.storeId, userID: userId },
    });
    return NextResponse.json({
      message: "Store Deleted successfully",
      data: store,
      status: 200,
    });
  } catch (error) {
    NextResponse.json({ message: "internal error", error: error, status: 500 });
  }
}
