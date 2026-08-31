import React from "react";

export default function StatCards({
  totalJenisBarang,
  barangBagusCount,
  barangRusakCount,
  cardBg,
}) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className={`p-3 d-flex align-items-center gap-3 rounded-3 shadow-sm ${cardBg}`}>
          <div
            className="rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              color: "#3b82f6",
            }}
          >
            📦
          </div>
          <div>
            <span className="small opacity-75 d-block">Total Jenis Logistik</span>
            <h4 className="mb-0 fw-bold">
              {totalJenisBarang} <span className="fs-6 fw-normal opacity-75">Item</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className={`p-3 d-flex align-items-center gap-3 rounded-3 shadow-sm ${cardBg}`}>
          <div
            className="rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#10b981",
            }}
          >
            ✅
          </div>
          <div>
            <span className="small opacity-75 d-block">Kondisi Layak (Siap Pakai)</span>
            <h4 className="mb-0 fw-bold text-success">
              {barangBagusCount} <span className="fs-6 fw-normal opacity-75">Item</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className={`p-3 d-flex align-items-center gap-3 rounded-3 shadow-sm ${cardBg}`}>
          <div
            className="rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#ef4444",
            }}
          >
            ❌
          </div>
          <div>
            <span className="small opacity-75 d-block">Barang Rusak / Afkir</span>
            <h4 className="mb-0 fw-bold text-danger">
              {barangRusakCount} <span className="fs-6 fw-normal opacity-75">Item</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
