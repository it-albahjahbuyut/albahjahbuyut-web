"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Plus,
    Trash2,
    Pencil,
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    MessageCircle,
    Globe,
    Loader2,
    GripVertical,
} from "lucide-react";
import {
    createUnitSocialMedia,
    updateUnitSocialMedia,
    deleteUnitSocialMedia,
} from "./social-media-actions";

// TikTok icon (not in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

const PLATFORMS = [
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "tiktok", label: "TikTok", icon: TikTokIcon },
    { value: "twitter", label: "Twitter/X", icon: Twitter },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "website", label: "Website", icon: Globe },
];

interface SocialMedia {
    id: string;
    platform: string;
    url: string;
    label: string | null;
    order: number;
    isActive: boolean;
}

interface UnitSocialMediaManagerProps {
    unitId: string;
    unitName: string;
    initialData: SocialMedia[];
}

export function UnitSocialMediaManager({
    unitId,
    unitName,
    initialData,
}: UnitSocialMediaManagerProps) {
    const [socialMediaList, setSocialMediaList] = useState<SocialMedia[]>(initialData);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");
    const [label, setLabel] = useState("");

    const resetForm = () => {
        setPlatform("");
        setUrl("");
        setLabel("");
        setEditingItem(null);
    };

    const handleAdd = async () => {
        if (!platform || !url) {
            toast.error("Platform dan URL wajib diisi");
            return;
        }

        setIsLoading(true);
        try {
            const newItem = await createUnitSocialMedia({
                unitId,
                platform,
                url,
                label: label || undefined,
                order: socialMediaList.length,
            });

            setSocialMediaList([...socialMediaList, newItem as SocialMedia]);
            toast.success("Social media berhasil ditambahkan");
            setIsAddDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Gagal menambahkan social media");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editingItem || !platform || !url) {
            toast.error("Platform dan URL wajib diisi");
            return;
        }

        setIsLoading(true);
        try {
            const updatedItem = await updateUnitSocialMedia(editingItem.id, {
                platform,
                url,
                label: label || undefined,
            });

            setSocialMediaList(
                socialMediaList.map((item) =>
                    item.id === editingItem.id ? (updatedItem as SocialMedia) : item
                )
            );
            toast.success("Social media berhasil diperbarui");
            setEditingItem(null);
            resetForm();
        } catch (error) {
            toast.error("Gagal memperbarui social media");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteUnitSocialMedia(id);
            setSocialMediaList(socialMediaList.filter((item) => item.id !== id));
            toast.success("Social media berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus social media");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await updateUnitSocialMedia(id, { isActive });
            setSocialMediaList(
                socialMediaList.map((item) =>
                    item.id === id ? { ...item, isActive } : item
                )
            );
        } catch (error) {
            toast.error("Gagal mengubah status");
            console.error(error);
        }
    };

    const openEditDialog = (item: SocialMedia) => {
        setEditingItem(item);
        setPlatform(item.platform);
        setUrl(item.url);
        setLabel(item.label || "");
    };

    const getPlatformIcon = (platformValue: string) => {
        const platformConfig = PLATFORMS.find((p) => p.value === platformValue);
        if (!platformConfig) return Globe;
        return platformConfig.icon;
    };

    const getPlatformLabel = (platformValue: string) => {
        const platformConfig = PLATFORMS.find((p) => p.value === platformValue);
        return platformConfig?.label || platformValue;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                    Social Media {unitName}
                </h3>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Social Media</DialogTitle>
                            <DialogDescription>
                                Tambahkan link social media untuk {unitName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PLATFORMS.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>
                                                <div className="flex items-center gap-2">
                                                    <p.icon className="h-4 w-4" />
                                                    {p.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>URL / Link</Label>
                                <Input
                                    placeholder="https://instagram.com/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Label (Opsional)</Label>
                                <Input
                                    placeholder="Instagram SMPIQu"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button onClick={handleAdd} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List */}
            {socialMediaList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    <p>Belum ada social media</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {socialMediaList.map((item) => {
                        const Icon = getPlatformIcon(item.platform);
                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                                    <Icon className="h-5 w-5 text-slate-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">
                                        {item.label || getPlatformLabel(item.platform)}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {item.url}
                                    </p>
                                </div>
                                <Switch
                                    checked={item.isActive}
                                    onCheckedChange={(checked) =>
                                        handleToggleActive(item.id, checked)
                                    }
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(item)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Social Media?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Apakah Anda yakin ingin menghapus {item.label || getPlatformLabel(item.platform)}?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                Hapus
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingItem} onOpenChange={(open) => !open && resetForm()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Social Media</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi social media
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLATFORMS.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <div className="flex items-center gap-2">
                                                <p.icon className="h-4 w-4" />
                                                {p.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>URL / Link</Label>
                            <Input
                                placeholder="https://instagram.com/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Label (Opsional)</Label>
                            <Input
                                placeholder="Instagram SMPIQu"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetForm}>
                            Batal
                        </Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
