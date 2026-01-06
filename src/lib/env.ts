/**
 * Environment Variable Validation
 * 
 * This file validates that:
 * 1. Required environment variables are set
 * 2. Secrets are not accidentally exposed to client
 */

// List of required server-side environment variables
const requiredServerEnvVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
] as const;

// List of allowed public environment variables
const allowedPublicEnvVars = [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
    'NEXT_PUBLIC_APP_URL',
] as const;

// Sensitive patterns that should NEVER be in public vars
const sensitivePatterns = [
    /password/i,
    /secret/i,
    /api_key/i,
    /apikey/i,
    /private/i,
    /token/i,
    /database/i,
    /postgres/i,
    /mysql/i,
    /mongodb/i,
];

/**
 * Validate server-side environment variables
 * Call this in server-side code only (e.g., in db.ts or auth.ts)
 */
export function validateServerEnv(): void {
    // Only run on server
    if (typeof window !== 'undefined') {
        console.error('[ENV] validateServerEnv() should only be called on server!');
        return;
    }

    const missing: string[] = [];

    for (const envVar of requiredServerEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            `Please check your .env file.`
        );
    }

    // Check that sensitive vars don't have NEXT_PUBLIC prefix
    for (const key of Object.keys(process.env)) {
        if (key.startsWith('NEXT_PUBLIC_')) {
            for (const pattern of sensitivePatterns) {
                if (pattern.test(key)) {
                    console.error(
                        `[SECURITY WARNING] Environment variable "${key}" contains sensitive pattern but has NEXT_PUBLIC_ prefix!`
                    );
                }
            }
        }
    }
}

/**
 * Get safe public environment variables
 * Only returns allowed public variables
 */
export function getPublicEnv(): Record<string, string | undefined> {
    const publicEnv: Record<string, string | undefined> = {};

    for (const key of allowedPublicEnvVars) {
        publicEnv[key] = process.env[key];
    }

    return publicEnv;
}

/**
 * Check if we're running in production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're running in development
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Get the app URL safely
 */
export function getAppUrl(): string {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    return process.env.NEXT_PUBLIC_APP_URL ||
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
        'http://localhost:3000';
}
