import React from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  darkMode,
  toggleTheme,
  handleLogout,
  setCurrentView,
  inventoryCount = 0,
  onOpenCommandPalette,
}) {
  const menuItems = [
    {
      id: "analitik",
      label: "Analitik SIM-RS",
      icon: "📈",
      badge: "Live",
    },
    {
      id: "inventaris",
      label: "Inventaris Barang",
      icon: "📦",
      badge: `${inventoryCount}`,
    },
    {
      id: "bangsal",
      label: "Bangsal Rawat Jiwa",
      icon: "🏥",
      badge: "6 Unit",
    },
    {
      id: "coldchain",
      label: "Cold Chain Suhu",
      icon: "❄️",
      badge: "3 Sensor",
    },
    {
      id: "supplier",
      label: "Rekanan Vendor PBF",
      icon: "🏢",
      badge: "5 Vendor",
    },
    {
      id: "laporan",
      label: "Laporan Mutasi",
      icon: "📊",
      badge: "Rekap",
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
          onClick={() => setCurrentView("guest")}
          title="Kembali ke Beranda Publik"
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
              SIM-RS LOGISTIK MEDIS
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
            <span>Cari cepat fitur...</span>
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

        {/* SECTION HEADER: MENU UTAMA */}
        <div className="mb-2 px-2">
          <small
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.8px",
              color: darkMode ? "#505769" : "#94a3b8",
            }}
          >
            Menu Navigasi
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
                  fontSize: "0.85rem",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span
                  className="badge rounded-pill"
                  style={{
                    fontSize: "0.65rem",
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

        {/* SHORTCUT BERANDA PUBLIK */}
        <div className="px-2 mb-1">
          <small
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.8px",
              color: darkMode ? "#505769" : "#94a3b8",
            }}
          >
            Tampilan Publik
          </small>
        </div>

        <button
          className="btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 w-100 mb-3 transition-all"
          style={{
            backgroundColor: "transparent",
            color: darkMode ? "#7e8699" : "#64748b",
            fontSize: "0.84rem",
          }}
          onClick={() => setCurrentView("guest")}
        >
          <span>🌐</span>
          <span>Buka Beranda Publik</span>
        </button>
      </div>

      {/* FOOTER SIDEBAR (PROFIL USER, THEME & LOGOUT) */}
      <div
        className="p-3 rounded-3 mt-auto"
        style={{
          backgroundColor: darkMode ? "#111624" : "#f8fafc",
          border: darkMode ? "1px solid #1d253b" : "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "32px",
                height: "32px",
                minWidth: "32px",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontSize: "0.8rem",
              }}
            >
              {currentUser?.nama?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <span
                className="fw-semibold d-block text-truncate"
                style={{ fontSize: "0.82rem" }}
              >
                {currentUser?.nama || "Petugas SIM-RS"}
              </span>
              <small
                className="d-block text-truncate"
                style={{
                  fontSize: "0.68rem",
                  color: darkMode ? "#7e8699" : "#64748b",
                }}
              >
                {currentUser?.role || "Petugas Logistik"}
              </small>
            </div>
          </div>

          <button
            className="btn btn-sm rounded-circle p-1 border-0"
            onClick={toggleTheme}
            title="Ganti Tema Dark/Light"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: darkMode ? "#1e263d" : "#e2e8f0",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          className="btn btn-sm btn-outline-danger w-100 fw-medium d-flex align-items-center justify-content-center gap-2 py-1"
          style={{ fontSize: "0.8rem" }}
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout Petugas</span>
        </button>
      </div>
    </aside>
  );
}
