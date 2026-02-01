"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
    const router = useRouter();

    const checkMaintenance = useCallback(async () => {
        try {
            const res = await fetch("/api/maintenance", { cache: "no-store" });
            const data = await res.json();

            if (!data.enabled) {
                router.replace("/");
            }
        } catch {
            // Ignore errors
        }
    }, [router]);

    // Check immediately on mount and auto-check every 30 seconds
    useEffect(() => {
        checkMaintenance(); // Check immediately on mount/reload
        const interval = setInterval(checkMaintenance, 30000);
        return () => clearInterval(interval);
    }, [checkMaintenance]);

    return (
        <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/favicon.png"
                        alt="Al-Bahjah Buyut"
                        width={64}
                        height={64}
                        className="mx-auto"
                        priority
                    />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-white mb-3">
                    Sedang Perbaikan
                </h1>

                {/* Description */}
                <p className="text-emerald-200/70 mb-8">
                    Mohon Maaf, kami sedang melakukan perbaikan. Silakan kembali beberapa saat lagi.
                </p>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-emerald-700 mx-auto mb-8" />

                {/* Contact */}
                <p className="text-sm text-emerald-300/50">
                    Pertanyaan tentang PSB? <a href="https://wa.me/+6289676539390" className="text-emerald-400 hover:underline">Hubungi Kami</a>
                </p>
            </div>
        </div>
    );
}
