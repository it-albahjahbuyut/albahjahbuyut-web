"use server";

/**
 * Audit Logging - Security Feature
 * 
 * Logs all important admin actions for security monitoring
 */

import { auth } from "@/lib/auth";

// ============================================
// AUDIT LOG TYPES
// ============================================

export type AuditAction =
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'CREATE_POST'
    | 'UPDATE_POST'
    | 'DELETE_POST'
    | 'CREATE_DONATION'
    | 'UPDATE_DONATION'
    | 'DELETE_DONATION'
    | 'CREATE_GALLERY'
    | 'UPDATE_GALLERY'
    | 'DELETE_GALLERY'
    | 'CREATE_UNIT'
    | 'UPDATE_UNIT'
    | 'DELETE_UNIT'
    | 'UPDATE_SETTINGS'
    | 'SUSPICIOUS_ACTIVITY';

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    action: AuditAction;
    userId?: string;
    userEmail?: string;
    resourceType?: string;
    resourceId?: string;
    resourceName?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
    success: boolean;
}

// In-memory audit log store (in production, save to database or external service)
const auditLogs: AuditLogEntry[] = [];
const MAX_AUDIT_LOGS = 10000;

// ============================================
// AUDIT LOGGING FUNCTIONS
// ============================================

/**
 * Log an audit event
 */
export async function logAuditEvent(
    action: AuditAction,
    options?: {
        resourceType?: string;
        resourceId?: string;
        resourceName?: string;
        ipAddress?: string;
        userAgent?: string;
        details?: string;
        success?: boolean;
        userId?: string;
        userEmail?: string;
    }
): Promise<void> {
    const session = await auth();

    const entry: AuditLogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        action,
        userId: options?.userId || session?.user?.id,
        userEmail: options?.userEmail || session?.user?.email || undefined,
        resourceType: options?.resourceType,
        resourceId: options?.resourceId,
        resourceName: options?.resourceName,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
        details: options?.details,
        success: options?.success ?? true,
    };

    auditLogs.unshift(entry);

    // Keep only last MAX_AUDIT_LOGS entries
    if (auditLogs.length > MAX_AUDIT_LOGS) {
        auditLogs.pop();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[AUDIT]', JSON.stringify(entry, null, 2));
    }

    // In production, you would also:
    // 1. Save to database
    // 2. Send to external logging service (e.g., Datadog, LogRocket)
    // 3. Send alerts for suspicious activities
}

/**
 * Get audit logs (admin only)
 */
export async function getAuditLogs(options?: {
    limit?: number;
    action?: AuditAction;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}): Promise<AuditLogEntry[]> {
    const session = await auth();

    // Only SUPER_ADMIN can view audit logs
    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return [];
    }

    let filtered = [...auditLogs];

    if (options?.action) {
        filtered = filtered.filter(log => log.action === options.action);
    }

    if (options?.userId) {
        filtered = filtered.filter(log => log.userId === options.userId);
    }

    if (options?.startDate) {
        filtered = filtered.filter(log => log.timestamp >= options.startDate!);
    }

    if (options?.endDate) {
        filtered = filtered.filter(log => log.timestamp <= options.endDate!);
    }

    return filtered.slice(0, options?.limit || 100);
}

/**
 * Get audit log statistics
 */
export async function getAuditStats(): Promise<{
    totalLogs: number;
    failedLogins: number;
    suspiciousActivities: number;
    recentActions: { action: string; count: number }[];
}> {
    const session = await auth();

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        return {
            totalLogs: 0,
            failedLogins: 0,
            suspiciousActivities: 0,
            recentActions: [],
        };
    }

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = auditLogs.filter(log => log.timestamp >= last24Hours);

    const actionCounts = new Map<string, number>();
    for (const log of recentLogs) {
        actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    }

    return {
        totalLogs: auditLogs.length,
        failedLogins: auditLogs.filter(log => log.action === 'LOGIN_FAILED').length,
        suspiciousActivities: auditLogs.filter(log => log.action === 'SUSPICIOUS_ACTIVITY').length,
        recentActions: Array.from(actionCounts.entries())
            .map(([action, count]) => ({ action, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
    };
}
