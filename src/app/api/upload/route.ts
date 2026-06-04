import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
    }

    // Konversi ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Konversi ke WebP menggunakan sharp (max 800px, quality 80)
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Buat nama file unik
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // hapus ekstensi
    const safeBaseName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 40);
    const fileName = `${safeBaseName}-${timestamp}.webp`;
    const filePath = `products/${fileName}`;

    // Upload ke Supabase Storage
    const adminClient = getSupabaseAdmin();
    const { error: uploadError } = await adminClient.storage
      .from("product-images")
      .upload(filePath, webpBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Ambil public URL
    const { data } = adminClient.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}
