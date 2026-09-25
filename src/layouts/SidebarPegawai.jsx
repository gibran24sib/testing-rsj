import React from "react";

export default function SidebarPegawai({
  activeTab = "profil",
  setActiveTab,
  currentUser,
  darkMode,
  toggleTheme,
  handleLogout,
  setCurrentView,
  onBackToPortal,
  onOpenCommandPalette,
  dossierCount = 0,
}) {
  const menuItems = [
    {
      id: "profil",
      label: "Data Diri & Profil",
      icon: "👤",
      badge: "Biodata",
    },
    {
      id: "berkas",
      label: "E-Berkas & Dokumen",
      icon: "📁",
      badge: dossierCount ? `${dossierCount} File` : "Upload DMS",
    },
    {
      id: "cuti",
      label: "Pengajuan Cuti",
      icon: "🏖️",
      badge: "Mandiri",
    },
    {
      id: "roster",
      label: "Jadwal Shift Jaga",
      icon: "📅",
      badge: "Bangsal",
    },
    {
      id: "presensi",
      label: "E-Presensi Shift",
      icon: "⏱️",
      badge: "Live GPS",
    },
    {
      id: "legalitas",
      label: "Legalitas STR & SIP",
      icon: "📜",
      badge: "Masa Izin",
    },
    {
      id: "diklat",
      label: "Pelatihan & Sertifikat",
      icon: "🎓",
      badge: "KARS",
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
          title="Kembali ke Portal Publik RSJ Tampan"
        >
          <div
            className="rounded-3 fs-5 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              width: "38px",
              height: "38px",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
            }}
          >
            🩺
          </div>
          <div>
            <h6 className="mb-0 fw-bold" style={{ letterSpacing: "-0.02em", fontSize: "0.95rem" }}>
              RSJ TAMPAN
            </h6>
            <small
              className="d-block text-success fw-semibold"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.02em",
              }}
            >
              PORTAL PEGAWAI (ESS)
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
            <span>Cari modul mandiri...</span>
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

        {/* SECTION HEADER: MENU MANDIRI */}
        <div className="mb-2 px-2">
          <small
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.8px",
              color: darkMode ? "#505769" : "#94a3b8",
            }}
          >
            Layanan Mandiri Pegawai
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
                      ? "rgba(16, 185, 129, 0.16)"
                      : "#ecfdf5"
                    : "transparent",
                  color: isActive
                    ? "#10b981"
                    : darkMode
                    ? "#94a3b8"
                    : "#475569",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.83rem",
                  borderLeft: isActive ? "3px solid #10b981" : "3px solid transparent",
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
                      ? "rgba(16, 185, 129, 0.25)"
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
        {/* ROLE STATUS INDICATOR BADGE */}
        <div
          className="px-3 py-2 rounded-3 mb-2 d-flex align-items-center justify-content-between border"
          style={{
            backgroundColor: darkMode ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
            borderColor: darkMode ? "#059669" : "#a7f3d0",
            fontSize: "0.74rem",
            fontWeight: 600,
            color: "#10b981",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            <span>🩺</span>
            <span>Portal Pegawai & Nakes</span>
          </div>
          <span className="badge rounded-pill bg-success" style={{ fontSize: "0.62rem" }}>
            Mandiri
          </span>
        </div>

        {/* USER PROFILE INFO */}
        <div
          className="p-3 rounded-3 mb-2 d-flex align-items-center justify-content-between"
          style={{
            backgroundColor: darkMode ? "rgba(17, 22, 36, 0.8)" : "rgba(248, 250, 252, 0.9)",
            border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
          }}
        >
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            {currentUser?.foto ? (
              <img
                src={currentUser.foto}
                alt={currentUser?.nama || "Pegawai"}
                className="rounded-circle shadow-sm border border-success"
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#10b981",
                  fontSize: "0.85rem",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                }}
              >
                {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : "P"}
              </div>
            )}
            <div className="overflow-hidden">
              <div
                className="fw-semibold text-truncate"
                style={{ fontSize: "0.82rem" }}
                title={currentUser?.nama}
              >
                {currentUser?.nama || "Pegawai RSJ Tampan"}
              </div>
              <small
                className="d-block text-truncate"
                style={{
                  fontSize: "0.68rem",
                  color: darkMode ? "#7e8699" : "#64748b",
                }}
                title={currentUser?.role || currentUser?.profesi}
              >
                {currentUser?.role || currentUser?.profesi || "Tenaga Medis"}
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

        {/* TOMBOL LOGOUT */}
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
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
