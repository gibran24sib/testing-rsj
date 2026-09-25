import React, { useState } from "react";

export default function SdmDocumentPreviewModal({
  isOpen,
  onClose,
  doc = null,
  employeeName = "Pegawai RSJ",
  employeeNip = "19920817 201902 1 004",
  employeeUnit = "Bangsal RSJ Tampan",
  darkMode = false,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !doc) return null;

  const isImage =
    doc.tipe === "JPG" ||
    doc.tipe === "JPEG" ||
    doc.tipe === "PNG" ||
    doc.tipe === "WEBP" ||
    doc.tipe === "GIF" ||
    (doc.fileUrl && doc.fileUrl.startsWith("data:image/"));

  const isPdf =
    doc.tipe === "PDF" ||
    (doc.fileUrl && (doc.fileUrl.startsWith("data:application/pdf") || doc.fileUrl.endsWith(".pdf")));

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.realFileName || `${doc.nama}.${(doc.tipe || "pdf").toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const dummyContent = `====================================================\nARSIP DOKUMEN DIGITAL SIM-SDM RSJ TAMPAN RIAU\n====================================================\nNama Dokumen    : ${doc.nama}\nKategori        : ${doc.kategori || "Dokumen Kepegawaian"}\nNomor Dokumen   : ${doc.nomorDokumen || "-"}\nTahun Terbit    : ${doc.tahunTerbit || "-"}\nPegawai         : ${employeeName}\nNIP             : ${employeeNip}\nUnit Penempatan : ${employeeUnit}\nTanggal Unggah  : ${doc.tanggalUpload}\nUkuran Berkas   : ${doc.ukuran || "1.2 MB"}\nStatus Dokumen  : ${doc.status || "Terverifikasi"}\nKeterangan      : ${doc.keterangan || "Arsip digital resmi kepegawaian RSJ Tampan."}\n====================================================`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.nama.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenInNewTab = () => {
    if (doc.fileUrl) {
      const win = window.open();
      if (win) {
        if (isImage) {
          win.document.write(`<img src="${doc.fileUrl}" style="max-width:100%; height:auto;" />`);
        } else {
          win.location.href = doc.fileUrl;
        }
      }
    } else {
      handleDownload();
    }
  };

  const modalBg = darkMode ? "#0f1422" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";
  const innerBg = darkMode ? "#070b14" : "#f1f5f9";

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(8px)",
        zIndex: 1100,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-4 shadow-2xl overflow-hidden animate-scale-up d-flex flex-column"
        style={{
          backgroundColor: modalBg,
          color: modalText,
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          border: `1px solid ${borderColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
          style={{ borderColor }}
        >
          <div className="d-flex align-items-center gap-3 overflow-hidden">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: isImage ? "#10b981" : isPdf ? "#ef4444" : "#3b82f6",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              {isImage ? "🖼️" : isPdf ? "📕" : "📄"}
            </div>
            <div className="overflow-hidden">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="mb-0 fw-bold text-truncate" style={{ fontSize: "1.05rem" }}>
                  {doc.nama}
                </h5>
                <span className="badge bg-primary-subtle text-primary" style={{ fontSize: "0.72rem" }}>
                  {doc.kategori || doc.tipe || "Dokumen"}
                </span>
                <span
                  className={`badge ${
                    doc.status === "Terverifikasi"
                      ? "bg-success"
                      : doc.status === "Perlu Pembaruan"
                      ? "bg-warning text-dark"
                      : "bg-info text-dark"
                  }`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {doc.status || "Terverifikasi"}
                </span>
              </div>
              <small className="text-muted d-block text-truncate" style={{ fontSize: "0.76rem" }}>
                Pegawai: <strong>{employeeName}</strong> &bull; NIP: {employeeNip} &bull; Ukuran: {doc.ukuran || "1.2 MB"}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 hover-lift"
              onClick={handleDownload}
              title="Unduh Berkas Ini"
            >
              <span>📥</span>
              <span className="d-none d-sm-inline">Unduh</span>
            </button>
            <button
              type="button"
              className="btn-close"
              style={{ filter: darkMode ? "invert(1)" : "none" }}
              onClick={onClose}
              title="Tutup Preview"
            />
          </div>
        </div>

        {/* TOOLBAR KONTROL ZOOM (UNTUK GAMBAR) */}
        {isImage && (
          <div
            className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom small"
            style={{ backgroundColor: darkMode ? "#141b2d" : "#f8fafc", borderColor }}
          >
            <span className="text-muted">
              Zoom: <strong>{Math.round(zoomLevel * 100)}%</strong> &bull; Rotasi: {rotation}&deg;
            </span>
            <div className="d-flex gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1"
                onClick={handleZoomOut}
                title="Perkecil (-)"
              >
                🔍-
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1"
                onClick={handleZoomIn}
                title="Perbesar (+)"
              >
                🔍+
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1"
                onClick={handleRotate}
                title="Putar 90 Derajat"
              >
                🔄 Putar
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1"
                onClick={handleResetZoom}
                title="Reset Tampilan"
              >
                ↺ Reset
              </button>
            </div>
          </div>
        )}

        {/* VIEWER CONTENT AREA */}
        <div
          className="p-3 d-flex align-items-center justify-content-center overflow-auto"
          style={{
            flex: 1,
            backgroundColor: innerBg,
            minHeight: "380px",
            maxHeight: "65vh",
          }}
        >
          {/* CASE 1: IMAGE PREVIEW */}
          {isImage && doc.fileUrl ? (
            <div
              className="d-flex align-items-center justify-content-center w-100 h-100 overflow-auto"
              style={{ minHeight: "350px" }}
            >
              <img
                src={doc.fileUrl}
                alt={doc.nama}
                className="img-fluid rounded-3 shadow transition-all"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  maxHeight: "58vh",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : isPdf && doc.fileUrl && (doc.fileUrl.startsWith("data:application/pdf") || doc.fileUrl.startsWith("blob:")) ? (
            /* CASE 2: REAL PDF EMBED VIEWER */
            <div className="w-100 h-100" style={{ minHeight: "520px" }}>
              <iframe
                src={doc.fileUrl}
                title={doc.nama}
                className="w-100 h-100 rounded-3 border"
                style={{ minHeight: "520px", borderColor }}
              />
            </div>
          ) : (
            /* CASE 3: OFFICIAL RSJ TAMPAN DIGITAL CERTIFICATE & DOCUMENT SHEET VIEWER */
            <div
              className="w-100 rounded-4 p-4 shadow-sm position-relative overflow-hidden"
              style={{
                backgroundColor: darkMode ? "#121829" : "#ffffff",
                border: `2px solid ${darkMode ? "#24324f" : "#cbd5e1"}`,
                maxWidth: "680px",
              }}
            >
              {/* WATERMARK BACKGROUND */}
              <div
                className="position-absolute d-flex align-items-center justify-content-center pointer-events-none"
                style={{
                  top: "15%",
                  left: "10%",
                  right: "10%",
                  bottom: "15%",
                  opacity: darkMode ? 0.04 : 0.05,
                  fontSize: "12rem",
                }}
              >
                🏥
              </div>

              {/* KOP SURAT RESMI */}
              <div className="text-center pb-3 border-bottom mb-3" style={{ borderColor }}>
                <div className="d-flex align-items-center justify-content-center gap-3 mb-1">
                  <span className="fs-2">🏥</span>
                  <div>
                    <h6 className="fw-bold mb-0 text-uppercase" style={{ letterSpacing: "0.5px" }}>
                      Pemerintah Provinsi Riau &bull; Dinas Kesehatan
                    </h6>
                    <h5 className="fw-bold mb-0 text-success">
                      RUMAH SAKIT JIWA TAMPAN PROVINSI RIAU
                    </h5>
                    <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                      Jl. HR. Soebrantas Km. 12.5 Pekanbaru | SIM-SDM E-Berkas Kepegawaian
                    </small>
                  </div>
                </div>
              </div>

              {/* DETAIL LEMBAR DOKUMEN RESMI */}
              <div className="text-center my-3">
                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill small mb-2">
                  ARSIAP DIGITAL RESMI TERVERIFIKASI
                </span>
                <h4 className="fw-bold mb-1">{doc.nama}</h4>
                <p className="text-muted small mb-0">
                  Kategori: <strong>{doc.kategori || "Dokumen Kepegawaian"}</strong>
                  {doc.nomorDokumen && <span> &bull; No. Reg: <strong>{doc.nomorDokumen}</strong></span>}
                  {doc.tahunTerbit && <span> &bull; Tahun: <strong>{doc.tahunTerbit}</strong></span>}
                </p>
              </div>

              <div
                className="p-3 rounded-3 my-3 border small d-flex flex-column gap-2"
                style={{ backgroundColor: darkMode ? "#182035" : "#f8fafc", borderColor }}
              >
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Nama Pemilik Berkas:</span>
                  <strong>{employeeName}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">NIP / Identitas Pegawai:</span>
                  <strong className="font-monospace">{employeeNip}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Unit Kerja / Penempatan:</span>
                  <strong>{employeeUnit}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Tanggal Pengunggahan:</span>
                  <span>{doc.tanggalUpload || "2024-01-10"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Format & Ukuran Berkas:</span>
                  <span>{doc.tipe || "PDF"} &bull; {doc.ukuran || "1.2 MB"}</span>
                </div>
                {doc.keterangan && (
                  <div className="d-flex justify-content-between pt-1 border-top" style={{ borderColor }}>
                    <span className="text-muted">Catatan Khusus:</span>
                    <span className="text-end fst-italic">{doc.keterangan}</span>
                  </div>
                )}
              </div>

              {/* TANDA TANGAN & STATUS VALIDASI DIGITAL */}
              <div className="d-flex justify-content-between align-items-end pt-3 border-top mt-3" style={{ borderColor }}>
                <div className="text-start">
                  <small className="text-muted d-block" style={{ fontSize: "0.68rem" }}>
                    Token Keamanan DMS:
                  </small>
                  <span className="font-monospace text-success small">
                    SHA256-RSJT-{doc.id || "DOC-VERIFIED"}
                  </span>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                    Subbag Kepegawaian & SDM
                  </small>
                  <span className="badge bg-success px-3 py-1">
                    ✓ Valid & Terenkripsi
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER INFORMASI DOKUMEN & AKSI */}
        <div
          className="d-flex flex-wrap align-items-center justify-content-between px-4 py-3 border-top gap-3"
          style={{ borderColor }}
        >
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span>📄 Format: <strong>{doc.tipe}</strong></span>
            <span>&bull;</span>
            <span>Ukuran: <strong>{doc.ukuran}</strong></span>
            <span>&bull;</span>
            <span>Diunggah: <strong>{doc.tanggalUpload}</strong></span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm px-3 hover-lift d-flex align-items-center gap-1"
              onClick={handleOpenInNewTab}
            >
              <span>🔗</span>
              <span>Buka di Tab Baru</span>
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm px-4 fw-bold hover-lift d-flex align-items-center gap-1"
              onClick={handleDownload}
            >
              <span>📥</span>
              <span>Unduh Berkas</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm px-3"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
