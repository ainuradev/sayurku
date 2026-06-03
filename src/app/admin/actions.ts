"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const ADMIN_PIN = "123456";

export async function loginAdmin(pin: string) {
  if (pin === ADMIN_PIN) {
    (await cookies()).set("admin_auth", "true", { httpOnly: true, path: "/" });
    return { success: true };
  }
  return { success: false, error: "PIN Salah" };
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_auth");
  revalidatePath("/admin");
}

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const emoji = (formData.get("emoji") as string) || "🥬";
  const unit_type = formData.get("unit_type") as "weight" | "unit";
  const unit_options_raw = formData.get("unit_options") as string;
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");

  let unit_options: string[] = [];
  if (unit_type === "unit" && unit_options_raw) {
    unit_options = unit_options_raw.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const { error } = await supabaseAdmin.from("products").insert([
    {
      name,
      category,
      emoji,
      unit_type,
      unit_options,
      sort_order,
      is_available: true,
    },
  ]);

  if (error) {
    console.error("Add Product Error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleProductAvailability(id: string, is_available: boolean) {
  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_available })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
