import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// ============================================
// SECURITY: Validate environment on server-side only
// ============================================

// Ensure we're on server
if (typeof window !== 'undefined') {
    throw new Error('[SECURITY] Database module should never be imported on client side!');
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined. Please check your environment variables.");
}

// Security check: Ensure DATABASE_URL is not exposed
if (connectionString.startsWith('NEXT_PUBLIC')) {
    throw new Error('[SECURITY] DATABASE_URL should not have NEXT_PUBLIC prefix!');
}

// Prisma 7 style - using connectionString object format
const adapter = new PrismaPg({ connectionString });

export const db = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

