"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const cartItem = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="animate-fadeInUp group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Emoji Area */}
      <div className="relative flex h-32 w-full items-center justify-center bg-gradient-to-b from-green-50 to-green-100/60 sm:h-36">
        <span className="text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl">
          {product.emoji}
        </span>

        {/* Not available overlay */}
        {!product.isAvailable && (
          <>
            <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-[2px]" />
            <span className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Kosong
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="mb-1.5 text-sm font-semibold leading-snug text-gray-800 sm:text-[15px]">
          {product.name}
        </h3>

        <span className="mb-2 inline-block w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-800 sm:text-[11px]">
          {product.category}
        </span>

        {/* Spacer */}
        <div className="mt-auto" />

        <p className="mb-3 text-[10px] italic text-gray-400">
          *Harga via WhatsApp
        </p>

        {/* Action Buttons */}
        {!product.isAvailable ? (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-400 sm:text-sm"
          >
            Sedang Kosong
          </button>
        ) : cartItem ? (
          <div className="animate-scaleIn flex h-10 w-full items-center justify-between overflow-hidden rounded-xl border border-green-200 bg-green-50">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              className="flex h-full w-10 items-center justify-center text-lg font-bold text-green-700 transition-colors hover:bg-green-100 active:bg-green-200"
              aria-label="Kurangi"
            >
              −
            </button>
            <span className="text-sm font-bold text-green-800">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="flex h-full w-10 items-center justify-center text-lg font-bold text-green-700 transition-colors hover:bg-green-100 active:bg-green-200"
              aria-label="Tambah"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-200 sm:text-sm ${
              isAnimating
                ? "scale-95 bg-green-500"
                : "bg-green-700 shadow-sm hover:bg-green-800 active:scale-95"
            }`}
          >
            + Tambah
          </button>
        )}
      </div>
    </div>
  );
}
