import { FadeIn } from "@/components/animations/FadeIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kebijakan Privasi | Pondok Pesantren Al-Bahjah Buyut",
    description: "Kebijakan privasi Pondok Pesantren Al-Bahjah Buyut yang menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <FadeIn>
                    <header className="mb-16 text-center">
                        <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                            Informasi Legal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 tracking-tight">
                            Kebijakan Privasi
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </header>

                    <div className="prose prose-lg prose-emerald mx-auto text-slate-600">
                        <p className="lead">
                            Pondok Pesantren Al-Bahjah Buyut ("kami") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkap informasi pribadi Anda saat Anda menggunakan situs web kami.
                        </p>

                        <h3>1. Informasi yang Kami Kumpulkan</h3>
                        <p>
                            Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara sukarela kepada kami saat Anda:
                        </p>
                        <ul>
                            <li>Mendaftar sebagai santri baru (PSB Online).</li>
                            <li>Melakukan donasi atau infaq.</li>
                            <li>Menghubungi kami melalui formulir kontak atau aplikasi pesan.</li>
                            <li>Berlangganan newsletter atau informasi kegiatan.</li>
                        </ul>
                        <p>
                            Informasi yang kami kumpulkan dapat mencakup nama, alamat email, nomor telepon, alamat rumah, dan data lain yang diperlukan untuk layanan yang Anda minta.
                        </p>

                        <h3>2. Penggunaan Informasi</h3>
                        <p>
                            Kami menggunakan informasi yang kami kumpulkan untuk:
                        </p>
                        <ul>
                            <li>Memproses pendaftaran santri baru.</li>
                            <li>Mengelola dan mencatat donasi/infaq Anda.</li>
                            <li>Mengirimkan informasi kegiatan, jadwal majelis, atau berita terbaru (jika Anda berlangganan).</li>
                            <li>Menjawab pertanyaan atau masukan Anda.</li>
                            <li>Meningkatkan layanan dan pengalaman pengguna di situs web kami.</li>
                        </ul>

                        <h3>3. Perlindungan Data</h3>
                        <p>
                            Kami berkomitmen untuk menjaga keamanan data pribadi Anda. Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Kami tida akan pernah menjual data pribadi Anda kepada pihak ketiga manapun.
                        </p>

                        <h3>4. Cookie</h3>
                        <p>
                            Situs web kami dapat menggunakan cookie untuk meningkatkan pengalaman penjelajahan Anda. Cookie adalah file teks kecil yang disimpan di perangkat Anda. Anda dapat mengatur browser Anda untuk menolak cookie, namun hal ini dapat memengaruhi fungsionalitas situs web tertentu.
                        </p>

                        <h3>5. Tautan ke Situs Pihak Ketiga</h3>
                        <p>
                            Situs web kami mungkin berisi tautan ke situs web pihak ketiga (misalnya, media sosial). Kami tidak bertanggung jawab atas kebijakan privasi atau konten situs web tersebut. Kami menyarankan Anda untuk membaca kebijakan privasi mereka sebelum memberikan informasi pribadi.
                        </p>

                        <h3>6. Perubahan Kebijakan Privasi</h3>
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan berlaku segera setelah diposting di halaman ini. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan apa pun.
                        </p>

                        <h3>7. Hubungi Kami</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui:
                        </p>
                        <ul>
                            <li>Email: <a href="mailto:info@albahjahbuyut.com" className="text-emerald-700 font-medium hover:text-emerald-900">info@albahjahbuyut.com</a></li>
                            <li>WhatsApp: <a href="https://wa.me/6289676539390" className="text-emerald-700 font-medium hover:text-emerald-900">+62 896-7653-9390</a></li>
                            <li>Alamat: Jl. Revolusi No.45, Buyut, Kec. Gunungjati, Kabupaten Cirebon, Jawa Barat 45151</li>
                        </ul>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
