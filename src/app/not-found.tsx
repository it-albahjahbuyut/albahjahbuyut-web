import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-900 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="text-center relative z-10 px-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100/50 rounded-full mb-8 text-emerald-900 ring-8 ring-emerald-50">
                    <FileQuestion className="w-12 h-12" />
                </div>

                <h1 className="text-6xl md:text-9xl font-black text-emerald-950 mb-2 tracking-tighter">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 uppercase tracking-wide">
                    Halaman Tidak Ditemukan
                </h2>

                <p className="text-slate-600 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                    Mohon maaf, halaman yang Anda tuju tidak tersedia. <br className="hidden sm:block" />
                    Mungkin halaman telah dihapus atau alamat URL yang Anda masukkan salah.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-emerald-950 text-white px-8 py-4 font-bold uppercase tracking-widest transition-all hover:-translate-y-1 hover:bg-gold-500 hover:text-emerald-950 shadow-xl rounded-lg"
                >
                    <Home className="w-5 h-5" />
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    )
}
