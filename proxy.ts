import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { canAccessRoute } from "@/utils/check-access";
import { authRoutes, protectedRoutes, publicRoutes } from "@/lib/route-list";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const role = (token?.role as string | undefined)?.toLowerCase() ?? "guest";

  if (isPublicRoute) return NextResponse.next();

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && token) {
    if (role === "guest") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
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
