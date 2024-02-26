import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { name, value } = body;
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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
    const color = await prismaDB.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ data: color, message: "color created" });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal error" });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const colors = await prismaDB.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({
      data: colors,
    });
  } catch (error) {
    return NextResponse.json({ data: error, message: "internal server error" });
  }
}
