/**
 * Helper untuk kompresi dan resize gambar profil sebelum disimpan ke LocalStorage / Database.
 * Mengurangi ukuran gambar dari 2-5 MB menjadi ~20-50 KB agar tidak terkena QuotaExceededError.
 * 
 * @param {File} file - File gambar mentah dari input file
 * @param {number} [maxWidth=400] - Lebar maksimal gambar (px)
 * @param {number} [maxHeight=400] - Tinggi maksimal gambar (px)
 * @param {number} [quality=0.82] - Kualitas JPEG kompresi (0.1 - 1.0)
 * @returns {Promise<string>} Base64 Data URL berukuran ringkas
 */
export function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File yang dipilih bukan berkas gambar."));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memproses gambar."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung skala rasio gambar agar tidak terdistorsi
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(event.target.result); // Fallback jika canvas gagal
        }

        // Gambar ke canvas dengan ukuran baru
        ctx.drawImage(img, 0, 0, width, height);

        // Kompres ke format JPEG ringan
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Mengambil foto profil yang tersimpan secara persisten di LocalStorage
 * berdasarkan NIP, ID, Username, atau Email.
 */
export function getSavedUserPhoto(user = null, employee = null) {
  if (typeof window === "undefined") return null;
  try {
    const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
    const nip = (employee?.nip || user?.nip || "").replace(/\s+/g, "");
    const id = employee?.id || user?.employeeId || user?.id;
    const username = (employee?.username || user?.username || "").toLowerCase().trim();
    const email = (employee?.email || user?.email || "").toLowerCase().trim();

    if (nip && savedPhotos[nip]) return savedPhotos[nip];
    if (id && savedPhotos[id]) return savedPhotos[id];
    if (username && savedPhotos[username]) return savedPhotos[username];
    if (email && savedPhotos[email]) return savedPhotos[email];
    if (savedPhotos["active_user_photo"]) return savedPhotos["active_user_photo"];
  } catch (e) {
    console.warn("Gagal membaca rsj_saved_photos:", e);
  }
  return user?.foto || employee?.foto || null;
}

/**
 * Menyimpan foto profil secara permanen ke kunci persisten LocalStorage
 * diindeks oleh semua kemungkinan pengenal (NIP, ID, Username, Email).
 */
export function saveUserPhoto(photoBase64, user = null, employee = null) {
  if (!photoBase64 || typeof window === "undefined") return;
  try {
    const savedPhotos = JSON.parse(localStorage.getItem("rsj_saved_photos") || "{}");
    const nip = (employee?.nip || user?.nip || "").replace(/\s+/g, "");
    const id = employee?.id || user?.employeeId || user?.id;
    const username = (employee?.username || user?.username || "").toLowerCase().trim();
    const email = (employee?.email || user?.email || "").toLowerCase().trim();

    if (nip) savedPhotos[nip] = photoBase64;
    if (id) savedPhotos[id] = photoBase64;
    if (username) savedPhotos[username] = photoBase64;
    if (email) savedPhotos[email] = photoBase64;
    savedPhotos["active_user_photo"] = photoBase64;

    localStorage.setItem("rsj_saved_photos", JSON.stringify(savedPhotos));
  } catch (e) {
    console.warn("Gagal simpan ke rsj_saved_photos:", e);
  }
}
