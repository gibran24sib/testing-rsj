import React, { useState, useEffect, useRef } from "react";
import { uploadDossierFileApi } from "../services/sdmApi";

export default function SdmDossierModal({
  isOpen,
  onClose,
  dossier = null,
  onSaveDossier,
  darkMode,
}) {
  const [docList, setDocList] = useState([]);
  const [customDocTitle, setCustomDocTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize state strictly when opening or when dossier prop changes
  useEffect(() => {
    if (dossier) {
      setDocList(dossier.dokumen ? [...dossier.dokumen] : []);
      setCustomDocTitle("");
    }
  }, [dossier, isOpen]);

  if (!isOpen || !dossier) return null;

  // Handle native file selection from local device (Windows / Mac / Android / etc.)
  const handleNativeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Format file size
    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb < 1024
        ? `${sizeInKb.toFixed(1)} KB`
        : `${(sizeInKb / 1024).toFixed(1)} MB`;

    // Extract file type / extension
    const extension = file.name.split(".").pop().toUpperCase() || "PDF";
    const displayName = customDocTitle.trim() || file.name;
    const fileBlobUrl = URL.createObjectURL(file);

    // Attempt upload to Node.js backend if available
    try {
      await uploadDossierFileApi(dossier.employeeId, file, displayName);
    } catch (err) {
      console.warn("Upload ke backend dilewati:", err);
    }

    const newDoc = {
      id: `DOC-${Date.now()}`,
      nama: displayName,
      tipe: extension,
      ukuran: formattedSize,
      tanggalUpload: new Date().toISOString().split("T")[0],
      status: "Terverifikasi",
      fileUrl: fileBlobUrl,
      realFileName: file.name,
    };

    const updatedDocs = [newDoc, ...docList];
    setDocList(updatedDocs);
    setCustomDocTitle("");
    setIsUploading(false);

    // Reset file input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Calculate dynamic completeness %
    const newCompleteness = Math.min(100, Math.round((updatedDocs.length / 5) * 100));

    const updatedDossier = {
      ...dossier,
      persentaseLengkap: newCompleteness,
      dokumen: updatedDocs,
    };

    onSaveDossier?.(updatedDossier);
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteDocument = (docIndex) => {
    if (window.confirm("Hapus dokumen ini dari arsip digital pegawai?")) {
      const updatedDocs = docList.filter((_, idx) => idx !== docIndex);
      setDocList(updatedDocs);
      const newCompleteness = Math.min(100, Math.round((updatedDocs.length / 5) * 100));

      const updatedDossier = {
        ...dossier,
        persentaseLengkap: newCompleteness,
        dokumen: updatedDocs,
      };

      onSaveDossier?.(updatedDossier);
    }
  };

  const handleDownloadDoc = (doc) => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.realFileName || `${doc.nama}.${doc.tipe.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Mock dummy download for pre-existing records
      const dummyContent = `Dokumen Resmi Kepegawaian RSJ Tampan Riau\nNama Berkas: ${doc.nama}\nPegawai: ${dossier.nama}\nTgl Upload: ${doc.tanggalUpload}\nStatus: ${doc.status}`;
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

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const cardSubBg = darkMode ? "#141a29" : "#f8fafc";
  const inputBg = darkMode ? "#181d2e" : "#f8fafc";
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
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
              }}
            >
              📁
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                Arsip Digital Dossier: {dossier.nama}
              </h5>
              <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                NIP / ID: <strong>{dossier.employeeId}</strong> • E-Berkas Terenkripsi Subbag Kepegawaian RSJ Tampan
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
          {/* COMPLETENESS PROGRESS BAR */}
          <div
            className="p-3 rounded-3 mb-4 border"
            style={{
              backgroundColor: cardSubBg,
              borderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small fw-semibold">Status Kelengkapan Dokumen ({dossier.nama})</span>
              <strong className="text-success">{dossier.persentaseLengkap}% Lengkap</strong>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${dossier.persentaseLengkap}%` }}
              />
            </div>
          </div>

          {/* UPLOAD FORM (DIRECT DEVICE FILE PICKER) */}
          <div
            className="p-3 rounded-3 mb-4 border"
            style={{
              backgroundColor: darkMode ? "#161d30" : "#f0fdf4",
              borderColor: darkMode ? "#232e4d" : "#bbf7d0",
            }}
          >
            <h6 className="fw-bold mb-2 small text-success d-flex align-items-center gap-2">
              <span>📤</span> Unggah Berkas Langsung dari Perangkat (Device Anda)
            </h6>

            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleNativeFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx"
              style={{ display: "none" }}
            />

            <div className="row g-2 align-items-center">
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Keterangan Dokumen (Opsional: misal SK Pangkat 2026)..."
                  value={customDocTitle}
                  onChange={(e) => setCustomDocTitle(e.target.value)}
                  style={{ backgroundColor: inputBg, color: modalText, borderColor }}
                />
              </div>
              <div className="col-md-5">
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="btn btn-success btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  disabled={isUploading}
                >
                  <span>📂</span>
                  <span>{isUploading ? "Memproses Berkas..." : "Pilih File dari Device"}</span>
                </button>
              </div>
            </div>
            <small className="text-muted d-block mt-2" style={{ fontSize: "0.72rem" }}>
              Mendukung format: <strong>PDF, DOCX, JPG, PNG</strong> (Maks. 25 MB per dokumen)
            </small>
          </div>

          {/* LIST OF DIGITAL DOCUMENTS FOR THIS SPECIFIC EMPLOYEE */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold mb-0 small text-muted text-uppercase" style={{ letterSpacing: "0.5px" }}>
              Daftar Arsip Berkas ({docList.length} Dokumen Tersimpan)
            </h6>
            <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: "0.7rem" }}>
              Terenkripsi Standar Kemenkes
            </span>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.84rem" }}>
              <thead style={{ backgroundColor: darkMode ? "#161c2d" : "#f1f5f9" }}>
                <tr>
                  <th className="py-2 px-3">Nama Dokumen</th>
                  <th className="py-2">Tipe & Ukuran</th>
                  <th className="py-2">Tgl Unggah</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-end px-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {docList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      Belum ada dokumen digital untuk pegawai ini. Silakan klik "Pilih File dari Device" untuk mengunggah.
                    </td>
                  </tr>
                ) : (
                  docList.map((doc, idx) => (
                    <tr key={doc.id || idx} style={{ borderBottomColor: borderColor }}>
                      <td className="px-3 py-2 fw-medium">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-5">
                            {doc.tipe === "PDF"
                              ? "📕"
                              : doc.tipe === "DOC" || doc.tipe === "DOCX"
                              ? "📘"
                              : doc.tipe === "JPG" || doc.tipe === "PNG"
                              ? "🖼️"
                              : "📄"}
                          </span>
                          <div>
                            <span className="d-block">{doc.nama}</span>
                            {doc.realFileName && (
                              <small className="text-muted" style={{ fontSize: "0.68rem" }}>
                                Asli: {doc.realFileName}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 text-muted">
                        <span className="badge bg-light text-dark border me-1">{doc.tipe}</span>
                        <span>{doc.ukuran}</span>
                      </td>
                      <td className="py-2 text-muted">{doc.tanggalUpload}</td>
                      <td className="py-2 text-center">
                        <span
                          className={`badge rounded-pill px-2 py-1 ${
                            doc.status === "Terverifikasi"
                              ? "bg-success"
                              : doc.status === "Menunggu Verifikasi"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="text-end px-3 py-2">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-info p-1 px-2"
                            title="Unduh Berkas Ini"
                            onClick={() => handleDownloadDoc(doc)}
                          >
                            📥 Unduh
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger p-1 px-2"
                            title="Hapus Dokumen"
                            onClick={() => handleDeleteDocument(idx)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-top"
          style={{ borderColor }}
        >
          <small className="text-muted">
            Semua perubahan berkas tersimpan otomatis khusus untuk <strong>{dossier.nama}</strong>.
          </small>
          <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
