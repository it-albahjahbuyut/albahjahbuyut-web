
import { db } from '@/lib/db';

async function main() {
    // Update SMAiQU
    // Description source: User request "SMAiQU merupakan lembaga pendidikan formal setara dengan SMA pada umumnya..."
    // Expanded for better UI presence.
    const smaDescription = `
<p>SMAiQU Al-Bahjah Buyut hadir sebagai lembaga pendidikan formal tingkat menengah atas yang tidak hanya berkomitmen pada keunggulan akademis sesuai standar nasional, tetapi juga pada pembentukan karakter Islami yang kokoh.</p>
<p>Keistimewaan utama kami terletak pada penerapan <strong>kurikulum terpadu</strong>, sebuah sinergi harmonis antara ilmu pengetahuan umum dan ilmu agama. Di sini, para santri tidak sekadar menuntut ilmu duniawi, tetapi juga memperdalam <strong>ilmu syariah</strong> dan mendapatkan <strong>pembinaan Al-Qur’an secara intensif dan terarah</strong>.</p>
<p>Kami berikhtiar mencetak generasi intelektual yang tidak hanya cakap dalam sains dan teknologi, namun juga memiliki hafalan Al-Qur'an yang kuat serta beradab mulia, siap menjadi penerang di tengah masyarakat.</p>
`.trim();

    await db.unit.update({
        where: { slug: 'smaiqu' },
        data: { description: smaDescription }
    });
    console.log('Updated SMAiQU description');

    // Update SMPiQu
    // Description source: User request "SMPiQU merupakan lembaga pendidikan formal yang setara dengan SMP pada umumnya..."
    // Expanded for better UI presence.
    const smpDescription = `
<p>SMPIQu Al-Bahjah Buyut merupakan lembaga pendidikan formal yang setara dengan Sekolah Menengah Pertama (SMP) pada umumnya, namun hadir dengan nilai tambah yang istimewa.</p>
<p>Keunggulan kami terletak pada <strong>kurikulum terpadu</strong> yang dirancang secara holistik. Para santri tidak hanya dibimbing untuk menguasai ilmu pengetahuan umum secara mendalam, tetapi juga dibekali dengan pondasi <strong>ilmu syariah</strong> yang kuat serta program pembelajaran <strong>Al-Qur’an yang intensif</strong>.</p>
<p>Dalam lingkungan asrama yang kondusif, kami menanamkan nilai-nilai akhlakul karimah sejak dini, mempersiapkan putra-putri Anda menjadi pribadi yang cerdas, mandiri, dan mencintai Al-Qur'an sebagai bekal utama masa depan mereka.</p>
`.trim();

    await db.unit.update({
        where: { slug: 'smpiqu' },
        data: { description: smpDescription }
    });
    console.log('Updated SMPIQu description');
}

main().catch(console.error);
