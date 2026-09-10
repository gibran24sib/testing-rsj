-- ============================================================================
-- SKEMA TABEL PUBLIC.PROFILES & ATURAN RLS SUPABASE AUTH
-- SIM-SDM RS JIWA TAMPAN PEKANBARU
-- ============================================================================

-- 1. Buat tabel public.profiles untuk menyimpan metadata profil user
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    nama TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Perawat Pelaksana',
    nip TEXT,
    unit TEXT,
    profesi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS) pada tabel profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy lama jika sudah ada
DROP POLICY IF EXISTS "Semua orang dapat membaca profil publik" ON public.profiles;
DROP POLICY IF EXISTS "User dapat membuat profil sendiri" ON public.profiles;
DROP POLICY IF EXISTS "User dapat memperbarui profil sendiri" ON public.profiles;

-- 4. Kebijakan SELECT: Semua user terotentikasi & anonim dapat membaca data profil (untuk lookup username & direktori)
CREATE POLICY "Semua orang dapat membaca profil publik"
ON public.profiles
FOR SELECT
USING (true);

-- 5. Kebijakan INSERT: User terotentikasi / proses register dapat menyimpan profilnya
CREATE POLICY "User dapat membuat profil sendiri"
ON public.profiles
FOR INSERT
WITH CHECK (
    auth.uid() = id 
    OR 
    auth.role() IN ('authenticated', 'anon', 'service_role')
);

-- 6. Kebijakan UPDATE: User dapat memperbarui profilnya sendiri atau Admin/HRD dapat memperbarui data
CREATE POLICY "User dapat memperbarui profil sendiri"
ON public.profiles
FOR UPDATE
USING (
    auth.uid() = id
    OR
    (auth.jwt() ->> 'role') IN ('admin', 'hrd', 'kasubbag', 'service_role')
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%admin%'
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%hrd%'
);

-- 7. Trigger Otomatis saat user baru dibuat di auth.users (Opsional tapi sangat direkomendasikan)
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

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
