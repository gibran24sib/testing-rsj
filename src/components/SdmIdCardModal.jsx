import React from "react";

export default function SdmIdCardModal({
  isOpen,
  onClose,
  employee,
  darkMode,
}) {
  if (!isOpen || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  const isMedical = employee.kategori === "Medis";
  const isNursing = employee.kategori === "Keperawatan";
  const badgeColor = isMedical ? "#0284c7" : isNursing ? "#10b981" : "#8b5cf6";

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1060,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "480px" }}>
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
              <span className="fs-5">🪪</span>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Kartu Identitas Pegawai (KPE/ID Badge)
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  SIM-SDM RSJ Tampan Provinsi Riau
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* MODAL BODY: ID CARD BADGE PREVIEW */}
          <div className="modal-body p-4 d-flex flex-column align-items-center">
            {/* ID CARD CONTAINER */}
            <div
              id="printable-id-card"
              className="p-4 rounded-4 shadow-lg position-relative overflow-hidden w-100"
              style={{
                maxWidth: "360px",
                background: darkMode
                  ? "linear-gradient(145deg, #161e36 0%, #0d1222 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
                border: `2px solid ${badgeColor}`,
                color: darkMode ? "#ffffff" : "#0f172a",
              }}
            >
              {/* LANYARD HOLE ACCENT */}
              <div
                className="mx-auto mb-3 rounded-pill"
                style={{
                  width: "48px",
                  height: "8px",
                  backgroundColor: darkMode ? "#2a3754" : "#cbd5e1",
                }}
              ></div>

              {/* CARD TOP BRAND */}
              <div className="text-center mb-3 pb-2 border-bottom" style={{ borderColor: darkMode ? "#23304d" : "#e2e8f0" }}>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                  <span className="fs-4">🏥</span>
                  <div className="text-start">
                    <div className="fw-bold" style={{ fontSize: "0.82rem", letterSpacing: "0.05em", color: "#10b981" }}>
                      PEMERINTAH PROVINSI RIAU
                    </div>
                    <div className="fw-bolder" style={{ fontSize: "0.92rem", letterSpacing: "-0.01em" }}>
                      RSJ TAMPAN PEKANBARU
                    </div>
                  </div>
                </div>
                <small className="d-block text-muted" style={{ fontSize: "0.65rem" }}>
                  Jl. H.R. Soebrantas Km. 12.5, Tampan, Pekanbaru
                </small>
              </div>

              {/* EMPLOYEE PHOTO & BADGE */}
              <div className="text-center position-relative mb-3">
                <div className="position-relative d-inline-block">
                  <img
                    src={employee.foto || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
                    alt={employee.nama}
                    className="rounded-circle shadow-md"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      border: `3px solid ${badgeColor}`,
                    }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 badge rounded-pill px-2 py-1 shadow-sm"
                    style={{
                      backgroundColor: badgeColor,
                      fontSize: "0.62rem",
                      color: "#fff",
                    }}
                  >
                    {employee.statusKepegawaian || "PNS"}
                  </span>
                </div>
              </div>

              {/* EMPLOYEE IDENTITY */}
              <div className="text-center mb-3">
                <h6 className="fw-bold mb-1" style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}>
                  {employee.nama}
                </h6>
                <div
                  className="fw-semibold px-2 py-1 rounded-2 d-inline-block mb-1"
                  style={{
                    backgroundColor: darkMode ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                    color: "#10b981",
                    fontSize: "0.75rem",
                  }}
                >
                  {employee.profesi}
                </div>
                <div className="text-muted small" style={{ fontSize: "0.72rem" }}>
                  NIP: <strong className="text-reset">{employee.nip || "-"}</strong>
                </div>
              </div>

              {/* CARD DETAILS GRID */}
              <div
                className="p-2 rounded-3 mb-3"
                style={{
                  backgroundColor: darkMode ? "#101628" : "#f8fafc",
                  fontSize: "0.72rem",
                  border: darkMode ? "1px solid #1e2840" : "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex justify-content-between py-1 border-bottom border-opacity-10">
                  <span className="text-muted">Unit Kerja:</span>
                  <span className="fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                    {employee.unitPenempatan}
                  </span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-opacity-10">
                  <span className="text-muted">Golongan:</span>
                  <span className="fw-semibold">{employee.golongan || "-"}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Masa Berlaku STR:</span>
                  <span className={`fw-semibold ${employee.str?.status === "Mendekati Expired" ? "text-warning" : "text-success"}`}>
                    {employee.str?.masaBerlaku || "Seumur Hidup"}
                  </span>
                </div>
              </div>

              {/* QR CODE & BARCODE SIMULATION */}
              <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: darkMode ? "#23304d" : "#e2e8f0" }}>
                <div>
                  <small className="d-block text-muted" style={{ fontSize: "0.62rem" }}>ID KPE DIGITAL</small>
                  <code style={{ fontSize: "0.75rem", color: "#10b981" }}>{employee.id}</code>
                </div>

                {/* VISUAL QR CODE PLACEHOLDER */}
                <div
                  className="p-1 rounded bg-white text-dark d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "46px", height: "46px" }}
                  title="QR Verifikasi SIM-SDM RSJ Tampan"
                >
                  <span style={{ fontSize: "28px" }}>📱</span>
                </div>
              </div>
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
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              onClick={handlePrint}
            >
              <span>🖨️</span>
              <span>Cetak Kartu Pegawai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
