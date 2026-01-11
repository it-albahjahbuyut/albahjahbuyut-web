
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function resetPassword() {
    // Ambil arguments dari command line
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
        console.error('❌ Usage: npx tsx scripts/reset-password.ts <email> <new_password>');
        process.exit(1);
    }

    try {
        console.log(`🔍 Mencari user dengan email: ${email}...`);

        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('❌ User tidak ditemukan!');
            process.exit(1);
        }

        console.log(`found user: ${user.name} (${user.role})`);
        console.log('🔒 Hashing password baru...');

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.user.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });

        console.log('✅ Password berhasil diupdate!');
        console.log('-----------------------------------');
        console.log(`Email: ${email}`);
        console.log(`New Password: ${newPassword}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Terjadi kesalahan:', error);
    } finally {
        await db.$disconnect();
    }
}

resetPassword();
