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

// Revalidate every 60 seconds to reduce database load
export const revalidate = 60;

async function getHomePageData() {
  try {
    const [units, featuredDonation, latestNews, navUnits] = await Promise.all([
      db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.donationProgram.findFirst({
        where: { isActive: true },
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: "desc" }
        ],
      }),
      db.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 3,
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
  // Check maintenance mode first
  let isMaintenanceMode = false;

  try {
    const maintenanceSetting = await db.siteSetting.findUnique({
      where: { key: "maintenance_mode" },
    });

    if (maintenanceSetting) {
      const value = JSON.parse(maintenanceSetting.value);
      isMaintenanceMode = value.enabled === true;
    }
  } catch (error) {
    console.error("Failed to check maintenance mode:", error);
  }

  // Redirect after try-catch to avoid catching NEXT_REDIRECT
  if (isMaintenanceMode) {
    redirect("/maintenance");
  }

  const { units, featuredDonation, latestNews, navUnits } = await getHomePageData();

  // Video Data for Hero Section (moved from HeroSection.tsx)
  const heroVideos = [
    {
      src: "https://res.cloudinary.com/dand8rpbb/video/upload/q_auto/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.mp4",
      poster: "https://res.cloudinary.com/dand8rpbb/video/upload/so_0,q_auto,f_auto/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.jpg"
    },
    {
      src: "https://res.cloudinary.com/dand8rpbb/video/upload/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.mp4",
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
      </main>

      <Footer />
    </div>
  );
}
