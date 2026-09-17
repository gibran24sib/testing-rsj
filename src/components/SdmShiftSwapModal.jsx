import React, { useState } from "react";

export default function SdmShiftSwapModal({
  isOpen,
  onClose,
  employees = [],
  currentWard = "Bangsal Kampar (Akut Pria)",
  currentUser,
  darkMode,
  onSubmitSwap,
}) {
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentShift, setCurrentShift] = useState("Pagi (07:30 - 14:00)");
  const [targetShift, setTargetShift] = useState("Malam (20:30 - 07:30)");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter possible swap partners (nurses/staff in the same ward or category)
  const availablePartners = employees.filter(
    (e) => e.kategori === "Keperawatan" || e.unitPenempatan.includes(currentWard.split(" ")[0])
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetEmployeeId || !reason.trim()) {
      alert("Mohon pilih rekan perawat pengganti dan isi alasan pertukaran dinas.");
      return;
    }

    const partner = employees.find((e) => e.id === targetEmployeeId);

    setIsSubmitting(true);
    const newSwap = {
      id: `SWAP-${Date.now().toString().slice(-4)}`,
      applicantName: currentUser?.nama || "Ns. Budi Setiawan, S.Kep",
      partnerName: partner?.nama || "Rekan Perawat",
      ward: currentWard,
      date: shiftDate,
      applicantShift: currentShift,
      partnerShift: targetShift,
      reason: reason,
      status: "Menunggu Persetujuan Karu",
      tanggalPengajuan: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      onSubmitSwap?.(newSwap);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const inputClass = `form-control form-control-sm ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;
  const selectClass = `form-select form-select-sm ${
    darkMode ? "bg-dark text-white border-secondary" : ""
  }`;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1060,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "540px" }}>
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
              <span className="fs-5">🔄</span>
              <div>
                <h6 className="modal-title fw-bold mb-0" style={{ fontSize: "1rem" }}>
                  Formulir Permohonan Tukar Shift Jaga
                </h6>
                <small className="opacity-75" style={{ fontSize: "0.72rem" }}>
                  Pelimpahan dinas jaga 24/7 bangsal jiwa RSJ Tampan
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

          {/* MODAL BODY */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div
                className="p-3 rounded-3 mb-3 border"
                style={{
                  backgroundColor: darkMode ? "#161e36" : "#eff6ff",
                  borderColor: darkMode ? "#23304d" : "#bfdbfe",
                  fontSize: "0.78rem",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span>ℹ️</span>
                  <strong>Ketentuan Tukar Dinas Bangsal Jiwa:</strong>
                </div>
                <ul className="mb-0 ps-3">
                  <li>Tukar shift wajib disepakati kedua belah pihak tanpa paksaan.</li>
                  <li>Perawat pengganti wajib memiliki kualifikasi kompetensi klinis setara.</li>
                  <li>Persetujuan akhir diverifikasi oleh Kepala Ruangan (Karu) bersangkutan.</li>
                </ul>
              </div>

              <div className="row g-3">
                {/* UNIT / BANGSAL */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Unit / Bangsal Jaga</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={currentWard}
                    disabled
                  />
                </div>

                {/* TANGGAL SHIFT */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Tanggal Shift <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className={inputClass}
                    required
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                  />
                </div>

                {/* REKAN PENGGANTI */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Rekan Pengganti <span className="text-danger">*</span></label>
                  <select
                    className={selectClass}
                    required
                    value={targetEmployeeId}
                    onChange={(e) => setTargetEmployeeId(e.target.value)}
                  >
                    <option value="">-- Pilih Perawat --</option>
                    {availablePartners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.unitPenempatan.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* SHIFT ASAL */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Shift Asal (Pemohon) <span className="text-danger">*</span></label>
                  <select
                    className={selectClass}
                    value={currentShift}
                    onChange={(e) => setCurrentShift(e.target.value)}
                  >
                    <option value="Pagi (07:30 - 14:00)">Pagi (07:30 - 14:00)</option>
                    <option value="Sore (14:00 - 20:30)">Sore (14:00 - 20:30)</option>
                    <option value="Malam (20:30 - 07:30)">Malam (20:30 - 07:30)</option>
                  </select>
                </div>

                {/* SHIFT TUJUAN */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Ditukar Menjadi <span className="text-danger">*</span></label>
                  <select
                    className={selectClass}
                    value={targetShift}
                    onChange={(e) => setTargetShift(e.target.value)}
                  >
                    <option value="Sore (14:00 - 20:30)">Sore (14:00 - 20:30)</option>
                    <option value="Malam (20:30 - 07:30)">Malam (20:30 - 07:30)</option>
                    <option value="Pagi (07:30 - 14:00)">Pagi (07:30 - 14:00)</option>
                    <option value="Lepas / Libur Jaga">Lepas / Libur Jaga</option>
                  </select>
                </div>

                {/* ALASAN PERMOHONAN */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Alasan Pertukaran Shift <span className="text-danger">*</span></label>
                  <textarea
                    rows={2}
                    className={inputClass}
                    required
                    placeholder="Contoh: Menghadiri pelatihan kompetensi BCLS Jiwa / Keperluan keluarga mendesak..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
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
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-sm btn-success px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Mengirim Permohonan...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Kirim Permohonan Tukar Shift</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
