import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isLoginPage = nextUrl.pathname === "/login";
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicApiRoute = nextUrl.pathname.startsWith("/api/public");

    // Allow API auth routes
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // Allow public API routes
    if (isPublicApiRoute) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from login page
    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    // Protect admin routes
    if (isAdminRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all admin routes
        "/admin/:path*",
        // Match login page
        "/login",
        // Match API routes except public ones
        "/api/:path*",
    ],
};
