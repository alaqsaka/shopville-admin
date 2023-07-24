import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Create new category
export async function POST(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Category name is required.", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required.", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required.", { status: 400 });
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: billboardId,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      return new NextResponse(
        "Unauthorized. Don't have access to this billboard.",
        {
          status: 401,
        }
      );
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Get all category
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
