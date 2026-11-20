import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function SdmIdCardModal({
  isOpen,
  onClose,
  employee,
  darkMode,
}) {
  const [cardOrientation, setCardOrientation] = useState("portrait"); // "portrait" | "landscape"
  const [cardSide, setCardSide] = useState("front"); // "front" | "back"

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const isMedical = employee.kategori === "Medis";
  const isNursing = employee.kategori === "Keperawatan";
  const badgeColor = isMedical ? "#0284c7" : isNursing ? "#10b981" : "#8b5cf6";
  const statusColor =
    employee.statusKepegawaian === "PNS"
      ? "#10b981"
      : employee.statusKepegawaian === "PPPK"
        ? "#3b82f6"
        : "#f59e0b";

  // Use createPortal to mount directly on document.body
  // This guarantees it is always fixed to the exact screen center without needing any scroll!
  return createPortal(
    <>
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-id-card, #printable-id-card * {
            visibility: visible !important;
          }
          #printable-id-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1) !important;
            margin: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div
        className="animate-fade-in"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          boxSizing: "border-box",
        }}
        onClick={onClose}
      >
        <div
          className="rounded-4 shadow-lg overflow-hidden animate-scale-up"
          style={{
            width: "100%",
            maxWidth: cardOrientation === "landscape" ? "480px" : "360px",
            backgroundColor: darkMode ? "#0f1424" : "#ffffff",
            color: darkMode ? "#f8fafc" : "#0f172a",
            border: darkMode ? "1px solid #1f293d" : "1px solid #e2e8f0",
            boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            transition: "max-width 0.2s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER - COMPACT */}
          <div
            className="py-2 px-3 border-bottom d-flex justify-content-between align-items-center"
            style={{
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
              backgroundColor: darkMode ? "#131b2e" : "#f8fafc",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "1.1rem" }}>🪪</span>
              <div>
                <h6 className="fw-bold mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.2" }}>
                  Kartu Identitas Pegawai (KPE)
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.65rem" }}>
                  SIM-SDM RSJ Tampan Provinsi Riau
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
              aria-label="Close"
              style={{ fontSize: "0.75rem" }}
            ></button>
          </div>

          {/* CONTROLS (ORIENTATION & FLIP) */}
          <div
            className="px-3 py-1.5 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2"
            style={{
              backgroundColor: darkMode ? "#0c111e" : "#f1f5f9",
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
            }}
          >
            {/* ORIENTATION TOGGLE */}
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn btn-sm py-0.5 px-2 ${cardOrientation === "portrait"
                    ? "btn-success fw-semibold shadow-xs"
                    : darkMode
                      ? "btn-outline-secondary text-light border-0"
                      : "btn-outline-secondary border-0"
                  }`}
                onClick={() => setCardOrientation("portrait")}
                style={{ fontSize: "0.7rem" }}
              >
                📇 Tegak
              </button>
              <button
                type="button"
                className={`btn btn-sm py-0.5 px-2 ${cardOrientation === "landscape"
                    ? "btn-success fw-semibold shadow-xs"
                    : darkMode
                      ? "btn-outline-secondary text-light border-0"
                      : "btn-outline-secondary border-0"
                  }`}
                onClick={() => setCardOrientation("landscape")}
                style={{ fontSize: "0.7rem" }}
              >
                💳 KPE
              </button>
            </div>

            {/* FLIP TOGGLE */}
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn btn-sm py-0.5 px-2 ${cardSide === "front"
                    ? darkMode
                      ? "btn-light text-dark fw-bold"
                      : "btn-dark text-white fw-bold"
                    : "btn-link text-muted text-decoration-none"
                  }`}
                onClick={() => setCardSide("front")}
                style={{ fontSize: "0.68rem" }}
              >
                Depan
              </button>
              <button
                type="button"
                className={`btn btn-sm py-0.5 px-2 ${cardSide === "back"
                    ? darkMode
                      ? "btn-light text-dark fw-bold"
                      : "btn-dark text-white fw-bold"
                    : "btn-link text-muted text-decoration-none"
                  }`}
                onClick={() => setCardSide("back")}
                style={{ fontSize: "0.68rem" }}
              >
                Belakang
              </button>
            </div>
          </div>

          {/* CARD PREVIEW CONTAINER */}
          <div
            className="p-3 d-flex flex-column align-items-center justify-content-center overflow-auto"
            style={{ minHeight: "260px" }}
          >
            {/* OPTION A: PORTRAIT FRONT */}
            {cardOrientation === "portrait" && cardSide === "front" && (
              <div
                id="printable-id-card"
                className="rounded-4 shadow position-relative overflow-hidden w-100"
                style={{
                  maxWidth: "310px",
                  background: darkMode
                    ? "linear-gradient(155deg, #17213c 0%, #0d1222 100%)"
                    : "linear-gradient(155deg, #ffffff 0%, #f1f5f9 100%)",
                  border: `2px solid ${badgeColor}`,
                  color: darkMode ? "#ffffff" : "#0f172a",
                  padding: "12px 14px",
                }}
              >
                {/* Lanyard Hole */}
                <div
                  className="mx-auto mb-1.5 rounded-pill"
                  style={{
                    width: "36px",
                    height: "4px",
                    backgroundColor: darkMode ? "#2a3754" : "#cbd5e1",
                  }}
                ></div>

                {/* Header */}
                <div
                  className="text-center mb-1.5 pb-1 border-bottom"
                  style={{ borderColor: darkMode ? "#24324f" : "#e2e8f0" }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-1 mb-0.5">
                    <span style={{ fontSize: "1rem" }}>🏥</span>
                    <div className="text-start">
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: "0.62rem",
                          letterSpacing: "0.04em",
                          color: "#10b981",
                          lineHeight: "1",
                        }}
                      >
                        PEMERINTAH PROVINSI RIAU
                      </div>
                      <div
                        className="fw-bolder"
                        style={{
                          fontSize: "0.78rem",
                          letterSpacing: "-0.01em",
                          lineHeight: "1.1",
                        }}
                      >
                        RSJ TAMPAN PEKANBARU
                      </div>
                    </div>
                  </div>
                  <small className="d-block text-muted" style={{ fontSize: "0.55rem" }}>
                    Jl. H.R. Soebrantas Km. 12.5, Tampan, Pekanbaru
                  </small>
                </div>

                {/* Avatar */}
                <div className="text-center position-relative mb-1.5">
                  <div className="position-relative d-inline-block">
                    <img
                      src={
                        employee.foto ||
                        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={employee.nama}
                      className="rounded-circle shadow-sm"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        border: `2px solid ${badgeColor}`,
                      }}
                    />
                    <span
                      className="position-absolute bottom-0 end-0 badge rounded-pill px-1.5 py-0.5 shadow-sm"
                      style={{
                        backgroundColor: statusColor,
                        fontSize: "0.52rem",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {employee.statusKepegawaian || "PNS"}
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="text-center mb-1.5">
                  <h6
                    className="fw-bold mb-0.5 text-truncate"
                    style={{ fontSize: "0.85rem" }}
                    title={employee.nama}
                  >
                    {employee.nama}
                  </h6>
                  <div
                    className="fw-semibold px-2 py-0.5 rounded-2 d-inline-block mb-0.5"
                    style={{
                      backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                      color: "#10b981",
                      fontSize: "0.64rem",
                    }}
                  >
                    {employee.profesi || "Tenaga Kesehatan"}
                  </div>
                  <div className="text-muted small" style={{ fontSize: "0.62rem" }}>
                    NIP: <strong className="text-reset">{employee.nip || "-"}</strong>
                  </div>
                </div>

                {/* Info Grid */}
                <div
                  className="p-1.5 rounded-2 mb-1.5"
                  style={{
                    backgroundColor: darkMode ? "#0f1629" : "#f8fafc",
                    fontSize: "0.62rem",
                    border: darkMode ? "1px solid #1e2840" : "1px solid #e2e8f0",
                  }}
                >
                  <div className="d-flex justify-content-between py-0.5 border-bottom border-opacity-10">
                    <span className="text-muted">Unit:</span>
                    <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: "160px" }}>
                      {employee.unitPenempatan || "-"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-0.5 border-bottom border-opacity-10">
                    <span className="text-muted">Golongan:</span>
                    <span className="fw-semibold">{employee.golongan || "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between py-0.5">
                    <span className="text-muted">STR/SIP:</span>
                    <span
                      className={`fw-semibold ${employee.str?.status === "Mendekati Expired"
                          ? "text-warning"
                          : employee.str?.status === "Expired"
                            ? "text-danger"
                            : "text-success"
                        }`}
                    >
                      {employee.str?.masaBerlaku ? `s/d ${employee.str.masaBerlaku}` : "Aktif"}
                    </span>
                  </div>
                </div>

                {/* Footer Code */}
                <div
                  className="d-flex align-items-center justify-content-between pt-1 border-top"
                  style={{ borderColor: darkMode ? "#24324f" : "#e2e8f0" }}
                >
                  <div>
                    <small className="d-block text-muted" style={{ fontSize: "0.55rem" }}>
                      ID DIGITAL
                    </small>
                    <code style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 700 }}>
                      {employee.id}
                    </code>
                  </div>
                  <div
                    className="p-1 rounded bg-white text-dark d-flex align-items-center justify-content-center shadow-xs"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <span style={{ fontSize: "18px" }}>📱</span>
                  </div>
                </div>
              </div>
            )}

            {/* OPTION B: LANDSCAPE FRONT (KPE) */}
            {cardOrientation === "landscape" && cardSide === "front" && (
              <div
                id="printable-id-card"
                className="rounded-4 shadow position-relative overflow-hidden w-100"
                style={{
                  maxWidth: "440px",
                  background: darkMode
                    ? "linear-gradient(135deg, #17213c 0%, #0d1222 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
                  border: `2px solid ${badgeColor}`,
                  color: darkMode ? "#ffffff" : "#0f172a",
                  padding: "12px 16px",
                }}
              >
                {/* Header */}
                <div
                  className="d-flex justify-content-between align-items-center pb-1.5 mb-1.5 border-bottom"
                  style={{ borderColor: darkMode ? "#24324f" : "#e2e8f0" }}
                >
                  <div className="d-flex align-items-center gap-1.5">
                    <span style={{ fontSize: "1.1rem" }}>🏥</span>
                    <div>
                      <div
                        className="fw-bold"
                        style={{
                          fontSize: "0.62rem",
                          color: "#10b981",
                          letterSpacing: "0.03em",
                          lineHeight: "1",
                        }}
                      >
                        PEMERINTAH PROVINSI RIAU
                      </div>
                      <div
                        className="fw-bolder"
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: "1.1",
                        }}
                      >
                        RSJ TAMPAN PEKANBARU
                      </div>
                    </div>
                  </div>
                  <span
                    className="badge rounded-pill px-2 py-0.5"
                    style={{
                      backgroundColor: statusColor,
                      color: "#fff",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                    }}
                  >
                    KPE &bull; {employee.statusKepegawaian || "PNS"}
                  </span>
                </div>

                {/* 2-Column Body */}
                <div className="row g-2 align-items-center">
                  <div className="col-4 text-center">
                    <img
                      src={
                        employee.foto ||
                        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={employee.nama}
                      className="rounded-3 shadow-sm mb-1"
                      style={{
                        width: "56px",
                        height: "56px",
                        objectFit: "cover",
                        border: `2px solid ${badgeColor}`,
                      }}
                    />
                    <div
                      className="p-0.5 rounded bg-white text-dark mx-auto d-flex align-items-center justify-content-center shadow-xs"
                      style={{ width: "26px", height: "26px" }}
                    >
                      <span style={{ fontSize: "14px" }}>📱</span>
                    </div>
                  </div>

                  <div className="col-8">
                    <h6
                      className="fw-bold mb-0.5 text-truncate"
                      style={{ fontSize: "0.85rem" }}
                      title={employee.nama}
                    >
                      {employee.nama}
                    </h6>
                    <div
                      className="fw-semibold px-1.5 py-0.5 rounded-1 d-inline-block mb-1"
                      style={{
                        backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                        color: "#10b981",
                        fontSize: "0.62rem",
                      }}
                    >
                      {employee.profesi}
                    </div>

                    <div
                      className="p-1 rounded-2"
                      style={{
                        backgroundColor: darkMode ? "#0f1629" : "#f8fafc",
                        fontSize: "0.62rem",
                        border: darkMode ? "1px solid #1e2840" : "1px solid #e2e8f0",
                      }}
                    >
                      <div className="d-flex justify-content-between py-0.5">
                        <span className="text-muted">NIP:</span>
                        <strong className="text-reset">{employee.nip || "-"}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-0.5">
                        <span className="text-muted">Unit:</span>
                        <strong className="text-truncate ms-1" style={{ maxWidth: "130px" }}>
                          {employee.unitPenempatan || "-"}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between py-0.5">
                        <span className="text-muted">Golongan:</span>
                        <strong>{employee.golongan || "-"}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Code */}
                <div
                  className="d-flex justify-content-between align-items-center mt-1.5 pt-1 border-top"
                  style={{ borderColor: darkMode ? "#24324f" : "#e2e8f0", fontSize: "0.58rem" }}
                >
                  <span className="text-muted">SIM-SDM RSJ TAMPAN</span>
                  <code style={{ color: "#10b981", fontWeight: 700 }}>ID: {employee.id}</code>
                </div>
              </div>
            )}

            {/* OPTION C: BACK SIDE */}
            {cardSide === "back" && (
              <div
                id="printable-id-card"
                className="rounded-4 shadow position-relative overflow-hidden w-100"
                style={{
                  maxWidth: cardOrientation === "landscape" ? "440px" : "310px",
                  background: darkMode
                    ? "linear-gradient(155deg, #17213c 0%, #0d1222 100%)"
                    : "linear-gradient(155deg, #ffffff 0%, #f1f5f9 100%)",
                  border: `2px solid ${badgeColor}`,
                  color: darkMode ? "#ffffff" : "#0f172a",
                  padding: "12px 14px",
                }}
              >
                <div
                  className="text-center pb-1 mb-1.5 border-bottom"
                  style={{ borderColor: darkMode ? "#24324f" : "#e2e8f0" }}
                >
                  <div className="fw-bold" style={{ fontSize: "0.68rem", color: "#10b981" }}>
                    KETENTUAN KARTU PEGAWAI ELEKTRONIK
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.55rem" }}>
                    RSJ Tampan Provinsi Riau
                  </small>
                </div>

                <ul
                  className="ps-3 mb-1.5 text-muted"
                  style={{ fontSize: "0.58rem", lineHeight: "1.35" }}
                >
                  <li>Kartu identitas resmi pegawai di lingkungan RSJ Tampan.</li>
                  <li>Wajib dikenakan selama jam dinas & pelayanan.</li>
                  <li>Jika hilang/rusak segera lapor ke Subbag SDM.</li>
                </ul>

                <div
                  className="p-1 rounded-2 mb-1.5 text-center"
                  style={{
                    backgroundColor: darkMode ? "#0f1629" : "#f8fafc",
                    border: darkMode ? "1px solid #1e2840" : "1px solid #e2e8f0",
                  }}
                >
                  <div className="text-muted" style={{ fontSize: "0.55rem" }}>
                    Call Center SDM RSJ Tampan:
                  </div>
                  <div className="fw-bold text-success" style={{ fontSize: "0.64rem" }}>
                    📞 (0761) 63222 &bull; sdm@rsjtampan.riau.go.id
                  </div>
                </div>

                {/* Barcode */}
                <div className="text-center pt-0.5">
                  <div
                    className="mx-auto rounded"
                    style={{
                      letterSpacing: "3px",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      backgroundColor: darkMode ? "#1f2b48" : "#e2e8f0",
                      padding: "2px 6px",
                      display: "inline-block",
                    }}
                  >
                    ||| | |||| || ||| || |||
                  </div>
                  <div className="text-muted mt-0.5" style={{ fontSize: "0.55rem" }}>
                    {employee.id} - {employee.nip?.replace(/\s+/g, "") || "NIP-000"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MODAL FOOTER - COMPACT */}
          <div
            className="py-2 px-3 border-top d-flex justify-content-between align-items-center"
            style={{
              borderColor: darkMode ? "#1f293d" : "#e2e8f0",
              backgroundColor: darkMode ? "#131b2e" : "#f8fafc",
            }}
          >
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3"
              onClick={onClose}
              style={{ fontSize: "0.75rem" }}
            >
              Tutup
            </button>

            <button
              type="button"
              className="btn btn-sm btn-success px-3 fw-semibold d-flex align-items-center gap-1.5 shadow-sm hover-lift"
              onClick={handlePrint}
              style={{ fontSize: "0.75rem" }}
            >
              <span>🖨️</span>
              <span>Cetak Kartu Pegawai</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
