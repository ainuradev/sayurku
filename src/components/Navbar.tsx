"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-900/10 bg-[#1a3a2a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥬</span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              HR Sayur
            </h1>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-green-300/70 sm:block">
              Segar dari Pasar
            </p>
          </div>
        </Link>

        {/* Cart Button */}
        <Link
          href="/keranjang"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
          aria-label="Keranjang Belanja"
        >
          <span className="text-base">🛒</span>
          <span className="hidden sm:inline">Keranjang</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-green-900">
            {totalItems}
          </span>
        </Link>
      </div>
    </header>
  );
}
