/**
 * YouTube Data API v3 Helper
 * Fetch latest videos from Buya Yahya & Al-Bahjah TV channels
 */

export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    channelTitle: string;
    videoUrl: string;
}

// Tiga channel resmi Al-Bahjah:
// 1. Buya Yahya Official
// 2. Al-Bahjah TV
// 3. ASAH TV (Abah Sayf Abu Hanifah - juga dari Al-Bahjah)
const YOUTUBE_CHANNELS = [
    {
        id: 'UCmP5IibF7u8i9Y7slriwz5g', // Buya Yahya Official
        name: 'Buya Yahya'
    },
    {
        id: 'UC50vyjmknAf3nMvOr37gm1Q', // Al-Bahjah TV
        name: 'Al-Bahjah TV'
    },
    {
        id: 'UC8sByvdOwl_YOXd90XHrVCA', // ASAH TV (Abah Sayf Abu Hanifah)
        name: 'ASAH TV - Abah Sayf'
    }
];

/**
 * Fetch latest videos from a YouTube channel (last N days)
 */
async function fetchChannelVideos(
    channelId: string,
    channelName: string,
    apiKey: string,
    maxResults = 3,
    daysBack = 14
): Promise<YouTubeVideo[]> {
    const publishedAfter = new Date();
    publishedAfter.setDate(publishedAfter.getDate() - daysBack);
    const publishedAfterISO = publishedAfter.toISOString();

    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('maxResults', String(maxResults));
    searchUrl.searchParams.set('publishedAfter', publishedAfterISO);
    searchUrl.searchParams.set('key', apiKey);

    const response = await fetch(searchUrl.toString(), {
        next: { revalidate: 0 }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`YouTube API error for channel ${channelName}:`, errorText);
        return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return [];
    }

    return data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description?.substring(0, 500) || '',
        thumbnailUrl: item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url ||
            item.snippet.thumbnails?.default?.url || '',
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle || channelName,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
}

/**
 * Get latest videos from both Buya Yahya & Al-Bahjah TV channels
 * Returns up to 5 videos combined (prioritizing most recent)
 */
export async function getLatestIslamicVideos(daysBack = 14): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not set');
        return [];
    }

    try {
        // Fetch from both channels in parallel
        const results = await Promise.allSettled(
            YOUTUBE_CHANNELS.map(channel =>
                fetchChannelVideos(channel.id, channel.name, apiKey, 3, daysBack)
            )
        );

        const allVideos: YouTubeVideo[] = [];

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                allVideos.push(...result.value);
                console.log(`✅ Fetched ${result.value.length} videos from ${YOUTUBE_CHANNELS[index].name}`);
            } else {
                console.error(`❌ Failed to fetch from ${YOUTUBE_CHANNELS[index].name}:`, result.reason);
            }
        });

        // Sort by publishedAt (newest first)
        allVideos.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Return top 5
        return allVideos.slice(0, 5);
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

/**
 * Get a fallback topic when no recent videos are found
 */
export function getIslamicFallbackTopic(): string {
    const topics = [
        'Keutamaan membaca Al-Quran setiap hari dan manfaat spiritual yang didapat',
        'Pentingnya shalat tepat waktu dan cara meningkatkan kekhusyukan dalam shalat',
        'Adab dan tata cara berdzikir yang benar menurut sunnah Nabi SAW',
        'Keutamaan sedekah dan infaq di jalan Allah serta balasan yang Allah janjikan',
        'Cara menjaga hati dari sifat hasad, sombong, dan riya dalam kehidupan sehari-hari',
        'Pentingnya silaturahmi dan menjaga hubungan baik dengan keluarga dan tetangga',
        'Keutamaan bulan-bulan mulia dalam Islam dan amalan yang dianjurkan',
        'Cara mendidik anak dengan akhlak Islami di era digital yang penuh tantangan',
        'Keutamaan ilmu agama dan pentingnya menuntut ilmu sepanjang hayat',
        'Muhasabah diri: cara mengevaluasi amal ibadah kita setiap minggu',
    ];

    // Rotate based on current week number so it changes weekly
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return topics[weekNumber % topics.length];
}
