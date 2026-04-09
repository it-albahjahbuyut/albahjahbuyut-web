import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { ProfileSection } from "@/components/home/ProfileSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { DonationSection } from "@/components/home/DonationSection";
import { MajelisSection } from "@/components/home/MajelisSection";
import { YouTubeLiveSection } from "@/components/home/YouTubeLiveSection";
import { LatestVideosSection } from "@/components/home/LatestVideosSection";
import NewsletterSection from "@/components/home/NewsletterSection";

// Enable caching with 60 second revalidation for better performance
export const revalidate = 60;

async function getHomePageData() {
  try {
    const [units, featuredDonation, latestNews, navUnits] = await Promise.all([
      db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        // Only select fields used in ProgramsSection — exclude heavy text fields
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
        },
      }),
      db.donationProgram.findFirst({
        where: { isActive: true },
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: "desc" }
        ],
        // Only select fields used in DonationSection
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
          targetAmount: true,
          currentAmount: true,
          hideProgress: true,
        },
      }),
      db.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
        // Exclude the large `content` field (Tiptap HTML) — not used in NewsSection
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
          image: true,
          excerpt: true,
        },
      }),
      db.unit.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { order: "asc" },
      })
    ]);
    return { units, featuredDonation, latestNews, navUnits };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return { units: [], featuredDonation: null, latestNews: [], navUnits: [] };
  }
}

export default async function HomePage() {
  // Parallelize maintenance check with homepage data fetch to save one DB round-trip
  let isMaintenanceMode = false;
  const isDevelopment = process.env.NODE_ENV === 'development';

  const [maintenanceResult, homeData] = await Promise.all([
    // Maintenance check (skipped in dev)
    isDevelopment
      ? Promise.resolve(null)
      : db.siteSetting.findUnique({ where: { key: "maintenance_mode" } }).catch(() => null),
    // Homepage data (always fetched)
    getHomePageData(),
  ]);

  if (!isDevelopment && maintenanceResult) {
    try {
      const value = JSON.parse(maintenanceResult.value);
      isMaintenanceMode = value.enabled === true;
    } catch {
      // ignore parse error
    }
  }

  // Redirect after async work to avoid catching NEXT_REDIRECT
  if (isMaintenanceMode) {
    redirect("/maintenance");
  }

  const { units, featuredDonation, latestNews, navUnits } = homeData;

  // Video Data for Hero Section
  // Desktop: kualitas penuh (f_auto,q_auto)
  // Mobile:  versi ringan — lebar max 640px, quality eco, bitrate max 500kbps
  //          Cloudinary transcode otomatis — estimasi ukuran ~2–3MB (dari ~15MB)
  const heroVideos = [
    {
      src: "https://res.cloudinary.com/dand8rpbb/video/upload/f_auto,q_auto/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.mp4",
      mobileSrc: "https://res.cloudinary.com/dand8rpbb/video/upload/f_auto,q_auto:eco,w_640,br_500k/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.mp4",
      poster: "https://res.cloudinary.com/dand8rpbb/video/upload/so_0,q_auto,f_auto/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.jpg"
    },
    {
      src: "https://res.cloudinary.com/dand8rpbb/video/upload/f_auto,q_auto/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.mp4",
      mobileSrc: "https://res.cloudinary.com/dand8rpbb/video/upload/f_auto,q_auto:eco,w_640,br_500k/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.mp4",
      poster: "https://res.cloudinary.com/dand8rpbb/video/upload/so_0,q_auto,f_auto/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.jpg"
    }
  ];

  // Select random video on server render
  const selectedVideo = heroVideos[Math.floor(Math.random() * heroVideos.length)];

  return (
    <div className="flex min-h-screen flex-col font-sans text-slate-900 bg-white">
      <Navbar units={navUnits} />

      <main>
        {/* 1. Hero Section */}
        <HeroSection
          videoSrc={selectedVideo.src}
          mobileVideoSrc={selectedVideo.mobileSrc}
          posterSrc={selectedVideo.poster}
        />

        {/* 2. YouTube Live Stream (appears when channel is live) */}
        <YouTubeLiveSection />

        {/* 3. Profile / Sambutan Section */}
        <ProfileSection />

        {/* 4. Program Pendidikan */}
        <ProgramsSection units={units} />

        {/* 5. Majelis Rutin */}
        <MajelisSection />

        {/* 6. News Section */}
        <NewsSection posts={latestNews} />

        {/* 7. Why Choose Us / Features */}
        <FeaturesSection />

        {/* 8. Latest Videos */}
        <LatestVideosSection />

        {/* 9. Donation Section */}
        <DonationSection program={featuredDonation} />

        {/* 10. Newsletter Section */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
