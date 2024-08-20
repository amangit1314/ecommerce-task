import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      userId,
      shippingAddress,
      mobileNumber,
      email,
      paymentMethod,
      cartItems,
      orderTotalPrice, 
    } = await request.json();

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        shippingAddress,
        mobileNumber,
        email,
        paymentMethod,
        totalPrice: orderTotalPrice, 
        orderItems: {
          create: cartItems.map((item: any) => ({
            selectedSize: item.selectedSize,
            totalPrice: item.totalPrice,
            quantity: item.quantity,
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error placing cart order:', error);
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  }
}
