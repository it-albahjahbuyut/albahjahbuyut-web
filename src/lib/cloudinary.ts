"use client";

// Cloudinary configuration
// Make sure to set these environment variables:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
};

// Helper to get optimized Cloudinary URL
export function getCloudinaryUrl(
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        crop?: "fill" | "fit" | "scale" | "thumb";
        quality?: "auto" | number;
        format?: "auto" | "webp" | "avif" | "jpg" | "png";
    }
): string {
    const { width, height, crop = "fill", quality = "auto", format = "auto" } = options || {};

    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformStr = transformations.length > 0 ? transformations.join(",") + "/" : "";

    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformStr}${publicId}`;
}

// Check if URL is a Cloudinary URL
export function isCloudinaryUrl(url: string): boolean {
    return url.includes("res.cloudinary.com");
}
