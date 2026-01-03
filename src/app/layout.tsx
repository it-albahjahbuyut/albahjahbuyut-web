import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pondok Pesantren Al-Bahjah Buyut | Membangun Generasi Qur'ani",
  description:
    "Pondok Pesantren Al-Bahjah Buyut - Lembaga pendidikan Islam terpadu dengan program SMP, SMA, Tafaqquh, dan Tahfidz. Membangun generasi Qur'ani yang berakhlak mulia.",
  keywords: [
    "pesantren",
    "al-bahjah",
    "buyut",
    "pendidikan islam",
    "tahfidz",
    "tafaqquh",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
