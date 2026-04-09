"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
    children: React.ReactNode;
}

/**
 * AuthProviders — digunakan di halaman yang butuh auth (admin, login).
 * Menyertakan SessionProvider agar next-auth bisa digunakan.
 */
export function AuthProviders({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            {children}
            <Toaster position="top-right" richColors />
        </SessionProvider>
    );
}

/**
 * PublicProviders — digunakan di root layout untuk halaman publik.
 * Tidak menyertakan SessionProvider agar tidak ada polling /api/auth/session
 * di setiap page load publik (homepage, psb, profil, galeri, dll).
 */
export function PublicProviders({ children }: ProvidersProps) {
    return (
        <>
            {children}
            <Toaster position="top-right" richColors />
        </>
    );
}

// Backward-compat default export — sama dengan PublicProviders
export function Providers({ children }: ProvidersProps) {
    return <PublicProviders>{children}</PublicProviders>;
}
