import React, { useState, useMemo } from "react";
import { getEmployeeForUser, isAdminOrHrd } from "../utils/authHelpers";
import SdmLeaveLetterModal from "../components/SdmLeaveLetterModal";

export default function PegawaiCutiPage({
  currentUser,
  employees = [],
  leaveRequests = [],
  onSubmitLeave,
  darkMode,
  toggleTheme,
  showToast,
  setCurrentView,
  setActiveTab,
  onLogout,
}) {
  // Hubungkan user saat ini dengan data master pegawai (jika ada)
  const matchedEmp = useMemo(() => {
    return getEmployeeForUser(currentUser, employees);
  }, [currentUser, employees]);

  // Default nama, nip, profesi, unit, sisa cuti
  const employeeName = matchedEmp?.nama || currentUser?.nama || "Pegawai RSJ Tampan";
  const employeeNip = matchedEmp?.nip || currentUser?.nip || "19920817 201902 1 004";
  const employeeProfesi = matchedEmp?.profesi || currentUser?.role || "Tenaga Kesehatan";
  const employeeUnit = matchedEmp?.unitPenempatan || "Unit Pelayanan RSJ Tampan";
  const employeeId = matchedEmp?.id || currentUser?.employeeId || "EMP-006";
  const sisaCuti = matchedEmp?.sisaCuti !== undefined ? matchedEmp.sisaCuti : 12;

  // Form State Pengajuan Cuti
  const [formData, setFormData] = useState({
    jenisCuti: "Cuti Tahunan",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahHari: 1,
    alasan: "",
    petugasPengganti: "",
    catatanTambahan: "",
  });

  const [activeSubView, setActiveSubView] = useState("form"); // 'form' | 'riwayat'
  const [statusFilter, setStatusFilter] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leave letter modal state
  const [isLeaveLetterOpen, setIsLeaveLetterOpen] = useState(false);
  const [selectedLeaveForLetter, setSelectedLeaveForLetter] = useState(null);

  // Filter Riwayat Cuti HANYA milik user/pegawai yang sedang login
  const myLeaveRequests = useMemo(() => {
    const userNipClean = employeeNip.replace(/\s+/g, "");
    const userNameClean = employeeName.toLowerCase().trim();
    const userEmpIdClean = employeeId.toLowerCase().trim();

    return leaveRequests.filter((leave) => {
      if (leave.employeeId && leave.employeeId.toLowerCase() === userEmpIdClean) return true;
      if (leave.nip && leave.nip.replace(/\s+/g, "") === userNipClean) return true;
      if (leave.nama && leave.nama.toLowerCase().trim() === userNameClean) return true;
      if (currentUser?.username && leave.username === currentUser.username) return true;
      return false;
    });
  }, [leaveRequests, employeeNip, employeeName, employeeId, currentUser]);

  // Riwayat Cuti yang difilter oleh status / pencarian
  const filteredMyLeaves = useMemo(() => {
    return myLeaveRequests.filter((leave) => {
      const matchStatus = statusFilter === "semua" || leave.status === statusFilter;
      const matchSearch =
        !searchQuery ||
        leave.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.jenisCuti.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.alasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (leave.petugasPengganti && leave.petugasPengganti.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [myLeaveRequests, statusFilter, searchQuery]);

  // Statistik Cuti Pribadi
  const stats = useMemo(() => {
    const approvedDays = myLeaveRequests
      .filter((l) => l.status === "Disetujui")
      .reduce((sum, l) => sum + (Number(l.jumlahHari) || 0), 0);
    const pendingCount = myLeaveRequests.filter((l) => l.status === "Menunggu Persetujuan").length;
    const approvedCount = myLeaveRequests.filter((l) => l.status === "Disetujui").length;
    const rejectedCount = myLeaveRequests.filter((l) => l.status === "Ditolak").length;

    return {
      totalHakCuti: 12,
      sisaCuti: sisaCuti,
      cutiTerpakai: approvedDays,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalPengajuan: myLeaveRequests.length,
    };
  }, [myLeaveRequests, sisaCuti]);

  // Handle perubahan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Kalkulasi otomatis jumlah hari kerja jika tanggal mulai dan selesai dipilih
      if (name === "tanggalMulai" || name === "tanggalSelesai") {
        if (updated.tanggalMulai && updated.tanggalSelesai) {
          const d1 = new Date(updated.tanggalMulai);
          const d2 = new Date(updated.tanggalSelesai);
          if (d2 >= d1) {
            const diffTime = Math.abs(d2 - d1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            updated.jumlahHari = isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
          } else {
            updated.jumlahHari = 1;
          }
        }
      }
      return updated;
    });
  };

  // Handle submit form pengajuan cuti baru
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.tanggalMulai || !formData.tanggalSelesai || !formData.alasan.trim()) {
      alert("Mohon lengkapi kolom Tanggal Mulai, Tanggal Selesai, dan Alasan Pengajuan.");
      return;
    }

    if (new Date(formData.tanggalSelesai) < new Date(formData.tanggalMulai)) {
      alert("Tanggal selesai cuti tidak boleh mendahului tanggal mulai.");
      return;
    }

    if (formData.jenisCuti === "Cuti Tahunan" && formData.jumlahHari > sisaCuti) {
      const confirmExceed = window.confirm(
        `Perhatian: Jumlah cuti yang diajukan (${formData.jumlahHari} hari) melebihi sisa kuota cuti tahunan Anda (${sisaCuti} hari). Apakah Anda tetap ingin mengajukan untuk ditelaah Subbag Kepegawaian?`
      );
      if (!confirmExceed) return;
    }

    setIsSubmitting(true);

    const newLeave = {
      id: `CUTI-${Date.now().toString().slice(-4)}`,
      employeeId: employeeId,
      nip: employeeNip,
      nama: employeeName,
      profesi: employeeProfesi,
      unit: employeeUnit,
      username: currentUser?.username || "pegawai",
      jenisCuti: formData.jenisCuti,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      jumlahHari: Number(formData.jumlahHari),
      alasan: formData.alasan.trim(),
      petugasPengganti: formData.petugasPengganti.trim() || "-",
      catatanTambahan: formData.catatanTambahan.trim() || "",
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "Menunggu Persetujuan",
      disetujuiOleh: "-",
      catatan: "Pengajuan baru melalui Portal Cuti Pegawai SIM-SDM RSJ Tampan.",
    };

    try {
      onSubmitLeave(newLeave);
      showToast?.(
        "Pengajuan Berhasil Dikirim",
        `Permohonan ${formData.jenisCuti} (${formData.jumlahHari} hari) telah dikirim ke Subbag Kepegawaian.`,
        "success"
      );

      // Reset form dan pindah ke riwayat
      setFormData({
        jenisCuti: "Cuti Tahunan",
        tanggalMulai: "",
        tanggalSelesai: "",
        jumlahHari: 1,
        alasan: "",
        petugasPengganti: "",
        catatanTambahan: "",
      });
      setActiveSubView("riwayat");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pengajuan cuti. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styling theme
  const cardBg = darkMode ? "#111624" : "#ffffff";
  const cardBorder = darkMode ? "#1f273d" : "#e2e8f0";
  const textPrimary = darkMode ? "#f8fafc" : "#0f172a";
  const textSecondary = darkMode ? "#cbd5e1" : "#475569";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#161c2d" : "#f8fafc";
  const inputBorder = darkMode ? "#283452" : "#cbd5e1";

  const userIsAdmin = isAdminOrHrd(currentUser);

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundColor: darkMode ? "#080a10" : "#f8fafc",
        color: textPrimary,
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR KHUSUS PORTAL PEGAWAI                                      */}
      {/* ========================================================================= */}
      <nav
        className="navbar px-3 px-md-4 py-2 border-bottom sticky-top"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: darkMode ? "rgba(10, 13, 20, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderColor: cardBorder,
          zIndex: 1030,
        }}
      >
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 fs-5 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                width: "40px",
                height: "40px",
              }}
            >
              🏖️
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0 fw-bold" style={{ letterSpacing: "-0.02em" }}>
                  PORTAL CUTI & IZIN PEGAWAI
                </h6>
                <span
                  className="badge rounded-pill px-2 py-0"
                  style={{
                    fontSize: "0.68rem",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                  }}
                >
                  Nakes RSJ Tampan
                </span>
              </div>
              <small style={{ color: textMuted, fontSize: "0.74rem" }}>
                Layanan Mandiri Pengajuan & Monitoring Cuti Dokter, Perawat, dan Tenaga Kesehatan
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* JIKA USER ADALAH ADMIN/HRD, TAMPILKAN TOMBOL PINDAH KE ADMIN APPROVAL */}
            {userIsAdmin && (
              <button
                className="btn btn-sm btn-outline-warning d-flex align-items-center gap-2 rounded-pill px-3 py-1 fw-semibold"
                onClick={() => {
                  setCurrentView("admin");
                  setActiveTab("cuti");
                }}
                title="Buka Halaman Manajemen & Approval Seluruh Pegawai"
              >
                <span>⚙️</span>
                <span className="d-none d-sm-inline">Panel Admin Approval</span>
              </button>
            )}

            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3 py-1"
              onClick={() => setCurrentView("guest")}
              title="Lihat Portal SDM Publik"
            >
              <span>🏥</span>
              <span className="d-none d-md-inline">Portal Publik</span>
            </button>

            <button
              className={`btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center ${
                darkMode ? "btn-outline-warning" : "btn-outline-secondary"
              }`}
              onClick={toggleTheme}
              title="Ganti Tema"
              style={{ width: "34px", height: "34px" }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3 py-1"
              onClick={onLogout}
              title="Keluar dari sesi"
            >
              <span>🚪</span>
              <span className="d-none d-sm-inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. PROFILE BANNER PEGAWAI AKTIF                                          */}
      {/* ========================================================================= */}
      <div className="container py-4">
        <div
          className="p-4 rounded-4 shadow-sm mb-4 border position-relative overflow-hidden"
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
          }}
        >
          {/* Ambient decorative glow */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="row align-items-center g-3">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#10b981",
                    fontSize: "1.4rem",
                    flexShrink: 0,
                  }}
                >
                  {employeeName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h5 className="fw-bold mb-0" style={{ color: textPrimary }}>
                      {employeeName}
                    </h5>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1" style={{ fontSize: "0.72rem" }}>
                      {employeeProfesi}
                    </span>
                  </div>
                  <div className="small mt-1 d-flex flex-wrap gap-x-3 gap-y-1" style={{ color: textSecondary }}>
                    <span>
                      <strong>NIP/NRK:</strong> {employeeNip}
                    </span>
                    <span className="text-muted">•</span>
                    <span>
                      <strong>Unit:</strong> {employeeUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS KUOTA CUTI WIDGET */}
            <div className="col-lg-5">
              <div className="d-flex align-items-center justify-content-lg-end gap-3 flex-wrap">
                <div
                  className="p-3 rounded-3 text-center border"
                  style={{
                    backgroundColor: darkMode ? "#161c2d" : "#ecfdf5",
                    borderColor: darkMode ? "#24324f" : "#a7f3d0",
                    minWidth: "115px",
                  }}
                >
                  <small className="d-block fw-semibold text-success" style={{ fontSize: "0.72rem" }}>
                    SISA KUOTA CUTI
                  </small>
                  <h3 className="fw-bold mb-0 text-success">{stats.sisaCuti} <span className="fs-6">Hari</span></h3>
                </div>

                <div
                  className="p-3 rounded-3 text-center border"
                  style={{
                    backgroundColor: darkMode ? "#161c2d" : "#f1f5f9",
                    borderColor: darkMode ? "#24324f" : "#e2e8f0",
                    minWidth: "105px",
                  }}
                >
                  <small className="d-block fw-semibold" style={{ fontSize: "0.72rem", color: textMuted }}>
                    MENUNGGU REVIEW
                  </small>
                  <h3 className="fw-bold mb-0 text-warning">{stats.pendingCount}</h3>
                </div>

                <div
                  className="p-3 rounded-3 text-center border"
                  style={{
                    backgroundColor: darkMode ? "#161c2d" : "#f1f5f9",
                    borderColor: darkMode ? "#24324f" : "#e2e8f0",
                    minWidth: "105px",
                  }}
                >
                  <small className="d-block fw-semibold" style={{ fontSize: "0.72rem", color: textMuted }}>
                    TOTAL DISETUJUI
                  </small>
                  <h3 className="fw-bold mb-0 text-primary">{stats.approvedCount}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. NAVIGATION TABS: FORM PENGAJUAN vs RIWAYAT CUTI PRIBADI               */}
        {/* ========================================================================= */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div
            className="d-inline-flex p-1 rounded-3 border"
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
            }}
          >
            <button
              onClick={() => setActiveSubView("form")}
              className={`btn btn-sm d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 transition-all ${
                activeSubView === "form" ? "btn-success fw-bold shadow-sm" : ""
              }`}
              style={{
                backgroundColor: activeSubView === "form" ? "#10b981" : "transparent",
                color: activeSubView === "form" ? "#ffffff" : textSecondary,
                fontSize: "0.86rem",
              }}
            >
              <span>📝</span>
              <span>Form Pengajuan Cuti Baru</span>
            </button>

            <button
              onClick={() => setActiveSubView("riwayat")}
              className={`btn btn-sm d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0 transition-all ${
                activeSubView === "riwayat" ? "btn-success fw-bold shadow-sm" : ""
              }`}
              style={{
                backgroundColor: activeSubView === "riwayat" ? "#10b981" : "transparent",
                color: activeSubView === "riwayat" ? "#ffffff" : textSecondary,
                fontSize: "0.86rem",
              }}
            >
              <span>📂</span>
              <span>Riwayat Cuti Pribadi ({myLeaveRequests.length})</span>
              {stats.pendingCount > 0 && (
                <span className="badge bg-warning text-dark rounded-pill px-2 py-0" style={{ fontSize: "0.68rem" }}>
                  {stats.pendingCount}
                </span>
              )}
            </button>
          </div>

          <small style={{ color: textMuted }}>
            🔒 Pengajuan Anda hanya dapat disetujui & diverifikasi oleh Subbag Kepegawaian / HRD.
          </small>
        </div>

        {/* ========================================================================= */}
        {/* 4. SUB-VIEW 1: FORM PENGAJUAN CUTI BARU                                   */}
        {/* ========================================================================= */}
        {activeSubView === "form" && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div
                className="p-4 rounded-4 shadow-sm border"
                style={{
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                }}
              >
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: cardBorder }}>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                      Formulir Permohonan Cuti Tenaga Medis / Pegawai
                    </h5>
                    <p className="small mb-0" style={{ color: textMuted }}>
                      Silakan isi detail tanggal, alasan cuti, dan pelimpahan tugas shift bangsal dengan lengkap.
                    </p>
                  </div>
                  <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold">
                    SIM-SDM Cuti Online
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  {/* AUTO-FILLED EMPLOYEE DETAILS BANNER */}
                  <div
                    className="p-3 rounded-3 border d-flex flex-column gap-1"
                    style={{
                      backgroundColor: darkMode ? "#161c2d" : "#f1f5f9",
                      borderColor: darkMode ? "#222c45" : "#e2e8f0",
                      fontSize: "0.82rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <span style={{ color: textMuted }}>Pemohon Terotentikasi:</span>
                      <strong style={{ color: "#10b981" }}>✅ {employeeName} ({employeeProfesi})</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <span style={{ color: textMuted }}>Unit Penempatan / Bangsal:</span>
                      <span style={{ color: textSecondary }}>{employeeUnit} &bull; NIP: {employeeNip}</span>
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                        Jenis Cuti yang Diajukan <span className="text-danger">*</span>
                      </label>
                      <select
                        name="jenisCuti"
                        value={formData.jenisCuti}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                        style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                      >
                        <option value="Cuti Tahunan">Cuti Tahunan (Maks 12 Hari Kerja/Tahun)</option>
                        <option value="Cuti Sakit">Cuti Sakit (Rawat Inap / Surat Dokter)</option>
                        <option value="Cuti Alasan Penting">Cuti Alasan Penting (Keluarga Sakit/Menikah)</option>
                        <option value="Cuti Melahirkan">Cuti Melahirkan (3 Bulan)</option>
                        <option value="Cuti Seminar / Tugas Belajar Singkat">Cuti Seminar / Tugas Belajar Singkat</option>
                        <option value="Cuti Besar">Cuti Besar (Masa Kerja &gt; 5 Tahun)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                        Durasi Cuti (Hari Kerja)
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          name="jumlahHari"
                          value={formData.jumlahHari}
                          onChange={handleInputChange}
                          min="1"
                          max="90"
                          className="form-control"
                          style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                        />
                        <span className="input-group-text" style={{ backgroundColor: inputBg, color: textMuted, borderColor: inputBorder }}>
                          Hari Kerja
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                        Tanggal Mulai Cuti <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalMulai"
                        value={formData.tanggalMulai}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                        Tanggal Selesai Cuti <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggalSelesai"
                        value={formData.tanggalSelesai}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                      Petugas Pengganti / Pelimpahan Tugas (*Handover Shift*) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="petugasPengganti"
                      value={formData.petugasPengganti}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: Ns. Maya Fitri, A.Md.Kep (Perawat Shift Bangsal Siak)"
                      className="form-control"
                      style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                    />
                    <small className="d-block mt-1" style={{ color: textMuted, fontSize: "0.74rem" }}>
                      Wajib mencantumkan rekan perawat/dokter pengganti jadwal jaga bangsal demi keselamatan pasien jiwa.
                    </small>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                      Alasan / Keperluan Pengajuan Cuti <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="alasan"
                      value={formData.alasan}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Jelaskan keperluan pengajuan cuti secara singkat dan jelas..."
                      className="form-control"
                      style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-semibold" style={{ color: textSecondary }}>
                      Catatan / Keterangan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      name="catatanTambahan"
                      value={formData.catatanTambahan}
                      onChange={handleInputChange}
                      placeholder="Nomor kontak darurat atau keterangan lampiran surat keterangan..."
                      className="form-control"
                      style={{ backgroundColor: inputBg, color: textPrimary, borderColor: inputBorder }}
                    />
                  </div>

                  {/* ACTION BUTTONS */}
                  <div
                    className="d-flex align-items-center justify-content-between pt-3 border-top mt-2"
                    style={{ borderColor: cardBorder }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3"
                      onClick={() =>
                        setFormData({
                          jenisCuti: "Cuti Tahunan",
                          tanggalMulai: "",
                          tanggalSelesai: "",
                          jumlahHari: 1,
                          alasan: "",
                          petugasPengganti: "",
                          catatanTambahan: "",
                        })
                      }
                    >
                      Reset Formulir
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                    >
                      <span>📤</span>
                      <span>{isSubmitting ? "Mengirim Permohonan..." : "Kirim Permohonan Cuti"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* SIDEBAR GUIDELINES */}
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-3">
                <div
                  className="p-4 rounded-4 shadow-sm border"
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  }}
                >
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
                    <span>📌</span> Ketentuan Cuti Pegawai RSJ Tampan
                  </h6>
                  <ul className="small ps-3 mb-0 d-flex flex-column gap-2" style={{ color: textSecondary }}>
                    <li>
                      <strong>Pengajuan H-3:</strong> Cuti tahunan diajukan minimal 3 hari sebelum tanggal mulai tugas libur.
                    </li>
                    <li>
                      <strong>Handover Shift Jaga:</strong> Wajib memastikan ada nakes pengganti agar rasio nakes-pasien bangsal aman.
                    </li>
                    <li>
                      <strong>Alur Verifikasi:</strong> Verifikasi bertahap dari Kepala Ruangan Bangsal &rarr; Subbag Kepegawaian & SDM &rarr; Direktur.
                    </li>
                    <li>
                      <strong>Cuti Sakit:</strong> Wajib melampirkan surat keterangan dokter / rawat inap saat masuk dinas kembali.
                    </li>
                  </ul>
                </div>

                <div
                  className="p-3 rounded-4 border"
                  style={{
                    backgroundColor: darkMode ? "#161c2d" : "#f1f5f9",
                    borderColor: darkMode ? "#222c45" : "#e2e8f0",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fs-5">ℹ️</span>
                    <strong className="small" style={{ color: textPrimary }}>Status Akses & Otoritas</strong>
                  </div>
                  <p className="small mb-0" style={{ color: textMuted, fontSize: "0.78rem" }}>
                    Sebagai Pemohon, Anda dapat memantau status persetujuan secara transparan. Anda <em>tidak dapat menyetujui pengajuan cuti Anda sendiri</em> demi menjaga akuntabilitas pelayanan rumah sakit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. SUB-VIEW 2: DAFTAR RIWAYAT CUTI PRIBADI (MILIK USER SAJA)              */}
        {/* ========================================================================= */}
        {activeSubView === "riwayat" && (
          <div
            className="p-4 rounded-4 shadow-sm border"
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
            }}
          >
            {/* SEARCH & FILTER BAR */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textPrimary }}>
                  📂 Riwayat Permohonan Cuti Pribadi
                </h5>
                <p className="small mb-0" style={{ color: textMuted }}>
                  Menampilkan seluruh riwayat pengajuan cuti atas nama <strong>{employeeName}</strong>
                </p>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Cari alasan, jenis cuti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control form-control-sm"
                  style={{
                    backgroundColor: inputBg,
                    color: textPrimary,
                    borderColor: inputBorder,
                    minWidth: "200px",
                  }}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select form-select-sm"
                  style={{
                    backgroundColor: inputBg,
                    color: textPrimary,
                    borderColor: inputBorder,
                    width: "auto",
                  }}
                >
                  <option value="semua">Semua Status ({myLeaveRequests.length})</option>
                  <option value="Menunggu Persetujuan">Menunggu Persetujuan ({stats.pendingCount})</option>
                  <option value="Disetujui">Disetujui ({stats.approvedCount})</option>
                  <option value="Ditolak">Ditolak ({stats.rejectedCount})</option>
                </select>
              </div>
            </div>

            {/* TABEL RIWAYAT CUTI PRIBADI */}
            {filteredMyLeaves.length === 0 ? (
              <div className="p-5 text-center rounded-3 border" style={{ borderColor: cardBorder }}>
                <div className="fs-1 mb-2">🏖️</div>
                <h6 className="fw-bold" style={{ color: textPrimary }}>
                  Belum Ada Data Pengajuan Cuti
                </h6>
                <p className="small mb-3" style={{ color: textMuted }}>
                  {statusFilter !== "semua" || searchQuery
                    ? "Tidak ada data riwayat yang cocok dengan filter pencarian."
                    : "Anda belum pernah mengajukan permohonan cuti. Klik tombol di bawah untuk membuat pengajuan baru."}
                </p>
                <button
                  className="btn btn-sm btn-success px-3"
                  onClick={() => setActiveSubView("form")}
                >
                  ➕ Buat Pengajuan Cuti Baru
                </button>
              </div>
            ) : (
              <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
                <table
                  className={`table ${darkMode ? "table-dark" : "table-light"} table-hover align-middle mb-0`}
                  style={{ fontSize: "0.85rem" }}
                >
                  <thead style={{ backgroundColor: darkMode ? "#14192b" : "#f8fafc", color: textSecondary }}>
                    <tr>
                      <th className="py-3 px-3">No. Pengajuan</th>
                      <th className="py-3">Jenis & Durasi</th>
                      <th className="py-3">Rentang Tanggal</th>
                      <th className="py-3">Alasan & Petugas Pengganti</th>
                      <th className="py-3 text-center">Status Approval</th>
                      <th className="py-3 px-3">Catatan / Verifikator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMyLeaves.map((leave) => {
                      const isPending = leave.status === "Menunggu Persetujuan";
                      const isApproved = leave.status === "Disetujui";
                      const isRejected = leave.status === "Ditolak";

                      return (
                        <tr key={leave.id} style={{ borderBottomColor: cardBorder }}>
                          <td className="px-3 py-3">
                            <span className="fw-bold" style={{ color: textPrimary }}>
                              {leave.id}
                            </span>
                            <small className="d-block" style={{ color: textMuted }}>
                              Diajukan: {leave.tanggalPengajuan}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary fw-semibold">
                              {leave.jenisCuti}
                            </span>
                            <small className="d-block mt-1" style={{ color: textSecondary }}>
                              <strong>{leave.jumlahHari} Hari</strong> Kerja
                            </small>
                          </td>
                          <td>
                            <div className="fw-semibold" style={{ color: textPrimary }}>
                              {leave.tanggalMulai} <span style={{ color: textMuted }}>s/d</span> {leave.tanggalSelesai}
                            </div>
                          </td>
                          <td style={{ maxWidth: "260px" }}>
                            <div className="text-truncate fw-medium" title={leave.alasan} style={{ color: textPrimary }}>
                              {leave.alasan}
                            </div>
                            <small className="d-block text-info">
                              <strong>Handover:</strong> {leave.petugasPengganti || "-"}
                            </small>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge px-3 py-1 rounded-pill ${
                                isApproved
                                  ? "bg-success"
                                  : isRejected
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {isPending ? "⏳ " : isApproved ? "✅ " : "❌ "}
                              {leave.status}
                            </span>
                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeaveForLetter(leave);
                                  setIsLeaveLetterOpen(true);
                                }}
                                className="btn btn-xs btn-outline-success d-block mx-auto mt-1 rounded-pill py-0 px-2 fw-semibold"
                                style={{ fontSize: "0.72rem" }}
                                title="Lihat & Cetak Surat Izin Cuti Resmi BKN/RSJ Tampan"
                              >
                                📜 Cetak Surat
                              </button>
                            )}
                          </td>
                          <td className="px-3">
                            <div className="small" style={{ color: textPrimary }}>
                              {leave.disetujuiOleh !== "-" ? leave.disetujuiOleh : "Menunggu telaah HRD"}
                            </div>
                            <small className="d-block" style={{ color: textMuted, fontStyle: "italic" }}>
                              {leave.catatan || "-"}
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL SURAT IZIN CUTI RESMI */}
      <SdmLeaveLetterModal
        isOpen={isLeaveLetterOpen}
        onClose={() => setIsLeaveLetterOpen(false)}
        leave={selectedLeaveForLetter}
        darkMode={darkMode}
      />
    </div>
  );
}
