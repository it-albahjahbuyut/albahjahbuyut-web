import { db } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { ProfileSection } from "@/components/home/ProfileSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { DonationSection } from "@/components/home/DonationSection";
import { MajelisSection } from "@/components/home/MajelisSection";

export default async function HomePage() {
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

  return (
    <div className="flex min-h-screen flex-col font-sans text-slate-900 bg-white">
      <Navbar units={navUnits} />

      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Profile / Sambutan Section */}
        <ProfileSection />

        {/* 3. Program Pendidikan */}
        <ProgramsSection units={units} />

        {/* 4. Majelis Rutin */}
        <MajelisSection />

        {/* 5. News Section */}
        <NewsSection posts={latestNews} />

        {/* 6. Why Choose Us / Features */}
        <FeaturesSection />

        {/* 7. Donation Section */}
        <DonationSection program={featuredDonation} />
      </main>

      <Footer />
    </div>
  );
}
