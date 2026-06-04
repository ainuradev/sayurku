"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

const categoryTabs = [
  { id: "Semua", label: "✦ Semua" },
  { id: "Sayur Hijau & Daun", label: "🌿 Hijau & Daun" },
  { id: "Sayur Sop & Kuah", label: "🥣 Sop & Kuah" },
  { id: "Bumbu Dapur & Cabai", label: "🌶️ Bumbu" },
  { id: "Lauk & Daging", label: "🍗 Lauk" },
  { id: "Paket Siap Masak", label: "📦 Paket" },
];

export default function Home() {
  const { totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dari Supabase saat komponen di-mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const activeCategoryLabel =
    categoryTabs.find((t) => t.id === activeCategory)?.label ?? "Semua";

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14532D] via-[#1a5c34] to-[#166534]">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z" fill="#F7FBF2" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8">
          <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Sayur <span className="text-green-300">Segar,</span>
            <br />
            Antar ke Pintu
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-green-200/80 sm:text-base">
            Pilih sayuranmu sekarang. Harga dikonfirmasi pagi hari, antar ke rumah atau ambil sendiri.
          </p>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Category Tabs */}
        <div className="scrollbar-hide -mx-4 mb-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 pb-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === tab.id
                    ? "bg-green-800 text-white shadow-md shadow-green-900/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-5 mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          {activeCategory === "Semua" ? "Semua Produk" : activeCategoryLabel}
        </p>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <span className="mb-3 text-5xl opacity-30">🔍</span>
            <p className="font-semibold text-gray-400">
              Tidak ada produk di kategori ini
            </p>
          </div>
        )}
      </div>

      <footer className="mt-auto border-t border-gray-200 bg-white px-4 py-8 text-center">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-gray-500">
            © HR Sayur 2025 — Lapak Sayur Segar Lokal
          </p>
          <p className="mt-1.5 text-xs text-gray-400">
            Harga bersifat dinamis & dikonfirmasi setelah belanja pasar pukul 04.00 WIB
          </p>
        </div>
      </footer>

      {totalItems > 0 && (
        <div className="fixed bottom-5 left-4 right-4 z-50 md:hidden">
          <Link
            href="/keranjang"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-800 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-950/30 transition-all active:scale-[0.98]"
          >
            🛒 Lihat Keranjang ({totalItems} item)
          </Link>
        </div>
      )}
    </div>
  );
}
