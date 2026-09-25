import React from "react";
import NotificationDropdown from "../components/NotificationDropdown";
import { isAdminOrHrd } from "../utils/authHelpers";

export default function Navbar({
  currentView,
  setCurrentView,
  currentUser,
  darkMode,
  toggleTheme,
  onOpenCommandPalette,
  onOpenLogoutModal,
}) {
  const isAdmin = isAdminOrHrd(currentUser);

  return (
    <nav
      className={`navbar navbar-expand-lg px-3 px-md-4 py-2 sticky-top ${
        darkMode ? "navbar-dark" : "navbar-light"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: darkMode ? "rgba(8, 10, 16, 0.85)" : "rgba(255, 255, 255, 0.88)",
        borderBottom: darkMode ? "1px solid rgba(30, 37, 56, 0.8)" : "1px solid rgba(226, 232, 240, 0.85)",
        boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.03)",
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
            className="rounded-3 d-flex align-items-center justify-content-center hover-lift overflow-hidden p-1"
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
              className="d-block"
              style={{
                fontSize: "0.68rem",
                color: darkMode ? "#cbd5e1" : "#64748b",
                letterSpacing: "0.03em",
              }}
            >
              SIM-SDM & KEPEGAWAIAN
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* QUICK SEARCH (CTRL+K) BUTTON IN NAVBAR */}
          <button
            className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 rounded-pill hover-lift"
            style={{
              backgroundColor: darkMode ? "rgba(24, 31, 51, 0.8)" : "rgba(241, 245, 249, 0.9)",
              border: darkMode ? "1px solid rgba(40, 52, 82, 0.8)" : "1px solid rgba(226, 232, 240, 0.9)",
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
            className={`btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center hover-lift ${
              darkMode ? "btn-outline-warning" : "btn-outline-secondary"
            }`}
            onClick={toggleTheme}
            title="Ganti Tema"
            style={{ width: "36px", height: "36px" }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* NAVIGATION ACTION PILLS */}
          <div className="d-flex gap-1 flex-wrap">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-medium hover-lift ${
                currentView === "guest"
                  ? "btn-success active-glow"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCurrentView("guest")}
            >
              Portal Publik
            </button>

            {currentUser ? (
              <>
                {isAdmin ? (
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-medium hover-lift ${
                      currentView === "admin"
                        ? "btn-warning text-dark active-glow"
                        : "btn-outline-warning text-dark"
                    }`}
                    onClick={() => setCurrentView("admin")}
                    title="Buka Panel Administrator Kepegawaian"
                  >
                    🛡️ Panel Admin
                  </button>
                ) : (
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-medium hover-lift ${
                      currentView === "pegawai"
                        ? "btn-success active-glow"
                        : "btn-outline-success"
                    }`}
                    onClick={() => setCurrentView("pegawai")}
                    title="Buka Portal Mandiri Pegawai (ESS)"
                  >
                    🩺 Portal Pegawai
                  </button>
                )}

                {onOpenLogoutModal && (
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-2 hover-lift"
                    onClick={onOpenLogoutModal}
                    title="Keluar Akun"
                  >
                    🚪
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  className={`btn btn-sm rounded-pill px-3 fw-medium hover-lift ${
                    currentView === "login"
                      ? "btn-success active-glow"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setCurrentView("login")}
                >
                  Masuk SIM-SDM
                </button>
                <button
                  className={`btn btn-sm rounded-pill px-3 fw-medium hover-lift ${
                    currentView === "register"
                      ? "btn-success active-glow"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentView("register")}
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
