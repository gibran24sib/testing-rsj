import React, { useState, useMemo } from "react";
import SdmEmployeeModal from "../components/SdmEmployeeModal";
import SdmLeaveModal from "../components/SdmLeaveModal";

export default function SdmTab({
  activeTab = "direktori",
  setActiveTab,
  employees = [],
  shiftRoster = [],
  leaveRequests = [],
  trainings = [],
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onSubmitLeave,
  onApproveLeave,
  onRejectLeave,
  onRenewStrSip,
  darkMode,
  showToast,
}) {
  // SUB-TAB STATE
  const [subTab, setSubTab] = useState(activeTab || "direktori");

  React.useEffect(() => {
    if (activeTab && ["direktori", "roster", "legalitas", "cuti", "diklat", "analitik"].includes(activeTab)) {
      setSubTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setSubTab(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  // SEARCH & FILTER STATE (DIREKTORI)
  const [searchEmp, setSearchEmp] = useState("");
  const [filterCategory, setFilterCategory] = useState("semua");
  const [filterUnit, setFilterUnit] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");

  // ROSTER FILTER
  const [rosterWardFilter, setRosterWardFilter] = useState("semua");

  // MODAL STATES
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeModalMode, setEmployeeModalMode] = useState("view"); // "view" | "add" | "edit"
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // FILTERED EMPLOYEES
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.nama.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.profesi.toLowerCase().includes(searchEmp.toLowerCase()) ||
        emp.unitPenempatan.toLowerCase().includes(searchEmp.toLowerCase());

      const matchCategory = filterCategory === "semua" || emp.kategori === filterCategory;
      const matchUnit = filterUnit === "semua" || emp.unitPenempatan.includes(filterUnit);
      const matchStatus = filterStatus === "semua" || emp.statusKepegawaian === filterStatus;

      return matchSearch && matchCategory && matchUnit && matchStatus;
    });
  }, [employees, searchEmp, filterCategory, filterUnit, filterStatus]);

  // STR/SIP EXPIRED COUNT & LIST
  const expiringLicenses = useMemo(() => {
    return employees.filter(
      (emp) => emp.str?.status === "Expired" || emp.str?.status === "Mendekati Expired" || emp.sip?.status === "Expired" || emp.sip?.status === "Mendekati Expired"
    );
  }, [employees]);

  // STATS
  const stats = useMemo(() => {
    const total = employees.length;
    const medis = employees.filter((e) => e.kategori === "Medis").length;
    const keperawatan = employees.filter((e) => e.kategori === "Keperawatan").length;
    const pns = employees.filter((e) => e.statusKepegawaian === "PNS").length;
    const pppk = employees.filter((e) => e.statusKepegawaian === "PPPK").length;
    const pendingLeaves = leaveRequests.filter((l) => l.status === "Menunggu Persetujuan").length;

    return { total, medis, keperawatan, pns, pppk, pendingLeaves };
  }, [employees, leaveRequests]);

  // HANDLERS
  const handleOpenAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeModalMode("add");
    setIsEmployeeModalOpen(true);
  };

  const handleOpenViewEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode("view");
    setIsEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeModalMode("edit");
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (empData, mode) => {
    if (mode === "add") {
      onAddEmployee(empData);
      showToast?.("Berhasil Menambah", `${empData.nama} berhasil terdaftar di SIM-SDM.`, "success");
    } else {
      onUpdateEmployee(empData);
      showToast?.("Data Diperbarui", `Informasi ${empData.nama} berhasil diperbarui.`, "success");
    }
  };

  const handleDeleteEmployee = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pegawai ${name}?`)) {
      onDeleteEmployee(id);
      showToast?.("Data Dihapus", `Data pegawai ${name} berhasil dihapus.`, "info");
    }
  };

  const handleExportCsv = () => {
    const headers = "ID,NIP,Nama,Profesi,Kategori,Jabatan,Unit Penempatan,Status Kepegawaian,Golongan,Email,No HP,No STR,Masa STR,No SIP,Masa SIP,SKP\n";
    const rows = employees
      .map(
        (e) =>
          `"${e.id}","${e.nip}","${e.nama}","${e.profesi}","${e.kategori}","${e.jabatan}","${e.unitPenempatan}","${e.statusKepegawaian}","${e.golongan}","${e.email}","${e.noHp}","${e.str?.nomor}","${e.str?.masaBerlaku}","${e.sip?.nomor}","${e.sip?.masaBerlaku}","${e.skpSkor}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Daftar_SDM_RSJ_Tampan_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.("Ekspor Berhasil", "Data kepegawaian berhasil diunduh dalam format CSV.", "success");
  };

  // UI THEME HELPERS
  const cardBg = darkMode ? "#111624" : "#ffffff";
  const cardBorder = darkMode ? "#1d253b" : "#e2e8f0";
  const textMuted = darkMode ? "#94a3b8" : "#64748b";
  const tableHeaderBg = darkMode ? "#161c2d" : "#f1f5f9";
  const tableRowHover = darkMode ? "#182035" : "#f8fafc";

  return (
    <div className="d-flex flex-column gap-4 animate-fade-in">
      {/* 1. TOP SUMMARY STAT CARDS */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
            >
              👥
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Total SDM & Nakes
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {stats.total} <span className="fs-6 fw-normal text-muted">Pegawai</span>
              </h4>
              <small className="text-success fw-medium" style={{ fontSize: "0.72rem" }}>
                {stats.medis} Dokter &bull; {stats.keperawatan} Ners Jiwa
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}
            >
              🏛️
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Komposisi ASN
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {stats.pns + stats.pppk} <span className="fs-6 fw-normal text-muted">ASN</span>
              </h4>
              <small className="text-primary fw-medium" style={{ fontSize: "0.72rem" }}>
                {stats.pns} PNS &bull; {stats.pppk} PPPK
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: expiringLicenses.length > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
                color: expiringLicenses.length > 0 ? "#ef4444" : "#10b981",
              }}
            >
              📜
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                STR / SIP Perlu Dicek
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {expiringLicenses.length} <span className="fs-6 fw-normal text-muted">Nakes</span>
              </h4>
              <small
                className={expiringLicenses.length > 0 ? "text-danger fw-semibold" : "text-success"}
                style={{ fontSize: "0.72rem" }}
              >
                {expiringLicenses.length > 0 ? "Perlu Perpanjangan STR/SIP" : "Seluruh Legalitas Valid"}
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div
            className="p-3 rounded-4 h-100 d-flex align-items-center gap-3 shadow-sm transition-all"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="rounded-3 d-flex align-items-center justify-content-center fs-4"
              style={{ width: "48px", height: "48px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}
            >
              🏖️
            </div>
            <div>
              <span className="small fw-semibold d-block" style={{ color: textMuted }}>
                Pengajuan Cuti Aktif
              </span>
              <h4 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em" }}>
                {stats.pendingLeaves} <span className="fs-6 fw-normal text-muted">Menunggu</span>
              </h4>
              <small className="text-warning fw-semibold" style={{ fontSize: "0.72rem" }}>
                {leaveRequests.length} Total Riwayat Pengajuan
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB NAVIGATION PILLS */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-2 rounded-4 shadow-sm"
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
        }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2">
          {[
            { id: "direktori", label: "Direktori Pegawai", icon: "👥", count: employees.length },
            { id: "roster", label: "Roster Shift 24/7", icon: "📅", count: shiftRoster.length },
            { id: "legalitas", label: "Legalitas STR & SIP", icon: "📜", alert: expiringLicenses.length },
            { id: "cuti", label: "Pengajuan Cuti", icon: "🏖️", alert: stats.pendingLeaves },
            { id: "diklat", label: "Diklat & Kredensialing Jiwa", icon: "🎓", count: trainings.length },
            { id: "analitik", label: "Analitik SDM & Kinerja", icon: "📊" },
          ].map((tab) => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 transition-all ${
                  isActive ? "btn-success fw-semibold shadow-sm" : "btn-light text-dark"
                }`}
                style={{
                  backgroundColor: isActive ? "#10b981" : darkMode ? "#181f33" : "#f1f5f9",
                  color: isActive ? "#ffffff" : darkMode ? "#cbd5e1" : "#334155",
                  border: "none",
                  fontSize: "0.82rem",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.alert !== undefined && tab.alert > 0 && (
                  <span className="badge rounded-pill bg-danger" style={{ fontSize: "0.68rem" }}>
                    {tab.alert}
                  </span>
                )}
                {tab.count !== undefined && !tab.alert && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      fontSize: "0.68rem",
                      backgroundColor: isActive ? "rgba(255,255,255,0.25)" : darkMode ? "#283452" : "#e2e8f0",
                      color: isActive ? "#ffffff" : darkMode ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="d-flex align-items-center gap-2">
          {subTab === "direktori" && (
            <>
              <button
                type="button"
                onClick={handleExportCsv}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-3 px-3"
                title="Unduh Data Format CSV"
              >
                <span>📥</span> Ekspor CSV
              </button>
              <button
                type="button"
                onClick={handleOpenAddEmployee}
                className="btn btn-success btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold shadow-sm"
              >
                <span>➕</span> Tambah Pegawai
              </button>
            </>
          )}
          {subTab === "cuti" && (
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="btn btn-warning btn-sm d-flex align-items-center gap-1 rounded-3 px-3 fw-semibold text-dark shadow-sm"
            >
              <span>🏖️</span> Ajukan Cuti Baru
            </button>
          )}
        </div>
      </div>

      {/* 3. SUB-TAB CONTENTS */}

      {/* TAB 1: DIREKTORI PEGAWAI */}
      {subTab === "direktori" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          {/* SEARCH & FILTERS */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text border-end-0"
                  style={{
                    backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                    borderColor: darkMode ? "#283452" : "#cbd5e1",
                    color: textMuted,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari nama, NIP, profesi, atau bangsal..."
                  value={searchEmp}
                  onChange={(e) => setSearchEmp(e.target.value)}
                  className="form-control form-control-sm border-start-0"
                  style={{
                    backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                    color: darkMode ? "#ffffff" : "#0f172a",
                    borderColor: darkMode ? "#283452" : "#cbd5e1",
                  }}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Kategori Tenaga</option>
                <option value="Medis">Medis (Dokter & Psikolog)</option>
                <option value="Keperawatan">Keperawatan (Ners Jiwa)</option>
                <option value="Kefarmasian">Kefarmasian (Apoteker)</option>
                <option value="Penunjang Medis">Penunjang Medis (RMIK)</option>
                <option value="Administrasi & Manajemen">Administrasi & Manajemen</option>
                <option value="Keamanan & Pengamanan">Keamanan (Security Krisis)</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Unit Penempatan</option>
                <option value="Kampar">Bangsal Kampar (Akut Pria)</option>
                <option value="Siak">Bangsal Siak (Wanita)</option>
                <option value="Indragiri">Bangsal Indragiri (Tenang)</option>
                <option value="Rokan">Bangsal Rokan (NAPZA)</option>
                <option value="IGD Jiwa">IGD Jiwa & Krisis</option>
                <option value="Poli">Poli Jiwa & Klinik</option>
                <option value="Farmasi">Instalasi Farmasi</option>
              </select>
            </div>

            <div className="col-12 col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                }}
              >
                <option value="semua">Semua Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="Pegawai BLUD">BLUD</option>
                <option value="Kontrak">Kontrak</option>
              </select>
            </div>
          </div>

          {/* TABLE OF EMPLOYEES */}
          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Pegawai / Nakes</th>
                  <th className="py-3">Profesi & Jabatan</th>
                  <th className="py-3">Penempatan Unit</th>
                  <th className="py-3">Status ASN</th>
                  <th className="py-3 text-center">Status STR / SIP</th>
                  <th className="py-3 text-center">SKP</th>
                  <th className="py-3 text-end px-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      Tidak ada data pegawai yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const isStrExpired = emp.str?.status === "Expired" || emp.sip?.status === "Expired";
                    const isStrWarning = emp.str?.status === "Mendekati Expired" || emp.sip?.status === "Mendekati Expired";

                    return (
                      <tr key={emp.id} style={{ borderBottomColor: cardBorder }}>
                        <td className="px-3 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={emp.foto}
                              alt={emp.nama}
                              className="rounded-circle shadow-sm"
                              style={{ width: "42px", height: "42px", objectFit: "cover" }}
                            />
                            <div>
                              <div className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>
                                {emp.nama}
                              </div>
                              <small className="text-muted d-block" style={{ fontSize: "0.74rem" }}>
                                NIP: {emp.nip}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-medium">{emp.profesi}</div>
                          <small style={{ color: textMuted, fontSize: "0.74rem" }}>{emp.jabatan}</small>
                        </td>
                        <td>
                          <span
                            className="badge px-2 py-1 rounded-2"
                            style={{
                              backgroundColor: darkMode ? "#1e293b" : "#f1f5f9",
                              color: darkMode ? "#cbd5e1" : "#334155",
                              border: darkMode ? "1px solid #334155" : "1px solid #cbd5e1",
                            }}
                          >
                            {emp.unitPenempatan}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              emp.statusKepegawaian === "PNS"
                                ? "bg-primary"
                                : emp.statusKepegawaian === "PPPK"
                                ? "bg-info text-dark"
                                : emp.statusKepegawaian === "Pegawai BLUD"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {emp.statusKepegawaian}
                          </span>
                          <small className="d-block text-muted" style={{ fontSize: "0.72rem" }}>
                            {emp.golongan}
                          </small>
                        </td>
                        <td className="text-center">
                          {emp.str?.nomor === "-" ? (
                            <span className="badge bg-secondary opacity-75">Non-Nakes</span>
                          ) : (
                            <span
                              className={`badge rounded-pill px-2 py-1 ${
                                isStrExpired
                                  ? "bg-danger"
                                  : isStrWarning
                                  ? "bg-warning text-dark fw-bold"
                                  : "bg-success"
                              }`}
                            >
                              {isStrExpired ? "⚠️ STR Expired" : isStrWarning ? "⚡ Menjelang Habis" : "✅ STR/SIP Aktif"}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border fw-semibold">{emp.skpSkor}</span>
                        </td>
                        <td className="text-end px-3">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              onClick={() => handleOpenViewEmployee(emp)}
                              className="btn btn-outline-info"
                              title="Lihat Detail Profil"
                            >
                              👁️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditEmployee(emp)}
                              className="btn btn-outline-primary"
                              title="Edit Data Pegawai"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEmployee(emp.id, emp.nama)}
                              className="btn btn-outline-danger"
                              title="Hapus Pegawai"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER SHIFT 24/7 */}
      {subTab === "roster" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">📅 Jadwal Shift & Duty Roster Bangsal Jiwa 24 Jam</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Distribusi perawat pelaksana, ketua tim (Katim), dokter spesialis on-call, dan petugas respon krisis bangsal
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                value={rosterWardFilter}
                onChange={(e) => setRosterWardFilter(e.target.value)}
                style={{
                  backgroundColor: darkMode ? "#181f33" : "#f8fafc",
                  color: darkMode ? "#ffffff" : "#0f172a",
                  borderColor: darkMode ? "#283452" : "#cbd5e1",
                  width: "220px",
                }}
              >
                <option value="semua">Semua Bangsal & IGD</option>
                <option value="Kampar">Bangsal Kampar (Akut Pria)</option>
                <option value="Siak">Bangsal Siak (Wanita)</option>
                <option value="IGD Jiwa">IGD Jiwa & Krisis</option>
                <option value="Rokan">Bangsal Rokan (NAPZA)</option>
              </select>
            </div>
          </div>

          {/* ROSTER CARDS */}
          <div className="row g-4">
            {shiftRoster
              .filter((r) => rosterWardFilter === "semua" || r.bangsal.includes(rosterWardFilter))
              .map((roster) => (
                <div key={roster.id} className="col-12 col-lg-6">
                  <div
                    className="p-3 rounded-3 h-100 border transition-all"
                    style={{
                      backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                      borderColor: darkMode ? "#1f273d" : "#e2e8f0",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                      <div>
                        <span className="badge bg-success mb-1">{roster.bangsal}</span>
                        <div className="small fw-semibold text-muted">
                          {roster.hari}, {roster.tanggal}
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3 py-1">{roster.status}</span>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-3" style={{ fontSize: "0.85rem" }}>
                      {/* SHIFT PAGI */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#ecfdf5", borderLeft: "4px solid #10b981" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-success mb-1">
                          <span>🌅 Shift Pagi (07.30 - 14.30 WIB)</span>
                          <span className="badge bg-success-subtle text-success">{roster.shiftPagi.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftPagi.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SHIFT SORE */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#eff6ff", borderLeft: "4px solid #3b82f6" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-primary mb-1">
                          <span>☀️ Shift Sore (14.30 - 21.00 WIB)</span>
                          <span className="badge bg-primary-subtle text-primary">{roster.shiftSore.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftSore.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SHIFT MALAM */}
                      <div
                        className="p-2 rounded-2"
                        style={{ backgroundColor: darkMode ? "#1a2238" : "#faf5ff", borderLeft: "4px solid #8b5cf6" }}
                      >
                        <div className="d-flex justify-content-between align-items-center fw-bold text-purple mb-1">
                          <span>🌙 Shift Malam (21.00 - 07.30 WIB)</span>
                          <span className="badge bg-purple-subtle text-purple">{roster.shiftMalam.length} Petugas</span>
                        </div>
                        <ul className="mb-0 ps-3">
                          {roster.shiftMalam.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                      style={{ backgroundColor: darkMode ? "#1d253b" : "#f1f5f9", fontSize: "0.82rem" }}
                    >
                      <span className="fw-semibold text-muted">🩺 Dokter Spesialis Jaga (On-Call):</span>
                      <strong className="text-success">{roster.dokterJagaOnCall}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEGALITAS STR & SIP */}
      {subTab === "legalitas" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">📜 Pelacakan & Peringatan Masa Berlaku STR & SIP Nakes</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Sistem audit legalitas izin praktik dokter, psikolog klinis, dan perawat jiwa RSJ Tampan
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-danger rounded-pill px-3 py-2">
                ⚠️ {expiringLicenses.length} Nakes Perlu Perpanjangan Izin
              </span>
            </div>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">Tenaga Medis / Nakes</th>
                  <th className="py-3">Profesi & Unit</th>
                  <th className="py-3">Nomor STR & Masa Berlaku</th>
                  <th className="py-3">Nomor SIP & Masa Berlaku</th>
                  <th className="py-3 text-center">Status Kepatuhan</th>
                  <th className="py-3 text-end px-3">Aksi Perpanjangan</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter((e) => e.str?.nomor !== "-")
                  .map((emp) => {
                    const isStrExpired = emp.str?.status === "Expired" || emp.sip?.status === "Expired";
                    const isStrWarning =
                      emp.str?.status === "Mendekati Expired" || emp.sip?.status === "Mendekati Expired";

                    return (
                      <tr key={emp.id} style={{ borderBottomColor: cardBorder }}>
                        <td className="px-3 py-3">
                          <div className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>
                            {emp.nama}
                          </div>
                          <small className="text-muted">NIP: {emp.nip}</small>
                        </td>
                        <td>
                          <div>{emp.profesi}</div>
                          <small className="text-muted">{emp.unitPenempatan}</small>
                        </td>
                        <td>
                          <div className="font-monospace small">{emp.str?.nomor}</div>
                          <small
                            className={
                              emp.str?.status === "Expired"
                                ? "text-danger fw-bold"
                                : emp.str?.status === "Mendekati Expired"
                                ? "text-warning fw-bold"
                                : "text-success"
                            }
                          >
                            Exp: {emp.str?.masaBerlaku} ({emp.str?.status})
                          </small>
                        </td>
                        <td>
                          <div className="font-monospace small">{emp.sip?.nomor}</div>
                          <small
                            className={
                              emp.sip?.status === "Expired"
                                ? "text-danger fw-bold"
                                : emp.sip?.status === "Mendekati Expired"
                                ? "text-warning fw-bold"
                                : "text-success"
                            }
                          >
                            Exp: {emp.sip?.masaBerlaku} ({emp.sip?.status})
                          </small>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge px-3 py-1 rounded-pill ${
                              isStrExpired ? "bg-danger" : isStrWarning ? "bg-warning text-dark" : "bg-success"
                            }`}
                          >
                            {isStrExpired ? "⛔ Expired" : isStrWarning ? "⚡ < 90 Hari" : "✅ Valid"}
                          </span>
                        </td>
                        <td className="text-end px-3">
                          <button
                            type="button"
                            onClick={() => {
                              onRenewStrSip?.(emp.id);
                              showToast?.("Legalitas Diperpanjang", `STR/SIP atas nama ${emp.nama} telah diverifikasi perpanjangan 5 tahun.`, "success");
                            }}
                            className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <span>🔄</span> Perbarui STR/SIP
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PENGAJUAN & APPROVAL CUTI */}
      {subTab === "cuti" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🏖️ Manajemen Pengajuan & Persetujuan Cuti Pegawai</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Pengelolaan cuti tahunan, cuti sakit, seminar/tugas belajar, dan pelimpahan tugas (handover)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="btn btn-warning btn-sm d-flex align-items-center gap-2 fw-semibold text-dark shadow-sm px-3 py-2"
            >
              <span>➕</span> Ajukan Permohonan Cuti
            </button>
          </div>

          <div className="table-responsive rounded-3 border" style={{ borderColor: cardBorder }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
              <thead style={{ backgroundColor: tableHeaderBg, color: darkMode ? "#cbd5e1" : "#475569" }}>
                <tr>
                  <th className="py-3 px-3">No. Cuti / Pemohon</th>
                  <th className="py-3">Jenis & Durasi</th>
                  <th className="py-3">Rentang Tanggal</th>
                  <th className="py-3">Alasan & Handover</th>
                  <th className="py-3 text-center">Status Approval</th>
                  <th className="py-3 text-end px-3">Tindakan Atasan / HRD</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} style={{ borderBottomColor: cardBorder }}>
                    <td className="px-3 py-3">
                      <div className="fw-bold">{leave.nama}</div>
                      <small className="text-muted">
                        {leave.id} &bull; {leave.unit}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary fw-semibold">{leave.jenisCuti}</span>
                      <small className="d-block text-muted">{leave.jumlahHari} Hari Kerja</small>
                    </td>
                    <td>
                      <div className="small fw-semibold">
                        {leave.tanggalMulai} s/d {leave.tanggalSelesai}
                      </div>
                      <small className="text-muted">Diajukan: {leave.tanggalPengajuan}</small>
                    </td>
                    <td style={{ maxWidth: "250px" }}>
                      <div className="text-truncate" title={leave.alasan}>
                        {leave.alasan}
                      </div>
                      <small className="text-info d-block">
                        <strong>Pengganti:</strong> {leave.petugasPengganti}
                      </small>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge px-3 py-1 rounded-pill ${
                          leave.status === "Disetujui"
                            ? "bg-success"
                            : leave.status === "Ditolak"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {leave.status}
                      </span>
                      {leave.status === "Disetujui" && (
                        <small className="d-block text-muted" style={{ fontSize: "0.68rem" }}>
                          Oleh: {leave.disetujuiOleh}
                        </small>
                      )}
                    </td>
                    <td className="text-end px-3">
                      {leave.status === "Menunggu Persetujuan" ? (
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            onClick={() => {
                              onApproveLeave?.(leave.id);
                              showToast?.("Cuti Disetujui", `Pengajuan cuti ${leave.nama} berhasil disetujui.`, "success");
                            }}
                            className="btn btn-success"
                            title="Setujui Pengajuan Cuti"
                          >
                            ✅ Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onRejectLeave?.(leave.id);
                              showToast?.("Cuti Ditolak", `Pengajuan cuti ${leave.nama} telah ditolak.`, "info");
                            }}
                            className="btn btn-danger"
                            title="Tolak Pengajuan Cuti"
                          >
                            ❌ Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="small text-muted">Selesai Ditinjau</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DIKLAT & KREDENSIALING KHUSUS JIWA */}
      {subTab === "diklat" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">🎓 Diklat, Sertifikasi & Kredensialing Khusus Jiwa</h5>
              <p className="small mb-0" style={{ color: textMuted }}>
                Program pelatihan wajib penanganan de-eskalasi krisis, fiksasi fisik aman, BTCLS, dan asuhan jiwa akut
              </p>
            </div>
          </div>

          <div className="row g-3">
            {trainings.map((trn) => (
              <div key={trn.id} className="col-12 col-md-6">
                <div
                  className="p-4 rounded-3 h-100 border d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: darkMode ? "#141a29" : "#f8fafc",
                    borderColor: darkMode ? "#1f273d" : "#e2e8f0",
                  }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-info-subtle text-info fw-semibold">{trn.kategori}</span>
                      <span
                        className={`badge rounded-pill ${
                          trn.status === "Selesai"
                            ? "bg-secondary"
                            : trn.status === "Segera Dibuka"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {trn.status}
                      </span>
                    </div>
                    <h6 className="fw-bold mb-2">{trn.namaPelatihan}</h6>
                    <ul className="list-unstyled small mb-3 d-flex flex-column gap-1" style={{ color: textMuted }}>
                      <li>
                        <strong>🏢 Penyelenggara:</strong> {trn.penyelenggara}
                      </li>
                      <li>
                        <strong>🎯 Target Peserta:</strong> {trn.targetProfesi}
                      </li>
                      <li>
                        <strong>📅 Jadwal Pelaksanaan:</strong> {trn.jadwalMulai} s/d {trn.jadwalSelesai}
                      </li>
                      <li>
                        <strong>📍 Lokasi:</strong> {trn.lokasi}
                      </li>
                      <li>
                        <strong>🎖️ Akreditasi:</strong> {trn.standarAkreditasi}
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                    <span className="small fw-semibold text-success">👥 {trn.pesertaTerdaftar} Peserta Terdaftar</span>
                    <button
                      type="button"
                      onClick={() => showToast?.("Registrasi Diklat", `Pendaftaran untuk ${trn.namaPelatihan} telah diverifikasi.`, "success")}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Daftarkan Peserta Nakes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ANALITIK SDM & KINERJA */}
      {subTab === "analitik" && (
        <div
          className="rounded-4 p-4 shadow-sm"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <h5 className="fw-bold mb-3">📊 Analitik Eksekutif Ketenagaan & Kinerja SDM RSJ Tampan</h5>

          <div className="row g-4">
            {/* RATIO & ATTENDANCE CARDS */}
            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Rasio Perawat : Pasien Jiwa</span>
                <h2 className="fw-bold text-success my-2">1 : 3.8</h2>
                <small className="text-success">✅ Sesuai Standar Kemenkes RI (Ideal &lt; 1:5)</small>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Tingkat Kehadiran Shift Bulan Ini</span>
                <h2 className="fw-bold text-primary my-2">96.4%</h2>
                <small className="text-primary">Disiplin Tinggi &bull; Presensi Terpantau</small>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-3 text-center border h-100 d-flex flex-column justify-content-center"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f1f5f9", borderColor: cardBorder }}
              >
                <span className="text-muted small fw-semibold">Rata-Rata Skor Kinerja (SKP)</span>
                <h2 className="fw-bold text-info my-2">92.8 <span className="fs-6">/100</span></h2>
                <small className="text-info">Predikat: <strong>Sangat Baik</strong></small>
              </div>
            </div>

            {/* SEBARAN PROFESI SDM */}
            <div className="col-12 col-md-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f8fafc", borderColor: cardBorder }}
              >
                <h6 className="fw-bold mb-3">Distribusi Kategori Tenaga Kerja</h6>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Tenaga Keperawatan Jiwa</span>
                      <strong>124 Orang (50%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-success" style={{ width: "50%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Dokter Spesialis & Tenaga Medis</span>
                      <strong>42 Orang (17%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-primary" style={{ width: "17%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Penunjang Medis & RME SIMRS</span>
                      <strong>32 Orang (13%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-info" style={{ width: "13%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Administrasi, Manajemen & Security Krisis</span>
                      <strong>50 Orang (20%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-warning" style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEBARAN STATUS KEPEGAWAIAN */}
            <div className="col-12 col-md-6">
              <div
                className="p-3 rounded-3 border h-100"
                style={{ backgroundColor: darkMode ? "#141a29" : "#f8fafc", borderColor: cardBorder }}
              >
                <h6 className="fw-bold mb-3">Sebaran Status Kepegawaian</h6>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>PNS (Pegawai Negeri Sipil)</span>
                      <strong>135 Orang (54.4%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-primary" style={{ width: "54.4%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>PPPK (Pegawai Pemerintah PK)</span>
                      <strong>58 Orang (23.4%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-info" style={{ width: "23.4%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Pegawai Tetap BLUD</span>
                      <strong>35 Orang (14.1%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-success" style={{ width: "14.1%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Tenaga Kontrak / Alih Daya</span>
                      <strong>20 Orang (8.1%)</strong>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div className="progress-bar bg-secondary" style={{ width: "8.1%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <SdmEmployeeModal
        isOpen={isEmployeeModalOpen}
        mode={employeeModalMode}
        employee={selectedEmployee}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        darkMode={darkMode}
      />

      <SdmLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitLeave={(leaveData) => {
          onSubmitLeave(leaveData);
          showToast?.("Pengajuan Terkirim", "Permohonan cuti berhasil dikirim ke Subbag Kepegawaian.", "success");
        }}
        employees={employees}
        darkMode={darkMode}
      />
    </div>
  );
}
