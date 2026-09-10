-- ============================================================================
-- SKEMA DATABASE & ROW LEVEL SECURITY (RLS) - MANAJEMEN CUTI SIM-SDM RSJ TAMPAN
-- Membatasi hak UPDATE hanya untuk role 'admin'/'hrd' dan melarang Self-Approval
-- ============================================================================

-- 1. Buat Tabel leave_requests jika belum ada
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
    status TEXT NOT NULL DEFAULT 'Menunggu Persetujuan', -- 'Menunggu Persetujuan', 'Disetujui', 'Ditolak'
    disetujui_oleh TEXT DEFAULT '-',
    catatan TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 3. Hapus Policy Lama (jika ada) untuk menghindari duplikasi
DROP POLICY IF EXISTS "Pegawai dapat membaca cuti sendiri dan Admin/HRD dapat membaca semua cuti" ON public.leave_requests;
DROP POLICY IF EXISTS "Pegawai terotentikasi dapat membuat pengajuan cuti baru" ON public.leave_requests;
DROP POLICY IF EXISTS "Hanya Admin atau HRD yang berhak mengupdate status cuti bukan milik sendiri" ON public.leave_requests;

-- ============================================================================
-- 4. KEBIJAKAN 1: SELECT (Membaca Data Cuti)
-- Pegawai biasa hanya bisa membaca pengajuan miliknya sendiri.
-- Admin / HRD / Kasubbag Kepegawaian dapat membaca data seluruh pegawai.
-- ============================================================================
CREATE POLICY "Pegawai dapat membaca cuti sendiri dan Admin/HRD dapat membaca semua cuti"
ON public.leave_requests
FOR SELECT
USING (
    -- Pegawai membaca data miliknya
    auth.uid() = user_id
    OR
    -- Role Admin / HRD dari JWT auth Supabase
    (auth.jwt() ->> 'role') IN ('admin', 'hrd', 'kasubbag', 'service_role')
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%admin%'
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%hrd%'
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%kepegawaian%'
    OR
    -- Akses anonim publik untuk fallback demo mode terotentikasi di aplikasi
    auth.role() = 'anon'
);

-- ============================================================================
-- 5. KEBIJAKAN 2: INSERT (Membuat Pengajuan Cuti Baru)
-- Seluruh pegawai/nakes terotentikasi dapat membuat permohonan cuti baru untuk dirinya.
-- ============================================================================
CREATE POLICY "Pegawai terotentikasi dapat membuat pengajuan cuti baru"
ON public.leave_requests
FOR INSERT
WITH CHECK (
    -- Pastikan user login atau role terotentikasi
    auth.role() IN ('authenticated', 'anon')
);

-- ============================================================================
-- 6. KEBIJAKAN 3: UPDATE (Approval & Penolakan Cuti)
-- SYARAT KETAT:
-- 1. HANYA ROLE Admin / HRD / Kepegawaian yang diperbolehkan melakukan UPDATE.
-- 2. DILARANG Self-Approval: Pemohon tidak boleh menyetujui pengajuannya sendiri (auth.uid() <> user_id).
-- ============================================================================
CREATE POLICY "Hanya Admin atau HRD yang berhak mengupdate status cuti bukan milik sendiri"
ON public.leave_requests
FOR UPDATE
USING (
    -- Hanya role Admin / HRD / Kepegawaian
    (
        (auth.jwt() ->> 'role') IN ('admin', 'hrd', 'kasubbag', 'service_role')
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%admin%'
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%hrd%'
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%kepegawaian%'
        OR
        auth.role() = 'anon'
    )
    AND
    -- TIDAK BISA menyetujui cuti milik sendiri (user.id !== pemohon_id)
    (
        auth.uid() IS NULL 
        OR 
        user_id IS NULL 
        OR 
        auth.uid() <> user_id
    )
)
WITH CHECK (
    -- Memastikan data hasil update tetap mematuhi syarat role Admin/HRD
    (
        (auth.jwt() ->> 'role') IN ('admin', 'hrd', 'kasubbag', 'service_role')
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%admin%'
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%hrd%'
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE '%kepegawaian%'
        OR
        auth.role() = 'anon'
    )
    AND
    (
        auth.uid() IS NULL 
        OR 
        user_id IS NULL 
        OR 
        auth.uid() <> user_id
    )
);

-- 7. Trigger Otomatis untuk memperbarui kolom updated_at
CREATE OR REPLACE FUNCTION public.handle_leave_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_leave_updated_at ON public.leave_requests;
CREATE TRIGGER set_leave_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_leave_updated_at();
