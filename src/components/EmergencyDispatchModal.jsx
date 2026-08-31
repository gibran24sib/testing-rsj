import React, { useState } from "react";

export default function EmergencyDispatchModal({
  show,
  onClose,
  darkMode,
}) {
  const [activeTab, setActiveTab] = useState("request"); // 'request' | 'armada' | 'panduan'
  const [formData, setFormData] = useState({
    namaPasien: "",
    lokasiJemput: "",
    noKontak: "",
    kategoriKegawatan: "Merah (Krisis Akut / Gaduh Gelisah)",
    keteranganKondisi: "",
  });
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  const ambulanceFleet = [
    {
      id: "AMB-01",
      nama: "Ambulans Psikiatri Khusus Unit 01",
      posisi: "Pangkalan Utama RSJ Tampan (Panam)",
      status: "Siaga 24 Jam",
      driver: "Bpk. Suhendra & Tim Perawat Jiwa",
      fasilitas: "Brankar Khusus Restraint Medis, Tabung Oksigen, Emergency Drug Kit",
      statusClass: "badge-soft-success",
    },
    {
      id: "AMB-02",
      nama: "Ambulans Rujukan Medis Unit 02",
      posisi: "Rute Rujukan RSUD Arifin Achmad",
      status: "Bertugas (OTW)",
      driver: "Bpk. M. Danu & Tim Paramedis",
      fasilitas: "Monitoring Vital Sign, Alat EKG Portabel, Suction Unit",
      statusClass: "badge-soft-warning",
    },
    {
      id: "AMB-03",
      nama: "Ambulans Penjemputan Reaktif Unit 03",
      posisi: "Area Siaga Simpang Panam - Kampar",
      status: "Siaga 24 Jam",
      driver: "Bpk. Iwan Setiawan",
      fasilitas: "Perlengkapan Stabilisasi Psikiatri, First Aid Kit",
      statusClass: "badge-soft-success",
    },
  ];

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaPasien || !formData.lokasiJemput || !formData.noKontak) return;

    setDispatchSuccess({
      ...formData,
      kodeLayanan: `DISPATCH-RSJ-${Date.now().toString().slice(-4)}`,
      unitDitugaskan: "Ambulans Psikiatri Khusus Unit 01",
      timMedis: "dr. Jaga IGD & 2 Perawat Jiwa Tersertifikasi",
      eta: "12 - 18 Menit",
      waktuPengajuan: new Date().toLocaleTimeString("id-ID"),
    });
  };

  const handleReset = () => {
    setDispatchSuccess(null);
    setFormData({
      namaPasien: "",
      lokasiJemput: "",
      noKontak: "",
      kategoriKegawatan: "Merah (Krisis Akut / Gaduh Gelisah)",
      keteranganKondisi: "",
    });
    onClose();
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
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
            border: darkMode ? "1px solid #232c42" : "1px solid #e2e8f0",
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-bottom border-opacity-10 pb-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: "rgba(244, 63, 94, 0.15)",
                  color: "#f43f5e",
                  fontSize: "1.2rem",
                }}
              >
                🚑
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Layanan Ambulans & Penjemputan Darurat Psikiatri</h5>
                <small className="opacity-75">Unit Tanggap Darurat Medis & Krisis Jiwa RSJ Tampan 24 Jam</small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={handleReset}
            ></button>
          </div>

          {/* TAB BUTTONS */}
          <div className="px-4 pt-3 d-flex gap-2 border-bottom border-opacity-10">
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 ${
                activeTab === "request" ? "btn-danger fw-semibold shadow-sm" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab("request")}
            >
              🚨 Permohonan Penjemputan
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 ${
                activeTab === "armada" ? "btn-danger fw-semibold shadow-sm" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab("armada")}
            >
              🚐 Status Armada Siaga (3 Unit)
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 py-1 ${
                activeTab === "panduan" ? "btn-danger fw-semibold shadow-sm" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab("panduan")}
            >
              💡 Panduan Pertolongan Pertama
            </button>
          </div>

          <div className="modal-body p-4">
            {activeTab === "request" && (
              !dispatchSuccess ? (
                /* FORM PENJEMPUTAN */
                <form onSubmit={handleSubmit} className="animate-fade-in">
                  <div
                    className="p-3 rounded-3 mb-3 d-flex align-items-center justify-content-between"
                    style={{
                      backgroundColor: darkMode ? "rgba(244, 63, 94, 0.1)" : "#fff1f2",
                      border: "1px solid rgba(244, 63, 94, 0.25)",
                      color: "#f43f5e",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4">☎️</span>
                      <div className="small">
                        <strong>Krisis Darurat Segera?</strong> Anda juga dapat langsung menghubungi Hotline IGD:
                        <span className="fw-bold fs-6 d-block">0761-63238 / 0812-3456-7890</span>
                      </div>
                    </div>
                    <a
                      href="tel:076163238"
                      className="btn btn-sm btn-danger fw-semibold px-3 py-1"
                    >
                      Panggil Sekarang
                    </a>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Nama Pasien / Inisial *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap pasien"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={formData.namaPasien}
                        onChange={(e) => setFormData({ ...formData, namaPasien: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Nomor Telepon / WhatsApp Keluarga *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={formData.noKontak}
                        onChange={(e) => setFormData({ ...formData, noKontak: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Alamat Lengkap Titik Penjemputan *</label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Jl. / RT-RW / Kelurahan / Kecamatan / Patokan Lokasi..."
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={formData.lokasiJemput}
                        onChange={(e) => setFormData({ ...formData, lokasiJemput: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Tingkat Kegawatan / Triase</label>
                      <select
                        className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={formData.kategoriKegawatan}
                        onChange={(e) => setFormData({ ...formData, kategoriKegawatan: e.target.value })}
                      >
                        <option value="Merah (Krisis Akut / Gaduh Gelisah)">🔴 Merah (Krisis Akut / Gaduh Gelisah / Berisiko)</option>
                        <option value="Kuning (Rujukan Medis / De-eskalasi)">🟡 Kuning (Rujukan Terjadwal / Butuh Bantuan Tim)</option>
                        <option value="Hijau (Pemulangan / Pasca Rawat Inap)">🟢 Hijau (Antar Pasien Pulang / Non-Kritis)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Catatan Gejala / Riwayat Singkat</label>
                      <input
                        type="text"
                        placeholder="Cth: Menolak minum obat 3 hari, insomnia berat"
                        className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                        value={formData.keteranganKondisi}
                        onChange={(e) => setFormData({ ...formData, keteranganKondisi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top border-opacity-10 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                      Batal
                    </button>
                    <button type="submit" className="btn btn-danger fw-semibold px-4 shadow-sm">
                      🚑 Ajukan Dispatch Ambulans &rarr;
                    </button>
                  </div>
                </form>
              ) : (
                /* STATUS DISPATCH SUKSES */
                <div className="animate-fade-in text-center py-2">
                  <div
                    className="p-4 rounded-4 shadow-sm mx-auto position-relative"
                    style={{
                      maxWidth: "520px",
                      backgroundColor: darkMode ? "#141829" : "#fff1f2",
                      border: "1px solid #fca5a5",
                    }}
                  >
                    <div className="badge badge-soft-danger px-3 py-1 rounded-pill mb-2">
                      🚨 PERMOHONAN AMBULANS DISETUJUI & OTW
                    </div>
                    <h5 className="fw-bold mb-1">UNIT AMBULANS SEDANG MELUNCUR</h5>
                    <small className="opacity-75 font-monospace">{dispatchSuccess.kodeLayanan}</small>

                    <hr className="my-3 opacity-25" />

                    <div className="row g-2 text-start small mb-3">
                      <div className="col-6">
                        <span className="opacity-75 d-block">Pasien:</span>
                        <strong>{dispatchSuccess.namaPasien}</strong>
                      </div>
                      <div className="col-6">
                        <span className="opacity-75 d-block">Estimasi Waktu Tiba (ETA):</span>
                        <strong className="text-danger fs-6">⏱️ {dispatchSuccess.eta}</strong>
                      </div>
                      <div className="col-6">
                        <span className="opacity-75 d-block">Armada Ditugaskan:</span>
                        <strong className="text-primary">{dispatchSuccess.unitDitugaskan}</strong>
                      </div>
                      <div className="col-6">
                        <span className="opacity-75 d-block">Tim Pendamping:</span>
                        <span>{dispatchSuccess.timMedis}</span>
                      </div>
                      <div className="col-12 mt-2">
                        <span className="opacity-75 d-block">Tujuan Penjemputan:</span>
                        <strong>📍 {dispatchSuccess.lokasiJemput}</strong>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-3 text-start small mb-3"
                      style={{ backgroundColor: darkMode ? "#0c101c" : "#ffffff", border: "1px solid #fed7aa" }}
                    >
                      <strong className="d-block text-warning mb-1">⚠️ Instruksi untuk Keluarga Pasien:</strong>
                      <ul className="mb-0 ps-3 opacity-75" style={{ fontSize: "0.76rem" }}>
                        <li>Jaga ketenangan di sekitar pasien, hindari memicu kemarahan/konfrontasi fisik.</li>
                        <li>Amankan benda tajam atau barang berbahaya dari jangkauan pasien.</li>
                        <li>Siapkan KTP/BPJS dan riwayat obat terakhir yang diminum pasien.</li>
                      </ul>
                    </div>

                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleReset}
                      >
                        Tutup
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm fw-semibold"
                        onClick={() => alert("Menghubungi Tim Medis Ambulans Unit 01 via Radio Komunikasi SIM-RS...")}
                      >
                        📞 Kontak Pengemudi Ambulans
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {activeTab === "armada" && (
              /* TAB STATUS ARMADA */
              <div className="animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Status Armada Ambulans Jiwa RSJ Tampan</h6>
                  <span className="badge badge-soft-success">Sistem GPS Terkoneksi</span>
                </div>

                <div className="row g-3">
                  {ambulanceFleet.map((amb) => (
                    <div key={amb.id} className="col-12">
                      <div
                        className="p-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
                        style={{
                          backgroundColor: darkMode ? "#141829" : "#f8fafc",
                          border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0",
                        }}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div className="fs-3 text-danger">🚐</div>
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h6 className="fw-bold mb-0">{amb.nama}</h6>
                              <span className={`badge ${amb.statusClass} small`}>{amb.status}</span>
                            </div>
                            <small className="opacity-75 d-block">📍 Posisi: {amb.posisi}</small>
                            <small className="opacity-50 d-block">👨‍✈️ Petugas: {amb.driver}</small>
                            <small className="text-muted d-block mt-1" style={{ fontSize: "0.72rem" }}>
                              <b>Fasilitas:</b> {amb.fasilitas}
                            </small>
                          </div>
                        </div>

                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => alert(`Posisi GPS ${amb.id}: Koordinat 0.4704° N, 101.3789° E (Aktif)`)}
                          >
                            📍 Cek Radar GPS
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "panduan" && (
              /* TAB PANDUAN PERTOLONGAN PERTAMA */
              <div className="animate-fade-in">
                <h6 className="fw-bold mb-3">📖 Panduan Penanganan Awal Kegawatdaruratan Jiwa di Rumah</h6>

                <div className="row g-3 small">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 h-100" style={{ backgroundColor: darkMode ? "#141829" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
                      <h6 className="fw-bold text-danger">1. Pasien Gaduh Gelisah / Mengamuk</h6>
                      <ul className="ps-3 mb-0 opacity-75">
                        <li>Jaga jarak aman minimal 2–3 meter dari pasien.</li>
                        <li>Gunakan nada bicara yang pelan, jelas, dan tidak bernada mengancam.</li>
                        <li>Jangan mengepung pasien beramai-ramai agar tidak memicu rasa panik/terancam.</li>
                        <li>Segera hubungi tim penjemputan darurat RSJ Tampan.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 rounded-3 h-100" style={{ backgroundColor: darkMode ? "#141829" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
                      <h6 className="fw-bold text-warning">2. Pasien Depresi Berat / Menolak Makan</h6>
                      <ul className="ps-3 mb-0 opacity-75">
                        <li>Dampingi pasien secara suportif tanpa menghakimi atau menyalahkan.</li>
                        <li>Singkirkan obat-obatan berlebih, benda tajam, atau cairan berbahaya.</li>
                        <li>Ajak bicara dari hati ke hati dan tawarkan konsultasi ke psikolog/psikiater.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
