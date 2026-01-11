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
        <section className="py-12 lg:py-24 bg-white relative z-20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="relative max-w-5xl mx-auto">
                    <div className="relative bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                        {/* Close button */}
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="absolute top-2 right-2 z-20 p-1 rounded-full text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
                            aria-label="Tutup"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col sm:flex-row items-center">
                            {/* Thumbnail - Compact */}
                            <a
                                href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-full sm:w-72 md:w-96 shrink-0 aspect-video bg-slate-100 overflow-hidden"
                            >
                                {liveData.thumbnail ? (
                                    <Image
                                        src={liveData.thumbnail}
                                        alt={liveData.title || "Live Stream"}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Radio className="w-6 h-6 text-slate-300" />
                                    </div>
                                )}

                                {/* Simple Live Overlay on Thumbnail */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                                    <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                    LIVE
                                </div>
                            </a>

                            {/* Content Section - Compact */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 align-baseline">
                                    <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                        Sedang Berlangsung
                                    </p>
                                    {liveData.viewerCount && (
                                        <>
                                            <span className="text-slate-300 text-[10px]">•</span>
                                            <span className="text-slate-500 text-[10px] font-medium flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {parseInt(liveData.viewerCount).toLocaleString("id-ID")} Menonton
                                            </span>
                                        </>
                                    )}
                                </div>

                                <h3 className="text-slate-900 text-lg md:text-xl font-bold leading-tight line-clamp-2 mb-4 group-hover:text-red-700 transition-colors">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {liveData.title || "Kajian Langsung"}
                                    </a>
                                </h3>

                                <div className="flex items-center justify-between sm:justify-start gap-4">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${liveData.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                    >
                                        Tonton Sekarang
                                        <ExternalLink className="w-3 h-3" />
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
