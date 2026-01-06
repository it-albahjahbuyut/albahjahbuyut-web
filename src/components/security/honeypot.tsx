"use client";

import { useState, useEffect } from 'react';

/**
 * Honeypot Anti-Spam Component
 * 
 * Provides invisible honeypot fields to catch bots.
 * Bots typically fill all form fields, including hidden ones.
 * If the honeypot field is filled, we know it's a bot.
 */

// ============================================
// HONEYPOT HOOK
// ============================================

interface HoneypotState {
    value: string;
    isBot: boolean;
    timestamp: number;
}

/**
 * Hook to manage honeypot anti-spam protection
 */
export function useHoneypot() {
    const [honeypot, setHoneypot] = useState<HoneypotState>({
        value: '',
        isBot: false,
        timestamp: Date.now(),
    });

    const handleChange = (value: string) => {
        setHoneypot(prev => ({
            ...prev,
            value,
            isBot: value.length > 0, // If filled, it's a bot
        }));
    };

    const checkSubmission = (): { isBot: boolean; reason?: string } => {
        // Check if honeypot was filled
        if (honeypot.value.length > 0) {
            return { isBot: true, reason: 'Honeypot field was filled' };
        }

        // Check if form was submitted too quickly (less than 2 seconds)
        const timeDiff = Date.now() - honeypot.timestamp;
        if (timeDiff < 2000) {
            return { isBot: true, reason: 'Form submitted too quickly' };
        }

        return { isBot: false };
    };

    const reset = () => {
        setHoneypot({
            value: '',
            isBot: false,
            timestamp: Date.now(),
        });
    };

    return {
        value: honeypot.value,
        isBot: honeypot.isBot,
        handleChange,
        checkSubmission,
        reset,
    };
}

// ============================================
// HONEYPOT COMPONENT
// ============================================

interface HoneypotFieldProps {
    onChange: (value: string) => void;
    value: string;
}

/**
 * Invisible honeypot field component
 * This field is hidden from real users but visible to bots
 */
export function HoneypotField({ onChange, value }: HoneypotFieldProps) {
    return (
        <div
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                opacity: 0,
                height: 0,
                width: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
            tabIndex={-1}
        >
            <label htmlFor="website_url_field_hp">
                Leave this field empty
            </label>
            <input
                type="text"
                id="website_url_field_hp"
                name="website_url_field_hp"
                autoComplete="off"
                tabIndex={-1}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// ============================================
// TIMING VALIDATION
// ============================================

/**
 * Check if form submission time is suspicious
 * Returns true if the time taken is too short (bot-like behavior)
 */
export function isSubmissionTooFast(startTime: number, minSeconds: number = 2): boolean {
    const elapsed = (Date.now() - startTime) / 1000;
    return elapsed < minSeconds;
}

/**
 * Hook to track form timing
 */
export function useFormTiming(minSeconds: number = 2) {
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    const isTooFast = (): boolean => {
        return isSubmissionTooFast(startTime, minSeconds);
    };

    const reset = () => {
        setStartTime(Date.now());
    };

    return {
        startTime,
        isTooFast,
        reset,
    };
}
