import React from "react";

export default function SdmLeaveLetterModal({
  isOpen,
  onClose,
  leaveRequest,
  darkMode,
}) {
  if (!isOpen || !leaveRequest) return null;

  const handlePrint = () => {
    window.print();
  };

  const isApproved = leaveRequest.status === "Disetujui";

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1060,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: "720px" }}>
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
              <span className="fs-5">📜</span>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Surat Permohonan & Izin Cuti Resmi Pegawai
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  Format Resmi Standar BKN / RSJ Tampan Provinsi Riau
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

          {/* MODAL BODY (PRINTABLE DOCUMENT) */}
          <div className="modal-body p-4 overflow-auto" style={{ maxHeight: "75vh" }}>
            <div
              id="printable-leave-letter"
              className="p-4 p-md-5 rounded-3 shadow-sm bg-white text-dark border"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                borderColor: "#cbd5e1",
              }}
            >
              {/* KOP SURAT RESMI PEMPROV RIAU */}
              <div className="text-center pb-3 border-bottom border-2 border-dark mb-4 position-relative">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div className="fs-1">🏥</div>
                  <div>
                    <h5 className="fw-bold mb-0 text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "1.05rem" }}>
                      Pemerintah Provinsi Riau
                    </h5>
                    <h4 className="fw-bolder mb-0 text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "1.25rem" }}>
                      Rumah Sakit Jiwa Tampan
                    </h4>
                    <p className="mb-0 small" style={{ fontSize: "0.78rem" }}>
                      Jl. H.R. Soebrantas Km. 12.5, Tuah Karya, Kec. Tampan, Kota Pekanbaru, Riau 28293
                    </p>
                    <small style={{ fontSize: "0.72rem" }}>
                      Telepon: (0761) 63240 • Email: kepegawaian@rsjtampan.riau.go.id • Laman: rsjtampan.riau.go.id
                    </small>
                  </div>
                </div>
              </div>

              {/* JUDUL SURAT */}
              <div className="text-center mb-4">
                <h6 className="fw-bold text-decoration-underline text-uppercase mb-1" style={{ fontSize: "1.05rem" }}>
                  Surat Izin Pemberian Cuti Pegawai
                </h6>
                <small className="text-muted">
                  Nomor: 800.1.11.1 / RSJ-SDM / CUTI / {new Date().getFullYear()} / {leaveRequest.id.replace(/[^0-9]/g, "") || "108"}
                </small>
              </div>

              {/* ISI PERMOHONAN */}
              <div className="mb-3">
                <p className="mb-2">
                  Diberikan izin cuti kepada Pegawai / Tenaga Kesehatan Rumah Sakit Jiwa Tampan Provinsi Riau dengan identitas sebagai berikut:
                </p>

                <table className="table table-borderless table-sm mb-3 ms-2" style={{ maxWidth: "580px", fontSize: "0.92rem" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "190px" }}>Nama Lengkap</td>
                      <td style={{ width: "10px" }}>:</td>
                      <td className="fw-bold">{leaveRequest.nama}</td>
                    </tr>
                    <tr>
                      <td>NIP / NRK</td>
                      <td>:</td>
                      <td>{leaveRequest.nip || "-"}</td>
                    </tr>
                    <tr>
                      <td>Jabatan / Profesi</td>
                      <td>:</td>
                      <td>{leaveRequest.profesi || "Perawat Pelaksana"}</td>
                    </tr>
                    <tr>
                      <td>Unit Kerja / Bangsal</td>
                      <td>:</td>
                      <td>{leaveRequest.unit || "Bangsal Rawat Inap Jiwa"}</td>
                    </tr>
                    <tr>
                      <td>Jenis Cuti yang Diambil</td>
                      <td>:</td>
                      <td className="fw-bold text-primary">{leaveRequest.jenisCuti}</td>
                    </tr>
                    <tr>
                      <td>Lamanya Cuti</td>
                      <td>:</td>
                      <td><strong>{leaveRequest.jumlahHari} hari kerja</strong></td>
                    </tr>
                    <tr>
                      <td>Terhitung Mulai Tanggal</td>
                      <td>:</td>
                      <td>{leaveRequest.tanggalMulai} s/d {leaveRequest.tanggalSelesai}</td>
                    </tr>
                    <tr>
                      <td>Alasan Cuti</td>
                      <td>:</td>
                      <td><em>"{leaveRequest.alasan}"</em></td>
                    </tr>
                    <tr>
                      <td>Petugas Pelimpahan Tugas</td>
                      <td>:</td>
                      <td>{leaveRequest.petugasPengganti || "-"}</td>
                    </tr>
                    <tr>
                      <td>Status Permohonan</td>
                      <td>:</td>
                      <td>
                        <span className={`badge ${isApproved ? "bg-success" : "bg-warning text-dark"}`}>
                          {leaveRequest.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="mb-3 text-justify">
                  Demikian surat izin cuti ini diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya, dengan ketentuan setelah masa cuti berakhir wajib segera melapor dan aktif kembali menjalankan tugas pelayanan klinis di RSJ Tampan.
                </p>
              </div>

              {/* TANDA TANGAN & QR VERIFIKASI */}
              <div className="row mt-4 pt-3 align-items-end">
                <div className="col-6 text-center">
                  <div className="p-2 border rounded d-inline-block bg-light mb-1">
                    <div className="fs-3">📱</div>
                    <small className="d-block" style={{ fontSize: "0.62rem" }}>
                      QR Verifikasi Keabsahan SIM-SDM
                    </small>
                    <code style={{ fontSize: "0.65rem" }}>{leaveRequest.id}</code>
                  </div>
                </div>

                <div className="col-6 text-center">
                  <p className="mb-0 small">Pekanbaru, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <p className="mb-4 small fw-semibold">
                    Kepala Subbagian Kepegawaian & SDM<br />RSJ Tampan Provinsi Riau
                  </p>
                  <div className="my-2">
                    <span className="badge bg-success-subtle text-success border border-success px-2 py-1" style={{ fontSize: "0.7rem" }}>
                      ✓ Ditandatangani Secara Elektronik (TTE)
                    </span>
                  </div>
                  <h6 className="fw-bold mb-0 text-decoration-underline" style={{ fontSize: "0.95rem" }}>
                    {leaveRequest.disetujuiOleh?.split("(")[0] || "Agus Pratondo, S.Sos"}
                  </h6>
                  <small className="d-block text-muted" style={{ fontSize: "0.78rem" }}>
                    NIP. 19830214 200803 1 001
                  </small>
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
              className="btn btn-sm btn-primary px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              onClick={handlePrint}
            >
              <span>🖨️</span>
              <span>Cetak Surat Izin Cuti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
