import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
    const quickLinks = [
        { href: "/", label: "Beranda" },
        { href: "/profil", label: "Profil Pesantren" },
        { href: "/pendidikan/smp", label: "SMP" },
        { href: "/pendidikan/sma", label: "SMA" },
        { href: "/pendidikan/tahfidz", label: "Tahfidz" },
        { href: "/berita", label: "Berita" },
        { href: "/infaq", label: "Donasi" },
        { href: "/psb", label: "Pendaftaran" },
    ];

    return (
        <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* About */}
                    <div className="lg:col-span-1">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center bg-emerald-800">
                                <span className="text-2xl font-bold text-white">ب</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wide">Al-Bahjah Buyut</h3>
                                <p className="text-[10px] font-bold text-emerald-400 tracking-widest">Membangun Generasi Qur&apos;ani</p>
                            </div>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-emerald-100/90">
                            Pondok Pesantren Al-Bahjah Buyut adalah lembaga pendidikan Islam terpadu yang mengintegrasikan pendidikan formal dengan pembelajaran Al-Qur&apos;an dan kitab kuning.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-gold-400">
                            Tautan Cepat
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-emerald-100/80 transition-colors hover:text-gold-400 hover:pl-1"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-gold-400">
                            Kontak Kami
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-400" />
                                <span className="text-sm text-emerald-100/80 leading-relaxed">
                                    Desa Buyut, Kec. Gunungjati, Kab. Cirebon, Jawa Barat
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-gold-400" />
                                <a
                                    href="https://wa.me/6281234567890"
                                    className="text-sm text-emerald-100/80 transition-colors hover:text-gold-400"
                                >
                                    +62 812-3456-7890
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-gold-400" />
                                <a
                                    href="mailto:info@albahjahbuyut.sch.id"
                                    className="text-sm text-emerald-100/80 transition-colors hover:text-gold-400"
                                >
                                    info@albahjahbuyut.sch.id
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 shrink-0 text-gold-400" />
                                <span className="text-sm text-emerald-100/80">
                                    Senin - Sabtu: 07:00 - 16:00 WIB
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Map Embed */}
                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-gold-400">
                            Lokasi Kami
                        </h4>
                        <div className="aspect-video overflow-hidden rounded-xl bg-emerald-800 shadow-lg border border-emerald-700/50">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d108.5!3d-6.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ee278ae5c4fd9%3A0xd5fd7d4b05b5e98e!2sBumi%20Mahabbah%20Lembaga%20Pengembangan%20Da&#39;wah%20Al-Bahjah%20Buyut!5e0!3m2!1sid!2sid!4v1704263000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                                title="Lokasi Pondok Pesantren Al-Bahjah Buyut"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-emerald-800/50 bg-emerald-950/50">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-8">
                    <p className="text-center text-sm text-emerald-400/80">
                        © {new Date().getFullYear()} Pondok Pesantren Al-Bahjah Buyut. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex gap-6 text-sm text-emerald-400/80">
                        <Link href="/kebijakan-privasi" className="hover:text-gold-400 transition-colors">
                            Kebijakan Privasi
                        </Link>
                        <Link href="/syarat-ketentuan" className="hover:text-gold-400 transition-colors">
                            Syarat & Ketentuan
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
