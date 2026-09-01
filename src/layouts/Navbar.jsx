import React from "react";
import NotificationDropdown from "../components/NotificationDropdown";

export default function Navbar({
  currentView,
  setCurrentView,
  darkMode,
  toggleTheme,
  onOpenCommandPalette,
}) {
  return (
    <nav
      className={`navbar navbar-expand-lg px-3 px-md-4 py-2 sticky-top ${
        darkMode ? "bg-black navbar-dark border-bottom border-dark" : "bg-white navbar-light border-bottom"
      }`}
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: darkMode ? "rgba(8, 10, 16, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: darkMode ? "#181e2e" : "#e2e8f0",
        zIndex: 1030,
      }}
    >
      <div className="container-fluid px-0">
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentView("guest")}
        >
          <div
            className="rounded-3 fs-5 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
              width: "36px",
              height: "36px",
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
                color: darkMode ? "#cbd5e1" : "#64748b",
              }}
            >
              SIM-SDM & KEPEGAWAIAN
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* QUICK SEARCH (CTRL+K) BUTTON IN NAVBAR */}
          <button
            className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              backgroundColor: darkMode ? "#181f33" : "#f1f5f9",
              border: darkMode ? "1px solid #283452" : "1px solid #e2e8f0",
              color: darkMode ? "#e2e8f0" : "#334155",
              fontSize: "0.8rem",
            }}
            onClick={onOpenCommandPalette}
            title="Cari Cepat SDM (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="d-none d-sm-inline">Pencarian SDM</span>
            <kbd
              className="px-1 py-0 rounded d-none d-md-inline"
              style={{
                fontSize: "0.65rem",
                backgroundColor: darkMode ? "#1c2236" : "#e2e8f0",
                color: "inherit",
              }}
            >
              Ctrl+K
            </kbd>
          </button>

          {/* NOTIFICATION CENTER BELL */}
          <NotificationDropdown darkMode={darkMode} />

          {/* THEME TOGGLE */}
          <button
            className={`btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center ${
              darkMode ? "btn-outline-warning" : "btn-outline-secondary"
            }`}
            onClick={toggleTheme}
            title="Ganti Tema"
            style={{ width: "34px", height: "34px" }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* NAVIGATION ACTION PILLS */}
          <div className="d-flex gap-1">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-medium ${
                currentView === "guest"
                  ? "btn-success shadow-sm"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCurrentView("guest")}
            >
              Portal Publik
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 fw-medium ${
                currentView === "login" || currentView === "register"
                  ? "btn-success shadow-sm"
                  : "btn-outline-success"
              }`}
              onClick={() => setCurrentView("login")}
            >
              Masuk SIM-SDM
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
