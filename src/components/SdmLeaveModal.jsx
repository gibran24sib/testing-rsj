import React, { useState } from "react";

export default function SdmLeaveModal({
  isOpen,
  onClose,
  onSubmitLeave,
  employees = [],
  darkMode,
}) {
  const [formData, setFormData] = useState({
    employeeId: "",
    jenisCuti: "Cuti Tahunan",
    tanggalMulai: "",
    tanggalSelesai: "",
    jumlahHari: 1,
    alasan: "",
    petugasPengganti: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "tanggalMulai" || name === "tanggalSelesai") {
        if (updated.tanggalMulai && updated.tanggalSelesai) {
          const d1 = new Date(updated.tanggalMulai);
          const d2 = new Date(updated.tanggalSelesai);
          const diffTime = Math.abs(d2 - d1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          updated.jumlahHari = isNaN(diffDays) || diffDays < 1 ? 1 : diffDays;
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.tanggalMulai || !formData.tanggalSelesai || !formData.alasan) {
      alert("Mohon lengkapi seluruh kolom formulir pengajuan cuti.");
      return;
    }

    const selectedEmp = employees.find((emp) => emp.id === formData.employeeId);

    const payload = {
      id: `CUTI-${Date.now().toString().slice(-4)}`,
      employeeId: formData.employeeId,
      nama: selectedEmp ? selectedEmp.nama : "Pegawai RSJ",
      profesi: selectedEmp ? selectedEmp.profesi : "-",
      unit: selectedEmp ? selectedEmp.unitPenempatan : "-",
      jenisCuti: formData.jenisCuti,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      jumlahHari: Number(formData.jumlahHari),
      alasan: formData.alasan,
      petugasPengganti: formData.petugasPengganti || "-",
      tanggalPengajuan: new Date().toISOString().split("T")[0],
      status: "Menunggu Persetujuan",
      disetujuiOleh: "-",
      catatan: "Pengajuan baru melalui sistem SIM-SDM RSJ Tampan.",
    };

    onSubmitLeave(payload);
    onClose();
  };

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const inputBg = darkMode ? "#181d2e" : "#f8fafc";
  const inputBorder = darkMode ? "#26304d" : "#cbd5e1";
  const labelColor = darkMode ? "#94a3b8" : "#475569";

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
          maxWidth: "650px",
          border: darkMode ? "1px solid #1e293b" : "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
          style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fs-5"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
              }}
            >
              🏖️
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                Form Pengajuan Cuti Pegawai
              </h5>
              <small style={{ color: labelColor, fontSize: "0.8rem" }}>
                Pelayanan Cuti & Izin Tenaga Medis / Non-Medis RSJ Tampan
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

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-4 d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold" style={{ color: labelColor }}>
              Pilih Pegawai / Pemohon Cuti *
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="form-select"
              style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
            >
              <option value="">-- Pilih Pegawai --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nama} ({emp.profesi} - {emp.unitPenempatan}) [Sisa Cuti: {emp.sisaCuti} Hari]
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                Jenis Cuti *
              </label>
              <select
                name="jenisCuti"
                value={formData.jenisCuti}
                onChange={handleChange}
                className="form-select"
                style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
              >
                <option value="Cuti Tahunan">Cuti Tahunan</option>
                <option value="Cuti Sakit">Cuti Sakit</option>
                <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                <option value="Cuti Alasan Penting">Cuti Alasan Penting</option>
                <option value="Cuti Seminar / Tugas Belajar Singkat">Cuti Seminar / Tugas Belajar</option>
                <option value="Cuti Besar">Cuti Besar</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                Durasi Cuti (Hari Kerja)
              </label>
              <input
                type="number"
                name="jumlahHari"
                value={formData.jumlahHari}
                onChange={handleChange}
                min="1"
                max="30"
                className="form-control"
                style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                Tanggal Mulai *
              </label>
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                required
                className="form-control"
                style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ color: labelColor }}>
                Tanggal Selesai *
              </label>
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                required
                className="form-control"
                style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
              />
            </div>
          </div>

          <div>
            <label className="form-label small fw-semibold" style={{ color: labelColor }}>
              Petugas Pengganti / Pelimpahan Tugas (Handover)
            </label>
            <input
              type="text"
              name="petugasPengganti"
              value={formData.petugasPengganti}
              onChange={handleChange}
              placeholder="Nama rekan sejawat yang menggantikan jadwal tugas/shift"
              className="form-control"
              style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
            />
          </div>

          <div>
            <label className="form-label small fw-semibold" style={{ color: labelColor }}>
              Alasan / Keterangan Pengajuan Cuti *
            </label>
            <textarea
              name="alasan"
              value={formData.alasan}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Jelaskan alasan atau keperluan pengajuan cuti secara ringkas..."
              className="form-control"
              style={{ backgroundColor: inputBg, color: modalText, borderColor: inputBorder }}
            />
          </div>

          <div
            className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top mt-2"
            style={{ borderColor: darkMode ? "#1e293b" : "#e2e8f0" }}
          >
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-warning px-4 fw-semibold text-dark d-flex align-items-center gap-2">
              <span>📤</span>
              <span>Kirim Pengajuan Cuti</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
