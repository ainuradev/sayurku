"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [kgCount, setKgCount] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const itemsInCart = cartItems.filter((item) => item.id === product.id);
  const totalInCart = itemsInCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenModal = () => {
    setKgCount(1);
    setShowModal(true);
  };
  
  const handleCloseModal = () => setShowModal(false);

  const handleAdd = (unit: string) => {
    addToCart(product, unit);
    setShowModal(false);
    
    setToastMessage(`${product.name} (${unit}) masuk keranjang!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <>
      <div className="animate-fadeInUp group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Emoji Area */}
        <div className="relative flex h-32 w-full items-center justify-center bg-gradient-to-b from-green-50 to-green-100/60 sm:h-36">
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl">
            {product.emoji}
          </span>

          {!product.is_available && (
            <>
              <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-[2px]" />
              <span className="absolute right-2 top-2 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                Kosong
              </span>
            </>
          )}

          {/* Badge Cart Count */}
          {totalInCart > 0 && product.is_available && (
            <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shadow-sm">
              {totalInCart}
            </span>
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

          <div className="mt-auto" />

          <p className="mb-3 text-[10px] italic text-gray-400">
            *Harga via WhatsApp
          </p>

          {!product.is_available ? (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-400 sm:text-sm"
            >
              Sedang Kosong
            </button>
          ) : (
            <button
              onClick={handleOpenModal}
              className="w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-200 sm:text-sm bg-green-700 shadow-sm hover:bg-green-800 active:scale-95"
            >
              + Tambah
            </button>
          )}
        </div>
      </div>

      {/* MODAL PILIH SATUAN */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
          <div className="animate-slideUp sm:animate-scaleIn w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Pilih Satuan</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <span className="text-3xl">{product.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </div>

            <div className="space-y-3">
              {product.unit_type === "unit" && product.unit_options?.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2">
                   {product.unit_options.map((opt) => (
                     <button
                       key={opt}
                       onClick={() => handleAdd(opt)}
                       className="rounded-xl border-2 border-green-100 bg-white py-3 text-sm font-semibold text-green-700 transition hover:border-green-500 hover:bg-green-50 active:scale-95"
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
              ) : (
                 <>
                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pilih Gram (gr)</p>
                   <div className="grid grid-cols-3 gap-2">
                     {["250gr", "500gr", "750gr"].map((opt) => (
                       <button
                         key={opt}
                         onClick={() => handleAdd(opt)}
                         className="rounded-xl border-2 border-green-100 bg-white py-2.5 text-sm font-semibold text-green-700 transition hover:border-green-500 hover:bg-green-50 active:scale-95"
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                   
                   <p className="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Atau Kilogram (kg)</p>
                   <div className="flex items-center gap-3">
                     <div className="flex h-11 flex-1 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-2">
                       <button 
                         onClick={() => setKgCount(prev => Math.max(1, prev - 1))}
                         className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-lg font-bold text-gray-600 shadow-sm transition hover:bg-gray-100 active:scale-95"
                       >
                         −
                       </button>
                       <span className="text-sm font-bold text-gray-800">{kgCount} kg</span>
                       <button 
                         onClick={() => setKgCount(prev => prev + 1)}
                         className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-lg font-bold text-gray-600 shadow-sm transition hover:bg-gray-100 active:scale-95"
                       >
                         +
                       </button>
                     </div>
                     <button
                       onClick={() => handleAdd(`${kgCount} kg`)}
                       className="h-11 rounded-xl bg-green-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95"
                     >
                       Tambah
                     </button>
                   </div>
                 </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 z-[110] -translate-x-1/2 animate-slideUp">
          <div className="flex items-center gap-2 rounded-full bg-gray-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
            <span className="text-green-400">✓</span>
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
}
