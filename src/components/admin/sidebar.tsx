"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    GraduationCap,
    Newspaper,
    Heart,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
    UserPlus,
    CalendarDays,
    Store,
    Loader2,
    Mail,
    Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@prisma/client";
import { canAccessPath, isSuperAdmin } from "@/lib/permissions";

// Define nav items with required permission paths
const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "/admin",
    },
    {
        title: "Unit Pendidikan",
        href: "/admin/units",
        icon: GraduationCap,
        permission: "/admin/units",
    },
    {
        title: "Berita",
        href: "/admin/posts",
        icon: Newspaper,
        permission: "/admin/posts",
    },
    {
        title: "Donasi",
        href: "/admin/donations",
        icon: Heart,
        permission: "/admin/donations",
    },
    {
        title: "Galeri",
        href: "/admin/galleries",
        icon: Image,
        permission: "/admin/galleries",
    },
    {
        title: "Majelis Rutin",
        href: "/admin/majelis",
        icon: CalendarDays,
        permission: "/admin/majelis",
    },
    {
        title: "Unit Usaha",
        href: "/admin/business-units",
        icon: Store,
        permission: "/admin/business-units",
    },
    {
        title: "Pendaftaran PSB",
        href: "/admin/psb",
        icon: UserPlus,
        permission: "/admin/psb",
    },
    {
        title: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
        permission: "/admin/newsletter",
    },
    {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: Settings,
        permission: "/admin/settings",
    },
];

interface AdminSidebarProps {
    userRole: UserRole;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [loadingHref, setLoadingHref] = useState<string | null>(null);

    // Filter nav items based on user role
    const filteredNavItems = navItems.filter((item) =>
        canAccessPath(userRole, item.permission)
    );

    // Add user management for super admin
    const superAdminItems = isSuperAdmin(userRole)
        ? [
            {
                title: "Kelola User",
                href: "/admin/users",
                icon: Users,
                permission: "/admin/users",
            },
        ]
        : [];

    const allNavItems = [...filteredNavItems, ...superAdminItems];

    const handleNavigation = (href: string) => {
        // Don't set loading if already on this page
        if (pathname === href) return;
        setLoadingHref(href);
        setIsOpen(false);
    };

    // Reset loading state when pathname changes
    if (loadingHref && pathname === loadingHref) {
        setLoadingHref(null);
    }

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-green-800 to-emerald-900 text-white transition-transform duration-300 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-center border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-lg font-bold">AB</span>
                        </div>
                        <span className="font-bold text-lg">Al-Bahjah Buyut</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {allNavItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const isLoading = loadingHref === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => handleNavigation(item.href)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-white/20 text-white"
                                        : "text-white/70 hover:bg-white/10 hover:text-white",
                                    isLoading && "opacity-80"
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <item.icon className="h-5 w-5" />
                                )}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}
