'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Trash2, Send, Loader2, Mail, Check, X, Eye, Edit3, Search, Sparkles, Users } from 'lucide-react';
import { deleteSubscriber, sendNewsletter } from '@/actions/newsletter-actions';
import { TiptapEditor } from '@/components/editor/tiptap';

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
    isActive: boolean;
    subscribedAt: Date;
    unsubscribedAt: Date | null;
    source: string | null;
}

interface NewsletterActionsProps {
    subscribers: Subscriber[];
}

export default function NewsletterActions({ subscribers }: NewsletterActionsProps) {
    const router = useRouter();
    const [showSendModal, setShowSendModal] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const activeSubscribers = subscribers.filter(s => s.isActive);

    const filteredSubscribers = subscribers.filter(s =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin hapus subscriber ini?')) return;

        setDeletingId(id);
        const result = await deleteSubscriber(id);
        setDeletingId(null);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    const handleSendNewsletter = async () => {
        if (!subject.trim() || !content.trim()) {
            setMessage({ type: 'error', text: 'Subject dan konten harus diisi' });
            return;
        }

        setIsSending(true);
        setMessage(null);

        const result = await sendNewsletter(subject, content);

        setIsSending(false);
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        if (result.success) {
            setSubject('');
            setContent('');
            setTimeout(() => setShowSendModal(false), 2000);
        }
    };

    const exportToCSV = () => {
        const headers = ['Email', 'Nama', 'Status', 'Sumber', 'Tanggal Subscribe'];
        const rows = subscribers.map(s => [
            s.email,
            s.name || '-',
            s.isActive ? 'Aktif' : 'Tidak Aktif',
            s.source || '-',
            new Date(s.subscribedAt).toLocaleDateString('id-ID')
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // Generate email preview with improved template
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    const handleGenerateAI = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        try {
            const { generateNewsletterAI } = await import('@/actions/newsletter-actions');
            const result = await generateNewsletterAI(aiPrompt);
            if (result.success) {
                setContent(result.content);
                setSubject(result.subject);
                setAiPrompt('');
                setMessage({ type: 'success', text: result.message });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal terhubung ke layanan AI' });
        } finally {
            setIsGenerating(false);
        }
    };

    // Generate email preview with redesigned template
    const getEmailPreviewHtml = () => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com';
        return `
            <style>
                .preview-content img { max-width: 100% !important; height: auto !important; border-radius: 8px; margin: 16px 0; display: block; }
                .preview-content h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 24px 0 16px; line-height: 1.3; }
                .preview-content h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin: 20px 0 12px; line-height: 1.3; }
                .preview-content h3 { font-size: 18px; font-weight: 600; color: #0f172a; margin: 16px 0 8px; line-height: 1.3; }
                .preview-content p { margin: 0 0 16px; }
                .preview-content ul, .preview-content ol { margin: 0 0 16px; padding-left: 24px; }
                .preview-content li { margin-bottom: 8px; }
                .preview-content a { color: #059669; text-decoration: underline; font-weight: 500; }
                .preview-content blockquote { border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; color: #64748b; font-style: italic; }
            </style>
            <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 40px 20px;">
                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <img src="${baseUrl}/logo-buyut.png" alt="Al-Bahjah Buyut" style="height: 52px; width: auto;" />
                </div>
                
                <!-- Main Card -->
                <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
                    <div style="padding: 48px 40px;">
                        <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.2;">${subject || 'Judul Newsletter'}</h1>
                        <div class="preview-content" style="font-size: 16px; color: #334155; line-height: 1.8;">
                            ${content || '<p style="color: #94a3b8; font-style: italic;">Mulai tulis konten newsletter Anda di sini...</p>'}
                        </div>
                    </div>

                    <div style="padding: 0 40px 48px;">
                        <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 32px;"></div>
                        <p style="margin: 0; font-size: 14px; color: #64748b; font-style: italic;">
                            Semoga warta ini bermanfaat untuk mempererat ukhuwah kita semua.
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 40px 20px; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #1e293b;">LPD Al-Bahjah Buyut</p>
                    <p style="margin: 0 0 24px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                        Jl. Revolusi No.45, Desa Buyut, Kecamatan Gunung Jati, Kabupaten Cirebon<br>
                        Indonesia
                    </p>
                    
                    <div style="margin-bottom: 24px;">
                        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; color: #059669; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 99px; border: 1px solid #d1fae5;">
                            Berhenti Berlangganan
                        </a>
                    </div>

                    <p style="margin: 0; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">
                        &copy; ${new Date().getFullYear()} AL-BAHJAH BUYUT. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        `;
    };

    return (
        <div>
            {/* Filters & Actions */}
            <div className="bg-white rounded-xl border p-4 mb-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-1 gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari email atau nama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSendModal(true)}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Kirim Newsletter
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Subscriber</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Sumber</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Tanggal Bergabung</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Mail className="w-8 h-8 text-gray-300" />
                                            <p>Tidak ada subscriber ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{sub.email}</p>
                                                <p className="text-sm text-gray-500">{sub.name || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {sub.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                    Tidak Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                {sub.source || 'Direct'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {new Date(sub.subscribedAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                disabled={deletingId === sub.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                title="Hapus Subscriber"
                                            >
                                                {deletingId === sub.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Send Newsletter Modal - Refined to Standard Admin */}
            {showSendModal && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Kirim Newsletter</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Akan dikirim ke <span className="font-semibold text-emerald-600">{activeSubscribers.length} subscriber</span> aktif
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showPreview
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {showPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    {showPreview ? 'Edit Konten' : 'Lihat Preview'}
                                </button>
                                <button
                                    onClick={() => setShowSendModal(false)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {showPreview ? (
                                /* Preview Mode */
                                <div className="flex justify-center py-4">
                                    <div className="w-full max-w-[650px]">
                                        <div
                                            className="bg-gray-100 rounded-[2rem] p-8 shadow-inner overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: getEmailPreviewHtml() }}
                                        />
                                        <p className="mt-4 text-center text-xs text-slate-400 font-medium">
                                            Ini adalah simulasi tampilan di perangkat penerima (Mobile & Desktop)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Edit Mode */
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-emerald-600" />
                                            Subject Pemberitahuan
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                placeholder="Gunakan kalimat yang menarik..."
                                                className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* AI Assistant Section */}
                                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-800">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">AI Newsletter Assistant</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="Tulis topik newsletter (misal: Keutamaan sedekah di hari Jumat)..."
                                                className="flex-1 px-4 py-2 bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all placeholder:text-slate-400"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !isGenerating) handleGenerateAI();
                                                }}
                                            />
                                            <button
                                                onClick={handleGenerateAI}
                                                disabled={isGenerating || !aiPrompt.trim()}
                                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-sm shadow-emerald-200"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        Generate Konten
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-emerald-600/80 italic font-medium">
                                            *AI akan men-generate draft konten islami yang profesional sesuai topik Anda.
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Edit3 className="w-4 h-4 text-emerald-600" />
                                            Isi Warta / Email
                                        </label>
                                        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white ring-1 ring-black/5">
                                            <TiptapEditor
                                                content={content}
                                                onChange={setContent}
                                                placeholder="Tuliskan pesan dakwah atau informasi terbaru di sini..."
                                                className="min-h-[450px]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-xs">
                                            <Sparkles className="w-4 h-4 flex-shrink-0" />
                                            <p className="font-medium">Warta yang menarik menggunakan kombinasi teks yang jelas, link rujukan, dan gambar yang berkualitas.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 ${message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'success' ? 'bg-emerald-200/50' : 'bg-red-200/50'}`}>
                                        {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    </div>
                                    <p className="font-medium text-sm">{message.text}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowSendModal(false);
                                    setShowPreview(false);
                                    setMessage(null);
                                }}
                                disabled={isSending}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSendNewsletter}
                                disabled={isSending || !subject.trim() || !content.trim()}
                                className="px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sedang Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Kirim Warta Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
