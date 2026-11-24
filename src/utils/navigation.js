/**
 * RSJ TAMPAN - URL ROUTING & NAVIGATION MANAGER
 * Sinkronisasi URL browser (HTML5 History API) dengan State Tampilan & Tab Aktif
 */

// Tab Modul Admin
export const ADMIN_TAB_ROUTES = {
  direktori: "/admin/direktori",
  abk_wisn: "/admin/abk-wisn",
  kredensialing: "/admin/kredensialing",
  dossier: "/admin/dossier",
  legalitas: "/admin/legalitas",
  cuti: "/admin/cuti",
  diklat: "/admin/diklat",
  analitik: "/admin/analitik",
};

// Tab Portal Mandiri Pegawai (Employee Self-Service / ESS & MyASN BKN)
export const PEGAWAI_TAB_ROUTES = {
  profil: "/pegawai/profil",
  berkas: "/pegawai/berkas",
  cuti: "/pegawai/cuti",
  legalitas: "/pegawai/legalitas",
  diklat: "/pegawai/diklat",
  riwayat_profil: "/pegawai/riwayat-profil",
  riwayat_keluarga: "/pegawai/riwayat-keluarga",
  riwayat_sertifikasi: "/pegawai/riwayat-sertifikasi",
  riwayat_profesi: "/pegawai/riwayat-profesi",
  riwayat_penghargaan: "/pegawai/riwayat-penghargaan",
  riwayat_organisasi: "/pegawai/riwayat-organisasi",
  riwayat_pendidikan: "/pegawai/riwayat-pendidikan",
  riwayat_kinerja: "/pegawai/riwayat-kinerja",
  riwayat_kontrak: "/pegawai/riwayat-kontrak",
};

// Judul Halaman Dokumen
export const PAGE_TITLES = {
  login: "Masuk SIM-SDM • RSJ Tampan Riau",
  register: "Registrasi Petugas SIM-SDM • RSJ Tampan",
  admin_direktori: "Direktori Pegawai & Nakes • SIM-SDM RSJ Tampan",
  admin_abk_wisn: "Analisis Beban Kerja (WISN) • SIM-SDM RSJ Tampan",
  admin_kredensialing: "Jenjang Karir & SPK/RKK • SIM-SDM RSJ Tampan",
  admin_dossier: "E-Berkas Digital Kepegawaian • SIM-SDM RSJ Tampan",
  admin_legalitas: "Audit Legalitas STR & SIP • SIM-SDM RSJ Tampan",
  admin_cuti: "Approval & Manajemen Cuti HRD • SIM-SDM RSJ Tampan",
  admin_diklat: "Diklat & Sertifikasi Jiwa • SIM-SDM RSJ Tampan",
  admin_analitik: "Analitik Kinerja SDM & SKP • SIM-SDM RSJ Tampan",
  pegawai_profil: "Data Diri & Profil Saya • Portal Pegawai RSJ Tampan",
  pegawai_berkas: "E-Berkas & Dokumen Mandiri • Portal Pegawai RSJ Tampan",
  pegawai_cuti: "Pengajuan & Riwayat Cuti Mandiri • Portal Pegawai RSJ Tampan",
  pegawai_legalitas: "Legalitas STR & SIP Saya • Portal Pegawai RSJ Tampan",
  pegawai_diklat: "Sertifikat & Pelatihan Saya • Portal Pegawai RSJ Tampan",
  pegawai_riwayat_profil: "Riwayat Ubah Profil • MyASN RSJ Tampan",
  pegawai_riwayat_keluarga: "Riwayat Keluarga & Tanggungan • MyASN RSJ Tampan",
  pegawai_riwayat_sertifikasi: "Riwayat Sertifikasi Nakes • MyASN RSJ Tampan",
  pegawai_riwayat_profesi: "Riwayat Profesi & Jenjang Karir • MyASN RSJ Tampan",
  pegawai_riwayat_penghargaan: "Riwayat Penghargaan & Tanda Jasa • MyASN RSJ Tampan",
  pegawai_riwayat_organisasi: "Riwayat Organisasi Profesi • MyASN RSJ Tampan",
  pegawai_riwayat_pendidikan: "Riwayat Pendidikan Formal • MyASN RSJ Tampan",
  pegawai_riwayat_kinerja: "Riwayat Kinerja & SKP Tahunan • MyASN RSJ Tampan",
  pegawai_riwayat_kontrak: "Riwayat Kontrak PPPK & SK • MyASN RSJ Tampan",
  pegawai_default: "Portal Mandiri Pegawai (ESS) • SIM-SDM RSJ Tampan",
};

/**
 * Menghasilkan URL path berdasarkan state aplikasi saat ini
 */
export function getPathForState(
  view,
  adminTab = "direktori",
  _portalTab = null,
  pegawaiTab = "profil"
) {
  if (view === "admin") {
    return ADMIN_TAB_ROUTES[adminTab] || `/admin/${adminTab.replace("_", "-")}`;
  }
  if (view === "pegawai" || view === "cuti_pegawai") {
    return PEGAWAI_TAB_ROUTES[pegawaiTab] || `/pegawai/${pegawaiTab.replace("_", "-")}`;
  }
  if (view === "login") {
    return "/login";
  }
  if (view === "register") {
    return "/register";
  }
  return "/login";
}

/**
 * Menghasilkan judul halaman untuk title browser tab
 */
export function getTitleForState(
  view,
  adminTab = "direktori",
  _portalTab = null,
  pegawaiTab = "profil"
) {
  if (view === "admin") {
    return PAGE_TITLES[`admin_${adminTab}`] || "Panel Admin SIM-SDM • RSJ Tampan";
  }
  if (view === "pegawai" || view === "cuti_pegawai") {
    return PAGE_TITLES[`pegawai_${pegawaiTab}`] || PAGE_TITLES.pegawai_default;
  }
  if (view === "login") {
    return PAGE_TITLES.login;
  }
  if (view === "register") {
    return PAGE_TITLES.register;
  }
  return PAGE_TITLES.login;
}

/**
 * Mengurai pathname URL saat ini menjadi objek state aplikasi
 */
export function getStateFromPath(pathname) {
  if (!pathname || typeof pathname !== "string") {
    return {
      view: "login",
      adminTab: "direktori",
      pegawaiTab: "profil",
    };
  }

  const cleanPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";

  // 1. RUTE AUTH
  if (cleanPath === "/login") {
    return {
      view: "login",
      adminTab: "direktori",
      pegawaiTab: "profil",
    };
  }
  if (cleanPath === "/register") {
    return {
      view: "register",
      adminTab: "direktori",
      pegawaiTab: "profil",
    };
  }

  // 2. RUTE PORTAL PEGAWAI MANDIRI
  if (
    cleanPath.startsWith("/pegawai") ||
    cleanPath.startsWith("/cuti") ||
    cleanPath.startsWith("/nakes")
  ) {
    const parts = cleanPath.split("/").filter(Boolean);
    let tab = "profil";

    if (cleanPath === "/cuti/pengajuan" || cleanPath === "/cuti") {
      tab = "cuti";
    } else if (parts[1]) {
      const sub = parts[1].replace("-", "_");
      if (sub === "profil" || sub === "biodata" || sub === "datadiri") {
        tab = "profil";
      } else if (sub === "berkas" || sub === "dossier" || sub === "dokumen" || sub === "arsip") {
        tab = "berkas";
      } else if (sub === "cuti" || sub === "izin" || sub === "pengajuan") {
        tab = "cuti";
      } else if (sub === "legalitas" || sub === "str" || sub === "sip") {
        tab = "legalitas";
      } else if (sub === "diklat" || sub === "pelatihan" || sub === "sertifikat") {
        tab = "diklat";
      } else {
        tab = sub;
      }
    }

    return {
      view: "pegawai",
      adminTab: "direktori",
      pegawaiTab: tab,
    };
  }

  // 3. RUTE ADMIN & MODUL SDM
  if (cleanPath.startsWith("/admin")) {
    const parts = cleanPath.split("/").filter(Boolean);
    let tab = "direktori";

    if (parts[1]) {
      const sub = parts[1].replace("-", "_");
      if (sub === "wisn" || sub === "abk_wisn" || sub === "abk") {
        tab = "abk_wisn";
      } else if (sub === "kredensialing" || sub === "spk" || sub === "karir") {
        tab = "kredensialing";
      } else if (sub === "dossier" || sub === "berkas" || sub === "arsip") {
        tab = "dossier";
      } else if (sub === "legalitas" || sub === "str" || sub === "sip") {
        tab = "legalitas";
      } else if (sub === "cuti" || sub === "izin") {
        tab = "cuti";
      } else if (sub === "diklat" || sub === "pelatihan") {
        tab = "diklat";
      } else if (sub === "analitik" || sub === "kpi" || sub === "skp") {
        tab = "analitik";
      } else if (sub === "direktori" || sub === "pegawai" || sub === "nakes") {
        tab = "direktori";
      } else {
        tab = sub;
      }
    }

    return {
      view: "admin",
      adminTab: tab,
      pegawaiTab: "profil",
    };
  }

  // Default fallback (langsung ke login)
  return {
    view: "login",
    adminTab: "direktori",
    pegawaiTab: "profil",
  };
}
