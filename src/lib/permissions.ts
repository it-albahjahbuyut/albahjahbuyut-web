import { UserRole } from "@prisma/client";

/**
 * Define which menu paths each role can access
 * "*" means access to all paths
 */
export const ROLE_MENU_ACCESS: Record<UserRole, string[]> = {
    SUPER_ADMIN: ["*"],
    // ADMIN can access website management but NOT PSB
    ADMIN: [
        "/admin",
        "/admin/units",
        "/admin/posts",
        "/admin/donations",
        "/admin/galleries",
        "/admin/majelis",
        "/admin/business-units",
        "/admin/newsletter",
        "/admin/settings",
    ],
    ADMIN_INFAQ: ["/admin", "/admin/donations"],
    ADMIN_PSB_PAUD: ["/admin", "/admin/psb"],
    ADMIN_PSB_SMP_SMA: ["/admin", "/admin/psb"],
};

/**
 * Define which PSB unit slugs each role can manage
 * "*" means access to all units
 */
export const ROLE_PSB_UNITS: Record<UserRole, string[] | "*"> = {
    SUPER_ADMIN: "*",
    ADMIN: [], // ADMIN cannot access PSB
    ADMIN_INFAQ: [],
    ADMIN_PSB_PAUD: ["paudqu"],
    ADMIN_PSB_SMP_SMA: ["smpiqu", "smaiqu"],
};

/**
 * Check if a role can access a specific path
 * Note: "/admin" is treated as exact match only (dashboard)
 * Other paths like "/admin/donations" match themselves and their subpaths
 */
export function canAccessPath(role: UserRole, path: string): boolean {
    const allowedPaths = ROLE_MENU_ACCESS[role];

    // Full access
    if (allowedPaths.includes("*")) return true;

    // Check each allowed path
    return allowedPaths.some((allowed) => {
        // Dashboard (/admin) - only exact match
        if (allowed === "/admin") {
            return path === "/admin";
        }
        // Other paths - exact match or starts with (for subpaths)
        return path === allowed || path.startsWith(allowed + "/");
    });
}

/**
 * Check if a role can manage a specific PSB unit
 */
export function canAccessPSBUnit(role: UserRole, unitSlug: string): boolean {
    const allowedUnits = ROLE_PSB_UNITS[role];

    // Full access
    if (allowedUnits === "*") return true;

    // Check if unit is in allowed list
    return allowedUnits.includes(unitSlug);
}

/**
 * Check if role has full admin access
 */
export function isFullAdmin(role: UserRole): boolean {
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

/**
 * Check if role is SUPER_ADMIN (can manage users)
 */
export function isSuperAdmin(role: UserRole): boolean {
    return role === "SUPER_ADMIN";
}

/**
 * Get display name for a role
 */
export function getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
        SUPER_ADMIN: "Super Admin",
        ADMIN: "Admin",
        ADMIN_INFAQ: "Admin Infaq",
        ADMIN_PSB_PAUD: "Admin PSB PAUD",
        ADMIN_PSB_SMP_SMA: "Admin PSB SMP/SMA",
    };
    return names[role];
}

/**
 * All available roles for selection
 */
export const ALL_ROLES: UserRole[] = [
    "SUPER_ADMIN",
    "ADMIN",
    "ADMIN_INFAQ",
    "ADMIN_PSB_PAUD",
    "ADMIN_PSB_SMP_SMA",
];

/**
 * Get allowed PSB unit slugs for a role
 * Returns null if role has full access
 */
export function getAllowedPSBUnitSlugs(role: UserRole): string[] | null {
    const units = ROLE_PSB_UNITS[role];
    if (units === "*") return null;
    return units;
}
