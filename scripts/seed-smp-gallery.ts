
import { db } from '@/lib/db';

async function main() {
    const smp = await db.unit.findUnique({
        where: { slug: 'smpiqu' },
        include: { galleries: true }
    });

    if (smp) {
        console.log(`SMPIQu Galleries: ${smp.galleries.length}`);
        if (smp.galleries.length === 0) {
            console.log('Seeding dummy galleries for SMPIQu...');
            await db.gallery.createMany({
                data: [
                    { unitId: smp.id, title: 'Kegiatan Belajar Mengajar', imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop' },
                    { unitId: smp.id, title: 'Ekstrakurikuler Pamanah', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop' },
                    { unitId: smp.id, title: 'Kajian Rutin', imageUrl: 'https://images.unsplash.com/photo-1606813286377-36e65529f7f4?q=80&w=2070&auto=format&fit=crop' },
                ]
            });
            console.log('Dummy galleries seeded.');
        }
    }
}

main().catch(console.error);
