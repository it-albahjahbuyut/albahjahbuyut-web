"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

const faqs = [
    {
        question: "Kapan Pendaftaran Dibuka?",
        answer: "Pendaftaran Santri Baru Gelombang 1 dibuka pada bulan April 2026 M (Syawwal-Dzulqaidah 1447 H). Gelombang 2 dibuka pada bulan Mei 2026 M (Dzulqaidah-Dzulhijjah 1447 H)."
    },
    {
        question: "Apakah ada tes seleksi?",
        answer: "Ya, ada. Calon santri akan mengikuti beberapa tes seleksi yang meliputi: Tes Pengetahuan Akademik, Tes Psikologi, Tes Baca Tulis Al-Qur'an, Tes Wawancara, dan Tes Ubudiyah."
    },
    {
        question: "Berapa biaya Pendaftaran Santri Baru di SMPIQu dan SMAIQu Al-Bahjah Buyut?",
        answer: "Biaya pendaftaran untuk jenjang SMPIQu dan SMAIQu adalah Rp 500.000. Untuk biaya lainnya seperti Infaq Perlengkapan, Program Sekolah, dll dapat dilihat pada tabel Rincian Biaya di atas."
    },
    {
        question: "Apa saja persyaratan pendaftarannya?",
        answer: "Persyaratan umum meliputi: Mengisi Formulir Pendaftaran, Pas Foto 3x4 (4 lembar), Fotocopy KK, Fotocopy Akta Kelahiran, Fotocopy KTP Orang Tua, dan Surat Keterangan Aktif Sekolah/Ijazah."
    },
    {
        question: "Bagaimana sistem pembayarannya?",
        answer: "Pembayaran dapat dilakukan melalui transfer ke rekening Bank Muamalat yang tersedia. Biaya pendaftaran tidak dapat dikembalikan (non-refundable), namun pelunasan biaya masuk dapat dilakukan secara bertahap sesuai kesepakatan sebelum masuk asrama."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-slate-50/50 relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064e3b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
                <FadeIn className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Informasi
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-2 tracking-tight">Pertanyaan Yang Sering Diajukan</h2>
                </FadeIn>

                <FadeInStagger className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i}>
                            <div className={`group rounded-2xl overflow-hidden transition-all duration-300 border ${openIndex === i ? "bg-white border-emerald-200 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-100" : "bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md"}`}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full text-left p-6 flex items-center justify-between gap-4 bg-transparent outline-none"
                                >
                                    <h3 className={`font-bold text-lg transition-colors ${openIndex === i ? "text-emerald-950" : "text-slate-700 group-hover:text-emerald-900"}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === i ? "bg-emerald-100 text-emerald-600 rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"}`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-transparent">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}
