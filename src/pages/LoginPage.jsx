import React, { useState } from "react";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

export default function LoginPage({
  authInput,
  setAuthInput,
  authError,
  authSuccess,
  handleLogin,
  setCurrentView,
  darkMode,
  cardBg: _cardBg,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleLogin(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill handler for testing demo accounts
  const handleQuickFill = (username, password) => {
    setAuthInput((prev) => ({
      ...prev,
      username: username,
      email: `${username}@rsjtampan.riau.go.id`,
      password: password,
    }));
  };

  const inputClass = `form-control ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;
  const labelColor = darkMode ? "#cbd5e1" : "#475569";

  return (
    <div className="container py-5 animate-fade-in position-relative">
      {/* Background Subtle Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.04) 50%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.06) 50%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>

      <div className="row justify-content-center position-relative" style={{ zIndex: 1 }}>
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div
            className={`p-4 p-md-5 rounded-4 ${
              darkMode ? "glass-panel-dark" : "glass-panel"
            }`}
            style={{
              boxShadow: darkMode
                ? "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.1)"
                : "0 20px 40px rgba(0, 0, 0, 0.07), 0 0 25px rgba(16, 185, 129, 0.12)",
            }}
          >
            <div className="text-center mb-4">
              <div
                className="d-inline-flex p-3 rounded-4 fs-2 mb-3 icon-gradient-box animate-float"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
                }}
              >
                🏥
              </div>
              <h4 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>
                Masuk SIM-SDM
              </h4>
              <small className="opacity-75 d-block">
                Sistem Informasi Terpadu SDM & Kepegawaian RSJ Tampan
              </small>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 px-3 small mb-3 rounded-3 d-flex align-items-center gap-2 border-danger-subtle">
                <span>⚠️</span>
                <div>{authError}</div>
              </div>
            )}
            {authSuccess && (
              <div className="alert alert-success py-2 px-3 small mb-3 rounded-3 d-flex align-items-center gap-2 border-success-subtle">
                <span>✅</span>
                <div>{authSuccess}</div>
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                  Email atau Username Petugas
                </label>
                <input
                  type="text"
                  placeholder="admin / username / nama@email.com"
                  className={inputClass}
                  required
                  value={authInput.username || ""}
                  onChange={(e) =>
                    setAuthInput({
                      ...authInput,
                      username: e.target.value,
                      email: e.target.value.includes("@") ? e.target.value : authInput.email,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0" style={{ color: labelColor }}>
                    Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                    style={{ fontSize: "0.74rem" }}
                    onClick={() => setIsForgotModalOpen(true)}
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={inputClass}
                    required
                    value={authInput.password || ""}
                    onChange={(e) =>
                      setAuthInput({
                        ...authInput,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${darkMode ? "border-secondary text-white" : ""}`}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMeCheck"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="rememberMeCheck" style={{ color: labelColor }}>
                  Ingat sesi login saya
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success w-100 fw-bold py-2 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke SIM-SDM</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </form>

            {/* QUICK DEMO LOGIN BUTTONS */}
            <div
              className="p-3 rounded-3 border mb-3"
              style={{
                backgroundColor: darkMode ? "rgba(20, 25, 43, 0.7)" : "rgba(248, 250, 252, 0.8)",
                borderColor: darkMode ? "#222c45" : "#e2e8f0",
              }}
            >
              <small className="d-block fw-semibold mb-2" style={{ fontSize: "0.72rem", color: labelColor }}>
                ⚡ AKUN DEMO SIAP PAKAI:
              </small>
              <div className="d-flex flex-column gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between hover-lift"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleQuickFill("admin", "123")}
                >
                  <span>🛡️ <strong>admin</strong> (Kasubbag SDM / HRD)</span>
                  <span className="badge bg-secondary-subtle text-secondary">Isi Form</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between hover-lift"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleQuickFill("budi", "123")}
                >
                  <span>🩺 <strong>budi</strong> (Perawat IGD Jiwa)</span>
                  <span className="badge bg-secondary-subtle text-secondary">Isi Form</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between hover-lift"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleQuickFill("faisal", "123")}
                >
                  <span>👨‍⚕️ <strong>faisal</strong> (dr. Spesialis Jiwa)</span>
                  <span className="badge bg-secondary-subtle text-secondary">Isi Form</span>
                </button>
              </div>
            </div>

            <div className="text-center border-top border-opacity-10 pt-3">
              <span className="small text-muted">Belum terdaftar? </span>
              <button
                className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none text-success hover-lift"
                onClick={() => setCurrentView("register")}
              >
                Daftar Petugas Baru
              </button>
              <span className="opacity-50 mx-2">•</span>
              <button
                className="btn btn-link btn-sm p-0 text-muted text-decoration-none hover-lift"
                onClick={() => setCurrentView("guest")}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
