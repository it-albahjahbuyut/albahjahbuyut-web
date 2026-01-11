"use client";

import { useState, useEffect } from "react";
import { Share2, Check, Link, MessageCircle } from "lucide-react";

interface ShareButtonProps {
    title: string;
    description: string;
    slug: string;
    basePath: string; // e.g., "/infaq" or "/berita"
    shareMessage?: string;
    buttonText?: string;
}

export function ShareButton({
    title,
    description,
    slug,
    basePath,
    shareMessage = "Lihat selengkapnya di:",
    buttonText = "Bagikan"
}: ShareButtonProps) {
    const [showOptions, setShowOptions] = useState(false);
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    // Initialize origin strictly on client side to avoid hydration mismatch
    // But don't set it immediately to empty string if window exists, 
    // actually useEffect is best for this.
    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const shareUrl = origin ? `${origin}${basePath}/${slug}` : "";
    const shareText = `${title}\n\n${description}...\n\n${shareMessage}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error
                setShowOptions(true);
            }
        } else {
            setShowOptions(true);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShowOptions(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const shareToWhatsApp = () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        window.open(waUrl, "_blank");
        setShowOptions(false);
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl font-medium transition-all"
            >
                <Share2 className="w-4 h-4" />
                {buttonText}
            </button>

            {showOptions && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowOptions(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[200px]">
                        <button
                            onClick={copyLink}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <Link className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="text-sm text-slate-700">
                                {copied ? "Link Disalin!" : "Salin Link"}
                            </span>
                        </button>
                        <button
                            onClick={shareToWhatsApp}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-t border-slate-100"
                        >
                            <MessageCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-slate-700">WhatsApp</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
