import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// ============================================
// SECURITY CONFIGURATION
// ============================================

// Rate limit settings
const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const LOGIN_RATE_LIMIT_MAX = 5; // login attempts
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block

// In-memory stores (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const loginAttemptStore = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Set<string>();

// Security headers
const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getClientIP(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim();

    const realIP = headers.get('x-real-ip');
    if (realIP) return realIP;

    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;

    return 'unknown';
}

function checkRateLimit(
    identifier: string,
    isLoginAttempt: boolean = false
): { allowed: boolean; resetIn: number } {
    const now = Date.now();
    const store = isLoginAttempt ? loginAttemptStore : rateLimitStore;
    const maxRequests = isLoginAttempt ? LOGIN_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
    const windowMs = isLoginAttempt ? LOGIN_RATE_LIMIT_WINDOW : RATE_LIMIT_WINDOW;

    // Check if IP is blocked
    if (blockedIPs.has(identifier)) {
        const entry = loginAttemptStore.get(identifier);
        if (entry && now < entry.resetTime) {
            return { allowed: false, resetIn: entry.resetTime - now };
        }
        blockedIPs.delete(identifier);
        loginAttemptStore.delete(identifier);
    }

    const entry = store.get(identifier);

    if (!entry || now > entry.resetTime) {
        store.set(identifier, { count: 1, resetTime: now + windowMs });
        return { allowed: true, resetIn: windowMs };
    }

    if (entry.count >= maxRequests) {
        if (isLoginAttempt) {
            blockedIPs.add(identifier);
            entry.resetTime = now + BLOCK_DURATION;
        }
        return { allowed: false, resetIn: entry.resetTime - now };
    }

    entry.count++;
    return { allowed: true, resetIn: entry.resetTime - now };
}

function isSuspiciousRequest(headers: Headers): boolean {
    const userAgent = headers.get('user-agent') || '';

    // Empty user agent is suspicious
    if (!userAgent) return true;

    // Suspicious bot patterns (but allow legitimate search bots)
    const suspiciousPatterns = [
        /sqlmap/i,
        /nikto/i,
        /havij/i,
        /acunetix/i,
        /nessus/i,
        /burp/i,
        /owasp/i,
        /masscan/i,
        /nmap/i,
    ];

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(userAgent)) return true;
    }

    return false;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
    for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
    }
    return response;
}

// ============================================
// MIDDLEWARE
// ============================================

export default auth((req) => {
    const { nextUrl, headers } = req;
    const isLoggedIn = !!req.auth;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isLoginPage = nextUrl.pathname === "/login";
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicApiRoute = nextUrl.pathname.startsWith("/api/public");
    const isStaticAsset = nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.startsWith("/favicon") ||
        nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/);

    // Skip security checks for static assets
    if (isStaticAsset) {
        return NextResponse.next();
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(headers);

    // Check for suspicious requests
    if (isSuspiciousRequest(headers)) {
        console.warn(`[SECURITY] Suspicious request blocked from IP: ${clientIP}`);
        return addSecurityHeaders(
            new NextResponse('Forbidden', { status: 403 })
        );
    }

    // Apply rate limiting for login page
    if (isLoginPage && req.method === 'POST') {
        const { allowed, resetIn } = checkRateLimit(clientIP, true);
        if (!allowed) {
            console.warn(`[SECURITY] Login rate limit exceeded for IP: ${clientIP}`);
            const response = new NextResponse(
                JSON.stringify({
                    error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.',
                    retryAfter: Math.ceil(resetIn / 1000)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil(resetIn / 1000).toString()
                    }
                }
            );
            return addSecurityHeaders(response);
        }
    }

    // Apply general rate limiting for API routes
    if (nextUrl.pathname.startsWith("/api") && !isApiAuthRoute) {
        const { allowed, resetIn } = checkRateLimit(clientIP);
        if (!allowed) {
            console.warn(`[SECURITY] Rate limit exceeded for IP: ${clientIP}`);
            const response = new NextResponse(
                JSON.stringify({ error: 'Rate limit exceeded' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': Math.ceil(resetIn / 1000).toString()
                    }
                }
            );
            return addSecurityHeaders(response);
        }
    }

    // Allow API auth routes
    if (isApiAuthRoute) {
        return addSecurityHeaders(NextResponse.next());
    }

    // Allow public API routes
    if (isPublicApiRoute) {
        return addSecurityHeaders(NextResponse.next());
    }

    // Redirect logged-in users away from login page
    if (isLoginPage && isLoggedIn) {
        const response = NextResponse.redirect(new URL("/admin", nextUrl));
        return addSecurityHeaders(response);
    }

    // Protect admin routes - require authentication
    if (isAdminRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        const response = NextResponse.redirect(loginUrl);
        return addSecurityHeaders(response);
    }

    // Add security headers to all responses
    return addSecurityHeaders(NextResponse.next());
});

export const config = {
    matcher: [
        // Match all routes except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

// Cleanup interval for rate limit stores
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();

        for (const [key, entry] of rateLimitStore.entries()) {
            if (now > entry.resetTime) {
                rateLimitStore.delete(key);
            }
        }

        for (const [key, entry] of loginAttemptStore.entries()) {
            if (now > entry.resetTime && !blockedIPs.has(key)) {
                loginAttemptStore.delete(key);
            }
        }
    }, 60000);
}

