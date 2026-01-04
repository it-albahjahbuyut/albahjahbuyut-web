import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@albahjahbuyut.com" },
        update: {},
        create: {
            email: "admin@albahjahbuyut.com",
            name: "Admin Al-Bahjah",
            password: hashedPassword,
            role: "SUPER_ADMIN",
        },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create units
    const units = [
        {
            name: "SMP Al-Bahjah",
            slug: "smp",
            description: "<p>SMP Al-Bahjah Buyut adalah jenjang pendidikan menengah pertama yang memadukan kurikulum nasional dengan pendidikan agama Islam yang komprehensif.</p>",
            curriculum: "<p>Kurikulum Merdeka dengan penguatan pendidikan agama Islam, tahfidz, dan bahasa Arab.</p>",
            facilities: "Ruang kelas ber-AC\nLaboratorium IPA\nPerpustakaan\nMasjid\nAsrama putra dan putri\nLapangan olahraga",
            registrationLink: "",
            order: 1,
        },
        {
            name: "SMA Al-Bahjah",
            slug: "sma",
            description: "<p>SMA Al-Bahjah Buyut menyiapkan santri untuk melanjutkan ke jenjang pendidikan tinggi dengan bekal ilmu agama dan umum yang seimbang.</p>",
            curriculum: "<p>Kurikulum Merdeka dengan peminatan IPA/IPS dan penguatan tahfidz Al-Quran.</p>",
            facilities: "Ruang kelas ber-AC\nLaboratorium IPA dan Komputer\nPerpustakaan\nMasjid\nAsrama putra dan putri\nLapangan olahraga",
            registrationLink: "",
            order: 2,
        },
        {
            name: "Tafaqquh Fiddin",
            slug: "tafaqquh",
            description: "<p>Program Tafaqquh Fiddin adalah program pendalaman ilmu agama Islam dengan fokus pada kitab-kitab kuning dan fiqih Islam.</p>",
            curriculum: "<p>Kajian kitab kuning meliputi: Fiqih, Nahwu, Shorof, Tauhid, Tasawuf, dan Hadits.</p>",
            facilities: "Ruang kajian\nPerpustakaan kitab\nMasjid\nAsrama",
            registrationLink: "",
            order: 3,
        },
        {
            name: "Tahfidz Al-Quran",
            slug: "tahfidz",
            description: "<p>Program Tahfidz Al-Quran mengkhususkan pada penghafalan Al-Quran 30 juz dengan metode yang sistematis dan mutqin.</p>",
            curriculum: "<p>Program hafalan 30 juz dengan target 2-3 tahun. Dilengkapi dengan kajian tajwid dan tahsin.</p>",
            facilities: "Ruang tahfidz khusus\nMushaf wakaf\nMasjid\nAsrama",
            registrationLink: "",
            order: 4,
        },
    ];

    for (const unit of units) {
        const created = await prisma.unit.upsert({
            where: { slug: unit.slug },
            update: unit,
            create: unit,
        });
        console.log("✅ Created unit:", created.name);
    }

    // Create sample donation program
    const donation = await prisma.donationProgram.upsert({
        where: { slug: "infaq-pembangunan-masjid" },
        update: {},
        create: {
            title: "Infaq Pembangunan Masjid",
            slug: "infaq-pembangunan-masjid",
            description: "Program infaq untuk pembangunan dan renovasi masjid pesantren sebagai pusat ibadah dan kegiatan santri.",
            targetAmount: 500000000,
            currentAmount: 125000000,
            bankName: "Bank Syariah Indonesia",
            accountNumber: "1234567890",
            accountName: "Yayasan Al-Bahjah Buyut",
            isActive: true,
        },
    });
    console.log("✅ Created donation program:", donation.title);

    // Create sample settings
    const settings = [
        { key: "site_name", value: "Pondok Pesantren Al-Bahjah Buyut" },
        { key: "site_description", value: "Portal resmi Pondok Pesantren Al-Bahjah Buyut" },
        { key: "contact_email", value: "info@albahjahbuyut.com" },
        { key: "contact_phone", value: "+62 123 456 7890" },
        { key: "address", value: "Jl. Pesantren No. 1, Cirebon, Jawa Barat" },
    ];

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: setting,
        });
    }
    console.log("✅ Created settings");

    // Create sample posts
    const posts = [
        {
            title: "Penerimaan Santri Baru Tahun Ajaran 2026/2027 Telah Dibuka",
            slug: "penerimaan-santri-baru-2026",
            excerpt: "Pondok Pesantren Al-Bahjah Buyut kembali membuka pendaftaran santri baru untuk jenjang SMP, SMA, dan Tahfidz. Segera daftarkan putra-putri Anda.",
            content: "<p>Assalamu'alaikum Warahmatullahi Wabarakatuh...</p><p>Pondok Pesantren Al-Bahjah Buyut dengan bangga mengumumkan pembukaan pendaftaran santri baru...</p>",
            image: "https://images.unsplash.com/photo-1510590337019-5ef2d3977e2e?q=80&w=2070&auto=format&fit=crop",
            category: "PENGUMUMAN",
            status: "PUBLISHED",
            publishedAt: new Date(),
        },
        {
            title: "Kajian Bulanan Bersama Buya Yahya",
            slug: "kajian-bulanan-buya-yahya-januari-2026",
            excerpt: "Ikuti kajian rutin bulanan bersama Buya Yahya di Masjid Al-Bahjah Buyut. Terbuka untuk umum.",
            content: "<p>Mari hadiri kajian rutin bulanan...</p>",
            image: "https://images.unsplash.com/photo-1606233400587-c1dcb8dc2286?q=80&w=2070&auto=format&fit=crop",
            category: "KEGIATAN",
            status: "PUBLISHED",
            publishedAt: new Date(),
        },
        {
            title: "Prestasi Santri: Juara 1 Lomba Tahfidz Tingkat Kabupaten",
            slug: "prestasi-santri-tahfidz-2026",
            excerpt: "Alhamdulillah, ananda Fulan bin Fulan berhasil meraih juara 1 dalam Musabaqah Hifdzil Quran tingkat Kabupaten Cirebon.",
            content: "<p>Kabar gembira datang dari santri Al-Bahjah Buyut...</p>",
            image: "https://images.unsplash.com/photo-1629814407873-670dc402d20e?q=80&w=2070&auto=format&fit=crop",
            category: "PRESTASI",
            status: "PUBLISHED",
            publishedAt: new Date(),
        }
    ];

    for (const post of posts) {
        // @ts-ignore
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post
        });
    }
    console.log("✅ Created sample posts");

    // Create sample galleries
    const galleries = [
        {
            title: "Kegiatan Belajar Mengajar",
            imageUrl: "https://images.unsplash.com/photo-1427504746074-9471b90d4c84?q=80&w=2070&auto=format&fit=crop",
            description: "Suasana belajar santri di kelas yang kondusif.",
            order: 1,
        },
        {
            title: "Sholat Berjamaah",
            imageUrl: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop",
            description: "Kegiatan sholat berjamaah di masjid pesantren.",
            order: 2,
        },
        {
            title: "Ekstrakurikuler Memanah",
            imageUrl: "https://images.unsplash.com/photo-1511267503926-d62153eb3c48?q=80&w=2070&auto=format&fit=crop",
            description: "Santri sedang berlatih memanah sebagai sunnah Rasulullah.",
            order: 3,
        },
        {
            title: "Wisuda Tahfidz",
            imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
            description: "Momen haru wisuda tahfidz 30 juz.",
            order: 4,
        },
        {
            title: "Gotong Royong",
            imageUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop",
            description: "Kegiatan kebersihan lingkungan pesantren.",
            order: 5,
        },
        {
            title: "Makan Bersama",
            imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
            description: "Kebersamaan santri saat makan bersama.",
            order: 6,
        }
    ];

    for (const gallery of galleries) {
        await prisma.gallery.create({
            data: {
                ...gallery,
                isActive: true
            }
        });
    }
    console.log("✅ Created sample galleries");

    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
