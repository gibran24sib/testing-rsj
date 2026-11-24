import React, { useState, useEffect } from "react";
import {
  initialRiwayatKeluarga,
  initialRiwayatSertifikasi,
  initialRiwayatProfesi,
  initialRiwayatPenghargaan,
  initialRiwayatOrganisasi,
  initialRiwayatPendidikan,
  initialRiwayatKinerja,
  initialRiwayatKontrak,
  initialRiwayatProfil,
} from "../data/riwayatData";

// Ikon Dual-Tone persis seperti di gambar aplikasi MyASN BKN
export const RiwayatIcons = {
  profil: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="28" cy="24" r="8" fill="#0284c7" />
      <path d="M16 46c0-6.627 5.373-12 12-12h2c6.627 0 12 5.373 12 12v2H16v-2z" fill="#0284c7" />
      <circle cx="44" cy="40" r="10" fill="#ec4899" />
      <path d="M40 40l3 3 6-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  keluarga: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#fce7f3" opacity="0.5" />
      <circle cx="25" cy="22" r="7" fill="#ec4899" />
      <path d="M14 44c0-6.075 4.925-11 11-11s11 4.925 11 11v2H14v-2z" fill="#ec4899" />
      <circle cx="40" cy="28" r="6" fill="#0284c7" />
      <path d="M32 46c0-4.418 3.582-8 8-8s8 3.582 8 8v1h-16v-1z" fill="#0284c7" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sertifikasi: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="26" cy="22" r="7" fill="#0284c7" />
      <path d="M15 44c0-5.5 4.5-10 10-10h4c5.5 0 10 4.5 10 10v2H15v-2z" fill="#0284c7" />
      <rect x="34" y="26" width="16" height="20" rx="3" fill="#ec4899" />
      <circle cx="42" cy="34" r="4" fill="#ffffff" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  profesi: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="26" cy="22" r="7" fill="#0284c7" />
      <path d="M15 44c0-5.5 4.5-10 10-10h4c5.5 0 10 4.5 10 10v2H15v-2z" fill="#0284c7" />
      <rect x="34" y="25" width="16" height="21" rx="2" fill="#ec4899" />
      <path d="M38 31h8M38 35h6M38 39h4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  penghargaan: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="32" cy="28" r="12" fill="#38bdf8" />
      <circle cx="32" cy="28" r="8" fill="#ec4899" />
      <path d="M26 38l-4 12 10-4 10 4-4-12" fill="#0284c7" />
      <path d="M29 28l2-4 2 4 4 .5-3 2.5 1 4-4-2-4 2 1-4-3-2.5 4-.5z" fill="#ffffff" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  organisasi: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#fce7f3" opacity="0.5" />
      <circle cx="24" cy="24" r="6" fill="#ec4899" />
      <circle cx="40" cy="24" r="6" fill="#0284c7" />
      <rect x="25" y="30" width="14" height="18" rx="2" fill="#0284c7" />
      <rect x="28" y="34" width="3" height="3" fill="#ffffff" />
      <rect x="33" y="34" width="3" height="3" fill="#ffffff" />
      <rect x="28" y="39" width="3" height="3" fill="#ffffff" />
      <rect x="33" y="39" width="3" height="3" fill="#ffffff" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pendidikan: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#fce7f3" opacity="0.5" />
      <path d="M32 18l18 9-18 9-18-9 18-9z" fill="#ec4899" />
      <path d="M20 31.5v9c0 3 5.373 6.5 12 6.5s12-3.5 12-6.5v-9" fill="#0284c7" />
      <path d="M46 29v12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="46" cy="43" r="2" fill="#38bdf8" />
    </svg>
  ),
  kinerja: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="24" cy="22" r="7" fill="#0284c7" />
      <path d="M14 44c0-5.5 4.5-10 10-10h2c5.5 0 10 4.5 10 10v2H14v-2z" fill="#0284c7" />
      <rect x="34" y="24" width="18" height="22" rx="3" fill="#ec4899" />
      <path d="M38 41l3-4 3 2 4-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="18" r="6" fill="#38bdf8" />
      <path d="M46 18l1.5 1.5 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  kontrak: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#e0f2fe" opacity="0.6" />
      <circle cx="26" cy="22" r="7" fill="#0284c7" />
      <path d="M15 44c0-5.5 4.5-10 10-10h4c5.5 0 10 4.5 10 10v2H15v-2z" fill="#0284c7" />
      <rect x="33" y="24" width="18" height="22" rx="3" fill="#ec4899" />
      <path d="M37 30h10M37 35h10M37 40h6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export const MYASN_MODULES = [
  { id: "riwayat_profil", label: "Riwayat Ubah Profil", iconKey: "profil", count: "Log Pembaruan", desc: "Log pembaruan data diri & kontak" },
  { id: "riwayat_keluarga", label: "Riwayat Keluarga", iconKey: "keluarga", count: "Tanggungan BPJS", desc: "Data pasangan, anak & tanggungan BPJS" },
  { id: "riwayat_sertifikasi", label: "Riwayat Sertifikasi", iconKey: "sertifikasi", count: "Kompetensi & SKP", desc: "BTCLS, KARS & pelatihan nakes" },
  { id: "riwayat_profesi", label: "Riwayat Profesi", iconKey: "profesi", count: "Jenjang Karir PK", desc: "Jenjang karir klinis, SPK & RKK" },
  { id: "riwayat_penghargaan", label: "Riwayat Penghargaan", iconKey: "penghargaan", count: "Tanda Kehormatan", desc: "Satyalancana & nakes teladan" },
  { id: "riwayat_organisasi", label: "Riwayat Organisasi", iconKey: "organisasi", count: "Profesi Nakes", desc: "PPNI, HPJI, & KORPRI" },
  { id: "riwayat_pendidikan", label: "Riwayat Pendidikan", iconKey: "pendidikan", count: "Gelar & Ijazah", desc: "Ijazah D3, S1, hingga Profesi" },
  { id: "riwayat_kinerja", label: "Riwayat Kinerja", iconKey: "kinerja", count: "SKP Tahunan", desc: "Sasaran Kinerja Pegawai tahunan" },
  { id: "riwayat_kontrak", label: "Riwayat Kontrak PPPK", iconKey: "kontrak", count: "SK PNS/PPPK", desc: "SK pengangkatan & TMT kepegawaian" },
];

export default function MyAsnRiwayatSection({
  selectedTab,
  onSelectTab,
  darkMode,
  cardBg,
  cardBorder,
  showToast,
}) {
  // SINKRONISASI AKTIF LANGSUNG DARI PROP (BISA PINDAH KAPAN SAJA)
  const [localModule, setLocalModule] = useState(
    selectedTab && selectedTab.startsWith("riwayat_") ? selectedTab : null
  );

  useEffect(() => {
    if (selectedTab && selectedTab.startsWith("riwayat_")) {
      setLocalModule(selectedTab);
    } else if (selectedTab === "profil") {
      setLocalModule(null);
    }
  }, [selectedTab]);

  const activeModule = selectedTab && selectedTab.startsWith("riwayat_") ? selectedTab : localModule;

  // MODAL FORM STATE UNTUK TAMBAH/USUL DATA
  const [activeModal, setActiveModal] = useState(null);
  const [modalFormData, setModalFormData] = useState({});

  // LISTS STATE DENGAN LOCALSTORAGE
  const [keluargaList, setKeluargaList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_keluarga");
      return saved ? JSON.parse(saved) : initialRiwayatKeluarga;
    } catch {
      return initialRiwayatKeluarga;
    }
  });

  const [sertifikasiList, setSertifikasiList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_sertifikasi");
      return saved ? JSON.parse(saved) : initialRiwayatSertifikasi;
    } catch {
      return initialRiwayatSertifikasi;
    }
  });

  const [profesiList, setProfesiList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_profesi");
      return saved ? JSON.parse(saved) : initialRiwayatProfesi;
    } catch {
      return initialRiwayatProfesi;
    }
  });

  const [penghargaanList, setPenghargaanList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_penghargaan");
      return saved ? JSON.parse(saved) : initialRiwayatPenghargaan;
    } catch {
      return initialRiwayatPenghargaan;
    }
  });

  const [organisasiList, setOrganisasiList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_organisasi");
      return saved ? JSON.parse(saved) : initialRiwayatOrganisasi;
    } catch {
      return initialRiwayatOrganisasi;
    }
  });

  const [pendidikanList, setPendidikanList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_pendidikan");
      return saved ? JSON.parse(saved) : initialRiwayatPendidikan;
    } catch {
      return initialRiwayatPendidikan;
    }
  });

  const [kinerjaList, setKinerjaList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_kinerja");
      return saved ? JSON.parse(saved) : initialRiwayatKinerja;
    } catch {
      return initialRiwayatKinerja;
    }
  });

  const [kontrakList, setKontrakList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_kontrak");
      return saved ? JSON.parse(saved) : initialRiwayatKontrak;
    } catch {
      return initialRiwayatKontrak;
    }
  });

  const [profilList, setProfilList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_myasn_profil");
      return saved ? JSON.parse(saved) : initialRiwayatProfil;
    } catch {
      return initialRiwayatProfil;
    }
  });

  // SIMPAN OTOMATIS KE LOCALSTORAGE
  useEffect(() => {
    try {
      localStorage.setItem("rsj_myasn_keluarga", JSON.stringify(keluargaList));
      localStorage.setItem("rsj_myasn_sertifikasi", JSON.stringify(sertifikasiList));
      localStorage.setItem("rsj_myasn_profesi", JSON.stringify(profesiList));
      localStorage.setItem("rsj_myasn_penghargaan", JSON.stringify(penghargaanList));
      localStorage.setItem("rsj_myasn_organisasi", JSON.stringify(organisasiList));
      localStorage.setItem("rsj_myasn_pendidikan", JSON.stringify(pendidikanList));
      localStorage.setItem("rsj_myasn_kinerja", JSON.stringify(kinerjaList));
      localStorage.setItem("rsj_myasn_kontrak", JSON.stringify(kontrakList));
      localStorage.setItem("rsj_myasn_profil", JSON.stringify(profilList));
    } catch (e) {
      console.warn("Gagal simpan ke localStorage:", e);
    }
  }, [
    keluargaList,
    sertifikasiList,
    profesiList,
    penghargaanList,
    organisasiList,
    pendidikanList,
    kinerjaList,
    kontrakList,
    profilList,
  ]);

  // PINDAH MODUL SECARA LANGSUNG & FLUID
  const handleOpenModule = (moduleId) => {
    setLocalModule(moduleId);
    if (onSelectTab) {
      onSelectTab(moduleId || "profil");
    }
  };

  const currentModuleObj = MYASN_MODULES.find((m) => m.id === activeModule);

  // DELETE HANDLERS
  const handleDeleteItem = (type, id, label) => {
    if (!window.confirm(`Hapus data ${label}?`)) return;
    if (type === "keluarga") setKeluargaList((prev) => prev.filter((i) => i.id !== id));
    if (type === "sertifikasi") setSertifikasiList((prev) => prev.filter((i) => i.id !== id));
    if (type === "profesi") setProfesiList((prev) => prev.filter((i) => i.id !== id));
    if (type === "penghargaan") setPenghargaanList((prev) => prev.filter((i) => i.id !== id));
    if (type === "organisasi") setOrganisasiList((prev) => prev.filter((i) => i.id !== id));
    if (type === "pendidikan") setPendidikanList((prev) => prev.filter((i) => i.id !== id));
    if (type === "kinerja") setKinerjaList((prev) => prev.filter((i) => i.id !== id));
    if (type === "kontrak") setKontrakList((prev) => prev.filter((i) => i.id !== id));
    if (type === "profil") setProfilList((prev) => prev.filter((i) => i.id !== id));
    showToast?.("Data Dihapus", `Data ${label} berhasil dihapus dari arsip mandiri.`, "info");
  };

  // SUBMIT HANDLERS FOR ADDING NEW ITEMS
  const handleSaveNewItem = (e) => {
    e.preventDefault();
    const newId = `ITEM-${Date.now().toString().slice(-4)}`;

    if (activeModal === "riwayat_keluarga") {
      const newItem = {
        id: newId,
        nama: modalFormData.nama || "Anggota Keluarga Baru",
        hubungan: modalFormData.hubungan || "Anak Kandung",
        nik: modalFormData.nik || "1471080000000000",
        pekerjaan: modalFormData.pekerjaan || "Pelajar",
        statusTanggungan: modalFormData.statusTanggungan || "Dapat Tunjangan",
        bpjsNomor: modalFormData.bpjsNomor || "000000000000",
        statusVerifikasi: "Terverifikasi BKN",
      };
      setKeluargaList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Data keluarga ${newItem.nama} berhasil ditambahkan.`, "success");
    } else if (activeModal === "riwayat_sertifikasi") {
      const newItem = {
        id: newId,
        namaSertifikasi: modalFormData.namaSertifikasi || "Sertifikat Baru",
        penerbit: modalFormData.penerbit || "Kemenkes RI / Organisasi Profesi",
        nomorSertifikat: modalFormData.nomorSertifikat || `SRT/${new Date().getFullYear()}/${newId}`,
        tanggalTerbit: modalFormData.tanggalTerbit || new Date().toISOString().split("T")[0],
        masaBerlaku: modalFormData.masaBerlaku || "2028-12-31",
        statusVerifikasi: "Terverifikasi BKN",
        skp: Number(modalFormData.skp) || 4,
      };
      setSertifikasiList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Sertifikat ${newItem.namaSertifikasi} berhasil ditambahkan.`, "success");
    } else if (activeModal === "riwayat_profesi") {
      const newItem = {
        id: newId,
        jabatanProfesi: modalFormData.jabatanProfesi || "Perawat Klinis Baru",
        instansi: modalFormData.instansi || "RSJ Tampan Provinsi Riau",
        noSk: modalFormData.noSk || `800/SK-PK/${newId}`,
        tmt: modalFormData.tmt || new Date().toISOString().split("T")[0],
        komite: "Komite Keperawatan / Medis RSJ Tampan",
        kewenanganKlinis: modalFormData.kewenanganKlinis || "Kewenangan Klinis Mandiri",
        statusVerifikasi: "Terverifikasi BKN",
      };
      setProfesiList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Riwayat profesi ${newItem.jabatanProfesi} tersimpan.`, "success");
    } else if (activeModal === "riwayat_penghargaan") {
      const newItem = {
        id: newId,
        namaPenghargaan: modalFormData.namaPenghargaan || "Penghargaan Baru",
        pemberi: modalFormData.pemberi || "Gubernur Riau / Direktur RSJ",
        tahun: modalFormData.tahun || new Date().getFullYear().toString(),
        nomorPiagam: modalFormData.nomorPiagam || `PIAGAM/${newId}`,
        statusVerifikasi: "Terverifikasi BKN",
      };
      setPenghargaanList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Piagam ${newItem.namaPenghargaan} berhasil didaftarkan.`, "success");
    } else if (activeModal === "riwayat_organisasi") {
      const newItem = {
        id: newId,
        namaOrganisasi: modalFormData.namaOrganisasi || "PPNI / Organisasi Profesi",
        jabatan: modalFormData.jabatan || "Anggota",
        nomorAnggota: modalFormData.nomorAnggota || `KTA-${newId}`,
        tahunMulai: modalFormData.tahunMulai || "2020",
        tahunSelesai: modalFormData.tahunSelesai || "Sekarang",
        statusVerifikasi: "Terverifikasi BKN",
      };
      setOrganisasiList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Keanggotaan ${newItem.namaOrganisasi} tersimpan.`, "success");
    } else if (activeModal === "riwayat_pendidikan") {
      const newItem = {
        id: newId,
        jenjang: modalFormData.jenjang || "Sarjana (S1)",
        namaInstitusi: modalFormData.namaInstitusi || "Universitas Riau",
        jurusan: modalFormData.jurusan || "Ilmu Keperawatan",
        tahunLulus: modalFormData.tahunLulus || "2020",
        nomorIjazah: modalFormData.nomorIjazah || `IJZ/${newId}`,
        ipk: Number(modalFormData.ipk) || 3.75,
        statusVerifikasi: "Terverifikasi BKN",
      };
      setPendidikanList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Ijazah ${newItem.jenjang} berhasil didaftarkan.`, "success");
    } else if (activeModal === "riwayat_kinerja") {
      const newItem = {
        id: newId,
        tahun: modalFormData.tahun || new Date().getFullYear().toString(),
        skor: Number(modalFormData.skor) || 94.0,
        predikat: modalFormData.predikat || "Sangat Baik",
        atasanLangsung: modalFormData.atasanLangsung || "Kasie Pelayanan Keperawatan",
        statusVerifikasi: "Terverifikasi BKN",
        catatan: modalFormData.catatan || "Mencapai seluruh indikator kinerja tahunan.",
      };
      setKinerjaList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `SKP tahun ${newItem.tahun} tersimpan.`, "success");
    } else if (activeModal === "riwayat_kontrak") {
      const newItem = {
        id: newId,
        jenisSk: modalFormData.jenisSk || "SK Perjanjian Kerja PPPK",
        nomorSk: modalFormData.nomorSk || `813/BKD/${newId}`,
        tanggalSk: modalFormData.tanggalSk || new Date().toISOString().split("T")[0],
        tmtSk: modalFormData.tmtSk || new Date().toISOString().split("T")[0],
        pejabatPenetap: modalFormData.pejabatPenetap || "Gubernur Riau",
        golonganRuang: modalFormData.golonganRuang || "Penata Muda (III/a)",
        gajiPokok: modalFormData.gajiPokok || "Rp 2.966.500",
        statusVerifikasi: "Terverifikasi BKN",
      };
      setKontrakList((prev) => [newItem, ...prev]);
      showToast?.("Berhasil Disimpan", `Riwayat ${newItem.jenisSk} tersimpan.`, "success");
    } else if (activeModal === "riwayat_profil") {
      const newItem = {
        id: newId,
        kolomDiubah: modalFormData.kolomDiubah || "Kontak / Alamat Domisili",
        nilaiLama: modalFormData.nilaiLama || "Data sebelumnya",
        nilaiBaru: modalFormData.nilaiBaru || "Data baru terverifikasi",
        tanggal: new Date().toLocaleString("id-ID"),
        statusVerifikasi: "Menunggu Verifikasi SDM",
      };
      setProfilList((prev) => [newItem, ...prev]);
      showToast?.("Usulan Terkirim", "Usulan perubahan data profil diteruskan ke Admin SDM.", "success");
    }

    setActiveModal(null);
    setModalFormData({});
  };

  return (
    <div className="w-100">
      {/* HEADER SECTION MYASN */}
      <div
        className="p-3 p-md-4 rounded-4 mb-3 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, rgba(2, 132, 199, 0.18) 0%, rgba(236, 72, 153, 0.1) 100%)"
            : "linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(252, 231, 243, 0.9) 100%)",
          border: darkMode ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid rgba(14, 165, 233, 0.3)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{
              backgroundColor: darkMode ? "#0f172a" : "#ffffff",
              width: "48px",
              height: "48px",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>🇮🇩</span>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                Riwayat Data Kepegawaian (MyASN BKN)
              </h5>
              <span className="badge bg-primary text-white fw-semibold px-2 py-1 rounded-pill" style={{ fontSize: "0.68rem" }}>
                ✓ Terintegrasi SIASN Nasional
              </span>
            </div>
            <small className="text-muted d-block" style={{ fontSize: "0.78rem" }}>
              Akses cepat seluruh 9 modul riwayat data kepegawaian nakes & tenaga kesehatan RSJ Tampan.
            </small>
          </div>
        </div>

        {activeModule && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary px-3 py-1.5 rounded-pill d-flex align-items-center gap-1 shadow-sm"
            onClick={() => handleOpenModule(null)}
          >
            <span>&larr;</span>
            <span>Tampilkan Semua Grid</span>
          </button>
        )}
      </div>

      {/* SUB-NAVIGASI TABS: MEMUDAHKAN USER PINDAH ANTAR RIWAYAT DENGAN 1 KLIK */}
      <div className="d-flex align-items-center gap-2 overflow-auto pb-2 mb-3">
        <button
          type="button"
          className={`btn btn-sm text-nowrap rounded-pill px-3 py-1.5 fw-semibold ${
            !activeModule
              ? "btn-primary shadow-sm"
              : darkMode
              ? "btn-dark border-secondary text-light"
              : "btn-outline-secondary"
          }`}
          onClick={() => handleOpenModule(null)}
        >
          📱 Grid 9 Modul
        </button>

        {MYASN_MODULES.map((mod) => {
          const isCurrent = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              className={`btn btn-sm text-nowrap rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 ${
                isCurrent
                  ? "btn-primary shadow-sm"
                  : darkMode
                  ? "btn-dark border-secondary text-light"
                  : "btn-outline-secondary"
              }`}
              onClick={() => handleOpenModule(mod.id)}
            >
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* JIKA MEMILIH SALAH SATU MODUL RIWAYAT -> TAMPILKAN TABEL & DETAIL INTERAKTIF */}
      {activeModule ? (
        <div
          className="p-4 rounded-4 shadow-sm animate-fade-in mb-4"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          {/* HEADER MODUL AKTIF */}
          <div className="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-3 border-bottom gap-3" style={{ borderColor: cardBorder }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ transform: "scale(0.85)" }}>
                {RiwayatIcons[currentModuleObj?.iconKey || "profil"]}
              </div>
              <div>
                <h5 className="fw-bold mb-0">{currentModuleObj?.label}</h5>
                <small className="text-muted">{currentModuleObj?.desc}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-success px-3 fw-semibold rounded-pill d-flex align-items-center gap-2 shadow-sm"
                onClick={() => {
                  setModalFormData({});
                  setActiveModal(activeModule);
                }}
              >
                <span>+ Usul Pemutakhiran Data</span>
              </button>
            </div>
          </div>

          {/* 1. RIWAYAT PROFIL */}
          {activeModule === "riwayat_profil" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Kolom Data Diubah</th>
                    <th>Nilai Lama</th>
                    <th>Nilai Baru</th>
                    <th>Tanggal Pengajuan</th>
                    <th>Status Verifikasi</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {profilList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.kolomDiubah}</td>
                      <td className="small text-muted font-monospace">{item.nilaiLama}</td>
                      <td className="small fw-semibold text-success font-monospace">{item.nilaiBaru}</td>
                      <td className="small text-muted">{item.tanggal}</td>
                      <td>
                        <span className={`badge ${item.statusVerifikasi.includes("Disetujui") ? "bg-success" : "bg-warning text-dark"}`}>
                          ✓ {item.statusVerifikasi}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("profil", item.id, item.kolomDiubah)}
                          title="Hapus riwayat"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. RIWAYAT KELUARGA */}
          {activeModule === "riwayat_keluarga" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Nama Anggota Keluarga</th>
                    <th>Hubungan</th>
                    <th>NIK KTP</th>
                    <th>Pekerjaan</th>
                    <th>Status Tanggungan</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {keluargaList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.nama}</td>
                      <td><span className="badge bg-info-subtle text-info">{item.hubungan}</span></td>
                      <td className="font-monospace small">{item.nik}</td>
                      <td className="small">{item.pekerjaan}</td>
                      <td><span className="badge bg-success-subtle text-success">{item.statusTanggungan}</span></td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("keluarga", item.id, item.nama)}
                          title="Hapus data keluarga"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. RIWAYAT SERTIFIKASI */}
          {activeModule === "riwayat_sertifikasi" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Nama Sertifikasi / Diklat</th>
                    <th>Lembaga Penerbit</th>
                    <th>Nomor Sertifikat</th>
                    <th>Masa Berlaku</th>
                    <th>SKP</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sertifikasiList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.namaSertifikasi}</td>
                      <td className="small">{item.penerbit}</td>
                      <td className="font-monospace small">{item.nomorSertifikat}</td>
                      <td className="small">{item.masaBerlaku}</td>
                      <td><span className="badge bg-warning-subtle text-warning">{item.skp} SKP</span></td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("sertifikasi", item.id, item.namaSertifikasi)}
                          title="Hapus sertifikat"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. RIWAYAT PROFESI */}
          {activeModule === "riwayat_profesi" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Jenjang Profesi / Jabatan</th>
                    <th>Instansi</th>
                    <th>Nomor SK Kredensialing</th>
                    <th>TMT</th>
                    <th>Kewenangan Klinis (SPK/RKK)</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {profesiList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold text-primary">{item.jabatanProfesi}</td>
                      <td className="small">{item.instansi}</td>
                      <td className="font-monospace small">{item.noSk}</td>
                      <td className="small">{item.tmt}</td>
                      <td className="small">{item.kewenanganKlinis}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("profesi", item.id, item.jabatanProfesi)}
                          title="Hapus riwayat profesi"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. RIWAYAT PENGHARGAAN */}
          {activeModule === "riwayat_penghargaan" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Nama Tanda Kehormatan / Piagam</th>
                    <th>Pemberi Penghargaan</th>
                    <th>Tahun</th>
                    <th>Nomor Piagam</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {penghargaanList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.namaPenghargaan}</td>
                      <td className="small">{item.pemberi}</td>
                      <td><span className="badge bg-success-subtle text-success">{item.tahun}</span></td>
                      <td className="font-monospace small">{item.nomorPiagam}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("penghargaan", item.id, item.namaPenghargaan)}
                          title="Hapus penghargaan"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. RIWAYAT ORGANISASI */}
          {activeModule === "riwayat_organisasi" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Nama Organisasi Profesi</th>
                    <th>Jabatan</th>
                    <th>Nomor Anggota</th>
                    <th>Periode</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {organisasiList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold">{item.namaOrganisasi}</td>
                      <td><span className="badge bg-info-subtle text-info">{item.jabatan}</span></td>
                      <td className="font-monospace small">{item.nomorAnggota}</td>
                      <td className="small">{item.tahunMulai} - {item.tahunSelesai}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("organisasi", item.id, item.namaOrganisasi)}
                          title="Hapus organisasi"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. RIWAYAT PENDIDIKAN */}
          {activeModule === "riwayat_pendidikan" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Jenjang</th>
                    <th>Institusi Pendidikan</th>
                    <th>Program Studi / Gelar</th>
                    <th>Tahun Lulus</th>
                    <th>IPK</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendidikanList.map((item) => (
                    <tr key={item.id}>
                      <td><span className="badge bg-purple-subtle text-purple fw-bold">{item.jenjang}</span></td>
                      <td className="fw-semibold">{item.namaInstitusi}</td>
                      <td className="small">{item.jurusan}</td>
                      <td className="small">{item.tahunLulus}</td>
                      <td className="fw-bold text-success">{item.ipk}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("pendidikan", item.id, item.namaInstitusi)}
                          title="Hapus pendidikan"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 8. RIWAYAT KINERJA */}
          {activeModule === "riwayat_kinerja" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Periode Tahun</th>
                    <th>Skor SKP</th>
                    <th>Predikat Kinerja</th>
                    <th>Pejabat Penilai</th>
                    <th>Catatan Evaluasi</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kinerjaList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.tahun}</td>
                      <td className="fw-bold text-success fs-6">{item.skor}</td>
                      <td><span className="badge bg-success-subtle text-success">{item.predikat}</span></td>
                      <td className="small">{item.atasanLangsung}</td>
                      <td className="small text-muted">{item.catatan}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("kinerja", item.id, `SKP ${item.tahun}`)}
                          title="Hapus SKP"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 9. RIWAYAT KONTRAK */}
          {activeModule === "riwayat_kontrak" && (
            <div className="table-responsive">
              <table className={`table table-hover align-middle mb-0 ${darkMode ? "table-dark" : ""}`}>
                <thead>
                  <tr className="small text-muted">
                    <th>Jenis SK</th>
                    <th>Nomor SK BKN/BKD</th>
                    <th>TMT SK</th>
                    <th>Golongan</th>
                    <th>Gaji Pokok</th>
                    <th>Pejabat Penetap</th>
                    <th>Status BKN</th>
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kontrakList.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold text-primary">{item.jenisSk}</td>
                      <td className="font-monospace small">{item.nomorSk}</td>
                      <td className="small">{item.tmtSk}</td>
                      <td><span className="badge bg-secondary-subtle text-secondary">{item.golonganRuang}</span></td>
                      <td className="fw-semibold text-success">{item.gajiPokok}</td>
                      <td className="small">{item.pejabatPenetap}</td>
                      <td><span className="badge bg-primary text-white">✓ {item.statusVerifikasi}</span></td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger py-0 px-2 rounded-2"
                          onClick={() => handleDeleteItem("kontrak", item.id, item.jenisSk)}
                          title="Hapus riwayat SK"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* GRID UTAMA ALA SCREENSHOT MyASN BKN (2 KOLOM RESPONSIVE) */
        <div className="row g-3 g-md-4 mb-4">
          {MYASN_MODULES.map((mod) => (
            <div key={mod.id} className="col-6 col-md-4 col-lg-3">
              <div
                onClick={() => handleOpenModule(mod.id)}
                className="p-3 p-md-4 rounded-4 text-center h-100 shadow-sm transition-all hover-lift"
                style={{
                  backgroundColor: darkMode ? "#101626" : "#ffffff",
                  border: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(226, 232, 240, 0.95)",
                  cursor: "pointer",
                  boxShadow: darkMode
                    ? "0 4px 20px rgba(0,0,0,0.25)"
                    : "0 2px 10px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                {/* ICON DUAL-TONE DENGAN CHECKMARK CYAN */}
                <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: "64px" }}>
                  {RiwayatIcons[mod.iconKey]}
                </div>

                {/* LABEL MODUL */}
                <h6
                  className="fw-bold mb-1"
                  style={{
                    fontSize: "0.85rem",
                    color: darkMode ? "#f8fafc" : "#1e293b",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {mod.label}
                </h6>

                {/* STATUS BADGE / COUNT */}
                <small
                  className="d-block text-muted"
                  style={{ fontSize: "0.72rem" }}
                >
                  {mod.count}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL INPUT USULAN BARU UNTUK SEMUA MODUL RIWAYAT */}
      {activeModal && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1060,
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "540px" }}>
            <div
              className="modal-content rounded-4 border-0 shadow-lg overflow-hidden"
              style={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                color: darkMode ? "#f8fafc" : "#0f172a",
              }}
            >
              <div
                className="modal-header py-3 px-4 border-bottom d-flex justify-content-between align-items-center"
                style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
              >
                <h6 className="modal-title fw-bold mb-0">
                  + Usul Pemutakhiran {currentModuleObj?.label}
                </h6>
                <button
                  type="button"
                  className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
                  onClick={() => setActiveModal(null)}
                />
              </div>

              <form onSubmit={handleSaveNewItem}>
                <div className="modal-body p-4">
                  {/* FORM KELUARGA */}
                  {activeModal === "riwayat_keluarga" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Nama Lengkap Anggota Keluarga</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Nama lengkap sesuai KTP / KK"
                          value={modalFormData.nama || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nama: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Hubungan Keluarga</label>
                        <select
                          className="form-select"
                          value={modalFormData.hubungan || "Istri"}
                          onChange={(e) => setModalFormData({ ...modalFormData, hubungan: e.target.value })}
                        >
                          <option value="Istri">Istri</option>
                          <option value="Suami">Suami</option>
                          <option value="Anak Kandung">Anak Kandung</option>
                          <option value="Anak Angkat">Anak Angkat</option>
                          <option value="Orang Tua">Orang Tua</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">NIK KTP</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="16 digit NIK"
                          value={modalFormData.nik || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nik: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Pekerjaan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Guru / Pelajar / Wiraswasta"
                          value={modalFormData.pekerjaan || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, pekerjaan: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Status Tanggungan</label>
                        <select
                          className="form-select"
                          value={modalFormData.statusTanggungan || "Dapat Tunjangan"}
                          onChange={(e) => setModalFormData({ ...modalFormData, statusTanggungan: e.target.value })}
                        >
                          <option value="Dapat Tunjangan">Dapat Tunjangan</option>
                          <option value="Tidak Ditanggung">Tidak Ditanggung</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* FORM SERTIFIKASI */}
                  {activeModal === "riwayat_sertifikasi" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Nama Sertifikat / Pelatihan</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Contoh: Pelatihan BTCLS Jiwa / KARS Akreditasi"
                          value={modalFormData.namaSertifikasi || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, namaSertifikasi: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Lembaga Penerbit</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Kemenkes RI / PPNI / Diklat RSJ"
                          value={modalFormData.penerbit || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, penerbit: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Nomor Sertifikat</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Nomor registrasi sertifikat"
                          value={modalFormData.nomorSertifikat || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nomorSertifikat: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Masa Berlaku Sampai</label>
                        <input
                          type="date"
                          className="form-control"
                          required
                          value={modalFormData.masaBerlaku || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, masaBerlaku: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Jumlah SKP Kemenkes</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={4}
                          value={modalFormData.skp || 4}
                          onChange={(e) => setModalFormData({ ...modalFormData, skp: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM PROFESI */}
                  {activeModal === "riwayat_profesi" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Jenjang Profesi / Jabatan Klinis</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Contoh: Perawat Klinis IV (PK IV Jiwa)"
                          value={modalFormData.jabatanProfesi || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, jabatanProfesi: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Nomor SK Penugasan (SPK)</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="800/RSJ-TPN/SK-PK/..."
                          value={modalFormData.noSk || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, noSk: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">TMT Berlaku</label>
                        <input
                          type="date"
                          className="form-control"
                          required
                          value={modalFormData.tmt || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, tmt: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Rincian Kewenangan Klinis (RKK)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Kewenangan Mandiri Asuhan Keperawatan Jiwa"
                          value={modalFormData.kewenanganKlinis || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, kewenanganKlinis: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM PENGHARGAAN */}
                  {activeModal === "riwayat_penghargaan" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Nama Piagam / Penghargaan</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Satyalancana Karya Satya / Nakes Teladan"
                          value={modalFormData.namaPenghargaan || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, namaPenghargaan: e.target.value })}
                        />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Instansi Pemberi</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Presiden RI / Gubernur Riau / Direktur RSJ"
                          value={modalFormData.pemberi || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, pemberi: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Tahun</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={new Date().getFullYear()}
                          value={modalFormData.tahun || new Date().getFullYear()}
                          onChange={(e) => setModalFormData({ ...modalFormData, tahun: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM ORGANISASI */}
                  {activeModal === "riwayat_organisasi" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Nama Organisasi</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Contoh: PPNI / IDI / HPJI / KORPRI"
                          value={modalFormData.namaOrganisasi || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, namaOrganisasi: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Jabatan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Anggota / Pengurus"
                          value={modalFormData.jabatan || "Anggota"}
                          onChange={(e) => setModalFormData({ ...modalFormData, jabatan: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Nomor Anggota (KTA)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nomor KTA organisasi"
                          value={modalFormData.nomorAnggota || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nomorAnggota: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM PENDIDIKAN */}
                  {activeModal === "riwayat_pendidikan" && (
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Jenjang</label>
                        <select
                          className="form-select"
                          value={modalFormData.jenjang || "Sarjana (S1)"}
                          onChange={(e) => setModalFormData({ ...modalFormData, jenjang: e.target.value })}
                        >
                          <option value="Diploma III (D3)">D3</option>
                          <option value="Sarjana (S1)">S1</option>
                          <option value="Profesi Ners">Profesi Ners</option>
                          <option value="Spesialis (Sp-1)">Spesialis (Sp-1)</option>
                          <option value="Magister (S2)">S2</option>
                        </select>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Nama Perguruan Tinggi</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Contoh: Universitas Riau / Poltekkes"
                          value={modalFormData.namaInstitusi || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, namaInstitusi: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Program Studi / Jurusan</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Ilmu Keperawatan / Kedokteran Jiwa"
                          value={modalFormData.jurusan || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, jurusan: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Tahun Lulus</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={2020}
                          value={modalFormData.tahunLulus || 2020}
                          onChange={(e) => setModalFormData({ ...modalFormData, tahunLulus: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">IPK</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          placeholder="3.75"
                          value={modalFormData.ipk || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, ipk: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM KINERJA */}
                  {activeModal === "riwayat_kinerja" && (
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Tahun SKP</label>
                        <input
                          type="number"
                          className="form-control"
                          defaultValue={new Date().getFullYear()}
                          value={modalFormData.tahun || new Date().getFullYear()}
                          onChange={(e) => setModalFormData({ ...modalFormData, tahun: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Skor SKP (0-100)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          placeholder="94.5"
                          value={modalFormData.skor || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, skor: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Predikat Kinerja</label>
                        <select
                          className="form-select"
                          value={modalFormData.predikat || "Sangat Baik"}
                          onChange={(e) => setModalFormData({ ...modalFormData, predikat: e.target.value })}
                        >
                          <option value="Sangat Baik">Sangat Baik</option>
                          <option value="Baik">Baik</option>
                          <option value="Cukup">Cukup</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Catatan Evaluasi Kinerja</label>
                        <textarea
                          rows={2}
                          className="form-control"
                          placeholder="Kepatuhan SOP dan capaian indikator mutu keperawatan..."
                          value={modalFormData.catatan || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, catatan: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM KONTRAK */}
                  {activeModal === "riwayat_kontrak" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Jenis SK</label>
                        <select
                          className="form-select"
                          value={modalFormData.jenisSk || "SK Perjanjian Kerja PPPK"}
                          onChange={(e) => setModalFormData({ ...modalFormData, jenisSk: e.target.value })}
                        >
                          <option value="SK Pegawai Negeri Sipil (PNS)">SK PNS</option>
                          <option value="SK Calon PNS (CPNS)">SK CPNS</option>
                          <option value="SK Perjanjian Kerja PPPK">SK PPPK</option>
                          <option value="SK Kenaikan Pangkat">SK Kenaikan Pangkat</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Nomor SK</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="813/BKD/SK/..."
                          value={modalFormData.nomorSk || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nomorSk: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">TMT SK</label>
                        <input
                          type="date"
                          className="form-control"
                          required
                          value={modalFormData.tmtSk || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, tmtSk: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Golongan Ruang</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Penata Muda (III/a)"
                          value={modalFormData.golonganRuang || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, golonganRuang: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM RIWAYAT PROFIL */}
                  {activeModal === "riwayat_profil" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Elemen Data yang Ingin Diperbarui</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Contoh: Nomor WhatsApp / Email Resmi / Alamat KTP"
                          value={modalFormData.kolomDiubah || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, kolomDiubah: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Nilai Data Baru</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Masukkan data baru yang valid"
                          value={modalFormData.nilaiBaru || ""}
                          onChange={(e) => setModalFormData({ ...modalFormData, nilaiBaru: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="modal-footer py-2 px-4 border-top d-flex justify-content-between"
                  style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3"
                    onClick={() => setActiveModal(null)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-sm btn-success px-4 fw-bold shadow-sm">
                    Simpan & Teruskan ke SIASN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
