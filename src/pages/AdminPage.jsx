import React from "react";
import SdmTab from "./SdmTab";

export default function AdminPage({
  activeTab,
  setActiveTab,
  employees,
  shiftRoster,
  leaveRequests,
  trainings,
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
        };
      case "roster":
        return {
          title: "Roster Shift Jaga Bangsal Jiwa 24 Jam",
          subtitle: "Penjadwalan dinas 24/7 di bangsal Kampar, Siak, Rokan NAPZA, dan IGD Jiwa",
          badge: "4 Bangsal 24/7",
        };
      case "legalitas":
        return {
          title: "Audit Legalitas STR & SIP Izin Praktik",
          subtitle: "Monitoring masa berlaku Surat Tanda Registrasi dan Surat Izin Praktik tenaga kesehatan",
          badge: "Kepatuhan Kemenkes",
        };
      case "cuti":
        return {
          title: "Manajemen Pengajuan & Approval Cuti",
          subtitle: "Pengelolaan cuti tahunan, sakit, tugas belajar, dan pelimpahan tugas perawat jiwa",
          badge: `${leaveRequests?.filter((l) => l.status === "Menunggu Persetujuan").length || 0} Menunggu Approval`,
        };
      case "diklat":
        return {
          title: "Diklat & Kredensialing Khusus Jiwa",
          subtitle: "Sertifikasi de-eskalasi agresi, restrain fisik aman, BTCLS, dan asuhan keperawatan jiwa akut",
          badge: "Standar Akreditasi KARS",
        };
      case "analitik":
        return {
          title: "Analitik Ketenagaan & Kinerja SDM",
          subtitle: "Executive dashboard rasio nakes-pasien, disiplin presensi shift, dan evaluasi SKP",
          badge: "Live KPI",
        };
      default:
        return {
          title: "Sistem Informasi SDM & Kepegawaian Nakes",
          subtitle: "Portal Manajemen Sumber Daya Manusia Terpadu RSJ Tampan Provinsi Riau",
          badge: `${employees?.length || 0} Pegawai`,
        };
    }
  };

  const tabInfo = getTabTitleInfo();

  return (
    <div className="py-2 animate-fade-in">
      {/* INTEGRATED CLEAN PAGE HEADER */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom"
        style={{ borderColor: darkMode ? "#181d2e" : "#e2e8f0" }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
              {tabInfo.title}
            </h4>
            {tabInfo.badge && (
              <span
                className="badge rounded-pill px-2 py-1"
                style={{
                  fontSize: "0.68rem",
                  backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                  color: "#10b981",
                  fontWeight: 600,
                }}
              >
                {tabInfo.badge}
              </span>
            )}
          </div>
          <p
            className="mb-0 small"
            style={{ color: darkMode ? "#7e8699" : "#64748b" }}
          >
            {tabInfo.subtitle}
          </p>
        </div>

        {/* QUICK SEARCH BUTTON */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 py-1 rounded-3"
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
