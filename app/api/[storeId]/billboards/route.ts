import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { label, imageUrl } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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
    const billboard = await prismaDB.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ data: billboard, message: "billboard created" });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal error" });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
    const billboards = await prismaDB.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({
      data: billboards,
    });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal server error" });
  }
}
