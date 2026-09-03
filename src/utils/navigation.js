/**
 * RSJ TAMPAN - URL ROUTING & NAVIGATION MANAGER
 * Sinkronisasi URL browser (HTML5 History API) dengan State Tampilan & Tab Aktif
 */

// Tab Modul Admin
export const ADMIN_TAB_ROUTES = {
  direktori: "/admin/direktori",
  roster: "/admin/roster",
  abk_wisn: "/admin/abk-wisn",
  kredensialing: "/admin/kredensialing",
  presensi: "/admin/presensi",
  dossier: "/admin/dossier",
  legalitas: "/admin/legalitas",
  cuti: "/admin/cuti",
  diklat: "/admin/diklat",
  analitik: "/admin/analitik",
};

// Tab Portal Publik
export const PORTAL_TAB_ROUTES = {
  tenaga_medis: "/portal/tenaga-medis",
  rekrutmen: "/portal/rekrutmen",
  diklat: "/portal/diklat",
  layanan_sdm: "/portal/layanan",
};

// Judul Halaman Dokumen
export const PAGE_TITLES = {
  login: "Masuk SIM-SDM • RSJ Tampan Riau",
  register: "Registrasi Petugas SIM-SDM • RSJ Tampan",
  portal_tenaga_medis: "Portal Informasi Tenaga Medis • RSJ Tampan",
  portal_rekrutmen: "Informasi Rekrutmen & Formasi Nakes • RSJ Tampan",
  portal_diklat: "Program Diklat & Kredensialing Jiwa • RSJ Tampan",
  portal_layanan_sdm: "Layanan Kepegawaian & Ketenagaan • RSJ Tampan",
  portal_default: "Portal SDM & Kepegawaian • RSJ Tampan Riau",
  admin_direktori: "Direktori Pegawai & Nakes • SIM-SDM RSJ Tampan",
  admin_roster: "Roster Shift 24/7 Bangsal Jiwa • SIM-SDM RSJ Tampan",
  admin_abk_wisn: "Analisis Beban Kerja (WISN) • SIM-SDM RSJ Tampan",
  admin_kredensialing: "Jenjang Karir & SPK/RKK • SIM-SDM RSJ Tampan",
  admin_presensi: "E-Presensi Shift Geolocation • SIM-SDM RSJ Tampan",
  admin_dossier: "E-Berkas Digital Kepegawaian • SIM-SDM RSJ Tampan",
  admin_legalitas: "Audit Legalitas STR & SIP • SIM-SDM RSJ Tampan",
  admin_cuti: "Manajemen Cuti & Izin Nakes • SIM-SDM RSJ Tampan",
  admin_diklat: "Diklat & Sertifikasi Jiwa • SIM-SDM RSJ Tampan",
  admin_analitik: "Analitik Kinerja SDM & SKP • SIM-SDM RSJ Tampan",
};

/**
 * Menghasilkan URL path berdasarkan state aplikasi saat ini
 */
export function getPathForState(view, adminTab = "direktori", portalTab = "tenaga_medis") {
  if (view === "admin") {
    return ADMIN_TAB_ROUTES[adminTab] || `/admin/${adminTab.replace("_", "-")}`;
  }
  if (view === "login") {
    return "/login";
  }
  if (view === "register") {
    return "/register";
  }
  if (view === "guest") {
    if (portalTab && portalTab !== "tenaga_medis") {
      return PORTAL_TAB_ROUTES[portalTab] || `/portal/${portalTab.replace("_", "-")}`;
    }
    return "/portal";
  }
  return "/";
}

/**
 * Menghasilkan judul halaman untuk title browser tab
 */
export function getTitleForState(view, adminTab = "direktori", portalTab = "tenaga_medis") {
  if (view === "admin") {
    return PAGE_TITLES[`admin_${adminTab}`] || "Panel Admin SIM-SDM • RSJ Tampan";
  }
  if (view === "login") {
    return PAGE_TITLES.login;
  }
  if (view === "register") {
    return PAGE_TITLES.register;
  }
  if (view === "guest") {
    return PAGE_TITLES[`portal_${portalTab}`] || PAGE_TITLES.portal_default;
  }
  return "RSJ Tampan Pekanbaru • SIM-SDM Terpadu";
}

/**
 * Membaca URL path saat ini dan mengembalikannya dalam bentuk state aplikasi
 */
export function getStateFromPath(pathname = window.location.pathname) {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";

  // 1. RUTE AUTH
  if (cleanPath === "/login") {
    return {
      view: "login",
      adminTab: "direktori",
      portalTab: "tenaga_medis",
    };
  }
  if (cleanPath === "/register") {
    return {
      view: "register",
      adminTab: "direktori",
      portalTab: "tenaga_medis",
    };
  }

  // 2. RUTE ADMIN & MODUL SDM
  if (cleanPath.startsWith("/admin")) {
    const parts = cleanPath.split("/").filter(Boolean);
    let tab = "direktori";

    if (parts[1]) {
      const sub = parts[1].replace("-", "_");
      // Map alias URL ke id tab yang sesuai
      if (sub === "wisn" || sub === "abk_wisn" || sub === "abk") {
        tab = "abk_wisn";
      } else if (sub === "roster" || sub === "shift" || sub === "jadwal") {
        tab = "roster";
      } else if (sub === "kredensialing" || sub === "spk" || sub === "karir") {
        tab = "kredensialing";
      } else if (sub === "presensi" || sub === "absensi" || sub === "gps") {
        tab = "presensi";
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
      portalTab: "tenaga_medis",
    };
  }

  // 3. RUTE PORTAL PUBLIK
  if (cleanPath.startsWith("/portal") || cleanPath === "/") {
    const parts = cleanPath.split("/").filter(Boolean);
    let portalTab = "tenaga_medis";

    if (parts[1]) {
      const sub = parts[1].replace("-", "_");
      if (sub === "rekrutmen" || sub === "karir" || sub === "lowongan") {
        portalTab = "rekrutmen";
      } else if (sub === "diklat" || sub === "pelatihan" || sub === "workshop") {
        portalTab = "diklat";
      } else if (sub === "layanan" || sub === "layanan_sdm" || sub === "panduan") {
        portalTab = "layanan_sdm";
      } else {
        portalTab = "tenaga_medis";
      }
    }

    return {
      view: "guest",
      adminTab: "direktori",
      portalTab: portalTab,
    };
  }

  // Default fallback
  return {
    view: "guest",
    adminTab: "direktori",
    portalTab: "tenaga_medis",
  };
}
