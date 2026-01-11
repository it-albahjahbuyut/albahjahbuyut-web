"use client";

import { GalleryWithLightbox } from "@/components/ui/image-lightbox";

interface GalleryImage {
    id: string;
    imageUrl: string;
    caption?: string | null;
}

interface InfaqGalleryProps {
    images: GalleryImage[];
    title: string;
}

export function InfaqGallery({ images, title }: InfaqGalleryProps) {
    return (
        <GalleryWithLightbox
            images={images}
            title={`Dokumentasi ${title}`}
        />
    );
}
