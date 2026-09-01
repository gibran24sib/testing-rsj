/**
 * Layanan Komunikasi API Backend SIM-SDM RS Jiwa Tampan
 * Terhubung ke Node.js (Express.js + MySQL) dengan fallback lokal
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Cek status server backend
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, ...data };
  } catch (error) {
    return { online: false };
  }
}

/**
 * Mengambil daftar seluruh pegawai dari Backend / Database
 */
export async function getEmployeesFromApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/pegawai`);
    if (!response.ok) throw new Error("Gagal memuat pegawai dari server");
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.warn("Backend offline, menggunakan data lokal.");
    return null;
  }
}

/**
 * Menambah pegawai baru ke Database
 */
export async function createEmployeeApi(employeeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/pegawai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });
    return await response.json();
  } catch (error) {
    console.warn("Backend offline, data disimpan di localStorage.");
    return { success: true, localOnly: true };
  }
}

/**
 * Mengunggah file berkas asli langsung dari device ke server backend (Multer)
 * @param {string} employeeId - ID Pegawai (misal: 'EMP-001')
 * @param {File} fileFromDevice - File objek dari <input type="file">
 * @param {string} documentTitle - Judul / Keterangan berkas
 * @param {string} category - Kategori berkas
 */
export async function uploadDossierFileApi(employeeId, fileFromDevice, documentTitle = "", category = "Dokumen Kepegawaian") {
  try {
    const formData = new FormData();
    formData.append("pegawai_id", employeeId);
    formData.append("nama_dokumen", documentTitle || fileFromDevice.name);
    formData.append("kategori_dokumen", category);
    formData.append("berkas", fileFromDevice); // File biner asli dari device

    const response = await fetch(`${API_BASE_URL}/dossier/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Gagal mengunggah berkas ke server.");
    return await response.json();
  } catch (error) {
    console.warn("Backend offline, berkas diproses secara lokal pada browser.");
    return {
      success: true,
      localOnly: true,
      message: "Berkas berhasil disimpan secara lokal.",
    };
  }
}

/**
 * Mengambil daftar berkas dossier seorang pegawai dari Backend
 */
export async function getDossierByEmployeeIdApi(employeeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/dossier/${employeeId}`);
    if (!response.ok) throw new Error("Gagal mengambil berkas dossier.");
    const json = await response.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

/**
 * Merekam presensi shift harian ke database
 */
export async function recordAttendanceApi(attendanceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/presensi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceData),
    });
    return await response.json();
  } catch (error) {
    return { success: true, localOnly: true };
  }
}
