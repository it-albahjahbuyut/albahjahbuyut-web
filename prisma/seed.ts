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
