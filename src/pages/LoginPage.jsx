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

  const inputClass = `form-control ${
    darkMode ? "bg-dark text-white border-secondary" : "border-light-subtle"
  }`;
  const labelColor = darkMode ? "#cbd5e1" : "#475569";

  return (
    <div style={{ maxWidth: "940px", width: "100%" }} className="animate-fade-in my-2">
      <div
        className="rounded-4 overflow-hidden shadow-lg"
        style={{
          backgroundColor: darkMode ? "#0f1524" : "#ffffff",
          border: darkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div className="row g-0">
          {/* KOLOM KIRI: SHOWCASE & IDENTITAS RESMI RSJ (TIDAK POLOS) */}
          <div
            className="col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-between text-white position-relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #064e3b 0%, #065f46 45%, #0f172a 100%)",
            }}
          >
            {/* Background Decorative Rings */}
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.12)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                left: "-30px",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(56, 189, 248, 0.08)",
                pointerEvents: "none",
              }}
            />

            <div>
              {/* BRANDING HEADER */}
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center p-1"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    width: "48px",
                    height: "48px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
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
                  <h6 className="mb-0 fw-bold tracking-tight" style={{ fontSize: "1rem" }}>
                    RSJ TAMPAN
                  </h6>
                  <small className="opacity-75 d-block" style={{ fontSize: "0.72rem" }}>
                    Provinsi Riau &bull; Akreditasi Paripurna ⭐⭐⭐⭐⭐
                  </small>
                </div>
              </div>

              {/* JUDUL SISTEM */}
              <h4 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
                SIM-SDM Kepegawaian
              </h4>
              <p className="opacity-90 small mb-4" style={{ lineHeight: "1.5" }}>
                Sistem Informasi Manajemen Sumber Daya Manusia terpadu tenaga medis, perawat jiwa, dan tenaga kesehatan RSJ Tampan Pekanbaru.
              </p>

              {/* 3 HIGHLIGHT PILLS / FITUR UTAMA */}
              <div className="d-flex flex-column gap-2.5 mb-4">
                <div
                  className="p-2.5 rounded-3 d-flex align-items-center gap-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(6px)" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>👥</span>
                  <div>
                    <strong className="d-block small" style={{ fontSize: "0.82rem" }}>1.200+ Tenaga Kesehatan</strong>
                    <small className="opacity-75 d-block" style={{ fontSize: "0.7rem" }}>
                      Dokter Sp.KJ, Ners Jiwa, Psikolog, & Farmasi
                    </small>
                  </div>
                </div>

                <div
                  className="p-2.5 rounded-3 d-flex align-items-center gap-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(6px)" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>🇮🇩</span>
                  <div>
                    <strong className="d-block small" style={{ fontSize: "0.82rem" }}>Terintegrasi MyASN & SIASN</strong>
                    <small className="opacity-75 d-block" style={{ fontSize: "0.7rem" }}>
                      Sinkronisasi 9 Riwayat BKN & Kemenkes RI
                    </small>
                  </div>
                </div>

                <div
                  className="p-2.5 rounded-3 d-flex align-items-center gap-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(6px)" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>📜</span>
                  <div>
                    <strong className="d-block small" style={{ fontSize: "0.82rem" }}>Audit Legalitas STR & SIP</strong>
                    <small className="opacity-75 d-block" style={{ fontSize: "0.7rem" }}>
                      Jenjang Karir PK I-IV & Kredensialing KARS
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* HOSPITAL MOTTO FOOTER */}
            <div
              className="p-3 rounded-3 mt-3"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderLeft: "3px solid #10b981",
              }}
            >
              <em className="d-block small" style={{ fontSize: "0.76rem" }}>
                "Melayani dengan Hati, Integritas, dan Profesionalisme Prima."
              </em>
              <small className="opacity-50 mt-1 d-block" style={{ fontSize: "0.68rem" }}>
                Pemerintah Provinsi Riau &bull; Dinas Kesehatan
              </small>
            </div>
          </div>

          {/* KOLOM KANAN: FORMULIR AUTENTIKASI */}
          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              {/* HEADER FORM */}
              <div className="mb-4">
                <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill fw-semibold mb-2" style={{ fontSize: "0.72rem" }}>
                  Portal Masuk Resmi
                </span>
                <h4 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>
                  Selamat Datang
                </h4>
                <p className="text-muted small mb-0">
                  Silakan masukkan akun SIM-SDM Anda untuk mengakses layanan kepegawaian.
                </p>
              </div>

              {/* NOTIFIKASI ERROR (HUMANIZED SVG) */}
              {authError && (
                <div className="alert alert-danger py-2 px-3 small mb-3 rounded-3 d-flex align-items-center gap-2 border-danger-subtle">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-danger flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <div>{authError}</div>
                </div>
              )}

              {/* NOTIFIKASI SUCCESS (HUMANIZED SVG) */}
              {authSuccess && (
                <div className="alert alert-success py-2 px-3 small mb-3 rounded-3 d-flex align-items-center gap-2 border-success-subtle">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success flex-shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>{authSuccess}</div>
                </div>
              )}

              {/* FORM LOGIN */}
              <form onSubmit={onSubmit}>
                {/* EMAIL / USERNAME */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Email atau Username Petugas
                  </label>
                  <div className="input-group">
                    <span
                      className={`input-group-text ${
                        darkMode ? "bg-dark text-secondary border-secondary" : "bg-light text-muted border-end-0"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="admin / username / email"
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
                </div>

                {/* PASSWORD */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold mb-0" style={{ color: labelColor }}>
                      Password Akun
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
                    <span
                      className={`input-group-text ${
                        darkMode ? "bg-dark text-secondary border-secondary" : "bg-light text-muted border-end-0"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
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
                      className={`btn btn-outline-secondary ${
                        darkMode ? "border-secondary text-secondary" : "border-start-0 text-muted"
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* INGAT SESI */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMeCheck"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="rememberMeCheck" style={{ color: labelColor }}>
                    Ingat sesi login saya di perangkat ini
                  </label>
                </div>

                {/* TOMBOL SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-success w-100 fw-bold py-2.5 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-lift"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke SIM-SDM</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* REGISTRASI LINK */}
              <div className="text-center border-top border-opacity-10 pt-3">
                <span className="small text-muted">Belum memiliki akun petugas? </span>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none text-success hover-lift"
                  onClick={() => setCurrentView("register")}
                >
                  Daftar Petugas Baru
                </button>
              </div>
            </div>

            {/* SECURITY TRUST BADGE */}
            <div
              className="d-flex align-items-center justify-content-center gap-2 mt-4 pt-2 text-muted border-top border-opacity-10"
              style={{ fontSize: "0.72rem" }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-success"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Akses Terenkripsi SSL 256-Bit &bull; Terhubung Database SDM RSJ Tampan</span>
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
