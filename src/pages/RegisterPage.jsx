import React, { useState } from "react";

export default function RegisterPage({
  authInput,
  setAuthInput,
  authError,
  authSuccess,
  handleRegister,
  setCurrentView,
  darkMode,
  cardBg,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleRegister(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-generate email jika user hanya mengetik username
  const handleUsernameChange = (val) => {
    const cleanUser = val.toLowerCase().replace(/[^a-z0-9_.]/g, "");
    setAuthInput((prev) => ({
      ...prev,
      username: cleanUser,
      email: prev.email && !prev.email.endsWith("@rsjtampan.riau.go.id") ? prev.email : (cleanUser ? `${cleanUser}@rsjtampan.riau.go.id` : ""),
    }));
  };

  const inputClass = `form-control form-control-sm ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;
  const selectClass = `form-select form-select-sm ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;
  const labelColor = darkMode ? "#cbd5e1" : "#475569";

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
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
                  backgroundColor: "rgba(99, 102, 241, 0.12)",
                  color: "#6366f1",
                }}
              >
                📝
              </div>
              <h4 className="fw-bold mb-1">Registrasi Petugas SIM-SDM</h4>
              <small className="opacity-75">
                Pendaftaran Akun Terintegrasi Supabase Auth & Profil Tenaga Medis
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
              <div className="row g-3">
                {/* NAMA LENGKAP & GELAR */}
                <div className="col-12 col-md-7">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Nama Lengkap & Gelar <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: dr. Budi Santoso, Sp.KJ / Ns. Maya, S.Kep"
                    className={inputClass}
                    required
                    value={authInput.nama || ""}
                    onChange={(e) =>
                      setAuthInput({ ...authInput, nama: e.target.value })
                    }
                  />
                </div>

                {/* NIP / NRK */}
                <div className="col-12 col-md-5">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    NIP / NRK Pegawai <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="19920817 201902 1 004"
                    className={inputClass}
                    required
                    value={authInput.nip || ""}
                    onChange={(e) =>
                      setAuthInput({ ...authInput, nip: e.target.value })
                    }
                  />
                </div>

                {/* PENUGASAN / ROLE */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Jabatan / Role Akses <span className="text-danger">*</span>
                  </label>
                  <select
                    className={selectClass}
                    value={authInput.role || "Perawat Pelaksana"}
                    onChange={(e) =>
                      setAuthInput({ ...authInput, role: e.target.value })
                    }
                  >
                    <option value="Perawat Pelaksana">Perawat Pelaksana (Nakes)</option>
                    <option value="Dokter Spesialis Jiwa">Dokter Spesialis Jiwa (Sp.KJ)</option>
                    <option value="Kepala Ruangan Bangsal">Kepala Ruangan Bangsal (Karuk)</option>
                    <option value="Kasubbag Kepegawaian & SDM">Kasubbag Kepegawaian & SDM (Admin/HRD)</option>
                    <option value="Psikolog Klinis">Psikolog Klinis</option>
                    <option value="Apoteker Farmasi Jiwa">Apoteker Farmasi Jiwa</option>
                    <option value="Admin Logistik & SDM">Admin Logistik & SDM</option>
                  </select>
                </div>

                {/* UNIT PENEMPATAN / BANGSAL */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Unit Penempatan / Bangsal <span className="text-danger">*</span>
                  </label>
                  <select
                    className={selectClass}
                    value={authInput.unit || "Bangsal Kampar (Akut Pria)"}
                    onChange={(e) =>
                      setAuthInput({ ...authInput, unit: e.target.value })
                    }
                  >
                    <option value="Bangsal Kampar (Akut Pria)">Bangsal Kampar (Akut Pria)</option>
                    <option value="Bangsal Siak (Wanita)">Bangsal Siak (Wanita)</option>
                    <option value="Bangsal Rokan (Rehabilitasi NAPZA)">Bangsal Rokan (Rehabilitasi NAPZA)</option>
                    <option value="IGD Jiwa & Krisis 24 Jam">IGD Jiwa & Krisis 24 Jam</option>
                    <option value="Poliklinik Rawat Jalan Jiwa">Poliklinik Rawat Jalan Jiwa</option>
                    <option value="Instalasi Farmasi & Gudang Obat">Instalasi Farmasi & Gudang Obat</option>
                    <option value="Subbagian Kepegawaian & SDM">Subbagian Kepegawaian & SDM</option>
                  </select>
                </div>

                {/* USERNAME */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Username Baru <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="budi_setiawan"
                    className={inputClass}
                    required
                    value={authInput.username || ""}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                  <small className="opacity-50 mt-1 d-block" style={{ fontSize: "0.7rem" }}>
                    Digunakan untuk masuk ke sistem
                  </small>
                </div>

                {/* EMAIL */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Email Resmi / Supabase Auth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="nama.petugas@rsjtampan.riau.go.id"
                    className={inputClass}
                    required
                    value={authInput.email || ""}
                    onChange={(e) =>
                      setAuthInput({ ...authInput, email: e.target.value })
                    }
                  />
                  <small className="opacity-50 mt-1 d-block" style={{ fontSize: "0.7rem" }}>
                    Terhubung langsung dengan Supabase Auth
                  </small>
                </div>

                {/* PASSWORD */}
                <div className="col-12">
                  <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                    Password (Minimal 6 Karakter) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={inputClass}
                    required
                    minLength={6}
                    value={authInput.password || ""}
                    onChange={(e) =>
                      setAuthInput({
                        ...authInput,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100 fw-bold py-2 mt-4 mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Mendaftarkan ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>📝</span>
                    <span>Daftarkan Akun Petugas &rarr;</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center border-top border-opacity-10 pt-3">
              <span className="small text-muted">Sudah punya akun? </span>
              <button
                className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none text-primary"
                onClick={() => setCurrentView("login")}
              >
                Masuk ke SIM-SDM
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
    </div>
  );
}
