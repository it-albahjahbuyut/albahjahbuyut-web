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

// ============================================
// SUPABASE SUPAVISOR CONNECTION POOLING
// ============================================
// Supabase uses Supavisor (similar to PgBouncer) for connection pooling.
// 
// IMPORTANT: Use the TRANSACTION POOLER connection string from Supabase:
// - Transaction Pooler (PORT 6543): Use this for DATABASE_URL
//   postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
// 
// - Session Pooler (PORT 5432) or Direct: Use for DIRECT_URL (migrations only)
//   postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
//
// The ?pgbouncer=true parameter is REQUIRED for Prisma to work with Supavisor!
//
// Since Supabase handles pooling externally, we keep a minimal pool on our side
// to avoid "MaxClientsInSessionMode: max clients reached" error
//
const pool = globalForPrisma.pool ?? new Pool({
    connectionString,
    max: 2, // Allow 2 connections for concurrent requests
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 30000, // Timeout after 30 seconds if can't connect (for cold starts)
    allowExitOnIdle: true, // Allow process to exit when pool is idle
});

// Cache pool globally
if (process.env.NODE_ENV !== "development") {
    globalForPrisma.pool = pool;
}

// Prisma 7 style - pass Pool directly to PrismaPg adapter
const adapter = new PrismaPg(pool);

export const db = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Cache PrismaClient globally - important for both dev and production in serverless
// This prevents creating multiple Prisma instances in serverless functions
if (process.env.NODE_ENV !== "development") {
    globalForPrisma.prisma = db;
}
