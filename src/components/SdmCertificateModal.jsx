import React from "react";

export default function SdmCertificateModal({
  isOpen,
  onClose,
  training,
  employeeName,
  darkMode,
}) {
  if (!isOpen || !training) return null;

  const handlePrint = () => {
    window.print();
  };

  const recipientName = employeeName || "Ns. Budi Setiawan, S.Kep";

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1060,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "780px" }}>
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
              <span className="fs-5">🎓</span>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  E-Sertifikat Pelatihan & Kredensialing Jiwa
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  Terakreditasi Kementerian Kesehatan RI & PPNI Provinsi Riau
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

          {/* MODAL BODY (PRINTABLE CERTIFICATE) */}
          <div className="modal-body p-4 overflow-auto" style={{ maxHeight: "75vh" }}>
            <div
              id="printable-certificate"
              className="p-4 p-md-5 rounded-4 shadow-md position-relative overflow-hidden text-dark text-center"
              style={{
                background: "linear-gradient(135deg, #fffdfa 0%, #fefcf9 100%)",
                border: "8px double #d97706",
                minHeight: "440px",
              }}
            >
              {/* DECORATIVE CORNER ACCENTS */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "40px",
                  height: "40px",
                  borderTop: "3px solid #b45309",
                  borderLeft: "3px solid #b45309",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "40px",
                  height: "40px",
                  borderTop: "3px solid #b45309",
                  borderRight: "3px solid #b45309",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  width: "40px",
                  height: "40px",
                  borderBottom: "3px solid #b45309",
                  borderLeft: "3px solid #b45309",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  width: "40px",
                  height: "40px",
                  borderBottom: "3px solid #b45309",
                  borderRight: "3px solid #b45309",
                }}
              ></div>

              {/* CERTIFICATE HEADER */}
              <div className="mb-3">
                <div className="fs-2 mb-1">🏥 📜 🎖️</div>
                <h6 className="text-uppercase fw-bold mb-0 text-muted" style={{ letterSpacing: "2px", fontSize: "0.8rem" }}>
                  Instalasi Diklat & Pengembangan SDM RSJ Tampan
                </h6>
                <h3 className="fw-bold mb-1" style={{ color: "#92400e", letterSpacing: "3px", fontFamily: "Georgia, serif" }}>
                  SERTIFIKAT KOMPETENSI
                </h3>
                <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                  Nomor Registrasi Kemenkes: 440.11/DIKLAT-RSJ/SKP-JIWA/{training.id || "TRN-01"}/2026
                </small>
              </div>

              {/* RECIPIENT */}
              <div className="my-3">
                <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>
                  Diberikan dengan bangga kepada:
                </p>
                <h4 className="fw-bold mb-1 text-dark text-decoration-underline" style={{ fontFamily: "Georgia, serif" }}>
                  {recipientName}
                </h4>
                <p className="small text-muted mb-3">
                  Sebagai <strong>PESERTA AKTIF (LULUS KOMPETENSI)</strong> dalam program pengembangan profesional berkelanjutan:
                </p>
              </div>

              {/* TRAINING TITLE */}
              <div
                className="p-3 rounded-3 my-2 d-inline-block mx-auto"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  maxWidth: "580px",
                }}
              >
                <h5 className="fw-bold mb-1" style={{ color: "#b45309", fontSize: "1.1rem" }}>
                  "{training.namaPelatihan}"
                </h5>
                <small className="d-block text-dark fw-medium" style={{ fontSize: "0.78rem" }}>
                  Standar Akreditasi: <strong>{training.standarAkreditasi || "KARS & Kemenkes RI (4 SKP Profesi)"}</strong>
                </small>
              </div>

              <p className="small text-muted mt-2 mb-4">
                Diselenggarakan oleh {training.penyelenggara || "Instalasi Diklat RSJ Tampan"} pada tanggal {training.jadwalMulai} s/d {training.jadwalSelesai}.
              </p>

              {/* SIGNATURES */}
              <div className="row mt-4 pt-2 align-items-end">
                <div className="col-4 text-center">
                  <small className="d-block text-muted mb-3">Ketua Komite Keperawatan</small>
                  <p className="fw-bold mb-0 text-decoration-underline" style={{ fontSize: "0.82rem" }}>
                    Ns. Siti Rahmawati, Sp.Kep.J
                  </p>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>NIP. 19850614 200804 2 002</small>
                </div>

                <div className="col-4 text-center">
                  <div className="d-inline-block p-2 bg-white rounded border shadow-sm">
                    <div className="fs-3">📱</div>
                    <small className="d-block" style={{ fontSize: "0.58rem" }}>E-SKP VERIFIED</small>
                  </div>
                </div>

                <div className="col-4 text-center">
                  <small className="d-block text-muted mb-3">Kepala Subbag Kepegawaian & SDM</small>
                  <p className="fw-bold mb-0 text-decoration-underline" style={{ fontSize: "0.82rem" }}>
                    Agus Pratondo, S.Sos
                  </p>
                  <small className="text-muted" style={{ fontSize: "0.7rem" }}>NIP. 19830214 200803 1 001</small>
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
              className="btn btn-sm btn-warning text-dark px-4 fw-bold d-flex align-items-center gap-2 shadow-sm"
              onClick={handlePrint}
            >
              <span>🖨️</span>
              <span>Cetak / Download Sertifikat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
