"use server";

/**
 * Security Utilities - Al-Bahjah Buyut Website
 * 
 * Provides protection against:
 * - DDoS attacks (rate limiting)
 * - Brute force attacks (login rate limiting)
 * - XSS attacks (input sanitization)
 * - CSRF attacks (token validation)
 */

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory rate limit store (for production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();
const loginAttemptStore = new Map<string, RateLimitEntry>();
const blockedIPs = new Set<string>();

// General rate limit: 100 requests per minute
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Login rate limit: 5 attempts per 15 minutes
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Block duration: 1 hour after too many failed attempts
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Check if a request is rate limited
 */
export async function checkRateLimit(
    identifier: string,
    maxRequests: number = RATE_LIMIT_MAX,
    windowMs: number = RATE_LIMIT_WINDOW
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        // Start new window
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (entry.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetTime - now
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetIn: entry.resetTime - now
    };
}

/**
 * Check login rate limit for brute force protection
 */
export async function checkLoginRateLimit(
    identifier: string
): Promise<{ allowed: boolean; remainingAttempts: number; blockedUntil?: number }> {
    const now = Date.now();

    // Check if IP is blocked
    if (blockedIPs.has(identifier)) {
        const entry = loginAttemptStore.get(identifier);
        if (entry && now < entry.resetTime) {
            return {
                allowed: false,
                remainingAttempts: 0,
                blockedUntil: entry.resetTime
            };
        }
        // Unblock if time has passed
        blockedIPs.delete(identifier);
        loginAttemptStore.delete(identifier);
    }

    const entry = loginAttemptStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        loginAttemptStore.set(identifier, {
            count: 1,
            resetTime: now + LOGIN_RATE_LIMIT_WINDOW,
        });
        return { allowed: true, remainingAttempts: LOGIN_RATE_LIMIT_MAX - 1 };
    }

    if (entry.count >= LOGIN_RATE_LIMIT_MAX) {
        // Block the IP
        blockedIPs.add(identifier);
        entry.resetTime = now + BLOCK_DURATION;
        return {
            allowed: false,
            remainingAttempts: 0,
            blockedUntil: entry.resetTime
        };
    }

    entry.count++;
    return {
        allowed: true,
        remainingAttempts: LOGIN_RATE_LIMIT_MAX - entry.count
    };
}

/**
 * Record successful login - reset attempts
 */
export async function recordSuccessfulLogin(identifier: string): Promise<void> {
    loginAttemptStore.delete(identifier);
    blockedIPs.delete(identifier);
}

/**
 * Record failed login attempt
 */
export async function recordFailedLogin(identifier: string): Promise<void> {
    await checkLoginRateLimit(identifier);
}

// ============================================
// INPUT SANITIZATION (XSS Protection)
// ============================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove null bytes
        .replace(/\0/g, '')
        // Encode HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Remove potential script injections
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .replace(/data:/gi, 'data-blocked:');
}

/**
 * Sanitize for SQL-safe string (additional layer, though Prisma handles this)
 */
export function sanitizeForQuery(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove SQL injection attempts
        .replace(/['";\\]/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        // Limit length
        .substring(0, 1000);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
    if (!email || typeof email !== 'string') return null;

    const sanitized = email.toLowerCase().trim();

    // Basic email regex validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitized)) return null;

    // Max length check
    if (sanitized.length > 254) return null;

    return sanitized;
}

/**
 * Sanitize slug
 */
export function sanitizeSlug(slug: string): string {
    if (!slug || typeof slug !== 'string') return '';

    return slug
        .toLowerCase()
        .trim()
        // Only allow alphanumeric, hyphens
        .replace(/[^a-z0-9-]/g, '')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-|-$/g, '')
        .substring(0, 100);
}

// ============================================
// CSRF PROTECTION
// ============================================

import { cookies } from 'next/headers';

/**
 * Generate CSRF token
 */
export async function generateCSRFToken(): Promise<string> {
    const token = crypto.randomUUID() + '-' + Date.now().toString(36);

    const cookieStore = await cookies();
    cookieStore.set('csrf_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
    });

    return token;
}

/**
 * Validate CSRF token
 */
export async function validateCSRFToken(token: string): Promise<boolean> {
    if (!token) return false;

    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrf_token')?.value;

    if (!storedToken) return false;

    // Timing-safe comparison
    return token === storedToken;
}

// ============================================
// SECURITY HEADERS
// ============================================

export const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https: http:",
        "connect-src 'self' https:",
        "frame-ancestors 'self'",
    ].join('; '),
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// ============================================
// SECURITY LOGGING
// ============================================

interface SecurityLogEntry {
    timestamp: Date;
    type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'RATE_LIMITED' | 'BLOCKED' | 'SUSPICIOUS';
    ip?: string;
    userAgent?: string;
    email?: string;
    message: string;
}

const securityLogs: SecurityLogEntry[] = [];
const MAX_LOG_ENTRIES = 1000;

/**
 * Log security event
 */
export async function logSecurityEvent(entry: Omit<SecurityLogEntry, 'timestamp'>): Promise<void> {
    const logEntry: SecurityLogEntry = {
        ...entry,
        timestamp: new Date(),
    };

    securityLogs.unshift(logEntry);

    // Keep only last 1000 entries
    if (securityLogs.length > MAX_LOG_ENTRIES) {
        securityLogs.pop();
    }

    // In production, you would also log to external service
    if (process.env.NODE_ENV === 'production') {
        console.log('[SECURITY]', JSON.stringify(logEntry));
    }
}

/**
 * Get recent security logs (admin only)
 */
export async function getSecurityLogs(limit: number = 100): Promise<SecurityLogEntry[]> {
    return securityLogs.slice(0, limit);
}

// ============================================
// IP UTILITIES
// ============================================

/**
 * Get client IP from headers
 */
export function getClientIP(headers: Headers): string {
    // Check various headers for the real IP
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) return realIP;

    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;

    return 'unknown';
}

/**
 * Check if IP is suspicious (basic check)
 */
export function isSuspiciousRequest(headers: Headers): boolean {
    const userAgent = headers.get('user-agent') || '';

    // List of suspicious patterns
    const suspiciousPatterns = [
        /curl/i,
        /wget/i,
        /python/i,
        /scrapy/i,
        /bot/i,
        /spider/i,
        /crawler/i,
    ];

    // Empty user agent is suspicious
    if (!userAgent) return true;

    // Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(userAgent)) return true;
    }

    return false;
}

// Clean up old entries periodically
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
}, 60000); // Clean up every minute
