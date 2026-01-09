
import { db } from '@/lib/db';

async function main() {
    const units = await db.unit.findMany({
        where: {
            OR: [
                { name: { contains: 'SMA' } },
                { name: { contains: 'SMP' } },
                { slug: { contains: 'sma' } },
                { slug: { contains: 'smp' } }
            ]
        }
    });
    console.log(JSON.stringify(units, null, 2));
}

main();
