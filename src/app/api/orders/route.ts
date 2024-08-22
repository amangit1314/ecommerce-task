import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import cors, { runMiddleware } from "@/lib/cors";
import { generateUid } from "@/helpers/id_helper";
import { OrderItem } from "@prisma/client";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  try {
    const reqBody = await request.json();
    const {
      userId,
      shippingAddress,
      mobileNumber,
      email,
      paymentMethod,
      orderItems,
      orderTotalPrice,
    } = reqBody;

    if (!userId || !orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    console.log("Received order data: ", reqBody);

    // Create the order first
    const order = await db.order.create({
      data: {
        userId,
        shippingAddress,
        mobileNumber,
        email,
        paymentMethod,
        totalPrice: orderTotalPrice,
    
        // No orderItems here
      },
      include: {
        orderItems: true,
      },
    });

    // Create OrderItems with relation to the created Order
    const createdOrderItems = await Promise.all(
      orderItems.map((item: OrderItem) =>
        db.orderItem.create({
          data: {
            selectedSize: item.selectedSize,
            productImageLink: orderItems[0].productImageLink,
            totalPrice: item.totalPrice,
            quantity: item.quantity,
            productId: item.productId,
            productName: item.productName,
            sellerName: item.sellerName,
            selectedProductSize: item.selectedProductSize,
            orderId: order.id, // Link to the created Order
          },
        })
      )
    );

    // Update the order with created OrderItems
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        orderItems: {
          connect: createdOrderItems.map((item) => ({ id: item.id })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("Created order: ", updatedOrder);

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        message: "Order placed successfully",
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message: "Failed to place order",
        error: error,
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: true,
      },
    });

    console.log("orders: ", orders);

    return NextResponse.json(
      {
        success: true,
        status: "OK",
        data: orders,
        message: "orders fetched successfully ...",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: error,
        message: "Failed to fetch orders, INTERNAL SERVER ERROR ...",
      },
      { status: 500 }
    );
  }
};
