// Utilitas Format Teks & Angka SIM-SDM RSJ Tampan

/**
 * Format tanggal standar Indonesia (contoh: 21 Agustus 2026)
 */
export function formatIndonesianDate(dateString) {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Mendapatkan status kepatuhan STR/SIP
 */
export function getStrStatusBadge(status) {
  switch (status) {
    case "Aktif":
      return { label: "STR/SIP Aktif", badgeClass: "badge-soft-success", color: "#10b981" };
    case "Mendekati Expired":
      return { label: "Menjelang Expired (<90 Hari)", badgeClass: "badge-soft-warning", color: "#f59e0b" };
    case "Expired":
      return { label: "Kedaluwarsa / Tidak Berlaku", badgeClass: "badge-soft-danger", color: "#ef4444" };
    default:
      return { label: "Non-Nakes", badgeClass: "badge-soft-secondary", color: "#64748b" };
  }
}

/**
 * Badge warna kategori profesi SDM
 */
export function getCategoryBadgeClass(kategori) {
  switch (kategori) {
    case "Medis":
      return "badge-soft-primary";
    case "Keperawatan":
      return "badge-soft-success";
    case "Kefarmasian":
      return "badge-soft-info";
    case "Penunjang Medis":
      return "badge-soft-warning";
    case "Administrasi & Manajemen":
      return "badge-soft-secondary";
    case "Keamanan & Pengamanan":
      return "badge-soft-dark";
    default:
      return "badge-soft-dark";
  }
}
