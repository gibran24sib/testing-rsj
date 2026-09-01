import React from "react";

export default function SdmSpkModal({
  isOpen,
  onClose,
  credential = null,
  darkMode,
}) {
  if (!isOpen || !credential) return null;

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const cardSubBg = darkMode ? "#141a29" : "#f8fafc";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
        padding: "1rem",
      }}
    >
      <div
        className="rounded-4 shadow-lg animate-scale-up"
        style={{
          backgroundColor: modalBg,
          color: modalText,
          width: "100%",
          maxWidth: "800px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
          style={{ borderColor }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fs-5"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "rgba(139, 92, 246, 0.15)",
                color: "#8b5cf6",
              }}
            >
              🎖️
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                Surat Penugasan Klinis (SPK) & Rincian Kewenangan Klinis (RKK)
              </h5>
              <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                {credential.komite} • RSJ Tampan Provinsi Riau
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ filter: darkMode ? "invert(1)" : "none" }}
            onClick={onClose}
          />
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          {/* HEADER SPK CERTIFICATE STYLE */}
          <div
            className="p-3 rounded-3 mb-4 border"
            style={{
              backgroundColor: cardSubBg,
              borderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <div>
                <span className="badge bg-purple rounded-pill px-3 py-1 mb-1" style={{ backgroundColor: "#8b5cf6", color: "#fff" }}>
                  {credential.jenjangKarir}
                </span>
                <h5 className="fw-bold mb-0">{credential.nama}</h5>
                <small className="text-muted">Nomor SPK: <strong>{credential.noSpk}</strong></small>
              </div>
              <div className="text-end">
                <span className="badge bg-success px-2 py-1 mb-1 d-block">{credential.statusKredensial}</span>
                <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                  Masa Berlaku: {credential.tglTerbitSpk} s/d {credential.masaBerlakuSpk}
                </small>
              </div>
            </div>
            <p className="small text-muted mb-0 border-top pt-2 mt-2">
              <strong>Mitra Bestari (Peer Reviewer):</strong> {credential.mitraBestari}
            </p>
          </div>

          {/* RKK TABLE (RINCIAN KEWENANGAN KLINIS) */}
          <h6 className="fw-bold mb-2 text-primary d-flex align-items-center gap-2">
            <span>📜</span> Matriks Rincian Kewenangan Klinis (Clinical Privilege)
          </h6>
          <div className="table-responsive rounded-3 border mb-3" style={{ borderColor }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.84rem" }}>
              <thead style={{ backgroundColor: darkMode ? "#161c2d" : "#f1f5f9" }}>
                <tr>
                  <th className="py-2 px-3">No</th>
                  <th className="py-2">Tindakan / Prosedur Klinis Jiwa</th>
                  <th className="py-2">Level PK</th>
                  <th className="py-2 text-end px-3">Status Kewenangan</th>
                </tr>
              </thead>
              <tbody>
                {credential.rkkList.map((rkk, idx) => (
                  <tr key={idx} style={{ borderBottomColor: borderColor }}>
                    <td className="px-3 py-2 text-muted">{idx + 1}</td>
                    <td className="py-2 fw-medium">{rkk.tindakan}</td>
                    <td className="py-2">
                      <span className="badge bg-light text-dark border">{rkk.level}</span>
                    </td>
                    <td className="text-end px-3 py-2">
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          rkk.wewenang === "Mandiri"
                            ? "bg-success"
                            : rkk.wewenang === "Di Bawah Supervisi"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {rkk.wewenang === "Mandiri"
                          ? "✅ Mandiri"
                          : rkk.wewenang === "Di Bawah Supervisi"
                          ? "👁️ Supervisi"
                          : "⛔ Belum Berwenang"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LEGALITAS RESMI DIREKTUR */}
          <div
            className="p-3 rounded-3 border text-muted small"
            style={{
              backgroundColor: darkMode ? "#141a29" : "#f8fafc",
              borderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0">
                  Ditetapkan oleh: <strong>Direktur RSJ Tampan Provinsi Riau</strong>
                </p>
                <small>Berdasarkan Rekomendasi Kredensialing {credential.komite}</small>
              </div>
              <span className="badge bg-success-subtle text-success border border-success px-3 py-1">
                Tanda Tangan Elektronik Terverifikasi (TTE BSrE)
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-top"
          style={{ borderColor }}
        >
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => window.print()}
          >
            <span>🖨️</span> Cetak Berkas SPK & RKK
          </button>
          <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
