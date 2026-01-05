"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudinaryUploadProps {
    onUploadComplete: (url: string) => void;
    onUploadError?: (error: string) => void;
    folder?: string;
    className?: string;
    disabled?: boolean;
}

export function CloudinaryUpload({
    onUploadComplete,
    onUploadError,
    folder = "abbuyut",
    className,
    disabled = false,
}: CloudinaryUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = useCallback(
        (result: CloudinaryUploadWidgetResults) => {
            setIsUploading(false);

            if (result.event === "success" && result.info && typeof result.info !== "string") {
                const secureUrl = result.info.secure_url;
                onUploadComplete(secureUrl);
            }
        },
        [onUploadComplete]
    );

    const handleError = useCallback(
        (error: unknown) => {
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : "Upload gagal";
            onUploadError?.(errorMessage);
        },
        [onUploadError]
    );

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
                folder,
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 10485760, // 10MB
                cropping: false,
                sources: ["local", "url", "camera"],
                styles: {
                    palette: {
                        window: "#1e1e1e",
                        windowBorder: "#3b3b3b",
                        tabIcon: "#22c55e",
                        menuIcons: "#22c55e",
                        textDark: "#000000",
                        textLight: "#ffffff",
                        link: "#22c55e",
                        action: "#22c55e",
                        inactiveTabIcon: "#6b7280",
                        error: "#ef4444",
                        inProgress: "#22c55e",
                        complete: "#22c55e",
                        sourceBg: "#292929",
                    },
                },
            }}
            onSuccess={handleUpload}
            onError={handleError}
            onOpen={() => setIsUploading(true)}
            onClose={() => setIsUploading(false)}
        >
            {({ open }) => (
                <div
                    className={cn(
                        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                    onClick={() => !disabled && open()}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground">
                                Mengupload gambar...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <ImagePlus className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Klik untuk upload gambar
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                JPG, PNG, GIF, WebP (maks. 10MB)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </CldUploadWidget>
    );
}

// Multiple image upload component
interface CloudinaryMultiUploadProps {
    onUploadComplete: (urls: string[]) => void;
    onUploadError?: (error: string) => void;
    folder?: string;
    maxFiles?: number;
    className?: string;
    disabled?: boolean;
}

export function CloudinaryMultiUpload({
    onUploadComplete,
    onUploadError,
    folder = "abbuyut",
    maxFiles = 10,
    className,
    disabled = false,
}: CloudinaryMultiUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleUpload = useCallback(
        (result: CloudinaryUploadWidgetResults) => {
            if (result.event === "success" && result.info && typeof result.info !== "string") {
                const secureUrl = result.info.secure_url;
                setUploadedUrls((prev) => [...prev, secureUrl]);
            }
        },
        []
    );

    const handleClose = useCallback(() => {
        setIsUploading(false);
        if (uploadedUrls.length > 0) {
            onUploadComplete(uploadedUrls);
            setUploadedUrls([]);
        }
    }, [uploadedUrls, onUploadComplete]);

    const handleError = useCallback(
        (error: unknown) => {
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : "Upload gagal";
            onUploadError?.(errorMessage);
        },
        [onUploadError]
    );

    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
                folder,
                maxFiles,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 10485760, // 10MB
                multiple: true,
                sources: ["local", "url", "camera"],
                styles: {
                    palette: {
                        window: "#1e1e1e",
                        windowBorder: "#3b3b3b",
                        tabIcon: "#22c55e",
                        menuIcons: "#22c55e",
                        textDark: "#000000",
                        textLight: "#ffffff",
                        link: "#22c55e",
                        action: "#22c55e",
                        inactiveTabIcon: "#6b7280",
                        error: "#ef4444",
                        inProgress: "#22c55e",
                        complete: "#22c55e",
                        sourceBg: "#292929",
                    },
                },
            }}
            onSuccess={handleUpload}
            onError={handleError}
            onOpen={() => setIsUploading(true)}
            onClose={handleClose}
        >
            {({ open }) => (
                <div
                    className={cn(
                        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                    onClick={() => !disabled && open()}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground">
                                Mengupload gambar...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <ImagePlus className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Klik untuk upload gambar (maks. {maxFiles} file)
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                JPG, PNG, GIF, WebP (maks. 10MB per file)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </CldUploadWidget>
    );
}
