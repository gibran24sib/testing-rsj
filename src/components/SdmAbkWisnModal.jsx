import React, { useState } from "react";

export default function SdmAbkWisnModal({
  isOpen,
  onClose,
  initialData = null,
  darkMode,
}) {
  const [selectedUnit, setSelectedUnit] = useState(
    initialData?.unit || "Bangsal Kampar (Akut Pria)"
  );
  const [kapasitasBed, setKapasitasBed] = useState(initialData?.kapasitasBed || 35);
  const [pasienAktif, setPasienAktif] = useState(initialData?.pasienAktif || 32);
  const [totalCareRatio, setTotalCareRatio] = useState(65); // % pasien gaduh gelisah / fiksasi
  const [tenagaTersedia, setTenagaTersedia] = useState(initialData?.tenagaTersedia || 14);
  const [wktJam, setWktJam] = useState(1840); // Jam kerja efektif per tahun (Permenpan/Kemenkes)

  if (!isOpen) return null;

  // PERHITUNGAN FORMULA WISN KEMENKES RI
  const bor = kapasitasBed > 0 ? ((pasienAktif / kapasitasBed) * 100).toFixed(1) : 0;
  
  // Waktu asuhan keperawatan jiwa per pasien per hari:
  // Pasien Total Care/Gaduh Gelisah: ~5.5 jam/hari
  // Pasien Partial/Waham-Halusinasi: ~3.5 jam/hari
  // Pasien Minimal/Mandiri: ~1.5 jam/hari
  const totalCareCount = Math.round((pasienAktif * totalCareRatio) / 100);
  const partialCareCount = pasienAktif - totalCareCount;
  
  const totalBebanJamHari = totalCareCount * 5.5 + partialCareCount * 3.0;
  const totalBebanJamTahun = totalBebanJamHari * 365;

  // Standar Kelonggaran (SK) untuk operan shift, rapat bangsal, pelatihan = 15%
  const faktorKelonggaran = 1.15;
  const kebutuhanTenagaIdeal = Math.max(
    1,
    Math.round((totalBebanJamTahun / wktJam) * faktorKelonggaran)
  );

  const selisih = tenagaTersedia - kebutuhanTenagaIdeal;
  const rasioWisn = (tenagaTersedia / kebutuhanTenagaIdeal).toFixed(2);

  const getStatusWisn = () => {
    if (rasioWisn < 0.8) return { label: "Defisit Kritis (Kurang Tenaga)", color: "danger", icon: "🚨" };
    if (rasioWisn < 0.95) return { label: "Defisit Ringan", color: "warning", icon: "⚠️" };
    if (rasioWisn <= 1.1) return { label: "Seimbang (Ideal)", color: "success", icon: "✅" };
    return { label: "Surplus Tenaga (Berlebih)", color: "info", icon: "ℹ️" };
  };

  const status = getStatusWisn();

  const modalBg = darkMode ? "#111624" : "#ffffff";
  const modalText = darkMode ? "#ffffff" : "#0f172a";
  const inputBg = darkMode ? "#181d2e" : "#f8fafc";
  const cardSubBg = darkMode ? "#141a29" : "#f1f5f9";
  const borderColor = darkMode ? "#1e293b" : "#e2e8f0";

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
          maxWidth: "850px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
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
              className="rounded-circle d-flex align-items-center justify-content-center fs-5"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
              }}
            >
              🧮
            </div>
            <div>
              <h5 className="mb-0 fw-bold" style={{ fontSize: "1.1rem" }}>
                Kalkulator Analisis Beban Kerja (ABK - Metode WISN Kemenkes)
              </h5>
              <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                Workload Indicators of Staffing Need • Permenkes RI No. 33 / Permenpan RB
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

        {/* BODY */}
        <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          {/* SIMULATION CONTROLS */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Pilih Unit Bangsal Jiwa</label>
              <select
                className="form-select form-select-sm"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                style={{ backgroundColor: inputBg, color: modalText, borderColor }}
              >
                <option value="Bangsal Kampar (Akut Pria)">Bangsal Kampar (Akut Pria - Gaduh Gelisah)</option>
                <option value="Bangsal Siak (Wanita)">Bangsal Siak (Wanita - Akut & Subakut)</option>
                <option value="IGD Jiwa & Krisis 24 Jam">IGD Jiwa & Krisis 24 Jam</option>
                <option value="Bangsal Rokan (Rehabilitasi NAPZA)">Bangsal Rokan (Rehabilitasi NAPZA)</option>
                <option value="Bangsal Indragiri (Tenang & Isolasi)">Bangsal Indragiri (Tenang & Isolasi)</option>
                <option value="Poli Jiwa & Klinik Terpadu">Poli Jiwa & Klinik Terpadu</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">
                Kapasitas Tempat Tidur (Bed): <strong>{kapasitasBed}</strong>
              </label>
              <input
                type="range"
                className="form-range"
                min="5"
                max="50"
                value={kapasitasBed}
                onChange={(e) => setKapasitasBed(Number(e.target.value))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">
                Pasien Dirawat: <strong>{pasienAktif} Pasien</strong> (BOR: {bor}%)
              </label>
              <input
                type="range"
                className="form-range"
                min="1"
                max={kapasitasBed}
                value={pasienAktif}
                onChange={(e) => setPasienAktif(Number(e.target.value))}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">
                Proporsi Pasien Akut / Total Care (Restrain & Fiksasi): <strong>{totalCareRatio}%</strong>
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
                value={totalCareRatio}
                onChange={(e) => setTotalCareRatio(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted" style={{ fontSize: "0.72rem" }}>
                <span>{totalCareCount} Pasien Total Care</span>
                <span>{partialCareCount} Pasien Partial Care</span>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">
                Nakes Tersedia Riil: <strong>{tenagaTersedia} Orang</strong>
              </label>
              <input
                type="range"
                className="form-range"
                min="1"
                max="30"
                value={tenagaTersedia}
                onChange={(e) => setTenagaTersedia(Number(e.target.value))}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">WKT (Jam Kerja Efektif/Thn)</label>
              <select
                className="form-select form-select-sm"
                value={wktJam}
                onChange={(e) => setWktJam(Number(e.target.value))}
                style={{ backgroundColor: inputBg, color: modalText, borderColor }}
              >
                <option value={1840}>1.840 Jam (40 Jam/Minggu ASN)</option>
                <option value={1720}>1.720 Jam (Shift 3 Rotasi RSJ)</option>
                <option value={1920}>1.920 Jam (Standar Maksimal)</option>
              </select>
            </div>
          </div>

          {/* SIMULATION RESULTS CARDS */}
          <div
            className="p-3 rounded-4 mb-3 border"
            style={{
              backgroundColor: cardSubBg,
              borderColor,
            }}
          >
            <div className="row g-3 text-center align-items-center">
              <div className="col-md-3 border-end">
                <span className="small text-muted d-block">Tenaga Tersedia Riil</span>
                <h3 className="fw-bold my-1 text-primary">{tenagaTersedia} <span className="fs-6">Ners</span></h3>
                <small className="text-muted" style={{ fontSize: "0.72rem" }}>Eksisting di Bangsal</small>
              </div>

              <div className="col-md-3 border-end">
                <span className="small text-muted d-block">Kebutuhan Ideal (WISN)</span>
                <h3 className="fw-bold my-1 text-success">{kebutuhanTenagaIdeal} <span className="fs-6">Ners</span></h3>
                <small className="text-muted" style={{ fontSize: "0.72rem" }}>Beban Kerja Terhitung</small>
              </div>

              <div className="col-md-3 border-end">
                <span className="small text-muted d-block">Selisih Formasi</span>
                <h3
                  className={`fw-bold my-1 ${
                    selisih < 0 ? "text-danger" : selisih === 0 ? "text-success" : "text-info"
                  }`}
                >
                  {selisih > 0 ? `+${selisih}` : selisih} <span className="fs-6">Ners</span>
                </h3>
                <small className="text-muted" style={{ fontSize: "0.72rem" }}>
                  {selisih < 0 ? "Kekurangan Tenaga" : selisih === 0 ? "Ideal Pas" : "Kelebihan Formasi"}
                </small>
              </div>

              <div className="col-md-3">
                <span className="small text-muted d-block">Rasio WISN</span>
                <h3 className="fw-bold my-1 text-warning">{rasioWisn}</h3>
                <span className={`badge bg-${status.color} rounded-pill px-2 py-1`} style={{ fontSize: "0.68rem" }}>
                  {status.icon} {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* REKOMENDASI MANAJERIAL OTOMATIS */}
          <div
            className="p-3 rounded-3 border"
            style={{
              backgroundColor: darkMode ? "#1a2238" : "#ecfdf5",
              borderColor: darkMode ? "#232e4d" : "#a7f3d0",
            }}
          >
            <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
              <span>📋</span> Rekomendasi Manajerial Kepegawaian RSJ Tampan
            </h6>
            <ul className="small mb-0 ps-3 d-flex flex-column gap-1 text-muted">
              <li>
                <strong>Hasil Analisis Ketenagaan:</strong> {selectedUnit} saat ini membutuhkan{" "}
                <strong className="text-success">{kebutuhanTenagaIdeal} tenaga ners</strong> untuk menangani{" "}
                {pasienAktif} pasien aktif (BOR {bor}%).
              </li>
              <li>
                {selisih < 0 ? (
                  <span className="text-danger fw-semibold">
                    ⚠️ Defisit {Math.abs(selisih)} Ners Jiwa. Direkomendasikan pembukaan usulan formasi PPPK /
                    penambahan perawat perbantuan shift malam untuk mencegah kelelahan fisik nakes (burnout).
                  </span>
                ) : (
                  <span className="text-success fw-semibold">
                    ✅ Kapasitas ketenagaan di unit ini memenuhi standar rasio aman Kemenkes RI (&lt; 1 : 4 untuk bangsal jiwa akut).
                  </span>
                )}
              </li>
              <li>
                <strong>Rasio Ketergantungan:</strong> {totalCareCount} pasien membutuhkan asuhan intensif (observasi 15 menit, penanganan restrain aman zero-injury).
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 border-top"
          style={{ borderColor }}
        >
          <small className="text-muted">
            Formula: <em>Kebutuhan = (Total Beban Waktu Tindakan / WKT) × Faktor Kelonggaran (1.15)</em>
          </small>
          <button type="button" className="btn btn-success px-4" onClick={onClose}>
            Tutup Simulasi
          </button>
        </div>
      </div>
    </div>
  );
}
