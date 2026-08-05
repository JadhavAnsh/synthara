import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAuthPath, isProtectedPath } from "@/lib/auth/routes";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = !!session;
  const isEmailVerified = !!session?.user.emailVerified;

  if (isProtectedPath(pathname)) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (!isEmailVerified) {
      const verifyUrl = new URL("/verify-email", request.url);
      if (session?.user.email) {
        verifyUrl.searchParams.set("email", session.user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
  }

  if (isAuthPath(pathname) && pathname !== "/verify-email") {
    if (isAuthenticated && isEmailVerified) {
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/projects",
    "/projects/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/api/ai",
    "/sign-in",
    "/sign-up",
    "/verify-email",
  ],
};
