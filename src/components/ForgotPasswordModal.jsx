import React, { useState } from "react";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  darkMode,
}) {
  const [identifier, setIdentifier] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSent(false);
    setIdentifier("");
    onClose();
  };

  const inputClass = `form-control ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1060,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "460px" }}>
        <div
          className="modal-content rounded-4 border-0 shadow-lg overflow-hidden animate-scale-up"
          style={{
            backgroundColor: darkMode ? "#0f1424" : "#ffffff",
            color: darkMode ? "#f8fafc" : "#0f172a",
          }}
        >
          {/* MODAL HEADER */}
          <div
            className="modal-header py-3 px-4 border-bottom d-flex justify-content-between align-items-center"
            style={{ borderColor: darkMode ? "#1f293d" : "#e2e8f0" }}
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: darkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Bantuan Akses & Reset Password
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  Subbagian Kepegawaian & SDM RSJ Tampan
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          {/* MODAL BODY */}
          {isSent ? (
            <div className="modal-body p-4 text-center animate-fade-in">
              <div
                className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", width: "56px", height: "56px" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h6 className="fw-bold mb-2">Permintaan Reset Password Terkirim!</h6>
              <p className="small text-muted mb-3">
                Tautan verifikasi dan instruksi pemulihan password telah dikirimkan ke alamat email / nomor WhatsApp petugas terdaftar: <strong>{identifier}</strong>.
              </p>
              <div
                className="p-3 rounded-3 mb-3 text-start small border"
                style={{
                  backgroundColor: darkMode ? "#141a2c" : "#f8fafc",
                  borderColor: darkMode ? "#222c45" : "#e2e8f0",
                }}
              >
                <div><strong>Kontak Bantuan Langsung:</strong></div>
                <div>Subbag SDM: 0761-63240 (Ext. 102)</div>
                <div>Helpdesk Admin: admin.sdm@rsjtampan.riau.go.id</div>
              </div>
              <button
                type="button"
                className="btn btn-success btn-sm px-4 fw-semibold"
                onClick={handleClose}
              >
                Selesai
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <p className="small text-muted mb-3">
                  Masukkan NIP, Username, atau Email resmi RSJ Anda. Sistem akan mengirimkan tautan reset atau meneruskannya ke Administrator Subbagian SDM.
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">NIP / Username / Email Petugas</label>
                  <input
                    type="text"
                    className={inputClass}
                    required
                    placeholder="Contoh: budi / 19920817... / budi@rsjtampan..."
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div
                className="modal-footer py-2 px-4 border-top d-flex justify-content-between"
                style={{ borderColor: darkMode ? "#1f293d" : "#e2e8f0" }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3"
                  onClick={handleClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Tautan Reset</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
