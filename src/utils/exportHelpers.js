// Utilitas Ekspor Data CSV untuk SIM-SDM RSJ Tampan

/**
 * Ekspor data pegawai ke format CSV
 */
export function exportEmployeesToCSV(employees) {
  if (!employees || !employees.length) {
    alert("Tidak ada data pegawai untuk diekspor.");
    return;
  }

  const headers = [
    "ID Pegawai",
    "NIP/NRK",
    "Nama Lengkap",
    "Profesi",
    "Kategori",
    "Jabatan",
    "Unit Penempatan",
    "Status Kepegawaian",
    "Golongan",
    "Pendidikan",
    "Email",
    "No HP",
    "No STR",
    "Masa Berlaku STR",
    "Status STR",
    "No SIP",
    "Masa Berlaku SIP",
    "Status SIP",
    "Sisa Cuti",
    "Skor SKP",
  ];

  const rows = employees.map((emp) => [
    emp.id,
    `"${emp.nip}"`,
    `"${emp.nama.replace(/"/g, '""')}"`,
    `"${emp.profesi}"`,
    `"${emp.kategori}"`,
    `"${emp.jabatan.replace(/"/g, '""')}"`,
    `"${emp.unitPenempatan}"`,
    `"${emp.statusKepegawaian}"`,
    `"${emp.golongan}"`,
    `"${emp.pendidikan}"`,
    `"${emp.email}"`,
    `"${emp.noHp}"`,
    `"${emp.str?.nomor || "-"}"`,
    `"${emp.str?.masaBerlaku || "-"}"`,
    `"${emp.str?.status || "-"}"`,
    `"${emp.sip?.nomor || "-"}"`,
    `"${emp.sip?.masaBerlaku || "-"}"`,
    `"${emp.sip?.status || "-"}"`,
    emp.sisaCuti,
    emp.skpSkor,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Data_Pegawai_RSJ_Tampan_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ekspor riwayat cuti pegawai ke format CSV
 */
export function exportLeavesToCSV(leaves) {
  if (!leaves || !leaves.length) {
    alert("Tidak ada data cuti untuk diekspor.");
    return;
  }

  const headers = [
    "No Pengajuan",
    "ID Pegawai",
    "Nama Pegawai",
    "Profesi",
    "Unit Kerja",
    "Jenis Cuti",
    "Tanggal Mulai",
    "Tanggal Selesai",
    "Durasi (Hari)",
    "Alasan",
    "Petugas Pengganti",
    "Status",
    "Disetujui Oleh",
  ];

  const rows = leaves.map((item) => [
    item.id,
    item.employeeId,
    `"${item.nama.replace(/"/g, '""')}"`,
    `"${item.profesi}"`,
    `"${item.unit}"`,
    `"${item.jenisCuti}"`,
    item.tanggalMulai,
    item.tanggalSelesai,
    item.jumlahHari,
    `"${item.alasan.replace(/"/g, '""')}"`,
    `"${item.petugasPengganti.replace(/"/g, '""')}"`,
    `"${item.status}"`,
    `"${item.disetujuiOleh}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Rekap_Cuti_Pegawai_RSJ_Tampan_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
