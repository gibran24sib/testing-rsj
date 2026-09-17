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
  cardBg,
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
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div
            className={`p-4 shadow-sm rounded-4 ${cardBg}`}
            style={{
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div className="text-center mb-4">
              <div
                className="d-inline-flex p-3 rounded-4 fs-3 mb-2"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  color: "#10b981",
                }}
              >
                🔐
              </div>
              <h4 className="fw-bold mb-1">Masuk SIM-SDM</h4>
              <small className="opacity-75">
                Sistem Informasi Terpadu SDM & Kepegawaian RSJ Tampan
              </small>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 small mb-3 rounded-3 d-flex align-items-center gap-2">
                <span>⚠️</span>
                <div>{authError}</div>
              </div>
            )}
            {authSuccess && (
              <div className="alert alert-success py-2 small mb-3 rounded-3 d-flex align-items-center gap-2">
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
                className="btn btn-success w-100 fw-bold py-2 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
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
                backgroundColor: darkMode ? "#14192b" : "#f8fafc",
                borderColor: darkMode ? "#222c45" : "#e2e8f0",
              }}
            >
              <small className="d-block fw-semibold mb-2" style={{ fontSize: "0.72rem", color: labelColor }}>
                ⚡ AKUN DEMO SIAP PAKAI:
              </small>
              <div className="d-flex flex-column gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleQuickFill("admin", "123")}
                >
                  <span>🛡️ <strong>admin</strong> (Kasubbag SDM / HRD)</span>
                  <span className="badge bg-secondary-subtle text-secondary">Isi Form</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => handleQuickFill("budi", "123")}
                >
                  <span>🩺 <strong>budi</strong> (Perawat IGD Jiwa)</span>
                  <span className="badge bg-secondary-subtle text-secondary">Isi Form</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-start py-1 px-2 d-flex align-items-center justify-content-between"
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
                className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none text-primary"
                onClick={() => setCurrentView("register")}
              >
                Daftar Petugas Baru
              </button>
              <span className="opacity-50 mx-2">•</span>
              <button
                className="btn btn-link btn-sm p-0 text-muted text-decoration-none"
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
