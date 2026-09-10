/**
 * RSJ TAMPAN - AUTH & ROLE PERMISSION HELPERS
 * Mengatur hak akses, validasi role Admin/HRD, dan pencegahan self-approval cuti
 */

/**
 * Mengambil data user aktif dari prop atau LocalStorage
 * @param {Object} [user] - Objek user opsional
 * @returns {Object|null}
 */
export function getActiveUser(user) {
  if (user && (user.role || user.username || user.nama || user.id)) {
    return user;
  }
  try {
    const saved = localStorage.getItem("rsj_current_user");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Gagal membaca session user dari LocalStorage:", e);
  }
  return null;
}

/**
 * Memeriksa apakah user memiliki peran Admin atau HRD / Kasubbag Kepegawaian
 * @param {Object} [user] - Objek user yang sedang login
 * @returns {boolean}
 */
export function isAdminOrHrd(user) {
  const activeUser = getActiveUser(user);
  if (!activeUser) return false;

  const rawUsername = (activeUser.username || "").toLowerCase().trim();
  const username = rawUsername.replace(/^@/, "");
  const role = (activeUser.role || "").toLowerCase().trim();

  // Username admin (@admin atau admin)
  if (username === "admin") return true;

  // Role admin atau hrd
  if (role === "admin" || role === "hrd") return true;

  // Kata kunci kepegawaian/kasubbag/sdm
  return (
    role.includes("admin") ||
    role.includes("hrd") ||
    role.includes("kepegawaian") ||
    role.includes("kasubbag") ||
    role.includes("sdm")
  );
}

/**
 * Memeriksa apakah sebuah data pengajuan cuti adalah milik user yang sedang login
 * @param {Object} user - User yang sedang login
 * @param {Object} leave - Data pengajuan cuti
 * @param {Array} employees - Daftar master pegawai (opsional untuk resolusi)
 * @returns {boolean}
 */
export function isLeaveApplicant(user, leave, employees = []) {
  const activeUser = getActiveUser(user);
  if (!activeUser || !leave) return false;

  // 1. Cocokkan User ID secara langsung (Supabase Auth ID / User ID)
  const userId = (activeUser.id || activeUser.userId || "").toString().trim().toLowerCase();
  const leaveUserId = (leave.user_id || leave.userId || leave.pemohon_id || leave.pemohonId || "").toString().trim().toLowerCase();
  if (userId && leaveUserId && userId === leaveUserId) return true;

  const userName = (activeUser.nama || "").toLowerCase().trim();
  const userNip = (activeUser.nip || "").replace(/\s+/g, "");
  const userEmpId = (activeUser.employeeId || activeUser.id || "").toLowerCase().trim();
  const username = (activeUser.username || "").toLowerCase().trim();

  const leaveName = (leave.nama || "").toLowerCase().trim();
  const leaveNip = (leave.nip || "").replace(/\s+/g, "");
  const leaveEmpId = (leave.employeeId || "").toLowerCase().trim();
  const leaveUsername = (leave.username || "").toLowerCase().trim();

  // 2. Cocokkan ID Pegawai jika ada
  if (userEmpId && leaveEmpId && userEmpId === leaveEmpId) return true;

  // 3. Cocokkan Username
  if (username && leaveUsername && username === leaveUsername) return true;

  // 4. Cocokkan NIP
  if (userNip && leaveNip && userNip === leaveNip) return true;

  // 5. Cocokkan Nama Lengkap (mengabaikan gelar seperti dr., Ns., Sp.KJ, dsb)
  if (userName && leaveName) {
    if (userName === leaveName) return true;
    
    // Normalisasi pembersihan gelar untuk pencocokan nama
    const cleanName1 = userName.replace(/^(dr\.|ns\.|apt\.|drg\.)\s*/i, "").split(",")[0].trim();
    const cleanName2 = leaveName.replace(/^(dr\.|ns\.|apt\.|drg\.)\s*/i, "").split(",")[0].trim();
    if (cleanName1 && cleanName2 && cleanName1 === cleanName2) return true;
  }

  // 6. Cek melalui master employee jika user terhubung dengan employee tertentu
  if (employees && employees.length > 0) {
    const matchedEmp = employees.find(
      (emp) =>
        (userEmpId && emp.id?.toLowerCase() === userEmpId) ||
        (userNip && emp.nip?.replace(/\s+/g, "") === userNip) ||
        (userName && emp.nama?.toLowerCase().trim() === userName)
    );
    if (matchedEmp && matchedEmp.id?.toLowerCase() === leaveEmpId) {
      return true;
    }
  }

  return false;
}

/**
 * Memeriksa apakah user berhak menyetujui (approve/reject) pengajuan cuti tertentu
 * Aturan Ketat:
 * 1. User WAJIB memiliki role Admin/HRD.
 * 2. User TIDAK BISA menyetujui cuti miliknya sendiri (mencegah conflict of interest / self-approval).
 * @param {Object} user - User yang sedang login
 * @param {Object} leave - Data pengajuan cuti
 * @param {Array} employees - Daftar master pegawai
 * @returns {{ canApprove: boolean, isSelf?: boolean, reason: string }}
 */
export function canApproveLeave(user, leave, employees = []) {
  const activeUser = getActiveUser(user);
  if (!activeUser) {
    return {
      canApprove: false,
      reason: "Pengguna belum login ke sistem.",
    };
  }

  if (!isAdminOrHrd(activeUser)) {
    return {
      canApprove: false,
      reason: "Hanya Admin / HRD Kepegawaian yang memiliki hak persetujuan cuti.",
    };
  }

  if (isLeaveApplicant(activeUser, leave, employees)) {
    return {
      canApprove: false,
      isSelf: true,
      reason: "Tidak dapat menyetujui pengajuan cuti sendiri (user.id === pemohon.user_id). Wajib melalui atasan/Direktur.",
    };
  }

  return {
    canApprove: true,
    reason: "Memiliki otoritas persetujuan.",
  };
}

/**
 * Mencari profil pegawai yang cocok dari data master untuk user yang sedang login
 * @param {Object} user - User saat ini
 * @param {Array} employees - Daftar master data pegawai
 * @returns {Object|null}
 */
export function getEmployeeForUser(user, employees = []) {
  const activeUser = getActiveUser(user);
  if (!activeUser || !employees || !employees.length) return null;

  const userName = (activeUser.nama || "").toLowerCase().trim();
  const userNip = (activeUser.nip || "").replace(/\s+/g, "");
  const userEmpId = (activeUser.employeeId || activeUser.id || "").toLowerCase().trim();
  const userEmail = (activeUser.email || "").toLowerCase().trim();

  return (
    employees.find((emp) => {
      if (userEmpId && emp.id?.toLowerCase() === userEmpId) return true;
      if (userNip && emp.nip?.replace(/\s+/g, "") === userNip) return true;
      if (userEmail && emp.email?.toLowerCase().trim() === userEmail) return true;
      if (userName && emp.nama?.toLowerCase().trim() === userName) return true;
      return false;
    }) || null
  );
}
