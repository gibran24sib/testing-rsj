import React, { useState } from "react";

export default function LowStockAlert({ inventory, handleOpenAddModal, darkMode }) {
  const [dismissed, setDismissed] = useState(false);
  const lowStockItems = inventory.filter((item) => item.stok <= 50);

  if (dismissed || lowStockItems.length === 0) return null;

  return (
    <div
      className="p-3 rounded-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 transition-all"
      style={{
        backgroundColor: darkMode ? "rgba(245, 158, 11, 0.08)" : "#fffbeb",
        border: darkMode ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid #fef3c7",
        color: darkMode ? "#fcd34d" : "#92400e",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span className="fs-5">⚠️</span>
        <div>
          <div className="d-flex align-items-center gap-2">
            <strong className="small" style={{ letterSpacing: "-0.2px" }}>
              Perhatian: {lowStockItems.length} Logistik Obat/Alkes Menipis (&le; 50 unit)
            </strong>
          </div>
          <small className="opacity-75 d-block mt-0" style={{ fontSize: "0.75rem" }}>
            {lowStockItems.map((i) => `${i.nama} (${i.stok} ${i.satuan})`).join(" • ")}
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-warning text-dark fw-semibold py-1 px-3"
          style={{ fontSize: "0.78rem" }}
          onClick={handleOpenAddModal}
        >
          + Restock
        </button>
        <button
          type="button"
          className="btn btn-sm btn-link p-1 text-decoration-none opacity-50 hover-opacity-100"
          style={{ color: "inherit", fontSize: "0.9rem" }}
          onClick={() => setDismissed(true)}
          title="Tutup notifikasi"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
