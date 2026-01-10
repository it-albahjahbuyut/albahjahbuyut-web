import { NextResponse } from "next/server";

// YouTube Channel ID for ASAH TV (@asahtvofficial)
// You need to replace this with the actual channel ID
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCxxxxxxxxxxxxxxxx";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface YouTubeLiveResponse {
    isLive: boolean;
    title?: string;
    videoId?: string;
    thumbnail?: string;
    channelTitle?: string;
    viewerCount?: string;
}

export async function GET(): Promise<NextResponse<YouTubeLiveResponse>> {
    // If no API key configured, return not live
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API Key not configured");
        return NextResponse.json({ isLive: false });
    }

    try {
        // Search for live videos from the channel
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(searchUrl, {
            next: { revalidate: 1800 }, // Cache for 30 minutes (hemat quota API)
        });

        if (!response.ok) {
            console.error("YouTube API error:", response.status, await response.text());
            return NextResponse.json({ isLive: false });
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const liveVideo = data.items[0];
            const videoId = liveVideo.id.videoId;

            // Get live streaming details (viewer count)
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            let viewerCount = "";
            if (detailsData.items && detailsData.items.length > 0) {
                viewerCount = detailsData.items[0].liveStreamingDetails?.concurrentViewers || "";
            }

            return NextResponse.json({
                isLive: true,
                title: liveVideo.snippet.title,
                videoId: videoId,
                thumbnail: liveVideo.snippet.thumbnails?.high?.url || liveVideo.snippet.thumbnails?.medium?.url,
                channelTitle: liveVideo.snippet.channelTitle,
                viewerCount: viewerCount,
            });
        }

        return NextResponse.json({ isLive: false });
    } catch (error) {
        console.error("Error checking YouTube live status:", error);
        return NextResponse.json({ isLive: false });
    }
}
