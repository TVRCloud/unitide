/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { clearSession, verifyToken } from "@/utils/auth";
import userSession from "@/models/session";

type AuthResult =
  | { user: any; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

export async function authenticateUser(
  allowedRoles?: string[]
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.session.cookieName)?.value;

  if (!token) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      ),
    };
  }

  const session = await userSession.findOne({ jti: decoded.jti });

  if (!session || !session.isActive || session.expiresAt < new Date()) {
    await clearSession();
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
