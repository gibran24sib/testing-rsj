import React from "react";

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
      label: "E-Berkas Digital",
      icon: "📁",
      badge: "DMS",
    },
    {
      id: "legalitas",
      label: "Legalitas STR & SIP",
      icon: "📜",
      badge: "Audit Izin",
    },
    {
      id: "cuti",
      label: "Manajemen Cuti",
      icon: "🏖️",
      badge: "Izin & Approval",
    },
    {
      id: "diklat",
      label: "Diklat & Kredensialing",
      icon: "🎓",
      badge: "Keahlian Jiwa",
    },
    {
      id: "analitik",
      label: "Analitik Kinerja SDM",
      icon: "📊",
      badge: "SKP Kinerja",
    },
  ];

  return (
    <aside
      className="d-flex flex-column justify-content-between p-3 position-sticky top-0"
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        backgroundColor: darkMode ? "#0a0d14" : "#ffffff",
        borderRight: darkMode ? "1px solid #1a2030" : "1px solid #e2e8f0",
        color: darkMode ? "#ffffff" : "#0f172a",
        zIndex: 1020,
        overflowY: "auto",
      }}
    >
      <div>
        {/* BRAND HEADER */}
        <div
          className="d-flex align-items-center gap-3 p-2 rounded-3 mb-3 transition-all"
          style={{
            cursor: "pointer",
            backgroundColor: darkMode ? "#111624" : "#f8fafc",
            border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
          }}
          onClick={onBackToPortal ? onBackToPortal : () => setCurrentView("guest")}
          title="Kembali ke Portal SDM Publik"
        >
          <div
            className="rounded-3 fs-5 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
              width: "38px",
              height: "38px",
            }}
          >
            🏥
          </div>
          <div>
            <h6 className="mb-0 fw-bold" style={{ letterSpacing: "-0.02em", fontSize: "0.95rem" }}>
              RSJ TAMPAN
            </h6>
            <small
              className="d-block"
              style={{
                fontSize: "0.68rem",
                color: darkMode ? "#7e8699" : "#64748b",
              }}
            >
              SIM-SDM & KEPEGAWAIAN
            </small>
          </div>
        </div>

        {/* QUICK COMMAND PALETTE BUTTON */}
        <button
          className="btn w-100 p-2 d-flex align-items-center justify-content-between mb-3 text-start rounded-3"
          style={{
            backgroundColor: darkMode ? "#131828" : "#f1f5f9",
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
            Modul Kepegawaian & Nakes
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
                className="btn text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition-all"
                style={{
                  backgroundColor: isActive
                    ? darkMode
                      ? "rgba(16, 185, 129, 0.14)"
                      : "#ecfdf5"
                    : "transparent",
                  color: isActive
                    ? "#10b981"
                    : darkMode
                    ? "#94a3b8"
                    : "#475569",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.83rem",
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
                      ? "rgba(16, 185, 129, 0.2)"
                      : darkMode
                      ? "#1b2133"
                      : "#f1f5f9",
                    color: isActive
                      ? "#10b981"
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
        <div
          className="p-3 rounded-3 mb-2 d-flex align-items-center justify-content-between"
          style={{
            backgroundColor: darkMode ? "#111624" : "#f8fafc",
            border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
          }}
        >
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#10b981",
                fontSize: "0.85rem",
                flexShrink: 0,
              }}
            >
              {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <div
                className="fw-semibold text-truncate"
                style={{ fontSize: "0.82rem" }}
              >
                {currentUser?.nama || "Kasubbag SDM"}
              </div>
              <small
                className="d-block text-truncate"
                style={{
                  fontSize: "0.68rem",
                  color: darkMode ? "#7e8699" : "#64748b",
                }}
              >
                {currentUser?.role || "Administrator SDM"}
              </small>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-sm p-1 rounded-2"
            title="Ganti Tema (Dark/Light)"
            style={{
              color: darkMode ? "#f59e0b" : "#64748b",
              backgroundColor: darkMode ? "#182035" : "#e2e8f0",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0"
          style={{
            backgroundColor: darkMode ? "#221319" : "#fee2e2",
            color: "#ef4444",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          <span>🚪</span>
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
