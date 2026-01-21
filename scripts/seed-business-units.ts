import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const businessUnits = [
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
    logo: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80",
    isActive: true,
    order: 1,
    gallery: [
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
      "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800&q=80",
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80",
    isActive: true,
    order: 2,
    gallery: [
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    ],
  },
  {
    name: "Praktik Bersama",
    slug: "praktik-bersama",
    description: `Praktik Bersama adalah klinik kesehatan yang dikelola oleh Pondok Pesantren Al-Bahjah Buyut. Kami menyediakan layanan kesehatan umum dan pengobatan untuk santri, warga pesantren, serta masyarakat sekitar.

Didukung oleh tenaga medis profesional yang berpengalaman, Praktik Bersama berkomitmen memberikan pelayanan kesehatan yang berkualitas dengan harga terjangkau.

Selain pengobatan konvensional, kami juga menyediakan layanan pengobatan herbal dan thibbun nabawi sesuai dengan tuntunan Rasulullah SAW.`,
    services: "Pemeriksaan Umum\nKonsultasi Dokter\nPengobatan Herbal\nThibbun Nabawi\nBekam / Hijamah\nRuqyah Syar'iyyah\nImunisasi & Vaksinasi",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-456789",
    whatsapp: "6281234567893",
    email: "klinik@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "  ",
    logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    isActive: true,
    order: 4,
    gallery: [
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    ],
  },
  {
    name: "AB Cafe",
    slug: "ab-cafe",
    description: `AB Cafe adalah tempat bersantai dan berkumpul yang nyaman di lingkungan Pondok Pesantren Al-Bahjah Buyut. Kami menyajikan berbagai menu makanan dan minuman halal dengan suasana yang Islami dan family-friendly.

Dengan konsep modern namun tetap bernuansa pesantren, AB Cafe menjadi tempat favorit bagi santri, wali santri, dan tamu untuk bersantai sambil menikmati hidangan lezat.

Menu kami terdiri dari berbagai pilihan makanan ringan, makanan berat, serta aneka minuman segar yang cocok untuk menemani kebersamaan keluarga.`,
    services: "Aneka Makanan Ringan\nMakanan Berat\nMinuman Segar\nKopi & Teh\nCatering Acara\nRuang Meeting\nWifi Gratis",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-567890",
    whatsapp: "6281234567894",
    email: "cafe@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
    isActive: true,
    order: 5,
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80",
    ],
  },
  {
    name: "AB Ice Cream",
    slug: "ab-ice-cream",
    description: `AB Ice Cream adalah unit usaha yang menyediakan berbagai varian es krim homemade dengan bahan-bahan berkualitas dan halal. Kami menghadirkan kelezatan es krim dengan berbagai rasa yang disukai semua kalangan.

Es krim kami dibuat dengan resep khusus menggunakan bahan-bahan pilihan tanpa bahan pengawet berbahaya. Setiap sendok es krim AB memberikan kesegaran dan kelezatan yang tiada tara.

Cocok untuk dinikmati bersama keluarga atau sebagai oleh-oleh khas dari Pondok Pesantren Al-Bahjah Buyut.`,
    services: "Es Krim Homemade\nAneka Rasa Premium\nEs Krim Cone\nEs Krim Cup\nEs Krim Liter\nPaket Acara & Pesta\nDelivery Order",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-678901",
    whatsapp: "6281234567895",
    email: "icecream@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&q=80",
    isActive: true,
    order: 6,
    gallery: [
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80",
      "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=800&q=80",
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&q=80",
    ],
  },
  {
    name: "AB Magha",
    slug: "ab-magha",
    description: `AB Magha adalah unit usaha yang bergerak di bidang kuliner khas dengan menu andalan berupa masakan tradisional dan modern. Kami menyajikan hidangan lezat dengan cita rasa autentik yang menggugah selera.

Dengan bahan-bahan segar dan bumbu pilihan, setiap hidangan di AB Magha diolah dengan penuh ketelitian untuk menghasilkan kelezatan yang konsisten.

AB Magha juga melayani pesanan untuk acara-acara besar seperti walimahan, aqiqah, dan event pesantren lainnya.`,
    services: "Masakan Tradisional\nMenu Modern\nCatering Walimahan\nCatering Aqiqah\nCatering Event\nNasi Box\nPrasmanan",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-789012",
    whatsapp: "6281234567896",
    email: "magha@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    isActive: true,
    order: 7,
    gallery: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    ],
  },
  {
    name: "AB Delivery",
    slug: "ab-delivery",
    description: `AB Delivery adalah layanan pengiriman dan kurir yang dikelola oleh Pondok Pesantren Al-Bahjah Buyut. Kami menyediakan jasa pengiriman barang dan dokumen dengan cepat, aman, dan amanah.

Layanan ini hadir untuk memudahkan santri, wali santri, dan masyarakat dalam mengirim dan menerima paket. Dengan armada yang memadai dan kurir yang terpercaya, AB Delivery siap melayani kebutuhan pengiriman Anda.

Kami juga melayani pengiriman makanan dari unit-unit usaha Al-Bahjah Buyut ke berbagai lokasi di sekitar Cirebon.`,
    services: "Pengiriman Paket\nPengiriman Dokumen\nDelivery Makanan\nJemput Paket\nKurir Instan\nCargo Pesantren\nAntar Jemput Bandara",
    address: "Komplek Pondok Pesantren Al-Bahjah Buyut, Cirebon, Jawa Barat 45153",
    phone: "0231-890123",
    whatsapp: "6281234567897",
    email: "delivery@albahjahbuyut.id",
    website: null,
    mapUrl: "https://maps.google.com/?q=-6.7324,108.5523",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400&q=80",
    isActive: true,
    order: 8,
    gallery: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
      "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&q=80",
      "https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?w=800&q=80",
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
