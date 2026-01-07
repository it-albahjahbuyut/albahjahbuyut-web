import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnLogin = nextUrl.pathname === "/login";

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            if (isOnLogin) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/admin", nextUrl));
                }
                return true;
            }

            return true;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "SUPER_ADMIN";
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    providers: [], // Configured in auth.ts
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
