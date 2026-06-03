"use client";

import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
      <span className="mb-3 text-6xl opacity-30">🛒</span>
      <h2 className="mb-2 text-lg font-bold text-gray-700">
        Keranjangmu masih kosong
      </h2>
      <p className="mb-6 max-w-xs text-sm text-gray-400">
        Yuk pilih sayuran segar untuk makan hari ini!
      </p>
      <Link
        href="/"
        className="rounded-xl bg-green-700 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-800 active:scale-95"
      >
        Mulai Belanja
      </Link>
    </div>
  );
}
