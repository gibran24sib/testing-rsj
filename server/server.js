import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// UPLOAD DIRECTORY
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// MULTER CONFIGURATION FOR DIRECT DEVICE FILE UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
});

// DATABASE POOL CONFIGURATION
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rsj_tampan_sdm",
  waitForConnections: true,
  connectionLimit: 10,
};

let db = null;
let useMySql = false;

// IN-MEMORY FALLBACK STORE (IF MYSQL SERVER IS OFFLINE)
let memoryStore = {
  pegawai: [],
  dossiers: [],
  presensi: [],
  cuti: [],
};

// CHECK DATABASE CONNECTION
try {
  const pool = mysql.createPool(dbConfig);
  await pool.getConnection();
  db = pool;
  useMySql = true;
  console.log("✅ Terhubung ke MySQL Database (rsj_tampan_sdm)");
} catch (err) {
  console.log("⚠️ MySQL belum aktif di port 3306. Server beralih otomatis ke In-Memory Storage.");
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

// 1. HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "SIM-SDM RSJ Tampan API Server",
    database: useMySql ? "MySQL Active" : "In-Memory / Standalone Active",
    timestamp: new Date().toISOString(),
  });
});

// 2. GET SEMUA PEGAWAI
app.get("/api/pegawai", async (req, res) => {
  try {
    if (useMySql) {
      const [rows] = await db.query("SELECT * FROM pegawai ORDER BY created_at DESC");
      return res.json({ success: true, data: rows });
    }
    res.json({ success: true, data: memoryStore.pegawai });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. POST PEGAWAI BARU
app.post("/api/pegawai", async (req, res) => {
  const emp = req.body;
  try {
    if (useMySql) {
      const query = `
        INSERT INTO pegawai (id, nip, nama, gelar_depan, gelar_belakang, profesi, kategori, jabatan, unit_penempatan, status_kepegawaian, golongan, pendidikan, email, no_hp, alamat, tanggal_bergabung, sisa_cuti, skp_skor) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)
      `;
      await db.query(query, [
        emp.id,
        emp.nip,
        emp.nama,
        emp.gelarDepan || "",
        emp.gelarBelakang || "",
        emp.profesi,
        emp.kategori,
        emp.jabatan,
        emp.unitPenempatan,
        emp.statusKepegawaian,
        emp.golongan || "-",
        emp.pendidikan,
        emp.email,
        emp.noHp,
        emp.alamat,
        emp.sisaCuti || 12,
        emp.skpSkor || 90.0,
      ]);
    } else {
      memoryStore.pegawai.push(emp);
    }
    res.status(201).json({ success: true, message: `Pegawai ${emp.nama} berhasil ditambahkan!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. POST UPLOAD E-BERKAS DARI DEVICE PEGAWAI
app.post("/api/dossier/upload", upload.single("berkas"), async (req, res) => {
  try {
    const { pegawai_id, nama_dokumen, kategori_dokumen } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Tidak ada berkas yang dipilih dari device." });
    }

    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb < 1024 ? `${sizeInKb.toFixed(1)} KB` : `${(sizeInKb / 1024).toFixed(1)} MB`;
    const tipeFile = path.extname(file.originalname).replace(".", "").toUpperCase() || "PDF";
    const fileRelativeUrl = `/uploads/${file.filename}`;

    const docRecord = {
      id: `DOC-${Date.now()}`,
      pegawai_id,
      nama_dokumen: nama_dokumen || file.originalname,
      kategori_dokumen: kategori_dokumen || "Dokumen Kepegawaian",
      tipe_file: tipeFile,
      ukuran_file: formattedSize,
      file_path: fileRelativeUrl,
      status_verifikasi: "Terverifikasi",
      uploaded_at: new Date().toISOString(),
    };

    if (useMySql) {
      const query = `
        INSERT INTO dossier_berkas (pegawai_id, nama_dokumen, kategori_dokumen, tipe_file, ukuran_file, file_path, status_verifikasi) 
        VALUES (?, ?, ?, ?, ?, ?, 'Terverifikasi')
      `;
      await db.query(query, [
        pegawai_id,
        docRecord.nama_dokumen,
        docRecord.kategori_dokumen,
        tipeFile,
        formattedSize,
        fileRelativeUrl,
      ]);
    } else {
      memoryStore.dossiers.push(docRecord);
    }

    res.status(201).json({
      success: true,
      message: `Berkas "${docRecord.nama_dokumen}" berhasil diunggah!`,
      data: docRecord,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. GET DOSSIER PER PEGAWAI
app.get("/api/dossier/:pegawai_id", async (req, res) => {
  try {
    if (useMySql) {
      const [rows] = await db.query(
        "SELECT * FROM dossier_berkas WHERE pegawai_id = ? ORDER BY uploaded_at DESC",
        [req.params.pegawai_id]
      );
      return res.json({ success: true, data: rows });
    }
    const filtered = memoryStore.dossiers.filter((d) => d.pegawai_id === req.params.pegawai_id);
    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. POST E-PRESENSI SHIFT
app.post("/api/presensi", async (req, res) => {
  const { pegawai_id, shift_nama, status_kehadiran, keterlambatan_menit, lokasi_gps, catatan_handover } = req.body;
  try {
    const presensiRecord = {
      id: `ATT-${Date.now()}`,
      pegawai_id,
      shift_nama,
      tanggal: new Date().toISOString().split("T")[0],
      jam_masuk: new Date().toLocaleTimeString("id-ID"),
      status_kehadiran: status_kehadiran || "Hadir Tepat Waktu",
      keterlambatan_menit: keterlambatan_menit || 0,
      lokasi_gps: lokasi_gps || "0.4578° N, 101.3789° E",
      catatan_handover: catatan_handover || "",
    };

    if (useMySql) {
      const query = `
        INSERT INTO presensi_shift (pegawai_id, shift_nama, tanggal, jam_masuk, status_kehadiran, keterlambatan_menit, lokasi_gps, catatan_handover)
        VALUES (?, ?, CURDATE(), CURTIME(), ?, ?, ?, ?)
      `;
      await db.query(query, [
        pegawai_id,
        shift_nama,
        presensiRecord.status_kehadiran,
        presensiRecord.keterlambatan_menit,
        presensiRecord.lokasi_gps,
        presensiRecord.catatan_handover,
      ]);
    } else {
      memoryStore.presensi.push(presensiRecord);
    }

    res.status(201).json({ success: true, message: "Presensi shift berhasil direkam!", data: presensiRecord });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Backend SIM-SDM RSJ Tampan aktif di: http://localhost:${PORT}`);
});
