import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// ============================================
// SECURITY CONFIGURATION
// ============================================

// Generic error message to prevent user enumeration
const AUTH_ERROR_MESSAGE = "Email atau password salah";

// Session configuration
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (reduced from 30 for security)
const SESSION_UPDATE_AGE = 24 * 60 * 60; // Update session every 24 hours

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Input validation
                if (!credentials?.email || !credentials?.password) {
                    throw new Error(AUTH_ERROR_MESSAGE);
                }

                const email = (credentials.email as string).toLowerCase().trim();
                const password = credentials.password as string;

                // Additional email validation
                if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error(AUTH_ERROR_MESSAGE);
                }

                // Password length check to prevent DoS via bcrypt
                if (password.length > 128) {
                    throw new Error(AUTH_ERROR_MESSAGE);
                }

                try {
                    const user = await db.user.findUnique({
                        where: { email },
                        select: {
                            id: true,
                            email: true,
                            password: true,
                            name: true,
                            role: true,
                            image: true,
                        },
                    });

                    // Use consistent timing to prevent timing attacks
                    // Even if user doesn't exist, we still hash compare against a dummy
                    const dummyHash = "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lLFRnEd6o6";
                    const passwordToCompare = user?.password || dummyHash;

                    const isPasswordValid = await bcrypt.compare(password, passwordToCompare);

                    if (!user || !isPasswordValid) {
                        // Log failed attempt (don't expose which was wrong)
                        console.warn(`[AUTH] Failed login attempt for email: ${email.substring(0, 3)}***`);
                        throw new Error(AUTH_ERROR_MESSAGE);
                    }

                    // Log successful login
                    console.log(`[AUTH] Successful login for user: ${user.id}`);

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.image,
                    };
                } catch (error) {
                    // Re-throw auth errors, but catch and log database errors
                    if (error instanceof Error && error.message === AUTH_ERROR_MESSAGE) {
                        throw error;
                    }
                    console.error("[AUTH] Database error during authentication:", error);
                    throw new Error(AUTH_ERROR_MESSAGE);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
            }

            // Re-validate user on session update
            if (trigger === "update" && token.id) {
                try {
                    const dbUser = await db.user.findUnique({
                        where: { id: token.id as string },
                        select: { role: true, email: true },
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.email = dbUser.email;
                    }
                } catch (error) {
                    console.error("[AUTH] Error updating token:", error);
                }
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
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: SESSION_MAX_AGE,
        updateAge: SESSION_UPDATE_AGE,
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.AUTH_SECRET,
    // Enable debug logging only in development
    debug: process.env.NODE_ENV === "development",
});

