
import { db } from '@/lib/db';

async function main() {
    const units = await db.unit.findMany();
    console.log(units.map(u => ({ id: u.id, name: u.name, slug: u.slug })));
}

main();
