import bcrypt from "bcrypt";
import { generateAccessToken } from "@/helpers/jwt_helper";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import cors, { runMiddleware } from '@/lib/cors';

// Handle the OPTIONS request
export async function OPTIONS(req: NextRequest) {
    await runMiddleware(req, NextResponse, cors);
    return new NextResponse('OK', { status: 200 });
}

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    try {
        if (!email || !password) {
            return NextResponse.json({
                status: false,
                message: "Email and password fields are mandatory 👮‍♂️ ",
            }, { status: 400 });
        }

        const user = await db.user.findFirst({ where: { email } });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "Authentication failed. User not found ",
            }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({
                status: false,
                error: "Authentication failed. Wrong password ",
                message: "Authentication failed. Wrong password ",
            }, { status: 401 });
        }

        const accessToken = await generateAccessToken({
            id: user.id,
            // name: user.name,
            email: user.email,
        });

        if (!accessToken) {
            return NextResponse.json({
                status: false,
                error: "Access token is null. Internal error ... ",
            }, { status: 403 });
        }

        const hashedAccessToken = await bcrypt.hash(accessToken, 10);
        const accessTokenExpiration = new Date();

        accessTokenExpiration.setDate(accessTokenExpiration.getDate() + 7); // Expires in 7 days

        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                accessTokenGenerationTime: new Date(),
                accessToken: hashedAccessToken,
                accessTokenExpiry: accessTokenExpiration.toString(),
                accessTokenStatus: "valid",
            },
        });

        // Set the Authorization header
        NextResponse.next().headers.set("Authorization", `Bearer ${accessToken}`);

        // response
        const response = NextResponse.json({
            status: true,
            data: updatedUser,
            accessToken,
            message: "Login Successfull 🎉🎆 ... ",
        }, { status: 200 });

        // Set the cookie
        response.cookies.set("token", accessToken);

        return response;
    } catch (error) {
        console.error("[AUTH LOGIN ERROR] Internel server error:", error);
        return NextResponse.json({
            status: false,
            error: error,
            message: "[AUTH LOGIN ERROR], Internal server error occurred ⚠👮‍♂️..",
        }, { status: 500 });
    }
};