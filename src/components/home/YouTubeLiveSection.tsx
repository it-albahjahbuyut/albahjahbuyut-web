"use client";

import { useState, useEffect } from "react";
import { Radio, Users, ExternalLink, X } from "lucide-react";
import Image from "next/image";

interface LiveStreamData {
    isLive: boolean;
    title?: string;
    videoId?: string;
    thumbnail?: string;
    channelTitle?: string;
    viewerCount?: string;
}

export function YouTubeLiveSection() {
    const [liveData, setLiveData] = useState<LiveStreamData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const checkLiveStatus = async () => {
            try {
                const response = await fetch("/api/youtube-live");
                const data = await response.json();
                setLiveData(data);
            } catch (error) {
                console.error("Failed to check live status:", error);
                setLiveData({ isLive: false });
            } finally {
                setIsLoading(false);
            }
        };

        checkLiveStatus();

        // Poll every 2 minutes
        const interval = setInterval(checkLiveStatus, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Don't render if loading, not live, or dismissed
    if (isLoading || !liveData?.isLive || isDismissed) {
        return null;
    }

    return (
        <section className="py-8 bg-white relative z-20">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Floating Card Design */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Glowing effect behind the card to highlight LIVE status */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur opacity-20 animate-pulse"></div>

                    <div className="relative bg-white border border-red-100 rounded-xl shadow-xl shadow-red-500/5 overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="absolute top-2 right-2 z-20 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Tutup"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col md:flex-row items-stretch">
                            {/* Thumbnail Section - Full width on mobile, fixed width on desktop */}
                            <a
                                href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative md:w-72 shrink-0 group block overflow-hidden bg-slate-100"
                            >
                                <div className="aspect-video relative">
                                    {liveData.thumbnail ? (
                                        <Image
                                            src={liveData.thumbnail}
                                            alt={liveData.title || "Live Stream"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                            <Radio className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                                    {/* Live Badge on Thumbnail */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                            LIVE
                                        </div>
                                        {liveData.viewerCount && (
                                            <div className="flex items-center gap-1 text-white/90 text-[10px] font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                                                <Users className="w-3 h-3" />
                                                <span>{parseInt(liveData.viewerCount).toLocaleString("id-ID")}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            {/* Content Section */}
                            <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <p className="text-red-600 text-xs font-bold uppercase tracking-wider">
                                        {liveData.channelTitle || "ASAH TV"} Sedang Live
                                    </p>
                                </div>

                                <h3 className="text-slate-900 text-lg md:text-xl font-bold leading-tight line-clamp-2 hover:text-red-700 transition-colors mb-4 md:mb-0">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {liveData.title || "Kajian Langsung dari Al-Bahjah Buyut"}
                                    </a>
                                </h3>

                                {/* Action Button - Desktop: Right aligned, Mobile: Full width */}
                                <div className="mt-4 md:mt-auto pt-4 md:pt-0 flex items-center justify-between border-t border-slate-100 md:border-0 md:justify-start">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors group"
                                    >
                                        Tonton di YouTube
                                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
