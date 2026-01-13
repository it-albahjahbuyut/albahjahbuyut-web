import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// ============================================
// SECURITY: Validate environment on server-side only
// ============================================

// Ensure we're on server
if (typeof window !== 'undefined') {
    throw new Error('[SECURITY] Database module should never be imported on client side!');
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined. Please check your environment variables.");
}

// Security check: Ensure DATABASE_URL is not exposed
if (connectionString.startsWith('NEXT_PUBLIC')) {
    throw new Error('[SECURITY] DATABASE_URL should not have NEXT_PUBLIC prefix!');
}

// Create connection pool with limited connections for serverless
// This prevents "Max client connections reached" error on Vercel
const pool = globalForPrisma.pool ?? new Pool({
    connectionString,
    max: 5, // Maximum 5 connections in pool (reduced for serverless)
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Timeout after 10 seconds if can't connect
});

// Cache pool globally in production
if (process.env.NODE_ENV === "production") {
    globalForPrisma.pool = pool;
}

// Prisma 7 style - pass Pool directly to PrismaPg adapter
const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Cache PrismaClient globally - important for both dev and production in serverless
if (process.env.NODE_ENV === "production") {
    globalForPrisma.prisma = db;
} else {
    globalForPrisma.prisma = db;
}
