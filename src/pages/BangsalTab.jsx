import React, { useState } from "react";
import { bangsalList } from "../data/bangsalData";
import BangsalModal from "../components/BangsalModal";

export default function BangsalTab({ darkMode, cardBg, tableTheme }) {
  const [selectedBangsal, setSelectedBangsal] = useState(null);
  const [filterType, setFilterType] = useState("semua");

  const filteredBangsal = bangsalList.filter((b) => {
    if (filterType === "semua") return true;
    return b.tipe.toLowerCase().includes(filterType.toLowerCase());
  });

  const totalKapasitas = bangsalList.reduce((acc, b) => acc + b.kapasitas, 0);
  const totalTerisi = bangsalList.reduce((acc, b) => acc + b.terisi, 0);
  const bedTersedia = totalKapasitas - totalTerisi;

  return (
    <div className="mb-5 animate-fade-in">
      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <span className="small opacity-75 d-block">Kapasitas Bed Total</span>
            <h4 className="fw-bold mb-0 text-primary">
              {totalKapasitas} <span className="fs-6 fw-normal opacity-75">Bed</span>
            </h4>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <span className="small opacity-75 d-block">Pasien Rawat Inap</span>
            <h4 className="fw-bold mb-0 text-warning">
              {totalTerisi} <span className="fs-6 fw-normal opacity-75">Pasien</span>
            </h4>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <span className="small opacity-75 d-block">Ketersediaan Bed Kosong</span>
            <h4 className="fw-bold mb-0 text-success">
              {bedTersedia} <span className="fs-6 fw-normal opacity-75">Bed Siap</span>
            </h4>
          </div>
        </div>
      </div>

      {/* FILTER HEADER */}
      <div
        className="p-3 rounded-4 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
        style={{
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
        }}
      >
        <div>
          <h6 className="mb-0 fw-bold">Monitoring Bangsal Rawat Kejiwaan</h6>
          <small className="opacity-75">{filteredBangsal.length} Ruangan Aktif</small>
        </div>

        <select
          className={`form-select form-select-sm ${
            darkMode ? "bg-dark text-white border-secondary" : ""
          }`}
          style={{ width: "auto" }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="semua">Semua Bangsal</option>
          <option value="Akut">Bangsal Akut</option>
          <option value="NAPZA">Rehabilitasi NAPZA</option>
          <option value="Lansia">Psikogeriatri (Lansia)</option>
          <option value="Anak">Anak & Remaja</option>
        </select>
      </div>

      {/* GRID BANGSAL CARDS */}
      <div className="row g-3">
        {filteredBangsal.map((bangsal) => {
          const persenTerisi = Math.round((bangsal.terisi / bangsal.kapasitas) * 100);
          return (
            <div key={bangsal.id} className="col-md-6 col-lg-4">
              <div
                className={`card h-100 shadow-sm p-4 rounded-4 clean-card ${cardBg}`}
                style={{
                  border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-0">{bangsal.nama}</h6>
                    <span className="badge badge-soft-secondary small">
                      {bangsal.tipe}
                    </span>
                  </div>
                  <span className="badge badge-soft-success small">
                    {bangsal.status}
                  </span>
                </div>

                <p className="small opacity-75 mb-3">
                  📍 {bangsal.lokasi} <br />
                  👨‍⚕️ {bangsal.kepalaRuangan}
                </p>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small fw-medium mb-1">
                    <span>Hunian Pasien:</span>
                    <span>{bangsal.terisi} / {bangsal.kapasitas} ({persenTerisi}%)</span>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar ${
                        persenTerisi > 80 ? "bg-danger" : "bg-success"
                      }`}
                      style={{ width: `${persenTerisi}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto pt-2 border-top border-opacity-10 d-flex justify-content-between align-items-center">
                  <small className="opacity-75">
                    Sisa Bed: <b className="text-success">{bangsal.kapasitas - bangsal.terisi}</b>
                  </small>
                  <button
                    className="btn btn-sm btn-outline-primary py-1 px-2"
                    style={{ fontSize: "0.78rem" }}
                    onClick={() => setSelectedBangsal(bangsal)}
                  >
                    Detail & Logistik &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      <BangsalModal
        selectedBangsal={selectedBangsal}
        setSelectedBangsal={setSelectedBangsal}
        darkMode={darkMode}
        cardBg={cardBg}
      />
    </div>
  );
}
