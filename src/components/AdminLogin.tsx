"use client";

import { useState } from "react";
import { loginAdmin } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await loginAdmin(pin);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error || "Gagal login");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
        <p className="text-sm text-gray-500">Masukkan PIN untuk masuk ke panel</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Masukkan PIN"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xl tracking-widest outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            required
          />
        </div>
        {error && <p className="text-center text-sm font-semibold text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-green-700 py-3 font-bold text-white shadow-md hover:bg-green-800 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
