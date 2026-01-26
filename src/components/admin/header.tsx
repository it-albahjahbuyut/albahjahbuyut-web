"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronLeft } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    showBackButton?: boolean;
}

export function AdminHeader({ title, description, children, showBackButton }: AdminHeaderProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const getInitials = (name?: string | null) => {
        if (!name) return "AD";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <button
                        onClick={() => router.back()}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        title="Kembali"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                )}
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {children}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                            suppressHydrationWarning
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                    {getInitials(session?.user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-700">
                                    {session?.user?.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-red-600"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
