import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
      const reqBody = await req.json();
      const userId = reqBody;
  
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            status: "ERROR",
            message: `[MISSING_REQUIRED_FIELD], no userId found in the req which is required field ... `,
          },
          { status: 400 }
        );
      }
  
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });
  
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            status: "ERROR",
            message: `[NOT_FOUND], no user found with this userId: ${userId} ... `,
          },
          { status: 404 }
        );
      }
  
      const orders = await db.order.findMany({
        where: {
          userId,
        },
        include: {
          orderItems: true,
        },
      });
  
      return NextResponse.json(
        {
          success: true,
          status: "OK",
          data: orders,
          message: "User orders fetched successfully ...",
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          status: "ERROR",
          error: error,
          message: "Failed to fetch user orders, INTERNAL SERVER ERROR ...",
        },
        { status: 500 }
      );
    }
  };
  