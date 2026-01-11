import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";

// Custom TikTok icon (lucide-react doesn't have one)
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

export function Footer() {
    const quickLinks = [
        { href: "/", label: "Beranda" },
        { href: "/profil", label: "Profil Pesantren" },
        { href: "/pendidikan", label: "Pendidikan" },
        { href: "/berita", label: "Berita" },
        { href: "/infaq", label: "Infaq" },
        { href: "/psb", label: "Pendaftaran Santri Baru" },
    ];

    return (
        <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* About */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <img src="/logo-buyut.png" alt="Logo Al-Bahjah Buyut" className="h-20 w-auto object-contain mb-4" />
                            <div>
                                <h3 className="text-lg font-bold tracking-wide">Al-Bahjah Buyut</h3>
                                <p className="text-[10px] font-bold text-emerald-400 tracking-widest">Membangun Generasi Qur'ani</p>
                            </div>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-emerald-100/90 max-w-xs">
                            Lembaga Pengembangan Dakwah (LPD) Al-Bahjah Buyut dibawah asuhan Buya Yahya & Abah Sayf Abu Hanifah. Mencetak generasi Qur'ani yang berakhlak mulia, cerdas, dan mandiri.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/ponpesalbahjah2"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.instagram.com/abahsayfabuhanifah"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@ASAHTVOFFICIAL"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@abahsayfabuhanifah"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/50 transition-colors hover:bg-gold-500 hover:text-emerald-950"
                            >
                                <TikTokIcon className="h-5 w-5" />
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
                                    Jl. Revolusi No.45, Buyut, Kec. Gunungjati, Kabupaten Cirebon, Jawa Barat 45151, Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-gold-400" />
                                <a
                                    href="https://wa.me/6289676539390"
                                    className="text-sm text-emerald-100/80 transition-colors hover:text-gold-400"
                                >
                                    +62 823-1861-1707
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-gold-400" />
                                <a
                                    href="mailto:info@albahjahbuyut.com"
                                    className="text-sm text-emerald-100/80 transition-colors hover:text-gold-400"
                                >
                                    info@albahjahbuyut.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="h-5 w-5 shrink-0 text-gold-400" />
                                <span className="text-sm text-emerald-100/80">
                                    Senin - Jumat: 07:00 - 16:00 WIB
                                    Sabtu - Ahad: 07:00 - 12:00 WIB
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Map Embed */}
                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-400">
                            Lokasi Kami
                        </h4>
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-emerald-800 shadow-lg border border-emerald-700/50 mb-3">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.6856899793127!2d108.50808394923925!3d-6.650511541174398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6ee1031049e1fd%3A0x864102adb6b45729!2sBumi%20Mahabbah%20Lembaga%20Pengembangan%20Da&#39;wah%20Al-Bahjah%20Buyut!5e0!3m2!1sid!2sid!4v1767796115168!5m2!1sid!2sid"
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
                        <a
                            href="https://maps.app.goo.gl/yvnfNYzzzv1Hma3n7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-emerald-100/80 hover:text-gold-400 transition-colors"
                        >
                            <MapPin className="h-4 w-4" />
                            Buka di Google Maps
                        </a>
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
