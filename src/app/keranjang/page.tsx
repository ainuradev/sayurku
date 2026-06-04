"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckoutFormData, DeliveryMethod, PaymentMethod } from "@/types";
import EmptyCart from "@/components/EmptyCart";

const WHATSAPP_NUMBER = "6288293427818";

export default function CartPage() {
  const { cartItems, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    nama: "",
    metode: "",
    alamat: "",
    jamAntar: "",
    pembayaran: "",
    catatan: "",
  });

  const handlePesanViaWA = () => {
    if (!formData.nama.trim()) {
      alert("Mohon isi Nama Kamu terlebih dahulu.");
      return;
    }
    if (!formData.metode) {
      alert("Mohon pilih Metode Pengambilan.");
      return;
    }
    if (!formData.pembayaran) {
      alert("Mohon pilih Metode Pembayaran.");
      return;
    }

    let listBelanja = cartItems
      .map((item) => {
        // Jika quantity > 1, tambahkan tulisan "2 x " di depannya. Jika tidak, kosongkan saja.
        const qtyString = item.quantity > 1 ? `${item.quantity} x ` : "";
        return `- ${item.emoji} ${item.name} (${qtyString}${item.selectedUnit})`;
      })
      .join("\n");

    let text = `Halo HR Sayur! 👋\n\nSaya mau cek harga & pesan:\n\n${listBelanja}\n\n`;
    text += `📋 *Detail Pesanan:*\n`;
    text += `Nama: ${formData.nama}\n`;
    text += `Metode: ${formData.metode}\n`;
    text += `Pembayaran: ${formData.pembayaran}\n`;
    if (formData.catatan.trim()) text += `Catatan: ${formData.catatan}\n`;
    text += `\nMohon konfirmasi harga ya, terima kasih! 🙏`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");

    // Hapus isi keranjang setelah kirim ke WA
    clearCart();

    // Tampilkan pesan sukses
    setIsOrderSuccess(true);
  };

  const handleMetodeChange = (metode: DeliveryMethod) => {
    setFormData((prev) => ({ ...prev, metode }));
  };

  const handlePembayaranChange = (pembayaran: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, pembayaran }));
  };

  // Tampilan jika pesanan sudah berhasil dibuat
  if (isOrderSuccess) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl">✅</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Pesanan Dibuat!</h2>
        <p className="mb-8 text-sm text-gray-500">
          Detail pesanan Anda telah dibuka di WhatsApp. Keranjang Anda sekarang sudah kosong kembali. Silakan tunggu balasan dan konfirmasi harga dari lapak kami.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-green-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 active:scale-95"
        >
          Belanja Lagi
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-6 pb-28 sm:py-10 md:pb-10">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
        >
          ← Kembali Belanja
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Keranjang Belanja 🛒
        </h1>
      </div>

      {/* Empty State */}
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-5">
          {/* ===== SECTION A: Order Summary ===== */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-bold text-gray-800 sm:text-lg">
              📝 Pesanan Kamu
            </h2>

            <div className="space-y-0 divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {/* Emoji */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                    {item.emoji}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-medium text-gray-500">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[11px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">
                        {item.selectedUnit}
                      </span>
                    </div>
                  </div>

                  {/* Qty Control */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-8 items-center overflow-hidden rounded-lg border border-green-200 bg-green-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="flex h-full w-8 items-center justify-center text-sm font-bold text-green-700 transition hover:bg-green-100"
                      >
                        −
                      </button>
                      <span className="flex h-full w-7 items-center justify-center border-x border-green-200 bg-white text-xs font-bold text-green-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="flex h-full w-8 items-center justify-center text-sm font-bold text-green-700 transition hover:bg-green-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Hapus item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider + Summary */}
            <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                <span className="font-bold text-gray-800">{cartItems.length}</span> jenis produk
              </p>
              <p className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                Total <span className="font-bold">{totalItems}</span> item
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-4 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200/60">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-800 sm:text-sm">
                <span className="mt-0.5 shrink-0">💡</span>
                <span>Harga akan dikonfirmasi oleh penjual setelah belanja di pasar pukul 04.00 WIB.</span>
              </p>
            </div>
          </div>

          {/* ===== SECTION B: Checkout Form ===== */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-base font-bold text-gray-800 sm:text-lg">
              📋 Data Pengiriman
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Nama Kamu <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Sari"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              {/* Delivery Method */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Metode Pengambilan <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Diantar ke Rumah — Coming Soon */}
                  <div className="relative">
                    <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-3 text-center opacity-60 cursor-not-allowed select-none sm:flex-row sm:gap-3 sm:p-4 sm:text-left">
                      <span className="text-xl">🚗</span>
                      <span className="text-xs font-semibold text-gray-400 sm:text-sm">Diantar ke Rumah</span>
                    </div>
                    <span className="absolute -top-2 -right-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm whitespace-nowrap">
                      🚧 Segera Hadir
                    </span>
                  </div>

                  {/* Ambil Sendiri */}
                  <button
                    onClick={() => handleMetodeChange("Ambil Sendiri")}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all sm:flex-row sm:gap-3 sm:p-4 sm:text-left ${
                      formData.metode === "Ambil Sendiri"
                        ? "border-green-600 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <span className="text-xl">🏃</span>
                    <span className="text-xs font-semibold text-gray-700 sm:text-sm">Ambil Sendiri</span>
                  </button>
                </div>
              </div>

              {/* Conditional: Pickup info */}
              {formData.metode === "Ambil Sendiri" && (
                <div className="animate-slideDown rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm leading-relaxed text-green-800">
                    📍 <strong>Alamat Lapak:</strong> Pasar Tohaga Cibinong
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    ⏰ Buka mulai pukul 02.00 - 15.00 WIB
                  </p>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Metode Pembayaran <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Tunai (Cash)", "QRIS / E-Wallet"] as PaymentMethod[]).map(
                    (method) => {
                      const isActive = formData.pembayaran === method;
                      const emoji = method === "Tunai (Cash)" ? "💵" : "📱";
                      return (
                        <button
                          key={method}
                          onClick={() => handlePembayaranChange(method)}
                          className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all sm:flex-row sm:gap-3 sm:p-4 sm:text-left ${
                            isActive
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-green-300"
                          }`}
                        >
                          <span className="text-xl">{emoji}</span>
                          <span className="text-xs font-semibold text-gray-700 sm:text-sm">
                            {method}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Catatan Tambahan <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  placeholder="Contoh: tolong pilihkan yang segar, minta dikupas, dll."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>
          </div>

          {/* ===== CTA BUTTON ===== */}
          <div className="pb-6 pt-2 text-center">
            <button
              onClick={handlePesanViaWA}
              className="w-full rounded-2xl bg-green-800 py-4 text-base font-bold text-white shadow-lg shadow-green-900/25 transition-all hover:bg-green-900 active:scale-[0.98] sm:text-lg"
            >
              Pesan via WhatsApp 📲
            </button>
            <p className="mt-3 text-xs text-gray-400">
              Setelah pesan, tunggu konfirmasi harga dari kami ya!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
