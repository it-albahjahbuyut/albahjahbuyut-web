import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🗑️ Deleting 'AB Travel dan Umroh Buyut' duplicate...\n");

    // First delete related gallery images
    const businessUnit = await prisma.businessUnit.findUnique({
        where: { slug: "ab-travel-umroh" },
    });

    if (businessUnit) {
        await prisma.businessUnitImage.deleteMany({
            where: { businessUnitId: businessUnit.id },
        });

        await prisma.businessUnit.delete({
            where: { slug: "ab-travel-umroh" },
        });

        console.log("✅ 'AB Travel dan Umroh Buyut' deleted successfully!");
    } else {
        console.log("⚠️ 'AB Travel dan Umroh Buyut' not found in database.");
    }

    // Show remaining business units
    const units = await prisma.businessUnit.findMany({
        orderBy: { order: "asc" },
        select: { name: true, slug: true, order: true },
    });

    console.log("\n📋 Current Business Units:");
    units.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.name} (${u.slug})`);
    });
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
