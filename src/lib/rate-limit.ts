/**
 * Upstash Redis Rate Limiting
 * 
 * Provides distributed rate limiting that works across:
 * - Vercel serverless functions
 * - Multiple instances
 * - Server restarts
 * 
 * To use this, you need to set up Upstash Redis:
 * 1. Go to https://upstash.com and create a free account
 * 2. Create a new Redis database
 * 3. Copy the REST URL and Token to your .env file
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ============================================
// CONFIGURATION
// ============================================

// Check if Upstash is configured
const isUpstashConfigured = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client only if configured
const redis = isUpstashConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// ============================================
// RATE LIMITERS
// ============================================

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
export const apiRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:api',
    })
    : null;

/**
 * Login rate limiter (stricter)
 * 5 attempts per 15 minutes per IP
 */
export const loginRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'ratelimit:login',
    })
    : null;

/**
 * PSB Form submission rate limiter
 * 3 submissions per hour per IP (to prevent spam registrations)
 */
export const psbRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: 'ratelimit:psb',
    })
    : null;

// ============================================
// RATE LIMIT FUNCTIONS
// ============================================

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp when the limit resets
}

/**
 * Check API rate limit for an identifier (usually IP)
 */
export async function checkApiRateLimit(identifier: string): Promise<RateLimitResult> {
    if (!apiRateLimiter) {
        // Fallback: allow all if Upstash not configured
        console.warn('[SECURITY] Upstash not configured, rate limiting disabled');
        return { success: true, limit: 100, remaining: 100, reset: Date.now() + 60000 };
    }

    const result = await apiRateLimiter.limit(identifier);
    return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Check login rate limit for an identifier
 */
export async function checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
    if (!loginRateLimiter) {
        console.warn('[SECURITY] Upstash not configured, login rate limiting disabled');
        return { success: true, limit: 5, remaining: 5, reset: Date.now() + 900000 };
    }

    const result = await loginRateLimiter.limit(identifier);
    return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Check PSB submission rate limit
 */
export async function checkPsbRateLimit(identifier: string): Promise<RateLimitResult> {
    if (!psbRateLimiter) {
        console.warn('[SECURITY] Upstash not configured, PSB rate limiting disabled');
        return { success: true, limit: 3, remaining: 3, reset: Date.now() + 3600000 };
    }

    const result = await psbRateLimiter.limit(identifier);
    return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}

// ============================================
// BLACKLIST FUNCTIONS (using Redis)
// ============================================

/**
 * Block an IP for a specified duration
 */
export async function blockIP(ip: string, durationMs: number = 3600000): Promise<void> {
    if (!redis) return;

    await redis.set(`blocked:${ip}`, 'true', {
        px: durationMs, // Expires in milliseconds
    });
}

/**
 * Check if an IP is blocked
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
    if (!redis) return false;

    const blocked = await redis.get(`blocked:${ip}`);
    return blocked === 'true';
}

/**
 * Unblock an IP
 */
export async function unblockIP(ip: string): Promise<void> {
    if (!redis) return;

    await redis.del(`blocked:${ip}`);
}

// ============================================
// SECURITY LOGGING (using Redis)
// ============================================

interface SecurityLogEntry {
    timestamp: string;
    type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'RATE_LIMITED' | 'BLOCKED' | 'SUSPICIOUS';
    ip: string;
    userAgent?: string;
    message: string;
}

/**
 * Log a security event to Redis
 * Keeps last 1000 entries
 */
export async function logSecurityEvent(entry: Omit<SecurityLogEntry, 'timestamp'>): Promise<void> {
    if (!redis) {
        console.log('[SECURITY]', JSON.stringify(entry));
        return;
    }

    const fullEntry: SecurityLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
    };

    // Push to list and trim to keep only last 1000 entries
    await redis.lpush('security:logs', JSON.stringify(fullEntry));
    await redis.ltrim('security:logs', 0, 999);
}

/**
 * Get recent security logs
 */
export async function getSecurityLogs(limit: number = 100): Promise<SecurityLogEntry[]> {
    if (!redis) return [];

    const logs = await redis.lrange('security:logs', 0, limit - 1);
    return logs.map((log) => JSON.parse(log as string));
}

// ============================================
// UTILITY
// ============================================

/**
 * Check if Upstash Redis is properly configured
 */
export function isRateLimitingEnabled(): boolean {
    return isUpstashConfigured;
}

/**
 * Get rate limiting status for health checks
 */
export async function getRateLimitingStatus(): Promise<{
    enabled: boolean;
    connected: boolean;
}> {
    if (!redis) {
        return { enabled: false, connected: false };
    }

    try {
        await redis.ping();
        return { enabled: true, connected: true };
    } catch {
        return { enabled: true, connected: false };
    }
}
