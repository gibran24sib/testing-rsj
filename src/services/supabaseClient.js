import { createClient } from "@supabase/supabase-js";

// ============================================================================
// KONFIGURASI SUPABASE - SIM-SDM RS JIWA TAMPAN
// ============================================================================

// 1. Tempelkan URL & Anon Key dari Dashboard Supabase Anda di sini:
export const SUPABASE_URL = "https://tvnnsnzixhybuyktfynh.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bm5zbnppeGh5YnV5a3RmeW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzM3NDUsImV4cCI6MjEwMzgwOTc0NX0.rqAo4fVAC9AkyJST1zfYDnYPklUEbVi03DAmH_XZb2I";

// 2. Inisialisasi Klien Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Helper Cek apakah Supabase sudah dikonfigurasi dengan URL & Key asli
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL &&
    !SUPABASE_URL.includes("xxxx") &&
    SUPABASE_KEY &&
    SUPABASE_KEY.length > 20
  );
};

// 4. Fungsi Mengambil Data dari Tabel Supabase (Default: 'employees')
export async function ambilDataSupabase(namaTabel = "employees") {
  if (!isSupabaseConfigured()) {
    console.info(`[Supabase Info] URL / Key belum dikonfigurasi. Menggunakan data lokal.`);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(namaTabel)
      .select("*");

    if (error) {
      console.error(`Gagal mengambil data dari tabel "${namaTabel}":`, error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Koneksi Supabase error:", err);
    return null;
  }
}

// 5. Fungsi Menambah Data ke Tabel Supabase (Default: 'employees')
export async function tambahDataSupabase(namaTabel = "employees", record = {}) {
  if (!isSupabaseConfigured()) {
    return { success: true, local: true };
  }

  try {
    const { data, error } = await supabase
      .from(namaTabel)
      .insert([record])
      .select();

    if (error) {
      console.error(`Gagal menambah data ke tabel "${namaTabel}":`, error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Koneksi Supabase error:", err);
    return { success: false, error: err };
  }
}