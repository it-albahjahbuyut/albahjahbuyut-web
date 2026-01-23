"use client";

import Image, { ImageProps } from "next/image";
import { cloudinaryLoader, isCloudinaryUrl } from "@/lib/cloudinary";

interface OptimizedImageProps extends Omit<ImageProps, "loader"> {
    /**
     * Public ID from Cloudinary OR full Cloudinary URL.
     * If full URL is provided, it will be parsed.
     */
    src: string;
}

export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
    // Determine if we should use the custom loader
    // We use it if it's a Cloudinary URL or if it looks like a public ID (not starting with http/https)
    const shouldUseLoader = isCloudinaryUrl(src) || !src.startsWith("http");

    return (
        <Image
            src={src}
            alt={alt}
            loader={shouldUseLoader ? cloudinaryLoader : undefined}
            {...props}
        />
    );
}
