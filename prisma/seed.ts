import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient, PostCategory, PostStatus, UserRole } from "@prisma/client";
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
            role: UserRole.SUPER_ADMIN,
        },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create units
    const units = [
        {
            name: "SDIQu Al-Bahjah",
            slug: "sdiqu",
            description: "<p>SDIQu Al-Bahjah Buyut adalah jenjang pendidikan dasar yang memadukan kurikulum nasional dengan pendidikan agama Islam sejak dini.</p>",
            curriculum: "<p>Kurikulum Merdeka dengan penguatan baca tulis Al-Quran dan akhlak mulia.</p>",
            facilities: "Ruang kelas ber-AC\nArea bermain\nPerpustakaan\nMasjid",
            registrationLink: "",
            order: 0,
        },
        {
            name: "SMPIQu Al-Bahjah",
            slug: "smpiqu",
            description: "<p>SMPIQu Al-Bahjah Buyut adalah jenjang pendidikan menengah pertama yang memadukan kurikulum nasional dengan pendidikan agama Islam yang komprehensif.</p>",
            curriculum: "<p>Kurikulum Merdeka dengan penguatan pendidikan agama Islam, tahfidz, dan bahasa Arab.</p>",
            facilities: "Ruang kelas ber-AC\nLaboratorium IPA\nPerpustakaan\nMasjid\nAsrama putra dan putri\nLapangan olahraga",
            registrationLink: "",
            order: 1,
        },
        {
            name: "SMAIQu Al-Bahjah",
            slug: "smaiqu",
            description: "<p>SMAIQu Al-Bahjah Buyut menyiapkan santri untuk melanjutkan ke jenjang pendidikan tinggi dengan bekal ilmu agama dan umum yang seimbang.</p>",
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
        {
            name: "PAUDQu Al-Bahjah",
            slug: "paudqu",
            description: "<p>PAUDQu Al-Bahjah Buyut adalah jenjang pendidikan anak usia dini yang berfokus pada pembentukan karakter Qur'ani sejak dini.</p>",
            curriculum: "<p>Kurikulum bermain sambil belajar dengan pengenalan huruf hijaiyah, hafalan surat pendek, dan adab Islami.</p>",
            facilities: "Ruang kelas bermain\nArea bermain outdoor yang aman\nMedia pembelajaran interaktif",
            registrationLink: "",
            order: 5,
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

    console.log("✅ Created/Updated units");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
