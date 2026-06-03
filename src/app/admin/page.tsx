import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <AdminLogin />
      </div>
    );
  }

  // Jika menggunakan supabaseAdmin (Server Only), pastikan key-nya terisi di env.local
  // SupabaseAdmin bypasses RLS
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const products = (data as Product[]) || [];

  if (error) {
    console.error("Error fetching products on admin:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AdminDashboard products={products} />
    </div>
  );
}
