import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const businessUnits = [
  {
    name: "AB Travel",
    slug: "ab-travel",
    description: `AB Travel adalah unit usaha Pondok Pesantren Al-Bahjah Buyut yang bergerak di bidang jasa perjalanan wisata dan umrah. Kami menyediakan layanan perjalanan yang nyaman, aman, dan terpercaya dengan harga yang bersaing.

Didirikan untuk memberikan kemudahan bagi jamaah dan masyarakat umum dalam melakukan perjalanan ibadah maupun wisata religi. AB Travel berkomitmen memberikan pelayanan terbaik dengan bimbingan ustadz yang berpengalaman.

Dengan pengalaman bertahun-tahun melayani jamaah, kami memastikan setiap perjalanan menjadi pengalaman spiritual yang berkesan dan penuh keberkahan.`,
    services: "Paket Umrah Regular & VIP\nPaket Haji Plus\nWisata Religi Dalam Negeri\nZiarah Wali Songo\nTour Muslim Luar Negeri\nTiket Pesawat & Hotel\nVisa & Dokumen Perjalanan",
    address: "Jl. Raya Cirebon - Bandung KM 12, Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-123456",
    whatsapp: "6281234567890",
    email: "travel@albahjahbuyut.id",
    website: "https://travel.albahjahbuyut.id",
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80",
    isActive: true,
    order: 1,
    gallery: [
      "https://images.unsplash.com/photo-1564769625673-cb1ffb5e1d22?w=800&q=80",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
      "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
  },
  {
    name: "AB Mart",
    slug: "ab-mart",
    description: `AB Mart adalah minimarket modern yang dikelola oleh Pondok Pesantren Al-Bahjah Buyut. Kami menyediakan berbagai kebutuhan sehari-hari dengan konsep berbelanja yang halal, berkah, dan nyaman.

Seluruh produk yang dijual telah melalui seleksi ketat untuk memastikan kehalalannya. AB Mart juga menyediakan produk-produk khas pesantren seperti madu, habatussauda, kurma, dan berbagai oleh-oleh khas Cirebon.

Keuntungan dari AB Mart digunakan untuk mendukung operasional pesantren dan program-program sosial kemasyarakatan.`,
    services: "Kebutuhan Sehari-hari\nProduk Halal Terjamin\nMakanan & Minuman\nProduk Herbal & Kesehatan\nPerlengkapan Ibadah\nOleh-oleh Khas Cirebon\nProduk Santri & Pesantren",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-234567",
    whatsapp: "6281234567891",
    email: "mart@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&q=80",
    isActive: true,
    order: 2,
    gallery: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80",
      "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&q=80",
    ],
  },
  {
    name: "AB Fashion",
    slug: "ab-fashion",
    description: `AB Fashion adalah unit usaha Pondok Pesantren Al-Bahjah Buyut yang menyediakan busana muslim berkualitas dengan desain modern namun tetap syar'i. Kami menghadirkan koleksi pakaian untuk seluruh anggota keluarga.

Produk kami diproduksi dengan bahan berkualitas tinggi dan jahitan rapi. AB Fashion juga menerima pesanan seragam untuk pondok pesantren, majelis taklim, dan instansi lainnya.

Berbelanja di AB Fashion berarti turut berkontribusi dalam pengembangan pendidikan di Pondok Pesantren Al-Bahjah Buyut.`,
    services: "Gamis Pria & Wanita\nBusana Muslim Anak\nHijab & Kerudung\nKoko & Sarung\nSeragam Pesantren\nPeci & Aksesoris\nPesanan Custom & Konveksi",
    address: "Jl. Raya Cirebon - Bandung KM 12, Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-345678",
    whatsapp: "6281234567892",
    email: "fashion@albahjahbuyut.id",
    website: "https://fashion.albahjahbuyut.id",
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
    isActive: true,
    order: 3,
    gallery: [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
    ],
  },
];

async function main() {
  console.log("🏪 Seeding business units...\n");

  for (const unit of businessUnits) {
    const { gallery, ...unitData } = unit;

    // Upsert business unit
    const businessUnit = await prisma.businessUnit.upsert({
      where: { slug: unit.slug },
      update: unitData,
      create: unitData,
    });

    console.log(`✅ ${businessUnit.name} - ${businessUnit.isActive ? "Active" : "Inactive"}`);

    // Delete existing gallery images
    await prisma.businessUnitImage.deleteMany({
      where: { businessUnitId: businessUnit.id },
    });

    // Create gallery images
    if (gallery && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        await prisma.businessUnitImage.create({
          data: {
            businessUnitId: businessUnit.id,
            imageUrl: gallery[i],
            caption: `${businessUnit.name} - Galeri ${i + 1}`,
            order: i + 1,
          },
        });
      }
      console.log(`   📸 ${gallery.length} gallery images added`);
    }
  }

  console.log("\n🎉 Business units seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding business units:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
