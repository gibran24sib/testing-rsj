import React, { useState } from "react";
import { initialEmployees, initialTrainings, sdmStats } from "../data/sdmData";

export default function GuestPage({
  setCurrentView,
  darkMode,
  cardBg,
  activePortalTab: controlledPortalTab,
  setActivePortalTab: setControlledPortalTab,
}) {
  const [internalPortalTab, setInternalPortalTab] = useState("tenaga_medis");
  const activePortalTab = controlledPortalTab || internalPortalTab;
  const setActivePortalTab = setControlledPortalTab || setInternalPortalTab;

  // Doctors & Key Nakes for public view
  const doctorsList = initialEmployees.filter(
    (e) => e.profesi.includes("Dokter") || e.profesi.includes("Psikolog")
  );

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
          backgroundColor: darkMode ? "#080a10" : "#ffffff",
          color: textPrimary,
          borderColor: darkMode ? "#1c2338" : "#e2e8f0",
        }}
      >
        {/* Glow Accent */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative py-3" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 badge-soft-success">
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
                Pusat data kepegawaian terpadu, informasi profil dokter spesialis kedokteran jiwa, perawat jiwa kompeten, jadwal dinas 24/7, dan pelatihan kredensialing penanganan krisis kejiwaan.
              </p>

              {/* QUICK ACTION BUTTONS */}
              <div className="d-flex flex-wrap gap-2 pt-1">
                <button
                  className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => setCurrentView("login")}
                >
                  <span>🔐 Masuk Portal SIM-SDM</span>
                </button>
                <button
                  className="btn px-3 py-2 fw-medium d-flex align-items-center gap-2 border"
                  style={{
                    backgroundColor: darkMode ? "#161c2d" : "#f8fafc",
                    color: textPrimary,
                    borderColor: cardBorderColor,
                  }}
                  onClick={() => setActivePortalTab("tenaga_medis")}
                >
                  <span>👨‍⚕️ Direktori Tenaga Medis</span>
                </button>
              </div>
            </div>

            {/* HERO STATS OVERVIEW */}
            <div className="col-lg-5">
              <div
                className="p-4 rounded-4 shadow-sm border"
                style={{
                  backgroundColor: darkMode ? "#0f1424" : "#f8fafc",
                  borderColor: cardBorderColor,
                }}
              >
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                  <span>📊</span> Profil Ketenagaan SDM
                </h6>

                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className="p-3 rounded-3 border"
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
                      className="p-3 rounded-3 border"
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
                      className="p-3 rounded-3 border"
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
                      className="p-3 rounded-3 border"
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
          className="d-flex flex-wrap gap-2 p-2 rounded-4 mb-4 border shadow-sm"
          style={{
            backgroundColor: darkMode ? "#111624" : "#ffffff",
            borderColor: cardBorderColor,
          }}
        >
          {[
            { id: "tenaga_medis", label: "Profil Tenaga Medis & Dokter", icon: "👨‍⚕️" },
            { id: "rekrutmen", label: "Informasi Rekrutmen & Formasi Nakes", icon: "📢" },
            { id: "diklat", label: "Program Diklat & Kredensialing Jiwa", icon: "🎓" },
            { id: "layanan_sdm", label: "Panduan Layanan Kepegawaian", icon: "📋" },
          ].map((tab) => {
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 transition-all ${
                  isActive ? "btn-success fw-bold shadow-sm" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "#10b981" : darkMode ? "#1c2338" : "#f1f5f9",
                  color: isActive ? "#ffffff" : darkMode ? "#e2e8f0" : "#334155",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFIL DOKTER & TENAGA MEDIS */}
        {activePortalTab === "tenaga_medis" && (
          <div
            className="p-4 rounded-4 border shadow-sm"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  👨‍⚕️ Dokter Spesialis Kedokteran Jiwa & Psikolog Klinis
                </h5>
                <p className="small mb-0" style={{ color: textSecondary }}>
                  Tenaga ahli kejiwaan terakreditasi melayani poliklinik rawat jalan, bangsal rawat inap, dan krisis NAPZA
                </p>
              </div>
              <span className="badge bg-success rounded-pill px-3 py-2">
                ✅ Terdaftar Resmi di Kemenkes RI & HIMPSI
              </span>
            </div>

            <div className="row g-4">
              {doctorsList.map((doc) => (
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
                      <strong className="text-success">✅ SIP Aktif</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REKRUTMEN & FORMASI */}
        {activePortalTab === "rekrutmen" && (
          <div
            className="p-4 rounded-4 border shadow-sm"
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
                  Informasi penerimaan Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) & Pegawai Tetap BLUD
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
                  posisi: "Petugas Tim De-eskalasi & Pengamanan Krisis (Security)",
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
                      <span className="small" style={{ color: textMutedColor }}>Subbag Kepegawaian</span>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => alert(`Informasi pendaftaran untuk posisi ${job.posisi} dapat diajukan ke Subbag Kepegawaian RSJ Tampan.`)}
                      >
                        Lihat Persyaratan Lengkap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROGRAM DIKLAT */}
        {activePortalTab === "diklat" && (
          <div
            className="p-4 rounded-4 border shadow-sm"
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

        {/* TAB 4: PANDUAN LAYANAN SDM */}
        {activePortalTab === "layanan_sdm" && (
          <div
            className="p-4 rounded-4 border shadow-sm"
            style={{
              backgroundColor: darkMode ? "#111624" : "#ffffff",
              borderColor: cardBorderColor,
            }}
          >
            <h5 className="fw-bold mb-3" style={{ color: textPrimary }}>
              📋 Panduan Prosedur Standar & Hak Kepegawaian RSJ Tampan
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className="p-3 rounded-3 border h-100"
                  style={{
                    backgroundColor: cardSurfaceBg,
                    borderColor: cardBorderColor,
                  }}
                >
                  <h6 className="fw-bold text-success mb-2">🏖️ Tata Cara Pengajuan Cuti ASN & BLUD</h6>
                  <ol className="small ps-3 mb-0 d-flex flex-column gap-1" style={{ color: textSecondary }}>
                    <li>Pengajuan dilakukan H-3 sebelum tanggal cuti melalui sistem SIM-SDM.</li>
                    <li>Wajib menunjuk petugas pengganti (*handover*) demi keamanan bangsal jiwa.</li>
                    <li>Persetujuan berjenjang: Kepala Ruangan &bull; Kasubbag Kepegawaian.</li>
                    <li>Sisa kuota cuti tahunan maksimal 12 hari kerja per tahun.</li>
                  </ol>
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
          </div>
        )}
      </div>
    </div>
  );
}
