// Fungsi-fungsi pembantu utilitas untuk RSJ Tampan Inventory

/**
 * Format tanggal standar Indonesia (contoh: 21 Agustus 2026)
 */
export function formatIndonesianDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Mendapatkan status stok & warna badge
 */
export function getStockStatus(stok) {
  if (stok <= 10) {
    return { label: "Sangat Kritis", badgeClass: "badge-soft-danger", isCritical: true };
  } else if (stok <= 50) {
    return { label: "Menipis", badgeClass: "badge-soft-warning", isCritical: true };
  } else {
    return { label: "Aman", badgeClass: "badge-soft-success", isCritical: false };
  }
}

/**
 * Badge warna kategori barang
 */
export function getCategoryBadgeClass(kategori) {
  switch (kategori) {
    case "Alat Medis":
      return "badge-soft-primary";
    case "Obat Farmasi":
      return "badge-soft-success";
    case "ATK":
      return "badge-soft-secondary";
    case "Bahan Habis Pakai":
      return "badge-soft-info";
    default:
      return "badge-soft-dark";
  }
}

