"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
    id: string;
    imageUrl: string;
    caption?: string | null;
}

interface ImageLightboxProps {
    images: GalleryImage[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance
    const minSwipeDistance = 50;

    // Reset index when opened with new initialIndex
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Touch handlers for swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
            onClick={onClose}
        >
            {/* Top bar with close and counter */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 z-20">
                {/* Image counter */}
                <div className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Tutup"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Main image area with navigation */}
            <div
                className="flex-1 relative flex items-center justify-center px-2 pb-4"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Navigation - Previous */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/20"
                        aria-label="Sebelumnya"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                )}

                {/* Image container */}
                <div className="relative w-full h-full max-w-5xl max-h-full">
                    <Image
                        src={currentImage.imageUrl}
                        alt={currentImage.caption || `Gambar ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        priority
                    />
                </div>

                {/* Navigation - Next */}
                {images.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors border border-white/20"
                        aria-label="Selanjutnya"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                )}
            </div>

            {/* Bottom area with caption and thumbnails */}
            <div className="flex-shrink-0 z-20">
                {/* Caption */}
                {currentImage.caption && (
                    <div className="text-center px-4 pb-2">
                        <p className="inline-block px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-white text-sm max-w-lg">
                            {currentImage.caption}
                        </p>
                    </div>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex justify-center gap-2 overflow-x-auto py-3 px-4">
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={cn(
                                    "relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                                    idx === currentIndex
                                        ? "border-white scale-110"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={img.imageUrl}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Swipe hint for mobile */}
                <p className="text-center text-white/40 text-xs pb-2 md:hidden">
                    Geser untuk navigasi
                </p>
            </div>
        </div>
    );
}

// Wrapper component for gallery with built-in lightbox
interface GalleryWithLightboxProps {
    images: GalleryImage[];
    title?: string;
    className?: string;
}

export function GalleryWithLightbox({ images, title = "Galeri", className }: GalleryWithLightboxProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        setLightboxOpen(true);
    };

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <Image
                            src={img.imageUrl}
                            alt={img.caption || `${title} - ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Zoom icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <ZoomIn className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Caption overlay */}
                        {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                {img.caption}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <ImageLightbox
                images={images}
                initialIndex={selectedIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}
