/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import {
  verifyAccessToken,
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from "@/utils/auth";
import userSession from "@/models/session";
import bcrypt from "bcryptjs";

type AuthResult =
  | { user: any; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

export async function authenticateUser(
  allowedRoles?: string[]
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  const refreshToken = cookieStore.get("refresh-token")?.value;

  const refreshDecoded = refreshToken
    ? await verifyRefreshToken(refreshToken)
    : null;
  const accessDecoded = accessToken
    ? await verifyAccessToken(accessToken)
    : null;

  if (!refreshDecoded) {
    await cookieStore.delete("access-token");
    await cookieStore.delete("refresh-token");
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const session = await userSession.findOne({
    jti: refreshDecoded.jti,
  });

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

  const isRefreshValid = await bcrypt.compare(
    refreshToken!,
    session.refreshToken
  );

  if (!isRefreshValid) {
    // token reuse detected → logout everywhere
    await userSession.updateOne(
      { jti: refreshDecoded.jti },
      { isActive: false }
    );

    await cookieStore.delete("access-token");
    await cookieStore.delete("refresh-token");

    return {
      errorResponse: NextResponse.json(
        { error: "Session terminated" },
        { status: 401 }
      ),
    };
  }

  // Access token expired → issue new access AND rotate refresh
  if (!accessDecoded) {
    if (refreshDecoded) {
      const newAccessToken = await createAccessToken({
        id: refreshDecoded.id,
        jti: refreshDecoded.jti,
      });

      cookieStore.set("access-token", newAccessToken, {
        httpOnly: true,
        secure: config.app.nodeEnv === "production",
        sameSite: "lax",
        maxAge: config.jwt.accessToken.maxAge,
      });

      // 🔥 NEW — rotate refresh token safely
      const newRefreshToken = await createRefreshToken({
        id: refreshDecoded.id,
        role: refreshDecoded.role,
        jti: refreshDecoded.jti,
      });

      const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 12);

      cookieStore.set("refresh-token", newRefreshToken, {
        httpOnly: true,
        secure: config.app.nodeEnv === "production",
        sameSite: "lax",
        maxAge: config.jwt.refreshToken.maxAge,
      });

      await userSession.updateOne(
        { jti: refreshDecoded.jti },
        { refreshToken: hashedNewRefresh, $inc: { tokenVersion: 1 } }
      );
    }
  }

  if (!refreshDecoded || !accessDecoded) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(refreshDecoded?.role ?? "guest")) {
    return {
      errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: refreshDecoded };
}
