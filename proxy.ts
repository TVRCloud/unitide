import { type NextRequest, NextResponse } from "next/server";
// import { config as sessionConfig } from "@/lib/config";
import { canAccessRoute } from "./utils/check-access";
import { authRoutes, protectedRoutes, publicRoutes } from "./lib/route-list";
import { verifyRefreshToken } from "./utils/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // const token = request.cookies.get(sessionConfig.session.cookieName)?.value;
  const token = request.cookies.get("refresh-token")?.value;

  const session = token ? await verifyRefreshToken(token) : null;

  const role = (session?.role as string | undefined)?.toLowerCase() || "guest";

  if (isPublicRoute) return NextResponse.next();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session) {
    if (role === "guest") {
      return NextResponse.redirect(new URL("/welcome", request.nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (isProtectedRoute && token) {
    const hasAccess = canAccessRoute({ path, role });

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/forbidden", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
