import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sayurku – Sayur Segar Antar Rumah",
  description: "Pesan sayuran segar pilihan dari lapak lokal terpercaya. Antar rumah atau ambil sendiri, bayar tunai atau QRIS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.className} bg-[#F7FBF2] text-gray-900`}>
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
          strategy="beforeInteractive"
        />
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
