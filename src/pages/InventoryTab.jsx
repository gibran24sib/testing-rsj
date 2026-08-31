import React from "react";
import { exportInventoryToCSV } from "../utils/exportHelpers";
import { getCategoryBadgeClass, getStockStatus } from "../utils/formatters";

export default function InventoryTab({
  filteredInventory,
  searchQuery,
  setSearchQuery,
  conditionFilter,
  setConditionFilter,
  totalJenisBarang,
  barangBagusCount,
  barangRusakCount,
  handleOpenOutModal,
  handleOpenEdit,
  handleDelete,
  onOpenBarcodeScanner,
  onOpenBufferCalculator,
  onOpenDeliverySlip,
  darkMode,
  tableTheme,
}) {
  return (
    <div className="animate-fade-in">
      {/* 3 METRIK RINGKAS ATAS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div>
              <span className="small opacity-75 d-block">Total Jenis Logistik</span>
              <h4 className="fw-bold mb-0 text-primary">
                {totalJenisBarang} <span className="fs-6 fw-normal opacity-75">Item</span>
              </h4>
            </div>
            <div
              className="p-2 rounded-3 fs-4"
              style={{ backgroundColor: "rgba(99, 102, 241, 0.12)", color: "#6366f1" }}
            >
              📦
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div>
              <span className="small opacity-75 d-block">Kondisi Siap Pakai</span>
              <h4 className="fw-bold mb-0 text-success">
                {barangBagusCount} <span className="fs-6 fw-normal opacity-75">Item</span>
              </h4>
            </div>
            <div
              className="p-2 rounded-3 fs-4"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
            >
              ✅
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between clean-card"
            style={{
              backgroundColor: darkMode ? "#0c101a" : "#ffffff",
              border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
            }}
          >
            <div>
              <span className="small opacity-75 d-block">Barang Rusak / Afkir</span>
              <h4 className="fw-bold mb-0 text-danger">
                {barangRusakCount} <span className="fs-6 fw-normal opacity-75">Item</span>
              </h4>
            </div>
            <div
              className="p-2 rounded-3 fs-4"
              style={{ backgroundColor: "rgba(244, 63, 94, 0.12)", color: "#f43f5e" }}
            >
              ❌
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED TOOLBAR DENGAN FITUR SCANNER & KALKULATOR */}
      <div
        className="p-3 rounded-4 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm"
        style={{
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-success fw-medium d-flex align-items-center gap-1"
            onClick={onOpenBarcodeScanner}
            title="Scan Barcode / QR Code Barang"
          >
            <span>📷</span>
            <span>Scan Barcode</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary fw-medium d-flex align-items-center gap-1"
            onClick={onOpenBufferCalculator}
            title="Kalkulator Kebutuhan & Safety Stock Bangsal"
          >
            <span>🧮</span>
            <span>Kalkulator Buffer Stock</span>
          </button>

          <span className="badge badge-soft-secondary rounded-pill font-monospace ms-2">
            {filteredInventory.length} Item
          </span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <select
            className={`form-select form-select-sm ${
              darkMode ? "bg-dark text-white border-secondary" : ""
            }`}
            style={{ width: "auto" }}
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            <option value="semua">Semua Kondisi</option>
            <option value="Bagus">Kondisi Bagus</option>
            <option value="Rusak">Barang Rusak</option>
          </select>

          <input
            type="text"
            className={`form-control form-control-sm ${
              darkMode ? "bg-dark text-white border-secondary" : ""
            }`}
            placeholder="Cari obat / alkes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: "180px" }}
          />

          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => exportInventoryToCSV(filteredInventory)}
            title="Download CSV"
          >
            <span>📥</span>
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div
        className="table-responsive rounded-4 shadow-sm mb-4"
        style={{
          border: darkMode ? "1px solid #1c2236" : "1px solid #e2e8f0",
          backgroundColor: darkMode ? "#0c101a" : "#ffffff",
        }}
      >
        <table className={`table ${tableTheme} align-middle mb-0`}>
          <thead>
            <tr>
              <th style={{ width: "45px" }}>No</th>
              <th>Kode</th>
              <th>Nama Logistik Medis</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Kondisi</th>
              <th className="text-end pe-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item, index) => {
                const stockStatus = getStockStatus(item.stok);
                return (
                  <tr key={item.id}>
                    <td className="opacity-75">{index + 1}</td>
                    <td>
                      <code>{item.id}</code>
                    </td>
                    <td className="fw-semibold">{item.nama}</td>
                    <td>
                      <span className={`badge ${getCategoryBadgeClass(item.kategori)}`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold font-monospace">
                        {item.stok} {item.satuan}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${stockStatus.badgeClass}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td>
                      {item.kondisi === "Bagus" ? (
                        <span className="badge badge-soft-success">
                          Bagus
                        </span>
                      ) : (
                        <span className="badge badge-soft-danger">
                          Rusak
                        </span>
                      )}
                    </td>
                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-warning text-dark me-1 py-1 px-2 fw-medium"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => handleOpenOutModal(item)}
                        title="Catat Distribusi Keluar"
                      >
                        📤 Keluar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-info me-1 py-1 px-2 fw-medium"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => onOpenDeliverySlip({
                          kode: item.id,
                          nama: item.nama,
                          satuan: item.satuan,
                          jumlah: 10,
                          tujuan: "Bangsal Rawat Inap Jiwa",
                          kondisi: item.kondisi,
                          petugas: "Admin Logistik Medis",
                        })}
                        title="Cetak Surat Bukti Barang Keluar (SBBK)"
                      >
                        🧾 SBBK
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-1 py-1 px-2"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Barang"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger py-1 px-2"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => handleDelete(item.id, item.nama)}
                        title="Hapus Barang"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 opacity-50">
                  Data logistik tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
