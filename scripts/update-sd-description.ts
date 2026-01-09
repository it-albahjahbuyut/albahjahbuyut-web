
import { db } from '@/lib/db';

async function main() {
    // Description for SDIQu
    // Patterned after the requested style: Formal + Islamic + Quran
    // "SDIQU merupakan lembaga pendidikan formal yang setara dengan SD pada umumnya..."
    const sdDescription = `
<p>SDIQu Al-Bahjah Buyut merupakan lembaga pendidikan dasar formal yang setara dengan Sekolah Dasar (SD) pada umumnya, namun dengan keistimewaan yang mendasar dalam pembentukan karakter anak.</p>
<p>Kami menerapkan <strong>kurikulum terpadu</strong> yang menggabungkan standar pendidikan nasional dengan nilai-nilai keislaman yang kental. Di sini, ananda tidak hanya diajarkan membaca, menulis, dan berhitung, tetapi juga dibimbing untuk <strong>mencintai Al-Qur’an</strong> sejak usia dini melalui program tahfidz yang menyenangkan dan terarah.</p>
<p>Dengan lingkungan belajar yang ceria dan Islami, kami berkomitmen mencetak generasi Qur'ani yang cerdas, berakhlak mulia, dan berbakti kepada orang tua, sebagai fondasi kokoh untuk jenjang pendidikan selanjutnya.</p>
`.trim();

    // Find SD unit
    const sdUnit = await db.unit.findFirst({
        where: {
            OR: [
                { slug: { contains: 'sd' } },
                { name: { contains: 'SD' } }
            ]
        }
    });

    if (sdUnit) {
        await db.unit.update({
            where: { id: sdUnit.id },
            data: { description: sdDescription }
        });
        console.log(`Updated description for ${sdUnit.name} (${sdUnit.slug})`);
    } else {
        console.log('SD Unit not found');
    }
}

main().catch(console.error);
