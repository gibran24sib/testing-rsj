import React, { useState, useMemo } from "react";
import {
  initialEmployees,
  initialTrainings,
  sdmStats,
  doctorSchedules,
  orgStructureData,
  sdmFaqs,
} from "../data/sdmData";
import SdmRecruitmentModal from "../components/SdmRecruitmentModal";

export default function GuestPage({
  setCurrentView,
  darkMode,
  cardBg: _cardBg,
  activePortalTab: controlledPortalTab,
  setActivePortalTab: setControlledPortalTab,
}) {
  const [internalPortalTab, setInternalPortalTab] = useState("tenaga_medis");
  const activePortalTab = controlledPortalTab || internalPortalTab;
  const setActivePortalTab = setControlledPortalTab || setInternalPortalTab;

  // Search and filter in public doctor directory
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorCategory, setDoctorCategory] = useState("semua");

  // Filter in doctor schedule tab
  const [scheduleDayFilter, setScheduleDayFilter] = useState("semua");

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Recruitment modal state
  const [isRecruitmentModalOpen, setIsRecruitmentModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Doctors & Key Nakes for public view
  const allDoctors = useMemo(() => {
    return initialEmployees.filter(
      (e) => e.profesi.includes("Dokter") || e.profesi.includes("Psikolog") || e.profesi.includes("Apoteker")
    );
  }, []);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doc) => {
      const matchSearch =
        doc.nama.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        doc.profesi.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        doc.jabatan.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        doc.unitPenempatan.toLowerCase().includes(doctorSearch.toLowerCase());

      const matchCategory =
        doctorCategory === "semua" ||
        (doctorCategory === "dokter" && doc.profesi.includes("Dokter")) ||
        (doctorCategory === "psikolog" && doc.profesi.includes("Psikolog")) ||
        (doctorCategory === "farmasi" && doc.profesi.includes("Apoteker"));

      return matchSearch && matchCategory;
    });
  }, [allDoctors, doctorSearch, doctorCategory]);

  // Filtered doctor schedules
  const filteredSchedules = useMemo(() => {
    if (scheduleDayFilter === "semua") return doctorSchedules;
    return doctorSchedules.filter((sch) => sch.hari.includes(scheduleDayFilter));
  }, [scheduleDayFilter]);

  const handleOpenRecruitment = (job) => {
    setSelectedJob(job);
    setIsRecruitmentModalOpen(true);
  };

  const textPrimary = darkMode ? "#f8fafc" : "#0f172a";
  const textSecondary = darkMode ? "#cbd5e1" : "#475569";
  const textMutedColor = darkMode ? "#94a3b8" : "#64748b";
  const cardSurfaceBg = darkMode ? "#141a2c" : "#ffffff";
  const cardBorderColor = darkMode ? "#222c45" : "#e2e8f0";

  return (
    <div className="pb-5 animate-fade-in">
      {/* HERO SECTION */}
      <section
        className="py-5 px-3 px-md-4 mb-4 border-bottom position-relative overflow-hidden"
        style={{
          backgroundColor: darkMode ? "#07090e" : "#ffffff",
          color: textPrimary,
          borderColor: darkMode ? "#1c2338" : "#e2e8f0",
        }}
      >
        {/* Glow Accent 1 */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        {/* Glow Accent 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-50px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative py-3" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 badge-soft-success shimmer-badge">
                <span className="pulse-dot"></span>
                <span className="small fw-semibold">Portal Informasi SDM & Kepegawaian RSJ Tampan Riau</span>
              </div>

              <h1
                className="display-6 fw-bold mb-3"
                style={{
                  lineHeight: "1.25",
                  letterSpacing: "-0.03em",
                  color: textPrimary,
                }}
              >
                Ketenagaan Profesional, <br className="d-none d-md-block" />
                <span style={{ color: "#10b981" }}>Pelayanan Kesehatan Jiwa Berkualitas</span>
              </h1>

              <p
                className="lead fs-6 mb-4"
                style={{
                  color: textSecondary,
                  maxWidth: "560px",
                  lineHeight: "1.6",
                }}
              >
                Pusat data kepegawaian terpadu, jadwal praktik dokter spesialis kedokteran jiwa, perawat jiwa bersertifikasi KARS, rekrutmen formasi nakes, dan layanan kepegawaian RSJ Tampan Provinsi Riau.
              </p>

              {/* QUICK ACTION BUTTONS */}
              <div className="d-flex flex-wrap gap-2 pt-1">
                <button
                  className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm hover-lift active-glow"
                  onClick={() => setCurrentView("login")}
                >
                  <span>🔐 Masuk Portal SIM-SDM</span>
                </button>
                <button
                  className="btn px-3 py-2 fw-medium d-flex align-items-center gap-2 border hover-lift"
                  style={{
                    backgroundColor: darkMode ? "rgba(22, 28, 45, 0.8)" : "rgba(248, 250, 252, 0.9)",
                    color: textPrimary,
                    borderColor: cardBorderColor,
                  }}
                  onClick={() => setActivePortalTab("jadwal_dokter")}
                >
                  <span>📅 Jadwal Praktik Dokter</span>
                </button>
                <button
                  className="btn px-3 py-2 fw-medium d-flex align-items-center gap-2 border hover-lift"
                  style={{
                    backgroundColor: darkMode ? "rgba(22, 28, 45, 0.8)" : "rgba(248, 250, 252, 0.9)",
                    color: textPrimary,
                    borderColor: cardBorderColor,
                  }}
                  onClick={() => setActivePortalTab("rekrutmen")}
                >
                  <span>📢 Lowongan Nakes 2026</span>
                </button>
              </div>
            </div>

            {/* HERO STATS OVERVIEW */}
            <div className="col-lg-5">
              <div
                className={`p-4 rounded-4 shadow-sm border ${
                  darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
                style={{
                  borderColor: cardBorderColor,
                }}
              >
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                  <span>📊</span> Profil Ketenagaan SDM RSJ Tampan
                </h6>

                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className="p-3 rounded-3 border hover-lift"
                      style={{
                        backgroundColor: cardSurfaceBg,
                        borderColor: cardBorderColor,
                      }}
                    >
                      <span className="small fw-semibold d-block mb-1" style={{ color: textSecondary }}>
                        Total SDM RSJ
                      </span>
                      <h3 className="fw-bold mb-1 text-success">{sdmStats.totalPegawai}</h3>
                      <small className="d-block" style={{ fontSize: "0.75rem", color: textMutedColor }}>
                        Pegawai ASN & BLUD
                      </small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div
                      className="p-3 rounded-3 border hover-lift"
                      style={{
                        backgroundColor: cardSurfaceBg,
                        borderColor: cardBorderColor,
                      }}
                    >
                      <span className="small fw-semibold d-block mb-1" style={{ color: textSecondary }}>
                        Ners & Perawat Jiwa
                      </span>
                      <h3 className="fw-bold mb-1 text-primary">{sdmStats.tenagaKeperawatan}</h3>
                      <small className="d-block" style={{ fontSize: "0.75rem", color: textMutedColor }}>
                        Bersertifikasi Asuhan Jiwa
                      </small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div
                      className="p-3 rounded-3 border hover-lift"
                      style={{
                        backgroundColor: cardSurfaceBg,
                        borderColor: cardBorderColor,
                      }}
                    >
                      <span className="small fw-semibold d-block mb-1" style={{ color: textSecondary }}>
                        Dokter & Psikolog
                      </span>
                      <h3 className="fw-bold mb-1 text-info">{sdmStats.tenagaMedis}</h3>
                      <small className="d-block" style={{ fontSize: "0.75rem", color: textMutedColor }}>
                        Sp.KJ & Subspesialis
                      </small>
                    </div>
                  </div>

                  <div className="col-6">
                    <div
                      className="p-3 rounded-3 border hover-lift"
                      style={{
                        backgroundColor: cardSurfaceBg,
                        borderColor: cardBorderColor,
                      }}
                    >
                      <span className="small fw-semibold d-block mb-1" style={{ color: textSecondary }}>
                        Tingkat Presensi
                      </span>
                      <h3 className="fw-bold mb-1 text-warning">{sdmStats.tingkatKehadiranBulanIni}%</h3>
                      <small className="d-block" style={{ fontSize: "0.75rem", color: textMutedColor }}>
                        Disiplin Shift 24/7
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL FEATURES TABS */}
      <div className="container">
        {/* NAV PILLS */}
        <div
          className={`d-flex flex-wrap gap-2 p-2 rounded-4 mb-4 border shadow-sm ${
            darkMode ? "glass-panel-dark" : "glass-panel"
          }`}
          style={{
            borderColor: cardBorderColor,
          }}
        >
          {[
            { id: "tenaga_medis", label: "Profil Tenaga Medis", icon: "👨‍⚕️" },
            { id: "jadwal_dokter", label: "Jadwal Praktik Poliklinik", icon: "📅", badge: "Live" },
            { id: "rekrutmen", label: "Rekrutmen & Formasi Nakes", icon: "📢", badge: "2026" },
            { id: "diklat", label: "Diklat & Kredensialing", icon: "🎓" },
            { id: "organisasi", label: "Struktur Organisasi SDM", icon: "🏛️" },
            { id: "layanan_sdm", label: "Panduan & FAQ Layanan", icon: "📋" },
            { id: "tentang_kami", label: "Tentang RSJ & Logo", icon: "🏥", badge: "Profil" },
          ].map((tab) => {
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all ${
                  isActive ? "btn-success fw-bold active-glow" : "hover-lift"
                }`}
                style={{
                  backgroundColor: isActive ? "#10b981" : darkMode ? "rgba(28, 35, 56, 0.7)" : "rgba(241, 245, 249, 0.85)",
                  color: isActive ? "#ffffff" : darkMode ? "#e2e8f0" : "#334155",
                  fontSize: "0.83rem",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: "0.65rem",
                      backgroundColor: isActive ? "rgba(255,255,255,0.25)" : darkMode ? "#2b3754" : "#e2e8f0",
                      color: isActive ? "#ffffff" : darkMode ? "#94a3b8" : "#475569",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFIL DOKTER & TENAGA MEDIS */}
        {activePortalTab === "tenaga_medis" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  👨‍⚕️ Dokter Spesialis Kedokteran Jiwa & Tenaga Medis RSJ Tampan
                </h5>
                <p className="small mb-0" style={{ color: textSecondary }}>
                  Tenaga ahli kejiwaan terakreditasi melayani poliklinik rawat jalan, bangsal rawat inap, dan krisis NAPZA
                </p>
              </div>
              <span className="badge bg-success rounded-pill px-3 py-2">
                ✅ Terdaftar Resmi di Kemenkes RI & HIMPSI
              </span>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="row g-2 mb-4">
              <div className="col-12 col-md-8">
                <input
                  type="text"
                  className={`form-control form-control-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                  placeholder="Cari nama dokter, subspesialisasi, atau unit layanan..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <select
                  className={`form-select form-select-sm ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                  value={doctorCategory}
                  onChange={(e) => setDoctorCategory(e.target.value)}
                >
                  <option value="semua">Semua Kategori Tenaga Medis</option>
                  <option value="dokter">Dokter Spesialis Jiwa (Sp.KJ)</option>
                  <option value="psikolog">Psikolog Klinis</option>
                  <option value="farmasi">Apoteker Farmasi Jiwa</option>
                </select>
              </div>
            </div>

            <div className="row g-4">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-3 rounded-3 h-100 border d-flex flex-column justify-content-between transition-all"
                    style={{
                      backgroundColor: cardSurfaceBg,
                      borderColor: cardBorderColor,
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={doc.foto}
                          alt={doc.nama}
                          className="rounded-circle shadow-sm"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                            border: "2px solid #10b981",
                          }}
                        />
                        <div>
                          <h6 className="fw-bold mb-0" style={{ fontSize: "0.95rem", color: textPrimary }}>
                            {doc.nama}
                          </h6>
                          <small className="text-success fw-medium d-block">
                            {doc.profesi}
                          </small>
                          <span className="badge bg-primary rounded-pill px-2 py-0" style={{ fontSize: "0.68rem" }}>
                            {doc.statusKepegawaian}
                          </span>
                        </div>
                      </div>

                      <ul className="list-unstyled small d-flex flex-column gap-1 mb-3" style={{ color: textSecondary }}>
                        <li>
                          <strong style={{ color: textPrimary }}>Subspesialisasi:</strong> {doc.jabatan}
                        </li>
                        <li>
                          <strong style={{ color: textPrimary }}>Unit Layanan:</strong> {doc.unitPenempatan}
                        </li>
                        <li>
                          <strong style={{ color: textPrimary }}>Pendidikan:</strong> {doc.pendidikan}
                        </li>
                        <li>
                          <strong style={{ color: textPrimary }}>No. STR / SIP:</strong> {doc.sip?.nomor || "-"}
                        </li>
                      </ul>
                    </div>

                    <div
                      className="p-2 rounded-2 d-flex align-items-center justify-content-between border"
                      style={{
                        backgroundColor: darkMode ? "#1a2238" : "#ecfdf5",
                        borderColor: darkMode ? "#2a375a" : "#d1fae5",
                        fontSize: "0.78rem",
                      }}
                    >
                      <span style={{ color: textSecondary }}>Legalitas Izin:</span>
                      <strong className="text-success">✅ SIP Aktif Kemenkes</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: JADWAL PRAKTIK POLIKLINIK (NEW) */}
        {activePortalTab === "jadwal_dokter" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  📅 Jadwal Praktik Poliklinik Rawat Jalan Spesialis Jiwa
                </h5>
                <p className="small mb-0" style={{ color: textSecondary }}>
                  Informasi jam buka poliklinik psikiatri, konsultasi psikologi, dan layanan rehabilitasi adiksi NAPZA
                </p>
              </div>
              {/* DAY FILTER PILLS */}
              <div className="d-flex flex-wrap gap-1">
                {["semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setScheduleDayFilter(day)}
                    className={`btn btn-sm px-2 py-1 rounded-pill ${
                      scheduleDayFilter === day ? "btn-success fw-bold" : "btn-outline-secondary"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {day === "semua" ? "Semua Hari" : day}
                  </button>
                ))}
              </div>
            </div>

            <div className="row g-3">
              {filteredSchedules.map((sch) => (
                <div key={sch.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-3 rounded-3 h-100 border d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: cardSurfaceBg,
                      borderColor: cardBorderColor,
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={sch.foto}
                          alt={sch.nama}
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px", objectFit: "cover", border: "2px solid #10b981" }}
                        />
                        <div>
                          <h6 className="fw-bold mb-0" style={{ fontSize: "0.92rem", color: textPrimary }}>
                            {sch.nama}
                          </h6>
                          <small className="text-success fw-semibold d-block">{sch.profesi}</small>
                          <span className="badge bg-secondary" style={{ fontSize: "0.65rem" }}>
                            {sch.ruangan}
                          </span>
                        </div>
                      </div>

                      <div
                        className="p-2 rounded-2 mb-2"
                        style={{
                          backgroundColor: darkMode ? "#161e36" : "#f1f5f9",
                          fontSize: "0.78rem",
                        }}
                      >
                        <div className="fw-semibold text-primary mb-1">{sch.poliklinik}</div>
                        <div className="d-flex justify-content-between text-muted">
                          <span>Hari Praktik:</span>
                          <strong className="text-reset">{sch.hari.join(", ")}</strong>
                        </div>
                        <div className="d-flex justify-content-between text-muted">
                          <span>Jam Praktik:</span>
                          <strong className="text-success">{sch.jamMulai} - {sch.jamSelesai} WIB</strong>
                        </div>
                        <div className="d-flex justify-content-between text-muted">
                          <span>Kuota Pasien:</span>
                          <strong>{sch.kuotaHarian} Pasien/Hari</strong>
                        </div>
                      </div>

                      <p className="small mb-0 text-muted" style={{ fontSize: "0.74rem" }}>
                        <strong>Layanan Unggulan:</strong> {sch.layananKhusus}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="badge bg-success-subtle text-success">
                        ● Poliklinik Buka
                      </span>
                      <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                        Loket Pendaftaran: 07:30 - 11:30 WIB
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REKRUTMEN & FORMASI */}
        {activePortalTab === "rekrutmen" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  📢 Pengumuman Rekrutmen & Formasi Nakes Jiwa RSJ Tampan
                </h5>
                <p className="small mb-0" style={{ color: textSecondary }}>
                  Informasi penerimaan Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) & Pegawai Tetap BLUD Tahun 2026
                </p>
              </div>
              <span className="badge bg-primary rounded-pill px-3 py-2">Tahun Anggaran 2026</span>
            </div>

            <div className="row g-3">
              {[
                {
                  posisi: "Perawat Spesialis Keperawatan Jiwa (Sp.Kep.J)",
                  kuota: "4 Formasi",
                  kualifikasi: "Ners + Spesialis Keperawatan Jiwa / STR Aktif",
                  tenggat: "25 September 2026",
                  status: "Pendaftaran Dibuka",
                },
                {
                  posisi: "Dokter Spesialis Kedokteran Jiwa (Sp.KJ)",
                  kuota: "2 Formasi",
                  kualifikasi: "Dokter Spesialis Psikiatri / STR KKI Aktif",
                  tenggat: "30 September 2026",
                  status: "Pendaftaran Dibuka",
                },
                {
                  posisi: "Petugas Tim De-eskalasi & Pengamanan Krisis",
                  kuota: "6 Formasi",
                  kualifikasi: "SMA/SMK Sederajat / Sertifikat Gada Pratama & Pelatihan Fisik",
                  tenggat: "15 September 2026",
                  status: "Pendaftaran Dibuka",
                },
                {
                  posisi: "Fisioterapis & Terapis Okupasi Jiwa",
                  kuota: "3 Formasi",
                  kualifikasi: "D4/S1 Terapi Okupasi / STR Aktif",
                  tenggat: "20 September 2026",
                  status: "Segera Dibuka",
                },
              ].map((job, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <div
                    className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: cardSurfaceBg,
                      borderColor: cardBorderColor,
                    }}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-success-subtle text-success fw-bold">{job.kuota}</span>
                        <span className="badge bg-warning text-dark">{job.status}</span>
                      </div>
                      <h6 className="fw-bold mb-1" style={{ color: textPrimary }}>{job.posisi}</h6>
                      <p className="small mb-2" style={{ color: textSecondary }}>
                        <strong style={{ color: textPrimary }}>Persyaratan:</strong> {job.kualifikasi}
                      </p>
                      <small className="d-block" style={{ color: textMutedColor }}>
                        📅 Batas Pengiriman Berkas: <strong style={{ color: textSecondary }}>{job.tenggat}</strong>
                      </small>
                    </div>

                    <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                      <span className="small" style={{ color: textMutedColor }}>Subbag SDM RSJ</span>
                      <button
                        className="btn btn-sm btn-success fw-semibold d-flex align-items-center gap-1 shadow-sm"
                        onClick={() => handleOpenRecruitment(job)}
                      >
                        <span>📝</span>
                        <span>Lamar Formasi Ini</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROGRAM DIKLAT */}
        {activePortalTab === "diklat" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  🎓 Kalender Pelatihan & Workshop Kejiwaan RSJ Tampan
                </h5>
                <p className="small mb-0" style={{ color: textSecondary }}>
                  Pengembangan kompetensi berkelanjutan (CPD) nakes kejiwaan ber-SKP resmi Kemenkes & PPNI
                </p>
              </div>
            </div>

            <div className="row g-3">
              {initialTrainings.map((trn) => (
                <div key={trn.id} className="col-12 col-md-6">
                  <div
                    className="p-3 rounded-3 border h-100"
                    style={{
                      backgroundColor: cardSurfaceBg,
                      borderColor: cardBorderColor,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-info-subtle text-info fw-semibold">{trn.kategori}</span>
                      <span className="badge bg-success rounded-pill">{trn.status}</span>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: textPrimary }}>{trn.namaPelatihan}</h6>
                    <ul className="list-unstyled small mb-3 d-flex flex-column gap-1" style={{ color: textSecondary }}>
                      <li>
                        <strong style={{ color: textPrimary }}>Penyelenggara:</strong> {trn.penyelenggara}
                      </li>
                      <li>
                        <strong style={{ color: textPrimary }}>Target Profesi:</strong> {trn.targetProfesi}
                      </li>
                      <li>
                        <strong style={{ color: textPrimary }}>Jadwal:</strong> {trn.jadwalMulai} s/d {trn.jadwalSelesai}
                      </li>
                      <li>
                        <strong style={{ color: textPrimary }}>Akreditasi:</strong> {trn.standarAkreditasi}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STRUKTUR ORGANISASI SDM (NEW) */}
        {activePortalTab === "organisasi" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="mb-4">
              <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                🏛️ Bagan Struktur Organisasi Bidang SDM & Komite Nakes
              </h5>
              <p className="small mb-0" style={{ color: textSecondary }}>
                Hierarki kepemimpinan pengelolaan kepegawaian, komite medik, dan komite keperawatan RSJ Tampan
              </p>
            </div>

            <div className="row g-3">
              {orgStructureData.map((org, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: cardSurfaceBg,
                      borderColor: cardBorderColor,
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fs-4">{org.icon}</span>
                        <span className="badge bg-secondary" style={{ fontSize: "0.68rem" }}>
                          Level {org.level} &bull; {org.unit}
                        </span>
                      </div>
                      <h6 className="fw-bold text-success mb-1" style={{ fontSize: "0.9rem" }}>
                        {org.jabatan}
                      </h6>
                      <h6 className="fw-bold mb-1" style={{ color: textPrimary, fontSize: "0.95rem" }}>
                        {org.nama}
                      </h6>
                      <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                        NIP: {org.nip}
                      </small>
                    </div>

                    <div className="pt-2 mt-2 border-top d-flex justify-content-between align-items-center">
                      <span className="small text-muted" style={{ fontSize: "0.72rem" }}>SK Direktur RSJ Tampan</span>
                      <span className="badge bg-success-subtle text-success">Aktif Menjabat</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PANDUAN LAYANAN SDM & FAQ (ENHANCED) */}
        {activePortalTab === "layanan_sdm" && (
          <div
            className="p-4 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>
              📋 Panduan Prosedur Standar & FAQ Kepegawaian RSJ Tampan
            </h5>

            {/* SOP CARDS */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div
                  className="p-3 rounded-3 border h-100"
                  style={{
                    backgroundColor: cardSurfaceBg,
                    borderColor: cardBorderColor,
                  }}
                >
                  <h6 className="fw-bold text-success mb-2">🏖️ Tata Cara Pengajuan Cuti ASN & BLUD</h6>
                  <ol className="small ps-3 mb-3 d-flex flex-column gap-1" style={{ color: textSecondary }}>
                    <li>Pengajuan dilakukan H-3 sebelum tanggal cuti melalui sistem SIM-SDM.</li>
                    <li>Wajib menunjuk petugas pengganti (<em>handover</em>) demi keamanan bangsal jiwa.</li>
                    <li>Persetujuan berjenjang: Kepala Ruangan &bull; Kasubbag Kepegawaian.</li>
                    <li>Sisa kuota cuti tahunan maksimal 12 hari kerja per tahun.</li>
                  </ol>
                  <button
                    className="btn btn-sm btn-outline-success fw-semibold w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setCurrentView("cuti_pegawai")}
                  >
                    <span>🏖️</span>
                    <span>Buka Portal Pengajuan Cuti Nakes &rarr;</span>
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="p-3 rounded-3 border h-100"
                  style={{
                    backgroundColor: cardSurfaceBg,
                    borderColor: cardBorderColor,
                  }}
                >
                  <h6 className="fw-bold text-primary mb-2">📜 Kewajiban STR & Rekredensialing</h6>
                  <ol className="small ps-3 mb-0 d-flex flex-column gap-1" style={{ color: textSecondary }}>
                    <li>Seluruh nakes wajib memperbarui STR 3 bulan sebelum masa berlaku habis.</li>
                    <li>Pengajuan SIP Dinkes didukung oleh rekomendasi Direktur RSJ Tampan.</li>
                    <li>Pelaksanaan audit kredensialing oleh Komite Medik & Komite Keperawatan.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* FAQ ACCORDION */}
            <div className="mt-4 pt-3 border-top" style={{ borderColor: cardBorderColor }}>
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: textPrimary }}>
                <span>❓</span> Tanya Jawab Seputar Layanan SDM & Magang / PKL
              </h6>

              <div className="d-flex flex-column gap-2">
                {sdmFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-3 border overflow-hidden"
                      style={{
                        backgroundColor: cardSurfaceBg,
                        borderColor: cardBorderColor,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="btn w-100 text-start p-3 d-flex align-items-center justify-content-between border-0"
                        style={{
                          backgroundColor: isOpen ? (darkMode ? "#182035" : "#f1f5f9") : "transparent",
                          color: textPrimary,
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "0.68rem" }}>
                            {faq.kategori}
                          </span>
                          <span className="fw-semibold small">{faq.tanya}</span>
                        </div>
                        <span>{isOpen ? "▲" : "▼"}</span>
                      </button>

                      {isOpen && (
                        <div className="p-3 border-top small" style={{ borderColor: cardBorderColor, color: textSecondary, lineHeight: "1.6" }}>
                          {faq.jawab}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TENTANG KAMI, LOGO & MOTTO RESMI RSJ TAMPAN */}
        {activePortalTab === "tentang_kami" && (
          <div
            className="p-4 p-md-5 rounded-4 border shadow-sm animate-fade-in"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            {/* HEADER LOGO & PROFIL */}
            <div className="row align-items-center g-4 mb-5 pb-4 border-bottom" style={{ borderColor: cardBorderColor }}>
              <div className="col-md-4 text-center">
                <div
                  className="p-4 rounded-4 d-inline-block shadow-sm mb-3"
                  style={{
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
                    border: `1px solid ${cardBorderColor}`,
                  }}
                >
                  <img
                    src="/logo-rsj.png"
                    alt="Logo Resmi RS Jiwa Tampan Provinsi Riau"
                    className="img-fluid animate-float"
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://rsjiwatampan.riau.go.id/landing/images/Logo.png";
                    }}
                  />
                </div>
                <div className="badge bg-success-subtle text-success px-3 py-2 rounded-pill d-block mx-auto" style={{ maxWidth: "220px" }}>
                  ⭐ Bintang 5 Paripurna KARS
                </div>
              </div>

              <div className="col-md-8">
                <span className="badge bg-primary-subtle text-primary mb-2">Profil Resmi Rumah Sakit</span>
                <h3 className="fw-bold mb-2" style={{ color: textPrimary }}>
                  Rumah Sakit Jiwa Tampan Provinsi Riau
                </h3>
                <p className="lead fs-6 mb-3 text-success fw-semibold">
                  "Melayani Dengan Sepenuh Hati" &bull; RS Jiwa Kelas A Rujukan Regional
                </p>
                <p className="small mb-3" style={{ color: textSecondary, lineHeight: "1.7" }}>
                  Rumah Sakit Jiwa Tampan Provinsi Riau dibangun pada tahun 1980 dan mulai beroperasi tanggal 5 Juli 1984, diresmikan pada 21 Maret 1987 oleh Menteri Kesehatan RI (dr. Soewardjono Soerjaningrat). Merupakan rumah sakit rujukan utama pelayanan kesehatan jiwa dan penapisan adiksi narkoba bagi masyarakat Riau dan Kepulauan Riau dengan status Pola Pengelolaan Keuangan Badan Layanan Umum Daerah (PPK-BLUD).
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <a
                    href="https://rsjiwatampan.riau.go.id/profil/tentang-kami"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 hover-lift"
                  >
                    <span>🌐</span>
                    <span>Kunjungi Website Resmi rsjiwatampan.riau.go.id &rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ARTI LAMBANG & MAKNA LOGO */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div
                  className="p-4 rounded-4 border h-100"
                  style={{
                    backgroundColor: cardSurfaceBg,
                    borderColor: cardBorderColor,
                  }}
                >
                  <h5 className="fw-bold mb-3 text-success d-flex align-items-center gap-2">
                    <span>🍃</span>
                    <span>Makna & Filosofi Logo RSJ Tampan</span>
                  </h5>
                  <ul className="list-unstyled d-flex flex-column gap-3 small mb-0" style={{ color: textSecondary, lineHeight: "1.6" }}>
                    <li className="d-flex gap-3">
                      <span className="fs-5">💚</span>
                      <div>
                        <strong style={{ color: textPrimary }}>Daun Hijau Berbentuk Hati:</strong> Wadah yang menyejukkan atau memberikan kasih sayang dan keteduhan yang selalu hidup dan tumbuh berkembang dengan semangat energi segar.
                      </div>
                    </li>
                    <li className="d-flex gap-3">
                      <span className="fs-5">🙌</span>
                      <div>
                        <strong style={{ color: textPrimary }}>Gambar Orang Besar dan Kecil Tangan ke Atas:</strong> Mengartikan setiap orang dewasa maupun anak-anak dapat mengalami masalah kejiwaan yang memerlukan kebebasan, perlakuan yang setara, serta wajib kita lindungi dan kasihi bersama.
                      </div>
                    </li>
                    <li className="d-flex gap-3">
                      <span className="fs-5">🎨</span>
                      <div>
                        <strong style={{ color: textPrimary }}>Warna Kuning, Hijau, dan Merah:</strong> Representasi warna-warna sakral dan dominan adat budaya Melayu Riau.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* NILAI-NILAI BUDAYA KERJA KEJIWAAN */}
              <div className="col-lg-6">
                <div
                  className="p-4 rounded-4 border h-100"
                  style={{
                    backgroundColor: cardSurfaceBg,
                    borderColor: cardBorderColor,
                  }}
                >
                  <h5 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                    <span>💎</span>
                    <span>Tata Nilai Budaya Kerja "KEJIWAAN"</span>
                  </h5>
                  <div className="row g-2">
                    {[
                      { huruf: "K", judul: "Kekerabatan", desc: "Membangun hubungan kekeluargaan yang erat dengan pasien dan rekan kerja." },
                      { huruf: "E", judul: "Empati", desc: "Memahami dan merasakan kebutuhan batiniah pasien asuhan jiwa." },
                      { huruf: "J", judul: "Jujur", desc: "Integritas tinggi dalam rekam medis, asuhan klinis, dan logistik." },
                      { huruf: "I", judul: "Ibadah", desc: "Melaksanakan tugas pelayanan medis sebagai ladang pengabdian ibadah." },
                      { huruf: "W", judul: "Wirausaha", desc: "Inovatif, adaptif terhadap kemajuan teknologi kesehatan modern." },
                      { huruf: "A", judul: "Amanah", desc: "Menjaga kerahasiaan data medis dan kepercayaan publik secara profesional." },
                      { huruf: "A", judul: "Adil", desc: "Memberikan perlakuan medis setara tanpa diskriminasi kepada seluruh pasien." },
                      { huruf: "N", judul: "Nurani", desc: "Bekerja dengan keikhlasan hati nurani demi kesembuhan jiwa raga pasien." },
                    ].map((val, vIdx) => (
                      <div key={vIdx} className="col-6">
                        <div
                          className="p-2 rounded-3 border d-flex align-items-start gap-2 h-100"
                          style={{
                            backgroundColor: darkMode ? "#182035" : "#f8fafc",
                            borderColor: cardBorderColor,
                          }}
                        >
                          <span className="badge bg-success fw-bold fs-6 px-2">{val.huruf}</span>
                          <div>
                            <strong className="d-block small" style={{ color: textPrimary }}>{val.judul}</strong>
                            <small className="text-muted d-block" style={{ fontSize: "0.7rem", lineHeight: "1.3" }}>{val.desc}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECRUITMENT MODAL */}
      <SdmRecruitmentModal
        isOpen={isRecruitmentModalOpen}
        onClose={() => setIsRecruitmentModalOpen(false)}
        job={selectedJob}
        darkMode={darkMode}
      />
    </div>
  );
}
