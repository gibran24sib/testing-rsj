import { createClient } from "@supabase/supabase-js";

// ============================================================================
// KONFIGURASI SUPABASE CLIENT - SIM-SDM RS JIWA TAMPAN
// HANYA MENGGUNAKAN ANON KEY (PUBLISHABLE KEY) DI SISI CLIENT / FRONTEND.
// DILARANG MENGGUNAKAN SERVICE ROLE KEY KARENA DAPAT MENEMBUS RLS DATABASE.
// ============================================================================

// 1. SUPABASE URL & ANON KEY (Mendukung environment variables Next.js / Vite / Default)
export const NEXT_PUBLIC_SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://tvnnsnzixhybuyktfynh.supabase.co";

export const NEXT_PUBLIC_SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== "undefined" && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bm5zbnppeGh5YnV5a3RmeW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzM3NDUsImV4cCI6MjEwMzgwOTc0NX0.rqAo4fVAC9AkyJST1zfYDnYPklUEbVi03DAmH_XZb2I";

// Validasi Keamanan: Pastikan BUKAN Service Role Key yang dipakai di frontend
if (NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("service_role")) {
  console.error("KEAMANAN KRITIS: JANGAN gunakan SUPABASE_SERVICE_ROLE_KEY di frontend browser!");
}

// Alias untuk kompatibilitas
export const SUPABASE_URL = NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. Inisialisasi Klien Supabase dengan Anon Key
export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 3. Helper Cek apakah Supabase sudah dikonfigurasi dengan URL & Anon Key asli
export const isSupabaseConfigured = () => {
  return (
    NEXT_PUBLIC_SUPABASE_URL &&
    !NEXT_PUBLIC_SUPABASE_URL.includes("xxxx") &&
    NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20
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

// ============================================================================
// 6. FUNGSI KHUSUS MANAJEMEN CUTI DENGAN VALIDASI ROLE & KEBIJAKAN RLS
// ============================================================================

/**
 * Mengambil data cuti dari Supabase
 * @param {string|null} employeeId - Jika diisi, hanya ambil data milik pegawai tertentu (mode Nakes)
 */
export async function ambilDataCutiSupabase(employeeId = null) {
  if (!isSupabaseConfigured()) return null;

  try {
    let query = supabase.from("leave_requests").select("*");
    if (employeeId) {
      query = query.eq("employeeId", employeeId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Gagal membaca data cuti dari Supabase:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Koneksi Supabase cuti error:", err);
    return null;
  }
}

/**
 * Mengajukan permohonan cuti baru ke Supabase
 * @param {Object} leavePayload
 */
export async function tambahCutiSupabase(leavePayload) {
  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .insert([leavePayload])
      .select();

    if (error) {
      console.warn("Supabase tambah cuti gagal, menggunakan mode lokal:", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn("Supabase tambah cuti error:", err);
    return { success: false, error: err };
  }
}

/**
 * Memperbarui Status Cuti (Approve / Reject) di Supabase
 * SYARAT VALIDASI:
 * 1. User wajib memiliki role Admin / HRD.
 * 2. User TIDAK BISA menyetujui pengajuan cutinya sendiri (user.id !== pemohon_id).
 * 
 * @param {string} leaveId - ID pengajuan cuti (misal: 'CUTI-2026-001')
 * @param {string} status - 'Disetujui' | 'Ditolak'
 * @param {string} disetujuiOleh - Nama pejabat verifikator
 * @param {string} catatan - Catatan telaah
 * @param {Object} currentUser - Objek user yang sedang login
 * @param {Object} targetLeave - Objek data cuti yang akan diubah
 */
export async function updateStatusCutiSupabase({
  leaveId,
  status,
  disetujuiOleh,
  catatan,
  currentUser,
  targetLeave,
}) {
  // 1. Validasi Role Admin/HRD di sisi client
  const role = (currentUser?.role || "").toLowerCase();
  const username = (currentUser?.username || "").toLowerCase();
  const isAdmin =
    username === "admin" ||
    role === "admin" ||
    role === "hrd" ||
    role.includes("admin") ||
    role.includes("hrd") ||
    role.includes("kepegawaian") ||
    role.includes("kasubbag");

  if (!isAdmin) {
    return {
      success: false,
      error: new Error("Akses Ditolak: Hanya Admin atau HRD yang berhak menyetujui/menolak pengajuan cuti."),
    };
  }

  // 2. Validasi Pencegahan Self-Approval (Pemohon tidak boleh menyetujui cuti sendiri)
  if (targetLeave) {
    const isSelf =
      (currentUser?.nama && targetLeave?.nama && currentUser.nama.toLowerCase() === targetLeave.nama.toLowerCase()) ||
      (currentUser?.nip && targetLeave?.nip && currentUser.nip.replace(/\s+/g, "") === targetLeave.nip.replace(/\s+/g, "")) ||
      (currentUser?.employeeId && targetLeave?.employeeId && currentUser.employeeId === targetLeave.employeeId);

    if (isSelf) {
      return {
        success: false,
        error: new Error("Akses Ditolak: Anda tidak dapat menyetujui pengajuan cuti Anda sendiri. Wajib melalui atasan/pimpinan."),
      };
    }
  }

  if (!isSupabaseConfigured()) {
    return { success: true, localOnly: true };
  }

  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .update({
        status: status,
        disetujuiOleh: disetujuiOleh,
        catatan: catatan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leaveId)
      .select();

    if (error) {
      console.warn("Supabase update cuti ditolak / error:", error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.warn("Supabase update cuti exception:", err);
    return { success: false, error: err };
  }
}

// ============================================================================
// 7. FUNGSI AUTENTIKASI (SUPABASE AUTH + PROFILES SYNC)
// ============================================================================

/**
 * Mendaftarkan akun baru ke Supabase Auth dan menyimpan data ke public.profiles
 * @param {Object} param0
 * @param {string} param0.email - Email pengguna
 * @param {string} param0.password - Password pengguna (min 6 karakter)
 * @param {string} param0.nama - Nama lengkap dan gelar
 * @param {string} param0.role - Jabatan/peran nakes (misal: 'Perawat Pelaksana', 'Dokter Spesialis Jiwa', 'Kasubbag Kepegawaian & SDM')
 * @param {string} param0.nip - NIP / NRK pegawai
 * @param {string} param0.unit - Unit penempatan / bangsal
 * @param {string} param0.username - Username pilihan
 */
export async function registerUserSupabase({
  email,
  password,
  nama,
  role = "Perawat Pelaksana",
  nip = "-",
  unit = "Unit Pelayanan RSJ Tampan",
  username = "",
}) {
  const cleanUsername = (username || email.split("@")[0]).trim().toLowerCase();
  const cleanEmail = (
    email && email.includes("@")
      ? email.trim().toLowerCase()
      : `${cleanUsername}@rsjtampan.riau.go.id`
  );

  if (!isSupabaseConfigured()) {
    console.info("[Supabase Info] Supabase belum aktif. Registrasi disimpan secara lokal.");
    return {
      success: true,
      localOnly: true,
      user: {
        id: `local-${Date.now()}`,
        email: cleanEmail,
        username: cleanUsername,
        nama,
        role,
        nip,
        unit,
      },
    };
  }

  try {
    // 1. Buat akun di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          nama,
          role,
          nip,
          unit,
          username: cleanUsername,
          profesi: role,
        },
      },
    });

    if (authError) {
      console.error("Supabase Auth SignUp Error:", authError.message);
      let friendlyMsg = authError.message;
      if (authError.message.includes("already registered") || authError.message.includes("User already exists")) {
        friendlyMsg = "Email atau Username ini sudah terdaftar di sistem. Silakan langsung masuk ke halaman Login.";
      } else if (authError.message.includes("at least 6 characters")) {
        friendlyMsg = "Password minimal 6 karakter demi keamanan akun.";
      } else if (authError.message.includes("valid email")) {
        friendlyMsg = "Format email tidak valid. Mohon periksa kembali.";
      }
      return { success: false, error: new Error(friendlyMsg) };
    }

    const createdUser = authData?.user;

    // 2. Simpan / Sinkronkan profil tambahan ke tabel public.profiles jika ada user ID
    if (createdUser && createdUser.id) {
      try {
        const profilePayload = {
          id: createdUser.id,
          email: cleanEmail,
          username: cleanUsername,
          nama: nama || "Petugas RSJ",
          role: role || "Perawat Pelaksana",
          nip: nip || "-",
          unit: unit || "RSJ Tampan",
          profesi: role || "Tenaga Medis",
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(profilePayload, { onConflict: "id" });

        if (profileError) {
          console.warn("Penyimpanan ke public.profiles ada catatan (trigger DB mungkin sudah memproses):", profileError.message);
        }
      } catch (profErr) {
        console.warn("Gagal upsert manual ke profiles (mungkin sudah dibuat trigger):", profErr);
      }
    }

    const requiresEmailConfirmation = !authData?.session && createdUser && createdUser.identities?.length > 0;

    return {
      success: true,
      user: createdUser,
      session: authData?.session,
      requiresEmailConfirmation,
      profile: {
        id: createdUser?.id,
        email: cleanEmail,
        username: cleanUsername,
        nama,
        role,
        nip,
        unit,
      },
    };
  } catch (err) {
    console.error("Registrasi Supabase exception:", err);
    return {
      success: false,
      error: new Error(err.message || "Gagal menghubungkan ke server registrasi."),
    };
  }
}

/**
 * Login ke Supabase Auth dengan email atau username, dan mengambil data profil lengkap
 * @param {Object} param0
 * @param {string} param0.usernameOrEmail - Username atau email
 * @param {string} param0.password - Password
 */
export async function loginUserSupabase({ usernameOrEmail, password }) {
  const cleanInput = (usernameOrEmail || "").trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      localOnly: true,
      error: new Error("Supabase URL / Key belum aktif. Gunakan akun demo lokal."),
    };
  }

  try {
    let targetEmail = cleanInput;

    // 1. Jika input tidak mengandung '@', lakukan lookup email dari tabel profiles berdasarkan username
    if (!cleanInput.includes("@")) {
      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", cleanInput)
          .maybeSingle();

        if (profileRow && profileRow.email) {
          targetEmail = profileRow.email;
        } else {
          // Fallback ke domain default instansi
          targetEmail = `${cleanInput}@rsjtampan.riau.go.id`;
        }
      } catch {
        targetEmail = `${cleanInput}@rsjtampan.riau.go.id`;
      }
    }

    // 2. Lakukan Autentikasi ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: password,
    });

    if (authError) {
      console.warn("Supabase Auth SignIn Error:", authError.message);
      let friendlyMsg = authError.message;
      if (
        authError.message.includes("Invalid login credentials") ||
        authError.message.includes("invalid_grant") ||
        authError.message.includes("User not found")
      ) {
        friendlyMsg = "Email/Username atau Password tidak sesuai. Silakan periksa kembali.";
      } else if (authError.message.includes("Email not confirmed")) {
        friendlyMsg = "Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda atau hubungi Subbag Kepegawaian.";
      }
      return { success: false, error: new Error(friendlyMsg) };
    }

    const authUser = authData?.user;
    if (!authUser) {
      return { success: false, error: new Error("Gagal memuat informasi sesi user.") };
    }

    // 3. Ambil data profil lengkap dari tabel public.profiles
    let userProfile = null;
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!profileErr && profileData) {
        userProfile = profileData;
      }
    } catch (e) {
      console.warn("Gagal fetch public.profiles, menggunakan metadata:", e);
    }

    // 4. Susun objek user lengkap
    const metadata = authUser.user_metadata || {};
    const finalUser = {
      id: authUser.id,
      email: authUser.email,
      username: userProfile?.username || metadata.username || authUser.email.split("@")[0],
      nama: userProfile?.nama || metadata.nama || metadata.full_name || authUser.email.split("@")[0],
      role: userProfile?.role || metadata.role || "Perawat Pelaksana",
      nip: userProfile?.nip || metadata.nip || "-",
      unit: userProfile?.unit || metadata.unit || "Unit Pelayanan RSJ Tampan",
      profesi: userProfile?.profesi || userProfile?.role || metadata.profesi || metadata.role || "Tenaga Medis",
    };

    return {
      success: true,
      user: finalUser,
      session: authData.session,
    };
  } catch (err) {
    console.error("Login Supabase exception:", err);
    return {
      success: false,
      error: new Error(err.message || "Terjadi kesalahan saat menghubungi server autentikasi."),
    };
  }
}

/**
 * Mengambil profil user berdasarkan user ID dari Supabase
 * @param {string} userId
 */
export async function ambilProfilUserSupabase(userId) {
  if (!isSupabaseConfigured() || !userId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Gagal mengambil profil user:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Error ambilProfilUserSupabase:", err);
    return null;
  }
}

/**
 * Logout dari sesi Supabase Auth
 */
export async function logoutUserSupabase() {
  if (!isSupabaseConfigured()) return { success: true };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Supabase signOut error:", error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.warn("Supabase signOut exception:", err);
    return { success: false, error: err };
  }
}