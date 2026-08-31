import React, { useState } from "react";
import DoctorsModal from "./DoctorsModal";
import MentalHealthScreening from "../components/MentalHealthScreening";
import PublicMedAvailability from "../components/PublicMedAvailability";
import AppointmentBookingModal from "../components/AppointmentBookingModal";

export default function GuestPage({ setCurrentView, darkMode, cardBg }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState("layanan"); // 'layanan' | 'skrining' | 'ketersediaan' | 'ikm'
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="pb-5 animate-fade-in">
      {/* HERO SECTION - MODERN MINIMALIST */}
      <section
        className={`py-5 px-3 px-md-4 mb-4 border-bottom position-relative overflow-hidden ${
          darkMode ? "bg-black text-light" : "bg-white text-dark"
        }`}
        style={{
          borderColor: darkMode ? "#181d2e" : "#e2e8f0",
        }}
      >
        {/* Subtle Background Glow Accent */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative py-3" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 badge-soft-success">
                <span className="pulse-dot"></span>
                <span className="small fw-semibold">Rumah Sakit Jiwa Rujukan Utama Provinsi Riau</span>
              </div>

              <h1
                className="display-6 fw-bold mb-3"
                style={{
                  lineHeight: "1.25",
                  letterSpacing: "-0.03em",
                  color: darkMode ? "#ffffff" : "#0f172a",
                }}
              >
                Kesehatan Mental Terpadu, <br className="d-none d-md-block" />
                <span style={{ color: "#10b981" }}>Melayani dengan Empati & Profesionalisme</span>
              </h1>

              <p
                className="lead fs-6 mb-4"
                style={{
                  color: darkMode ? "#94a3b8" : "#64748b",
                  maxWidth: "540px",
                  lineHeight: "1.6",
                }}
              >
                Pusat perawatan kedokteran jiwa, klinik psikologi anak-dewasa, rehabilitasi medis NAPZA, dan sistem pemantauan logistik farmasi terintegrasi 24 jam.
              </p>

              {/* QUICK ACTION BUTTONS */}
              <div className="d-flex flex-wrap gap-2 pt-1">
                <button
                  className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => setShowBookingModal(true)}
                >
                  <span>🎟️ Reservasi Poliklinik Dokter</span>
                </button>
                <button
                  className="btn btn-outline-secondary px-3 py-2 fw-medium d-flex align-items-center gap-2"
                  onClick={() => setActiveFeatureTab("skrining")}
                >
                  <span>🧠 Skrining Mandiri Jiwa</span>
                </button>
                <button
                  className="btn btn-outline-success px-3 py-2 fw-medium"
                  onClick={() => setCurrentView("login")}
                >
                  🔐 Portal Petugas SIM-RS
                </button>
              </div>
            </div>

            {/* HIGHLIGHT STATS & EMERGENCY BOX */}
            <div className="col-lg-5">
              <div
                className="p-4 rounded-4 shadow-sm"
                style={{
                  backgroundColor: darkMode ? "#0c101a" : "#f8fafc",
                  border: darkMode ? "1px solid #1c2438" : "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">🏥</span>
                    <div>
                      <h6 className="fw-bold mb-0">RSJ Tampan Pekanbaru</h6>
                      <small className="opacity-75">Akreditasi Paripurna KARS</small>
                    </div>
                  </div>
                  <span className="badge badge-soft-success">24 Jam Siaga</span>
                </div>

                <div className="row g-2 mb-3 text-start small">
                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#141a29" : "#ffffff", border: darkMode ? "1px solid #1e273d" : "1px solid #e2e8f0" }}>
                      <span className="opacity-75 d-block" style={{ fontSize: "0.72rem" }}>Layanan IGD:</span>
                      <strong className="text-success">24 Jam Nonstop</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3" style={{ backgroundColor: darkMode ? "#141a29" : "#ffffff", border: darkMode ? "1px solid #1e273d" : "1px solid #e2e8f0" }}>
                      <span className="opacity-75 d-block" style={{ fontSize: "0.72rem" }}>Rawat Jalan:</span>
                      <strong>Senin &ndash; Sabtu</strong>
                    </div>
                  </div>
                </div>

                <div
                  className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: darkMode ? "rgba(244, 63, 94, 0.1)" : "#fff1f2",
                    border: "1px solid rgba(244, 63, 94, 0.25)",
                    color: "#f43f5e",
                  }}
                >
                  <div>
                    <small className="d-block fw-semibold" style={{ fontSize: "0.72rem" }}>
                      HOTLINE DARURAT / KONSULTASI KRISIS:
                    </small>
                    <strong className="fs-6">☎️ (0761) 63238 / 0812-3456-7890</strong>
                  </div>
                  <a
                    href="tel:076163238"
                    className="btn btn-sm btn-danger fw-semibold px-2 py-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Hubungi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTAINER FITUR UTAMA & TAB INTERAKTIF */}
      <div className="container">
        {/* STATISTIK MINIMALIS 4-KOLOM */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div
              className={`p-3 rounded-4 text-center shadow-sm clean-card ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <h3 className="fw-bold mb-0 text-success">250+</h3>
              <small className="opacity-75" style={{ fontSize: "0.76rem" }}>Kapasitas Tempat Tidur</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className={`p-3 rounded-4 text-center shadow-sm clean-card ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <h3 className="fw-bold mb-0 text-primary">18+</h3>
              <small className="opacity-75" style={{ fontSize: "0.76rem" }}>Dokter Spesialis & Psikolog</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className={`p-3 rounded-4 text-center shadow-sm clean-card ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <h3 className="fw-bold mb-0 text-warning">24/7</h3>
              <small className="opacity-75" style={{ fontSize: "0.76rem" }}>IGD Psikiatri & Farmasi</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className={`p-3 rounded-4 text-center shadow-sm clean-card ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <h3 className="fw-bold mb-0 text-info">94.8%</h3>
              <small className="opacity-75" style={{ fontSize: "0.76rem" }}>Indeks Kepuasan Pasien (IKM)</small>
            </div>
          </div>
        </div>

        {/* TAB SELECTOR FITUR UTAMA */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
          <button
            onClick={() => setActiveFeatureTab("layanan")}
            className={`btn rounded-pill px-3 py-2 fw-medium ${
              activeFeatureTab === "layanan"
                ? "btn-success shadow-sm"
                : "btn-outline-secondary"
            }`}
          >
            🏥 Layanan Unggulan
          </button>
          <button
            onClick={() => setActiveFeatureTab("skrining")}
            className={`btn rounded-pill px-3 py-2 fw-medium ${
              activeFeatureTab === "skrining"
                ? "btn-success shadow-sm"
                : "btn-outline-secondary"
            }`}
          >
            🧠 Skrining Mandiri Jiwa
          </button>
          <button
            onClick={() => setActiveFeatureTab("ketersediaan")}
            className={`btn rounded-pill px-3 py-2 fw-medium ${
              activeFeatureTab === "ketersediaan"
                ? "btn-success shadow-sm"
                : "btn-outline-secondary"
            }`}
          >
            💊 Cek Obat & Bed Publik
          </button>
          <button
            onClick={() => setActiveFeatureTab("ikm")}
            className={`btn rounded-pill px-3 py-2 fw-medium ${
              activeFeatureTab === "ikm"
                ? "btn-success shadow-sm"
                : "btn-outline-secondary"
            }`}
          >
            ⭐ Kepuasan Pasien (IKM)
          </button>
          <button
            onClick={() => setShowDoctorModal(true)}
            className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-medium"
          >
            👨‍⚕️ Jadwal Dokter (Sp.KJ)
          </button>
        </div>

        {/* KONTEN TAB: LAYANAN */}
        {activeFeatureTab === "layanan" && (
          <div className="animate-fade-in mb-5">
            <div className="row g-3">
              <div className="col-md-4">
                <div
                  className={`card h-100 p-4 rounded-4 shadow-sm clean-card ${cardBg}`}
                  style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
                >
                  <div
                    className="p-3 rounded-3 d-inline-flex align-items-center justify-content-center fs-3 mb-3 text-primary"
                    style={{ backgroundColor: "rgba(99, 102, 241, 0.12)", width: "52px", height: "52px" }}
                  >
                    🧠
                  </div>
                  <h5 className="fw-bold">Psikiatri & Tumbuh Kembang</h5>
                  <p className="small opacity-75 mb-3">
                    Konsultasi kesehatan jiwa dewasa, remaja, gangguan kecemasan, bipolar, depresi, hingga asesmen tumbuh kembang anak.
                  </p>
                  <button
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-start text-primary mt-auto"
                    onClick={() => setShowDoctorModal(true)}
                  >
                    Lihat Dokter &rarr;
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`card h-100 p-4 rounded-4 shadow-sm clean-card ${cardBg}`}
                  style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
                >
                  <div
                    className="p-3 rounded-3 d-inline-flex align-items-center justify-content-center fs-3 mb-3 text-success"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", width: "52px", height: "52px" }}
                  >
                    🗣️
                  </div>
                  <h5 className="fw-bold">Klinik Psikologi Terpadu</h5>
                  <p className="small opacity-75 mb-3">
                    Layanan psikotes, uji minat bakat, asesmen MMPI, psikoterapi kognitif (CBT), serta konseling keluarga dan pranikah.
                  </p>
                  <button
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-start text-success mt-auto"
                    onClick={() => setShowBookingModal(true)}
                  >
                    Daftar Konseling &rarr;
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`card h-100 p-4 rounded-4 shadow-sm clean-card ${cardBg}`}
                  style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
                >
                  <div
                    className="p-3 rounded-3 d-inline-flex align-items-center justify-content-center fs-3 mb-3 text-danger"
                    style={{ backgroundColor: "rgba(244, 63, 94, 0.12)", width: "52px", height: "52px" }}
                  >
                    🚑
                  </div>
                  <h5 className="fw-bold">Rehabilitasi Medis NAPZA</h5>
                  <p className="small opacity-75 mb-3">
                    Program detoksifikasi medis dan terapi sosial pemulihan adiksi zat adiktif dengan pendampingan dokter spesialis adiksi.
                  </p>
                  <button
                    className="btn btn-sm btn-link text-decoration-none fw-semibold p-0 text-start text-danger mt-auto"
                    onClick={() =>
                      alert("Alur Rawat Inap & Rehabilitasi NAPZA RSJ Tampan:\n1. Skrining Awal di IGD / Poli Adiksi\n2. Evaluasi Medis & Toksikologi\n3. Program Rawat Inap Komprehensif")
                    }
                  >
                    Alur Rehabilitasi &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KONTEN TAB: SKRINING */}
        {activeFeatureTab === "skrining" && (
          <div className="mb-5">
            <MentalHealthScreening
              darkMode={darkMode}
              cardBg={cardBg}
              onConsultClick={() => setShowBookingModal(true)}
            />
          </div>
        )}

        {/* KONTEN TAB: KETERSEDIAAN OBAT & BED */}
        {activeFeatureTab === "ketersediaan" && (
          <div className="mb-5">
            <PublicMedAvailability
              darkMode={darkMode}
              cardBg={cardBg}
            />
          </div>
        )}

        {/* KONTEN TAB: INDEKS KEPUASAN MASYARAKAT (IKM) */}
        {activeFeatureTab === "ikm" && (
          <div className="animate-fade-in mb-5">
            <div
              className={`p-4 rounded-4 shadow-sm border ${
                darkMode ? "bg-dark-card border-secondary border-opacity-25" : "bg-white"
              }`}
            >
              <div className="row align-items-center g-4 mb-4">
                <div className="col-lg-4 text-center border-end border-opacity-10">
                  <span className="badge badge-soft-success mb-2 px-3 py-1">Kemenkes RI Standar Mutu</span>
                  <h1 className="fw-bold display-4 text-success mb-0">94.8%</h1>
                  <h6 className="fw-bold mb-1">Mutu Pelayanan: Kategori A (Sangat Baik)</h6>
                  <small className="opacity-75">Survei Kepuasan Pasien Triwulan II 2026</small>
                </div>

                <div className="col-lg-8">
                  <h6 className="fw-bold mb-3">Indikator Penilaian Layanan:</h6>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Kecepatan & Kesiapan Depo Farmasi Obat Jiwa</span>
                      <strong className="text-success">96%</strong>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div className="progress-bar bg-success" style={{ width: "96%" }}></div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Keramahan & Empati Dokter Sp.KJ & Psikolog</span>
                      <strong className="text-primary">95%</strong>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div className="progress-bar bg-primary" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Kebersihan & Keamanan Bangsal Rawat Jiwa</span>
                      <strong className="text-info">94%</strong>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div className="progress-bar bg-info" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TESTIMONI PASIEN */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 rounded-3" style={{ backgroundColor: darkMode ? "#141828" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
                    <div className="text-warning mb-1">⭐⭐⭐⭐⭐</div>
                    <p className="small opacity-75 mb-2" style={{ lineHeight: "1.4" }}>
                      "Pelayanan dokter psikiatri sangat ramah dan mendengarkan keluhan dengan teliti. Pengambilan obat di apotek juga sangat cepat."
                    </p>
                    <small className="fw-semibold d-block">Ibu Suryani (Keluarga Pasien Rawat Jalan)</small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 rounded-3" style={{ backgroundColor: darkMode ? "#141828" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
                    <div className="text-warning mb-1">⭐⭐⭐⭐⭐</div>
                    <p className="small opacity-75 mb-2" style={{ lineHeight: "1.4" }}>
                      "Program rehabilitasi medis NAPZA di RSJ Tampan sangat membantu adik saya pulih kembali. Fasilitasnya sangat bersih dan aman."
                    </p>
                    <small className="fw-semibold d-block">Bpk. Rahmat Siregar</small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 rounded-3" style={{ backgroundColor: darkMode ? "#141828" : "#f8fafc", border: darkMode ? "1px solid #1e263d" : "1px solid #e2e8f0" }}>
                    <div className="text-warning mb-1">⭐⭐⭐⭐⭐</div>
                    <p className="small opacity-75 mb-2" style={{ lineHeight: "1.4" }}>
                      "Poli tumbuh kembang anak sangat membantu evaluasi anak kami. Sistem antrean digitalnya rapi dan tidak berdesakan."
                    </p>
                    <small className="fw-semibold d-block">dr. Fitriani (Pekanbaru)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDUKASI & LOKASI RSJ (BERSIH & TERORGANISIR) */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div
              className={`p-4 rounded-4 shadow-sm h-100 ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0">📰 Edukasi Kesehatan Jiwa RSJ Tampan</h5>
                <span className="badge badge-soft-secondary">Promkes RSJ</span>
              </div>

              <div className="border-bottom border-opacity-10 pb-3 mb-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge badge-soft-primary" style={{ fontSize: "0.68rem" }}>Edukasi Mental</span>
                  <small className="opacity-50">28 Agustus 2026</small>
                </div>
                <h6 className="fw-bold mb-1">Mengelola Stres & Mencegah Burnout di Era Digital</h6>
                <p className="small opacity-75 mb-0">
                  Praktik mindfulness, regulasi emosi, dan mengenali batasan diri saat beban pekerjaan menumpuk.
                </p>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge badge-soft-success" style={{ fontSize: "0.68rem" }}>Farmasi Terpadu</span>
                  <small className="opacity-50">24 Agustus 2026</small>
                </div>
                <h6 className="fw-bold mb-1">Pentingnya Kepatuhan Minum Obat Psikiatri Sesuai Resep</h6>
                <p className="small opacity-75 mb-0">
                  Panduan bagi keluarga dalam mendampingi terapi obat psikotropika secara aman dan efektif.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div
              className={`p-4 rounded-4 shadow-sm h-100 ${cardBg}`}
              style={{ border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0" }}
            >
              <h5 className="fw-bold mb-2">📍 Lokasi & Rujukan</h5>
              <p className="small opacity-75 mb-3">
                <b>RSJ Tampan Provinsi Riau</b><br />
                Jl. HR. Soebrantas Km. 12.5, Simpang Baru, Kec. Tampan, Kota Pekanbaru, Riau 28293.
              </p>

              <div className="rounded-3 overflow-hidden border mb-3 shadow-sm" style={{ height: "160px" }}>
                <iframe
                  title="Lokasi RSJ Tampan"
                  src="https://maps.google.com/maps?q=0.470439,101.378942&hl=id&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              <div className="d-flex justify-content-between align-items-center small">
                <span>IGD Darurat: <b className="text-danger">(0761) 63238</b></span>
                <a
                  href="https://maps.google.com/?q=RSJ+Tampan+Pekanbaru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Buka Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTORS SCHEDULE MODAL */}
      <DoctorsModal
        show={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        darkMode={darkMode}
        cardBg={cardBg}
      />

      {/* APPOINTMENT BOOKING MODAL */}
      <AppointmentBookingModal
        show={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        darkMode={darkMode}
      />
    </div>
  );
}
