import React, { useState } from "react";
import SdmLiveCameraPresensiModal from "./SdmLiveCameraPresensiModal";

export default function SdmPresensiModal({
  isOpen,
  onClose,
  employees = [],
  onSubmitAttendance,
  darkMode,
}) {
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedShift, setSelectedShift] = useState("Pagi (07.30 - 14.30 WIB)");
  const [tipePresensi, setTipePresensi] = useState("Masuk"); // "Masuk" | "Pulang"
  const [catatanDinas, setCatatanDinas] = useState("");
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [customCapturedPhoto, setCustomCapturedPhoto] = useState(null);

  if (!isOpen) return null;

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId);

  const handleOpenLiveCamera = () => {
    if (!selectedEmpId) {
      alert("Silakan pilih nama pegawai terlebih dahulu.");
      return;
    }
    setIsLiveCameraOpen(true);
  };

  const handleLiveCameraSuccess = (attendanceRecord) => {
    onSubmitAttendance(attendanceRecord);
    setIsLiveCameraOpen(false);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmpId) {
      alert("Silakan pilih nama pegawai untuk presensi shift.");
      return;
    }

    const emp = selectedEmployee;
    const now = new Date();
    const jamStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const tglStr = now.toISOString().split("T")[0];

    // Deteksi keterlambatan sederhana
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let statusKehadiran = "Hadir Tepat Waktu";
    let keterlambatan = 0;

    if (selectedShift.startsWith("Pagi") && (hours > 7 || (hours === 7 && minutes > 30))) {
      keterlambatan = (hours - 7) * 60 + (minutes - 30);
      statusKehadiran = `Terlambat (${keterlambatan} Menit)`;
    }

    const newLog = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      nama: emp.nama,
      profesi: emp.profesi,
      unit: emp.unitPenempatan,
      shift: selectedShift,
      tanggal: tglStr,
      jamMasuk: tipePresensi === "Masuk" ? jamStr : "07.30 WIB",
      jamPulang: tipePresensi === "Pulang" ? jamStr : "-",
      statusKehadiran: statusKehadiran,
      keterlambatanMenit: keterlambatan,
      lokasiGps: "0.4578° N, 101.3789° E (Radius RSJ: 15 Meter - Valid)",
      metode: customCapturedPhoto ? "Kamera Device Langsung & GPS Live" : "Swafoto Wajah & Geolocation",
      fotoPresensi: customCapturedPhoto || emp.foto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120",
    };

    onSubmitAttendance(newLog);
    onClose();
  };

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const inputBg = darkMode ? "#181d2e" : "#f8fafc";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";

  return (
    <>
      <div
        className="modal-backdrop-custom d-flex align-items-center justify-content-center animate-fade-in"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
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
            maxWidth: "600px",
            border: `1px solid ${borderColor}`,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
            style={{ borderColor }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fs-5 shadow-sm"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                ⏱️
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                  E-Presensi Shift Nakes
                </h5>
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Absensi Digital GPS & Swafoto Langsung Kamera Device
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

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-4 d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-semibold">Pilih Pegawai / Nakes Bertugas *</label>
              <select
                className="form-select"
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  setCustomCapturedPhoto(null);
                }}
                required
                style={{ backgroundColor: inputBg, color: modalText, borderColor }}
              >
                <option value="">-- Pilih Pegawai --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nama} ({emp.profesi} - {emp.unitPenempatan})
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Pilih Shift Dinas</label>
                <select
                  className="form-select"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  style={{ backgroundColor: inputBg, color: modalText, borderColor }}
                >
                  <option value="Pagi (07.30 - 14.30 WIB)">🌅 Shift Pagi (07.30 - 14.30)</option>
                  <option value="Sore (14.30 - 21.00 WIB)">☀️ Shift Sore (14.30 - 21.00)</option>
                  <option value="Malam (21.00 - 07.30 WIB)">🌙 Shift Malam (21.00 - 07.30)</option>
                  <option value="Non-Shift (08.00 - 16.00 WIB)">🏢 Non-Shift Manajemen (08.00 - 16.00)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Jenis Presensi</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn w-50 btn-sm ${tipePresensi === "Masuk" ? "btn-success fw-bold" : "btn-outline-secondary"}`}
                    onClick={() => setTipePresensi("Masuk")}
                  >
                    🟢 Check-In Masuk
                  </button>
                  <button
                    type="button"
                    className={`btn w-50 btn-sm ${tipePresensi === "Pulang" ? "btn-primary fw-bold" : "btn-outline-secondary"}`}
                    onClick={() => setTipePresensi("Pulang")}
                  >
                    🔴 Check-Out Pulang
                  </button>
                </div>
              </div>
            </div>

            {/* KAMERA DEVICE LANGSUNG & GEOFENCE STATUS */}
            <div
              className="p-3 rounded-3 border"
              style={{
                backgroundColor: darkMode ? "#141a29" : "#f1f5f9",
                borderColor,
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-semibold text-success d-flex align-items-center gap-1">
                  <span>📍</span> Geofencing GPS: <strong>RSJ Tampan Pekanbaru</strong>
                </span>
                <span className="badge bg-success-subtle text-success">Radius 15m (Valid)</span>
              </div>

              <div
                className="p-3 rounded-3 text-center border d-flex flex-column align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor: darkMode ? "#1c2438" : "#ffffff",
                  borderColor,
                  minHeight: "110px",
                }}
              >
                {customCapturedPhoto ? (
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={customCapturedPhoto}
                      alt="Captured Live"
                      className="rounded-3 border border-2 border-success"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div className="text-start">
                      <strong className="d-block text-success small">✅ Swafoto Kamera Berhasil Diambil</strong>
                      <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                        Watermark Geolocation GPS & Waktu telah disematkan.
                      </small>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="small fw-semibold text-muted">
                      Ambil foto presensi secara langsung lewat kamera/webcam device
                    </span>
                    <button
                      type="button"
                      disabled={!selectedEmpId}
                      className="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold hover-lift d-flex align-items-center gap-2 shadow-sm"
                      onClick={handleOpenLiveCamera}
                    >
                      <span>📸</span>
                      <span>Buka Kamera Device Langsung</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="form-label small fw-semibold">Catatan Serah Terima / Handover Dinas (Opsional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Operan pasien kamar 3 tenang, fiksasi dibuka pukul 10.00 WIB"
                value={catatanDinas}
                onChange={(e) => setCatatanDinas(e.target.value)}
                style={{ backgroundColor: inputBg, color: modalText, borderColor }}
              />
            </div>

            <div
              className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top mt-2"
              style={{ borderColor }}
            >
              <button type="button" className="btn btn-secondary px-3" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-success px-4 fw-semibold d-flex align-items-center gap-2">
                <span>⏱️</span>
                <span>Kirim Presensi {tipePresensi}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* LIVE CAMERA MODAL DARI SDM PRESENSI */}
      {isLiveCameraOpen && selectedEmployee && (
        <SdmLiveCameraPresensiModal
          isOpen={isLiveCameraOpen}
          onClose={() => setIsLiveCameraOpen(false)}
          employeeName={selectedEmployee.nama}
          employeeUnit={selectedEmployee.unitPenempatan}
          employeeProfesi={selectedEmployee.profesi}
          employeeId={selectedEmployee.id}
          shift={selectedShift}
          tipe={tipePresensi}
          onConfirmAttendance={handleLiveCameraSuccess}
          darkMode={darkMode}
        />
      )}
    </>
  );
}

