"use client";

import { useState } from "react";
import Image from "next/image";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

interface GalleryItem {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
}

interface GalleryGridProps {
    galleries: GalleryItem[];
}

export function GalleryGrid({ galleries }: GalleryGridProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "";
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? galleries.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === galleries.length - 1 ? 0 : prev + 1));
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
    };

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
        if (distance > minSwipeDistance) goToNext();
        else if (distance < -minSwipeDistance) goToPrevious();
    };

    const currentGallery = galleries[currentIndex];

    return (
        <>
            {/* Gallery Grid */}
            <FadeInStagger className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {galleries.map((gallery, index) => (
                    <FadeIn key={gallery.id} className="break-inside-avoid">
                        <button
                            onClick={() => openLightbox(index)}
                            className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <div className="relative">
                                <OptimizedImage
                                    src={gallery.imageUrl}
                                    alt={gallery.title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    {/* Zoom icon */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                            <ZoomIn className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {gallery.title}
                                    </h3>
                                    {gallery.description && (
                                        <p className="text-emerald-100/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                                            {gallery.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    </FadeIn>
                ))}
            </FadeInStagger>

            {/* Lightbox */}
            {lightboxOpen && currentGallery && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Top bar */}
                    <div className="flex-shrink-0 flex items-center justify-between p-4 z-20">
                        {/* Counter */}
                        <div className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                            {currentIndex + 1} / {galleries.length}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label="Tutup"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main image area */}
                    <div
                        className="flex-1 relative flex items-center justify-center px-2 pb-4"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Navigation - Previous */}
                        {galleries.length > 1 && (
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

                        {/* Image */}
                        <div className="relative w-full h-full max-w-5xl max-h-full">
                            <OptimizedImage
                                src={currentGallery.imageUrl}
                                alt={currentGallery.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                priority
                            />
                        </div>

                        {/* Navigation - Next */}
                        {galleries.length > 1 && (
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

                    {/* Bottom area with title and thumbnails */}
                    <div className="flex-shrink-0 z-20">
                        {/* Title and Description */}
                        <div className="text-center px-4 pb-3">
                            <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                                {currentGallery.title}
                            </h3>
                            {currentGallery.description && (
                                <p className="text-white/70 text-sm max-w-lg mx-auto">
                                    {currentGallery.description}
                                </p>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {galleries.length > 1 && (
                            <div className="flex justify-center gap-2 overflow-x-auto py-3 px-4">
                                {galleries.map((gallery, idx) => (
                                    <button
                                        key={gallery.id}
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
                                        <OptimizedImage
                                            src={gallery.imageUrl}
                                            alt={gallery.title}
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
            )}
        </>
    );
}
