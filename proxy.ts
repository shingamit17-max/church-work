import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const onboardingComplete = req.auth?.user?.onboardingComplete;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/mentors/") ||
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  if (isLoggedIn) {
    if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (onboardingComplete && nextUrl.pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    // Note: We no longer hard-block users without onboardingComplete. 
    // They are soft-gated with a banner in the UI instead.
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
