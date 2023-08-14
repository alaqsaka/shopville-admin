import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    const body = await req.json();
    const { name, value } = body;

    if (!params.storeId) {
      return new NextResponse("Store id is required.", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId: userId },
    });

    if (!store) {
      return new NextResponse(
        "Unauthorized. User don't have access to this store.",
        { status: 403 }
      );
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required!", { status: 400 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: store.id,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get All Size
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
