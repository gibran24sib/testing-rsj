import React from "react";

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
                  backgroundColor: "rgba(99, 102, 241, 0.12)",
                  color: "#6366f1",
                }}
              >
                📝
              </div>
              <h4 className="fw-bold mb-1">Registrasi Petugas</h4>
              <small className="opacity-75">Pendaftaran Akun Pengelola SIM-RS</small>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 small mb-3 rounded-3">{authError}</div>
            )}
            {authSuccess && (
              <div className="alert alert-success py-2 small mb-3 rounded-3">{authSuccess}</div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  placeholder="Contoh: dr. Budi Santoso / Ns. Siti"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  required
                  value={authInput.nama}
                  onChange={(e) =>
                    setAuthInput({ ...authInput, nama: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Penugasan / Role</label>
                <select
                  className={`form-select ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  value={authInput.role}
                  onChange={(e) =>
                    setAuthInput({ ...authInput, role: e.target.value })
                  }
                >
                  <option value="Petugas Bangsal">Petugas Bangsal Rawat Inap</option>
                  <option value="Petugas Apotek/Farmasi">Petugas Instalasi Farmasi</option>
                  <option value="Admin Logistik">Admin Logistik & Gudang Medis</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Username Baru</label>
                <input
                  type="text"
                  placeholder="username_petugas"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  required
                  value={authInput.username}
                  onChange={(e) =>
                    setAuthInput({
                      ...authInput,
                      username: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  required
                  value={authInput.password}
                  onChange={(e) =>
                    setAuthInput({
                      ...authInput,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold py-2 mb-3 shadow-sm"
              >
                Daftarkan Petugas &rarr;
              </button>
            </form>

            <div className="text-center border-top border-opacity-10 pt-3">
              <button
                className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none text-primary"
                onClick={() => setCurrentView("login")}
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
