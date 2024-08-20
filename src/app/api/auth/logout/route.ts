import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import cors, { runMiddleware } from "@/lib/cors";

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
  await runMiddleware(req, NextResponse, cors);
  return new NextResponse("OK", { status: 200 });
}

export const POST = (req: NextRequest) => {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "NO_TOKEN_FOUND, You are already logged out ..." },
      { status: 200 }
    );
  }

  const res = NextResponse.next();
  res.cookies.delete("token");

  return NextResponse.json(
    { message: "Logout successful..." },
    { status: 200 }
  );
};
