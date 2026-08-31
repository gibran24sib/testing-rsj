import React, { useState } from "react";
import { doctorsList } from "../data/doctorsData";

export default function AppointmentBookingModal({
  show,
  onClose,
  darkMode,
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorsList[0]?.id || "");
  const [formData, setFormData] = useState(() => ({
    namaPasien: "",
    nik: "",
    noHp: "",
    tanggalKunjungan: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    sesi: "Sesi Pagi (08.30 - 11.30 WIB)",
    keluhan: "",
  }));
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!show) return null;

  const selectedDoctor = doctorsList.find((d) => d.id === selectedDoctorId) || doctorsList[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPasien || !formData.noHp) return;

    const queueNumber = `A-${Math.floor(100 + Math.random() * 900)}`;
    const ticket = {
      ...formData,
      doctor: selectedDoctor,
      queueNumber,
      kodeBooking: `RSJT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString("id-ID"),
    };

    setBookingSuccess(ticket);
  };

  const handleReset = () => {
    setBookingSuccess(null);
    setFormData({
      namaPasien: "",
      nik: "",
      noHp: "",
      tanggalKunjungan: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      sesi: "Sesi Pagi (08.30 - 11.30 WIB)",
      keluhan: "",
    });
    onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
      }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className={`modal-content border-0 shadow-lg ${
            darkMode ? "bg-dark-card text-light" : "bg-white text-dark"
          }`}
          style={{
            border: darkMode ? "1px solid #232a3d" : "1px solid #e2e8f0",
          }}
        >
          {/* HEADER MODAL */}
          <div className="modal-header border-bottom border-opacity-10 pb-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontSize: "1.1rem",
                }}
              >
                📅
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">
                  {bookingSuccess ? "E-Ticket Nomor Antrean Poliklinik" : "Pendaftaran & Antrean Dokter Spesialis"}
                </h5>
                <small className="opacity-75">
                  Layanan Rawat Jalan Terpadu RSJ Tampan Provinsi Riau
                </small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={handleReset}
            ></button>
          </div>

          <div className="modal-body p-4">
            {!bookingSuccess ? (
              /* FORM PENDAFTARAN */
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* PILIH DOKTER */}
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Pilih Dokter Spesialis / Psikolog</label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                    >
                      {doctorsList.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.nama} — {doc.spesialisasi}
                        </option>
                      ))}
                    </select>
                    <div
                      className="p-2 rounded-3 mt-2 small d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: darkMode ? "#141824" : "#f1f5f9",
                        border: darkMode ? "1px solid #20273a" : "1px solid #e2e8f0",
                      }}
                    >
                      <span>📍 <b>Ruangan:</b> {selectedDoctor.ruangan}</span>
                      <span className="badge badge-soft-success">🕒 {selectedDoctor.jadwal}</span>
                    </div>
                  </div>

                  {/* DATA PASIEN */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Nama Lengkap Pasien *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama pasien"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={formData.namaPasien}
                      onChange={(e) => setFormData({ ...formData, namaPasien: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Tanggal Kunjungan</label>
                    <input
                      type="date"
                      required
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={formData.tanggalKunjungan}
                      onChange={(e) => setFormData({ ...formData, tanggalKunjungan: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Pilih Sesi Praktik</label>
                    <select
                      className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={formData.sesi}
                      onChange={(e) => setFormData({ ...formData, sesi: e.target.value })}
                    >
                      <option value="Sesi Pagi (08.30 - 11.30 WIB)">Sesi Pagi (08.30 - 11.30 WIB)</option>
                      <option value="Sesi Siang (12.30 - 14.30 WIB)">Sesi Siang (12.30 - 14.30 WIB)</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Catatan / Keluhan Singkat (Opsional)</label>
                    <textarea
                      rows="2"
                      placeholder="Keluhan utama atau rujukan sebelumnya..."
                      className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                      value={formData.keluhan}
                      onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top border-opacity-10 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success fw-semibold px-4">
                    🎟️ Dapatkan Nomor Antrean
                  </button>
                </div>
              </form>
            ) : (
              /* TIKET SUKSES / DIGITAL TICKET SLIP */
              <div className="animate-fade-in text-center py-2">
                <div
                  className="p-4 rounded-4 shadow-sm mx-auto position-relative"
                  style={{
                    maxWidth: "480px",
                    backgroundColor: darkMode ? "#141826" : "#f0fdf4",
                    border: darkMode ? "1px solid #232c42" : "1px solid #bbf7d0",
                  }}
                >
                  <div className="badge badge-soft-success px-3 py-1 rounded-pill mb-2">
                    ✅ Registrasi Antrean Berhasil
                  </div>
                  <h6 className="fw-bold mb-0">RSJ TAMPAN PROVINSI RIAU</h6>
                  <small className="opacity-50 font-monospace">{bookingSuccess.kodeBooking}</small>

                  <hr className="my-3 opacity-25" />

                  <span className="small opacity-75 d-block">NOMOR ANTREAN ANDA:</span>
                  <h1
                    className="fw-bold my-1"
                    style={{
                      fontSize: "3.2rem",
                      color: "#10b981",
                      letterSpacing: "2px",
                    }}
                  >
                    {bookingSuccess.queueNumber}
                  </h1>
                  <span className="badge badge-soft-primary px-3 py-1">
                    {bookingSuccess.sesi}
                  </span>

                  <div className="text-start mt-4 p-3 rounded-3 bg-opacity-50" style={{ backgroundColor: darkMode ? "#0d101a" : "#ffffff" }}>
                    <div className="d-flex justify-content-between small py-1 border-bottom border-opacity-10">
                      <span className="opacity-75">Pasien:</span>
                      <strong>{bookingSuccess.namaPasien}</strong>
                    </div>
                    <div className="d-flex justify-content-between small py-1 border-bottom border-opacity-10">
                      <span className="opacity-75">Dokter:</span>
                      <strong>{bookingSuccess.doctor.nama}</strong>
                    </div>
                    <div className="d-flex justify-content-between small py-1 border-bottom border-opacity-10">
                      <span className="opacity-75">Poli / Ruangan:</span>
                      <span>{bookingSuccess.doctor.ruangan}</span>
                    </div>
                    <div className="d-flex justify-content-between small py-1">
                      <span className="opacity-75">Tanggal:</span>
                      <strong className="text-success">{bookingSuccess.tanggalKunjungan}</strong>
                    </div>
                  </div>

                  <div className="mt-3 small opacity-75">
                    Tunjukkan tiket digital ini atau sebutkan kode booking kepada petugas loket pendaftaran.
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => window.print()}
                  >
                    🖨️ Cetak Bukti Antrean
                  </button>
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={handleReset}
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
