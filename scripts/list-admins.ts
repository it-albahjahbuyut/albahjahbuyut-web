
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function listAdmins() {
    try {
        const admins = await db.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPER_ADMIN']
                }
            },
            select: {
                email: true,
                name: true,
                role: true
            }
        });

        console.log('📋 Daftar Admin:');
        console.log('-----------------------------------');
        if (admins.length === 0) {
            console.log('Belum ada admin terdaftar.');
        } else {
            console.table(admins);
        }
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Error fetching admins:', error);
    } finally {
        await db.$disconnect();
    }
}

listAdmins();
