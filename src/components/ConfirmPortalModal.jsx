import React, { useEffect } from "react";

export default function ConfirmPortalModal({
  isOpen,
  onClose,
  onConfirm,
  currentUser,
  darkMode,
}) {
  // Listen for Escape key to close modal & Enter key to confirm
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  const modalBg = darkMode ? "#0e1322" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const cardSubBg = darkMode ? "#141b2d" : "#f8fafc";
  const borderColor = darkMode ? "#222c42" : "#e2e8f0";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 1070,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-4 shadow-lg animate-scale-up"
        style={{
          backgroundColor: modalBg,
          color: modalText,
          width: "100%",
          maxWidth: "480px",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(239, 68, 68, 0.15)"
            : "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER & ICON */}
        <div className="p-4 text-center">
          <div
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: darkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
              color: "#ef4444",
              fontSize: "1.8rem",
              border: `2px solid ${darkMode ? "rgba(239, 68, 68, 0.3)" : "#fca5a5"}`,
            }}
          >
            🚪
          </div>

          <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
            Kembali ke Portal & Logout Otomatis?
          </h5>
          <p
            className="small mb-3 px-2"
            style={{ color: textMuted, lineHeight: 1.55 }}
          >
            Anda sedang aktif masuk sebagai{" "}
            <strong className={darkMode ? "text-white" : "text-dark"}>
              {currentUser?.nama || "Petugas SIM-SDM"}
            </strong>{" "}
            ({currentUser?.role || "Staf Kepegawaian"}).
          </p>

          {/* WARNING INFO BADGE */}
          <div
            className="p-3 rounded-3 text-start d-flex align-items-start gap-2 mb-1"
            style={{
              backgroundColor: darkMode ? "rgba(239, 68, 68, 0.12)" : "#fef2f2",
              border: `1px solid ${darkMode ? "rgba(239, 68, 68, 0.25)" : "#fecaca"}`,
              fontSize: "0.82rem",
              color: darkMode ? "#fca5a5" : "#991b1b",
              lineHeight: 1.5,
            }}
          >
            <span className="fs-5 mt-n1">⚠️</span>
            <div>
              <strong>Logout Otomatis:</strong> Kembali ke halaman Portal Informasi Publik akan{" "}
              <strong>langsung mengeluarkan (logout)</strong> profil Anda demi menjaga kerahasiaan & keamanan data kepegawaian RSJ Tampan.
            </div>
          </div>
        </div>

        {/* MODAL ACTION BUTTONS */}
        <div
          className="d-flex align-items-center justify-content-end gap-2 px-4 py-3 border-top"
          style={{
            borderColor,
            backgroundColor: darkMode ? "#0a0d18" : "#fbfcfe",
          }}
        >
          <button
            type="button"
            className="btn btn-sm px-4 py-2 rounded-3 fw-medium hover-lift"
            style={{
              backgroundColor: darkMode ? "#182033" : "#f1f5f9",
              color: darkMode ? "#cbd5e1" : "#475569",
              border: `1px solid ${borderColor}`,
            }}
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm hover-lift"
            style={{
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
            }}
            onClick={onConfirm}
          >
            <span>Ya, Logout & ke Portal</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
