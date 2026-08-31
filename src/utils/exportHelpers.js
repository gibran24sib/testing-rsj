// Utilitas ekspor data CSV dan pencetakan dokumen inventaris RSJ Tampan

/**
 * Ekspor data inventaris ke format CSV
 */
export function exportInventoryToCSV(inventory) {
  if (!inventory || !inventory.length) {
    alert("Tidak ada data inventaris untuk diekspor.");
    return;
  }

  const headers = ["Kode ID", "Nama Barang", "Kategori", "Jumlah Stok", "Satuan", "Kondisi"];
  const rows = inventory.map((item) => [
    item.id,
    `"${item.nama.replace(/"/g, '""')}"`,
    `"${item.kategori}"`,
    item.stok,
    item.satuan,
    item.kondisi,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Laporan_Inventaris_RSJ_Tampan_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ekspor data mutasi ke format CSV
 */
export function exportMutationsToCSV(mutations) {
  if (!mutations || !mutations.length) {
    alert("Tidak ada data mutasi untuk diekspor.");
    return;
  }

  const headers = [
    "Tanggal",
    "Kode Barang",
    "Nama Barang",
    "Jenis Mutasi",
    "Jumlah",
    "Satuan",
    "Asal/Tujuan",
    "Kondisi",
    "Petugas",
  ];
  const rows = mutations.map((item) => [
    item.tanggal,
    item.kode,
    `"${item.nama.replace(/"/g, '""')}"`,
    item.jenis,
    item.jumlah,
    item.satuan,
    `"${item.asalTujuan.replace(/"/g, '""')}"`,
    item.kondisi,
    `"${item.petugas.replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Laporan_Mutasi_Logistik_RSJ_Tampan_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
