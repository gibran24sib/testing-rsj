import React from "react";
import { categoryOptions } from "../data/initialData";

export default function EditModal({
  showEditModal,
  setShowEditModal,
  editingItem,
  setEditingItem,
  handleEditSubmit,
  darkMode,
  cardBg,
}) {
  if (!showEditModal || !editingItem) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content border-0 shadow-lg rounded-3 ${cardBg}`}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              Edit Data Barang ({editingItem.id})
            </h5>
            <button
              type="button"
              className={`btn-close ${darkMode ? "btn-close-white" : ""}`}
              onClick={() => setShowEditModal(false)}
            ></button>
          </div>
          <form onSubmit={handleEditSubmit}>
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
                  value={editingItem.nama}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, nama: e.target.value })
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
                  value={editingItem.kategori}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      kategori: e.target.value,
                    })
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
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    className={`form-control ${
                      darkMode ? "bg-dark text-white border-secondary" : ""
                    }`}
                    required
                    value={editingItem.stok}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        stok: parseInt(e.target.value) || 0,
                      })
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
                    value={editingItem.satuan}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        satuan: e.target.value,
                      })
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
                  value={editingItem.kondisi}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      kondisi: e.target.value,
                    })
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
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
