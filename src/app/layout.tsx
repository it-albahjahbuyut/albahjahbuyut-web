import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://albahjahbuyut-web.vercel.app'),
  title: {
    default: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut Cirebon",
    template: "%s | Lembaga Pengembangan Dakwah Al-Bahjah Buyut Cirebon",
  },
  description: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut - Pondok pesantren moder terbaik di Cirebon dengan program SDIQu, SMPIQu, SMAIQu, Tahfidz Al-Qur'an dan Tafaqquh. Lembaga modern di Cirebon yang memadukan pendidikan Islam dan formal. Dibawah naungan Buya Yahya.",
  keywords: [
    // Keywords utama
    "pondok pesantren di cirebon",
    "pesantren terbaik di cirebon",
    "pesantren modern di cirebon",
    "pondok modern di cirebon",
    "pesantren cirebon",
    // Brand keywords
    "al-bahjah buyut",
    "pesantren al-bahjah",
    "pondok pesantren al-bahjah",
    "buya yahya pesantren",
    // Program keywords
    "pesantren tahfidz cirebon",
    "pesantren hafidz quran cirebon",
    "smp islam cirebon",
    "sma islam cirebon",
    "pendidikan islam cirebon",
    // Long-tail keywords
    "pesantren putra cirebon",
    "pesantren putri cirebon",
    "pondok pesantren terpadu cirebon",
    "pesantren salafi cirebon",
    "pendaftaran santri baru cirebon",
  ],
  authors: [{ name: "Pondok Pesantren Al-Bahjah Buyut" }],
  creator: "Pondok Pesantren Al-Bahjah Buyut",
  publisher: "Pondok Pesantren Al-Bahjah Buyut",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://albahjahbuyut.com',
    siteName: 'Pondok Pesantren Al-Bahjah Buyut',
    title: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut Cirebon",
    description: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut - Pondok pesantren modern terbaik di Cirebon dengan program SDIQu, SMPIQu, SMAIQu, Tahfidz Al-Qur'an dan Tafaqquh. Lembaga modern di Cirebon yang memadukan pendidikan Islam dan formal. Dibawah naungan Buya Yahya.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pondok Pesantren Al-Bahjah Buyut Cirebon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut Cirebon",
    description: "Lembaga Pengembangan Dakwah Al-Bahjah Buyut - Pondok pesantren modern terbaik di Cirebon dengan program SDIQu, SMPIQu, SMAIQu, Tahfidz Al-Qur'an dan Tafaqquh. Lembaga modern di Cirebon yang memadukan pendidikan Islam dan formal. Dibawah naungan Buya Yahya.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://albahjahbuyut.com',
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  category: 'education',
  verification: {
    // Ganti dengan verification code dari Google Search Console
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} antialiased font-sans overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
