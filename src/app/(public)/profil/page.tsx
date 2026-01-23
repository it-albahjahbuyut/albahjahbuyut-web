import Image from "next/image";
import Link from "next/link";
import { Target, User, GraduationCap, BookOpen, Scroll, BookOpenCheck, Quote, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { UnitCard } from "@/components/public/UnitCard";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

export const metadata = {
    title: "Profil | Pondok Pesantren Al-Bahjah Buyut",
    description: "Mengenal lebih dekat Pondok Pesantren Al-Bahjah Buyut, sejarah, visi-misi, dan nilai-nilai perjuangan.",
};

export default async function ProfilePage() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const mainFigures = [
        {
            name: "Buya Yahya",
            role: "Pengasuh LPD Al-Bahjah",
            // Placeholder image for Buya Yahya (using a respectful generic image or placeholder)
            image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Buya_Yahya.jpg",
        },
        {
            name: "Abah Sayf Abu Hanifah",
            role: "Pengasuh Al-Bahjah Buyut",
            image: "https://res.cloudinary.com/dand8rpbb/image/upload/v1767976355/DSC00058_ioql27.jpg",
        }
    ];

    const structuralFigures = [
        {
            name: "Dr. Fidya Ari Pratama, S.Pd., M.Pd.",
            role: "Kadiv Pendidikan Al-Bahjah Buyut",
            image: null,
        },
        {
            name: "Isro Muwafiq",
            role: "Kepala Sekolah SMPIQu Al-Bahjah Buyut",
            image: "https://res.cloudinary.com/dand8rpbb/image/upload/v1768892833/WhatsApp_Image_2026-01-20_at_1.35.36_PM_qzt6ov.jpg",
        },
        {
            name: "Ahmad Nana Permana, S.Pd.",
            role: "Kepala Sekolah SMAIQu Al-Bahjah Buyut",
            image: "https://res.cloudinary.com/dand8rpbb/image/upload/v1768892833/WhatsApp_Image_2026-01-20_at_1.35.37_PM_rjneif.jpg",
        },
        {
            name: "Abdurrosyid, S.Kom.",
            role: "HRD Al-Bahjah Buyut",
            image: "https://res.cloudinary.com/dand8rpbb/image/upload/v1769161676/WhatsApp_Image_2026-01-22_at_5.02.32_PM_qz6su8.jpg",
        }
    ];

    return (

        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1767934623/WhatsApp_Image_2026-01-08_at_11.07.46_PM_qqhota.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-emerald-950/60 to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                            Profil Kami
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <p className="text-emerald-50/90 font-serif text-xl md:text-2xl max-w-3xl mx-auto italic leading-relaxed">
                            "Membangun peradaban mulia di bawah naungan Al-Qur'an dan Sunnah Rasulullah SAW."
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* History Section */}
            <section className="py-24 container mx-auto px-4 lg:px-8 max-w-5xl text-center">
                <FadeIn>
                    <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Sejarah Singkat</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-10 leading-snug">
                        Lembaga Pengembangan Dakwah (LPD) <br /> Al-Bahjah Buyut
                    </h3>
                    <div className="prose prose-lg prose-slate mx-auto text-slate-600 leading-loose">
                        <p>
                            Merupakan perpanjangan tangan dari dakwah mulia yang diasuh oleh <strong>Buya Yahya</strong>. Berdiri di tengah kerinduan umat akan lembaga pendidikan yang tidak hanya mengasah intelektual, tetapi juga menempa spiritualitas.
                        </p>
                        <p>
                            Kami bermula dari majelis taklim sederhana yang kemudian berkembang menjadi pusat pendidikan terpadu. Dengan semangat khidmat kepada umat, Al-Bahjah Buyut terus bertransformasi menghadirkan fasilitas pendidikan formal dan non-formal yang berkualitas, bersanad jelas, dan berorientasi pada pembentukan akhlakul karimah.
                        </p>
                    </div>
                </FadeIn>
            </section>

            {/* Buya Yahya Biography Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    <FadeIn>
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-3">Biografi Guru Mulia</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950">
                                Buya Yahya
                            </h3>
                            <p className="text-lg text-emerald-900/80 font-medium mt-2">
                                (Yahya Zainul Ma'arif)
                            </p>
                        </div>

                        <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed text-justify block">
                            {/* Floated Image - Right for Buya to alternate */}
                            <div className="float-right w-full md:w-72 lg:w-80 ml-8 mb-4 md:mb-2 relative">
                                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Buya_Yahya.jpg"
                                        alt="Buya Yahya"
                                        fill
                                        className="object-cover z-10"
                                        loading="eager"
                                        sizes="(max-width: 768px) 100vw, 320px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white bg-emerald-950/30 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                        <p className="font-serif italic text-sm opacity-90 !mb-0 leading-none">Pengasuh</p>
                                        <h4 className="text-lg font-bold !mt-0 leading-tight">LPD Al-Bahjah (Pusat)</h4>
                                    </div>
                                </div>
                            </div>

                            <p>
                                <strong>Yahya Zainul Ma'arif</strong>, yang lebih akrab disapa <strong>Buya Yahya</strong>, adalah sosok ulama karismatik kelahiran Blitar, Jawa Timur, pada 10 Agustus 1973. Beliau adalah pengasuh Lembaga Pengembangan Dakwah (LPD) Al-Bahjah yang berpusat di Cirebon, yang kini telah memiliki cabang di berbagai penjuru nusantara, termasuk Al-Bahjah Buyut.
                            </p>
                            <p>
                                Perjalanan keilmuan beliau dimulai di tanah kelahirannya, menempuh pendidikan dasar dan agama di Madrasah Diniyah Al-Falah di bawah asuhan KH. Imron Mahbub. Dahaga akan ilmu agama membawa beliau melanjutkan pendidikan di Pondok Pesantren Darullughah Wadda'wah di Bangil, Pasuruan (1988-1993), di mana beliau juga sempat mengabdi hingga tahun 1996.
                            </p>
                            <p>
                                Tak berhenti di situ, Buya Yahya melanjutkan rihlah ilmiahnya ke jenjang internasional dengan menempuh pendidikan di Universitas Al-Ahgaff, Yaman. Di negeri para wali tersebut, beliau menghabiskan waktu selama 9 tahun (1996-2005) untuk memperdalam berbagai disiplin ilmu agama langsung dari para ulama terkemuka.
                            </p>
                            <p>
                                Sekembalinya ke Indonesia pada tahun 2005, Buya Yahya memulai dakwahnya di Cirebon dari mushola-mushola kecil. Dengan keikhlasan dan metode dakwah yang santun serta menyejukkan, dakwah beliau mendapat sambutan hangat dari masyarakat. Hal ini kemudian berkembang menjadi majelis taklim dan akhirnya berdirilah LPD Al-Bahjah.
                            </p>
                            <p>
                                Selain mengasuh pesantren, Buya Yahya juga memprakarsai berdirinya Sekolah Tinggi Agama Islam (STAI) Al-Bahjah, sebagai wujud kepedulian beliau terhadap lahirnya intelektual muslim yang berakhlak mulia. Kini, dakwah beliau tidak hanya terbatas di Cirebon atau Indonesia, namun telah menjangkau umat di berbagai belahan dunia melalui berbagai media dakwah.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Biography Section (Abah Sayf) */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    <FadeIn>
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-3">Biografi Pengasuh</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950">
                                Abah Sayf Abu Hanifah
                            </h3>
                        </div>

                        <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed text-justify block">
                            {/* Floated Image */}
                            <div className="float-left w-full md:w-72 lg:w-80 mr-8 mb-4 md:mb-2 relative">
                                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
                                    <Image
                                        src="https://res.cloudinary.com/dand8rpbb/image/upload/v1767976355/DSC00058_ioql27.jpg"
                                        alt="Abah Sayf Abu Hanifah"
                                        fill
                                        className="object-cover z-10"
                                        loading="eager"
                                        sizes="(max-width: 768px) 100vw, 320px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white bg-emerald-950/30 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                        <p className="font-serif italic text-sm opacity-90 !mb-0 leading-none">Pengasuh</p>
                                        <h4 className="text-lg font-bold !mt-0 leading-tight">LPD Al-Bahjah Buyut</h4>
                                    </div>
                                </div>
                            </div>

                            <p>
                                Abah Sayf Abu Hanifah dilahirkan di desa Lawang Kabupaten Malang pada hari Jum'at 07 Syawwal 1404 H / 06 Juli 1984 dari pasangan ayahanda Abu Hanifah dan ibunda Marliah. Ditangan kedua orang tua beliau, Abah Sayf banyak mendapatkan pendidikan yang sangat berkesan ialah mulai dari kecil Abah Sayf oleh orang tua beliau sering diajak ziaroh-ziarah ke para ulama dan menghadiri majelis-majelis ulama di Jawa Timur.
                            </p>
                            <p>
                                Sebelum Abah Sayf mondok di Darul Istiqomah beliau juga sempat belajar Al-Qur'an dan ilmu tajwid di Pondok Sirojul Huda Jl. Raya Surabaya Malang tepatnya didesa Purwosari Pasuruan dibawah asuhan KH Hasan Bashori (Allah yarham).
                            </p>
                            <p>
                                Pada saat beliau menginjak kelas 2 SD Abah Sayf belajar di Pondok Pesantren Darul Istiqomah dibawah asuhan KH Misbahul Munir Masyhuri (Allah yarham), di situlah Abah Sayf belajar beberapa Ilmu khususnya ilmu Agama (Shorof, Nahwu, Bahasa Arab, Ilmu Hadits, Ilmu Al-Qur'an, Tajwid, Faro'id, Balaghah, Fiqh dan lain-lainnya), dan di Pondok Pesantren tersebut Abah Sayf juga mengenyam Pendidikan Madrasah Ibtidaiyyah, Madrasah Tsanawiyyah dan Madrasah Aliyyah hingga lulus pada tahun 2003/2004, kemudian beliau mengabdi (Khidmat) kepada pondok. Disela-sela beliau berkhidmat, beliau menyempatkan belajar disalah satu ponpes Mis Rembang Sarang di bawah naungan kiai-kiai sepuh Mbah Umar (Allah yarham), Mbah Faqih (Allah yarham), dan Mbah Rohib.
                            </p>
                            <p>
                                Abah Sayf Abu Hanifah mulai Masuk ke Cirebon pada tahun 2005 karna diajak oleh seorang guru yang bernama Ustadz Ali Badri bin KH Badri Masyhuri, Abah Sayf sempat belajar kepada beliau selama 7 bulan di pondok beliau yang bernama Haiatul Furqon yakni belajar Ilmu Hadits, Tafsir dan beberapa ilmu lainnya.
                            </p>
                            <p>
                                Hingga diakhir 2006 Abah Sayf dipertemukan oleh Ustadz Ali kepada orang yang sangat berpengaruh di dalam perjalanan pendidikan Abah Sayf yaitu Buya Yahya, dan Abah Sayf pun diberi izin untuk menimba ilmu kepada Buya Yahya, dan dari situlah banyak ilmu yang didapat dari guru Mulia Buya Yahya (Ilmu Tasawwuf, Ilmu Dakwah, Ilmu Fiqh, Ilmu tentang hati {'{'} Ketawadhu'an, Menghilangkan gengsi sombong, hidup ala kadarnya dan ilmu-ilmu hati yang lainnya {'}'} ) hingga sampai sekarang masih belajar dengan guru Mulia Buya Yahya di LPD AL-BAHJAH Cirebon.
                            </p>
                            <p>
                                Begitu juga Abah Sayf disarankan oleh Buya Yahya untuk kuliah, maka Abah Sayf kuliah di STAISA ( Sekolah Tinggi Agama Islam Shalahudin Al-Ayyubi ) jurusan PAI (lulus kuliah pada tahun 2010/2011) di Cirebon, tepatnya di Pesantren Ulumuddin Susukan dibawah naungan KH. Ali Murtadho.
                            </p>
                            <p>
                                Disela-sela belajar dengan guru mulia Buya Yahya, Abah Sayf diberi amanah untuk memimpin cabang kedua LPD AL-BAHJAH, yakni LPD Al Bahjah Buyut. Kegiatan belajar mengajar di LPD AL-BAHJAH Buyut dimulai pada tahun 2013.
                            </p>
                            <p>
                                Abah Sayf juga sering mewakili Buya Yahya di beberapa majelis-majelis Buya Yahya atas perintah beliau, dan saat inipun Abah Sayf masih mempunyai majelis rutin di wilayah Bekasi & Tangerang.
                            </p>
                            <p className="italic font-medium text-emerald-900 border-l-4 border-gold-400 pl-4">
                                Inilah seklumit tentang perjalanan pendidikan Abah Sayf Abu Hanifah, mudah-mudahan Beliau dibimbing Oleh Allah SWT untuk menjadi orang yang soleh, mendapat ridho orang tua, ridho para Guru dan keberkahan Para Ulama', dan menjadi orang yg selamat di dunia dan akherat, menjadi orang yang ikhlas di dalam Berdakwah.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Visi Misi Section - Modern Centered Layout */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">

                    {/* Visi & Moto Header */}
                    <FadeIn className="text-center max-w-4xl mx-auto mb-20">
                        <h1 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-6">Visi Kami</h1>
                        <p className="text-2xl md:text-4xl font-serif text-emerald-950 leading-tight mb-10 font-medium">
                            "Menjadi lembaga pendidikan profesional yang bisa menghadirkan generasi berkarakter islami, memiliki kecerdasan intelektual, emosi dan spiritual serta mampu mengamalkan Al-Qur'an untuk diri, keluarga dan bangsa."
                        </p>

                        <div className="inline-block relative">
                            <div className="absolute inset-0 bg-gold-400 blur opacity-20 transform rotate-2"></div>
                            <div className="relative bg-white border border-slate-100 shadow-sm rounded-full py-3 px-8 flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Moto</span>
                                <div className="w-px h-4 bg-slate-200"></div>
                                <span className="text-emerald-900 font-serif italic text-lg">"Tinggalan Kami Jika Tidak Berakhlak"</span>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Misi Grid */}
                    <div className="max-w-6xl mx-auto mb-20">
                        <FadeIn className="text-center mb-10">
                            <h3 className="text-xl font-bold text-emerald-950 inline-flex items-center gap-2 border-b-2 border-gold-400 pb-1">
                                Misi Kami
                            </h3>
                        </FadeIn>

                        <FadeInStagger className="grid md:grid-cols-3 gap-6">
                            {[
                                "Membentuk generasi berkarakter islami yang ber-aqidah Ahlussunnah Wal Jama'ah, Al-Asy'ariyah, Sufiyah, dan bermadzhab.",
                                "Membekali siswa-siswi dengan akhlak yang mulia.",
                                "Membiasakan siswa-siswi dekat dengan Al-Qur'an."
                            ].map((item, i) => (
                                <FadeIn key={i}>
                                    <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/60 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none transition-transform group-hover:scale-110" />
                                        <span className="relative z-10 text-5xl font-bold text-emerald-100 mb-4 block group-hover:text-gold-100 transition-colors">
                                            0{i + 1}
                                        </span>
                                        <p className="relative z-10 text-emerald-950 font-medium leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}
                        </FadeInStagger>
                    </div>

                    {/* Tujuan Grid */}
                    <div className="max-w-6xl mx-auto">
                        <FadeIn className="text-center mb-10">
                            <h3 className="text-xl font-bold text-emerald-950 inline-flex items-center gap-2 border-b-2 border-emerald-600 pb-1">
                                Tujuan
                            </h3>
                        </FadeIn>

                        <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "Membentuk generasi Qur'ani penghafal Al-Qur'an yang berdedikasi.",
                                "Menghasilkan lulusan yang mampu mengamalkan ilmu Agama Islam.",
                                "Membentuk lingkungan berakhlaqul karimah melalui pendidikan karakter.",
                                "Menghasilkan lulusan yang menguasai sains, teknologi, dan berpikir kritis.",
                                "Meningkatkan kompetensi profesionalisme guru secara berkelanjutan.",
                                "Menyiapkan peserta didik yang cakap berbahasa Arab dan Inggris."
                            ].map((item, i) => (
                                <FadeIn key={i}>
                                    <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                                        <div className="flex-shrink-0 w-2 bg-emerald-500 rounded-full" />
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                            {item}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}
                        </FadeInStagger>
                    </div>
                </div>
            </section>

            {/* Figures Section - Minimalist Card Design */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="text-center mb-16">
                        <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Struktur</h2>
                        <h3 className="text-3xl font-bold text-emerald-950">Tokoh & Pimpinan</h3>
                    </FadeIn>

                    {/* Main Figures Grid (Buya & Abah) */}
                    <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
                        {mainFigures.map((figure, idx) => (
                            <FadeIn key={idx}>
                                <div className="group text-center">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-4 mx-auto w-full max-w-[280px] shadow-lg">
                                        <Image
                                            src={figure.image || ""}
                                            alt={figure.name}
                                            fill
                                            className="object-cover z-10 group-hover:scale-105 transition-transform duration-700"
                                            loading="eager"
                                            sizes="(max-width: 768px) 100vw, 280px"
                                        />
                                        <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold text-emerald-950 mb-1 group-hover:text-gold-600 transition-colors">
                                            {figure.name}
                                        </h4>
                                        <p className="text-slate-500 font-medium">{figure.role}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>

                    {/* Structural Figures Grid */}
                    <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {structuralFigures.map((figure, idx) => (
                            <FadeIn key={idx}>
                                <div className="group text-center">
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-4 mx-auto w-full max-w-[240px]">
                                        {figure.image ? (
                                            <Image
                                                src={figure.image}
                                                alt={figure.name}
                                                fill
                                                className="object-cover z-10 group-hover:scale-105 transition-transform duration-700"
                                                loading="eager"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <User className="w-16 h-16 opacity-50" />
                                            </div>
                                        )}
                                        {/* Overlay gradient on hover */}
                                        <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 transition-colors duration-300" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <h4 className="text-lg font-bold text-emerald-950 mb-1 group-hover:text-emerald-700 transition-colors">
                                            {figure.name}
                                        </h4>
                                        <p className="text-slate-500 text-sm font-medium">{figure.role}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                </div>
            </section>

            {/* Programs Section - Redesigned Minimalist Grid */}
            <section className="py-24 bg-white text-emerald-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <FadeIn className="mb-16 md:flex justify-between items-end">
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Pendidikan</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Program Unggulan</h3>
                            <p className="text-emerald-900/70 text-lg leading-relaxed">
                                Pilihan program pendidikan yang dirancang untuk membentuk generasi berkarakter Qur'ani dan berwawasan luas.
                            </p>
                        </div>
                        <Link href="/pendidikan" className="hidden md:inline-flex items-center gap-2 text-emerald-950 font-bold hover:text-gold-600 transition-colors uppercase tracking-widest text-sm">
                            Lihat Semua Program
                        </Link>
                    </FadeIn>

                    <FadeInStagger className="grid md:grid-cols-2 gap-8">
                        {units.map((unit) => {
                            const unitIcons: any = {
                                smpiqu: GraduationCap,
                                smaiqu: BookOpen,
                                tafaqquh: Scroll,
                                tahfidz: BookOpenCheck,
                            };
                            const Icon = unitIcons[unit.slug] || BookOpen;
                            const cleanDesc = unit.description ? unit.description.replace(/<[^>]*>?/gm, '') : "Program pendidikan unggulan.";

                            // Menentukan gambar default berdasarkan slug jika tidak ada gambar di database
                            let defaultImage = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop";
                            if (unit.slug.includes('smp')) defaultImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop";
                            if (unit.slug.includes('sma')) defaultImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";
                            if (unit.slug.includes('tahfidz')) defaultImage = "https://images.unsplash.com/photo-1606233400587-c1dcb8dc2286?q=80&w=2070&auto=format&fit=crop";

                            return (
                                <FadeIn key={unit.id}>
                                    <Link
                                        href={`/pendidikan/${unit.slug}`}
                                        className="group relative flex flex-col h-[320px] w-full overflow-hidden border border-emerald-100 bg-emerald-950 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        {/* Background Image with Gradient */}
                                        <div className="absolute inset-0 bg-emerald-950">
                                            <Image
                                                src={unit.image || defaultImage}
                                                alt={unit.name}
                                                fill
                                                className="object-cover object-center z-10 transition-transform duration-700 group-hover:scale-110 opacity-60"
                                                loading="eager"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex h-full flex-col p-8">
                                            <h4 className="mb-3 text-2xl font-bold text-white group-hover:text-gold-400 transition-colors pt-4">
                                                {unit.name}
                                            </h4>

                                            <p className="mb-6 line-clamp-2 text-emerald-100/80 leading-relaxed font-light">
                                                {cleanDesc}
                                            </p>

                                            <div className="mt-auto">
                                                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-400 group-hover:text-white transition-colors border-b border-transparent group-hover:border-white pb-1">
                                                    Selengkapnya <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeIn>
                            );
                        })}
                    </FadeInStagger>

                    <div className="mt-12 text-center md:hidden">
                        <Link href="/pendidikan" className="inline-flex items-center gap-2 text-gold-400 font-bold">
                            Lihat Semua Program
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
