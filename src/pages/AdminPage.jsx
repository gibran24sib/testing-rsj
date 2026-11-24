import React, { useMemo } from "react";
import SdmTab from "./SdmTab";

export default function AdminPage({
  activeTab,
  setActiveTab,
  employees = [],
  leaveRequests = [],
  trainings = [],
  dossiersList = [],
  onSaveDossier,
  currentUser,
  setCurrentView,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onSubmitLeave,
  onApproveLeave,
  onRejectLeave,
  onRenewStrSip,
  showToast,
  darkMode,
  cardBg,
  tableTheme,
  onOpenCommandPalette,
}) {
  const getTabTitleInfo = () => {
    switch (activeTab) {
      case "direktori":
        return {
          title: "Direktori Pegawai & Nakes Medis",
          subtitle: "Master data seluruh tenaga dokter spesialis Sp.KJ, psikolog klinis, ners jiwa, dan staf RSJ Tampan",
          badge: `${employees?.length || 0} Pegawai Aktif`,
          badgeClass: "badge-soft-success",
        };
      case "abk_wisn":
        return {
          title: "Analisis Beban Kerja (WISN Kemenkes)",
          subtitle: "Perhitungan kebutuhan formasi ners dan dokter jiwa berbasis standar Permenkes No. 33",
          badge: "Standar Kemenkes",
          badgeClass: "badge-soft-danger",
        };
      case "kredensialing":
        return {
          title: "Jenjang Karir & SPK/RKK Kredensialing",
          subtitle: "Surat Penugasan Klinis dan Rincian Kewenangan Klinis perawat jiwa standar KARS",
          badge: "KARS Akreditasi",
          badgeClass: "badge-soft-purple",
        };
      case "dossier":
        return {
          title: "E-Berkas Digital Dossier Kepegawaian",
          subtitle: "Arsip digital STR, SIP, SK CPNS/PNS, sertifikat BTCLS, dan dokumen pegawai",
          badge: "Digital DMS",
          badgeClass: "badge-soft-info",
        };
      case "legalitas":
        return {
          title: "Audit Legalitas STR & SIP Izin Praktik",
          subtitle: "Monitoring masa berlaku Surat Tanda Registrasi dan Surat Izin Praktik tenaga kesehatan",
          badge: "Kepatuhan Kemenkes",
          badgeClass: "badge-soft-danger",
        };
      case "cuti":
        return {
          title: "Manajemen Pengajuan & Approval Cuti",
          subtitle: "Pengelolaan cuti tahunan, sakit, tugas belajar, dan pelimpahan tugas perawat jiwa",
          badge: `${leaveRequests?.filter((l) => l.status === "Menunggu Persetujuan").length || 0} Menunggu Approval`,
          badgeClass: "badge-soft-warning",
        };
      case "diklat":
        return {
          title: "Diklat & Kredensialing Khusus Jiwa",
          subtitle: "Sertifikasi de-eskalasi agresi, restrain fisik aman, BTCLS, dan asuhan keperawatan jiwa akut",
          badge: "Standar Akreditasi KARS",
          badgeClass: "badge-soft-success",
        };
      case "analitik":
        return {
          title: "Analitik Ketenagaan & Kinerja SDM",
          subtitle: "Executive dashboard rasio nakes-pasien, disiplin presensi shift, dan evaluasi SKP",
          badge: "Live KPI",
          badgeClass: "badge-soft-info",
        };
      default:
        return {
          title: "Sistem Informasi SDM & Kepegawaian Nakes",
          subtitle: "Portal Manajemen Sumber Daya Manusia Terpadu RSJ Tampan Provinsi Riau",
          badge: `${employees?.length || 0} Pegawai`,
          badgeClass: "badge-soft-success",
        };
    }
  };

  const tabInfo = getTabTitleInfo();

  // Metrics untuk Executive Bar
  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter((l) => l.status === "Menunggu Persetujuan");
  }, [leaveRequests]);

  const expiringLicenses = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.str?.status === "Expired" ||
        emp.str?.status === "Mendekati Expired" ||
        emp.sip?.status === "Expired" ||
        emp.sip?.status === "Mendekati Expired"
    );
  }, [employees]);

  const medisCount = useMemo(() => employees.filter((e) => e.kategori === "Medis").length, [employees]);
  const nersCount = useMemo(() => employees.filter((e) => e.kategori === "Keperawatan").length, [employees]);

  return (
    <div className="py-2 animate-fade-in">
      {/* INTEGRATED MODERN GLASS PAGE HEADER */}
      <div
        className={`d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 p-3 rounded-4 ${
          darkMode ? "glass-panel-dark" : "glass-panel"
        }`}
        style={{
          border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
              {tabInfo.title}
            </h4>
            {tabInfo.badge && (
              <span
                className={`badge rounded-pill px-2.5 py-1 ${tabInfo.badgeClass || "badge-soft-success"}`}
                style={{ fontSize: "0.68rem" }}
              >
                {tabInfo.badge}
              </span>
            )}
          </div>
          <p
            className="mb-0 small"
            style={{ color: darkMode ? "#94a3b8" : "#64748b" }}
          >
            {tabInfo.subtitle}
          </p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 hover-lift shadow-sm"
            onClick={onOpenCommandPalette}
            title="Cari fitur SDM (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="d-none d-sm-inline">Pencarian SDM (Ctrl+K)</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE LIVE METRIC STRIP (TIDAK POLOS) */}
      <div
        className="p-3 rounded-4 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
        style={{
          backgroundColor: darkMode ? "#0c111e" : "#f1f5f9",
          border: darkMode ? "1px solid #1a2236" : "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.7)",
              }}
            />
            <span className="small fw-semibold" style={{ fontSize: "0.78rem" }}>
              Database SDM: Online (Supabase Sync)
            </span>
          </div>

          <span className="text-muted d-none d-md-inline">&bull;</span>

          <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
            Total SDM: <strong className="text-dark-subtle">{employees.length} Pegawai</strong> ({medisCount} Dokter / {nersCount} Ners Jiwa)
          </span>

          <span className="text-muted d-none d-md-inline">&bull;</span>

          <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
            Akreditasi: <strong className="text-success">KARS Paripurna ⭐⭐⭐⭐⭐</strong>
          </span>
        </div>

        {/* ACTION SHORTCUTS */}
        <div className="d-flex align-items-center gap-2">
          {pendingLeaves.length > 0 && (
            <button
              type="button"
              className="btn btn-xs btn-warning text-dark fw-bold px-2.5 py-1 rounded-pill d-flex align-items-center gap-1 hover-lift"
              style={{ fontSize: "0.72rem" }}
              onClick={() => setActiveTab("cuti")}
            >
              <span>🏖️</span>
              <span>{pendingLeaves.length} Cuti Menunggu</span>
            </button>
          )}

          {expiringLicenses.length > 0 && (
            <button
              type="button"
              className="btn btn-xs btn-danger text-white fw-bold px-2.5 py-1 rounded-pill d-flex align-items-center gap-1 hover-lift"
              style={{ fontSize: "0.72rem" }}
              onClick={() => setActiveTab("legalitas")}
            >
              <span>⚠️</span>
              <span>{expiringLicenses.length} STR/SIP Expiring</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER SDM TAB */}
      <SdmTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        employees={employees}
        leaveRequests={leaveRequests}
        trainings={trainings}
        dossiersList={dossiersList}
        onSaveDossier={onSaveDossier}
        currentUser={currentUser}
        setCurrentView={setCurrentView}
        onAddEmployee={onAddEmployee}
        onUpdateEmployee={onUpdateEmployee}
        onDeleteEmployee={onDeleteEmployee}
        onSubmitLeave={onSubmitLeave}
        onApproveLeave={onApproveLeave}
        onRejectLeave={onRejectLeave}
        onRenewStrSip={onRenewStrSip}
        darkMode={darkMode}
        showToast={showToast}
        cardBg={cardBg}
        tableTheme={tableTheme}
      />
    </div>
  );
}
