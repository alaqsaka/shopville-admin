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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: store.id,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_POST]", error);
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
