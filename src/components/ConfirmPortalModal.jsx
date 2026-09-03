import React, { useEffect } from "react";

export default function ConfirmPortalModal({
  isOpen,
  onClose,
  onConfirm,
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
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
          maxWidth: "460px",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(16, 185, 129, 0.15)"
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
              backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
              color: "#10b981",
              fontSize: "1.8rem",
              border: `2px solid ${darkMode ? "rgba(16, 185, 129, 0.3)" : "#a7f3d0"}`,
            }}
          >
            🏥
          </div>

          <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
            Kembali ke Portal Utama?
          </h5>
          <p
            className="small mb-3 px-2"
            style={{ color: textMuted, lineHeight: 1.55 }}
          >
            Anda sedang berada di panel <strong>Admin SIM-SDM RSJ Tampan</strong>.
            Apakah Anda yakin ingin beralih ke halaman <strong>Portal Informasi Publik</strong>?
          </p>

          {/* INFO BADGE */}
          <div
            className="p-2 px-3 rounded-3 text-start d-flex align-items-center gap-2 mb-1"
            style={{
              backgroundColor: cardSubBg,
              border: `1px solid ${borderColor}`,
              fontSize: "0.78rem",
              color: textMuted,
            }}
          >
            <span className="fs-6">ℹ️</span>
            <span>
              Sesi login Anda tetap aman. Anda dapat masuk kembali ke mode admin kapan saja.
            </span>
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
            className="btn btn-sm px-4 py-2 rounded-3 fw-medium"
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
            className="btn btn-sm btn-success px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm"
            style={{
              backgroundColor: "#10b981",
              borderColor: "#10b981",
            }}
            onClick={onConfirm}
          >
            <span>Ya, Kembali ke Portal</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
