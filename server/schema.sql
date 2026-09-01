-- ============================================================================
-- SKEMA DATABASE MYSQL - SIM-SDM & KEPEGAWAIAN RS JIWA TAMPAN PROVINSI RIAU
-- ============================================================================

CREATE DATABASE IF NOT EXISTS rsj_tampan_sdm 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE rsj_tampan_sdm;

-- 1. TABEL MASTER PEGAWAI & NAKES
CREATE TABLE IF NOT EXISTS pegawai (
    id VARCHAR(20) PRIMARY KEY, -- Contoh: 'EMP-001'
    nip VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    gelar_depan VARCHAR(30) DEFAULT '',
    gelar_belakang VARCHAR(50) DEFAULT '',
    profesi VARCHAR(80) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    unit_penempatan VARCHAR(100) NOT NULL,
    status_kepegawaian VARCHAR(30) NOT NULL,
    golongan VARCHAR(20) DEFAULT '-',
    pendidikan VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    no_hp VARCHAR(25),
    alamat TEXT,
    tanggal_bergabung DATE,
    sisa_cuti INT DEFAULT 12,
    skp_skor DECIMAL(5,2) DEFAULT 90.00,
    foto VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    status_aktif VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL LEGALITAS STR & SIP/SIPP NAKES
CREATE TABLE IF NOT EXISTS legalitas_izin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id VARCHAR(20) NOT NULL,
    jenis_dokumen VARCHAR(20) NOT NULL, -- 'STR', 'SIP', 'SIPP', 'STRA'
    nomor_dokumen VARCHAR(80) NOT NULL,
    masa_berlaku DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Aktif',
    file_dokumen VARCHAR(255),
    FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TABEL E-PRESENSI SHIFT DINAS
CREATE TABLE IF NOT EXISTS presensi_shift (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id VARCHAR(20) NOT NULL,
    shift_nama VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_pulang TIME,
    status_kehadiran VARCHAR(50) DEFAULT 'Hadir Tepat Waktu',
    keterlambatan_menit INT DEFAULT 0,
    lokasi_gps VARCHAR(150),
    foto_swafoto VARCHAR(255),
    catatan_handover TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TABEL MANAJEMEN CUTI PEGAWAI
CREATE TABLE IF NOT EXISTS pengajuan_cuti (
    id VARCHAR(30) PRIMARY KEY,
    pegawai_id VARCHAR(20) NOT NULL,
    jenis_cuti VARCHAR(50) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    jumlah_hari INT NOT NULL,
    alasan TEXT NOT NULL,
    petugas_pengganti VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'Menunggu Persetujuan',
    disetujui_oleh VARCHAR(150) DEFAULT '-',
    tanggal_pengajuan DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. TABEL E-BERKAS / DIGITAL DOSSIER DOKUMEN PEGAWAI
CREATE TABLE IF NOT EXISTS dossier_berkas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pegawai_id VARCHAR(20) NOT NULL,
    nama_dokumen VARCHAR(150) NOT NULL,
    kategori_dokumen VARCHAR(50) DEFAULT 'Dokumen Kepegawaian',
    tipe_file VARCHAR(10) NOT NULL, -- 'PDF', 'DOCX', 'JPG', 'PNG'
    ukuran_file VARCHAR(20) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    status_verifikasi VARCHAR(30) DEFAULT 'Terverifikasi',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pegawai_id) REFERENCES pegawai(id) ON DELETE CASCADE
) ENGINE=InnoDB;
