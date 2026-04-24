import { Suspense } from 'react';
import { Mail, Users, TrendingUp, UserMinus, Download, Trash2, Send, Sparkles, History } from 'lucide-react';
import { getNewsletterSubscribers, getNewsletterStats, getNewsletterHistory } from '@/actions/newsletter-actions';
import NewsletterActions from './newsletter-actions';

export const dynamic = 'force-dynamic';

export default async function NewsletterPage() {
    const [subscribers, stats, history] = await Promise.all([
        getNewsletterSubscribers(),
        getNewsletterStats(),
        getNewsletterHistory()
    ]);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Mail className="w-8 h-8 text-emerald-600" />
                    Newsletter
                </h1>
                <p className="text-gray-500 mt-1">
                    Kelola audiens dan kirim informasi terbaru ke subscriber Anda
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-5">
                    <p className="text-sm text-gray-500">Total Subscriber</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                    <p className="text-sm text-blue-700">Subscriber Aktif</p>
                    <p className="text-3xl font-bold text-blue-800">{stats.active}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                    <p className="text-sm text-red-700">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-800">{stats.inactive}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
                    <p className="text-sm text-emerald-700">Bulan Ini</p>
                    <p className="text-3xl font-bold text-emerald-800">{stats.thisMonth}</p>
                </div>
            </div>

            {/* Client Actions Component */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                            <p className="text-slate-400 font-medium">Memuat data subscriber...</p>
                        </div>
                    </div>
                }>
                    <NewsletterActions subscribers={subscribers} />
                </Suspense>
            </div>

            {/* Send History Section */}
            <div className="mt-8 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-900">Riwayat Pengiriman</h2>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="font-medium">Belum ada newsletter yang dikirim.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {history.map((item) => {
                            const historyItem = item as any;
                            const isAuto = historyItem.source === 'auto';
                            const status = historyItem.status || 'sent';
                            const hasYouTube = !!historyItem.youtubeVideoId;

                            return (
                            <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        {/* Source badge */}
                                        {isAuto ? (
                                            <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                                <Sparkles className="w-3 h-3" />
                                                Otomatis
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                                Manual
                                            </span>
                                        )}
                                        {/* Status badge */}
                                        {status === 'failed' && (
                                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">Gagal</span>
                                        )}
                                        {status === 'skipped' && (
                                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold">Dilewati</span>
                                        )}
                                        {/* YouTube badge */}
                                        {hasYouTube && (
                                            <a
                                                href={`https://youtube.com/watch?v=${historyItem.youtubeVideoId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold hover:bg-red-100 transition-colors"
                                            >
                                                ▶ YT Ref
                                            </a>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900 truncate">{item.subject}</p>
                                    {hasYouTube && historyItem.youtubeTitle && (
                                        <p className="text-xs text-gray-400 truncate mt-0.5">📺 {historyItem.youtubeTitle}</p>
                                    )}
                                    <p className="text-sm text-gray-500 truncate mt-1">{item.contentPreview}...</p>
                                    {historyItem.errorLog && (
                                        <p className="text-xs text-red-500 mt-1 truncate">⚠️ {historyItem.errorLog}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 shrink-0">
                                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                                        {item.recipientCount} penerima
                                    </span>
                                    <span>{new Date(item.sentAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Asia/Jakarta'
                                    })}</span>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
