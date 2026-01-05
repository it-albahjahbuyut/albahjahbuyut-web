"use client";

import { motion, Variants } from "framer-motion";
import React from "react";

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function FadeIn({ children, className, delay = 0, direction = "up" }: FadeInProps) {
    const directionOffset = {
        up: 40,
        down: -40,
        left: 40,
        right: -40,
    };

    const axis = direction === "left" || direction === "right" ? "x" : "y";

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...(axis === "x" ? { x: directionOffset[direction] } : { y: directionOffset[direction] }),
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                duration: 1.25,
                delay,
                bounce: 0,
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStagger({ children, className, faster = false }: { children: React.ReactNode; className?: string, faster?: boolean }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: faster ? 0.1 : 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
