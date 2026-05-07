import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
};

type GuardResult =
  | { user: AuthUser; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

export async function requireAuth(
  allowedRoles?: string[]
): Promise<GuardResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      role: session.user.role,
      avatar: session.user.avatar,
    },
  };
}
