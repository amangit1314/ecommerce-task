import { db } from "@/lib/db";
import { getCookies } from "cookies-next";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment");
}

const key = new TextEncoder().encode(JWT_SECRET);

if (!ACCESS_TOKEN_EXPIRATION) {
  throw new Error("ACCESS_TOKEN_EXPIRATION is not defined in the environment");
}

// * --------------------------------------------------------------------------------------------

export const generateAccessToken = async (payload: any) => {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRATION!)
      .sign(key);
    return token;
  } catch (error) {
    console.error(error);
  }
};


// * --------------------------------------------------------------------------------------------

export const verifyToken = async (token: string) => {
  try {
    const decryptedToken = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return decryptedToken;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error);
  }
};

//! ----------------------------------------------------------------------------------------------

export const encrypt = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
};

export const decrypt = async (input: string): Promise<any> => {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
};

// ? --------------------------------------------------------------------------------------------

export const updateToken = async (req: NextRequest) => {
  try {
    const cookies = getCookies();
    const token = cookies.token;
    if (!token) return;

    const parsed = await decrypt(token);
    parsed.expires = new Date(Date.now() + 10 * 1000);

    const res = NextResponse.next();
    res.cookies.set({
      name: "token",
      value: await encrypt(parsed),
      expires: parsed.expires,
    });
    return res;
  } catch (error) {
    return error;
  }
};

// * --------------------------------------------------------------------------------------------

export const getUserIdFromToken = async (token: string) => {
  try {
    if (!token) return null;
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error("Error retrieving user ID from token:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const uid = id;
    const user = await db.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      throw new Error(`No user found with this id: ${uid}`);
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to get user info by id: ${id}, Error: ${error}`);
  }
};
