"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    ChevronDown,
    Home,
    BookOpen,
    Newspaper,
    Heart,
    Users,
    Image as ImageIcon,
} from "lucide-react";

interface NavbarProps {
    units: {
        id: string;
        name: string;
        slug: string;
    }[];
}

export function Navbar({ units }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Beranda", icon: Home },
        { href: "/profil", label: "Profil", icon: Users },
        { href: "/galeri", label: "Galeri", icon: ImageIcon },
        { href: "/berita", label: "Berita", icon: Newspaper },
        { href: "/infaq", label: "Infaq", icon: Heart },
    ];

    const headerBackground = isScrolled || isOpen
        ? "bg-white/95 backdrop-blur-md border-b border-emerald-100/50 shadow-sm"
        : "bg-transparent border-transparent";

    const textColor = isScrolled || isOpen ? "text-emerald-950" : "text-white";
    const subTextColor = isScrolled || isOpen ? "text-slate-500" : "text-white/90";
    const navTextColor = isScrolled || isOpen ? "text-slate-700 hover:bg-emerald-50" : "text-white hover:bg-white/10";
    const mobileMenuButtonColor = isScrolled || isOpen ? "bg-slate-50 text-slate-700" : "bg-white/10 text-white hover:bg-white/20";

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBackground}`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
                {/* Logo */}
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo-buyut.png" alt="Logo Al-Bahjah Buyut" className="h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 lg:flex">
                    <Link
                        href="/"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}
                    >
                        Beranda
                    </Link>

                    {/* Pendidikan Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}>
                            <BookOpen className="h-4 w-4" />
                            <span>Pendidikan</span>
                            <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 top-full min-w-48 overflow-hidden rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5"
                                >
                                    {units.map((unit) => (
                                        <Link
                                            key={unit.id}
                                            href={`/pendidikan/${unit.slug}`}
                                            className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            {unit.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link
                        href="/profil"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}
                    >
                        Profil
                    </Link>
                    <Link
                        href="/galeri"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}
                    >
                        Galeri
                    </Link>
                    <Link
                        href="/berita"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}
                    >
                        Berita
                    </Link>
                    <Link
                        href="/infaq"
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${navTextColor}`}
                    >
                        Infaq
                    </Link>
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/psb"
                        className="hidden bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest hover:bg-emerald-800 transition-all sm:inline-flex"
                    >
                        PSB Online
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex h-10 w-10 items-center justify-center rounded-sm transition-colors lg:hidden ${mobileMenuButtonColor}`}
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
                    >
                        <div className="space-y-1 px-4 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    <link.icon className="h-5 w-5" />
                                    <span className="text-base font-medium">{link.label}</span>
                                </Link>
                            ))}

                            {/* Pendidikan Links */}
                            <div className="border-t border-slate-100 pt-3 mt-3">
                                <p className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                                    <BookOpen className="h-4 w-4" />
                                    Unit Pendidikan
                                </p>
                                {units.map((unit) => (
                                    <Link
                                        key={unit.id}
                                        href={`/pendidikan/${unit.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded-lg px-4 py-3 pl-10 text-sm text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        {unit.name}
                                    </Link>
                                ))}
                            </div>

                            {/* PSB Button Mobile */}
                            <div className="border-t border-slate-100 pt-4 mt-3 pb-2">
                                <Link
                                    href="/psb"
                                    onClick={() => setIsOpen(false)}
                                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
                                >
                                    PSB Online
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
