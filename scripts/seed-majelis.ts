import { db } from "../src/lib/db";

async function seedMajelis() {
    console.log("🌱 Seeding Majelis data...");

    const majelisData = [
        {
            title: "Kajian Akhlak",
            subtitle: "Kajian Kitab Akhlaqul Banin",
            schedule: "Rabu Pagi",
            time: "05.30 WIB - Selesai",
            location: "LPD Al Bahjah Buyut",
            order: 1,
            isActive: true,
        },
        {
            title: "Kajian Kitab Al-Hikam",
            subtitle: "Kitab Al-Hikam",
            schedule: "Setiap Ahad Sore",
            time: "16.00 WIB - Selesai",
            location: "LPD Al-Bahjah Buyut",
            order: 2,
            isActive: true,
        },
        {
            title: "Rotib Al-Haddad",
            subtitle: "Pembacaan Rotib & Maulid",
            schedule: "Kamis Malam Jumat",
            time: "17.00 WIB (Ba'da Maghrib)",
            location: "Masjid Al-Bahjah Buyut",
            order: 3,
            isActive: true,
        },
    ];

    // Check if majelis already exists
    const existingCount = await db.majelis.count();

    if (existingCount > 0) {
        console.log(`✅ Majelis data already exists (${existingCount} entries). Skipping seed.`);
        return;
    }

    // Create majelis entries
    for (const majelis of majelisData) {
        await db.majelis.create({
            data: majelis,
        });
        console.log(`  ✓ Created: ${majelis.title}`);
    }

    console.log("✅ Majelis seeding completed!");
}

seedMajelis()
    .catch((e) => {
        console.error("❌ Error seeding majelis:", e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
