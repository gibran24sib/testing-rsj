import React from "react";

export default function BangsalModal({
  selectedBangsal,
  setSelectedBangsal,
  darkMode,
  cardBg,
}) {
  if (!selectedBangsal) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}>
          <div className="modal-header border-0 pb-0">
            <div>
              <span className="badge badge-soft-primary mb-1">
                {selectedBangsal.tipe}
              </span>
              <h5 className="modal-title fw-bold mb-0">
                🏥 {selectedBangsal.nama}
              </h5>
            </div>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={() => setSelectedBangsal(null)}
            ></button>
          </div>
          <div className="modal-body py-3">
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div
                  className={`p-2 rounded border ${
                    darkMode ? "bg-dark border-secondary" : "bg-light"
                  }`}
                >
                  <small className="opacity-75 d-block">Kepala Ruangan:</small>
                  <strong className="small">{selectedBangsal.kepalaRuangan}</strong>
                </div>
              </div>
              <div className="col-6">
                <div
                  className={`p-2 rounded border ${
                    darkMode ? "bg-dark border-secondary" : "bg-light"
                  }`}
                >
                  <small className="opacity-75 d-block">Lokasi Ruangan:</small>
                  <strong className="small">{selectedBangsal.lokasi}</strong>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between small fw-bold mb-1">
                <span>Kapasitas Ranjang:</span>
                <span>
                  {selectedBangsal.terisi} / {selectedBangsal.kapasitas} Bed Terisi
                </span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${(selectedBangsal.terisi / selectedBangsal.kapasitas) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <h6 className="fw-bold small mb-2">Fasilitas Keamanan & Medis:</h6>
            <ul className="small mb-0 ps-3 opacity-75">
              {selectedBangsal.fasilitas.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedBangsal(null)}
            >
              Tutup
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm fw-semibold"
              onClick={() => {
                alert(`Permintaan distribusi logistik ke ${selectedBangsal.nama} diteruskan ke Gudang Farmasi!`);
                setSelectedBangsal(null);
              }}
            >
              📦 Ajukan Alokasi Logistik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
