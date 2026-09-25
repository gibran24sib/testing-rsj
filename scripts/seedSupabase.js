import { createClient } from "@supabase/supabase-js";
import {
  initialEmployees,
  initialLeaveRequests,
  initialShiftRoster,
  initialTrainings,
  initialCredentials,
  initialDossiers,
  doctorSchedules,
  orgStructureData,
} from "../src/data/sdmData.js";

const SUPABASE_URL = "https://tvnnsnzixhybuyktfynh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bm5zbnppeGh5YnV5a3RmeW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzM3NDUsImV4cCI6MjEwMzgwOTc0NX0.rqAo4fVAC9AkyJST1zfYDnYPklUEbVi03DAmH_XZb2I";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runSeed() {
  console.log("=================================================");
  console.log("🚀 MEMULAI PROSES MIGRASI & SEEDING KE SUPABASE");
  console.log("Database: " + SUPABASE_URL);
  console.log("=================================================");

  // 1. SEED EMPLOYEES
  console.log("\n📦 1. Mengunggah Data Pegawai (employees)...");
  try {
    for (const emp of initialEmployees) {
      const { error } = await supabase
        .from("employees")
        .upsert([emp], { onConflict: "id" });
      if (error) {
        console.warn(`⚠️ [Employees] Gagal upsert ${emp.id}:`, error.message);
      } else {
        console.log(`✅ [Employees] Berhasil: ${emp.id} - ${emp.nama}`);
      }
    }
  } catch (err) {
    console.error("Error pada employees:", err);
  }

  // 2. SEED LEAVE REQUESTS
  console.log("\n🏖️ 2. Mengunggah Data Cuti (leave_requests)...");
  try {
    for (const cuti of initialLeaveRequests) {
      const record = {
        id: cuti.id,
        employee_id: cuti.employeeId || cuti.idPegawai || "EMP-005",
        nip: cuti.nip || "-",
        nama: cuti.nama,
        profesi: cuti.profesi || "Tenaga Kesehatan",
        unit: cuti.unit || "Unit Pelayanan RSJ Tampan",
        username: cuti.username || "nakes",
        jenis_cuti: cuti.jenisCuti,
        tanggal_mulai: cuti.tanggalMulai,
        tanggal_selesai: cuti.tanggalSelesai,
        jumlah_hari: cuti.jumlahHari || 3,
        alasan: cuti.alasan || "Keperluan Pribadi",
        petugas_pengganti: cuti.petugasPengganti || "-",
        catatan_tambahan: cuti.catatan || "",
        tanggal_pengajuan: cuti.tanggalPengajuan || new Date().toISOString().split("T")[0],
        status: cuti.status || "Menunggu Persetujuan",
        disetujui_oleh: cuti.disetujuiOleh || "-",
        catatan: cuti.catatan || "-",
      };
      const { error } = await supabase
        .from("leave_requests")
        .upsert([record], { onConflict: "id" });
      if (error) {
        console.warn(`⚠️ [LeaveRequests] Gagal upsert ${cuti.id}:`, error.message);
      } else {
        console.log(`✅ [LeaveRequests] Berhasil: ${cuti.id} - ${cuti.nama} (${cuti.jenisCuti})`);
      }
    }
  } catch (err) {
    console.error("Error pada leave_requests:", err);
  }

  // 3. STATISTIK HASIL
  const { data: empCount } = await supabase.from("employees").select("id");
  const { data: cutiCount } = await supabase.from("leave_requests").select("id");
  const { data: profCount } = await supabase.from("profiles").select("id");

  console.log("\n=================================================");
  console.log("🎉 STATUS DATABASE SUPABASE TERBARU:");
  console.log(`- Total Pegawai (employees)     : ${empCount?.length || 0} Data`);
  console.log(`- Total Pengajuan Cuti (cuti)   : ${cutiCount?.length || 0} Data`);
  console.log(`- Total Profil User (profiles)  : ${profCount?.length || 0} Data`);
  console.log("=================================================");
  console.log("✅ Seluruh data coding lokal telah sinkron dengan cloud Supabase!");
}

runSeed();
