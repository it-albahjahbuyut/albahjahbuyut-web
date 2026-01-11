"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-200 hover:bg-emerald-300 text-emerald-700 flex items-center justify-center transition-all"
            title="Salin nomor rekening"
        >
            {copied ? (
                <Check className="w-5 h-5" />
            ) : (
                <Copy className="w-5 h-5" />
            )}
        </button>
    );
}
