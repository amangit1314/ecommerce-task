import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { decrypt, verifyToken } from "@/helpers/jwt_helper";
import cors, { runMiddleware } from "@/lib/cors";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          response: "ERROR",
          message: "Token is missing ⚠, Login first ...",
        },
        { status: 404 }
      );
    }

    const decryptedToken = await decrypt(token);
    const userId = decryptedToken.id;
    if (!userId) {
      console.log("No userId is provided ...");
      return NextResponse.json(
        {
          success: false,
          response: "ERROR",
          message: `TOKEN: ${token}, ERROR: user id not found 🤦‍♂️⚠...`,
        },
        { status: 403 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      console.log("No user found in the db ...");
      return NextResponse.json(
        {
          success: false,
          response: "ERROR",
          message: `No user found with this ${userId} 🤦‍♂️⚠...`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        response: "OK",
        data: user,
        message: "User found successfully ...",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR in api/auth/me: ", error.message);
    return NextResponse.json(
      {
        success: false,
        response: "ERROR",
        error: error.message,
        message: "Internal Server Error ⚠ ...",
      },
      { status: 500 }
    );
  }
}
