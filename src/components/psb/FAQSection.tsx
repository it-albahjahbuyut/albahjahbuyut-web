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
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <FadeIn className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-100 px-3 py-1 rounded-full">Informasi</span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-4 uppercase tracking-tight">FAQ (Pertanyaan Yang Sering Diajukan)</h2>
                </FadeIn>

                <FadeInStagger className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i}>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-emerald-300 hover:shadow-md">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full text-left p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] transition-transform duration-300 ${openIndex === i ? "border-b-emerald-600 rotate-0" : "border-b-slate-400 rotate-90"}`} />
                                        <h3 className={`font-bold text-md md:text-lg ${openIndex === i ? "text-emerald-950" : "text-slate-700"}`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    {/* <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-emerald-600" : ""}`} /> */}
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-5 pt-0 pl-9 text-slate-600 leading-relaxed text-sm md:text-base border-t border-transparent">
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
