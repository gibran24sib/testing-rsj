import React from "react";
import { categoryOptions } from "../data/initialData";

export default function AddModal({
  showAddModal,
  setShowAddModal,
  newItem,
  setNewItem,
  handleAddSubmit,
  darkMode,
  cardBg,
}) {
  if (!showAddModal) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              Tambah Inventaris / Barang Masuk
            </h5>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={() => setShowAddModal(false)}
            ></button>
          </div>
          <form onSubmit={handleAddSubmit}>
            <div className="modal-body py-3">
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Nama Barang / Obat
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  required
                  value={newItem.nama}
                  onChange={(e) =>
                    setNewItem({ ...newItem, nama: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Kategori Barang
                </label>
                <select
                  className={`form-select ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  value={newItem.kategori}
                  onChange={(e) =>
                    setNewItem({ ...newItem, kategori: e.target.value })
                  }
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold">
                    Jumlah Stok Awal
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      darkMode ? "bg-dark text-white border-secondary" : ""
                    }`}
                    required
                    value={newItem.stok}
                    onChange={(e) =>
                      setNewItem({ ...newItem, stok: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold">
                    Satuan Unit
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      darkMode ? "bg-dark text-white border-secondary" : ""
                    }`}
                    value={newItem.satuan}
                    onChange={(e) =>
                      setNewItem({ ...newItem, satuan: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Kondisi Barang
                </label>
                <select
                  className={`form-select ${
                    darkMode ? "bg-dark text-white border-secondary" : ""
                  }`}
                  value={newItem.kondisi}
                  onChange={(e) =>
                    setNewItem({ ...newItem, kondisi: e.target.value })
                  }
                >
                  <option value="Bagus">✅ Bagus (Siap Pakai)</option>
                  <option value="Rusak">❌ Rusak (Tidak Bisa Dipakai)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-success px-4">
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
