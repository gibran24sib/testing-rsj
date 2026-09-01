import React, { useState, useMemo } from "react";
import SdmEmployeeModal from "../components/SdmEmployeeModal";
import SdmLeaveModal from "../components/SdmLeaveModal";
import SdmAbkWisnModal from "../components/SdmAbkWisnModal";
import SdmSpkModal from "../components/SdmSpkModal";
import SdmPresensiModal from "../components/SdmPresensiModal";
import SdmDossierModal from "../components/SdmDossierModal";

import {
  initialWisnData,
  initialCredentials,
  initialAttendanceLogs,
  initialDossiers,
} from "../data/sdmData";

export default function SdmTab({
  activeTab = "direktori",
  setActiveTab,
  employees = [],
  shiftRoster = [],
  leaveRequests = [],
  trainings = [],
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onSubmitLeave,
  onApproveLeave,
  onRejectLeave,
  onRenewStrSip,
  darkMode,
  showToast,
}) {
  // SUB-TAB STATE
  const [subTab, setSubTab] = useState(activeTab || "direktori");

  // DATA STATES FOR CAT 2 & 4
  const [wisnList, setWisnList] = useState(initialWisnData);
  const [credentialsList, setCredentialsList] = useState(initialCredentials);
  const [attendanceLogs, setAttendanceLogs] = useState(initialAttendanceLogs);
  const [dossiersList, setDossiersList] = useState(() => {
    try {
      const saved = localStorage.getItem("rsj_dossiers");
      return saved ? JSON.parse(saved) : initialDossiers;
    } catch {
      return initialDossiers;
    }
  });

  // MODAL STATES
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState("view");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // NEW MODALS STATES (CAT 2 & 4)
  const [isAbkModalOpen, setIsAbkModalOpen] = useState(false);
  const [selectedWisnUnit, setSelectedWisnUnit] = useState(null);

  const [isSpkModalOpen, setIsSpkModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  const [isPresensiModalOpen, setIsPresensiModalOpen] = useState(false);

  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);

  React.useEffect(() => {
    if (activeTab && [
      "direktori",
      "roster",
      "abk_wisn",
      "kredensialing",
      "presensi",
      "dossier",
      "legalitas",
      "cuti",
      "diklat",
      "analitik"
    ].includes(activeTab)) {
      setSubTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setSubTab(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  // SEARCH & FILTER STATE (DIREKTORI)
  const [searchEmp, setSearchEmp] = useState("");
  const [filterCategory, setFilterCategory] = useState("semua");
  const [filterUnit, setFilterUnit] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");

  // ROSTER FILTER
  const [rosterWardFilter, setRosterWardFilter] = useState("semua");

  // FILTERED EMPLOYEES
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.nama.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.profesi.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.unitPenempatan.toLowerCase().includes(searchEmp.toLowerCase());

      const matchCategory = filterCategory === "semua" || emp.kategori === filterCategory;
      const matchUnit = filterUnit === "semua" || emp.unitPenempatan.includes(filterUnit);
      const matchStatus = filterStatus === "semua" || emp.statusKepegawaian === filterStatus;

      return matchSearch && matchCategory && matchUnit && matchStatus;
    });
  }, [employees, searchEmp, filterCategory, filterUnit, filterStatus]);

  // STR/SIP EXPIRED COUNT & LIST
  const expiringLicenses = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.str?.status === "Expired" ||
        emp.str?.status === "Mendekati Expired" ||
        emp.sip?.status === "Expired" ||
        emp.sip?.status === "Mendekati Expired"
    );
  }, [employees]);

  // STATS
  const stats = useMemo(() => {
    const total = employees.length;
    const medis = employees.filter((e) => e.kategori === "Medis").length;
    const keperawatan = employees.filter((e) => e.kategori === "Keperawatan").length;
    const pns = employees.filter((e) => e.statusKepegawaian === "PNS").length;
    const pppk = employees.filter((e) => e.statusKepegawaian === "PPPK").length;
    const pendingLeaves = leaveRequests.filter((l) => l.status === "Menunggu Persetujuan").length;
    const totalDefisitWisn = wisnList.reduce((acc, curr) => acc + (curr.selisihKebutuhan < 0 ? Math.abs(curr.selisihKebutuhan) : 0), 0);

    return { total, medis, keperawatan, pns, pppk, pendingLeaves, totalDefisitWisn };
  }, [employees, leaveRequests, wisnList]);

  // HANDLERS
  const handleOpenAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeModalMode("add");
    setIsEmployeeModalOpen(true);
  };

  const handleOpenViewEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode("view");
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode("edit");
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (empData, mode) => {
    if (mode === "add") {
      onAddEmployee(empData);
      showToast?.("Berhasil Menambah", `${empData.nama} berhasil terdaftar di SIM-SDM.`, "success");
    } else {
      onUpdateEmployee(empData);
      showToast?.("Data Diperbarui", `Informasi ${empData.nama} berhasil diperbarui.`, "success");
    }
  };

  const handleDeleteEmployee = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pegawai ${name}?`)) {
      onDeleteEmployee(id);
      showToast?.("Data Dihapus", `Data pegawai ${name} berhasil dihapus.`, "info");
    }
  };

  const handleOpenSpkModal = (cred) => {
    setSelectedCredential(cred);
    setIsSpkModalOpen(true);
  };

  const handleOpenDossierModal = (empId, name) => {
    const existing = dossiersList.find((d) => d.employeeId === empId);
    if (existing) {
      setSelectedDossier(existing);
    } else {
      const newDossier = {
        employeeId: empId,
        nama: name,
        persentaseLengkap: 60,
        dokumen: [
          { id: `DOC-${Date.now()}-1`, nama: "SK Pengangkatan Pegawai", tipe: "PDF", ukuran: "1.2 MB", tanggalUpload: "2024-01-10", status: "Terverifikasi" },
          { id: `DOC-${Date.now()}-2`, nama: "Ijazah Terakhir", tipe: "PDF", ukuran: "2.0 MB", tanggalUpload: "2024-01-10", status: "Terverifikasi" },
          { id: `DOC-${Date.now()}-3`, nama: "STR & SIP Nakes", tipe: "PDF", ukuran: "850 KB", tanggalUpload: "2024-03-12", status: "Terverifikasi" },
        ],
      };
      setSelectedDossier(newDossier);
    }
    setIsDossierModalOpen(true);
  };

  const handleSaveDossier = (updatedDossier) => {
    setDossiersList((prev) => {
      const idx = prev.findIndex((d) => d.employeeId === updatedDossier.employeeId);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = updatedDossier;
      } else {
        updated = [updatedDossier, ...prev];
      }
      try {
        localStorage.setItem("rsj_dossiers", JSON.stringify(updated));
      } catch (e) {
        console.error("Gagal simpan dossiers:", e);
      }
      return updated;
    });
    setSelectedDossier(updatedDossier);
    showToast?.("Arsip Diperbarui", `Dokumen digital untuk ${updatedDossier.nama} berhasil disimpan.`, "success");
  };

  const handleAddAttendance = (newLog) => {
    setAttendanceLogs((prev) => [newLog, ...prev]);
    showToast?.("Presensi Tercatat", `Presensi ${newLog.shift} atas nama ${newLog.nama} berhasil direkam.`, "success");
  };

  // UI THEME HELPERS
  const cardBg = darkMode ? "#111624" : "#ffffff";
  const cardBorder = darkMode ? "#1d253b" : "#e2e8f0";
  const textMuted = darkMode ? "#cbd5e1" : "#475569";
  const tableHeaderBg = darkMode ? "#161c2d" : "#f1f5f9";

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      {/* 1. TOP SUMMARY STAT CARDS */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
            >
              👥
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Total SDM & Nakes
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {stats.total} <span className="fs-6 fw-normal text-muted">Pegawai</span>
              </h4>
              <small className="text-success fw-medium" style={{ fontSize: "0.72rem" }}>
                {stats.medis} Dokter &bull; {stats.keperawatan} Ners Jiwa
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}
            >
              🧮
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Defisit Nakes (WISN)
              </span>
              <h4 className="fw-bold mb-0 text-danger" style={{ letterSpacing: "-0.02em" }}>
                -{stats.totalDefisitWisn} <span className="fs-6 fw-normal text-muted">Formasi Ners</span>
              </h4>
              <small className="text-danger fw-semibold" style={{ fontSize: "0.72rem" }}>
                Kebutuhan Bangsal Kampar & IGD
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" }}
            >
              🎖️
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Kredensialing PK Jiwa
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {credentialsList.length} <span className="fs-6 fw-normal text-muted">SPK Terbit</span>
              </h4>
              <small className="text-purple fw-semibold" style={{ fontSize: "0.72rem", color: "#8b5cf6" }}>
                Jenjang Karir PK I s/d PK IV
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
            >
              ⏱️
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Presensi Shift Hari Ini
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {attendanceLogs.length} <span className="fs-6 fw-normal text-muted">Clock-In</span>
              </h4>
              <small className="text-warning fw-semibold" style={{ fontSize: "0.72rem" }}>
                Presensi Digital Geolocation
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB NAVIGATION PILLS */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-2 rounded-4 shadow-sm"
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
        }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2">
          {[
            { id: "direktori", label: "Direktori Pegawai", icon: "👥" },
            { id: "roster", label: "Roster Shift 24/7", icon: "📅" },
            { id: "abk_wisn", label: "Analisis Beban Kerja (WISN)", icon: "🧮", badge: "Kemenkes" },
            { id: "kredensialing", label: "Jenjang Karir & SPK/RKK", icon: "🎖️", badge: "KARS" },
            { id: "presensi", label: "E-Presensi Shift", icon: "⏱️", badge: "Live" },
            { id: "dossier", label: "E-Berkas Digital Dossier", icon: "📁" },
            { id: "legalitas", label: "Legalitas STR & SIP", icon: "📜", alert: expiringLicenses.length },
            { id: "cuti", label: "Pengajuan Cuti", icon: "🏖️", alert: stats.pendingLeaves },
            { id: "diklat", label: "Diklat Jiwa", icon: "🎓" },
            { id: "analitik", label: "Analitik SDM & Kinerja", icon: "📊" },
          ].map((tab) => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 transition-all ${
                  isActive ? "btn-success fw-semibold shadow-sm" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "#10b981" : darkMode ? "#181f33" : "#f1f5f9",
                  color: isActive ? "#ffffff" : darkMode ? "#e2e8f0" : "#334155",
                  border: "none",
                  fontSize: "0.8rem",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: "0.65rem",
                      backgroundColor: isActive ? "rgba(255,255,255,0.25)" : darkMode ? "#283452" : "#cbd5e1",
                      color: isActive ? "#fff" : darkMode ? "#94a3b8" : "#334155",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.alert !== undefined && tab.alert > 0 && (
                  <span className="badge rounded-pill bg-danger" style={{ fontSize: "0.68rem" }}>
                    {tab.alert}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="d-flex align-items-center gap-2">
          {subTab === "abk_wisn" && (
            <button
              type="button"
              onClick={() => {
                setSelectedWisnUnit(wisnList[0]);
                setIsAbkModalOpen(true);
              }}
              className="btn btn-danger btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold shadow-sm"
            >
              <span>🧮</span> Kalkulator Simulasi WISN
            </button>
          )}
          {subTab === "presensi" && (
            <button
              type="button"
              onClick={() => setIsPresensiModalOpen(true)}
              className="btn btn-success btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold shadow-sm"
            >
              <span>📸</span> Clock-In / Clock-Out Shift
            </button>
          )}
          {subTab === "direktori" && (
            <button
              type="button"
              onClick={handleOpenAddEmployee}
              className="btn btn-success btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold shadow-sm"
            >
              <span>➕</span> Tambah Pegawai
            </button>
          )}
          {subTab === "cuti" && (
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="btn btn-warning btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold text-dark shadow-sm"
            >
              <span>🏖️</span> Ajukan Cuti Baru
            </button>
          )}
        </div>
      </div>

      {/* 3. SUB-TAB CONTENTS */}

      {/* =================================================================== */}
      {/* TAB: ANALISIS BEBAN KERJA (WISN KEMENKES RI)                        */}
      {/* =================================================================== */}
      {subTab === "abk_wisn" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🧮 Analisis Beban Kerja Ketenagaan (Metode WISN Kemenkes RI)</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Perhitungan kebutuhan riil tenaga perawat & dokter jiwa berbasis Permenkes RI No. 33 & Standar Akreditasi KARS
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedWisnUnit(wisnList[0]);
                setIsAbkModalOpen(true);
              }}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
            >
              <span>⚙️</span> Buka Simulator Interaktif WISN
            </button>
          </div>

          <div className="row g-3">
            {wisnList.map((w) => (
              <div key={w.id} className="col-12 col-lg-6">
                <div
                  className="p-4 rounded-3 h-100 border d-flex flex-column justify-content-between transition-all"
                  style={{
                    backgroundColor: darkMode ? "#141a2c" : "#f8fafc",
                    borderColor: darkMode ? "#222c45" : "#e2e8f0",
                  }}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">{w.kategoriUnit}</span>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          w.status.includes("Defisit Kritis")
                            ? "bg-danger"
                            : w.status.includes("Defisit")
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>

                    <h5 className="fw-bold mb-1">{w.unit}</h5>
                    <p className="small text-muted mb-3">
                      BOR Hunian: <strong>{w.borRanjang}%</strong> &bull; {w.pasienAktif} Pasien Aktif ({w.ketergantungan.totalCare} Total Care / Restrain)
                    </p>

                    <div className="row g-2 text-center mb-3">
                      <div className="col-4">
                        <div className="p-2 rounded border bg-body-tertiary">
                          <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Nakes Ada</small>
                          <strong className="fs-5 text-primary">{w.tenagaTersedia}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded border bg-body-tertiary">
                          <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Kebutuhan Ideal</small>
                          <strong className="fs-5 text-success">{w.kebutuhanTenagaIdeal}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded border bg-body-tertiary">
                          <small className="d-block text-muted" style={{ fontSize: "0.7rem" }}>Rasio WISN</small>
                          <strong className={`fs-5 ${w.rasioWisn < 1.0 ? "text-danger" : "text-success"}`}>
                            {w.rasioWisn}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <p className="small text-muted mb-0" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                      <strong>Rekomendasi Formasi:</strong> {w.rekomendasi}
                    </p>
                  </div>

                  <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Formula WKT: 1.840 Jam/Thn</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedWisnUnit(w);
                        setIsAbkModalOpen(true);
                      }}
                    >
                      Kalkulasi Ulang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB: JENJANG KARIR PK I - PK IV & SPK/RKK KOMITE                   */}
      {/* =================================================================== */}
      {subTab === "kredensialing" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🎖️ Jenjang Karir Perawat Jiwa & Kredensialing SPK / RKK</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Surat Penugasan Klinis (SPK) & Rincian Kewenangan Klinis (RKK) Komite Keperawatan & Komite Medik RSJ Tampan
              </p>
            </div>
            <span className="badge bg-purple rounded-pill px-3 py-2" style={{ backgroundColor: "#8b5cf6", color: "#fff" }}>
              Standar Akreditasi KARS Kemenkes
            </span>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Tenaga Medis / Nakes</th>
                  <th className="py-3">Jenjang Karir Klinis</th>
                  <th className="py-3">Nomor SPK & Masa Berlaku</th>
                  <th className="py-3">Komite Penilai & Mitra Bestari</th>
                  <th className="py-3 text-center">Status Kredensial</th>
                  <th className="py-3 text-end px-3">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody>
                {credentialsList.map((c) => (
                  <tr key={c.id} style={{ borderBottomColor: cardBorder }}>
                    <td className="px-3 py-3">
                      <div className="fw-bold">{c.nama}</div>
                      <small className="text-muted">{c.id}</small>
                    </td>
                    <td>
                      <span className="badge bg-purple-subtle text-purple fw-bold" style={{ color: "#8b5cf6" }}>
                        {c.jenjangKarir}
                      </span>
                    </td>
                    <td>
                      <div className="font-monospace small">{c.noSpk}</div>
                      <small className="text-muted">Exp: {c.masaBerlakuSpk}</small>
                    </td>
                    <td>
                      <div>{c.komite}</div>
                      <small className="text-muted">Peer: {c.mitraBestari}</small>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          c.statusKredensial.includes("Penuh")
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {c.statusKredensial}
                      </span>
                    </td>
                    <td className="text-end px-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-purple d-inline-flex align-items-center gap-1"
                        style={{ color: "#8b5cf6", borderColor: "#8b5cf6" }}
                        onClick={() => handleOpenSpkModal(c)}
                      >
                        <span>📜</span> Lihat RKK & SPK
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB: E-PRESENSI SHIFT DIGITAL 24/7                                  */}
      {/* =================================================================== */}
      {subTab === "presensi" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">⏱️ E-Presensi Shift & Clock-In/Out Geolocation RSJ</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Pencatatan kehadiran dinas shift 24 jam dengan verifikasi GPS Geofencing radius RSJ Tampan & Swafoto
              </p>
            </div>
            <button
              type="button"
              className="btn btn-success btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm"
              onClick={() => setIsPresensiModalOpen(true)}
            >
              <span>📸</span> Clock-In / Clock-Out Shift
            </button>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Pegawai / Foto</th>
                  <th className="py-3">Shift & Bangsal Tugas</th>
                  <th className="py-3">Waktu Masuk & Pulang</th>
                  <th className="py-3">Status Kehadiran</th>
                  <th className="py-3">Verifikasi GPS Geofence</th>
                  <th className="py-3 text-center">Metode</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.map((att) => (
                  <tr key={att.id} style={{ borderBottomColor: cardBorder }}>
                    <td className="px-3 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={att.fotoPresensi}
                          alt={att.nama}
                          className="rounded-circle"
                          style={{ width: "36px", height: "36px", objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-bold">{att.nama}</div>
                          <small className="text-muted">{att.profesi}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold">{att.shift}</div>
                      <small className="text-muted">{att.unit}</small>
                    </td>
                    <td>
                      <div>
                        <strong>In:</strong> {att.jamMasuk} &bull; <strong>Out:</strong> {att.jamPulang}
                      </div>
                      <small className="text-muted">Tgl: {att.tanggal}</small>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-2 py-1 ${
                          att.statusKehadiran.includes("Terlambat")
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {att.statusKehadiran}
                      </span>
                    </td>
                    <td>
                      <small className="font-monospace text-success d-block">{att.lokasiGps}</small>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "0.7rem" }}>
                        {att.metode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB: E-BERKAS & DIGITAL DOSSIER                                     */}
      {/* =================================================================== */}
      {subTab === "dossier" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">📁 E-Berkas & Arsip Digital Dossier Pegawai</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Penyimpanan digital SK Pengangkatan, Ijazah, STR, SIP, Sertifikat Pelatihan Jiwa, dan dokumen kepegawaian
              </p>
            </div>
            <span className="badge bg-primary rounded-pill px-3 py-2">
              DMS Dokumen Terenkripsi
            </span>
          </div>

          <div className="row g-3">
            {employees.map((emp) => {
              const dos = dossiersList.find((d) => d.employeeId === emp.id) || {
                persentaseLengkap: 80,
                dokumen: [{ nama: "SK Pengangkatan" }, { nama: "Ijazah" }, { nama: "STR/SIP" }],
              };

              return (
                <div key={emp.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: darkMode ? "#141a2c" : "#f8fafc",
                      borderColor: darkMode ? "#222c45" : "#e2e8f0",
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={emp.foto}
                          alt={emp.nama}
                          className="rounded-circle shadow-sm"
                          style={{ width: "48px", height: "48px", objectFit: "cover" }}
                        />
                        <div className="overflow-hidden">
                          <h6 className="fw-bold mb-0 text-truncate">{emp.nama}</h6>
                          <small className="text-muted d-block text-truncate">NIP: {emp.nip}</small>
                          <span className="badge bg-info text-dark" style={{ fontSize: "0.68rem" }}>
                            {emp.profesi}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">Kelengkapan Arsip:</span>
                          <strong className="text-success">{dos.persentaseLengkap}%</strong>
                        </div>
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${dos.persentaseLengkap}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted">📁 {dos.dokumen?.length || 3} Berkas Tersimpan</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleOpenDossierModal(emp.id, emp.nama)}
                      >
                        Buka Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* EXISTING SUB-TABS (DIREKTORI, ROSTER, LEGALITAS, CUTI, DIKLAT, ANALITIK) */}
      {/* =================================================================== */}

      {/* TAB: DIREKTORI PEGAWAI */}
      {subTab === "direktori" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {/* SEARCH & FILTERS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                    borderColor: darkMode ? "#283452" : "#cbd5e1",
                    color: textMuted,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari nama, NIP, profesi, atau bangsal..."
                  value={searchEmp}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  className="form-control form-control-sm border-start-0"
                  style={{
                    backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                    color: darkMode ? "#ffffff" : "#0f172a",
                    borderColor: darkMode ? "#283452" : "#cbd5e1",
                  }}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Kategori Tenaga</option>
                <option value="Medis">Medis (Dokter & Psikolog)</option>
                <option value="Keperawatan">Keperawatan (Ners Jiwa)</option>
                <option value="Kefarmasian">Kefarmasian (Apoteker)</option>
                <option value="Penunjang Medis">Penunjang Medis (RMIK)</option>
                <option value="Administrasi & Manajemen">Administrasi & Manajemen</option>
                <option value="Keamanan & Pengamanan">Keamanan (Security Krisis)</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Unit Penempatan</option>
                <option value="Kampar">Bangsal Kampar (Akut Pria)</option>
                <option value="Siak">Bangsal Siak (Wanita)</option>
                <option value="Indragiri">Bangsal Indragiri (Tenang)</option>
                <option value="Rokan">Bangsal Rokan (NAPZA)</option>
                <option value="IGD Jiwa">IGD Jiwa & Krisis</option>
                <option value="Poli">Poli Jiwa & Klinik</option>
                <option value="Farmasi">Instalasi Farmasi</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Pegawai BLUD">BLUD</option>
                <option value="Kontrak">Kontrak</option>
              </select>
            </div>
          </div>

          {/* TABLE OF EMPLOYEES */}
          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Pegawai / Nakes</th>
                  <th className="py-3">Profesi & Jabatan</th>
                  <th className="py-3">Penempatan Unit</th>
                  <th className="py-3">Status ASN</th>
                  <th className="py-3 text-center">Status STR / SIP</th>
                  <th className="py-3 text-center">SKP</th>
                  <th className="py-3 text-end px-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      Tidak ada data pegawai yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isStrExpired = emp.str?.status === "Expired" || emp.sip?.status === "Expired";
                    const isStrWarning = emp.str?.status === "Mendekati Expired" || emp.sip?.status === "Mendekati Expired";

                    return (
                      <tr key={emp.id} style={{ borderBottomColor: cardBorder }}>
                        <td className="px-3 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={emp.foto}
                              alt={emp.nama}
                              className="rounded-circle shadow-sm"
                              style={{ width: "42px", height: "42px", objectFit: "cover" }}
                            />
                            <div>
                              <div className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>
                                {emp.nama}
                              </div>
                              <small className="text-muted d-block" style={{ fontSize: "0.74rem" }}>
                                NIP: {emp.nip}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-medium">{emp.profesi}</div>
                          <small style={{ color: textMuted, fontSize: "0.74rem" }}>{emp.jabatan}</small>
                        </td>
                        <td>
                          <span
                            className="badge px-2 py-1 rounded-2"
                            style={{
                              backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
                              color: darkMode ? "#cbd5e1" : "#334155",
                              border: darkMode ? "1px solid #334155" : "1px solid #cbd5e1",
                            }}
                          >
                            {emp.unitPenempatan}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              emp.statusKepegawaian === "PNS"
                                ? "bg-primary"
                                : emp.statusKepegawaian === "PPPK"
                                ? "bg-info text-dark"
                                : emp.statusKepegawaian === "Pegawai BLUD"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {emp.statusKepegawaian}
                          </span>
                          <small className="d-block text-muted" style={{ fontSize: "0.72rem" }}>
                            {emp.golongan}
                          </small>
                        </td>
                        <td className="text-center">
                          {emp.str?.nomor === "-" ? (
                            <span className="badge bg-secondary opacity-75">Non-Nakes</span>
                          ) : (
                            <span
                              className={`badge rounded-pill px-2 py-1 ${
                                isStrExpired
                                  ? "bg-danger"
                                  : isStrWarning
                                  ? "bg-warning text-dark fw-bold"
                                  : "bg-success"
                              }`}
                            >
                              {isStrExpired ? "⚠️ STR Expired" : isStrWarning ? "⚡ Menjelang Habis" : "✅ STR/SIP Aktif"}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border fw-semibold">{emp.skpSkor}</span>
                        </td>
                        <td className="text-end px-3">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              onClick={() => handleOpenViewEmployee(emp)}
                              className="btn btn-outline-info"
                              title="Lihat Detail Profil"
                            >
                              👁️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditEmployee(emp)}
                              className="btn btn-outline-primary"
                              title="Edit Data Pegawai"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEmployee(emp.id, emp.nama)}
                              className="btn btn-outline-danger"
                              title="Hapus Pegawai"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ROSTER SHIFT 24/7 */}
      {subTab === "roster" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">📅 Jadwal Shift & Duty Roster Bangsal Jiwa 24 Jam</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Distribusi perawat pelaksana, ketua tim (Katim), dokter spesialis on-call, dan petugas respon krisis bangsal
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                value={rosterWardFilter}
                onChange={(e) => setRosterWardFilter(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                  width: "220px",
                }}
              >
                <option value="semua">Semua Bangsal & IGD</option>
                <option value="Kampar">Bangsal Kampar (Akut Pria)</option>
                <option value="Siak">Bangsal Siak (Wanita)</option>
                <option value="IGD Jiwa">IGD Jiwa & Krisis</option>
                <option value="Rokan">Bangsal Rokan (NAPZA)</option>
              </select>
            </div>
          </div>

          {/* ROSTER CARDS */}
          <div className="row g-4">
            {shiftRoster
              .filter((r) => rosterWardFilter === "semua" || r.bangsal.includes(rosterWardFilter))
              .map((roster) => (
                <div key={roster.id} className="col-12 col-lg-6">
                  <div
                    className="p-3 rounded-3 h-100 border transition-all"
                    style={{
                      backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                      borderColor: darkMode ? "#1f273d" : "#e2e8f0",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                      <div>
                        <span className="badge bg-success mb-1">{roster.bangsal}</span>
                        <div className="small fw-semibold text-muted">
                          {roster.hari}, {roster.tanggal}
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3 py-1">{roster.status}</span>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-3" style={{ fontSize: "0.85rem" }}>
                      {/* SHIFT PAGI */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#ecfdf5", borderLeft: "4px solid #10b981" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-success mb-1">
                          <span>🌅 Shift Pagi (07.30 - 14.30 WIB)</span>
                          <span className="badge bg-success-subtle text-success">{roster.shiftPagi.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftPagi.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SHIFT SORE */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#eff6ff", borderLeft: "4px solid #3b82f6" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-primary mb-1">
                          <span>☀️ Shift Sore (14.30 - 21.00 WIB)</span>
                          <span className="badge bg-primary-subtle text-primary">{roster.shiftSore.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftSore.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SHIFT MALAM */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#faf5ff", borderLeft: "4px solid #8b5cf6" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-purple mb-1">
                          <span>🌙 Shift Malam (21.00 - 07.30 WIB)</span>
                          <span className="badge bg-purple-subtle text-purple">{roster.shiftMalam.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftMalam.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                      style={{ backgroundColor: darkMode ? "#1d253b" : "#f1f5f9", fontSize: "0.82rem" }}
                    >
                      <span className="fw-semibold text-muted">🩺 Dokter Spesialis Jaga (On-Call):</span>
                      <strong className="text-success">{roster.dokterJagaOnCall}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: LEGALITAS STR & SIP */}
      {subTab === "legalitas" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">📜 Pelacakan & Peringatan Masa Berlaku STR & SIP Nakes</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Sistem audit legalitas izin praktik dokter, psikolog klinis, dan perawat jiwa RSJ Tampan
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-danger rounded-pill px-3 py-2">
                ⚠️ {expiringLicenses.length} Nakes Perlu Perpanjangan Izin
              </span>
            </div>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Tenaga Medis / Nakes</th>
                  <th className="py-3">Profesi & Unit</th>
                  <th className="py-3">Nomor STR & Masa Berlaku</th>
                  <th className="py-3">Nomor SIP & Masa Berlaku</th>
                  <th className="py-3 text-center">Status Kepatuhan</th>
                  <th className="py-3 text-end px-3">Aksi Perpanjangan</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter((e) => e.str?.nomor !== "-")
                  .map((emp) => {
                    const isStrExpired = emp.str?.status === "Expired" || emp.sip?.status === "Expired";
                    const isStrWarning =
                      emp.str?.status === "Mendekati Expired" || emp.sip?.status === "Mendekati Expired";

                    return (
                      <tr key={emp.id} style={{ borderBottomColor: cardBorder }}>
                        <td className="px-3 py-3">
                          <div className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>
                            {emp.nama}
                          </div>
                          <small className="text-muted">NIP: {emp.nip}</small>
                        </td>
                        <td>
                          <div>{emp.profesi}</div>
                          <small className="text-muted">{emp.unitPenempatan}</small>
                        </td>
                        <td>
                          <div className="font-monospace small">{emp.str?.nomor}</div>
                          <small
                            className={
                              emp.str?.status === "Expired"
                                ? "text-danger fw-bold"
                                : emp.str?.status === "Mendekati Expired"
                                ? "text-warning fw-bold"
                                : "text-success"
                            }
                          >
                            Exp: {emp.str?.masaBerlaku} ({emp.str?.status})
                          </small>
                        </td>
                        <td>
                          <div className="font-monospace small">{emp.sip?.nomor}</div>
                          <small
                            className={
                              emp.sip?.status === "Expired"
                                ? "text-danger fw-bold"
                                : emp.sip?.status === "Mendekati Expired"
                                ? "text-warning fw-bold"
                                : "text-success"
                            }
                          >
                            Exp: {emp.sip?.masaBerlaku} ({emp.sip?.status})
                          </small>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge px-3 py-1 rounded-pill ${
                              isStrExpired ? "bg-danger" : isStrWarning ? "bg-warning text-dark" : "bg-success"
                            }`}
                          >
                            {isStrExpired ? "⛔ Expired" : isStrWarning ? "⚡ < 90 Hari" : "✅ Valid"}
                          </span>
                        </td>
                        <td className="text-end px-3">
                          <button
                            type="button"
                            onClick={() => {
                              onRenewStrSip?.(emp.id);
                              showToast?.("Legalitas Diperpanjang", `STR/SIP atas nama ${emp.nama} telah diverifikasi perpanjangan 5 tahun.`, "success");
                            }}
                            className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <span>🔄</span> Perbarui STR/SIP
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PENGAJUAN & APPROVAL CUTI */}
      {subTab === "cuti" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🏖️ Manajemen Pengajuan & Persetujuan Cuti Pegawai</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Pengelolaan cuti tahunan, cuti sakit, seminar/tugas belajar, dan pelimpahan tugas (handover)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="btn btn-warning btn-sm d-flex align-items-center gap-2 fw-semibold text-dark shadow-sm px-3 py-2"
            >
              <span>➕</span> Ajukan Permohonan Cuti
            </button>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">No. Cuti / Pemohon</th>
                  <th className="py-3">Jenis & Durasi</th>
                  <th className="py-3">Rentang Tanggal</th>
                  <th className="py-3">Alasan & Handover</th>
                  <th className="py-3 text-center">Status Approval</th>
                  <th className="py-3 text-end px-3">Tindakan Atasan / HRD</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} style={{ borderBottomColor: cardBorder }}>
                    <td className="px-3 py-3">
                      <div className="fw-bold">{leave.nama}</div>
                      <small className="text-muted">
                        {leave.id} &bull; {leave.unit}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary fw-semibold">{leave.jenisCuti}</span>
                      <small className="d-block text-muted">{leave.jumlahHari} Hari Kerja</small>
                    </td>
                    <td>
                      <div className="small fw-semibold">
                        {leave.tanggalMulai} s/d {leave.tanggalSelesai}
                      </div>
                      <small className="text-muted">Diajukan: {leave.tanggalPengajuan}</small>
                    </td>
                    <td style={{ maxWidth: "250px" }}>
                      <div className="text-truncate" title={leave.alasan}>
                        {leave.alasan}
                      </div>
                      <small className="text-info d-block">
                        <strong>Pengganti:</strong> {leave.petugasPengganti}
                      </small>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${
                          leave.status === "Disetujui"
                            ? "bg-success"
                            : leave.status === "Ditolak"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="text-end px-3">
                      {leave.status === "Menunggu Persetujuan" ? (
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            onClick={() => {
                              onApproveLeave?.(leave.id);
                              showToast?.("Cuti Disetujui", `Pengajuan cuti ${leave.nama} berhasil disetujui.`, "success");
                            }}
                            className="btn btn-success"
                            title="Setujui Pengajuan Cuti"
                          >
                            ✅ Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onRejectLeave?.(leave.id);
                              showToast?.("Cuti Ditolak", `Pengajuan cuti ${leave.nama} telah ditolak.`, "info");
                            }}
                            className="btn btn-danger"
                            title="Tolak Pengajuan Cuti"
                          >
                            ❌ Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="small text-muted">Selesai Ditinjau</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DIKLAT KHUSUS JIWA */}
      {subTab === "diklat" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🎓 Diklat, Sertifikasi & Kredensialing Khusus Jiwa</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Program pelatihan wajib penanganan de-eskalasi krisis, fiksasi fisik aman, BTCLS, dan asuhan jiwa akut
              </p>
            </div>
          </div>

          <div className="row g-3">
            {trainings.map((trn) => (
              <div key={trn.id} className="col-12 col-md-6">
                <div
                  className="p-4 rounded-3 h-100 border d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: darkMode ? "#141a2c" : "#f8fafc",
                    borderColor: darkMode ? "#1f273d" : "#e2e8f0",
                  }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-info-subtle text-info fw-semibold">{trn.kategori}</span>
                      <span
                        className={`badge rounded-pill ${
                          trn.status === "Selesai"
                            ? "bg-secondary"
                            : trn.status === "Segera Dibuka"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {trn.status}
                      </span>
                    </div>
                    <h6 className="fw-bold mb-2">{trn.namaPelatihan}</h6>
                    <ul className="list-unstyled small mb-3 d-flex flex-column gap-1" style={{ color: textMuted }}>
                      <li>
                        <strong>🏢 Penyelenggara:</strong> {trn.penyelenggara}
                      </li>
                      <li>
                        <strong>🎯 Target Peserta:</strong> {trn.targetProfesi}
                      </li>
                      <li>
                        <strong>📅 Jadwal Pelaksanaan:</strong> {trn.jadwalMulai} s/d {trn.jadwalSelesai}
                      </li>
                      <li>
                        <strong>📍 Lokasi:</strong> {trn.lokasi}
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                    <span className="small fw-semibold text-success">👥 {trn.pesertaTerdaftar} Peserta Terdaftar</span>
                    <button
                      type="button"
                      onClick={() => showToast?.("Registrasi Diklat", `Pendaftaran untuk ${trn.namaPelatihan} telah diverifikasi.`, "success")}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Daftarkan Peserta Nakes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ANALITIK KINERJA SDM */}
      {subTab === "analitik" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <h5 className="fw-bold mb-3">📊 Analitik Eksekutif Ketenagaan & Kinerja SDM RSJ Tampan</h5>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Rasio Perawat : Pasien Jiwa</span>
                <h2 className="fw-bold text-success my-2">1 : 3.8</h2>
                <small className="text-success">✅ Sesuai Standar Kemenkes RI (Ideal &lt; 1:5)</small>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Tingkat Kehadiran Shift Bulan Ini</span>
                <h2 className="fw-bold text-primary my-2">96.4%</h2>
                <small className="text-primary">Disiplin Tinggi &bull; Presensi Terpantau</small>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Rata-Rata Skor Kinerja (SKP)</span>
                <h2 className="fw-bold text-info my-2">92.8 <span className="fs-6">/100</span></h2>
                <small className="text-info">Predikat: <strong>Sangat Baik</strong></small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      <SdmEmployeeModal
        isOpen={isEmployeeModalOpen}
        mode={employeeModalMode}
        employee={selectedEmployee}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        darkMode={darkMode}
      />

      <SdmLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitLeave={(leaveData) => {
          onSubmitLeave(leaveData);
          showToast?.("Pengajuan Terkirim", "Permohonan cuti berhasil dikirim ke Subbag Kepegawaian.", "success");
        }}
        employees={employees}
        darkMode={darkMode}
      />

      {/* CAT 2 & CAT 4 MODALS */}
      <SdmAbkWisnModal
        isOpen={isAbkModalOpen}
        onClose={() => setIsAbkModalOpen(false)}
        initialData={selectedWisnUnit}
        darkMode={darkMode}
      />

      <SdmSpkModal
        isOpen={isSpkModalOpen}
        onClose={() => setIsSpkModalOpen(false)}
        credential={selectedCredential}
        darkMode={darkMode}
      />

      <SdmPresensiModal
        isOpen={isPresensiModalOpen}
        onClose={() => setIsPresensiModalOpen(false)}
        employees={employees}
        onSubmitAttendance={handleAddAttendance}
        darkMode={darkMode}
      />

      <SdmDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        dossier={selectedDossier}
        onSaveDossier={handleSaveDossier}
        darkMode={darkMode}
      />
    </div>
  );
}
