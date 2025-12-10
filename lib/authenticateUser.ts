/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
} from "@/utils/auth";
import userSession from "@/models/session";

type AuthResult =
  | { user: any; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

export async function authenticateUser(
  allowedRoles?: string[]
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const decoded = accessToken ? await verifyAccessToken(accessToken) : null;

  // // If access token is missing or expired, try refresh token
  // if (!decoded ) {
  //   const refreshDecoded = await verifyRefreshToken(refreshToken);
  //   if (refreshDecoded) {
  //     // Issue new access token
  //     const newAccessToken = await createAccessToken({
  //       id: refreshDecoded.id,
  //       role: refreshDecoded.role,
  //       jti: refreshDecoded.jti,
  //     });

  //     cookieStore.set("access-token", newAccessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //       maxAge: 60 * 5, // 5 minutes
  //     });

  //     decoded = refreshDecoded;
  //   }
  // }

  if (!decoded) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const session = await userSession.findOne({ jti: decoded.jti });

  if (!session || !session.isActive || session.expiresAt < new Date()) {
    await cookieStore.delete("access-token");
    await cookieStore.delete("refresh-token");
    return {
      errorResponse: NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return {
      errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: decoded };
}
