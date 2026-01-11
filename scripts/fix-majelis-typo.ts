import { db } from "../src/lib/db";

async function fixMajelisTypo() {
    console.log("🔧 Fixing Majelis Typo...");

    try {
        const result = await db.majelis.updateMany({
            where: {
                title: {
                    contains: "Malejis"
                }
            },
            data: {
                title: "Majelis Keliling",
                subtitle: "Majelis Keliling di Cirebon"
            }
        });

        console.log(`✅ Fixed ${result.count} records.`);
    } catch (error) {
        console.error("Error fixing typo:", error);
    }
}

fixMajelisTypo()
    .finally(() => db.$disconnect());
