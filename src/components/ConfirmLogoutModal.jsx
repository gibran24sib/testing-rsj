import React, { useEffect } from "react";

export default function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  currentUser,
  darkMode,
}) {
  // Listen for Escape key to close modal & Enter key to confirm logout
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

  const modalBg = darkMode ? "#0f1322" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const cardSubBg = darkMode ? "#161b2d" : "#f8fafc";
  const borderColor = darkMode ? "#232d46" : "#e2e8f0";
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
        zIndex: 1080,
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
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(239, 68, 68, 0.15)"
            : "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER & ICON */}
        <div className="p-4 text-center">
          <div
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm animate-pulse-subtle"
            style={{
              width: "66px",
              height: "66px",
              backgroundColor: darkMode ? "rgba(239, 68, 68, 0.14)" : "#fee2e2",
              color: "#ef4444",
              fontSize: "1.85rem",
              border: `2px solid ${darkMode ? "rgba(239, 68, 68, 0.35)" : "#fca5a5"}`,
            }}
          >
            🚪
          </div>

          <h5 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
            Yakin Ingin Logout?
          </h5>
          <p
            className="small mb-3 px-2"
            style={{ color: textMuted, lineHeight: 1.55 }}
          >
            Sesi aktif Anda pada <strong>SIM-SDM RSJ Tampan</strong> akan diakhiri dan dialihkan kembali ke tampilan <strong>Portal Utama</strong>.
          </p>

          {/* USER INFO BADGE */}
          {currentUser && (
            <div
              className="p-3 rounded-3 text-start d-flex align-items-center gap-3 mb-1"
              style={{
                backgroundColor: cardSubBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: "#10b981",
                  fontSize: "0.95rem",
                  flexShrink: 0,
                }}
              >
                {currentUser?.nama ? currentUser.nama.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <div className="fw-semibold text-truncate" style={{ fontSize: "0.85rem" }}>
                  {currentUser?.nama || "Petugas SIM-RS"}
                </div>
                <small className="d-block text-truncate" style={{ color: textMuted, fontSize: "0.72rem" }}>
                  {currentUser?.role || "Administrator SDM"} • @{currentUser?.username || "user"}
                </small>
              </div>
            </div>
          )}
        </div>

        {/* MODAL ACTION BUTTONS */}
        <div
          className="d-flex align-items-center justify-content-end gap-2 px-4 py-3 border-top"
          style={{
            borderColor,
            backgroundColor: darkMode ? "#0b0e1a" : "#fbfcfe",
          }}
        >
          <button
            type="button"
            className="btn btn-sm px-4 py-2 rounded-3 fw-medium transition-all"
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
            className="btn btn-sm btn-danger px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 shadow-sm transition-all"
            style={{
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
            }}
            onClick={onConfirm}
          >
            <span>Ya, Logout Sekarang</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
