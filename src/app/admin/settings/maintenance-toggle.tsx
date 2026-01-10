"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Wrench, Loader2 } from "lucide-react";
import { setMaintenanceMode } from "@/actions/settings";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MaintenanceToggleProps {
    initialEnabled: boolean;
    initialMessage: string;
    isSuperAdmin: boolean;
}

export function MaintenanceToggle({ initialEnabled, initialMessage, isSuperAdmin }: MaintenanceToggleProps) {
    const router = useRouter();
    const [enabled, setEnabled] = useState(initialEnabled);
    const [message, setMessage] = useState(initialMessage || "Website sedang dalam pemeliharaan.");
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingEnabled, setPendingEnabled] = useState(false);

    const handleToggle = (checked: boolean) => {
        if (!isSuperAdmin) {
            toast.error("Hanya Super Admin yang dapat mengubah mode maintenance");
            return;
        }
        
        setPendingEnabled(checked);
        setShowConfirmDialog(true);
    };

    const confirmToggle = async () => {
        setShowConfirmDialog(false);
        setIsLoading(true);

        try {
            const result = await setMaintenanceMode(pendingEnabled, message);

            if (!result.success) {
                toast.error(result.error || "Gagal mengubah mode maintenance");
                return;
            }

            setEnabled(pendingEnabled);
            toast.success(
                pendingEnabled 
                    ? "Mode maintenance diaktifkan. Pengunjung akan melihat halaman maintenance." 
                    : "Mode maintenance dinonaktifkan. Website kembali normal."
            );
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveMessage = async () => {
        if (!isSuperAdmin) {
            toast.error("Hanya Super Admin yang dapat mengubah pesan maintenance");
            return;
        }

        setIsLoading(true);

        try {
            const result = await setMaintenanceMode(enabled, message);

            if (!result.success) {
                toast.error(result.error || "Gagal menyimpan pesan");
                return;
            }

            toast.success("Pesan maintenance berhasil disimpan");
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className={enabled ? "border-amber-500 bg-amber-50/50" : ""}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Mode Maintenance
                        {enabled && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full">
                                AKTIF
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Aktifkan mode maintenance untuk menampilkan halaman pemeliharaan kepada pengunjung
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Warning when enabled */}
                    {enabled && (
                        <div className="flex items-start gap-3 p-4 bg-amber-100 border border-amber-300 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-amber-800">Mode Maintenance Aktif</p>
                                <p className="text-sm text-amber-700">
                                    Semua pengunjung akan diarahkan ke halaman maintenance. 
                                    Halaman admin tetap dapat diakses.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="maintenance-toggle" className="text-base font-medium">
                                Aktifkan Maintenance
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {enabled ? "Website sedang dalam mode maintenance" : "Website berjalan normal"}
                            </p>
                        </div>
                        <Switch
                            id="maintenance-toggle"
                            checked={enabled}
                            onCheckedChange={handleToggle}
                            disabled={isLoading || !isSuperAdmin}
                        />
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <Label htmlFor="maintenance-message">Pesan Maintenance (Opsional)</Label>
                        <Textarea
                            id="maintenance-message"
                            placeholder="Masukkan pesan yang akan ditampilkan..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            disabled={!isSuperAdmin}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveMessage}
                            disabled={isLoading || !isSuperAdmin}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Pesan"
                            )}
                        </Button>
                    </div>

                    {/* Preview Link */}
                    <div className="pt-4 border-t">
                        <a
                            href="/maintenance"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:underline"
                        >
                            Lihat preview halaman maintenance →
                        </a>
                    </div>

                    {!isSuperAdmin && (
                        <p className="text-sm text-muted-foreground italic">
                            * Hanya Super Admin yang dapat mengubah pengaturan maintenance
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingEnabled ? "Aktifkan Mode Maintenance?" : "Nonaktifkan Mode Maintenance?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingEnabled 
                                ? "Semua pengunjung akan diarahkan ke halaman maintenance. Halaman admin tetap dapat diakses. Yakin ingin melanjutkan?"
                                : "Website akan kembali dapat diakses oleh pengunjung. Yakin ingin melanjutkan?"
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmToggle}
                            className={pendingEnabled ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
                        >
                            {pendingEnabled ? "Ya, Aktifkan" : "Ya, Nonaktifkan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
