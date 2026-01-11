"use client";

import { GalleryWithLightbox } from "@/components/ui/image-lightbox";

interface GalleryImage {
    id: string;
    imageUrl: string;
    caption?: string | null;
}

interface NewsGalleryProps {
    images: GalleryImage[];
    title: string;
}

export function NewsGallery({ images, title }: NewsGalleryProps) {
    return (
        <GalleryWithLightbox
            images={images}
            title={`Dokumentasi ${title}`}
        />
    );
}
