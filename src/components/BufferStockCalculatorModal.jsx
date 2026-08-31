import React, { useState } from "react";
import { bangsalList } from "../data/bangsalData";
import { initialInventory } from "../data/initialData";

export default function BufferStockCalculatorModal({
  show,
  onClose,
  darkMode,
}) {
  const [selectedBangsalId, setSelectedBangsalId] = useState(bangsalList[0]?.id || "B-01");
  const [selectedItemId, setSelectedItemId] = useState(initialInventory[0]?.id || "B001");
  const [dosisPerPasien, setDosisPerPasien] = useState(2); // unit/pasien/hari
  const [leadTimeDays, setLeadTimeDays] = useState(3); // hari tunggu PBF
  const [bufferDays, setBufferDays] = useState(7); // hari buffer cadangan

  if (!show) return null;

  const currentBangsal = bangsalList.find((b) => b.id === selectedBangsalId) || bangsalList[0];
  const currentItem = initialInventory.find((i) => i.id === selectedItemId) || initialInventory[0];

  const totalPasien = currentBangsal.terisi;
  const konsumsiHarian = totalPasien * Number(dosisPerPasien);
  const leadTimeDemand = konsumsiHarian * Number(leadTimeDays);
  const safetyStock = Math.round(konsumsiHarian * (Number(bufferDays) * 0.5));
  const totalRekomendasiStok = leadTimeDemand + safetyStock;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
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
                  width: "36px",
                  height: "36px",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#6366f1",
                  fontSize: "1.1rem",
                }}
              >
                🧮
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Kalkulator Buffer Stock & Safety Estimator</h5>
                <small className="opacity-75">Perhitungan Kebutuhan Obat Bangsal Standar Farmasi RS</small>
              </div>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3 mb-4">
              {/* PILIH BANGSAL */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Pilih Ruangan / Bangsal</label>
                <select
                  className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                  value={selectedBangsalId}
                  onChange={(e) => setSelectedBangsalId(e.target.value)}
                >
                  {bangsalList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama} ({b.terisi} Pasien Terisi)
                    </option>
                  ))}
                </select>
              </div>

              {/* PILIH OBAT / ALKES */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Pilih Logistik Farmasi</label>
                <select
                  className={`form-select ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  {initialInventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} ({item.kategori})
                    </option>
                  ))}
                </select>
              </div>

              {/* PARAMETER INPUT */}
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Dosis / Kebutuhan per Pasien</label>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={dosisPerPasien}
                    onChange={(e) => setDosisPerPasien(Math.max(1, Number(e.target.value)))}
                  />
                  <span className={`input-group-text ${darkMode ? "bg-dark text-white border-secondary" : ""}`}>
                    {currentItem.satuan}/hari
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Lead Time PBF (Waktu Tunggu)</label>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Math.max(1, Number(e.target.value)))}
                  />
                  <span className={`input-group-text ${darkMode ? "bg-dark text-white border-secondary" : ""}`}>
                    Hari
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold">Periode Cadangan Buffer</label>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${darkMode ? "bg-dark text-white border-secondary" : ""}`}
                    value={bufferDays}
                    onChange={(e) => setBufferDays(Math.max(1, Number(e.target.value)))}
                  />
                  <span className={`input-group-text ${darkMode ? "bg-dark text-white border-secondary" : ""}`}>
                    Hari
                  </span>
                </div>
              </div>
            </div>

            {/* HASIL ESTIMASI */}
            <div
              className="p-4 rounded-4"
              style={{
                backgroundColor: darkMode ? "#141829" : "#f0fdf4",
                border: darkMode ? "1px solid #232c42" : "1px solid #bbf7d0",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-opacity-10 pb-2">
                <h6 className="fw-bold mb-0">📊 Hasil Rekomendasi Alokasi Logistik Bangsal</h6>
                <span className="badge badge-soft-success">Formula Standar Farmasi</span>
              </div>

              <div className="row g-3 text-center mb-3">
                <div className="col-4">
                  <span className="small opacity-75 d-block">Konsumsi Harian:</span>
                  <h4 className="fw-bold mb-0 text-primary">
                    {konsumsiHarian} <span className="fs-6 fw-normal opacity-75">{currentItem.satuan}</span>
                  </h4>
                  <small className="opacity-50 font-monospace">({totalPasien} Pasien x {dosisPerPasien})</small>
                </div>

                <div className="col-4">
                  <span className="small opacity-75 d-block">Kebutuhan Lead Time:</span>
                  <h4 className="fw-bold mb-0 text-warning">
                    {leadTimeDemand} <span className="fs-6 fw-normal opacity-75">{currentItem.satuan}</span>
                  </h4>
                  <small className="opacity-50 font-monospace">({leadTimeDays} Hari Tunggu)</small>
                </div>

                <div className="col-4">
                  <span className="small opacity-75 d-block">Safety Buffer Stock:</span>
                  <h4 className="fw-bold mb-0 text-info">
                    {safetyStock} <span className="fs-6 fw-normal opacity-75">{currentItem.satuan}</span>
                  </h4>
                  <small className="opacity-50 font-monospace">({bufferDays} Hari Buffer)</small>
                </div>
              </div>

              <div
                className="p-3 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2 mt-2"
                style={{
                  backgroundColor: darkMode ? "#0c101c" : "#ffffff",
                  border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
                }}
              >
                <div>
                  <small className="opacity-75 d-block">TOTAL MINIMUM PERSEDIAAN AMAN:</small>
                  <h3 className="fw-bold mb-0 text-success">
                    {totalRekomendasiStok} {currentItem.satuan} {currentItem.nama}
                  </h3>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-success fw-semibold"
                  onClick={() => {
                    alert(`Permintaan alokasi ${totalRekomendasiStok} ${currentItem.satuan} ke ${currentBangsal.nama} telah dimasukkan ke draf PO Farmasi.`);
                    onClose();
                  }}
                >
                  📥 Ajukan Alokasi ke Gudang
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
