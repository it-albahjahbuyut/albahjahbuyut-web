import Link from "next/link";
import Image from "next/image";
import { PlayCircle, ExternalLink, Youtube } from "lucide-react";

async function getLatestVideos() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) return [];

    try {
        // Fetch latest 3 videos using Search API sorted by date
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3&type=video`,
            { next: { revalidate: 86400 } }
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
        return [];
    }
}

export async function LatestVideosSection() {
    const videos = await getLatestVideos();

    if (videos.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                            <span className="text-red-600 font-bold tracking-wider text-xs uppercase">
                                Kanal Youtube
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Kajian & Dokumentasi <span className="text-red-600">Terbaru</span>
                        </h2>
                        <p className="text-slate-600 text-lg font-light leading-relaxed">
                            Simak tayangan kajian, dokumentasi kegiatan, dan informasi terbaru dari channel resmi kami.
                        </p>
                    </div>

                    <Link
                        href={`https://www.youtube.com/channel/${process.env.YOUTUBE_CHANNEL_ID}`}
                        target="_blank"
                        className="group flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-semibold shadow-sm border border-slate-200 hover:border-red-200 hover:text-red-600 transition-all self-start md:self-end"
                    >
                        <Youtube className="w-5 h-5 text-red-600" />
                        Lihat Channel
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video: any) => (
                        <Link
                            key={video.id.videoId}
                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                            target="_blank"
                            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Thumbnail Container */}
                            <div className="relative aspect-video overflow-hidden bg-slate-200">
                                <Image
                                    src={video.snippet.thumbnails.high.url}
                                    alt={video.snippet.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg top-1/2 left-1/2">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">Video</span>
                                    <span>
                                        {new Date(video.snippet.publishedAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                                    {video.snippet.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                    {video.snippet.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
