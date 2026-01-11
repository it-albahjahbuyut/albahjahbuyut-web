import { FadeIn } from "@/components/animations/FadeIn";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Syarat & Ketentuan | Pondok Pesantren Al-Bahjah Buyut",
    description: "Syarat dan ketentuan penggunaan situs web Pondok Pesantren Al-Bahjah Buyut.",
};

export default function TermsAndConditionsPage() {
    return (
        <main className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <FadeIn>
                    <header className="mb-16 text-center">
                        <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                            Informasi Legal
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 tracking-tight">
                            Syarat & Ketentuan
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </header>

                    <div className="prose prose-lg prose-emerald mx-auto text-slate-600">
                        <p className="lead">
                            Selamat datang di situs web Pondok Pesantren Al-Bahjah Buyut. Dengan mengakses dan menggunakan situs ini, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan berikut.
                        </p>

                        <h3>1. Penggunaan Situs</h3>
                        <p>
                            Anda setuju untuk menggunakan situs ini hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda dilarang menggunakan situs ini untuk:
                        </p>
                        <ul>
                            <li>Mengunggah atau menyebarkan konten yang melanggar hukum, berbahaya, atau menyinggung.</li>
                            <li>Melakukan tindakan yang dapat merusak, menonaktifkan, atau membebani server kami.</li>
                            <li>Mencoba mendapatkan akses tidak sah ke sistem atau data kami.</li>
                        </ul>

                        <h3>2. Hak Kekayaan Intelektual</h3>
                        <p>
                            Seluruh konten di situs ini, termasuk namun tidak terbatas pada teks, gambar, logo, dan video, adalah milik Pondok Pesantren Al-Bahjah Buyut atau pemberi lisensinya dan dilindungi oleh undang-undang hak cipta. Anda tidak diperkenankan menggunakan konten tersebut tanpa izin tertulis dari kami.
                        </p>

                        <h3>3. Pendaftaran Santri Baru (PSB)</h3>
                        <p>
                            Informasi yang Anda berikan saat mendaftar sebagai santri baru harus akurat dan benar. Kami berhak menolak atau membatalkan pendaftaran jika ditemukan informasi yang palsu atau menyesatkan.
                        </p>

                        <h3>4. Donasi & Infaq</h3>
                        <p>
                            Segala bentuk donasi dan infaq yang disalurkan melalui situs ini bersifat sukarela. Kami akan menyalurkan dana tersebut sesuai dengan amanah dan program yang telah ditentukan. Anda bertanggung jawab untuk memastikan kebenaran nominal dan tujuan transfer.
                        </p>

                        <h3>5. Batasan Tanggung Jawab</h3>
                        <p>
                            Situs ini disediakan "sebagaimana adanya". Kami berupaya menjaga keakuratan informasi, namun kami tidak memberikan jaminan bahwa situs ini akan selalu bebas dari kesalahan atau gangguan. Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan situs ini.
                        </p>

                        <h3>6. Perubahan Syarat & Ketentuan</h3>
                        <p>
                            Kami berhak mengubah Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif segera setelah diposting di situs ini. Penggunaan berkelanjutan Anda atas situs ini setelah perubahan tersebut dianggap sebagai persetujuan Anda terhadap Syarat & Ketentuan yang baru.
                        </p>

                        <h3>7. Hukum yang Berlaku</h3>
                        <p>
                            Syarat & Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
