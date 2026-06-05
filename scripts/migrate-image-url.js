// Script untuk menambah kolom image_url ke tabel products
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqvdcqogkiiulssmlgio.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdmRjcW9na2lpdWxzc21sZ2lvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk2OTI5OCwiZXhwIjoyMDk0NTQ1Mjk4fQ.9YTv3IRuaMxa0-so2FHieQK500yQ1QWFPVELlkgWFAw';

const admin = createClient(supabaseUrl, serviceKey);

async function migrate() {
  const { error } = await admin.rpc('exec_sql', {
    query: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;'
  });
  
  if (error) {
    // Coba langsung via SQL (beberapa versi Supabase pakai endpoint berbeda)
    console.log('rpc tidak tersedia, coba cara lain...');
    // Verifikasi kolom sudah ada atau belum dengan select
    const { data, error: e2 } = await admin.from('products').select('image_url').limit(1);
    if (e2 && e2.message.includes('image_url')) {
      console.log('Kolom image_url BELUM ada. Perlu tambah manual di Supabase SQL Editor.');
      console.log('Jalankan SQL ini:\nALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;');
    } else {
      console.log('Kolom image_url sudah ada! ✅');
    }
  } else {
    console.log('Migrasi berhasil: kolom image_url ditambahkan ✅');
  }
}

migrate();
