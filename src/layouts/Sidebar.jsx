import React from "react";
import { isAdminOrHrd } from "../utils/authHelpers";

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  darkMode,
  toggleTheme,
  handleLogout,
  setCurrentView,
  onBackToPortal,
  onOpenCommandPalette,
  employeeCount = 0,
}) {
  const isAdmin = isAdminOrHrd(currentUser);

  const menuItems = [
    {
      id: "direktori",
      label: "Direktori Pegawai",
      icon: "👥",
      badge: `${employeeCount || 12} Nakes`,
    },
    {
      id: "roster",
      label: "Roster Shift 24/7",
      icon: "📅",
      badge: "Duty Shift",
    },
    {
      id: "abk_wisn",
      label: "Beban Kerja (WISN)",
      icon: "🧮",
      badge: "Kemenkes",
    },
    {
      id: "kredensialing",
      label: "Jenjang Karir & SPK",
      icon: "🎖️",
      badge: "KARS",
    },
    {
      id: "presensi",
      label: "E-Presensi Shift",
      icon: "⏱️",
      badge: "Live GPS",
    },
    {
      id: "dossier",
      label: "Master E-Berkas Digital",
      icon: "📁",
      badge: "DMS",
    },
    {
      id: "legalitas",
      label: "Audit Legalitas STR/SIP",
      icon: "📜",
      badge: "Audit Izin",
    },
    {
      id: "cuti",
      label: "Approval & Kelola Cuti",
      icon: "🏖️",
      badge: "Approval HRD",
    },
    {
      id: "diklat",
      label: "Diklat Jiwa & KARS",
      icon: "🎓",
      badge: "KARS",
    },
    {
      id: "analitik",
      label: "Analitik Kinerja SDM",
      icon: "📊",
      badge: "KPI",
    },
  ];

  return (
    <aside
      className={`d-flex flex-column justify-content-between p-3 position-sticky top-0 ${
        darkMode ? "glass-panel-dark" : "glass-panel"
      }`}
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        backgroundColor: darkMode ? "rgba(8, 10, 16, 0.95)" : "rgba(255, 255, 255, 0.95)",
        borderRight: darkMode ? "1px solid rgba(26, 32, 48, 0.9)" : "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: 0,
        zIndex: 1020,
        overflowY: "auto",
      }}
    >
      <div>
        {/* BRAND HEADER */}
        <div
          className="d-flex align-items-center gap-3 p-2 rounded-3 mb-3 hover-lift"
          style={{
            cursor: "pointer",
            backgroundColor: darkMode ? "rgba(17, 22, 36, 0.7)" : "rgba(248, 250, 252, 0.9)",
            border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
          }}
          onClick={onBackToPortal ? onBackToPortal : () => setCurrentView("guest")}
          title="Kembali ke Portal Publik"
        >
          <div
            className="rounded-3 d-flex align-items-center justify-content-center overflow-hidden p-1"
            style={{
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(16, 185, 129, 0.1)",
              width: "38px",
              height: "38px",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
              border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <img
              src="/logo-rsj.png"
              alt="Logo RSJ Tampan"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://rsjiwatampan.riau.go.id/landing/images/Logo.png";
              }}
            />
          </div>
          <div>
            <h6 className="mb-0 fw-bold" style={{ letterSpacing: "-0.02em", fontSize: "0.95rem" }}>
              RSJ TAMPAN
            </h6>
            <small
              className="d-block text-warning fw-semibold"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.02em",
              }}
            >
              PANEL ADMIN KEPEGAWAIAN
            </small>
          </div>
        </div>

        {/* QUICK COMMAND PALETTE BUTTON */}
        <button
          className="btn w-100 p-2 d-flex align-items-center justify-content-between mb-3 text-start rounded-3 hover-lift"
          style={{
            backgroundColor: darkMode ? "rgba(19, 24, 40, 0.75)" : "rgba(241, 245, 249, 0.85)",
            border: darkMode ? "1px solid #20273c" : "1px solid #e2e8f0",
            color: darkMode ? "#94a3b8" : "#64748b",
            fontSize: "0.78rem",
          }}
          onClick={onOpenCommandPalette}
        >
          <div className="d-flex align-items-center gap-2">
            <span>🔍</span>
            <span>Cari modul SDM...</span>
          </div>
          <kbd
            className="px-1 py-0 rounded"
            style={{
              fontSize: "0.65rem",
              backgroundColor: darkMode ? "#1c2236" : "#e2e8f0",
              color: "inherit",
            }}
          >
            Ctrl+K
          </kbd>
        </button>

        {/* SECTION HEADER: MODUL SDM */}
        <div className="mb-2 px-2">
          <small
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.8px",
              color: darkMode ? "#505769" : "#94a3b8",
            }}
          >
            Modul Manajemen SDM
          </small>
        </div>

        {/* LIST MENU ITEMS */}
        <nav className="d-flex flex-column gap-1 mb-4">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition-all ${
                  isActive ? "active-glow" : "hover-lift"
                }`}
                style={{
                  backgroundColor: isActive
                    ? darkMode
                      ? "rgba(245, 158, 11, 0.16)"
                      : "#fffbeb"
                    : "transparent",
                  color: isActive
                    ? "#f59e0b"
                    : darkMode
                    ? "#94a3b8"
                    : "#475569",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.83rem",
                  borderLeft: isActive ? "3px solid #f59e0b" : "3px solid transparent",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "0.95rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    backgroundColor: isActive
                      ? "rgba(245, 158, 11, 0.25)"
                      : darkMode
                      ? "#1b2133"
                      : "#f1f5f9",
                    color: isActive
                      ? "#f59e0b"
                      : darkMode
                      ? "#8e94a4"
                      : "#64748b",
                  }}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER USER CARD */}
      <div>
        {/* ROLE STATUS INDICATOR BADGE */}
        <div
          className="px-3 py-2 rounded-3 mb-2 d-flex align-items-center justify-content-between border"
          style={{
            backgroundColor: darkMode ? "rgba(245, 158, 11, 0.12)" : "#fffbeb",
            borderColor: darkMode ? "#b45309" : "#fde68a",
            fontSize: "0.74rem",
            fontWeight: 600,
            color: "#f59e0b",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            <span>🛡️</span>
            <span>Mode Administrator SDM</span>
          </div>
          <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: "0.62rem" }}>
            HRD
          </span>
        </div>

        <div
          className="p-3 rounded-3 mb-2 d-flex align-items-center justify-content-between"
          style={{
            backgroundColor: darkMode ? "rgba(17, 22, 36, 0.8)" : "rgba(248, 250, 252, 0.9)",
            border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
          }}
        >
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#f59e0b",
                fontSize: "0.85rem",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
              }}
            >
              {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <div
                className="fw-semibold text-truncate"
                style={{ fontSize: "0.82rem" }}
                title={currentUser?.nama}
              >
                {currentUser?.nama || "Agus Pratondo, S.Sos"}
              </div>
              <small
                className="d-block text-truncate"
                style={{
                  fontSize: "0.68rem",
                  color: darkMode ? "#7e8699" : "#64748b",
                }}
                title={currentUser?.role}
              >
                {currentUser?.role || "Kasubbag Kepegawaian & SDM"}
              </small>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-sm p-1 rounded-2 hover-lift"
            title="Ganti Tema (Dark/Light)"
            style={{
              color: darkMode ? "#f59e0b" : "#64748b",
              backgroundColor: darkMode ? "#182035" : "#e2e8f0",
              width: "30px",
              height: "30px",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0 shadow-sm hover-lift"
          style={{
            backgroundColor: darkMode ? "#221319" : "#fee2e2",
            color: "#ef4444",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          <span>🚪</span>
          <span>Keluar Sesi Admin</span>
        </button>
      </div>
    </aside>
  );
}
