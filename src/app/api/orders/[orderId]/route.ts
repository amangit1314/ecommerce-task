import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import cors, { runMiddleware } from "@/lib/cors";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

export const dynamic = "force-dynamic";

// GET request to fetch details of a specific order by orderId
export const GET = async (
  req: Request,
  { params }: { params: { orderId: string } }
) => {
  try {
    const orderId = params?.orderId!;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    console.log("Order details: ", order);

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        data: order,
        message: "Order details fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching order details:", error.message);
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: error.message,
        message: "Failed to fetch order details, INTERNAL SERVER ERROR",
      },
      { status: 500 }
    );
  }
};
