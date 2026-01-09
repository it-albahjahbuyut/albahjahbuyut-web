
import { db } from '@/lib/db';

async function main() {
    const tafaqquhDescription = `
<p>Program Tafaqquh Al-Bahjah adalah program pendidikan pesantren dengan sistem muqim untuk santri putra dan putri dengan jenjang usia pendidikan menengah keatas, fokus pendidikan pada program agama mencakup Bahasa Arab, Fiqih, Aqidah dan Akhlaq.</p>
<h3>Jenjang Pendidikan:</h3>
<ul>
<li>Kelas Idad</li>
<li>Takhossus Nahwu & Shorof</li>
<li>Takhossus Arobiyah</li>
<li>Takhossus Tahqiqul Mutun</li>
</ul>
`.trim();

    // Find Tafaqquh unit by slug 'tafaqquh' which we saw in the previous step
    await db.unit.update({
        where: { slug: 'tafaqquh' },
        data: {
            description: tafaqquhDescription,
            // Ensure name is clean if needed, but "Tafaqquh Fiddin" is fine. User used "PROGRAM TAFAQQUH" as header.
        }
    });

    console.log('Updated Tafaqquh description');
}

main().catch(console.error);
