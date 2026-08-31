import React from "react";

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
              <h4 className="fw-bold mb-1">Portal Petugas SIM-RS</h4>
              <small className="opacity-75">Sistem Manajemen Logistik RSJ Tampan</small>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 small mb-3 rounded-3">{authError}</div>
            )}
            {authSuccess && (
              <div className="alert alert-success py-2 small mb-3 rounded-3">{authSuccess}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username Petugas</label>
                <input
                  type="text"
                  placeholder="admin / username anda"
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
                <small className="opacity-50 mt-1 d-block" style={{ fontSize: "0.72rem" }}>
                  Akun Demo: <code>admin</code> / Password: <code>123</code>
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 fw-bold py-2 mb-3 shadow-sm"
              >
                Masuk ke SIM-RS &rarr;
              </button>
            </form>

            <div className="text-center border-top border-opacity-10 pt-3">
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
    </div>
  );
}
