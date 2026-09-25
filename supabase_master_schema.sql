-- ============================================================================
-- MASTER DATABASE SCHEMA & SEED DATA - SIM-SDM RS JIWA TAMPAN PROVINSI RIAU
-- Platform: Supabase PostgreSQL (Database, Auth, Storage & Row Level Security)
-- ============================================================================

-- ============================================================================
-- 1. TABEL PROFIL USER (PUBLIC.PROFILES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    nama TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Perawat Pelaksana',
    nip TEXT,
    unit TEXT,
    profesi TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profil publik dapat dibaca semua user" ON public.profiles;
CREATE POLICY "Profil publik dapat dibaca semua user" ON public.profiles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "User dapat mengelola profil sendiri" ON public.profiles;
CREATE POLICY "User dapat mengelola profil sendiri" ON public.profiles
FOR ALL USING (auth.uid() = id OR auth.role() IN ('authenticated', 'anon', 'service_role'));

-- ============================================================================
-- 2. TABEL PEGAWAI & NAKES (PUBLIC.EMPLOYEES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    nip TEXT NOT NULL,
    nama TEXT NOT NULL,
    gelar_depan TEXT,
    gelar_belakang TEXT,
    profesi TEXT NOT NULL,
    kategori TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    unit_penempatan TEXT NOT NULL,
    status_kepegawaian TEXT NOT NULL,
    golongan TEXT,
    pendidikan TEXT,
    email TEXT,
    no_hp TEXT,
    alamat TEXT,
    tanggal_bergabung DATE,
    sisa_cuti INTEGER DEFAULT 12,
    skp_skor NUMERIC(5,2) DEFAULT 90.0,
    foto TEXT,
    status_aktif TEXT DEFAULT 'Aktif',
    str JSONB DEFAULT '{}'::jsonb,
    sip JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Data pegawai dapat dibaca umum/terotentikasi" ON public.employees;
CREATE POLICY "Data pegawai dapat dibaca umum/terotentikasi" ON public.employees
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin dapat memodifikasi data pegawai" ON public.employees;
CREATE POLICY "Admin dapat memodifikasi data pegawai" ON public.employees
FOR ALL USING (auth.role() IN ('authenticated', 'anon', 'service_role'));

-- ============================================================================
-- 3. TABEL PENGAJUAN CUTI (PUBLIC.LEAVE_REQUESTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    nip TEXT,
    nama TEXT NOT NULL,
    profesi TEXT,
    unit TEXT,
    username TEXT,
    jenis_cuti TEXT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    jumlah_hari INTEGER NOT NULL DEFAULT 1,
    alasan TEXT NOT NULL,
    petugas_pengganti TEXT,
    catatan_tambahan TEXT,
    tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Menunggu Persetujuan',
    disetujui_oleh TEXT DEFAULT '-',
    catatan TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses cuti terintegrasi SIM-SDM" ON public.leave_requests;
CREATE POLICY "Akses cuti terintegrasi SIM-SDM" ON public.leave_requests
FOR ALL USING (true);

-- ============================================================================
-- 4. TABEL E-DOSSIER / ARSIP BERKAS DIGITAL (PUBLIC.DOSSIERS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dossiers (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    nama_pegawai TEXT NOT NULL,
    nip TEXT,
    persentase_lengkap INTEGER DEFAULT 85,
    dokumen JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses dossier terintegrasi" ON public.dossiers;
CREATE POLICY "Akses dossier terintegrasi" ON public.dossiers
FOR ALL USING (true);

-- ============================================================================
-- 5. TABEL ROSTER SHIFT BANGSAL JIWA (PUBLIC.SHIFT_ROSTERS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shift_rosters (
    id TEXT PRIMARY KEY,
    tanggal DATE NOT NULL,
    ruangan TEXT NOT NULL,
    shift TEXT NOT NULL, -- Pagi, Sore, Malam, Middle
    jam_dinas TEXT NOT NULL,
    penanggung_jawab TEXT NOT NULL,
    nip_pj TEXT,
    jumlah_petugas INTEGER DEFAULT 3,
    status_shift TEXT DEFAULT 'Terjadwal',
    petugas JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shift_rosters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses shift roster terintegrasi" ON public.shift_rosters;
CREATE POLICY "Akses shift roster terintegrasi" ON public.shift_rosters
FOR ALL USING (true);

-- ============================================================================
-- 6. TABEL E-PRESENSI GEOLOCATION & SWAFOTO (PUBLIC.ATTENDANCE_LOGS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    nip TEXT,
    nama TEXT NOT NULL,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    shift TEXT NOT NULL,
    jam_masuk TIME NOT NULL,
    jam_pulang TIME,
    status_kehadiran TEXT NOT NULL, -- Tepat Waktu, Terlambat, Dinas Luar
    lokasi_gps TEXT,
    foto_presensi TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses absensi terintegrasi" ON public.attendance_logs;
CREATE POLICY "Akses absensi terintegrasi" ON public.attendance_logs
FOR ALL USING (true);

-- ============================================================================
-- 7. TABEL DIKLAT & SERTIFIKASI JIWA (PUBLIC.TRAININGS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trainings (
    id TEXT PRIMARY KEY,
    judul_pelatihan TEXT NOT NULL,
    kategori TEXT NOT NULL,
    penyelenggara TEXT NOT NULL,
    jadwal_mulai DATE NOT NULL,
    jadwal_selesai DATE NOT NULL,
    skp_kemenkes INTEGER DEFAULT 2,
    target_profesi TEXT,
    standar_akreditasi TEXT DEFAULT 'KARS',
    status_pelatihan TEXT DEFAULT 'Selesai',
    peserta JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses diklat terintegrasi" ON public.trainings;
CREATE POLICY "Akses diklat terintegrasi" ON public.trainings
FOR ALL USING (true);

-- ============================================================================
-- 8. TRIGGER OTOMATIS SAAT USER BARU DIBUAT DI SUPABASE AUTH
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, nama, role, nip, unit, profesi)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'full_name', 'Petugas RSJ'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Perawat Pelaksana'),
        COALESCE(NEW.raw_user_meta_data->>'nip', '-'),
        COALESCE(NEW.raw_user_meta_data->>'unit', 'Unit Pelayanan RSJ Tampan'),
        COALESCE(NEW.raw_user_meta_data->>'profesi', NEW.raw_user_meta_data->>'role', 'Tenaga Kesehatan')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        nama = EXCLUDED.nama,
        role = EXCLUDED.role,
        nip = EXCLUDED.nip,
        unit = EXCLUDED.unit,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STATUS: SKEMA SUPABASE MASTER BERHASIL DIBUAT & SIAP DIGUNAKAN
-- ============================================================================
