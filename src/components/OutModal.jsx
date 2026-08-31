import React from "react";
import { distributionDestinationOptions } from "../data/initialData";

export default function OutModal({
  showOutModal,
  setShowOutModal,
  outItem,
  setOutItem,
  handleOutSubmit,
  darkMode,
  cardBg,
}) {
  if (!showOutModal || !outItem.item) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-danger">
              📤 Catat Barang Keluar
            </h5>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={() => setShowOutModal(false)}
            ></button>
          </div>
          <form onSubmit={handleOutSubmit}>
            <div className="modal-body py-3">
              <div
                className={`p-2 rounded mb-3 border ${
                  darkMode ? "bg-dark border-secondary" : "bg-light"
                }`}
              >
                <small className="opacity-75 d-block">Barang terpilih:</small>
                <strong>
                  {outItem.item.nama} ({outItem.item.id})
                </strong>
                <div className="small opacity-75 mt-1">
                  Sisa stok saat ini:{" "}
                  <b>
                    {outItem.item.stok} {outItem.item.satuan}
                  </b>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Jumlah Barang Keluar
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  min="1"
                  max={outItem.item.stok}
                  required
                  value={outItem.jumlahOut}
                  onChange={(e) =>
                    setOutItem({ ...outItem, jumlahOut: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Tujuan Distribusi
                </label>
                <select
                  className={`form-select ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  value={outItem.tujuan}
                  onChange={(e) =>
                    setOutItem({ ...outItem, tujuan: e.target.value })
                  }
                >
                  {distributionDestinationOptions.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowOutModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-warning fw-bold px-4">
                Proses Keluar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
