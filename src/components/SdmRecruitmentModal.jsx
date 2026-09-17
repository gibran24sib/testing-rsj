import React, { useState } from "react";

export default function SdmRecruitmentModal({
  isOpen,
  onClose,
  job,
  darkMode,
  onSuccessSubmit,
}) {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nik: "",
    email: "",
    noHp: "",
    pendidikanTerakhir: "Profesi Ners",
    nomorStr: "",
    pengalamanKlinis: "1 - 3 Tahun",
    motivasi: "",
    fileCv: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaLengkap.trim() || !formData.email.trim() || !formData.noHp.trim()) {
      alert("Mohon lengkapi seluruh isian wajib pada formulir pendaftaran.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccessSubmit?.(formData.namaLengkap, job.posisi);
    }, 600);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const inputClass = `form-control form-control-sm ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;
  const selectClass = `form-select form-select-sm ${
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
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "640px" }}>
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
              <span className="fs-5">📝</span>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Formulir Lamaran Formasi Tenaga Kesehatan
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  Penerimaan Pegawai BLUD / PPPK RSJ Tampan Provinsi Riau
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
          {isSubmitted ? (
            <div className="modal-body p-5 text-center animate-fade-in">
              <div
                className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981", width: "70px", height: "70px" }}
              >
                <span className="fs-1">✅</span>
              </div>
              <h5 className="fw-bold mb-2">Berkas Lamaran Berhasil Dikirim!</h5>
              <p className="small text-muted mb-3" style={{ maxWidth: "420px", margin: "0 auto" }}>
                Terima kasih, <strong>{formData.namaLengkap}</strong>. Lamaran Anda untuk posisi <strong>{job.posisi}</strong> telah tersimpan di sistem Subbag Kepegawaian RSJ Tampan.
              </p>
              <div
                className="p-3 rounded-3 mb-4 text-start small border"
                style={{
                  backgroundColor: darkMode ? "#141a2c" : "#f8fafc",
                  borderColor: darkMode ? "#222c45" : "#e2e8f0",
                }}
              >
                <div><strong>No. Registrasi:</strong> REG-RSJ-{Date.now().toString().slice(-6)}</div>
                <div><strong>Jadwal Seleksi Administrasi:</strong> Diumumkan H+3 via email & WhatsApp.</div>
                <div><strong>Layanan Bantuan:</strong> Subbag Kepegawaian (0761) 63240 Ext. 102</div>
              </div>
              <button
                type="button"
                className="btn btn-success px-4 fw-semibold"
                onClick={handleClose}
              >
                Tutup & Kembali ke Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* VACANCY BANNER */}
                <div
                  className="p-3 rounded-3 mb-3 border d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: darkMode ? "#161e36" : "#ecfdf5",
                    borderColor: darkMode ? "#23304d" : "#a7f3d0",
                  }}
                >
                  <div>
                    <span className="badge bg-success mb-1">{job.kuota}</span>
                    <h6 className="fw-bold mb-0 text-success">{job.posisi}</h6>
                    <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                      Tenggat: {job.tenggat}
                    </small>
                  </div>
                  <span className="fs-3">🏥</span>
                </div>

                <div className="row g-3">
                  <div className="col-md-7">
                    <label className="form-label small fw-semibold">Nama Lengkap & Gelar <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      required
                      placeholder="Contoh: Ns. Maya Kartika, S.Kep"
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    />
                  </div>

                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">NIK KTP <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      required
                      maxLength={16}
                      placeholder="16 Digit NIK KTP"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Aktif <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className={inputClass}
                      required
                      placeholder="email.pelamar@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Nomor WhatsApp Aktif <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className={inputClass}
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Pendidikan Terakhir <span className="text-danger">*</span></label>
                    <select
                      className={selectClass}
                      value={formData.pendidikanTerakhir}
                      onChange={(e) => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                    >
                      <option value="Profesi Ners">Profesi Ners (S.Kep., Ners)</option>
                      <option value="Dokter Spesialis Jiwa (Sp.KJ)">Dokter Spesialis Jiwa (Sp.KJ)</option>
                      <option value="Spesialis Keperawatan Jiwa (Sp.Kep.J)">Spesialis Keperawatan Jiwa (Sp.Kep.J)</option>
                      <option value="D3 / D4 Keperawatan">D3 / D4 Keperawatan</option>
                      <option value="S1 Terapi Okupasi / Fisioterapi">S1 Terapi Okupasi / Fisioterapi</option>
                      <option value="SMA / SMK Sederajat (Keamanan)">SMA / SMK Sederajat (Keamanan)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">No. STR Tenaga Kesehatan</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Nomor STR Aktif Kemenkes RI"
                      value={formData.nomorStr}
                      onChange={(e) => setFormData({ ...formData, nomorStr: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Pengalaman Klinis</label>
                    <select
                      className={selectClass}
                      value={formData.pengalamanKlinis}
                      onChange={(e) => setFormData({ ...formData, pengalamanKlinis: e.target.value })}
                    >
                      <option value="Fresh Graduate">Fresh Graduate (&lt; 1 Tahun)</option>
                      <option value="1 - 3 Tahun">1 - 3 Tahun di RS / Puskesmas</option>
                      <option value="3 - 5 Tahun">3 - 5 Tahun di Layanan Jiwa</option>
                      <option value="> 5 Tahun">&gt; 5 Tahun Berpengalaman</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Upload Berkas CV / Ijazah (PDF/DOC)</label>
                    <input
                      type="file"
                      className={inputClass}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({ ...formData, fileCv: e.target.files[0]?.name })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Catatan / Ringkasan Keahlian Khusus</label>
                    <textarea
                      rows={2}
                      className={inputClass}
                      placeholder="Contoh: Memiliki sertifikat BTCLS Jiwa, pelatihan Restrain aman, pengalaman perawat bangsal akut..."
                      value={formData.motivasi}
                      onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                    ></textarea>
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
                  onClick={handleClose}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-success px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Mengunggah Lamaran...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>Kirim Berkas Lamaran</span>
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
