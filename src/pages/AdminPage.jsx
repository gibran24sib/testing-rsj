import React from "react";
import SdmTab from "./SdmTab";

export default function AdminPage({
  activeTab,
  setActiveTab,
  employees,
  shiftRoster,
  leaveRequests,
  trainings,
  dossiersList,
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
  onBackToPortal,
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
      case "roster":
        return {
          title: "Roster Shift Jaga Bangsal Jiwa 24 Jam",
          subtitle: "Penjadwalan dinas 24/7 di bangsal Kampar, Siak, Rokan NAPZA, dan IGD Jiwa",
          badge: "4 Bangsal 24/7",
          badgeClass: "badge-soft-primary",
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
      case "presensi":
        return {
          title: "E-Presensi & Log Kehadiran Shift",
          subtitle: "Monitoring presensi digital berbasis geolocation GPS shift pagi, sore, dan malam",
          badge: "Live GPS",
          badgeClass: "badge-soft-warning",
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

  return (
    <div className="py-2 animate-fade-in">
      {/* INTEGRATED MODERN GLASS PAGE HEADER */}
      <div
        className={`d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-3 rounded-4 ${
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
                className={`badge rounded-pill px-2 py-1 ${tabInfo.badgeClass || "badge-soft-success"}`}
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
        <div className="d-flex align-items-center gap-2">
          {onBackToPortal && (
            <button
              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 px-3 py-1 rounded-3 hover-lift"
              onClick={onBackToPortal}
              title="Kembali ke Portal Publik RSJ Tampan"
            >
              <span>🏥</span>
              <span className="d-none d-sm-inline">Portal Publik</span>
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 py-1 rounded-3 hover-lift"
            onClick={onOpenCommandPalette}
            title="Cari fitur SDM (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="d-none d-sm-inline">Pencarian SDM (Ctrl+K)</span>
          </button>
        </div>
      </div>

      {/* RENDER SDM TAB */}
      <SdmTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        employees={employees}
        shiftRoster={shiftRoster}
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
      />
    </div>
  );
}
