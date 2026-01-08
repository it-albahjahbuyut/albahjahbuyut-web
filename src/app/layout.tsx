import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://albahjahbuyut.com'),
  title: {
    default: "Pondok Pesantren Al-Bahjah Buyut Cirebon | Pesantren Terbaik di Cirebon",
    template: "%s | Pondok Pesantren Al-Bahjah Buyut Cirebon",
  },
  description: "Pondok Pesantren Al-Bahjah Buyut - Pesantren terbaik di Cirebon dengan program Tahfidz Al-Qur'an, SMPIQu, SMAIQu, dan Tafaqquh. Pesantren modern di Cirebon yang memadukan pendidikan Islam dan formal. Bimbingan langsung Buya Yahya.",
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
    title: "Pondok Pesantren Al-Bahjah Buyut | Pesantren Terbaik di Cirebon",
    description: "Pesantren modern di Cirebon dengan program Tahfidz, SMPIQu, SMAIQu, dan Tafaqquh. Pendidikan Islam terbaik dengan bimbingan Buya Yahya.",
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
    title: "Pondok Pesantren Al-Bahjah Buyut | Pesantren Terbaik di Cirebon",
    description: "Pesantren modern di Cirebon dengan program Tahfidz, SMPIQu, SMAIQu, dan Tafaqquh.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://albahjahbuyut.com',
  },
  icons: {
    icon: "/logo-buyut.png",
    shortcut: "/logo-buyut.png",
    apple: "/logo-buyut.png",
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
        {children}
      </body>
    </html>
  );
}
