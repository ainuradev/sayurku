"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { addProduct, deleteProduct, toggleProductAvailability, logoutAdmin } from "@/app/admin/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview lokal
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploadedUrl(null);
    setUploadStatus("uploading");

    // Upload ke server (konversi WebP)
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload gagal");

      setUploadedUrl(data.url);
      setUploadStatus("done");
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploadStatus === "uploading") {
      alert("Tunggu sebentar, foto sedang diupload...");
      return;
    }
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    // Injeksi image_url hasil upload
    if (uploadedUrl) formData.set("image_url", uploadedUrl);

    const res = await addProduct(formData);
    if (res.success) {
      setIsAdding(false);
      setImagePreview(null);
      setUploadedUrl(null);
      setUploadStatus("idle");
    } else {
      alert("Error: " + res.error);
    }
    setIsLoading(false);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setImagePreview(null);
    setUploadedUrl(null);
    setUploadStatus("idle");
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleProductAvailability(id, !currentStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Panel Admin</h1>
          <p className="text-sm text-gray-500">Kelola sayuran &amp; lauk pauk</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300">
            Lihat Web
          </Link>
          <button onClick={handleLogout} className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">
            Keluar
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800">Total Produk: {products.length}</h2>
        <button
          onClick={() => (isAdding ? handleCancelAdd() : setIsAdding(true))}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
        >
          {isAdding ? "Batal Tambah" : "+ Tambah Produk"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-8 animate-slideDown rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-green-900">Tambah Produk Baru</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Nama Produk</label>
              <input name="name" required placeholder="Cth: Cabai Merah" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Kategori</label>
              <select name="category" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500">
                <option value="Sayur Hijau &amp; Daun">Sayur Hijau &amp; Daun</option>
                <option value="Sayur Sop &amp; Kuah">Sayur Sop &amp; Kuah</option>
                <option value="Bumbu Dapur &amp; Cabai">Bumbu Dapur &amp; Cabai</option>
                <option value="Lauk &amp; Daging">Lauk &amp; Daging</option>
                <option value="Paket Siap Masak">Paket Siap Masak</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Emoji (fallback)</label>
              <input name="emoji" required placeholder="Cth: 🌶️" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Urutan Tampil (Angka)</label>
              <input name="sort_order" type="number" defaultValue="99" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>

            {/* Upload Foto */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Foto Produk <span className="text-gray-400 font-normal">(opsional — dikonversi otomatis ke WebP)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 transition hover:border-green-400 hover:bg-green-50"
              >
                {imagePreview ? (
                  <div className="relative h-32 w-32 overflow-hidden rounded-xl">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <span className="text-3xl mb-1">📸</span>
                    <p className="text-sm font-semibold text-gray-500">Klik untuk pilih foto</p>
                    <p className="text-xs text-gray-400">JPG, PNG, HEIC — maks 10MB</p>
                  </>
                )}
                {uploadStatus === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
                    <p className="text-sm font-semibold text-green-700 animate-pulse">Mengupload & konversi ke WebP...</p>
                  </div>
                )}
                {uploadStatus === "done" && (
                  <span className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">✓ WebP Siap</span>
                )}
                {uploadStatus === "error" && (
                  <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">Upload Gagal</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Tipe Satuan */}
            <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-white p-3">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Tipe Satuan Pembelian</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="unit_type" value="weight" defaultChecked className="accent-green-600" />
                  Berdasarkan Berat (Gram / Kg)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="unit_type" value="unit" className="accent-green-600" />
                  Berdasarkan Satuan (Ikat / Buah)
                </label>
              </div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                Khusus Tipe &quot;Satuan&quot; (Pisahkan dengan koma)
              </label>
              <input name="unit_options" placeholder="Cth: 1 ikat, 2 ikat, 3 ikat" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || uploadStatus === "uploading"}
              className="rounded-xl bg-green-700 px-6 py-2.5 font-bold text-white shadow-md hover:bg-green-800 disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Tipe Satuan</th>
              <th className="px-4 py-3 text-center">Status Stok</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <span className="text-2xl">{p.emoji}</span>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-[11px] text-gray-500">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.unit_type === "weight" ? (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">Gram/Kg</span>
                  ) : (
                    <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">Opsi Tetap</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(p.id, p.is_available)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition shadow-sm ${
                      p.is_available ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {p.is_available ? "Tersedia" : "Sedang Kosong"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-gray-400 hover:text-red-500 transition font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Belum ada produk di sistem</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
