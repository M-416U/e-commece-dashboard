import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { name, billboardId } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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
    const category = await prismaDB.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ data: category, message: "category created" });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal error" });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const thereIsStore = prismaDB.store.findFirst({
      where: {
        id: params.storeId,
      },
    });
    if (!thereIsStore) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const category = await prismaDB.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json({
      data: category,
    });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal server error" });
  }
}
